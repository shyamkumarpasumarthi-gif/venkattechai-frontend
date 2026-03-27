/**
 * Audit Logger
 * Logs important security events and user actions
 */

interface AuditLogEntry {
  timestamp: Date;
  userId?: string;
  action: string;
  resource?: string;
  result: 'success' | 'failure';
  details: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

class AuditLogger {
  private logs: AuditLogEntry[] = [];
  private maxLogs = 10000;

  /**
   * Log security or important action event
   */
  public log(entry: Omit<AuditLogEntry, 'timestamp'>): void {
    const logEntry: AuditLogEntry = {
      ...entry,
      timestamp: new Date(),
    };

    this.logs.push(logEntry);

    // Trim logs if they exceed max size
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Send to backend for storage
    this.sendToBackend(logEntry);
  }

  /**
   * Log successful action
   */
  public logSuccess(
    action: string,
    resource?: string,
    details?: Record<string, unknown>
  ): void {
    this.log({
      action,
      resource,
      result: 'success',
      details: details || {},
    });
  }

  /**
   * Log failed action
   */
  public logFailure(
    action: string,
    resource?: string,
    error?: string,
    details?: Record<string, unknown>
  ): void {
    this.log({
      action,
      resource,
      result: 'failure',
      details: {
        error,
        ...details,
      },
    });
  }

  /**
   * Log security event (login attempt, permission denied, etc.)
   */
  public logSecurityEvent(
    event: string,
    result: 'success' | 'failure',
    details?: Record<string, unknown>
  ): void {
    this.log({
      action: `SECURITY:${event}`,
      result,
      details: details || {},
      ipAddress: this.getClientIp(),
      userAgent: this.getUserAgent(),
    });
  }

  /**
   * Get audit logs (in-memory)
   */
  public getLogs(filter?: { action?: string; result?: 'success' | 'failure' }): AuditLogEntry[] {
    if (!filter) {
      return [...this.logs];
    }

    return this.logs.filter((log) => {
      if (filter.action && log.action !== filter.action) {
        return false;
      }
      if (filter.result && log.result !== filter.result) {
        return false;
      }
      return true;
    });
  }

  /**
   * Clear in-memory logs (useful for testing)
   */
  public clear(): void {
    this.logs = [];
  }

  /**
   * Send log to backend for persistence
   */
  private async sendToBackend(entry: AuditLogEntry): Promise<void> {
    try {
      // Only send critical events to backend to reduce overhead
      if (
        entry.action.startsWith('SECURITY:') ||
        entry.result === 'failure'
      ) {
        const response = await fetch('/api/bff/audit/log', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(entry),
        });

        if (!response.ok) {
          console.error('Failed to send audit log to backend');
        }
      }
    } catch (error) {
      console.error('Error sending audit log:', error);
    }
  }

  private getClientIp(): string | undefined {
    if (typeof window === 'undefined') {
      return undefined;
    }
    // Note: This requires backend to provide it via header or meta tag
    return undefined;
  }

  private getUserAgent(): string {
    if (typeof window === 'undefined') {
      return 'unknown';
    }
    return window.navigator.userAgent;
  }
}

export const auditLogger = new AuditLogger();

export default auditLogger;
