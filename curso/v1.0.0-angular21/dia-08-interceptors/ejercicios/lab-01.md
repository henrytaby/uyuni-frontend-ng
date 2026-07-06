# Lab 01: authInterceptor

## Objetivo
Implementar authInterceptor para inyección automática de tokens y manejo de errores 401.

## Ejercicios
1. Crear authInterceptor básico
2. Inyectar token Bearer
3. Añadir header X-Active-Role
4. Manejar errores 401

## Código Base

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // TODO: Implementar
  return next(req);
};
```

## Solución Paso a Paso

### Paso 1: Inyectar Servicios

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const tokenRefreshService = inject(TokenRefreshService);
  const logger = inject(LoggerService);

  return next(req);
};
```

### Paso 2: Obtener Token y Rol

```typescript
const token = authService.getToken();
const activeRole = authService.activeRole();

let authReq = req;
const headers: Record<string, string> = {};
```

### Paso 3: Añadir Headers

```typescript
if (token) {
  headers['Authorization'] = `Bearer ${token}`;
}

if (activeRole) {
  headers['X-Active-Role'] = activeRole.slug;
}

if (Object.keys(headers).length > 0) {
  authReq = req.clone({ setHeaders: headers });
}
```

### Paso 4: Manejar Errores 401

```typescript
return next(authReq).pipe(
  catchError((error: unknown) => {
    if (error instanceof HttpErrorResponse && error.status === 401) {
      if (isAuthEndpoint(req.url)) {
        logger.debug('401 on auth endpoint, not refreshing');
        return throwError(() => error);
      }
      return handle401Error(authReq, next, tokenRefreshService, authService, logger);
    }
    return throwError(() => error);
  })
);
```

### Paso 5: Implementar Funciones Auxiliares

```typescript
function isAuthEndpoint(url: string): boolean {
  return url.includes('/auth/refresh') || url.includes('/auth/login');
}

function handle401Error(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  tokenRefreshService: TokenRefreshService,
  authService: AuthService,
  logger: LoggerService
): Observable<HttpEvent<unknown>> {
  if (tokenRefreshService.isRefreshing()) {
    return tokenRefreshService.waitForToken().pipe(
      switchMap(token => next(request.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      })))
    );
  }

  return tokenRefreshService.refreshToken().pipe(
    switchMap(token => next(request.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    }))),
    catchError(err => {
      tokenRefreshService.reset();
      authService.logout();
      return throwError(() => err);
    })
  );
}
```

## Testing

```typescript
// En app.config.ts
provideHttpClient(
  withInterceptors([authInterceptor])
)
```

---

*Lab 01 - Día 8*
