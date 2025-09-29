
"use server";

import { z } from "zod";
import { getAuth } from "firebase-admin/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminApp } from "@/lib/firebase/server-config";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const firebaseAuthNotSetup = {
    message: "Firebase authentication is not configured correctly. Please check your server environment variables.",
    error: true,
};

// NOTE: This login function is for demonstration purposes only and is NOT SECURE.
// The Firebase Admin SDK (server-side) cannot verify passwords directly.
// In a production app, you should use the client-side SDK to sign the user in,
// get an ID token, and send that token to the server to create a session cookie.
export async function login(prevState: any, formData: FormData) {
  const adminApp = getAdminApp();
  if (!adminApp) {
      return firebaseAuthNotSetup;
  }

  const validatedFields = loginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message: "Invalid email or password format.",
      error: true,
    };
  }

  const { email } = validatedFields.data;
  const auth = getAuth(adminApp);

  try {
    // 1. Get the user by email. This doesn't verify the password.
    const user = await auth.getUserByEmail(email);

    // 2. Create a session cookie.
    // In this insecure demo, we're creating a session for any existing user.
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    // We create a custom token and then immediately create a session cookie from it.
    // THIS IS A WORKAROUND because we can't create a session cookie directly from a UID.
    // The proper flow requires an ID token from the client.
    const customToken = await auth.createCustomToken(user.uid);
    // This is an undocumented way to simulate the client-side token exchange for demo purposes.
    const sessionCookie = await auth.createSessionCookie(customToken, { expiresIn });
    
    cookies().set("session", sessionCookie, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

  } catch (error: any) {
    let message = "Failed to log in.";
    if (error.code === 'auth/user-not-found') {
        message = "Invalid email or password.";
    } else {
        console.error("Login Error:", error);
    }
    return {
      message: message,
      error: true,
    };
  }

  redirect("/dashboard");
}


export async function signup(prevState: any, formData: FormData) {
    const adminApp = getAdminApp();
    if (!adminApp) {
        return firebaseAuthNotSetup;
    }

    const validatedFields = signupSchema.safeParse(
        Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
        return {
        message: "Invalid email or password format. Password must be at least 6 characters.",
        error: true,
        };
    }

    const { email, password } = validatedFields.data;
    const auth = getAuth(adminApp);

    try {
        // 1. Create the user in Firebase Auth
        const userRecord = await auth.createUser({
            email,
            password,
        });

        // 2. Create a session cookie for the new user
        const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
        // This is a workaround for server actions. A proper flow involves the client SDK.
        const customToken = await auth.createCustomToken(userRecord.uid);
        const sessionCookie = await auth.createSessionCookie(customToken, { expiresIn });

        // 3. Set the session cookie in the browser
        cookies().set("session", sessionCookie, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    } catch (error: any) {
        let message = "An unknown error occurred during sign up.";
        if (error.code === 'auth/email-already-exists') {
            message = "An account with this email already exists.";
        } else if (error.code === 'auth/invalid-password') {
            message = "Password must be at least 6 characters long.";
        } else {
           console.error("Signup Error:", error);
        }
        return {
            message: message,
            error: true,
        };
    }

    redirect("/dashboard");
}

export async function logout() {
  cookies().delete("session");
  redirect("/login");
}
