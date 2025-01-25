'use client';

import Image from 'next/image';
import Link from 'next/link';
import { 
  Wifi, 
  Coffee, 
  Bath, 
  Check, 
  ArrowRight, 
  Tv, 
  Car, 
  Snowflake 
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

const amenityIcons: Record<string, LucideIcon> = {
  'WiFi': Wifi,
  'Coffee Maker': Coffee,
  'Bathroom': Bath,
  'TV': Tv,
  'Parking': Car,
  'AC': Snowflake,
};

interface RoomCardProps {
  room: {
    _id: string;
    name: string;
    description: string;
    price: number;
    capacity: number;
    amenities: string[];
    images: string[];
    isAvailable: boolean;
    roomType: string;
    status: string;
    currentBooking?: {
      checkIn: Date;
      checkOut: Date;
    };
  };
}

export default function RoomCard({ room }: RoomCardProps) {
  return (
    <div className="h-full flex flex-col bg-white shadow-2xl rounded-xl overflow-hidden border border-gray-100 group">
      {/* Image Container */}
      <div className="relative h-[240px] w-full">
        <Image
          src={room.images[0]}
          alt={room.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4 z-10">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            room.isAvailable
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {room.isAvailable ? 'Available' : 'Booked'}
          </span>
        </div>
        <div className="absolute top-4 right-4 z-10">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#1B4D3E] bg-opacity-90 text-white">
            {room.roomType}
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-grow p-6">
        {/* Title and Price */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
            {room.name}
          </h3>
          <div className="text-right">
            <p className="text-2xl font-bold text-[#1B4D3E]">
              ${room.price}
            </p>
            <p className="text-sm text-gray-500">per night</p>
          </div>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">
          {room.description}
        </p>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-6">
          {room.amenities.slice(0, 3).map((amenity) => {
            const IconComponent = amenityIcons[amenity] || Check;
            return (
              <span
                key={amenity}
                className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm group-hover:bg-[#1B4D3E]/5 transition-colors"
              >
                <IconComponent className="h-4 w-4 mr-1.5 text-[#1B4D3E]" />
                {amenity}
              </span>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="mt-auto">
          <Link
            href={`/rooms/${room._id}`}
            className={`flex items-center justify-center w-full py-2 rounded-lg text-sm transition-all ${
              room.isAvailable
                ? 'bg-[#1B4D3E] text-white hover:bg-[#163D37] group-hover:shadow-lg'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            onClick={(e) => !room.isAvailable && e.preventDefault()}
          >
            {room.isAvailable ? (
              <>
                View Details
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </>
            ) : (
              'Not Available'
            )}
          </Link>
        </div>
      </div>
    </div>
  );
} 