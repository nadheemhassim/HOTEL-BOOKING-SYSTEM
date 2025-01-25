'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Plus, Search, Mail, Phone, Calendar, Users, Building2 } from 'lucide-react';
import { Staff, StaffDepartment } from '@/types/staff';
import { useLoading } from '@/contexts/LoadingContext';
import dynamic from 'next/dynamic';

const AdminStaffModal = dynamic(() => import('@/components/admin/staff/AdminStaffModal'), {
  ssr: false
});
const DeleteConfirmModal = dynamic(() => import('@/components/admin/DeleteConfirmModal'), {
  ssr: false
});

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const { setIsLoading } = useLoading();

  const fetchStaff = useCallback(async () => {
    const controller = new AbortController();
    
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff`, {
        credentials: 'include',
        signal: controller.signal
      });
      
      if (!response.ok) throw new Error('Failed to fetch staff');
      const data = await response.json();
      setStaff(data.data);
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Error:', error);
      }
    } finally {
      setIsLoading(false);
    }

    return () => {
      controller.abort();
    };
  }, [setIsLoading]);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    (async () => {
      cleanup = await fetchStaff();
    })();

    return () => {
      cleanup?.();
    };
  }, [fetchStaff]);

  const filteredStaff = staff.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.position.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = 
      selectedDepartment === 'all' || 
      member.department === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  const departmentCounts = staff.reduce((acc, member) => {
    acc[member.department] = (acc[member.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-3 bg-blue-50 rounded-lg">
              <Users className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Total Staff</p>
              <h3 className="text-lg md:text-xl font-bold text-gray-900">{staff.length}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-3 bg-green-50 rounded-lg">
              <Building2 className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Departments</p>
              <h3 className="text-lg md:text-xl font-bold text-gray-900">
                {Object.keys(departmentCounts).length}
              </h3>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 
              focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20 focus:border-[#1B4D3E]"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>

          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-200 
            focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20 focus:border-[#1B4D3E]"
          >
            <option value="all">All Departments</option>
            {Object.values(StaffDepartment).map(dept => (
              <option key={dept} value={dept}>
                {dept.charAt(0).toUpperCase() + dept.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => {
            setSelectedStaff(null);
            setIsModalOpen(true);
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 
          bg-[#1B4D3E] text-white rounded-lg hover:bg-[#163D37] transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Staff</span>
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredStaff.map((member, index) => (
          <motion.div
            key={member._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden 
            hover:shadow-md transition-shadow"
          >
            <div className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 md:h-16 md:w-16 flex-shrink-0">
                  <Image
                    src={member.image || '/default-avatar.png'}
                    alt={member.name}
                    fill
                    className="rounded-full object-cover"
                    sizes="(max-width: 768px) 56px, 64px"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{member.name}</h3>
                  <p className="text-sm text-[#1B4D3E] truncate">{member.position}</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs 
                  font-medium bg-gray-100 text-gray-800 mt-1">
                    {member.department}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{member.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">
                    Joined {new Date(member.joinDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setSelectedStaff(member);
                    setIsModalOpen(true);
                  }}
                  className="px-3 py-1.5 text-sm text-[#1B4D3E] hover:bg-[#1B4D3E]/5 
                  rounded transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setSelectedStaff(member);
                    setIsDeleteModalOpen(true);
                  }}
                  className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 
                  rounded transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modals */}
      <AdminStaffModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStaff(null);
        }}
        staff={selectedStaff}
        onSuccess={() => {
          setIsModalOpen(false);
          setSelectedStaff(null);
          fetchStaff();
        }}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedStaff(null);
        }}
        onConfirm={async () => {
          if (!selectedStaff) return;
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/staff/${selectedStaff._id}`,
              {
                method: 'DELETE',
                credentials: 'include'
              }
            );
            if (!response.ok) throw new Error('Failed to delete staff');
            fetchStaff();
          } catch (error) {
            console.error('Error:', error);
          }
          setIsDeleteModalOpen(false);
          setSelectedStaff(null);
        }}
        title="Delete Staff Member"
        message={`Are you sure you want to delete ${selectedStaff?.name}? This action cannot be undone.`}
      />
    </div>
  );
} 