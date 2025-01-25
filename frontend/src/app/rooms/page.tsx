'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { socket } from '@/utils/socket';
import RoomCard from '@/components/rooms/RoomCard';
import RoomCardSkeleton from '@/components/rooms/RoomCardSkeleton';
import RoomFilters from '@/components/rooms/RoomFilters';
import { Room } from '@/types/room';
import { Search, Filter, ChevronDown } from 'lucide-react';
import PageTransition from '@/components/common/PageTransition';

interface FilterParams {
  minPrice?: number;
  maxPrice?: number;
  capacity?: number;
  type?: string;
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filters, setFilters] = useState<FilterParams>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const fetchRooms = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch rooms');
      const data = await response.json();
      setRooms(data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const matchesSearch = searchQuery 
        ? room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          room.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      const matchesPrice = (!filters.minPrice || room.price >= filters.minPrice) &&
                          (!filters.maxPrice || room.price <= filters.maxPrice);
      const matchesCapacity = !filters.capacity || room.capacity >= filters.capacity;
      
      const matchesType = !filters.type || 
        filters.type.split(',').every(amenity => 
          room.amenities?.includes(amenity.trim())
        );
      
      return matchesSearch && matchesPrice && matchesCapacity && matchesType;
    });
  }, [rooms, searchQuery, filters]);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleFilters = useCallback((newFilters: FilterParams) => {
    setFilters(prev => {
      if (JSON.stringify(prev) === JSON.stringify(newFilters)) {
        return prev;
      }
      return newFilters;
    });
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    socket.connect();

    socket.on('roomUpdated', (data) => {
      console.log('Room updated:', data);
      if (data.room) {
        setRooms(prevRooms => 
          prevRooms.map(room => 
            room._id === data.room._id ? data.room : room
          )
        );
      }
    });

    socket.on('roomAvailabilityChanged', (updatedRoom) => {
      console.log('Room availability changed:', updatedRoom);
      setRooms(prevRooms =>
        prevRooms.map(room =>
          room._id === updatedRoom._id ? updatedRoom : room
        )
      );
    });

    socket.on('roomCreated', (newRoom) => {
      console.log('New room created:', newRoom);
      setRooms(prevRooms => [newRoom, ...prevRooms]);
    });

    socket.on('roomDeleted', (roomId) => {
      console.log('Room deleted:', roomId);
      setRooms(prevRooms => prevRooms.filter(room => room._id !== roomId));
    });

    socket.on('roomStatusChanged', (data) => {
      console.log('Room status changed:', data);
      setRooms(prevRooms =>
        prevRooms.map(room =>
          room._id === data.roomId ? { ...room, status: data.status } : room
        )
      );
    });

    socket.on('bookingUpdated', (data) => {
      console.log('Booking updated, refreshing rooms:', data);
      fetchRooms();
    });

    return () => {
      socket.off('roomUpdated');
      socket.off('roomAvailabilityChanged');
      socket.off('roomCreated');
      socket.off('roomDeleted');
      socket.off('roomStatusChanged');
      socket.off('bookingUpdated');
      socket.disconnect();
    };
  }, [fetchRooms]);

  return (
    <PageTransition>
      <div className="h-screen bg-gradient-to-b from-gray-100 to-white">
        {/* Hero Section */}
        <section className="relative h-[20vh] bg-[#1B4D3E] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
          
          {/* Hero Content */}
          <div className="relative h-full container mx-auto px-4">
            <div className="h-full flex flex-col justify-center items-start max-w-2xl">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="h-px w-10 bg-white/60" />
                  <span className="text-white/80 text-sm tracking-wider uppercase">Discover</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                  Our Luxury Rooms
                </h1>
                <p className="text-base text-white/90 max-w-xl">
                  Experience unparalleled comfort in our meticulously designed rooms
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 -mt-10 relative z-10">
          {/* Search , Filter Bar */}
          <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-stretch">
              {/* Search Input */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search rooms..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
                  focus:ring-2 focus:ring-[#1B4D3E] focus:border-[#1B4D3E] transition-all"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>

              {/* Mobile Toggle */}
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="md:hidden flex items-center justify-between w-full px-4 py-3 
                bg-gray-50 border border-gray-200 rounded-xl text-gray-700"
              >
                <span className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </span>
                <ChevronDown className={`h-5 w-5 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Mobile Filters */}
            <div className={`md:hidden mt-4 ${showMobileFilters ? 'block' : 'hidden'}`}>
              <RoomFilters onFilter={handleFilters} />
            </div>
          </div>

          {/* Content Grid */}
          <div className="flex gap-8">
            <aside className="hidden md:block w-1/4 lg:w-1/5">
              <div className="sticky top-8">
                <RoomFilters onFilter={handleFilters} />
              </div>
            </aside>

            {/* Rooms Grid */}
            <main className="flex-1">
              <div className="mb-6">
                <p className="text-gray-600">
                  Showing <span className="font-semibold text-[#1B4D3E]">{filteredRooms.length}</span> rooms
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {isLoading ? (
                  [...Array(6)].map((_, index) => (
                    <div 
                      key={index}
                      className="transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
                    >
                      <RoomCardSkeleton />
                    </div>
                  ))
                ) : (
                  filteredRooms.map((room) => (
                    <div 
                      key={room._id}
                      className="transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
                    >
                      <RoomCard room={room} />
                    </div>
                  ))
                )}
              </div>
              {filteredRooms.length === 0 && !isLoading && (
                <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-2xl">
                  <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No rooms found
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Try adjusting your search or filter criteria to find available rooms
                  </p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}