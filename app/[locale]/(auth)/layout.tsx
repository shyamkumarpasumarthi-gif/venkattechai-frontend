/**
 * Auth Layout
 * Layout for authentication pages
 */

import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="w-full max-w-8xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg" />
            <h1 className="text-2xl font-bold text-secondary-900">VenkatAI Studio</h1>
          </div>
          <p className="text-secondary-600 max-w-md mx-auto">
            Enterprise-grade AI media generation platform
          </p>
        </div>

        {/* Content */}
        <div className="flex justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}
