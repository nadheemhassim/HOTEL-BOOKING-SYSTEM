'use client';

import { motion } from 'framer-motion';
import { Shield, Clock, Wifi, Coffee, Bath, Sparkles, CheckCircle } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Secure Booking',
    description: 'Safe and encrypted transactions'
  },
  {
    icon: Clock,
    title: '24/7 Service',
    description: 'Round-the-clock support'
  },
  {
    icon: Wifi,
    title: 'High-Speed WiFi',
    description: 'Complimentary internet'
  },
  {
    icon: Coffee,
    title: 'Fine Dining',
    description: 'Gourmet experience'
  },
  {
    icon: Bath,
    title: 'Luxury Amenities',
    description: 'Premium facilities'
  },
  {
    icon: Sparkles,
    title: 'Daily Housekeeping',
    description: 'Pristine environment'
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 text-sm font-semibold tracking-wider text-[#1B4D3E] uppercase bg-[#1B4D3E]/5 rounded-full">
  <CheckCircle className="h-4 w-4" />
  Why Choose Us
</span>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Experience Excellence
          </h2>
          <p className="text-lg text-gray-600">
            Discover a world of unparalleled luxury and exceptional service
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-white p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="h-10 w-10 rounded-lg bg-[#1B4D3E]/5 flex items-center justify-center mb-3 group-hover:bg-[#1B4D3E] transition-colors duration-300">
                  <feature.icon className="h-5 w-5 text-[#1B4D3E] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-500">
                  {feature.description}
                </p>
              </div>
              <div className="absolute inset-0 border border-gray-100 rounded-xl group-hover:border-[#1B4D3E]/20 transition-colors duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 