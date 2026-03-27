/**
 * Stripe Service
 * Functions for handling Stripe payments and subscriptions
 */

import { bffClient } from './bff-client';
import { getLogger } from './logger';

const logger = getLogger('stripe-service');

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number; // in cents
  description: string;
}

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
}

export class StripeService {
  static readonly CREDIT_PACKAGES: Record<string, CreditPackage> = {
    starter: {
      id: 'starter',
      name: 'Starter Pack',
      credits: 500,
      price: 999, // $9.99
      description: 'Perfect for getting started',
    },
    professional: {
      id: 'professional',
      name: 'Professional Pack',
      credits: 1500,
      price: 2499, // $24.99
      description: 'For regular users',
    },
    enterprise: {
      id: 'enterprise',
      name: 'Enterprise Pack',
      credits: 5000,
      price: 6999, // $69.99
      description: 'Best value for heavy users',
    },
  };

  /**
   * Create a Stripe checkout session for credit purchase
   */
  static async createCheckoutSession(packageType: string, successUrl?: string, cancelUrl?: string): Promise<{ sessionId: string; url: string }> {
    try {
      const response = await bffClient.post('/stripe/create-checkout-session', {
        packageType,
        successUrl,
        cancelUrl,
      });
      return (response.data as { data: { sessionId: string; url: string } }).data;
    } catch (error) {
      logger.error('Failed to create checkout session:', error);
      throw error;
    }
  }

  /**
   * Create a customer portal session for subscription management
   */
  static async createPortalSession(returnUrl?: string): Promise<{ url: string }> {
    try {
      const response = await bffClient.post('/stripe/create-portal-session', {
        returnUrl,
      });
      return (response.data as { data: { url: string } }).data;
    } catch (error) {
      logger.error('Failed to create portal session:', error);
      throw error;
    }
  }

  /**
   * Get available credit packages
   */
  static getCreditPackages(): CreditPackage[] {
    return Object.values(this.CREDIT_PACKAGES);
  }

  /**
   * Get a specific credit package
   */
  static getCreditPackage(packageType: string): CreditPackage | null {
    return this.CREDIT_PACKAGES[packageType] || null;
  }

  /**
   * Format price for display
   */
  static formatPrice(priceInCents: number): string {
    return `$${(priceInCents / 100).toFixed(2)}`;
  }

  /**
   * Calculate credits per dollar
   */
  static getCreditsPerDollar(packageType: string): number {
    const pkg = this.getCreditPackage(packageType);
    if (!pkg) return 0;
    return pkg.credits / (pkg.price / 100);
  }
}

export default StripeService;