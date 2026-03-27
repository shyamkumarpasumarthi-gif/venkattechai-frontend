/**
 * Create Stripe Checkout Session API Route
 * POST /api/stripe/create-checkout-session
 */

import { NextRequest, NextResponse } from 'next/server';
import jwtManager from '@/lib/auth/jwt';
import { getLogger } from '@/lib/api/logger';
import Stripe from 'stripe';
import type { ApiResponse } from '@/types';

const logger = getLogger('create-checkout-session');

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Credit packages
const CREDIT_PACKAGES = {
  starter: { credits: 500, price: 999, name: 'Starter Pack' },    // $9.99
  professional: { credits: 1500, price: 2499, name: 'Professional Pack' }, // $24.99
  enterprise: { credits: 5000, price: 6999, name: 'Enterprise Pack' },     // $69.99
};

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
    const { packageType, successUrl, cancelUrl } = body;

    if (!packageType || !CREDIT_PACKAGES[packageType as keyof typeof CREDIT_PACKAGES]) {
      return NextResponse.json(
        { error: 'Invalid package type' },
        { status: 400 }
      );
    }

    const packageInfo = CREDIT_PACKAGES[packageType as keyof typeof CREDIT_PACKAGES];

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: packageInfo.name,
              description: `${packageInfo.credits} AI credits for VenkatTech Studio`,
            },
            unit_amount: packageInfo.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/wallet?success=true`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/wallet?canceled=true`,
      metadata: {
        userId: payload.userId,
        credits: packageInfo.credits.toString(),
        packageType,
      },
    });

    const response: ApiResponse<{ sessionId: string; url: string }> = {
      success: true,
      data: {
        sessionId: session.id,
        url: session.url!,
      },
      meta: {
        timestamp: new Date(),
        requestId: `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      },
    };

    logger.info(`Checkout session created for user ${payload.userId}, package: ${packageType}`);
    return NextResponse.json(response);

  } catch (error) {
    logger.error('Failed to create checkout session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}