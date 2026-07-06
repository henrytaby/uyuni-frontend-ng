import { Injectable } from '@angular/core';

/**
 * Log levels for structured logging
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4
}

/**
 * LoggerService provides structured logging with configurable log levels.
 * 
 * This service is designed to be dependency-free to avoid circular dependencies
 * during application initialization. It uses a simple static configuration
 * that can be set at runtime.
 * 
 * @example
 * ```typescript
 * private logger = inject(LoggerService);
 * 
 * logger.info('User logged in', { userId: user.id }, 'AuthService');
 * logger.error('API request failed', error, 'HttpInterceptor');
 * logger.debug('Component initialized', undefined, 'DashboardComponent');
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  /**
   * Minimum log level
   * Can be set at runtime via setMinLevel()
   * Default: DEBUG (logs everything)
   */
  private minLevel: LogLevel = LogLevel.DEBUG;

  /**
   * Set the minimum log level at runtime
   * Called by ConfigService after loading configuration
   */
  setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  /**
   * Set the minimum log level from string
   */
  setMinLevelFromString(level: string): void {
    const upperLevel = level?.toUpperCase();
    if (upperLevel && upperLevel in LogLevel) {
      this.minLevel = LogLevel[upperLevel as keyof typeof LogLevel];
    }
  }

  /**
   * Get current minimum log level
   */
  getMinLevel(): LogLevel {
    return this.minLevel;
  }

  /**
   * Log debug message (development only)
   */
  debug(message: string, data?: unknown, context?: string): void {
    this.log(LogLevel.DEBUG, message, data, context);
  }

  /**
   * Log info message
   */
  info(message: string, data?: unknown, context?: string): void {
    this.log(LogLevel.INFO, message, data, context);
  }

  /**
   * Log warning message
   */
  warn(message: string, data?: unknown, context?: string): void {
    this.log(LogLevel.WARN, message, data, context);
  }

  /**
   * Log error message
   */
  error(message: string, data?: unknown, context?: string): void {
    this.log(LogLevel.ERROR, message, data, context);
  }

  /**
   * Core logging method with structured output
   */
  private log(level: LogLevel, message: string, data?: unknown, context?: string): void {
    if (level < this.minLevel) {
      return;
    }

    const prefix = context ? `[${context}]` : '';
    const formattedMessage = `${prefix} ${message}`;

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage, data ?? '');
        break;
      case LogLevel.INFO:
        console.info(formattedMessage, data ?? '');
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage, data ?? '');
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage, data ?? '');
        break;
    }
  }

  /**
   * Group logs for better readability in development
   */
  group(label: string, fn: () => void): void {
    if (this.minLevel <= LogLevel.DEBUG) {
      console.group(label);
      try {
        fn();
      } finally {
        console.groupEnd();
      }
    } else {
      fn();
    }
  }

  /**
   * Time execution of async operations
   */
  async time<T>(label: string, fn: () => Promise<T>): Promise<T> {
    if (this.minLevel <= LogLevel.DEBUG) {
      console.time(label);
      try {
        return await fn();
      } finally {
        console.timeEnd(label);
      }
    }
    return fn();
  }
}
