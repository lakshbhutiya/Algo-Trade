
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "@/lib/firebase/config";
import { createSessionCookie } from "@/app/auth/actions";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Logo } from "@/components/icons";


export function SignupForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [pending, setPending] = useState(false);
    const { toast } = useToast();
    const router = useRouter();


    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setPending(true);

        if (password.length < 6) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Password must be at least 6 characters long.",
            });
            setPending(false);
            return;
        }

        try {
            const auth = getAuth(app);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const idToken = await userCredential.user.getIdToken();

            const result = await createSessionCookie(idToken);

            if (result?.error) {
                throw new Error(result.message);
            }

            toast({
                title: "Success",
                description: "Account created successfully.",
            });

            router.push("/dashboard");

        } catch (error: any) {
            let message = "Failed to create account.";
            if (error.code === 'auth/email-already-in-use') {
                message = "An account with this email already exists.";
            } else {
                console.error("Signup Error:", error);
            }

            toast({
                variant: "destructive",
                title: "Error",
                description: message,
            });
        } finally {
            setPending(false);
        }
    };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <Logo className="size-12 text-primary" />
            </div>
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription>
            Enter your details to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                type="password" 
                id="password" 
                name="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <Button type="submit" disabled={pending} className="w-full">
              {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
