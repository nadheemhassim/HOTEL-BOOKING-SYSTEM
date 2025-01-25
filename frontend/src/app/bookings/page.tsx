'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/contexts/LoadingContext';
import { format } from 'date-fns';
import { 
  Calendar, Clock, Users, CreditCard, 
  XCircle, AlertCircle, Check 
} from 'lucide-react';
import Image from 'next/image';
import { socket } from '@/utils/socket';
import { Booking, BookingStatus } from '@/types/booking';

const DEFAULT_ROOM_IMAGE = '/room-placeholder.png';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setIsLoading: setGlobalLoading } = useLoading();
  const router = useRouter();

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    setGlobalLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/my-bookings`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch bookings');
      const data = await response.json();
      setBookings(data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
      setGlobalLoading(false);
    }
  }, [setGlobalLoading]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    socket.connect();

    socket.on('bookingUpdated', (updatedBooking: Booking) => {
      setBookings(prevBookings => {
        const newBookings = prevBookings.map(booking => 
          booking._id === updatedBooking._id 
            ? {
                ...booking,
                ...updatedBooking,
                status: updatedBooking.status as BookingStatus
              }
            : booking
        );
        return newBookings;
      });
    });

    socket.on('bookingCancelled', (bookingId) => {
      setBookings(prevBookings => {
        const newBookings = prevBookings.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: 'cancelled' as BookingStatus }
            : booking
        );
        return newBookings;
      });
    });

    return () => {
      socket.off('bookingUpdated');
      socket.off('bookingCancelled');
      socket.disconnect();
    };
  }, []);

  const handleCancel = async (bookingId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}/cancel`,
        {
          method: 'PATCH',
          credentials: 'include'
        }
      );
      if (!response.ok) throw new Error('Failed to cancel booking');
      fetchBookings();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handlePayment = async (bookingId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}/pay`,
        {
          method: 'PATCH',
          credentials: 'include'
        }
      );
      if (!response.ok) throw new Error('Failed to process payment');
      fetchBookings();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (isLoading) {
    return <BookingsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-200 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Section */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Bookings</h1>
              <p className="text-sm text-gray-600 mt-1">Manage your hotel reservations</p>
            </div>
            <button
              onClick={() => router.push('/rooms')}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#1B4D3E] text-white rounded-lg hover:bg-[#163D37] transition-colors text-sm font-medium shadow-sm"
            >
              <Calendar className="h-4 w-4" />
              Book a Room
            </button>
          </div>
          
          {/* Booking Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Bookings', value: bookings.length },
              { 
                label: 'Active Bookings', 
                value: bookings.filter(b => b.status === 'confirmed').length 
              },
              { 
                label: 'Pending Bookings', 
                value: bookings.filter(b => b.status === 'pending').length 
              },
              { 
                label: 'Cancelled', 
                value: bookings.filter(b => b.status === 'cancelled').length 
              }
            ].map((stat, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100/50 hover:bg-white/90 transition-colors">
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-semibold text-[#1B4D3E] mt-1">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Book Button */}
        <button
          onClick={() => router.push('/rooms')}
          className="sm:hidden w-full mb-6 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1B4D3E] text-white rounded-lg hover:bg-[#163D37] transition-colors text-sm font-medium shadow-sm"
        >
          <Calendar className="h-4 w-4" />
          Book a Room
        </button>

        {/* Bookings List */}
        <div className="space-y-6">
          {bookings.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 text-center shadow-sm border border-gray-100/50">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                Start planning your perfect stay by browsing our selection of rooms.
              </p>
              <button
                onClick={() => router.push('/rooms')}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1B4D3E] text-white rounded-lg hover:bg-[#163D37] transition-colors text-sm font-medium"
              >
                <Calendar className="h-4 w-4" />
                Browse Rooms
              </button>
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking._id}
                className="relative bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100/50 overflow-hidden hover:shadow-md hover:bg-white/90 transition-all"
              >
                {/* Payment Success Watermark */}
                {booking.status === 'confirmed' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="transform rotate-12 text-green-500/10 text-[150px] font-bold">
                      PAID
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row">
                  {/* Room Image */}
                  <div className="relative w-full sm:w-48 h-48 sm:h-auto">
                    <Image
                      src={booking.room?.images?.[0] || DEFAULT_ROOM_IMAGE}
                      alt={booking.room?.name || 'Room Image'}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Content Container */}
                  <div className="flex-1 p-4 flex flex-col sm:flex-row gap-4">
                    {/* Booking Details */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {booking.room?.name || 'Room'}
                      </h3>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <div>
                            <p className="text-xs font-medium">Check-in</p>
                            <p>{format(new Date(booking.checkIn), 'MMM dd, yyyy')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <div>
                            <p className="text-xs font-medium">Check-out</p>
                            <p>{format(new Date(booking.checkOut), 'MMM dd, yyyy')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Users className="h-4 w-4" />
                          <div>
                            <p className="text-xs font-medium">Guests</p>
                            <p>{booking.guests}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <CreditCard className="h-4 w-4" />
                          <div>
                            <p className="text-xs font-medium">Total Amount</p>
                            <p className="font-semibold text-[#1B4D3E]">${booking.totalAmount}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex sm:flex-col justify-end gap-2 min-w-[120px]">
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => handleCancel(booking._id)}
                          className="flex-1 sm:flex-none px-4 py-2 border border-red-500 text-red-500 text-sm rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <XCircle className="h-4 w-4" />
                          Cancel
                        </button>
                      )}
                      {booking.status === 'accepted' && (
                        <>
                          <button
                            onClick={() => handlePayment(booking._id)}
                            className="flex-1 sm:flex-none px-4 py-2 bg-[#1B4D3E] text-white text-sm rounded-lg hover:bg-[#163D37] transition-colors flex items-center justify-center gap-1.5"
                          >
                            <CreditCard className="h-4 w-4" />
                            Pay Now
                          </button>
                          <button
                            onClick={() => handleCancel(booking._id)}
                            className="flex-1 sm:flex-none px-4 py-2 border border-red-500 text-red-500 text-sm rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5"
                          >
                            <XCircle className="h-4 w-4" />
                            Cancel
                          </button>
                        </>
                      )}
                      {booking.status === 'awaiting_confirmation' && (
                        <div className="flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
                          <Clock className="h-4 w-4" />
                          Payment Processed - Awaiting Confirmation
                        </div>
                      )}
                      {booking.status === 'confirmed' && (
                        <div className="flex items-center justify-center gap-1.5 py-2 px-3 bg-green-50 text-green-700 rounded-lg text-sm">
                          <Check className="h-4 w-4" />
                          Payment Confirmed
                        </div>
                      )}
                      {booking.status === 'cancelled' && (
                        <div className="flex items-center justify-center gap-1.5 py-2 px-3 bg-red-50 text-red-700 rounded-lg text-sm">
                          <XCircle className="h-4 w-4" />
                          Cancelled
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Single Status Badge - Top Right */}
                <div className="absolute top-4 right-4">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                    ${booking.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800'
                      : booking.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : booking.status === 'accepted'
                      ? 'bg-blue-100 text-blue-800'
                      : booking.status === 'awaiting_confirmation'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {booking.status === 'confirmed' && <Check className="h-3 w-3" />}
                    {booking.status === 'pending' && <AlertCircle className="h-3 w-3" />}
                    {booking.status === 'accepted' && <Clock className="h-3 w-3" />}
                    {booking.status === 'awaiting_confirmation' && <Clock className="h-3 w-3" />}
                    {booking.status === 'cancelled' && <XCircle className="h-3 w-3" />}
                    {booking.status === 'awaiting_confirmation' 
                      ? 'Waiting for Confirmation'
                      : booking.status === 'accepted'
                      ? 'Ready for Payment'
                      : booking.status.charAt(0).toUpperCase() + booking.status.slice(1)
                    }
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function BookingsSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="h-8 w-48 bg-gray-200/80 rounded mb-8" />
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 animate-pulse border border-gray-100/50">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="aspect-video md:aspect-square bg-gray-200 rounded-lg" />
                <div className="md:col-span-2 space-y-4">
                  <div className="h-6 w-2/3 bg-gray-200 rounded" />
                  <div className="grid grid-cols-2 gap-4">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="space-y-2">
                        <div className="h-4 w-20 bg-gray-200 rounded" />
                        <div className="h-4 w-24 bg-gray-200 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-6 w-24 bg-gray-200 rounded" />
                  <div className="h-8 w-full bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 