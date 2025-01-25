'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';

export default function ProtectedRoute({
  children,
  allowedRoles = ['customer', 'admin'],
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
    if (user && !allowedRoles.includes(user.role)) {
      router.push('/');
    }
  }, [loading, isAuthenticated, user, router, allowedRoles]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
} 