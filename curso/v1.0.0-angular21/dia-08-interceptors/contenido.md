# Contenido - Día 8: Sistema de Autenticación - Interceptors

## 1. Introducción a Interceptors

### 1.1 ¿Qué son los Interceptors?

Los Interceptors son middleware para HTTP en Angular. Interceptan todas las peticiones y respuestas, permitiendo modificarlas antes de que lleguen al servidor o a la aplicación.

**Analogía:** Piensa en un interceptor como un guardia de seguridad en la entrada de un edificio. Cada persona (request) debe pasar por el guardia, quien puede:
- Verificar credenciales (añadir token)
- Registrar la entrada (logging)
- Manejar problemas (errores)

### 1.2 Casos de Uso Comunes

| Caso | Descripción |
|------|-------------|
| Autenticación | Añadir token Bearer a cada request |
| Logging | Registrar todas las peticiones |
| Error Handling | Manejar errores globalmente |
| Loading | Mostrar/ocultar spinner |
| Caching | Cachear respuestas |
| Transformación | Modificar datos |

### 1.3 Interceptors Funcionales vs Clase

**Angular 21 recomienda interceptors funcionales:**

```typescript
// ✅ Functional Interceptor (Angular 14+)
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};

// ❌ Class-based Interceptor (Legacy)
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req);
  }
}
```

**Ventajas de Functional Interceptors:**
- Sintaxis más concisa
- Funciona con `inject()`
- Tree-shakeable
- Más fácil de testear

---

## 2. HttpInterceptorFn

### 2.1 Tipo HttpInterceptorFn

```typescript
type HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => Observable<HttpEvent<unknown>>;
```

**Parámetros:**
- `req`: La petición HTTP original
- `next`: Función para pasar al siguiente interceptor

**Retorno:**
- `Observable<HttpEvent<unknown>>`: El flujo de la respuesta

### 2.2 Estructura Básica

```typescript
export const myInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Hacer algo antes de enviar
  console.log('Request:', req.url);

  // 2. Enviar request
  return next(req).pipe(
    // 3. Hacer algo con la respuesta
    tap(event => console.log('Response:', event))
  );
};
```

### 2.3 Registro en app.config.ts

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

## 3. authInterceptor

### 3.1 Estructura Completa

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const tokenRefreshService = inject(TokenRefreshService);
  const logger = inject(LoggerService);

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
      if (error instanceof HttpErrorResponse && error.status === 401) {
        // Handle 401
      }
      return throwError(() => error);
    })
  );
};
```

### 3.2 Inyección de Token

**¿Por qué clonar el request?**

Los objetos HttpRequest son inmutables. No puedes modificarlos directamente.

```typescript
// ❌ MAL - No funciona
req.headers.set('Authorization', `Bearer ${token}`);

// ✅ BIEN - Clonar con nuevos headers
const authReq = req.clone({
  setHeaders: {
    Authorization: `Bearer ${token}`
  }
});
```

### 3.3 Header X-Active-Role

El backend usa este header para filtrar datos según el rol activo:

```typescript
if (activeRole) {
  headers['X-Active-Role'] = activeRole.slug;
}
```

**Ejemplo:**
- Usuario con roles: Admin, Editor
- Rol activo: Editor
- Header: `X-Active-Role: editor`
- Backend retorna solo datos que Editor puede ver

---

## 4. Manejo de Errores 401

### 4.1 Detección de Errores

```typescript
catchError((error: unknown) => {
  if (error instanceof HttpErrorResponse && error.status === 401) {
    // Es un error 401
    return handle401Error(authReq, next, ...);
  }
  return throwError(() => error);
})
```

### 4.2 Evitar Loops de Refresh

**Problema:** Si el refresh token también está expirado, el intento de refresh retorna 401, lo que dispara otro refresh... loop infinito.

**Solución:** Detectar endpoints de autenticación:

```typescript
function isAuthEndpoint(url: string): boolean {
  return url.includes('/auth/refresh') || url.includes('/auth/login');
}

// En el interceptor
if (isAuthEndpoint(req.url)) {
  logger.debug('401 on auth endpoint, not refreshing');
  return throwError(() => error);
}
```

### 4.3 Request Queuing

**Problema:** Múltiples requests fallan con 401 al mismo tiempo. Si cada uno intenta refresh, hay race conditions.

**Solución:** Cola de requests:

```typescript
if (tokenRefreshService.isRefreshing()) {
  // Ya hay un refresh en progreso
  return tokenRefreshService.waitForToken().pipe(
    switchMap(token => {
      // Reintentar con el nuevo token
      return next(request.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      }));
    })
  );
}
```

---

## 5. Token Refresh Automático

### 5.1 Flujo Completo

```
Request → 401 → ¿Es auth endpoint? → Sí → Propagar error
                    ↓ No
              ¿Ya está refrescando? → Sí → Esperar en cola
                    ↓ No
              Iniciar refresh → Éxito → Reintentar request
                                   ↓ Error
                                 Logout
```

### 5.2 handle401Error

```typescript
function handle401Error(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  tokenRefreshService: TokenRefreshService,
  authService: AuthService,
  logger: LoggerService
): Observable<HttpEvent<unknown>> {
  // Si ya está refrescando, esperar
  if (tokenRefreshService.isRefreshing()) {
    return tokenRefreshService.waitForToken().pipe(
      switchMap(token => {
        return next(request.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        }));
      })
    );
  }

  // Iniciar refresh
  return tokenRefreshService.refreshToken().pipe(
    switchMap(token => {
      return next(request.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      }));
    }),
    catchError(err => {
      tokenRefreshService.reset();
      authService.logout();
      return throwError(() => err);
    })
  );
}
```

### 5.3 Integración con TokenRefreshService

TokenRefreshService maneja:
- Estado de refreshing (signal)
- Cola de requests pendientes
- Llamada al endpoint de refresh
- Almacenamiento del nuevo token

---

## 6. loadingInterceptor

### 6.1 Propósito

Mostrar un spinner global mientras hay peticiones en vuelo.

### 6.2 Implementación

```typescript
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  loadingService.show();

  return next(req).pipe(
    finalize(() => loadingService.hide())
  );
};
```

### 6.3 Operador finalize

`finalize()` se ejecuta siempre, tanto en éxito como en error:

```typescript
return next(req).pipe(
  finalize(() => {
    // Esto SIEMPRE se ejecuta
    loadingService.hide();
  })
);
```

---

## 7. Orden de Interceptors

### 7.1 Importancia del Orden

Los interceptors se ejecutan en orden de registro:

```typescript
withInterceptors([
  loadingInterceptor,  // 1. Primero
  authInterceptor      // 2. Segundo
])
```

**Flujo de request:**
```
Request → loadingInterceptor → authInterceptor → Backend
```

**Flujo de response:**
```
Backend → authInterceptor → loadingInterceptor → App
```

### 7.2 Orden Recomendado

```typescript
withInterceptors([
  loadingInterceptor,    // Mostrar spinner primero
  authInterceptor,       // Añadir token
  errorInterceptor,      // Manejar errores
  loggingInterceptor     // Loggear al final
])
```

---

## 8. Errores Comunes

### 8.1 No Clonar el Request

```typescript
// ❌ MAL
req.headers.set('Authorization', token);
return next(req);

// ✅ BIEN
const authReq = req.clone({
  setHeaders: { Authorization: token }
});
return next(authReq);
```

### 8.2 Loop Infinito de Refresh

```typescript
// ❌ MAL - Sin verificar endpoint
if (error.status === 401) {
  return authService.refreshToken(); // Loop si refresh falla
}

// ✅ BIEN - Verificar endpoint
if (error.status === 401 && !isAuthEndpoint(req.url)) {
  return handle401Error(...);
}
```

### 8.3 No Manejar Errores en finalize

```typescript
// ❌ MAL - finalize no recibe el error
finalize(() => {
  // No hay acceso al error aquí
})

// ✅ BIEN - Usar catchError para errores
catchError(error => {
  // Manejar error
  return throwError(() => error);
}),
finalize(() => {
  // Limpieza
})
```

---

## 9. Testing de Interceptors

### 9.1 Test Básico

```typescript
describe('authInterceptor', () => {
  it('should add Authorization header', () => {
    const authService = { getToken: () => 'test-token' };
    
    TestBed.runInInjectionContext(() => {
      const req = new HttpRequest('GET', '/api/test');
      const next = jest.fn().mockReturnValue(of({} as HttpEvent));
      
      authInterceptor(req, next);
      
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token'
          })
        })
      );
    });
  });
});
```

---

## 10. Buenas Prácticas

1. **Usar functional interceptors** - Sintaxis moderna
2. **Inyectar con inject()** - Funciona en contexto funcional
3. **Clonar requests** - Objetos inmutables
4. **Evitar loops** - Verificar endpoints de auth
5. **Usar cola para refresh** - Evitar race conditions
6. **Manejar todos los errores** - No dejar errores sin catch
7. **Loggear eventos importantes** - Debugging más fácil

---

## 11. Resumen

| Concepto | Descripción |
|----------|-------------|
| HttpInterceptorFn | Tipo para interceptors funcionales |
| req.clone() | Clonar request con modificaciones |
| catchError | Manejar errores en el flujo |
| finalize | Ejecutar código al final (éxito o error) |
| Request queuing | Evitar múltiples refresh simultáneos |

---

*Contenido - Día 8: Interceptors*
