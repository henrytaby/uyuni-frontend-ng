Read aloud in a warm, welcoming, and professional educational tone. Use a conversational style at a slightly brisk pace. Do not linger on pauses.

Speaker 1: ¡Bienvenidos al episodio catorce del Curso de Angular veintiuno! Hoy vamos a hablar de un tema que revoluciona la forma en que escribimos estilos en nuestras aplicaciones: Tailwind CSS versión cuatro.

Speaker 1: Soy tu instructor y hoy descubriremos cómo este framework utility-first puede acelerar tu desarrollo y hacer que tu código sea más mantenible.

Speaker 1: Si alguna vez te has preguntado por qué tu archivo CSS tiene cinco mil líneas y no sabes qué hace la clase card-title, este episodio es para ti.

Speaker 1: Imagina esta situación: abres un proyecto legacy y encuentras un archivo styles.css con miles de líneas. Ves una clase llamada card-title y no tienes idea de qué hace exactamente.

Speaker 1: ¿Tiene margin? ¿Padding? ¿Qué color de fondo usa? Para saberlo, tienes que buscar en el HTML, luego en el CSS, y posiblemente en varios archivos más.

Speaker 1: Este es el problema del CSS tradicional: nombres arbitrarios, especificidad que se vuelve una pesadilla, y el famoso ochenta por ciento de CSS que nunca se usa en producción.

Speaker 1: Aquí es donde Tailwind CSS entra al rescate. En lugar de inventar nombres de clases, usas utilidades que mapean directamente a propiedades CSS.

Speaker 1: Por ejemplo, en lugar de escribir una clase card-title con font-size veinticuatro píxeles, font-weight bold, y margin-bottom dieciséis píxeles... simplemente escribes: text-dos-xl font-bold mb-cuatro.

Speaker 1: ¿La ventaja? Nunca cambias entre archivos. Todo está en tu HTML. Y cuando necesitas cambiar algo, sabes exactamente qué hace cada clase.

Speaker 1: Ahora hablemos de las novedades de Tailwind CSS versión cuatro, porque esta versión es un salto significativo.

Speaker 1: La diferencia más notable es la configuración. En versión tres, tenías un archivo tailwind.config.js. En versión cuatro, la configuración es CSS-first con la directiva arroba theme.

Speaker 1: ¿Qué significa esto? Que ahora defines tus variables directamente en tu archivo CSS, y Tailwind genera las utilidades automáticamente.

Speaker 1: Otra mejora importante es el motor de build. Versión cuatro usa Oxide, un motor escrito en Rust que es diez veces más rápido que el anterior.

Speaker 1: También el bundle es más pequeño. Pasamos de aproximadamente diez kilobytes a cinco kilobytes en producción. Menos código que el usuario tiene que descargar.

Speaker 1: Y las variables CSS ahora son automáticas. Cuando defines un color en arroba theme, automáticamente tienes bg-color, text-color, border-color, y más.

Speaker 1: Vamos a lo práctico. ¿Cómo configuramos Tailwind CSS versión cuatro con Angular?

Speaker 1: Primero, instalamos los paquetes necesarios: npm install tailwindcss arroba tailwindcss slash postcss.

Speaker 1: Luego, creamos un archivo punto postcssrc.json con la configuración del plugin de PostCSS.

Speaker 1: Finalmente, en nuestro archivo styles.css, importamos Tailwind con arroba import comilla tailwindcss comilla.

Speaker 1: Si usas PrimeNG, como en el proyecto UyuniAdmin, también agregas el plugin tailwindcss-primeui para la integración.

Speaker 1: Y aquí viene la magia: defines tu tema con arroba theme. Por ejemplo, guion guion color brand dos puntos numeral tres ocho dos cuatro cero c genera automáticamente bg-brand, text-brand, border-brand.

Speaker 1: Es importante recordar los prefijos correctos: guion guion color para colores, guion guion font family para fuentes, guion guion spacing para espaciado.

Speaker 1: Ahora hablemos de las utility classes, el corazón de Tailwind.

Speaker 1: La regla de oro para espaciado es simple: p es padding, que es el espacio DENTRO del elemento. m es margin, que es el espacio FUERA del elemento.

Speaker 1: La escala es consistente: p-cuatro significa padding de un rem, que son dieciséis píxeles. p-seis es uno punto cinco rem, o veinticuatro píxeles.

Speaker 1: Para layout, usamos flex y grid. Flex es ideal para layouts lineales, grid para layouts bidimensionales.

Speaker 1: Un patrón común es flex items-center justify-between para un header con elementos a los extremos.

Speaker 1: Para grids responsive, usamos grid grid-cols-uno md dos puntos grid-cols-dos lg dos puntos grid-cols-tres. Esto significa: una columna en mobile, dos en tablet, tres en desktop.

Speaker 1: Y aquí hay un error común: el orden de los breakpoints. Siempre debe ser de menor a mayor: base, luego sm, luego md, luego lg. Si lo inviertes, los estilos no aplicarán correctamente.

Speaker 1: El dark mode es casi obligatorio en aplicaciones modernas. Tailwind lo hace muy fácil.

Speaker 1: La estrategia es usar el prefijo dark dos puntos para los estilos en modo oscuro. Por ejemplo: bg-white dark dos puntos bg-gray-novecientos.

Speaker 1: Para activar el dark mode, agregas la clase dark al elemento html del documento.

Speaker 1: En el proyecto UyuniAdmin, creamos un ThemeService que maneja esto automáticamente. Usa signals para el estado y effect para sincronizar con el DOM.

Speaker 1: También persistimos la preferencia en localStorage, así que cuando el usuario regresa, su tema preferido se mantiene.

Speaker 1: Un tip importante: siempre prueba tu aplicación en ambos modos. Es fácil olvidar un color de texto que no tiene versión dark.

Speaker 1: Si usas PrimeNG, como en UyuniAdmin, hay un detalle importante: la especificidad.

Speaker 1: PrimeNG tiene estilos con alta especificidad, así que para sobrescribirlos, necesitas usar el prefijo signo de exclamación que genera important.

Speaker 1: Por ejemplo: class igual signo de exclamación bg-brand en lugar de solo bg-brand.

Speaker 1: También puedes usar styleClass para clases en el elemento raíz del componente, o el binding style para estilos inline dinámicos.

Speaker 1: El plugin tailwindcss-primeui facilita esta integración, permitiendo que Tailwind y PrimeNG trabajen juntos sin conflictos.

Speaker 1: Resumamos lo que aprendimos hoy.

Speaker 1: Primero, Tailwind CSS versión cuatro usa configuración CSS-first con arroba theme, eliminando el archivo de configuración JavaScript.

Speaker 1: Segundo, las utility classes mapean directamente a propiedades CSS, con una escala consistente y predecible.

Speaker 1: Tercero, arroba theme genera utilidades automáticamente cuando usas los prefijos correctos.

Speaker 1: Cuarto, el dark mode es simple con el prefijo dark dos puntos y la clase punto dark en el html.

Speaker 1: Quinto, para PrimeNG, usa el prefijo signo de exclamación para sobrescribir estilos.

Speaker 1: Te recomiendo completar los labs del día, donde crearás un layout de dashboard completo con dark mode y diseño responsive.

Speaker 1: En el próximo episodio, hablaremos de Features y Componentes, donde integraremos todo lo aprendido hasta ahora.

Speaker 1: ¡Gracias por escuchar! Nos vemos en el próximo episodio del Curso de Angular veintiuno.
