# Cheatsheet - Día 6: Manejo de Errores

## AuthErrorHandlerService

### Creación
```typescript
@Injectable({ providedIn: 'root' })
export class AuthErrorHandlerService {
  private readonly logger = inject(LoggerService);
  
  handleAuthError(error: HttpErrorResponse): Observable<never> {
    // Manejar error
  }
  
  isAuthError(error: unknown): boolean {
    return error instanceof HttpErrorResponse &&
           (error.status === 401 || error.status === 403);
  }
}
```

### Códigos HTTP de Auth
| Código | Significado | Acción |
|--------|-------------|--------|
| 401 | No autorizado | Credenciales inválidas |
| 403 | Prohibido | Cuenta bloqueada |

### Uso en Interceptor
```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const errorHandler = inject(AuthErrorHandlerService);
  
  return next(req).pipe(
    catchError(error => {
      if (errorHandler.isAuthError(error)) {
        return errorHandler.handleAuthError(error);
      }
      return throwError(() => error);
    })
  );
};
```

---

## NetworkErrorService

### Creación
```typescript
@Injectable({ providedIn: 'root' })
export class NetworkErrorService {
  private readonly logger = inject(LoggerService);
  isOnline = signal(navigator.onLine);
  
  isNetworkError(error: unknown): boolean {
    return error instanceof HttpErrorResponse &&
           (error.status === 0 || error.status === 503);
  }
  
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
}
```

### Exponential Backoff
| Reintento | Delay | Cálculo |
|-----------|-------|---------|
| 1 | 2s | 1000 * 2¹ |
| 2 | 4s | 1000 * 2² |
| 3 | 8s | 1000 * 2³ |

### Eventos de Conexión
```typescript
window.addEventListener('online', () => this.isOnline.set(true));
window.addEventListener('offline', () => this.isOnline.set(false));
```

---

## Operadores RxJS

### catchError
```typescript
import { catchError } from 'rxjs/operators';

pipe(
  catchError(error => {
    console.error('Error:', error);
    return throwError(() => error);
  })
)
```

### retryWhen
```typescript
import { retryWhen } from 'rxjs/operators';

pipe(
  retryWhen(errors => errors.pipe(
    delay(1000),
    take(3)
  ))
)
```

### throwError
```typescript
import { throwError } from 'rxjs';

return throwError(() => new Error('Mensaje de error'));
```

### timer
```typescript
import { timer } from 'rxjs';

// Emitir después de 1 segundo
timer(1000).subscribe(() => console.log('Listo'));
```

---

## Patrones de Uso

### En Componente
```typescript
// Verificar conexión
if (!this.networkService.isOnline()) {
  this.showOfflineMessage();
  return;
}

// Con retry
this.networkService.retryWithBackoff(
  this.http.get('/api/data')
).subscribe(data => {
  // Manejar datos
});
```

### En Interceptor
```typescript
export const networkInterceptor: HttpInterceptorFn = (req, next) => {
  const networkService = inject(NetworkErrorService);
  
  return next(req).pipe(
    catchError(error => {
      if (networkService.isNetworkError(error)) {
        return networkService.retryWithBackoff(next(req));
      }
      return throwError(() => error);
    })
  );
};
```

---

## Buenas Prácticas

1. **Separar responsabilidades**: Auth vs Network
2. **Usar signals**: Para estado reactivo
3. **Loggear errores**: Con LoggerService
4. **Exponential backoff**: Para reintentos
5. **Observable<never>**: Para errores que no emiten

---

*Cheatsheet - Día 6*
