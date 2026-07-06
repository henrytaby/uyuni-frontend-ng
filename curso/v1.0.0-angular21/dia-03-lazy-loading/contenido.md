# Contenido Teórico - Día 3: Lazy Loading y Rutas

## Índice

1. [Introducción al Routing](#1-introducción-al-routing)
2. [Lazy Loading](#2-lazy-loading)
3. [Rutas Anidadas](#3-rutas-anidadas)
4. [Route Guards](#4-route-guards)
5. [Resolvers](#5-resolvers)
6. [Ejemplos del Proyecto UyuniAdmin](#6-ejemplos-del-proyecto-uyuniadmin)
7. [Ejercicios Prácticos](#7-ejercicios-prácticos)
8. [Resumen y Puntos Clave](#8-resumen-y-puntos-clave)

---

## 1. Introducción al Routing

### 1.1 ¿Qué es el Router de Angular?

El Router de Angular es un servicio que permite la navegación de una vista a otra. Es el mecanismo para implementar **Single Page Applications (SPA)**, donde la aplicación no recarga la página completa, sino que actualiza solo la parte necesaria.

### 1.2 Conceptos Básicos

| Concepto | Descripción |
|----------|-------------|
| **Routes** | Configuración de URLs y componentes |
| **RouterOutlet** | Placeholder donde se renderiza el componente |
| **RouterLink** | Directiva para navegación declarativa |
| **Router** | Servicio para navegación imperativa |
| **ActivatedRoute** | Información sobre la ruta actual |

### 1.3 Configuración Básica

```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: '' }
];
```

### 1.4 Uso en Templates

```html
<!-- Navegación declarativa -->
<nav>
  <a routerLink="/">Inicio</a>
  <a routerLink="/about">Acerca de</a>
</nav>

<!-- Placeholder para el componente -->
<router-outlet></router-outlet>

<!-- Navegación activa -->
<a routerLink="/" routerLinkActive="active">Inicio</a>
```

### 1.5 Navegación Imperativa

```typescript
import { Router } from '@angular/router';
import { inject } from '@angular/core';

@Component({...})
export class MyComponent {
  private readonly router = inject(Router);
  
  goToAbout(): void {
    this.router.navigate(['/about']);
  }
  
  goToUser(id: string): void {
    this.router.navigate(['/users', id]);
  }
  
  goToWithQuery(): void {
    this.router.navigate(['/search'], {
      queryParams: { q: 'angular' }
    });
  }
}
```

---

## 2. Lazy Loading

### 2.1 ¿Qué es Lazy Loading?

**Lazy Loading** es una técnica que retrasa la carga de código hasta que se necesita. En lugar de cargar toda la aplicación al inicio, solo se carga el código esencial, y el resto se carga bajo demanda.

### 2.2 Beneficios

| Beneficio | Descripción |
|-----------|-------------|
| **Bundle inicial pequeño** | Reduce tiempo de carga inicial |
| **Mejor UX** | La aplicación carga más rápido |
| **Code splitting** | Divide el código en chunks |
| **Caching** | El navegador cachea los chunks |
| **Escalabilidad** | Aplicaciones grandes son manejables |

### 2.3 Eager Loading vs Lazy Loading

```
┌─────────────────────────────────────────────────────────────┐
│                    EAGER LOADING                            │
│                                                             │
│  Bundle Inicial: [████████████████████████████] 2MB        │
│                                                             │
│  Tiempo de carga: ████████████ 5 segundos                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    LAZY LOADING                             │
│                                                             │
│  Bundle Inicial: [████████] 500KB                          │
│                                                             │
│  Tiempo de carga: ████ 1.5 segundos                        │
│                                                             │
│  Chunks cargados bajo demanda:                             │
│  - dashboard.js (200KB)                                     │
│  - profile.js (150KB)                                       │
│  - settings.js (100KB)                                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2.4 Implementación

#### loadChildren (para módulos)

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('@features/dashboard/dashboard.routes')
      .then(m => m.routes)
  }
];
```

#### loadComponent (para componentes individuales)

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'profile',
    loadComponent: () => import('@features/profile/pages/overview/overview.component')
      .then(m => m.OverviewComponent)
  }
];
```

### 2.5 Anatomía de un Chunk

```
Bundle Inicial (main.js)
├── Framework Angular
├── Componentes core
├── Servicios globales
└── Routing configuration

Chunks Lazy Loaded
├── dashboard.js
│   ├── DashboardComponent
│   ├── DashboardService
│   └── Dashboard dependencies
│
├── profile.js
│   ├── ProfileComponent
│   └── Profile dependencies
│
└── settings.js
    ├── SettingsComponent
    └── Settings dependencies
```

### 2.6 Preloading Strategies

Angular ofrece estrategias de preloading:

```typescript
// app.config.ts
import { provideRouter, PreloadingStrategies } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, PreloadingStrategies.AllModules)
  ]
};
```

| Estrategia | Descripción |
|------------|-------------|
| **NoPreloading** | Solo carga bajo demanda (default) |
| **PreloadAllModules** | Precarga todos los módulos lazy |
| **Custom** | Estrategia personalizada |

### 2.7 Preloading Personalizado

```typescript
// selective-preloading.strategy.ts
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SelectivePreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // Solo precargar si la ruta tiene flag 'preload: true'
    if (route.data?.['preload']) {
      return load();
    }
    return of(null);
  }
}

// Uso en rutas
export const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard.routes').then(m => m.routes),
    data: { preload: true }  // ← Se precargará
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin.routes').then(m => m.routes)
    // No se precargará
  }
];
```

---

## 3. Rutas Anidadas

### 3.1 ¿Qué son las Rutas Anidadas?

Las rutas anidadas permiten tener componentes dentro de componentes, cada uno con su propio `<router-outlet>`. Esto es útil para layouts complejos.

### 3.2 Estructura de Rutas Anidadas

```
/                           → AppComponent
└── dashboard               → DashboardLayoutComponent
    └── overview            → DashboardOverviewComponent
    └── analytics           → DashboardAnalyticsComponent
    └── settings            → DashboardSettingsComponent
```

### 3.3 Implementación

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,  // Componente padre
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      },
      {
        path: 'overview',
        component: DashboardOverviewComponent
      },
      {
        path: 'analytics',
        component: DashboardAnalyticsComponent
      },
      {
        path: 'settings',
        component: DashboardSettingsComponent
      }
    ]
  }
];
```

### 3.4 Template del Componente Padre

```html
<!-- dashboard-layout.component.html -->
<div class="flex">
  <!-- Sidebar -->
  <nav class="w-64">
    <a routerLink="overview" routerLinkActive="active">Overview</a>
    <a routerLink="analytics" routerLinkActive="active">Analytics</a>
    <a routerLink="settings" routerLinkActive="active">Settings</a>
  </nav>
  
  <!-- Contenido hijo -->
  <main class="flex-1">
    <router-outlet></router-outlet>
  </main>
</div>
```

### 3.5 Parámetros de Ruta

#### Parámetros Requeridos

```typescript
// Configuración
{ path: 'user/:id', component: UserDetailComponent }

// Navegación
<a [routerLink]="['/user', userId]">Ver usuario</a>

// Lectura en componente
@Component({...})
export class UserDetailComponent {
  private readonly route = inject(ActivatedRoute);
  
  userId = this.route.paramMap.pipe(
    map(params => params.get('id'))
  );
}
```

#### Query Parameters

```typescript
// Navegación con query params
this.router.navigate(['/search'], {
  queryParams: { q: 'angular', page: 1 }
});

// Lectura en componente
searchQuery = this.route.queryParamMap.pipe(
  map(params => params.get('q'))
);
```

#### Fragment

```typescript
// Navegación con fragment
this.router.navigate(['/page'], {
  fragment: 'section-1'
});

// Lectura en componente
fragment = this.route.fragment;
```

### 3.6 ActivatedRouteSnapshot vs ActivatedRoute

| Aspecto | ActivatedRoute | ActivatedRouteSnapshot |
|---------|----------------|------------------------|
| **Tipo** | Observable | Snapshot |
| **Actualización** | Se actualiza en cada navegación | Valor inicial |
| **Uso** | Reactivo, suscribirse | Valor único, síncrono |

```typescript
// Observable (reactivo)
userId$ = this.route.paramMap.pipe(
  map(params => params.get('id'))
);

// Snapshot (síncrono)
userId = this.route.snapshot.paramMap.get('id');
```

---

## 4. Route Guards

### 4.1 ¿Qué son los Guards?

Los Guards son funciones que controlan la navegación. Deciden si un usuario puede acceder a una ruta o no.

### 4.2 Tipos de Guards

| Guard | Propósito |
|-------|-----------|
| **CanActivate** | ¿Puede el usuario acceder a la ruta? |
| **CanActivateChild** | ¿Puede acceder a rutas hijas? |
| **CanDeactivate** | ¿Puede salir de la ruta? |
| **CanLoad** | ¿Puede cargar el módulo lazy? |
| **CanMatch** | ¿Coincide con la ruta? |

### 4.3 Functional Guards (Angular 14+)

Angular 14 introdujo guards funcionales, más simples que los guards basados en clases.

#### CanActivateFn

```typescript
// auth.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  
  // Redirigir a login con la URL original
  return router.parseUrl(`/signin?redirect=${state.url}`);
};
```

#### CanActivateChildFn

```typescript
export const authChildGuard: CanActivateChildFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  
  return router.parseUrl('/signin');
};
```

#### CanDeactivateFn

```typescript
import { CanDeactivateFn } from '@angular/router';

export interface CanComponentDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

export const canDeactivateGuard: CanDeactivateFn<CanComponentDeactivate> = (
  component,
  currentRoute,
  currentState,
  nextState
) => {
  return component.canDeactivate ? component.canDeactivate() : true;
};
```

#### CanMatchFn

```typescript
import { CanMatchFn } from '@angular/router';

export const adminGuard: CanMatchFn = (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.hasRole('admin')) {
    return true;
  }
  
  return router.parseUrl('/forbidden');
};
```

### 4.4 Uso en Rutas

```typescript
export const routes: Routes = [
  {
    path: 'admin',
    canActivate: [authGuard],
    canMatch: [adminGuard],
    loadChildren: () => import('./admin.routes').then(m => m.routes)
  },
  {
    path: 'editor',
    canDeactivate: [canDeactivateGuard],
    loadComponent: () => import('./editor.component').then(m => m.EditorComponent)
  }
];
```

### 4.5 Múltiples Guards

```typescript
{
  path: 'admin',
  canActivate: [authGuard, adminGuard],  // Todos deben retornar true
  children: [
    // ...
  ]
}
```

### 4.6 Retornos de Guards

| Retorno | Significado |
|---------|-------------|
| `true` | Permitir navegación |
| `false` | Bloquear navegación |
| `UrlTree` | Redirigir a otra ruta |
| `Observable<boolean \| UrlTree>` | Decisión asíncrona |
| `Promise<boolean \| UrlTree>` | Decisión asíncrona |

---

## 5. Resolvers

### 5.1 ¿Qué son los Resolvers?

Los Resolvers precargan datos antes de que el componente se active. Evitan mostrar componentes vacíos mientras se cargan datos.

### 5.2 Flujo con y sin Resolver

```
SIN RESOLVER:
┌─────────────────────────────────────────────────────────────┐
│  Navegar → Componente activo → HTTP request → Loading...   │
│  → Datos recibidos → Vista actualizada                      │
│                                                             │
│  Problema: El usuario ve el componente vacío brevemente     │
└─────────────────────────────────────────────────────────────┘

CON RESOLVER:
┌─────────────────────────────────────────────────────────────┐
│  Navegar → Resolver ejecuta → HTTP request → Datos listos   │
│  → Componente activo → Vista con datos                      │
│                                                             │
│  Beneficio: El usuario ve el componente con datos           │
└─────────────────────────────────────────────────────────────┘
```

### 5.3 Functional Resolver

```typescript
// user.resolver.ts
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { UserService } from './user.service';
import { User } from './user.model';

export const userResolver: ResolveFn<User> = (route, state) => {
  const userService = inject(UserService);
  const id = route.paramMap.get('id');
  
  if (!id) {
    // Retornar error o redirigir
    return throwError(() => new Error('User ID is required'));
  }
  
  return userService.getUser(id);
};
```

### 5.4 Uso en Rutas

```typescript
export const routes: Routes = [
  {
    path: 'user/:id',
    loadComponent: () => import('./user-detail.component').then(m => m.UserDetailComponent),
    resolve: {
      user: userResolver
    }
  }
];
```

### 5.5 Acceso a Datos Resueltos

```typescript
@Component({...})
export class UserDetailComponent {
  private readonly route = inject(ActivatedRoute);
  
  // Datos del resolver (snapshot)
  user = this.route.snapshot.data['user'] as User;
  
  // Datos del resolver (reactivo)
  user$ = this.route.data.pipe(
    map(data => data['user'] as User)
  );
}
```

### 5.6 Manejo de Errores

```typescript
export const userResolver: ResolveFn<User | null> = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const id = route.paramMap.get('id');
  
  return userService.getUser(id!).pipe(
    catchError((error) => {
      console.error('Failed to load user', error);
      // Retornar null y manejar en componente
      return of(null);
    })
  );
};

// En el componente
@Component({...})
export class UserDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  
  ngOnInit(): void {
    const user = this.route.snapshot.data['user'];
    if (!user) {
      this.router.navigate(['/users']);
    }
  }
}
```

### 5.7 Múltiples Resolvers

```typescript
{
  path: 'user/:id',
  component: UserDetailComponent,
  resolve: {
    user: userResolver,
    posts: userPostsResolver,
    comments: userCommentsResolver
  }
}

// Acceso
this.route.snapshot.data['user'];
this.route.snapshot.data['posts'];
this.route.snapshot.data['comments'];
```

---

## 6. Ejemplos del Proyecto UyuniAdmin

### 6.1 Estructura de Routing

```
src/app/
├── app.routes.ts              # Rutas principales
├── app.config.ts              # Configuración del router
│
└── features/
    ├── auth/
    │   └── auth.routes.ts
    ├── dashboard/
    │   └── dashboard.routes.ts
    ├── profile/
    │   └── profile.routes.ts
    └── ...
```

### 6.2 app.routes.ts

```typescript
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { AppLayoutComponent } from '@shared/layout/app-layout/app-layout.component';

export const routes: Routes = [
  // === RUTAS PÚBLICAS ===
  {
    path: 'signin',
    loadComponent: () => import('@features/auth/pages/sign-in/sign-in.component')
      .then(m => m.SignInComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('@features/auth/pages/sign-up/sign-up.component')
      .then(m => m.SignUpComponent)
  },
  
  // === RUTAS PROTEGIDAS ===
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('@features/dashboard/dashboard.routes')
          .then(m => m.routes)
      },
      {
        path: 'calendar',
        loadChildren: () => import('@features/calendar/calendar.routes')
          .then(m => m.routes)
      },
      {
        path: 'profile',
        loadChildren: () => import('@features/profile/profile.routes')
          .then(m => m.routes)
      },
      {
        path: 'settings',
        loadChildren: () => import('@features/settings/settings.routes')
          .then(m => m.routes)
      }
    ]
  },
  
  // === RUTAS DE SISTEMA ===
  {
    path: 'blank',
    loadComponent: () => import('@features/system/pages/blank/blank.component')
      .then(m => m.BlankComponent)
  },
  
  // === WILDCARD ===
  {
    path: '**',
    loadComponent: () => import('@features/system/pages/not-found/not-found.component')
      .then(m => m.NotFoundComponent)
  }
];
```

### 6.3 auth.guard.ts

```typescript
// src/app/core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Verificar si el usuario está autenticado
  if (authService.isAuthenticated()) {
    return true;
  }
  
  // Redirigir a login con la URL original
  return router.parseUrl(`/signin?redirect=${encodeURIComponent(state.url)}`);
};
```

### 6.4 Feature Routes

```typescript
// src/app/features/dashboard/dashboard.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/overview/overview.component')
      .then(m => m.OverviewComponent)
  },
  {
    path: 'analytics',
    loadComponent: () => import('./pages/analytics/analytics.component')
      .then(m => m.AnalyticsComponent)
  }
];
```

### 6.5 Manejo de Redirect

```typescript
// En SignInComponent
@Component({...})
export class SignInComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  
  onLoginSuccess(): void {
    // Obtener URL de redirect
    const redirect = this.route.snapshot.queryParamMap.get('redirect') || '/dashboard';
    
    // Navegar a la URL original
    this.router.navigateByUrl(redirect);
  }
}
```

---

## 7. Ejercicios Prácticos

### 7.1 Ejercicio 1: Crear Feature con Lazy Loading

Crear una feature de configuración con lazy loading:

```typescript
// settings.routes.ts
export const routes: Routes = [
  {
    path: '',
    component: SettingsLayoutComponent,
    children: [
      { path: '', redirectTo: 'general', pathMatch: 'full' },
      { path: 'general', component: GeneralSettingsComponent },
      { path: 'security', component: SecuritySettingsComponent },
      { path: 'notifications', component: NotificationSettingsComponent }
    ]
  }
];
```

### 7.2 Ejercicio 2: Crear Guard de Admin

Crear un guard que verifique si el usuario tiene rol de admin:

```typescript
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.hasRole('admin')) {
    return true;
  }
  
  return router.parseUrl('/forbidden');
};
```

### 7.3 Ejercicio 3: Crear Resolver

Crear un resolver para cargar un usuario antes de mostrar su perfil:

```typescript
export const profileResolver: ResolveFn<User> = (route, state) => {
  const authService = inject(AuthService);
  
  return authService.refreshProfile().pipe(
    catchError(() => {
      return of(null);
    })
  );
};
```

---

## 8. Resumen y Puntos Clave

### 8.1 Conceptos Principales

| Concepto | Definición | Aplicación |
|----------|------------|------------|
| **Lazy Loading** | Cargar código bajo demanda | Reducir bundle inicial |
| **loadChildren** | Cargar módulo lazy | Features completas |
| **loadComponent** | Cargar componente lazy | Páginas individuales |
| **Guards** | Controlar navegación | Proteger rutas |
| **Resolvers** | Precargar datos | Evitar estados vacíos |

### 8.2 Reglas de Oro

1. **Siempre usar lazy loading** para features
2. **Proteger rutas sensibles** con guards
3. **Usar resolvers** para datos críticos
4. **Manejar errores** en guards y resolvers
5. **Configurar redirect** para URLs protegidas

### 8.3 Checklist de Implementación

- [ ] Features con `loadChildren`
- [ ] Componentes individuales con `loadComponent`
- [ ] Guards funcionales con `inject()`
- [ ] Resolvers para datos críticos
- [ ] Manejo de redirect en login
- [ ] Wildcard route configurada

### 8.4 Próximos Pasos

En el **Día 4** aprenderemos:
- Core Services en detalle
- LoggerService
- LoadingService
- ConfigService

---

## Referencias

- [Angular Router Guide](https://angular.io/guide/router)
- [Lazy Loading](https://angular.io/guide/lazy-loading-ngmodules)
- [Route Guards](https://angular.io/guide/router-tutorial-toh#canactivatechild-guarding-child-routes)
- [Resolvers](https://angular.io/guide/router-tutorial-toh#resolve-prefetching-route-data)

---

*Curso: Angular 21 Enterprise*
*Día: 3 de 18*
*Próximo: Día 4 - Core Services*
