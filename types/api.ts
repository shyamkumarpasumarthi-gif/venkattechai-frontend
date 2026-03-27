/**
 * API Response & Request Types
 * Defines generic API interfaces and error handling
 */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: {
    timestamp: Date;
    requestId: string;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterOptions {
  [key: string]: string | number | boolean | null;
}

export interface QueryParams {
  page?: number;
  pageSize?: number;
  sort?: SortOptions;
  filters?: FilterOptions;
  search?: string;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  version: string;
  services: {
    database: 'ok' | 'error';
    redis: 'ok' | 'error';
    externalApi: 'ok' | 'error';
  };
}

export interface BulkActionRequest<T> {
  action: string;
  ids: string[];
  data?: T;
}

export interface BulkActionResponse {
  successful: string[];
  failed: Array<{
    id: string;
    error: string;
  }>;
  total: number;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export interface RequestConfig {
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  errors?: Record<string, string[]>;
  traceId?: string;
}
