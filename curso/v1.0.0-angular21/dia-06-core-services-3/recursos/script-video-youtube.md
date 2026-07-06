# Script Video YouTube - Día 6: Manejo de Errores

## Título: "Manejo de Errores en Angular 21: AuthErrorHandler y NetworkError"

---

## Estructura del Video

### INTRO (0:00 - 0:45)

**[Pantalla: Título animado con logo Angular]**

Hola desarrolladores, bienvenidos al Día 6 del curso completo de Angular 21. Hoy vamos a hablar de algo que separa a las aplicaciones amateur de las profesionales: el manejo de errores.

**[Pantalla: Mostrar aplicación con error genérico vs error manejado]**

Miren esta diferencia. A la izquierda, una aplicación que muestra "Error" cuando algo falla. A la derecha, una aplicación que guía al usuario, explica qué pasó, y ofrece soluciones. ¿Cuál prefieren usar?

Hoy vamos a implementar la versión de la derecha usando AuthErrorHandlerService y NetworkErrorService.

---

### HOOK (0:45 - 1:30)

**[Pantalla: Escenario de producción]**

Imaginen este escenario: Su aplicación está en producción, 500 usuarios activos, y de repente el servidor de autenticación tiene un problema. ¿Qué pasa?

Sin manejo de errores: Los usuarios ven pantallas en blanco, se frustran, y reportan tickets de soporte.

Con manejo de errores: La aplicación detecta el problema, muestra un mensaje claro, intenta recuperar automáticamente, y si no puede, guía al usuario.

La diferencia es enorme. Y hoy vamos a implementarlo.

---

### CONTEXTO (1:30 - 2:30)

**[Pantalla: Diagrama de arquitectura de errores]**

En UyuniAdmin, tenemos dos tipos de errores críticos:

**[Mostrar diagrama]**

Primero, errores de autenticación. Códigos 401 y 403. Estos requieren acciones específicas como refresh del token o logout.

Segundo, errores de red. El servidor no responde, o el usuario perdió conexión. Estos requieren reintentos con exponential backoff.

Cada tipo tiene su servicio dedicado. Vamos a verlos.

---

### AUTH_ERROR_HANDLER_SERVICE (2:30 - 5:30)

**[Pantalla: VS Code con auth-error-handler.service.ts]**

Empecemos con AuthErrorHandlerService.

**[Mostrar código]**

```typescript
@Injectable({ providedIn: 'root' })
export class AuthErrorHandlerService {
  private readonly logger = inject(LoggerService);
```

Primero, el decorador @Injectable con providedIn: 'root'. Esto crea un singleton global.

Luego, inyectamos LoggerService con inject(). Esta es la forma moderna de Angular.

**[Mostrar método isAuthError]**

```typescript
isAuthError(error: unknown): boolean {
  return error instanceof HttpErrorResponse &&
         (error.status === 401 || error.status === 403);
}
```

Este método verifica si un error es de autenticación. Usamos instanceof para seguridad de tipos.

**[Mostrar método handleAuthError]**

```typescript
handleAuthError(error: HttpErrorResponse): Observable<never> {
  this.logger.error('Auth error:', error);
  
  switch (error.status) {
    case 401:
      // Token expirado o credenciales inválidas
      return this.handleUnauthorized(error);
    case 403:
      // Cuenta bloqueada
      return this.handleForbidden(error);
    default:
      return throwError(() => error);
  }
}
```

Noten el tipo de retorno: Observable<never>. Esto significa que el observable nunca emite un valor exitoso, solo errores.

---

### NETWORK_ERROR_SERVICE (5:30 - 9:00)

**[Pantalla: VS Code con network-error.service.ts]**

Ahora veamos NetworkErrorService. Este es más interesante porque incluye reintentos automáticos.

**[Mostrar signal isOnline]**

```typescript
isOnline = signal(navigator.onLine);

constructor() {
  window.addEventListener('online', () => this.isOnline.set(true));
  window.addEventListener('offline', () => this.isOnline.set(false));
}
```

Usamos una signal para rastrear el estado de conexión. Los event listeners actualizan la signal automáticamente.

**[Mostrar retryWithBackoff]**

```typescript
retryWithBackoff<T>(request: Observable<T>, maxRetries = 3): Observable<T> {
  return request.pipe(
    retryWhen(errors => errors.pipe(
      scan((acc, error) => ({ count: acc.count + 1, error }), 
           { count: 0, error: null }),
      takeWhile(acc => acc.count < maxRetries),
      delayWhen(acc => timer(1000 * Math.pow(2, acc.count)))
    ))
  );
}
```

Este método implementa exponential backoff. Veamos cómo funciona:

**[Mostrar animación de reintentos]**

- Reintento 1: espera 2 segundos (1000 * 2^1)
- Reintento 2: espera 4 segundos (1000 * 2^2)
- Reintento 3: espera 8 segundos (1000 * 2^3)

Esto evita sobrecargar un servidor que ya está teniendo problemas.

---

### ERROR_COMÚN (9:00 - 10:30)

**[Pantalla: Código incorrecto vs correcto]**

Un error muy común es intentar manejar todos los errores en un solo servicio genérico.

**[Mostrar código incorrecto]**

```typescript
// ❌ MAL: Un servicio para todo
class ErrorHandlerService {
  handle(error: any) {
    // Intenta manejar auth, network, validation...
  }
}
```

El problema es que cada tipo de error requiere un manejo diferente.

**[Mostrar código correcto]**

```typescript
// ✅ BIEN: Servicios especializados
class AuthErrorHandlerService { }
class NetworkErrorService { }
```

Separar responsabilidades hace el código más mantenible y testeable.

---

### MINI_RETO (10:30 - 11:30)

**[Pantalla: Desafío]**

Tu reto del día: Implementa un componente que muestre un banner cuando el usuario está offline.

Requisitos:
1. Usar NetworkErrorService.isOnline signal
2. Banner rojo con mensaje "Sin conexión"
3. Banner verde con mensaje "Conexión recuperada" por 3 segundos
4. Animación suave de entrada y salida

Pista: Usa @if y el signal directamente en el template.

---

### CIERRE (11:30 - 12:30)

**[Pantalla: Resumen]**

Hoy aprendimos:

1. AuthErrorHandlerService para errores 401 y 403
2. NetworkErrorService para errores de conectividad
3. Exponential backoff para reintentos inteligentes
4. Separación de responsabilidades

Estos servicios son el escudo de tu aplicación. Sin ellos, tu app es frágil. Con ellos, es resiliente.

**[Pantalla: Preview del próximo día]**

Mañana vamos a ver AuthService, el corazón del sistema de autenticación. Es uno de los días más importantes del curso. No te lo pierdas.

---

### OUTRO (12:30 - 13:00)

**[Pantalla: Call to action]**

Si este video te fue útil, dale like y suscríbete. El código está en el repositorio del curso, link en la descripción.

Recuerda practicar con los labs. La práctica hace al maestro.

Nos vemos mañana en el Día 7. ¡Hasta entonces!

---

## Notas de Producción

### Visual
- Usar VS Code con tema oscuro
- Mostrar diagramas con animaciones
- B-roll de aplicación en funcionamiento
- Zoom en código importante

### Audio
- Voz clara y pausada
- Música de fondo suave en intro/outro
- Efectos de sonido para transiciones

### Duración
- Total: ~13 minutos
- Ideal para YouTube (10-15 min)

---

*Script Video YouTube - Día 6*
