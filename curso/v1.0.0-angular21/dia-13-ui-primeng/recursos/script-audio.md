# Día 13: Script de Audio/Podcast - UI con PrimeNG

## Información del Episodio

- **Duración estimada:** 25-30 minutos
- **Formato:** Podcast educativo
- **Audiencia:** Desarrolladores Angular con menos de 1 año de experiencia

---

## Intro (0:00 - 2:00)

**[Música de entrada - 10 segundos]**

**Narrador:** "¡Bienvenidos al Día 13 del Curso de Angular 21! Hoy vamos a hablar de interfaces de usuario. Específicamente, cómo construir UIs profesionales usando PrimeNG."

**[Pausa - 2 segundos]**

**Narrador:** "Imagina que tienes que construir una aplicación enterprise. Necesitas tablas con paginación, formularios con validación, diálogos de confirmación, y notificaciones. ¿Construyes todo desde cero? ¿O usas una biblioteca probada?"

**Narrador:** "Hoy aprenderás a usar PrimeNG, la biblioteca de componentes UI más completa para Angular. Veremos desde la configuración inicial hasta patrones avanzados como CRUD completo."

---

## Sección 1: ¿Qué es PrimeNG? (2:00 - 5:00)

**Narrador:** "PrimeNG es una biblioteca de componentes UI creada por PrimeTek. Tiene más de 90 componentes, desde botones hasta gráficos."

**[Pausa - 1 segundo]**

**Narrador:** "¿Por qué usar PrimeNG en lugar de construir tus propios componentes? Primero, tiempo. Construir una tabla con paginación, ordenamiento, y filtros puede tomar semanas. Con PrimeNG, son minutos."

**Narrador:** "Segundo, calidad. Los componentes de PrimeNG están probados, tienen accesibilidad integrada, y funcionan en todos los navegadores modernos."

**Narrador:** "Tercero, consistencia. Todos los componentes siguen el mismo diseño, el tema Aura, que puedes personalizar para tu marca."

**[Pausa - 2 segundos]**

**Narrador:** "En el proyecto UyuniAdmin, usamos PrimeNG para todo: los botones, los formularios de login, las tablas de datos, y las notificaciones. Es la base de nuestra UI."

---

## Sección 2: Configuración (5:00 - 10:00)

**Narrador:** "Vamos a la práctica. Lo primero es instalar PrimeNG y sus dependencias."

**Narrador:** "Ejecuta: npm install primeng @primeuix/themes primeicons. Esto instala los componentes, el sistema de temas, y los iconos."

**[Pausa - 1 segundo]**

**Narrador:** "Luego, configura PrimeNG en tu app.config.ts. En Angular 21, usamos la función providePrimeNG. Aquí configuras el tema Aura y opciones como el ripple effect."

**Narrador:** "El ripple effect es esa animación de onda cuando haces clic en un botón. Es un detalle pequeño, pero hace que la UI se sienta más viva."

**Narrador:** "También necesitas importar los estilos en tu styles.css. PrimeNG tiene su propio CSS, y el tema Aura define las variables de diseño."

**[Pausa - 2 segundos]**

**Narrador:** "Un punto importante: cada componente PrimeNG tiene su propio módulo. Si quieres usar un botón, importas ButtonModule. Si quieres una tabla, importas TableModule."

**Narrador:** "Esto puede parecer tedioso, pero tiene una ventaja: tree-shaking. Solo incluyes en tu bundle los componentes que realmente usas."

---

## Sección 3: Componentes de Formulario (10:00 - 15:00)

**Narrador:** "Hablemos de formularios. PrimeNG tiene componentes para cada tipo de input."

**[Pausa - 1 segundo]**

**Narrador:** "InputText es el más básico. Es un input normal con estilos de PrimeNG. Lo usas con la directiva pInputText en un input nativo."

**Narrador:** "Dropdown es un select mejorado. Tiene búsqueda integrada, que es muy útil cuando tienes muchas opciones. Solo agregas filter igual a true."

**Narrador:** "MultiSelect es similar, pero permite seleccionar múltiples opciones. Muestra los items seleccionados como chips."

**[Pausa - 2 segundos]**

**Narrador:** "Un error común: olvidar especificar optionLabel en un Dropdown. Si no lo haces, el dropdown muestra object object en lugar del texto."

**Narrador:** "Otro componente útil es Calendar para fechas. Tiene soporte para rangos, múltiples fechas, y selección de hora."

**Narrador:** "Todos estos componentes funcionan con ngModel para two-way binding, igual que los inputs nativos de Angular."

---

## Sección 4: Tabla de Datos (15:00 - 20:00)

**Narrador:** "El componente más poderoso de PrimeNG es la tabla. p-table tiene de todo: paginación, ordenamiento, filtros, selección, y hasta virtual scroll."

**[Pausa - 1 segundo]**

**Narrador:** "La estructura básica tiene tres partes: header, body, y opcionalmente caption y summary."

**Narrador:** "En el header defines las columnas. Si quieres que una columna sea ordenable, agregas pSortableColumn."

**Narrador:** "En el body muestras los datos. Usas let-item para acceder a cada fila."

**[Pausa - 2 segundos]**

**Narrador:** "Para paginación, solo agregas paginator igual a true y rows igual al número de filas por página. Puedes incluso dar opciones de filas por página."

**Narrador:** "Para filtros, hay dos tipos: global y por columna. El filtro global busca en todas las columnas. El filtro por columna busca solo en esa columna."

**Narrador:** "Para usar filtros, necesitas acceso a la instancia de la tabla. Usas ViewChild con el tipo Table de PrimeNG."

**Narrador:** "Luego llamas a table.filterGlobal con el valor y el modo de comparación, usualmente contains."

**[Pausa - 2 segundos]**

**Narrador:** "Para grandes datasets, usa virtual scroll. Solo renderiza las filas visibles, lo que mejora drásticamente el rendimiento."

---

## Sección 5: Diálogos y Notificaciones (20:00 - 25:00)

**Narrador:** "Ninguna aplicación está completa sin diálogos y notificaciones."

**[Pausa - 1 segundo]**

**Narrador:** "Dialog es el componente para modales. Lo controlas con la propiedad visible. Cuando es true, el diálogo se muestra. Cuando es false, se oculta."

**Narrador:** "Puedes hacerlo modal con la propiedad modal igual a true. Esto bloquea la interacción con el fondo."

**Narrador:** "ConfirmDialog es similar, pero específico para confirmaciones. Usas el ConfirmationService para mostrarlo."

**[Pausa - 2 segundos]**

**Narrador:** "Toast es para notificaciones. Usas el MessageService para mostrar mensajes de éxito, error, advertencia, o información."

**Narrador:** "Un detalle importante: tanto MessageService como ConfirmationService deben proporcionarse en tu componente. No están disponibles globalmente por defecto."

**Narrador:** "Agregas providers: [MessageService, ConfirmationService] en el decorador del componente."

---

## Cierre (25:00 - 27:00)

**Narrador:** "Hoy aprendiste a usar PrimeNG para construir UIs profesionales en Angular."

**Narrador:** "Vimos la configuración con providePrimeNG, los componentes de formulario como InputText y Dropdown, la poderosa tabla con paginación y filtros, y los componentes de feedback como Dialog y Toast."

**[Pausa - 1 segundo]**

**Narrador:** "Mañana continuaremos con Tailwind CSS v4. Aprenderemos a usar utility classes para estilos rápidos y consistentes."

**Narrador:** "Recuerda practicar con los labs. La mejor forma de aprender PrimeNG es usándolo."

**[Música de salida - 10 segundos]**

---

## Notas de Producción

### Pausas y Énfasis

- Pausar 1-2 segundos entre secciones principales
- Énfasis en nombres de componentes: "p-table", "p-button", "p-dialog"
- Tono conversacional pero profesional

### Efectos de Sonido

- Música de entrada: 10 segundos, estilo tech/educativo
- Música de salida: 10 segundos, misma melodía
- Sin efectos de sonido durante el contenido principal

### Pronunciación

- "PrimeNG" → "Praim-En-Gee"
- "Aura" → "Au-ra"
- "p-table" → "Pe-table"
- "Dropdown" → "Drop-down"
- "MultiSelect" → "Multi-select"

---

*Script de Audio - Día 13 - Curso Angular 21 - UyuniAdmin Frontend*
