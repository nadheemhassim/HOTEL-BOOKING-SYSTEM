'use client';

import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Service, ServiceFormData } from '@/types/service';
import Toast from '@/components/common/Toast';

interface AdminServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: Service | null;
  onSuccess: () => void;
}

type ServiceCategory = 'spa' | 'dining' | 'activities' | 'transport' | 'housekeeping' | 'concierge';

const initialFormData: ServiceFormData = {
  title: '',
  description: '',
  icon: 'bed',
  price: 0,
  duration: '',
  isAvailable: true,
  category: 'spa'
};

export default function AdminServiceModal({
  isOpen,
  onClose,
  service,
  onSuccess
}: AdminServiceModalProps) {
  const [formData, setFormData] = useState<ServiceFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleCategoryChange = (category: ServiceCategory) => {
    const iconMap: Record<ServiceCategory, string> = {
      'spa': 'bed',
      'dining': 'utensils',
      'activities': 'activity',
      'transport': 'car',
      'housekeeping': 'home',
      'concierge': 'headphones'
    };

    setFormData({
      ...formData,
      category,
      icon: iconMap[category]
    });
  };

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title,
        description: service.description,
        icon: service.icon,
        price: service.price,
        duration: service.duration,
        isAvailable: service.isAvailable,
        category: service.category
      });
    } else {
      setFormData(initialFormData);
    }
  }, [service]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = service
        ? `${process.env.NEXT_PUBLIC_API_URL}/services/${service._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/services`;

      const response = await fetch(url, {
        method: service ? 'PUT' : 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save service');
      }

      setToast({ 
        message: `Service ${service ? 'updated' : 'created'} successfully`, 
        type: 'success' 
      });
      onSuccess();
    } catch (error: unknown) {
      console.error('Error:', error);
      setToast({ 
        message: error instanceof Error ? error.message : 'Failed to save service', 
        type: 'error' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {service ? 'Edit Service' : 'Add New Service'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20"
                  required
                  placeholder="e.g., 1 hour"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleCategoryChange(e.target.value as ServiceCategory)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20"
                required
              >
                <option value="spa">Spa</option>
                <option value="dining">Dining</option>
                <option value="activities">Activities</option>
                <option value="transport">Transport</option>
                <option value="housekeeping">Housekeeping</option>
                <option value="concierge">Concierge</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isAvailable"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                className="h-4 w-4 text-[#1B4D3E] focus:ring-[#1B4D3E]"
              />
              <label htmlFor="isAvailable" className="ml-2 text-sm text-gray-700">
                Available
              </label>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#1B4D3E] text-white rounded-lg hover:bg-[#163D37] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4" />
                    Saving...
                  </>
                ) : (
                  'Save Service'
                )}
              </button>
            </div>
          </form>

          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
} 