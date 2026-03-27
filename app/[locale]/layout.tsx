/**
 * Layout - Root
 * Main application layout wrapper
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';

import '@/app/globals.css';
import { Navbar } from '@/components/common/Navbar';
import { Sidebar } from '@/components/common/Sidebar';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VenkatAI Studio - AI Media Generation',
  description: 'Enterprise-grade AI media generation SaaS platform',
  icons: { icon: '/favicon.ico' },
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default function RootLayout({ children, params }: RootLayoutProps) {
  // Validate locale
  const validLocales = ['en', 'de', 'ka'];
  if (!validLocales.includes(params.locale)) {
    notFound();
  }

  return (
    <html lang={params.locale}>
      <head>
        <meta name="csrf-token" content="" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <div className="min-h-screen bg-secondary-50">
            <Navbar />
            <div className="flex">
              <Sidebar />
              <main className="flex-1">
                <div className="p-4 sm:p-6 lg:p-8">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </ErrorBoundary>
      </body>
    </html>
  );
}
