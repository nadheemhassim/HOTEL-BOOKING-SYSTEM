'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import { Staff } from '@/types/staff';
import { socket } from '@/utils/socket';
import PageTransition from '@/components/common/PageTransition';

export default function TeamPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStaff = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff/active`);
      if (!response.ok) throw new Error('Failed to fetch team');
      const data = await response.json();
      setStaff(data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
    
    socket.connect();

    const handleStaffUpdate = (updatedStaff: Staff) => {
      if (updatedStaff.isActive) {
        setStaff(prev => prev.map(member => 
          member._id === updatedStaff._id ? updatedStaff : member
        ));
      } else {
        setStaff(prev => prev.filter(member => member._id !== updatedStaff._id));
      }
    };

    const handleStaffCreate = (newStaff: Staff) => {
      if (newStaff.isActive) {
        setStaff(prev => [newStaff, ...prev]);
      }
    };

    const handleStaffDelete = (staffId: string) => {
      setStaff(prev => prev.filter(member => member._id !== staffId));
    };

    socket.on('staffUpdated', handleStaffUpdate);
    socket.on('staffCreated', handleStaffCreate);
    socket.on('staffDeleted', handleStaffDelete);

    return () => {
      socket.off('staffUpdated', handleStaffUpdate);
      socket.off('staffCreated', handleStaffCreate);
      socket.off('staffDeleted', handleStaffDelete);
      socket.disconnect();
    };
  }, []);

  if (isLoading) {
    return <TeamSkeleton />;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="relative py-24 bg-[#1B4D3E] overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/10" />
          <div className="relative container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Meet Our Team</h1>
              <p className="text-lg text-white/90 max-w-2xl mx-auto">
                Get to know the dedicated professionals who work tirelessly to make your stay 
                at LuxeHaven an unforgettable experience
              </p>
            </div>
          </div>
        </section>

        {/* Team Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {staff.map((member, index) => (
                <motion.div
                  key={member._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl 
                  transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <div className="relative w-full h-full">
                      <Image
                        src={member.image || '/default-avatar.png'}
                        alt={member.name}
                        fill
                        className="object-cover transition-transform duration-700 
                        group-hover:scale-110"
                        sizes="(max-width: 768px) 50vw, 
                               (max-width: 1024px) 33vw,
                               25vw"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 
                    to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Hover Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-4 text-white 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="transform translate-y-4 group-hover:translate-y-0 
                      transition-transform duration-300">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span className="text-sm font-medium truncate">
                              {member.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              {member.phone}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {member.name}
                    </h3>
                    <p className="text-sm text-[#1B4D3E] font-medium mb-2">
                      {member.position}
                    </p>
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs 
                    font-medium bg-[#1B4D3E]/5 text-[#1B4D3E]">
                      {member.department}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}

const TeamSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="h-[300px] bg-gray-200 mb-20" />
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse bg-white rounded-xl overflow-hidden">
            <div className="aspect-[4/5] bg-gray-200" />
            <div className="p-4 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-2/3" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-6 bg-gray-200 rounded-full w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
); 