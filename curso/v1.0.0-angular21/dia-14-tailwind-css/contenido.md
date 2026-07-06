# Día 14: Contenido Detallado - Estilos con Tailwind CSS v4

## 1. Introducción a Tailwind CSS v4 (45 min)

### 1.1 Hook: El Problema del CSS Tradicional

**Situación:** Tienes un archivo CSS con 5000 líneas. Encuentras una clase llamada `.card-title` y no sabes qué hace exactamente. ¿Tiene margin? ¿Padding? ¿Qué color?

**Problema real:** El CSS tradicional tiene varios problemas:
- **Nombres arbitrarios**: `.card-title`, `.title-card`, `.cardTitle` - ¿cuál es correcto?
- **CSS no utilizado**: El 80% del CSS no se usa en producción
- **Especificidad**: `!important` wars
- **Mantenibilidad**: Cambiar un estilo puede romper otros

**Solución:** Tailwind CSS - utility-first CSS que te da clases predefinidas para cada propiedad CSS.

---

### 1.2 Contexto: ¿Qué es Tailwind CSS v4?

Tailwind CSS es un framework CSS utility-first que te permite construir diseños directamente en tu HTML usando clases predefinidas.

**Novedades de v4:**

| Característica | v3 | v4 |
|----------------|----|----|
| Configuración | `tailwind.config.js` | CSS-first con `@theme` |
| Build time | PostCSS + JIT | Oxide engine (Rust) |
| CSS variables | Manual | Automático |
| Performance | Rápido | 10x más rápido |
| Bundle size | ~10KB | ~5KB |

**Ventajas:**
- **Desarrollo rápido**: No cambias entre HTML y CSS
- **Consistencia**: Usa el design system de Tailwind
- **Tree-shaking**: Solo incluyes lo que usas
- **Responsive**: Breakpoints integrados
- **Dark mode**: Soporte nativo

---

### 1.3 Explicación: Configuración con Angular

#### Instalación

```bash
npm install tailwindcss @tailwindcss/postcss
```

#### PostCSS Config

```json
// .postcssrc.json
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

#### styles.css

```css
/* src/styles.css */
@import "tailwindcss";

/* Con PrimeNG */
@import "tailwindcss";
@import "primeng/resources/primeng.css";
@import "primeicons/primeicons.css";
@plugin "tailwindcss-primeui";
```

#### El nuevo sistema @theme

```css
/* src/styles.css */
@import "tailwindcss";

@theme {
  /* Colores personalizados */
  --color-brand: #38240c;
  --color-brand-light: #c4a77d;
  
  /* Fuentes */
  --font-family-sans: 'Roboto', sans-serif;
  
  /* Espaciado */
  --spacing-main: 1.5rem;
  
  /* Breakpoints */
  --breakpoint-xs: 480px;
  --breakpoint-3xl: 1920px;
}
```

---

### 1.4 Demo: Primeros Pasos

#### Layout Básico

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-demo',
  standalone: true,
  template: `
    <!-- Container centrado -->
    <div class="max-w-4xl mx-auto p-6">
      <!-- Card con shadow -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <!-- Título -->
        <h1 class="text-2xl font-bold text-gray-900 mb-4">
          Bienvenido
        </h1>
        
        <!-- Párrafo -->
        <p class="text-gray-600 mb-6">
          Este es un ejemplo de Tailwind CSS v4.
        </p>
        
        <!-- Botón -->
        <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Click me
        </button>
      </div>
    </div>
  `
})
export class DemoComponent {}
```

**Desglose de clases:**
- `max-w-4xl`: max-width: 48rem
- `mx-auto`: margin-left: auto; margin-right: auto
- `p-6`: padding: 1.5rem
- `bg-white`: background-color: white
- `rounded-lg`: border-radius: 0.5rem
- `shadow-md`: box-shadow medium
- `text-2xl`: font-size: 1.5rem
- `font-bold`: font-weight: 700
- `text-gray-900`: color: #111827
- `mb-4`: margin-bottom: 1rem

---

### 1.5 Error Común: Clases Duplicadas

```typescript
// ❌ ERROR: Clases repetidas y difíciles de mantener
<div class="bg-white bg-white rounded-lg rounded-lg p-6 p-6">

// ✅ CORRECTO: Clases únicas y ordenadas
<div class="bg-white rounded-lg p-6">

// ✅ MEJOR: Usar @apply para componentes repetidos
// styles.css
.card {
  @apply bg-white rounded-lg shadow-md p-6;
}
```

---

### 1.6 Mini Reto: Card de Usuario

**Objetivo:** Crear una card de usuario con:
1. Avatar circular
2. Nombre en negrita
3. Email en gris
4. Badge de estado (activo/inactivo)
5. Botón de acción

**Solución:**

```typescript
@Component({
  selector: 'app-user-card',
  standalone: true,
  template: `
    <div class="bg-white rounded-lg shadow-md p-6 flex items-center gap-4">
      <!-- Avatar -->
      <img 
        [src]="user.avatar" 
        [alt]="user.name"
        class="w-16 h-16 rounded-full object-cover" />
      
      <!-- Info -->
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-900">{{ user.name }}</h3>
        <p class="text-sm text-gray-500">{{ user.email }}</p>
      </div>
      
      <!-- Status badge -->
      <span 
        [class]="user.active 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'"
        class="px-3 py-1 rounded-full text-sm font-medium">
        {{ user.active ? 'Activo' : 'Inactivo' }}
      </span>
      
      <!-- Button -->
      <button class="text-gray-400 hover:text-gray-600">
        <i class="pi pi-ellipsis-v"></i>
      </button>
    </div>
  `
})
export class UserCardComponent {
  @Input() user!: User;
}
```

---

### 1.7 Cierre de Sección

**Resumen:**
- Tailwind CSS v4 usa configuración CSS-first con `@theme`
- Las utility classes mapean directamente a propiedades CSS
- El nuevo engine Oxide es 10x más rápido
- Integración con Angular es simple

**Próximo paso:** Utility classes en detalle.

---

## 2. Utility Classes (60 min)

### 2.1 Hook: El Poder de las Utilidades

**Situación:** Necesitas un layout con:
- Header fijo
- Sidebar colapsable
- Contenido con scroll
- Footer pegado al fondo

**Con CSS tradicional:** 100+ líneas de CSS
**Con Tailwind:** 10 clases en el HTML

---

### 2.2 Contexto: Categorías de Utilidades

Tailwind organiza las utilidades en categorías:

| Categoría | Ejemplos |
|-----------|----------|
| **Layout** | flex, grid, container |
| **Spacing** | p-*, m-*, gap-* |
| **Sizing** | w-*, h-*, min-*, max-* |
| **Typography** | text-*, font-*, leading-* |
| **Colors** | bg-*, text-*, border-* |
| **Effects** | shadow-*, opacity-* |
| **Filters** | blur-*, brightness-* |
| **Transforms** | scale-*, rotate-* |
| **Transitions** | transition-*, duration-* |
| **Interactivity** | cursor-*, select-* |

---

### 2.3 Explicación: Layout con Flexbox

#### Flex Container

```html
<!-- Flex row -->
<div class="flex">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Flex column -->
<div class="flex flex-col">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Alineación -->
<div class="flex items-center justify-between">
  <div>Izquierda</div>
  <div>Derecha</div>
</div>

<!-- Gap -->
<div class="flex gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

#### Flex Items

```html
<!-- Grow -->
<div class="flex">
  <div class="flex-grow">Ocupa todo el espacio</div>
  <div>Fixed</div>
</div>

<!-- Shrink -->
<div class="flex">
  <div class="flex-shrink-0">No se encoge</div>
  <div class="flex-grow">Se encoge</div>
</div>
```

---

### 2.4 Demo: Grid System

#### Grid Básico

```html
<!-- Grid 3 columnas -->
<div class="grid grid-cols-3 gap-4">
  <div class="bg-blue-100 p-4">1</div>
  <div class="bg-blue-100 p-4">2</div>
  <div class="bg-blue-100 p-4">3</div>
</div>

<!-- Grid responsive -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div class="bg-blue-100 p-4">1</div>
  <div class="bg-blue-100 p-4">2</div>
  <div class="bg-blue-100 p-4">3</div>
</div>
```

#### Grid con Span

```html
<div class="grid grid-cols-4 gap-4">
  <!-- Span 2 columnas -->
  <div class="col-span-2 bg-blue-100 p-4">Span 2</div>
  <div class="bg-blue-100 p-4">1</div>
  <div class="bg-blue-100 p-4">2</div>
  
  <!-- Span 4 columnas -->
  <div class="col-span-4 bg-green-100 p-4">Full width</div>
</div>
```

---

### 2.5 Error Común: Spacing Confusion

```html
<!-- ❌ CONFUSIÓN: ¿p o m? -->
<div class="p-4 m-4">¿Cuál usar?</div>

<!-- ✅ REGLA: -->
<!-- p-* = padding (espacio DENTRO del elemento) -->
<!-- m-* = margin (espacio FUERA del elemento) -->

<!-- Ejemplo práctico -->
<div class="bg-blue-500 p-4">
  <div class="bg-white m-4 p-2">
    Padding: espacio dentro (azul)
    Margin: espacio fuera (blanco)
  </div>
</div>
```

---

### 2.6 Mini Reto: Dashboard Layout

**Objetivo:** Crear un layout de dashboard con:
1. Header fijo (64px altura)
2. Sidebar (260px, colapsable a 80px)
3. Contenido principal con scroll
4. Grid de cards (3 columnas en desktop)

**Solución:**

```typescript
@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  template: `
    <div class="min-h-screen flex flex-col">
      <!-- Header -->
      <header class="h-16 bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div class="h-full flex items-center justify-between px-4">
          <button (click)="toggleSidebar()" class="p-2 hover:bg-gray-100 rounded">
            <i class="pi pi-bars"></i>
          </button>
          <h1 class="text-lg font-semibold">Dashboard</h1>
          <div class="flex items-center gap-4">
            <button class="p-2 hover:bg-gray-100 rounded">
              <i class="pi pi-bell"></i>
            </button>
          </div>
        </div>
      </header>
      
      <!-- Main content -->
      <div class="flex flex-1 pt-16">
        <!-- Sidebar -->
        <aside 
          [class]="sidebarCollapsed() ? 'w-20' : 'w-64'"
          class="bg-gray-900 text-white transition-all duration-300 fixed left-0 top-16 bottom-0 overflow-y-auto">
          <nav class="p-4">
            @for (item of menuItems; track item.id) {
              <a 
                [class]="sidebarCollapsed() ? 'justify-center' : ''"
                class="flex items-center gap-3 p-3 rounded hover:bg-gray-800 mb-2">
                <i [class]="item.icon"></i>
                @if (!sidebarCollapsed()) {
                  <span>{{ item.label }}</span>
                }
              </a>
            }
          </nav>
        </aside>
        
        <!-- Content -->
        <main 
          [class]="sidebarCollapsed() ? 'ml-20' : 'ml-64'"
          class="flex-1 p-6 transition-all duration-300 bg-gray-50">
          
          <!-- Grid de cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (card of cards; track card.id) {
              <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-semibold mb-2">{{ card.title }}</h3>
                <p class="text-3xl font-bold text-blue-600">{{ card.value }}</p>
              </div>
            }
          </div>
        </main>
      </div>
    </div>
  `
})
export class DashboardLayoutComponent {
  sidebarCollapsed = signal(false);
  
  menuItems = [
    { id: 1, label: 'Dashboard', icon: 'pi pi-home' },
    { id: 2, label: 'Usuarios', icon: 'pi pi-users' },
    { id: 3, label: 'Reportes', icon: 'pi pi-chart-bar' },
    { id: 4, label: 'Configuración', icon: 'pi pi-cog' }
  ];
  
  cards = [
    { id: 1, title: 'Usuarios', value: '1,234' },
    { id: 2, title: 'Ventas', value: '$12,345' },
    { id: 3, title: 'Pedidos', value: '567' }
  ];
  
  toggleSidebar(): void {
    this.sidebarCollapsed.update(v => !v);
  }
}
```

---

### 2.7 Cierre de Sección

**Resumen:**
- Flexbox y Grid para layouts
- Spacing: padding dentro, margin fuera
- Responsive: prefijos de breakpoint (sm, md, lg, xl)
- Transiciones con `transition-all duration-300`

**Próximo paso:** Personalización con @theme.

---

## 3. Personalización con @theme (45 min)

### 3.1 Hook: Tu Marca en Tailwind

**Situación:** Tu empresa tiene colores corporativos. ¿Cómo los usas en Tailwind?

---

### 3.2 Contexto: El Sistema @theme

Tailwind CSS v4 introduce `@theme`, una directiva para definir tu design system directamente en CSS.

**Ventajas sobre v3:**
- No más `tailwind.config.js`
- Variables CSS automáticas
- IntelliSense mejorado
- Hot reload instantáneo

---

### 3.3 Explicación: Definir Variables

#### Colores Personalizados

```css
/* src/styles.css */
@import "tailwindcss";

@theme {
  /* Color primario */
  --color-brand: #38240c;
  --color-brand-light: #c4a77d;
  --color-brand-dark: #2e1d0a;
  
  /* Escala de grises personalizada */
  --color-gray-50: #f8fafc;
  --color-gray-100: #f1f5f9;
  --color-gray-900: #111827;
  
  /* Colores semánticos */
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
}
```

**Uso:**

```html
<button class="bg-brand text-white hover:bg-brand-dark">
  Botón con color de marca
</button>

<div class="border border-gray-100 bg-gray-50">
  Card con grises personalizados
</div>
```

#### Tipografía

```css
@theme {
  /* Fuentes */
  --font-family-sans: 'Roboto', system-ui, sans-serif;
  --font-family-mono: 'JetBrains Mono', monospace;
  
  /* Tamaños */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  
  /* Line heights */
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
}
```

#### Espaciado

```css
@theme {
  /* Espaciado base */
  --spacing-main: 1.5rem;
  --spacing-section: 3rem;
  
  /* Container */
  --container-padding: 1.5rem;
}
```

---

### 3.4 Demo: Utilidades Personalizadas

#### @utility para Custom CSS

```css
/* src/styles.css */
@import "tailwindcss";

@theme {
  --color-brand: #38240c;
}

/* Utilidad personalizada */
@utility custom-scrollbar {
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    @apply bg-gray-100 rounded-full;
  }
  
  &::-webkit-scrollbar-thumb {
    @apply bg-gray-300 rounded-full hover:bg-gray-400;
  }
}

/* Utilidad para texto truncado */
@utility line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@utility line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

**Uso:**

```html
<!-- Scrollbar personalizado -->
<div class="h-64 overflow-y-auto custom-scrollbar">
  <!-- Contenido largo -->
</div>

<!-- Texto truncado -->
<p class="line-clamp-2">
  Este texto se truncará después de dos líneas...
</p>
```

---

### 3.5 Error Común: Variables CSS vs Tailwind

```css
/* ❌ ERROR: Mezclar sintaxis */
@theme {
  --brand: #38240c; /* Falta el prefijo --color- */
}

/* ✅ CORRECTO: Usar prefijos correctos */
@theme {
  --color-brand: #38240c; /* Ahora funciona: bg-brand */
}

/* ✅ TAMBIÉN: Variables CSS puras */
:root {
  --header-height: 64px; /* No genera utilidad */
}

/* Uso */
.header {
  height: var(--header-height);
}
```

---

### 3.6 Mini Reto: Sistema de Colores

**Objetivo:** Crear un sistema de colores completo:
1. Color primario con variantes (50-900)
2. Colores semánticos (success, warning, error)
3. Utilidad para gradientes
4. Aplicar en un componente

**Solución:**

```css
/* src/styles.css */
@import "tailwindcss";

@theme {
  /* Primario */
  --color-primary-50: #f5f0e8;
  --color-primary-100: #e6d9c4;
  --color-primary-200: #d4bf9c;
  --color-primary-300: #c2a574;
  --color-primary-400: #b49256;
  --color-primary-500: #38240c;
  --color-primary-600: #2e1d0a;
  --color-primary-700: #231608;
  --color-primary-800: #191005;
  --color-primary-900: #0e0903;
  
  /* Semánticos */
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
}

/* Gradientes */
@utility gradient-primary {
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700));
}

@utility gradient-success {
  background: linear-gradient(135deg, #22c55e, #16a34a);
}
```

```typescript
@Component({
  template: `
    <!-- Usar colores -->
    <button class="bg-primary-500 text-white hover:bg-primary-600">
      Primario
    </button>
    
    <!-- Usar gradiente -->
    <div class="gradient-primary text-white p-6 rounded-lg">
      Card con gradiente
    </div>
    
    <!-- Semánticos -->
    <div class="bg-success/10 text-success border border-success/20 p-4 rounded">
      Mensaje de éxito
    </div>
  `
})
```

---

### 3.7 Cierre de Sección

**Resumen:**
- `@theme` define variables CSS que generan utilidades
- Prefijos importantes: `--color-`, `--font-`, `--spacing-`
- `@utility` crea clases personalizadas
- `@apply` reutiliza estilos existentes

**Próximo paso:** Integración con PrimeNG.

---

## 4. Integración con PrimeNG (30 min)

### 4.1 Hook: Lo Mejor de Dos Mundos

**Situación:** Tienes PrimeNG para componentes complejos y Tailwind para layout. ¿Cómo los haces trabajar juntos?

---

### 4.2 Contexto: Plugin tailwindcss-primeui

El plugin `tailwindcss-primeui` integra Tailwind CSS con PrimeNG:
- Sobrescribe estilos de PrimeNG
- Usa utilidades de Tailwind en componentes PrimeNG
- Mantiene el tema Aura como base

---

### 4.3 Explicación: Configuración

```css
/* src/styles.css */
@import "tailwindcss";
@import "primeng/resources/primeng.css";
@import "primeicons/primeicons.css";
@import "@primeuix/themes/aura";

/* Plugin para PrimeNG */
@plugin "tailwindcss-primeui";
```

**Qué hace el plugin:**
- Aplica estilos de Tailwind a componentes PrimeNG
- Permite usar utilidades en templates de PrimeNG
- Mantiene compatibilidad con el tema Aura

---

### 4.4 Demo: Estilizando Componentes PrimeNG

#### Botones Personalizados

```html
<!-- Botón PrimeNG con clases Tailwind -->
<p-button 
  label="Guardar"
  class="!bg-brand hover:!bg-brand-dark !border-brand"
  styleClass="w-full" />

<!-- Sobrescribir estilos -->
<p-button 
  label="Custom"
  [style]="{
    'background': 'linear-gradient(135deg, #38240c, #2e1d0a)',
    'border': 'none'
  }" />
```

#### Tabla con Tailwind

```html
<p-table 
  [value]="data"
  styleClass="!shadow-none !border !border-gray-200">
  
  <ng-template pTemplate="header">
    <tr class="!bg-gray-50">
      <th class="!font-semibold !text-gray-700">Nombre</th>
    </tr>
  </ng-template>
  
  <ng-template pTemplate="body" let-item>
    <tr class="hover:!bg-gray-50">
      <td class="!text-gray-900">{{ item.name }}</td>
    </tr>
  </ng-template>
</p-table>
```

---

### 4.5 Error Común: Especificidad CSS

```css
/* ❌ ERROR: Estilos no aplican por especificidad */
<p-button class="bg-blue-500" /> /* No funciona */

/* ✅ CORRECTO: Usar !important con ! */
<p-button class="!bg-blue-500" />

/* ✅ TAMBIÉN: Usar styleClass */
<p-button styleClass="bg-blue-500 text-white" />

/* ✅ MEJOR: Usar [style] */
<p-button [style]="{'background-color': '#3b82f6'}" />
```

---

### 4.6 Mini Reto: Card con PrimeNG y Tailwind

**Objetivo:** Crear una card que combine:
1. p-card de PrimeNG
2. Layout con Tailwind (flex, grid)
3. Estilos personalizados con @theme
4. Dark mode support

**Solución:**

```typescript
@Component({
  template: `
    <p-card 
      styleClass="!shadow-lg !border !border-gray-200 dark:!border-gray-700">
      
      <ng-template pTemplate="header">
        <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Estadísticas
          </h3>
          <p-button 
            icon="pi pi-refresh" 
            styleClass="!p-button-text !p-button-sm" />
        </div>
      </ng-template>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        @for (stat of stats; track stat.label) {
          <div class="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p class="text-2xl font-bold text-brand">{{ stat.value }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ stat.label }}</p>
          </div>
        }
      </div>
    </p-card>
  `
})
export class StatsCardComponent {
  stats = [
    { label: 'Usuarios', value: '1,234' },
    { label: 'Ventas', value: '$12K' },
    { label: 'Pedidos', value: '567' }
  ];
}
```

---

### 4.7 Cierre de Sección

**Resumen:**
- Plugin `tailwindcss-primeui` integra Tailwind con PrimeNG
- Usar `!` para sobrescribir estilos con `!important`
- `styleClass` para clases en el elemento raíz
- `[style]` para estilos inline dinámicos

**Próximo paso:** Dark mode y responsive.

---

## 5. Dark Mode y Responsive (30 min)

### 5.1 Hook: Experiencia Personalizada

**Situación:** Los usuarios esperan poder elegir entre modo claro y oscuro. ¿Cómo lo implementas?

---

### 5.2 Contexto: Dark Mode en Tailwind

Tailwind CSS tiene soporte nativo para dark mode:
- **Strategy**: `class` (usar clase `.dark`) o `media` (preferencia del sistema)
- **Uso**: Prefijo `dark:` para estilos en modo oscuro

---

### 5.3 Explicación: Implementar Dark Mode

#### Configuración

```css
/* src/styles.css */
@import "tailwindcss";

@theme {
  --color-dark-bg: #1a1a1a;
  --color-dark-surface: #252525;
  --color-dark-text: #e5e5e5;
}
```

#### Componente con Dark Mode

```typescript
@Component({
  template: `
    <div class="bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text p-6">
      <h1 class="text-2xl font-bold">
        Título
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Contenido que cambia en dark mode
      </p>
    </div>
  `
})
```

#### Toggle de Dark Mode

```typescript
import { Component, signal, effect } from '@angular/core';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  template: `
    <button 
      (click)="toggleTheme()"
      class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">
      @if (isDark()) {
        <i class="pi pi-sun text-yellow-500"></i>
      } @else {
        <i class="pi pi-moon text-gray-600"></i>
      }
    </button>
  `
})
export class ThemeToggleComponent {
  isDark = signal(false);
  
  constructor() {
    // Cargar preferencia guardada
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      this.isDark.set(true);
      document.documentElement.classList.add('dark');
    }
    
    // Effect para sincronizar
    effect(() => {
      if (this.isDark()) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    });
  }
  
  toggleTheme(): void {
    this.isDark.update(v => !v);
  }
}
```

---

### 5.4 Demo: Responsive Design

#### Breakpoints

```html
<!-- Mobile first -->
<div class="text-sm md:text-base lg:text-lg">
  Texto que crece con el viewport
</div>

<!-- Grid responsive -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  <!-- Items -->
</div>

<!-- Ocultar/Mostrar -->
<div class="hidden md:block">
  Solo visible en desktop
</div>

<div class="md:hidden">
  Solo visible en mobile
</div>
```

#### Breakpoints Personalizados

```css
@theme {
  --breakpoint-xs: 480px;
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
  --breakpoint-3xl: 1920px;
}
```

---

### 5.5 Error Común: Orden de Breakpoints

```html
<!-- ❌ ERROR: Orden incorrecto -->
<div class="lg:text-lg md:text-base text-sm">
  <!-- md nunca aplica porque lg tiene más especificidad -->
</div>

<!-- ✅ CORRECTO: Orden de menor a mayor -->
<div class="text-sm md:text-base lg:text-lg">
  <!-- Aplica correctamente: sm -> md -> lg -->
</div>
```

---

### 5.6 Mini Reto: Dashboard Responsive con Dark Mode

**Objetivo:** Crear un dashboard que:
1. Tenga grid responsive (1 col mobile, 2 tablet, 4 desktop)
2. Soporte dark mode
3. Persista la preferencia
4. Muestre diferentes elementos según viewport

**Solución:**

```typescript
@Component({
  selector: 'app-responsive-dashboard',
  standalone: true,
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors">
      <!-- Header -->
      <header class="bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-gray-700 p-4">
        <div class="flex items-center justify-between max-w-7xl mx-auto">
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          
          <app-theme-toggle />
        </div>
      </header>
      
      <!-- Content -->
      <main class="max-w-7xl mx-auto p-4 md:p-6">
        <!-- Grid responsive -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
          @for (card of cards; track card.id) {
            <div class="bg-white dark:bg-dark-surface rounded-lg shadow p-4 md:p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {{ card.title }}
                </h3>
                <i 
                  [class]="card.icon"
                  class="text-2xl text-brand"></i>
              </div>
              <p class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {{ card.value }}
              </p>
              <!-- Solo visible en desktop -->
              <p class="hidden xl:block text-sm text-gray-500 dark:text-gray-400 mt-2">
                {{ card.description }}
              </p>
            </div>
          }
        </div>
      </main>
    </div>
  `
})
export class ResponsiveDashboardComponent {
  cards = [
    { id: 1, title: 'Usuarios', value: '1,234', icon: 'pi pi-users', description: 'Usuarios activos' },
    { id: 2, title: 'Ventas', value: '$12K', icon: 'pi pi-dollar', description: 'Ventas del mes' },
    { id: 3, title: 'Pedidos', value: '567', icon: 'pi pi-shopping-cart', description: 'Pedidos pendientes' },
    { id: 4, title: 'Conversiones', value: '23%', icon: 'pi pi-chart-line', description: 'Tasa de conversión' }
  ];
}
```

---

### 5.7 Cierre de Sección

**Resumen:**
- Dark mode con prefijo `dark:` y clase `.dark`
- Persistir preferencia en localStorage
- Responsive con prefijos de breakpoint
- Mobile-first: ordenar breakpoints de menor a mayor

---

## Cierre del Día

### Resumen General

| Sección | Conceptos Clave |
|---------|-----------------|
| Introducción | Tailwind v4, @theme, configuración CSS-first |
| Utility Classes | Layout, spacing, grid, responsive |
| Personalización | @theme, @utility, variables CSS |
| PrimeNG Integration | Plugin primeui, styleClass, especificidad |
| Dark Mode | dark:, localStorage, responsive |

### Próximos Pasos

1. Completar los labs del día
2. Responder el assessment
3. Día 15: Features y Componentes

---

*Contenido Detallado - Día 14 - Curso Angular 21 - UyuniAdmin Frontend*
