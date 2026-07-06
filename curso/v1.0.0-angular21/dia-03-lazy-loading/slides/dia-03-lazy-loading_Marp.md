# Presentación - Día 3: Lazy Loading y Rutas

---
<!-- _class: title -->
# Angular 21 Enterprise
## Día 3: Lazy Loading y Rutas

**Lazy Loading • Guards • Resolvers • Rutas Anidadas**

---

# Agenda del Día

1. **Introducción al Routing** (30 min)
2. **Lazy Loading** (60 min)
3. **Rutas Anidadas** (45 min)
4. **Route Guards** (60 min)
5. **Resolvers** (45 min)

---

<!-- _class: section -->
# 1. Introducción al Routing

---

# ¿Qué es el Router?

El Router de Angular permite:
- Navegación entre vistas
- Single Page Applications (SPA)
- URLs sincronizadas con la vista
- Parámetros y query strings

---

# Conceptos Básicos

| Concepto | Descripción |
|----------|-------------|
| **Routes** | Configuración de URLs |
| **RouterOutlet** | Placeholder del componente |
| **RouterLink** | Navegación declarativa |
| **Router** | Navegación imperativa |
| **ActivatedRoute** | Info de la ruta actual |

---

# Configuración Básica

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: '' }
];
```

---

# Uso en Templates

```html
<!-- Navegación -->
<nav>
  <a routerLink="/">Inicio</a>
  <a routerLink="/about">Acerca de</a>
</nav>

<!-- Placeholder -->
<router-outlet></router-outlet>

<!-- Link activo -->
<a routerLink="/" routerLinkActive="active">Inicio</a>
```

---

<!-- _class: section -->
# 2. Lazy Loading

---

# El Problema

```
Bundle Inicial: [████████████████████████████] 2MB

Tiempo de carga: ████████████ 5 segundos

Problema: El usuario espera mucho antes de ver la app
```

---

# ¿Qué es Lazy Loading?

Cargar código **solo cuando se necesita**

```
Bundle Inicial: [████████] 500KB

Tiempo de carga: ████ 1.5 segundos

Chunks cargados bajo demanda:
- dashboard.js (200KB)
- profile.js (150KB)
- settings.js (100KB)
```

---

# Beneficios

✅ **Bundle inicial pequeño**
✅ **Mejor UX** - Carga más rápida
✅ **Code splitting** - Código dividido
✅ **Caching** - Navegador cachea chunks
✅ **Escalabilidad** - Apps grandes manejables

---

# Implementación: loadChildren

```typescript
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

# Implementación: loadComponent

```typescript
export const routes: Routes = [
  {
    path: 'profile',
    loadComponent: () => 
      import('@features/profile/pages/overview/overview.component')
        .then(m => m.OverviewComponent)
  }
];
```

---

# Anatomía de un Chunk

```
Bundle Inicial (main.js)
├── Framework Angular
├── Componentes core
└── Routing configuration

Chunks Lazy Loaded
├── dashboard.js
├── profile.js
└── settings.js
```

---

# Preloading Strategies

| Estrategia | Descripción |
|------------|-------------|
| **NoPreloading** | Solo bajo demanda |
| **PreloadAllModules** | Precarga todos |
| **Custom** | Personalizado |

---

<!-- _class: section -->
# 3. Rutas Anidadas

---

# ¿Qué son Rutas Anidadas?

Componentes dentro de componentes, cada uno con su `<router-outlet>`

```
/dashboard          → DashboardLayoutComponent
/dashboard/overview → DashboardOverviewComponent
/dashboard/analytics→ DashboardAnalyticsComponent
```

---

# Implementación

```typescript
export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverviewComponent },
      { path: 'analytics', component: AnalyticsComponent }
    ]
  }
];
```

---

# Template del Padre

```html
<div class="flex">
  <nav class="w-64">
    <a routerLink="overview">Overview</a>
    <a routerLink="analytics">Analytics</a>
  </nav>
  
  <main class="flex-1">
    <router-outlet></router-outlet>
  </main>
</div>
```

---

# Parámetros de Ruta

```typescript
// Configuración
{ path: 'user/:id', component: UserDetailComponent }

// Navegación
<a [routerLink]="['/user', userId]">Ver usuario</a>

// Lectura
userId = this.route.paramMap.pipe(
  map(params => params.get('id'))
);
```

---

# Query Parameters

```typescript
// Navegación
this.router.navigate(['/search'], {
  queryParams: { q: 'angular', page: 1 }
});

// Lectura
searchQuery = this.route.queryParamMap.pipe(
  map(params => params.get('q'))
);
```

---

<!-- _class: section -->
# 4. Route Guards

---

# ¿Qué son los Guards?

Funciones que **controlan la navegación**

Deciden si un usuario puede acceder a una ruta

---

# Tipos de Guards

| Guard | Propósito |
|-------|-----------|
| **CanActivate** | ¿Puede acceder? |
| **CanActivateChild** | ¿Puede acceder a hijas? |
| **CanDeactivate** | ¿Puede salir? |
| **CanLoad** | ¿Puede cargar módulo? |
| **CanMatch** | ¿Coincide con ruta? |

---

# Functional Guards (Angular 14+)

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

# CanActivateFn

```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  
  return router.parseUrl(`/signin?redirect=${state.url}`);
};
```

---

# CanDeactivateFn

```typescript
export interface CanDeactivate {
  canDeactivate: () => boolean;
}

export const canDeactivateGuard: CanDeactivateFn<CanDeactivate> = (
  component
) => {
  return component.canDeactivate ? component.canDeactivate() : true;
};
```

---

# Uso en Rutas

```typescript
export const routes: Routes = [
  {
    path: 'admin',
    canActivate: [authGuard],
    loadChildren: () => import('./admin.routes').then(m => m.routes)
  }
];
```

---

# Retornos de Guards

| Retorno | Significado |
|---------|-------------|
| `true` | Permitir |
| `false` | Bloquear |
| `UrlTree` | Redirigir |
| `Observable` | Decisión asíncrona |

---

<!-- _class: section -->
# 5. Resolvers

---

# ¿Qué son los Resolvers?

Precargan datos **antes** de activar el componente

Evitan mostrar componentes vacíos

---

# Flujo sin Resolver

```
Navegar → Componente activo → HTTP request → Loading...
→ Datos recibidos → Vista actualizada

Problema: El usuario ve el componente vacío
```

---

# Flujo con Resolver

```
Navegar → Resolver ejecuta → HTTP request → Datos listos
→ Componente activo → Vista con datos

Beneficio: El usuario ve el componente con datos
```

---

# Functional Resolver

```typescript
export const userResolver: ResolveFn<User> = (route, state) => {
  const userService = inject(UserService);
  const id = route.paramMap.get('id');
  
  return userService.getUser(id!);
};
```

---

# Uso en Rutas

```typescript
export const routes: Routes = [
  {
    path: 'user/:id',
    component: UserDetailComponent,
    resolve: {
      user: userResolver
    }
  }
];
```

---

# Acceso a Datos

```typescript
@Component({...})
export class UserDetailComponent {
  // Snapshot
  user = this.route.snapshot.data['user'] as User;
  
  // Reactivo
  user$ = this.route.data.pipe(
    map(data => data['user'] as User)
  );
}
```

---

# Manejo de Errores

```typescript
export const userResolver: ResolveFn<User | null> = (route) => {
  return userService.getUser(id).pipe(
    catchError((error) => {
      console.error('Failed to load user', error);
      return of(null);
    })
  );
};
```

---

<!-- _class: section -->
# Ejemplos del Proyecto

---

# Estructura de Routing

```
src/app/
├── app.routes.ts
├── app.config.ts
└── features/
    ├── auth/auth.routes.ts
    ├── dashboard/dashboard.routes.ts
    └── profile/profile.routes.ts
```

---

# app.routes.ts

```typescript
export const routes: Routes = [
  // Público
  { path: 'signin', loadComponent: ... },
  
  // Protegido
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadChildren: ... },
      { path: 'profile', loadChildren: ... }
    ]
  },
  
  // Wildcard
  { path: '**', loadComponent: NotFoundComponent }
];
```

---

# auth.guard.ts

```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  
  return router.parseUrl(`/signin?redirect=${state.url}`);
};
```

---

<!-- _class: section -->
# Ejercicios Prácticos

---

# Ejercicio 1: Lazy Loading

Crear una feature de configuración con lazy loading:

```typescript
// settings.routes.ts
export const routes: Routes = [
  {
    path: '',
    component: SettingsLayoutComponent,
    children: [
      { path: 'general', component: GeneralSettingsComponent },
      { path: 'security', component: SecuritySettingsComponent }
    ]
  }
];
```

---

# Ejercicio 2: Guard de Admin

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

---

# Ejercicio 3: Resolver

```typescript
export const profileResolver: ResolveFn<User> = (route) => {
  const authService = inject(AuthService);
  return authService.refreshProfile();
};
```

---

<!-- _class: section -->
# Resumen

---

# Conceptos Clave

| Concepto | Aplicación |
|----------|------------|
| **Lazy Loading** | Reducir bundle inicial |
| **loadChildren** | Features completas |
| **loadComponent** | Páginas individuales |
| **Guards** | Proteger rutas |
| **Resolvers** | Precargar datos |

---

# Reglas de Oro

1. ✅ **Siempre usar lazy loading** para features
2. ✅ **Proteger rutas sensibles** con guards
3. ✅ **Usar resolvers** para datos críticos
4. ✅ **Manejar errores** en guards y resolvers
5. ✅ **Configurar redirect** para URLs protegidas

---

# Checklist

- [ ] Features con `loadChildren`
- [ ] Componentes con `loadComponent`
- [ ] Guards funcionales con `inject()`
- [ ] Resolvers para datos críticos
- [ ] Manejo de redirect en login
- [ ] Wildcard route configurada

---

# Próximo Día

## Día 4: Core Services

- LoggerService
- LoadingService
- ConfigService
- TokenRefreshService

---

<!-- _class: end -->
# ¿Preguntas?

## Recursos
- 📚 Contenido: `contenido.md`
- 💻 Ejercicios: `ejercicios/`
- ✅ Assessment: `assessment/`

**Curso: Angular 21 Enterprise**
**Día: 3 de 18**
