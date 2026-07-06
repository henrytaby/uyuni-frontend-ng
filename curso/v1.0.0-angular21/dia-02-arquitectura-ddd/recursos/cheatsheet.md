# Cheatsheet - Día 2: Arquitectura DDD Lite

## Estructura de Carpetas

```
src/app/
├── core/           # Servicios globales (singletons)
│   ├── auth/
│   ├── config/
│   ├── guards/
│   ├── interceptors/
│   └── services/
│
├── shared/         # Componentes reutilizables
│   ├── components/
│   ├── layout/
│   ├── pipes/
│   └── directives/
│
└── features/       # Módulos de negocio
    ├── auth/
    ├── dashboard/
    └── profile/
```

---

## Smart vs Dumb Components

### Smart Component (Pages)

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent {
  // ✅ Inyecta servicios
  private readonly userService = inject(UserService);
  
  // ✅ Maneja estado
  users = signal<User[]>([]);
  isLoading = signal(true);
  
  // ✅ Lógica de negocio
  loadUsers(): void {
    this.userService.getUsers()
      .subscribe(users => this.users.set(users));
  }
}
```

### Dumb Component (UI)

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserCardComponent {
  // ✅ Solo recibe inputs
  readonly user = input.required<User>();
  readonly isLoading = input<boolean>(false);
  
  // ✅ Solo emite outputs
  readonly deleteClick = output<number>();
  
  // ❌ NO inyecta servicios
  // ❌ NO tiene lógica de negocio
}
```

---

## Comparación Rápida

| Aspecto | Smart | Dumb |
|---------|-------|------|
| Ubicación | `/pages/` | `/components/` |
| Servicios | ✅ Inyecta | ❌ No |
| Estado | ✅ Maneja | ❌ Solo recibe |
| Inputs | Pocos | Muchos |
| Outputs | Pocos | Muchos |
| Lógica | Negocio | Presentación |
| Tests | Integración | Unitarios |

---

## ChangeDetectionStrategy.OnPush

### Configuración

```typescript
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyComponent {}
```

### Cuándo Verifica OnPush

1. ✅ `@Input` cambia (nueva referencia)
2. ✅ Evento del DOM en el componente
3. ✅ `AsyncPipe` recibe valor
4. ✅ `signal()` actualiza
5. ✅ `markForCheck()` manual

---

## Patrones Inmutables

### Arrays

```typescript
// ❌ Mal: Mutación
this.items.push(newItem);
this.items.splice(index, 1);
this.items[i] = newItem;

// ✅ Bien: Inmutable
this.items = [...this.items, newItem];
this.items = this.items.filter((_, i) => i !== index);
this.items = this.items.map((item, i) => i === index ? newItem : item);
```

### Objetos

```typescript
// ❌ Mal: Mutación
this.user.name = 'New Name';
Object.assign(this.user, { name: 'New Name' });

// ✅ Bien: Inmutable
this.user = { ...this.user, name: 'New Name' };
this.user = { ...this.user, ...updates };
```

### Con Signals

```typescript
// ✅ Actualizar array
this.items.update(items => [...items, newItem]);

// ✅ Actualizar objeto
this.user.update(user => ({ ...user, name: 'New Name' }));

// ✅ Eliminar item
this.items.update(items => items.filter(item => item.id !== id));
```

---

## Patrón inject()

### Sintaxis

```typescript
import { inject } from '@angular/core';

@Component({...})
export class MyComponent {
  // ✅ Forma moderna
  private readonly authService = inject(AuthService);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
}
```

### En Functional Guards

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

### En Functional Interceptors

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

## Signals

### Crear y Usar

```typescript
import { signal, computed } from '@angular/core';

// Writable signal
count = signal(0);
user = signal<User | null>(null);

// Computed signal
doubleCount = computed(() => this.count() * 2);
fullName = computed(() => {
  const u = this.user();
  return u ? `${u.firstName} ${u.lastName}` : '';
});
```

### Actualizar

```typescript
// Set: Reemplaza valor
this.count.set(10);

// Update: Usa función
this.count.update(c => c + 1);

// Para objetos/arrays
this.user.update(u => ({ ...u, name: 'New' }));
this.items.update(items => [...items, newItem]);
```

---

## Estructura de Feature

```
feature/
├── pages/
│   └── overview/
│       ├── overview.component.ts
│       └── overview.component.html
├── components/
│   └── item-card/
│       ├── item-card.component.ts
│       └── item-card.component.html
├── services/
│   └── feature.service.ts
├── models/
│   └── feature.models.ts
└── feature.routes.ts
```

---

## Reglas de Dependencia

```
┌─────────────────────────────────────┐
│           FEATURES                  │
│  ✓ Importa de @core/*              │
│  ✓ Importa de @shared/*            │
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

## Checklist OnPush

- [ ] `changeDetection: ChangeDetectionStrategy.OnPush`
- [ ] Estado con signals
- [ ] Arrays: crear nuevos con `[...arr, item]`
- [ ] Objetos: crear nuevos con `{...obj, prop}`
- [ ] Usar `update()` para signals
- [ ] No mutar datos directamente

---

## Errores Comunes

### Error 1: Mutar con OnPush

```typescript
// ❌ Problema
this.users.push(user);  // No actualiza vista

// ✅ Solución
this.users.update(users => [...users, user]);
```

### Error 2: Dumb con servicios

```typescript
// ❌ Problema
export class UserCardComponent {
  private userService = inject(UserService);  // No!
}

// ✅ Solución
export class UserCardComponent {
  readonly deleteClick = output<number>();  // Emitir evento
}
```

### Error 3: No usar readonly

```typescript
// ❌ Problema
private authService = inject(AuthService);  // Puede reasignarse

// ✅ Solución
private readonly authService = inject(AuthService);  // Inmutable
```

---

## Comandos Útiles

```bash
# Crear componente Smart (page)
ng g component features/users/pages/user-list --standalone

# Crear componente Dumb
ng g component features/users/components/user-card --standalone

# Crear servicio
ng g service features/users/services/user

# Crear interface
# (No hay comando, crear manualmente)
```

---

## Snippets VS Code

### Componente con OnPush

```typescript
// Template: ng-component-onpush
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-${1:name}',
  standalone: true,
  imports: [${2:CommonModule}],
  template: \`
    ${3:<!-- content -->}
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ${4:Name}Component {
  ${5:// properties}
}
```

### Dumb Component

```typescript
// Template: ng-dumb-component
import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-${1:name}',
  standalone: true,
  imports: [${2:CommonModule}],
  template: \`
    ${3:<!-- content -->}
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ${4:Name}Component {
  readonly ${5:data} = input.required<${6:Type}>();
  readonly ${7:action}Click = output<${8:Type}>();
}
```

---

## Debugging

### Verificar Change Detection

```typescript
// Agregar temporalmente para debugging
import { ChangeDetectorRef } from '@angular/core';

constructor(private cdr: ChangeDetectorRef) {
  console.log('Change Detection runs:', this.cdr.constructor.name);
}
```

### Verificar Signal Updates

```typescript
// Usar effect para debugging
import { effect } from '@angular/core';

constructor() {
  effect(() => {
    console.log('Signal changed:', this.users());
  });
}
```

---

*Cheatsheet - Día 2: Arquitectura DDD Lite*
*Curso: Angular 21 Enterprise*
*Día: 2 de 18*
