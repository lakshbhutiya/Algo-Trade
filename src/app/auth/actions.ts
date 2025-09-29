
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

  const { email, password } = validatedFields.data;

  try {
     // This is a placeholder for actual Firebase Auth login
     // In a real app, you would verify the password. For this demo, we'll just create a session cookie if the user exists.
    const auth = getAuth(adminApp);
    const user = await auth.getUserByEmail(email);

    // Create session cookie
    const idToken = await auth.createCustomToken(user.uid);
    // The client will exchange this for a session cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });


    cookies().set("session", sessionCookie, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

  } catch (error: any) {
    let message = "Failed to log in.";
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        message = "Invalid email or password.";
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

    try {
        const auth = getAuth(adminApp);
        const userRecord = await auth.createUser({
            email,
            password,
        });

        const idToken = await auth.createCustomToken(userRecord.uid);
        const expiresIn = 60 * 60 * 24 * 5 * 1000;
        const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

        cookies().set("session", sessionCookie, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    } catch (error: any) {
        let message = "Failed to sign up.";
        if (error.code === 'auth/email-already-exists') {
            message = "An account with this email already exists.";
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
