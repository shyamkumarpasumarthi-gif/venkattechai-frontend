/**
 * Admin Stats API Route
 * GET /api/bff/admin/stats
 */

import { NextRequest, NextResponse } from 'next/server';
import jwtManager from '@/lib/auth/jwt';
import { getLogger } from '@/lib/api/logger';
import type { ApiResponse } from '@/types';

const logger = getLogger('admin-stats');

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const payload = await jwtManager.verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Check if user is admin
    // In a real app, check user role from database
    const isAdmin = payload.role === 'admin' || payload.userId === 'admin_user';

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Mock admin stats
    const stats = {
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
    };

    const response: ApiResponse<typeof stats> = {
      success: true,
      data: stats,
      meta: {
        timestamp: new Date(),
        requestId: `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      },
    };

    logger.info(`Admin stats fetched by user ${payload.userId}`);
    return NextResponse.json(response);

  } catch (error) {
    logger.error('Failed to fetch admin stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}