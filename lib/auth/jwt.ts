/**
 * JWT Token Management
 * Handles JWT token generation, validation, and refresh
 */

import * as jose from 'jose';
import type { JWTPayload } from '@/types';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-for-development-only'
);

class JWTManager {
  /**
   * Decode and verify JWT token
   */
  async verifyToken(token: string): Promise<JWTPayload | null> {
    try {
      const verified = await jose.jwtVerify(token, JWT_SECRET);
      return verified.payload as unknown as JWTPayload;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  /**
   * Decode JWT without verification (for client-side only)
   */
  decodeToken(token: string): JWTPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      const payload = JSON.parse(
        Buffer.from(parts[1], 'base64').toString('utf-8')
      );
      return payload as JWTPayload;
    } catch (error) {
      console.error('Token decode failed:', error);
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) {
      return true;
    }

    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  }

  /**
   * Get token expiration time
   */
  getTokenExpiration(token: string): Date | null {
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) {
      return null;
    }

    return new Date(payload.exp * 1000);
  }

  /**
   * Check if token expires within time window (in seconds)
   */
  willTokenExpireSoon(token: string, windowSeconds: number = 300): boolean {
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) {
      return true;
    }

    const now = Math.floor(Date.now() / 1000);
    const expiresIn = payload.exp - now;

    return expiresIn < windowSeconds;
  }

  /**
   * Extract user ID from token
   */
  getUserIdFromToken(token: string): string | null {
    const payload = this.decodeToken(token);
    return payload?.userId || null;
  }

  /**
   * Extract role from token
   */
  getRoleFromToken(token: string): string | null {
    const payload = this.decodeToken(token);
    return payload?.role || null;
  }

  /**
   * Validate token structure
   */
  validateTokenStructure(token: string): boolean {
    const parts = token.split('.');
    return parts.length === 3;
  }
}

export const jwtManager = new JWTManager();
export default jwtManager;
