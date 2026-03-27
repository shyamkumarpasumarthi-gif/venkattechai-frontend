/**
 * Dashboard Service
 * Functions for fetching dashboard data
 */

import { bffClient } from './bff-client';
import { getLogger } from './logger';
import { useAuthStore } from './auth-store';
import type { WalletBalance, Job, CreditTransaction, User, ApiKey } from '@/types';

const logger = getLogger('dashboard-service');

export class DashboardService {
  /**
   * Fetch user's wallet balance
   */
  static async getWalletBalance(): Promise<WalletBalance> {
    try {
      const { token } = useAuthStore.getState();
      const response = await bffClient.get('/bff/wallet/balance', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      return (response.data as { data: WalletBalance }).data;
    } catch (error) {
      logger.error('Failed to fetch wallet balance:', error);
      throw error;
    }
  }

  /**
   * Fetch user's recent jobs
   */
  static async getRecentJobs(limit: number = 10): Promise<{ jobs: Job[]; total: number; hasMore: boolean }> {
    try {
      const { token } = useAuthStore.getState();
      const response = await bffClient.get(`/bff/studio/jobs?limit=${limit}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      return (response.data as { data: { jobs: Job[]; total: number; hasMore: boolean } }).data;
    } catch (error) {
      logger.error('Failed to fetch recent jobs:', error);
      throw error;
    }
  }

  /**
   * Fetch user's credit transactions
   */
  static async getTransactions(limit: number = 20, offset: number = 0): Promise<{
    transactions: CreditTransaction[];
    total: number;
    hasMore: boolean;
  }> {
    try {
      const { token } = useAuthStore.getState();
      const response = await bffClient.get(`/bff/wallet/transactions?limit=${limit}&offset=${offset}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      return (response.data as {
        data: {
          transactions: CreditTransaction[];
          total: number;
          hasMore: boolean;
        };
      }).data;
    } catch (error) {
      logger.error('Failed to fetch transactions:', error);
      throw error;
    }
  }

  /**
   * Fetch user profile
   */
  static async getUserProfile(): Promise<User> {
    try {
      const { token } = useAuthStore.getState();
      const response = await bffClient.get('/bff/user/profile', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      return (response.data as { data: User }).data;
    } catch (error) {
      logger.error('Failed to fetch user profile:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(updates: { name?: string; email?: string }): Promise<User> {
    try {
      const { token } = useAuthStore.getState();
      const response = await bffClient.put('/bff/user/profile', updates, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      return (response.data as { data: User }).data;
    } catch (error) {
      logger.error('Failed to update user profile:', error);
      throw error;
    }
  }

  /**
   * Change user password
   */
  static async changePassword(data: { currentPassword: string; newPassword: string }): Promise<{ message: string }> {
    try {
      const { token } = useAuthStore.getState();
      const response = await bffClient.put('/bff/user/password', data, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      return (response.data as { data: { message: string } }).data;
    } catch (error) {
      logger.error('Failed to change password:', error);
      throw error;
    }
  }

  /**
   * Fetch dashboard statistics
   */
  static async getDashboardStats(): Promise<{ totalJobs: number; successRate: number; creditsUsed: number }> {
    try {
      const { token } = useAuthStore.getState();
      const response = await bffClient.get('/bff/dashboard/stats', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      return (response.data as { data: { totalJobs: number; successRate: number; creditsUsed: number } }).data;
    } catch (error) {
      logger.error('Failed to fetch dashboard stats:', error);
      throw error;
    }
  }

  /**
   * Fetch user's API keys
   */
  static async getApiKeys(): Promise<ApiKey[]> {
    try {
      const { token } = useAuthStore.getState();
      const response = await bffClient.get('/bff/api-keys', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      return (response.data as { data: ApiKey[] }).data;
    } catch (error) {
      logger.error('Failed to fetch API keys:', error);
      throw error;
    }
  }

  /**
   * Create new API key
   */
  static async createApiKey(data: { name: string; permissions?: string[] }): Promise<ApiKey> {
    try {
      const { token } = useAuthStore.getState();
      const response = await bffClient.post('/bff/api-keys', data, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      return (response.data as { data: ApiKey }).data;
    } catch (error) {
      logger.error('Failed to create API key:', error);
      throw error;
    }
  }

  /**
   * Delete API key
   */
  static async deleteApiKey(keyId: string): Promise<{ message: string }> {
    try {
      const { token } = useAuthStore.getState();
      const response = await bffClient.delete(`/bff/api-keys/${keyId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      return (response.data as { data: { message: string } }).data;
    } catch (error) {
      logger.error('Failed to delete API key:', error);
      throw error;
    }
  }
}

export default DashboardService;