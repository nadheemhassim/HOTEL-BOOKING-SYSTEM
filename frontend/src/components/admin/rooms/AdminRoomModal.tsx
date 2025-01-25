'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, Plus } from 'lucide-react';
import { Room, RoomType, RoomStatus, RoomFormData } from '@/types/room';
import Toast from '@/components/common/Toast';
import { useNotifications } from '@/contexts/NotificationContext';

interface AdminRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  room?: Room;
  onSuccess: () => void;
}

interface FormErrors {
  name?: string;
  roomNumber?: string;
  price?: string;
  capacity?: string;
  description?: string;
  amenities?: string;
  images?: string;
}

const initialFormData: RoomFormData = {
  name: '',
  description: '',
  price: 0,
  capacity: 1,
  amenities: [],
  images: [''],
  roomNumber: '',
  roomType: RoomType.STANDARD,
  status: RoomStatus.AVAILABLE,
  isAvailable: true,
  lastCleaned: new Date().toISOString().split('T')[0]
};

const AMENITIES = [
  'WiFi',
  'TV',
  'AC',
  'Coffee Maker',
  'Bathroom',
  'Mini Bar',
  'Room Service',
  'Parking',
  'Kitchen',
  'Balcony',
  'Ocean View',
  'City View'
];

export default function AdminRoomModal({
  isOpen,
  onClose,
  room,
  onSuccess
}: AdminRoomModalProps) {
  const [formData, setFormData] = useState<RoomFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (room) {
      setFormData({
        name: room.name,
        description: room.description,
        price: room.price,
        capacity: room.capacity,
        amenities: room.amenities,
        images: room.images,
        roomNumber: room.roomNumber,
        roomType: room.roomType,
        status: room.status,
        isAvailable: room.isAvailable,
        lastCleaned: new Date(room.lastCleaned).toISOString().split('T')[0]
      });
    }
  }, [room]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Room name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Room name must be at least 3 characters';
    }

    if (!formData.roomNumber.trim()) {
      newErrors.roomNumber = 'Room number is required';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (formData.capacity <= 0) {
      newErrors.capacity = 'Capacity must be greater than 0';
    }

    if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (formData.amenities.length === 0) {
      newErrors.amenities = 'Select at least one amenity';
    }

    if (formData.images.some(url => !url.trim())) {
      newErrors.images = 'All image URLs must be valid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const url = room
        ? `${process.env.NEXT_PUBLIC_API_URL}/rooms/${room._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/rooms`;

      const response = await fetch(url, {
        method: room ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save room');

      const data = await response.json();
      
      addNotification({
        title: room ? 'Room Updated' : 'Room Added',
        message: data.message || `Room ${room ? 'updated' : 'added'} successfully`,
        type: 'room'
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      addNotification({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to save room',
        type: 'system'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={handleClose} />
        <div className="relative w-full max-w-4xl rounded-xl bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {room ? 'Edit Room' : 'Add New Room'}
            </h2>
            <button
              onClick={handleClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid gap-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Room Name
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: '' });
                    }}
                    className={`mt-1 block w-full rounded-lg border ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    } p-2.5 focus:border-[#1B4D3E] focus:ring-1 focus:ring-[#1B4D3E]`}
                    placeholder="Enter room name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Room Number
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.roomNumber}
                    onChange={(e) => {
                      setFormData({ ...formData, roomNumber: e.target.value });
                      if (errors.roomNumber) setErrors({ ...errors, roomNumber: '' });
                    }}
                    className={`mt-1 block w-full rounded-lg border ${
                      errors.roomNumber ? 'border-red-500' : 'border-gray-300'
                    } p-2.5 focus:border-[#1B4D3E] focus:ring-1 focus:ring-[#1B4D3E]`}
                    placeholder="Enter room number"
                  />
                  {errors.roomNumber && (
                    <p className="mt-1 text-sm text-red-500">{errors.roomNumber}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price per Night ($)
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Capacity
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5"
                    min="1"
                  />
                </div>
              </div>

              {/* Room Type and Status */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Room Type
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.roomType}
                    onChange={(e) => setFormData({ ...formData, roomType: e.target.value as RoomType })}
                    className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5"
                  >
                    <option value={RoomType.STANDARD}>Standard</option>
                    <option value={RoomType.PREMIUM}>Premium</option>
                    <option value={RoomType.SUITE}>Suite</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as RoomStatus })}
                    className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5"
                  >
                    <option value={RoomStatus.AVAILABLE}>Available</option>
                    <option value={RoomStatus.BOOKED}>Booked</option>
                    <option value={RoomStatus.MAINTENANCE}>Maintenance</option>
                    <option value={RoomStatus.CLEANING}>Cleaning</option>
                    <option value={RoomStatus.RESERVED}>Reserved</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    if (errors.description) setErrors({ ...errors, description: '' });
                  }}
                  rows={4}
                  className={`mt-1 block w-full rounded-lg border ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  } p-2.5`}
                  placeholder="Enter room description"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                )}
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Amenities
                  <span className="text-red-500">*</span>
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {AMENITIES.map((amenity) => (
                    <label
                      key={amenity}
                      className={`flex cursor-pointer items-center rounded-lg border p-3 ${
                        formData.amenities.includes(amenity)
                          ? 'border-[#1B4D3E] bg-[#1B4D3E]/5'
                          : 'border-gray-200 hover:border-[#1B4D3E]/30'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={(e) => {
                          const newAmenities = e.target.checked
                            ? [...formData.amenities, amenity]
                            : formData.amenities.filter((a) => a !== amenity);
                          setFormData({ ...formData, amenities: newAmenities });
                          if (errors.amenities) setErrors({ ...errors, amenities: '' });
                        }}
                        className="sr-only"
                      />
                      <span
                        className={`text-sm ${
                          formData.amenities.includes(amenity)
                            ? 'text-[#1B4D3E]'
                            : 'text-gray-600'
                        }`}
                      >
                        {amenity}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.amenities && (
                  <p className="mt-1 text-sm text-red-500">{errors.amenities}</p>
                )}
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Images
                  <span className="text-red-500">*</span>
                </label>
                <div className="mt-2 space-y-3">
                  {formData.images.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => {
                          const newImages = [...formData.images];
                          newImages[index] = e.target.value;
                          setFormData({ ...formData, images: newImages });
                          if (errors.images) setErrors({ ...errors, images: '' });
                        }}
                        placeholder="Enter image URL"
                        className="flex-1 rounded-lg border border-gray-300 p-2.5"
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = formData.images.filter((_, i) => i !== index);
                            setFormData({ ...formData, images: newImages });
                          }}
                          className="rounded-lg border border-gray-300 p-2.5 text-gray-500 hover:bg-gray-50"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, images: [...formData.images, ''] })}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 p-3 text-sm text-gray-600 hover:border-[#1B4D3E] hover:text-[#1B4D3E]"
                  >
                    <Plus className="h-4 w-4" />
                    Add Another Image
                  </button>
                </div>
                {errors.images && (
                  <p className="mt-1 text-sm text-red-500">{errors.images}</p>
                )}
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="rounded border-gray-300 text-[#1B4D3E] focus:ring-[#1B4D3E]"
                  />
                  <span className="text-sm text-gray-700">Available for Booking</span>
                </label>

                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-700">Last Cleaned:</label>
                  <input
                    type="date"
                    value={formData.lastCleaned}
                    onChange={(e) => setFormData({ ...formData, lastCleaned: e.target.value })}
                    className="rounded-lg border border-gray-300 p-2 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-lg bg-[#1B4D3E] px-6 py-2 text-white hover:bg-[#163D37] disabled:bg-gray-400"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Room'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}