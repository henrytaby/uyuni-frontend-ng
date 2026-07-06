import { HttpClient } from '@angular/common/http';
import { inject,Injectable, NgZone, signal } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { LoggerService } from './logger.service';

/**
 * NetworkErrorService handles network connectivity detection and error display.
 * 
 * Features:
 * - Detects network chunk loading failures
 * - Provides connection check functionality
 * - Manages connection error dialog state
 * 
 * @example
 * ```typescript
 * // In global error handler
 * networkErrorService.triggerConnectionError();
 * 
 * // In component
 * if (networkErrorService.showConnectionError()) {
 *   // Show retry dialog
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class NetworkErrorService {
  private zone = inject(NgZone);
  private http = inject(HttpClient);
  private logger = inject(LoggerService);
  
  readonly showConnectionError = signal(false);

  /**
   * Trigger the connection error dialog
   */
  triggerConnectionError(): void {
    this.logger.warn('Connection error triggered', undefined, 'NetworkErrorService');
    
    // Ensure we run inside Angular Zone to trigger UI updates
    this.zone.run(() => {
      this.showConnectionError.set(true);
    });
  }

  /**
   * Reset the connection error state
   */
  resetError(): void {
    this.logger.debug('Connection error reset', undefined, 'NetworkErrorService');
    this.showConnectionError.set(false);
  }

  /**
   * Check if the application has network connectivity
   * 
   * @returns Observable<boolean> - true if connected, false otherwise
   */
  checkConnection(): Observable<boolean> {
    this.logger.debug('Checking connection...', undefined, 'NetworkErrorService');
    
    // Ping a lightweight asset to check connectivity
    return this.http.head('/favicon.ico', { responseType: 'blob' }).pipe(
      map(() => {
        this.logger.debug('Connection check successful', undefined, 'NetworkErrorService');
        return true;
      }),
      catchError((error) => {
        this.logger.warn('Connection check failed', error, 'NetworkErrorService');
        return of(false);
      })
    );
  }
}
