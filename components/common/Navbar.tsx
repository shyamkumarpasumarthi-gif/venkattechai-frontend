/**
 * Navbar Component
 * Navigation bar at top of application
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, Sparkles, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { useAuthStore } from '@/lib/api/auth-store';
import { useUIStore } from '@/lib/api/ui-store';

const Navbar: React.FC = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { toggleSidebar } = useUIStore();

  const handleLogout = async () => {
    try {
      await fetch('/api/bff/auth/logout', { method: 'POST' });
      useAuthStore.setState({ user: null, token: null });
      router.push('/en/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md shadow-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Menu + Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="inline-flex p-2 text-secondary-600 hover:bg-secondary-100 rounded-lg lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>

          <Link href="/en/dashboard" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-blue-500 shadow-sm flex items-center justify-center text-white">
              <Sparkles size={18} />
            </div>
            <span className="hidden sm:inline text-lg font-bold text-slate-900">VenkatAI</span>
          </Link>
        </div>

        {/* Right: User Menu */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/en/settings">
                <Button variant="ghost" size="icon">
                  <Settings size={20} />
                </Button>
              </Link>

              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                aria-label="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href="/en/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/en/register">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export { Navbar };
