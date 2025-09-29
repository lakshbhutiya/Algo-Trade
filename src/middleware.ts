import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAdminApp } from '@/lib/firebase/server-config';
import { getAuth } from 'firebase-admin/auth';

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');

  // If there's no session cookie and the user is not on an auth page, redirect to login.
  if (!sessionCookie) {
    if (isAuthPage) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If there is a session cookie, try to verify it.
  const adminApp = getAdminApp();
  if (!adminApp) {
    // If Firebase isn't configured, we can't verify the cookie.
    // Let's redirect to login and clear the potentially invalid cookie.
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('session');
    return response;
  }

  try {
    // Check if the cookie is valid.
    await getAuth(adminApp).verifySessionCookie(sessionCookie, true);

    // If the user is on an auth page but has a valid session, redirect to dashboard.
    if (isAuthPage) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Continue to the requested page if the session is valid.
    return NextResponse.next();
  } catch (error) {
    // If the cookie is invalid, redirect to login and clear the cookie.
    console.log('Session verification failed:', error);
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('session');
    return response;
  }
}

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
};
