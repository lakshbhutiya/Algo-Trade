
"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { usePathname, useRouter } from "next/navigation";
import MainLayout from "@/components/layout/main-layout";

export default function AuthStateChangeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isPublicPage = pathname.startsWith('/auth');

  useEffect(() => {
    if (!loading) {
      if (user && isPublicPage) {
        router.push("/dashboard");
      } else if (!user && !isPublicPage) {
        router.push("/auth/login");
      }
    }
  }, [user, loading, isPublicPage, router]);
  
  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center">
            <p>Loading...</p>
        </div>
    );
  }

  if (!user && isPublicPage) {
    return <>{children}</>;
  }

  if (user && !isPublicPage) {
    return <MainLayout>{children}</MainLayout>
  }
  
  // Fallback for edge cases, like when user is null and page is not public
  // or user is not null and page is public, during the redirect transition.
  return <div className="flex h-screen items-center justify-center"><p>Loading...</p></div>;
}
