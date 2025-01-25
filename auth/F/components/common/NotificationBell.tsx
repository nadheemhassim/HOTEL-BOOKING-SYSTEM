import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import NotificationList from './NotificationList';
import { useNotifications } from '@/contexts/NotificationContext';

interface NotificationBellProps {
  className?: string;
}

export default function NotificationBell({ className = '' }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, hasUnreadNotifications, markAsRead } = useNotifications();
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={bellRef}>
      <button
        className={`relative p-2 text-white/90 hover:text-white transition-all duration-300 hover:bg-[#2C5E54] rounded-full focus:outline-none focus:ring-2 focus:ring-white/20 hover:shadow-lg ${className}`}
        onClick={toggleNotifications}
      >
        <Bell className="h-5 w-5" />
        {hasUnreadNotifications && (
          <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full animate-pulse shadow-md"></span>
        )}
      </button>

      {isOpen && (
        <NotificationList
          notifications={notifications}
          onClose={() => setIsOpen(false)}
          onMarkAsRead={markAsRead}
        />
      )}
    </div>
  );
}
