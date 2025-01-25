'use client';

import AdminRoute from '@/components/auth/AdminRoute';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminRoute>
      <div className="min-h-screen md:flex bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 p-4 md:p-8 pt-16 md:pt-8">
          {children}
        </main>
      </div>
    </AdminRoute>
  );
} 