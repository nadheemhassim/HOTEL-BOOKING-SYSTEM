'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Check, Trash2, User } from 'lucide-react';
import Image from 'next/image';
import PageTransition from '@/components/common/PageTransition';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import Toast from '@/components/common/Toast';
import { socket } from '@/utils/socket';

interface Testimonial {
  _id: string;
  userId: string;
  userName: string;
  userImage?: string;
  rating: number;
  review: string;
  isApproved: boolean;
  createdAt: string;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchTestimonials = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/testimonials/all`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch testimonials');
      const data = await response.json();
      setTestimonials(data.data);
    } catch (error) {
      console.error('Error:', error);
      setToast({
        message: 'Failed to fetch testimonials',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();

    socket.connect();

    socket.on('testimonialDeleted', (deletedId: string) => {
      setTestimonials(prev => prev.filter(t => t._id !== deletedId));
    });

    socket.on('testimonialUpdated', (updatedTestimonial: Testimonial) => {
      setTestimonials(prev => 
        prev.map(t => t._id === updatedTestimonial._id ? updatedTestimonial : t)
      );
    });

    socket.on('testimonialCreated', (newTestimonial: Testimonial) => {
      setTestimonials(prev => [...prev, newTestimonial]);
    });

    return () => {
      socket.off('testimonialDeleted');
      socket.off('testimonialUpdated');
      socket.off('testimonialCreated');
      socket.disconnect();
    };
  }, [fetchTestimonials]);

  const handleApprove = async (testimonialId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/testimonials/${testimonialId}/approve`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        }
      );

      if (!response.ok) throw new Error('Failed to approve testimonial');

      setToast({
        message: 'Testimonial approved successfully',
        type: 'success'
      });
    } catch (error) {
      console.error('Error:', error);
      setToast({
        message: 'Failed to approve testimonial',
        type: 'error'
      });
    }
  };

  const handleDelete = async (testimonialId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/testimonials/${testimonialId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete testimonial');
      }

      setIsDeleteModalOpen(false);
      setSelectedTestimonial(null);

      setToast({
        message: 'Testimonial deleted successfully',
        type: 'success'
      });
    } catch (error) {
      console.error('Error:', error);
      setToast({
        message: 'Failed to delete testimonial',
        type: 'error'
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Manage Testimonials</h1>

        <div className="grid gap-6">
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 ring-2 ring-[#1B4D3E]/5">
                    {testimonial.userImage ? (
                      <Image
                        src={testimonial.userImage}
                        alt={testimonial.userName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#1B4D3E]/5">
                        <User className="h-6 w-6 text-[#1B4D3E]" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{testimonial.userName}</h3>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < testimonial.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!testimonial.isApproved && (
                    <button
                      onClick={() => handleApprove(testimonial._id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                      title="Approve"
                    >
                      <Check className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedTestimonial(testimonial);
                      setIsDeleteModalOpen(true);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <p className="mt-4 text-gray-600">{testimonial.review}</p>

              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <span>
                  {new Date(testimonial.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  testimonial.isApproved
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {testimonial.isApproved ? 'Approved' : 'Pending'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedTestimonial(null);
          }}
          onConfirm={() => selectedTestimonial && handleDelete(selectedTestimonial._id)}
          title="Delete Testimonial"
          message="Are you sure you want to delete this testimonial? This action cannot be undone."
        />

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </PageTransition>
  );
}