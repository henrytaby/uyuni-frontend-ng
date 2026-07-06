# Script Audio - Día 6: Manejo de Errores

## Podcast: "Angular 21 en Producción"

### Episodio 6: AuthErrorHandlerService y NetworkErrorService

---

**[INTRO - 0:00]**

Bienvenidos a "Angular 21 en Producción", el podcast donde exploramos las mejores prácticas para construir aplicaciones empresariales con Angular. Soy tu instructor y hoy estamos en el Día 6 de nuestro curso completo.

En este episodio, vamos a sumergirnos en el manejo de errores, específicamente dos servicios críticos: AuthErrorHandlerService y NetworkErrorService. Estos servicios son el escudo de tu aplicación contra fallos de autenticación y problemas de red.

---

**[HOOK - 0:30]**

Imagina que tu aplicación está en producción, los usuarios están trabajando normalmente, y de repente... el servidor de autenticación falla. ¿Qué pasa? ¿Los usuarios ven una pantalla en blanco? ¿Un mensaje críptico de error? ¿O tu aplicación maneja el problema elegantemente y guía al usuario?

La diferencia entre una aplicación amateur y una profesional está en cómo manejas los errores. Hoy vamos a convertirnos en profesionales.

---

**[CONTEXTO - 1:00]**

En el proyecto UyuniAdmin, tenemos dos tipos principales de errores que necesitamos manejar:

Primero, errores de autenticación. Cuando un usuario intenta acceder a un recurso protegido sin permisos, o cuando su sesión expira, el servidor responde con códigos 401 o 403.

Segundo, errores de red. Cuando el servidor está temporalmente no disponible, o cuando el usuario pierde conexión a internet.

Cada tipo de error requiere un manejo diferente, y por eso tenemos dos servicios separados.

---

**[EXPLICACIÓN - 2:00]**

Empecemos con AuthErrorHandlerService. Este servicio centraliza todo el manejo de errores relacionados con autenticación.

El código 401 significa "No autorizado". Típicamente, las credenciales son inválidas o el token expiró. El código 403 significa "Prohibido". El usuario está autenticado, pero no tiene permisos para el recurso.

Nuestro servicio tiene un método principal: handleAuthError. Este método recibe el error HTTP y decide qué hacer. Retorna Observable<never>, lo cual es interesante. ¿Por qué never? Porque este observable nunca emite un valor exitoso, solo propaga el error o maneja la situación.

Ahora, NetworkErrorService es diferente. Este servicio maneja errores de conectividad. Tiene una signal llamada isOnline que rastrea el estado de la conexión. Y tiene un método poderoso: retryWithBackoff.

El exponential backoff es un patrón donde esperamos progresivamente más tiempo entre reintentos. El primer reintento espera 2 segundos, el segundo 4 segundos, el tercero 8 segundos. Esto evita sobrecargar un servidor que ya está teniendo problemas.

---

**[DEMO - 4:00]**

Vamos a ver código real. Abramos el archivo auth-error-handler.service.ts.

Primero, noten el decorador @Injectable con providedIn: 'root'. Esto hace que el servicio sea un singleton global.

Luego, tenemos la inyección de LoggerService usando la función inject(). Esta es la forma moderna de inyección de dependencias en Angular.

El método isAuthError verifica si el error es de autenticación. Usamos instanceof para verificar que es un HttpErrorResponse, y luego chequeamos el status.

Ahora veamos NetworkErrorService. La signal isOnline se inicializa con navigator.onLine. Luego escuchamos los eventos 'online' y 'offline' del window para actualizar la signal.

El método retryWithBackoff es donde ocurre la magia. Usamos retryWhen, que es un operador RxJS que nos da control total sobre los reintentos. Dentro, usamos scan para acumular el contador de intentos, takeWhile para limitar los reintentos, y delayWhen para aplicar el exponential backoff.

---

**[ERROR COMÚN - 6:00]**

Un error muy común es intentar manejar todos los errores en un solo lugar. Los desarrolladores novatos a menudo crean un servicio "ErrorHandler" genérico que intenta manejar todo.

El problema es que los errores de autenticación y los errores de red tienen naturalezas completamente diferentes. Un error 401 probablemente requiere logout o refresh del token. Un error de red probablemente requiere reintento.

Otro error común es no usar exponential backoff. Si tu servidor está caído y todos tus usuarios intentan reconectar al mismo tiempo, vas a crear un "thundering herd" que puede empeorar la situación.

---

**[MINI RETO - 7:00]**

Aquí está tu reto para hoy: Implementa un NetworkErrorService que detecte cuando el usuario está offline y muestre un banner en la parte superior de la aplicación. El banner debe aparecer automáticamente cuando se pierde la conexión y desaparecer cuando se recupera.

Pista: Necesitarás una signal para el estado, event listeners para los eventos online/offline, y un componente que muestre el banner condicionalmente.

---

**[CIERRE - 8:00]**

Hoy aprendimos a manejar errores de manera profesional. AuthErrorHandlerService para errores de autenticación, NetworkErrorService para errores de red con exponential backoff.

Estos servicios son el escudo de tu aplicación. Sin ellos, tu aplicación es frágil. Con ellos, es resiliente.

Mañana continuaremos con el sistema de autenticación completo, incluyendo AuthService. Es uno de los días más importantes del curso.

Recuerda practicar con los labs y revisar el cheatsheet. Nos vemos mañana.

---

**[OUTRO - 9:00]**

Gracias por escuchar "Angular 21 en Producción". Si este episodio te fue útil, compártelo con otros desarrolladores. Recuerda que todo el material está disponible en el repositorio del curso.

¡Hasta mañana!

---

*Script Audio - Día 6*
*Duración aproximada: 9 minutos*
