import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { adminApp } from './lib/firebase/server-config';

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value;

  const { pathname } = request.nextUrl;

  // Allow access to auth pages and API routes without a session
  if (pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const auth = getAuth(adminApp);
    await auth.verifySessionCookie(sessionCookie, true);
    return NextResponse.next();
  } catch (error) {
    // Session cookie is invalid. Clear it and redirect to login.
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('session');
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
