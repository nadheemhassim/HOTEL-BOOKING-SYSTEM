'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Search } from 'lucide-react';
import { useLoading } from '@/contexts/LoadingContext';
import AdminRoomCard from '@/components/admin/rooms/AdminRoomCard';
import AdminRoomModal from '@/components/admin/rooms/AdminRoomModal';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import { socket } from '@/utils/socket';
import PageTransition from '@/components/common/PageTransition';
import { Room } from '@/types/room';
import Toast from '@/components/common/Toast';

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const { setIsLoading: setGlobalLoading } = useLoading();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchRooms = useCallback(async () => {
    setIsLoading(true);
    setGlobalLoading(true);
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
      setGlobalLoading(false);
    }
  }, [setGlobalLoading]);

  useEffect(() => {
    socket.connect();

    const handleRoomCreated = (newRoom: Room) => {
      console.log('New room created:', newRoom);
      setRooms(prevRooms => [newRoom, ...prevRooms]);
      setToast({
        message: 'New room added successfully',
        type: 'success'
      });
    };

    const handleRoomUpdated = (updatedRoom: Room) => {
      console.log('Room updated:', updatedRoom);
      setRooms(prevRooms => 
        prevRooms.map(room => 
          room._id === updatedRoom._id ? updatedRoom : room
        )
      );
      setToast({
        message: 'Room updated successfully',
        type: 'success'
      });
    };

    const handleRoomDeleted = (deletedRoomId: string) => {
      console.log('Room deleted:', deletedRoomId);
      setRooms(prevRooms => prevRooms.filter(room => room._id !== deletedRoomId));
      setToast({
        message: 'Room deleted successfully',
        type: 'success'
      });
    };

    socket.on('roomCreated', handleRoomCreated);
    socket.on('roomUpdated', handleRoomUpdated);
    socket.on('roomDeleted', handleRoomDeleted);

    fetchRooms();

    return () => {
      socket.off('roomCreated', handleRoomCreated);
      socket.off('roomUpdated', handleRoomUpdated);
      socket.off('roomDeleted', handleRoomDeleted);
      socket.disconnect();
    };
  }, [fetchRooms]);

  const handleDelete = async (roomId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${roomId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete room');
      }

      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting room:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete room. Please try again.');
    }
  };

  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSuccess = useCallback(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleEditRoom = (room: Room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  return (
    <PageTransition>
      <div className="min-h-screen">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Left side */}
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  Room Management
                </h1>
                <p className="text-gray-500">
                  Manage and organize your hotel rooms inventory
                </p>
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                    <span>{rooms.filter(room => room.isAvailable).length} Available</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500"></div>
                    <span>{rooms.filter(room => !room.isAvailable).length} Occupied</span>
                  </div>
                </div>
              </div>

              {/* Right side */}
              <div className="flex items-center gap-4">
                {/* Search Bar */}
                <div className="relative flex-1 sm:flex-initial">
                  <input
                    type="text"
                    placeholder="Search rooms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-200 
                    focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20 focus:border-[#1B4D3E]"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>

                {/* Add Room Button */}
                <button
                  onClick={() => {
                    setSelectedRoom(undefined);
                    setIsModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1B4D3E] text-white rounded-lg 
                  hover:bg-[#163D37] transition-colors shadow-sm hover:shadow-md"
                >
                  <Plus className="h-5 w-5" />
                  <span className="hidden sm:inline">Add Room</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100 border-t">
            <div className="px-6 py-4">
              <div className="text-sm font-medium text-gray-500">Total Rooms</div>
              <div className="text-2xl font-semibold text-gray-900">{rooms.length}</div>
            </div>
            <div className="px-6 py-4">
              <div className="text-sm font-medium text-gray-500">Standard</div>
              <div className="text-2xl font-semibold text-gray-900">
                {rooms.filter(room => room.roomType === 'STANDARD').length}
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="text-sm font-medium text-gray-500">Premium</div>
              <div className="text-2xl font-semibold text-gray-900">
                {rooms.filter(room => room.roomType === 'PREMIUM').length}
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="text-sm font-medium text-gray-500">Suite</div>
              <div className="text-2xl font-semibold text-gray-900">
                {rooms.filter(room => room.roomType === 'SUITE').length}
              </div>
            </div>
          </div>
        </div>

        {/* Room Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="rounded-xl overflow-hidden">
                  <div className="aspect-[4/3] bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRooms.map((room) => (
              <AdminRoomCard
                key={room._id}
                room={room}
                onEdit={() => handleEditRoom(room)}
                onDelete={() => {
                  setSelectedRoom(room);
                  setIsDeleteModalOpen(true);
                }}
              />
            ))}
          </div>
        )}

        {/* Modals */}
        <AdminRoomModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          room={selectedRoom}
          onSuccess={handleSuccess}
        />

        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => selectedRoom && handleDelete(selectedRoom._id)}
          title="Delete Room"
          message="Are you sure you want to delete this room? This action cannot be undone."
        />

        {/* Add Toast component */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </PageTransition>
  );
}