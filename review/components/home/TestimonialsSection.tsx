'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, User, Edit2, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import AddTestimonialModal from '@/components/testimonials/AddTestimonialModal';
import Toast from '@/components/common/Toast';
import EditTestimonialModal from '@/components/testimonials/EditTestimonialModal';
import { socket } from '@/utils/socket';

interface Testimonial {
  _id: string;
  userId: string;
  userName: string;
  userImage?: string;
  rating: number;
  review: string;
  createdAt: string;
  isApproved: boolean;
}

interface UserWithId {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UserWithMongoId {
  _id: string;
  name: string;
  email: string;
  role: string;
}

type UserType = UserWithId | UserWithMongoId;

export default function TestimonialsSection() {
  const { user } = useAuth();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  const fetchTestimonials = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/testimonials`);
      if (!response.ok) {
        console.log('No testimonials found');
        setTestimonials([]);
        return;
      }
      const data = await response.json();
      setTestimonials(data.data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setTestimonials([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    socket.connect();

    socket.on('testimonialCreated', (newTestimonial: Testimonial) => {
      if (newTestimonial.isApproved) {
        setTestimonials(prev => [...prev, {
          ...newTestimonial,
          userId: newTestimonial.userId
        }]);
      }
    });

    socket.on('testimonialUpdated', (updatedTestimonial: Testimonial) => {
      setTestimonials(prev => {
        if (updatedTestimonial.isApproved) {
          const exists = prev.some(t => t._id === updatedTestimonial._id);
          if (!exists) {
            return [...prev, {
              ...updatedTestimonial,
              userId: updatedTestimonial.userId
            }];
          }
        }
        
        return prev.map(t => 
          t._id === updatedTestimonial._id 
            ? { ...updatedTestimonial, userId: updatedTestimonial.userId }
            : t
        ).filter(t => t.isApproved);
      });
    });

    socket.on('testimonialDeleted', (deletedId: string) => {
      setTestimonials(prev => prev.filter(t => t._id !== deletedId));
    });

    return () => {
      socket.off('testimonialCreated');
      socket.off('testimonialUpdated');
      socket.off('testimonialDeleted');
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const handleDelete = async (testimonialId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/testimonials/${testimonialId}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      setToast({
        message: 'Review deleted successfully',
        type: 'success'
      });
    } catch (error) {
      console.error('Error:', error);
      setToast({
        message: 'Failed to delete review',
        type: 'error'
      });
    }
  };

  const checkUserOwnership = (testimonialUserId: string) => {
    if (!user) return false;
    
    const hasMongoId = (user: UserType): user is UserWithMongoId => '_id' in user;
    const hasId = (user: UserType): user is UserWithId => 'id' in user;
    
    if (hasMongoId(user)) {
      return user._id === testimonialUserId;
    }
    
    if (hasId(user)) {
      return user.id === testimonialUserId;
    }
    
    return false;
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="space-y-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    <div className="h-3 w-24 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded" />
                  <div className="h-4 w-2/3 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 mb-4 text-xs font-semibold tracking-wider 
            text-[#1B4D3E] uppercase bg-[#1B4D3E]/5 rounded-full">
            <MessageSquare className="h-3.5 w-3.5" />
            Guest Reviews
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            What Our Guests Say
          </h2>
          <p className="text-base text-gray-600 mb-8">
            Real experiences shared by our valued guests
          </p>
          {user && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B4D3E] text-white text-sm rounded-lg 
              hover:bg-[#163D37] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              <Star className="h-4 w-4" />
              Share Your Experience
            </button>
          )}
        </motion.div>

        {testimonials.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300
                  relative overflow-hidden border border-gray-100/50"
              >
                <div className="absolute top-4 right-4 text-[#1B4D3E]/5">
                  <svg
                    className="w-8 h-8 transform group-hover:scale-110 transition-transform duration-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
                  </svg>
                </div>

                <div className="flex items-center gap-0.5 mb-4">
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

                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 italic">
                  &ldquo;{testimonial.review}&rdquo;
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 ring-2 ring-[#1B4D3E]/5">
                    {testimonial.userImage ? (
                      <Image
                        src={testimonial.userImage}
                        alt={testimonial.userName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#1B4D3E]/5">
                        <User className="h-5 w-5 text-[#1B4D3E]" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {testimonial.userName}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {new Date(testimonial.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#1B4D3E]/5 to-transparent -z-10 opacity-0 
                  group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#1B4D3E]/5 to-transparent -z-10 opacity-0 
                  group-hover:opacity-100 transition-opacity duration-300" />

                {checkUserOwnership(testimonial.userId) && (
                  <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                    <button
                      onClick={() => {
                        setSelectedTestimonial(testimonial);
                        setEditModalOpen(true);
                      }}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-[#1B4D3E] hover:text-white 
                        transition-colors shadow-sm"
                      title="Edit review"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial._id)}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-red-500 hover:text-white 
                        transition-colors shadow-sm"
                      title="Delete review"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No reviews yet. Be the first one to share your experience!</p>
        )}
      </div>

      <AddTestimonialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchTestimonials();
          setToast({
            message: 'Thank you for your review! It will be visible after approval.',
            type: 'success'
          });
        }}
      />

      {selectedTestimonial && (
        <EditTestimonialModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedTestimonial(null);
          }}
          onSuccess={fetchTestimonials}
          testimonial={selectedTestimonial}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </section>
  );
}
