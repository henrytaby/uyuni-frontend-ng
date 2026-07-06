# Script Audio - Día 8: Interceptors

## Podcast: "Angular 21 en Producción"

### Episodio 8: HTTP Interceptors - Middleware para tu API

---

**[INTRO - 0:00]**

Bienvenidos a "Angular 21 en Producción". Hoy estamos en el Día 8, y vamos a hablar de HTTP Interceptors. Si ayer construimos el corazón de la autenticación, hoy vamos a construir el sistema circulatorio que conecta todo.

---

**[HOOK - 0:30]**

Imagina que cada vez que tu aplicación hace una petición HTTP, tienes que añadir manualmente el token de autenticación. Si tienes 50 endpoints, escribes el mismo código 50 veces. Y si el token expira, tienes que manejar el refresh en 50 lugares diferentes.

Los interceptors resuelven esto de forma elegante. Un solo lugar, todas las peticiones pasan por ahí. Es como tener un guardia de seguridad en la entrada de un edificio: todos pasan por el mismo punto de control.

---

**[CONTEXTO - 1:00]**

En Angular 21, los interceptors son funcionales. Ya no usamos clases con el interface HttpInterceptor. Ahora usamos funciones puras con el tipo HttpInterceptorFn.

Esta es una de las mejores decisiones de Angular. Las funciones son más simples, más fáciles de testear, y funcionan perfectamente con inject().

En UyuniAdmin tenemos dos interceptors principales: authInterceptor para autenticación, y loadingInterceptor para mostrar un spinner global.

---

**[EXPLICACIÓN - 2:00]**

Empecemos con la estructura básica. Un interceptor funcional recibe dos parámetros: req, que es la petición HTTP, y next, que es la función para pasar al siguiente paso.

Dentro del interceptor, puedes modificar el request antes de enviarlo, y manejar la respuesta después de recibirla. Todo usando operadores RxJS.

Lo más importante: los objetos HttpRequest son inmutables. No puedes modificarlos directamente. Tienes que clonarlos con req.clone().

Esto puede parecer incómodo al principio, pero tiene ventajas enormes. El código es predecible, no hay efectos secundarios sorpresa, y es más fácil de debuggear.

---

**[AUTH_INTERCEPTOR - 4:00]**

authInterceptor es el más complejo. Hace tres cosas principales.

Primero, inyecta el token Bearer. Obtiene el token de AuthService y lo añade al header Authorization. Simple, pero poderoso. Cada petición sale automáticamente con el token.

Segundo, añade el header X-Active-Role. El backend usa este header para filtrar datos según el rol activo del usuario. Si eres Editor, solo ves lo que un Editor puede ver.

Tercero, maneja errores 401. Cuando el token expira, el servidor responde 401. El interceptor detecta esto, intenta refrescar el token, y reintenta la petición original. Todo automático, el usuario no se entera.

Pero hay un detalle crucial: hay que evitar loops infinitos. Si el endpoint de refresh también retorna 401, no queremos intentar refrescar de nuevo. Por eso verificamos si la URL es un endpoint de autenticación.

---

**[REQUEST_QUEUING - 6:00]**

Hablemos de request queuing. Este es un patrón importante.

Imagina que tu aplicación hace 5 peticiones simultáneamente. Todas retornan 401 porque el token expiró. Si cada una intenta refrescar el token por su cuenta, tienes 5 llamadas de refresh al mismo tiempo. Eso es un race condition.

La solución es una cola. La primera petición que detecta 401 inicia el refresh. Las demás esperan en una cola. Cuando el refresh termina, todas las peticiones se reintentan con el nuevo token.

TokenRefreshService maneja esto con una signal isRefreshing y un método waitForToken(). Si ya hay un refresh en progreso, las peticiones se suscriben a waitForToken() y esperan.

---

**[LOADING_INTERCEPTOR - 8:00]**

loadingInterceptor es mucho más simple, pero igual de útil.

Su único trabajo es mostrar un spinner cuando hay peticiones en vuelo. Inyecta LoadingService, llama a show() antes de enviar, y llama a hide() cuando termina.

Aquí usamos el operador finalize(). Este operador es especial porque siempre se ejecuta, tanto si la petición es exitosa como si falla. Es perfecto para limpieza.

El orden de los interceptors importa. loadingInterceptor debe ir primero en el array. Así, el spinner se muestra antes de que authInterceptor añada el token, y se oculta después de que todo termine.

---

**[ERROR_COMÚN - 9:30]**

El error más común es no clonar el request. Veo código como req.headers.set('Authorization', token). Esto no funciona porque HttpRequest es inmutable. El set() retorna un nuevo HttpHeaders, pero no modifica el original.

La solución correcta es req.clone({ setHeaders: { Authorization: token } }). El método clone() crea una copia con las modificaciones.

Otro error es el loop infinito de refresh. Si no verificas que la URL no sea un endpoint de autenticación, el refresh puede disparar otro refresh, y así infinitamente.

---

**[MINI_RETO - 10:30]**

Tu reto del día: Implementa un interceptor de logging que registre la URL de cada petición, el tiempo de respuesta, y el status code.

Pista: Usa Date.now() antes y después de la petición, y el operador tap() para loggear sin modificar el flujo.

---

**[CIERRE - 11:30]**

Hoy aprendimos que los interceptors son middleware para HTTP. authInterceptor inyecta tokens y maneja errores 401. loadingInterceptor muestra un spinner global. Ambos usan operadores RxJS como catchError, finalize, y switchMap.

Mañana vamos a ver Guards. Cómo proteger rutas, cómo redirigir usuarios no autenticados, y cómo integrar todo el sistema de autenticación.

Es el último día del módulo de autenticación. No te lo pierdas.

---

**[OUTRO - 12:30]**

Gracias por escuchar. Practica con los labs, revisa el cheatsheet, y nos vemos mañana en el Día 9.

---

*Script Audio - Día 8*
*Duración aproximada: 13 minutos*
