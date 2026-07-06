marp: true
theme: default
paginate: true

---

# Día 6: AuthErrorHandlerService y NetworkErrorService

**Curso: Angular 21 Enterprise**

---

# Agenda

1. Tipos de errores HTTP
2. AuthErrorHandlerService
3. NetworkErrorService
4. Exponential Backoff
5. Integración con Interceptors
6. Testing

---

# Tipos de Errores HTTP

| Status | Tipo | Manejo |
|--------|------|--------|
| 401 | Token expirado | Refresh |
| 403 | Sin permisos | Logout |
| 500 | Error servidor | Retry |
| 0/503 | Error de red | Backoff |

---

# AuthErrorHandlerService

```typescript
handleAuthError(error: HttpErrorResponse): Observable<never> {
  switch (error.status) {
    case 401: return throwError(() => error);
    case 403: return this.handleForbidden(error);
    default: return this.handleGeneric(error);
  }
}
```

---

# NetworkErrorService

```typescript
isNetworkError(error: unknown): boolean {
  return error instanceof HttpErrorResponse && 
         (error.status === 0 || error.status === 503);
}
```

---

# Exponential Backoff

```
Retry 1: 1000ms * 2^0 = 1000ms
Retry 2: 1000ms * 2^1 = 2000ms
Retry 3: 1000ms * 2^2 = 4000ms
```

---

# Integración

```typescript
// En interceptor
catchError(error => {
  if (error.status === 401 || error.status === 403) {
    return authErrorHandler.handleAuthError(error);
  }
  if (networkErrorService.isNetworkError(error)) {
    return networkErrorService.retryWithBackoff(next(req));
  }
  return throwError(() => error);
})
```

---

# Próximo Día

**Día 7**: AuthService completo

---

*Slides - Día 6*
