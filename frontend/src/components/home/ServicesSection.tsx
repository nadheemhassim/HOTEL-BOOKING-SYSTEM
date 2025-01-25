'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Bed, 
  Utensils, 
  Activity, 
  Car, 
  Home as HomeIcon,
  Headphones,
  Star
} from 'lucide-react';
import { Service } from '@/types/service';
import { socket } from '@/utils/socket';

const categoryIcons = {
  'spa': Bed,
  'dining': Utensils,
  'activities': Activity,
  'transport': Car,
  'housekeeping': HomeIcon,
  'concierge': Headphones
};

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchServices = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`);
      if (!response.ok) throw new Error('Failed to fetch services');
      const data = await response.json();
      setServices(data.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();

    socket.on('serviceCreated', () => fetchServices());
    socket.on('serviceUpdated', () => fetchServices());
    socket.on('serviceDeleted', () => fetchServices());

    return () => {
      socket.off('serviceCreated');
      socket.off('serviceUpdated');
      socket.off('serviceDeleted');
    };
  }, [fetchServices]);

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#1B4D3E]/5 rounded-full -translate-x-32 -translate-y-32 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#1B4D3E]/5 rounded-full translate-x-32 translate-y-32 blur-3xl" />

      <div className="container mx-auto px-4 relative">
        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 text-sm font-semibold tracking-wider text-[#1B4D3E] uppercase bg-[#1B4D3E]/5 rounded-full">
              <Star className="h-4 w-4" />
              Luxury Services
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Elevate Your Stay
            </h2>
            <div className="w-20 h-1 bg-[#1B4D3E] mx-auto mb-6 rounded-full" />
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover our curated collection of premium services designed to transform your stay into an extraordinary experience
            </p>
          </motion.div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            [...Array(6)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl p-6 shadow-xl"
              >
                <div className="animate-pulse">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-full mb-4" />
                      <div className="flex justify-between">
                        <div className="h-4 bg-gray-200 rounded w-1/4" />
                        <div className="h-4 bg-gray-200 rounded w-1/4" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            services.map((service, index) => {
              const Icon = categoryIcons[service.category];
              
              return (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-xl hover:shadow-md transition-all duration-300 group relative overflow-hidden flex flex-col h-full"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#1B4D3E]/5 rounded-bl-[100px] -z-10 transition-all duration-300 group-hover:bg-[#1B4D3E]/10" />
                  
                  <div className="flex gap-4 h-full">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-[#1B4D3E]/10 flex items-center justify-center transition-all duration-300 group-hover:bg-[#1B4D3E]/20">
                        {Icon && <Icon className="h-6 w-6 text-[#1B4D3E]" />}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#1B4D3E] transition-colors duration-300 truncate">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">
                        {service.description}
                      </p>
                      <div className="flex items-center justify-between text-sm mt-auto">
                        <span className="text-[#1B4D3E] font-medium whitespace-nowrap">
                          ${service.price}
                        </span>
                        <span className="text-gray-500 truncate ml-4">
                          {service.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}