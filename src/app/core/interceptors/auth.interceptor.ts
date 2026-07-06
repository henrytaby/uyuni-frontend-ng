import { HttpErrorResponse, HttpEvent, HttpHandlerFn,HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';

import { catchError, Observable,switchMap, throwError } from 'rxjs';

import { AuthService } from '@core/auth/auth.service';
import { LoggerService } from '@core/services/logger.service';
import { NetworkErrorService } from '@core/services/network-error.service';
import { TokenRefreshService } from '@core/services/token-refresh.service';

/**
 * Authentication Interceptor
 * 
 * This interceptor handles:
 * - Adding Bearer token to outgoing requests
 * - Adding X-Active-Role header for multi-tenant filtering
 * - Automatic token refresh on 401 errors
 * - Request queuing during token refresh
 * 
 * Refactored to use TokenRefreshService instead of global variables,
 * following the Single Responsibility Principle.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const tokenRefreshService = inject(TokenRefreshService);
  const logger = inject(LoggerService);
  const networkErrorService = inject(NetworkErrorService);

  const token = authService.getToken();
  const activeRole = authService.activeRole();

  let authReq = req;
  const headers: Record<string, string> = {};

  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Add active role header for backend filtering
  if (activeRole) {
    headers['X-Active-Role'] = activeRole.slug;
  }

  // Clone request with headers if any
  if (Object.keys(headers).length > 0) {
    authReq = req.clone({
      setHeaders: headers
    });
  }

  return next(authReq).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 0) {
          logger.error('Network Error Detected (Status 0)', error, 'AuthInterceptor');
          networkErrorService.triggerConnectionError();
        } else if (error.status === 401) {
          // Avoid refresh loops for auth endpoints
          if (isAuthEndpoint(req.url)) {
            logger.debug('401 on auth endpoint, not refreshing', { url: req.url }, 'AuthInterceptor');
            return throwError(() => error);
          }

          return handle401Error(authReq, next, tokenRefreshService, authService, logger);
        }
      }
      return throwError(() => error);
    })
  );
};

/**
 * Check if the request URL is an authentication endpoint
 */
function isAuthEndpoint(url: string): boolean {
  return url.includes('/auth/refresh') || url.includes('/auth/login');
}

/**
 * Handle 401 Unauthorized errors by refreshing the token
 * and retrying the original request.
 */
function handle401Error(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  tokenRefreshService: TokenRefreshService,
  authService: AuthService,
  logger: LoggerService
): Observable<HttpEvent<unknown>> {
  // If already refreshing, wait for the new token
  if (tokenRefreshService.isRefreshing()) {
    logger.debug('Token refresh in progress, waiting...', undefined, 'AuthInterceptor');
    
    return tokenRefreshService.waitForToken().pipe(
      switchMap(token => {
        logger.debug('Received refreshed token, retrying request', undefined, 'AuthInterceptor');
        return next(request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        }));
      })
    );
  }

  // Start refresh process
  logger.info('Starting token refresh due to 401', undefined, 'AuthInterceptor');

  return tokenRefreshService.refreshToken().pipe(
    switchMap(token => {
      logger.info('Token refreshed successfully, retrying request', undefined, 'AuthInterceptor');
      return next(request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      }));
    }),
    catchError((err) => {
      logger.error('Token refresh failed, logging out', err, 'AuthInterceptor');
      tokenRefreshService.reset();
      authService.logout();
      return throwError(() => err);
    })
  );
}
