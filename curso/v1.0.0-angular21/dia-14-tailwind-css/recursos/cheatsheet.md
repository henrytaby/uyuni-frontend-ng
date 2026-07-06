# Cheatsheet - Tailwind CSS v4

## Configuración

### Instalación

```bash
npm install tailwindcss @tailwindcss/postcss
```

### PostCSS Config

```json
// .postcssrc.json
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

### styles.css

```css
@import "tailwindcss";

/* Con PrimeNG */
@import "tailwindcss";
@plugin "tailwindcss-primeui";

/* Personalización */
@theme {
  --color-brand: #38240c;
  --font-family-sans: 'Roboto', sans-serif;
}
```

---

## @theme Directive

### Sintaxis

```css
@theme {
  /* Colores */
  --color-primary: #38240c;
  --color-secondary: #c4a77d;
  
  /* Fuentes */
  --font-family-sans: 'Roboto', sans-serif;
  --font-family-mono: 'JetBrains Mono', monospace;
  
  /* Espaciado */
  --spacing-main: 1.5rem;
  
  /* Breakpoints */
  --breakpoint-xs: 480px;
  --breakpoint-3xl: 1920px;
}
```

### Prefijos

| Prefijo | Genera | Ejemplo |
|---------|--------|---------|
| `--color-` | bg-*, text-*, border-* | `--color-brand` → `bg-brand` |
| `--font-family-` | font-* | `--font-family-sans` → `font-sans` |
| `--font-size-` | text-* | `--font-size-xl` → `text-xl` |
| `--spacing-` | p-*, m-*, gap-* | `--spacing-main` → `p-main` |
| `--breakpoint-` | Prefijos responsive | `--breakpoint-xs` → `xs:` |

---

## @utility Custom

### Sintaxis

```css
@utility nombre-utilidad {
  /* Estilos CSS */
}

@utility custom-scrollbar {
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    @apply bg-gray-300 rounded-full;
  }
}
```

### Uso de @apply

```css
@utility card-base {
  @apply bg-white rounded-lg shadow-md p-6;
}

@utility line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

---

## Spacing

### Escala

| Clase | Valor | Pixels |
|-------|-------|--------|
| `0` | 0 | 0px |
| `1` | 0.25rem | 4px |
| `2` | 0.5rem | 8px |
| `3` | 0.75rem | 12px |
| `4` | 1rem | 16px |
| `5` | 1.25rem | 20px |
| `6` | 1.5rem | 24px |
| `8` | 2rem | 32px |
| `10` | 2.5rem | 40px |
| `12` | 3rem | 48px |
| `16` | 4rem | 64px |
| `20` | 5rem | 80px |
| `24` | 6rem | 96px |

### Padding

```html
<div class="p-4">      <!-- padding: 1rem -->
<div class="px-4">     <!-- padding-left/right: 1rem -->
<div class="py-4">     <!-- padding-top/bottom: 1rem -->
<div class="pt-4">     <!-- padding-top: 1rem -->
<div class="pr-4">     <!-- padding-right: 1rem -->
<div class="pb-4">     <!-- padding-bottom: 1rem -->
<div class="pl-4">     <!-- padding-left: 1rem -->
```

### Margin

```html
<div class="m-4">      <!-- margin: 1rem -->
<div class="mx-4">     <!-- margin-left/right: 1rem -->
<div class="my-4">     <!-- margin-top/bottom: 1rem -->
<div class="mt-4">     <!-- margin-top: 1rem -->
<div class="mx-auto">  <!-- margin-left/right: auto (centrar) -->
```

---

## Layout

### Flexbox

```html
<div class="flex">                    <!-- display: flex -->
<div class="inline-flex">             <!-- display: inline-flex -->
<div class="flex-row">                <!-- flex-direction: row -->
<div class="flex-col">                <!-- flex-direction: column -->
<div class="flex-wrap">               <!-- flex-wrap: wrap -->

<!-- Alineación horizontal -->
<div class="justify-start">           <!-- justify-content: flex-start -->
<div class="justify-center">          <!-- justify-content: center -->
<div class="justify-end">             <!-- justify-content: flex-end -->
<div class="justify-between">         <!-- justify-content: space-between -->
<div class="justify-around">          <!-- justify-content: space-around -->

<!-- Alineación vertical -->
<div class="items-start">             <!-- align-items: flex-start -->
<div class="items-center">            <!-- align-items: center -->
<div class="items-end">               <!-- align-items: flex-end -->
<div class="items-stretch">           <!-- align-items: stretch -->

<!-- Flex items -->
<div class="flex-1">                  <!-- flex: 1 1 0% -->
<div class="flex-grow">               <!-- flex-grow: 1 -->
<div class="flex-shrink-0">           <!-- flex-shrink: 0 -->
```

### Grid

```html
<div class="grid">                    <!-- display: grid -->
<div class="grid-cols-1">             <!-- grid-template-columns: repeat(1, minmax(0, 1fr)) -->
<div class="grid-cols-2">             <!-- 2 columnas -->
<div class="grid-cols-3">             <!-- 3 columnas -->
<div class="grid-cols-4">             <!-- 4 columnas -->
<div class="grid-cols-6">             <!-- 6 columnas -->
<div class="grid-cols-12">            <!-- 12 columnas -->

<!-- Column span -->
<div class="col-span-2">              <!-- column-span: 2 -->
<div class="col-span-full">           <!-- column-span: full -->

<!-- Gap -->
<div class="gap-4">                   <!-- gap: 1rem -->
<div class="gap-x-4">                 <!-- column-gap: 1rem -->
<div class="gap-y-4">                 <!-- row-gap: 1rem -->
```

---

## Sizing

### Width

```html
<div class="w-4">      <!-- width: 1rem -->
<div class="w-64">     <!-- width: 16rem -->
<div class="w-full">   <!-- width: 100% -->
<div class="w-screen"> <!-- width: 100vw -->
<div class="w-auto">   <!-- width: auto -->
<div class="max-w-sm"> <!-- max-width: 24rem -->
<div class="max-w-md"> <!-- max-width: 28rem -->
<div class="max-w-lg"> <!-- max-width: 32rem -->
<div class="max-w-xl"> <!-- max-width: 36rem -->
<div class="max-w-4xl"> <!-- max-width: 56rem -->
```

### Height

```html
<div class="h-4">      <!-- height: 1rem -->
<div class="h-16">     <!-- height: 4rem -->
<div class="h-full">   <!-- height: 100% -->
<div class="h-screen"> <!-- height: 100vh -->
<div class="min-h-screen"> <!-- min-height: 100vh -->
```

---

## Typography

### Font Size

```html
<p class="text-xs">    <!-- 0.75rem (12px) -->
<p class="text-sm">    <!-- 0.875rem (14px) -->
<p class="text-base">  <!-- 1rem (16px) -->
<p class="text-lg">    <!-- 1.125rem (18px) -->
<p class="text-xl">    <!-- 1.25rem (20px) -->
<p class="text-2xl">   <!-- 1.5rem (24px) -->
<p class="text-3xl">   <!-- 1.875rem (30px) -->
<p class="text-4xl">   <!-- 2.25rem (36px) -->
```

### Font Weight

```html
<p class="font-light">    <!-- font-weight: 300 -->
<p class="font-normal">   <!-- font-weight: 400 -->
<p class="font-medium">   <!-- font-weight: 500 -->
<p class="font-semibold"> <!-- font-weight: 600 -->
<p class="font-bold">     <!-- font-weight: 700 -->
```

### Text Color

```html
<p class="text-gray-900">  <!-- #111827 -->
<p class="text-gray-600">  <!-- #4B5563 -->
<p class="text-gray-400">  <!-- #9CA3AF -->
<p class="text-white">     <!-- #ffffff -->
<p class="text-brand">     <!-- Tu color personalizado -->
```

### Text Alignment

```html
<p class="text-left">    <!-- text-align: left -->
<p class="text-center">  <!-- text-align: center -->
<p class="text-right">   <!-- text-align: right -->
<p class="text-justify"> <!-- text-align: justify -->
```

---

## Colors

### Background

```html
<div class="bg-white">      <!-- background-color: white -->
<div class="bg-gray-50">    <!-- background-color: #f9fafb -->
<div class="bg-gray-100">   <!-- background-color: #f3f4f6 -->
<div class="bg-gray-900">   <!-- background-color: #111827 -->
<div class="bg-brand">      <!-- Tu color personalizado -->
```

### Text

```html
<p class="text-gray-900">   <!-- color: #111827 -->
<p class="text-gray-600">   <!-- color: #4B5563 -->
<p class="text-blue-500">   <!-- color: #3b82f6 -->
<p class="text-red-500">    <!-- color: #ef4444 -->
```

### Border

```html
<div class="border">           <!-- border-width: 1px -->
<div class="border-2">         <!-- border-width: 2px -->
<div class="border-gray-200">  <!-- border-color: #e5e7eb -->
<div class="border-gray-700">  <!-- border-color: #374151 -->
```

---

## Borders & Radius

### Border Radius

```html
<div class="rounded-none">   <!-- border-radius: 0 -->
<div class="rounded-sm">     <!-- border-radius: 0.125rem -->
<div class="rounded">        <!-- border-radius: 0.25rem -->
<div class="rounded-md">     <!-- border-radius: 0.375rem -->
<div class="rounded-lg">     <!-- border-radius: 0.5rem -->
<div class="rounded-xl">     <!-- border-radius: 0.75rem -->
<div class="rounded-2xl">    <!-- border-radius: 1rem -->
<div class="rounded-full">   <!-- border-radius: 9999px -->
```

### Border Width

```html
<div class="border">      <!-- border-width: 1px -->
<div class="border-0">    <!-- border-width: 0 -->
<div class="border-2">    <!-- border-width: 2px -->
<div class="border-4">    <!-- border-width: 4px -->
<div class="border-t">    <!-- border-top-width: 1px -->
<div class="border-b">    <!-- border-bottom-width: 1px -->
```

---

## Effects

### Shadow

```html
<div class="shadow-sm">    <!-- box-shadow: small -->
<div class="shadow">       <!-- box-shadow: default -->
<div class="shadow-md">    <!-- box-shadow: medium -->
<div class="shadow-lg">    <!-- box-shadow: large -->
<div class="shadow-xl">    <!-- box-shadow: extra large -->
<div class="shadow-none">  <!-- box-shadow: none -->
```

### Opacity

```html
<div class="opacity-0">    <!-- opacity: 0 -->
<div class="opacity-25">   <!-- opacity: 0.25 -->
<div class="opacity-50">   <!-- opacity: 0.5 -->
<div class="opacity-75">   <!-- opacity: 0.75 -->
<div class="opacity-100">  <!-- opacity: 1 -->
```

---

## Responsive

### Breakpoints

| Prefijo | Min-width | Dispositivo |
|---------|-----------|-------------|
| (default) | 0px | Mobile |
| `sm:` | 640px | Mobile landscape |
| `md:` | 768px | Tablet |
| `lg:` | 1024px | Desktop |
| `xl:` | 1280px | Large desktop |
| `2xl:` | 1536px | Extra large |

### Uso

```html
<!-- Mobile first -->
<div class="text-sm md:text-base lg:text-lg">

<!-- Grid responsive -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

<!-- Ocultar/Mostrar -->
<div class="hidden md:block">      <!-- Solo desktop -->
<div class="md:hidden">            <!-- Solo mobile -->
<div class="hidden lg:flex">       <!-- Desktop large -->

<!-- Flex direction -->
<div class="flex flex-col lg:flex-row">
```

---

## Dark Mode

### Uso

```html
<!-- Background -->
<div class="bg-white dark:bg-gray-900">

<!-- Text -->
<p class="text-gray-900 dark:text-white">

<!-- Border -->
<div class="border-gray-200 dark:border-gray-700">

<!-- Shadow -->
<div class="shadow dark:shadow-gray-900/50">
```

### Toggle con JavaScript

```typescript
// Activar dark mode
document.documentElement.classList.add('dark');

// Desactivar dark mode
document.documentElement.classList.remove('dark');

// Toggle
document.documentElement.classList.toggle('dark');

// Verificar
const isDark = document.documentElement.classList.contains('dark');
```

---

## States

### Hover

```html
<button class="bg-blue-500 hover:bg-blue-600">
<div class="text-gray-600 hover:text-gray-900">
<a class="underline hover:no-underline">
```

### Focus

```html
<input class="border focus:border-blue-500 focus:ring-2">
<button class="focus:outline-none focus:ring-2">
```

### Active

```html
<button class="bg-blue-500 active:bg-blue-700">
```

### Disabled

```html
<button class="bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed">
```

---

## Transitions

### Duration

```html
<div class="transition duration-150">   <!-- 150ms -->
<div class="transition duration-300">   <!-- 300ms -->
<div class="transition duration-500">   <!-- 500ms -->
```

### Properties

```html
<div class="transition">              <!-- all properties -->
<div class="transition-colors">       <!-- color, background-color, border-color -->
<div class="transition-opacity">      <!-- opacity -->
<div class="transition-transform">    <!-- transform -->
<div class="transition-shadow">       <!-- box-shadow -->
```

### Transform

```html
<div class="scale-95 hover:scale-100">
<div class="rotate-0 hover:rotate-45">
<div class="translate-y-0 hover:-translate-y-1">
```

---

## PrimeNG Integration

### Plugin

```css
@import "tailwindcss";
@plugin "tailwindcss-primeui";
```

### Sobrescribir Estilos

```html
<!-- Con ! para !important -->
<p-button class="!bg-brand !text-white" />

<!-- Con styleClass -->
<p-button styleClass="w-full" />

<!-- Con [style] -->
<p-button [style]="{'background': '#38240c'}" />
```

---

## Patrones Comunes

### Card

```html
<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
    Título
  </h3>
  <p class="text-gray-600 dark:text-gray-400">
    Contenido
  </p>
</div>
```

### Button

```html
<button class="px-4 py-2 bg-blue-500 text-white rounded-lg 
               hover:bg-blue-600 transition-colors duration-200">
  Click me
</button>
```

### Container

```html
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <!-- Content -->
</div>
```

### Grid Dashboard

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <!-- Cards -->
</div>
```

---

*Cheatsheet - Día 14 - Curso Angular 21 - UyuniAdmin Frontend*
