/**
 * API Client with BFF Layer
 * Axios instance with interceptors for secure backend communication
 * All requests go through BFF API layer at /api/bff
 */

import axios, {
  AxiosInstance,
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { getLogger } from './logger';
import { sanitizeInput } from '../security/input-sanitizer';
import type { ApiError, RateLimitInfo } from '@/types';

const logger = getLogger('api-client');

class BFFApiClient {
  private client: AxiosInstance;
  private requestInterceptor?: number;
  private responseInterceptor?: number;

  constructor() {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://venkattech-api.azurewebsites.net';

    this.client = axios.create({
      baseURL,
      timeout: 30000,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.requestInterceptor = this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Add JWT token - will be set by calling code
        // This avoids circular dependency issues

        // Add CSRF token from meta tag
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (csrfToken) {
          config.headers['X-CSRF-Token'] = csrfToken;
        }

        // Add request ID for tracking
        config.headers['X-Request-ID'] = this.generateRequestId();

        // Sanitize request data
        if (config.data) {
          config.data = sanitizeInput(config.data);
        }

        logger.debug('API Request:', {
          method: config.method,
          url: config.url,
          requestId: config.headers['X-Request-ID'],
        });

        return config;
      },
      (error) => {
        logger.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.responseInterceptor = this.client.interceptors.response.use(
      (response) => {
        const rateLimitInfo = this.extractRateLimitInfo(response.headers);
        if (rateLimitInfo) {
          logger.debug('Rate limit info:', rateLimitInfo);
        }

        return response;
      },
      async (error: AxiosError) => {
        const config = error.config as InternalAxiosRequestConfig;

        logger.error('API Error:', {
          status: error.response?.status,
          message: error.message,
          url: config?.url,
          method: config?.method,
        });

        // Handle specific error scenarios
        if (error.response?.status === 401) {
          // Token expired or invalid - attempt refresh
          return this.handleUnauthorized(config);
        }

        if (error.response?.status === 429) {
          // Rate limited
          const retryAfter = error.response.headers['retry-after'];
          logger.warn('Rate limited. Retry after:', retryAfter);
          return Promise.reject({
            code: 'RATE_LIMITED',
            message: 'Too many requests. Please try again later.',
            statusCode: 429,
          });
        }

        if (error.response?.status === 403) {
          // CSRF token invalid
          logger.error('CSRF validation failed');
          return Promise.reject({
            code: 'CSRF_FAILED',
            message: 'Security validation failed. Please refresh and try again.',
            statusCode: 403,
          });
        }

        return Promise.reject(this.formatError(error));
      }
    );
  }

  private async handleUnauthorized(config: InternalAxiosRequestConfig) {
    try {
      // Attempt token refresh
      const response = await this.client.post('/auth/refresh');
      if (response.status === 200) {
        // Retry original request
        return this.client(config);
      }
    } catch (refreshError) {
      logger.error('Token refresh failed:', refreshError);
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/en/login';
      }
    }

    return Promise.reject({
      code: 'UNAUTHORIZED',
      message: 'Your session has expired. Please log in again.',
      statusCode: 401,
    });
  }

  private extractRateLimitInfo(headers: Record<string, unknown>): RateLimitInfo | null {
    const limit = headers['x-ratelimit-limit'];
    const remaining = headers['x-ratelimit-remaining'];
    const reset = headers['x-ratelimit-reset'];

    if (typeof limit === 'string' && typeof remaining === 'string' && typeof reset === 'string') {
      return { limit: parseInt(limit), remaining: parseInt(remaining), reset: parseInt(reset) };
    }

    return null;
  }

  private formatError(error: AxiosError): ApiError {
    const data = error.response?.data as unknown;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errorData = data as any;

    return {
      code: errorData?.code || error.code || 'UNKNOWN_ERROR',
      message: errorData?.message || error.message || 'An error occurred',
      details: errorData?.details || undefined,
      statusCode: error.response?.status || 500,
    };
  }

  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  public getClient(): AxiosInstance {
    return this.client;
  }

  public async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  public async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  public async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  public async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }

  public destroy(): void {
    if (this.requestInterceptor !== undefined) {
      this.client.interceptors.request.eject(this.requestInterceptor);
    }
    if (this.responseInterceptor !== undefined) {
      this.client.interceptors.response.eject(this.responseInterceptor);
    }
  }
}

export const bffClient = new BFFApiClient();

export default bffClient.getClient();
