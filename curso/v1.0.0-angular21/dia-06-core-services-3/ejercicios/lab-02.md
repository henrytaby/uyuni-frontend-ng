# Lab 02: NetworkErrorService

## Objetivo
Implementar NetworkErrorService con retry y exponential backoff.

## Ejercicios
1. Detectar errores de red
2. Implementar retry con backoff
3. Manejar estado online/offline
4. Integrar con interceptor

## Código

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
      retryWhen(errors => errors.pipe(
        scan((acc, error) => ({ count: acc.count + 1, error }), { count: 0, error: null }),
        takeWhile(acc => acc.count < maxRetries),
        delayWhen(acc => timer(1000 * Math.pow(2, acc.count)))
      ))
    );
  }
}
```

---

*Lab 02 - Día 6*
