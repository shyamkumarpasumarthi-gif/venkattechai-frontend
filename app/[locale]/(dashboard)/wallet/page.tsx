/**
 * Wallet Page
 */

'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { PageShell } from '@/components/common/PageShell';
import { Zap, CreditCard } from 'lucide-react';
import { useWalletStore } from '@/lib/api/wallet-store';
import { DashboardService } from '@/lib/api/dashboard-service';
import { StripeService } from '@/lib/api/stripe-service';
import { formatDate } from '@/lib/utils';

export default function WalletPage() {
  const {
    balance,
    balanceLoading,
    transactions,
    transactionsLoading,
    setBalance,
    setBalanceLoading,
    setTransactions,
    setTransactionsLoading,
    setCurrentPlan,
    setPlanLoading,
  } = useWalletStore();

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        // Fetch wallet balance
        setBalanceLoading(true);
        const walletData = await DashboardService.getWalletBalance();
        setBalance(walletData);

        // Fetch transactions
        try {
          setTransactionsLoading(true);
          const transactionsData = await DashboardService.getTransactions();
          setTransactions(transactionsData.transactions);
        } catch (error) {
          console.warn('Transactions endpoint not available yet');
        }

        // Fetch current plan (if endpoint exists)
        try {
          setPlanLoading(true);
          // TODO: Implement current plan endpoint
          // const planData = await DashboardService.getCurrentPlan();
          // setCurrentPlan(planData);
        } catch (error) {
          console.warn('Current plan endpoint not available yet');
        }
      } catch (error) {
        console.error('Failed to fetch wallet data:', error);
      } finally {
        setBalanceLoading(false);
        setTransactionsLoading(false);
        setPlanLoading(false);
      }
    };

    fetchWalletData();
  }, [setBalance, setBalanceLoading, setTransactions, setTransactionsLoading, setCurrentPlan, setPlanLoading]);

  const creditPackages = StripeService.getCreditPackages();

  const handlePurchaseCredits = async (packageType: string) => {
    try {
      const { url } = await StripeService.createCheckoutSession(packageType);
      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      // TODO: Show error message to user
    }
  };

  return (
    <PageShell title="Wallet" subtitle="Manage credits and subscriptions">
      {/* Current Balance */}
      {balanceLoading ? (
        <LoadingSkeleton layout="card" />
      ) : balance ? (
        <Card className="bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600">Available Credits</p>
                <p className="text-4xl font-bold text-primary-900 mt-1">{balance.credits}</p>
                <p className="text-xs text-secondary-600 mt-2">
                  {balance.monthlyCreditsLimit && (
                    <>Monthly limit: {balance.monthlyCreditsUsed}/{balance.monthlyCreditsLimit}</>
                  )}
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <Zap size={32} className="text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-secondary-500">Unable to load wallet balance</p>
          </CardContent>
        </Card>
      )}

      {/* Credit Packages */}
      <div>
        <h2 className="text-xl font-bold text-secondary-900 mb-4">Purchase Credits</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {creditPackages.map((pkg) => (
            <Card key={pkg.id} className={pkg.id === 'professional' ? 'ring-2 ring-primary-500' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{pkg.name}</CardTitle>
                  {pkg.id === 'professional' && <Badge variant="default">Best Value</Badge>}
                </div>
                <CardDescription>{pkg.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-secondary-600">Credits</p>
                  <p className="text-3xl font-bold text-secondary-900 mt-1">{pkg.credits.toLocaleString()}</p>
                </div>
                <div className="py-3 border-y border-secondary-200">
                  <p className="text-2xl font-bold text-primary-600">{StripeService.formatPrice(pkg.price)}</p>
                  <p className="text-xs text-secondary-600">
                    {StripeService.getCreditsPerDollar(pkg.id).toFixed(1)} credits per $
                  </p>
                </div>
                <Button
                  fullWidth
                  onClick={() => handlePurchaseCredits(pkg.id)}
                  icon={<CreditCard size={18} />}
                >
                  Buy Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Your credit transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {transactionsLoading ? (
            <LoadingSkeleton layout="list" />
          ) : transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary-50">
                  <div>
                    <p className="font-medium">{tx.description}</p>
                    <p className="text-xs text-secondary-500">{formatDate(tx.createdAt)}</p>
                  </div>
                  <span className={`font-bold ${tx.amount > 0 ? 'text-success-600' : 'text-secondary-900'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-secondary-500">No transactions yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </PageShell>
  );
}
