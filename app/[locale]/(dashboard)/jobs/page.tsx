/**
 * Jobs Page
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { PageShell } from '@/components/common/PageShell';
import { Search, Download, RefreshCw } from 'lucide-react';
import { useStudioStore } from '@/lib/api/studio-store';
import { DashboardService } from '@/lib/api/dashboard-service';
import { formatDate } from '@/lib/utils';
import type { Job } from '@/types';

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    jobs,
    jobsLoading,
    setJobs,
    setJobsLoading,
  } = useStudioStore();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setJobsLoading(true);
        const jobsData = await DashboardService.getRecentJobs(50); // Get more jobs for the full page
        setJobs(jobsData.jobs);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setJobsLoading(false);
      }
    };

    fetchJobs();
  }, [setJobs, setJobsLoading]);

  useEffect(() => {
    // Filter jobs based on search term
    if (searchTerm.trim() === '') {
      setFilteredJobs(jobs);
    } else {
      const filtered = jobs.filter(job =>
        job.toolType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredJobs(filtered);
    }
  }, [jobs, searchTerm]);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      const jobsData = await DashboardService.getRecentJobs(50);
      setJobs(jobsData.jobs);
    } catch (error) {
      console.error('Failed to refresh jobs:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDownload = (job: Job) => {
    // TODO: Implement download functionality
    console.log('Download job:', job.id);
  };

  const statusColors = {
    pending: 'warning',
    processing: 'info',
    completed: 'success',
    failed: 'error',
    cancelled: 'secondary',
  } as const;

  return (
    <PageShell
      title="Jobs"
      subtitle="Manage your AI generation tasks"
      action={
        <Button
          variant="outline"
          icon={<RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />}
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          Refresh
        </Button>
      }
    >

      {/* Search & Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Input
              placeholder="Search jobs..."
              icon={<Search size={18} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline">Export</Button>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Jobs</CardTitle>
          <CardDescription>
            {jobsLoading ? 'Loading...' : `${filteredJobs.length} jobs`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {jobsLoading ? (
            <LoadingSkeleton layout="table" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-secondary-200">
                    <th className="text-left py-2 px-4 font-medium">Tool</th>
                    <th className="text-left py-2 px-4 font-medium">Status</th>
                    <th className="text-left py-2 px-4 font-medium">Progress</th>
                    <th className="text-left py-2 px-4 font-medium">Created</th>
                    <th className="text-left py-2 px-4 font-medium">Credits</th>
                    <th className="text-left py-2 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-secondary-500">
                        {searchTerm ? 'No jobs match your search.' : 'No jobs yet. Start creating!'}
                      </td>
                    </tr>
                  ) : (
                    filteredJobs.map((job) => (
                      <tr key={job.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                        <td className="py-3 px-4 font-medium capitalize">
                          {job.toolType.replace(/_/g, ' ')}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={statusColors[job.status] || 'default'}>
                            {job.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="w-full bg-secondary-100 rounded-full h-2 max-w-24">
                            <div
                              className="h-full bg-primary-500 rounded-full transition-all"
                              style={{ width: `${job.progress}%` }}
                            />
                          </div>
                        </td>
                        <td className="py-3 px-4 text-secondary-600">
                          {formatDate(job.createdAt)}
                        </td>
                        <td className="py-3 px-4">{job.creditsCost}</td>
                        <td className="py-3 px-4">
                          {job.status === 'completed' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={<Download size={16} />}
                              onClick={() => handleDownload(job)}
                            >
                              Download
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </PageShell>
  );
}
