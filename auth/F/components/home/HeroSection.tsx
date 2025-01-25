'use client';

import { MapPin, Star } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const STATS = [
  { number: '500+', label: 'Luxury Rooms' },
  { number: '100%', label: 'Satisfied Guests' },
  { number: '24/7', label: 'Support' }
];

const IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&q=80',
    alt: 'Luxury hotel room with city view'
  },
  {
    src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&q=80',
    alt: 'Premium hotel bathroom'
  },
  {
    src: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&q=80',
    alt: 'Hotel swimming pool'
  },
  {
    src: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&auto=format&fit=crop&q=80',
    alt: 'Luxury hotel bedroom'
  }
];

export default function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center bg-secondary-50 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1B4D3E]/20 to-transparent z-0" />
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary-50 rounded-bl-full -z-10 opacity-50" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary-50 rounded-tr-full -z-10 opacity-50" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left */}
          <div className="space-y-8 lg:space-y-12 lg:pr-8">
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 text-sm font-semibold tracking-wider text-[#1B4D3E] uppercase bg-[#1B4D3E]/5 rounded-full">
                Welcome to Luxury Stay
              </span>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-secondary-900 leading-[1.1] tracking-tight">
                Find Your Perfect{' '}
                <span className="text-[#1B4D3E]">Luxury Room</span>
              </h1>

              <p className="text-lg sm:text-xl text-secondary-600 max-w-lg">
                Experience unparalleled comfort in our handpicked selection of premium rooms and suites.
              </p>
            </motion.div>

            {/* Feature Cards */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 sm:gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Experience Card */}
              <motion.div
                whileHover={{ y: -5 }}
                className="flex-1 bg-white/80 backdrop-blur-md p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-white/20 group hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-[#1B4D3E]/10 flex items-center justify-center group-hover:bg-[#1B4D3E] transition-colors">
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 text-[#1B4D3E] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Luxury Experience</h3>
                    <p className="text-xs sm:text-sm text-gray-600">World-class amenities & service</p>
                  </div>
                </div>
              </motion.div>

              {/* Location Card */}
              <motion.div
                whileHover={{ y: -5 }}
                className="flex-1 bg-white/80 backdrop-blur-md p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-white/20 group hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-[#1B4D3E]/10 flex items-center justify-center group-hover:bg-[#1B4D3E] transition-colors">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-[#1B4D3E] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Prime Location</h3>
                    <p className="text-xs sm:text-sm text-gray-600">In the heart of luxury</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-6 sm:gap-10 pt-6 lg:pt-8 border-t border-secondary-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {STATS.map((stat, index) => (
                <div key={index} className="text-center sm:text-left">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary-900 mb-1">
                    {stat.number}
                  </h3>
                  <p className="text-sm sm:text-base text-secondary-600">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Image Grid - Desktop */}
          <motion.div 
            className="hidden lg:block relative h-[70vh] max-h-[800px]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="grid grid-cols-2 gap-4 h-full">
              <div className="space-y-4 h-full">
                {[0, 1].map((index) => (
                  <motion.div 
                    key={index}
                    className={`${index === 0 ? 'h-[58%]' : 'h-[38%]'} rounded-2xl shadow-xl overflow-hidden relative`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={IMAGES[index].src}
                      alt={IMAGES[index].alt}
                      fill
                      sizes="(max-width: 1200px) 50vw, 33vw"
                      priority={index === 0}
                      className="object-cover hover:scale-110 transition-transform duration-700"
                    />
                  </motion.div>
                ))}
              </div>
              <div className="space-y-4 pt-8">
                {[2, 3].map((index) => (
                  <motion.div
                    key={index}
                    className="h-[45%] rounded-2xl shadow-xl overflow-hidden relative"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={IMAGES[index].src}
                      alt={IMAGES[index].alt}
                      fill
                      sizes="(max-width: 1200px) 50vw, 33vw"
                      className="object-cover hover:scale-110 transition-transform duration-700"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Image Grid */}
          <motion.div 
            className="grid lg:hidden grid-cols-2 gap-2 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {[0, 1].map((colIndex) => (
              <div key={colIndex} className="space-y-2">
                {[0, 1].map((rowIndex) => (
                  <motion.div
                    key={colIndex * 2 + rowIndex}
                    className="aspect-[4/3] rounded-lg shadow-lg overflow-hidden relative"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={IMAGES[colIndex * 2 + rowIndex].src}
                      alt={IMAGES[colIndex * 2 + rowIndex].alt}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      priority={colIndex === 0 && rowIndex === 0}
                      className="object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}