'use client';

import { useState, useEffect, useCallback } from 'react';
import { Wifi, Coffee, Bath, Tv, Car, Snowflake } from 'lucide-react';
import { memo } from 'react';

// Match the FilterParams interface from the rooms page
interface FilterParams {
  minPrice?: number;
  maxPrice?: number;
  capacity?: number;
  type?: string;
}

interface RoomFiltersProps {
  onFilter: (filters: FilterParams) => void;
}

const AMENITIES = [
  { name: 'WiFi', icon: Wifi },
  { name: 'Coffee Maker', icon: Coffee },
  { name: 'Bathroom', icon: Bath },
  { name: 'TV', icon: Tv },
  { name: 'Parking', icon: Car },
  { name: 'AC', icon: Snowflake },
];

const RoomFilters = memo(({ onFilter }: RoomFiltersProps) => {
  const [priceRange, setPriceRange] = useState(1000);
  const [capacity, setCapacity] = useState(1);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const applyFilters = useCallback(() => {
    const filters: FilterParams = {
      minPrice: 0,
      maxPrice: priceRange,
      capacity: capacity,
      ...(selectedAmenities.length > 0 && { type: selectedAmenities.join(',') })
    };
    onFilter(filters);
  }, [priceRange, capacity, selectedAmenities, onFilter]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleAmenityToggle = useCallback((amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Filters</h2>

      {/* Price Range */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Price Range</h3>
        <input
          type="range"
          min="0"
          max="1000"
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>$0</span>
          <span>${priceRange}</span>
        </div>
      </div>

      {/* Capacity */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Guests</h3>
        <select
          value={capacity}
          onChange={(e) => setCapacity(Number(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B4D3E] focus:border-[#1B4D3E]"
        >
          {[1, 2, 3, 4, 5].map(num => (
            <option key={num} value={num}>
              {num} {num === 1 ? 'Guest' : 'Guests'}
            </option>
          ))}
        </select>
      </div>

      {/* Amenities */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Amenities</h3>
        <div className="space-y-2">
          {AMENITIES.map(({ name, icon: Icon }) => (
            <button
              key={name}
              onClick={() => handleAmenityToggle(name)}
              className={`flex items-center w-full p-2 rounded-lg transition-colors ${
                selectedAmenities.includes(name)
                  ? 'bg-[#1B4D3E] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

RoomFilters.displayName = 'RoomFilters';

export default RoomFilters; 