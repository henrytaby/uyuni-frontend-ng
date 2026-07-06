# Assessment - Día 6: Manejo de Errores

## Preguntas de Evaluación (50 preguntas)

### Sección A: AuthErrorHandlerService (15 preguntas)

**1. ¿Cuál es el propósito principal de AuthErrorHandlerService?**
- a) Manejar errores de red
- b) Centralizar el manejo de errores de autenticación
- c) Registrar logs del sistema
- d) Gestionar tokens de refresco
- **Respuesta: b**

**2. ¿Qué código HTTP indica credenciales inválidas?**
- a) 200
- b) 401
- c) 403
- d) 500
- **Respuesta: b**

**3. ¿Qué código HTTP indica cuenta bloqueada?**
- a) 401
- b) 403
- c) 404
- d) 503
- **Respuesta: b**

**4. ¿Qué tipo retorna handleAuthError()?**
- a) Observable<void>
- b) Observable<never>
- c) Observable<boolean>
- d) Observable<Error>
- **Respuesta: b**

**5. ¿Por qué usar Observable<never>?**
- a) Para emitir valores nulos
- b) Para indicar que el observable nunca emite, solo errores
- c) Para cancelar todas las suscripciones
- d) Para optimizar memoria
- **Respuesta: b**

**6. ¿Qué servicio se inyecta en AuthErrorHandlerService?**
- a) HttpClient
- b) AuthService
- c) Router
- d) LoggerService
- **Respuesta: d**

**7. ¿Cómo se detecta un error de autenticación?**
- a) error.status === 401 || error.status === 403
- b) error.type === 'auth'
- c) error.auth === true
- d) error.isAuthError
- **Respuesta: a**

**8. ¿Qué mensaje mostrar para error 401?**
- a) "Error del servidor"
- b) "Credenciales inválidas"
- c) "Cuenta bloqueada"
- d) "Sesión expirada"
- **Respuesta: b**

**9. ¿Qué acción tomar ante un error 403?**
- a) Reintentar la petición
- b) Mostrar tiempo de bloqueo
- c) Refrescar el token
- d) Ignorar el error
- **Respuesta: b**

**10. ¿Dónde se usa AuthErrorHandlerService?**
- a) En componentes
- b) En interceptors
- c) En guards
- d) En servicios
- **Respuesta: b**

**11. ¿Qué decorador tiene AuthErrorHandlerService?**
- a) @Component
- b) @Injectable
- c) @Directive
- d) @Pipe
- **Respuesta: b**

**12. ¿Qué significa providedIn: 'root'?**
- a) Servicio singleton global
- b) Servicio por componente
- c) Servicio de solo lectura
- d) Servicio protegido
- **Respuesta: a**

**13. ¿Qué método verifica si es error de auth?**
- a) isAuthError()
- b) checkAuthError()
- c) hasAuthError()
- d) validateAuthError()
- **Respuesta: a**

**14. ¿Qué retorna isAuthError()?**
- a) void
- b) Observable
- c) boolean
- d) Error
- **Respuesta: c**

**15. ¿Cómo se inyecta LoggerService?**
- a) constructor(private logger: LoggerService)
- b) private logger = inject(LoggerService)
- c) @Inject(LoggerService)
- d) import { LoggerService }
- **Respuesta: b**

---

### Sección B: NetworkErrorService (15 preguntas)

**16. ¿Cuál es el propósito de NetworkErrorService?**
- a) Manejar errores de autenticación
- b) Detectar y recuperar errores de red
- c) Registrar logs
- d) Gestionar tokens
- **Respuesta: b**

**17. ¿Qué signal tiene NetworkErrorService?**
- a) isLoading
- b) isOnline
- c) isError
- d) isOffline
- **Respuesta: b**

**18. ¿Qué código HTTP indica error de red?**
- a) 200
- b) 401
- c) 0
- d) 404
- **Respuesta: c**

**19. ¿Qué es exponential backoff?**
- a) Reintento inmediato
- b) Espera progresiva entre reintentos
- c) Cancelar reintentos
- d) Reintentos infinitos
- **Respuesta: b**

**20. ¿Cuál es la fórmula del backoff?**
- a) 1000 * count
- b) 1000 * Math.pow(2, count)
- c) 1000 / count
- d) 1000 + count
- **Respuesta: b**

**21. ¿Qué operador RxJS se usa para reintentos?**
- a) retry
- b) retryWhen
- c) repeat
- d) replay
- **Respuesta: b**

**22. ¿Qué hace el operador scan?**
- a) Escanea errores
- b) Acumula valores en un estado
- c) Filtra valores
- d) Transforma valores
- **Respuesta: b**

**23. ¿Qué hace takeWhile?**
- a) Toma todos los valores
- b) Toma valores mientras la condición sea true
- c) Toma el primer valor
- d) Toma el último valor
- **Respuesta: b**

**24. ¿Qué hace delayWhen?**
- a) Retrasa un tiempo fijo
- b) Retrasa basado en una función
- c) Cancela el retraso
- d) Acelera la emisión
- **Respuesta: b**

**25. ¿Qué hace timer()?**
- a) Crea un contador
- b) Emite después de un delay
- c) Mide el tiempo
- d) Detiene el observable
- **Respuesta: b**

**26. ¿Cuántos reintentos por defecto?**
- a) 1
- b) 2
- c) 3
- d) 5
- **Respuesta: c**

**27. ¿Qué evento escucha para online/offline?**
- a) 'connection'
- b) 'network'
- c) 'online' y 'offline'
- d) 'status'
- **Respuesta: c**

**28. ¿Qué retorna isNetworkError()?**
- a) void
- b) Observable
- c) boolean
- d) number
- **Respuesta: c**

**29. ¿Qué verifica isNetworkError()?**
- a) error.status === 0 || error.status === 503
- b) error.type === 'network'
- c) error.network === true
- d) error.isNetworkError
- **Respuesta: a**

**30. ¿Dónde se usa NetworkErrorService?**
- a) Solo en componentes
- b) En interceptors y servicios
- c) Solo en guards
- d) Solo en pipes
- **Respuesta: b**

---

### Sección C: Integración con Interceptors (10 preguntas)

**31. ¿Qué interceptor usa AuthErrorHandlerService?**
- a) loadingInterceptor
- b) authInterceptor
- c) errorInterceptor
- d) networkInterceptor
- **Respuesta: b**

**32. ¿En qué parte del interceptor se maneja el error?**
- a) En la petición
- b) En el pipe catchError
- c) En el subscribe
- d) En el tap
- **Respuesta: b**

**33. ¿Qué operador se usa para manejar errores?**
- a) map
- b) tap
- c) catchError
- d) switchMap
- **Respuesta: c**

**34. ¿Qué hace throwError?**
- a) Emite un valor
- b) Propaga un error
- c) Cancela el observable
- d) Completa el observable
- **Respuesta: b**

**35. ¿Cómo se importa throwError?**
- a) import { throwError } from 'rxjs'
- b) import throwError from 'rxjs'
- c) import { throwError } from 'rxjs/operators'
- d) import { throwError } from '@angular/common'
- **Respuesta: a**

**36. ¿Qué parámetro recibe catchError?**
- a) Un valor
- b) Una función callback
- c) Un observable
- d) Un número
- **Respuesta: b**

**37. ¿Qué retorna catchError?**
- a) void
- b) Un observable
- c) Un valor
- d) Un error
- **Respuesta: b**

**38. ¿Por qué es importante el orden de los interceptors?**
- a) No importa el orden
- b) Determina el flujo de la petición
- c) Solo afecta el rendimiento
- d) Solo afecta los logs
- **Respuesta: b**

**39. ¿Qué tipo es HttpInterceptorFn?**
- a) Class
- b) Interface
- c) Type alias
- d) Decorator
- **Respuesta: c**

**40. ¿Qué parámetros recibe HttpInterceptorFn?**
- a) Solo req
- b) req y next
- c) Solo next
- d) req, next y config
- **Respuesta: b**

---

### Sección D: Patrones y Buenas Prácticas (10 preguntas)

**41. ¿Por qué centralizar el manejo de errores?**
- a) Para escribir más código
- b) Para consistencia y mantenibilidad
- c) Para usar más memoria
- d) No es importante
- **Respuesta: b**

**42. ¿Qué principio SOLID aplica?**
- a) Single Responsibility
- b) Open/Closed
- c) Liskov Substitution
- d) Interface Segregation
- **Respuesta: a**

**43. ¿Por qué usar signals para isOnline?**
- a) Por compatibilidad
- b) Para reactividad eficiente
- c) Por convención
- d) No se deben usar signals
- **Respuesta: b**

**44. ¿Qué ventaja tiene exponential backoff?**
- a) Reintentos más rápidos
- b) Evita sobrecargar el servidor
- c) Menos código
- d) No hay ventaja
- **Respuesta: b**

**45. ¿Por qué loggear errores?**
- a) Para depuración y auditoría
- b) Para usar más memoria
- c) No es necesario
- d) Solo en desarrollo
- **Respuesta: a**

**46. ¿Qué nivel de log para errores?**
- a) debug
- b) info
- c) warn
- d) error
- **Respuesta: d**

**47. ¿Por qué separar auth errors de network errors?**
- a) No se deben separar
- b) Diferente naturaleza y manejo
- c) Por convención
- d) Para más archivos
- **Respuesta: b**

**48. ¿Qué hacer después de agotar reintentos?**
- a) Continuar normalmente
- b) Mostrar mensaje al usuario
- c) Ignorar el error
- d) Reiniciar la aplicación
- **Respuesta: b**

**49. ¿Por qué usar inject()?**
- a) Sintaxis legacy
- b) Mejor type inference y concisión
- c) No hay diferencia
- d) Solo para servicios
- **Respuesta: b**

**50. ¿Qué patrón implementa NetworkErrorService?**
- a) Singleton
- b) Observer
- c) Retry Pattern
- d) Factory
- **Respuesta: c**

---

## Respuestas

| # | Respuesta | # | Respuesta | # | Respuesta | # | Respuesta | # | Respuesta |
|---|-----------|---|-----------|---|-----------|---|-----------|---|-----------|
| 1 | b | 11 | b | 21 | b | 31 | b | 41 | b |
| 2 | b | 12 | a | 22 | b | 32 | b | 42 | a |
| 3 | b | 13 | a | 23 | b | 33 | c | 43 | b |
| 4 | b | 14 | c | 24 | b | 34 | b | 44 | b |
| 5 | b | 15 | b | 25 | b | 35 | a | 45 | a |
| 6 | d | 16 | b | 26 | c | 36 | b | 46 | d |
| 7 | a | 17 | b | 27 | c | 37 | b | 47 | b |
| 8 | b | 18 | c | 28 | c | 38 | b | 48 | b |
| 9 | b | 19 | b | 29 | a | 39 | c | 49 | b |
| 10 | b | 20 | b | 30 | b | 40 | b | 50 | c |

---

*Assessment - Día 6: Manejo de Errores*
