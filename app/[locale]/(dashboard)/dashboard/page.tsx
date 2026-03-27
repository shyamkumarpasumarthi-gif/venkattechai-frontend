/**
 * Dashboard Page
 */

'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { CreditCard } from '@/components/dashboard/CreditCard';
import { JobsList } from '@/components/dashboard/JobsList';
import { Button } from '@/components/ui/Button';
import { PageShell } from '@/components/common/PageShell';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { useWalletStore } from '@/lib/api/wallet-store';
import { useStudioStore } from '@/lib/api/studio-store';
import { DashboardService } from '@/lib/api/dashboard-service';
import type { Job } from '@/types';

export default function DashboardPage() {
  const [stats, setStats] = useState<{
    totalJobs: number;
    successRate: number;
    creditsUsed: number;
  } | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const {
    balance,
    balanceLoading,
    setBalance,
    setBalanceLoading,
  } = useWalletStore();

  const {
    jobs,
    jobsLoading,
    setJobs,
    setJobsLoading,
  } = useStudioStore();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch wallet balance
        setBalanceLoading(true);
        const walletData = await DashboardService.getWalletBalance();
        setBalance(walletData);

        // Fetch recent jobs
        setJobsLoading(true);
        const jobsData = await DashboardService.getRecentJobs(5);
        setJobs(jobsData.jobs);

        // Fetch stats
        setStatsLoading(true);
        const statsData = await DashboardService.getDashboardStats();
        setStats(statsData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Set default values on error
        setStats({
          totalJobs: 0,
          successRate: 0,
          creditsUsed: 0,
        });
      } finally {
        setBalanceLoading(false);
        setJobsLoading(false);
        setStatsLoading(false);
      }
    };

    fetchDashboardData();
  }, [setBalance, setBalanceLoading, setJobs, setJobsLoading]);

  const handleJobClick = (job: Job) => {
    // Navigate to job details or studio
    window.location.href = `/en/studio?job=${job.id}`;
  };

  return (
    <PageShell
      title="Dashboard"
      subtitle="Welcome back to your VenkatAI Studio workspace"
      action={
        <Link href="/en/studio" className="self-start md:self-auto">
          <Button icon={<Sparkles size={18} />} className="shadow-lg">Start Creating</Button>
        </Link>
      }
    >
      <div className="space-y-6">

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Credits Card */}
        {balanceLoading ? (
          <LoadingSkeleton layout="card" />
        ) : balance ? (
          <CreditCard
            credits={balance.credits}
            monthlyLimit={balance.monthlyCreditsLimit}
            monthlyUsed={balance.monthlyCreditsUsed}
          />
        ) : (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-secondary-500">Unable to load credits</p>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        {statsLoading ? (
          <>
            <LoadingSkeleton layout="card" />
            <LoadingSkeleton layout="card" />
          </>
        ) : stats ? (
          <>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-secondary-600">Total Jobs</p>
                  <p className="text-3xl font-bold text-secondary-900 mt-1">{stats.totalJobs}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-secondary-600">Success Rate</p>
                  <p className="text-3xl font-bold text-success-600 mt-1">{stats.successRate}%</p>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-secondary-500">Unable to load stats</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-secondary-500">Unable to load stats</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Recent Jobs */}
      <JobsList
        jobs={jobs}
        isLoading={jobsLoading}
        onJobClick={handleJobClick}
      />

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-secondary-600">New to VenkatAI? Check out our guides:</p>
            <ul className="space-y-2 text-sm">
              <li>• Learn about our AI tools</li>
              <li>• Create your first video</li>
              <li>• Manage your API keys</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-secondary-600">Have questions?</p>
            <div className="space-y-2">
              <Button variant="outline" fullWidth size="sm">Documentation</Button>
              <Button variant="outline" fullWidth size="sm">Contact Support</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </PageShell>
  );
}
