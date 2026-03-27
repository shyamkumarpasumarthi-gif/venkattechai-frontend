/**
 * Dashboard Credit Card Component
 * Displays user's credit balance
 */

'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Zap, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface CreditCardProps {
  credits: number;
  monthlyLimit?: number;
  monthlyUsed?: number;
}

const CreditCard: React.FC<CreditCardProps> = ({ credits, monthlyLimit, monthlyUsed }) => {
  const usagePercent = monthlyLimit ? (monthlyUsed || 0) / monthlyLimit * 100 : 0;

  return (
    <Card className="bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Balance */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600">Available Credits</p>
              <p className="text-3xl font-bold text-primary-900">{credits}</p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <Zap size={24} className="text-primary-600" />
            </div>
          </div>

          {/* Monthly Usage */}
          {monthlyLimit && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-secondary-600">
                <span>Monthly Usage</span>
                <span>
                  {monthlyUsed || 0} / {monthlyLimit}
                </span>
              </div>
              <div className="w-full bg-white rounded-full h-1.5">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all"
                  style={{ width: `${Math.min(usagePercent, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Links */}
          <div className="pt-2 space-y-1">
            <Link href="/en/wallet">
              <Button variant="secondary" fullWidth size="sm">
                <TrendingUp size={16} className="mr-2" />
                Buy Credits
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { CreditCard };
