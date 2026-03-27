/**
 * Delete API Key API Route
 * DELETE /api/bff/api-keys/[keyId]
 */

import { NextRequest, NextResponse } from 'next/server';
import jwtManager from '@/lib/auth/jwt';
import { getLogger } from '@/lib/api/logger';
import type { ApiResponse, ApiKey } from '@/types';

const logger = getLogger('delete-api-key');

// Mock storage reference - in real app, use database
// This would be shared with the main api-keys route
const mockApiKeys: ApiKey[] = [
  {
    id: 'key_1',
    userId: 'user_123',
    name: 'Production API Key',
    key: 'pk_live_51234567890',
    keyPrefix: 'pk_live',
    status: 'active',
    rateLimit: 1000,
    lastUsedAt: new Date('2024-03-16T10:30:00Z'),
    createdAt: new Date('2024-01-15T00:00:00Z'),
    permissions: ['read', 'write', 'admin'],
  },
];

export async function DELETE(
  request: NextRequest,
  { params }: { params: { keyId: string } }
) {
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

    const { keyId } = params;

    // Find the API key
    const keyIndex = mockApiKeys.findIndex(key => key.id === keyId);

    if (keyIndex === -1) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      );
    }

    const apiKey = mockApiKeys[keyIndex];

    // Verify ownership
    if (apiKey.userId !== payload.userId) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this API key' },
        { status: 403 }
      );
    }

    // Delete the key
    mockApiKeys.splice(keyIndex, 1);

    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: 'API key deleted successfully' },
      meta: {
        timestamp: new Date(),
        requestId: `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      },
    };

    logger.info(`API key deleted: ${keyId} by user ${payload.userId}`);
    return NextResponse.json(response);

  } catch (error) {
    logger.error('Failed to delete API key:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}