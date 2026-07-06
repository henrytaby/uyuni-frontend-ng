# Assessment - Día 7: AuthService

## Preguntas de Evaluación (50 preguntas)

### Sección A: Estructura de AuthService (10 preguntas)

**1. ¿Qué decorador tiene AuthService?**
- a) @Component
- b) @Injectable
- c) @Directive
- d) @Pipe
- **Respuesta: b**

**2. ¿Qué significa providedIn: 'root'?**
- a) Servicio por componente
- b) Servicio singleton global
- c) Servicio de solo lectura
- d) Servicio protegido
- **Respuesta: b**

**3. ¿Dónde se ubica AuthService?**
- a) src/app/services/
- b) src/app/core/auth/
- c) src/app/features/auth/
- d) src/app/shared/
- **Respuesta: b**

**4. ¿Qué patrón implementa AuthService?**
- a) Factory
- b) Singleton
- c) Observer
- d) Strategy
- **Respuesta: b**

**5. ¿Cuántos servicios inyecta AuthService?**
- a) 3
- b) 4
- c) 5
- d) 6
- **Respuesta: d**

**6. ¿Qué función se usa para inyectar servicios?**
- a) inject()
- b) create()
- c) provide()
- d) get()
- **Respuesta: a**

**7. ¿Por qué usar inject() en lugar de constructor?**
- a) Más rápido
- b) Mejor type inference y conciso
- c) Más seguro
- d) Requerido por Angular
- **Respuesta: b**

**8. ¿Qué servicio NO se inyecta en AuthService?**
- a) HttpClient
- b) Router
- c) FormBuilder
- d) ConfigService
- **Respuesta: c**

**9. ¿Qué responsabilidad NO tiene AuthService?**
- a) Login/logout
- b) Gestión de tokens
- c) Gestión de roles
- d) Renderizado de componentes
- **Respuesta: d**

**10. ¿Qué principio SOLID aplica AuthService?**
- a) Open/Closed
- b) Single Responsibility
- c) Liskov Substitution
- d) Interface Segregation
- **Respuesta: b**

---

### Sección B: Signals (10 preguntas)

**11. ¿Qué signal almacena el usuario?**
- a) userSignal
- b) currentUser
- c) userData
- d) user
- **Respuesta: a**

**12. ¿Por qué las signals son privadas?**
- a) Por convención
- b) Para encapsulamiento
- c) Por rendimiento
- d) Por seguridad
- **Respuesta: b**

**13. ¿Qué método expone una signal como readonly?**
- a) toReadonly()
- b) asReadonly()
- c) readonly()
- d) freeze()
- **Respuesta: b**

**14. ¿Qué es una computed signal?**
- a) Signal modificable
- b) Signal derivada de otras
- c) Signal privada
- d) Signal asíncrona
- **Respuesta: b**

**15. ¿Qué retorna isAuthenticated?**
- a) string | null
- b) User | null
- c) boolean
- d) Observable<boolean>
- **Respuesta: c**

**16. ¿Cómo se define isAuthenticated?**
- a) signal<boolean>(false)
- b) computed(() => !!this.tokenSignal())
- c) computed(() => this.userSignal())
- d) signal<boolean>(true)
- **Respuesta: b**

**17. ¿Qué signal almacena los roles?**
- a) rolesSignal
- b) currentRoles
- c) userRoles
- d) roles
- **Respuesta: a**

**18. ¿Qué signal almacena el menú?**
- a) menuSignal
- b) currentMenu
- c) navMenu
- d) menu
- **Respuesta: a**

**19. ¿Cuándo se recalcula una computed signal?**
- a) Manualmente
- b) Cuando sus dependencias cambian
- c) Cada segundo
- d) Al hacer click
- **Respuesta: b**

**20. ¿Qué signal NO es readonly?**
- a) currentUser
- b) currentRoles
- c) userSignal
- d) isAuthenticated
- **Respuesta: c**

---

### Sección C: Login y Logout (10 preguntas)

**21. ¿Qué formato usa el login?**
- a) JSON
- b) XML
- c) x-www-form-urlencoded
- d) FormData
- **Respuesta: c**

**22. ¿Qué estándar sigue el login?**
- a) REST API
- b) OAuth2 Password Grant
- c) JWT Basic
- d) Custom Auth
- **Respuesta: b**

**23. ¿Qué operador se usa en login?**
- a) map
- b) switchMap
- c) tap
- d) mergeMap
- **Respuesta: c**

**24. ¿Qué hace setSession()?**
- a) Inicia sesión
- b) Guarda tokens en localStorage y signal
- c) Verifica sesión
- d) Cierra sesión
- **Respuesta: b**

**25. ¿Dónde se guardan los tokens?**
- a) sessionStorage
- b) localStorage
- c) Cookies
- d) IndexedDB
- **Respuesta: b**

**26. ¿Qué hace logout()?**
- a) Solo navega a signin
- b) Limpia localStorage y signals
- c) Llama al backend y limpia todo
- d) Recarga la página
- **Respuesta: c**

**27. ¿Qué hace clearSession()?**
- a) Solo limpia localStorage
- b) Solo limpia signals
- c) Limpia localStorage, signals y navega
- d) Solo navega
- **Respuesta: c**

**28. ¿Qué items se eliminan de localStorage?**
- a) Solo access_token
- b) access_token y refresh_token
- c) Todos los tokens y active_role_slug
- d) Solo refresh_token
- **Respuesta: c**

**29. ¿Qué hace el operador tap?**
- a) Transforma valores
- b) Filtra valores
- c) Ejecuta efectos secundarios
- d) Combina observables
- **Respuesta: c**

**30. ¿Qué retorna login()?**
- a) void
- b) boolean
- c) Observable<TokenResponse>
- d) Observable<User>
- **Respuesta: c**

---

### Sección D: Roles y Menús (10 preguntas)

**31. ¿Qué endpoint obtiene los roles?**
- a) /auth/roles
- b) /auth/me/roles
- c) /roles
- d) /user/roles
- **Respuesta: b**

**32. ¿Qué hace fetchRoles()?**
- a) Crea roles
- b) Obtiene roles del backend
- c) Elimina roles
- d) Actualiza roles
- **Respuesta: b**

**33. ¿Qué hace setActiveRole()?**
- a) Crea un rol
- b) Establece el rol activo
- c) Elimina un rol
- d) Lista roles
- **Respuesta: b**

**34. ¿Dónde se persiste el rol activo?**
- a) sessionStorage
- b) localStorage
- c) Memory
- d) Cookie
- **Respuesta: b**

**35. ¿Qué key se usa para el rol activo?**
- a) role
- b) active_role
- c) active_role_slug
- d) current_role
- **Respuesta: c**

**36. ¿Qué endpoint obtiene el menú?**
- a) /menu
- b) /auth/menu
- c) /auth/me/menu/{slug}
- d) /roles/menu
- **Respuesta: c**

**37. ¿Qué tipo retorna fetchMenu()?**
- a) void
- b) Observable<MenuGroup[]>
- c) MenuGroup[]
- d) Observable<void>
- **Respuesta: a**

**38. ¿Qué hace hasRole()?**
- a) Crea un rol
- b) Verifica si el usuario tiene un rol
- c) Cambia el rol activo
- d) Elimina un rol
- **Respuesta: b**

**39. ¿Qué retorna hasRole()?**
- a) void
- b) Observable<boolean>
- c) boolean
- d) UserRole | null
- **Respuesta: c**

**40. ¿Qué método de array se usa en hasRole()?**
- a) find()
- b) filter()
- c) some()
- d) includes()
- **Respuesta: c**

---

### Sección E: Mock Auth y Restauración (10 preguntas)

**41. ¿Qué feature flag activa mock auth?**
- a) mockLogin
- b) mockAuth
- c) useMock
- d) devMode
- **Respuesta: b**

**42. ¿Dónde se configura mock auth?**
- a) environment.ts
- b) config.json
- c) app.config.ts
- d) package.json
- **Respuesta: b**

**43. ¿Qué hace mock auth?**
- a) Desactiva autenticación
- b) Simula login sin backend
- c) Usa API de prueba
- d) Desactiva seguridad
- **Respuesta: b**

**44. ¿Cuándo se restaura la sesión?**
- a) En ngOnInit
- b) En el constructor
- c) En app.config
- d) En bootstrap
- **Respuesta: b**

**45. ¿Por qué se usa setTimeout en el constructor?**
- a) Por rendimiento
- b) Para evitar problemas con interceptors
- c) Por convención
- d) No se usa setTimeout
- **Respuesta: b**

**46. ¿Qué método restaura el perfil?**
- a) restoreProfile()
- b) refreshProfile()
- c) loadProfile()
- d) getProfile()
- **Respuesta: b**

**47. ¿Qué endpoint obtiene el perfil?**
- a) /auth/profile
- b) /auth/me
- c) /user/profile
- d) /profile
- **Respuesta: b**

**48. ¿Qué hace refreshProfile() si hay error 401?**
- a) Ignora el error
- b) Muestra mensaje
- c) Hace logout
- d) Reintenta
- **Respuesta: c**

**49. ¿Qué llama refreshProfile()?**
- a) Solo fetchRoles()
- b) Solo fetchMenu()
- c) fetchRoles() y obtiene usuario
- d) Ninguna
- **Respuesta: c**

**50. ¿Qué signal se inicializa desde localStorage?**
- a) userSignal
- b) rolesSignal
- c) tokenSignal
- d) menuSignal
- **Respuesta: c**

---

## Respuestas

| # | Respuesta | # | Respuesta | # | Respuesta | # | Respuesta | # | Respuesta |
|---|-----------|---|-----------|---|-----------|---|-----------|---|-----------|
| 1 | b | 11 | a | 21 | c | 31 | b | 41 | b |
| 2 | b | 12 | b | 22 | b | 32 | b | 42 | b |
| 3 | b | 13 | b | 23 | c | 33 | b | 43 | b |
| 4 | b | 14 | b | 24 | b | 34 | b | 44 | b |
| 5 | d | 15 | c | 25 | b | 35 | c | 45 | b |
| 6 | a | 16 | b | 26 | c | 36 | c | 46 | b |
| 7 | b | 17 | a | 27 | c | 37 | a | 47 | b |
| 8 | c | 18 | a | 28 | c | 38 | b | 48 | c |
| 9 | d | 19 | b | 29 | c | 39 | c | 49 | c |
| 10 | b | 20 | c | 30 | c | 40 | c | 50 | c |

---

*Assessment - Día 7: AuthService*
