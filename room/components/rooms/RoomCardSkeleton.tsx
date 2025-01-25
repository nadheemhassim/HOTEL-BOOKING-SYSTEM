'use client';

export default function RoomCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 animate-pulse">
      {/* Image */}
      <div className="relative h-64 w-full bg-gray-200">
        <div className="absolute top-4 left-4 z-10">
          <div className="h-6 w-20 bg-gray-300 rounded-full" />
        </div>
        <div className="absolute top-4 right-4 z-10">
          <div className="h-6 w-24 bg-gray-300 rounded-full" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            {/* Title */}
            <div className="h-6 w-40 bg-gray-200 rounded mb-2" />
            {/* Rating */}
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 w-4 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
          {/* Price */}
          <div className="text-right">
            <div className="h-7 w-24 bg-gray-200 rounded mb-1" />
            <div className="h-4 w-16 bg-gray-200 rounded" />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2 mb-6">
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-3/4 bg-gray-200 rounded" />
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-8 w-24 bg-gray-200 rounded-full" />
          ))}
        </div>

        {/* Button */}
        <div className="h-12 w-full bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
} 