# Script de Audio/Podcast - Día 14: Tailwind CSS v4

## Información del Audio

| Atributo | Valor |
|----------|-------|
| **Duración estimada** | 25-30 minutos |
| **Formato** | Podcast educativo |
| **Audiencia** | Desarrolladores Angular con < 1 año de experiencia |

---

## Guion Completo

### Introducción (2 min)

**[Música de entrada suave, fade out]**

**Narrador:** "¡Bienvenidos al episodio 14 del Curso de Angular 21! Hoy vamos a hablar de un tema que revoluciona la forma en que escribimos estilos en nuestras aplicaciones: Tailwind CSS v4."

**Narrador:** "Soy tu instructor y hoy descubriremos cómo este framework utility-first puede acelerar tu desarrollo y hacer que tu código sea más mantenible."

**Narrador:** "Si alguna vez te has preguntado por qué tu archivo CSS tiene 5000 líneas y no sabes qué hace la clase 'card-title', este episodio es para ti."

---

### Sección 1: El Problema del CSS Tradicional (4 min)

**Narrador:** "Imagina esta situación: abres un proyecto legacy y encuentras un archivo styles.css con miles de líneas. Ves una clase llamada 'card-title' y no tienes idea de qué hace exactamente."

**Narrador:** "¿Tiene margin? ¿Padding? ¿Qué color de fondo usa? Para saberlo, tienes que buscar en el HTML, luego en el CSS, y posiblemente en varios archivos más."

**Narrador:** "Este es el problema del CSS tradicional: nombres arbitrarios, especificidad que se vuelve una pesadilla, y el famoso 80% de CSS que nunca se usa en producción."

**Narrador:** "Aquí es donde Tailwind CSS entra al rescate. En lugar de inventar nombres de clases, usas utilidades que mapean directamente a propiedades CSS."

**Narrador:** "Por ejemplo, en lugar de escribir una clase 'card-title' con font-size: 24px, font-weight: bold, y margin-bottom: 16px... simplemente escribes: text-2xl font-bold mb-4."

**Narrador:** "¿La ventaja? Nunca cambias entre archivos. Todo está en tu HTML. Y cuando necesitas cambiar algo, sabes exactamente qué hace cada clase."

---

### Sección 2: Tailwind CSS v4 - Novedades (4 min)

**Narrador:** "Ahora hablemos de las novedades de Tailwind CSS v4, porque esta versión es un salto significativo."

**Narrador:** "La diferencia más notable es la configuración. En v3, tenías un archivo tailwind.config.js. En v4, la configuración es CSS-first con la directiva @theme."

**Narrador:** "¿Qué significa esto? Que ahora defines tus variables directamente en tu archivo CSS, y Tailwind genera las utilidades automáticamente."

**Narrador:** "Otra mejora importante es el motor de build. v4 usa Oxide, un motor escrito en Rust que es 10 veces más rápido que el anterior."

**Narrador:** "También el bundle es más pequeño. Pasamos de aproximadamente 10KB a 5KB en producción. Menos código que el usuario tiene que descargar."

**Narrador:** "Y las variables CSS ahora son automáticas. Cuando defines un color en @theme, automáticamente tienes bg-color, text-color, border-color, y más."

---

### Sección 3: Configuración con Angular (4 min)

**Narrador:** "Vamos a lo práctico. ¿Cómo configuramos Tailwind CSS v4 con Angular?"

**Narrador:** "Primero, instalamos los paquetes necesarios: npm install tailwindcss @tailwindcss/postcss."

**Narrador:** "Luego, creamos un archivo .postcssrc.json con la configuración del plugin de PostCSS."

**Narrador:** "Finalmente, en nuestro archivo styles.css, importamos Tailwind con @import 'tailwindcss'."

**Narrador:** "Si usas PrimeNG, como en el proyecto UyuniAdmin, también agregas el plugin tailwindcss-primeui para la integración."

**Narrador:** "Y aquí viene la magia: defines tu tema con @theme. Por ejemplo, --color-brand: #38240c genera automáticamente bg-brand, text-brand, border-brand."

**Narrador:** "Es importante recordar los prefijos correctos: --color- para colores, --font-family- para fuentes, --spacing- para espaciado."

---

### Sección 4: Utility Classes (5 min)

**Narrador:** "Ahora hablemos de las utility classes, el corazón de Tailwind."

**Narrador:** "La regla de oro para espaciado es simple: p es padding, que es el espacio DENTRO del elemento. m es margin, que es el espacio FUERA del elemento."

**Narrador:** "La escala es consistente: p-4 significa padding de 1rem, que son 16 píxeles. p-6 es 1.5rem, o 24 píxeles."

**Narrador:** "Para layout, usamos flex y grid. Flex es ideal para layouts lineales, grid para layouts bidimensionales."

**Narrador:** "Un patrón común es 'flex items-center justify-between' para un header con elementos a los extremos."

**Narrador:** "Para grids responsive, usamos 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'. Esto significa: 1 columna en mobile, 2 en tablet, 3 en desktop."

**Narrador:** "Y aquí hay un error común: el orden de los breakpoints. Siempre debe ser de menor a mayor: base, luego sm, luego md, luego lg. Si lo inviertes, los estilos no aplicarán correctamente."

---

### Sección 5: Dark Mode (4 min)

**Narrador:** "El dark mode es casi obligatorio en aplicaciones modernas. Tailwind lo hace muy fácil."

**Narrador:** "La estrategia es usar el prefijo 'dark:' para los estilos en modo oscuro. Por ejemplo: bg-white dark:bg-gray-900."

**Narrador:** "Para activar el dark mode, agregas la clase 'dark' al elemento html del documento."

**Narrador:** "En el proyecto UyuniAdmin, creamos un ThemeService que maneja esto automáticamente. Usa signals para el estado y effect para sincronizar con el DOM."

**Narrador:** "También persistimos la preferencia en localStorage, así que cuando el usuario regresa, su tema preferido se mantiene."

**Narrador:** "Un tip importante: siempre prueba tu aplicación en ambos modos. Es fácil olvidar un color de texto que no tiene versión dark."

---

### Sección 6: Integración con PrimeNG (3 min)

**Narrador:** "Si usas PrimeNG, como en UyuniAdmin, hay un detalle importante: la especificidad."

**Narrador:** "PrimeNG tiene estilos con alta especificidad, así que para sobrescribirlos, necesitas usar el prefijo '!' que genera !important."

**Narrador:** "Por ejemplo: class='!bg-brand' en lugar de solo 'bg-brand'."

**Narrador:** "También puedes usar styleClass para clases en el elemento raíz del componente, o el binding [style] para estilos inline dinámicos."

**Narrador:** "El plugin tailwindcss-primeui facilita esta integración, permitiendo que Tailwind y PrimeNG trabajen juntos sin conflictos."

---

### Cierre y Resumen (3 min)

**Narrador:** "Resumamos lo que aprendimos hoy."

**Narrador:** "Primero, Tailwind CSS v4 usa configuración CSS-first con @theme, eliminando el archivo de configuración JavaScript."

**Narrador:** "Segundo, las utility classes mapean directamente a propiedades CSS, con una escala consistente y predecible."

**Narrador:** "Tercero, @theme genera utilidades automáticamente cuando usas los prefijos correctos."

**Narrador:** "Cuarto, el dark mode es simple con el prefijo dark: y la clase .dark en el html."

**Narrador:** "Quinto, para PrimeNG, usa el prefijo ! para sobrescribir estilos."

**Narrador:** "Te recomiendo completar los labs del día, donde crearás un layout de dashboard completo con dark mode y diseño responsive."

**Narrador:** "En el próximo episodio, hablaremos de Features y Componentes, donde integraremos todo lo aprendido hasta ahora."

**Narrador:** "¡Gracias por escuchar! Nos vemos en el próximo episodio del Curso de Angular 21."

**[Música de salida, fade in y out]**

---

## Notas de Producción

### Música
- **Entrada:** Música suave de tecnología, 10 segundos
- **Salida:** Misma música, 10 segundos
- **Transiciones:** Sin música, solo cambio de tono de voz

### Efectos de Sonido
- Sin efectos especiales
- Voz clara y pausada
- Pausas de 2-3 segundos entre secciones

### Tono
- Educativo pero conversacional
- Evitar jerga técnica excesiva
- Ejemplos concretos y prácticos

### Pacing
- Velocidad moderada
- Pausas después de conceptos importantes
- Énfasis en términos clave

---

## Puntos Clave para Destacar

1. **@theme** es el corazón de la configuración en v4
2. **p = padding (dentro), m = margin (fuera)**
3. **Mobile-first:** ordenar breakpoints de menor a mayor
4. **dark:** prefijo para dark mode
5. **!** para sobrescribir estilos de PrimeNG

---

## Referencias en el Tiempo

| Tiempo | Sección | Duración |
|--------|---------|----------|
| 00:00 | Introducción | 2 min |
| 02:00 | El Problema del CSS | 4 min |
| 06:00 | Novedades v4 | 4 min |
| 10:00 | Configuración | 4 min |
| 14:00 | Utility Classes | 5 min |
| 19:00 | Dark Mode | 4 min |
| 23:00 | PrimeNG Integration | 3 min |
| 26:00 | Cierre | 3 min |

---

*Script de Audio - Día 14 - Curso Angular 21 - UyuniAdmin Frontend*
