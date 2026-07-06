# Slides: Día 14 - Estilos con Tailwind CSS v4

## Slide 1: Portada

```
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║     ████████╗██╗   ██╗██████╗ ███████╗██████╗                 ║
║     ╚══██╔══╝██║   ██║██╔══██╗██╔════╝██╔══██╗                ║
║        ██║   ██║   ██║██████╔╝█████╗  ██████╔╝                ║
║        ██║   ██║   ██║██╔══██╗██╔══╝  ██╔══██╗                ║
║        ██║   ╚██████╔╝██║  ██║███████╗██║  ██║                ║
║        ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝                ║
║                                                                ║
║                    CSS v4                                      ║
║                                                                ║
║     █████╗ ██████╗ ██████╗ ██████╗                            ║
║    ██╔══██╗██╔══██╗██╔══██╗██╔══██╗                           ║
║    ███████║██████╔╝██████╔╝██████╔╝                           ║
║    ██╔══██║██╔══██╗██╔══██╗██╔══██╗                           ║
║    ██║  ██║██████╔╝██████╔╝██████╔╝                           ║
║    ╚═╝  ╚═╝╚═════╝ ╚═════╝ ╚═════╝                            ║
║                                                                ║
║              [Día 14 - Módulo 5: UI y Estilos]                 ║
║                                                                ║
║     Curso Angular 21 - UyuniAdmin Frontend                     ║
║     Duración: 4 horas                                          ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- Bienvenida al día 14 del curso
- Este día es parte del Módulo 5: UI y Estilos
- Complementa el día anterior sobre PrimeNG

---

## Slide 2: Agenda del Día

```
╔════════════════════════════════════════════════════════════════╗
║                        📋 AGENDA                               ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   1️⃣  Introducción a Tailwind CSS v4         [45 min]         ║
║       • ¿Qué es y por qué v4?                                  ║
║       • Configuración con Angular                              ║
║       • El sistema @theme                                      ║
║                                                                ║
║   2️⃣  Utility Classes                        [60 min]         ║
║       • Layout: flex, grid                                     ║
║       • Spacing y sizing                                       ║
║       • Responsive design                                      ║
║                                                                ║
║   3️⃣  Personalización con @theme             [45 min]         ║
║       • Variables CSS                                          ║
║       • Utilidades personalizadas                              ║
║       • Design tokens                                          ║
║                                                                ║
║   4️⃣  Integración con PrimeNG                [30 min]         ║
║       • Plugin tailwindcss-primeui                             ║
║       • Sobrescribir estilos                                   ║
║                                                                ║
║   5️⃣  Dark Mode y Responsive                 [30 min]         ║
║       • Implementación                                         ║
║       • Persistencia                                           ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- El día está dividido en 5 secciones principales
- Hay 2 labs prácticos
- El enfoque es hands-on desde el inicio

---

## Slide 3: El Problema del CSS Tradicional

```
╔════════════════════════════════════════════════════════════════╗
║                    ❌ EL PROBLEMA                              ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   📄 styles.css (5000+ líneas)                                 ║
║                                                                ║
║   .card-title {                                                ║
║     font-size: 24px;                                           ║
║     font-weight: bold;                                         ║
║     color: #333;                                               ║
║     margin-bottom: 16px;                                       ║
║     /* ¿Qué más hace esta clase? */                            ║
║   }                                                            ║
║                                                                ║
║   ┌─────────────────────────────────────────────────────────┐  ║
║   │  🤔 ¿Qué problemas ves aquí?                             │  ║
║   │                                                          │  ║
║   │  • Nombres arbitrarios                                   │  ║
║   │  • CSS no utilizado (80%)                                │  ║
║   │  • Guerras de especificidad                              │  ║
║   │  • Difícil de mantener                                   │  ║
║   └─────────────────────────────────────────────────────────┘  ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- Pregunta a los estudiantes: ¿Qué problemas ven?
- El 80% del CSS no se usa en producción
- Los nombres de clases son inconsistentes
- `!important` se vuelve necesario

---

## Slide 4: La Solución - Tailwind CSS

```
╔════════════════════════════════════════════════════════════════╗
║                    ✅ LA SOLUCIÓN                              ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   🎯 Utility-First CSS                                         ║
║                                                                ║
║   <!-- Antes: CSS tradicional -->                              ║
║   <div class="card-title">Título</div>                         ║
║                                                                ║
║   <!-- Después: Tailwind -->                                   ║
║   <div class="text-2xl font-bold text-gray-900 mb-4">          ║
║     Título                                                     ║
║   </div>                                                       ║
║                                                                ║
║   ┌─────────────────────────────────────────────────────────┐  ║
║   │  ✨ Ventajas                                             │  ║
║   │                                                          │  ║
║   │  • Sin cambiar entre archivos                            │  ║
║   │  • Design system consistente                             │  ║
║   │  • Tree-shaking automático                               │  ║
║   │  • Responsive integrado                                  │  ║
║   └─────────────────────────────────────────────────────────┘  ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- Cada clase mapea a una propiedad CSS
- No hay que cambiar entre HTML y CSS
- El design system está predefinido
- Solo se incluye lo que usas

---

## Slide 5: Tailwind CSS v4 - Novedades

```
╔════════════════════════════════════════════════════════════════╗
║                   🆕 NOVEDADES v4                               ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   ┌──────────────────┬────────────────┬──────────────────────┐ ║
║   │   Característica │      v3        │         v4           │ ║
║   ├──────────────────┼────────────────┼──────────────────────┤ ║
║   │ Configuración    │ tailwind.      │ CSS-first            │ ║
║   │                  │ config.js      │ con @theme           │ ║
║   ├──────────────────┼────────────────┼──────────────────────┤ ║
║   │ Build engine     │ PostCSS + JIT  │ Oxide (Rust)         │ ║
║   │                  │                │ 10x más rápido       │ ║
║   ├──────────────────┼────────────────┼──────────────────────┤ ║
║   │ CSS Variables    │ Manual         │ Automático           │ ║
║   ├──────────────────┼────────────────┼──────────────────────┤ ║
║   │ Bundle size      │ ~10KB          │ ~5KB                 │ ║
║   └──────────────────┴────────────────┴──────────────────────┘ ║
║                                                                ║
║   🚀 El engine Oxide está escrito en Rust                      ║
║   🎨 @theme permite configuración en CSS                       ║
║   📦 Bundle 50% más pequeño                                     ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- v4 es un salto significativo
- Oxide engine es increíblemente rápido
- CSS-first es más intuitivo
- El bundle es más pequeño

---

## Slide 6: Configuración con Angular

```
╔════════════════════════════════════════════════════════════════╗
║                 ⚙️ CONFIGURACIÓN                               ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   📦 Instalación                                               ║
║                                                                ║
║   npm install tailwindcss @tailwindcss/postcss                 ║
║                                                                ║
║   ──────────────────────────────────────────────────────────── ║
║                                                                ║
║   📄 .postcssrc.json                                           ║
║                                                                ║
║   {                                                            ║
║     "plugins": {                                               ║
║       "@tailwindcss/postcss": {}                               ║
║     }                                                          ║
║   }                                                            ║
║                                                                ║
║   ──────────────────────────────────────────────────────────── ║
║                                                                ║
║   📄 src/styles.css                                            ║
║                                                                ║
║   @import "tailwindcss";                                       ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- Solo 2 pasos: instalar y configurar
- No más `tailwind.config.js`
- PostCSS procesa los estilos

---

## Slide 7: El Sistema @theme

```
╔════════════════════════════════════════════════════════════════╗
║                   🎨 @theme DIRECTIVE                          ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   📄 src/styles.css                                            ║
║                                                                ║
║   @import "tailwindcss";                                       ║
║                                                                ║
║   @theme {                                                     ║
║     /* Colores personalizados */                               ║
║     --color-brand: #38240c;                                    ║
║     --color-brand-light: #c4a77d;                              ║
║                                                                ║
║     /* Fuentes */                                              ║
║     --font-family-sans: 'Roboto', sans-serif;                  ║
║                                                                ║
║     /* Espaciado */                                            ║
║     --spacing-main: 1.5rem;                                    ║
║   }                                                            ║
║                                                                ║
║   ┌─────────────────────────────────────────────────────────┐  ║
║   │  💡 Cada variable genera utilidades automáticamente     │  ║
║   │                                                          │  ║
║   │  --color-brand → bg-brand, text-brand, border-brand     │  ║
║   └─────────────────────────────────────────────────────────┘  ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- @theme es el corazón de la configuración
- Las variables generan utilidades automáticamente
- Prefijos importantes: `--color-`, `--font-`, `--spacing-`

---

## Slide 8: Utility Classes - Layout

```
╔════════════════════════════════════════════════════════════════╗
║                   📐 LAYOUT UTILITIES                          ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   🔄 Flexbox                                                   ║
║                                                                ║
║   <div class="flex items-center justify-between">              ║
║     <div>Izquierda</div>                                       ║
║     <div>Derecha</div>                                         ║
║   </div>                                                       ║
║                                                                ║
║   ──────────────────────────────────────────────────────────── ║
║                                                                ║
║   📊 Grid                                                      ║
║                                                                ║
║   <div class="grid grid-cols-3 gap-4">                         ║
║     <div>1</div>                                               ║
║     <div>2</div>                                               ║
║     <div>3</div>                                               ║
║   </div>                                                       ║
║                                                                ║
║   ──────────────────────────────────────────────────────────── ║
║                                                                ║
║   📱 Responsive Grid                                           ║
║                                                                ║
║   <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"> ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- Flexbox para layouts lineales
- Grid para layouts bidimensionales
- Responsive con prefijos de breakpoint

---

## Slide 9: Utility Classes - Spacing

```
╔════════════════════════════════════════════════════════════════╗
║                   📏 SPACING UTILITIES                         ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   ┌─────────────────────────────────────────────────────────┐  ║
║   │  🎯 Regla de Oro                                         │  ║
║   │                                                          │  ║
║   │  p-* = padding (espacio DENTRO)                          │  ║
║   │  m-* = margin (espacio FUERA)                            │  ║
║   └─────────────────────────────────────────────────────────┘  ║
║                                                                ║
║   📐 Escala de espaciado                                       ║
║                                                                ║
║   ┌──────┬─────────┬───────────────┐                           ║
║   │ Clase│  Valor  │    Ejemplo    │                           ║
║   ├──────┼─────────┼───────────────┤                           ║
║   │ p-1  │ 0.25rem │ padding: 4px │                           ║
║   │ p-2  │ 0.5rem  │ padding: 8px │                           ║
║   │ p-4  │ 1rem    │ padding: 16px│                           ║
║   │ p-6  │ 1.5rem  │ padding: 24px│                           ║
║   │ p-8  │ 2rem    │ padding: 32px│                           ║
║   └──────┴─────────┴───────────────┘                           ║
║                                                                ║
║   🔤 Direcciones: t (top), r (right), b (bottom), l (left)     ║
║   pt-4, pr-4, pb-4, pl-4, px-4, py-4                           ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- La escala es consistente: 1 = 4px
- Direcciones: t, r, b, l
- Atajos: x (horizontal), y (vertical)

---

## Slide 10: Utility Classes - Tipografía

```
╔════════════════════════════════════════════════════════════════╗
║                   🔤 TYPOGRAPHY UTILITIES                      ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   📏 Tamaños de fuente                                         ║
║                                                                ║
║   text-xs    → 0.75rem  (12px)                                 ║
║   text-sm    → 0.875rem (14px)                                 ║
║   text-base  → 1rem     (16px)                                 ║
║   text-lg    → 1.125rem (18px)                                 ║
║   text-xl    → 1.25rem  (20px)                                 ║
║   text-2xl   → 1.5rem   (24px)                                 ║
║                                                                ║
║   ──────────────────────────────────────────────────────────── ║
║                                                                ║
║   🎨 Colores de texto                                          ║
║                                                                ║
║   text-gray-900  → #111827                                     ║
║   text-gray-600  → #4B5563                                     ║
║   text-gray-400  → #9CA3AF                                     ║
║   text-brand     → Tu color personalizado                      ║
║                                                                ║
║   ──────────────────────────────────────────────────────────── ║
║                                                                ║
║   💪 Pesos de fuente                                           ║
║                                                                ║
║   font-light   → 300                                           ║
║   font-normal  → 400                                           ║
║   font-medium  → 500                                           ║
║   font-bold    → 700                                           ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- La escala de tamaños es consistente
- Los colores siguen la paleta de Tailwind
- Los pesos son estándar

---

## Slide 11: Responsive Design

```
╔════════════════════════════════════════════════════════════════╗
║                   📱 RESPONSIVE DESIGN                         ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   📏 Breakpoints                                               ║
║                                                                ║
║   ┌────────┬─────────┬────────────────────────┐                ║
║   │ Prefijo│ Min-width│ Dispositivo          │                ║
║   ├────────┼─────────┼────────────────────────┤                ║
║   │ sm     │ 640px   │ Mobile landscape      │                ║
║   │ md     │ 768px   │ Tablet                │                ║
║   │ lg     │ 1024px  │ Desktop               │                ║
║   │ xl     │ 1280px  │ Large desktop         │                ║
║   │ 2xl    │ 1536px  │ Extra large           │                ║
║   └────────┴─────────┴────────────────────────┘                ║
║                                                                ║
║   ──────────────────────────────────────────────────────────── ║
║                                                                ║
║   🎯 Mobile-First Approach                                     ║
║                                                                ║
║   <!-- Base: mobile, luego sobrescribir -->                    ║
║   <div class="text-sm md:text-base lg:text-lg">                ║
║                                                                ║
║   <!-- Grid responsive -->                                     ║
║   <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"> ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- Mobile-first: estilos base para mobile
- Los breakpoints sobrescriben hacia arriba
- Ordenar de menor a mayor

---

## Slide 12: @utility Personalizado

```
╔════════════════════════════════════════════════════════════════╗
║                   🔧 @utility CUSTOM                           ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   📄 src/styles.css                                            ║
║                                                                ║
║   /* Scrollbar personalizado */                                ║
║   @utility custom-scrollbar {                                  ║
║     &::-webkit-scrollbar {                                     ║
║       width: 6px;                                              ║
║     }                                                          ║
║     &::-webkit-scrollbar-thumb {                               ║
║       @apply bg-gray-300 rounded-full;                         ║
║     }                                                          ║
║   }                                                            ║
║                                                                ║
║   /* Texto truncado */                                         ║
║   @utility line-clamp-2 {                                      ║
║     display: -webkit-box;                                      ║
║     -webkit-line-clamp: 2;                                     ║
║     -webkit-box-orient: vertical;                              ║
║     overflow: hidden;                                          ║
║   }                                                            ║
║                                                                ║
║   ──────────────────────────────────────────────────────────── ║
║                                                                ║
║   📄 Uso                                                       ║
║                                                                ║
║   <div class="h-64 overflow-y-auto custom-scrollbar">          ║
║   <p class="line-clamp-2">Texto largo...</p>                   ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- @utility crea clases personalizadas
- @apply reutiliza utilidades existentes
- Útil para estilos repetitivos

---

## Slide 13: Integración con PrimeNG

```
╔════════════════════════════════════════════════════════════════╗
║                 🔗 INTEGRACIÓN PRIMENG                         ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   📦 Plugin tailwindcss-primeui                                ║
║                                                                ║
║   @import "tailwindcss";                                       ║
║   @plugin "tailwindcss-primeui";                               ║
║                                                                ║
║   ──────────────────────────────────────────────────────────── ║
║                                                                ║
║   🎨 Estilizando componentes                                   ║
║                                                                ║
║   <!-- Con ! para !important -->                               ║
║   <p-button class="!bg-brand !text-white" />                   ║
║                                                                ║
║   <!-- Con styleClass -->                                      ║
║   <p-button styleClass="w-full" />                             ║
║                                                                ║
║   <!-- Con [style] -->                                         ║
║   <p-button [style]="{'background': '#38240c'}" />             ║
║                                                                ║
║   ┌─────────────────────────────────────────────────────────┐  ║
║   │  ⚠️ PrimeNG tiene especificidad alta                     │  ║
║   │     Usa ! para sobrescribir                              │  ║
║   └─────────────────────────────────────────────────────────┘  ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- El plugin integra Tailwind con PrimeNG
- PrimeNG tiene especificidad alta
- Usar `!` para aplicar estilos

---

## Slide 14: Dark Mode

```
╔════════════════════════════════════════════════════════════════╗
║                   🌙 DARK MODE                                 ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   🎯 Estrategia: class selector                                ║
║                                                                ║
║   <!-- Agregar clase .dark al <html> -->                       ║
║   <html class="dark">                                          ║
║                                                                ║
║   ──────────────────────────────────────────────────────────── ║
║                                                                ║
║   🎨 Uso en componentes                                        ║
║                                                                ║
║   <div class="bg-white dark:bg-gray-900">                      ║
║     <h1 class="text-gray-900 dark:text-white">                 ║
║       Título                                                   ║
║     </h1>                                                      ║
║   </div>                                                       ║
║                                                                ║
║   ──────────────────────────────────────────────────────────── ║
║                                                                ║
║   💾 Persistencia con localStorage                             ║
║                                                                ║
║   // Guardar preferencia                                       ║
║   localStorage.setItem('theme', 'dark');                       ║
║                                                                ║
║   // Aplicar al cargar                                         ║
║   if (localStorage.getItem('theme') === 'dark') {              ║
║     document.documentElement.classList.add('dark');            ║
║   }                                                            ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- Dark mode con prefijo `dark:`
- Agregar clase `.dark` al `<html>`
- Persistir preferencia en localStorage

---

## Slide 15: Ejemplo Completo - Dashboard

```
╔════════════════════════════════════════════════════════════════╗
║                🏗️ EJEMPLO COMPLETO                             ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   <div class="min-h-screen bg-gray-50 dark:bg-dark-bg">        ║
║                                                                ║
║     <!-- Header -->                                            ║
║     <header class="h-16 bg-white dark:bg-dark-surface          ║
║                   border-b border-gray-200 dark:border-gray-700 ║
║                   fixed top-0 left-0 right-0 z-50">            ║
║       <!-- ... -->                                             ║
║     </header>                                                  ║
║                                                                ║
║     <!-- Main content -->                                      ║
║     <main class="pt-16 p-6">                                   ║
║                                                                ║
║       <!-- Grid responsive -->                                 ║
║       <div class="grid grid-cols-1 md:grid-cols-2              ║
║                   lg:grid-cols-3 xl:grid-cols-4 gap-6">        ║
║                                                                ║
║         <!-- Card -->                                          ║
║         <div class="bg-white dark:bg-dark-surface              ║
║                     rounded-lg shadow p-6">                    ║
║           <h3 class="text-lg font-semibold                     ║
║                       text-gray-900 dark:text-white">          ║
║             Usuarios                                           ║
║           </h3>                                                ║
║           <p class="text-3xl font-bold text-brand">1,234</p>   ║
║         </div>                                                 ║
║                                                                ║
║       </div>                                                   ║
║     </main>                                                    ║
║   </div>                                                       ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- Layout completo con header fijo
- Grid responsive con 4 breakpoints
- Dark mode en todos los elementos

---

## Slide 16: Errores Comunes

```
╔════════════════════════════════════════════════════════════════╗
║                 ⚠️ ERRORES COMUNES                             ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   1️⃣  Orden de breakpoints incorrecto                          ║
║                                                                ║
║   ❌ <div class="lg:text-lg md:text-base text-sm">              ║
║   ✅ <div class="text-sm md:text-base lg:text-lg">              ║
║                                                                ║
║   ──────────────────────────────────────────────────────────── ║
║                                                                ║
║   2️⃣  Variables sin prefijo correcto                           ║
║                                                                ║
║   ❌ @theme { --brand: #38240c; }                               ║
║   ✅ @theme { --color-brand: #38240c; }                         ║
║                                                                ║
║   ──────────────────────────────────────────────────────────── ║
║                                                                ║
║   3️⃣  Especificidad con PrimeNG                                ║
║                                                                ║
║   ❌ <p-button class="bg-blue-500" />                           ║
║   ✅ <p-button class="!bg-blue-500" />                          ║
║                                                                ║
║   ──────────────────────────────────────────────────────────── ║
║                                                                ║
║   4️⃣  Confusión padding vs margin                              ║
║                                                                ║
║   ❌ "No sé si usar p-4 o m-4"                                  ║
║   ✅ p-* = dentro, m-* = fuera                                  ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- Mobile-first: ordenar de menor a mayor
- Prefijos obligatorios para generar utilidades
- `!` para sobrescribir PrimeNG
- p = padding (dentro), m = margin (fuera)

---

## Slide 17: Labs del Día

```
╔════════════════════════════════════════════════════════════════╗
║                    🧪 LABS                                     ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   📋 Lab 01: Layout y Spacing                                  ║
║                                                                ║
║   • Crear un layout de dashboard                               ║
║   • Header fijo (64px)                                         ║
║   • Sidebar colapsable (260px → 80px)                          ║
║   • Grid de cards responsive                                   ║
║   • Duración: 45 min                                           ║
║                                                                ║
║   ──────────────────────────────────────────────────────────── ║
║                                                                ║
║   📋 Lab 02: Dark Mode y Responsive                            ║
║                                                                ║
║   • Implementar toggle de dark mode                            ║
║   • Persistir preferencia en localStorage                      ║
║   • Aplicar estilos dark a todos los componentes               ║
║   • Crear versión mobile del layout                            ║
║   • Duración: 45 min                                           ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- Lab 01: Layout y spacing
- Lab 02: Dark mode y responsive
- Tiempo estimado: 90 min total

---

## Slide 18: Recursos Adicionales

```
╔════════════════════════════════════════════════════════════════╗
║                   📚 RECURSOS                                  ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   🌐 Documentación Oficial                                     ║
║                                                                ║
║   • Tailwind CSS v4 Docs                                       ║
║     https://tailwindcss.com/docs                               ║
║                                                                ║
║   • Tailwind CSS v4 Upgrade Guide                              ║
║     https://tailwindcss.com/docs/upgrade-guide                 ║
║                                                                ║
║   • tailwindcss-primeui                                        ║
║     https://github.com/primefaces/tailwindcss-primeui          ║
║                                                                ║
║   ──────────────────────────────────────────────────────────── ║
║                                                                ║
║   📁 Archivos del Proyecto                                     ║
║                                                                ║
║   • src/styles.css - Configuración de Tailwind                 ║
║   • .postcssrc.json - PostCSS config                           ║
║   • src/app/shared/layout/ - Layout components                 ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- Documentación oficial es excelente
- El proyecto tiene ejemplos reales
- Revisar styles.css para configuración

---

## Slide 19: Resumen del Día

```
╔════════════════════════════════════════════════════════════════╗
║                   📝 RESUMEN                                   ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   ✅ Lo que aprendimos hoy:                                    ║
║                                                                ║
║   1️⃣  Tailwind CSS v4 usa configuración CSS-first con @theme   ║
║                                                                ║
║   2️⃣  Utility classes mapean a propiedades CSS                 ║
║                                                                ║
║   3️⃣  @theme genera utilidades automáticamente                 ║
║                                                                ║
║   4️⃣  @utility crea clases personalizadas                      ║
║                                                                ║
║   5️⃣  Plugin primeui integra con PrimeNG                       ║
║                                                                ║
║   6️⃣  Dark mode con prefijo dark: y clase .dark                ║
║                                                                ║
║   7️⃣  Responsive con prefijos de breakpoint                    ║
║                                                                ║
║   ──────────────────────────────────────────────────────────── ║
║                                                                ║
║   🎯 Próximo día: Features y Componentes                       ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- Repasar los 7 puntos clave
- Asegurar que todos completaron los labs
- Preparar para el día 15

---

## Slide 20: Cierre

```
╔════════════════════════════════════════════════════════════════╗
║                   👋 CIERRE                                    ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║                    🎉 ¡Día 14 Completado!                      ║
║                                                                ║
║   ┌─────────────────────────────────────────────────────────┐  ║
║   │                                                          │  ║
║   │   📋 Checklist antes de continuar:                      │  ║
║   │                                                          │  ║
║   │   [ ] Completaste los 2 labs                             │  ║
║   │   [ ] Respondiste el assessment                          │  ║
║   │   [ ] Revisaste los recursos adicionales                 │  ║
║   │   [ ] Tienes dudas? Anótalas para el siguiente día      │  ║
║   │                                                          │  ║
║   └─────────────────────────────────────────────────────────┘  ║
║                                                                ║
║   ──────────────────────────────────────────────────────────── ║
║                                                                ║
║   📅 Próximo: Día 15 - Features y Componentes                  ║
║                                                                ║
║   🎯 Objetivo: Crear features completos                        ║
║                                                                ║
║                   ¡Nos vemos mañana! 👋                         ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- Verificar que todos completaron las actividades
- Responder preguntas
- Motivar para el siguiente día

---

*Slides de Presentación - Día 14 - Curso Angular 21 - UyuniAdmin Frontend*
