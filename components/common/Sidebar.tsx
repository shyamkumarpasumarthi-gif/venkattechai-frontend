/**
 * Sidebar Component
 * Navigation menu for authenticated users
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Sparkles,
  Briefcase,
  Wallet,
  Key,
  Settings,
  Shield,
  X,
} from 'lucide-react';
import { useUIStore } from '@/lib/api/ui-store';
import { useAuthStore } from '@/lib/api/auth-store';
import { cn } from '@/lib/utils';

interface NavLink {
  label: string;
  href: string;
  icon: React.ReactNode;
  admin?: boolean;
}

const navLinks: NavLink[] = [
  { label: 'Dashboard', href: '/en/dashboard', icon: <LayoutDashboard size={20} /> },
  { label: 'AI Studio', href: '/en/studio', icon: <Sparkles size={20} /> },
  { label: 'Jobs', href: '/en/jobs', icon: <Briefcase size={20} /> },
  { label: 'Wallet', href: '/en/wallet', icon: <Wallet size={20} /> },
  { label: 'API Keys', href: '/en/api-keys', icon: <Key size={20} /> },
  { label: 'Settings', href: '/en/settings', icon: <Settings size={20} /> },
  { label: 'Admin', href: '/en/admin', icon: <Shield size={20} />, admin: true },
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { isSidebarOpen, setSidebarOpen } = useUIStore();
  const { user } = useAuthStore();

  const lilinks = navLinks.filter((link) => !link.admin || user?.role === 'admin');

  return (
    <>
      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-16 z-40 w-64 h-[calc(100vh-4rem)] border-r border-slate-200 bg-white/80 backdrop-blur-xl shadow-xl overflow-y-auto transition-transform transform lg:sticky lg:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-4 space-y-2">
          {/* Close button (mobile) */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="mb-4 inline-flex p-2 text-secondary-600 hover:bg-secondary-100 rounded-lg lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>

          {/* Navigation Links */}
          {lilinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200',
                  isActive
                    ? 'bg-sky-50 text-sky-700 ring-1 ring-sky-200 shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                )}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
};

export { Sidebar };
