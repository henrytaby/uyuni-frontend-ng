# Día 7: Sistema de Autenticación - AuthService

## Objetivo del Día

Comprender e implementar el servicio central de autenticación (AuthService) que gestiona el estado del usuario, tokens, roles y menús dinámicos.

---

## Temario

1. **Introducción a AuthService**
   - Responsabilidades del servicio
   - Inyección de dependencias
   - Estado con Signals

2. **Gestión de Tokens**
   - Login y logout
   - Almacenamiento en localStorage
   - Refresh token

3. **Estado del Usuario**
   - User signal
   - Roles signal
   - Computed signals

4. **Roles y Menús**
   - Fetch de roles
   - Active role
   - Menú dinámico

5. **Mock Authentication**
   - Feature flags
   - Desarrollo local

---

## Estructura de Clase

### Hook (5 min)
Escenario: Usuario intenta acceder a la aplicación sin estar autenticado.

### Contexto (10 min)
- OAuth2 Password Grant
- JWT tokens
- Estado reactivo con Signals

### Explicación (30 min)
- AuthService completo
- Signals privadas y públicas
- Computed signals

### Demo (20 min)
- Implementación paso a paso
- Login flow
- Role switching

### Error Común (10 min)
- Almacenamiento inseguro
- No limpiar sesión correctamente

### Mini Reto (10 min)
Implementar un método hasRole().

### Cierre (5 min)
Resumen y preparación para interceptors.

---

## Archivos del Día

| Archivo | Descripción |
|---------|-------------|
| `contenido.md` | Contenido teórico completo |
| `slides/dia-07-auth-service_Marp.md` | Presentación Marp |
| `ejercicios/lab-01.md` | Login y logout |
| `ejercicios/lab-02.md` | Roles y menús |
| `assessment/preguntas.md` | 50 preguntas |
| `recursos/bibliografia.md` | Recursos adicionales |
| `recursos/cheatsheet.md` | Referencia rápida |
| `recursos/script-audio.md` | Guion podcast |
| `recursos/script-video-youtube.md` | Guion video |

---

## Requisitos Previos

- Haber completado Días 1-6
- Conocimiento de Signals
- Entender Observable y RxJS básico

---

## Tiempo Estimado

- Lectura: 45 min
- Videos: 30 min
- Ejercicios: 60 min
- Assessment: 20 min
- **Total: ~2.5 horas**

---

*Día 7 - Módulo 3: Sistema de Autenticación*
