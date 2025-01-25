'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  Calendar, 
  LogOut, 
  Menu, 
  X, 
  Hotel, 
  Users,
  BookOpen,
  LayoutDashboard,
  LucideIcon,
  Mail
} from 'lucide-react';
import NotificationBell from './NotificationBell';

interface MenuItem {
  label: string;
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
}

const NAV_ITEMS = {

  mainNav: {
    rooms: { href: '/rooms', label: 'Rooms', icon: Hotel },
    dashboard: { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    bookings: { href: '/admin/bookings', label: 'Bookings', icon: BookOpen },
    staff: { href: '/admin/staff', label: 'Staff', icon: Users },
    about: { href: '/about', label: 'About', icon: User },
    contact: { href: '/contact', label: 'Contact', icon: Mail },
    team: { href: '/team', label: 'Our Team', icon: Users },
    adminStaff: { href: '/admin/staff', label: 'Staff Management', icon: Users }
  },

  profileNav: {
    profile: { href: '/profile', label: 'My Profile', icon: User },
    users: { href: '/admin/users', label: 'Manage Users', icon: Users },
    myBookings: { href: '/bookings', label: 'My Bookings', icon: Calendar }
  }
};

const NAVIGATION_CONFIG = {
  admin: {
    mainNav: [
      NAV_ITEMS.mainNav.rooms,
      NAV_ITEMS.mainNav.dashboard,
      NAV_ITEMS.mainNav.bookings,
      NAV_ITEMS.mainNav.adminStaff
    ],
    dropdownNav: [
      NAV_ITEMS.profileNav.profile,
      NAV_ITEMS.profileNav.users
    ]
  },
  customer: {
    mainNav: [
      NAV_ITEMS.mainNav.rooms,
      NAV_ITEMS.mainNav.about,
      NAV_ITEMS.mainNav.team,
      NAV_ITEMS.mainNav.contact
    ],
    dropdownNav: [
      NAV_ITEMS.profileNav.profile,
      NAV_ITEMS.profileNav.myBookings
    ]
  }
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileOpen(false);
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // 3. Update getProfileMenuItems function
  const getProfileMenuItems = (): MenuItem[] => {
    const userRole = user?.role || 'customer';
    
    return [
      ...NAVIGATION_CONFIG[userRole].dropdownNav,
      {
        label: 'Logout',
        icon: LogOut,
        onClick: handleLogout
      }
    ];
  };

  const profileMenuItems = getProfileMenuItems();

  return (
    <>
      <header className="bg-[#1B4D3E] text-white sticky top-0 z-40 shadow-lg">
        <nav className="max-w-full mx-auto px-4 sm:px-6 lg:px-80">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <span className="text-2xl md:text-3xl font-bold tracking-tight">
                Luxe<span className="text-[#8B9D83] group-hover:text-white transition-colors duration-300">Haven</span>
              </span>
            </Link>

            {/* Desktop */}
            <div className="hidden md:flex md:items-center md:space-x-10">
              {NAVIGATION_CONFIG[user?.role || 'customer'].mainNav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-white/90 hover:text-white transition-colors duration-300 
                    text-sm uppercase tracking-wider font-medium after:content-[''] 
                    after:absolute after:w-full after:h-0.5 after:bg-white after:left-0 
                    after:-bottom-1 after:rounded-full after:transform after:scale-x-0 
                    after:origin-right after:transition-transform after:duration-300 
                    hover:after:scale-x-100 hover:after:origin-left"
                >
                  {link.label}
                </Link>
              ))}

              {/* Auth Buttons */}
              {user ? (
                <div className="flex items-center space-x-6 ml-4">
                  <NotificationBell />
                  <div className="relative" ref={profileMenuRef}>
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center space-x-3 text-white hover:text-white/90 transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-full bg-[#8B9D83] flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:bg-[#7A8C72]">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-medium text-sm tracking-wide">{user.name}</span>
                    </button>

                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-1 z-50">
                        {profileMenuItems.map((item, index) => (
                          item.onClick ? (
                            <button
                              key={index}
                              onClick={item.onClick}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-all duration-300 hover:pl-6"
                            >
                              <item.icon className="h-4 w-4 mr-3" />
                              {item.label}
                            </button>
                          ) : (
                            <Link
                              key={index}
                              href={item.href!}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-all duration-300 hover:pl-6"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              <item.icon className="h-4 w-4 mr-3" />
                              {item.label}
                            </Link>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/login"
                    className="text-white hover:text-white/90 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-1.5 border border-[#8B9D83] rounded-full text-white hover:bg-[#8B9D83] transition-all duration-300"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Auth and Toggle */}
            <div className="flex md:hidden items-center space-x-5">
              {user && <NotificationBell />}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-white/80 transition-colors p-2 hover:bg-[#2C5E54] rounded-full"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden">
          <div 
            ref={menuRef}
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-[#1B4D3E] shadow-xl px-6 py-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <Link 
                href="/" 
                className="text-2xl font-bold text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Luxe<span className="text-[#8B9D83]">Haven</span>
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-[#2C5E54] transition-colors"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            <div className="space-y-1">
              <Link 
                href="/rooms" 
                className="block px-3 py-2 rounded-lg text-white hover:bg-[#2C5E54] transition-colors duration-300 after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-white after:left-0 after:-bottom-1 after:rounded-full after:transform after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left"
                onClick={() => setIsMenuOpen(false)}
              >
                Rooms
              </Link>
              <Link 
                href="/about" 
                className="block px-3 py-2 rounded-lg text-white hover:bg-[#2C5E54] transition-colors duration-300 after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-white after:left-0 after:-bottom-1 after:rounded-full after:transform after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="block px-3 py-2 rounded-lg text-white hover:bg-[#2C5E54] transition-colors duration-300 after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-white after:left-0 after:-bottom-1 after:rounded-full after:transform after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </div>

            {user ? (
              <div className="mt-6 pt-6 border-t border-[#2C5E54]">
                <div className="px-3 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#8B9D83] flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-white">{user.name}</div>
                    <div className="text-sm text-white/70">{user.email}</div>
                  </div>
                </div>
                <div className="mt-6 space-y-1">
                  {profileMenuItems.map((item, index) => (
                    item.onClick ? (
                      <button
                        key={`mobile-menu-${index}`}
                        onClick={() => {
                          item.onClick?.();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center w-full px-3 py-2 rounded-lg text-white hover:bg-[#2C5E54] transition-colors duration-300 after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-white after:left-0 after:-bottom-1 after:rounded-full after:transform after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left"
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.label}
                      </button>
                    ) : (
                      <Link
                        key={`mobile-menu-${index}`}
                        href={item.href!}
                        className="flex items-center px-3 py-2 rounded-lg text-white hover:bg-[#2C5E54] transition-colors duration-300 after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-white after:left-0 after:-bottom-1 after:rounded-full after:transform after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.label}
                      </Link>
                    )
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-6 pt-6 border-t border-[#2C5E54] space-y-4">
                <Link
                  href="/login"
                  className="block w-full text-center px-4 py-2 rounded-lg text-white hover:bg-[#2C5E54] transition-colors duration-300 after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-white after:left-0 after:-bottom-1 after:rounded-full after:transform after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block w-full text-center px-4 py-2 rounded-lg border border-[#8B9D83] text-white hover:bg-[#8B9D83] transition-colors duration-300 after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-white after:left-0 after:-bottom-1 after:rounded-full after:transform after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}