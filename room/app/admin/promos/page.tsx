'use client';

import { useState, useCallback, useEffect } from 'react';
import { Plus, Search, Calendar, Tag, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import AdminPromoModal from '@/components/admin/promos/AdminPromoModal';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import PageTransition from '@/components/common/PageTransition';
import Toast from '@/components/common/Toast';
import PromoCardSkeleton from '@/components/admin/promos/PromoCardSkeleton';

interface Promo {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  perks: string[];
  discount: string;
  validUntil: string;
  image: string;
  code: string;
  featured: boolean;
  isActive: boolean;
}

interface AdminPromo extends Promo {
  createdAt: string;
  updatedAt: string;
}

export default function AdminPromosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<AdminPromo | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [promos, setPromos] = useState<AdminPromo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPromos = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/promos/all`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch promos');
      const data = await response.json();
      setPromos(data.data);
    } catch (error) {
      console.error('Error:', error);
      setToast({
        message: 'Failed to fetch promotions',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPromos();
  }, [fetchPromos]);

  const handleAddPromo = () => {
    setSelectedPromo(null);
    setIsModalOpen(true);
  };

  const handleEditPromo = (promo: AdminPromo) => {
    setSelectedPromo(promo);
    setIsModalOpen(true);
  };

  const handleDeletePromo = async (promoId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/promos/${promoId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to delete promo');
      
      setPromos(prev => prev.filter(promo => promo._id !== promoId));
      setToast({
        message: 'Promotion deleted successfully',
        type: 'success'
      });
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error:', error);
      setToast({
        message: 'Failed to delete promotion',
        type: 'error'
      });
    }
  };

  const handleSuccess = () => {
    fetchPromos();
    setToast({
      message: 'Promotion updated successfully!',
      type: 'success'
    });
  };

  if (isLoading) {
    return (
      <div className="flex-grow container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <PromoCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-4rem)] flex flex-col">
        {/* Header Section */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Special Offers</h1>
              <button
                onClick={handleAddPromo}
                className="flex items-center justify-center px-4 py-2 bg-[#1B4D3E] text-white rounded-lg 
                hover:bg-[#163D37] transition-colors gap-2 sm:w-auto w-full"
              >
                <Plus className="h-5 w-5" />
                Add Promotion
              </button>
            </div>

            {/* Search Bar */}
            <div className="mt-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search promotions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
                  focus:ring-[#1B4D3E] focus:border-[#1B4D3E]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-grow container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {promos.map((promo) => (
              <motion.div
                key={promo._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-48 sm:h-56">
                  <Image
                    src={promo.image}
                    alt={promo.title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/room-placeholder.png';
                    }}
                  />
                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                      onClick={() => handleEditPromo(promo)}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-[#1B4D3E] hover:text-white transition-colors"
                      title="Edit promotion"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPromo(promo);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-red-500 hover:text-white transition-colors"
                      title="Delete promotion"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {/* Status Badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {promo.isActive ? (
                      <span className="px-2.5 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                        Active
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-800 text-sm font-semibold rounded-full">
                        Inactive
                      </span>
                    )}
                    {promo.featured && (
                      <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full">
                        Featured
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {promo.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {promo.description}
                  </p>

                  {/* Perks */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {promo.perks.slice(0, 3).map((perk, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md"
                      >
                        {perk}
                      </span>
                    ))}
                    {promo.perks.length > 3 && (
                      <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md">
                        +{promo.perks.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      <span>Valid until {new Date(promo.validUntil).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Tag className="h-4 w-4" />
                      <span className="font-medium">{promo.code}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AdminPromoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        promo={selectedPromo}
        onSuccess={handleSuccess}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => selectedPromo && handleDeletePromo(selectedPromo._id)}
        title="Delete Promotion"
        message={`Are you sure you want to delete "${selectedPromo?.title}"? This action cannot be undone.`}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </PageTransition>
  );
} 