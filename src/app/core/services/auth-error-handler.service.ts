import { HttpErrorResponse } from '@angular/common/http';
import { inject,Injectable } from '@angular/core';

import { LockoutError } from '@features/auth/models/auth.models';

import { LoggerService } from './logger.service';

/**
 * Standardized error codes for authentication errors
 */
export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * Structured authentication error
 */
export interface AuthError {
  code: AuthErrorCode;
  message: string;
  details?: {
    waitSeconds?: number;
    maxAttempts?: number;
    lockoutMinutes?: number;
  };
  originalError?: unknown;
}

/**
 * AuthErrorHandlerService centralizes authentication error handling.
 * 
 * This service follows the Single Responsibility Principle by handling
 * all authentication-related error parsing and user-friendly message generation.
 * 
 * Benefits:
 * - Consistent error messages across the application
 * - Type-safe error handling
 * - Easy to test and mock
 * - Centralized logging
 * 
 * @example
 * ```typescript
 * // In component
 * this.authService.login(credentials).subscribe({
 *   error: (err) => {
 *     const authError = this.authErrorHandler.handleLoginError(err);
 *     this.errorMessage.set(authError.message);
 *   }
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class AuthErrorHandlerService {
  private logger = inject(LoggerService);

  /**
   * Error messages in Spanish (could be internationalized)
   */
  private readonly errorMessages: Record<AuthErrorCode, string> = {
    [AuthErrorCode.INVALID_CREDENTIALS]: 'Usuario o contraseña incorrectos.',
    [AuthErrorCode.ACCOUNT_LOCKED]: 'Cuenta bloqueada. Por favor, inténtelo más tarde.',
    [AuthErrorCode.SESSION_EXPIRED]: 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.',
    [AuthErrorCode.NETWORK_ERROR]: 'No se pudo conectar con el servidor. Por favor, verifique su conexión.',
    [AuthErrorCode.SERVER_ERROR]: 'Error del servidor. Por favor, inténtelo más tarde.',
    [AuthErrorCode.UNKNOWN_ERROR]: 'Ha ocurrido un error inesperado. Por favor, inténtelo de nuevo.'
  };

  /**
   * Handle login errors and return a structured AuthError
   * 
   * @param error The HTTP error response
   * @returns Structured authentication error with user-friendly message
   */
  handleLoginError(error: unknown): AuthError {
    if (!(error instanceof HttpErrorResponse)) {
      return this.createUnknownError(error);
    }

    const authError = this.parseLoginError(error);
    this.logger.warn('Login error occurred', { code: authError.code, status: error.status }, 'AuthErrorHandler');
    
    return authError;
  }

  /**
   * Handle token refresh errors
   * 
   * @param error The HTTP error response
   * @returns Structured authentication error
   */
  handleRefreshError(error: unknown): AuthError {
    if (!(error instanceof HttpErrorResponse)) {
      return this.createUnknownError(error);
    }

    this.logger.warn('Token refresh error', { status: error.status }, 'AuthErrorHandler');
    
    return {
      code: AuthErrorCode.SESSION_EXPIRED,
      message: this.errorMessages[AuthErrorCode.SESSION_EXPIRED],
      originalError: error
    };
  }

  /**
   * Parse HTTP error into structured AuthError
   */
  private parseLoginError(error: HttpErrorResponse): AuthError {
    // Account locked (403 with specific code)
    if (error.status === 403) {
      return this.handleLockedAccount(error);
    }

    // Invalid credentials (401)
    if (error.status === 401) {
      return {
        code: AuthErrorCode.INVALID_CREDENTIALS,
        message: this.errorMessages[AuthErrorCode.INVALID_CREDENTIALS],
        originalError: error
      };
    }

    // Network error (0 status or no response)
    if (error.status === 0) {
      return {
        code: AuthErrorCode.NETWORK_ERROR,
        message: this.errorMessages[AuthErrorCode.NETWORK_ERROR],
        originalError: error
      };
    }

    // Server error (5xx)
    if (error.status >= 500) {
      return {
        code: AuthErrorCode.SERVER_ERROR,
        message: this.errorMessages[AuthErrorCode.SERVER_ERROR],
        originalError: error
      };
    }

    // Other errors
    return {
      code: AuthErrorCode.UNKNOWN_ERROR,
      message: this.errorMessages[AuthErrorCode.UNKNOWN_ERROR],
      originalError: error
    };
  }

  /**
   * Handle account locked error with detailed information
   */
  private handleLockedAccount(error: HttpErrorResponse): AuthError {
    try {
      const lockoutError = error.error as LockoutError;
      
      if (lockoutError?.detail?.code === 'ACCOUNT_LOCKED') {
        const { wait_seconds, max_attempts, lockout_minutes } = lockoutError.detail;
        const minutes = Math.ceil(wait_seconds / 60);
        
        return {
          code: AuthErrorCode.ACCOUNT_LOCKED,
          message: `Cuenta bloqueada tras ${max_attempts} intentos fallidos. Inténtelo de nuevo en ${minutes} minutos.`,
          details: {
            waitSeconds: wait_seconds,
            maxAttempts: max_attempts,
            lockoutMinutes: lockout_minutes
          },
          originalError: error
        };
      }
    } catch {
      this.logger.error('Failed to parse lockout error', error, 'AuthErrorHandler');
    }

    return {
      code: AuthErrorCode.ACCOUNT_LOCKED,
      message: this.errorMessages[AuthErrorCode.ACCOUNT_LOCKED],
      originalError: error
    };
  }

  /**
   * Create unknown error response
   */
  private createUnknownError(error: unknown): AuthError {
    this.logger.error('Unknown error type', error, 'AuthErrorHandler');
    
    return {
      code: AuthErrorCode.UNKNOWN_ERROR,
      message: this.errorMessages[AuthErrorCode.UNKNOWN_ERROR],
      originalError: error
    };
  }

  /**
   * Get a user-friendly message for an error code
   */
  getMessage(code: AuthErrorCode): string {
    return this.errorMessages[code] || this.errorMessages[AuthErrorCode.UNKNOWN_ERROR];
  }
}
