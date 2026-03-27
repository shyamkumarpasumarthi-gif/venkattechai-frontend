/**
 * Wallet & Credit Types
 * Defines interfaces for wallet, credits, and payment management
 */

export type SubscriptionPlan = 'free' | 'starter' | 'growth' | 'pro' | 'enterprise';

export type SubscriptionStatus = 'active' | 'past_due' | 'cancelled' | 'suspended';

export type CreditTransactionType =
  | 'purchase'
  | 'usage'
  | 'refund'
  | 'bonus'
  | 'airdrops'
  | 'referral';

export interface WalletBalance {
  id: string;
  userId: string;
  credits: number;
  tier: SubscriptionPlan;
  monthlyCreditsLimit?: number;
  monthlyCreditsUsed: number;
  resetDate?: Date;
  updatedAt: Date;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  type: CreditTransactionType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  reference?: string;
  createdAt: Date;
  metadata?: Record<string, any>;
}

export interface SubscriptionPlanDetails {
  id: SubscriptionPlan;
  name: string;
  description: string;
  monthlyCredits: number;
  price: number;
  currency: string;
  features: string[];
  recommended: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: Date;
  endDate?: Date;
  renewalDate?: Date;
  stripeSubscriptionId?: string;
  autoRenew: boolean;
  metadata?: Record<string, any>;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'credit_card' | 'paypal' | 'bank_transfer';
  isDefault: boolean;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  stripePaymentMethodId?: string;
  createdAt: Date;
}

export interface Invoice {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  items: InvoiceItem[];
  paidAt?: Date;
  dueDate: Date;
  createdAt: Date;
  stripeInvoiceId?: string;
  pdfUrl?: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface CheckoutSession {
  sessionId: string;
  plan: SubscriptionPlan;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'cancelled';
  stripeSessionId?: string;
  checkoutUrl?: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface CreditRefundRequest {
  transactionId: string;
  reason: string;
  amount?: number;
}

export interface ReferralBonus {
  id: string;
  referrerId: string;
  refereeId: string;
  creditsAwarded: number;
  status: 'pending' | 'completed';
  createdAt: Date;
  completedAt?: Date;
}
