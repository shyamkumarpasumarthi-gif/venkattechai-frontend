/**
 * Logger Utility
 * Centralized logging for development and debugging
 */

type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

interface LogEntry {
  level: LogLevel;
  timestamp: Date;
  category: string;
  message: string;
  data?: unknown;
}

class Logger {
  private category: string;
  private isDevelopment: boolean;
  private logs: LogEntry[] = [];

  constructor(category: string) {
    this.category = category;
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  /**
   * Log trace level message (most detailed)
   */
  trace(message: string, data?: unknown): void {
    this.log('trace', message, data);
  }

  /**
   * Log debug level message
   */
  debug(message: string, data?: unknown): void {
    this.log('debug', message, data);
  }

  /**
   * Log info level message
   */
  info(message: string, data?: unknown): void {
    this.log('info', message, data);
  }

  /**
   * Log warning level message
   */
  warn(message: string, data?: unknown): void {
    this.log('warn', message, data);
  }

  /**
   * Log error level message
   */
  error(message: string, data?: unknown): void {
    this.log('error', message, data);
  }

  /**
   * Log fatal level message (app breaking error)
   */
  fatal(message: string, data?: unknown): void {
    this.log('fatal', message, data);
  }

  /**
   * Core logging method
   */
  private log(level: LogLevel, message: string, data?: unknown): void {
    const entry: LogEntry = {
      level,
      timestamp: new Date(),
      category: this.category,
      message,
      data,
    };

    this.logs.push(entry);

    // Trim logs if they exceed max size (keep last 1000)
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000);
    }

    // Console output in development
    if (this.isDevelopment || level === 'error' || level === 'fatal') {
      const prefix = `[${entry.timestamp.toISOString()}] [${level.toUpperCase()}] [${this.category}]`;
      const consoleMethod = level === 'error' || level === 'fatal' ? console.error : console.log;

      if (data) {
        consoleMethod(prefix, message, data);
      } else {
        consoleMethod(prefix, message);
      }
    }

    // Send critical logs to backend
    if (level === 'error' || level === 'fatal') {
      this.sendToBackend(entry);
    }
  }

  /**
   * Get all logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs by level
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter((log) => log.level === level);
  }

  /**
   * Clear logs
   */
  clear(): void {
    this.logs = [];
  }

  /**
   * Send critical logs to backend for monitoring
   */
  private async sendToBackend(entry: LogEntry): Promise<void> {
    try {
      await fetch('/api/bff/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      console.error('Failed to send log to backend:', error);
    }
  }
}

/**
 * Factory function to create logger instances
 */
export function getLogger(category: string): Logger {
  return new Logger(category);
}

export default getLogger;
