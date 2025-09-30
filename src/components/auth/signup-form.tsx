
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export function SignupForm() {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [dmatAccountNumber, setDmatAccountNumber] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const { signup } = useAuth();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (dmatAccountNumber.length !== 14 || !/^\d+$/.test(dmatAccountNumber)) {
        toast({
            variant: "destructive",
            title: "Invalid DMAT Number",
            description: "DMAT Account Number must be exactly 14 digits.",
        });
        return;
    }
    setLoading(true);
    try {
      await signup(email, password, firstName, lastName, dmatAccountNumber);
      toast({
        title: "Success",
        description: "Account created successfully. Welcome!",
      });
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: error.message || "An unknown error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
            id="firstName"
            placeholder="John"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={loading}
            />
        </div>
        <div className="grid gap-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
            id="lastName"
            placeholder="Doe"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={loading}
            />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="dmatAccountNumber">DMAT Account Number</Label>
        <Input
          id="dmatAccountNumber"
          placeholder="14-digit number"
          required
          value={dmatAccountNumber}
          onChange={(e) => setDmatAccountNumber(e.target.value)}
          disabled={loading}
          maxLength={14}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
         <p className="text-sm text-muted-foreground">Password must be at least 6 characters.</p>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Create account
      </Button>
      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link href="/auth/login" className="underline">
          Log in
        </Link>
      </div>
    </form>
  );
}
