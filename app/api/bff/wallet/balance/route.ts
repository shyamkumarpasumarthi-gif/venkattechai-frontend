/**
 * Wallet Balance API Route
 * GET /api/bff/wallet/balance
 */

import { NextRequest, NextResponse } from 'next/server';
import { getLogger } from '@/lib/api/logger';
import jwtManager from '@/lib/auth/jwt';
import type { ApiResponse, WalletBalance } from '@/types';

const logger = getLogger('wallet-balance-api');

export async function GET(request: NextRequest) {
  try {
  
    // JWT Authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required.', statusCode: 401 },
        } as ApiResponse<null>,
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const payload = await jwtManager.verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token.', statusCode: 401 },
        } as ApiResponse<null>,
        { status: 401 }
      );
    }

    // Mock wallet balance - replace with real persistence logic
    const balance: WalletBalance = {
      id: `wallet_${payload.userId}`,
      userId: payload.userId,
      credits: 1250,
      tier: 'pro',
      monthlyCreditsLimit: 5000,
      monthlyCreditsUsed: 220,
      resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    };

    logger.info('Wallet balance fetched successfully', { userId: payload.userId });

    return NextResponse.json({
      success: true,
      data: balance,
      meta: {
        timestamp: new Date(),
        requestId: `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      },
    } as ApiResponse<WalletBalance>);

  } catch (error) {
    logger.error('Failed to fetch wallet balance:', error);

    return NextResponse.json(
      {
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch wallet balance.', statusCode: 500 },
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}