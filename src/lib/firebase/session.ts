
'use server';

import { getAdminApp } from '@/lib/firebase/server-config';
import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';

/**
 * Verifies the session cookie. If valid, returns the decoded claims.
 * Otherwise, returns null.
 */
export async function verifySessionCookie() {
  const sessionCookie = cookies().get('session')?.value;
  if (!sessionCookie) {
    return null;
  }

  const adminApp = getAdminApp();
  if (!adminApp) {
    console.error('Firebase Admin SDK not initialized.');
    return null;
  }

  try {
    const decodedClaims = await getAuth(adminApp).verifySessionCookie(
      sessionCookie,
      true
    );
    return decodedClaims;
  } catch (error) {
    // Session cookie is invalid or expired.
    console.log('Session verification failed:', error);
    return null;
  }
}
