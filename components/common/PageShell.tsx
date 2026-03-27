/**
 * PageShell Component
 * Shared frame for dashboard and auth pages
 */

import React from 'react';

interface PageShellProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function PageShell({ title, subtitle, action, children, className }: PageShellProps) {
  return (
    <div className={`space-y-6 animate-fade-in ${className ?? ''}`}>
      <div className="glass-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
            {subtitle && <p className="text-slate-600 mt-1">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      </div>
      {children}
    </div>
  );
}
