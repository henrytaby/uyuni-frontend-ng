Read aloud in a warm, welcoming, and professional educational tone. Use a conversational style at a slightly brisk pace. Do not linger on pauses.

Speaker 1: Bienvenidos a Angular veintiuno en Producción. Hoy estamos en el Día ocho, y vamos a hablar de HTTP Interceptors. Si ayer construimos el corazón de la autenticación, hoy vamos a construir el sistema circulatorio que conecta todo.

Speaker 1: Imagina que cada vez que tu aplicación hace una petición HTTP, tienes que añadir manualmente el token de autenticación. Si tienes cincuenta endpoints, escribes el mismo código cincuenta veces. Y si el token expira, tienes que manejar el refresh en cincuenta lugares diferentes.

Speaker 1: Los interceptors resuelven esto de forma elegante. Un solo lugar, todas las peticiones pasan por ahí. Es como tener un guardia de seguridad en la entrada de un edificio: todos pasan por el mismo punto de control.

Speaker 1: En Angular veintiuno, los interceptors son funcionales. Ya no usamos clases con el interface Http Interceptor. Ahora usamos funciones puras con el tipo Http Interceptor Fn.

Speaker 1: Esta es una de las mejores decisiones de Angular. Las funciones son más simples, más fáciles de testear, y funcionan perfectamente con inject.

Speaker 1: En Uyuni Admin tenemos dos interceptors principales: auth Interceptor para autenticación, y loading Interceptor para mostrar un spinner global.

Speaker 1: Empecemos con la estructura básica. Un interceptor funcional recibe dos parámetros: req, que es la petición HTTP, y next, que es la función para pasar al siguiente paso.

Speaker 1: Dentro del interceptor, puedes modificar el request antes de enviarlo, y manejar la respuesta después de recibirla. Todo usando operadores RxJS.

Speaker 1: Lo más importante: los objetos Http Request son inmutables. No puedes modificarlos directamente. Tienes que clonarlos con req punto clone.

Speaker 1: Esto puede parecer incómodo al principio, pero tiene ventajas enormes. El código es predecible, no hay efectos secundarios sorpresa, y es más fácil de debuggear.

Speaker 1: Auth Interceptor es el más complejo. Hace tres cosas principales.

Speaker 1: Primero, inyecta el token Bearer. Obtiene el token de Auth Service y lo añade al header Authorization. Simple, pero poderoso. Cada petición sale automáticamente con el token.

Speaker 1: Segundo, añade el header X Active Role. El backend usa este header para filtrar datos según el rol activo del usuario. Si eres Editor, solo ves lo que un Editor puede ver.

Speaker 1: Tercero, maneja errores cuatrocientos uno. Cuando el token expira, el servidor responde cuatrocientos uno. El interceptor detecta esto, intenta refrescar el token, y reintenta la petición original. Todo automático, el usuario no se entera.

Speaker 1: Pero hay un detalle crucial: hay que evitar loops infinitos. Si el endpoint de refresh también retorna cuatrocientos uno, no queremos intentar refrescar de nuevo. Por eso verificamos si la URL es un endpoint de autenticación.

Speaker 1: Hablemos de request queuing. Este es un patrón importante.

Speaker 1: Imagina que tu aplicación hace cinco peticiones simultáneamente. Todas retornan cuatrocientos uno porque el token expiró. Si cada una intenta refrescar el token por su cuenta, tienes cinco llamadas de refresh al mismo tiempo. Eso es un race condition.

Speaker 1: La solución es una cola. La primera petición que detecta cuatrocientos uno inicia el refresh. Las demás esperan en una cola. Cuando el refresh termina, todas las peticiones se reintentan con el nuevo token.

Speaker 1: Token Refresh Service maneja esto con una signal isRefreshing y un método waitForToken. Si ya hay un refresh en progreso, las peticiones se suscriben a waitForToken y esperan.

Speaker 1: Loading Interceptor es mucho más simple, pero igual de útil.

Speaker 1: Su único trabajo es mostrar un spinner cuando hay peticiones en vuelo. Inyecta Loading Service, llama a show antes de enviar, y llama a hide cuando termina.

Speaker 1: Aquí usamos el operador finalize. Este operador es especial porque siempre se ejecuta, tanto si la petición es exitosa como si falla. Es perfecto para limpieza.

Speaker 1: El orden de los interceptors importa. Loading Interceptor debe ir primero en el array. Así, el spinner se muestra antes de que auth Interceptor añada el token, y se oculta después de que todo termine.

Speaker 1: El error más común es no clonar el request. Veo código como req punto headers punto set Authorization token. Esto no funciona porque Http Request es inmutable. El set retorna un nuevo Http Headers, pero no modifica el original.

Speaker 1: La solución correcta es req punto clone con setHeaders Authorization token. El método clone crea una copia con las modificaciones.

Speaker 1: Otro error es el loop infinito de refresh. Si no verificas que la URL no sea un endpoint de autenticación, el refresh puede disparar otro refresh, y así infinitamente.

Speaker 1: Tu reto del día: Implementa un interceptor de logging que registre la URL de cada petición, el tiempo de respuesta, y el status code.

Speaker 1: Pista: Usa Date punto now antes y después de la petición, y el operador tap para loggear sin modificar el flujo.

Speaker 1: Hoy aprendimos que los interceptors son middleware para HTTP. Auth Interceptor inyecta tokens y maneja errores cuatrocientos uno. Loading Interceptor muestra un spinner global. Ambos usan operadores RxJS como catchError, finalize, y switchMap.

Speaker 1: Mañana vamos a ver Guards. Cómo proteger rutas, cómo redirigir usuarios no autenticados, y cómo integrar todo el sistema de autenticación.

Speaker 1: Es el último día del módulo de autenticación. No te lo pierdas.

Speaker 1: Gracias por escuchar. Practica con los labs, revisa el cheatsheet, y nos vemos mañana en el Día nueve.
