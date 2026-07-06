# Lab 02: loadingInterceptor

## Objetivo
Implementar loadingInterceptor para mostrar spinner global durante peticiones HTTP.

## Ejercicios
1. Crear loadingInterceptor
2. Integrar con LoadingService
3. Usar operador finalize
4. Manejar errores correctamente

## Código Base

```typescript
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  // TODO: Implementar
  return next(req);
};
```

## Solución Paso a Paso

### Paso 1: Inyectar LoadingService

```typescript
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  return next(req);
};
```

### Paso 2: Mostrar Loading

```typescript
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  loadingService.show();

  return next(req);
};
```

### Paso 3: Ocultar Loading con finalize

```typescript
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  loadingService.show();

  return next(req).pipe(
    finalize(() => loadingService.hide())
  );
};
```

### Paso 4: Implementación Completa

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '@core/services/loading.service';

/**
 * Loading Interceptor
 * 
 * Shows a global loading spinner during HTTP requests.
 * Uses finalize() to ensure loading is hidden on both success and error.
 */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // Increment loading counter
  loadingService.show();

  return next(req).pipe(
    // Always hide loading, whether success or error
    finalize(() => loadingService.hide())
  );
};
```

## Uso en app.config.ts

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        loadingInterceptor,  // Primero
        authInterceptor      // Segundo
      ])
    )
  ]
};
```

## Uso en Componente

```typescript
// En app.component.html
@if (loadingService.isLoading()) {
  <div class="loading-overlay">
    <p-progressSpinner />
  </div>
}

// En app.component.ts
loadingService = inject(LoadingService);
```

## CSS para Overlay

```css
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
```

## Testing

```typescript
describe('loadingInterceptor', () => {
  it('should show and hide loading', (done) => {
    const loadingService = { show: jest.fn(), hide: jest.fn() };
    
    TestBed.runInInjectionContext(() => {
      const req = new HttpRequest('GET', '/api/test');
      const next = jest.fn().mockReturnValue(of({}));
      
      loadingInterceptor(req, next).subscribe({
        complete: () => {
          expect(loadingService.show).toHaveBeenCalled();
          expect(loadingService.hide).toHaveBeenCalled();
          done();
        }
      });
    });
  });
});
```

---

*Lab 02 - Día 8*
