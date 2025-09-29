import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import MainLayout from '@/components/layout/main-layout';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'AlgoTrade AI',
  description: 'AI-powered algorithmic trading platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = cookies().get("session")?.value;
  const isAuthPage = false; // This will be determined by the page itself in a real app

  const showMainLayout = session && !isAuthPage;

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {showMainLayout ? <MainLayout>{children}</MainLayout> : children}
        <Toaster />
      </body>
    </html>
  );
}
