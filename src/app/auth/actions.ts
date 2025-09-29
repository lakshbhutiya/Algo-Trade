"use server";

import { z } from "zod";
import { getAuth } from "firebase-admin/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminApp } from "@/lib/firebase/server-config";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function login(prevState: any, formData: FormData) {
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
    const sessionCookie = await auth.createSessionCookie(user.uid, { expiresIn: 60 * 60 * 24 * 5 * 1000 });
    cookies().set("session", sessionCookie, { httpOnly: true, secure: true });

  } catch (error: any) {
    return {
      message: error.message || "Failed to log in.",
      error: true,
    };
  }

  redirect("/dashboard");
}


export async function signup(prevState: any, formData: FormData) {
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

        // Create session cookie
        const sessionCookie = await auth.createSessionCookie(userRecord.uid, { expiresIn: 60 * 60 * 24 * 5 * 1000 });
        cookies().set("session", sessionCookie, { httpOnly: true, secure: true });

    } catch (error: any) {
        return {
        message: error.message || "Failed to sign up.",
        error: true,
        };
    }

    redirect("/dashboard");
}

export async function logout() {
  cookies().delete("session");
  redirect("/login");
}
