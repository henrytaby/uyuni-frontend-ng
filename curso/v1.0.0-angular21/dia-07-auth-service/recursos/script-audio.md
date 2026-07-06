# Script Audio - Día 7: AuthService

## Podcast: "Angular 21 en Producción"

### Episodio 7: AuthService - El Corazón de la Autenticación

---

**[INTRO - 0:00]**

Bienvenidos a "Angular 21 en Producción", el podcast donde exploramos las mejores prácticas para construir aplicaciones empresariales con Angular. Soy tu instructor y hoy estamos en el Día 7 de nuestro curso completo.

Hoy es un día especial. Vamos a hablar del AuthService, el servicio más importante del sistema de autenticación. Es literalmente el corazón que bombea vida a toda la aplicación.

---

**[HOOK - 0:30]**

Imagina que construyes una casa. Tienes las paredes, el techo, las ventanas. Pero sin un sistema eléctrico central, nada funciona. Los interruptores no hacen nada, los electrodomésticos no prenden, las luces están muertas.

En una aplicación Angular, AuthService es ese sistema eléctrico central. Sin él, los usuarios no pueden entrar, no hay permisos, no hay menús dinámicos, no hay nada. Hoy vamos a construir ese sistema eléctrico.

---

**[CONTEXTO - 1:00]**

En el proyecto UyuniAdmin, AuthService tiene responsabilidades muy claras:

Primero, login y logout. Los usuarios necesitan entrar y salir de la aplicación de forma segura.

Segundo, gestión de tokens. OAuth2 Password Grant con access token y refresh token.

Tercero, estado del usuario. Quién está logueado, qué roles tiene, qué puede hacer.

Cuarto, menús dinámicos. Cada rol ve diferentes opciones de navegación.

Todo esto usando Angular Signals para reactividad. Vamos a ver cómo.

---

**[EXPLICACIÓN - 2:00]**

Empecemos con la estructura básica. AuthService es un servicio singleton, decorado con @Injectable y providedIn: 'root'. Esto significa que existe una sola instancia en toda la aplicación.

Dentro del servicio, tenemos dos tipos de signals: privadas y públicas.

Las signals privadas almacenan el estado real. userSignal para el usuario, rolesSignal para los roles, tokenSignal para el token, activeRoleSignal para el rol activo, y menuSignal para el menú.

¿Por qué privadas? Porque queremos encapsulamiento. Solo AuthService puede modificar estas signals. Los componentes solo pueden leer.

Para exponerlas, usamos asReadonly(). Esto crea una versión de solo lectura que los componentes pueden consumir pero no modificar.

También tenemos computed signals. isAuthenticated es un ejemplo perfecto. Se calcula automáticamente basándose en tokenSignal. Si hay token, está autenticado. Si no hay token, no lo está.

---

**[DEMO - 4:00]**

Vamos a ver el flujo de login. Cuando un usuario ingresa sus credenciales, AuthService hace una petición POST al endpoint /auth/login.

Pero aquí hay algo importante: el formato no es JSON. OAuth2 Password Grant usa application/x-www-form-urlencoded. El body es username=valor&password=valor.

Si el login es exitoso, recibimos un TokenResponse con access_token y refresh_token. Inmediatamente llamamos a setSession, que guarda los tokens en localStorage y actualiza la signal.

Luego llamamos a refreshProfile para obtener los datos del usuario y sus roles.

El logout es igual de importante. No basta con limpiar localStorage. Hay que limpiar TODAS las signals. Si dejas una signal con datos viejos, tendrás bugs extraños.

Por eso tenemos clearSession, que limpia localStorage, resetea todas las signals a null o vacío, y navega a la página de login.

---

**[ROLES Y MENÚS - 6:00]**

Hablemos de roles. En UyuniAdmin, un usuario puede tener múltiples roles. Admin, Editor, Viewer, por ejemplo.

fetchRoles obtiene los roles del backend y los almacena en rolesSignal. Luego, si hay roles, establece el primero como activo.

Pero hay un detalle interesante: persistimos el rol activo en localStorage. Si el usuario recarga la página, intentamos restaurar su último rol activo. Esto mejora la experiencia de usuario.

setActiveRole hace tres cosas: actualiza la signal, guarda en localStorage, y obtiene el menú correspondiente.

El menú es dinámico. Cada rol tiene diferentes opciones. Un Admin ve todo, un Editor ve menos, un Viewer ve solo lectura.

fetchMenu obtiene las opciones del menú para el rol activo. Esto se almacena en menuSignal, y el sidebar lo consume directamente.

---

**[ERROR COMÚN - 8:00]**

Un error muy común es no limpiar el estado correctamente. Veo código como esto:

logout() { localStorage.clear(); this.router.navigate(['/signin']); }

Parece inocente, pero las signals siguen teniendo datos. El usuario ve su nombre en el header, el menú sigue visible, hay tokens en memoria. Es un desastre.

El logout correcto limpia TODO: localStorage, signals, y cualquier otro estado. Por eso tenemos clearSession que hace exactamente eso.

Otro error es exponer signals modificables. Si haces userSignal pública, cualquier componente puede hacer userSignal.set(null). Eso rompe la arquitectura.

La solución: signals privadas, expuestas como readonly con asReadonly().

---

**[MINI RETO - 9:30]**

Tu reto del día: Implementa un método hasRole(roleName: string): boolean que retorne true si el usuario tiene el rol especificado.

Pista: Usa el método some() de arrays sobre rolesSignal().

La solución es simple pero poderosa. Te permite verificar permisos en cualquier componente.

---

**[CIERRE - 10:30]**

Hoy construimos el corazón de la autenticación. AuthService con signals privadas y públicas, login con OAuth2, logout que limpia todo, roles dinámicos, y menús por rol.

Mañana vamos a conectar todo esto con HTTP Interceptors. Veremos cómo inyectar tokens automáticamente, manejar errores 401, y hacer refresh transparente.

Es otro día crucial. No te lo pierdas.

---

**[OUTRO - 11:30]**

Gracias por escuchar "Angular 21 en Producción". Si este episodio te fue útil, compártelo con otros desarrolladores. Recuerda que todo el material está en el repositorio del curso.

Practica con los labs. La mejor forma de aprender es haciendo.

Nos vemos mañana en el Día 8. ¡Hasta entonces!

---

*Script Audio - Día 7*
*Duración aproximada: 12 minutos*
