# Contenido Completo - Día 6: AuthErrorHandlerService y NetworkErrorService

## 1. Introducción al Manejo de Errores

### Tipos de Errores HTTP

| Status | Tipo | Manejo |
|--------|------|--------|
| 401 | Token expirado | Refresh token |
| 403 | Sin permisos | Logout + mensaje |
| 404 | No encontrado | Mensaje al usuario |
| 500 | Error servidor | Retry + mensaje |
| 0/503 | Error de red | Retry con backoff |

### Estrategias de Recuperación

```
┌─────────────────────────────────────────────────────────────┐
│              ESTRATEGIAS DE RECUPERACIÓN                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. RETRY INMEDIATO                                          │
│     - Error temporal (timeout)                              │
│     - Reintentar una vez                                    │
│                                                              │
│  2. EXPONENTIAL BACKOFF                                      │
│     - Error de red                                          │
│     - Reintentar con delay creciente                        │
│                                                              │
│  3. REFRESH TOKEN                                            │
│     - Token expirado (401)                                  │
│     - Refrescar y reintentar                                │
│                                                              │
│  4. LOGOUT                                                   │
│     - Token inválido (403)                                  │
│     - Cerrar sesión                                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. AuthErrorHandlerService

### Implementación

```typescript
@Injectable({ providedIn: 'root' })
export class AuthErrorHandlerService {
  private readonly authService = inject(AuthService);
  private readonly logger = inject(LoggerService);
  private readonly router = inject(Router);

  handleAuthError(error: HttpErrorResponse): Observable<never> {
    this.logger.error('Auth error:', error);

    switch (error.status) {
      case 401:
        // Handled by TokenRefreshService
        return throwError(() => error);

      case 403:
        return this.handleForbidden(error);

      default:
        return this.handleGenericAuthError(error);
    }
  }

  private handleForbidden(error: HttpErrorResponse): Observable<never> {
    const message = this.getForbiddenMessage(error);
    this.showErrorMessage(message);
    this.authService.logout();
    return throwError(() => error);
  }

  private getForbiddenMessage(error: HttpErrorResponse): string {
    const detail = error.error?.detail;
    if (detail?.includes('locked')) {
      return 'Su cuenta ha sido bloqueada. Contacte al administrador.';
    }
    if (detail?.includes('disabled')) {
      return 'Su cuenta está deshabilitada.';
    }
    return 'No tiene permisos para realizar esta acción.';
  }

  private showErrorMessage(message: string): void {
    // Usar MessageService de PrimeNG
    this.messageService.add({
      severity: 'error',
      summary: 'Error de Autenticación',
      detail: message
    });
  }
}
```

---

## 3. NetworkErrorService

### Implementación

```typescript
@Injectable({ providedIn: 'root' })
export class NetworkErrorService {
  private readonly logger = inject(LoggerService);
  
  private online = signal(navigator.onLine);
  
  isOnline = this.online.asReadonly();

  constructor() {
    window.addEventListener('online', () => this.online.set(true));
    window.addEventListener('offline', () => this.online.set(false));
  }

  isNetworkError(error: unknown): boolean {
    if (!(error instanceof HttpErrorResponse)) {
      return false;
    }
    return error.status === 0 || error.status === 503;
  }

  retryWithBackoff<T>(
    request: Observable<T>,
    maxRetries = 3,
    delayMs = 1000
  ): Observable<T> {
    return request.pipe(
      retryWhen(errors =>
        errors.pipe(
          scan((acc, error) => ({ count: acc.count + 1, error }), 
               { count: 0, error: null as any }),
          tap(acc => {
            if (this.isNetworkError(acc.error) && acc.count < maxRetries) {
              this.logger.warn(`Retry ${acc.count}/${maxRetries}`);
            }
          }),
          takeWhile(acc => 
            this.isNetworkError(acc.error) && acc.count < maxRetries,
            true
          ),
          delayWhen(acc => timer(delayMs * Math.pow(2, acc.count)))
        )
      )
    );
  }
}
```

### Exponential Backoff

```
┌─────────────────────────────────────────────────────────────┐
│                 EXPONENTIAL BACKOFF                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Retry 1: delay = 1000ms * 2^0 = 1000ms                     │
│  Retry 2: delay = 1000ms * 2^1 = 2000ms                     │
│  Retry 3: delay = 1000ms * 2^2 = 4000ms                     │
│                                                              │
│  Total: 7 segundos antes de fallar                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Integración con Interceptor

```typescript
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authErrorHandler = inject(AuthErrorHandlerService);
  const networkErrorService = inject(NetworkErrorService);

  return next(req).pipe(
    catchError(error => {
      if (error.status === 401 || error.status === 403) {
        return authErrorHandler.handleAuthError(error);
      }
      if (networkErrorService.isNetworkError(error)) {
        return networkErrorService.retryWithBackoff(next(req));
      }
      return throwError(() => error);
    })
  );
};
```

---

## 5. Testing

```typescript
describe('NetworkErrorService', () => {
  let service: NetworkErrorService;

  beforeEach(() => {
    service = new NetworkErrorService();
  });

  it('should detect network error', () => {
    const error = new HttpErrorResponse({ status: 0 });
    expect(service.isNetworkError(error)).toBe(true);
  });

  it('should not detect non-network error', () => {
    const error = new HttpErrorResponse({ status: 404 });
    expect(service.isNetworkError(error)).toBe(false);
  });
});
```

---

*Curso: Angular 21 Enterprise*
*Día: 6 de 18*
