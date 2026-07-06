# Contenido Completo - Día 4: Core Services - LoggerService y LoadingService

## Tabla de Contenidos

1. [Introducción a Core Services](#1-introducción-a-core-services)
2. [Patrón Singleton en Angular](#2-patrón-singleton-en-angular)
3. [LoggerService](#3-loggerservice)
4. [LoadingService](#4-loadingservice)
5. [Testing de Servicios](#5-testing-de-servicios)
6. [Buenas Prácticas](#6-buenas-prácticas)
7. [Errores Comunes](#7-errores-comunes)

---

## 1. Introducción a Core Services

### 1.1 ¿Qué son los Core Services?

Los **Core Services** son servicios singleton que proporcionan funcionalidades transversales a toda la aplicación. Se encuentran en `src/app/core/services/` y tienen las siguientes características:

| Característica | Descripción |
|----------------|-------------|
| **Singleton** | Una sola instancia en toda la app |
| **Transversal** | Usados por múltiples features |
| **Sin estado de UI** | No dependen de componentes |
| **Proporcionados en root** | `providedIn: 'root'` |

### 1.2 Ubicación en la Arquitectura

```
src/app/
├── core/
│   ├── auth/           # Autenticación
│   ├── config/         # Configuración
│   ├── guards/         # Guards de ruta
│   ├── interceptors/   # HTTP interceptors
│   ├── handlers/       # Error handlers
│   ├── models/         # Modelos globales
│   └── services/       # ← CORE SERVICES
│       ├── logger.service.ts
│       ├── loading.service.ts
│       ├── config.service.ts
│       ├── token-refresh.service.ts
│       ├── auth-error-handler.service.ts
│       └── network-error.service.ts
├── shared/             # Componentes compartidos
└── features/           # Módulos de features
```

### 1.3 Principios de Core Services

```
┌─────────────────────────────────────────────────────────────┐
│                 PRINCIPIOS CORE SERVICES                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. SINGLE RESPONSIBILITY                                    │
│     Cada servicio tiene UNA responsabilidad clara            │
│     LoggerService → Logging                                  │
│     LoadingService → Estado de carga                         │
│                                                              │
│  2. MINIMAL DEPENDENCIES                                     │
│     Core services dependen de lo mínimo                      │
│     Evitar dependencias circulares                           │
│                                                              │
│  3. PROVIDEDIN: 'ROOT'                                       │
│     Una sola instancia para toda la app                      │
│     Tree-shakeable                                           │
│                                                              │
│  4. SIGNALS FOR STATE                                        │
│     Estado reactivo con Angular Signals                      │
│     Computed values para derivados                           │
│                                                              │
│  5. TESTABLE                                                 │
│     Fácil de testear unitariamente                           │
│     Sin dependencias de navegador                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Patrón Singleton en Angular

### 2.1 ¿Qué es un Singleton?

Un **Singleton** es un patrón de diseño que asegura que una clase tiene una sola instancia y proporciona un punto de acceso global a ella.

```
┌─────────────────────────────────────────────────────────────┐
│                    PATRÓN SINGLETON                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Sin Singleton:          Con Singleton:                      │
│                                                              │
│  Component A ──→ new Service()                              │
│  Component B ──→ new Service()   Component A ──┐            │
│  Component C ──→ new Service()   Component B ──┼─→ Service   │
│                                   Component C ──┘   (una     │
│  Resultado: 3 instancias                          instancia) │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Implementación en Angular

#### Forma Moderna (Recomendada)

```typescript
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  // Una sola instancia para toda la aplicación
}
```

#### Ventajas de `providedIn: 'root'`

| Ventaja | Descripción |
|---------|-------------|
| **Tree-shakeable** | Si no se usa, se elimina del bundle |
| **Una instancia** | Garantizado por Angular |
| **Sin módulo** | No necesita declararse en NgModule |
| **Lazy loading safe** | Funciona con lazy loading |

### 2.3 Inyección de Dependencias Moderna

#### Usando `inject()` (Recomendado)

```typescript
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MyService {
  // Inyección moderna con inject()
  private readonly logger = inject(LoggerService);
  private readonly http = inject(HttpClient);
  
  doSomething(): void {
    this.logger.info('Doing something');
  }
}
```

#### Usando Constructor (Legacy)

```typescript
@Injectable({ providedIn: 'root' })
export class MyService {
  // Inyección legacy con constructor
  constructor(
    private logger: LoggerService,
    private http: HttpClient
  ) {}
}
```

### 2.4 Comparación: inject() vs Constructor

| Aspecto | `inject()` | Constructor |
|---------|------------|-------------|
| **Sintaxis** | Más concisa | Más verbosa |
| **Contexto** | Funcional | Solo clases |
| **Type inference** | Automático | Requiere tipos |
| **Usable en** | Clases, funciones | Solo clases |
| **Angular 14+** | ✅ Recomendado | ⚠️ Legacy |

---

## 3. LoggerService

### 3.1 ¿Por qué necesitamos LoggerService?

#### Problema con console.log

```typescript
// ❌ Problema: console.log en producción
export class UserService {
  getUsers() {
    console.log('Fetching users...'); // Expuesto en producción
    return this.http.get('/api/users');
  }
}
```

**Problemas:**
- Información sensible expuesta en producción
- No hay niveles de severidad
- No hay contexto ni timestamp
- Difícil de deshabilitar

#### Solución: LoggerService

```typescript
// ✅ Solución: LoggerService
export class UserService {
  private readonly logger = inject(LoggerService);
  
  getUsers() {
    this.logger.debug('Fetching users...');
    return this.http.get('/api/users');
  }
}
```

### 3.2 Niveles de Log

```
┌─────────────────────────────────────────────────────────────┐
│                    NIVELES DE LOG                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  DEBUG    → Desarrollo, información detallada               │
│  INFO     → Información general, eventos importantes        │
│  WARN     → Advertencias, situaciones inesperadas           │
│  ERROR    → Errores, excepciones                            │
│                                                              │
│  Jerarquía: DEBUG < INFO < WARN < ERROR                     │
│                                                              │
│  Configuración por entorno:                                  │
│  - Desarrollo: DEBUG (muestra todo)                         │
│  - Producción: INFO (oculta debug)                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 Implementación de LoggerService

```typescript
// src/app/core/services/logger.service.ts
import { Injectable } from '@angular/core';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  private level: LogLevel = 'debug';
  private readonly levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  };

  /**
   * Establece el nivel mínimo de log
   */
  setLevel(level: LogLevel): void {
    this.level = level;
  }

  /**
   * Log de debug - solo desarrollo
   */
  debug(message: string, ...args: unknown[]): void {
    this.log('debug', message, args);
  }

  /**
   * Log de info - información general
   */
  info(message: string, ...args: unknown[]): void {
    this.log('info', message, args);
  }

  /**
   * Log de warn - advertencias
   */
  warn(message: string, ...args: unknown[]): void {
    this.log('warn', message, args);
  }

  /**
   * Log de error - errores
   */
  error(message: string, ...args: unknown[]): void {
    this.log('error', message, args);
  }

  private log(level: LogLevel, message: string, args: unknown[]): void {
    // Verificar si el nivel está habilitado
    if (!this.shouldLog(level)) {
      return;
    }

    // Formatear mensaje con timestamp
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    // Usar el método de console apropiado
    switch (level) {
      case 'debug':
        console.debug(formattedMessage, ...args);
        break;
      case 'info':
        console.info(formattedMessage, ...args);
        break;
      case 'warn':
        console.warn(formattedMessage, ...args);
        break;
      case 'error':
        console.error(formattedMessage, ...args);
        break;
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return this.levels[level] >= this.levels[this.level];
  }
}
```

### 3.4 Uso de LoggerService

```typescript
// En un componente
@Component({
  selector: 'app-user-list',
  standalone: true,
  template: `...`
})
export class UserListComponent implements OnInit {
  private readonly logger = inject(LoggerService);
  private readonly userService = inject(UserService);

  ngOnInit(): void {
    this.logger.debug('UserListComponent initialized');
    this.loadUsers();
  }

  private loadUsers(): void {
    this.logger.info('Loading users');
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.logger.debug('Users loaded', { count: users.length });
      },
      error: (error) => {
        this.logger.error('Failed to load users', error);
      }
    });
  }
}
```

### 3.5 Salida de LoggerService

```
[2026-03-17T10:30:45.123Z] [DEBUG] UserListComponent initialized
[2026-03-17T10:30:45.125Z] [INFO] Loading users
[2026-03-17T10:30:45.892Z] [DEBUG] Users loaded {count: 25}
```

### 3.6 Configuración por Entorno

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  logLevel: 'debug' as LogLevel
};

// src/environments/environment.prod.ts
export const environment = {
  production: true,
  logLevel: 'info' as LogLevel
};

// En app.config.ts
import { environment } from '@env/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: LoggerService,
      useFactory: () => {
        const logger = new LoggerService();
        logger.setLevel(environment.logLevel);
        return logger;
      }
    }
  ]
};
```

---

## 4. LoadingService

### 4.1 El Problema del Estado de Carga

#### Problema: Variables de Carga Dispersas

```typescript
// ❌ Problema: cada componente maneja su estado
export class UserListComponent {
  isLoadingUsers = false;
  
  loadUsers() {
    this.isLoadingUsers = true;
    this.userService.getUsers().subscribe({
      next: () => this.isLoadingUsers = false,
      error: () => this.isLoadingUsers = false
    });
  }
}

export class ProductListComponent {
  isLoadingProducts = false;
  
  loadProducts() {
    this.isLoadingProducts = true;
    // ...
  }
}
```

**Problemas:**
- Estado fragmentado
- Difícil coordinar múltiples peticiones
- No hay indicador global
- Código repetitivo

### 4.2 Solución: LoadingService Centralizado

```
┌─────────────────────────────────────────────────────────────┐
│                  LOADINGSERVICE FLOW                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  HTTP Request 1 ──┐                                         │
│  HTTP Request 2 ──┼──→ LoadingService ──→ UI Spinner        │
│  HTTP Request 3 ──┘        │                                │
│                            │                                │
│                    ┌───────┴───────┐                        │
│                    │               │                        │
│                 Counter        Signal                       │
│                    │               │                        │
│                    └───────┬───────┘                        │
│                            │                                │
│                    isLoading()                              │
│                    = true si count > 0                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 4.3 Implementación de LoadingService

```typescript
// src/app/core/services/loading.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { inject } from '@angular/core';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly router = inject(Router);
  
  // Contador de peticiones activas
  private count = signal(0);
  
  // Signal computada: loading si count > 0
  isLoading = computed(() => this.count() > 0);
  
  // Exponer el contador como readonly
  loadingCount = this.count.asReadonly();

  constructor() {
    // Resetear en cada navegación
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.forceHide();
    });
  }

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

### 4.4 Uso con HTTP Interceptor

```typescript
// src/app/core/interceptors/loading.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '@core/services/loading.service';
import { finalize } from 'rxjs/operators';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  
  // Mostrar loading
  loadingService.show();
  
  return next(req).pipe(
    // Ocultar loading al completar (éxito o error)
    finalize(() => loadingService.hide())
  );
};
```

### 4.5 Uso en Componentes

```typescript
// En el componente de layout
@Component({
  selector: 'app-layout',
  standalone: true,
  template: `
    <app-header />
    
    @if (loadingService.isLoading()) {
      <div class="loading-overlay">
        <p-progressSpinner />
      </div>
    }
    
    <router-outlet />
  `
})
export class LayoutComponent {
  loadingService = inject(LoadingService);
}
```

### 4.6 Contador de Peticiones

```
┌─────────────────────────────────────────────────────────────┐
│                CONTADOR DE PETICIONES                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Timeline:                                                   │
│                                                              │
│  t0: Request 1 inicia     → count = 1, isLoading = true     │
│  t1: Request 2 inicia     → count = 2, isLoading = true     │
│  t2: Request 1 completa   → count = 1, isLoading = true     │
│  t3: Request 3 inicia     → count = 2, isLoading = true     │
│  t4: Request 2 completa   → count = 1, isLoading = true     │
│  t5: Request 3 completa   → count = 0, isLoading = false    │
│                                                              │
│  Ventaja: El spinner permanece visible mientras              │
│  haya al menos una petición activa.                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 4.7 Signals en LoadingService

| Signal | Tipo | Descripción |
|--------|------|-------------|
| `count` | `WritableSignal<number>` | Contador interno |
| `isLoading` | `ComputedSignal<boolean>` | true si count > 0 |
| `loadingCount` | `Signal<number>` | Exposición readonly del count |

```typescript
// Signals utilizadas
private count = signal(0);                    // Writable
isLoading = computed(() => this.count() > 0); // Computed
loadingCount = this.count.asReadonly();       // Readonly
```

---

## 5. Testing de Servicios

### 5.1 Test de LoggerService

```typescript
// src/app/core/services/logger.service.spec.ts
import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    service = new LoggerService();
    // Espiar console methods
    consoleSpy = {
      debug: jest.spyOn(console, 'debug').mockImplementation(),
      info: jest.spyOn(console, 'info').mockImplementation(),
      warn: jest.spyOn(console, 'warn').mockImplementation(),
      error: jest.spyOn(console, 'error').mockImplementation()
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('debug', () => {
    it('should log debug message when level is debug', () => {
      service.setLevel('debug');
      service.debug('Test message');
      
      expect(consoleSpy.debug).toHaveBeenCalledWith(
        expect.stringContaining('[DEBUG]'),
        'Test message'
      );
    });

    it('should not log debug when level is info', () => {
      service.setLevel('info');
      service.debug('Test message');
      
      expect(consoleSpy.debug).not.toHaveBeenCalled();
    });
  });

  describe('error', () => {
    it('should always log error messages', () => {
      service.setLevel('debug');
      service.error('Error message');
      
      expect(consoleSpy.error).toHaveBeenCalled();
    });
  });

  describe('setLevel', () => {
    it('should filter messages below level', () => {
      service.setLevel('warn');
      
      service.debug('debug'); // Debe filtrarse
      service.info('info');   // Debe filtrarse
      service.warn('warn');   // Debe mostrarse
      service.error('error'); // Debe mostrarse
      
      expect(consoleSpy.debug).not.toHaveBeenCalled();
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.warn).toHaveBeenCalled();
      expect(consoleSpy.error).toHaveBeenCalled();
    });
  });
});
```

### 5.2 Test de LoadingService

```typescript
// src/app/core/services/loading.service.spec.ts
import { LoadingService } from './loading.service';
import { TestBed } from '@angular/core/testing';
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

  describe('show/hide', () => {
    it('should set isLoading to true when show is called', () => {
      expect(service.isLoading()).toBe(false);
      
      service.show();
      
      expect(service.isLoading()).toBe(true);
      expect(service.loadingCount()).toBe(1);
    });

    it('should set isLoading to false when count reaches 0', () => {
      service.show();
      service.show();
      expect(service.isLoading()).toBe(true);
      
      service.hide();
      expect(service.isLoading()).toBe(true);
      
      service.hide();
      expect(service.isLoading()).toBe(false);
    });

    it('should not go below 0', () => {
      service.hide();
      expect(service.loadingCount()).toBe(0);
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
});
```

---

## 6. Buenas Prácticas

### 6.1 Principios SOLID en Servicios

```
┌─────────────────────────────────────────────────────────────┐
│              SOLID EN CORE SERVICES                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  S - Single Responsibility                                   │
│      LoggerService → Solo logging                            │
│      LoadingService → Solo estado de carga                   │
│                                                              │
│  O - Open/Closed                                             │
│      LoggerService extensible sin modificación               │
│      Nuevos niveles sin cambiar código existente             │
│                                                              │
│  L - Liskov Substitution                                     │
│      Servicios pueden ser extendidos                         │
│                                                              │
│  I - Interface Segregation                                   │
│      Interfaces específicas por funcionalidad                │
│                                                              │
│  D - Dependency Inversion                                    │
│      Servicios dependen de abstracciones                     │
│      inject() para obtener dependencias                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Naming Conventions

| Tipo | Convención | Ejemplo |
|------|------------|---------|
| **Servicio** | PascalCase + Service | `LoggerService` |
| **Método** | camelCase | `show()`, `hide()` |
| **Signal** | camelCase | `isLoading` |
| **Signal readonly** | camelCase | `loadingCount` |
| **Private** | camelCase | `count`, `level` |

### 6.3 Estructura de Archivo

```typescript
// Estructura recomendada para un servicio
import { Injectable, signal, computed, inject } from '@angular/core';
// 1. Imports

type LogLevel = 'debug' | 'info' | 'warn' | 'error';
// 2. Tipos

@Injectable({ providedIn: 'root' })
// 3. Decorador
export class LoggerService {
// 4. Clase
  
  // 4.1 Signals/Estado
  private level = signal<LogLevel>('debug');
  
  // 4.2 Computed
  isDebugMode = computed(() => this.level() === 'debug');
  
  // 4.3 Inyecciones
  private readonly config = inject(ConfigService);
  
  // 4.4 Constructor (si es necesario)
  constructor() {
    this.initialize();
  }
  
  // 4.5 Métodos públicos
  debug(message: string, ...args: unknown[]): void {
    // ...
  }
  
  // 4.6 Métodos privados
  private initialize(): void {
    // ...
  }
}
```

---

## 7. Errores Comunes

### 7.1 Servicio sin providedIn

```typescript
// ❌ Error: Servicio sin providedIn
@Injectable()
export class MyService {
  // No se puede inyectar sin providedIn o declaración en módulo
}

// ✅ Correcto: Servicio con providedIn
@Injectable({ providedIn: 'root' })
export class MyService {
  // Disponible en toda la app
}
```

### 7.2 Dependencias Circulares

```typescript
// ❌ Error: Dependencia circular
@Injectable({ providedIn: 'root' })
export class ServiceA {
  constructor(private serviceB: ServiceB) {}
}

@Injectable({ providedIn: 'root' })
export class ServiceB {
  constructor(private serviceA: ServiceA) {}
}

// ✅ Solución: Refactorizar o usar Optional
@Injectable({ providedIn: 'root' })
export class ServiceB {
  constructor(@Optional() private serviceA: ServiceA) {}
}
```

### 7.3 Signals Mal Usadas

```typescript
// ❌ Error: Modificar signal directamente
isLoading = signal(false);
this.isLoading = true; // Error!

// ✅ Correcto: Usar set/update
isLoading = signal(false);
this.isLoading.set(true);
this.isLoading.update(v => !v);
```

### 7.4 No Desuscribir en Tests

```typescript
// ❌ Error: No limpiar mocks
it('should work', () => {
  const spy = jest.spyOn(console, 'log');
  // test...
  // No se limpia el spy
});

// ✅ Correcto: Limpiar en afterEach
afterEach(() => {
  jest.restoreAllMocks();
});
```

---

## Resumen del Día

| Concepto | Descripción |
|----------|-------------|
| **Core Services** | Servicios singleton transversales |
| **Singleton** | Una instancia con `providedIn: 'root'` |
| **inject()** | Inyección moderna de dependencias |
| **LoggerService** | Logging con niveles y filtrado |
| **LoadingService** | Estado de carga con contador y Signals |
| **Testing** | Tests unitarios con Jest |

---

*Curso: Angular 21 Enterprise*
*Día: 4 de 18*
