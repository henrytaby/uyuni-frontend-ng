# Día 6: AuthErrorHandlerService y NetworkErrorService

## Información General

| Aspecto | Detalle |
|---------|---------|
| **Módulo** | 2 - Core Services |
| **Duración** | 3 horas |
| **Prerrequisitos** | Días 1-5 completados |
| **Archivos de referencia** | `src/app/core/services/auth-error-handler.service.ts`, `network-error.service.ts` |

## Objetivos de Aprendizaje

1. **Manejar errores de autenticación** de forma centralizada
2. **Detectar errores de red** y recuperar automáticamente
3. **Implementar retry** con exponential backoff
4. **Mostrar mensajes** apropiados al usuario
5. **Integrar** con interceptors y AuthService

## Estructura de Clase

### 1. Hook (15 min)
- Demo: Errores no manejados vs errores manejados
- Problema: Experiencia de usuario pobre en errores

### 2. Contexto (20 min)
- Tipos de errores HTTP
- Estrategias de recuperación
- UX en errores

### 3. Explicación (60 min)
- AuthErrorHandlerService: 401, 403, errores de auth
- NetworkErrorService: detección, retry, backoff
- Integración con interceptors

### 4. Demo/Código (45 min)
- Implementar AuthErrorHandlerService
- Implementar NetworkErrorService
- Tests unitarios

### 5. Error Común (15 min)
- No distinguir tipos de error
- Retry infinito
- Mensajes técnicos al usuario

### 6. Mini Reto (20 min)
- Agregar notificaciones de error
- Implementar offline mode

### 7. Cierre (10 min)
- Resumen y preview del Día 7

## Materiales

| Archivo | Descripción |
|---------|-------------|
| [`contenido.md`](./contenido.md) | Contenido teórico completo |
| [`slides/dia-06-core-services-3_Marp.md`](./slides/dia-06-core-services-3_Marp.md) | Presentación Marp |
| [`ejercicios/lab-01.md`](./ejercicios/lab-01.md) | Lab: AuthErrorHandlerService |
| [`ejercicios/lab-02.md`](./ejercicios/lab-02.md) | Lab: NetworkErrorService |
| [`assessment/preguntas.md`](./assessment/preguntas.md) | 50 preguntas |
| [`recursos/`](./recursos/) | Bibliografía, cheatsheet, scripts |

## Código de Referencia

### AuthErrorHandlerService

```typescript
@Injectable({ providedIn: 'root' })
export class AuthErrorHandlerService {
  handleAuthError(error: HttpErrorResponse): Observable<never> {
    switch (error.status) {
      case 401:
        // Token expired - handled by TokenRefreshService
        return throwError(() => error);
      case 403:
        // Account locked
        this.showAccountLockedMessage();
        this.authService.logout();
        break;
      default:
        this.showGenericAuthError();
    }
    return throwError(() => error);
  }
}
```

### NetworkErrorService

```typescript
@Injectable({ providedIn: 'root' })
export class NetworkErrorService {
  private online = signal(navigator.onLine);

  isNetworkError(error: unknown): boolean {
    return error instanceof HttpErrorResponse && 
           (error.status === 0 || error.status === 503);
  }

  retryWithBackoff<T>(request: Observable<T>, maxRetries = 3): Observable<T> {
    return request.pipe(
      retryWhen(errors => 
        errors.pipe(
          scan((acc, error) => ({ count: acc.count + 1, error }), { count: 0, error: null }),
          takeWhile(acc => acc.count < maxRetries && this.isNetworkError(acc.error)),
          delayWhen(acc => timer(1000 * Math.pow(2, acc.count)))
        )
      )
    );
  }
}
```

---

*Curso: Angular 21 Enterprise*
*Día: 6 de 18*
