
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionCookie } from '@/lib/firebase/session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');

  const claims = await verifySessionCookie();

  if (!claims) {
    if (isAuthPage) {
      return NextResponse.next();
    }
    // If not authenticated and not on an auth page, redirect to login.
    const response = NextResponse.redirect(new URL('/login', request.url));
    // Clear the potentially invalid cookie
    response.cookies.delete('session');
    return response;
  }

  // If authenticated and on an auth page, redirect to the dashboard.
  if (isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Allow the request to proceed.
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
  runtime: 'nodejs', // This is crucial for Firebase Admin SDK
};
