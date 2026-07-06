# Script de Video YouTube - Día 14: Tailwind CSS v4 con Angular

## Información del Video

| Atributo | Valor |
|----------|-------|
| **Título** | Tailwind CSS v4 con Angular 21 - Guía Completa |
| **Duración** | 35-40 minutos |
| **Formato** | Tutorial con demo en vivo |
| **Thumbnail** | Split screen: código vs resultado visual |

---

## Estructura del Video

### 0:00 - Introducción (2 min)

**[Cámara: Presentador en pantalla]**

**Presentador:** "¡Hola! Bienvenidos a un nuevo episodio del Curso de Angular 21. Hoy vamos a aprender Tailwind CSS v4, el framework de estilos que está revolucionando el desarrollo web."

**[B-Roll: Mostrar sitio web con estilos]**

**Presentador:** "Si alguna vez te has frustrado con archivos CSS de miles de líneas, donde no sabes qué hace cada clase, este video es para ti."

**[Cámara: Presentador]**

**Presentador:** "Veremos cómo configurar Tailwind v4 con Angular, usar utility classes, implementar dark mode, y mucho más. ¡Vamos a ello!"

---

### 2:00 - El Problema del CSS Tradicional (3 min)

**[Cámara: Screen recording - Mostrando archivo CSS largo]**

**Presentador:** "Mira este archivo CSS. Tiene más de 5000 líneas. Encuentra la clase 'card-title' y dime qué hace exactamente."

**[Zoom: En la clase .card-title]**

**Presentador:** "¿Tiene margin? ¿Padding? ¿Qué color? Para saberlo, tienes que buscar en el HTML, luego en el CSS... es una pesadilla."

**[Cámara: Presentador]**

**Presentador:** "El 80% de este CSS probablemente no se usa en producción. Y cuando intentas cambiar algo, rompes otras cosas por la especificidad."

**[Cámara: Screen recording - Mostrando Tailwind Play]**

**Presentador:** "Ahora mira esto. Con Tailwind, todo está en el HTML. Cada clase tiene un significado claro y predecible."

---

### 5:00 - Novedades de Tailwind CSS v4 (4 min)

**[Cámara: Presentador con gráfico]**

**Presentador:** "Tailwind CSS v4 trae cambios importantes. Primero, la configuración ahora es CSS-first."

**[Gráfico: Comparación v3 vs v4]**

**Presentador:** "En v3, tenías un archivo tailwind.config.js. En v4, usas la directiva @theme directamente en tu CSS."

**[Cámara: Presentador]**

**Presentador:** "Segundo, el motor de build. v4 usa Oxide, escrito en Rust. Es 10 veces más rápido que antes."

**Presentador:** "Tercero, el bundle es más pequeño. Pasamos de 10KB a 5KB en producción."

**[Cámara: Screen recording - Mostrando build rápido]**

**Presentador:** "Mira qué rápido compila. Esto es el motor Oxide en acción."

---

### 9:00 - Configuración con Angular (5 min)

**[Cámara: Screen recording - Terminal]**

**Presentador:** "Vamos a configurar Tailwind v4 con Angular. Primero, instalamos los paquetes."

**[Terminal: npm install tailwindcss @tailwindcss/postcss]**

**Presentador:** "Ahora creamos el archivo de configuración de PostCSS."

**[Editor: .postcssrc.json]**

```json
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

**Presentador:** "Y en nuestro archivo styles.css, importamos Tailwind."

**[Editor: src/styles.css]**

```css
@import "tailwindcss";
```

**Presentador:** "Si usas PrimeNG, también agregas el plugin."

```css
@import "tailwindcss";
@plugin "tailwindcss-primeui";
```

**[Cámara: Presentador]**

**Presentador:** "¡Eso es todo! No más archivos de configuración JavaScript."

---

### 14:00 - El Sistema @theme (5 min)

**[Cámara: Screen recording - Editor]**

**Presentador:** "Ahora veamos el sistema @theme, el corazón de la personalización en v4."

**[Editor: src/styles.css]**

```css
@theme {
  --color-brand: #38240c;
  --color-brand-light: #c4a77d;
  --font-family-sans: 'Roboto', sans-serif;
}
```

**Presentador:** "Cuando defines --color-brand, automáticamente tienes bg-brand, text-brand, border-brand, y más."

**[Cámara: Presentador]**

**Presentador:** "Es importante usar los prefijos correctos. --color- para colores, --font-family- para fuentes, --spacing- para espaciado."

**[Cámara: Screen recording - Componente]**

**Presentador:** "Mira cómo lo usamos en un componente."

```html
<button class="bg-brand text-white px-4 py-2 rounded">
  Botón con color de marca
</button>
```

---

### 19:00 - Utility Classes en Acción (6 min)

**[Cámara: Screen recording - Proyecto]**

**Presentador:** "Vamos a crear un layout de dashboard usando utility classes."

**[Editor: Componente]**

**Presentador:** "Primero, el contenedor principal."

```html
<div class="min-h-screen bg-gray-50">
```

**Presentador:** "min-h-screen significa altura mínima de 100vh. bg-gray-50 es el color de fondo."

**[Editor: Header]**

**Presentador:** "Ahora el header fijo."

```html
<header class="h-16 bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
```

**Presentador:** "h-16 es height de 4rem, que son 64 píxeles. fixed top-0 left-0 right-0 lo posiciona fijo arriba."

**[Cámara: Presentador]**

**Presentador:** "La regla de oro para espaciado: p es padding, el espacio DENTRO del elemento. m es margin, el espacio FUERA."

**[Editor: Grid]**

**Presentador:** "Para el grid de cards, usamos clases responsive."

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

**Presentador:** "Esto significa: 1 columna en mobile, 2 en tablet, 3 en desktop. Siempre de menor a mayor."

---

### 25:00 - Dark Mode (5 min)

**[Cámara: Presentador]**

**Presentador:** "El dark mode es casi obligatorio hoy en día. Tailwind lo hace muy fácil."

**[Cámara: Screen recording - Editor]**

**Presentador:** "Solo agregas el prefijo dark: a tus clases."

```html
<div class="bg-white dark:bg-gray-900">
  <h1 class="text-gray-900 dark:text-white">Título</h1>
</div>
```

**Presentador:** "Para activar el dark mode, agregas la clase 'dark' al elemento html."

**[Editor: ThemeService]**

**Presentador:** "En UyuniAdmin, creamos un ThemeService que maneja esto con signals."

```typescript
@Injectable({ providedIn: 'root' })
export class ThemeService {
  isDark = signal(false);
  
  constructor() {
    effect(() => {
      if (this.isDark()) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });
  }
}
```

**[Cámara: Demo en vivo]**

**Presentador:** "Mira cómo funciona en la aplicación. Al hacer click en el toggle, todo cambia a dark mode."

---

### 30:00 - Integración con PrimeNG (3 min)

**[Cámara: Screen recording - Editor]**

**Presentador:** "Si usas PrimeNG, hay un detalle importante: la especificidad."

**Presentador:** "PrimeNG tiene estilos con alta especificidad, así que necesitas usar el prefijo '!' para sobrescribir."

```html
<p-button class="!bg-brand !text-white" label="Guardar" />
```

**Presentador:** "El signo de exclamación genera !important en el CSS."

**[Cámara: Presentador]**

**Presentador:** "También puedes usar styleClass para clases en el elemento raíz, o el binding style para estilos inline."

---

### 33:00 - Demo Completa (4 min)

**[Cámara: Demo en vivo - Aplicación completa]**

**Presentador:** "Veamos todo junto en el proyecto UyuniAdmin."

**[Mostrar: Layout completo]**

**Presentador:** "Aquí tenemos el dashboard con header fijo, sidebar colapsable, grid de cards responsive, y dark mode."

**[Mostrar: Toggle de sidebar]**

**Presentador:** "La sidebar se colapsa de 260px a 80px. Todo con transiciones suaves."

**[Mostrar: Dark mode toggle]**

**Presentador:** "El dark mode funciona en toda la aplicación, y la preferencia se guarda en localStorage."

**[Mostrar: Responsive]**

**Presentador:** "En mobile, la sidebar se oculta y aparece con un overlay. El grid se adapta automáticamente."

---

### 37:00 - Resumen y Cierre (3 min)

**[Cámara: Presentador]**

**Presentador:** "Resumamos lo que aprendimos hoy."

**[Gráfico: Puntos clave]**

**Presentador:** "Primero: Tailwind v4 usa configuración CSS-first con @theme."

**Presentador:** "Segundo: las utility classes mapean directamente a propiedades CSS."

**Presentador:** "Tercero: @theme genera utilidades automáticamente con los prefijos correctos."

**Presentador:** "Cuarto: dark mode es simple con el prefijo dark:."

**Presentador:** "Quinto: para PrimeNG, usa el prefijo ! para sobrescribir estilos."

**[Cámara: Presentador]**

**Presentador:** "Te invito a completar los labs del día, donde crearás un layout completo por tu cuenta."

**Presentador:** "Si este video te fue útil, dale like y suscríbete para más contenido de Angular."

**Presentador:** "En el próximo video, hablaremos de Features y Componentes. ¡Nos vemos!"

**[Cámara: Outro con links]**

---

## Notas de Producción

### Visual

| Elemento | Especificación |
|----------|----------------|
| **Resolución** | 1920x1080 (1080p) |
| **Frame rate** | 30fps |
| **Aspect ratio** | 16:9 |
| **Font en código** | JetBrains Mono, 16px |
| **Tema de editor** | Dark (consistente con dark mode) |

### Audio

| Elemento | Especificación |
|----------|----------------|
| **Micrófono** | Condenser, calidad broadcast |
| **Sample rate** | 48kHz |
| **Bit depth** | 24-bit |
| **Reducción de ruido** | Aplicar en post-producción |

### B-Roll

| Escena | Duración | Descripción |
|--------|----------|-------------|
| CSS largo | 5s | Archivo CSS con scroll |
| Tailwind Play | 10s | Demo en playground |
| Build rápido | 5s | Terminal mostrando build |
| Demo app | 15s | Aplicación completa |

### Gráficos

| Gráfico | Tipo | Uso |
|---------|------|-----|
| v3 vs v4 | Tabla comparativa | Novedades |
| Escala spacing | Tabla | Utility classes |
| Breakpoints | Tabla | Responsive |
| Puntos clave | Lista animada | Cierre |

---

## Thumbnails Options

### Opción 1: Split Screen
- Izquierda: Código con clases de Tailwind
- Derecha: Resultado visual
- Texto: "Tailwind CSS v4 + Angular"

### Opción 2: Before/After
- Arriba: CSS tradicional (caótico)
- Abajo: Tailwind (limpio)
- Texto: "Adiós CSS caótico"

### Opción 3: Dark Mode
- Mitad light, mitad dark
- Texto: "Dark Mode en 5 minutos"

---

## SEO y Metadatos

### Título
```
Tailwind CSS v4 con Angular 21 - Guía Completa | Curso Angular
```

### Descripción
```
Aprende a usar Tailwind CSS v4 con Angular 21 en esta guía completa. 
Descubre el nuevo sistema @theme, utility classes, dark mode, e 
integración con PrimeNG. Incluye ejemplos prácticos del proyecto 
UyuniAdmin.

📦 Contenido:
0:00 - Introducción
2:00 - El problema del CSS tradicional
5:00 - Novedades de Tailwind v4
9:00 - Configuración con Angular
14:00 - Sistema @theme
19:00 - Utility classes
25:00 - Dark mode
30:00 - Integración con PrimeNG
33:00 - Demo completa
37:00 - Resumen

🔗 Recursos:
- Código: github.com/...
- Documentación: tailwindcss.com
- Curso completo: [playlist]

#TailwindCSS #Angular #WebDevelopment #Tutorial
```

### Tags
```
Tailwind CSS v4, Angular 21, Tutorial Angular, CSS Framework, 
Dark Mode, PrimeNG, Web Development, Frontend, Curso Angular, 
UyuniAdmin
```

---

## Call to Action

### En el video
- "Dale like si te fue útil"
- "Suscríbete para más contenido"
- "Comenta si tienes preguntas"
- "Revisa los labs en la descripción"

### En la descripción
- Link al repositorio
- Link a la playlist
- Link a la documentación
- Link a los labs

---

*Script de Video YouTube - Día 14 - Curso Angular 21 - UyuniAdmin Frontend*
