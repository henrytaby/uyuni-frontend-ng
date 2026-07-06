import { inject, Injectable, OnDestroy,signal } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError,NavigationStart, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { LoggerService } from './logger.service';

/**
 * LoadingService manages global loading state for the application.
 * 
 * Features:
 * - HTTP request tracking with counter (prevents race conditions)
 * - Navigation state tracking
 * - Debounced loading display (prevents flicker)
 * - Fail-safe timeout (prevents stuck loaders)
 * 
 * @example
 * ```typescript
 * // In interceptor
 * loadingService.showLoader();
 * return next(req).pipe(
 *   finalize(() => loadingService.hideLoader())
 * );
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class LoadingService implements OnDestroy {
  private router = inject(Router);
  private logger = inject(LoggerService);
  
  // Signals para el estado global
  readonly isNavigating = signal(false);
  readonly isLoading = signal(false);

  // Contador de peticiones activas (más robusto que Set para condiciones de carrera)
  private activeRequestCount = 0;
  
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private debounceId: ReturnType<typeof setTimeout> | null = null;
  private routerSubscription: Subscription;

  constructor() {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isNavigating.set(true);
        // Safety: Reset HTTP loader on EVERY navigation start globally
        this.forceReset();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.isNavigating.set(false);
      }
    });
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
    this.clearDebounce();
    this.clearFailSafe();
  }

  /**
   * Show the loader (increments request counter)
   */
  showLoader(): void {
    this.activeRequestCount++;
    this.logger.debug(`showLoader: count=${this.activeRequestCount}`, undefined, 'LoadingService');
    
    if (this.activeRequestCount === 1) {
      this.clearDebounce();
      
      // Debounce to prevent flicker on fast requests
      this.debounceId = setTimeout(() => {
        if (this.activeRequestCount > 0) {
          this.logger.debug('Setting isLoading=true', undefined, 'LoadingService');
          this.isLoading.set(true);
          this.startFailSafeTimer();
        }
      }, 300);
    }
  }

  /**
   * Hide the loader (decrements request counter)
   */
  hideLoader(): void {
    this.activeRequestCount = Math.max(0, this.activeRequestCount - 1);
    this.logger.debug(`hideLoader: count=${this.activeRequestCount}`, undefined, 'LoadingService');

    if (this.activeRequestCount === 0) {
      this.stopLoadingState();
    }
  }

  /**
   * Force reset the loader state
   */
  forceReset(): void {
    this.logger.debug('forceReset called', undefined, 'LoadingService');
    this.activeRequestCount = 0;
    this.isLoading.set(false);
    this.clearDebounce();
    this.clearFailSafe();
  }

  /**
   * Stop the loading state and clear timers
   */
  private stopLoadingState(): void {
    this.logger.debug('Setting isLoading=false', undefined, 'LoadingService');
    this.isLoading.set(false);
    this.clearDebounce();
    this.clearFailSafe();
  }

  /**
   * Clear the debounce timer
   */
  private clearDebounce(): void {
    if (this.debounceId) {
      clearTimeout(this.debounceId);
      this.debounceId = null;
    }
  }

  /**
   * Clear the fail-safe timer
   */
  private clearFailSafe(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  /**
   * Start the fail-safe timer
   * If the loader gets stuck for more than 6 seconds, force reset
   */
  private startFailSafeTimer(): void {
    this.clearFailSafe();
    this.timeoutId = setTimeout(() => {
      if (this.isLoading()) {
        this.logger.warn('Fail-safe triggered. Forcing reset.', undefined, 'LoadingService');
        this.forceReset();
      }
    }, 6000);
  }
}
