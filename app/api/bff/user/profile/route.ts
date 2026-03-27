/**
 * User Profile API Routes
 * GET /api/bff/user/profile - Get user profile
 * PUT /api/bff/user/profile - Update user profile
 * PUT /api/bff/user/password - Change password
 */

import { NextRequest, NextResponse } from 'next/server';
import jwtManager from '@/lib/auth/jwt';
import { getLogger } from '@/lib/api/logger';
import type { ApiResponse, User } from '@/types';

const logger = getLogger('user-profile');

// Mock user storage - in real app, use database
const mockUsers: Record<string, User> = {
  'user_123': {
    id: 'user_123',
    email: 'john.doe@example.com',
    name: 'John Doe',
    avatar: undefined,
    role: 'user',
    status: 'active',
    emailVerified: true,
    credits: 1500,
    createdAt: new Date('2024-01-15T00:00:00Z'),
    updatedAt: new Date('2024-03-16T10:00:00Z'),
    lastLogin: new Date('2024-03-16T10:00:00Z'),
  },
};

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Missing or invalid authorization header.', statusCode: 401 } },
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

    // Get user profile
    const user = mockUsers[payload.userId];

    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'User not found', statusCode: 404 } },
        { status: 404 }
      );
    }

    const response: ApiResponse<User> = {
      success: true,
      data: user,
      meta: {
        timestamp: new Date(),
        requestId: `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      },
    };

    logger.info(`User profile fetched for ${payload.userId}`);
    return NextResponse.json(response);

  } catch (error) {
    logger.error('Failed to fetch user profile:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error.', statusCode: 500 } },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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

    // Parse request body
    const body = await request.json();
    const { name, email } = body;

    // Get current user
    const currentUser = mockUsers[payload.userId];
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'User not found', statusCode: 404 } },
        { status: 404 }
      );
    }

    // Validate input
    if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0)) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'Invalid name.', statusCode: 400 } },
        { status: 400 }
      );
    }

    if (email !== undefined && (typeof email !== 'string' || !email.includes('@'))) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'Invalid email.', statusCode: 400 } },
        { status: 400 }
      );
    }

    // Update user profile
    const updatedUser: User = {
      ...currentUser,
      ...(name !== undefined && { name: name.trim() }),
      ...(email !== undefined && { email: email.trim() }),
    };

    mockUsers[payload.userId] = updatedUser;

    const response: ApiResponse<User> = {
      success: true,
      data: updatedUser,
      meta: {
        timestamp: new Date(),
        requestId: `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      },
    };

    logger.info(`User profile updated for ${payload.userId}`);
    return NextResponse.json(response);

  } catch (error) {
    logger.error('Failed to update user profile:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error.', statusCode: 500 } },
      { status: 500 }
    );
  }
}