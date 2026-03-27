/**
 * Button Component
 * Reusable button component with variants
 */

import React, { useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'relative inline-flex items-center justify-center whitespace-nowrap rounded-full font-medium ring-offset-background transition-all duration-250 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg hover:from-sky-600 hover:to-indigo-700',
        secondary: 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100',
        destructive: 'bg-rose-600 text-white hover:bg-rose-700',
        outline: 'border border-slate-300 text-slate-700 hover:bg-slate-100',
        ghost: 'text-slate-700 hover:bg-slate-100',
        link: 'text-sky-600 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-6 text-sm',
        sm: 'h-10 px-4 text-xs',
        lg: 'h-12 px-8 text-base',
        icon: 'h-10 w-10 p-0',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface RipplePoint {
  id: number;
  x: number;
  y: number;
}

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  icon?: React.ReactNode;
}


const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      isLoading = false,
      disabled,
      icon,
      children,
      ...props
    },
    ref
  ) => {
    const [ripples, setRipples] = useState<RipplePoint[]>([]);

    const createRipple = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;
      const newRipple = { id: Date.now(), x, y };

      setRipples((prev) => [...prev.slice(-2), newRipple]);
      window.setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== newRipple.id)), 450);
    };

    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth }), className, 'relative overflow-hidden active:scale-95 transform-gpu transition duration-200')}
        disabled={isLoading || disabled}
        ref={ref}
        onMouseDown={createRipple}
        {...props}
      >
        <div className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-200 hover:opacity-100 bg-gradient-to-r from-[#6366F1]/20 via-[#8B5CF6]/20 to-[#EC4899]/20" />
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            style={{ top: ripple.y, left: ripple.x }}
            className="pointer-events-none absolute h-20 w-20 rounded-full bg-white/30 animate-ripple"
          />
        ))}

        <span className="relative inline-flex items-center justify-center gap-2">
          {isLoading ? (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
          ) : (
            icon && <span>{icon}</span>
          )}
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
