# Día 8: Sistema de Autenticación - Interceptors

## Objetivo del Día

Comprender e implementar HTTP Interceptors funcionales para inyección automática de tokens, manejo de errores 401, y refresh token transparente.

---

## Temario

1. **Introducción a Interceptors**
   - ¿Qué son los interceptors?
   - Interceptors funcionales vs clase
   - HttpInterceptorFn

2. **authInterceptor**
   - Inyección de token Bearer
   - Header X-Active-Role
   - Clonación de requests

3. **Manejo de Errores 401**
   - Detección de errores
   - Evitar loops de refresh
   - Request queuing

4. **Token Refresh Automático**
   - Integración con TokenRefreshService
   - Retry de requests fallidos
   - Logout automático

5. **loadingInterceptor**
   - Estado de carga global
   - Integración con LoadingService

---

## Estructura de Clase

### Hook (5 min)
Escenario: Cada petición HTTP necesita el token. ¿Repetir código en cada servicio?

### Contexto (10 min)
- HTTP Interceptors en Angular
- Patrones de middleware
- Functional interceptors

### Explicación (30 min)
- authInterceptor completo
- Token injection
- Error handling

### Demo (20 min)
- Implementación paso a paso
- Debugging de interceptors
- Testing manual

### Error Común (10 min)
- Loops infinitos de refresh
- No clonar requests correctamente

### Mini Reto (10 min)
Implementar un interceptor de logging.

### Cierre (5 min)
Resumen y preparación para guards.

---

## Archivos del Día

| Archivo | Descripción |
|---------|-------------|
| `contenido.md` | Contenido teórico completo |
| `slides/dia-08-interceptors_Marp.md` | Presentación Marp |
| `ejercicios/lab-01.md` | authInterceptor |
| `ejercicios/lab-02.md` | loadingInterceptor |
| `assessment/preguntas.md` | 50 preguntas |
| `recursos/bibliografia.md` | Recursos adicionales |
| `recursos/cheatsheet.md` | Referencia rápida |
| `recursos/script-audio.md` | Guion podcast |
| `recursos/script-video-youtube.md` | Guion video |

---

## Requisitos Previos

- Haber completado Días 1-7
- Conocimiento de RxJS operadores
- Entender Observable y catchError

---

## Tiempo Estimado

- Lectura: 45 min
- Videos: 30 min
- Ejercicios: 60 min
- Assessment: 20 min
- **Total: ~2.5 horas**

---

*Día 8 - Módulo 3: Sistema de Autenticación*
