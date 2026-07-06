# Lab 01: Smart vs Dumb Components

## Objetivo

Crear una feature completa con la separación correcta entre Smart y Dumb Components.

## Duración

**60 minutos**

## Prerrequisitos

- Haber completado el Día 1
- Tener configurado el proyecto con Path Aliases
- Conocer los conceptos de Smart/Dumb Components

---

## Escenario

Vamos a crear una feature de **Lista de Usuarios** que sigue la arquitectura del proyecto UyuniAdmin. La feature tendrá:

1. **Smart Component**: `UserListComponent` (página)
2. **Dumb Component**: `UserCardComponent` (tarjeta de usuario)
3. **Service**: `UserService` (simulado)
4. **Model**: `User` interface

---

## Paso 1: Crear Estructura de Carpetas (5 min)

### Instrucciones

Crea la siguiente estructura de carpetas:

```
src/app/features/users/
├── pages/
│   └── user-list/
│       ├── user-list.component.ts
│       └── user-list.component.html
├── components/
│   └── user-card/
│       ├── user-card.component.ts
│       └── user-card.component.html
├── services/
│   └── user.service.ts
├── models/
│   └── user.model.ts
└── users.routes.ts
```

### Comandos

```bash
# Crear carpetas
mkdir -p src/app/features/users/pages/user-list
mkdir -p src/app/features/users/components/user-card
mkdir -p src/app/features/users/services
mkdir -p src/app/features/users/models
```

---

## Paso 2: Crear Model (5 min)

### Archivo: `src/app/features/users/models/user.model.ts`

```typescript
// user.model.ts
export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: Date;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}
```

### Explicación

- `User`: Entidad principal del dominio
- `UserListResponse`: Respuesta paginada del servidor

---

## Paso 3: Crear Service (10 min)

### Archivo: `src/app/features/users/services/user.service.ts`

```typescript
// user.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { User, UserListResponse } from '@features/users/models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  
  // Datos simulados para el ejercicio
  private mockUsers: User[] = [
    {
      id: 1,
      name: 'Juan Pérez',
      email: 'juan@example.com',
      avatar: 'https://i.pravatar.cc/150?img=1',
      role: 'admin',
      createdAt: new Date('2024-01-15')
    },
    {
      id: 2,
      name: 'María García',
      email: 'maria@example.com',
      avatar: 'https://i.pravatar.cc/150?img=5',
      role: 'user',
      createdAt: new Date('2024-02-20')
    },
    {
      id: 3,
      name: 'Carlos López',
      email: 'carlos@example.com',
      avatar: 'https://i.pravatar.cc/150?img=3',
      role: 'user',
      createdAt: new Date('2024-03-10')
    },
    {
      id: 4,
      name: 'Ana Martínez',
      email: 'ana@example.com',
      avatar: 'https://i.pravatar.cc/150?img=9',
      role: 'guest',
      createdAt: new Date('2024-04-05')
    }
  ];
  
  /**
   * Obtiene la lista de usuarios
   * En producción, esto sería una llamada HTTP real
   */
  getUsers(): Observable<UserListResponse> {
    // Simulamos delay de red
    return of({
      users: this.mockUsers,
      total: this.mockUsers.length,
      page: 1,
      limit: 10
    }).pipe(
      delay(500) // Simular latencia
    );
  }
  
  /**
   * Elimina un usuario
   */
  deleteUser(id: number): Observable<void> {
    this.mockUsers = this.mockUsers.filter(u => u.id !== id);
    return of(void 0).pipe(delay(300));
  }
}
```

### Puntos Clave

- ✅ Usa `inject()` para HttpClient
- ✅ Simula datos para el ejercicio
- ✅ Retorna Observables
- ✅ Documentación JSDoc

---

## Paso 4: Crear Dumb Component (15 min)

### Archivo: `src/app/features/users/components/user-card/user-card.component.ts`

```typescript
// user-card.component.ts
import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { User } from '@features/users/models/user.model';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [ButtonModule, TagModule],
  templateUrl: './user-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserCardComponent {
  // === INPUTS (Datos del padre) ===
  
  /**
   * Usuario a mostrar
   */
  readonly user = input.required<User>();
  
  /**
   * Si está en modo carga
   */
  readonly isLoading = input<boolean>(false);
  
  // === OUTPUTS (Eventos hacia el padre) ===
  
  /**
   * Emitido cuando se hace click en editar
   */
  readonly editClick = output<number>();
  
  /**
   * Emitido cuando se hace click en eliminar
   */
  readonly deleteClick = output<number>();
  
  // === MÉTODOS ===
  
  onEdit(): void {
    this.editClick.emit(this.user().id);
  }
  
  onDelete(): void {
    this.deleteClick.emit(this.user().id);
  }
  
  // === HELPERS ===
  
  getRoleSeverity(): 'success' | 'info' | 'secondary' {
    const role = this.user().role;
    switch (role) {
      case 'admin': return 'success';
      case 'user': return 'info';
      default: return 'secondary';
    }
  }
  
  getRoleLabel(): string {
    const role = this.user().role;
    switch (role) {
      case 'admin': return 'Administrador';
      case 'user': return 'Usuario';
      default: return 'Invitado';
    }
  }
}
```

### Archivo: `src/app/features/users/components/user-card/user-card.component.html`

```html
<!-- user-card.component.html -->
<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center gap-4">
  <!-- Avatar -->
  <img 
    [src]="user().avatar" 
    [alt]="user().name"
    class="w-16 h-16 rounded-full object-cover"
  />
  
  <!-- Info -->
  <div class="flex-1">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
      {{ user().name }}
    </h3>
    <p class="text-sm text-gray-500 dark:text-gray-400">
      {{ user().email }}
    </p>
    <p-tag 
      [value]="getRoleLabel()" 
      [severity]="getRoleSeverity()"
      class="mt-1"
    />
  </div>
  
  <!-- Actions -->
  <div class="flex gap-2">
    <p-button 
      icon="pi pi-pencil"
      severity="secondary"
      [outlined]="true"
      (onClick)="onEdit()"
      [disabled]="isLoading()"
    />
    <p-button 
      icon="pi pi-trash"
      severity="danger"
      [outlined]="true"
      (onClick)="onDelete()"
      [disabled]="isLoading()"
    />
  </div>
</div>
```

### Puntos Clave del Dumb Component

- ✅ **OnPush**: Optimización de rendimiento
- ✅ **input()**: Recibe datos del padre
- ✅ **output()**: Emite eventos al padre
- ✅ **Sin servicios**: No inyecta nada
- ✅ **Solo presentación**: Sin lógica de negocio

---

## Paso 5: Crear Smart Component (15 min)

### Archivo: `src/app/features/users/pages/user-list/user-list.component.ts`

```typescript
// user-list.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { UserService } from '@features/users/services/user.service';
import { UserCardComponent } from '@features/users/components/user-card/user-card.component';
import { User } from '@features/users/models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ProgressSpinnerModule,
    UserCardComponent
  ],
  templateUrl: './user-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent {
  // === SERVICIOS ===
  private readonly userService = inject(UserService);
  
  // === ESTADO ===
  users = signal<User[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  deletingId = signal<number | null>(null);
  
  // === LIFECYCLE ===
  
  ngOnInit(): void {
    this.loadUsers();
  }
  
  // === MÉTODOS PÚBLICOS ===
  
  /**
   * Maneja el click en editar
   */
  onEditUser(userId: number): void {
    console.log('Editar usuario:', userId);
    // TODO: Navegar a página de edición
  }
  
  /**
   * Maneja el click en eliminar
   */
  onDeleteUser(userId: number): void {
    this.deletingId.set(userId);
    
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        // Actualizar lista (crear nuevo array para OnPush)
        this.users.update(users => users.filter(u => u.id !== userId));
        this.deletingId.set(null);
      },
      error: (err) => {
        this.error.set('Error al eliminar usuario');
        this.deletingId.set(null);
        console.error('Error:', err);
      }
    });
  }
  
  /**
   * Recarga la lista de usuarios
   */
  onRefresh(): void {
    this.loadUsers();
  }
  
  // === MÉTODOS PRIVADOS ===
  
  private loadUsers(): void {
    this.isLoading.set(true);
    this.error.set(null);
    
    this.userService.getUsers().subscribe({
      next: (response) => {
        this.users.set(response.users);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar usuarios');
        this.isLoading.set(false);
        console.error('Error:', err);
      }
    });
  }
}
```

### Archivo: `src/app/features/users/pages/user-list/user-list.component.html`

```html
<!-- user-list.component.html -->
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
    
    <div class="flex gap-2">
      <p-button 
        icon="pi pi-refresh"
        label="Actualizar"
        severity="secondary"
        [outlined]="true"
        (onClick)="onRefresh()"
        [loading]="isLoading()"
      />
      <p-button 
        icon="pi pi-plus"
        label="Nuevo Usuario"
        (onClick)="onRefresh()"
      />
    </div>
  </div>
  
  <!-- Loading -->
  @if (isLoading()) {
    <div class="flex justify-center items-center py-12">
      <p-progressSpinner />
    </div>
  }
  
  <!-- Error -->
  @if (error()) {
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error() }}
    </div>
  }
  
  <!-- User List -->
  @if (!isLoading() && !error()) {
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      @for (user of users(); track user.id) {
        <app-user-card
          [user]="user"
          [isLoading]="deletingId() === user.id"
          (editClick)="onEditUser($event)"
          (deleteClick)="onDeleteUser($event)"
        />
      } @empty {
        <div class="col-span-full text-center py-12 text-gray-500">
          No hay usuarios registrados
        </div>
      }
    </div>
  }
  
  <!-- Stats -->
  @if (!isLoading() && users().length > 0) {
    <div class="mt-6 text-sm text-gray-500">
      Total: {{ users().length }} usuarios
    </div>
  }
</div>
```

### Puntos Clave del Smart Component

- ✅ **Inyecta servicios**: UserService
- ✅ **Maneja estado**: signals para users, loading, error
- ✅ **Coordina Dumb Components**: UserCardComponent
- ✅ **OnPush**: Optimización
- ✅ **Patrones inmutables**: `update()` para arrays

---

## Paso 6: Crear Rutas (5 min)

### Archivo: `src/app/features/users/users.routes.ts`

```typescript
// users.routes.ts
import { Routes } from '@angular/router';
import { UserListComponent } from './pages/user-list/user-list.component';

export const routes: Routes = [
  {
    path: '',
    component: UserListComponent
  }
];
```

### Agregar a `app.routes.ts`

```typescript
// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  // ... otras rutas
  {
    path: 'users',
    loadChildren: () => import('@features/users/users.routes')
      .then(m => m.routes)
  }
];
```

---

## Paso 7: Verificar Funcionamiento (5 min)

### Checklist

- [ ] La ruta `/users` carga correctamente
- [ ] Se muestran los 4 usuarios de prueba
- [ ] El botón "Actualizar" recarga la lista
- [ ] El botón de eliminar remueve el usuario
- [ ] El loading state funciona correctamente
- [ ] No hay errores en consola

### Comando para probar

```bash
# Iniciar servidor
npm start

# Navegar a
http://localhost:4200/users
```

---

## Preguntas de Reflexión

1. **¿Por qué UserCardComponent es Dumb?**
   - No inyecta servicios
   - Solo recibe inputs y emite outputs
   - No tiene lógica de negocio

2. **¿Por qué UserListComponent es Smart?**
   - Inyecta UserService
   - Maneja estado de la aplicación
   - Coordina componentes hijos

3. **¿Qué pasa si mutamos el array en lugar de crear uno nuevo?**
   - OnPush no detectaría el cambio
   - La vista no se actualizaría

---

## Solución de Problemas

### Error: "Cannot find module '@features/users/...'"

**Solución**: Verificar que el alias esté configurado en `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@features/*": ["src/app/features/*"]
    }
  }
}
```

### Error: "No provider for HttpClient"

**Solución**: Importar `provideHttpClient()` en `app.config.ts`:
```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    // ...
  ]
};
```

### La vista no se actualiza

**Solución**: Verificar que estás usando patrones inmutables:
```typescript
// ❌ Mal
this.users().push(newUser);

// ✅ Bien
this.users.update(users => [...users, newUser]);
```

---

## Extensión Opcional

Si terminas antes, intenta:

1. **Agregar paginación** al UserListComponent
2. **Crear un UserDetailComponent** (Smart) para mostrar detalles
3. **Agregar filtros** por rol
4. **Implementar búsqueda** por nombre

---

## Entregables

Al finalizar este lab, debes tener:

1. ✅ `user.model.ts` con interfaces
2. ✅ `user.service.ts` con métodos simulados
3. ✅ `user-card.component.ts/html` (Dumb)
4. ✅ `user-list.component.ts/html` (Smart)
5. ✅ `users.routes.ts` configurado
6. ✅ Ruta agregada en `app.routes.ts`

---

*Lab 01 - Smart vs Dumb Components*
*Curso: Angular 21 Enterprise*
*Día: 2 de 18*
