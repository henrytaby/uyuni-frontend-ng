# Lab 01: Layout y Spacing con Tailwind CSS

## Información del Lab

| Atributo | Valor |
|----------|-------|
| **Duración** | 45 minutos |
| **Dificultad** | Intermedio |
| **Objetivo** | Crear un layout de dashboard con Tailwind CSS |

---

## Objetivos de Aprendizaje

Al completar este lab, serás capaz de:

1. Crear layouts con Flexbox y Grid usando Tailwind
2. Implementar un header fijo
3. Crear una sidebar colapsable
4. Usar el sistema de spacing de Tailwind
5. Aplicar estilos responsive

---

## Prerrequisitos

- Haber completado el contenido del Día 14
- Tener configurado Tailwind CSS v4 en el proyecto
- Conocimiento básico de Flexbox y Grid

---

## Escenario

Vas a crear el layout principal de un dashboard administrativo que incluye:

```
┌─────────────────────────────────────────────────────────────┐
│                        HEADER (64px)                        │
│  [☰] Dashboard                                    [🔔] [👤] │
├──────────┬──────────────────────────────────────────────────┤
│          │                                                   │
│ SIDEBAR  │                    MAIN CONTENT                   │
│ (260px)  │                                                   │
│          │  ┌─────────┐ ┌─────────┐ ┌─────────┐            │
│ 🏠 Home  │  │ Card 1  │ │ Card 2  │ │ Card 3  │            │
│ 📊 Stats │  └─────────┘ └─────────┘ └─────────┘            │
│ 👥 Users │                                                   │
│ ⚙️ Config│  ┌─────────────────────────────────────┐        │
│          │  │                                     │        │
│          │  │           Data Table                │        │
│          │  │                                     │        │
│          │  └─────────────────────────────────────┘        │
└──────────┴──────────────────────────────────────────────────┘
```

---

## Paso 1: Crear el Componente de Layout (10 min)

### 1.1 Generar el componente

```bash
ng generate component shared/layout/dashboard-layout --standalone
```

### 1.2 Estructura base del layout

Abre `src/app/shared/layout/dashboard-layout/dashboard-layout.component.ts` y agrega:

```typescript
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="h-16 bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <!-- TODO: Implementar header -->
      </header>

      <!-- Main container -->
      <div class="flex pt-16">
        <!-- Sidebar -->
        <aside class="w-64 bg-gray-900 fixed left-0 top-16 bottom-0 overflow-y-auto">
          <!-- TODO: Implementar sidebar -->
        </aside>

        <!-- Content -->
        <main class="flex-1 ml-64 p-6">
          <!-- TODO: Implementar contenido -->
        </main>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardLayoutComponent {}
```

**Explicación de las clases:**

| Clase | Significado |
|-------|-------------|
| `min-h-screen` | Altura mínima = 100vh |
| `bg-gray-50` | Background color gray-50 |
| `h-16` | Height = 4rem (64px) |
| `fixed top-0 left-0 right-0` | Posición fija, arriba, izquierda y derecha |
| `z-50` | z-index: 50 |
| `flex` | display: flex |
| `pt-16` | Padding-top = 4rem (para el header) |
| `w-64` | Width = 16rem (260px) |
| `ml-64` | Margin-left = 16rem (para el sidebar) |

---

## Paso 2: Implementar el Header (10 min)

### 2.1 Estructura del header

Actualiza el header en el template:

```typescript
template: `
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="h-16 bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div class="h-full flex items-center justify-between px-4">
        <!-- Left: Toggle + Title -->
        <div class="flex items-center gap-4">
          <button 
            (click)="toggleSidebar()"
            class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <h1 class="text-xl font-semibold text-gray-900">Dashboard</h1>
        </div>

        <!-- Right: Actions -->
        <div class="flex items-center gap-2">
          <button class="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <!-- Notification badge -->
            <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <button class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
    <!-- ... resto del template ... -->
  </div>
`
```

### 2.2 Agregar signal para toggle

```typescript
export class DashboardLayoutComponent {
  sidebarCollapsed = signal(false);

  toggleSidebar(): void {
    this.sidebarCollapsed.update(v => !v);
  }
}
```

---

## Paso 3: Implementar la Sidebar (10 min)

### 3.1 Menú de navegación

Agrega el menú como propiedad del componente:

```typescript
export class DashboardLayoutComponent {
  sidebarCollapsed = signal(false);

  menuItems = [
    { id: 1, label: 'Dashboard', icon: 'home', path: '/dashboard' },
    { id: 2, label: 'Estadísticas', icon: 'chart', path: '/stats' },
    { id: 3, label: 'Usuarios', icon: 'users', path: '/users' },
    { id: 4, label: 'Productos', icon: 'product', path: '/products' },
    { id: 5, label: 'Pedidos', icon: 'cart', path: '/orders' },
    { id: 6, label: 'Configuración', icon: 'settings', path: '/settings' }
  ];

  toggleSidebar(): void {
    this.sidebarCollapsed.update(v => !v);
  }
}
```

### 3.2 Template de la sidebar

Actualiza la sidebar en el template:

```typescript
<!-- Sidebar -->
<aside 
  [class]="sidebarCollapsed() ? 'w-20' : 'w-64'"
  class="bg-gray-900 fixed left-0 top-16 bottom-0 overflow-y-auto transition-all duration-300">
  <nav class="p-4">
    @for (item of menuItems; track item.id) {
      <a 
        [class]="sidebarCollapsed() ? 'justify-center' : ''"
        class="flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors mb-2">
        
        <!-- Icons -->
        @switch (item.icon) {
          @case ('home') {
            <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
          }
          @case ('chart') {
            <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          }
          @case ('users') {
            <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
          }
          @default {
            <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          }
        }
        
        <!-- Label (hidden when collapsed) -->
        @if (!sidebarCollapsed()) {
          <span class="font-medium">{{ item.label }}</span>
        }
      </a>
    }
  </nav>
</aside>
```

### 3.3 Actualizar el main content

```typescript
<!-- Content -->
<main 
  [class]="sidebarCollapsed() ? 'ml-20' : 'ml-64'"
  class="flex-1 p-6 transition-all duration-300">
  
  <!-- Grid de cards -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
    @for (card of statsCards; track card.id) {
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-medium text-gray-500">{{ card.title }}</h3>
          <span [class]="card.iconBg" class="p-2 rounded-lg">
            <svg [class]="card.iconColor" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="card.iconPath"/>
            </svg>
          </span>
        </div>
        <p class="text-2xl font-bold text-gray-900">{{ card.value }}</p>
        <p class="text-sm text-gray-500 mt-1">{{ card.change }}</p>
      </div>
    }
  </div>
  
  <!-- Placeholder para contenido adicional -->
  <ng-content></ng-content>
</main>
```

### 3.4 Agregar datos de las cards

```typescript
export class DashboardLayoutComponent {
  // ... código anterior ...

  statsCards = [
    {
      id: 1,
      title: 'Usuarios Totales',
      value: '12,345',
      change: '+12% desde el mes pasado',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      iconPath: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
    },
    {
      id: 2,
      title: 'Ventas del Mes',
      value: '$45,678',
      change: '+8% desde el mes pasado',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      iconPath: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v1m0 0h.01M12 12h.01M12 16h.01M12 20h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    {
      id: 3,
      title: 'Pedidos Pendientes',
      value: '234',
      change: '-3% desde ayer',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      iconPath: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
    }
  ];
}
```

---

## Paso 4: Agregar Responsive Design (10 min)

### 4.1 Sidebar responsive

Actualiza la sidebar para que sea responsive:

```typescript
<!-- Sidebar -->
<aside 
  [class]="getSidebarClasses()"
  class="bg-gray-900 fixed left-0 top-16 bottom-0 overflow-y-auto transition-all duration-300">
  <!-- ... contenido ... -->
</aside>
```

### 4.2 Método helper para clases

```typescript
getSidebarClasses(): string {
  const base = 'bg-gray-900 fixed left-0 top-16 bottom-0 overflow-y-auto transition-all duration-300';
  
  if (this.sidebarCollapsed()) {
    return `${base} w-20 lg:w-20`;
  }
  
  return `${base} w-64 lg:w-64`;
}
```

### 4.3 Main content responsive

```typescript
<!-- Content -->
<main 
  [class]="sidebarCollapsed() ? 'ml-20 lg:ml-20' : 'ml-64 lg:ml-64'"
  class="flex-1 p-4 md:p-6 transition-all duration-300">
  <!-- ... contenido ... -->
</main>
```

### 4.4 Grid responsive mejorado

```typescript
<!-- Grid de cards -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-6">
  <!-- Cards -->
</div>
```

---

## Paso 5: Agregar Transiciones (5 min)

### 5.1 Transiciones suaves

Agrega transiciones para mejorar la UX:

```typescript
// En el template, actualiza las clases de transición

<!-- Header button -->
<button class="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">

<!-- Sidebar link -->
<a class="flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200 mb-2">

<!-- Card -->
<div class="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 p-6">
```

---

## Código Completo

### dashboard-layout.component.ts

```typescript
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="h-16 bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div class="h-full flex items-center justify-between px-4">
          <div class="flex items-center gap-4">
            <button 
              (click)="toggleSidebar()"
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
            <h1 class="text-xl font-semibold text-gray-900">Dashboard</h1>
          </div>

          <div class="flex items-center gap-2">
            <button class="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 relative">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <button class="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div class="flex pt-16">
        <!-- Sidebar -->
        <aside 
          [class]="sidebarCollapsed() ? 'w-20' : 'w-64'"
          class="bg-gray-900 fixed left-0 top-16 bottom-0 overflow-y-auto transition-all duration-300">
          <nav class="p-4">
            @for (item of menuItems; track item.id) {
              <a 
                [class]="sidebarCollapsed() ? 'justify-center' : ''"
                class="flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200 mb-2">
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
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
            @for (card of statsCards; track card.id) {
              <div class="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 p-6">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-sm font-medium text-gray-500">{{ card.title }}</h3>
                </div>
                <p class="text-2xl font-bold text-gray-900">{{ card.value }}</p>
                <p class="text-sm text-gray-500 mt-1">{{ card.change }}</p>
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

## Verificación

### Checklist de completitud:

- [ ] El header está fijo en la parte superior
- [ ] La sidebar se colapsa y expande correctamente
- [ ] El contenido principal se ajusta cuando la sidebar cambia
- [ ] Las cards se muestran en grid responsive
- [ ] Las transiciones son suaves
- [ ] El layout funciona en diferentes tamaños de pantalla

### Comando de verificación:

```bash
# Iniciar el servidor de desarrollo
npm start

# Navegar a http://localhost:4200
# Verificar que el layout se renderiza correctamente
```

---

## Retos Adicionales

### Reto 1: Agregar más breakpoints
Hacer que la sidebar se oculte completamente en mobile (< 768px) y se muestre con un botón de hamburger.

### Reto 2: Agregar animaciones
Implementar animaciones de entrada/salida para las cards usando las clases de animación de Tailwind.

### Reto 3: Persistir estado
Guardar el estado de la sidebar (colapsada/expandida) en localStorage.

---

## Solución de Problemas

### Problema: Las clases no aplican
**Solución:** Verifica que Tailwind CSS esté configurado correctamente en `styles.css`.

### Problema: El layout no es responsive
**Solución:** Asegúrate de usar los prefijos de breakpoint correctos (sm, md, lg, xl).

### Problema: Las transiciones no funcionan
**Solución:** Agrega `transition-all duration-300` a los elementos que necesitan animación.

---

*Lab 01 - Día 14 - Curso Angular 21 - UyuniAdmin Frontend*
