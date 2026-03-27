/**
 * Input Component
 * Reusable input field with validation states
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  helper?: string;
  icon?: React.ReactNode;
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, helper, icon, label, type = 'text', ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-secondary-700 mb-1.5">
          {label}
          {props.required && <span className="text-error-600"> *</span>}
        </label>
      )}

      <div className="relative">
        {icon && <span className="absolute left-3 top-3 text-secondary-400">{icon}</span>}

        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-lg border border-secondary-300 bg-white px-4 py-2 text-sm placeholder:text-secondary-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 disabled:cursor-not-allowed disabled:bg-secondary-50 disabled:text-secondary-500',
            icon && 'pl-10',
            error && 'border-error-500 focus:ring-error-500',
            className
          )}
          ref={ref}
          {...props}
        />
      </div>

      {error && <span className="mt-1 block text-xs font-medium text-error-600">{error}</span>}
      {helper && !error && (
        <span className="mt-1 block text-xs text-secondary-500">{helper}</span>
      )}
    </div>
  )
);

Input.displayName = 'Input';

export { Input };
