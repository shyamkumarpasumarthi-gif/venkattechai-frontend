import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VenkatTech AI Studio',
  description: 'AI Media Generation platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300">{children}</body>
    </html>
  );
}
