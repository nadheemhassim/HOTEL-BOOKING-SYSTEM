'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useLoading } from '@/contexts/LoadingContext';
import { 
  Users, Wifi, Coffee, Bath,
  ArrowLeft, Calendar, Clock, Info, CreditCard, 
  Tv, Wine, Fan, UtensilsCrossed, Lock, LucideIcon 
} from 'lucide-react';
import BookingModal from '@/components/rooms/BookingModal';
import { socket } from '@/utils/socket';

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
  lastCleaned: string;
}

interface AmenityIconMap {
  [key: string]: LucideIcon;
}

export default function RoomDetailsPage() {
  const [room, setRoom] = useState<Room | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const { setIsLoading: setGlobalLoading } = useLoading();
  const params = useParams();
  const router = useRouter();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookedDates, setBookedDates] = useState<Array<{ checkIn: string; checkOut: string }>>([]);

  const fetchRoom = useCallback(async () => {
    setIsLoading(true);
    setGlobalLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch room');
      const data = await response.json();
      setRoom(data.data);
      setSelectedImage(data.data.images[0]);
    } catch (error) {
      console.error('Error:', error);
      router.push('/rooms');
    } finally {
      setIsLoading(false);
      setGlobalLoading(false);
    }
  }, [params.id, router, setGlobalLoading]);

  const fetchBookedDates = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings/room/${params.id}/dates`,
        { credentials: 'include' }
      );
      if (!response.ok) throw new Error('Failed to fetch booked dates');
      const data = await response.json();
      setBookedDates(data.dates);
    } catch (error) {
      console.error('Error:', error);
    }
  }, [params.id]);

  useEffect(() => {
    fetchRoom();
  }, [fetchRoom]);

  useEffect(() => {
    fetchBookedDates();

    socket.connect();

    socket.on('bookingUpdated', (updatedBooking) => {
      if (updatedBooking.room._id === params.id && 
          updatedBooking.status === 'confirmed') {
        fetchBookedDates();
      }
    });

    socket.on('bookingCreated', (newBooking) => {
      if (newBooking.room._id === params.id && 
          newBooking.status === 'confirmed') {
        setBookedDates(prev => [...prev, {
          checkIn: newBooking.checkIn,
          checkOut: newBooking.checkOut
        }]);
      }
    });

    return () => {
      socket.off('bookingUpdated');
      socket.off('bookingCreated');
      socket.disconnect();
    };
  }, [fetchBookedDates, params.id]);

  const amenityIcons: AmenityIconMap = {
    wifi: Wifi,
    'coffee maker': Coffee,
    bathroom: Bath,
    tv: Tv,
    'mini bar': Wine,
    'air conditioning': Fan,
    'room service': UtensilsCrossed,
    safe: Lock,
  };

  if (isLoading || !room) {
    return <RoomDetailsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] lg:h-[70vh] w-full">
        {/* Main Image */}
        <div className="absolute inset-0">
          {selectedImage && (
            <Image
              src={selectedImage}
              alt={room?.name || 'Room'}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        {/* Top Navigation Bar */}
        <div className="absolute top-0 left-0 right-0 z-10">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <button
                onClick={() => router.back()}
                className="group flex items-center gap-2 text-white/90 hover:text-white transition-colors"
              >
                <div className="p-2 rounded-full bg-black/20 backdrop-blur-sm group-hover:bg-black/30 transition-colors">
                  <ArrowLeft className="h-5 w-5" />
                </div>
                <span className="hidden sm:block text-sm font-medium">Back to Rooms</span>
              </button>

              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm">
                  <span className="text-white/90 text-sm">Room #{room?.roomNumber}</span>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm
                  ${room?.roomType === 'SUITE' 
                    ? 'bg-yellow-400/20 text-yellow-100'
                    : room?.roomType === 'PREMIUM'
                    ? 'bg-purple-400/20 text-purple-100'
                    : 'bg-blue-400/20 text-blue-100'
                  }`}
                >
                  {room?.roomType}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Room Title Section */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="container mx-auto px-4 pb-20">
            <div className="max-w-4xl space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">{room?.name}</h1>
              <div className="flex flex-wrap gap-6 text-white/90">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm">
                    <Users className="h-5 w-5" />
                  </div>
                  <span className="text-sm">Up to {room?.capacity} guests</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <span className="text-sm">Last cleaned {new Date(room?.lastCleaned || '').toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="container mx-auto px-4 -mt-20 relative z-20">
        <div className="bg-white rounded-2xl p-4 shadow-xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {room?.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(image)}
                className={`group relative aspect-square rounded-xl overflow-hidden 
                  ${selectedImage === image 
                    ? 'ring-2 ring-[#1B4D3E] ring-offset-2' 
                    : 'hover:ring-2 hover:ring-[#1B4D3E]/50 hover:ring-offset-2'
                  }`}
              >
                <Image
                  src={image}
                  alt={`Room view ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className={`absolute inset-0 transition-colors duration-300
                  ${selectedImage === image 
                    ? 'bg-black/0' 
                    : 'bg-black/20 group-hover:bg-black/0'
                  }`} 
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Users, label: 'Capacity', value: `${room?.capacity} Guests` },
                { icon: Clock, label: 'Check-in', value: '2:00 PM' },
                { icon: Clock, label: 'Check-out', value: '12:00 PM' },
                { icon: Calendar, label: 'Minimum Stay', value: '1 Night' }
              ].map((info, index) => (
                <QuickInfoCard
                  key={index}
                  icon={info.icon}
                  label={info.label}
                  value={info.value}
                />
              ))}
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">About this room</h2>
              <p className="text-gray-600 leading-relaxed">{room?.description}</p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold text-gray-900">Room Amenities</h2>
                <div className="px-4 py-2 bg-[#1B4D3E]/5 rounded-lg">
                  <span className="text-sm font-medium text-[#1B4D3E]">
                    {room?.amenities.length} amenities included
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {room?.amenities.map((amenity) => (
                  <AmenityCard
                    key={amenity}
                    amenity={amenity}
                    icon={amenityIcons[amenity.toLowerCase()] || Info}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <BookingCard room={room} onBook={() => setIsBookingModalOpen(true)} />
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {room && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          room={room}
          bookedDates={bookedDates}
        />
      )}
    </div>
  );
}

interface AmenityCardProps {
  amenity: string;
  icon: LucideIcon;
}

const AmenityCard = ({ amenity, icon: Icon }: AmenityCardProps) => (
  <div className="group relative flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-[#1B4D3E]/5 transition-all duration-300">
    <div className="relative">
      <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        <Icon className="h-6 w-6 text-[#1B4D3E]" />
      </div>
      <div className="absolute -inset-1 rounded-xl bg-[#1B4D3E]/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
    
    <div className="flex-1">
      <span className="block font-medium text-gray-900 group-hover:text-[#1B4D3E] transition-colors">
        {amenity}
      </span>
      <span className="text-sm text-gray-500">
        {getAmenityDescription(amenity)}
      </span>
    </div>
  </div>
);

interface BookingCardProps {
  room: Room | null;
  onBook: () => void;
}

const BookingCard = ({ room, onBook }: BookingCardProps) => (
  <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6 border border-gray-100">
    <div className="flex justify-between items-center pb-6 border-b">
      <div>
        <p className="text-gray-600">Price per night</p>
        <p className="text-3xl font-bold text-[#1B4D3E]">${room?.price}</p>
      </div>
      <div className="h-12 w-12 rounded-full bg-[#1B4D3E]/10 flex items-center justify-center">
        <CreditCard className="h-6 w-6 text-[#1B4D3E]" />
      </div>
    </div>

    <div className="space-y-4">
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        <Calendar className="h-5 w-5 text-[#1B4D3E]" />
        <span className="text-sm text-gray-600">Free cancellation up to 24 hours before check-in</span>
      </div>
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        <Clock className="h-5 w-5 text-[#1B4D3E]" />
        <span className="text-sm text-gray-600">Instant confirmation</span>
      </div>
    </div>

    <button
      onClick={onBook}
      className="w-full py-4 bg-[#1B4D3E] text-white rounded-xl hover:bg-[#163D37] 
      transition-colors text-lg font-medium flex items-center justify-center gap-2
      hover:shadow-lg hover:shadow-[#1B4D3E]/20"
    >
      <Calendar className="h-5 w-5" />
      Book Now
    </button>
  </div>
);

interface QuickInfoCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

function QuickInfoCard({ icon: Icon, label, value }: QuickInfoCardProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#1B4D3E]/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-[#1B4D3E]" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="font-medium text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

// Skeleton
function RoomDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Skeleton */}
            <div className="space-y-4">
              <div className="h-[400px] bg-gray-200 rounded-xl" />
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded-lg" />
                ))}
              </div>
            </div>

            {/* Content Skeleton */}
            <div className="space-y-6">
              <div>
                <div className="h-8 w-2/3 bg-gray-200 rounded mb-2" />
                <div className="h-4 w-1/3 bg-gray-200 rounded" />
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                    <div className="h-8 w-32 bg-gray-200 rounded" />
                  </div>
                  <div className="h-12 w-32 bg-gray-200 rounded-lg" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-6 w-32 bg-gray-200 rounded" />
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-2/3 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getAmenityDescription(amenity: string): string {
  const descriptions: { [key: string]: string } = {
    'WiFi': 'High-speed internet access',
    'Coffee Maker': 'Premium coffee machine',
    'Bathroom': 'Private ensuite bathroom',
    'TV': '4K Smart TV with streaming',
    'Mini Bar': 'Fully stocked refreshments',
    'Air Conditioning': 'Climate control system',
    'Room Service': '24/7 in-room dining',
    'Safe': 'Digital safety deposit box',
  };
  
  return descriptions[amenity] || 'Available in room';
}