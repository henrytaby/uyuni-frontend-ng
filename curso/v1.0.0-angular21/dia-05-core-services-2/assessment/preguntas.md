# Assessment - Día 5: ConfigService y TokenRefreshService

## Instrucciones

- Total: 50 preguntas de opción múltiple
- Tiempo estimado: 30 minutos
- Cada pregunta tiene una sola respuesta correcta

---

## Sección 1: ConfigService (Preguntas 1-25)

### Pregunta 1
¿Dónde se almacena el archivo de configuración?
A) `src/config/`
B) `public/assets/config/`
C) `src/assets/config/`
D) `src/app/config/`
**Respuesta: B**

### Pregunta 2
¿Qué token se usa para ejecutar código antes del bootstrap?
A) `APP_BOOTSTRAP`
B) `APP_INITIALIZER`
C) `APP_STARTUP`
D) `INITIALIZER`
**Respuesta: B**

### Pregunta 3
¿Qué método se usa para cargar la configuración?
A) `fetch()`
B) `HttpClient.get()`
C) `fs.readFile()`
D) Ambas A y B son correctas
**Respuesta: A**

### Pregunta 4
¿Qué propiedad es obligatoria en AppConfig?
A) `timeout`
B) `mockAuth`
C) `apiUrl`
D) `features`
**Respuesta: C**

### Pregunta 5
¿Qué hace `validateConfig()`?
A) Carga la configuración
B) Verifica campos requeridos
C) Guarda la configuración
D) Merge con defaults
**Respuesta: B**

### Pregunta 6
¿Qué Signal indica que la config está cargada?
A) `config$`
B) `isLoaded`
C) `hasError`
D) `loaded`
**Respuesta: B**

### Pregunta 7
¿Qué hace `getApiUrl()` si no hay config?
A) Retorna `null`
B) Retorna string vacío
C) Retorna el valor por defecto
D) Lanza error
**Respuesta: C**

### Pregunta 8
¿Qué operador se usa para mezclar configs?
A) `merge()`
B) Spread operator `...`
C) `concat()`
D) `combine()`
**Respuesta: B**

### Pregunta 9
¿Qué tipo de Signal es `config$`?
A) WritableSignal
B) ComputedSignal
C) ReadonlySignal
D) ObservableSignal
**Respuesta: C**

### Pregunta 10
¿Qué hace `isFeatureEnabled()`?
A) Verifica si una feature está activa
B) Habilita una feature
C) Lista todas las features
D) Deshabilita una feature
**Respuesta: A**

---

### Preguntas 11-25 (ConfigService)

11. ¿Qué archivo define DEFAULT_CONFIG? **A) config.model.ts**
12. ¿Qué retorna `hasError`? **B) boolean**
13. ¿Qué parámetro recibe `loadConfig()`? **D) Ninguno**
14. ¿Qué hace `asReadonly()`? **B) Expone signal como readonly**
15. ¿Qué error lanza si falta apiUrl? **A) 'apiUrl is required'**
16. ¿Qué hace `multi: true` en APP_INITIALIZER? **B) Permite múltiples initializers**
17. ¿Qué retorna `loadConfig()`? **A) Promise<void>**
18. ¿Qué hace `catch` en loadConfig? **B) Maneja errores de fetch**
19. ¿Qué valida la URL? **C) new URL()**
20. ¿Qué hace `deps: [ConfigService]`? **B) Inyecta ConfigService**
21. ¿Qué propiedad es opcional? **C) mockAuth**
22. ¿Qué hace `useFactory`? **A) Define función factory**
23. ¿Qué hace `provide: APP_INITIALIZER`? **B) Registra el initializer**
24. ¿Qué hace el spread `{ ...DEFAULT_CONFIG, ...config }`? **B) Merge configs**
25. ¿Qué hace `errorMessage` signal? **A) Expone el mensaje de error**

---

## Sección 2: TokenRefreshService (Preguntas 26-50)

### Pregunta 26
¿Qué Signal indica si se está refrescando?
A) `refreshing`
B) `isRefreshing`
C) `isLoading`
D) `refreshing$`
**Respuesta: B**

### Pregunta 27
¿Qué endpoint se usa para refresh?
A) `/auth/login`
B) `/auth/refresh`
C) `/auth/token`
D) `/auth/renew`
**Respuesta: B**

### Pregunta 28
¿Qué hace `queueRequest()`?
A) Ejecuta la petición
B) Encola petición hasta refresh
C) Cancela la petición
D) Reintenta la petición
**Respuesta: B**

### Pregunta 29
¿Qué operador se usa para manejar el resultado del refresh?
A) `map`
B) `tap`
C) `switchMap`
D) `mergeMap`
**Respuesta: B**

### Pregunta 30
¿Qué hace `processQueue()`?
A) Procesa peticiones encoladas
B) Encola peticiones
C) Cancela peticiones
D) Reintenta peticiones
**Respuesta: A**

---

### Preguntas 31-50 (TokenRefreshService)

31. ¿Qué tipo es `QueuedRequest`? **B) Interface**
32. ¿Qué propiedad tiene `TokenResponse`? **A) accessToken, refreshToken, expiresIn**
33. ¿Qué hace `setTokens()`? **B) Guarda tokens en signals y localStorage**
34. ¿Qué error HTTP dispara refresh? **C) 401**
35. ¿Qué hace `catchError` en refresh? **B) Maneja errores y limpia cola**
36. ¿Qué hace si no hay refresh token? **A) Logout**
37. ¿Qué hace `tap` en refresh? **B) Actualiza estado y procesa cola**
38. ¿Qué hace `switchMap` en handle401? **B) Cambia a retry con nuevo token**
39. ¿Qué hace `clearTokens()`? **B) Elimina tokens de signals y localStorage**
40. ¿Qué hace si ya se está refrescando? **B) Encola la petición**
41. ¿Qué hace `Subject` en cola? **A) Permite emitir valores después**
42. ¿Qué hace `throwError`? **B) Crea un Observable que emite error**
43. ¿Qué hace `of()`? **A) Crea Observable que emite valores**
44. ¿Qué hace `asReadonly()` en refreshing? **B) Expone como readonly**
45. ¿Qué hace `new Observable(subscriber => {})`? **B) Crea Observable custom**
46. ¿Qué hace `subscriber.next()`? **A) Emite valor**
47. ¿Qué hace `subscriber.error()`? **B) Emite error**
48. ¿Qué hace `subscriber.complete()`? **A) Completa el Observable**
49. ¿Qué hace `this.queue = []`? **B) Limpia la cola**
50. ¿Qué hace `retryRequestWithNewToken()`? **B) Reintenta con nuevo token**

---

## Respuestas

| # | Resp | # | Resp | # | Resp | # | Resp | # | Resp |
|---|------|---|------|---|------|---|------|---|------|
| 1 | B | 11 | A | 21 | C | 31 | B | 41 | A |
| 2 | B | 12 | B | 22 | A | 32 | A | 42 | B |
| 3 | A | 13 | D | 23 | B | 33 | B | 43 | A |
| 4 | C | 14 | B | 24 | B | 34 | C | 44 | B |
| 5 | B | 15 | A | 25 | A | 35 | B | 45 | B |
| 6 | B | 16 | B | 26 | B | 36 | A | 46 | A |
| 7 | C | 17 | A | 27 | B | 37 | B | 47 | B |
| 8 | B | 18 | B | 28 | B | 38 | B | 48 | A |
| 9 | C | 19 | C | 29 | B | 39 | B | 49 | B |
| 10 | A | 20 | B | 30 | A | 40 | B | 50 | B |

---

*Assessment - Día 5*
*Curso: Angular 21 Enterprise*
