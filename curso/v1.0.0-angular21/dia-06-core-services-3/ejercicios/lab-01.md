# Lab 01: AuthErrorHandlerService

## Objetivo
Implementar AuthErrorHandlerService para manejar errores de autenticación.

## Ejercicios
1. Crear AuthErrorHandlerService
2. Manejar errores 401, 403
3. Mostrar mensajes apropiados
4. Integrar con interceptor

## Código

```typescript
@Injectable({ providedIn: 'root' })
export class AuthErrorHandlerService {
  handleAuthError(error: HttpErrorResponse): Observable<never> {
    switch (error.status) {
      case 401: return throwError(() => error);
      case 403: return this.handleForbidden(error);
      default: return this.handleGeneric(error);
    }
  }
}
```

---

*Lab 01 - Día 6*
