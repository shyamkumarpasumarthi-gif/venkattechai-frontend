/**
 * Dashboard Stats API Route
 * GET /api/bff/dashboard/stats
 */

import { NextRequest, NextResponse } from 'next/server';
import jwtManager from '@/lib/auth/jwt';
import { getLogger } from '@/lib/api/logger';
import type { ApiResponse } from '@/types';

const logger = getLogger('dashboard-stats');

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
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token.', statusCode: 401 } },
        { status: 401 }
      );
    }

    // Mock dashboard stats - in real app, fetch from database
    const stats = {
      totalJobs: 1247,
      successRate: 94.2,
      creditsUsed: 15420,
    };

    const response: ApiResponse<typeof stats> = {
      success: true,
      data: stats,
      meta: {
        timestamp: new Date(),
        requestId: `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      },
    };

    logger.info(`Dashboard stats fetched for user ${payload.userId}`);
    return NextResponse.json(response);

  } catch (error) {
    logger.error('Failed to fetch dashboard stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error.', statusCode: 500 },
      },
      { status: 500 }
    );
  }
}