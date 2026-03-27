/**
 * Rate Limiter
 * Client-side rate limiting to prevent abuse
 */

interface RateLimitRule {
  maxRequests: number;
  windowMs: number;
}

class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private defaultRule: RateLimitRule = {
    maxRequests: 60,
    windowMs: 60000, // 1 minute
  };

  /**
   * Check if action is within rate limit
   */
  public isAllowed(key: string, rule?: RateLimitRule): boolean {
    const limit = rule || this.defaultRule;
    const now = Date.now();
    const windowStart = now - limit.windowMs;

    // Get or create request list for this key
    let requests = this.requests.get(key) || [];

    // Remove old requests outside the window
    requests = requests.filter((timestamp) => timestamp > windowStart);

    // Check if we're within limit
    if (requests.length >= limit.maxRequests) {
      return false;
    }

    // Add current request
    requests.push(now);
    this.requests.set(key, requests);

    return true;
  }

  /**
   * Get remaining requests for a key
   */
  public getRemaining(key: string, rule?: RateLimitRule): number {
    const limit = rule || this.defaultRule;
    const now = Date.now();
    const windowStart = now - limit.windowMs;

    const requests = this.requests.get(key) || [];
    const recentRequests = requests.filter((timestamp) => timestamp > windowStart).length;

    return Math.max(0, limit.maxRequests - recentRequests);
  }

  /**
   * Get reset time for a key
   */
  public getResetTime(key: string, rule?: RateLimitRule): number {
    const limit = rule || this.defaultRule;
    const requests = this.requests.get(key) || [];

    if (requests.length === 0) {
      return Date.now();
    }

    const oldestRequest = Math.min(...requests);
    return oldestRequest + limit.windowMs;
  }

  /**
   * Reset rate limit for a key
   */
  public reset(key: string): void {
    this.requests.delete(key);
  }

  /**
   * Reset all rate limits
   */
  public resetAll(): void {
    this.requests.clear();
  }
}

export const rateLimiter = new RateLimiter();
export default rateLimiter;
