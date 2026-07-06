# Cheatsheet - Día 8: Interceptors

## Estructura Básica

```typescript
export const myInterceptor: HttpInterceptorFn = (req, next) => {
  // Antes de enviar
  return next(req).pipe(
    // Después de recibir
  );
};
```

---

## Registro

```typescript
// app.config.ts
provideHttpClient(
  withInterceptors([
    loadingInterceptor,
    authInterceptor
  ])
)
```

---

## authInterceptor

### Inyección de Token
```typescript
const authService = inject(AuthService);
const token = authService.getToken();

if (token) {
  authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });
}
```

### Header X-Active-Role
```typescript
const activeRole = authService.activeRole();

if (activeRole) {
  headers['X-Active-Role'] = activeRole.slug;
}
```

### Manejo de Errores 401
```typescript
catchError((error: unknown) => {
  if (error instanceof HttpErrorResponse && error.status === 401) {
    if (isAuthEndpoint(req.url)) {
      return throwError(() => error);
    }
    return handle401Error(authReq, next, ...);
  }
  return throwError(() => error);
})
```

---

## Funciones Auxiliares

### isAuthEndpoint
```typescript
function isAuthEndpoint(url: string): boolean {
  return url.includes('/auth/refresh') || url.includes('/auth/login');
}
```

### handle401Error
```typescript
function handle401Error(request, next, tokenRefreshService, authService, logger) {
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

---

## loadingInterceptor

```typescript
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  loadingService.show();

  return next(req).pipe(
    finalize(() => loadingService.hide())
  );
};
```

---

## Operadores RxJS

| Operador | Uso |
|----------|-----|
| `tap` | Efectos secundarios |
| `catchError` | Manejar errores |
| `finalize` | Limpieza (siempre se ejecuta) |
| `switchMap` | Cambiar a otro observable |

---

## Headers Comunes

| Header | Valor | Propósito |
|--------|-------|-----------|
| Authorization | `Bearer {token}` | Autenticación |
| X-Active-Role | `{role_slug}` | Filtrado por rol |
| Content-Type | `application/json` | Tipo de contenido |

---

## Flujo de Request

```
Request → loadingInterceptor → authInterceptor → Backend
           ↓ show()             ↓ add token
           
Response ← loadingInterceptor ← authInterceptor ← Backend
           ↓ hide()             ↓ handle 401
```

---

## Buenas Prácticas

1. ✅ Usar functional interceptors
2. ✅ Inyectar con inject()
3. ✅ Clonar requests (inmutables)
4. ✅ Evitar loops de refresh
5. ✅ Usar cola para requests
6. ✅ Manejar todos los errores
7. ✅ Loggear eventos importantes

---

## Errores Comunes

### No Clonar
```typescript
// ❌ MAL
req.headers.set('Authorization', token);

// ✅ BIEN
req.clone({ setHeaders: { Authorization: token } });
```

### Loop de Refresh
```typescript
// ❌ MAL
if (error.status === 401) {
  return authService.refreshToken(); // Loop!
}

// ✅ BIEN
if (error.status === 401 && !isAuthEndpoint(req.url)) {
  return handle401Error(...);
}
```

---

*Cheatsheet - Día 8*
