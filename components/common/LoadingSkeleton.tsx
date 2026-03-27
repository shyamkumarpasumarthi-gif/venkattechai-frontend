/**
 * Loading Skeleton Component
 * Placeholder for loading states
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, count = 1, ...props }, ref) => (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          ref={ref}
          className={cn('rounded-lg bg-secondary-200 animate-pulse', className)}
          {...props}
        />
      ))}
    </>
  )
);

Skeleton.displayName = 'Skeleton';

const LoadingSkeleton: React.FC<{ layout?: 'card' | 'table' | 'list'; className?: string }> = ({
  layout = 'card',
  className = '',
}) => {
  if (layout === 'card') {
    return (
      <div className={cn('space-y-4', className)}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-4 border border-secondary-200 rounded-lg">
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-4 w-2/3 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (layout === 'table') {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 flex-1" />
            <Skeleton className="h-8 w-24" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
};

export { Skeleton, LoadingSkeleton };
