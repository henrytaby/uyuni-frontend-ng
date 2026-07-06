# Assessment - Día 4: Core Services

## Instrucciones

- Total: 50 preguntas de opción múltiple
- Tiempo estimado: 30 minutos
- Cada pregunta tiene una sola respuesta correcta
- Temas: LoggerService (25) y LoadingService (25)

---

## Sección 1: LoggerService (Preguntas 1-25)

### Pregunta 1

¿Cuál es el decorador correcto para hacer un servicio singleton en Angular?

A) `@Singleton()`
B) `@Injectable({ providedIn: 'root' })`
C) `@Service({ singleton: true })`
D) `@Injectable({ scope: 'root' })`

**Respuesta: B**

---

### Pregunta 2

¿Qué método de inyección es el recomendado en Angular 14+?

A) Constructor injection
B) `inject()` function
C) `Injector.get()`
D) `ReflectiveInjector`

**Respuesta: B**

---

### Pregunta 3

¿Cuál es el nivel de log más bajo en LoggerService?

A) `trace`
B) `debug`
C) `info`
D) `verbose`

**Respuesta: B**

---

### Pregunta 4

¿Qué método de LoggerService se usa para información general?

A) `debug()`
B) `info()`
C) `log()`
D) `trace()`

**Respuesta: B**

---

### Pregunta 5

¿Por qué es importante usar LoggerService en lugar de console.log?

A) Es más rápido
B) Permite filtrar por nivel y ocultar en producción
C) Tiene mejor formato
D) Es requerido por Angular

**Respuesta: B**

---

### Pregunta 6

¿Qué nivel de log se muestra en producción por defecto?

A) Solo debug
B) Solo error
C) info, warn y error
D) Todos los niveles

**Respuesta: C**

---

### Pregunta 7

¿Cómo se cambia el nivel de log en LoggerService?

A) `logger.level = 'info'`
B) `logger.setLevel('info')`
C) `logger.changeLevel('info')`
D) `logger.config.level = 'info'`

**Respuesta: B**

---

### Pregunta 8

¿Qué formato tiene la salida de LoggerService?

A) `[LEVEL] message`
B) `[timestamp] [LEVEL] message`
C) `[timestamp] [App] [LEVEL] message`
D) `message (LEVEL)`

**Respuesta: C**

---

### Pregunta 9

¿Qué método de console se usa para nivel error?

A) `console.log`
B) `console.debug`
C) `console.error`
D) `console.critical`

**Respuesta: C**

---

### Pregunta 10

¿Qué hace el método `group()` en LoggerService?

A) Agrupa logs por categoría
B) Inicia un grupo colapsado en consola
C) Agrupa múltiples mensajes en uno
D) Filtra logs por grupo

**Respuesta: B**

---

### Pregunta 11

¿Dónde se configura el nivel de log por entorno?

A) En el componente
B) En environment.ts
C) En app.module.ts
D) En logger.config.ts

**Respuesta: B**

---

### Pregunta 12

¿Qué ventaja tiene `providedIn: 'root'`?

A) Mejor rendimiento
B) Es tree-shakeable
C) Más fácil de testear
D) Permite múltiples instancias

**Respuesta: B**

---

### Pregunta 13

¿Cómo se usa LoggerService en un componente?

A) `constructor(logger: LoggerService)`
B) `private logger = inject(LoggerService)`
C) `LoggerService.log()`
D) Ambas A y B son correctas

**Respuesta: D**

---

### Pregunta 14

¿Qué parámetros acepta el método `debug()`?

A) Solo message
B) message y level
C) message y ...args
D) message, args y context

**Respuesta: C**

---

### Pregunta 15

¿Qué hace `shouldLog()` en LoggerService?

A) Verifica si el nivel está habilitado
B) Verifica si hay conexión
C) Verifica si el log fue enviado
D) Verifica si hay errores

**Respuesta: A**

---

### Pregunta 16

¿Qué tipo de retorno tiene `setLevel()`?

A) `void`
B) `LogLevel`
C) `boolean`
D) `Observable`

**Respuesta: A**

---

### Pregunta 17

¿Cómo se espía console.log en tests?

A) `jest.mock(console)`
B) `jest.spyOn(console, 'log')`
C) `jest.spy(console, 'log')`
D) `jest.watch(console.log)`

**Respuesta: B**

---

### Pregunta 18

¿Qué método se usa para limpiar mocks en Jest?

A) `jest.clear()`
B) `jest.restoreAllMocks()`
C) `jest.reset()`
D) `jest.cleanup()`

**Respuesta: B**

---

### Pregunta 19

¿En qué archivo se define el tipo `LogLevel`?

A) `logger.types.ts`
B) `logger.service.ts`
C) `types.ts`
D) `log-level.enum.ts`

**Respuesta: B**

---

### Pregunta 20

¿Qué nivel tiene valor 2 en la jerarquía?

A) debug
B) info
C) warn
D) error

**Respuesta: C**

---

### Pregunta 21

¿Qué hace `setContext()` en LoggerService?

A) Cambia el contexto de la aplicación
B) Establece el nombre que aparece en los logs
C) Configura el contexto de ejecución
D) Define el contexto del servicio

**Respuesta: B**

---

### Pregunta 22

¿Qué método de console se usa para nivel debug?

A) `console.log`
B) `console.debug`
C) `console.info`
D) `console.trace`

**Respuesta: B**

---

### Pregunta 23

¿Por qué se usa `Math.max(0, c - 1)` en hide()?

A) Para evitar números negativos
B) Para mejorar el rendimiento
C) Para manejar errores
D) Para compatibilidad

**Respuesta: A**

---

### Pregunta 24

¿Qué es un Core Service?

A) Un servicio del núcleo de Angular
B) Un servicio singleton transversal
C) Un servicio obligatorio
D) Un servicio de terceros

**Respuesta: B**

---

### Pregunta 25

¿Dónde se ubican los Core Services?

A) `src/app/services/`
B) `src/app/core/services/`
C) `src/services/`
D) `src/core/services/`

**Respuesta: B**

---

## Sección 2: LoadingService (Preguntas 26-50)

### Pregunta 26

¿Qué tipo de Signal es `count` en LoadingService?

A) `Signal<number>`
B) `WritableSignal<number>`
C) `ComputedSignal<number>`
D) `ReadonlySignal<number>`

**Respuesta: B**

---

### Pregunta 27

¿Qué Signal computada tiene LoadingService?

A) `loadingCount`
B) `isLoading`
C) `count`
D) `showLoading`

**Respuesta: B**

---

### Pregunta 28

¿Qué hace `show()` en LoadingService?

A) Muestra el spinner
B) Incrementa el contador
C) Inicia la carga
D) Activa el loading

**Respuesta: B**

---

### Pregunta 29

¿Qué hace `hide()` en LoadingService?

A) Oculta el spinner
B) Decrementa el contador
C) Termina la carga
D) Desactiva el loading

**Respuesta: B**

---

### Pregunta 30

¿Qué hace `forceHide()`?

A) Fuerza el contador a 0
B) Fuerza el spinner a ocultarse
C) Fuerza la cancelación de peticiones
D) Fuerza el reset del servicio

**Respuesta: A**

---

### Pregunta 31

¿Qué valor tiene `isLoading` cuando count es 0?

A) `null`
B) `undefined`
C) `false`
D) `true`

**Respuesta: C**

---

### Pregunta 32

¿Qué valor tiene `isLoading` cuando count es 3?

A) `3`
B) `true`
C) `false`
D) `'loading'`

**Respuesta: B**

---

### Pregunta 33

¿Qué operador RxJS se usa en el interceptor?

A) `tap`
B) `finalize`
C) `catchError`
D) `map`

**Respuesta: B**

---

### Pregunta 34

¿Qué tipo de interceptor se usa?

A) Class-based
B) Functional
C) Legacy
D) Modern

**Respuesta: B**

---

### Pregunta 35

¿Dónde se registra el interceptor?

A) `app.module.ts`
B) `app.config.ts`
C) `main.ts`
D) `interceptors.module.ts`

**Respuesta: B**

---

### Pregunta 36

¿Qué función se usa para proveer HttpClient?

A) `provideHttp()`
B) `provideHttpClient()`
C) `provideHTTPClient()`
D) `useHttpClient()`

**Respuesta: B**

---

### Pregunta 37

¿Qué método se usa para exponer count como readonly?

A) `asReadonly()`
B) `toReadonly()`
C) `readonly()`
D) `asReadOnly()`

**Respuesta: A**

---

### Pregunta 38

¿Por qué se resetea el loading en NavigationEnd?

A) Para limpiar el estado entre páginas
B) Para evitar memory leaks
C) Para mejorar el rendimiento
D) Para sincronizar con el router

**Respuesta: A**

---

### Pregunta 39

¿Qué evento del Router se escucha?

A) `NavigationStart`
B) `NavigationEnd`
C) `RoutesRecognized`
D) `RouteConfigLoadEnd`

**Respuesta: B**

---

### Pregunta 40

¿Qué operador se usa para filtrar eventos del Router?

A) `map`
B) `filter`
C) `take`
D) `switchMap`

**Respuesta: B**

---

### Pregunta 41

¿Qué problema resuelve el delay mínimo?

A) Peticiones lentas
B) Flashes visuales del spinner
C) Errores de red
D) Memory leaks

**Respuesta: B**

---

### Pregunta 42

¿Cuál es el delay mínimo recomendado?

A) 100ms
B) 200ms
C) 300ms
D) 500ms

**Respuesta: C**

---

### Pregunta 43

¿Qué propiedad se usa para el tiempo de inicio?

A) `startTime`
B) `loadingStartTime`
C) `requestStart`
D) `initTime`

**Respuesta: B**

---

### Pregunta 44

¿Qué método de Jest se usa para crear mocks?

A) `jest.mock()`
B) `jest.fn()`
C) `jest.createMock()`
D) `jest.spy()`

**Respuesta: B**

---

### Pregunta 45

¿Cómo se ejecuta código en el contexto de inyección de TestBed?

A) `TestBed.inject()`
B) `TestBed.runInInjectionContext()`
C) `TestBed.execute()`
D) `TestBed.run()`

**Respuesta: B**

---

### Pregunta 46

¿Qué hace `loadingCount` signal?

A) Indica si está cargando
B) Expone el contador de peticiones
C) Muestra el progreso
D) Cuenta los errores

**Respuesta: B**

---

### Pregunta 47

¿Qué método de Signal actualiza el valor?

A) `set()`
B) `update()`
C) Ambas A y B
D) `change()`

**Respuesta: C**

---

### Pregunta 48

¿Qué tipo es `HttpInterceptorFn`?

A) Class
B) Function type
C) Interface
D) Decorator

**Respuesta: B**

---

### Pregunta 49

¿Qué se inyecta en el interceptor?

A) HttpClient
B) LoadingService
C) Router
D) ConfigService

**Respuesta: B**

---

### Pregunta 50

¿Por qué se usa `Math.max(0, c - 1)` en hide()?

A) Para evitar números negativos
B) Para mejorar el rendimiento
C) Para manejar errores
D) Para compatibilidad

**Respuesta: A**

---

## Respuestas

| # | Respuesta | # | Respuesta | # | Respuesta | # | Respuesta | # | Respuesta |
|---|-----------|---|-----------|---|-----------|---|-----------|---|-----------|
| 1 | B | 11 | B | 21 | B | 31 | C | 41 | B |
| 2 | B | 12 | B | 22 | B | 32 | B | 42 | C |
| 3 | B | 13 | D | 23 | A | 33 | B | 43 | B |
| 4 | B | 14 | C | 24 | B | 34 | B | 44 | B |
| 5 | B | 15 | A | 25 | B | 35 | B | 45 | B |
| 6 | C | 16 | A | 26 | B | 36 | B | 46 | B |
| 7 | B | 17 | B | 27 | B | 37 | A | 47 | C |
| 8 | C | 18 | B | 28 | B | 38 | A | 48 | B |
| 9 | C | 19 | B | 29 | B | 39 | B | 49 | B |
| 10 | B | 20 | C | 30 | A | 40 | B | 50 | A |

---

*Assessment - Día 4*
*Curso: Angular 21 Enterprise*
*Día: 4 de 18*
