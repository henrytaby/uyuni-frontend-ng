# Lab 02: Implementar LoadingService

## Objetivo

Crear un LoadingService con contador de peticiones, Signals reactivas, e integración con HTTP interceptor.

## Duración

**45 minutos**

## Prerrequisitos

- Lab 01 completado
- Conocimiento de Angular Signals
- Conocimiento de HTTP Interceptors

---

## Ejercicio 1: Crear LoadingService Básico

### Paso 1: Generar el servicio

```bash
ng g service core/services/loading
```

### Paso 2: Implementar con Signals

```typescript
// src/app/core/services/loading.service.ts
import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  // Contador interno de peticiones activas
  private count = signal(0);
  
  // Signal computada: true si hay peticiones activas
  isLoading = computed(() => this.count() > 0);
  
  // Exponer contador como readonly
  loadingCount = this.count.asReadonly();

  /**
   * Incrementa el contador de carga
   */
  show(): void {
    this.count.update(c => c + 1);
  }

  /**
   * Decrementa el contador de carga
   */
  hide(): void {
    this.count.update(c => Math.max(0, c - 1));
  }

  /**
   * Fuerza el contador a 0
   */
  forceHide(): void {
    this.count.set(0);
  }
}
```

---

## Ejercicio 2: Agregar Reset en Navegación

### Paso 1: Inyectar Router

```typescript
import { Injectable, signal, computed, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly router = inject(Router);
  
  // ... signals y métodos
  
  constructor() {
    this.setupNavigationListener();
  }
  
  private setupNavigationListener(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.forceHide();
    });
  }
}
```

---

## Ejercicio 3: Crear HTTP Interceptor

### Paso 1: Generar interceptor

```bash
ng g interceptor core/interceptors/loading --functional
```

### Paso 2: Implementar interceptor

```typescript
// src/app/core/interceptors/loading.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '@core/services/loading.service';
import { finalize } from 'rxjs/operators';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  
  // Mostrar loading al iniciar request
  loadingService.show();
  
  return next(req).pipe(
    // Ocultar loading al completar (éxito o error)
    finalize(() => loadingService.hide())
  );
};
```

### Paso 3: Registrar en app.config.ts

```typescript
// src/app/app.config.ts
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { loadingInterceptor } from '@core/interceptors/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([loadingInterceptor])
    ),
    // ... otros providers
  ]
};
```

---

## Ejercicio 4: Crear Componente de Loading

### Paso 1: Crear componente

```bash
ng g component shared/components/loading-overlay --standalone
```

### Paso 2: Implementar template

```typescript
// src/app/shared/components/loading-overlay/loading-overlay.component.ts
import { Component, inject } from '@angular/core';
import { LoadingService } from '@core/services/loading.service';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  imports: [ProgressSpinnerModule],
  template: `
    @if (loadingService.isLoading()) {
      <div class="loading-overlay">
        <p-progressSpinner 
          mode="indeterminate"
          strokeWidth="3"
          fill="transparent"
        />
      </div>
    }
  `,
  styles: [`
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
  `]
})
export class LoadingOverlayComponent {
  loadingService = inject(LoadingService);
}
```

---

## Ejercicio 5: Integrar en Layout

### Paso 1: Agregar a AppLayoutComponent

```typescript
// src/app/shared/layout/app-layout/app-layout.component.ts
import { Component } from '@angular/core';
import { LoadingOverlayComponent } from '@shared/components/loading-overlay/loading-overlay.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [LoadingOverlayComponent, RouterOutlet, AppHeaderComponent, AppSidebarComponent],
  template: `
    <app-header />
    <app-sidebar />
    
    <main class="main-content">
      <app-loading-overlay />
      <router-outlet />
    </main>
  `
})
export class AppLayoutComponent {}
```

---

## Ejercicio 6: Agregar Delay Inteligente

### Problema: Flashes de Loading

Para peticiones muy rápidas (< 200ms), el spinner aparece y desaparece inmediatamente, causando un "flash" visual.

### Solución: Delay mínimo

```typescript
// src/app/core/services/loading.service.ts
import { Injectable, signal, computed, inject, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private count = signal(0);
  private minDisplayTime = 300; // ms
  private loadingStartTime: number | null = null;
  
  isLoading = computed(() => this.count() > 0);
  loadingCount = this.count.asReadonly();

  show(): void {
    if (this.count() === 0) {
      // Primera petición: registrar tiempo de inicio
      this.loadingStartTime = Date.now();
    }
    this.count.update(c => c + 1);
  }

  hide(): void {
    this.count.update(c => {
      const newCount = Math.max(0, c - 1);
      
      if (newCount === 0 && this.loadingStartTime) {
        // Última petición: calcular tiempo transcurrido
        const elapsed = Date.now() - this.loadingStartTime;
        
        if (elapsed < this.minDisplayTime) {
          // Si fue muy rápido, esperar antes de ocultar
          setTimeout(() => {
            this.count.set(0);
          }, this.minDisplayTime - elapsed);
          return c; // Mantener count temporalmente
        }
        
        this.loadingStartTime = null;
      }
      
      return newCount;
    });
  }

  forceHide(): void {
    this.count.set(0);
    this.loadingStartTime = null;
  }
}
```

---

## Ejercicio 7: Tests Unitarios

### Crear archivo de test

```typescript
// src/app/core/services/loading.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('LoadingService', () => {
  let service: LoadingService;
  let routerMock: jest.Mocked<Router>;

  beforeEach(() => {
    routerMock = {
      events: of({} as any)
    } as any;

    TestBed.configureTestingModule({
      providers: [
        LoadingService,
        { provide: Router, useValue: routerMock }
      ]
    });

    service = TestBed.inject(LoadingService);
  });

  describe('initial state', () => {
    it('should have isLoading as false', () => {
      expect(service.isLoading()).toBe(false);
    });

    it('should have loadingCount as 0', () => {
      expect(service.loadingCount()).toBe(0);
    });
  });

  describe('show', () => {
    it('should increment count', () => {
      service.show();
      expect(service.loadingCount()).toBe(1);
    });

    it('should set isLoading to true', () => {
      service.show();
      expect(service.isLoading()).toBe(true);
    });

    it('should handle multiple calls', () => {
      service.show();
      service.show();
      service.show();
      expect(service.loadingCount()).toBe(3);
    });
  });

  describe('hide', () => {
    it('should decrement count', () => {
      service.show();
      service.hide();
      expect(service.loadingCount()).toBe(0);
    });

    it('should set isLoading to false when count reaches 0', () => {
      service.show();
      service.hide();
      expect(service.isLoading()).toBe(false);
    });

    it('should not go below 0', () => {
      service.hide();
      expect(service.loadingCount()).toBe(0);
    });

    it('should keep isLoading true with multiple requests', () => {
      service.show();
      service.show();
      service.hide();
      expect(service.isLoading()).toBe(true);
      service.hide();
      expect(service.isLoading()).toBe(false);
    });
  });

  describe('forceHide', () => {
    it('should reset count to 0', () => {
      service.show();
      service.show();
      service.show();
      
      service.forceHide();
      
      expect(service.loadingCount()).toBe(0);
      expect(service.isLoading()).toBe(false);
    });
  });

  describe('reactivity', () => {
    it('should update isLoading reactively', () => {
      const values: boolean[] = [];
      
      // Suscribirse a cambios
      effect(() => {
        values.push(service.isLoading());
      });

      service.show();
      service.show();
      service.hide();
      service.hide();

      expect(values).toContain(true);
      expect(values[values.length - 1]).toBe(false);
    });
  });
});
```

---

## Ejercicio 8: Test del Interceptor

```typescript
// src/app/core/interceptors/loading.interceptor.spec.ts
import { loadingInterceptor } from './loading.interceptor';
import { LoadingService } from '@core/services/loading.service';
import { TestBed } from '@angular/core/testing';
import { HttpHandlerFn, HttpRequest, HttpEvent } from '@angular/common/http';
import { of, throwError } from 'rxjs';

describe('loadingInterceptor', () => {
  let loadingServiceMock: jest.Mocked<LoadingService>;
  let mockHandler: jest.MockedFunction<HttpHandlerFn>;

  beforeEach(() => {
    loadingServiceMock = {
      show: jest.fn(),
      hide: jest.fn(),
      forceHide: jest.fn(),
      isLoading: jest.fn(),
      loadingCount: jest.fn()
    } as any;

    mockHandler = jest.fn();

    TestBed.configureTestingModule({
      providers: [
        { provide: LoadingService, useValue: loadingServiceMock }
      ]
    });
  });

  it('should call show on request start', () => {
    const req = new HttpRequest('GET', '/api/test');
    mockHandler.mockReturnValue(of({} as HttpEvent<unknown>));

    TestBed.runInInjectionContext(() => {
      loadingInterceptor(req, mockHandler);
    });

    expect(loadingServiceMock.show).toHaveBeenCalled();
  });

  it('should call hide on request success', (done) => {
    const req = new HttpRequest('GET', '/api/test');
    mockHandler.mockReturnValue(of({} as HttpEvent<unknown>));

    TestBed.runInInjectionContext(() => {
      loadingInterceptor(req, mockHandler).subscribe({
        complete: () => {
          expect(loadingServiceMock.hide).toHaveBeenCalled();
          done();
        }
      });
    });
  });

  it('should call hide on request error', (done) => {
    const req = new HttpRequest('GET', '/api/test');
    mockHandler.mockReturnValue(throwError(() => new Error('Network error')));

    TestBed.runInInjectionContext(() => {
      loadingInterceptor(req, mockHandler).subscribe({
        error: () => {
          expect(loadingServiceMock.hide).toHaveBeenCalled();
          done();
        }
      });
    });
  });
});
```

---

## Verificación

### Ejecutar tests

```bash
npm test -- --include="**/loading.service.spec.ts"
npm test -- --include="**/loading.interceptor.spec.ts"
```

### Verificar en la aplicación

1. Abrir DevTools → Network tab
2. Configurar "Slow 3G" throttling
3. Navegar por la aplicación
4. Verificar que el spinner aparece durante las peticiones

---

## Retos Adicionales

### 1. Loading por Feature

Crear loading states independientes por feature:

```typescript
// LoadingService extendido
private featureCounts = signal<Record<string, number>>({});

isLoadingFeature(feature: string): Signal<boolean> {
  return computed(() => (this.featureCounts()[feature] ?? 0) > 0);
}

showFeature(feature: string): void {
  this.featureCounts.update(counts => ({
    ...counts,
    [feature]: (counts[feature] ?? 0) + 1
  }));
}
```

### 2. Progreso de Carga

Mostrar progreso para peticiones con known size:

```typescript
loadingProgress = signal(0);

setProgress(percent: number): void {
  this.loadingProgress.set(percent);
}
```

### 3. Mensaje de Loading

Mostrar mensaje contextual:

```typescript
loadingMessage = signal<string | null>(null);

showWithMessage(message: string): void {
  this.show();
  this.loadingMessage.set(message);
}

hideWithMessage(): void {
  this.hide();
  this.loadingMessage.set(null);
}
```

---

## Solución Completa

Ver archivos:
- `src/app/core/services/loading.service.ts`
- `src/app/core/interceptors/loading.interceptor.ts`
- `src/app/shared/components/loading-overlay/loading-overlay.component.ts`

---

*Lab 02 - LoadingService*
*Curso: Angular 21 Enterprise*
*Día: 4 de 18*
