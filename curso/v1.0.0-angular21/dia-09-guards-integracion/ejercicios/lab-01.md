# Lab 01: Implementar authGuard

## Objetivo

Implementar un Guard funcional de autenticación que proteja rutas de acceso no autorizado.

## Tiempo Estimado

45 minutos

## Prerrequisitos

- Haber completado el contenido teórico del Día 9
- Tener configurado el proyecto UyuniAdmin
- Conocer los conceptos de AuthService

---

## Ejercicio 1: Crear el Guard Básico

### Instrucciones

1. Crea el archivo `src/app/core/guards/auth.guard.ts`
2. Implementa un Guard funcional que verifique autenticación
3. Redirija a `/signin` si no está autenticado

### Código Inicial

```typescript
// src/app/core/guards/auth.guard.ts
// TODO: Implementar el guard

// 1. Importar las dependencias necesarias
// 2. Crear el guard funcional
// 3. Implementar la lógica de verificación
```

### Solución Esperada

```typescript
// src/app/core/guards/auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/signin']);
  return false;
};
```

### Validación

```bash
# Verificar que el archivo se creó correctamente
ls -la src/app/core/guards/

# Verificar sintaxis
npx tsc --noEmit src/app/core/guards/auth.guard.ts
```

---

## Ejercicio 2: Integrar el Guard en Rutas

### Instrucciones

1. Abre `src/app/app.routes.ts`
2. Importa el `authGuard`
3. Aplica el guard a las rutas protegidas

### Código Inicial

```typescript
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AppLayoutComponent } from '@shared/layout/app-layout/app-layout.component';
// TODO: Importar authGuard

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    // TODO: Agregar canActivate
    children: [
      // ... rutas hijas
    ]
  },
  // ... otras rutas
];
```

### Solución Esperada

```typescript
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AppLayoutComponent } from '@shared/layout/app-layout/app-layout.component';
import { authGuard } from '@core/guards/auth.guard'; // ← Importar

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard], // ← Aplicar guard
    children: [
      { path: '', loadChildren: () => import('@features/dashboard/dashboard.routes').then(m => m.routes) },
      { path: 'profile', loadChildren: () => import('@features/profile/profile.routes').then(m => m.routes) },
      { path: 'calendar', loadChildren: () => import('@features/calendar/calendar.routes').then(m => m.routes) },
      // ... más rutas
    ]
  },
  // Rutas públicas (sin guard)
  {
    path: '',
    loadChildren: () => import('@features/auth/auth.routes').then(m => m.routes)
  },
  { path: '**', loadComponent: () => import('@features/system/pages/not-found/not-found.component').then(m => m.NotFoundComponent) }
];
```

### Validación

```bash
# Iniciar la aplicación
npm start

# En el navegador:
# 1. Abrir http://localhost:4200
# 2. Sin autenticar, intentar acceder a /dashboard
# 3. Debería redirigir automáticamente a /signin
```

---

## Ejercicio 3: Mejorar con UrlTree

### Instrucciones

1. Modifica el guard para usar `UrlTree` en lugar de `navigate()` + `false`
2. Esta es la forma más idiomática en Angular

### Código Actual

```typescript
router.navigate(['/signin']);
return false;
```

### Solución Esperada

```typescript
// src/app/core/guards/auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Usar UrlTree en lugar de navigate() + false
  return router.parseUrl('/signin');
};
```

### Ventajas de UrlTree

1. **Más eficiente**: El router maneja la redirección directamente
2. **Más limpio**: Una sola línea en lugar de dos
3. **Más idiomático**: Patrón recomendado por Angular

---

## Ejercicio 4: Implementar Guard con Parámetros de Ruta

### Contexto

A veces necesitas acceder a los parámetros de la ruta dentro del guard.

### Instrucciones

1. Modifica el guard para recibir los parámetros de ruta
2. Agrega logging para ver la URL que se intenta acceder

### Código Base

```typescript
// El guard puede recibir parámetros
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  // route: información sobre la ruta activa
  // state: información sobre el estado del router
  
  // TODO: Agregar logging
};
```

### Solución Esperada

```typescript
// src/app/core/guards/auth.guard.ts
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';
import { LoggerService } from '@core/services/logger.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const logger = inject(LoggerService);

  logger.debug(`authGuard: Verificando acceso a ${state.url}`);

  if (authService.isAuthenticated()) {
    logger.debug('authGuard: Usuario autenticado, acceso permitido');
    return true;
  }

  logger.info(`authGuard: Acceso denegado a ${state.url}, redirigiendo a signin`);
  return router.parseUrl('/signin');
};
```

---

## Ejercicio 5: Guard con Redirección con Query Params

### Contexto

Es buena práctica guardar la URL a la que el usuario intentaba acceder para redirigirlo después del login.

### Instrucciones

1. Modifica el guard para incluir la URL original como query parameter
2. En el login, redirigir a la URL original después de autenticar

### Solución Esperada

```typescript
// src/app/core/guards/auth.guard.ts
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Guardar URL original para redirección post-login
  const returnUrl = state.url;
  return router.parseUrl(`/signin?returnUrl=${encodeURIComponent(returnUrl)}`);
};
```

### En el Componente de Login

```typescript
// src/app/features/auth/pages/sign-in/sign-in.component.ts
export class SignInComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  login(credentials: LoginCredentials): void {
    this.authService.login(credentials).subscribe({
      next: () => {
        // Obtener URL de retorno de query params
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigate([returnUrl]);
      },
      error: (error) => {
        // Manejar error
      }
    });
  }
}
```

---

## Ejercicio 6: Guard Asíncrono

### Contexto

A veces necesitas verificar autenticación de forma asíncrona (ej: verificar token con el servidor).

### Instrucciones

1. Modifica el guard para manejar verificación asíncrona
2. Retorna un Observable o Promise

### Código Base

```typescript
// Si AuthService tuviera un método asíncrono
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // TODO: Implementar verificación asíncrona
};
```

### Solución Esperada

```typescript
// src/app/core/guards/auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si isAuthenticated() retorna un Observable
  return authService.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      }
      return router.parseUrl('/signin');
    })
  );
};
```

---

## Validación Final

### Checklist

- [ ] El archivo `auth.guard.ts` existe en `src/app/core/guards/`
- [ ] El guard usa `CanActivateFn` como tipo
- [ ] El guard usa `inject()` para obtener dependencias
- [ ] El guard retorna `true` cuando está autenticado
- [ ] El guard redirige a `/signin` cuando no está autenticado
- [ ] El guard está aplicado en `app.routes.ts`
- [ ] Las rutas públicas NO tienen el guard

### Pruebas Manuales

1. **Sin autenticación**:
   - Navegar a `http://localhost:4200/dashboard`
   - Debe redirigir a `/signin`

2. **Con autenticación**:
   - Hacer login
   - Navegar a `/dashboard`
   - Debe cargar la página normalmente

3. **Rutas públicas**:
   - Navegar a `/signin`
   - Debe cargar sin problemas (sin bucle)

---

## Solución Completa

```typescript
// src/app/core/guards/auth.guard.ts
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';
import { LoggerService } from '@core/services/logger.service';

/**
 * Guard funcional que protege rutas de acceso no autorizado.
 * 
 * Verifica si el usuario está autenticado antes de permitir
 * el acceso a rutas protegidas.
 * 
 * @returns true si está autenticado, UrlTree de redirección si no
 * 
 * @example
 * // En app.routes.ts
 * {
 *   path: 'dashboard',
 *   canActivate: [authGuard],
 *   component: DashboardComponent
 * }
 */
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const logger = inject(LoggerService);

  logger.debug(`authGuard: Verificando acceso a ${state.url}`);

  if (authService.isAuthenticated()) {
    logger.debug('authGuard: Acceso permitido');
    return true;
  }

  logger.info(`authGuard: Acceso denegado a ${state.url}`);
  
  // Guardar URL original para redirección post-login
  const returnUrl = encodeURIComponent(state.url);
  return router.parseUrl(`/signin?returnUrl=${returnUrl}`);
};
```

---

## Siguiente Paso

Completa el [Lab 02](./lab-02.md) para aprender a escribir tests unitarios para el guard.

---

*Lab 01 - Guards y Protección de Rutas*
*Curso Angular 21 - UyuniAdmin Frontend*
