import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LoadingProvider } from '@/contexts/LoadingContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import MainLayout from '@/components/layouts/MainLayout';
import { AnimatePresence } from 'framer-motion';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'LuxeHaven - Luxury Hotel & Resort',
  description: 'Experience unparalleled luxury and comfort at LuxeHaven.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <AuthProvider>
            <LoadingProvider>
              <NotificationProvider>
                <AnimatePresence mode="wait">
                  <MainLayout>
                    {children}
                  </MainLayout>
                </AnimatePresence>
              </NotificationProvider>
            </LoadingProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
