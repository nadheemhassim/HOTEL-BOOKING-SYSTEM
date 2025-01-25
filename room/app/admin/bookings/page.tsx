'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLoading } from '@/contexts/LoadingContext';
import { format } from 'date-fns';
import { 
  Calendar, Clock, Users, CreditCard, 
  XCircle, Check, AlertCircle, CheckCircle,
  Search, Filter
} from 'lucide-react';
import Image from 'next/image';
import { socket } from '@/utils/socket';
import PageTransition from '@/components/common/PageTransition';
import { motion } from 'framer-motion';

const DEFAULT_ROOM_IMAGE = '/room-placeholder.png';

interface Booking {
  _id: string;
  room: {
    _id: string;
    name: string;
    images: string[];
    price: number;
  };
  user: {
    name?: string;
    email?: string;
  } | null;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number;
  status: 'pending' | 'accepted' | 'awaiting_confirmation' | 'confirmed' | 'cancelled';
  createdAt: string;
}

type BookingStatus = 'all' | 'pending' | 'accepted' | 'awaiting_confirmation' | 'confirmed' | 'cancelled';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus>('all');
  const [isLoading, setIsLoading] = useState(true);
  const { setIsLoading: setGlobalLoading } = useLoading();

  // fetchBookings
  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    setGlobalLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/all`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch bookings');
      const data = await response.json();
      setBookings(data.data);
      setFilteredBookings(data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
      setGlobalLoading(false);
    }
  }, [setGlobalLoading]);

  // filterBookings
  const filterBookings = useCallback(() => {
    let filtered = [...bookings];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(booking => 
        booking.user?.name?.toLowerCase().includes(query) ||
        booking.user?.email?.toLowerCase().includes(query) ||
        booking.room.name.toLowerCase().includes(query)
      );
    }

    setFilteredBookings(filtered);
  }, [bookings, statusFilter, searchQuery]);

  // socket connection effect
  useEffect(() => {
    socket.connect();

    socket.on('bookingUpdated', (updatedBooking) => {
      setBookings(prevBookings => {
        const newBookings = prevBookings.map(booking => 
          booking._id === updatedBooking._id 
            ? {
                ...booking,
                ...updatedBooking,
                room: {
                  ...booking.room,
                  ...updatedBooking.room
                },
                user: {
                  ...booking.user,
                  ...updatedBooking.user
                }
              }
            : booking
        );
        return newBookings;
      });
    });

    socket.on('bookingCreated', (newBooking) => {
      setBookings(prevBookings => [newBooking, ...prevBookings]);
    });

    socket.on('bookingCancelled', (bookingId) => {
      setBookings(prevBookings => {
        const newBookings = prevBookings.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: 'cancelled' as const }
            : booking
        );
        return newBookings;
      });
    });

    return () => {
      socket.off('bookingUpdated');
      socket.off('bookingCreated');
      socket.off('bookingCancelled');
      socket.disconnect();
    };
  }, []);

  // initial fetch effect
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // filter effect
  useEffect(() => {
    filterBookings();
  }, [filterBookings]);

  const handleConfirmBooking = async (bookingId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}/confirm`,
        {
          method: 'PATCH',
          credentials: 'include'
        }
      );
      if (!response.ok) throw new Error('Failed to confirm booking');
      fetchBookings();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleConfirmPayment = async (bookingId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}/confirm-payment`,
        {
          method: 'PATCH',
          credentials: 'include'
        }
      );
      if (!response.ok) throw new Error('Failed to confirm payment');
      fetchBookings();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
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

  return (
    <PageTransition>
      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 gap-4"
        >
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="animate-pulse bg-gray-100 h-32 rounded-xl"
            />
          ))}
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Manage Bookings</h1>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 h-5 w-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as BookingStatus)}
                className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="awaiting_confirmation">Awaiting Confirmation</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Bookings List */}
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="relative bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100/50 overflow-hidden"
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
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 pr-24">
                            {booking.room?.name || 'Room'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Booked by: {booking.user?.name || 'Unknown User'}
                          </p>
                        </div>

                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                          ${booking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : booking.status === 'awaiting_confirmation'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {booking.status === 'confirmed' && <Check className="h-3 w-3" />}
                          {booking.status === 'pending' && <AlertCircle className="h-3 w-3" />}
                          {booking.status === 'awaiting_confirmation' && <Clock className="h-3 w-3" />}
                          {booking.status === 'cancelled' && <XCircle className="h-3 w-3" />}
                          {booking.status === 'awaiting_confirmation' 
                            ? 'Waiting for Confirmation'
                            : booking.status.charAt(0).toUpperCase() + booking.status.slice(1)
                          }
                        </div>
                      </div>

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
                    <div className="flex sm:flex-col justify-end gap-2 min-w-[150px]">
                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleConfirmBooking(booking._id)}
                            className="flex-1 sm:flex-none px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-1.5"
                          >
                            <Check className="h-4 w-4" />
                            Confirm Booking
                          </button>
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="flex-1 sm:flex-none px-4 py-2 border border-red-500 text-red-500 text-sm rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5"
                          >
                            <XCircle className="h-4 w-4" />
                            Cancel
                          </button>
                        </>
                      )}
                      {booking.status === 'accepted' && (
                        <div className="flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
                          <Clock className="h-4 w-4" />
                          Waiting for Payment
                        </div>
                      )}
                      {booking.status === 'awaiting_confirmation' && (
                        <button
                          onClick={() => handleConfirmPayment(booking._id)}
                          className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Confirm Payment
                        </button>
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
              </div>
            ))}
          </div>
        </div>
      )}
    </PageTransition>
  );
} 