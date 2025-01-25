'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLoading } from '@/contexts/LoadingContext';
import { socket } from '@/utils/socket';

interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  totalUsers: number;
  totalRooms: number;
  totalStaff: number;
  recentBookings: Array<{
    _id: string;
    user: {
      name: string;
      email: string;
    } | null;
    room: {
      name: string;
      price: number;
    } | null;
    checkIn: string;
    checkOut: string;
    status: string;
    totalAmount: number;
  }>;
  isLoading: {
    bookings: boolean;
    revenue: boolean;
    users: boolean;
    rooms: boolean;
    staff: boolean;
  };
}

const mockStats: DashboardStats = {
  totalBookings: 0,
  totalRevenue: 0,
  totalUsers: 0,
  totalRooms: 0,
  totalStaff: 0,
  recentBookings: [],
  isLoading: {
    bookings: false,
    revenue: false,
    users: false,
    rooms: false,
    staff: false
  }
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>(mockStats);
  const { setIsLoading } = useLoading();

  const fetchDashboardStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const [usersResponse, bookingsResponse, roomsResponse, staffResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/users/count`, {
          credentials: 'include'
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/stats`, {
          credentials: 'include'
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms/stats`, {
          credentials: 'include'
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff`, {
          credentials: 'include'
        })
      ]);

      const [usersData, bookingsData, roomsData, staffData] = await Promise.all([
        usersResponse.json(),
        bookingsResponse.json(),
        roomsResponse.json(),
        staffResponse.json()
      ]);

      setStats(prev => ({
        ...prev,
        totalUsers: usersData.count || 0,
        totalBookings: bookingsData.totalBookings || 0,
        totalRevenue: bookingsData.totalRevenue || 0,
        totalRooms: roomsData.totalRooms || 0,
        totalStaff: staffData.data.length || 0,
        recentBookings: bookingsData.recentBookings || []
      }));
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading]);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  useEffect(() => {
    socket.connect();

    // Listen direct stats
    socket.on('statsUpdated', (newStats) => {
      setStats(prev => ({
        ...prev,
        totalBookings: newStats.totalBookings,
        totalRevenue: newStats.totalRevenue,
        recentBookings: newStats.recentBookings
      }));
    });

    // Update stats booking created
    socket.on('bookingCreated', (newBooking) => {
      setStats(prev => ({
        ...prev,
        totalBookings: prev.totalBookings + 1,
        recentBookings: [newBooking, ...prev.recentBookings.slice(0, 4)]
      }));
    });

    // Update stats booking status changes
    socket.on('bookingUpdated', (updatedBooking) => {
      setStats(prev => {
        const updatedRecentBookings = prev.recentBookings.map(booking => 
          booking._id === updatedBooking._id ? updatedBooking : booking
        );
        
        let newTotalBookings = prev.totalBookings;
        let newTotalRevenue = prev.totalRevenue;

        if (updatedBooking.status === 'confirmed') {
          newTotalBookings += 1;
          newTotalRevenue += updatedBooking.totalAmount;
        }

        return {
          ...prev,
          totalBookings: newTotalBookings,
          totalRevenue: newTotalRevenue,
          recentBookings: updatedRecentBookings
        };
      });
    });

    // Update room stats
    socket.on('roomUpdated', (roomStats) => {
      setStats(prev => ({
        ...prev,
        totalRooms: roomStats.availableRooms
      }));
    });

    // Staff updates
    socket.on('staffCreated', () => {
      setStats(prev => ({
        ...prev,
        totalStaff: prev.totalStaff + 1
      }));
    });

    socket.on('staffDeleted', () => {
      setStats(prev => ({
        ...prev,
        totalStaff: Math.max(0, prev.totalStaff - 1)
      }));
    });

    return () => {
      socket.off('statsUpdated');
      socket.off('bookingCreated');
      socket.off('bookingUpdated');
      socket.off('roomUpdated');
      socket.off('staffCreated');
      socket.off('staffDeleted');
      socket.disconnect();
    };
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Bookings */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-medium text-gray-600">Total Bookings</h2>
            <span className="p-2 bg-green-50 rounded-lg">
              <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">{stats.totalBookings}</p>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-medium text-gray-600">Total Revenue</h2>
            <span className="p-2 bg-blue-50 rounded-lg">
              <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">${stats.totalRevenue}</p>
        </div>

        {/* Total Users */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-medium text-gray-600">Total Users</h2>
            <span className="p-2 bg-purple-50 rounded-lg">
              <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
        </div>

        {/* Total Staff Members */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-medium text-gray-600">Total Staff</h2>
            <span className="p-2 bg-indigo-50 rounded-lg">
              <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                />
              </svg>
            </span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">{stats.totalStaff}</p>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm font-medium text-gray-500">
                  <th className="pb-4">Guest</th>
                  <th className="pb-4">Room</th>
                  <th className="pb-4">Check In</th>
                  <th className="pb-4">Check Out</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {stats.recentBookings.map((booking) => (
                  <tr key={booking._id} className="border-t border-gray-100">
                    <td className="py-4">{booking.user?.name || 'Unknown User'}</td>
                    <td className="py-4">{booking.room?.name || 'Deleted Room'}</td>
                    <td className="py-4">{new Date(booking.checkIn).toLocaleDateString()}</td>
                    <td className="py-4">{new Date(booking.checkOut).toLocaleDateString()}</td>
                    <td className="py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 text-right">${booking.totalAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 