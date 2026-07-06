# Lab 01: Integración Auth + Dashboard

## Información del Lab

| Atributo | Valor |
|----------|-------|
| **Duración** | 45 minutos |
| **Dificultad** | Intermedio |
| **Objetivo** | Integrar autenticación con el dashboard |

---

## Objetivos de Aprendizaje

Al completar este lab, serás capaz de:

1. Conectar AuthService con componentes
2. Mostrar datos del usuario logueado
3. Implementar logout funcional
4. Crear sidebar dinámico por rol
5. Personalizar UI según el usuario

---

## Prerrequisitos

- Haber completado el contenido del Día 16
- AuthService funcionando
- Dashboard feature creado

---

## Escenario

Vas a integrar la autenticación con el dashboard:

```
┌─────────────────────────────────────────────────────────────┐
│                    DASHBOARD INTEGRADO                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Bienvenido, John Doe                    [Admin ▼]      ││
│  │  Rol: Administrador                     [Logout]        ││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Métricas personalizadas                                 ││
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐                 ││
│  │  │ Users   │  │ Sales   │  │ Orders  │                 ││
│  │  │ (Admin) │  │         │  │         │                 ││
│  │  └─────────┘  └─────────┘  └─────────┘                 ││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Sidebar dinámico                                        ││
│  │  • Dashboard (todos)                                     ││
│  │  • Users (admin)                                         ││
│  │  • Profile (todos)                                       ││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Paso 1: Mostrar Usuario en Dashboard (10 min)

### 1.1 Actualizar DashboardComponent

Modifica `src/app/features/dashboard/pages/overview/overview.component.ts`:

```typescript
import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core/auth/auth.service';
import { DashboardService } from '../../services/dashboard.service';
import { LoggerService } from '@core/services/logger.service';
import { User } from '@features/auth/models/auth.models';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <!-- Welcome Section -->
      <div class="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <!-- Avatar -->
            <div class="relative">
              @if (user()?.avatar) {
                <img 
                  [src]="user()?.avatar" 
                  [alt]="user()?.name"
                  class="w-16 h-16 rounded-full object-cover border-2 
                         border-blue-500">
              } @else {
                <div class="w-16 h-16 rounded-full bg-blue-100 
                            flex items-center justify-center">
                  <span class="text-2xl font-bold text-blue-600">
                    {{ userInitials() }}
                  </span>
                </div>
              }
              <span 
                class="absolute bottom-0 right-0 w-4 h-4 bg-green-500 
                       border-2 border-white rounded-full">
              </span>
            </div>
            
            <!-- User Info -->
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                Bienvenido, {{ user()?.name }}
              </h1>
              <p class="text-gray-500 dark:text-gray-400">
                {{ user()?.email }}
              </p>
              <div class="flex items-center gap-2 mt-1">
                <span class="px-2 py-0.5 text-xs font-medium rounded-full 
                             bg-blue-100 text-blue-800 dark:bg-blue-900 
                             dark:text-blue-200">
                  {{ activeRole()?.name }}
                </span>
              </div>
            </div>
          </div>
          
          <!-- Quick Actions -->
          <div class="flex gap-2">
            <button 
              (click)="onRefresh()"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 
                     hover:bg-gray-100 dark:hover:bg-gray-700 
                     rounded-lg transition-colors">
              <i class="pi pi-refresh"></i>
            </button>
            <button 
              (click)="onViewProfile()"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg 
                     hover:bg-blue-600 transition-colors">
              Ver Perfil
            </button>
          </div>
        </div>
      </div>
      
      <!-- Metrics based on role -->
      @if (isAdmin()) {
        <app-admin-metrics />
      } @else {
        <app-user-metrics />
      }
    </div>
  `
})
export class OverviewComponent implements OnInit {
  private authService = inject(AuthService);
  private dashboardService = inject(DashboardService);
  private logger = inject(LoggerService);
  private router = inject(Router);
  
  // User signals from AuthService
  user = this.authService.currentUser;
  roles = this.authService.roles;
  activeRole = this.authService.activeRole;
  
  // Computed
  userInitials = computed(() => {
    const name = this.user()?.name || '';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  });
  
  isAdmin = computed(() => 
    this.activeRole()?.name === 'admin'
  );
  
  ngOnInit(): void {
    this.logger.info('Dashboard loaded', { 
      user: this.user()?.name,
      role: this.activeRole()?.name 
    });
  }
  
  onRefresh(): void {
    this.dashboardService.invalidateCache();
    window.location.reload();
  }
  
  onViewProfile(): void {
    this.router.navigate(['/profile']);
  }
}
```

---

## Paso 2: Crear Sidebar Dinámico (15 min)

### 2.1 Definir MenuItem Interface

Crea `src/app/core/models/menu.models.ts`:

```typescript
export interface MenuItem {
  path: string;
  label: string;
  icon: string;
  roles: string[];
  badge?: string;
  children?: MenuItem[];
}
```

### 2.2 Actualizar SidebarComponent

Modifica `src/app/shared/components/sidebar/sidebar.component.ts`:

```typescript
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { MenuItem } from '@core/models/menu.models';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside 
      [class]="collapsed() ? 'w-20' : 'w-64'"
      class="bg-white dark:bg-gray-800 border-r border-gray-200 
             dark:border-gray-700 transition-all duration-300 h-full">
      
      <!-- Logo -->
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-3">
          <img 
            src="assets/images/logo/logo-icon.svg" 
            alt="Logo"
            class="w-10 h-10">
          @if (!collapsed()) {
            <span class="text-lg font-bold text-gray-900 dark:text-white">
              UyuniAdmin
            </span>
          }
        </div>
      </div>
      
      <!-- Navigation -->
      <nav class="p-4 space-y-1">
        @for (item of visibleMenuItems(); track item.path) {
          <a 
            [routerLink]="item.path"
            routerLinkActive="bg-blue-50 dark:bg-blue-900/20 text-blue-600 
                             dark:text-blue-400"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg 
                   text-gray-700 dark:text-gray-300
                   hover:bg-gray-100 dark:hover:bg-gray-700
                   transition-colors group">
            <i 
              [class]="item.icon"
              class="text-lg group-hover:text-blue-500">
            </i>
            @if (!collapsed()) {
              <span class="flex-1">{{ item.label }}</span>
              @if (item.badge) {
                <span class="px-2 py-0.5 text-xs font-medium rounded-full 
                             bg-red-500 text-white">
                  {{ item.badge }}
                </span>
              }
            }
          </a>
        }
      </nav>
      
      <!-- Toggle Button -->
      <div class="absolute bottom-4 left-0 right-0 px-4">
        <button 
          (click)="toggleCollapsed()"
          class="w-full flex items-center justify-center gap-2 px-3 py-2 
                 rounded-lg text-gray-500 hover:bg-gray-100 
                 dark:hover:bg-gray-700 transition-colors">
          <i 
            [class]="collapsed() ? 'pi pi-angle-right' : 'pi pi-angle-left'">
          </i>
          @if (!collapsed()) {
            <span>Colapsar</span>
          }
        </button>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  private authService = inject(AuthService);
  
  collapsed = signal(false);
  collapsedChange = output<boolean>();
  
  // All menu items
  private allMenuItems = signal<MenuItem[]>([
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: 'pi pi-home',
      roles: ['admin', 'manager', 'user']
    },
    {
      path: '/users',
      label: 'Usuarios',
      icon: 'pi pi-users',
      roles: ['admin']
    },
    {
      path: '/products',
      label: 'Productos',
      icon: 'pi pi-box',
      roles: ['admin', 'manager']
    },
    {
      path: '/orders',
      label: 'Pedidos',
      icon: 'pi pi-shopping-cart',
      roles: ['admin', 'manager'],
      badge: '5'
    },
    {
      path: '/reports',
      label: 'Reportes',
      icon: 'pi pi-chart-bar',
      roles: ['admin', 'manager']
    },
    {
      path: '/profile',
      label: 'Mi Perfil',
      icon: 'pi pi-user',
      roles: ['admin', 'manager', 'user']
    }
  ]);
  
  // Filtered menu items based on role
  visibleMenuItems = computed(() => {
    const currentRole = this.authService.activeRole()?.name || 'user';
    return this.allMenuItems().filter(item => 
      item.roles.includes(currentRole)
    );
  });
  
  toggleCollapsed(): void {
    this.collapsed.update(c => !c);
    this.collapsedChange.emit(this.collapsed());
  }
}
```

---

## Paso 3: Header con User Dropdown (10 min)

### 3.1 Actualizar HeaderComponent

Modifica `src/app/shared/components/header/header.component.ts`:

```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { LoggerService } from '@core/services/logger.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 
                   dark:border-gray-700 px-6 py-4">
      <div class="flex items-center justify-between">
        <!-- Left: Menu Toggle + Breadcrumb -->
        <div class="flex items-center gap-4">
          <button 
            (click)="onMenuToggle()"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
                   transition-colors lg:hidden">
            <i class="pi pi-bars text-gray-600 dark:text-gray-300"></i>
          </button>
          
          <!-- Breadcrumb -->
          <nav class="hidden sm:flex items-center gap-2 text-sm">
            <span class="text-gray-500 dark:text-gray-400">Inicio</span>
            <i class="pi pi-chevron-right text-gray-400 text-xs"></i>
            <span class="text-gray-900 dark:text-white font-medium">
              Dashboard
            </span>
          </nav>
        </div>
        
        <!-- Right: Notifications + User -->
        <div class="flex items-center gap-4">
          <!-- Notifications -->
          <button 
            class="relative p-2 rounded-lg hover:bg-gray-100 
                   dark:hover:bg-gray-700 transition-colors">
            <i class="pi pi-bell text-gray-600 dark:text-gray-300"></i>
            <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 
                         rounded-full"></span>
          </button>
          
          <!-- Theme Toggle -->
          <button 
            (click)="onThemeToggle()"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
                   transition-colors">
            <i 
              [class]="isDarkMode() ? 'pi pi-sun' : 'pi pi-moon'"
              class="text-gray-600 dark:text-gray-300">
            </i>
          </button>
          
          <!-- User Dropdown -->
          <div class="relative" #userDropdown>
            <button 
              (click)="showDropdown.set(!showDropdown())"
              class="flex items-center gap-3 p-2 rounded-lg 
                     hover:bg-gray-100 dark:hover:bg-gray-700 
                     transition-colors">
              @if (user()?.avatar) {
                <img 
                  [src]="user()?.avatar" 
                  [alt]="user()?.name"
                  class="w-8 h-8 rounded-full object-cover">
              } @else {
                <div class="w-8 h-8 rounded-full bg-blue-100 
                            flex items-center justify-center">
                  <span class="text-sm font-medium text-blue-600">
                    {{ getInitials() }}
                  </span>
                </div>
              }
              <div class="hidden md:block text-left">
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ user()?.name }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ activeRole()?.name }}
                </p>
              </div>
              <i 
                [class]="showDropdown() ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
                class="text-gray-400 text-sm hidden md:block">
              </i>
            </button>
            
            <!-- Dropdown Menu -->
            @if (showDropdown()) {
              <div 
                class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 
                       rounded-lg shadow-lg border border-gray-200 
                       dark:border-gray-700 py-2 z-50">
                
                <!-- User Info -->
                <div class="px-4 py-3 border-b border-gray-200 
                            dark:border-gray-700">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ user()?.name }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ user()?.email }}
                  </p>
                </div>
                
                <!-- Role Switcher -->
                @if (roles().length > 1) {
                  <div class="px-4 py-2 border-b border-gray-200 
                              dark:border-gray-700">
                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      Cambiar rol:
                    </p>
                    @for (role of roles(); track role.id) {
                      <button 
                        (click)="onRoleChange(role)"
                        [class.bg-blue-50]="activeRole()?.id === role.id"
                        [class.dark:bg-blue-900/20]="activeRole()?.id === role.id"
                        class="w-full text-left px-3 py-2 rounded-lg 
                               text-sm text-gray-700 dark:text-gray-300
                               hover:bg-gray-100 dark:hover:bg-gray-700
                               transition-colors">
                        {{ role.name }}
                      </button>
                    }
                  </div>
                }
                
                <!-- Menu Items -->
                <a 
                  routerLink="/profile"
                  class="flex items-center gap-3 px-4 py-2 
                         text-gray-700 dark:text-gray-300
                         hover:bg-gray-100 dark:hover:bg-gray-700">
                  <i class="pi pi-user"></i>
                  <span>Mi Perfil</span>
                </a>
                
                <a 
                  routerLink="/settings"
                  class="flex items-center gap-3 px-4 py-2 
                         text-gray-700 dark:text-gray-300
                         hover:bg-gray-100 dark:hover:bg-gray-700">
                  <i class="pi pi-cog"></i>
                  <span>Configuración</span>
                </a>
                
                <!-- Logout -->
                <button 
                  (click)="onLogout()"
                  class="w-full flex items-center gap-3 px-4 py-2 
                         text-red-600 dark:text-red-400
                         hover:bg-red-50 dark:hover:bg-red-900/20">
                  <i class="pi pi-sign-out"></i>
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            }
          </div>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private logger = inject(LoggerService);
  
  // User signals
  user = this.authService.currentUser;
  roles = this.authService.roles;
  activeRole = this.authService.activeRole;
  
  // UI state
  showDropdown = signal(false);
  isDarkMode = signal(false);
  
  menuToggle = output<void>();
  
  getInitials(): string {
    const name = this.user()?.name || '';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
  
  onMenuToggle(): void {
    this.menuToggle.emit();
  }
  
  onThemeToggle(): void {
    this.isDarkMode.update(d => !d);
    document.documentElement.classList.toggle('dark');
  }
  
  onRoleChange(role: Role): void {
    this.authService.setActiveRole(role);
    this.showDropdown.set(false);
    this.logger.info('Role changed', { role: role.name });
  }
  
  onLogout(): void {
    this.logger.info('User logged out');
    this.authService.logout();
    this.router.navigate(['/signin']);
  }
}
```

---

## Paso 4: Integrar en AppLayout (10 min)

### 4.1 Actualizar AppLayoutComponent

Modifica `src/app/shared/layout/app-layout/app-layout.component.ts`:

```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '@shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '@shared/components/header/header.component';
import { LoadingService } from '@core/services/loading.service';
import { AuthService } from '@core/auth/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent,
    HeaderComponent
  ],
  template: `
    <div class="flex h-screen bg-gray-50 dark:bg-gray-900">
      <!-- Sidebar -->
      <app-sidebar 
        [collapsed]="sidebarCollapsed()"
        (collapsedChange)="sidebarCollapsed.set($event)" />
      
      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Header -->
        <app-header (menuToggle)="sidebarCollapsed.set(!sidebarCollapsed())" />
        
        <!-- Page Content -->
        <main class="flex-1 overflow-auto">
          <!-- Loading Overlay -->
          @if (loadingService.isLoading()) {
            <div class="absolute inset-0 bg-white/50 dark:bg-gray-900/50 
                        flex items-center justify-center z-50">
              <div class="flex flex-col items-center gap-4">
                <i class="pi pi-spinner pi-spin text-4xl text-blue-500"></i>
                <span class="text-gray-600 dark:text-gray-400">
                  Cargando...
                </span>
              </div>
            </div>
          }
          
          <!-- Router Outlet -->
          <router-outlet />
        </main>
      </div>
    </div>
  `
})
export class AppLayoutComponent {
  protected loadingService = inject(LoadingService);
  private authService = inject(AuthService);
  
  sidebarCollapsed = signal(false);
  
  constructor() {
    // Verificar autenticación
    if (!this.authService.isAuthenticated()) {
      // El guard debería manejar esto, pero es una doble verificación
    }
  }
}
```

---

## Verificación

### Checklist de completitud:

- [ ] El usuario se muestra en el dashboard
- [ ] El avatar funciona correctamente
- [ ] El sidebar filtra items por rol
- [ ] El header muestra el dropdown
- [ ] El logout funciona correctamente
- [ ] El cambio de rol actualiza la UI

### Comando de verificación:

```bash
# Iniciar el servidor de desarrollo
npm start

# Probar flujo:
# 1. Login con usuario admin
# 2. Verificar que el nombre aparece en dashboard
# 3. Verificar que el sidebar muestra todos los items
# 4. Cambiar rol (si tiene múltiples)
# 5. Verificar que el sidebar se actualiza
# 6. Logout y verificar redirect
```

---

## Retos Adicionales

### Reto 1: Agregar notificaciones
Mostrar contador de notificaciones no leídas en el header.

### Reto 2: Persistir sidebar state
Guardar el estado del sidebar (colapsado/expandido) en localStorage.

### Reto 3: Agregar breadcrumbs dinámicos
Mostrar breadcrumbs basados en la ruta actual.

---

## Solución de Problemas

### Problema: El usuario no se muestra
**Solución:** Verifica que AuthService.currentUser tenga datos después del login.

### Problema: El sidebar no filtra
**Solución:** Verifica que activeRole tenga un valor válido.

### Problema: El logout no redirige
**Solución:** Verifica que el router.navigate esté dentro de subscribe.

---

*Lab 01 - Día 16 - Curso Angular 21 - UyuniAdmin Frontend*
