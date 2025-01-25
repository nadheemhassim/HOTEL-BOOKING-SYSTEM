'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Hotel,
  BookOpen,
  Users,
  ChevronLeft,
  LogOut,
  User,
  Menu,
  MessageSquare,
  Headphones,
  Gift
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Hotel, label: 'Rooms', href: '/admin/rooms' },
  { icon: BookOpen, label: 'Bookings', href: '/admin/bookings' },
  { icon: Users, label: 'Users', href: '/admin/users' },
  { icon: Gift, label: 'Special Offers', href: '/admin/promos' },
  { icon: MessageSquare, label: 'Testimonials', href: '/admin/testimonials' },
  { icon: Headphones, label: 'Services', href: '/admin/services' },
  { icon: Users, label: 'Staff', href: '/admin/staff' }
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 p-2 rounded-lg bg-[#1B4D3E] text-white md:hidden z-50"
      >
        <Menu className="h-6 w-6" />
      </button>

      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside 
        className={`fixed md:sticky top-0 h-screen bg-[#1B4D3E] text-white
          transition-all duration-300 ease-in-out z-50
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'left-0' : '-left-full md:left-0'}`}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-10 bg-[#1B4D3E] p-1 rounded-full hidden md:block"
        >
          <ChevronLeft className={`h-4 w-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>

        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-[#8B9D83] flex items-center justify-center flex-shrink-0">
              <User className="h-6 w-6" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-semibold truncate">{user?.name}</h2>
                <p className="text-xs text-white/70 truncate">{user?.email}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-3 my-1 text-sm rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-[#2C5E54] text-white' 
                    : 'text-white/80 hover:bg-[#2C5E54] hover:text-white'
                  }`}
                onClick={() => setIsMobileOpen(false)}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span className="ml-3">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 w-full p-4">
          <button
            onClick={handleLogout}
            className={`flex items-center px-3 py-3 text-sm text-white/80 hover:bg-[#2C5E54] hover:text-white rounded-lg w-full transition-colors
              ${isCollapsed ? 'justify-center' : ''}`}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}