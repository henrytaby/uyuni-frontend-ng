# Lab 02: Feature Users con CRUD

## Información del Lab

| Atributo | Valor |
|----------|-------|
| **Duración** | 45 minutos |
| **Dificultad** | Intermedio-Avanzado |
| **Objetivo** | Crear un feature users con operaciones CRUD completas |

---

## Objetivos de Aprendizaje

Al completar este lab, serás capaz de:

1. Crear múltiples páginas (List, Detail, Form)
2. Implementar operaciones CRUD
3. Manejar estado con cache en el servicio
4. Crear componentes reutilizables (UserCard, UserForm, UserFilter)
5. Configurar routing anidado con parámetros

---

## Prerrequisitos

- Haber completado el Lab 01
- Conocimiento de Reactive Forms
- Conocimiento de routing con parámetros

---

## Escenario

Vas a crear un feature de gestión de usuarios con CRUD completo:

```
┌─────────────────────────────────────────────────────────────┐
│                    USERS FEATURE                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  LIST PAGE                                               ││
│  │  ┌─────────────────────────────────────────────────────┐││
│  │  │  [Search...] [Filter ▼] [+ New User]               │││
│  │  └─────────────────────────────────────────────────────┘││
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐           ││
│  │  │ User 1 │ │ User 2 │ │ User 3 │ │ User 4 │           ││
│  │  │ [Edit] │ │ [Edit] │ │ [Edit] │ │ [Edit] │           ││
│  │  │ [Del]  │ │ [Del]  │ │ [Del]  │ │ [Del]  │           ││
│  │  └────────┘ └────────┘ └────────┘ └────────┘           ││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  DETAIL PAGE                                             ││
│  │  [← Back]                                                ││
│  │  ┌─────────────────────────────────────────────────────┐││
│  │  │  Avatar: [IMG]                                      │││
│  │  │  Name: John Doe                                     │││
│  │  │  Email: john@example.com                            │││
│  │  │  Role: Admin                                        │││
│  │  │  [Edit] [Delete]                                    │││
│  │  └─────────────────────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  FORM PAGE (Create/Edit)                                 ││
│  │  ┌─────────────────────────────────────────────────────┐││
│  │  │  Name: [____________]                               │││
│  │  │  Email: [____________]                              │││
│  │  │  Role: [Select ▼]                                   │││
│  │  │  [Cancel] [Save]                                    │││
│  │  └─────────────────────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Paso 1: Crear Estructura del Feature (5 min)

### 1.1 Crear carpetas

```bash
# Crear estructura de carpetas
mkdir -p src/app/features/users/pages/list
mkdir -p src/app/features/users/pages/detail
mkdir -p src/app/features/users/pages/form
mkdir -p src/app/features/users/components/user-card
mkdir -p src/app/features/users/components/user-form
mkdir -p src/app/features/users/components/user-filter
mkdir -p src/app/features/users/services
mkdir -p src/app/features/users/models
```

### 1.2 Estructura resultante

```
users/
├── pages/
│   ├── list/
│   │   ├── list.component.ts
│   │   └── list.component.html
│   ├── detail/
│   │   ├── detail.component.ts
│   │   └── detail.component.html
│   └── form/
│       ├── form.component.ts
│       └── form.component.html
├── components/
│   ├── user-card/
│   │   ├── user-card.component.ts
│   │   └── user-card.component.html
│   ├── user-form/
│   │   ├── user-form.component.ts
│   │   └── user-form.component.html
│   └── user-filter/
│       ├── user-filter.component.ts
│       └── user-filter.component.html
├── services/
│   └── user.service.ts
├── models/
│   └── user.models.ts
└── users.routes.ts
```

---

## Paso 2: Crear Modelos (5 min)

### 2.1 Definir interfaces

Crea `src/app/features/users/models/user.models.ts`:

```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'admin' | 'manager' | 'user' | 'guest';

export type UserStatus = 'active' | 'inactive' | 'pending';

export interface CreateUserRequest {
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {
  id: string;
}

export interface UserFilter {
  search: string;
  role: UserRole | 'all';
  status: UserStatus | 'all';
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  pageSize: number;
}

// Constantes para UI
export const USER_ROLES: Record<UserRole, string> = {
  admin: 'Administrador',
  manager: 'Gerente',
  user: 'Usuario',
  guest: 'Invitado'
};

export const USER_STATUS: Record<UserStatus, string> = {
  active: 'Activo',
  inactive: 'Inactivo',
  pending: 'Pendiente'
};

export const USER_STATUS_COLORS: Record<UserStatus, string> = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  inactive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
};
```

---

## Paso 3: Crear Feature Service (10 min)

### 3.1 UserService con CRUD

Crea `src/app/features/users/services/user.service.ts`:

```typescript
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { LoggerService } from '@core/services/logger.service';
import { ConfigService } from '@core/config/config.service';
import { 
  User, 
  CreateUserRequest, 
  UpdateUserRequest, 
  UserFilter,
  UserListResponse 
} from '../models/user.models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private logger = inject(LoggerService);
  private configService = inject(ConfigService);
  
  private apiUrl = this.configService.getApiUrl();
  
  // Cache con signals
  private usersCache = signal<User[]>([]);
  private loadingCache = signal<boolean>(false);
  
  // Signals públicos (readonly)
  readonly users = this.usersCache.asReadonly();
  readonly isLoading = this.loadingCache.asReadonly();
  
  /**
   * Obtiene todos los usuarios
   */
  getUsers(filter?: UserFilter): Observable<User[]> {
    this.loadingCache.set(true);
    
    // Mock data para desarrollo
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'assets/images/user/user-01.jpg',
        role: 'admin',
        status: 'active',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-03-10')
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        avatar: 'assets/images/user/user-02.jpg',
        role: 'manager',
        status: 'active',
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-03-12')
      },
      {
        id: '3',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        role: 'user',
        status: 'pending',
        createdAt: new Date('2024-02-15'),
        updatedAt: new Date('2024-03-01')
      },
      {
        id: '4',
        name: 'Alice Brown',
        email: 'alice@example.com',
        avatar: 'assets/images/user/user-03.jpg',
        role: 'user',
        status: 'inactive',
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-02-28')
      }
    ];
    
    // Aplicar filtros
    let filteredUsers = [...mockUsers];
    
    if (filter) {
      if (filter.search) {
        const search = filter.search.toLowerCase();
        filteredUsers = filteredUsers.filter(u => 
          u.name.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search)
        );
      }
      
      if (filter.role !== 'all') {
        filteredUsers = filteredUsers.filter(u => u.role === filter.role);
      }
      
      if (filter.status !== 'all') {
        filteredUsers = filteredUsers.filter(u => u.status === filter.status);
      }
    }
    
    // Simular delay de red
    setTimeout(() => {
      this.usersCache.set(filteredUsers);
      this.loadingCache.set(false);
    }, 500);
    
    return of(filteredUsers);
    
    // En producción:
    // return this.http.get<UserListResponse>(`${this.apiUrl}/users`, { params }).pipe(
    //   map(response => response.users),
    //   tap(users => this.usersCache.set(users)),
    //   catchError(this.handleError.bind(this)),
    //   finalize(() => this.loadingCache.set(false))
    // );
  }
  
  /**
   * Obtiene un usuario por ID
   */
  getUserById(id: string): Observable<User | undefined> {
    // Primero buscar en cache
    const cached = this.usersCache().find(u => u.id === id);
    if (cached) {
      return of(cached);
    }
    
    // Si no está en cache, hacer petición
    return of(this.usersCache().find(u => u.id === id));
    
    // En producción:
    // return this.http.get<User>(`${this.apiUrl}/users/${id}`).pipe(
    //   catchError(this.handleError.bind(this))
    // );
  }
  
  /**
   * Crea un nuevo usuario
   */
  createUser(request: CreateUserRequest): Observable<User> {
    const newUser: User = {
      id: String(Date.now()),
      ...request,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.usersCache.update(users => [...users, newUser]);
    this.logger.info('User created', { id: newUser.id });
    
    return of(newUser);
    
    // En producción:
    // return this.http.post<User>(`${this.apiUrl}/users`, request).pipe(
    //   tap(user => this.usersCache.update(users => [...users, user])),
    //   catchError(this.handleError.bind(this))
    // );
  }
  
  /**
   * Actualiza un usuario existente
   */
  updateUser(request: UpdateUserRequest): Observable<User> {
    const { id, ...updates } = request;
    
    let updatedUser: User | null = null;
    
    this.usersCache.update(users => 
      users.map(user => {
        if (user.id === id) {
          updatedUser = { 
            ...user, 
            ...updates, 
            updatedAt: new Date() 
          };
          return updatedUser!;
        }
        return user;
      })
    );
    
    if (!updatedUser) {
      return throwError(() => new Error('User not found'));
    }
    
    this.logger.info('User updated', { id });
    return of(updatedUser);
    
    // En producción:
    // return this.http.patch<User>(`${this.apiUrl}/users/${id}`, updates).pipe(
    //   tap(updated => {
    //     this.usersCache.update(users => 
    //       users.map(u => u.id === id ? updated : u)
    //     );
    //   }),
    //   catchError(this.handleError.bind(this))
    // );
  }
  
  /**
   * Elimina un usuario
   */
  deleteUser(id: string): Observable<void> {
    this.usersCache.update(users => users.filter(u => u.id !== id));
    this.logger.info('User deleted', { id });
    
    return of(void 0);
    
    // En producción:
    // return this.http.delete<void>(`${this.apiUrl}/users/${id}`).pipe(
    //   tap(() => {
    //     this.usersCache.update(users => users.filter(u => u.id !== id));
    //   }),
    //   catchError(this.handleError.bind(this))
    // );
  }
  
  /**
   * Invalida el cache
   */
  invalidateCache(): void {
    this.usersCache.set([]);
    this.logger.debug('User cache invalidated');
  }
  
  private handleError(error: unknown): Observable<never> {
    this.logger.error('UserService error', error);
    return throwError(() => error);
  }
}
```

---

## Paso 4: Crear Dumb Components (15 min)

### 4.1 UserCardComponent

Crea `src/app/features/users/components/user-card/user-card.component.ts`:

```typescript
import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User, USER_STATUS_COLORS } from '../../models/user.models';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 
                hover:shadow-lg transition-shadow">
      
      <div class="flex items-start gap-4">
        <!-- Avatar -->
        <div class="flex-shrink-0">
          @if (user().avatar) {
            <img 
              [src]="user().avatar" 
              [alt]="user().name"
              class="w-12 h-12 rounded-full object-cover">
          } @else {
            <div class="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 
                        flex items-center justify-center">
              <span class="text-lg font-medium text-gray-600 dark:text-gray-300">
                {{ getInitials() }}
              </span>
            </div>
          }
        </div>
        
        <!-- Info -->
        <div class="flex-1 min-w-0">
          <h3 class="text-sm font-medium text-gray-900 dark:text-white truncate">
            {{ user().name }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
            {{ user().email }}
          </p>
          <div class="flex items-center gap-2 mt-2">
            <span 
              [class]="getStatusClasses()"
              class="px-2 py-0.5 text-xs font-medium rounded-full">
              {{ user().status }}
            </span>
            <span class="text-xs text-gray-500 dark:text-gray-400">
              {{ user().role }}
            </span>
          </div>
        </div>
        
        <!-- Actions -->
        @if (showActions()) {
          <div class="flex-shrink-0 flex gap-1">
            <button 
              (click)="onEdit()"
              class="p-1.5 text-gray-400 hover:text-blue-500 
                     hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
              title="Editar">
              <i class="pi pi-pencil"></i>
            </button>
            <button 
              (click)="onDelete()"
              class="p-1.5 text-gray-400 hover:text-red-500 
                     hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
              title="Eliminar">
              <i class="pi pi-trash"></i>
            </button>
          </div>
        }
      </div>
    </div>
  `
})
export class UserCardComponent {
  user = input.required<User>();
  showActions = input<boolean>(true);
  
  editClick = output<User>();
  deleteClick = output<User>();
  cardClick = output<User>();
  
  getInitials(): string {
    const name = this.user().name;
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
  
  getStatusClasses(): string {
    return USER_STATUS_COLORS[this.user().status] || '';
  }
  
  onEdit(): void {
    this.editClick.emit(this.user());
  }
  
  onDelete(): void {
    this.deleteClick.emit(this.user());
  }
}
```

### 4.2 UserFilterComponent

Crea `src/app/features/users/components/user-filter/user-filter.component.ts`:

```typescript
import { Component, input, output, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserFilter, UserRole, UserStatus } from '../../models/user.models';

@Component({
  selector: 'app-user-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div class="flex flex-col sm:flex-row gap-4">
        
        <!-- Search -->
        <div class="flex-1">
          <label class="sr-only">Buscar</label>
          <div class="relative">
            <input 
              type="text"
              [(ngModel)]="localFilter.search"
              (ngModelChange)="onFilterChange()"
              placeholder="Buscar por nombre o email..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 
                     rounded-lg bg-white dark:bg-gray-700 
                     text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 
                      text-gray-400"></i>
          </div>
        </div>
        
        <!-- Role Filter -->
        <div class="sm:w-40">
          <label class="sr-only">Rol</label>
          <select 
            [(ngModel)]="localFilter.role"
            (ngModelChange)="onFilterChange()"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                   rounded-lg bg-white dark:bg-gray-700 
                   text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="all">Todos los roles</option>
            <option value="admin">Administrador</option>
            <option value="manager">Gerente</option>
            <option value="user">Usuario</option>
            <option value="guest">Invitado</option>
          </select>
        </div>
        
        <!-- Status Filter -->
        <div class="sm:w-40">
          <label class="sr-only">Estado</label>
          <select 
            [(ngModel)]="localFilter.status"
            (ngModelChange)="onFilterChange()"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                   rounded-lg bg-white dark:bg-gray-700 
                   text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="all">Todos los estados</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
            <option value="pending">Pendiente</option>
          </select>
        </div>
        
        <!-- Clear Button -->
        @if (hasActiveFilters()) {
          <button 
            (click)="clearFilters()"
            class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 
                   hover:text-gray-900 dark:hover:text-white">
            <i class="pi pi-times mr-1"></i>
            Limpiar
          </button>
        }
      </div>
    </div>
  `
})
export class UserFilterComponent {
  filter = model.required<UserFilter>();
  
  private defaultFilter: UserFilter = {
    search: '',
    role: 'all',
    status: 'all'
  };
  
  localFilter = { ...this.defaultFilter };
  
  filterChange = output<UserFilter>();
  
  ngOnInit(): void {
    this.localFilter = { ...this.filter() };
  }
  
  onFilterChange(): void {
    this.filter.set({ ...this.localFilter });
    this.filterChange.emit({ ...this.localFilter });
  }
  
  hasActiveFilters(): boolean {
    return this.localFilter.search !== '' ||
           this.localFilter.role !== 'all' ||
           this.localFilter.status !== 'all';
  }
  
  clearFilters(): void {
    this.localFilter = { ...this.defaultFilter };
    this.onFilterChange();
  }
}
```

### 4.3 UserFormComponent

Crea `src/app/features/users/components/user-form/user-form.component.ts`:

```typescript
import { Component, input, output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User, CreateUserRequest, UpdateUserRequest, UserRole } from '../../models/user.models';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form 
      [formGroup]="form"
      (ngSubmit)="onSubmit()"
      class="space-y-6">
      
      <!-- Name -->
      <div>
        <label 
          for="name"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Nombre *
        </label>
        <input 
          type="text"
          id="name"
          formControlName="name"
          class="w-full px-3 py-2 border rounded-lg 
                 bg-white dark:bg-gray-700 
                 text-gray-900 dark:text-white
                 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          [class.border-red-500]="isInvalid('name')"
          placeholder="Nombre completo">
        @if (isInvalid('name')) {
          <p class="mt-1 text-sm text-red-500">
            El nombre es requerido
          </p>
        }
      </div>
      
      <!-- Email -->
      <div>
        <label 
          for="email"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email *
        </label>
        <input 
          type="email"
          id="email"
          formControlName="email"
          class="w-full px-3 py-2 border rounded-lg 
                 bg-white dark:bg-gray-700 
                 text-gray-900 dark:text-white
                 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          [class.border-red-500]="isInvalid('email')"
          placeholder="correo@ejemplo.com">
        @if (isInvalid('email')) {
          <p class="mt-1 text-sm text-red-500">
            @if (form.get('email')?.errors?.['required']) {
              El email es requerido
            } @else {
              El email no es válido
            }
          </p>
        }
      </div>
      
      <!-- Role -->
      <div>
        <label 
          for="role"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Rol *
        </label>
        <select 
          id="role"
          formControlName="role"
          class="w-full px-3 py-2 border rounded-lg 
                 bg-white dark:bg-gray-700 
                 text-gray-900 dark:text-white
                 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="">Seleccionar rol</option>
          <option value="admin">Administrador</option>
          <option value="manager">Gerente</option>
          <option value="user">Usuario</option>
          <option value="guest">Invitado</option>
        </select>
        @if (isInvalid('role')) {
          <p class="mt-1 text-sm text-red-500">
            El rol es requerido
          </p>
        }
      </div>
      
      <!-- Actions -->
      <div class="flex justify-end gap-3 pt-4 border-t 
                  border-gray-200 dark:border-gray-700">
        <button 
          type="button"
          (click)="onCancel()"
          class="px-4 py-2 text-gray-700 dark:text-gray-300 
                 bg-gray-100 dark:bg-gray-700 
                 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600
                 transition-colors">
          Cancelar
        </button>
        <button 
          type="submit"
          [disabled]="form.invalid || isSubmitting()"
          class="px-4 py-2 text-white bg-blue-500 rounded-lg 
                 hover:bg-blue-600 disabled:opacity-50 
                 disabled:cursor-not-allowed transition-colors">
          @if (isSubmitting()) {
            <i class="pi pi-spinner pi-spin mr-2"></i>
          }
          {{ isEditing() ? 'Actualizar' : 'Crear' }}
        </button>
      </div>
    </form>
  `
})
export class UserFormComponent implements OnInit {
  user = input<User | null>(null);
  isEditing = input<boolean>(false);
  isSubmitting = input<boolean>(false);
  
  submitForm = output<CreateUserRequest | UpdateUserRequest>();
  cancel = output<void>();
  
  private fb = inject(FormBuilder);
  
  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    role: ['', Validators.required]
  });
  
  ngOnInit(): void {
    if (this.user()) {
      this.form.patchValue({
        name: this.user()!.name,
        email: this.user()!.email,
        role: this.user()!.role
      });
    }
  }
  
  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && control.touched);
  }
  
  onSubmit(): void {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
      return;
    }
    
    const value = this.form.value;
    
    if (this.isEditing() && this.user()) {
      this.submitForm.emit({
        id: this.user()!.id,
        ...value
      } as UpdateUserRequest);
    } else {
      this.submitForm.emit(value as CreateUserRequest);
    }
  }
  
  onCancel(): void {
    this.cancel.emit();
  }
}
```

---

## Paso 5: Crear Smart Components (Pages) (15 min)

### 5.1 ListComponent

Crea `src/app/features/users/pages/list/list.component.ts`:

```typescript
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserCardComponent } from '../../components/user-card/user-card.component';
import { UserFilterComponent } from '../../components/user-filter/user-filter.component';
import { UserService } from '../../services/user.service';
import { LoggerService } from '@core/services/logger.service';
import { User, UserFilter } from '../../models/user.models';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    UserCardComponent,
    UserFilterComponent
  ],
  template: `
    <div class="p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Usuarios
          </h1>
          <p class="text-gray-500 dark:text-gray-400">
            Gestiona los usuarios del sistema
          </p>
        </div>
        <button 
          (click)="onCreateUser()"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg 
                 hover:bg-blue-600 transition-colors flex items-center gap-2">
          <i class="pi pi-plus"></i>
          Nuevo Usuario
        </button>
      </div>
      
      <!-- Filters -->
      <div class="mb-6">
        <app-user-filter 
          [filter]="filter()"
          (filterChange)="onFilterChange($event)" />
      </div>
      
      <!-- Loading -->
      @if (userService.isLoading()) {
        <div class="flex justify-center items-center h-64">
          <i class="pi pi-spinner pi-spin text-4xl text-blue-500"></i>
        </div>
      } @else if (userService.users().length === 0) {
        <!-- Empty State -->
        <div class="text-center py-12">
          <i class="pi pi-users text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No hay usuarios
          </h3>
          <p class="text-gray-500 dark:text-gray-400 mb-4">
            @if (hasActiveFilters()) {
              No se encontraron usuarios con los filtros aplicados
            } @else {
              Comienza creando un nuevo usuario
            }
          </p>
          @if (!hasActiveFilters()) {
            <button 
              (click)="onCreateUser()"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg 
                     hover:bg-blue-600 transition-colors">
              Crear Usuario
            </button>
          }
        </div>
      } @else {
        <!-- User Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (user of userService.users(); track user.id) {
            <app-user-card 
              [user]="user"
              (editClick)="onEditUser($event)"
              (deleteClick)="onDeleteUser($event)" />
          }
        </div>
      }
    </div>
  `
})
export class ListComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);
  private logger = inject(LoggerService);
  
  filter = signal<UserFilter>({
    search: '',
    role: 'all',
    status: 'all'
  });
  
  ngOnInit(): void {
    this.loadUsers();
  }
  
  private loadUsers(): void {
    this.userService.getUsers(this.filter()).subscribe({
      error: (err) => this.logger.error('Failed to load users', err)
    });
  }
  
  onFilterChange(filter: UserFilter): void {
    this.filter.set(filter);
    this.loadUsers();
  }
  
  hasActiveFilters(): boolean {
    const f = this.filter();
    return f.search !== '' || f.role !== 'all' || f.status !== 'all';
  }
  
  onCreateUser(): void {
    this.router.navigate(['/users', 'new']);
  }
  
  onEditUser(user: User): void {
    this.router.navigate(['/users', user.id, 'edit']);
  }
  
  onDeleteUser(user: User): void {
    if (confirm(`¿Estás seguro de eliminar a ${user.name}?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.logger.info('User deleted', { id: user.id });
        },
        error: (err) => {
          this.logger.error('Failed to delete user', err);
        }
      });
    }
  }
}
```

### 5.2 DetailComponent

Crea `src/app/features/users/pages/detail/detail.component.ts`:

```typescript
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { LoggerService } from '@core/services/logger.service';
import { User, USER_STATUS_COLORS } from '../../models/user.models';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <!-- Back Button -->
      <button 
        (click)="onBack()"
        class="mb-6 flex items-center gap-2 text-gray-600 
               dark:text-gray-400 hover:text-gray-900 
               dark:hover:text-white transition-colors">
        <i class="pi pi-arrow-left"></i>
        Volver a la lista
      </button>
      
      <!-- Loading -->
      @if (isLoading()) {
        <div class="flex justify-center items-center h-64">
          <i class="pi pi-spinner pi-spin text-4xl text-blue-500"></i>
        </div>
      } @else if (user()) {
        <!-- User Detail Card -->
        <div class="max-w-2xl mx-auto bg-white dark:bg-gray-800 
                    rounded-lg shadow overflow-hidden">
          
          <!-- Header -->
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
            <div class="flex items-center gap-4">
              @if (user()?.avatar) {
                <img 
                  [src]="user()!.avatar" 
                  [alt]="user()!.name"
                  class="w-20 h-20 rounded-full border-4 border-white 
                         object-cover">
              } @else {
                <div class="w-20 h-20 rounded-full bg-white/20 
                            flex items-center justify-center border-4 border-white">
                  <span class="text-2xl font-bold text-white">
                    {{ getInitials() }}
                  </span>
                </div>
              }
              <div>
                <h1 class="text-2xl font-bold text-white">
                  {{ user()!.name }}
                </h1>
                <p class="text-blue-100">
                  {{ user()!.email }}
                </p>
              </div>
            </div>
          </div>
          
          <!-- Content -->
          <div class="p-6 space-y-4">
            <!-- Status -->
            <div class="flex items-center justify-between py-3 
                        border-b border-gray-200 dark:border-gray-700">
              <span class="text-gray-500 dark:text-gray-400">Estado</span>
              <span 
                [class]="getStatusClasses()"
                class="px-3 py-1 text-sm font-medium rounded-full">
                {{ user()!.status }}
              </span>
            </div>
            
            <!-- Role -->
            <div class="flex items-center justify-between py-3 
                        border-b border-gray-200 dark:border-gray-700">
              <span class="text-gray-500 dark:text-gray-400">Rol</span>
              <span class="text-gray-900 dark:text-white font-medium">
                {{ user()!.role }}
              </span>
            </div>
            
            <!-- Created -->
            <div class="flex items-center justify-between py-3 
                        border-b border-gray-200 dark:border-gray-700">
              <span class="text-gray-500 dark:text-gray-400">Creado</span>
              <span class="text-gray-900 dark:text-white">
                {{ user()!.createdAt | date:'mediumDate' }}
              </span>
            </div>
            
            <!-- Updated -->
            <div class="flex items-center justify-between py-3">
              <span class="text-gray-500 dark:text-gray-400">Actualizado</span>
              <span class="text-gray-900 dark:text-white">
                {{ user()!.updatedAt | date:'mediumDate' }}
              </span>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="p-6 bg-gray-50 dark:bg-gray-900 
                      flex justify-end gap-3">
            <button 
              (click)="onEdit()"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg 
                     hover:bg-blue-600 transition-colors flex items-center gap-2">
              <i class="pi pi-pencil"></i>
              Editar
            </button>
            <button 
              (click)="onDelete()"
              class="px-4 py-2 bg-red-500 text-white rounded-lg 
                     hover:bg-red-600 transition-colors flex items-center gap-2">
              <i class="pi pi-trash"></i>
              Eliminar
            </button>
          </div>
        </div>
      } @else {
        <!-- Not Found -->
        <div class="text-center py-12">
          <i class="pi pi-exclamation-triangle text-6xl 
                    text-yellow-500 mb-4"></i>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Usuario no encontrado
          </h3>
          <button 
            (click)="onBack()"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg 
                   hover:bg-blue-600 transition-colors">
            Volver a la lista
          </button>
        </div>
      }
    </div>
  `
})
export class DetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);
  private logger = inject(LoggerService);
  
  user = signal<User | undefined>(undefined);
  isLoading = signal(true);
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadUser(id);
    }
  }
  
  private loadUser(id: string): void {
    this.isLoading.set(true);
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.user.set(user);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.logger.error('Failed to load user', err);
        this.isLoading.set(false);
      }
    });
  }
  
  getInitials(): string {
    const name = this.user()?.name || '';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
  
  getStatusClasses(): string {
    return USER_STATUS_COLORS[this.user()?.status || 'active'] || '';
  }
  
  onBack(): void {
    this.router.navigate(['/users']);
  }
  
  onEdit(): void {
    this.router.navigate(['/users', this.user()?.id, 'edit']);
  }
  
  onDelete(): void {
    if (confirm(`¿Estás seguro de eliminar a ${this.user()?.name}?`)) {
      this.userService.deleteUser(this.user()!.id).subscribe({
        next: () => {
          this.logger.info('User deleted');
          this.onBack();
        },
        error: (err) => {
          this.logger.error('Failed to delete user', err);
        }
      });
    }
  }
}
```

### 5.3 FormComponent

Crea `src/app/features/users/pages/form/form.component.ts`:

```typescript
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserFormComponent } from '../../components/user-form/user-form.component';
import { UserService } from '../../services/user.service';
import { LoggerService } from '@core/services/logger.service';
import { User, CreateUserRequest, UpdateUserRequest } from '../../models/user.models';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, UserFormComponent],
  template: `
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <button 
          (click)="onCancel()"
          class="flex items-center gap-2 text-gray-600 
                 dark:text-gray-400 hover:text-gray-900 
                 dark:hover:text-white transition-colors mb-4">
          <i class="pi pi-arrow-left"></i>
          Volver
        </button>
        
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ isEditing() ? 'Editar Usuario' : 'Nuevo Usuario' }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400">
          {{ isEditing() ? 'Modifica los datos del usuario' : 'Completa los datos del nuevo usuario' }}
        </p>
      </div>
      
      <!-- Loading -->
      @if (isLoading()) {
        <div class="flex justify-center items-center h-64">
          <i class="pi pi-spinner pi-spin text-4xl text-blue-500"></i>
        </div>
      } @else {
        <!-- Form -->
        <div class="max-w-xl mx-auto bg-white dark:bg-gray-800 
                    rounded-lg shadow p-6">
          <app-user-form 
            [user]="user()"
            [isEditing]="isEditing()"
            [isSubmitting]="isSubmitting()"
            (submitForm)="onSubmit($event)"
            (cancel)="onCancel()" />
        </div>
      }
    </div>
  `
})
export class FormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);
  private logger = inject(LoggerService);
  
  user = signal<User | undefined>(undefined);
  isEditing = signal(false);
  isLoading = signal(false);
  isSubmitting = signal(false);
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditing.set(true);
      this.loadUser(id);
    }
  }
  
  private loadUser(id: string): void {
    this.isLoading.set(true);
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.user.set(user);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.logger.error('Failed to load user', err);
        this.isLoading.set(false);
        this.router.navigate(['/users']);
      }
    });
  }
  
  onSubmit(request: CreateUserRequest | UpdateUserRequest): void {
    this.isSubmitting.set(true);
    
    const action$ = this.isEditing()
      ? this.userService.updateUser(request as UpdateUserRequest)
      : this.userService.createUser(request as CreateUserRequest);
    
    action$.subscribe({
      next: () => {
        this.logger.info(this.isEditing() ? 'User updated' : 'User created');
        this.router.navigate(['/users']);
      },
      error: (err) => {
        this.logger.error('Failed to save user', err);
        this.isSubmitting.set(false);
      }
    });
  }
  
  onCancel(): void {
    this.router.navigate(['/users']);
  }
}
```

---

## Paso 6: Configurar Routing (5 min)

### 6.1 Feature Routes

Crea `src/app/features/users/users.routes.ts`:

```typescript
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

### 6.2 App Routes

Actualiza `src/app/app.routes.ts`:

```typescript
// Agregar en el array de children:
{
  path: 'users',
  loadChildren: () => 
    import('./features/users/users.routes').then(m => m.USERS_ROUTES)
}
```

---

## Verificación

### Checklist de completitud:

- [ ] La estructura de carpetas está creada
- [ ] Los modelos están definidos
- [ ] El servicio CRUD funciona correctamente
- [ ] Los dumb components son reutilizables
- [ ] Las 3 páginas funcionan correctamente
- [ ] El routing con parámetros funciona

### Comando de verificación:

```bash
# Iniciar el servidor de desarrollo
npm start

# Navegar a:
# - http://localhost:4200/users (lista)
# - http://localhost:4200/users/new (crear)
# - http://localhost:4200/users/1 (detalle)
# - http://localhost:4200/users/1/edit (editar)
```

---

## Retos Adicionales

### Reto 1: Paginación
Agregar paginación a la lista de usuarios.

### Reto 2: Confirmación de eliminación
Usar PrimeNG ConfirmDialog en lugar de confirm() nativo.

### Reto 3: Toast notifications
Mostrar notificaciones de éxito/error con PrimeNG Toast.

---

## Solución de Problemas

### Problema: El formulario no valida
**Solución:** Verifica que los Validators estén importados y aplicados correctamente.

### Problema: El routing no funciona con :id
**Solución:** Verifica el orden de las rutas (rutas específicas antes que parámetros).

### Problema: Los signals no actualizan la UI
**Solución:** Asegúrate de usar .set() o .update() para modificar signals.

---

*Lab 02 - Día 15 - Curso Angular 21 - UyuniAdmin Frontend*
