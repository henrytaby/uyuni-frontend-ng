import { HttpErrorResponse, HttpEvent, HttpHeaders,HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { of, throwError } from 'rxjs';

import { AuthService } from '@core/auth/auth.service';
import { LoggerService } from '@core/services/logger.service';
import { NetworkErrorService } from '@core/services/network-error.service';
import { TokenRefreshService } from '@core/services/token-refresh.service';

import { UserRole } from '@features/auth/models/auth.models';

import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let mockAuthService: jest.Mocked<AuthService>;
  let mockTokenRefreshService: jest.Mocked<TokenRefreshService>;
  let mockLoggerService: jest.Mocked<LoggerService>;
  let mockNetworkErrorService: jest.Mocked<NetworkErrorService>;
  let mockHandler: jest.Mock;

  // Helper to create mock requests
  const createRequest = (url: string, method = 'GET'): HttpRequest<unknown> => {
    return new HttpRequest<unknown>(method, url, null, {
      headers: new HttpHeaders(),
    });
  };

  beforeEach(() => {
    // Create mocks
    mockAuthService = {
      getToken: jest.fn(),
      activeRole: jest.fn(),
      logout: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    mockTokenRefreshService = {
      isRefreshing: jest.fn(),
      waitForToken: jest.fn(),
      refreshToken: jest.fn(),
      reset: jest.fn(),
    } as unknown as jest.Mocked<TokenRefreshService>;

    mockLoggerService = {
      debug: jest.fn(),
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    mockNetworkErrorService = {
      triggerConnectionError: jest.fn(),
    } as unknown as jest.Mocked<NetworkErrorService>;

    mockHandler = jest.fn();

    // Configure TestBed
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: TokenRefreshService, useValue: mockTokenRefreshService },
        { provide: LoggerService, useValue: mockLoggerService },
        { provide: NetworkErrorService, useValue: mockNetworkErrorService },
      ],
    });
  });

  describe('token attachment', () => {
    it('should add Authorization header when token exists', (done) => {
      // Arrange
      mockAuthService.getToken.mockReturnValue('test-token');
      mockAuthService.activeRole.mockReturnValue(null);
      mockHandler.mockReturnValue(of({} as HttpEvent<unknown>));

      const request = createRequest('/api/data');

      // Act
      const result$ = TestBed.runInInjectionContext(() => 
        authInterceptor(request, mockHandler)
      );

      // Assert
      result$.subscribe({
        next: () => {
          expect(mockHandler).toHaveBeenCalled();
          const handledRequest = mockHandler.mock.calls[0][0] as HttpRequest<unknown>;
          expect(handledRequest.headers.get('Authorization')).toBe('Bearer test-token');
          done();
        },
        error: done.fail
      });
    });

    it('should not add Authorization header when token is null', (done) => {
      // Arrange
      mockAuthService.getToken.mockReturnValue(null);
      mockAuthService.activeRole.mockReturnValue(null);
      mockHandler.mockReturnValue(of({} as HttpEvent<unknown>));

      const request = createRequest('/api/data');

      // Act
      const result$ = TestBed.runInInjectionContext(() => 
        authInterceptor(request, mockHandler)
      );

      // Assert
      result$.subscribe({
        next: () => {
          const handledRequest = mockHandler.mock.calls[0][0] as HttpRequest<unknown>;
          expect(handledRequest.headers.get('Authorization')).toBeNull();
          done();
        },
        error: done.fail
      });
    });

    it('should not add Authorization header when token is empty string', (done) => {
      // Arrange
      mockAuthService.getToken.mockReturnValue('');
      mockAuthService.activeRole.mockReturnValue(null);
      mockHandler.mockReturnValue(of({} as HttpEvent<unknown>));

      const request = createRequest('/api/data');

      // Act
      const result$ = TestBed.runInInjectionContext(() => 
        authInterceptor(request, mockHandler)
      );

      // Assert
      result$.subscribe({
        next: () => {
          const handledRequest = mockHandler.mock.calls[0][0] as HttpRequest<unknown>;
          expect(handledRequest.headers.get('Authorization')).toBeNull();
          done();
        },
        error: done.fail
      });
    });
  });

  describe('X-Active-Role header', () => {
    it('should add X-Active-Role header when activeRole exists', (done) => {
      // Arrange
      mockAuthService.getToken.mockReturnValue('test-token');
      mockAuthService.activeRole.mockReturnValue({ id: 1, slug: 'admin', name: 'Admin' } as UserRole);
      mockHandler.mockReturnValue(of({} as HttpEvent<unknown>));

      const request = createRequest('/api/data');

      // Act
      const result$ = TestBed.runInInjectionContext(() => 
        authInterceptor(request, mockHandler)
      );

      // Assert
      result$.subscribe({
        next: () => {
          const handledRequest = mockHandler.mock.calls[0][0] as HttpRequest<unknown>;
          expect(handledRequest.headers.get('X-Active-Role')).toBe('admin');
          done();
        },
        error: done.fail
      });
    });

    it('should not add X-Active-Role header when activeRole is null', (done) => {
      // Arrange
      mockAuthService.getToken.mockReturnValue('test-token');
      mockAuthService.activeRole.mockReturnValue(null);
      mockHandler.mockReturnValue(of({} as HttpEvent<unknown>));

      const request = createRequest('/api/data');

      // Act
      const result$ = TestBed.runInInjectionContext(() => 
        authInterceptor(request, mockHandler)
      );

      // Assert
      result$.subscribe({
        next: () => {
          const handledRequest = mockHandler.mock.calls[0][0] as HttpRequest<unknown>;
          expect(handledRequest.headers.get('X-Active-Role')).toBeNull();
          done();
        },
        error: done.fail
      });
    });

    it('should add both headers when both token and role exist', (done) => {
      // Arrange
      mockAuthService.getToken.mockReturnValue('test-token');
      mockAuthService.activeRole.mockReturnValue({ id: 1, slug: 'user', name: 'User' } as UserRole);
      mockHandler.mockReturnValue(of({} as HttpEvent<unknown>));

      const request = createRequest('/api/data');

      // Act
      const result$ = TestBed.runInInjectionContext(() => 
        authInterceptor(request, mockHandler)
      );

      // Assert
      result$.subscribe({
        next: () => {
          const handledRequest = mockHandler.mock.calls[0][0] as HttpRequest<unknown>;
          expect(handledRequest.headers.get('Authorization')).toBe('Bearer test-token');
          expect(handledRequest.headers.get('X-Active-Role')).toBe('user');
          done();
        },
        error: done.fail
      });
    });
  });

  describe('401 error handling', () => {
    it('should propagate error for auth endpoints without refresh', (done) => {
      // Arrange
      mockAuthService.getToken.mockReturnValue('test-token');
      mockAuthService.activeRole.mockReturnValue(null);
      
      const error401 = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });
      mockHandler.mockReturnValue(throwError(() => error401));

      const request = createRequest('/auth/login');

      // Act
      const result$ = TestBed.runInInjectionContext(() => 
        authInterceptor(request, mockHandler)
      );

      // Assert
      result$.subscribe({
        next: () => done.fail('Should have thrown error'),
        error: (error) => {
          expect(error.status).toBe(401);
          expect(mockLoggerService.debug).toHaveBeenCalledWith(
            '401 on auth endpoint, not refreshing',
            { url: '/auth/login' },
            'AuthInterceptor'
          );
          expect(mockTokenRefreshService.refreshToken).not.toHaveBeenCalled();
          done();
        }
      });
    });

    it('should propagate error for refresh endpoint without refresh', (done) => {
      // Arrange
      mockAuthService.getToken.mockReturnValue('test-token');
      mockAuthService.activeRole.mockReturnValue(null);
      
      const error401 = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });
      mockHandler.mockReturnValue(throwError(() => error401));

      const request = createRequest('/auth/refresh');

      // Act
      const result$ = TestBed.runInInjectionContext(() => 
        authInterceptor(request, mockHandler)
      );

      // Assert
      result$.subscribe({
        next: () => done.fail('Should have thrown error'),
        error: (error) => {
          expect(error.status).toBe(401);
          expect(mockTokenRefreshService.refreshToken).not.toHaveBeenCalled();
          done();
        }
      });
    });

    it('should start token refresh on 401 for non-auth endpoints', (done) => {
      // Arrange
      mockAuthService.getToken.mockReturnValue('test-token');
      mockAuthService.activeRole.mockReturnValue(null);
      mockTokenRefreshService.isRefreshing.mockReturnValue(false);
      mockTokenRefreshService.refreshToken.mockReturnValue(of('new-token'));
      
      let callCount = 0;
      mockHandler.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return throwError(() => new HttpErrorResponse({ status: 401 }));
        }
        return of({} as HttpEvent<unknown>);
      });

      const request = createRequest('/api/data');

      // Act
      const result$ = TestBed.runInInjectionContext(() => 
        authInterceptor(request, mockHandler)
      );

      // Assert
      result$.subscribe({
        next: () => {
          expect(mockTokenRefreshService.refreshToken).toHaveBeenCalled();
          expect(mockLoggerService.info).toHaveBeenCalledWith(
            'Starting token refresh due to 401',
            undefined,
            'AuthInterceptor'
          );
          done();
        },
        error: done.fail
      });
    });

    it('should wait for token if already refreshing', (done) => {
      // Arrange
      mockAuthService.getToken.mockReturnValue('test-token');
      mockAuthService.activeRole.mockReturnValue(null);
      mockTokenRefreshService.isRefreshing.mockReturnValue(true);
      mockTokenRefreshService.waitForToken.mockReturnValue(of('new-token'));
      
      let callCount = 0;
      mockHandler.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return throwError(() => new HttpErrorResponse({ status: 401 }));
        }
        return of({} as HttpEvent<unknown>);
      });

      const request = createRequest('/api/data');

      // Act
      const result$ = TestBed.runInInjectionContext(() => 
        authInterceptor(request, mockHandler)
      );

      // Assert
      result$.subscribe({
        next: () => {
          expect(mockTokenRefreshService.waitForToken).toHaveBeenCalled();
          expect(mockTokenRefreshService.refreshToken).not.toHaveBeenCalled();
          expect(mockLoggerService.debug).toHaveBeenCalledWith(
            'Token refresh in progress, waiting...',
            undefined,
            'AuthInterceptor'
          );
          done();
        },
        error: done.fail
      });
    });

    it('should logout on refresh failure', (done) => {
      // Arrange
      mockAuthService.getToken.mockReturnValue('test-token');
      mockAuthService.activeRole.mockReturnValue(null);
      mockTokenRefreshService.isRefreshing.mockReturnValue(false);
      mockTokenRefreshService.refreshToken.mockReturnValue(
        throwError(() => new Error('Refresh failed'))
      );

      mockHandler.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 401 })));

      const request = createRequest('/api/data');

      // Act
      const result$ = TestBed.runInInjectionContext(() => 
        authInterceptor(request, mockHandler)
      );

      // Assert
      result$.subscribe({
        next: () => done.fail('Should have thrown error'),
        error: (error) => {
          expect(error.message).toBe('Refresh failed');
          expect(mockAuthService.logout).toHaveBeenCalled();
          expect(mockTokenRefreshService.reset).toHaveBeenCalled();
          expect(mockLoggerService.error).toHaveBeenCalledWith(
            'Token refresh failed, logging out',
            expect.any(Error),
            'AuthInterceptor'
          );
          done();
        }
      });
    });
  });

  describe('non-401 errors', () => {
    it('should trigger connection error on network error (status 0)', (done) => {
      // Arrange
      mockAuthService.getToken.mockReturnValue('test-token');
      mockAuthService.activeRole.mockReturnValue(null);
      
      const error0 = new HttpErrorResponse({ status: 0, statusText: 'Unknown Error' });
      mockHandler.mockReturnValue(throwError(() => error0));

      const request = createRequest('/api/data');

      // Act
      const result$ = TestBed.runInInjectionContext(() => 
        authInterceptor(request, mockHandler)
      );

      // Assert
      result$.subscribe({
        next: () => done.fail('Should have thrown error'),
        error: (error) => {
          expect(error.status).toBe(0);
          expect(mockNetworkErrorService.triggerConnectionError).toHaveBeenCalled();
          expect(mockLoggerService.error).toHaveBeenCalledWith(
            'Network Error Detected (Status 0)',
            error,
            'AuthInterceptor'
          );
          done();
        }
      });
    });
    it('should propagate non-401 errors without refresh', (done) => {
      // Arrange
      mockAuthService.getToken.mockReturnValue('test-token');
      mockAuthService.activeRole.mockReturnValue(null);
      
      const error500 = new HttpErrorResponse({ status: 500, statusText: 'Server Error' });
      mockHandler.mockReturnValue(throwError(() => error500));

      const request = createRequest('/api/data');

      // Act
      const result$ = TestBed.runInInjectionContext(() => 
        authInterceptor(request, mockHandler)
      );

      // Assert
      result$.subscribe({
        next: () => done.fail('Should have thrown error'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(mockTokenRefreshService.refreshToken).not.toHaveBeenCalled();
          done();
        }
      });
    });

    it('should propagate non-HttpErrorResponse errors', (done) => {
      // Arrange
      mockAuthService.getToken.mockReturnValue('test-token');
      mockAuthService.activeRole.mockReturnValue(null);
      
      const networkError = new Error('Network error');
      mockHandler.mockReturnValue(throwError(() => networkError));

      const request = createRequest('/api/data');

      // Act
      const result$ = TestBed.runInInjectionContext(() => 
        authInterceptor(request, mockHandler)
      );

      // Assert
      result$.subscribe({
        next: () => done.fail('Should have thrown error'),
        error: (error) => {
          expect(error.message).toBe('Network error');
          expect(mockTokenRefreshService.refreshToken).not.toHaveBeenCalled();
          done();
        }
      });
    });
  });

  describe('request cloning', () => {
    it('should not clone request when no headers to add', (done) => {
      // Arrange
      mockAuthService.getToken.mockReturnValue(null);
      mockAuthService.activeRole.mockReturnValue(null);
      mockHandler.mockReturnValue(of({} as HttpEvent<unknown>));

      const request = createRequest('/api/data');

      // Act
      const result$ = TestBed.runInInjectionContext(() => 
        authInterceptor(request, mockHandler)
      );

      // Assert
      result$.subscribe({
        next: () => {
          // The request should be the same object (not cloned)
          const handledRequest = mockHandler.mock.calls[0][0];
          expect(handledRequest).toBe(request);
          done();
        },
        error: done.fail
      });
    });

    it('should clone request when token exists', (done) => {
      // Arrange
      mockAuthService.getToken.mockReturnValue('test-token');
      mockAuthService.activeRole.mockReturnValue(null);
      mockHandler.mockReturnValue(of({} as HttpEvent<unknown>));

      const request = createRequest('/api/data');

      // Act
      const result$ = TestBed.runInInjectionContext(() => 
        authInterceptor(request, mockHandler)
      );

      // Assert
      result$.subscribe({
        next: () => {
          const handledRequest = mockHandler.mock.calls[0][0];
          // Cloned request is a different object
          expect(handledRequest).not.toBe(request);
          done();
        },
        error: done.fail
      });
    });
  });

  describe('auth endpoint detection', () => {
    // Testing the isAuthEndpoint function indirectly through the interceptor
    it('should detect /auth/login as auth endpoint', (done) => {
      mockAuthService.getToken.mockReturnValue('test-token');
      mockAuthService.activeRole.mockReturnValue(null);
      mockHandler.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 401 })));

      const request = createRequest('/auth/login');

      TestBed.runInInjectionContext(() => authInterceptor(request, mockHandler)).subscribe({
        error: () => {
          expect(mockTokenRefreshService.refreshToken).not.toHaveBeenCalled();
          done();
        }
      });
    });

    it('should detect /auth/refresh as auth endpoint', (done) => {
      mockAuthService.getToken.mockReturnValue('test-token');
      mockAuthService.activeRole.mockReturnValue(null);
      mockHandler.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 401 })));

      const request = createRequest('/auth/refresh');

      TestBed.runInInjectionContext(() => authInterceptor(request, mockHandler)).subscribe({
        error: () => {
          expect(mockTokenRefreshService.refreshToken).not.toHaveBeenCalled();
          done();
        }
      });
    });

    it('should not detect /api/data as auth endpoint', (done) => {
      mockAuthService.getToken.mockReturnValue('test-token');
      mockAuthService.activeRole.mockReturnValue(null);
      mockTokenRefreshService.isRefreshing.mockReturnValue(false);
      mockTokenRefreshService.refreshToken.mockReturnValue(of('new-token'));
      
      let callCount = 0;
      mockHandler.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return throwError(() => new HttpErrorResponse({ status: 401 }));
        }
        return of({} as HttpEvent<unknown>);
      });

      const request = createRequest('/api/data');

      TestBed.runInInjectionContext(() => authInterceptor(request, mockHandler)).subscribe({
        next: () => {
          expect(mockTokenRefreshService.refreshToken).toHaveBeenCalled();
          done();
        },
        error: done.fail
      });
    });

    it('should detect auth endpoints in full URLs', (done) => {
      mockAuthService.getToken.mockReturnValue('test-token');
      mockAuthService.activeRole.mockReturnValue(null);
      mockHandler.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 401 })));

      const request = createRequest('https://api.example.com/auth/login');

      TestBed.runInInjectionContext(() => authInterceptor(request, mockHandler)).subscribe({
        error: () => {
          expect(mockTokenRefreshService.refreshToken).not.toHaveBeenCalled();
          done();
        }
      });
    });

    it('should not detect /auth/logout as auth endpoint for refresh purposes', (done) => {
      mockAuthService.getToken.mockReturnValue('test-token');
      mockAuthService.activeRole.mockReturnValue(null);
      mockTokenRefreshService.isRefreshing.mockReturnValue(false);
      mockTokenRefreshService.refreshToken.mockReturnValue(of('new-token'));
      
      let callCount = 0;
      mockHandler.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return throwError(() => new HttpErrorResponse({ status: 401 }));
        }
        return of({} as HttpEvent<unknown>);
      });

      const request = createRequest('/auth/logout');

      TestBed.runInInjectionContext(() => authInterceptor(request, mockHandler)).subscribe({
        next: () => {
          // /auth/logout is NOT in the isAuthEndpoint check, so it should trigger refresh
          expect(mockTokenRefreshService.refreshToken).toHaveBeenCalled();
          done();
        },
        error: done.fail
      });
    });
  });
});
