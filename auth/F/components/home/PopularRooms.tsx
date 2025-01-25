'use client';

import { motion } from 'framer-motion';
import RoomCard from '@/components/rooms/RoomCard';
import Link from 'next/link';
import { ArrowRight, Crown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Room } from '@/types/room';
import RoomCardSkeleton from '@/components/rooms/RoomCardSkeleton';

export default function PopularRooms() {
  const [popularRooms, setPopularRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPopularRooms = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms`, {
          credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to fetch rooms');
        const data = await response.json();
        
        const sortedRooms = data.data
          .sort((a: Room, b: Room) => b.price - a.price)
          .slice(0, 3);

        setPopularRooms(sortedRooms);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularRooms();
  }, []);

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
            <Crown className="h-4 w-4" />
            Featured Accommodations
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Premium Rooms & Suites
          </h2>
          <p className="text-lg text-gray-600">
            Experience luxury living in our most exclusive accommodations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            [...Array(3)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full"
              >
                <RoomCardSkeleton />
              </motion.div>
            ))
          ) : (
            popularRooms.map((room, index) => (
              <motion.div
                key={room._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full flex"
              >
                <div className="w-full transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
                  <RoomCard room={room} />
                </div>
              </motion.div>
            ))
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mt-12"
        >
          <Link
            href="/rooms"
            className="inline-flex items-center px-8 py-3 bg-[#1B4D3E] text-white rounded-lg 
            hover:bg-[#163D37] transition-all duration-300 transform hover:-translate-y-0.5 group"
          >
            Explore All Rooms
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}