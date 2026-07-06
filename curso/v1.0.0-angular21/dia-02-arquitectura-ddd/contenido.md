# Contenido Teórico - Día 2: Arquitectura DDD Lite

## Índice

1. [Introducción a DDD Lite](#1-introducción-a-ddd-lite)
2. [Smart Components vs Dumb Components](#2-smart-components-vs-dumb-components)
3. [ChangeDetectionStrategy.OnPush](#3-changedetectionstrategyonpush)
4. [Patrón inject()](#4-patrón-inject)
5. [Estructura de Features](#5-estructura-de-features)
6. [Ejemplos del Proyecto UyuniAdmin](#6-ejemplos-del-proyecto-uyuniadmin)
7. [Ejercicios Prácticos](#7-ejercicios-prácticos)
8. [Resumen y Puntos Clave](#8-resumen-y-puntos-clave)

---

## 1. Introducción a DDD Lite

### 1.1 ¿Qué es Domain-Driven Design?

**Domain-Driven Design (DDD)** es una metodología de desarrollo de software propuesta por Eric Evans en su libro del mismo nombre (2003). Se centra en:

1. **Dominio del problema**: Entender profundamente el negocio
2. **Lenguaje ubicuo**: Usar el mismo vocabulario que los expertos del dominio
3. **Contextos delimitados**: Separar diferentes áreas del negocio
4. **Modelos ricos**: Objetos con comportamiento, no solo datos

### 1.2 DDD Completo vs DDD Lite

| Aspecto | DDD Completo | DDD Lite |
|---------|--------------|----------|
| **Complejidad** | Alta | Moderada |
| **Entidades** | Con comportamiento | Principalmente datos |
| **Value Objects** | Inmutables con lógica | Interfaces TypeScript |
| **Agregados** | Límites estrictos | Módulos/Features |
| **Repositorios** | Interfaces + Implementación | Services |
| **Eventos de dominio** | Sí | No (generalmente) |
| **Aplicación** | Sistemas complejos | Aplicaciones CRUD/Enterprise |

### 1.3 ¿Por qué DDD Lite para Angular?

DDD Lite es ideal para aplicaciones Angular porque:

1. **Simplicidad**: No requiere infraestructura compleja
2. **Mantenibilidad**: Estructura clara y predecible
3. **Escalabilidad**: Fácil agregar nuevas features
4. **Colaboración**: Equipo entiende la arquitectura rápidamente
5. **Testing**: Componentes aislados son fáciles de probar

### 1.4 Mapeo DDD → Angular

| Concepto DDD | Implementación Angular |
|--------------|------------------------|
| Bounded Context | Feature Module |
| Aggregate | Feature con sus componentes |
| Entity | Interface/Type en models |
| Value Object | Interface inmutable |
| Repository | Service con métodos HTTP |
| Application Service | Smart Component (Page) |
| Domain Service | Service con lógica de negocio |

### 1.5 Estructura de Carpetas DDD Lite

```
src/app/
├── core/                    # Infraestructura
│   ├── auth/               # Autenticación
│   ├── config/             # Configuración
│   ├── guards/             # Protección de rutas
│   ├── interceptors/       # HTTP middleware
│   ├── handlers/           # Error handlers
│   ├── models/             # Modelos globales
│   └── services/           # Servicios globales
│
├── shared/                  # Componentes compartidos
│   ├── components/         # UI Components
│   ├── layout/             # Layouts
│   ├── pipes/              # Pipes personalizados
│   └── directives/         # Directivas personalizadas
│
└── features/                # Bounded Contexts
    ├── auth/               # Contexto: Autenticación
    │   ├── pages/          # Smart Components
    │   ├── components/     # Dumb Components
    │   ├── services/       # Feature Services
    │   ├── models/         # Domain Models
    │   └── auth.routes.ts  # Rutas del contexto
    │
    ├── dashboard/          # Contexto: Dashboard
    ├── profile/            # Contexto: Perfil
    └── ...                 # Otros contextos
```

---

## 2. Smart Components vs Dumb Components

### 2.1 Definiciones

#### Smart Components (Componentes Inteligentes)

También conocidos como:
- Container Components
- Page Components
- Controller Components

**Características**:
- Contienen lógica de negocio
- Se comunican con servicios
- Manejan estado de la aplicación
- Coordinan Dumb Components
- Ubicados en `/pages/`

#### Dumb Components (Componentes Tontos)

También conocidos como:
- Presentational Components
- UI Components
- Pure Components

**Características**:
- Solo presentan información
- Reciben datos via `@Input`
- Emiten eventos via `@Output`
- Sin dependencias de servicios
- Ubicados en `/components/`

### 2.2 Analogía: Gerente vs Trabajador

```
┌─────────────────────────────────────────────────────────────┐
│                    SMART COMPONENT                          │
│                      (Gerente)                              │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ AuthService │  │ Router      │  │ ConfigService│       │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│         │               │                │                 │
│         └───────────────┼────────────────┘                 │
│                         ▼                                  │
│              ┌─────────────────────┐                       │
│              │ Estado y Coordinación│                      │
│              └─────────────────────┘                       │
│                         │                                  │
│         ┌───────────────┼───────────────┐                 │
│         ▼               ▼               ▼                 │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐            │
│  │ DUMB COMP  │ │ DUMB COMP  │ │ DUMB COMP  │            │
│  │ (Trabajador)│ │ (Trabajador)│ │ (Trabajador)│           │
│  └────────────┘ └────────────┘ └────────────┘            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 Comparación Detallada

| Aspecto | Smart Component | Dumb Component |
|---------|-----------------|----------------|
| **Lógica** | Negocio y coordinación | Solo presentación |
| **Servicios** | Inyecta servicios | Sin servicios |
| **Estado** | Maneja estado propio | Solo recibe props |
| **Inputs** | Pocos o ninguno | Muchos |
| **Outputs** | Pocos o ninguno | Muchos eventos |
| **Change Detection** | OnPush recomendado | OnPush obligatorio |
| **Testing** | Tests de integración | Tests unitarios simples |
| **Reutilización** | Específico de feature | Altamente reutilizable |
| **Ubicación** | `/pages/` | `/components/` |

### 2.4 Ejemplo: SignIn Feature

#### Smart Component: SignInComponent

```typescript
// src/app/features/auth/pages/sign-in/sign-in.component.ts
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { SignInFormComponent } from '@features/auth/components/signin-form/signin-form.component';
import { AuthPageLayoutComponent } from '@features/auth/components/layout/auth-page-layout/auth-page-layout.component';
import type { LoginCredentials } from '@features/auth/models/auth.models';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [SignInFormComponent, AuthPageLayoutComponent],
  templateUrl: './sign-in.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignInComponent {
  // Servicios inyectados
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  
  // Estado local
  isLoading = signal(false);
  error = signal<string | null>(null);
  
  // Manejador de evento del Dumb Component
  onLogin(credentials: LoginCredentials): void {
    this.isLoading.set(true);
    this.error.set(null);
    
    this.authService.login(credentials.username, credentials.password)
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.error.set(err.message);
          this.isLoading.set(false);
        }
      });
  }
}
```

```html
<!-- sign-in.component.html -->
<app-auth-page-layout>
  <app-signin-form
    [isLoading]="isLoading()"
    [error]="error()"
    (submitForm)="onLogin($event)"
  />
</app-auth-page-layout>
```

#### Dumb Component: SignInFormComponent

```typescript
// src/app/features/auth/components/signin-form/signin-form.component.ts
import { Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import type { LoginCredentials } from '@features/auth/models/auth.models';

@Component({
  selector: 'app-signin-form',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule],
  templateUrl: './signin-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignInFormComponent {
  // Inputs: Datos del padre
  readonly isLoading = input<boolean>(false);
  readonly error = input<string | null>(null);
  
  // Output: Eventos hacia el padre
  readonly submitForm = output<LoginCredentials>();
  
  // Estado interno del formulario
  form = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });
  
  handleSubmit(): void {
    if (this.form.valid) {
      this.submitForm.emit(this.form.value as LoginCredentials);
    }
  }
}
```

```html
<!-- signin-form.component.html -->
<form [formGroup]="form" (ngSubmit)="handleSubmit()" class="space-y-4">
  <div class="flex flex-col gap-2">
    <label for="username" class="text-sm font-medium">Usuario</label>
    <input
      pInputText
      id="username"
      formControlName="username"
      class="w-full"
      [disabled]="isLoading()"
    />
    @if (form.get('username')?.invalid && form.get('username')?.touched) {
      <small class="text-red-500">El usuario es requerido</small>
    }
  </div>
  
  <div class="flex flex-col gap-2">
    <label for="password" class="text-sm font-medium">Contraseña</label>
    <input
      pInputText
      id="password"
      type="password"
      formControlName="password"
      class="w-full"
      [disabled]="isLoading()"
    />
    @if (form.get('password')?.invalid && form.get('password')?.touched) {
      <small class="text-red-500">Mínimo 6 caracteres</small>
    }
  </div>
  
  @if (error()) {
    <div class="p-3 bg-red-100 text-red-700 rounded">
      {{ error() }}
    </div>
  }
  
  <p-button
    type="submit"
    label="Iniciar Sesión"
    [loading]="isLoading()"
    class="w-full"
  />
</form>
```

### 2.5 Cuándo Usar Cada Tipo

#### Usar Smart Component cuando:
- Necesitas coordinar múltiples componentes
- Debes comunicarte con servicios/API
- Manejas estado de la aplicación
- Implementas lógica de navegación
- Es una página completa

#### Usar Dumb Component cuando:
- Solo muestras información
- El componente se reutiliza en múltiples lugares
- Quieres tests unitarios simples
- El componente es puramente visual
- Recibes todos los datos via props

---

## 3. ChangeDetectionStrategy.OnPush

### 3.1 ¿Qué es Change Detection?

Change Detection es el mecanismo de Angular para detectar cambios en los datos y actualizar la vista. Por defecto, Angular usa el strategy `Default`, que:

1. Recorre todo el árbol de componentes
2. Verifica cada expresión en templates
3. Actualiza el DOM si hay cambios
4. Se ejecuta en cada evento (click, timer, HTTP, etc.)

### 3.2 El Problema con Default

```
Evento (click en Componente A)
    │
    ▼
┌─────────────────────────────────────────┐
│     Change Detection Cycle              │
│                                         │
│  Componente A ──── Verificar ✓         │
│       │                                 │
│       ├── Componente B ─── Verificar ✓  │
│       │       │                         │
│       │       └── Componente C ─ Verificar ✓
│       │                                 │
│       └── Componente D ─── Verificar ✓  │
│               │                         │
│               └── Componente E ─ Verificar ✓
│                                         │
│  Total: 5 verificaciones por evento     │
└─────────────────────────────────────────┘
```

**Problema**: En aplicaciones grandes, esto es ineficiente.

### 3.3 OnPush al Rescate

Con `ChangeDetectionStrategy.OnPush`, Angular solo verifica el componente cuando:

1. **@Input cambia** (nueva referencia)
2. **Evento del DOM** originado en el componente
3. **Async pipe** recibe nuevo valor
4. **signal()** actualiza su valor
5. **ChangeDetectorRef.markForCheck()** se llama manualmente

```
Evento (click en Componente A)
    │
    ▼
┌─────────────────────────────────────────┐
│     Change Detection con OnPush         │
│                                         │
│  Componente A ──── Verificar ✓         │
│       │                                 │
│       ├── Componente B (OnPush)         │
│       │   └── @Input cambió? NO → Skip │
│       │                                 │
│       └── Componente D (OnPush)         │
│           └── @Input cambió? NO → Skip │
│                                         │
│  Total: 1 verificación por evento       │
└─────────────────────────────────────────┘
```

### 3.4 Implementación

```typescript
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-example',
  standalone: true,
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush  // ← Aquí
})
export class ExampleComponent {
  // ...
}
```

### 3.5 Patrones Inmutables para OnPush

OnPush requiere que los datos sean inmutables. Esto significa:

#### ❌ Mal: Mutar objetos

```typescript
// NO hacer esto con OnPush
updateUser(user: User): void {
  user.name = 'New Name';  // Mutación
  this.user = user;        // Misma referencia
}
```

#### ✅ Bien: Crear nueva referencia

```typescript
// Hacer esto con OnPush
updateUser(user: User): void {
  this.user = { ...user, name: 'New Name' };  // Nueva referencia
}
```

#### ❌ Mal: Mutar arrays

```typescript
// NO hacer esto con OnPush
addItem(item: Item): void {
  this.items.push(item);  // Mutación
}
```

#### ✅ Bien: Crear nuevo array

```typescript
// Hacer esto con OnPush
addItem(item: Item): void {
  this.items = [...this.items, item];  // Nuevo array
}
```

### 3.6 OnPush con Signals

Angular Signals funciona perfectamente con OnPush:

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CounterComponent {
  // Signals notifican cambios automáticamente
  count = signal(0);
  doubleCount = computed(() => this.count() * 2);
  
  increment(): void {
    this.count.update(c => c + 1);
  }
}
```

### 3.7 Medición de Rendimiento

Usa Angular DevTools para medir:

```bash
# Instalar Angular DevTools
# Chrome: https://chrome.google.com/webstore/detail/angular-devtools

# Pasos:
# 1. Abrir DevTools (F12)
# 2. Ir a pestaña "Angular"
# 3. Seleccionar "Profiler"
# 4. Grabar interacción
# 5. Analizar resultados
```

---

## 4. Patrón inject()

### 4.1 ¿Qué es inject()?

`inject()` es una función introducida en Angular 14 que permite inyectar dependencias fuera del constructor. Es la forma moderna de inyección de dependencias.

### 4.2 Sintaxis

```typescript
import { inject } from '@angular/core';

@Component({...})
export class MyComponent {
  // Forma moderna
  private readonly authService = inject(AuthService);
  private readonly http = inject(HttpClient);
  private readonly logger = inject(LoggerService);
}
```

### 4.3 Ventajas sobre Constructor

| Aspecto | Constructor | inject() |
|---------|-------------|----------|
| **Sintaxis** | Más verboso | Más conciso |
| **Readonly** | Manual | Automático |
| **Uso en funciones** | No posible | Posible |
| **Tree-shaking** | Menor | Mayor |
| **Type inference** | Manual | Automático |
| **Functional guards** | No funciona | Funciona |

### 4.4 Comparación de Código

#### ❌ Legacy: Constructor Injection

```typescript
@Component({...})
export class MyComponent {
  private authService: AuthService;
  private http: HttpClient;
  private logger: LoggerService;
  
  constructor(
    authService: AuthService,
    http: HttpClient,
    logger: LoggerService
  ) {
    this.authService = authService;
    this.http = http;
    this.logger = logger;
  }
}
```

#### ✅ Moderno: inject()

```typescript
@Component({...})
export class MyComponent {
  private readonly authService = inject(AuthService);
  private readonly http = inject(HttpClient);
  private readonly logger = inject(LoggerService);
}
```

### 4.5 Uso en Functional Guards

```typescript
// auth.guard.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  
  return router.parseUrl('/signin');
};
```

### 4.6 Uso en Functional Interceptors

```typescript
// auth.interceptor.ts
import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '@core/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.accessToken();
  
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next(req);
};
```

### 4.7 Uso en Services

```typescript
// user.service.ts
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly logger = inject(LoggerService);
  private readonly configService = inject(ConfigService);
  
  getUsers(): Observable<User[]> {
    const apiUrl = this.configService.getApiUrl();
    this.logger.debug('Fetching users');
    
    return this.http.get<User[]>(`${apiUrl}/users`);
  }
}
```

### 4.8 Reglas de Oro

1. **Siempre usar `readonly`**: Previene reasignación accidental
2. **Usar en componentes standalone**: Es el estándar moderno
3. **Usar en guards e interceptors**: Única forma en funcionales
4. **Evitar en constructores de clases no Angular**: Puede causar errores

---

## 5. Estructura de Features

### 5.1 Anatomía de una Feature

```
feature/
├── pages/                    # Smart Components (routables)
│   ├── overview/
│   │   ├── overview.component.ts
│   │   ├── overview.component.html
│   │   └── overview.component.css
│   └── detail/
│       ├── detail.component.ts
│       ├── detail.component.html
│       └── detail.component.css
│
├── components/               # Dumb Components (UI)
│   ├── item-card/
│   │   ├── item-card.component.ts
│   │   └── item-card.component.html
│   └── item-list/
│       ├── item-list.component.ts
│       └── item-list.component.html
│
├── services/                 # Feature Services
│   └── feature.service.ts
│
├── models/                   # Domain Models
│   └── feature.models.ts
│
└── feature.routes.ts         # Feature Routing
```

### 5.2 Feature Routes

```typescript
// dashboard.routes.ts
import { Routes } from '@angular/router';
import { OverviewComponent } from './pages/overview/overview.component';

export const routes: Routes = [
  {
    path: '',
    component: OverviewComponent
  },
  {
    path: 'detail/:id',
    loadComponent: () => import('./pages/detail/detail.component')
      .then(m => m.DetailComponent)
  }
];
```

### 5.3 Lazy Loading de Features

```typescript
// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('@features/dashboard/dashboard.routes')
      .then(m => m.routes)
  },
  {
    path: 'profile',
    loadChildren: () => import('@features/profile/profile.routes')
      .then(m => m.routes)
  }
];
```

### 5.4 Reglas de Dependencia

```
┌─────────────────────────────────────────────────────────────┐
│                      FEATURES                               │
│         (Dashboard, Profile, Auth, etc.)                    │
│                                                             │
│  Puede importar de:                                         │
│  ✓ @core/* (servicios globales)                            │
│  ✓ @shared/* (componentes UI)                              │
│  ✓ Sus propios archivos                                     │
│                                                             │
│  NO puede importar de:                                      │
│  ✗ Otras features                                           │
│  ✗ Archivos fuera de su feature                            │
└─────────────────────────────────────────────────────────────┘
              │
              │ importa
              ▼
┌─────────────────────────────────────────────────────────────┐
│                       CORE                                  │
│              (Singletons, Global Services)                  │
│                                                             │
│  NO puede importar de:                                      │
│  ✗ Features                                                 │
│  ✗ Shared                                                   │
│                                                             │
│  Puede importar de:                                         │
│  ✓ Otros archivos en Core                                   │
│  ✓ Librerías externas                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Ejemplos del Proyecto UyuniAdmin

### 6.1 Estructura Real del Proyecto

```
src/app/features/
├── auth/
│   ├── pages/
│   │   ├── sign-in/
│   │   │   ├── sign-in.component.ts      # Smart
│   │   │   └── sign-in.component.html
│   │   └── sign-up/
│   │       ├── sign-up.component.ts      # Smart
│   │       └── sign-up.component.html
│   ├── components/
│   │   ├── signin-form/
│   │   │   ├── signin-form.component.ts  # Dumb
│   │   │   └── signin-form.component.html
│   │   ├── signup-form/
│   │   │   ├── signup-form.component.ts  # Dumb
│   │   │   └── signup-form.component.html
│   │   ├── grid-shape/
│   │   ├── theme-toggle-two/
│   │   └── layout/
│   │       └── auth-page-layout/
│   ├── models/
│   │   └── auth.models.ts
│   └── auth.routes.ts
│
├── dashboard/
│   ├── pages/
│   │   └── overview/
│   │       └── overview.component.ts     # Smart
│   ├── components/
│   │   ├── ecommerce-metrics/
│   │   ├── monthly-sales-chart/
│   │   └── monthly-target/
│   └── dashboard.routes.ts
│
├── profile/
│   ├── pages/
│   │   └── overview/
│   ├── components/
│   └── profile.routes.ts
│
└── ... (otras features)
```

### 6.2 Análisis de Componentes

#### Smart Component: Dashboard Overview

```typescript
// src/app/features/dashboard/pages/overview/overview.component.ts
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    EcommerceMetricsComponent,
    MonthlySalesChartComponent,
    MonthlyTargetComponent
  ],
  templateUrl: './overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewComponent {
  // Inyección de servicios
  private readonly dashboardService = inject(DashboardService);
  private readonly logger = inject(LoggerService);
  
  // Estado con Signals
  metrics = signal<MetricData | null>(null);
  salesData = signal<SalesData[]>([]);
  isLoading = signal(true);
  
  // Computed values
  totalRevenue = computed(() => {
    const data = this.metrics();
    return data ? data.revenue : 0;
  });
  
  // Lifecycle
  ngOnInit(): void {
    this.loadDashboardData();
  }
  
  private loadDashboardData(): void {
    this.isLoading.set(true);
    
    forkJoin({
      metrics: this.dashboardService.getMetrics(),
      sales: this.dashboardService.getSalesData()
    }).subscribe({
      next: ({ metrics, sales }) => {
        this.metrics.set(metrics);
        this.salesData.set(sales);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.logger.error('Failed to load dashboard', err);
        this.isLoading.set(false);
      }
    });
  }
}
```

#### Dumb Component: EcommerceMetrics

```typescript
// src/app/features/dashboard/components/ecommerce-metrics/ecommerce-metrics.component.ts
@Component({
  selector: 'app-ecommerce-metrics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ecommerce-metrics.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EcommerceMetricsComponent {
  // Inputs
  readonly revenue = input.required<number>();
  readonly orders = input.required<number>();
  readonly customers = input.required<number>();
  readonly growth = input.required<number>();
  
  // Computed
  readonly growthPercentage = computed(() => {
    const g = this.growth();
    return g >= 0 ? `+${g.toFixed(1)}%` : `${g.toFixed(1)}%`;
  });
  
  readonly growthColor = computed(() => {
    return this.growth() >= 0 ? 'text-green-500' : 'text-red-500';
  });
}
```

---

## 7. Ejercicios Prácticos

### 7.1 Ejercicio 1: Identificar Smart vs Dumb

Dado el siguiente código, identificar si es Smart o Dumb:

```typescript
@Component({...})
export class UserListComponent {
  private userService = inject(UserService);
  users = signal<User[]>([]);
  
  ngOnInit() {
    this.userService.getUsers().subscribe(users => this.users.set(users));
  }
}
```

<details>
<summary>Respuesta</summary>

**Smart Component** porque:
- Inyecta un servicio (UserService)
- Realiza llamadas HTTP
- Maneja estado de la aplicación

</details>

### 7.2 Ejercicio 2: Convertir a OnPush

Convertir el siguiente componente a OnPush:

```typescript
@Component({
  selector: 'app-todo-list',
  template: `
    <ul>
      <li *ngFor="let todo of todos">{{ todo.title }}</li>
    </ul>
  `
})
export class TodoListComponent {
  todos: Todo[] = [];
  
  addTodo(title: string) {
    this.todos.push({ id: Date.now(), title });
  }
}
```

<details>
<summary>Solución</summary>

```typescript
@Component({
  selector: 'app-todo-list',
  template: `
    <ul>
      <li *ngFor="let todo of todos()">{{ todo.title }}</li>
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent {
  todos = signal<Todo[]>([]);
  
  addTodo(title: string) {
    // Crear nuevo array en lugar de mutar
    this.todos.update(current => [
      ...current,
      { id: Date.now(), title }
    ]);
  }
}
```

</details>

### 7.3 Ejercicio 3: Crear Dumb Component

Crear un Dumb Component para mostrar una tarjeta de usuario:

```typescript
// Requisitos:
// - Mostrar: nombre, email, avatar
// - Emitir evento cuando se hace click
// - Usar OnPush
// - Usar input() y output()
```

<details>
<summary>Solución</summary>

```typescript
import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-user-card',
  standalone: true,
  template: `
    <div 
      class="p-4 border rounded cursor-pointer hover:shadow-lg"
      (click)="onCardClick()"
    >
      <img 
        [src]="avatar()" 
        [alt]="name()"
        class="w-16 h-16 rounded-full mx-auto"
      />
      <h3 class="text-lg font-semibold text-center">{{ name() }}</h3>
      <p class="text-gray-500 text-center">{{ email() }}</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserCardComponent {
  readonly name = input.required<string>();
  readonly email = input.required<string>();
  readonly avatar = input.required<string>();
  
  readonly cardClick = output<number>();
  readonly userId = input.required<number>();
  
  onCardClick(): void {
    this.cardClick.emit(this.userId());
  }
}
```

</details>

---

## 8. Resumen y Puntos Clave

### 8.1 Conceptos Principales

| Concepto | Definición | Aplicación |
|----------|------------|------------|
| **DDD Lite** | DDD simplificado para apps CRUD | Estructura Core/Shared/Features |
| **Smart Component** | Contiene lógica de negocio | Páginas, coordinadores |
| **Dumb Component** | Solo presentación | UI, reutilizables |
| **OnPush** | Strategy de change detection | Optimización de rendimiento |
| **inject()** | Inyección moderna | Servicios, guards, interceptors |

### 8.2 Reglas de Oro

1. **Siempre usar OnPush** en todos los componentes
2. **Usar signals** para estado reactivo
3. **Separar Smart/Dumb** claramente
4. **Usar inject()** en lugar de constructor
5. **Mantener features aisladas**

### 8.3 Checklist de Implementación

- [ ] Componente tiene `changeDetection: ChangeDetectionStrategy.OnPush`
- [ ] Smart Components en `/pages/`
- [ ] Dumb Components en `/components/`
- [ ] Usar `inject()` para servicios
- [ ] Usar `input()` y `output()` signals
- [ ] Datos inmutables (crear nuevas referencias)
- [ ] Feature no importa de otras features

### 8.4 Próximos Pasos

En el **Día 3** aprenderemos:
- Lazy Loading detallado
- Rutas anidadas
- Route Guards
- Resolvers

---

## Referencias

- [Angular Change Detection](https://angular.io/guide/change-detection)
- [Angular Signals](https://angular.io/guide/signals)
- [Smart vs Dumb Components](https://blog.thoughtram.io/angular/2016/03/09/angular-2-components-and-their-types.html)
- [DDD Lite](https://martinfowler.com/bliki/BoundedContext.html)

---

*Curso: Angular 21 Enterprise*
*Día: 2 de 18*
*Próximo: Día 3 - Lazy Loading y Rutas*
