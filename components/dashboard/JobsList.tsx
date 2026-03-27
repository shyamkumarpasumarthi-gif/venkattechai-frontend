/**
 * Jobs List Component
 * Displays user's processing jobs
 */

'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { formatRelativeTime } from '@/lib/utils';
import type { Job } from '@/types';

interface JobsListProps {
  jobs: Job[];
  isLoading?: boolean;
  onJobClick?: (job: Job) => void;
}

const statusColors = {
  pending: 'warning',
  processing: 'info',
  completed: 'success',
  failed: 'error',
  cancelled: 'secondary',
} as const;

const JobsList: React.FC<JobsListProps> = ({ jobs, isLoading, onJobClick }) => {
  if (isLoading) {
    return <LoadingSkeleton layout="list" />;
  }

  if (jobs.length === 0) {
    return (
      <Card>
        <CardContent className="pt-12 text-center">
          <p className="text-secondary-500 text-sm">No jobs yet. Start creating!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Jobs</CardTitle>
        <CardDescription>Your AI generation tasks</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {jobs.map((job) => (
            <div
              key={job.id}
              onClick={() => onJobClick?.(job)}
              className="p-3 rounded-lg border border-secondary-200 hover:border-primary-300 hover:bg-primary-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium capitalize">{job.toolType.replace(/_/g, ' ')}</span>
                <Badge variant={statusColors[job.status] || 'default'}>
                  {job.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs text-secondary-600">
                <span>{formatRelativeTime(job.createdAt)}</span>
                <span>Cost: {job.creditsCost} credits</span>
              </div>
              <div className="mt-2 w-full bg-secondary-100 rounded-full h-1">
                <div
                  className="h-full bg-primary-500 rounded-full transition-all"
                  style={{ width: `${job.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export { JobsList };
