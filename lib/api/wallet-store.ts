/**
 * Wallet Store
 * Zustand store for wallet and subscription state
 */

import { create } from 'zustand';
import type { WalletBalance, SubscriptionPlan, CreditTransaction } from '@/types';

interface WalletStore {
  // Wallet
  balance: WalletBalance | null;
  balanceLoading: boolean;
  setBalance: (balance: WalletBalance | null) => void;
  setBalanceLoading: (loading: boolean) => void;

  // Transactions
  transactions: CreditTransaction[];
  transactionsLoading: boolean;
  setTransactions: (transactions: CreditTransaction[]) => void;
  setTransactionsLoading: (loading: boolean) => void;

  // Subscription
  currentPlan: SubscriptionPlan | null;
  planLoading: boolean;
  setCurrentPlan: (plan: SubscriptionPlan | null) => void;
  setPlanLoading: (loading: boolean) => void;

  // UI
  showUpgradeModal: boolean;
  setShowUpgradeModal: (show: boolean) => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
  // Wallet
  balance: null,
  balanceLoading: true,
  setBalance: (balance) => set({ balance }),
  setBalanceLoading: (loading) => set({ balanceLoading: loading }),

  // Transactions
  transactions: [],
  transactionsLoading: false,
  setTransactions: (transactions) => set({ transactions }),
  setTransactionsLoading: (loading) => set({ transactionsLoading: loading }),

  // Subscription
  currentPlan: null,
  planLoading: true,
  setCurrentPlan: (plan) => set({ currentPlan: plan }),
  setPlanLoading: (loading) => set({ planLoading: loading }),

  // UI
  showUpgradeModal: false,
  setShowUpgradeModal: (show) => set({ showUpgradeModal: show }),
}));

export default useWalletStore;
