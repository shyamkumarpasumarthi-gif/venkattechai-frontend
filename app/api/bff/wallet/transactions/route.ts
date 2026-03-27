/**
 * Wallet Transactions API Route
 * GET /api/bff/wallet/transactions
 */

import { NextRequest, NextResponse } from 'next/server';
import jwtManager from '@/lib/auth/jwt';
import { getLogger } from '@/lib/api/logger';
import type { ApiResponse, CreditTransaction } from '@/types';

const logger = getLogger('wallet-transactions');

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

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Mock transactions data - in real app, fetch from database
    const mockTransactions: CreditTransaction[] = [
      {
        id: 'txn_1',
        userId: payload.userId,
        type: 'purchase',
        amount: 1000,
        description: 'Credit purchase',
        createdAt: new Date('2024-03-15T10:00:00Z'),
        balanceBefore: 200,
        balanceAfter: 1200,
        metadata: { paymentMethod: 'stripe', plan: 'starter' },
      },
      {
        id: 'txn_2',
        userId: payload.userId,
        type: 'usage',
        amount: -15,
        description: 'Text to Video generation',
        createdAt: new Date('2024-03-14T15:30:00Z'),
        balanceBefore: 1200,
        balanceAfter: 1185,
        metadata: { tool: 'text_to_video', jobId: 'job_123' },
      },
      {
        id: 'txn_3',
        userId: payload.userId,
        type: 'usage',
        amount: -5,
        description: 'Face Swap processing',
        createdAt: new Date('2024-03-14T12:00:00Z'),
        balanceBefore: 1185,
        balanceAfter: 1180,
        metadata: { tool: 'face_swap', jobId: 'job_124' },
      },
      {
        id: 'txn_4',
        userId: payload.userId,
        type: 'bonus',
        amount: 50,
        description: 'Welcome bonus',
        createdAt: new Date('2024-03-10T09:00:00Z'),
        balanceBefore: 1300,
        balanceAfter: 1350,
        metadata: { reason: 'account_creation' },
      },
      {
        id: 'txn_5',
        userId: payload.userId,
        type: 'usage',
        amount: -2,
        description: 'Background removal',
        createdAt: new Date('2024-03-13T16:45:00Z'),
        balanceBefore: 1180,
        balanceAfter: 1178,
        metadata: { tool: 'background_removal', jobId: 'job_125' },
      },
    ];

    // Apply pagination
    const paginatedTransactions = mockTransactions.slice(offset, offset + limit);
    const hasMore = offset + limit < mockTransactions.length;

    const response: ApiResponse<{
      transactions: CreditTransaction[];
      total: number;
      hasMore: boolean;
    }> = {
      success: true,
      data: {
        transactions: paginatedTransactions,
        total: mockTransactions.length,
        hasMore,
      },
      meta: {
        timestamp: new Date(),
        requestId: `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      },
    };

    logger.info(`Transactions fetched for user ${payload.userId}, limit: ${limit}, offset: ${offset}`);
    return NextResponse.json(response);

  } catch (error) {
    logger.error('Failed to fetch wallet transactions:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error.', statusCode: 500 } },
      { status: 500 }
    );
  }
}