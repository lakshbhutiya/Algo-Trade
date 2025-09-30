
'use server';

import { getAdminApp } from '@/lib/firebase/server-config';
import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const firebaseAuthNotSetup = {
  message:
    'Firebase authentication is not configured correctly. Please check your server environment variables.',
  error: true,
};

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

/**
 * Creates a session cookie for the given ID token.
 * @param idToken The ID token of the user.
 */
export async function createSessionCookie(idToken: string) {
    const adminApp = getAdminApp();
    if (!adminApp) {
        return firebaseAuthNotSetup;
    }

    try {
        const decodedIdToken = await getAuth(adminApp).verifyIdToken(idToken);
        const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

        // Create the session cookie. This will also verify the ID token in the process.
        const sessionCookie = await getAuth(adminApp).createSessionCookie(idToken, { expiresIn });

        cookies().set('session', sessionCookie, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: expiresIn,
            path: '/',
        });

        return { success: true };
    } catch (error) {
        console.error('Session Cookie Error:', error);
        return {
            message: 'Failed to create session.',
            error: true,
        };
    }
}


/**
 * The login function is now primarily a client-side action.
 * This server action is kept for structural consistency but the core logic
 * has moved to the login form to use the client SDK.
 */
export async function login(prevState: any, formData: FormData) {
    // This is intentionally left blank.
    // The client-side form now handles the login and calls createSessionCookie.
    return {
        message: "This action is handled on the client.",
        error: true,
    }
}

export async function signup(prevState: any, formData: FormData) {
  // This is intentionally left blank.
  // The client-side form now handles the signup and calls createSessionCookie.
  return {
    message: "This action is handled on the client.",
    error: true,
  }
}

export async function logout() {
  cookies().delete('session');
  redirect('/login');
}
