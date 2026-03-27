/**
 * Change Password API Route
 * PUT /api/bff/user/password
 */

import { NextRequest, NextResponse } from 'next/server';
import jwtManager from '@/lib/auth/jwt';
import { getLogger } from '@/lib/api/logger';
import type { ApiResponse } from '@/types';

const logger = getLogger('change-password');

export async function PUT(request: NextRequest) {
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

    // Parse request body
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'Current password and new password are required.', statusCode: 400 } },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'New password must be at least 8 characters long.', statusCode: 400 } },
        { status: 400 }
      );
    }

    // In a real app, verify current password against stored hash
    // For demo, we'll just simulate success
    const isCurrentPasswordValid = currentPassword === 'currentpass123'; // Mock validation

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'Current password is incorrect.', statusCode: 400 } },
        { status: 400 }
      );
    }

    // In a real app, hash and store the new password
    // For demo, just log the change
    logger.info(`Password changed for user ${payload.userId}`);

    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: 'Password changed successfully' },
      meta: {
        timestamp: new Date(),
        requestId: `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      },
    };

    return NextResponse.json(response);

  } catch (error) {
    logger.error('Failed to change password:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error.', statusCode: 500 } },
      { status: 500 }
    );
  }
}