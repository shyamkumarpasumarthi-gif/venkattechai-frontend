/**
 * API Keys Management API Routes
 * GET /api/bff/api-keys - List user's API keys
 * POST /api/bff/api-keys - Create new API key
 * DELETE /api/bff/api-keys/[keyId] - Delete API key
 */

import { NextRequest, NextResponse } from 'next/server';
import jwtManager from '@/lib/auth/jwt';
import { getLogger } from '@/lib/api/logger';
import { randomBytes } from 'crypto';
import type { ApiResponse, ApiKey } from '@/types';

const logger = getLogger('api-keys');

// Mock storage - in real app, use database
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

    // Get user's API keys
    const userKeys = mockApiKeys.filter(key => key.userId === payload.userId);

    const response: ApiResponse<ApiKey[]> = {
      success: true,
      data: userKeys,
      meta: {
        timestamp: new Date(),
        requestId: `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      },
    };

    logger.info(`API keys fetched for user ${payload.userId}`);
    return NextResponse.json(response);

  } catch (error) {
    logger.error('Failed to fetch API keys:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    // Parse request body
    const body = await request.json();
    const { name, permissions = ['read'] } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'API key name is required' },
        { status: 400 }
      );
    }

    // Generate new API key
    const keyId = `key_${Date.now()}_${randomBytes(4).toString('hex')}`;
    const apiKey = `pk_${randomBytes(16).toString('hex')}`;

    const newKey: ApiKey = {
      id: keyId,
      userId: payload.userId,
      name: name.trim(),
      key: apiKey,
      keyPrefix: 'pk_',
      status: 'active',
      rateLimit: 1000,
      lastUsedAt: undefined,
      createdAt: new Date(),
      permissions: Array.isArray(permissions) ? permissions : ['read'],
    };

    // Save to mock storage
    mockApiKeys.push(newKey);

    const response: ApiResponse<ApiKey> = {
      success: true,
      data: newKey,
      meta: {
        timestamp: new Date(),
        requestId: `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      },
    };

    logger.info(`New API key created for user ${payload.userId}: ${keyId}`);
    return NextResponse.json(response);

  } catch (error) {
    logger.error('Failed to create API key:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}