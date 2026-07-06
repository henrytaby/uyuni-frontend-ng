# Presentación - Día 2: Arquitectura DDD Lite

---
<!-- _class: title -->
# Angular 21 Enterprise
## Día 2: Arquitectura DDD Lite

**Smart Components • Dumb Components • OnPush • inject()**

---

# Agenda del Día

1. **Introducción a DDD Lite** (45 min)
2. **Smart vs Dumb Components** (60 min)
3. **ChangeDetectionStrategy.OnPush** (60 min)
4. **Patrón inject()** (45 min)
5. **Estructura de Features** (60 min)

---

<!-- _class: section -->
# 1. Introducción a DDD Lite

---

# ¿Qué es DDD?

**Domain-Driven Design** (Eric Evans, 2003)

- Centrado en el **dominio del problema**
- **Lenguaje ubicuo** entre equipo y expertos
- **Contextos delimitados** para separar áreas
- **Modelos ricos** con comportamiento

---

# DDD Completo vs DDD Lite

| DDD Completo | DDD Lite |
|--------------|----------|
| Alta complejidad | Moderada |
| Entidades con comportamiento | Interfaces TypeScript |
| Value Objects inmutables | Types simples |
| Eventos de dominio | Sin eventos |
| Sistemas complejos | Apps CRUD/Enterprise |

---

# ¿Por qué DDD Lite para Angular?

✅ **Simplicidad** - No requiere infraestructura compleja
✅ **Mantenibilidad** - Estructura clara y predecible
✅ **Escalabilidad** - Fácil agregar nuevas features
✅ **Colaboración** - Equipo entiende rápidamente
✅ **Testing** - Componentes aislados son fáciles de probar

---

# Mapeo DDD → Angular

| Concepto DDD | Implementación Angular |
|--------------|------------------------|
| Bounded Context | Feature Module |
| Aggregate | Feature con componentes |
| Entity | Interface/Type |
| Repository | Service con HTTP |
| Application Service | Smart Component |

---

# Estructura de Carpetas

```
src/app/
├── core/        # Infraestructura global
├── shared/      # Componentes reutilizables
└── features/    # Bounded Contexts
    ├── auth/
    ├── dashboard/
    └── profile/
```

---

<!-- _class: section -->
# 2. Smart vs Dumb Components

---

# El Problema

```typescript
// ¿Qué está mal aquí?
@Component({...})
export class UserCardComponent {
  private userService = inject(UserService);
  
  deleteUser() {
    this.userService.delete(this.user.id);
  }
}
```

---

# Dos Tipos de Componentes

## 🧠 Smart Components
- Contienen lógica de negocio
- Se comunican con servicios
- Manejan estado
- Ubicados en `/pages/`

## 🎨 Dumb Components
- Solo presentan información
- Reciben `@Input`
- Emiten `@Output`
- Ubicados en `/components/`

---

# Analogía: Gerente vs Trabajador

```
┌─────────────────────────────────────┐
│      SMART COMPONENT (Gerente)      │
│                                     │
│  • Coordina trabajadores            │
│  • Toma decisiones                  │
│  • Se comunica con otros gerentes   │
│                                     │
│  ┌─────────┐ ┌─────────┐ ┌────────┐│
│  │ Dumb    │ │ Dumb    │ │ Dumb   ││
│  │(Trabaj.)│ │(Trabaj.)│ │(Trabaj)││
│  └─────────┘ └─────────┘ └────────┘│
└─────────────────────────────────────┘
```

---

# Comparación Detallada

| Aspecto | Smart | Dumb |
|---------|-------|------|
| Lógica | Negocio | Presentación |
| Servicios | Sí inyecta | No |
| Estado | Maneja | Solo recibe |
| Inputs | Pocos | Muchos |
| Outputs | Pocos | Muchos |
| Ubicación | `/pages/` | `/components/` |

---

# Ejemplo: SignIn Feature

```
auth/
├── pages/
│   └── sign-in/           ← Smart Component
│       └── sign-in.component.ts
│
└── components/
    └── signin-form/       ← Dumb Component
        └── signin-form.component.ts
```

---

# Smart Component: SignInComponent

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignInComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  isLoading = signal(false);
  error = signal<string | null>(null);
  
  onLogin(credentials: LoginCredentials) {
    this.isLoading.set(true);
    this.authService.login(credentials)
      .subscribe({ /* ... */ });
  }
}
```

---

# Dumb Component: SignInFormComponent

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignInFormComponent {
  readonly isLoading = input<boolean>(false);
  readonly error = input<string | null>(null);
  readonly submitForm = output<LoginCredentials>();
  
  form = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  });
}
```

---

# Cuándo Usar Cada Tipo

## Usar Smart cuando:
- Coordinas múltiples componentes
- Comunicas con servicios/API
- Manejas estado de aplicación
- Es una página completa

## Usar Dumb cuando:
- Solo muestras información
- El componente se reutiliza
- Quieres tests simples
- Es puramente visual

---

<!-- _class: section -->
# 3. ChangeDetectionStrategy.OnPush

---

# ¿Qué es Change Detection?

Mecanismo de Angular para:
1. Detectar cambios en datos
2. Actualizar la vista

**Por defecto**: Verifica TODO en cada evento

---

# El Problema con Default

```
Evento (click en Componente A)
    │
    ▼
┌─────────────────────────────────────┐
│  Componente A ─── Verificar ✓       │
│       │                             │
│       ├── Componente B ─ Verificar ✓│
│       │       │                     │
│       │       └── C ─── Verificar ✓ │
│       │                             │
│       └── Componente D ─ Verificar ✓│
│               │                     │
│               └── E ─── Verificar ✓ │
│                                     │
│  Total: 5 verificaciones            │
└─────────────────────────────────────┘
```

---

# OnPush al Rescate

Con `OnPush`, Angular solo verifica cuando:
1. **@Input cambia** (nueva referencia)
2. **Evento del DOM** en el componente
3. **Async pipe** recibe valor
4. **signal()** actualiza
5. **markForCheck()** manual

---

# OnPush en Acción

```
Evento (click en Componente A)
    │
    ▼
┌─────────────────────────────────────┐
│  Componente A ─── Verificar ✓       │
│       │                             │
│       ├── Componente B (OnPush)     │
│       │   └── @Input cambió? NO → ✗│
│       │                             │
│       └── Componente D (OnPush)     │
│           └── @Input cambió? NO → ✗│
│                                     │
│  Total: 1 verificación              │
└─────────────────────────────────────┘
```

---

# Implementación

```typescript
import { 
  Component, 
  ChangeDetectionStrategy 
} from '@angular/core';

@Component({
  selector: 'app-example',
  standalone: true,
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush  // ← Aquí
})
export class ExampleComponent { }
```

---

# Patrones Inmutables

## ❌ Mal: Mutar objetos
```typescript
updateUser(user: User) {
  user.name = 'New Name';  // Mutación
  this.user = user;        // Misma referencia
}
```

## ✅ Bien: Nueva referencia
```typescript
updateUser(user: User) {
  this.user = { ...user, name: 'New Name' };
}
```

---

# Patrones Inmutables (Arrays)

## ❌ Mal: Mutar arrays
```typescript
addItem(item: Item) {
  this.items.push(item);  // Mutación
}
```

## ✅ Bien: Nuevo array
```typescript
addItem(item: Item) {
  this.items = [...this.items, item];
}
```

---

# OnPush con Signals

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CounterComponent {
  count = signal(0);
  doubleCount = computed(() => this.count() * 2);
  
  increment() {
    this.count.update(c => c + 1);
  }
}
```

Signals notifican cambios automáticamente ✅

---

# Medición con DevTools

```bash
# Pasos:
# 1. Instalar Angular DevTools (Chrome)
# 2. Abrir DevTools (F12)
# 3. Ir a pestaña "Angular"
# 4. Seleccionar "Profiler"
# 5. Grabar interacción
# 6. Analizar resultados
```

---

<!-- _class: section -->
# 4. Patrón inject()

---

# ¿Qué es inject()?

Función introducida en Angular 14 para inyección de dependencias **fuera del constructor**.

```typescript
@Component({...})
export class MyComponent {
  private readonly authService = inject(AuthService);
  private readonly http = inject(HttpClient);
}
```

---

# Ventajas sobre Constructor

| Aspecto | Constructor | inject() |
|---------|-------------|----------|
| Sintaxis | Verboso | Conciso |
| Readonly | Manual | Automático |
| Funciones | No posible | Posible |
| Tree-shaking | Menor | Mayor |
| Type inference | Manual | Automático |

---

# Comparación de Código

## ❌ Legacy: Constructor
```typescript
export class MyComponent {
  private authService: AuthService;
  
  constructor(authService: AuthService) {
    this.authService = authService;
  }
}
```

## ✅ Moderno: inject()
```typescript
export class MyComponent {
  private readonly authService = inject(AuthService);
}
```

---

# Uso en Guards

```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  
  return router.parseUrl('/signin');
};
```

---

# Uso en Interceptors

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.accessToken();
  
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  
  return next(req);
};
```

---

# Reglas de Oro

1. ✅ **Siempre usar `readonly`**
2. ✅ **Usar en componentes standalone**
3. ✅ **Usar en guards e interceptors**
4. ❌ **Evitar en constructores de clases no Angular**

---

<!-- _class: section -->
# 5. Estructura de Features

---

# Anatomía de una Feature

```
feature/
├── pages/           # Smart Components
│   └── overview/
├── components/      # Dumb Components
│   └── item-card/
├── services/        # Feature Services
│   └── feature.service.ts
├── models/          # Domain Models
│   └── feature.models.ts
└── feature.routes.ts
```

---

# Feature Routes

```typescript
// dashboard.routes.ts
export const routes: Routes = [
  {
    path: '',
    component: OverviewComponent
  },
  {
    path: 'detail/:id',
    loadComponent: () => 
      import('./pages/detail/detail.component')
        .then(m => m.DetailComponent)
  }
];
```

---

# Lazy Loading

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => 
      import('@features/dashboard/dashboard.routes')
        .then(m => m.routes)
  }
];
```

---

# Reglas de Dependencia

```
┌─────────────────────────────────────┐
│           FEATURES                  │
│  ✓ Puede importar de @core/*       │
│  ✓ Puede importar de @shared/*     │
│  ✗ NO importa de otras features    │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│             CORE                    │
│  ✗ NO importa de Features          │
│  ✗ NO importa de Shared            │
└─────────────────────────────────────┘
```

---

<!-- _class: section -->
# Ejercicios Prácticos

---

# Ejercicio 1: Identificar

```typescript
@Component({...})
export class UserListComponent {
  private userService = inject(UserService);
  users = signal<User[]>([]);
  
  ngOnInit() {
    this.userService.getUsers()
      .subscribe(u => this.users.set(u));
  }
}
```

**¿Smart o Dumb?**

---

# Ejercicio 2: Convertir a OnPush

```typescript
@Component({...})
export class TodoListComponent {
  todos: Todo[] = [];
  
  addTodo(title: string) {
    this.todos.push({ id: Date.now(), title });
  }
}
```

**Convertir a OnPush con signals**

---

# Ejercicio 3: Crear Dumb Component

Crear `UserCardComponent`:
- Mostrar: nombre, email, avatar
- Emitir evento en click
- Usar OnPush
- Usar input() y output()

---

<!-- _class: section -->
# Resumen

---

# Conceptos Clave

| Concepto | Aplicación |
|----------|------------|
| **DDD Lite** | Estructura Core/Shared/Features |
| **Smart Component** | Páginas con lógica de negocio |
| **Dumb Component** | UI reutilizable |
| **OnPush** | Optimización de rendimiento |
| **inject()** | Inyección moderna |

---

# Reglas de Oro

1. ✅ **Siempre usar OnPush**
2. ✅ **Usar signals para estado**
3. ✅ **Separar Smart/Dumb**
4. ✅ **Usar inject()**
5. ✅ **Mantener features aisladas**

---

# Checklist de Implementación

- [ ] `changeDetection: ChangeDetectionStrategy.OnPush`
- [ ] Smart Components en `/pages/`
- [ ] Dumb Components en `/components/`
- [ ] Usar `inject()` para servicios
- [ ] Usar `input()` y `output()` signals
- [ ] Datos inmutables
- [ ] Feature no importa de otras features

---

# Próximo Día

## Día 3: Lazy Loading y Rutas

- Lazy Loading detallado
- Rutas anidadas
- Route Guards
- Resolvers

---

<!-- _class: end -->
# ¿Preguntas?

## Recursos
- 📚 Contenido: `contenido.md`
- 💻 Ejercicios: `ejercicios/`
- ✅ Assessment: `assessment/`

**Curso: Angular 21 Enterprise**
**Día: 2 de 18**
