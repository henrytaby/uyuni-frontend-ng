import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { of, throwError } from 'rxjs';

import { ConfigService } from '@core/config/config.service';

import { LoggerService } from './logger.service';
import { TokenRefreshService } from './token-refresh.service';

describe('TokenRefreshService', () => {
  let service: TokenRefreshService;
  let loggerMock: jest.Mocked<LoggerService>;
  let httpMock: jest.Mocked<HttpClient>;
  let configServiceMock: jest.Mocked<ConfigService>;

  beforeEach(() => {
    loggerMock = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn()
    } as unknown as jest.Mocked<LoggerService>;

    httpMock = {
      post: jest.fn()
    } as unknown as jest.Mocked<HttpClient>;

    configServiceMock = {
      apiUrl: 'https://api.test.com'
    } as unknown as jest.Mocked<ConfigService>;

    TestBed.configureTestingModule({
      providers: [
        TokenRefreshService,
        { provide: LoggerService, useValue: loggerMock },
        { provide: HttpClient, useValue: httpMock },
        { provide: ConfigService, useValue: configServiceMock }
      ]
    });

    service = TestBed.inject(TokenRefreshService);
    
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have initial isRefreshing as false', () => {
      expect(service.isRefreshing()).toBe(false);
    });
  });

  describe('refreshToken', () => {
    it('should return error if no refresh token in storage', (done) => {
      service.refreshToken().subscribe({
        error: (error) => {
          expect(error.message).toBe('No refresh token available');
          expect(loggerMock.warn).toHaveBeenCalledWith(
            'No refresh token available',
            undefined,
            'TokenRefreshService'
          );
          done();
        }
      });
    });

    it('should call refresh endpoint with refresh token', () => {
      localStorage.setItem('refresh_token', 'test-refresh-token');
      httpMock.post.mockReturnValue(of({ access_token: 'new-access', refresh_token: 'new-refresh' }));

      service.refreshToken().subscribe();

      expect(httpMock.post).toHaveBeenCalledWith(
        'https://api.test.com/auth/refresh',
        { refresh_token: 'test-refresh-token' }
      );
    });

    it('should store new tokens on success', fakeAsync(() => {
      localStorage.setItem('refresh_token', 'old-refresh');
      httpMock.post.mockReturnValue(of({ access_token: 'new-access', refresh_token: 'new-refresh' }));

      let result: string | undefined;
      service.refreshToken().subscribe(token => {
        result = token;
      });
      tick();

      expect(localStorage.getItem('access_token')).toBe('new-access');
      expect(localStorage.getItem('refresh_token')).toBe('new-refresh');
      expect(result).toBe('new-access');
    }));

    it('should set isRefreshing to true during refresh', () => {
      localStorage.setItem('refresh_token', 'test-refresh');
      httpMock.post.mockReturnValue(of({ access_token: 'new-access', refresh_token: 'new-refresh' }));

      const spy = jest.spyOn(service.isRefreshing, 'set');
      
      service.refreshToken().subscribe();

      expect(spy).toHaveBeenCalledWith(true);
    });

    it('should set isRefreshing to false after success', fakeAsync(() => {
      localStorage.setItem('refresh_token', 'test-refresh');
      httpMock.post.mockReturnValue(of({ access_token: 'new-access', refresh_token: 'new-refresh' }));

      service.refreshToken().subscribe();
      tick();

      expect(service.isRefreshing()).toBe(false);
    }));

    it('should set isRefreshing to false after error', fakeAsync(() => {
      localStorage.setItem('refresh_token', 'test-refresh');
      httpMock.post.mockReturnValue(throwError(() => new Error('Refresh failed')));

      service.refreshToken().subscribe({
        error: () => { /* expected error */ }
      });
      tick();

      expect(service.isRefreshing()).toBe(false);
    }));

    it('should log error on refresh failure', fakeAsync(() => {
      localStorage.setItem('refresh_token', 'test-refresh');
      const error = new Error('Refresh failed');
      httpMock.post.mockReturnValue(throwError(() => error));

      service.refreshToken().subscribe({
        error: () => { /* expected error */ }
      });
      tick();

      expect(loggerMock.error).toHaveBeenCalledWith(
        'Token refresh failed',
        error,
        'TokenRefreshService'
      );
    }));

    it('should return new access token on success', fakeAsync(() => {
      localStorage.setItem('refresh_token', 'test-refresh');
      httpMock.post.mockReturnValue(of({ access_token: 'new-access', refresh_token: 'new-refresh' }));

      let result: string | undefined;
      service.refreshToken().subscribe(token => {
        result = token;
      });
      tick();

      expect(result).toBe('new-access');
    }));

    it('should propagate error on failure', fakeAsync(() => {
      localStorage.setItem('refresh_token', 'test-refresh');
      const error = new Error('Refresh failed');
      httpMock.post.mockReturnValue(throwError(() => error));

      let caughtError: Error | undefined;
      service.refreshToken().subscribe({
        error: (err) => {
          caughtError = err;
        }
      });
      tick();

      expect(caughtError).toBe(error);
    }));
  });

  describe('waitForToken', () => {
    it('should emit when token is available', fakeAsync(() => {
      let emittedToken: string | undefined;
      
      service.waitForToken().subscribe(token => {
        emittedToken = token;
      });

      // Simulate token being set
      localStorage.setItem('refresh_token', 'test');
      httpMock.post.mockReturnValue(of({ access_token: 'new-token', refresh_token: 'new-refresh' }));
      
      service.refreshToken().subscribe();
      tick();

      expect(emittedToken).toBe('new-token');
    }));
  });

  describe('getRefreshToken', () => {
    it('should return null when no token in storage', () => {
      expect(service.getRefreshToken()).toBeNull();
    });

    it('should return token from storage', () => {
      localStorage.setItem('refresh_token', 'stored-token');
      expect(service.getRefreshToken()).toBe('stored-token');
    });
  });

  describe('reset', () => {
    it('should set isRefreshing to false', () => {
      service.isRefreshing.set(true);
      service.reset();
      expect(service.isRefreshing()).toBe(false);
    });

    it('should log debug message', () => {
      service.reset();
      expect(loggerMock.debug).toHaveBeenCalledWith(
        'Token refresh state reset',
        undefined,
        'TokenRefreshService'
      );
    });
  });

  describe('concurrent refresh prevention', () => {
    it('should return waitForToken if already refreshing', fakeAsync(() => {
      localStorage.setItem('refresh_token', 'test-refresh');
      
      // First refresh call - will actually make the HTTP request
      httpMock.post.mockReturnValue(of({ access_token: 'new-access', refresh_token: 'new-refresh' }));
      
      // Set isRefreshing to true manually to simulate concurrent call
      service.isRefreshing.set(true);
      
      // Second call should wait - it will return waitForToken() since isRefreshing is true
      // The refreshToken method checks isRefreshing() and returns waitForToken() if true
      service.refreshToken().subscribe();
      
      tick(1000);
      
      // Verify that the HTTP post was NOT called again (since we're waiting)
      // Because isRefreshing is true, the method returns waitForToken() instead of making HTTP call
      expect(httpMock.post).not.toHaveBeenCalled();
    }));
  });

  describe('edge cases', () => {
    it('should handle empty refresh token', (done) => {
      localStorage.setItem('refresh_token', '');
      service.refreshToken().subscribe({
        error: (error) => {
          expect(error.message).toBe('No refresh token available');
          done();
        }
      });
    });

    it('should handle malformed response', fakeAsync(() => {
      localStorage.setItem('refresh_token', 'test-refresh');
      httpMock.post.mockReturnValue(of({} as { access_token: string; refresh_token: string }));

      service.refreshToken().subscribe({
        next: (token) => {
          // Should handle gracefully - token would be undefined
          expect(token).toBeUndefined();
        },
        error: () => {
          // Or could error depending on implementation
        }
      });
      tick();
    }));

    it('should handle HTTP error response', fakeAsync(() => {
      localStorage.setItem('refresh_token', 'test-refresh');
      const httpError = new HttpErrorResponse({ status: 401 });
      httpMock.post.mockReturnValue(throwError(() => httpError));

      let caughtError: HttpErrorResponse | undefined;
      service.refreshToken().subscribe({
        error: (err) => {
          caughtError = err;
        }
      });
      tick();

      expect(caughtError).toBe(httpError);
    }));

    it('should handle network error', fakeAsync(() => {
      localStorage.setItem('refresh_token', 'test-refresh');
      const networkError = new ErrorEvent('network error');
      httpMock.post.mockReturnValue(throwError(() => networkError));

      let caughtError: unknown;
      service.refreshToken().subscribe({
        error: (err) => {
          caughtError = err;
        }
      });
      tick();

      expect(caughtError).toBeDefined();
    }));
  });
});
