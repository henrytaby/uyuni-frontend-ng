Read aloud in a warm, welcoming, and professional educational tone. Use a conversational style at a slightly brisk pace. Do not linger on pauses.

Speaker 1: ¡Hola! Bienvenidos al primer episodio del curso de Angular veintiuno Enterprise. Soy tu instructor y hoy vamos a comenzar con algo fundamental: la configuración correcta de un proyecto Angular profesional.

Speaker 1: Este curso está basado en un proyecto real llamado UyuniAdmin, un dashboard enterprise que usa las mejores prácticas de la industria. Al final del curso, serás capaz de construir aplicaciones como esta.

Speaker 1: Hoy, en el Día uno, vamos a resolver un problema que afecta al ochenta por ciento de los proyectos Angular: el famoso infierno de imports.

Speaker 1: ¿Alguna vez has visto código como este?

Speaker 1: import AuthService from punto, punto, punto, punto, punto, punto, core, auth, auth.service.

Speaker 1: ¿Les suena familiar? Ese es el infierno de imports. Cuando tienes que subir cinco, seis, siete niveles de carpetas solo para importar un servicio.

Speaker 1: El problema no es solo que se ve feo. Es que cuando mueves un archivo, TODOS los imports se rompen. Y si trabajas en equipo, cada desarrollador tiene que adivinar cuántos puntos necesita.

Speaker 1: Hoy vamos a resolver esto para siempre. Al final de este episodio, tus imports se verán limpios y profesionales.

Speaker 1: Antes de entrar en código, entendamos POR QUÉ esto es importante.

Speaker 1: En el desarrollo enterprise, trabajamos en equipos grandes. Un proyecto profesional puede tener cincuenta, cien, incluso doscientos componentes. Sin una estructura clara, el código se vuelve inmantenible.

Speaker 1: Las empresas como Google, Microsoft y Amazon usan arquitecturas similares a la que aprenderemos hoy. Este conocimiento te diferencia de un desarrollador junior a uno que puede trabajar en proyectos enterprise.

Speaker 1: Además, hay un dato interesante: el setenta por ciento de los proyectos Angular tienen problemas de estructura. Y el cuarenta y cinco por ciento del tiempo de desarrollo se pierde en refactorizaciones que podrían evitarse con una buena arquitectura desde el inicio.

Speaker 1: Empecemos con el primer concepto: Standalone Components.

Speaker 1: En Angular veintiuno, los componentes son standalone por defecto. ¿Qué significa esto?

Speaker 1: Antes, necesitábamos NgModules. Era como si cada componente tuviera que ser miembro de un club para poder funcionar. Ahora, los componentes son autónomos, pueden funcionar por sí solos.

Speaker 1: Imagina la diferencia: antes, para crear un componente de botón, tenías que crear el componente, luego declararlo en un módulo, luego importar ese módulo donde lo querías usar. Ahora, simplemente importas el componente directamente.

Speaker 1: Esto tiene varias ventajas: mejor tree-shaking, que significa que el código no usado no se incluye en tu bundle. También hace el lazy loading más fácil, porque no necesitas cargar módulos enteros.

Speaker 1: Ahora hablemos de Path Aliases, el corazón de la solución.

Speaker 1: Un Path Alias es como un contacto guardado en tu celular. En lugar de memorizar el número de teléfono completo, guardas Juan Pérez. Cuando quieres llamar a Juan, solo buscas su nombre.

Speaker 1: En código, en lugar de escribir:

Speaker 1: import AuthService from seis niveles de puntos... core, auth, auth.service

Speaker 1: Escribes simplemente:

Speaker 1: import AuthService from arroba core slash auth slash auth.service

Speaker 1: El arroba core es el alias. Es un nombre corto que representa la ruta completa.

Speaker 1: La configuración se hace en el archivo te-ese-config punto ye-son, en la sección de paths. Ahí defines qué significa cada alias. Por ejemplo, arroba core apunta a src slash app slash core, arroba shared a src slash app slash shared, y así.

Speaker 1: El tercer concepto importante es TypeScript Strict Mode.

Speaker 1: Imagina que tienes un inspector de construcción muy exigente. No deja pasar nada que no esté perfectamente construido. Al principio parece molesto, pero al final tienes un edificio sólido.

Speaker 1: Eso es Strict Mode. Es una configuración de TypeScript que habilita todas las verificaciones estrictas.

Speaker 1: Por ejemplo, si tienes una variable que puede ser null, TypeScript te obliga a manejar ese caso. No puedes simplemente ignorarlo.

Speaker 1: Esto parece más trabajo al principio, pero te ahorra horas de debugging. Porque los errores los encuentras en tiempo de compilación, no cuando el usuario ya está usando la aplicación.

Speaker 1: Finalmente, hablemos de la estructura de carpetas.

Speaker 1: En proyectos enterprise, usamos una arquitectura de tres capas: Core, Shared y Features.

Speaker 1: Core es donde viven los servicios globales, como autenticación, configuración, logging. Estos servicios son singletons, significa que solo hay una instancia en toda la aplicación.

Speaker 1: Shared es para componentes reutilizables. Botones, inputs, modales. Todo lo que se usa en múltiples lugares.

Speaker 1: Y Features es donde está la lógica de negocio. Cada feature es un módulo: auth, dashboard, profile, etc.

Speaker 1: La regla importante es que Core NO puede importar de Features o Shared. Core es la capa base, no debe depender de las capas superiores.

Speaker 1: Hagamos un ejercicio mental.

Speaker 1: Imagina que estás creando un nuevo servicio llamado Logger Service. ¿Dónde lo pondrías?

Speaker 1: Correcto, en Core, porque es un servicio global.

Speaker 1: Ahora, ¿cómo lo importarías en otro archivo?

Speaker 1: Usando el alias: import Logger Service from arroba core slash logger slash logger.service.

Speaker 1: Y si TypeScript te dice Object is possibly null, ¿qué harías?

Speaker 1: Usarías optional chaining: user signo de interrogación punto name, o nullish coalescing: user signo de interrogación punto name doble signo de interrogación Unknown.

Speaker 1: Resumamos lo que aprendimos hoy:

Speaker 1: Primero, Angular veintiuno usa Standalone Components por defecto, eliminando la necesidad de NgModules.

Speaker 1: Segundo, los Path Aliases permiten imports limpios como arroba core slash auth en lugar de rutas largas con puntos.

Speaker 1: Tercero, TypeScript Strict Mode detecta errores en tiempo de compilación, ahorrándote horas de debugging.

Speaker 1: Y cuarto, la estructura Enterprise separa el código en Core, Shared y Features, manteniendo todo organizado.

Speaker 1: En el próximo episodio, profundizaremos en la arquitectura DDD Lite. Aprenderemos sobre Smart Components versus Dumb Components, y cómo usar Change Detection Strategy punto On Push para optimizar el rendimiento.

Speaker 1: Si este episodio te ayudó, compártelo con otros desarrolladores. Y si tienes preguntas, déjalas en los comentarios.

Speaker 1: Recuerda que todo el código y materiales están disponibles en el repositorio del curso.

Speaker 1: ¡Nos vemos en el próximo episodio del curso de Angular veintiuno Enterprise!
