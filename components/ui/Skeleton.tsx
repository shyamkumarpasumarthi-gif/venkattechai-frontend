/**
 * Skeleton Component
 * Loading placeholder for content
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
  style,
  ...props
}) => {
  const baseClasses = 'bg-secondary-200';

  const variantClasses = {
    text: 'h-4 rounded',
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse', // Simplified for now
    none: '',
  };

  const combinedStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    ...style,
  };

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={combinedStyle}
      {...props}
    />
  );
};

// Predefined skeleton components
const SkeletonText: React.FC<Omit<SkeletonProps, 'variant'>> = (props) => (
  <Skeleton variant="text" {...props} />
);

const SkeletonRectangular: React.FC<Omit<SkeletonProps, 'variant'>> = (props) => (
  <Skeleton variant="rectangular" {...props} />
);

const SkeletonCircular: React.FC<Omit<SkeletonProps, 'variant'>> = (props) => (
  <Skeleton variant="circular" {...props} />
);

// Card skeleton
const SkeletonCard: React.FC = () => (
  <div className="rounded-xl border border-secondary-200 bg-white p-6 shadow-md">
    <div className="space-y-4">
      <SkeletonText width="60%" height={24} />
      <SkeletonText width="100%" height={16} />
      <SkeletonText width="80%" height={16} />
      <div className="flex space-x-2">
        <SkeletonCircular width={32} height={32} />
        <div className="flex-1 space-y-2">
          <SkeletonText width="40%" height={14} />
          <SkeletonText width="60%" height={14} />
        </div>
      </div>
    </div>
  </div>
);

// Table skeleton
const SkeletonTable: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 4,
}) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-4">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <SkeletonText
            key={colIndex}
            width={colIndex === 0 ? '20%' : '25%'}
            height={16}
          />
        ))}
      </div>
    ))}
  </div>
);

export {
  Skeleton,
  SkeletonText,
  SkeletonRectangular,
  SkeletonCircular,
  SkeletonCard,
  SkeletonTable,
};