Read aloud in a warm, welcoming, and professional educational tone. Use a conversational style at a slightly brisk pace. Do not linger on pauses.

Speaker 1: Bienvenidos al Día cinco del curso de Angular veintiuno Enterprise. Hoy aprenderemos sobre Config Service y Token Refresh Service, dos servicios fundamentales para cualquier aplicación enterprise.

Speaker 1: ¿Alguna vez has tenido que recompilar tu aplicación solo para cambiar la URL del API? ¿O has visto usuarios perder su sesión porque el token expiró? Hoy resolveremos ambos problemas.

Speaker 1: La configuración externa permite cambiar valores sin recompilar. El refresh token mantiene la sesión activa sin interrupciones.

Speaker 1: Config Service carga configuración desde un archivo JSON antes de que la app inicie. Usamos APP_INITIALIZER para ejecutar la carga temprano.

Speaker 1: Token Refresh Service maneja el refresh de tokens automáticamente. Cuando un cuatrocientos uno ocurre, refresca el token y reintenta la petición.

Speaker 1: La clave es evitar múltiples refresh simultáneos. Usamos una cola para encolar peticiones mientras el refresh está en progreso.

Speaker 1: Ambos servicios se integran con Auth Interceptor para manejar configuración y tokens de forma transparente.

Speaker 1: Hoy aprendimos: Config Service para configuración externa, APP_INITIALIZER para carga temprana, y Token Refresh Service para refresh automático.

Speaker 1: En el próximo episodio, Día seis, veremos Auth Error Handler Service y Network Error Service. ¡Nos vemos!
