/**
 * Jobs & Queue Types
 * Defines interfaces for job management and processing
 */

export type JobQueueStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';

export type RetryPolicy = 'exponential' | 'linear' | 'none';

export interface JobQueue {
  id: string;
  userId: string;
  toolType: string;
  status: JobQueueStatus;
  priority: number;
  queuePosition: number;
  estimatedWaitTime: number;
  retryCount: number;
  maxRetries: number;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export interface JobMetrics {
  totalQueued: number;
  totalProcessing: number;
  totalCompleted: number;
  totalFailed: number;
  averageProcessingTime: number;
  successRate: number;
}

export interface JobHistoryEntry {
  timestamp: Date;
  status: JobQueueStatus;
  message: string;
  details?: Record<string, any>;
}

export interface BatchJobRequest {
  jobs: Array<{
    toolType: string;
    input: Record<string, any>;
    priority?: number;
  }>;
  notificationEmail?: string;
}

export interface BatchJobResult {
  batchId: string;
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
  estimatedCompletionTime: Date;
  jobIds: string[];
}

export interface ApiKey {
  id: string;
  userId: string;
  name: string;
  key: string;
  keyPrefix: string;
  secret?: string;
  status: 'active' | 'revoked' | 'expired';
  permissions: string[];
  rateLimit: number;
  lastUsedAt?: Date;
  createdAt: Date;
  expiresAt?: Date;
}

export interface ApiKeyUsageLog {
  id: string;
  apiKeyId: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  statusCode: number;
  responseTime: number;
  ipAddress: string;
  timestamp: Date;
  userAgent: string;
}

export interface WebhookEvent {
  id: string;
  userId: string;
  eventType: string;
  data: Record<string, any>;
  timestamp: Date;
  status: 'pending' | 'sent' | 'failed';
  retries: number;
}
