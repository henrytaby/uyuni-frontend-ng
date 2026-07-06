# Lab 02: Dark Mode y Responsive

## Información del Lab

| Atributo | Valor |
|----------|-------|
| **Duración** | 45 minutos |
| **Dificultad** | Intermedio |
| **Objetivo** | Implementar dark mode y diseño responsive completo |

---

## Objetivos de Aprendizaje

Al completar este lab, serás capaz de:

1. Implementar un toggle de dark mode
2. Persistir la preferencia de tema en localStorage
3. Aplicar estilos dark a todos los componentes
4. Crear versiones responsive del layout
5. Manejar estados de carga con skeletons

---

## Prerrequisitos

- Haber completado el Lab 01
- Tener configurado Tailwind CSS v4
- Conocimiento de signals y effects

---

## Escenario

Vas a extender el layout del Lab 01 para incluir:

1. **Toggle de dark mode** con persistencia
2. **Estilos dark** para todos los componentes
3. **Versión mobile** con sidebar ocultable
4. **Skeleton loaders** para estados de carga

```
┌─────────────────────────────────────────────────────────────┐
│  MODO CLARO                    │  MODO OSCURO               │
│  ┌─────────────────────────┐   │  ┌─────────────────────────┐
│  │ bg-white                │   │  │ bg-gray-900             │
│  │ text-gray-900           │   │  │ text-white              │
│  │ border-gray-200         │   │  │ border-gray-700         │
│  └─────────────────────────┘   │  └─────────────────────────┘
└─────────────────────────────────────────────────────────────┘
```

---

## Paso 1: Crear el Servicio de Tema (10 min)

### 1.1 Generar el servicio

```bash
ng generate service core/services/theme
```

### 1.2 Implementar ThemeService

Abre `src/app/core/services/theme.service.ts`:

```typescript
import { Injectable, signal, effect } from '@angular/core';
import { LoggerService } from './logger.service';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Signal para el estado del tema
  isDark = signal(false);
  
  // Storage key
  private readonly STORAGE_KEY = 'uyuni-theme';
  
  constructor(private logger: LoggerService) {
    this.initializeTheme();
    this.setupEffect();
  }
  
  /**
   * Inicializa el tema desde localStorage o preferencia del sistema
   */
  private initializeTheme(): void {
    // 1. Verificar localStorage
    const savedTheme = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
    
    if (savedTheme) {
      this.isDark.set(savedTheme === 'dark');
      this.logger.info('Theme loaded from storage:', savedTheme);
      return;
    }
    
    // 2. Verificar preferencia del sistema
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.isDark.set(true);
      this.logger.info('Theme loaded from system preference: dark');
    }
  }
  
  /**
   * Configura el effect para sincronizar el DOM
   */
  private setupEffect(): void {
    effect(() => {
      const isDark = this.isDark();
      const html = document.documentElement;
      
      if (isDark) {
        html.classList.add('dark');
        localStorage.setItem(this.STORAGE_KEY, 'dark');
      } else {
        html.classList.remove('dark');
        localStorage.setItem(this.STORAGE_KEY, 'light');
      }
      
      this.logger.debug('Theme applied:', isDark ? 'dark' : 'light');
    });
  }
  
  /**
   * Alterna entre tema claro y oscuro
   */
  toggle(): void {
    this.isDark.update(v => !v);
    this.logger.info('Theme toggled to:', this.isDark() ? 'dark' : 'light');
  }
  
  /**
   * Establece un tema específico
   */
  setTheme(theme: Theme): void {
    this.isDark.set(theme === 'dark');
    this.logger.info('Theme set to:', theme);
  }
  
  /**
   * Obtiene el tema actual
   */
  get currentTheme(): Theme {
    return this.isDark() ? 'dark' : 'light';
  }
}
```

---

## Paso 2: Crear el Componente Theme Toggle (10 min)

### 2.1 Generar el componente

```bash
ng generate component shared/components/theme-toggle --standalone
```

### 2.2 Implementar el componente

Abre `src/app/shared/components/theme-toggle/theme-toggle.component.ts`:

```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      (click)="toggleTheme()"
      class="relative p-2 rounded-lg transition-colors duration-200"
      [class.bg-gray-100]="!isDark()"
      [class.hover:bg-gray-200]="!isDark()"
      [class.bg-gray-800]="isDark()"
      [class.hover:bg-gray-700]="isDark()"
      [attr.aria-label]="isDark() ? 'Activar modo claro' : 'Activar modo oscuro'">
      
      <!-- Sun icon (visible en dark mode) -->
      @if (isDark()) {
        <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
        </svg>
      }
      
      <!-- Moon icon (visible en light mode) -->
      @if (!isDark()) {
        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
        </svg>
      }
      
      <!-- Screen reader text -->
      <span class="sr-only">
        {{ isDark() ? 'Activar modo claro' : 'Activar modo oscuro' }}
      </span>
    </button>
  `,
  styles: [`
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
  `]
})
export class ThemeToggleComponent {
  private themeService = inject(ThemeService);
  
  get isDark() {
    return this.themeService.isDark;
  }
  
  toggleTheme(): void {
    this.themeService.toggle();
  }
}
```

---

## Paso 3: Actualizar el Layout con Dark Mode (10 min)

### 3.1 Actualizar el componente DashboardLayout

Modifica `src/app/shared/layout/dashboard-layout/dashboard-layout.component.ts`:

```typescript
import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeToggleComponent } from '@shared/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, ThemeToggleComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <!-- Header -->
      <header class="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 
                    fixed top-0 left-0 right-0 z-50 transition-colors duration-300">
        <div class="h-full flex items-center justify-between px-4">
          <!-- Left: Toggle + Title -->
          <div class="flex items-center gap-4">
            <button 
              (click)="toggleSidebar()"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
              <svg class="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
            <h1 class="text-xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
          </div>

          <!-- Right: Theme Toggle + Actions -->
          <div class="flex items-center gap-2">
            <app-theme-toggle />
            
            <button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 relative">
              <svg class="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </header>

      <div class="flex pt-16">
        <!-- Sidebar -->
        <aside 
          [class]="sidebarCollapsed() ? 'w-20' : 'w-64'"
          class="bg-gray-900 dark:bg-gray-950 fixed left-0 top-16 bottom-0 overflow-y-auto transition-all duration-300">
          <nav class="p-4">
            @for (item of menuItems; track item.id) {
              <a 
                [class]="sidebarCollapsed() ? 'justify-center' : ''"
                class="flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-800 hover:text-white transition-colors duration-200 mb-2">
                @if (!sidebarCollapsed()) {
                  <span class="font-medium">{{ item.label }}</span>
                }
              </a>
            }
          </nav>
        </aside>

        <!-- Content -->
        <main 
          [class]="sidebarCollapsed() ? 'ml-20' : 'ml-64'"
          class="flex-1 p-4 md:p-6 transition-all duration-300">
          
          <!-- Grid de cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
            @for (card of statsCards; track card.id) {
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md 
                         dark:shadow-gray-900/50 transition-all duration-200 p-6">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ card.title }}</h3>
                </div>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ card.value }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ card.change }}</p>
              </div>
            }
          </div>
          
          <ng-content></ng-content>
        </main>
      </div>
    </div>
  `
})
export class DashboardLayoutComponent {
  sidebarCollapsed = signal(false);

  menuItems = [
    { id: 1, label: 'Dashboard', icon: 'home' },
    { id: 2, label: 'Estadísticas', icon: 'chart' },
    { id: 3, label: 'Usuarios', icon: 'users' },
    { id: 4, label: 'Productos', icon: 'product' },
    { id: 5, label: 'Pedidos', icon: 'cart' },
    { id: 6, label: 'Configuración', icon: 'settings' }
  ];

  statsCards = [
    { id: 1, title: 'Usuarios Totales', value: '12,345', change: '+12% desde el mes pasado' },
    { id: 2, title: 'Ventas del Mes', value: '$45,678', change: '+8% desde el mes pasado' },
    { id: 3, title: 'Pedidos Pendientes', value: '234', change: '-3% desde ayer' }
  ];

  toggleSidebar(): void {
    this.sidebarCollapsed.update(v => !v);
  }
}
```

---

## Paso 4: Agregar Versión Mobile (10 min)

### 4.1 Actualizar el template para mobile

Agrega soporte para mobile con un overlay:

```typescript
template: `
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- Header -->
    <header class="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 
                  fixed top-0 left-0 right-0 z-50 transition-colors duration-300">
      <div class="h-full flex items-center justify-between px-4">
        <!-- Left: Toggle + Title -->
        <div class="flex items-center gap-4">
          <!-- Mobile menu button -->
          <button 
            (click)="toggleMobileSidebar()"
            class="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
            <svg class="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          
          <!-- Desktop toggle -->
          <button 
            (click)="toggleSidebar()"
            class="hidden md:flex p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
            <svg class="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          
          <h1 class="text-xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
        </div>

        <!-- Right: Theme Toggle + Actions -->
        <div class="flex items-center gap-2">
          <app-theme-toggle />
        </div>
      </div>
    </header>

    <!-- Mobile overlay -->
    @if (mobileSidebarOpen()) {
      <div 
        (click)="closeMobileSidebar()"
        class="fixed inset-0 bg-black/50 z-40 md:hidden"
        tabindex="-1"
        aria-hidden="true">
      </div>
    }

    <!-- Sidebar -->
    <aside 
      [class]="getSidebarClasses()"
      class="bg-gray-900 dark:bg-gray-950 fixed left-0 top-16 bottom-0 overflow-y-auto transition-all duration-300 z-40">
      <nav class="p-4">
        @for (item of menuItems; track item.id) {
          <a 
            (click)="closeMobileSidebar()"
            [class]="sidebarCollapsed() ? 'justify-center' : ''"
            class="flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-800 hover:text-white transition-colors duration-200 mb-2 cursor-pointer">
            @if (!sidebarCollapsed() || mobileSidebarOpen()) {
              <span class="font-medium">{{ item.label }}</span>
            }
          </a>
        }
      </nav>
    </aside>

    <!-- Content -->
    <main 
      [class]="getContentClasses()"
      class="flex-1 p-4 md:p-6 transition-all duration-300">
      
      <!-- Grid de cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        @for (card of statsCards; track card.id) {
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md 
                     dark:shadow-gray-900/50 transition-all duration-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ card.title }}</h3>
            </div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ card.value }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ card.change }}</p>
          </div>
        }
      </div>
      
      <ng-content></ng-content>
    </main>
  </div>
`
```

### 4.2 Agregar métodos helper

```typescript
export class DashboardLayoutComponent {
  sidebarCollapsed = signal(false);
  mobileSidebarOpen = signal(false);

  // ... código anterior ...

  toggleSidebar(): void {
    this.sidebarCollapsed.update(v => !v);
  }

  toggleMobileSidebar(): void {
    this.mobileSidebarOpen.update(v => !v);
  }

  closeMobileSidebar(): void {
    this.mobileSidebarOpen.set(false);
  }

  getSidebarClasses(): string {
    const base = 'bg-gray-900 dark:bg-gray-950 fixed left-0 top-16 bottom-0 overflow-y-auto transition-all duration-300 z-40';
    
    // Mobile: show/hide based on mobileSidebarOpen
    if (this.mobileSidebarOpen()) {
      return `${base} w-64 translate-x-0`;
    }
    
    // Desktop: collapsed or expanded
    if (this.sidebarCollapsed()) {
      return `${base} w-20 -translate-x-full md:translate-x-0`;
    }
    
    return `${base} w-64 -translate-x-full md:translate-x-0`;
  }

  getContentClasses(): string {
    const base = 'flex-1 p-4 md:p-6 transition-all duration-300';
    
    // Mobile: full width
    if (this.mobileSidebarOpen()) {
      return `${base} ml-0`;
    }
    
    // Desktop: adjust for sidebar
    if (this.sidebarCollapsed()) {
      return `${base} ml-0 md:ml-20`;
    }
    
    return `${base} ml-0 md:ml-64`;
  }
}
```

---

## Paso 5: Agregar Skeleton Loaders (5 min)

### 5.1 Crear componente skeleton

```bash
ng generate component shared/components/skeleton-card --standalone
```

### 5.2 Implementar skeleton

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-pulse">
      <!-- Title skeleton -->
      <div class="flex items-center justify-between mb-4">
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        <div class="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
      
      <!-- Value skeleton -->
      <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
      
      <!-- Change skeleton -->
      <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
    </div>
  `
})
export class SkeletonCardComponent {}
```

### 5.3 Usar skeleton en el layout

```typescript
<!-- En el template del dashboard -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
  @if (isLoading()) {
    @for (_ of [1, 2, 3]; track $index) {
      <app-skeleton-card />
    }
  } @else {
    @for (card of statsCards; track card.id) {
      <!-- Cards normales -->
    }
  }
</div>
```

```typescript
// En el componente
isLoading = signal(true);

constructor() {
  // Simular carga de datos
  setTimeout(() => {
    this.isLoading.set(false);
  }, 2000);
}
```

---

## Paso 6: Configurar @theme para Dark Mode (Opcional)

### 6.1 Agregar variables CSS personalizadas

En `src/styles.css`:

```css
@import "tailwindcss";

@theme {
  /* Colores de marca */
  --color-brand: #38240c;
  --color-brand-light: #c4a77d;
  
  /* Colores para dark mode */
  --color-dark-bg: #111827;
  --color-dark-surface: #1f2937;
  --color-dark-border: #374151;
}

/* Estilos base para dark mode */
.dark {
  color-scheme: dark;
}

/* Scrollbar personalizado para dark mode */
.dark ::-webkit-scrollbar {
  width: 8px;
}

.dark ::-webkit-scrollbar-track {
  background: var(--color-dark-bg);
}

.dark ::-webkit-scrollbar-thumb {
  background: var(--color-dark-border);
  border-radius: 4px;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #4b5563;
}
```

---

## Código Completo

### theme.service.ts

```typescript
import { Injectable, signal, effect } from '@angular/core';
import { LoggerService } from './logger.service';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDark = signal(false);
  private readonly STORAGE_KEY = 'uyuni-theme';
  
  constructor(private logger: LoggerService) {
    this.initializeTheme();
    this.setupEffect();
  }
  
  private initializeTheme(): void {
    const savedTheme = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
    
    if (savedTheme) {
      this.isDark.set(savedTheme === 'dark');
      return;
    }
    
    if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      this.isDark.set(true);
    }
  }
  
  private setupEffect(): void {
    effect(() => {
      const isDark = this.isDark();
      const html = document.documentElement;
      
      if (isDark) {
        html.classList.add('dark');
        localStorage.setItem(this.STORAGE_KEY, 'dark');
      } else {
        html.classList.remove('dark');
        localStorage.setItem(this.STORAGE_KEY, 'light');
      }
    });
  }
  
  toggle(): void {
    this.isDark.update(v => !v);
  }
  
  setTheme(theme: Theme): void {
    this.isDark.set(theme === 'dark');
  }
}
```

---

## Verificación

### Checklist de completitud:

- [ ] El toggle de dark mode funciona correctamente
- [ ] La preferencia se persiste en localStorage
- [ ] Todos los componentes tienen estilos dark
- [ ] El layout es responsive en mobile
- [ ] La sidebar se oculta en mobile con overlay
- [ ] Los skeleton loaders se muestran durante la carga

### Comandos de verificación:

```bash
# Iniciar el servidor
npm start

# Verificar en diferentes viewports:
# - Desktop: > 1024px
# - Tablet: 768px - 1024px
# - Mobile: < 768px

# Verificar dark mode:
# 1. Click en el toggle
# 2. Recargar la página
# 3. Verificar que el tema se mantiene
```

---

## Retos Adicionales

### Reto 1: Animación de transición suave
Agregar una animación de fade entre los modos claro y oscuro.

### Reto 2: Respetar preferencia del sistema
Detectar cambios en la preferencia del sistema y actualizar automáticamente.

### Reto 3: Tema personalizado
Crear un tercer tema con colores personalizados (ej: tema "brand").

---

## Solución de Problemas

### Problema: El dark mode no persiste
**Solución:** Verifica que localStorage esté disponible y que el STORAGE_KEY sea correcto.

### Problema: Los estilos no aplican en dark mode
**Solución:** Asegúrate de que la clase `.dark` esté en el elemento `<html>`.

### Problema: El overlay no cierra la sidebar
**Solución:** Verifica que el evento click esté vinculado correctamente al método `closeMobileSidebar()`.

---

*Lab 02 - Día 14 - Curso Angular 21 - UyuniAdmin Frontend*
