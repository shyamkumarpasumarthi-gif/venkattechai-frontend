/**
 * Stripe Webhook API Route
 * POST /api/stripe/webhook
 */

import { NextRequest, NextResponse } from 'next/server';
import { getLogger } from '@/lib/api/logger';
import Stripe from 'stripe';
import type { ApiResponse } from '@/types';

const logger = getLogger('stripe-webhook');

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Mock credit system - in real app, use database
const mockCredits: Record<string, number> = {
  'user_123': 500,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature');

    let event: Stripe.Event;

    try {
      // Verify webhook signature
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!endpointSecret) {
        logger.warn('Stripe webhook secret not configured');
        // For demo purposes, skip verification if secret not set
        event = JSON.parse(body);
      } else {
        event = stripe.webhooks.constructEvent(body, sig!, endpointSecret);
      }
    } catch (err) {
      logger.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice);
        break;

      case 'customer.subscription.deleted':
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;

      default:
        logger.info(`Unhandled event type: ${event.type}`);
    }

    const response: ApiResponse<{ received: true }> = {
      success: true,
      data: { received: true },
      meta: {
        timestamp: new Date(),
        requestId: `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      },
    };

    return NextResponse.json(response);

  } catch (error) {
    logger.error('Stripe webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    const userId = session.metadata?.userId;
    const credits = parseInt(session.metadata?.credits || '0');

    if (!userId || !credits) {
      logger.error('Missing userId or credits in checkout session metadata');
      return;
    }

    // Add credits to user account
    mockCredits[userId] = (mockCredits[userId] || 0) + credits;

    logger.info(`Added ${credits} credits to user ${userId} after successful payment`);

    // In real app, update database and send notification
  } catch (error) {
    logger.error('Failed to handle checkout completed:', error);
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    const subscriptionId = invoice.subscription as string;
    const customerId = invoice.customer as string;

    logger.info(`Subscription payment succeeded for customer ${customerId}, subscription ${subscriptionId}`);

    // In real app, update subscription status and credits
  } catch (error) {
    logger.error('Failed to handle invoice payment succeeded:', error);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string;

    logger.info(`Subscription cancelled for customer ${customerId}`);

    // In real app, update subscription status
  } catch (error) {
    logger.error('Failed to handle subscription deleted:', error);
  }
}