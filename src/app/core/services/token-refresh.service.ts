import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { BehaviorSubject, catchError, filter, Observable, of,switchMap, take, tap, throwError } from 'rxjs';

import { ConfigService } from '@core/config/config.service';

import { TokenResponse } from '@features/auth/models/auth.models';

import { LoggerService } from './logger.service';

/**
 * TokenRefreshService manages the token refresh process.
 * 
 * This service encapsulates the refresh token logic that was previously
 * scattered in global variables in the auth interceptor, following
 * the Single Responsibility Principle.
 * 
 * Features:
 * - Prevents multiple simultaneous refresh requests
 * - Queues requests during refresh
 * - Thread-safe implementation using RxJS
 * 
 * @example
 * ```typescript
 * // In interceptor
 * if (this.tokenRefreshService.isRefreshing()) {
 *   return this.tokenRefreshService.waitForToken().pipe(
 *     switchMap(token => next(requestWithToken(token)))
 *   );
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class TokenRefreshService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);
  private logger = inject(LoggerService);

  /**
   * Internal state for refresh process
   * Using BehaviorSubject to queue requests during refresh
   */
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);
  
  /**
   * Signal-based state for UI observation
   */
  readonly isRefreshing = signal(false);

  /**
   * Attempt to refresh the access token.
   * 
   * @returns Observable of the new access token, or error if refresh fails
   */
  refreshToken(): Observable<string> {
    // If already refreshing, wait for the result
    if (this.isRefreshing()) {
      return this.waitForToken();
    }

    this.isRefreshing.set(true);
    this.refreshTokenSubject.next(null);

    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      this.logger.warn('No refresh token available', undefined, 'TokenRefreshService');
      this.isRefreshing.set(false);
      return throwError(() => new Error('No refresh token available'));
    }

    const url = `${this.configService.apiUrl}/auth/refresh`;

    return this.http.post<TokenResponse>(url, { refresh_token: refreshToken }).pipe(
      tap({
        next: (response) => {
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('refresh_token', response.refresh_token);
          this.refreshTokenSubject.next(response.access_token);
          this.isRefreshing.set(false);
          this.logger.debug('Token refreshed successfully', undefined, 'TokenRefreshService');
        },
        error: (error) => {
          this.isRefreshing.set(false);
          this.refreshTokenSubject.next(null);
          this.logger.error('Token refresh failed', error, 'TokenRefreshService');
        }
      }),
      switchMap(response => of(response.access_token)),
      catchError((error) => {
        this.isRefreshing.set(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Wait for an in-progress token refresh to complete.
   * 
   * @returns Observable that emits the new token when refresh completes
   */
  waitForToken(): Observable<string> {
    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1)
    );
  }

  /**
   * Get the current refresh token from storage
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  /**
   * Clear the refresh state (used on logout)
   */
  reset(): void {
    this.isRefreshing.set(false);
    this.refreshTokenSubject.next(null);
    this.logger.debug('Token refresh state reset', undefined, 'TokenRefreshService');
  }
}
