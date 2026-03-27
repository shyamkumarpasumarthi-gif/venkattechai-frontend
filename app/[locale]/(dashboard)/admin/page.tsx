/**
 * Admin Page
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { PageShell } from '@/components/common/PageShell';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalJobs: number;
  jobsToday: number;
  revenue: {
    mtd: number;
    ytd: number;
    growth: number;
  };
  credits: {
    totalSold: number;
    usedToday: number;
    avgPerUser: number;
  };
  system: {
    uptime: number;
    apiLatency: number;
    errorRate: number;
  };
}

const data = [
  { month: 'Jan', users: 400, jobs: 240, revenue: 2400 },
  { month: 'Feb', users: 600, jobs: 320, revenue: 2210 },
  { month: 'Mar', users: 800, jobs: 450, revenue: 2290 },
];

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        // In a real app, you'd call an admin stats endpoint
        // For now, we'll use mock data
        setStats({
          totalUsers: 1234,
          activeUsers: 856,
          totalJobs: 15420,
          jobsToday: 127,
          revenue: {
            mtd: 45230,
            ytd: 387650,
            growth: 12.5,
          },
          credits: {
            totalSold: 98750,
            usedToday: 2340,
            avgPerUser: 89,
          },
          system: {
            uptime: 99.8,
            apiLatency: 45,
            errorRate: 0.02,
          },
        });
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (isLoading || !stats) {
    return (
      <PageShell title="Admin Panel" subtitle="System overview and management">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <LoadingSkeleton className="h-4 w-20 mb-2" />
                <LoadingSkeleton className="h-8 w-16 mb-2" />
                <LoadingSkeleton className="h-4 w-12" />
              </CardContent>
            </Card>
          ))}
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="Admin Panel" subtitle="System overview and management">
      <div className="rounded-2xl border border-white/40 bg-gradient-to-r from-indigo-50 to-fuchsia-50 p-5">
        <h1 className="text-3xl font-bold text-secondary-900">Admin Panel</h1>
        <p className="text-secondary-600 mt-1">System overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-secondary-600">Total Users</p>
            <p className="text-3xl font-bold text-secondary-900 mt-2">{stats.totalUsers.toLocaleString()}</p>
            <Badge variant="success" className="mt-2">+12.5%</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-secondary-600">Active Jobs</p>
            <p className="text-3xl font-bold text-secondary-900 mt-2">{stats.jobsToday}</p>
            <Badge variant="warning" className="mt-2">Processing</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-secondary-600">Revenue (MTD)</p>
            <p className="text-3xl font-bold text-secondary-900 mt-2">${stats.revenue.mtd.toLocaleString()}</p>
            <Badge variant="success" className="mt-2">+{stats.revenue.growth}%</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-secondary-600">System Uptime</p>
            <p className="text-3xl font-bold text-secondary-900 mt-2">{stats.system.uptime}%</p>
            <Badge variant="success" className="mt-2">Healthy</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Analytics</CardTitle>
          <CardDescription>Users, jobs, and revenue trends</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="users" fill="#0ea5e9" name="Users" />
              <Bar dataKey="jobs" fill="#22c55e" name="Jobs" />
              <Bar dataKey="revenue" fill="#f97316" name="Revenue ($)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded hover:bg-secondary-50">
                <div className="text-sm">
                  <p className="font-medium">User signup detected</p>
                  <p className="text-xs text-secondary-500">2 hours ago</p>
                </div>
                <Badge variant="secondary">New User</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
          <CardDescription>Current system performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-secondary-900">{stats.system.uptime}%</p>
              <p className="text-sm text-secondary-600">Uptime</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-secondary-900">{stats.system.apiLatency}ms</p>
              <p className="text-sm text-secondary-600">Avg API Latency</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-secondary-900">{(stats.system.errorRate * 100).toFixed(2)}%</p>
              <p className="text-sm text-secondary-600">Error Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
