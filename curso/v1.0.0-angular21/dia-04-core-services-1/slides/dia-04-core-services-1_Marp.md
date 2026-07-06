marp: true
theme: default
paginate: true
backgroundColor: #fff
style: |
  section {
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
  }
  h1 {
    color: #38240c;
    font-size: 2em;
  }
  h2 {
    color: #38240c;
    font-size: 1.5em;
  }
  code {
    background: #f5f5f5;
    padding: 2px 6px;
    border-radius: 4px;
  }
  pre {
    background: #2d2d2d;
    color: #f8f8f2;
    padding: 16px;
    border-radius: 8px;
    font-size: 12px;
  }
  .highlight {
    color: #e96900;
  }
  .two-columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

---

# Día 4: Core Services
## LoggerService y LoadingService

**Curso: Angular 21 Enterprise**

---

# Agenda del Día

1. **Hook** - El problema del logging y loading
2. **Contexto** - Por qué necesitamos Core Services
3. **Conceptos** - Singleton, inject(), Signals
4. **LoggerService** - Implementación paso a paso
5. **LoadingService** - Contador de peticiones
6. **Testing** - Tests unitarios
7. **Errores comunes** - Qué evitar

---

# Hook: El Problema

## ¿Qué pasa cuando usamos console.log?

```typescript
// En desarrollo
console.log('User logged in:', user);
// ✅ Útil para debug

// En producción
console.log('API Key:', apiKey);
// ❌ Información sensible expuesta
```

### Problemas:
- 🔴 Información sensible en producción
- 🔴 No hay niveles de severidad
- 🔴 No hay contexto ni timestamp
- 🔴 Imposible de deshabilitar

---

# Hook: El Problema del Loading

## ¿Cómo manejamos el estado de carga?

```typescript
// Cada componente maneja su estado
export class UserListComponent {
  isLoading = false;
  
  loadUsers() {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: () => this.isLoading = false,
      error: () => this.isLoading = false
    });
  }
}
```

### Problemas:
- 🔴 Estado fragmentado
- 🔴 Difícil coordinar múltiples peticiones
- 🔴 Código repetitivo

---

# Contexto: Core Services

## ¿Qué son los Core Services?

```
src/app/core/services/
├── logger.service.ts      ← Logging
├── loading.service.ts     ← Estado de carga
├── config.service.ts      ← Configuración
├── token-refresh.service.ts
├── auth-error-handler.service.ts
└── network-error.service.ts
```

### Características:
- ✅ Singleton (una instancia)
- ✅ Transversales (usados en toda la app)
- ✅ Sin estado de UI
- ✅ `providedIn: 'root'`

---

# Patrón Singleton

## ¿Qué es un Singleton?

```
Sin Singleton:
Component A → new Service() → Instancia 1
Component B → new Service() → Instancia 2
Component C → new Service() → Instancia 3

Con Singleton:
Component A ─┐
Component B ─┼→ Service (una instancia)
Component C ─┘
```

---

# Singleton en Angular

## Implementación Moderna

```typescript
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  // Una sola instancia para toda la app
}
```

### Ventajas:
| Ventaja | Descripción |
|---------|-------------|
| Tree-shakeable | Se elimina si no se usa |
| Una instancia | Garantizado por Angular |
| Sin módulo | No necesita NgModule |
| Lazy loading safe | Funciona con lazy loading |

---

# Inyección Moderna: inject()

## Comparación

```typescript
// ❌ Legacy - Constructor
export class MyService {
  constructor(
    private logger: LoggerService,
    private http: HttpClient
  ) {}
}

// ✅ Moderno - inject()
export class MyService {
  private readonly logger = inject(LoggerService);
  private readonly http = inject(HttpClient);
}
```

---

# inject() vs Constructor

| Aspecto | inject() | Constructor |
|---------|----------|-------------|
| Sintaxis | Más concisa | Más verbosa |
| Contexto | Funcional | Solo clases |
| Type inference | Automático | Requiere tipos |
| Usable en | Clases, funciones | Solo clases |
| Angular 14+ | ✅ Recomendado | ⚠️ Legacy |

---

# LoggerService: Niveles de Log

```
┌─────────────────────────────────────────┐
│           NIVELES DE LOG                 │
├─────────────────────────────────────────┤
│  DEBUG → Desarrollo, info detallada     │
│  INFO  → Eventos importantes            │
│  WARN  → Advertencias                   │
│  ERROR → Errores, excepciones           │
├─────────────────────────────────────────┤
│  Jerarquía: DEBUG < INFO < WARN < ERROR │
│                                          │
│  Desarrollo: DEBUG (muestra todo)       │
│  Producción: INFO (oculta debug)        │
└─────────────────────────────────────────┘
```

---

# LoggerService: Implementación

```typescript
@Injectable({ providedIn: 'root' })
export class LoggerService {
  private level: LogLevel = 'debug';

  debug(message: string, ...args: unknown[]): void {
    this.log('debug', message, args);
  }

  info(message: string, ...args: unknown[]): void {
    this.log('info', message, args);
  }

  error(message: string, ...args: unknown[]): void {
    this.log('error', message, args);
  }
}
```

---

# LoggerService: Método Privado

```typescript
private log(level: LogLevel, message: string, args: unknown[]): void {
  if (!this.shouldLog(level)) return;

  const timestamp = new Date().toISOString();
  const formattedMessage = 
    `[${timestamp}] [${level.toUpperCase()}] ${message}`;

  console[level](formattedMessage, ...args);
}

private shouldLog(level: LogLevel): boolean {
  const levels = { debug: 0, info: 1, warn: 2, error: 3 };
  return levels[level] >= levels[this.level];
}
```

---

# LoggerService: Uso

```typescript
@Component({...})
export class UserListComponent implements OnInit {
  private readonly logger = inject(LoggerService);

  ngOnInit(): void {
    this.logger.debug('Component initialized');
  }

  loadUsers(): void {
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

---

# LoggerService: Salida

```
[2026-03-17T10:30:45.123Z] [DEBUG] Component initialized
[2026-03-17T10:30:45.125Z] [INFO] Loading users
[2026-03-17T10:30:45.892Z] [DEBUG] Users loaded {count: 25}
[2026-03-17T10:30:46.102Z] [ERROR] Failed to load users HttpError...
```

### Beneficios:
- ✅ Timestamp automático
- ✅ Nivel de severidad
- ✅ Filtrado por nivel
- ✅ Formato consistente

---

# LoadingService: El Problema

## Múltiples peticiones HTTP

```
Timeline:
t0: Request 1 inicia
t1: Request 2 inicia
t2: Request 1 completa
t3: Request 3 inicia
t4: Request 2 completa
t5: Request 3 completa

¿Cuándo mostrar/ocultar el spinner?
```

---

# LoadingService: Solución

## Contador de Peticiones

```
┌─────────────────────────────────────────┐
│        CONTADOR DE PETICIONES            │
├─────────────────────────────────────────┤
│ t0: Request 1 inicia → count = 1        │
│ t1: Request 2 inicia → count = 2        │
│ t2: Request 1 completa → count = 1      │
│ t3: Request 3 inicia → count = 2        │
│ t4: Request 2 completa → count = 1      │
│ t5: Request 3 completa → count = 0      │
├─────────────────────────────────────────┤
│ isLoading = true si count > 0           │
└─────────────────────────────────────────┘
```

---

# LoadingService: Implementación

```typescript
@Injectable({ providedIn: 'root' })
export class LoadingService {
  private count = signal(0);
  
  isLoading = computed(() => this.count() > 0);
  loadingCount = this.count.asReadonly();

  show(): void {
    this.count.update(c => c + 1);
  }

  hide(): void {
    this.count.update(c => Math.max(0, c - 1));
  }

  forceHide(): void {
    this.count.set(0);
  }
}
```

---

# LoadingService: Signals

```typescript
// Signal writable (interno)
private count = signal(0);

// Signal computed (derivado)
isLoading = computed(() => this.count() > 0);

// Signal readonly (expuesto)
loadingCount = this.count.asReadonly();
```

| Signal | Tipo | Uso |
|--------|------|-----|
| `count` | Writable | Interno |
| `isLoading` | Computed | UI binding |
| `loadingCount` | Readonly | Debug |

---

# LoadingService: Interceptor

```typescript
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  
  loadingService.show();
  
  return next(req).pipe(
    finalize(() => loadingService.hide())
  );
};
```

### Flujo:
1. Request inicia → `show()` → count++
2. Request completa → `hide()` → count--
3. count = 0 → `isLoading = false`

---

# LoadingService: Uso en Template

```typescript
@Component({
  template: `
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

---

# Testing: LoggerService

```typescript
describe('LoggerService', () => {
  let service: LoggerService;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    service = new LoggerService();
    consoleSpy = jest.spyOn(console, 'debug')
      .mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should log debug when level is debug', () => {
    service.setLevel('debug');
    service.debug('Test');
    expect(consoleSpy).toHaveBeenCalled();
  });
});
```

---

# Testing: LoadingService

```typescript
describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    service = new LoadingService();
  });

  it('should set isLoading to true when show is called', () => {
    expect(service.isLoading()).toBe(false);
    service.show();
    expect(service.isLoading()).toBe(true);
  });

  it('should handle multiple show/hide calls', () => {
    service.show();
    service.show();
    service.hide();
    expect(service.isLoading()).toBe(true);
    service.hide();
    expect(service.isLoading()).toBe(false);
  });
});
```

---

# Error Común 1: Sin providedIn

```typescript
// ❌ Error: Servicio sin providedIn
@Injectable()
export class MyService {
  // No se puede inyectar
}

// ✅ Correcto
@Injectable({ providedIn: 'root' })
export class MyService {
  // Disponible en toda la app
}
```

---

# Error Común 2: Dependencias Circulares

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
```

### Solución: Refactorizar o usar @Optional()

---

# Error Común 3: Signals Mal Usadas

```typescript
// ❌ Error: Asignación directa
isLoading = signal(false);
this.isLoading = true; // Error!

// ✅ Correcto: Usar set/update
isLoading = signal(false);
this.isLoading.set(true);
this.isLoading.update(v => !v);
```

---

# Buenas Prácticas

## Principios SOLID

| Principio | Aplicación |
|-----------|------------|
| **S**ingle Responsibility | Un servicio = una responsabilidad |
| **O**pen/Closed | Extensible sin modificar |
| **L**iskov | Servicios pueden extenderse |
| **I**nterface Segregation | Interfaces específicas |
| **D**ependency Inversion | Usar inject() |

---

# Resumen del Día

## Lo que aprendimos:

| Concepto | Descripción |
|----------|-------------|
| **Core Services** | Servicios singleton transversales |
| **Singleton** | `providedIn: 'root'` |
| **inject()** | Inyección moderna |
| **LoggerService** | Logging con niveles |
| **LoadingService** | Contador con Signals |
| **Testing** | Jest para servicios |

---

# Próximo Día

## Día 5: ConfigService y TokenRefreshService

- Carga de configuración desde JSON
- Manejo de tokens JWT
- Refresh token automático
- Integración con AuthService

---

# ¡Gracias!

## Ejercicios del Día

1. **Lab 01**: Implementar LoggerService con niveles
2. **Lab 02**: Implementar LoadingService con contador

### Recursos:
- `contenido.md` - Material completo
- `ejercicios/` - Labs prácticos
- `assessment/` - 50 preguntas

**¡Nos vemos en el Día 5!**
