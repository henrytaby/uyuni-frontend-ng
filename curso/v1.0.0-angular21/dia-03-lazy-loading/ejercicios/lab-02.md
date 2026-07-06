# Lab 02: Guards y Resolvers

## Objetivo

Implementar guards para proteger rutas y resolvers para precargar datos.

## Duración

**60 minutos**

## Prerrequisitos

- Haber completado Lab 01
- Entender el concepto de guards y resolvers
- Tener el proyecto base configurado

---

## Escenario

Vamos a implementar:

1. **AdminGuard**: Proteger rutas de administración
2. **ProfileResolver**: Cargar perfil antes de mostrar la página
3. **CanDeactivateGuard**: Prevenir pérdida de datos en formularios

---

## Parte 1: Admin Guard (20 min)

### Paso 1: Crear el Guard

```typescript
// src/app/core/guards/admin.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';

/**
 * Guard que verifica si el usuario tiene rol de administrador.
 * 
 * @example
 * {
 *   path: 'admin',
 *   canActivate: [adminGuard],
 *   loadChildren: () => import('./admin.routes').then(m => m.routes)
 * }
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Verificar autenticación primero
  if (!authService.isAuthenticated()) {
    return router.parseUrl(`/signin?redirect=${encodeURIComponent(state.url)}`);
  }
  
  // Verificar rol de admin
  if (authService.hasRole('admin')) {
    return true;
  }
  
  // Usuario no tiene permisos
  console.warn('Access denied: User does not have admin role');
  return router.parseUrl('/forbidden');
};
```

### Paso 2: Crear Página Forbidden

```typescript
// src/app/features/system/pages/forbidden/forbidden.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="text-center">
        <h1 class="text-6xl font-bold text-red-500 mb-4">403</h1>
        <h2 class="text-2xl font-semibold mb-4">Acceso Denegado</h2>
        <p class="text-gray-600 mb-8">
          No tienes permisos para acceder a esta página.
        </p>
        <p-button 
          routerLink="/dashboard"
          label="Volver al Dashboard"
          icon="pi pi-home"
        />
      </div>
    </div>
  `
})
export class ForbiddenComponent {}
```

### Paso 3: Crear Feature Admin

```typescript
// src/app/features/admin/admin.routes.ts
import { Routes } from '@angular/router';
import { adminGuard } from '@core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [adminGuard],  // ← Protegido por adminGuard
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/dashboard/admin-dashboard.component')
          .then(m => m.AdminDashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./pages/users/users.component')
          .then(m => m.UsersComponent)
      }
    ]
  }
];
```

### Paso 4: Registrar en app.routes.ts

```typescript
// Agregar ruta admin
{
  path: 'admin',
  loadChildren: () => import('@features/admin/admin.routes')
    .then(m => m.routes)
}
```

---

## Parte 2: Profile Resolver (20 min)

### Paso 1: Crear el Resolver

```typescript
// src/app/features/profile/profile.resolver.ts
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '@core/auth/auth.service';
import { User } from '@features/auth/models/auth.models';

/**
 * Resolver que carga el perfil del usuario antes de activar la ruta.
 * 
 * @example
 * {
 *   path: 'profile',
 *   resolve: { profile: profileResolver },
 *   component: ProfileComponent
 * }
 */
export const profileResolver: ResolveFn<User | null> = (route, state) => {
  const authService = inject(AuthService);
  
  // Si ya hay un usuario en cache, usarlo
  const currentUser = authService.currentUser();
  if (currentUser) {
    return of(currentUser);
  }
  
  // Cargar perfil desde el servidor
  return authService.refreshProfile().pipe(
    catchError((error) => {
      console.error('Failed to load profile', error);
      // Retornar null en lugar de error para evitar bloquear la navegación
      return of(null);
    })
  );
};
```

### Paso 2: Usar en Rutas

```typescript
// src/app/features/profile/profile.routes.ts
import { Routes } from '@angular/router';
import { profileResolver } from './profile.resolver';

export const routes: Routes = [
  {
    path: '',
    resolve: {
      profile: profileResolver  // ← Resolver
    },
    loadComponent: () => import('./pages/overview/overview.component')
      .then(m => m.ProfileOverviewComponent)
  }
];
```

### Paso 3: Acceder a Datos en Componente

```typescript
// src/app/features/profile/pages/overview/overview.component.ts
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { User } from '@features/auth/models/auth.models';

@Component({
  selector: 'app-profile-overview',
  standalone: true,
  template: `
    @if (profile$ | async; as profile) {
      <div class="p-6">
        <h1 class="text-2xl font-bold mb-4">Mi Perfil</h1>
        
        <div class="bg-white rounded-lg shadow p-6">
          <img 
            [src]="profile.avatar" 
            class="w-24 h-24 rounded-full mb-4"
            alt="Avatar"
          />
          <h2 class="text-xl font-semibold">{{ profile.name }}</h2>
          <p class="text-gray-500">{{ profile.email }}</p>
        </div>
      </div>
    } @else {
      <div class="p-6">
        <p>Cargando perfil...</p>
      </div>
    }
  `
})
export class ProfileOverviewComponent {
  private readonly route = inject(ActivatedRoute);
  
  // Datos del resolver
  profile$: Observable<User | null> = this.route.data.pipe(
    map(data => data['profile'] as User | null)
  );
}
```

### Paso 4: Versión con Snapshot

```typescript
// Alternativa: usar snapshot para datos síncronos
@Component({...})
export class ProfileOverviewComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  
  // Datos del resolver (snapshot)
  profile: User | null = this.route.snapshot.data['profile'];
  
  ngOnInit(): void {
    // Si el resolver falló, redirigir
    if (!this.profile) {
      this.router.navigate(['/signin']);
    }
  }
}
```

---

## Parte 3: CanDeactivate Guard (20 min)

### Paso 1: Crear Interface

```typescript
// src/app/core/guards/can-deactivate.interface.ts
import { Observable } from 'rxjs';

/**
 * Interface que deben implementar los componentes que pueden ser desactivados.
 */
export interface CanComponentDeactivate {
  /**
   * Método que determina si el componente puede ser desactivado.
   * @returns true si puede salir, false si debe quedarse
   */
  canDeactivate(): boolean | Observable<boolean> | Promise<boolean>;
}
```

### Paso 2: Crear el Guard

```typescript
// src/app/core/guards/can-deactivate.guard.ts
import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { CanComponentDeactivate } from './can-deactivate.interface';

/**
 * Guard que previene la pérdida de datos no guardados.
 * 
 * @example
 * // En el componente
 * export class EditorComponent implements CanComponentDeactivate {
 *   hasUnsavedChanges = signal(false);
 *   
 *   canDeactivate(): boolean {
 *     return !this.hasUnsavedChanges();
 *   }
 * }
 * 
 * // En las rutas
 * {
 *   path: 'editor',
 *   canDeactivate: [canDeactivateGuard],
 *   component: EditorComponent
 * }
 */
export const canDeactivateGuard: CanDeactivateFn<CanComponentDeactivate> = (
  component,
  currentRoute,
  currentState,
  nextState
) => {
  // Si el componente no implementa la interface, permitir navegación
  if (!component || !component.canDeactivate) {
    return true;
  }
  
  // Llamar al método del componente
  return component.canDeactivate();
};
```

### Paso 3: Crear Componente con Formulario

```typescript
// src/app/features/editor/editor.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CanComponentDeactivate } from '@core/guards/can-deactivate.interface';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  template: `
    <div class="p-6 max-w-2xl">
      <h1 class="text-2xl font-bold mb-6">Editor de Artículos</h1>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">Título</label>
          <input 
            [(ngModel)]="title"
            (ngModelChange)="onContentChange()"
            class="w-full p-2 border rounded"
            placeholder="Título del artículo"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-2">Contenido</label>
          <textarea 
            [(ngModel)]="content"
            (ngModelChange)="onContentChange()"
            class="w-full p-2 border rounded h-64"
            placeholder="Escribe tu artículo aquí..."
          ></textarea>
        </div>
        
        <div class="flex gap-4">
          <p-button 
            label="Guardar"
            icon="pi pi-save"
            (onClick)="save()"
            [disabled]="!hasUnsavedChanges()"
          />
          <p-button 
            label="Cancelar"
            icon="pi pi-times"
            severity="secondary"
            (onClick)="cancel()"
            [disabled]="!hasUnsavedChanges()"
          />
        </div>
        
        @if (hasUnsavedChanges()) {
          <p class="text-sm text-orange-500">
            ⚠️ Tienes cambios sin guardar
          </p>
        }
      </div>
    </div>
  `
})
export class EditorComponent implements CanComponentDeactivate {
  title = '';
  content = '';
  
  hasUnsavedChanges = signal(false);
  
  onContentChange(): void {
    this.hasUnsavedChanges.set(true);
  }
  
  save(): void {
    // Simular guardado
    console.log('Saving:', { title: this.title, content: this.content });
    this.hasUnsavedChanges.set(false);
  }
  
  cancel(): void {
    this.title = '';
    this.content = '';
    this.hasUnsavedChanges.set(false);
  }
  
  // Implementación de CanComponentDeactivate
  canDeactivate(): boolean {
    if (this.hasUnsavedChanges()) {
      return confirm('¿Estás seguro de salir? Perderás los cambios no guardados.');
    }
    return true;
  }
}
```

### Paso 4: Registrar en Rutas

```typescript
// src/app/features/editor/editor.routes.ts
import { Routes } from '@angular/router';
import { canDeactivateGuard } from '@core/guards/can-deactivate.guard';

export const routes: Routes = [
  {
    path: '',
    canDeactivate: [canDeactivateGuard],  // ← Guard
    loadComponent: () => import('./editor.component')
      .then(m => m.EditorComponent)
  }
];
```

---

## Parte 4: Combinando Guards y Resolvers

### Ejemplo Completo

```typescript
// Ruta con múltiples guards y resolver
{
  path: 'admin/users/:id',
  canActivate: [authGuard, adminGuard],  // Múltiples guards
  canDeactivate: [canDeactivateGuard],
  resolve: {
    user: userResolver,
    roles: rolesResolver
  },
  loadComponent: () => import('./user-detail.component')
    .then(m => m.UserDetailComponent)
}
```

### Orden de Ejecución

```
1. CanActivate guards (en orden)
   ↓
2. Resolver
   ↓
3. Componente activado
   ↓
4. CanDeactivate guard (al salir)
```

---

## Ejercicio: Crear User Resolver

### Tu Tarea

Crear un resolver que cargue los datos de un usuario específico:

```typescript
// user.resolver.ts
export const userResolver: ResolveFn<User> = (route, state) => {
  // TODO: Implementar
  // 1. Obtener el ID del usuario de los parámetros
  // 2. Inyectar UserService
  // 3. Llamar a getUser(id)
  // 4. Manejar errores
};
```

<details>
<summary>Solución</summary>

```typescript
import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserService } from '@features/users/services/user.service';
import { User } from '@features/users/models/user.model';

export const userResolver: ResolveFn<User | null> = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const id = route.paramMap.get('id');
  
  if (!id) {
    console.error('User ID is required');
    router.navigate(['/users']);
    return of(null);
  }
  
  return userService.getUser(id).pipe(
    catchError((error) => {
      console.error('Failed to load user', error);
      router.navigate(['/users']);
      return of(null);
    })
  );
};
```

</details>

---

## Verificación

### Checklist

- [ ] AdminGuard funciona correctamente
- [ ] Página forbidden se muestra cuando no hay permisos
- [ ] ProfileResolver carga datos antes del componente
- [ ] CanDeactivate previene pérdida de datos
- [ ] Los guards se pueden combinar en una ruta

### Comandos de Prueba

```bash
# Probar admin guard
# 1. Login como usuario normal
# 2. Navegar a /admin
# 3. Debería redirigir a /forbidden

# Probar resolver
# 1. Navegar a /profile
# 2. Verificar que los datos están disponibles inmediatamente

# Probar canDeactivate
# 1. Navegar a /editor
# 2. Escribir algo
# 3. Intentar navegar a otra página
# 4. Debería mostrar confirmación
```

---

## Preguntas de Reflexión

1. **¿Qué pasa si un guard retorna `false`?**
   - La navegación se cancela y el usuario permanece en la ruta actual.

2. **¿Qué pasa si un resolver falla?**
   - La navegación continúa pero el dato resuelto será `null` (si manejamos el error).

3. **¿En qué orden se ejecutan múltiples guards?**
   - En el orden en que están declarados en el array `canActivate`.

---

## Recursos Adicionales

- [Angular Route Guards](https://angular.io/guide/router-tutorial-toh#canactivatechild-guarding-child-routes)
- [Angular Resolvers](https://angular.io/guide/router-tutorial-toh#resolve-prefetching-route-data)
- [Functional Guards](https://angular.io/guide/router-tutorial-toh#teachings)

---

*Lab 02 - Guards y Resolvers*
*Curso: Angular 21 Enterprise*
*Día: 3 de 18*
