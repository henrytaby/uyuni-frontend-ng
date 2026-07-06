Read aloud in a warm, welcoming, and professional educational tone. Use a conversational style at a slightly brisk pace. Do not linger on pauses.

Speaker 1: ¡Bienvenidos al Día trece del Curso de Angular veintiuno! Hoy vamos a hablar de interfaces de usuario. Específicamente, cómo construir UIs profesionales usando PrimeNG.

Speaker 1: Imagina que tienes que construir una aplicación enterprise. Necesitas tablas con paginación, formularios con validación, diálogos de confirmación, y notificaciones. ¿Construyes todo desde cero? ¿O usas una biblioteca probada?

Speaker 1: Hoy aprenderás a usar PrimeNG, la biblioteca de componentes UI más completa para Angular. Veremos desde la configuración inicial hasta patrones avanzados como CRUD completo.

Speaker 1: PrimeNG es una biblioteca de componentes UI creada por PrimeTek. Tiene más de noventa componentes, desde botones hasta gráficos.

Speaker 1: ¿Por qué usar PrimeNG en lugar de construir tus propios componentes? Primero, tiempo. Construir una tabla con paginación, ordenamiento, y filtros puede tomar semanas. Con PrimeNG, son minutos.

Speaker 1: Segundo, calidad. Los componentes de PrimeNG están probados, tienen accesibilidad integrada, y funcionan en todos los navegadores modernos.

Speaker 1: Tercero, consistencia. Todos los componentes siguen el mismo diseño, el tema Aura, que puedes personalizar para tu marca.

Speaker 1: En el proyecto UyuniAdmin, usamos PrimeNG para todo: los botones, los formularios de login, las tablas de datos, y las notificaciones. Es la base de nuestra UI.

Speaker 1: Vamos a la práctica. Lo primero es instalar PrimeNG y sus dependencias.

Speaker 1: Ejecuta: npm install primeng arroba primeuix slash themes primeicons. Esto instala los componentes, el sistema de temas, y los iconos.

Speaker 1: Luego, configura PrimeNG en tu app.config.ts. En Angular veintiuno, usamos la función providePrimeNG. Aquí configuras el tema Aura y opciones como el ripple effect.

Speaker 1: El ripple effect es esa animación de onda cuando haces clic en un botón. Es un detalle pequeño, pero hace que la UI se sienta más viva.

Speaker 1: También necesitas importar los estilos en tu styles.css. PrimeNG tiene su propio CSS, y el tema Aura define las variables de diseño.

Speaker 1: Un punto importante: cada componente PrimeNG tiene su propio módulo. Si quieres usar un botón, importas ButtonModule. Si quieres una tabla, importas TableModule.

Speaker 1: Esto puede parecer tedioso, pero tiene una ventaja: tree-shaking. Solo incluyes en tu bundle los componentes que realmente usas.

Speaker 1: Hablemos de formularios. PrimeNG tiene componentes para cada tipo de input.

Speaker 1: InputText es el más básico. Es un input normal con estilos de PrimeNG. Lo usas con la directiva pInputText en un input nativo.

Speaker 1: Dropdown es un select mejorado. Tiene búsqueda integrada, que es muy útil cuando tienes muchas opciones. Solo agregas filter igual a true.

Speaker 1: MultiSelect es similar, pero permite seleccionar múltiples opciones. Muestra los items seleccionados como chips.

Speaker 1: Un error común: olvidar especificar optionLabel en un Dropdown. Si no lo haces, el dropdown muestra object object en lugar del texto.

Speaker 1: Otro componente útil es Calendar para fechas. Tiene soporte para rangos, múltiples fechas, y selección de hora.

Speaker 1: Todos estos componentes funcionan con ngModel para two-way binding, igual que los inputs nativos de Angular.

Speaker 1: El componente más poderoso de PrimeNG es la tabla. p-table tiene de todo: paginación, ordenamiento, filtros, selección, y hasta virtual scroll.

Speaker 1: La estructura básica tiene tres partes: header, body, y opcionalmente caption y summary.

Speaker 1: En el header defines las columnas. Si quieres que una columna sea ordenable, agregas pSortableColumn.

Speaker 1: En el body muestras los datos. Usas let-item para acceder a cada fila.

Speaker 1: Para paginación, solo agregas paginator igual a true y rows igual al número de filas por página. Puedes incluso dar opciones de filas por página.

Speaker 1: Para filtros, hay dos tipos: global y por columna. El filtro global busca en todas las columnas. El filtro por columna busca solo en esa columna.

Speaker 1: Para usar filtros, necesitas acceso a la instancia de la tabla. Usas ViewChild con el tipo Table de PrimeNG.

Speaker 1: Luego llamas a table punto filterGlobal con el valor y el modo de comparación, usualmente contains.

Speaker 1: Para grandes datasets, usa virtual scroll. Solo renderiza las filas visibles, lo que mejora drásticamente el rendimiento.

Speaker 1: Ninguna aplicación está completa sin diálogos y notificaciones.

Speaker 1: Dialog es el componente para modales. Lo controlas con la propiedad visible. Cuando es true, el diálogo se muestra. Cuando es false, se oculta.

Speaker 1: Puedes hacerlo modal con la propiedad modal igual a true. Esto bloquea la interacción con el fondo.

Speaker 1: ConfirmDialog es similar, pero específico para confirmaciones. Usas el ConfirmationService para mostrarlo.

Speaker 1: Toast es para notificaciones. Usas el MessageService para mostrar mensajes de éxito, error, advertencia, o información.

Speaker 1: Un detalle importante: tanto MessageService como ConfirmationService deben proporcionarse en tu componente. No están disponibles globalmente por defecto.

Speaker 1: Agregas providers dos puntos abre corchetes MessageService coma ConfirmationService close corchetes en el decorador del componente.

Speaker 1: Hoy aprendiste a usar PrimeNG para construir UIs profesionales en Angular.

Speaker 1: Vimos la configuración con providePrimeNG, los componentes de formulario como InputText y Dropdown, la poderosa tabla con paginación y filtros, y los componentes de feedback como Dialog y Toast.

Speaker 1: Mañana continuaremos con Tailwind CSS versión cuatro. Aprenderemos a usar utility classes para estilos rápidos y consistentes.

Speaker 1: Recuerda practicar con los labs. La mejor forma de aprender PrimeNG es usándolo.
