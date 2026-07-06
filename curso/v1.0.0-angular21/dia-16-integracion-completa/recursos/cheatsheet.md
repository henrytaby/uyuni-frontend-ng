# Cheatsheet: Día 16 - Integración Completa

## Arquitectura de Capas

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  • Smart Components (Pages)                                  │
│  • Dumb Components (UI)                                      │
│  • Layouts                                                   │
├─────────────────────────────────────────────────────────────┤
│                    BUSINESS LAYER                            │
│  • Feature Services                                          │
│  • Core Services                                             │
│  • State Management (Signals)                                │
├─────────────────────────────────────────────────────────────┤
│                 INFRASTRUCTURE LAYER                         │
│  • HTTP Interceptors                                         │
│  • Error Handlers                                            │
│  • Route Guards                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Flujo de Datos

```
User Action → Component → Service → HTTP → Interceptor → API
     ↑                                                      │
     │                                                      ▼
     └──────────────── Signal Update ←───────────────── Response
```

---

## AuthService en Features

```typescript
// Acceder al usuario desde cualquier componente
export class DashboardComponent {
  private authService = inject(AuthService);
  
  // Signals públicos (readonly)
  user = this.authService.currentUser;
  roles = this.authService.roles;
  activeRole = this.authService.activeRole;
  isAuthenticated = this.authService.isAuthenticated;
  
  // Uso en template
  // {{ user()?.name }}
  // {{ activeRole()?.name }}
}
```

---

## Layout Structure

```typescript
// AppLayoutComponent
<div class="flex h-screen">
  <!-- Sidebar -->
  <app-sidebar 
    [collapsed]="sidebarCollapsed()"
    (collapsedChange)="sidebarCollapsed.set($event)" />
  
  <!-- Main Content -->
  <div class="flex-1 flex flex-col">
    <!-- Header -->
    <app-header (menuToggle)="sidebarCollapsed.set(!sidebarCollapsed())" />
    
    <!-- Router Outlet -->
    <main class="flex-1 overflow-auto">
      <router-outlet />
    </main>
  </div>
</div>
```

---

## Sidebar Dinámico

```typescript
// Filtrar items por rol
private allMenuItems = signal<MenuItem[]>([
  { path: '/dashboard', label: 'Dashboard', roles: ['admin', 'user'] },
  { path: '/users', label: 'Usuarios', roles: ['admin'] },
  { path: '/profile', label: 'Perfil', roles: ['admin', 'user'] }
]);

visibleMenuItems = computed(() => {
  const currentRole = this.authService.activeRole()?.name || 'user';
  return this.allMenuItems().filter(item => 
    item.roles.includes(currentRole)
  );
});
```

---

## Header con User Dropdown

```typescript
// User dropdown en header
<div class="relative" #userDropdown>
  <button (click)="showDropdown.set(!showDropdown())">
    <img [src]="user()?.avatar" class="w-8 h-8 rounded-full">
    <span>{{ user()?.name }}</span>
  </button>
  
  @if (showDropdown()) {
    <div class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow">
      <!-- Role Switcher -->
      @for (role of roles(); track role.id) {
        <button (click)="onRoleChange(role)">
          {{ role.name }}
        </button>
      }
      
      <!-- Logout -->
      <button (click)="onLogout()">
        Cerrar Sesión
      </button>
    </div>
  }
</div>
```

---

## Logout Implementation

```typescript
onLogout(): void {
  this.logger.info('User logged out');
  this.authService.logout();  // Limpia token y estado
  this.router.navigate(['/signin']);  // Navega a login
}
```

---

## Routing Configuration

```typescript
// app.routes.ts
export const routes: Routes = [
  // Rutas públicas (sin guard)
  {
    path: 'signin',
    loadComponent: () => import('./auth/pages/sign-in/...')
  },
  
  // Rutas protegidas (con layout)
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./shared/layout/...'),
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: () => import('./features/dashboard/...') },
      { path: 'users', loadChildren: () => import('./features/users/...') },
      { path: 'profile', loadChildren: () => import('./features/profile/...') }
    ]
  },
  
  // 404
  { path: '**', loadComponent: () => import('./features/system/...') }
];
```

---

## Loading Global

```typescript
// En AppComponent o AppLayoutComponent
@if (loadingService.isLoading()) {
  <div class="absolute inset-0 bg-white/50 flex items-center justify-center z-50">
    <i class="pi pi-spinner pi-spin text-4xl text-blue-500"></i>
  </div>
}
```

---

## Interceptor Headers

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.accessToken();
  const activeRole = authService.activeRole();
  
  let authReq = req;
  
  if (token) {
    authReq = authReq.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'X-Active-Role': activeRole()?.id || ''
      }
    });
  }
  
  return next(authReq);
};
```

---

## Patrones Comunes

### Mostrar Usuario

```typescript
// ✅ Correcto
user = this.authService.currentUser;

// Template
{{ user()?.name }}
@if (user()) {
  <img [src]="user()!.avatar">
}
```

### Cambiar Rol

```typescript
onRoleChange(role: Role): void {
  this.authService.setActiveRole(role);
  // UI se actualiza automáticamente por signals
}
```

### Verificar Rol

```typescript
isAdmin = computed(() => 
  this.activeRole()?.name === 'admin'
);

// Template
@if (isAdmin()) {
  <app-admin-metrics />
}
```

---

## Errores Comunes

### 1. Olvidar Subscribe

```typescript
// ❌ Mal
this.userService.getUsers();

// ✅ Bien
this.userService.getUsers().subscribe({
  next: (users) => this.users.set(users),
  error: (err) => this.handleError(err)
});
```

### 2. Layout en Rutas Auth

```typescript
// ❌ Mal
{ path: 'signin', component: AppLayoutComponent }

// ✅ Bien
{ path: 'signin', loadComponent: () => import('./auth/...') }
```

### 3. No Manejar Null

```typescript
// ❌ Mal
{{ user().name }}  // Error si user es null

// ✅ Bien
{{ user()?.name }}  // Safe navigation
```

---

## Checklist de Integración

- [ ] AuthService funciona globalmente
- [ ] Layout muestra usuario
- [ ] Sidebar filtra por rol
- [ ] Header tiene dropdown
- [ ] Logout funciona
- [ ] Loading global visible
- [ ] Rutas protegidas
- [ ] Interceptors añaden headers

---

## Comandos Útiles

```bash
# Build de producción
npm run build

# Verificar rutas
npm start
# Navegar a cada ruta

# Testing
npm test

# Linting
npm run lint
```

---

*Cheatsheet - Día 16 - Curso Angular 21 - UyuniAdmin Frontend*
