Read aloud in a warm, welcoming, and professional educational tone. Use a conversational style at a slightly brisk pace. Do not linger on pauses.

Speaker 1: Bienvenidos a Angular veintiuno en Producción, el podcast donde exploramos las mejores prácticas para construir aplicaciones empresariales con Angular. Soy tu instructor y hoy estamos en el Día siete de nuestro curso completo.

Speaker 1: Hoy es un día especial. Vamos a hablar del Auth Service, el servicio más importante del sistema de autenticación. Es literalmente el corazón que bombea vida a toda la aplicación.

Speaker 1: Imagina que construyes una casa. Tienes las paredes, el techo, las ventanas. Pero sin un sistema eléctrico central, nada funciona. Los interruptores no hacen nada, los electrodomésticos no prenden, las luces están muertas.

Speaker 1: En una aplicación Angular, Auth Service es ese sistema eléctrico central. Sin él, los usuarios no pueden entrar, no hay permisos, no hay menús dinámicos, no hay nada. Hoy vamos a construir ese sistema eléctrico.

Speaker 1: En el proyecto Uyuni Admin, Auth Service tiene responsabilidades muy claras:

Speaker 1: Primero, login y logout. Los usuarios necesitan entrar y salir de la aplicación de forma segura.

Speaker 1: Segundo, gestión de tokens. OAuth dos Password Grant con access token y refresh token.

Speaker 1: Tercero, estado del usuario. Quién está logueado, qué roles tiene, qué puede hacer.

Speaker 1: Cuarto, menús dinámicos. Cada rol ve diferentes opciones de navegación.

Speaker 1: Todo esto usando Angular Signals para reactividad. Vamos a ver cómo.

Speaker 1: Empecemos con la estructura básica. Auth Service es un servicio singleton, decorado con Injectable y providedIn root. Esto significa que existe una sola instancia en toda la aplicación.

Speaker 1: Dentro del servicio, tenemos dos tipos de signals: privadas y públicas.

Speaker 1: Las signals privadas almacenan el estado real. User Signal para el usuario, Roles Signal para los roles, Token Signal para el token, Active Role Signal para el rol activo, y Menu Signal para el menú.

Speaker 1: ¿Por qué privadas? Porque queremos encapsulamiento. Solo Auth Service puede modificar estas signals. Los componentes solo pueden leer.

Speaker 1: Para exponerlas, usamos as Readonly. Esto crea una versión de solo lectura que los componentes pueden consumir pero no modificar.

Speaker 1: También tenemos computed signals. Is Authenticated es un ejemplo perfecto. Se calcula automáticamente basándose en Token Signal. Si hay token, está autenticado. Si no hay token, no lo está.

Speaker 1: Vamos a ver el flujo de login. Cuando un usuario ingresa sus credenciales, Auth Service hace una petición POST al endpoint slash auth slash login.

Speaker 1: Pero aquí hay algo importante: el formato no es JSON. OAuth dos Password Grant usa application slash x-www-form-urlencoded. El body es username igual valor ampersand password igual valor.

Speaker 1: Si el login es exitoso, recibimos un Token Response con access token y refresh token. Inmediatamente llamamos a set Session, que guarda los tokens en localStorage y actualiza la signal.

Speaker 1: Luego llamamos a refresh Profile para obtener los datos del usuario y sus roles.

Speaker 1: El logout es igual de importante. No basta con limpiar localStorage. Hay que limpiar TODAS las signals. Si dejas una signal con datos viejos, tendrás bugs extraños.

Speaker 1: Por eso tenemos clear Session, que limpia localStorage, resetea todas las signals a null o vacío, y navega a la página de login.

Speaker 1: Hablemos de roles. En Uyuni Admin, un usuario puede tener múltiples roles. Admin, Editor, Viewer, por ejemplo.

Speaker 1: Fetch Roles obtiene los roles del backend y los almacena en Roles Signal. Luego, si hay roles, establece el primero como activo.

Speaker 1: Pero hay un detalle interesante: persistimos el rol activo en localStorage. Si el usuario recarga la página, intentamos restaurar su último rol activo. Esto mejora la experiencia de usuario.

Speaker 1: Set Active Role hace tres cosas: actualiza la signal, guarda en localStorage, y obtiene el menú correspondiente.

Speaker 1: El menú es dinámico. Cada rol tiene diferentes opciones. Un Admin ve todo, un Editor ve menos, un Viewer ve solo lectura.

Speaker 1: Fetch Menu obtiene las opciones del menú para el rol activo. Esto se almacena en Menu Signal, y el sidebar lo consume directamente.

Speaker 1: Un error muy común es no limpiar el estado correctamente. Veo código como esto:

Speaker 1: logout abre llaves localStorage punto clear punto close llaves y cierra llaves this punto router punto navigate a abre corchetes slash signin close corchetes close llaves.

Speaker 1: Parece inocente, pero las signals siguen teniendo datos. El usuario ve su nombre en el header, el menú sigue visible, hay tokens en memoria. Es un desastre.

Speaker 1: El logout correcto limpia TODO: localStorage, signals, y cualquier otro estado. Por eso tenemos clear Session que hace exactamente eso.

Speaker 1: Otro error es exponer signals modificables. Si haces User Signal pública, cualquier componente puede hacer userSignal punto set null. Eso rompe la arquitectura.

Speaker 1: La solución: signals privadas, expuestas como readonly con as Readonly.

Speaker 1: Tu reto del día: Implementa un método hasRole con paréntesis roleName dos puntos string close paréntesis dos puntos boolean que retorne true si el usuario tiene el rol especificado.

Speaker 1: Pista: Usa el método some de arrays sobre Roles Signal.

Speaker 1: La solución es simple pero poderosa. Te permite verificar permisos en cualquier componente.

Speaker 1: Hoy construimos el corazón de la autenticación. Auth Service con signals privadas y públicas, login con OAuth dos, logout que limpia todo, roles dinámicos, y menús por rol.

Speaker 1: Mañana vamos a conectar todo esto con HTTP Interceptors. Veremos cómo inyectar tokens automáticamente, manejar errores cuatrocientos uno, y hacer refresh transparente.

Speaker 1: Es otro día crucial. No te lo pierdas.

Speaker 1: Gracias por escuchar Angular veintiuno en Producción. Si este episodio te fue útil, compártelo con otros desarrolladores. Recuerda que todo el material está en el repositorio del curso.

Speaker 1: Practica con los labs. La mejor forma de aprender es haciendo.

Speaker 1: Nos vemos mañana en el Día ocho. ¡Hasta entonces!
