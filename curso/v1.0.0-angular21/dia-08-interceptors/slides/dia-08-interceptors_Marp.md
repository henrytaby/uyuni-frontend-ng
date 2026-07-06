# Presentación - Día 8: Interceptors

---

## Slide 1: Título

# HTTP Interceptors
## Middleware para Peticiones HTTP

**Día 8 - Angular 21 en Producción**

---

## Slide 2: Hook

# Escenario

Tu aplicación hace 50 peticiones HTTP. Cada una necesita el token de autenticación.

¿Escribir el código 50 veces? ¿O una solución automática?

**Interceptors son la respuesta.**

---

## Slide 3: Agenda

# Temario de Hoy

1. ¿Qué son los Interceptors?
2. HttpInterceptorFn
3. authInterceptor
4. Manejo de errores 401
5. loadingInterceptor

---

## Slide 4: ¿Qué es un Interceptor?

# Middleware HTTP

```typescript
Request → Interceptor → Backend
         ↓
    (Modificar request)
         ↓
Response ← Interceptor ← Backend
         ↓
    (Modificar response)
```

**Un guardia en la entrada de tu API.**

---

## Slide 5: Casos de Uso

# ¿Para qué sirven?

- ✅ Añadir tokens de autenticación
- ✅ Logging de peticiones
- ✅ Manejo global de errores
- ✅ Loading spinners
- ✅ Caching
- ✅ Transformación de datos

---

## Slide 6: Functional vs Class

# Dos Enfoques

```typescript
// ✅ Functional (Angular 14+)
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};

// ❌ Class-based (Legacy)
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req, next) { return next.handle(req); }
}
```

**Functional es el estándar moderno.**

---

## Slide 7: HttpInterceptorFn

# Tipo de Función

```typescript
type HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => Observable<HttpEvent<unknown>>;
```

- `req`: Request original
- `next`: Siguiente paso en la cadena
- Retorna: Observable del evento HTTP

---

## Slide 8: Estructura Básica

# Interceptor Mínimo

```typescript
export const myInterceptor: HttpInterceptorFn = (req, next) => {
  // Antes de enviar
  console.log('Request:', req.url);

  return next(req).pipe(
    // Después de recibir
    tap(response => console.log('Response:', response))
  );
};
```

---

## Slide 9: Registro

# app.config.ts

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        loadingInterceptor
      ])
    )
  ]
};
```

---

## Slide 10: authInterceptor

# Inyección de Token

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(authReq);
  }

  return next(req);
};
```

---

## Slide 11: Inmutabilidad

# ¿Por qué clone()?

```typescript
// ❌ MAL - No funciona
req.headers.set('Authorization', token);

// ✅ BIEN - Clonar
const authReq = req.clone({
  setHeaders: { Authorization: token }
});
```

**HttpRequest es inmutable.**

---

## Slide 12: X-Active-Role

# Header Personalizado

```typescript
const activeRole = authService.activeRole();

if (activeRole) {
  headers['X-Active-Role'] = activeRole.slug;
}
```

**Backend filtra datos según el rol activo.**

---

## Slide 13: Manejo de Errores

# catchError

```typescript
return next(authReq).pipe(
  catchError((error: unknown) => {
    if (error instanceof HttpErrorResponse && error.status === 401) {
      // Manejar 401
    }
    return throwError(() => error);
  })
);
```

---

## Slide 14: Evitar Loops

# isAuthEndpoint

```typescript
function isAuthEndpoint(url: string): boolean {
  return url.includes('/auth/refresh') || 
         url.includes('/auth/login');
}

if (isAuthEndpoint(req.url)) {
  return throwError(() => error); // No refresh
}
```

**Evita loops infinitos.**

---

## Slide 15: Request Queuing

# Múltiples Requests

```
Request A → 401 → Refresh
Request B → 401 → Wait for A
Request C → 401 → Wait for A
         ↓
New Token → Retry A, B, C
```

**Una sola llamada de refresh.**

---

## Slide 16: handle401Error

# Flujo Completo

```typescript
if (tokenRefreshService.isRefreshing()) {
  return tokenRefreshService.waitForToken().pipe(
    switchMap(token => next(request.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    })))
  );
}

return tokenRefreshService.refreshToken().pipe(
  switchMap(token => next(request.clone({...}))),
  catchError(err => {
    authService.logout();
    return throwError(() => err);
  })
);
```

---

## Slide 17: loadingInterceptor

# Spinner Global

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

## Slide 18: finalize

# Siempre se Ejecuta

```typescript
return next(req).pipe(
  finalize(() => {
    // Se ejecuta en éxito Y en error
    loadingService.hide();
  })
);
```

**Perfecto para limpieza.**

---

## Slide 19: Orden de Interceptors

# Importa el Orden

```typescript
withInterceptors([
  loadingInterceptor,  // 1. Primero (request)
  authInterceptor      // 2. Segundo (request)
])

// Request: loading → auth → backend
// Response: backend → auth → loading
```

---

## Slide 20: Error Común #1

# ❌ No Clonar

```typescript
// MAL
req.headers.set('Authorization', token);
return next(req);

// BIEN
const authReq = req.clone({
  setHeaders: { Authorization: token }
});
return next(authReq);
```

---

## Slide 21: Error Común #2

# ❌ Loop de Refresh

```typescript
// MAL - Sin verificar endpoint
if (error.status === 401) {
  return authService.refreshToken(); // Loop!
}

// BIEN - Verificar endpoint
if (error.status === 401 && !isAuthEndpoint(req.url)) {
  return handle401Error(...);
}
```

---

## Slide 22: Mini Reto

# Tu Turno

Implementa un interceptor de logging que registre:
- URL de cada request
- Tiempo de respuesta
- Status code

**Pista:** Usa `Date.now()` y `tap()`.

---

## Slide 23: Buenas Prácticas

# Resumen

1. ✅ Usar functional interceptors
2. ✅ Inyectar con inject()
3. ✅ Clonar requests
4. ✅ Evitar loops de refresh
5. ✅ Usar cola para requests
6. ✅ Manejar todos los errores

---

## Slide 24: Cierre

# Hoy Aprendimos

- Interceptors como middleware HTTP
- HttpInterceptorFn para Angular 21
- Inyección automática de tokens
- Manejo de errores 401
- Request queuing

**Mañana: Guards y protección de rutas.**

---

## Slide 25: Próximo Día

# Día 9: Guards

- authGuard
- CanActivateFn
- Protección de rutas
- Redirect a login

**¡No te lo pierdas!**

---

*Presentación - Día 8: Interceptors*
