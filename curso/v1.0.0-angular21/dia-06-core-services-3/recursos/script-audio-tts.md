Read aloud in a warm, welcoming, and professional educational tone. Use a conversational style at a slightly brisk pace. Do not linger on pauses.

Speaker 1: Bienvenidos a Angular veintiuno en Producción, el podcast donde exploramos las mejores prácticas para construir aplicaciones empresariales con Angular. Soy tu instructor y hoy estamos en el Día seis de nuestro curso completo.

Speaker 1: En este episodio, vamos a sumergirnos en el manejo de errores, específicamente dos servicios críticos: Auth Error Handler Service y Network Error Service. Estos servicios son el escudo de tu aplicación contra fallos de autenticación y problemas de red.

Speaker 1: Imagina que tu aplicación está en producción, los usuarios están trabajando normalmente, y de repente... el servidor de autenticación falla. ¿Qué pasa? ¿Los usuarios ven una pantalla en blanco? ¿Un mensaje críptico de error? ¿O tu aplicación maneja el problema elegantemente y guía al usuario?

Speaker 1: La diferencia entre una aplicación amateur y una profesional está en cómo manejas los errores. Hoy vamos a convertirnos en profesionales.

Speaker 1: En el proyecto Uyuni Admin, tenemos dos tipos principales de errores que necesitamos manejar:

Speaker 1: Primero, errores de autenticación. Cuando un usuario intenta acceder a un recurso protegido sin permisos, o cuando su sesión expira, el servidor responde con códigos cuatrocientos uno o cuatrocientos tres.

Speaker 1: Segundo, errores de red. Cuando el servidor está temporalmente no disponible, o cuando el usuario pierde conexión a internet.

Speaker 1: Cada tipo de error requiere un manejo diferente, y por eso tenemos dos servicios separados.

Speaker 1: Empecemos con Auth Error Handler Service. Este servicio centraliza todo el manejo de errores relacionados con autenticación.

Speaker 1: El código cuatrocientos uno significa No autorizado. Típicamente, las credenciales son inválidas o el token expiró. El código cuatrocientos tres significa Prohibido. El usuario está autenticado, pero no tiene permisos para el recurso.

Speaker 1: Nuestro servicio tiene un método principal: handle Auth Error. Este método recibe el error HTTP y decide qué hacer. Retorna Observable de never, lo cual es interesante. ¿Por qué never? Porque este observable nunca emite un valor exitoso, solo propaga el error o maneja la situación.

Speaker 1: Ahora, Network Error Service es diferente. Este servicio maneja errores de conectividad. Tiene una signal llamada isOnline que rastrea el estado de la conexión. Y tiene un método poderoso: retry With Backoff.

Speaker 1: El exponential backoff es un patrón donde esperamos progresivamente más tiempo entre reintentos. El primer reintento espera dos segundos, el segundo cuatro segundos, el tercero ocho segundos. Esto evita sobrecargar un servidor que ya está teniendo problemas.

Speaker 1: Vamos a ver código real. Abramos el archivo auth-error-handler.service.ts.

Speaker 1: Primero, noten el decorador Injectable con providedIn root. Esto hace que el servicio sea un singleton global.

Speaker 1: Luego, tenemos la inyección de Logger Service usando la función inject. Esta es la forma moderna de inyección de dependencias en Angular.

Speaker 1: El método isAuthError verifica si el error es de autenticación. Usamos instanceof para verificar que es un Http Error Response, y luego chequeamos el status.

Speaker 1: Ahora veamos Network Error Service. La signal isOnline se inicializa con navigator punto onLine. Luego escuchamos los eventos online y offline del window para actualizar la signal.

Speaker 1: El método retry With Backoff es donde ocurre la magia. Usamos retryWhen, que es un operador RxJS que nos da control total sobre los reintentos. Dentro, usamos scan para acumular el contador de intentos, takeWhile para limitar los reintentos, y delayWhen para aplicar el exponential backoff.

Speaker 1: Un error muy común es intentar manejar todos los errores en un solo lugar. Los desarrolladores novatos a menudo crean un servicio Error Handler genérico que intenta manejar todo.

Speaker 1: El problema es que los errores de autenticación y los errores de red tienen naturalezas completamente diferentes. Un error cuatrocientos uno probablemente requiere logout o refresh del token. Un error de red probablemente requiere reintento.

Speaker 1: Otro error común es no usar exponential backoff. Si tu servidor está caído y todos tus usuarios intentan reconectar al mismo tiempo, vas a crear un thundering herd que puede empeorar la situación.

Speaker 1: Aquí está tu reto para hoy: Implementa un Network Error Service que detecte cuando el usuario está offline y muestre un banner en la parte superior de la aplicación. El banner debe aparecer automáticamente cuando se pierde la conexión y desaparecer cuando se recupera.

Speaker 1: Pista: Necesitarás una signal para el estado, event listeners para los eventos online slash offline, y un componente que muestre el banner condicionalmente.

Speaker 1: Hoy aprendimos a manejar errores de manera profesional. Auth Error Handler Service para errores de autenticación, Network Error Service para errores de red con exponential backoff.

Speaker 1: Estos servicios son el escudo de tu aplicación. Sin ellos, tu aplicación es frágil. Con ellos, es resiliente.

Speaker 1: Mañana continuaremos con el sistema de autenticación completo, incluyendo Auth Service. Es uno de los días más importantes del curso.

Speaker 1: Recuerda practicar con los labs y revisar el cheatsheet. Nos vemos mañana.

Speaker 1: Gracias por escuchar Angular veintiuno en Producción. Si este episodio te fue útil, compártelo con otros desarrolladores. Recuerda que todo el material está disponible en el repositorio del curso.

Speaker 1: ¡Hasta mañana!
