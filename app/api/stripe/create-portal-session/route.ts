/**
 * Create Stripe Customer Portal Session API Route
 * POST /api/stripe/create-portal-session
 */

import { NextRequest, NextResponse } from 'next/server';
import jwtManager from '@/lib/auth/jwt';
import { getLogger } from '@/lib/api/logger';
import Stripe from 'stripe';
import type { ApiResponse } from '@/types';

const logger = getLogger('create-portal-session');

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

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
    const { returnUrl } = body;

    // In a real app, get the customer's Stripe customer ID from your database
    // For demo, we'll use a mock customer ID
    const customerId = 'cus_mock_customer_id';

    // Create customer portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/wallet`,
    });

    const response: ApiResponse<{ url: string }> = {
      success: true,
      data: { url: session.url },
      meta: {
        timestamp: new Date(),
        requestId: `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      },
    };

    logger.info(`Customer portal session created for user ${payload.userId}`);
    return NextResponse.json(response);

  } catch (error) {
    logger.error('Failed to create customer portal session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}