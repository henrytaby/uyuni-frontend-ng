# Cheatsheet: Día 15 - Features y Componentes

## Estructura de un Feature

```
feature/
├── pages/                    # Smart Components (routables)
│   ├── list/
│   │   ├── list.component.ts
│   │   └── list.component.html
│   ├── detail/
│   └── form/
├── components/               # Dumb Components (UI)
│   ├── item-card/
│   └── item-form/
├── services/                 # Feature Services
│   └── feature.service.ts
├── models/                   # Domain Models
│   └── feature.models.ts
└── feature.routes.ts         # Routing
```

---

## Smart vs Dumb Components

| Aspecto | Smart (Page) | Dumb (UI) |
|---------|--------------|-----------|
| **Lógica** | Negocio | Presentación |
| **Servicios** | Sí inyecta | No inyecta |
| **Estado** | Signals | Solo Input/Output |
| **Routing** | Routable | No routable |
| **Ubicación** | `pages/` | `components/` |

---

## Input Signals

```typescript
// Input requerido
user = input.required<User>();

// Input opcional con valor por defecto
title = input<string>('Título');

// Input con transform
count = input(0, { transform: numberAttribute });
```

### Uso en Template

```html
<app-user-card [user]="selectedUser()" />
<app-header [title]="'Mi App'" />
```

---

## Output Signals

```typescript
// Output signal
userClick = output<User>();
deleteClick = output<string>();

// Emitir evento
onUserClick(): void {
  this.userClick.emit(this.user());
}
```

### Uso en Template

```html
<app-user-card 
  [user]="selectedUser()"
  (userClick)="onUserSelect($event)"
  (deleteClick)="onUserDelete($event)" />
```

---

## Model Signals (Two-way Binding)

```typescript
// Model signal
filter = model.required<UserFilter>();

// Actualizar desde el componente
this.filter.update(f => ({ ...f, page: 1 }));
```

### Uso en Template

```html
<app-user-filter [(filter)]="currentFilter" />
```

---

## Smart Component Template

```typescript
@Component({
  selector: 'app-user-list-page',
  standalone: true,
  imports: [CommonModule, UserCardComponent]
})
export class UserListPageComponent implements OnInit {
  // 1. Inyección de dependencias
  private userService = inject(UserService);
  private router = inject(Router);
  
  // 2. Estado con Signals
  users = signal<User[]>([]);
  isLoading = signal(true);
  
  // 3. Lifecycle hooks
  ngOnInit(): void {
    this.loadUsers();
  }
  
  // 4. Métodos públicos
  onUserSelect(user: User): void {
    this.router.navigate(['/users', user.id]);
  }
  
  // 5. Métodos privados
  private loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => this.users.set(users),
      error: (err) => console.error(err)
    });
  }
}
```

---

## Dumb Component Template

```typescript
@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule]
})
export class UserCardComponent {
  // Solo Input/Output, sin servicios
  user = input.required<User>();
  showActions = input<boolean>(true);
  
  userClick = output<User>();
  editClick = output<User>();
  deleteClick = output<User>();
  
  // Métodos simples
  onCardClick(): void {
    this.userClick.emit(this.user());
  }
  
  onEdit(): void {
    this.editClick.emit(this.user());
  }
}
```

---

## Feature Service Template

```typescript
@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  
  // Cache con signals
  private usersCache = signal<User[]>([]);
  readonly users = this.usersCache.asReadonly();
  
  // CRUD Operations
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users').pipe(
      tap(users => this.usersCache.set(users))
    );
  }
  
  createUser(request: CreateUserRequest): Observable<User> {
    return this.http.post<User>('/api/users', request).pipe(
      tap(newUser => this.usersCache.update(users => [...users, newUser]))
    );
  }
  
  updateUser(request: UpdateUserRequest): Observable<User> {
    return this.http.patch<User>(`/api/users/${request.id}`, request).pipe(
      tap(updated => {
        this.usersCache.update(users => 
          users.map(u => u.id === updated.id ? updated : u)
        );
      })
    );
  }
  
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`/api/users/${id}`).pipe(
      tap(() => {
        this.usersCache.update(users => users.filter(u => u.id !== id));
      })
    );
  }
}
```

---

## Feature Routes

```typescript
// feature.routes.ts
import { Routes } from '@angular/router';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => 
      import('./pages/list/list.component').then(m => m.ListComponent)
  },
  {
    path: 'new',
    loadComponent: () => 
      import('./pages/form/form.component').then(m => m.FormComponent)
  },
  {
    path: ':id',
    loadComponent: () => 
      import('./pages/detail/detail.component').then(m => m.DetailComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => 
      import('./pages/form/form.component').then(m => m.FormComponent)
  }
];
```

**⚠️ IMPORTANTE**: El orden de las rutas importa. Rutas específicas ('new') deben ir ANTES que rutas con parámetros (':id').

---

## App Routes Integration

```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'users',
        loadChildren: () => 
          import('./features/users/users.routes').then(m => m.USERS_ROUTES)
      },
      // ... otros features
    ]
  }
];
```

---

## Patrones Comunes

### Actualizar Signal (Inmutable)

```typescript
// ❌ Mal - Mutación directa
this.users().push(newUser);

// ✅ Bien - Inmutable
this.users.update(users => [...users, newUser]);
```

### Filtrar Lista

```typescript
// ✅ Filtrar con update
this.users.update(users => 
  users.filter(u => u.status === 'active')
);
```

### Actualizar Item en Lista

```typescript
// ✅ Actualizar item específico
this.users.update(users => 
  users.map(u => u.id === userId ? { ...u, ...updates } : u)
);
```

### Computed Signals

```typescript
// Derivar estado
activeUsers = computed(() => 
  this.users().filter(u => u.status === 'active')
);

userCount = computed(() => this.users().length);
```

---

## Errores Comunes

### 1. Inyectar servicios en Dumb Components

```typescript
// ❌ Mal
export class UserCardComponent {
  private userService = inject(UserService); // NO!
}

// ✅ Bien
export class UserCardComponent {
  user = input.required<User>(); // Solo Input/Output
}
```

### 2. Mutar signals directamente

```typescript
// ❌ Mal
this.users().push(user);

// ✅ Bien
this.users.update(users => [...users, user]);
```

### 3. Orden incorrecto de rutas

```typescript
// ❌ Mal - 'new' se interpreta como :id
{ path: ':id', ... },
{ path: 'new', ... }

// ✅ Bien - Rutas específicas primero
{ path: 'new', ... },
{ path: ':id', ... }
```

### 4. No usar asReadonly()

```typescript
// ❌ Mal - Permite modificación externa
users = signal<User[]>([]);

// ✅ Bien - Readonly para uso externo
private usersCache = signal<User[]>([]);
readonly users = this.usersCache.asReadonly();
```

---

## Snippets Útiles

### Generar Componente

```bash
ng generate component features/users/pages/list --standalone
ng generate component features/users/components/user-card --standalone
```

### Generar Servicio

```bash
ng generate service features/users/services/user
```

### Generar Interface

```typescript
// En models/user.models.ts
export interface User {
  id: string;
  name: string;
  email: string;
}
```

---

## Checklist de Feature

- [ ] Estructura de carpetas creada
- [ ] Modelos definidos en `models/`
- [ ] Feature Service con CRUD en `services/`
- [ ] Dumb Components en `components/`
- [ ] Smart Components (Pages) en `pages/`
- [ ] Routing configurado en `feature.routes.ts`
- [ ] Feature integrado en `app.routes.ts`
- [ ] Lazy loading configurado

---

*Cheatsheet - Día 15 - Curso Angular 21 - UyuniAdmin Frontend*
