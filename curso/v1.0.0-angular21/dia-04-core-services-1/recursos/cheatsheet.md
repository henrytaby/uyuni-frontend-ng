# Cheatsheet - Día 4: Core Services

## LoggerService

### Niveles de Log

```typescript
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Jerarquía: debug < info < warn < error
// debug: 0, info: 1, warn: 2, error: 3
```

### Uso Básico

```typescript
// Inyección
private readonly logger = inject(LoggerService);

// Métodos
logger.debug('Detailed info', { data });
logger.info('Important event');
logger.warn('Warning condition');
logger.error('Error occurred', error);

// Configuración
logger.setLevel('info');  // Oculta debug
logger.setContext('MyApp');
```

### Formato de Salida

```
[2026-03-17T10:30:45.123Z] [App] [INFO] Message
```

### Grupos

```typescript
logger.group('Operation Name');
logger.debug('Step 1');
logger.debug('Step 2');
logger.groupEnd();
```

---

## LoadingService

### Signals

```typescript
// Interno (writable)
private count = signal(0);

// Computado (derived)
isLoading = computed(() => this.count() > 0);

// Expuesto (readonly)
loadingCount = this.count.asReadonly();
```

### Métodos

```typescript
// Inyección
private readonly loadingService = inject(LoadingService);

// Uso
loadingService.show();      // count++
loadingService.hide();      // count--
loadingService.forceHide(); // count = 0

// Lectura
if (loadingService.isLoading()) {
  // Mostrar spinner
}
```

### Contador de Peticiones

```
show()  → count: 0 → 1, isLoading: false → true
show()  → count: 1 → 2, isLoading: true
hide()  → count: 2 → 1, isLoading: true
hide()  → count: 1 → 0, isLoading: true → false
```

---

## HTTP Interceptor

### Implementación

```typescript
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  
  loadingService.show();
  
  return next(req).pipe(
    finalize(() => loadingService.hide())
  );
};
```

### Registro

```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([loadingInterceptor])
    )
  ]
};
```

---

## Singleton Pattern

### Decorador

```typescript
@Injectable({ providedIn: 'root' })
export class MyService {
  // Una instancia para toda la app
}
```

### Ventajas

| Ventaja | Descripción |
|---------|-------------|
| Tree-shakeable | Se elimina si no se usa |
| Una instancia | Garantizado por Angular |
| Sin módulo | No necesita NgModule |
| Lazy loading safe | Funciona con lazy loading |

---

## Inyección de Dependencias

### inject() vs Constructor

```typescript
// ✅ Moderno (recomendado)
export class MyComponent {
  private readonly logger = inject(LoggerService);
  private readonly http = inject(HttpClient);
}

// ⚠️ Legacy
export class MyComponent {
  constructor(
    private logger: LoggerService,
    private http: HttpClient
  ) {}
}
```

### Contextos de Uso

```typescript
// En clases
export class MyService {
  private logger = inject(LoggerService);
}

// En funciones (interceptors, guards)
export const myGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.isLoggedIn();
};
```

---

## Signals

### Tipos

```typescript
// Writable
count = signal(0);
count.set(5);
count.update(c => c + 1);

// Computed
double = computed(() => this.count() * 2);

// Readonly
readonly = this.count.asReadonly();
```

### Uso en Template

```typescript
// Componente
isLoading = signal(false);

// Template
@if (isLoading()) {
  <spinner />
}
```

---

## Testing

### LoggerService

```typescript
describe('LoggerService', () => {
  let service: LoggerService;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    service = new LoggerService();
    consoleSpy = jest.spyOn(console, 'debug').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should log when level allows', () => {
    service.setLevel('debug');
    service.debug('Test');
    expect(consoleSpy).toHaveBeenCalled();
  });
});
```

### LoadingService

```typescript
describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    service = new LoadingService();
  });

  it('should track loading state', () => {
    expect(service.isLoading()).toBe(false);
    service.show();
    expect(service.isLoading()).toBe(true);
    service.hide();
    expect(service.isLoading()).toBe(false);
  });
});
```

### Interceptor

```typescript
it('should call show and hide', () => {
  const loadingService = mock(LoadingService);
  const handler = jest.fn().mockReturnValue(of({}));

  TestBed.runInInjectionContext(() => {
    loadingInterceptor(req, handler);
  });

  expect(loadingService.show).toHaveBeenCalled();
});
```

---

## Estructura de Archivo

```typescript
// Orden recomendado
import { Injectable, signal, computed, inject } from '@angular/core';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  // 1. Signals/Estado
  private level = signal<LogLevel>('debug');
  
  // 2. Computed
  isDebugMode = computed(() => this.level() === 'debug');
  
  // 3. Inyecciones
  private readonly config = inject(ConfigService);
  
  // 4. Constructor (si es necesario)
  constructor() {}
  
  // 5. Métodos públicos
  debug(message: string): void {}
  
  // 6. Métodos privados
  private log(): void {}
}
```

---

## Errores Comunes

### Servicio sin providedIn

```typescript
// ❌ Error
@Injectable()
export class MyService {}

// ✅ Correcto
@Injectable({ providedIn: 'root' })
export class MyService {}
```

### Dependencia Circular

```typescript
// ❌ Error
class A { constructor(b: B) {} }
class B { constructor(a: A) {} }

// ✅ Solución: Refactorizar o usar @Optional()
class B {
  constructor(@Optional() private a: A) {}
}
```

### Signal Mal Usada

```typescript
// ❌ Error
count = signal(0);
count = 5; // Asignación directa

// ✅ Correcto
count = signal(0);
count.set(5);
count.update(c => c + 1);
```

---

## Comandos CLI

```bash
# Generar servicio
ng g service core/services/logger

# Generar interceptor
ng g interceptor core/interceptors/loading --functional

# Ejecutar tests
npm test -- --include="**/logger.service.spec.ts"

# Ver coverage
npm test -- --coverage
```

---

## Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────────┐
│                    CORE SERVICES FLOW                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  HTTP Request                                                │
│       │                                                      │
│       ▼                                                      │
│  loadingInterceptor                                          │
│       │                                                      │
│       ├─→ LoadingService.show()                              │
│       │        │                                             │
│       │        └─→ count++                                   │
│       │             │                                        │
│       │             └─→ isLoading = true                     │
│       │                                                      │
│       ▼                                                      │
│  HTTP Handler                                                │
│       │                                                      │
│       ▼                                                      │
│  Response (success/error)                                    │
│       │                                                      │
│       ▼                                                      │
│  finalize(() => LoadingService.hide())                       │
│       │                                                      │
│       └─→ count--                                            │
│             │                                                │
│             └─→ isLoading = false (si count = 0)             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

*Cheatsheet - Día 4*
*Curso: Angular 21 Enterprise*
*Día: 4 de 18*
