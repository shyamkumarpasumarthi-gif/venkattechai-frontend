/**
 * CSRF Protection
 * Implements CSRF token generation and validation
 */

class CSRFManager {
  private readonly tokenKey = 'csrf-token';
  private readonly headerKey = 'X-CSRF-Token';

  /**
   * Get CSRF token from meta tag or generate new one
   */
  getToken(): string | null {
    if (typeof document === 'undefined') {
      return null;
    }

    const meta = document.querySelector('meta[name="csrf-token"]');
    if (meta) {
      return meta.getAttribute('content');
    }

    // Fallback: get from localStorage
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Set CSRF token in meta tag (called by server)
   */
  setToken(token: string): void {
    if (typeof document === 'undefined') {
      return;
    }

    // Update meta tag
    let meta = document.querySelector('meta[name="csrf-token"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'csrf-token');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', token);

    // Also store in localStorage
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * Add CSRF token to request headers
   */
  addToHeaders(headers: Record<string, string>): Record<string, string> {
    const token = this.getToken();
    if (token) {
      headers[this.headerKey] = token;
    }
    return headers;
  }

  /**
   * Validate CSRF token from form or request
   */
  validateToken(token: string | null): boolean {
    if (!token) {
      return false;
    }

    const storedToken = this.getToken();
    if (!storedToken) {
      return false;
    }

    return token === storedToken;
  }

  /**
   * Clear CSRF token
   */
  clear(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
    }

    if (typeof document !== 'undefined') {
      const meta = document.querySelector('meta[name="csrf-token"]');
      if (meta) {
        meta.remove();
      }
    }
  }
}

export const csrfManager = new CSRFManager();
export default csrfManager;
