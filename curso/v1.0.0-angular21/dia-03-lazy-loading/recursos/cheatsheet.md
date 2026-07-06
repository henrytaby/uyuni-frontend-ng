# Cheatsheet - Día 3: Lazy Loading y Rutas

## Configuración Básica

### app.config.ts

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes)
  ]
};
```

### app.routes.ts

```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: '' }
];
```

---

## Lazy Loading

### loadChildren (módulos)

```typescript
{
  path: 'dashboard',
  loadChildren: () => import('./dashboard.routes').then(m => m.routes)
}
```

### loadComponent (componentes)

```typescript
{
  path: 'profile',
  loadComponent: () => import('./profile.component').then(m => m.ProfileComponent)
}
```

---

## Rutas Anidadas

### Configuración

```typescript
{
  path: 'settings',
  component: SettingsLayoutComponent,
  children: [
    { path: '', redirectTo: 'general', pathMatch: 'full' },
    { path: 'general', component: GeneralComponent },
    { path: 'security', component: SecurityComponent }
  ]
}
```

### Template Padre

```html
<nav>
  <a routerLink="general">General</a>
  <a routerLink="security">Security</a>
</nav>
<router-outlet></router-outlet>
```

---

## Parámetros de Ruta

### Definición

```typescript
{ path: 'user/:id', component: UserComponent }
```

### Navegación

```typescript
// Declarativa
<a [routerLink]="['/user', userId]">Ver usuario</a>

// Imperativa
this.router.navigate(['/user', userId]);
```

### Lectura

```typescript
// Observable
userId$ = this.route.paramMap.pipe(
  map(params => params.get('id'))
);

// Snapshot
userId = this.route.snapshot.paramMap.get('id');
```

---

## Query Parameters

### Navegación

```typescript
this.router.navigate(['/search'], {
  queryParams: { q: 'angular', page: 1 }
});
```

### Lectura

```typescript
// Observable
query$ = this.route.queryParamMap.pipe(
  map(params => params.get('q'))
);

// Snapshot
query = this.route.snapshot.queryParamMap.get('q');
```

---

## Route Guards

### CanActivateFn

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

### CanDeactivateFn

```typescript
export interface CanDeactivate {
  canDeactivate(): boolean;
}

export const canDeactivateGuard: CanDeactivateFn<CanDeactivate> = (
  component
) => {
  return component.canDeactivate ? component.canDeactivate() : true;
};
```

### Uso en Rutas

```typescript
{
  path: 'admin',
  canActivate: [authGuard],
  canDeactivate: [canDeactivateGuard],
  loadChildren: () => import('./admin.routes').then(m => m.routes)
}
```

---

## Resolvers

### Definición

```typescript
export const userResolver: ResolveFn<User> = (route, state) => {
  const userService = inject(UserService);
  const id = route.paramMap.get('id');
  
  return userService.getUser(id!);
};
```

### Uso en Rutas

```typescript
{
  path: 'user/:id',
  resolve: { user: userResolver },
  component: UserDetailComponent
}
```

### Acceso en Componente

```typescript
// Snapshot
user = this.route.snapshot.data['user'];

// Observable
user$ = this.route.data.pipe(
  map(data => data['user'])
);
```

---

## Navegación

### Declarativa

```html
<a routerLink="/dashboard">Dashboard</a>
<a [routerLink]="['/user', userId]">Usuario</a>
<a routerLink="/search" [queryParams]="{ q: 'angular' }">Buscar</a>
```

### Imperativa

```typescript
// Navegación simple
this.router.navigate(['/dashboard']);

// Con parámetros
this.router.navigate(['/user', userId]);

// Con query params
this.router.navigate(['/search'], {
  queryParams: { q: 'angular' }
});

// URL completa
this.router.navigateByUrl('/dashboard?tab=overview');
```

---

## Retornos de Guards

| Retorno | Resultado |
|---------|-----------|
| `true` | Permitir navegación |
| `false` | Bloquear navegación |
| `UrlTree` | Redirigir |
| `Observable<boolean \| UrlTree>` | Asíncrono |
| `Promise<boolean \| UrlTree>` | Asíncrono |

---

## Preloading Strategies

### Configuración

```typescript
import { PreloadAllModules } from '@angular/router';

provideRouter(routes, PreloadAllModules)
```

### Estrategias Disponibles

| Estrategia | Descripción |
|------------|-------------|
| `NoPreloading` | Solo bajo demanda (default) |
| `PreloadAllModules` | Precarga todos |
| `Custom` | Implementar `PreloadingStrategy` |

### Custom Strategy

```typescript
@Injectable({ providedIn: 'root' })
export class SelectivePreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    if (route.data?.['preload']) {
      return load();
    }
    return of(null);
  }
}
```

---

## Eventos del Router

```typescript
constructor(private router: Router) {
  this.router.events.subscribe(event => {
    if (event instanceof NavigationStart) {
      // Navegación iniciada
    }
    if (event instanceof NavigationEnd) {
      // Navegación completada
    }
    if (event instanceof NavigationError) {
      // Error en navegación
    }
  });
}
```

---

## Snippets

### Ruta con Todo

```typescript
{
  path: 'admin/users/:id',
  canActivate: [authGuard, adminGuard],
  canDeactivate: [canDeactivateGuard],
  resolve: {
    user: userResolver,
    roles: rolesResolver
  },
  data: {
    title: 'User Details',
    preload: true
  },
  loadChildren: () => import('./admin.routes').then(m => m.routes)
}
```

### Componente con CanDeactivate

```typescript
@Component({...})
export class EditorComponent implements CanComponentDeactivate {
  hasUnsavedChanges = signal(false);
  
  canDeactivate(): boolean {
    if (this.hasUnsavedChanges()) {
      return confirm('¿Perder los cambios?');
    }
    return true;
  }
}
```

---

## Errores Comunes

### Error: "Cannot find module"

```typescript
// ❌ Mal
loadChildren: './dashboard.module#DashboardModule'

// ✅ Bien
loadChildren: () => import('./dashboard.routes').then(m => m.routes)
```

### Error: Wildcard al inicio

```typescript
// ❌ Mal - captura todas las rutas
export const routes: Routes = [
  { path: '**', component: NotFoundComponent },
  { path: 'dashboard', component: DashboardComponent }
];

// ✅ Bien - wildcard al final
export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: '**', component: NotFoundComponent }
];
```

### Error: Guard no inyecta

```typescript
// ❌ Mal - constructor en functional guard
export const myGuard: CanActivateFn = () => {
  constructor(private auth: AuthService) {}  // Error!
  return true;
};

// ✅ Bien - usar inject()
export const myGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.isLoggedIn();
};
```

---

## Comandos CLI

```bash
# Generar componente con routing
ng g component features/users/pages/list --standalone

# Generar guard
ng g guard guards/auth --functional

# Generar resolver
ng g resolver resolvers/user --functional

# Build con análisis
npm run build -- --stats-json
npx webpack-bundle-analyzer dist/browser/stats.json
```

---

## Debugging

### Ver rutas activas

```typescript
// En componente
ngOnInit() {
  console.log('Route config:', this.route.routeConfig);
  console.log('Params:', this.route.snapshot.params);
  console.log('Data:', this.route.snapshot.data);
}
```

### Ver eventos de navegación

```typescript
// En app.component.ts
constructor(private router: Router) {
  this.router.events.subscribe(event => {
    console.log('Router event:', event);
  });
}
```

---

*Cheatsheet - Día 3: Lazy Loading y Rutas*
*Curso: Angular 21 Enterprise*
*Día: 3 de 18*
