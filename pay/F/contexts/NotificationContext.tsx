'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { socket, connectSocket } from '@/utils/socket';
import { Room } from '@/types/room';

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'room' | 'booking' | 'promo' | 'system' | 'error';
  isRead: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'time' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;
  hasUnreadNotifications: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const hasUnreadNotifications = notifications.some(notification => !notification.isRead);

  const addNotification = (notification: Omit<Notification, 'id' | 'time' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      time: new Date().toISOString(),
      isRead: false,
    };
    console.log('Adding notification:', newNotification);
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  useEffect(() => {
    if (!socket.connected) {
      connectSocket();
    }

    const handleConnect = () => {
      console.log('Socket connected in NotificationContext');
    };

    const handleDisconnect = () => {
      console.log('Socket disconnected in NotificationContext');
      connectSocket();
    };

    const handleRoomCreated = (room: Room) => {
      addNotification({
        title: 'New Room Added',
        message: `${room.name} has been added to inventory`,
        type: 'room'
      });
    };

    const handleRoomUpdated = (room: Room) => {
      addNotification({
        title: 'Room Updated',
        message: `${room.name} has been updated`,
        type: 'room'
      });
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleRoomDeleted = (roomId: string) => {
      addNotification({
        title: 'Room Deleted',
        message: 'A room has been removed from inventory',
        type: 'room'
      });
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('roomCreated', handleRoomCreated);
    socket.on('roomUpdated', handleRoomUpdated);
    socket.on('roomDeleted', handleRoomDeleted);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('roomCreated', handleRoomCreated);
      socket.off('roomUpdated', handleRoomUpdated);
      socket.off('roomDeleted', handleRoomDeleted);
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        clearNotifications,
        hasUnreadNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
