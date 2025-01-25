'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';
import { Promo, PromoFormData } from '@/types/promo';
import Toast from '@/components/common/Toast';

interface AdminPromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  promo?: Promo | null;
  onSuccess: () => void;
}

const initialFormData: PromoFormData = {
  title: '',
  subtitle: '',
  description: '',
  perks: [''],
  discount: '',
  validUntil: '',
  image: '',
  code: '',
  featured: false,
  isActive: true
};

interface FormErrors {
  title?: string;
  subtitle?: string;
  description?: string;
  perks?: string;
  discount?: string;
  validUntil?: string;
  image?: string;
  code?: string;
}

export default function AdminPromoModal({ isOpen, onClose, promo, onSuccess }: AdminPromoModalProps) {
  const [formData, setFormData] = useState<PromoFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (promo) {
      setFormData({
        title: promo.title,
        subtitle: promo.subtitle,
        description: promo.description,
        perks: promo.perks,
        discount: promo.discount,
        validUntil: new Date(promo.validUntil).toISOString().split('T')[0],
        image: promo.image,
        code: promo.code,
        featured: promo.featured,
        isActive: promo.isActive
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [promo]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.subtitle.trim()) {
      newErrors.subtitle = 'Subtitle is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (formData.perks.length === 0) {
      newErrors.perks = 'At least one perk is required';
    } else if (formData.perks.some(perk => !perk.trim())) {
      newErrors.perks = 'All perks must be filled';
    }

    if (!formData.discount.trim()) {
      newErrors.discount = 'Discount is required';
    } else if (!/^\d+%?$/.test(formData.discount)) {
      newErrors.discount = 'Invalid discount format (e.g., &quot;20&quot; or &quot;20%&quot;)';
    }

    if (!formData.validUntil) {
      newErrors.validUntil = 'Valid until date is required';
    } else if (new Date(formData.validUntil) < new Date()) {
      newErrors.validUntil = 'Date must be in the future';
    }

    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required';
    } else if (!formData.image.match(/^https?:\/\/.+/)) {
      newErrors.image = 'Must be a valid URL starting with http:// or https://';
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Promo code is required';
    } else if (!/^[A-Z0-9]{4,10}$/.test(formData.code)) {
      newErrors.code = 'Code must be 4-10 characters (letters and numbers only)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const url = promo
        ? `${process.env.NEXT_PUBLIC_API_URL}/promos/${promo._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/promos`;

      const response = await fetch(url, {
        method: promo ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save promotion');
      }

      setToast({
        message: `Promotion ${promo ? 'updated' : 'created'} successfully!`,
        type: 'success'
      });
      onSuccess();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error:', error);
      setToast({
        message: error instanceof Error ? error.message : 'Failed to save promotion',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialFormData);
    
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-xl">
          <form onSubmit={handleSubmit}>
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white border-b rounded-t-xl">
              <h2 className="text-xl font-semibold text-gray-900">
                {promo ? 'Edit Promotion' : 'Add New Promotion'}
              </h2>
              <button 
                type="button"
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[calc(100vh-16rem)] overflow-y-auto p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={`w-full p-2 border ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-[#1B4D3E]`}
                    placeholder="e.g., Early Bird Special"
                    required
                  />
                  {errors.title ? (
                    <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                  ) : (
                    <p className="mt-1 text-sm text-gray-500">
                      Enter a clear and concise title for the promotion
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subtitle
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className={`w-full p-2 border ${
                      errors.subtitle ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-[#1B4D3E]`}
                    placeholder="e.g., 20% off on weekdays"
                    required
                  />
                  {errors.subtitle ? (
                    <p className="mt-1 text-sm text-red-500">{errors.subtitle}</p>
                  ) : (
                    <p className="mt-1 text-sm text-gray-500">
                      Enter a clear and concise subtitle for the promotion
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={`w-full p-2 border ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-[#1B4D3E]`}
                    rows={3}
                    placeholder="e.g., 20% off on weekdays"
                    required
                  />
                  {errors.description ? (
                    <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                  ) : (
                    <p className="mt-1 text-sm text-gray-500">
                      Enter a clear and concise description for the promotion
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Perks
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  {formData.perks.map((perk, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={perk}
                        onChange={(e) => {
                          const newPerks = [...formData.perks];
                          newPerks[index] = e.target.value;
                          setFormData({ ...formData, perks: newPerks });
                        }}
                        className={`flex-1 p-2 border ${
                          errors.perks ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-[#1B4D3E]`}
                        placeholder="Add a perk"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newPerks = formData.perks.filter((_, i) => i !== index);
                          setFormData({ ...formData, perks: newPerks });
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, perks: [...formData.perks, ''] })}
                    className="flex items-center text-sm text-[#1B4D3E] hover:text-[#163D37]"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Perk
                  </button>
                  {errors.perks ? (
                    <p className="mt-1 text-sm text-red-500">{errors.perks}</p>
                  ) : (
                    <p className="mt-1 text-sm text-gray-500">
                      Enter at least one perk for the promotion
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                      className={`w-full p-2 border ${
                        errors.discount ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-[#1B4D3E]`}
                      placeholder="e.g., 20%"
                      required
                    />
                    {errors.discount ? (
                      <p className="mt-1 text-sm text-red-500">{errors.discount}</p>
                    ) : (
                      <p className="mt-1 text-sm text-gray-500">
                        Enter a valid discount format (e.g., &quot;20&quot; or &quot;20%&quot;)
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valid Until
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.validUntil}
                      onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                      className={`w-full p-2 border ${
                        errors.validUntil ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-[#1B4D3E]`}
                      placeholder="e.g., 2024-03-31"
                      required
                    />
                    {errors.validUntil ? (
                      <p className="mt-1 text-sm text-red-500">{errors.validUntil}</p>
                    ) : (
                      <p className="mt-1 text-sm text-gray-500">
                        Enter a valid date in the future
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className={`w-full p-2 border ${
                      errors.image ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-[#1B4D3E]`}
                    placeholder="e.g., https://example.com/image.jpg"
                    required
                  />
                  {errors.image ? (
                    <p className="mt-1 text-sm text-red-500">{errors.image}</p>
                  ) : (
                    <p className="mt-1 text-sm text-gray-500">
                      Enter a valid image URL starting with http:// or https://
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Promo Code
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className={`w-full p-2 border ${
                      errors.code ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-[#1B4D3E]`}
                    placeholder="e.g., EARLYBIRD"
                    required
                  />
                  {errors.code ? (
                    <p className="mt-1 text-sm text-red-500">{errors.code}</p>
                  ) : (
                    <p className="mt-1 text-sm text-gray-500">
                      Enter a valid promo code (4-10 characters, letters and numbers only)
                    </p>
                  )}
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded text-[#1B4D3E] focus:ring-[#1B4D3E]"
                    />
                    <span className="ml-2 text-sm text-gray-700">Featured Promotion</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded text-[#1B4D3E] focus:ring-[#1B4D3E]"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 z-10 bg-white border-t p-6 rounded-b-xl">
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-[#1B4D3E] text-white rounded-lg hover:bg-[#163D37] 
                  disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4" />
                      Saving...
                    </>
                  ) : (
                    'Save Promotion'
                  )}
                </button>
              </div>
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