/**
 * Admin Users API Route
 * GET /api/bff/admin/users
 */

import { NextRequest, NextResponse } from 'next/server';
import jwtManager from '@/lib/auth/jwt';
import { getLogger } from '@/lib/api/logger';
import type { ApiResponse, User } from '@/types';

const logger = getLogger('admin-users');

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
    const isAdmin = payload.role === 'admin' || payload.userId === 'admin_user';

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Mock users data
    const mockUsers: User[] = Array.from({ length: 100 }, (_, i) => ({
      id: `user_${i + 1}`,
      email: `user${i + 1}@example.com`,
      name: `User ${i + 1}`,
      avatar: undefined,
      role: i === 0 ? 'admin' : 'user',
      status: 'active',
      emailVerified: Math.random() > 0.1,
      credits: 1000 - i * 5,
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      preferences: {
        theme: 'light',
        language: 'en',
        notifications: true,
      },
    }));

    // Apply pagination
    const paginatedUsers = mockUsers.slice(offset, offset + limit);
    const hasMore = offset + limit < mockUsers.length;

    const response: ApiResponse<{
      users: User[];
      total: number;
      hasMore: boolean;
    }> = {
      success: true,
      data: {
        users: paginatedUsers,
        total: mockUsers.length,
        hasMore,
      },
      meta: {
        timestamp: new Date(),
        requestId: `req_${Date.now()}`,
      },
    };

    logger.info(`Admin users fetched by ${payload.userId}, limit: ${limit}, offset: ${offset}`);
    return NextResponse.json(response);

  } catch (error) {
    logger.error('Failed to fetch admin users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}