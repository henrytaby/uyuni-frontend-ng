Read aloud in a warm, welcoming, and professional educational tone. Use a conversational style at a slightly brisk pace. Do not linger on pauses.

Speaker 1: Bienvenidos a Angular en Profundidad, el podcast donde exploramos los conceptos más importantes de Angular para llevarte de principiante a experto.

Speaker 1: Soy tu instructor y hoy estamos en el Día nueve de nuestro curso completo de Angular veintiuno. Hoy vamos a hablar de un tema crucial para la seguridad de tu aplicación: los Guards.

Speaker 1: Imagina esto: tienes una aplicación bancaria. Un usuario malintencionado escribe directamente en su navegador: mi-banco.com slash transferir. ¿Qué pasa si no tienes Guards? Pues... la página carga sin verificar si el usuario está autenticado. Es como dejar la puerta del banco abierta con todos los cajeros funcionando.

Speaker 1: Hoy aprenderemos a cerrar esa puerta. Vamos allá.

Speaker 1: Entonces, ¿qué es exactamente un Guard en Angular?

Speaker 1: Un Guard es como un portero de seguridad. Su trabajo es verificar las credenciales antes de permitir el acceso a una ruta. Piensa en el portero de un club exclusivo: llega un cliente, el portero verifica su membresía, y si la tiene, lo deja entrar. Si no... lo envía a la entrada principal.

Speaker 1: En términos técnicos, un Guard es una función o clase que decide si una ruta puede ser activada, desactivada o cargada.

Speaker 1: Angular tiene varios tipos de Guards:

Speaker 1: Primero, está CanActivate Fn. Este es el más común. Verifica si un usuario puede acceder a una ruta. Lo usarías para proteger páginas que requieren autenticación.

Speaker 1: Segundo, CanDeactivate Fn. Este se ejecuta cuando intentas salir de una ruta. Es perfecto para prevenir que un usuario pierda cambios no guardados en un formulario.

Speaker 1: Tercero, CanLoad Fn. Este protege el lazy loading. Solo carga el módulo si el usuario tiene permiso.

Speaker 1: Cuarto, CanMatch Fn. Este permite routing condicional, mostrando diferentes componentes según ciertas condiciones.

Speaker 1: Y quinto, Resolve Fn. Este pre-carga datos antes de navegar a una ruta.

Speaker 1: Hoy nos enfocaremos en CanActivate Fn, que es el más usado para autenticación.

Speaker 1: Ahora, hablemos de un cambio importante en Angular catorce.

Speaker 1: Antes de Angular catorce, los Guards se implementaban como clases con el decorador Injectable. Tenías que crear una clase, implementar una interfaz, y usar el constructor para inyectar dependencias. Era mucho código.

Speaker 1: Pero desde Angular catorce, tenemos los Guards funcionales. Son más simples, más limpios, y más eficientes.

Speaker 1: ¿Por qué son mejores? Tres razones:

Speaker 1: Primero, son tree-shakeable. Si no usas un Guard, se elimina del bundle final. Con las clases, aunque no las uses, pueden quedar en el bundle.

Speaker 1: Segundo, requieren menos código. No necesitas decorador, no necesitas constructor. Solo una función.

Speaker 1: Tercero, son más consistentes. Usan el mismo patrón que los interceptors funcionales, que vimos en el día anterior.

Speaker 1: Veamos cómo se ve un Guard funcional en código.

Speaker 1: Vamos a implementar nuestro primer Guard. Abre tu editor de código y crea un archivo llamado auth.guard.ts en la carpeta core slash guards.

Speaker 1: La estructura básica es así:

Speaker 1: Primero, importamos CanActivateFn y Router de arroba angular slash router. También importamos inject de arroba angular slash core. Y finalmente, importamos nuestro AuthService.

Speaker 1: Luego, declaramos el Guard como una constante. El tipo es CanActivateFn, que es una función que retorna boolean o UrlTree.

Speaker 1: Dentro de la función, usamos inject para obtener instancias de nuestros servicios. Esto es importante: inject solo funciona dentro del contexto de ejecución de Angular, así que debe estar dentro de la función del Guard.

Speaker 1: La lógica es simple: si el usuario está autenticado, retornamos true. Si no, redirigimos a la página de login y retornamos false.

Speaker 1: El código completo se ve así:

Speaker 1: export const authGuard dos puntos CanActivateFn igual abre paréntesis close paréntesis igual abre llaves const authService igual inject AuthService close paréntesis punto y coma const router igual inject Router close paréntesis punto y coma if open paréntesis authService punto isAuthenticated open paréntesis close paréntesis close paréntesis abre llaves return true punto y coma close llaves router punto navigate abre corchetes slash signin close corchetes punto y coma return false punto y coma close llaves punto y coma

Speaker 1: Una alternativa más idiomática es usar UrlTree. En lugar de llamar a navigate y retornar false, puedes retornar directamente router punto parseUrl slash signin. El router maneja la redirección de forma más eficiente.

Speaker 1: Ahora que tenemos nuestro Guard, ¿cómo lo usamos?

Speaker 1: Abre tu archivo de rutas, normalmente app.routes.ts. Importa el Guard y agrégalo a la propiedad canActivate de la ruta que quieres proteger.

Speaker 1: Por ejemplo:

Speaker 1: abre llaves path dos puntos dashboard coma canActivate dos puntos abre corchetes authGuard close corchetes coma component dos puntos Dashboard Component close llaves

Speaker 1: Cuando el usuario intente navegar a slash dashboard, el router ejecutará authGuard. Si retorna true, la ruta se activa. Si retorna false o un UrlTree, la navegación se bloquea o redirige.

Speaker 1: Puedes tener múltiples Guards en una ruta. Se ejecutan en orden, de izquierda a derecha. Si uno falla, los siguientes no se ejecutan.

Speaker 1: Por ejemplo, si tienes canActivate dos puntos abre corchetes authGuard coma adminGuard close corchetes, primero se ejecuta authGuard. Si pasa, entonces se ejecuta adminGuard. Solo si ambos pasan, la ruta se activa.

Speaker 1: Un punto importante: las rutas públicas, como slash signin, NO deben tener el Guard. ¿Por qué? Porque crearías un bucle infinito. El usuario intenta acceder a slash dashboard, el Guard lo redirige a slash signin, pero si slash signin también tiene el Guard... ¡bucle infinito!

Speaker 1: Hablemos de los errores más comunes cuando trabajas con Guards.

Speaker 1: Error número uno: usar inject fuera de contexto. Recuerda, inject solo funciona dentro del contexto de ejecución de Angular. Si lo pones fuera de la función del Guard, obtendrás un error.

Speaker 1: Error número dos: olvidar retornar un valor. Si tu Guard no tiene un return explícito en todos los caminos, puede retornar undefined implícitamente, causando comportamiento inesperado.

Speaker 1: Error número tres: crear bucles infinitos. Ya lo mencioné, pero es tan importante que vale la pena repetirlo. Las rutas públicas NO deben tener Guards.

Speaker 1: Error número cuatro: no manejar rutas anidadas correctamente. Los Guards en rutas padre protegen las rutas hijas, pero a veces necesitas protección adicional en las hijas.

Speaker 1: Finalmente, hablemos de cómo testear Guards.

Speaker 1: La clave es usar TestBed punto runInInjectionContext. Esta función ejecuta código dentro del contexto de inyección de Angular, permitiendo que inject funcione correctamente en los tests.

Speaker 1: Necesitarás mockear el AuthService y el Router. Con Jest, puedes usar jest.fn para crear funciones mock.

Speaker 1: Un test típico verifica tres cosas: que el Guard retorna true cuando está autenticado, que retorna false y redirige cuando no está autenticado, y que se llama a isAuthenticated exactamente una vez.

Speaker 1: Los tests de Guards son rápidos de ejecutar y te dan mucha confianza en tu código.

Speaker 1: Y eso es todo por hoy.

Speaker 1: Hoy aprendimos qué son los Guards, cómo implementar Guards funcionales, cómo integrarlos en las rutas, los errores más comunes, y cómo testearlos.

Speaker 1: Recuerda: los Guards son tu primera línea de defensa para proteger rutas sensibles. Úsalos sabiamente.

Speaker 1: Mañana, en el Día diez, comenzaremos con RxJS Fundamentals. Aprenderemos sobre Observables, Observers, y operadores básicos. Es un tema fundamental para Angular.

Speaker 1: Si tienes preguntas, revisa los materiales del curso en la carpeta dia-09-guards-integracion. Hay ejercicios prácticos, una evaluación, y más recursos.

Speaker 1: ¡Gracias por escuchar! Nos vemos mañana.
