# Lab 02: Implementar TokenRefreshService

## Objetivo

Crear un TokenRefreshService que maneje el refresh de tokens JWT con cola de peticiones para evitar race conditions.

## Duración

**45 minutos**

---

## Ejercicio 1: Crear Interfaces

```typescript
// src/app/core/services/token-refresh.service.ts
interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface QueuedRequest {
  request$: Observable<any>;
  subject: Subject<any>;
}
```

---

## Ejercicio 2: Implementar TokenRefreshService

```typescript
// src/app/core/services/token-refresh.service.ts
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, of, throwError } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { ConfigService } from '@core/config/config.service';
import { LoggerService } from '@core/services/logger.service';

@Injectable({ providedIn: 'root' })
export class TokenRefreshService {
  private readonly http = inject(HttpClient);
  private readonly configService = inject(ConfigService);
  private readonly logger = inject(LoggerService);

  private refreshing = signal(false);
  private queue: QueuedRequest[] = [];

  isRefreshing = this.refreshing.asReadonly();

  refreshToken(refreshToken: string): Observable<TokenResponse> {
    this.logger.info('Refreshing token...');
    this.refreshing.set(true);

    const apiUrl = this.configService.getApiUrl();

    return this.http.post<TokenResponse>(`${apiUrl}/auth/refresh`, {
      refreshToken
    }).pipe(
      tap(response => {
        this.logger.info('Token refreshed successfully');
        this.refreshing.set(false);
        this.processQueue(null, response);
      }),
      catchError(error => {
        this.logger.error('Token refresh failed', error);
        this.refreshing.set(false);
        this.processQueue(error, null);
        return throwError(() => error);
      })
    );
  }

  queueRequest<T>(request$: Observable<T>): Observable<T> {
    if (!this.refreshing()) {
      return request$;
    }

    this.logger.debug('Queueing request until refresh completes');

    return new Observable<T>(subscriber => {
      const queuedRequest: QueuedRequest = {
        request$,
        subject: new Subject<any>()
      };

      this.queue.push(queuedRequest);

      queuedRequest.subject.subscribe({
        next: value => subscriber.next(value),
        error: error => subscriber.error(error),
        complete: () => subscriber.complete()
      });
    });
  }

  private processQueue(error: any, tokens: TokenResponse | null): void {
    this.logger.debug(`Processing ${this.queue.length} queued requests`);

    this.queue.forEach(queuedRequest => {
      if (error) {
        queuedRequest.subject.error(error);
      } else {
        queuedRequest.request$.subscribe({
          next: value => queuedRequest.subject.next(value),
          error: err => queuedRequest.subject.error(err),
          complete: () => queuedRequest.subject.complete()
        });
      }
    });

    this.queue = [];
  }
}
```

---

## Ejercicio 3: Integrar con AuthService

```typescript
// src/app/core/auth/auth.service.ts (métodos relevantes)
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenRefreshService = inject(TokenRefreshService);

  private accessTokenSignal = signal<string | null>(null);
  private refreshTokenSignal = signal<string | null>(null);

  accessToken = this.accessTokenSignal.asReadonly();
  refreshToken = this.refreshTokenSignal.asReadonly();

  setTokens(tokens: TokenResponse): void {
    this.accessTokenSignal.set(tokens.accessToken);
    this.refreshTokenSignal.set(tokens.refreshToken);
    localStorage.setItem('access_token', tokens.accessToken);
    localStorage.setItem('refresh_token', tokens.refreshToken);
  }

  clearTokens(): void {
    this.accessTokenSignal.set(null);
    this.refreshTokenSignal.set(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  refreshAccessToken(): Observable<TokenResponse> {
    const refreshToken = this.refreshTokenSignal();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }
    return this.tokenRefreshService.refreshToken(refreshToken);
  }
}
```

---

## Ejercicio 4: Integrar con AuthInterceptor

```typescript
// src/app/core/interceptors/auth.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const tokenRefreshService = inject(TokenRefreshService);
  const logger = inject(LoggerService);

  // Skip auth endpoints
  if (req.url.includes('/auth/')) {
    return next(req);
  }

  const token = authService.accessToken();
  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });

  return next(authReq).pipe(
    catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        logger.info('Token expired, attempting refresh');
        return handle401Error(authService, tokenRefreshService, req, next);
      }
      return throwError(() => error);
    })
  );
};

function handle401Error(
  authService: AuthService,
  tokenRefreshService: TokenRefreshService,
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> {
  const refreshToken = authService.refreshToken();

  if (!refreshToken) {
    authService.logout();
    return throwError(() => new Error('No refresh token'));
  }

  if (tokenRefreshService.isRefreshing()) {
    return tokenRefreshService.queueRequest(
      retryRequestWithNewToken(authService, req, next)
    );
  }

  return tokenRefreshService.refreshToken(refreshToken).pipe(
    tap(tokens => authService.setTokens(tokens)),
    switchMap(() => retryRequestWithNewToken(authService, req, next)),
    catchError(error => {
      authService.logout();
      return throwError(() => error);
    })
  );
}

function retryRequestWithNewToken(
  authService: AuthService,
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> {
  const newToken = authService.accessToken();
  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${newToken}` }
  });
  return next(authReq);
}
```

---

## Ejercicio 5: Tests Unitarios

```typescript
// src/app/core/services/token-refresh.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { TokenRefreshService } from './token-refresh.service';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '@core/config/config.service';
import { LoggerService } from '@core/services/logger.service';
import { of, throwError } from 'rxjs';

describe('TokenRefreshService', () => {
  let service: TokenRefreshService;
  let httpMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    httpMock = { post: jest.fn() } as any;

    TestBed.configureTestingModule({
      providers: [
        TokenRefreshService,
        { provide: HttpClient, useValue: httpMock },
        { provide: ConfigService, useValue: { getApiUrl: () => 'http://test.api' } },
        { provide: LoggerService, useValue: { info: jest.fn(), debug: jest.fn(), error: jest.fn() } }
      ]
    });

    service = TestBed.inject(TokenRefreshService);
  });

  describe('refreshToken', () => {
    it('should call refresh endpoint', () => {
      httpMock.post.mockReturnValue(of({ accessToken: 'token' }));

      service.refreshToken('refresh').subscribe();

      expect(httpMock.post).toHaveBeenCalledWith(
        'http://test.api/auth/refresh',
        { refreshToken: 'refresh' }
      );
    });

    it('should set refreshing to true during refresh', (done) => {
      httpMock.post.mockReturnValue(of({ accessToken: 'token' }));

      expect(service.isRefreshing()).toBe(false);

      service.refreshToken('refresh').subscribe({
        complete: () => {
          expect(service.isRefreshing()).toBe(false);
          done();
        }
      });

      expect(service.isRefreshing()).toBe(true);
    });

    it('should handle refresh error', (done) => {
      httpMock.post.mockReturnValue(throwError(() => new Error('Refresh failed')));

      service.refreshToken('refresh').subscribe({
        error: (error) => {
          expect(service.isRefreshing()).toBe(false);
          expect(error.message).toBe('Refresh failed');
          done();
        }
      });
    });
  });

  describe('queueRequest', () => {
    it('should execute request if not refreshing', (done) => {
      const request$ = of('result');

      service.queueRequest(request$).subscribe(result => {
        expect(result).toBe('result');
        done();
      });
    });

    it('should queue request if refreshing', (done) => {
      httpMock.post.mockReturnValue(of({ accessToken: 'new-token' }));

      service.refreshToken('refresh').subscribe();

      const request$ = of('queued-result');
      service.queueRequest(request$).subscribe(result => {
        expect(result).toBe('queued-result');
        done();
      });
    });
  });
});
```

---

## Verificación

### Ejecutar tests

```bash
npm test -- --include="**/token-refresh.service.spec.ts"
```

### Verificar flujo completo

1. Login con credenciales válidas
2. Esperar a que el token expire
3. Hacer una petición HTTP
4. Verificar que el refresh se ejecuta automáticamente
5. Verificar que la petición original se completa

---

## Retos Adicionales

1. **Proactive refresh**: Refrescar token antes de que expire
2. **Max retries**: Limitar intentos de refresh
3. **Token expiration tracking**: Calcular tiempo hasta expiración

---

*Lab 02 - TokenRefreshService*
*Curso: Angular 21 Enterprise*
*Día: 5 de 18*
