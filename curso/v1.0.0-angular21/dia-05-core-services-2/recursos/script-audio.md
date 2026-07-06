# Guion de Audio (Podcast) - Día 5

## Metadatos
- **Duración**: 18-20 minutos
- **Formato**: Podcast técnico

---

## Guion

### [00:00 - 01:30] Intro
Bienvenidos al Día 5 del curso de Angular 21 Enterprise. Hoy aprenderemos sobre ConfigService y TokenRefreshService, dos servicios fundamentales para cualquier aplicación enterprise.

### [01:30 - 03:30] Hook
¿Alguna vez has tenido que recompilar tu aplicación solo para cambiar la URL del API? ¿O has visto usuarios perder su sesión porque el token expiró? Hoy resolveremos ambos problemas.

### [03:30 - 06:00] Contexto
La configuración externa permite cambiar valores sin recompilar. El refresh token mantiene la sesión activa sin interrupciones.

### [06:00 - 09:00] ConfigService
ConfigService carga configuración desde un archivo JSON antes de que la app inicie. Usamos APP_INITIALIZER para ejecutar la carga temprano.

### [09:00 - 12:00] TokenRefreshService
TokenRefreshService maneja el refresh de tokens automáticamente. Cuando un 401 ocurre, refresca el token y reintenta la petición.

### [12:00 - 15:00] Cola de Peticiones
La clave es evitar múltiples refresh simultáneos. Usamos una cola para encolar peticiones mientras el refresh está en progreso.

### [15:00 - 17:00] Integración
Ambos servicios se integran con AuthInterceptor para manejar configuración y tokens de forma transparente.

### [17:00 - 18:30] Resumen
Hoy aprendimos: ConfigService para configuración externa, APP_INITIALIZER para carga temprana, y TokenRefreshService para refresh automático.

### [18:30 - 20:00] Cierre
En el próximo episodio, Día 6, veremos AuthErrorHandlerService y NetworkErrorService. ¡Nos vemos!

---

*Podcast - Día 5*
