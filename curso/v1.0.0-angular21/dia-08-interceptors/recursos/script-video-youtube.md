# Script Video YouTube - Día 8: Interceptors

## Título: "HTTP Interceptors en Angular 21: Token Injection y Error Handling"

---

## Estructura del Video

### INTRO (0:00 - 0:45)

**[Pantalla: Título animado con logo Angular]**

Hola desarrolladores, bienvenidos al Día 8 del curso completo de Angular 21. Hoy vamos a hablar de HTTP Interceptors, el middleware que conecta tu aplicación con el backend.

**[Pantalla: Diagrama de flujo HTTP]**

Si ayer construimos el corazón de la autenticación, hoy construimos las arterias. Cada petición HTTP pasa por aquí.

---

### HOOK (0:45 - 1:30)

**[Pantalla: Escenario de código repetido]**

Miren este código. Añadir el token manualmente a cada petición. Si tienes 50 endpoints, escribes esto 50 veces.

**[Mostrar código repetitivo]**

```typescript
// Servicio 1
this.http.get('/api/users', { headers: { Authorization: token } })

// Servicio 2
this.http.get('/api/products', { headers: { Authorization: token } })

// Servicio 3... 50 veces más
```

¿Y si el token expira? ¿Manejar el refresh en 50 lugares? No. Los interceptors resuelven esto.

---

### CONTEXTO (1:30 - 2:30)

**[Pantalla: Diagrama de interceptor]**

Un interceptor es como un guardia de seguridad. Todas las peticiones pasan por él. Puede verificar credenciales, registrar actividad, manejar problemas.

**[Mostrar flujo]**

```
App → Interceptor → Backend
       ↓
    (Añadir token)
       ↓
App ← Interceptor ← Backend
       ↓
    (Manejar errores)
```

En Angular 21, usamos functional interceptors. No más clases con interfaces. Solo funciones puras.

---

### ESTRUCTURA_BÁSICA (2:30 - 4:00)

**[Pantalla: VS Code con interceptor básico]**

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

**[Mostrar parámetros]**

- `req`: La petición HTTP original
- `next`: Función para pasar al siguiente paso

**[Mostrar registro]**

```typescript
// app.config.ts
provideHttpClient(
  withInterceptors([myInterceptor])
)
```

---

### INMUTABILIDAD (4:00 - 5:30)

**[Pantalla: Concepto de inmutabilidad]**

Lo más importante: HttpRequest es inmutable.

**[Mostrar código incorrecto]**

```typescript
// ❌ NO FUNCIONA
req.headers.set('Authorization', token);
return next(req);
```

Esto no modifica el request. El set() retorna un nuevo objeto, pero no lo asignamos a nada.

**[Mostrar código correcto]**

```typescript
// ✅ CORRECTO
const authReq = req.clone({
  setHeaders: { Authorization: `Bearer ${token}` }
});
return next(authReq);
```

clone() crea una copia con las modificaciones.

---

### AUTH_INTERCEPTOR (5:30 - 8:00)

**[Pantalla: authInterceptor completo]**

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

**[Mostrar inyección]**

Usamos inject() para obtener AuthService. Esto solo funciona en contexto de inyección, que es exactamente donde estamos.

**[Mostrar X-Active-Role]**

```typescript
const activeRole = authService.activeRole();

if (activeRole) {
  headers['X-Active-Role'] = activeRole.slug;
}
```

El backend usa este header para filtrar datos.

---

### MANEJO_401 (8:00 - 11:00)

**[Pantalla: Manejo de errores]**

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

**[Mostrar verificación de endpoint]**

```typescript
function isAuthEndpoint(url: string): boolean {
  return url.includes('/auth/refresh') || url.includes('/auth/login');
}
```

Esto evita loops infinitos. Si el refresh falla con 401, no intentamos refrescar de nuevo.

**[Mostrar handle401Error]**

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
    switchMap(token => next(request.clone({...}))),
    catchError(err => {
      authService.logout();
      return throwError(() => err);
    })
  );
}
```

---

### REQUEST_QUEUING (11:00 - 12:30)

**[Pantalla: Diagrama de cola]**

```
Request A → 401 → Iniciar refresh
Request B → 401 → Esperar en cola
Request C → 401 → Esperar en cola
         ↓
New Token → Retry A, B, C
```

**[Mostrar código]**

```typescript
if (tokenRefreshService.isRefreshing()) {
  return tokenRefreshService.waitForToken().pipe(
    switchMap(token => next(request.clone({...})))
  );
}
```

Una sola llamada de refresh, múltiples peticiones esperando.

---

### LOADING_INTERCEPTOR (12:30 - 14:00)

**[Pantalla: loadingInterceptor]**

```typescript
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  loadingService.show();

  return next(req).pipe(
    finalize(() => loadingService.hide())
  );
};
```

**[Mostrar finalize]**

finalize() siempre se ejecuta. Éxito o error, el spinner se oculta.

**[Mostrar orden]**

```typescript
withInterceptors([
  loadingInterceptor,  // Primero
  authInterceptor      // Segundo
])
```

El orden importa. loading primero, auth segundo.

---

### ERROR_COMÚN (14:00 - 15:30)

**[Pantalla: Código incorrecto vs correcto]**

**[Mostrar error 1]**

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

**[Mostrar error 2]**

```typescript
// ❌ MAL - Loop infinito
if (error.status === 401) {
  return authService.refreshToken();
}

// ✅ BIEN - Verificar endpoint
if (error.status === 401 && !isAuthEndpoint(req.url)) {
  return handle401Error(...);
}
```

---

### MINI_RETO (15:30 - 16:30)

**[Pantalla: Desafío]**

Implementa un interceptor de logging:

- Registrar URL de cada petición
- Medir tiempo de respuesta
- Loggear status code

**[Mostrar solución]**

```typescript
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const start = Date.now();

  return next(req).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          const duration = Date.now() - start;
          console.log(`${req.url} - ${event.status} - ${duration}ms`);
        }
      }
    })
  );
};
```

---

### CIERRE (16:30 - 17:30)

**[Pantalla: Resumen]**

Hoy aprendimos:

1. Interceptors como middleware HTTP
2. Functional interceptors en Angular 21
3. Inyección automática de tokens
4. Manejo de errores 401
5. Request queuing

**[Pantalla: Preview del próximo día]**

Mañana: Guards. Protección de rutas, redirección, integración completa.

---

### OUTRO (17:30 - 18:00)

**[Pantalla: Call to action]**

Si este video te fue útil, dale like y suscríbete. El código está en el repositorio.

Nos vemos mañana en el Día 9. ¡Hasta entonces!

---

## Notas de Producción

### Visual
- Usar VS Code con tema oscuro
- Mostrar diagramas con animaciones
- B-roll de Network tab en DevTools
- Zoom en código importante

### Audio
- Voz clara y pausada
- Música de fondo suave en intro/outro
- Efectos de sonido para transiciones

### Duración
- Total: ~18 minutos
- Ideal para YouTube (15-20 min)

---

*Script Video YouTube - Día 8*
