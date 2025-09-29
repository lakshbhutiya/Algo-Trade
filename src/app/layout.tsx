import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import MainLayout from '@/components/layout/main-layout';
import { cookies } from 'next/headers';
import { getAuth } from 'firebase-admin/auth';
import { adminApp } from '@/lib/firebase/server-config';

export const metadata: Metadata = {
  title: 'AlgoTrade AI',
  description: 'AI-powered algorithmic trading platform',
};

async function checkAuth() {
    const sessionCookie = cookies().get('session')?.value;
    if (!sessionCookie) return false;
    try {
        if (!adminApp) return false;
        const auth = getAuth(adminApp);
        await auth.verifySessionCookie(sessionCookie, true);
        return true;
    } catch (error) {
        return false;
    }
}


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const isAuthenticated = await checkAuth();

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {isAuthenticated ? <MainLayout>{children}</MainLayout> : children}
        <Toaster />
      </body>
    </html>
  );
}
