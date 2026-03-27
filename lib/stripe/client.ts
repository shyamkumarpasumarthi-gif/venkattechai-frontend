/**
 * Stripe Client
 * Initializes and manages Stripe integration
 */

import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

/**
 * Get Stripe instance
 */
export async function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!publishableKey) {
      console.error('Stripe publishable key not configured');
      return null;
    }

    stripePromise = loadStripe(publishableKey);
  }

  return stripePromise;
}

/**
 * Create Stripe checkout session
 */
export async function createCheckoutSession(plan: string): Promise<void> {
  try {
    const response = await fetch('/api/bff/stripe/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ plan }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { sessionId } = await response.json();
    const stripe = await getStripe();

    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
      console.error('Checkout error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Checkout creation error:', error);
    throw error;
  }
}

/**
 * Create portal session for managing subscription
 */
export async function createPortalSession(): Promise<void> {
  try {
    const response = await fetch('/api/bff/stripe/portal', {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to create portal session');
    }

    const { url } = await response.json();

    if (url) {
      window.location.href = url;
    }
  } catch (error) {
    console.error('Portal creation error:', error);
    throw error;
  }
}
