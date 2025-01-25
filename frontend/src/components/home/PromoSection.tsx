'use client';

import { motion } from 'framer-motion';
import { Calendar, Tag, ArrowRight, Star, Sparkles, Gift } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { Promo } from '@/types/promo';
import { socket } from '@/utils/socket';

export default function PromoSection() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPromos = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/promos`);
      if (!response.ok) throw new Error('Failed to fetch promos');
      const data = await response.json();
      setPromos(data.data.filter((promo: Promo) => promo.isActive));
    } catch (error) {
      console.error('Error fetching promos:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPromos();

    if (!socket.connected) {
      socket.connect();
    }

    const handlePromoCreated = (newPromo: Promo) => {
      if (newPromo.isActive) {
        setPromos(prev => [newPromo, ...prev]);
      }
    };

    const handlePromoUpdated = (updatedPromo: Promo) => {
      setPromos(prev => {
        const exists = prev.some(p => p._id === updatedPromo._id);
        if (exists) {
          return updatedPromo.isActive
            ? prev.map(p => p._id === updatedPromo._id ? updatedPromo : p)
            : prev.filter(p => p._id !== updatedPromo._id);
        } else if (updatedPromo.isActive) {
          return [updatedPromo, ...prev];
        }
        return prev;
      });
    };

    const handlePromoDeleted = (promoId: string) => {
      setPromos(prev => prev.filter(promo => promo._id !== promoId));
    };

    socket.on('promoCreated', handlePromoCreated);
    socket.on('promoUpdated', handlePromoUpdated);
    socket.on('promoDeleted', handlePromoDeleted);

    return () => {
      socket.off('promoCreated', handlePromoCreated);
      socket.off('promoUpdated', handlePromoUpdated);
      socket.off('promoDeleted', handlePromoDeleted);
      socket.disconnect();
    };
  }, [fetchPromos]);

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-b from-[#1B4D3E]/5 to-transparent">
        <div className="container mx-auto px-4">
          <div className="space-y-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl p-8">
                <div className="h-64 bg-gray-200 rounded-lg mb-4" />
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-[#1B4D3E]/5 to-transparent">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 text-sm font-semibold tracking-wider text-[#1B4D3E] uppercase bg-[#1B4D3E]/5 rounded-full">
            <Gift className="h-4 w-4" />
            Limited Time Offers
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Exclusive Promotions
          </h2>
          <p className="text-lg text-gray-600">
            Take advantage of our limited-time offers and special packages for an unforgettable stay
          </p>
        </motion.div>

        <div className="space-y-8">
          {promos.map((promo, index) => (
            <motion.div
              key={promo._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row">
                <div className="relative lg:w-2/5 h-64 lg:h-auto overflow-hidden">
                  <Image
                    src={promo.image}
                    alt={promo.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = promo.fallbackImage || '/room-placeholder.png';
                    }}
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                  
                  {promo.featured && (
                    <div className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1.5 bg-[#D4AF37] text-white text-sm font-semibold rounded-full">
                      <Star className="h-4 w-4 fill-current" />
                      Premium Offer
                    </div>
                  )}
                </div>

                <div className="flex-1 p-8 lg:p-10">
                  <div className="flex flex-col h-full">
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-medium text-[#1B4D3E] uppercase tracking-wider">
                          {promo.subtitle}
                        </span>
                        <span className="px-2.5 py-0.5 bg-[#1B4D3E]/10 text-[#1B4D3E] text-sm font-semibold rounded-full">
                          Save {promo.discount}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {promo.title}
                      </h3>
                      <p className="text-gray-600">
                        {promo.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-8">
                      {promo.perks.map((perk, i) => (
                        <span
                          key={i}
                          className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-700 text-sm rounded-lg"
                        >
                          <Sparkles className="h-4 w-4 text-[#1B4D3E]" />
                          {perk}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto flex flex-col sm:flex-row items-center gap-4 pt-6 border-t">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-2 text-[#1B4D3E]" />
                          Valid until {new Date(promo.validUntil).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Tag className="h-4 w-4 mr-2 text-[#1B4D3E]" />
                          Use code: <span className="font-semibold ml-1">{promo.code}</span>
                        </div>
                      </div>
                      
                      <Link
                        href={`/rooms?promo=${promo.code}`}
                        className="flex items-center gap-2 px-6 py-3 bg-[#1B4D3E] text-white rounded-lg 
                        hover:bg-[#163D37] transition-all duration-300 group-hover:translate-x-1"
                      >
                        Book Now
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#1B4D3E]/5 to-transparent -z-10" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#1B4D3E]/5 to-transparent -z-10" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}