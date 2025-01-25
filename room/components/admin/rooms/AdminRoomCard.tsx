'use client';

import Image from 'next/image';
import { Edit2, Trash2, Users, Hash, Tag } from 'lucide-react';

interface Room {
  _id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  amenities: string[];
  images: string[];
  isAvailable: boolean;
  roomNumber: string;
  roomType: string;
  status: string;
}

interface Props {
  room: Room;
  onEdit: () => void;
  onDelete: () => void;
}

export default function AdminRoomCard({ room, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden group">
        <Image
          src={room.images[0] || '/room-placeholder.png'}
          alt={room.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Room Type Badge */}
        <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-800">
          {room.roomType}
        </span>

        {/* Action Buttons */}
        <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={onEdit}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 hover:text-[#1B4D3E] transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 hover:text-red-500 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1">{room.name}</h3>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <Hash className="h-4 w-4" />
              <span>{room.roomNumber}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <span>{room.capacity}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Tag className="h-4 w-4" />
              <span>${room.price}/night</span>
            </div>
          </div>

          <p className="text-sm text-gray-500 line-clamp-2">{room.description}</p>

          {/* Amenities */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {room.amenities.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md"
              >
                {amenity}
              </span>
            ))}
            {room.amenities.length > 3 && (
              <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md">
                +{room.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 