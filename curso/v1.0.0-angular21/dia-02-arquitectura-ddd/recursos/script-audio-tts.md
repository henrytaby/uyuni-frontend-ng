Read aloud in a warm, welcoming, and professional educational tone. Use a conversational style at a slightly brisk pace. Do not linger on pauses.

Speaker 1: ¡Hola a todos! Bienvenidos al segundo episodio del curso de Angular veintiuno Enterprise. Soy tu instructor y hoy vamos a profundizar en la arquitectura del proyecto.

Speaker 1: En el episodio anterior configuramos el proyecto con Path Aliases. Hoy vamos a entender CÓMO organizar el código de manera profesional.

Speaker 1: Vamos a hablar de DDD Lite, Smart Components, Dumb Components, y algo que puede parecer técnico pero es crucial: Change Detection Strategy punto On Push.

Speaker 1: Al final de este episodio, entenderás cómo el proyecto Uyuni Admin está organizado y por qué esa organización importa.

Speaker 1: Imagina que acabas de unirte a un equipo de desarrollo. Te asignan una tarea simple: agregar un botón de eliminar en una tarjeta de usuario.

Speaker 1: Abres el proyecto y ves cincuenta carpetas. ¿Dónde pones el código? ¿En qué archivo va la lógica? ¿Y si el botón necesita llamar a una api?

Speaker 1: Si no hay una arquitectura clara, cada desarrollador hace lo que quiere. Unos ponen la lógica en el componente, otros en un servicio, otros en un archivo separado.

Speaker 1: El resultado: código desordenado, difícil de mantener, y propenso a bugs.

Speaker 1: Hoy vamos a resolver esto con una arquitectura probada: DDD Lite.

Speaker 2: Antes de entrar en detalles, entendamos POR QUÉ la arquitectura importa.

Speaker 2: En proyectos enterprise, el código se mantiene durante años. Un desarrollador escribe código hoy, y otro lo modifica dentro de seis meses. Si no hay estructura, cada cambio es una pesadilla.

Speaker 2: La arquitectura DDD Lite, que significa Domain Driven Design Lite, nos da reglas claras:

Speaker 2: Primero, separar el código por dominio de negocio. No por tipo técnico, sino por lo que hace para el negocio.

Speaker 2: Segundo, distinguir entre componentes que piensan y componentes que muestran. Smart y Dumb.

Speaker 2: Tercero, optimizar el rendimiento con On Push.

Speaker 2: Estas reglas no son arbitrarias. Vienen de años de experiencia en proyectos grandes.

Speaker 1: Empecemos con DDD Lite. El DDD completo fue propuesto por Eric Evans en dos mil tres. Es una metodología para proyectos muy complejos.

Speaker 1: Pero para aplicaciones web típicas, el DDD completo es excesivo. Por eso existe DDD Lite, que es una versión simplificada.

Speaker 1: La idea principal es organizar el código en contextos delimitados. En Angular, esto se traduce en Features.

Speaker 1: Por ejemplo, en el proyecto Uyuni Admin tenemos features como auth, dashboard, profile, calendar. Cada feature es un contexto separado.

Speaker 1: Dentro de cada feature, hay una estructura consistente: pages para componentes inteligentes, components para componentes de presentación, services para lógica, y models para datos.

Speaker 1: Esta estructura tiene una regla importante: las features no se importan entre sí. Si necesitas algo de otra feature, probablemente debería estar en core o shared.

Speaker 2: Ahora hablemos de Smart y Dumb Components. Esta es quizás la distinción más importante del día.

Speaker 2: Imagina una empresa. Hay gerentes y hay trabajadores. Los gerentes toman decisiones, coordinan equipos, se comunican con otros departamentos. Los trabajadores ejecutan tareas específicas, son especialistas en lo que hacen.

Speaker 2: En Angular, los Smart Components son los gerentes. Tienen lógica de negocio, inyectan servicios, coordinan otros componentes. Se ubican en la carpeta pages.

Speaker 2: Los Dumb Components son los trabajadores. Solo muestran información, reciben datos, emiten eventos. No tienen lógica de negocio, no inyectan servicios. Se ubican en la carpeta components.

Speaker 2: Por ejemplo, en el login de Uyuni Admin, Sign In Component es Smart. Inyecta Auth Service, maneja el estado de carga, decide qué hacer después del login.

Speaker 2: Sign In Form Component es Dumb. Solo muestra el formulario, valida los campos, y emite un evento cuando el usuario hace submit.

Speaker 2: Esta separación tiene beneficios enormes. Los Dumb Components son fáciles de probar y reutilizar. Los Smart Components centralizan la lógica.

Speaker 1: El tercer concepto es Change Detection Strategy punto On Push. Este tema puede parecer técnico, pero tiene un impacto enorme en el rendimiento.

Speaker 1: Angular tiene un sistema llamado Change Detection que detecta cuando los datos cambian y actualiza la vista. Por defecto, verifica TODO en cada evento. Cada click, cada timer, cada respuesta HTTP.

Speaker 1: En aplicaciones grandes, esto es ineficiente. Imagina verificar cien componentes cada vez que el usuario hace click.

Speaker 1: On Push es una estrategia que solo verifica un componente cuando realmente hay un cambio. Específicamente, cuando los inputs cambian con una nueva referencia, cuando hay un evento del DOM en ese componente, o cuando un signal actualiza.

Speaker 1: La clave aquí es nueva referencia. Si mutas un objeto o un array, On Push no detecta el cambio. Por eso es importante usar patrones inmutables: crear nuevos objetos y arrays en lugar de modificar los existentes.

Speaker 2: Finalmente, hablemos de inject con paréntesis. Es la forma moderna de inyección de dependencias en Angular.

Speaker 2: Antes, usábamos el constructor. Cada servicio que necesitabas iba en el constructor. Si tenías cinco servicios, el constructor era largo y repetitivo.

Speaker 2: Con inject, simplemente declaras una propiedad privada readonly y llamas a inject con el servicio que necesitas. Es más conciso y funciona en más lugares, como functional guards e interceptors.

Speaker 2: Por ejemplo, en lugar de escribir constructor, private auth dos puntos Auth Service, private router dos puntos Router, simplemente escribes private readonly auth igual inject Auth Service entre paréntesis, private readonly router igual inject Router entre paréntesis.

Speaker 2: Parece un cambio pequeño, pero cuando trabajas en proyectos grandes, cada línea de código menos cuenta.

Speaker 1: Resumamos lo que aprendimos hoy:

Speaker 1: Primero, DDD Lite organiza el código por dominio de negocio, con features que no se importan entre sí.

Speaker 1: Segundo, Smart Components son gerentes con lógica de negocio, Dumb Components son trabajadores que solo presentan información.

Speaker 1: Tercero, On Push optimiza el rendimiento verificando solo cuando hay cambios reales, pero requiere patrones inmutables.

Speaker 1: Y cuarto, inject con paréntesis es la forma moderna de inyectar dependencias, más concisa y versátil.

Speaker 2: En el próximo episodio, Día tres, aprenderemos sobre Lazy Loading y Rutas. Veremos cómo cargar código solo cuando se necesita, cómo proteger rutas con guards, y cómo resolver datos antes de navegar.

Speaker 2: Si este episodio te ayudó, compártelo con otros desarrolladores. Y si tienes preguntas, déjalas en los comentarios.

Speaker 2: Recuerda que los ejercicios prácticos de hoy están en el repositorio del curso. Crear una feature completa con Smart y Dumb Components es la mejor forma de entender estos conceptos.

Speaker 1: ¡Nos vemos en el próximo episodio del curso de Angular veintiuno Enterprise!
