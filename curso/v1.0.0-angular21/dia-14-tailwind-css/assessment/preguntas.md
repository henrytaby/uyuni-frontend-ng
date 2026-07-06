# Assessment: Día 14 - Estilos con Tailwind CSS v4

## Información del Assessment

| Atributo | Valor |
|----------|-------|
| **Tiempo estimado** | 30 minutos |
| **Preguntas** | 20 |
| **Puntaje mínimo** | 70% (14 respuestas correctas) |
| **Tipo** | Selección múltiple y código |

---

## Instrucciones

1. Lee cada pregunta cuidadosamente
2. Selecciona la respuesta correcta
3. Para preguntas de código, escribe el código solicitado
4. Al finalizar, verifica tus respuestas con la clave de respuestas

---

## Sección 1: Fundamentos de Tailwind CSS v4 (5 preguntas)

### Pregunta 1

**¿Cuál es la principal diferencia entre Tailwind CSS v3 y v4?**

a) v4 ya no usa utility classes  
b) v4 usa configuración CSS-first con `@theme` en lugar de `tailwind.config.js`  
c) v4 requiere jQuery para funcionar  
d) v4 solo funciona con React  

---

### Pregunta 2

**¿Qué directiva se usa en Tailwind CSS v4 para definir variables CSS personalizadas?**

a) `@config`  
b) `@define`  
c) `@theme`  
d) `@custom`  

---

### Pregunta 3

**¿Cuál es el comando correcto para instalar Tailwind CSS v4 con Angular?**

a) `npm install tailwindcss`  
b) `npm install tailwindcss @tailwindcss/postcss`  
c) `ng add tailwindcss`  
d) `npm install @angular/tailwind`  

---

### Pregunta 4

**¿Qué archivo se modifica para configurar PostCSS con Tailwind v4?**

a) `tailwind.config.js`  
b) `angular.json`  
c) `.postcssrc.json`  
d) `tsconfig.json`  

---

### Pregunta 5

**¿Cuál es el nuevo motor de build de Tailwind CSS v4?**

a) Webpack  
b) Vite  
c) Oxide (Rust)  
d) Esbuild  

---

## Sección 2: Utility Classes (5 preguntas)

### Pregunta 6

**¿Qué clase de Tailwind establece `padding: 1.5rem`?**

a) `p-1.5`  
b) `p-6`  
c) `padding-6`  
d) `p-24px`  

---

### Pregunta 7

**¿Cuál es la diferencia entre `p-4` y `m-4`?**

a) No hay diferencia, son intercambiables  
b) `p-4` es padding (espacio dentro), `m-4` es margin (espacio fuera)  
c) `p-4` es para elementos primarios, `m-4` para elementos secundarios  
d) `p-4` solo funciona en desktop, `m-4` en mobile  

---

### Pregunta 8

**¿Qué clases se necesitan para crear un contenedor flex con elementos centrados horizontal y verticalmente?**

a) `flex center-center`  
b) `flex items-center justify-center`  
c) `flexbox align-center`  
d) `display-flex center`  

---

### Pregunta 9

**¿Cómo se crea un grid de 3 columnas con gap de 4 unidades?**

a) `grid-3 gap-4`  
b) `grid grid-cols-3 gap-4`  
c) `display-grid columns-3 gap-4`  
d) `grid-template-3 gap-4`  

---

### Pregunta 10

**¿Qué clase hace que un elemento ocupe todo el espacio disponible en un flex container?**

a) `flex-full`  
b) `flex-grow`  
c) `flex-1`  
d) `width-full`  

---

## Sección 3: Personalización con @theme (5 preguntas)

### Pregunta 11

**¿Cuál es la sintaxis correcta para definir un color personalizado llamado "brand"?**

a) `@theme { brand: #38240c; }`  
b) `@theme { --brand: #38240c; }`  
c) `@theme { --color-brand: #38240c; }`  
d) `@theme { color-brand: #38240c; }`  

---

### Pregunta 12

**¿Qué utilidades se generan automáticamente al definir `--color-brand` en @theme?**

a) Solo `bg-brand`  
b) Solo `text-brand` y `bg-brand`  
c) `bg-brand`, `text-brand`, `border-brand`, y más  
d) No se generan utilidades automáticamente  

---

### Pregunta 13

**¿Qué directiva se usa para crear una clase personalizada en Tailwind v4?**

a) `@custom`  
b) `@utility`  
c) `@class`  
d) `@extend`  

---

### Pregunta 14

**¿Para qué se usa `@apply` dentro de una utilidad personalizada?**

a) Para importar estilos de otro archivo  
b) Para reutilizar utilidades existentes de Tailwind  
c) Para aplicar estilos inline  
d) Para importar fuentes  

---

### Pregunta 15

**¿Cuál es el prefijo correcto para definir una fuente en @theme?**

a) `--font-`  
b) `--font-family-`  
c) `--typeface-`  
d) `--text-`  

---

## Sección 4: Dark Mode y Responsive (5 preguntas)

### Pregunta 16

**¿Qué clase se usa para aplicar estilos en dark mode?**

a) `dark-mode:`  
b) `dark:`  
c) `night:`  
d) `theme-dark:`  

---

### Pregunta 17

**¿Dónde debe agregarse la clase `.dark` para activar el dark mode?**

a) En el `<body>`  
b) En cualquier elemento  
c) En el `<html>` o elemento raíz  
d) En el `<head>`  

---

### Pregunta 18

**¿Cuál es el orden correcto de breakpoints para mobile-first design?**

a) `lg:text-lg md:text-base text-sm`  
b) `text-sm lg:text-lg md:text-base`  
c) `text-sm md:text-base lg:text-lg`  
d) `lg:text-lg text-sm md:text-base`  

---

### Pregunta 19

**¿Qué breakpoint representa tablets en Tailwind?**

a) `sm:`  
b) `md:`  
c) `lg:`  
d) `xl:`  

---

### Pregunta 20

**¿Cómo se oculta un elemento solo en mobile y se muestra en desktop?**

a) `hidden desktop:block`  
b) `hidden md:block`  
c) `mobile:hidden desktop:show`  
d) `invisible md:visible`  

---

## Sección 5: Ejercicios de Código (Bonus)

### Ejercicio 1

**Escribe las clases de Tailwind para crear una card con:**
- Fondo blanco
- Border radius de 8px
- Sombra media
- Padding de 24px
- Dark mode con fondo oscuro

```html
<div class="_________________________">
  <!-- Card content -->
</div>
```

---

### Ejercicio 2

**Escribe la configuración @theme para:**
- Color primario: #38240c
- Color secundario: #c4a77d
- Fuente sans-serif: 'Roboto'

```css
@theme {
  /* Tu código aquí */
}
```

---

### Ejercicio 3

**Escribe las clases para un grid responsive que:**
- 1 columna en mobile
- 2 columnas en tablet
- 4 columnas en desktop
- Gap de 6 unidades

```html
<div class="_________________________">
  <!-- Grid items -->
</div>
```

---

## Clave de Respuestas

### Sección 1: Fundamentos

| Pregunta | Respuesta | Explicación |
|----------|-----------|-------------|
| 1 | b | v4 usa CSS-first con @theme, eliminando tailwind.config.js |
| 2 | c | @theme es la directiva para definir variables CSS |
| 3 | b | Se necesita @tailwindcss/postcss para la integración |
| 4 | c | .postcssrc.json configura PostCSS |
| 5 | c | Oxide es el motor Rust de v4, 10x más rápido |

### Sección 2: Utility Classes

| Pregunta | Respuesta | Explicación |
|----------|-----------|-------------|
| 6 | b | p-6 = padding: 1.5rem (6 × 0.25rem) |
| 7 | b | p = padding (dentro), m = margin (fuera) |
| 8 | b | items-center (vertical), justify-center (horizontal) |
| 9 | b | grid grid-cols-3 gap-4 |
| 10 | c | flex-1 es el shorthand para flex-grow: 1 |

### Sección 3: Personalización

| Pregunta | Respuesta | Explicación |
|----------|-----------|-------------|
| 11 | c | El prefijo --color- genera utilidades |
| 12 | c | bg-brand, text-brand, border-brand, etc. |
| 13 | b | @utility crea clases personalizadas |
| 14 | b | @apply reutiliza utilidades existentes |
| 15 | b | --font-family- para fuentes |

### Sección 4: Dark Mode y Responsive

| Pregunta | Respuesta | Explicación |
|----------|-----------|-------------|
| 16 | b | dark: es el prefijo para dark mode |
| 17 | c | La clase .dark va en el elemento html |
| 18 | c | Mobile-first: base → md → lg |
| 19 | b | md: = 768px (tablets) |
| 20 | b | hidden md:block oculta en mobile |

### Sección 5: Ejercicios de Código

**Ejercicio 1:**
```html
<div class="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800">
```

**Ejercicio 2:**
```css
@theme {
  --color-primary: #38240c;
  --color-secondary: #c4a77d;
  --font-family-sans: 'Roboto', sans-serif;
}
```

**Ejercicio 3:**
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
```

---

## Evaluación

| Puntaje | Resultado |
|---------|-----------|
| 18-20 | ¡Excelente! Dominas Tailwind CSS v4 |
| 15-17 | Muy bien. Repasa los conceptos que fallaste |
| 12-14 | Aprobado. Necesitas más práctica |
| < 12 | Repasa el contenido del día antes de continuar |

---

## Recursos para Repasar

- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [Tailwind CSS v4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)
- Contenido del Día 14: `contenido.md`
- Labs: `lab-01.md` y `lab-02.md`

---

*Assessment - Día 14 - Curso Angular 21 - UyuniAdmin Frontend*
