# Contenido: Día 16 - Integración Completa

## Información General

| Atributo | Valor |
|----------|-------|
| **Módulo** | 6 - Features y Componentes |
| **Duración** | 4 horas |
| **Formato** | Teoría + Práctica |

---

## 1. Arquitectura de Integración (45 min)

### 1.1 Hook: El Puzzle Completo

**Pregunta inicial:** "¿Cómo conectamos todo lo que hemos aprendido?"

Hasta ahora hemos construido piezas individuales:
- Core Services (Logger, Loading, Config, Auth)
- Interceptors y Guards
- Features (Dashboard, Users, Auth)
- UI Components (PrimeNG, Tailwind)

El desafío hoy es: **¿Cómo hacemos que todo funcione junto?**

### 1.2 Contexto: Visión General

```
┌─────────────────────────────────────────────────────────────────┐
│                        APLICACIÓN COMPLETA                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    APP COMPONENT                         │   │
│   │  • Router Outlet                                         │   │
│   │  • Global Loading Spinner                                │   │
│   │  • Toast Messages                                        │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│              ┌───────────────┴───────────────┐                   │
│              ▼                               ▼                   │
│   ┌─────────────────────┐      ┌─────────────────────┐          │
│   │   AUTH LAYOUT       │      │    APP LAYOUT       │          │
│   │   (Sin sidebar)     │      │  (Con sidebar)      │          │
│   │                     │      │                     │          │
│   │   • SignIn          │      │  • Header           │          │
│   │   • SignUp          │      │  • Sidebar          │          │
│   │                     │      │  • Router Outlet    │          │
│   └─────────────────────┘      └─────────────────────┘          │
│                                        │                          │
│                    ┌───────────────────┼───────────────────┐    │
│                    ▼                   ▼                   ▼    │
│              ┌──────────┐      ┌──────────┐      ┌──────────┐  │
│              │Dashboard │      │  Users   │      │ Profile  │  │
│              │ Feature  │      │ Feature  │      │ Feature  │  │
│              └──────────┘      └──────────┘      └──────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 Explicación: Flujo de Datos

El flujo de datos en la aplicación sigue este patrón:

```
User Action → Component → Service → HTTP → Interceptor → API
     ↑                                                      │
     │                                                      ▼
     └──────────────── Signal Update ←───────────────── Response
```

**Capas de la arquitectura:**

1. **Presentation Layer** (Components)
   - Smart Components (Pages)
   - Dumb Components (UI)
   - Layouts

2. **Business Layer** (Services)
   - Feature Services
   - Core Services
   - State Management

3. **Infrastructure Layer** (HTTP)
   - Interceptors
   - Error Handlers
   - Guards

### 1.4 Demo: Diagrama de Dependencias

```typescript
// Flujo de dependencias
AuthService
    ├── TokenRefreshService
    ├── LoggerService
    └── ConfigService

authInterceptor
    ├── AuthService
    ├── TokenRefreshService
    ├── AuthErrorHandlerService
    └── LoggerService

DashboardFeature
    ├── DashboardService
    ├── AuthService (para usuario)
    ├── LoggerService
    └── LoadingService (implícito)
```

### 1.5 Error Común: Dependencias Circulares

```typescript
// ❌ MAL: Dependencia circular
ServiceA → ServiceB → ServiceA

// ✅ BIEN: Usar un servicio intermedio
ServiceA → SharedService ← ServiceB
```

### 1.6 Mini Reto: Dibujar Arquitectura

**Ejercicio:** Dibuja la arquitectura de tu feature favorito mostrando:
- Componentes
- Servicios
- Dependencias
- Flujo de datos

### 1.7 Cierre

La arquitectura de integración conecta todas las piezas. El siguiente paso es conectar la autenticación con los features.

---

## 2. Autenticación + Features (60 min)

### 2.1 Hook: El Usuario en Todo Lugar

**Pregunta:** "¿Cómo accedo al usuario logueado desde cualquier feature?"

La respuesta: **AuthService como singleton global**

### 2.2 Contexto: AuthService en Features

```typescript
// En cualquier componente
export class DashboardComponent {
  private authService = inject(AuthService);
  
  // Acceder al usuario
  user = this.authService.currentUser;
  roles = this.authService.roles;
  activeRole = this.authService.activeRole;
}
```

### 2.3 Explicación: Uso del AuthService

El `AuthService` expone signals que pueden ser consumidos desde cualquier componente:

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  // Signals públicos (readonly)
  readonly currentUser = this._currentUser.asReadonly();
  readonly roles = this._roles.asReadonly();
  readonly activeRole = this._activeRole.asReadonly();
  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  
  // Métodos
  setActiveRole(role: Role): void { ... }
  refreshProfile(): Observable<void> { ... }
  logout(): void { ... }
}
```

### 2.4 Demo: Dashboard con Usuario

```typescript
@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  template: `
    <div class="p-6">
      <!-- Bienvenida personalizada -->
      <h1 class="text-2xl font-bold">
        Bienvenido, {{ user()?.name }}
      </h1>
      
      <!-- Rol activo -->
      <p class="text-gray-500">
        Rol: {{ activeRole()?.name }}
      </p>
      
      <!-- Métricas según rol -->
      @if (hasAdminRole()) {
        <app-admin-metrics />
      } @else {
        <app-user-metrics />
      }
    </div>
  `
})
export class DashboardOverviewComponent {
  private authService = inject(AuthService);
  
  user = this.authService.currentUser;
  activeRole = this.authService.activeRole;
  
  hasAdminRole(): boolean {
    return this.activeRole()?.name === 'admin';
  }
}
```

### 2.5 Error Común: Modificar Usuario Directamente

```typescript
// ❌ MAL: Intentar modificar el signal
this.authService.currentUser().name = 'Nuevo Nombre';

// ✅ BIEN: Usar el método del servicio
this.authService.refreshProfile().subscribe();
```

### 2.6 Mini Reto: Mostrar Avatar

**Ejercicio:** Muestra el avatar del usuario en el header del dashboard.

```typescript
// Solución
<img 
  [src]="user()?.avatar || 'assets/default-avatar.png'" 
  [alt]="user()?.name" 
  class="w-10 h-10 rounded-full" />
```

### 2.7 Cierre

El `AuthService` es el puente entre la autenticación y los features. Todos los features pueden acceder al estado del usuario de forma reactiva.

---

## 3. Layout y Navegación (45 min)

### 3.1 Hook: La Estructura Visual

**Pregunta:** "¿Cómo mantengo consistencia visual en toda la app?"

La respuesta: **AppLayoutComponent**

### 3.2 Contexto: Estructura del Layout

```
┌─────────────────────────────────────────────────────────────┐
│                        HEADER                                │
│  [Logo] [Breadcrumb]              [User Dropdown] [Logout]  │
├────────────┬────────────────────────────────────────────────┤
│            │                                                 │
│  SIDEBAR   │                  CONTENT                        │
│            │                                                 │
│  • Home    │     ┌─────────────────────────────────────┐    │
│  • Users   │     │                                     │    │
│  • Profile │     │         Router Outlet               │    │
│            │     │                                     │    │
│            │     └─────────────────────────────────────┘    │
│            │                                                 │
└────────────┴────────────────────────────────────────────────┘
```

### 3.3 Explicación: AppLayoutComponent

```typescript
@Component({
  selector: 'app-layout',
  standalone: true,
  template: `
    <div class="flex h-screen">
      <!-- Sidebar -->
      <app-sidebar 
        [collapsed]="sidebarCollapsed()"
        (toggle)="sidebarCollapsed.set(!sidebarCollapsed())" />
      
      <!-- Main Content -->
      <div class="flex-1 flex flex-col">
        <!-- Header -->
        <app-header 
          [user]="authService.currentUser()"
          (menuClick)="sidebarCollapsed.set(!sidebarCollapsed())"
          (logout)="onLogout()" />
        
        <!-- Router Outlet -->
        <main class="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          <router-outlet />
        </main>
      </div>
    </div>
  `
})
export class AppLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  sidebarCollapsed = signal(false);
  
  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/signin']);
  }
}
```

### 3.4 Demo: Sidebar Dinámico

El sidebar puede mostrar/ocultar items según el rol:

```typescript
@Component({
  selector: 'app-sidebar',
  template: `
    <nav class="p-4">
      @for (item of visibleMenuItems(); track item.path) {
        <a 
          [routerLink]="item.path"
          routerLinkActive="bg-blue-500 text-white"
          class="flex items-center gap-3 px-4 py-3 rounded-lg
                 hover:bg-gray-100 dark:hover:bg-gray-800
                 transition-colors">
          <i [class]="item.icon"></i>
          <span>{{ item.label }}</span>
        </a>
      }
    </nav>
  `
})
export class SidebarComponent {
  private authService = inject(AuthService);
  
  menuItems = signal<MenuItem[]>([
    { path: '/dashboard', label: 'Dashboard', icon: 'pi pi-home', roles: ['admin', 'user'] },
    { path: '/users', label: 'Usuarios', icon: 'pi pi-users', roles: ['admin'] },
    { path: '/profile', label: 'Perfil', icon: 'pi pi-user', roles: ['admin', 'user'] }
  ]);
  
  visibleMenuItems = computed(() => {
    const currentRole = this.authService.activeRole()?.name;
    return this.menuItems().filter(item => 
      item.roles.includes(currentRole || 'user')
    );
  });
}
```

### 3.5 Error Común: Layout en Rutas Auth

```typescript
// ❌ MAL: Layout en rutas de autenticación
{
  path: 'signin',
  component: AppLayoutComponent,  // No debe tener layout
  children: [{ path: '', component: SignInComponent }]
}

// ✅ BIEN: Rutas auth sin layout
{
  path: 'signin',
  loadComponent: () => import('./auth/pages/sign-in/...')  // Sin layout
}
```

### 3.6 Mini Reto: Agregar Badge

**Ejercicio:** Agrega un badge de notificaciones al header.

```typescript
// Solución
<div class="relative">
  <button class="p-2 rounded-full hover:bg-gray-100">
    <i class="pi pi-bell"></i>
    @if (unreadCount() > 0) {
      <span class="absolute -top-1 -right-1 bg-red-500 text-white 
                   text-xs rounded-full w-5 h-5 flex items-center 
                   justify-center">
        {{ unreadCount() }}
      </span>
    }
  </button>
</div>
```

### 3.7 Cierre

El layout proporciona consistencia visual y estructura de navegación. El siguiente paso es entender el flujo de datos completo.

---

## 4. Flujo de Datos Completo (60 min)

### 4.1 Hook: Del Click al Database

**Pregunta:** "¿Qué pasa cuando hago click en 'Guardar'?"

Vamos a trazar el camino completo de una operación.

### 4.2 Contexto: Flujo de Create User

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUJO DE CREATE USER                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. USER ACTION                                                  │
│     User clicks "Guardar" button                                 │
│           │                                                       │
│           ▼                                                       │
│  2. COMPONENT                                                    │
│     FormComponent.onSubmit()                                     │
│     this.userService.createUser(form.value)                      │
│           │                                                       │
│           ▼                                                       │
│  3. SERVICE                                                      │
│     UserService.createUser(request)                              │
│     return this.http.post<User>('/api/users', request)           │
│           │                                                       │
│           ▼                                                       │
│  4. INTERCEPTOR                                                  │
│     authInterceptor intercepts request                           │
│     - Adds Authorization header                                  │
│     - Adds X-Active-Role header                                  │
│           │                                                       │
│           ▼                                                       │
│  5. HTTP REQUEST                                                 │
│     POST /api/users                                              │
│     Headers: { Authorization: Bearer xxx, X-Active-Role: admin } │
│           │                                                       │
│           ▼                                                       │
│  6. API RESPONSE                                                 │
│     { id: '123', name: 'John', ... }                             │
│           │                                                       │
│           ▼                                                       │
│  7. INTERCEPTOR (response)                                       │
│     - Checks for 401 (token refresh)                             │
│     - Passes response through                                    │
│           │                                                       │
│           ▼                                                       │
│  8. SERVICE (response)                                           │
│     .pipe(tap(user => this.usersCache.update(...)))              │
│           │                                                       │
│           ▼                                                       │
│  9. COMPONENT (response)                                         │
│     .subscribe({ next: () => this.router.navigate(['/users']) }) │
│           │                                                       │
│           ▼                                                       │
│  10. UI UPDATE                                                   │
│      User sees new user in list                                  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 4.3 Explicación: Cada Capa

**Capa 1 - User Action:**
El usuario interactúa con la UI.

**Capa 2 - Component:**
El componente maneja el evento y llama al servicio.

**Capa 3 - Service:**
El servicio hace la llamada HTTP.

**Capa 4 - Interceptor:**
El interceptor añade headers y maneja errores.

**Capa 5 - HTTP Request:**
La petición viaja al servidor.

**Capa 6 - API Response:**
El servidor responde.

**Capa 7 - Interceptor (response):**
El interceptor procesa la respuesta.

**Capa 8 - Service (response):**
El servicio actualiza el cache.

**Capa 9 - Component (response):**
El componente maneja el éxito/error.

**Capa 10 - UI Update:**
La UI se actualiza.

### 4.4 Demo: Código Completo

```typescript
// 1. Component
export class UserFormComponent {
  private userService = inject(UserService);
  private router = inject(Router);
  
  onSubmit(): void {
    if (this.form.invalid) return;
    
    this.userService.createUser(this.form.value).subscribe({
      next: () => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Usuario creado' 
        });
        this.router.navigate(['/users']);
      },
      error: (err) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: err.message 
        });
      }
    });
  }
}

// 2. Service
@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private usersCache = signal<User[]>([]);
  
  createUser(request: CreateUserRequest): Observable<User> {
    return this.http.post<User>('/api/users', request).pipe(
      tap(newUser => this.usersCache.update(users => [...users, newUser])),
      catchError(err => {
        this.logger.error('Create user failed', err);
        return throwError(() => err);
      })
    );
  }
}

// 3. Interceptor
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
  
  return next(authReq).pipe(
    catchError(err => {
      if (err.status === 401) {
        // Handle token refresh
      }
      return throwError(() => err);
    })
  );
};
```

### 4.5 Error Común: Olvidar Subscribe

```typescript
// ❌ MAL: Sin subscribe, no se ejecuta
this.userService.createUser(this.form.value);

// ✅ BIEN: Con subscribe
this.userService.createUser(this.form.value).subscribe({
  next: () => this.router.navigate(['/users']),
  error: (err) => this.handleError(err)
});
```

### 4.6 Mini Reto: Agregar Loading

**Ejercicio:** Muestra un loading state mientras se crea el usuario.

```typescript
// Solución
isSubmitting = signal(false);

onSubmit(): void {
  this.isSubmitting.set(true);
  this.userService.createUser(this.form.value).pipe(
    finalize(() => this.isSubmitting.set(false))
  ).subscribe({
    next: () => this.router.navigate(['/users']),
    error: (err) => this.handleError(err)
  });
}

// Template
<button [disabled]="isSubmitting()">
  @if (isSubmitting()) {
    <i class="pi pi-spinner pi-spin"></i>
  }
  Guardar
</button>
```

### 4.7 Cierre

El flujo de datos atraviesa múltiples capas. Entender este flujo es clave para debugging y optimización.

---

## 5. Proyecto Final (30 min)

### 5.1 Hook: La Aplicación Completa

**Pregunta:** "¿Podemos integrar todo en una aplicación funcional?"

La respuesta: **Sí, y lo haremos ahora**

### 5.2 Contexto: Checklist de Integración

- [ ] Autenticación funcionando
- [ ] Dashboard con métricas
- [ ] CRUD de usuarios
- [ ] Perfil de usuario
- [ ] Navegación fluida
- [ ] Manejo de errores
- [ ] Loading states

### 5.3 Explicación: Pasos de Integración

1. **Verificar routing** - Todas las rutas configuradas
2. **Verificar guards** - Rutas protegidas
3. **Verificar interceptors** - Headers añadidos
4. **Verificar services** - CRUD funcionando
5. **Verificar components** - UI renderizando
6. **Testing manual** - Flujos completos

### 5.4 Demo: Testing Manual

```bash
# 1. Iniciar la aplicación
npm start

# 2. Verificar login
# - Navegar a /signin
# - Ingresar credenciales
# - Verificar redirect a dashboard

# 3. Verificar dashboard
# - Verificar métricas visibles
# - Verificar nombre de usuario

# 4. Verificar CRUD usuarios
# - Listar usuarios
# - Crear usuario
# - Editar usuario
# - Eliminar usuario

# 5. Verificar perfil
# - Ver datos del usuario
# - Cambiar rol activo

# 6. Verificar logout
# - Cerrar sesión
# - Verificar redirect a login
```

### 5.5 Error Común: Rutas No Encontradas

```typescript
// ❌ MAL: Ruta mal configurada
{ path: 'users', loadChildren: () => import('./users') }  // Falta .routes

// ✅ BIEN: Ruta correcta
{ path: 'users', loadChildren: () => import('./features/users/users.routes').then(m => m.USERS_ROUTES) }
```

### 5.6 Mini Reto: Agregar Feature

**Ejercicio:** Agrega un nuevo feature "Products" siguiendo la misma estructura.

### 5.7 Cierre

La integración completa requiere verificar cada pieza. El testing manual confirma que todo funciona junto.

---

## Resumen del Día

### Conceptos Clave

1. **Arquitectura de Integración** - Conexión entre módulos
2. **Autenticación + Features** - AuthService como puente
3. **Layout y Navegación** - Consistencia visual
4. **Flujo de Datos** - Del click al database
5. **Proyecto Final** - Integración completa

### Habilidades Adquiridas

- ✅ Integrar todos los componentes del sistema
- ✅ Conectar autenticación con features
- ✅ Implementar flujo de datos completo
- ✅ Manejar estado global y local
- ✅ Crear aplicación funcional end-to-end

### Próximo Día

**Día 17: Testing**
- Unit tests con Jest
- Testing de componentes
- Testing de servicios
- Coverage y thresholds

---

*Contenido - Día 16 - Curso Angular 21 - UyuniAdmin Frontend*
