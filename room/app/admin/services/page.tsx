'use client';

import { useState, useCallback, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { Service } from '@/types/service';
import AdminServiceModal from '@/components/admin/services/AdminServiceModal';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import PageTransition from '@/components/common/PageTransition';
import Toast from '@/components/common/Toast';
import { socket } from '@/utils/socket';

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchServices = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/all`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch services');
      const data = await response.json();
      setServices(data.data);
    } catch (error) {
      console.error('Error:', error);
      setToast({ message: 'Failed to fetch services', type: 'error' });
    }
  }, []);

  useEffect(() => {
    fetchServices();

    socket.on('serviceCreated', fetchServices);
    socket.on('serviceUpdated', fetchServices);
    socket.on('serviceDeleted', fetchServices);

    return () => {
      socket.off('serviceCreated');
      socket.off('serviceUpdated');
      socket.off('serviceDeleted');
    };
  }, [fetchServices]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to delete service');

      setToast({ message: 'Service deleted successfully', type: 'success' });
      setIsDeleteModalOpen(false);
      setSelectedService(null);
    } catch (error) {
      console.error('Error:', error);
      setToast({ message: 'Failed to delete service', type: 'error' });
    }
  };

  return (
    <PageTransition>
      <div className="p-6">
        {/* Header , search section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Services</h1>
            <p className="text-gray-600">Manage hotel services and amenities</p>
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <button
              onClick={() => {
                setSelectedService(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-[#1B4D3E] text-white rounded-lg hover:bg-[#163D37] transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="h-4 w-4" />
              Add Service
            </button>
          </div>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services
            .filter(service => 
              service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              service.description.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {service.title}
                    </h3>
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full
                      ${service.isAvailable 
                        ? 'bg-green-50 text-green-700'
                        : 'bg-gray-50 text-gray-700'
                      }`}
                    >
                      {service.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <div className="flex gap-2 ml-4 flex-shrink-0">
                    <button
                      onClick={() => {
                        setSelectedService(service);
                        setIsModalOpen(true);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit2 className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedService(service);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">
                  {service.description}
                </p>
                <div className="flex items-center justify-between text-sm mt-auto pt-4 border-t border-gray-100">
                  <span className="text-[#1B4D3E] font-medium whitespace-nowrap">
                    ${service.price}
                  </span>
                  <span className="text-gray-500 truncate ml-4">
                    {service.duration}
                  </span>
                </div>
              </div>
            ))}
        </div>

        {/* Modals */}
        <AdminServiceModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedService(null);
          }}
          service={selectedService}
          onSuccess={() => {
            setIsModalOpen(false);
            setSelectedService(null);
            fetchServices();
          }}
        />

        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedService(null);
          }}
          onConfirm={() => selectedService && handleDelete(selectedService._id)}
          title="Delete Service"
          message={`Are you sure you want to delete "${selectedService?.title}"? This action cannot be undone.`}
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