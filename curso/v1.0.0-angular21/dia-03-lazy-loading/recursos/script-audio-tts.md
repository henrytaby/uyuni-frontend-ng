Read aloud in a warm, welcoming, and professional educational tone. Use a conversational style at a slightly brisk pace. Do not linger on pauses.

Speaker 1: ¡Hola! Bienvenidos al tercer episodio del curso de Angular veintiuno Enterprise. Soy tu instructor y hoy vamos a hablar de algo que parece técnico pero tiene un impacto enorme en la experiencia del usuario: Lazy Loading y Rutas.

Speaker 1: En los episodios anteriores configuramos el proyecto y aprendimos sobre arquitectura. Hoy vamos a resolver un problema muy común: ¿por qué algunas aplicaciones tardan tanto en cargar?

Speaker 1: La respuesta está en cómo cargamos el código. Y hoy aprenderemos a hacerlo correctamente.

Speaker 1: Imagina que acabas de construir una aplicación Angular con diez features: dashboard, perfil, configuración, usuarios, reportes, y más.

Speaker 1: Cuando compilas para producción, el bundle tiene dos megabytes. El usuario abre la aplicación y espera... cinco segundos antes de ver algo.

Speaker 1: ¿Por qué? Porque estás cargando TODO el código al inicio. Dashboard, perfil, configuración, todo junto. Incluso features que el usuario quizás nunca use.

Speaker 1: Esto es como ir de compras y comprar TODO el supermercado, aunque solo necesites pan y leche. Ineficiente, ¿verdad?

Speaker 1: Lazy Loading es la solución. Cargamos solo lo que se necesita, cuando se necesita.

Speaker 1: Entendamos POR QUÉ esto importa tanto.

Speaker 1: Las estadísticas muestran que el ochenta por ciento del código de una aplicación no se necesita en la primera carga. El usuario entra al dashboard, no a configuración. ¿Por qué cargar configuración al inicio?

Speaker 1: Google hizo un estudio: cada segundo adicional de carga reduce las conversiones en siete por ciento. En aplicaciones enterprise, esto significa usuarios frustrados y menos productividad.

Speaker 1: Lazy Loading divide el código en chunks, archivos separados que se cargan bajo demanda. El bundle inicial pasa de dos megabytes a quinientos kilobytes. El tiempo de carga de cinco segundos a uno punto cinco segundos.

Speaker 1: La diferencia es enorme para la experiencia del usuario.

Speaker 1: Empecemos con Lazy Loading. El concepto es simple: cargar código solo cuando se necesita.

Speaker 1: En Angular, esto se hace con dos funciones: load Children y load Component.

Speaker 1: load Children se usa para cargar módulos completos, con múltiples rutas. Por ejemplo, toda la feature de dashboard con sus páginas y componentes.

Speaker 1: load Component se usa para cargar un solo componente. Útil cuando tienes una página aislada.

Speaker 1: La sintaxis usa import dinámico de JavaScript. Es como decirle al navegador: Cuando el usuario vaya a esta ruta, descarga este archivo.

Speaker 1: El resultado: el navegador crea chunks separados. Puedes verlos en Chrome DevTools, en la pestaña Network. Cada vez que navegas a una nueva feature, aparece un nuevo archivo JavaScript.

Speaker 1: Ahora hablemos de Route Guards. Si Lazy Loading es sobre cuándo cargar, Guards son sobre QUIÉN puede acceder.

Speaker 1: Imagina un club nocturno. Hay un portero que decide quién entra. Los Guards son ese portero.

Speaker 1: En Angular, un Guard es una función que se ejecuta antes de activar una ruta. Retorna true para permitir el acceso, false para bloquearlo, o una URL para redirigir.

Speaker 1: El caso más común es autenticación. Si el usuario no está logueado, el guard lo redirige a login. Simple pero poderoso.

Speaker 1: Desde Angular catorce, los guards son funciones, no clases. Esto los hace más simples y fáciles de probar. Usamos inject para obtener servicios, igual que en componentes.

Speaker 1: El tercer concepto es Resolvers. Mientras los Guards deciden SI puedes entrar, los Resolvers preparan lo que vas a ver.

Speaker 1: Imagina que vas a un restaurante. El mesero prepara la mesa antes de que te sientes. Los Resolvers hacen eso: cargan los datos antes de que el componente se active.

Speaker 1: Sin resolver, el componente se muestra vacío mientras carga los datos. Con resolver, el componente se muestra con los datos listos.

Speaker 1: La diferencia es sutil pero importante. El usuario no ve estados de carga intermitentes. La experiencia se siente más fluida.

Speaker 1: Los resolvers también son funciones desde Angular catorce. Retornan Observables, Promises, o valores síncronos.

Speaker 1: Finalmente, hablemos de rutas anidadas. Esto permite tener componentes dentro de componentes, cada uno con su propio router outlet.

Speaker 1: El ejemplo clásico es un layout con sidebar. El layout es el componente padre, y el contenido cambia según la ruta hija.

Speaker 1: En la configuración, defines children dentro de una ruta. Cada child tiene su propio path y componente.

Speaker 1: En el template del padre, usas router outlet donde quieres que aparezca el componente hijo. Puedes tener múltiples outlets si necesitas.

Speaker 1: Las rutas anidadas son perfectas para áreas de la aplicación que comparten layout, como configuración con múltiples páginas.

Speaker 1: Resumamos lo que aprendimos hoy:

Speaker 1: Primero, Lazy Loading carga código bajo demanda, reduciendo el bundle inicial hasta setenta y cinco por ciento.

Speaker 1: Segundo, los Guards controlan quién puede acceder a cada ruta, protegiendo áreas sensibles.

Speaker 1: Tercero, los Resolvers precargan datos antes de activar el componente, evitando estados vacíos.

Speaker 1: Y cuarto, las rutas anidadas permiten layouts complejos con múltiples niveles de navegación.

Speaker 1: En el próximo episodio, Día cuatro, aprenderemos sobre Core Services. Veremos Logger Service, Loading Service, Config Service, y Token Refresh Service. Estos servicios son la base de la aplicación.

Speaker 1: Si este episodio te ayudó, compártelo con otros desarrolladores. Y si tienes preguntas, déjalas en los comentarios.

Speaker 1: Los ejercicios de hoy incluyen crear una feature con lazy loading, implementar guards, y usar resolvers. La práctica es la mejor forma de dominar estos conceptos.

Speaker 1: ¡Nos vemos en el próximo episodio del curso de Angular veintiuno Enterprise!
