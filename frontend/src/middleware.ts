// Import required Next.js server components
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware function to handle authentication and route protection
export function middleware(request: NextRequest) {
  // Get JWT token from cookies
  const token = request.cookies.get('token');

  // Check if current route is a login/register page
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/register');

  // Check if current route requires authentication
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/admin') || 
                          request.nextUrl.pathname.startsWith('/user');

  // If user is logged in and tries to access login/register pages,
  // redirect them to home page
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If user is not logged in and tries to access protected routes,
  // redirect them to login page
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Allow the request to continue
  return NextResponse.next();
}

// Configure which routes this middleware should run on
export const config = {
  matcher: [
    '/login',
    '/register',
    '/admin/:path*', // Protect all admin routes
    '/user/:path*'   // Protect all user routes
  ]
}; 