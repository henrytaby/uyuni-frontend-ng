# Assessment - Día 8: Interceptors

## Preguntas de Evaluación (50 preguntas)

### Sección A: Conceptos Básicos (10 preguntas)

**1. ¿Qué es un HTTP Interceptor?**
- a) Un componente
- b) Middleware para peticiones HTTP
- c) Un servicio
- d) Un pipe
- **Respuesta: b**

**2. ¿Qué tipo de interceptor recomienda Angular 21?**
- a) Class-based
- b) Functional
- c) Decorator
- d) Service-based
- **Respuesta: b**

**3. ¿Qué tipo es HttpInterceptorFn?**
- a) Class
- b) Interface
- c) Type alias
- d) Decorator
- **Respuesta: c**

**4. ¿Qué parámetros recibe HttpInterceptorFn?**
- a) Solo req
- b) req y next
- c) Solo next
- d) req, next y config
- **Respuesta: b**

**5. ¿Qué retorna HttpInterceptorFn?**
- a) void
- b) boolean
- c) Observable<HttpEvent<unknown>>
- d) HttpRequest
- **Respuesta: c**

**6. ¿Dónde se registran los interceptors?**
- a) app.module.ts
- b) app.config.ts
- c) main.ts
- d) package.json
- **Respuesta: b**

**7. ¿Qué función se usa para registrar interceptors?**
- a) provideInterceptors()
- b) withInterceptors()
- c) registerInterceptors()
- d) addInterceptors()
- **Respuesta: b**

**8. ¿Por qué son inmutables los HttpRequest?**
- a) Por convención
- b) Por seguridad y predecibilidad
- c) Por rendimiento
- d) No son inmutables
- **Respuesta: b**

**9. ¿Qué método se usa para modificar un request?**
- a) modify()
- b) update()
- c) clone()
- d) copy()
- **Respuesta: c**

**10. ¿Qué operador se usa para efectos secundarios?**
- a) map
- b) tap
- c) switchMap
- d) mergeMap
- **Respuesta: b**

---

### Sección B: authInterceptor (15 preguntas)

**11. ¿Qué header añade authInterceptor?**
- a) X-Auth-Token
- b) Authorization
- c) Bearer
- d) Token
- **Respuesta: b**

**12. ¿Qué formato tiene el header Authorization?**
- a) Token: valor
- b) Bearer: valor
- c) Bearer valor
- d) Auth: valor
- **Respuesta: c**

**13. ¿Qué servicio se inyecta en authInterceptor?**
- a) HttpClient
- b) AuthService
- c) Router
- d) FormBuilder
- **Respuesta: b**

**14. ¿Qué header se usa para el rol activo?**
- a) X-Role
- b) X-Active-Role
- c) Active-Role
- d) Role
- **Respuesta: b**

**15. ¿Qué operador maneja errores?**
- a) map
- b) tap
- c) catchError
- d) finalize
- **Respuesta: c**

**16. ¿Qué código HTTP indica token expirado?**
- a) 200
- b) 401
- c) 403
- d) 500
- **Respuesta: b**

**17. ¿Qué función verifica si es endpoint de auth?**
- a) isAuthUrl()
- b) isAuthEndpoint()
- c) checkAuthEndpoint()
- d: validateAuthEndpoint()
- **Respuesta: b**

**18. ¿Por qué evitar refresh en endpoints de auth?**
- a) Por rendimiento
- b) Para evitar loops infinitos
- c) Por seguridad
- d) No se evita
- **Respuesta: b**

**19. ¿Qué hace handle401Error?**
- a) Muestra error
- b) Refresca token y reintenta
- c) Hace logout
- d) Ignora el error
- **Respuesta: b**

**20. ¿Qué servicio maneja el refresh?**
- a) AuthService
- b) TokenRefreshService
- c) ConfigService
- d) LoadingService
- **Respuesta: b**

**21. ¿Qué hace isRefreshing()?**
- a) Verifica si hay token
- b) Verifica si hay refresh en progreso
- c) Inicia refresh
- d) Termina refresh
- **Respuesta: b**

**22. ¿Qué hace waitForToken()?**
- a) Espera un tiempo
- b) Espera a que el refresh termine
- c) Verifica token
- d) Genera token
- **Respuesta: b**

**23. ¿Qué operador se usa para cambiar el request?**
- a) map
- b) switchMap
- c) mergeMap
- d) concatMap
- **Respuesta: b**

**24. ¿Qué pasa si el refresh falla?**
- a) Nada
- b) Se reintenta
- c) Logout automático
- d) Muestra error
- **Respuesta: c**

**25. ¿Qué hace throwError?**
- a) Emite un valor
- b) Propaga un error
- c) Completa el observable
- d) Cancela el observable
- **Respuesta: b**

---

### Sección C: loadingInterceptor (10 preguntas)

**26. ¿Cuál es el propósito de loadingInterceptor?**
- a) Autenticación
- b) Mostrar spinner global
- c) Logging
- d) Caching
- **Respuesta: b**

**27. ¿Qué servicio se inyecta?**
- a) AuthService
- b) LoadingService
- c) LoggerService
- d) ConfigService
- **Respuesta: b**

**28. ¿Qué método muestra el loading?**
- a) start()
- b) show()
- c) begin()
- d) display()
- **Respuesta: b**

**29. ¿Qué método oculta el loading?**
- a) stop()
- b) hide()
- c) end()
- d) remove()
- **Respuesta: b**

**30. ¿Qué operador asegura limpieza?**
- a) tap
- b) catchError
- c) finalize
- d) map
- **Respuesta: c**

**31. ¿Cuándo se ejecuta finalize?**
- a) Solo en éxito
- b) Solo en error
- c) Siempre (éxito y error)
- d) Nunca
- **Respuesta: c**

**32. ¿Por qué usar finalize y no catchError?**
- a) Finalize se ejecuta siempre
- b) CatchError es más lento
- c) No hay diferencia
- d) Finalize es más nuevo
- **Respuesta: a**

**33. ¿En qué orden se ejecutan los interceptors?**
- a) Orden inverso
- b) Orden de registro
- c) Aleatorio
- d) Alfabético
- **Respuesta: b**

**34. ¿Qué interceptor debe ir primero?**
- a) authInterceptor
- b) loadingInterceptor
- c) No importa
- d) loggingInterceptor
- **Respuesta: b**

**35. ¿Qué signal se usa en LoadingService?**
- a) loading
- b) isLoading
- c) showLoading
- d: loadingState
- **Respuesta: b**

---

### Sección D: Patrones y Buenas Prácticas (15 preguntas)

**36. ¿Por qué usar functional interceptors?**
- a) Más rápidos
- b) Tree-shakeable y concisos
- c) Más seguros
- d) Requeridos por Angular
- **Respuesta: b**

**37. ¿Qué principio SOLID aplican los interceptors?**
- a) Single Responsibility
- b) Open/Closed
- c) Liskov Substitution
- d) Interface Segregation
- **Respuesta: a**

**38. ¿Qué patrón implementan los interceptors?**
- a) Factory
- b) Observer
- c) Chain of Responsibility
- d) Singleton
- **Respuesta: c**

**39. ¿Por qué usar request queuing?**
- a) Más rápido
- b) Evitar race conditions
- c) Menos código
- d) No se usa
- **Respuesta: b**

**40. ¿Qué es un race condition?**
- a) Error de sintaxis
- b) Condición donde el orden afecta el resultado
- c) Error de tipo
- d) Warning del compilador
- **Respuesta: b**

**41. ¿Cómo evitar loops de refresh?**
- a) No usar refresh
- b) Verificar endpoints de auth
- c) Usar timeout
- d) Usar retry
- **Respuesta: b**

**42. ¿Qué header es estándar OAuth2?**
- a) X-Auth
- b) Authorization
- c) Token
- d) Bearer-Token
- **Respuesta: b**

**43. ¿Por qué loggear en interceptors?**
- a) Por convención
- b) Para debugging
- c) Por rendimiento
- d) No se debe loggear
- **Respuesta: b**

**44. ¿Qué hace inject()?**
- a) Crea servicios
- b) Inyecta dependencias
- c) Importa módulos
- d) Configura providers
- **Respuesta: b**

**45. ¿Dónde funciona inject()?**
- a) Solo en clases
- b) En contexto de inyección
- c) En cualquier lugar
- d) Solo en constructores
- **Respuesta: b**

**46. ¿Qué es HttpErrorResponse?**
- a) Un error genérico
- b) Clase para errores HTTP
- c) Un tipo de request
- d) Un operador
- **Respuesta: b**

**47. ¿Qué propiedad tiene HttpErrorResponse?**
- a) message
- b) status
- c) data
- d) body
- **Respuesta: b**

**48. ¿Qué hace instanceof?**
- a) Compara valores
- b) Verifica tipo de objeto
- c) Crea instancias
- d) Elimina objetos
- **Respuesta: b**

**49. ¿Qué es un middleware?**
- a) Un backend
- b) Software que procesa requests
- c) Una base de datos
- d) Un framework
- **Respuesta: b**

**50. ¿Por qué separar interceptors?**
- a) Más código
- b) Single Responsibility
- c) Por convención
- d) No se deben separar
- **Respuesta: b**

---

## Respuestas

| # | Respuesta | # | Respuesta | # | Respuesta | # | Respuesta | # | Respuesta |
|---|-----------|---|-----------|---|-----------|---|-----------|---|-----------|
| 1 | b | 11 | b | 21 | b | 31 | c | 41 | b |
| 2 | b | 12 | c | 22 | b | 32 | a | 42 | b |
| 3 | c | 13 | b | 23 | b | 33 | b | 43 | b |
| 4 | b | 14 | b | 24 | c | 34 | b | 44 | b |
| 5 | c | 15 | c | 25 | b | 35 | b | 45 | b |
| 6 | b | 16 | b | 26 | b | 36 | b | 46 | b |
| 7 | b | 17 | b | 27 | b | 37 | a | 47 | b |
| 8 | b | 18 | b | 28 | b | 38 | c | 48 | b |
| 9 | c | 19 | b | 29 | b | 39 | b | 49 | b |
| 10 | b | 20 | b | 30 | c | 40 | b | 50 | b |

---

*Assessment - Día 8: Interceptors*
