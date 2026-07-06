# Día 12: Assessment - Estado con Signals y RxJS

## Información General

- **Tiempo estimado:** 30 minutos
- **Total de preguntas:** 20
- **Puntaje máximo:** 100 puntos
- **Puntaje mínimo aprobatorio:** 70 puntos

---

## Sección 1: toSignal (25 pts)

### Pregunta 1 (5 pts)

¿Qué hace `toSignal`?

a) Convierte una Signal a Observable
b) Convierte un Observable a Signal
c) Crea una nueva Signal
d) Sincroniza dos Signals

**Respuesta correcta:** b)

**Explicación:** `toSignal` convierte un Observable en una Signal de solo lectura, permitiendo usar el valor en templates sin async pipe.

---

### Pregunta 2 (5 pts)

¿Qué valor tiene una Signal creada con `toSignal` antes de que el Observable emita?

a) `null`
b) `undefined`
c) El valor inicial proporcionado
d) `[]`

**Respuesta correcta:** c)

**Explicación:** Si se proporciona `initialValue`, ese es el valor inicial. Si no, es `undefined` hasta que el Observable emita.

---

### Pregunta 3 (5 pts)

¿Cómo proporcionas un valor inicial a `toSignal`?

```typescript
users = toSignal(this.http.get<User[]>('/api/users'), ???);
```

a) `{ defaultValue: [] }`
b) `{ initialValue: [] }`
c) `{ value: [] }`
d) `{ initial: [] }`

**Respuesta correcta:** b)

**Explicación:** La opción correcta es `initialValue` para especificar el valor antes de que el Observable emita.

---

### Pregunta 4 (5 pts)

¿Qué sucede con la suscripción cuando usas `toSignal`?

a) Debes desuscribirte manualmente
b) Se desuscribe automáticamente cuando el componente se destruye
c) Nunca se desuscribe
d) Debes usar `takeUntil`

**Respuesta correcta:** b)

**Explicación:** `toSignal` maneja automáticamente la suscripción y cleanup, no necesitas `takeUntil`.

---

### Pregunta 5 (5 pts)

¿Cómo manejas errores en un Observable antes de convertirlo a Signal?

a) `toSignal(this.http.get('/api'), { catchError: () => [] })`
b) `toSignal(this.http.get('/api').pipe(catchError(() => of([]))))`
c) `toSignal(this.http.get('/api'), { error: () => [] })`
d) No se pueden manejar errores

**Respuesta correcta:** b)

**Explicación:** Los errores se manejan con operadores RxJS (`catchError`) antes de pasar el Observable a `toSignal`.

---

## Sección 2: toObservable (25 pts)

### Pregunta 6 (5 pts)

¿Qué hace `toObservable`?

a) Convierte un Observable a Signal
b) Convierte una Signal a Observable
c) Crea un nuevo Observable
d) Combina múltiples Observables

**Respuesta correcta:** b)

**Explicación:** `toObservable` convierte una Signal en un Observable, permitiendo usar operadores RxJS.

---

### Pregunta 7 (5 pts)

¿Cuándo emite el Observable creado con `toObservable`?

a) Solo una vez al crearlo
b) Cada vez que la Signal cambia
c) Solo cuando la Signal tiene un valor diferente
d) Nunca emite

**Respuesta correcta:** b)

**Explicación:** El Observable emite cada vez que la Signal cambia, sin importar si el valor es diferente.

---

### Pregunta 8 (5 pts)

¿Por qué usarías `toObservable` en lugar de usar la Signal directamente?

a) Para obtener mejor rendimiento
b) Para usar operadores RxJS como `debounceTime`
c) Para evitar memory leaks
d) No hay razón, siempre usa Signals

**Respuesta correcta:** b)

**Explicación:** `toObservable` permite usar operadores RxJS que no están disponibles en Signals, como `debounceTime`, `switchMap`, etc.

---

### Pregunta 9 (5 pts)

¿Cuál es el flujo correcto para una búsqueda con debounce?

a) Signal → toSignal → debounceTime → HTTP
b) Signal → toObservable → debounceTime → switchMap → HTTP → toSignal
c) Observable → toSignal → debounceTime → HTTP
d) Signal → debounceTime → toObservable → HTTP

**Respuesta correcta:** b)

**Explicación:** El flujo correcto es: Signal → toObservable → operadores RxJS → HTTP → toSignal para el resultado.

---

### Pregunta 10 (5 pts)

¿Qué tipo de Observable crea `toObservable`?

a) Un Observable que completa después de emitir
b) Un Observable que nunca completa
c) Un Observable que emite solo una vez
d) Un Observable que emite solo cuando hay cambios

**Respuesta correcta:** b)

**Explicación:** El Observable creado por `toObservable` nunca completa, sigue emitiendo mientras la Signal exista.

---

## Sección 3: Computed y Effects (25 pts)

### Pregunta 11 (5 pts)

¿Cuándo debes usar `computed` en lugar de `effect`?

a) Para side effects como logging
b) Para calcular valores derivados
c) Para hacer peticiones HTTP
d) Para actualizar otras Signals

**Respuesta correcta:** b)

**Explicación:** `computed` es para valores derivados reactivos. `effect` es para side effects.

---

### Pregunta 12 (5 pts)

¿Qué sucede si actualizas una Signal dentro de un effect que la observa?

a) Funciona correctamente
b) Crea un loop infinito
c) Angular lanza un error
d) El effect se ejecuta solo una vez

**Respuesta correcta:** b)

**Explicación:** Actualizar una Signal dentro de un effect que la observa crea un loop infinito. Angular lo detecta y lanza error.

---

### Pregunta 13 (5 pts)

¿Cómo haces cleanup en un effect?

a) `effect(() => { cleanup() })`
b) `effect((onCleanup) => { onCleanup(() => {...}) })`
c) `effect({ cleanup: () => {...} })`
d) No se puede hacer cleanup

**Respuesta correcta:** b)

**Explicación:** El primer parámetro del callback de effect es una función `onCleanup` para registrar cleanup.

---

### Pregunta 14 (5 pts)

¿Cuál es la diferencia entre `computed` y `effect`?

a) `computed` retorna un valor, `effect` no
b) `computed` es síncrono, `effect` es asíncrono
c) `computed` se ejecuta una vez, `effect` múltiples veces
d) No hay diferencia

**Respuesta correcta:** a)

**Explicación:** `computed` retorna una Signal con un valor derivado. `effect` ejecuta side effects y no retorna valor.

---

### Pregunta 15 (5 pts)

¿Puedes usar `toSignal` dentro de un `computed`?

a) Sí, siempre
b) No, causaría error
c) Sí, pero solo en ciertos casos
d) No está recomendado pero funciona

**Respuesta correcta:** b)

**Explicación:** No puedes usar `toSignal` dentro de `computed` porque `toSignal` debe llamarse en contexto de inyección.

---

## Sección 4: Patrones de Estado (25 pts)

### Pregunta 16 (5 pts)

¿Cuál es la ventaja de usar Signals en servicios para estado global?

a) Mejor rendimiento que RxJS
b) Más fácil de usar que BehaviorSubject
c) No requiere suscripciones
d) Todas las anteriores

**Respuesta correcta:** d)

**Explicación:** Signals son más simples, no requieren suscripciones manuales, y tienen mejor rendimiento en muchos casos.

---

### Pregunta 17 (5 pts)

¿Cómo expones una Signal como de solo lectura en un servicio?

a) `readonly mySignal = signal(0)`
b) `mySignal = signal(0).asReadonly()`
c) `mySignal = signal(0).readonly()`
d) `private _mySignal = signal(0); mySignal = this._mySignal.asReadonly()`

**Respuesta correcta:** d)

**Explicación:** El patrón correcto es tener una Signal privada y exponerla con `asReadonly()`.

---

### Pregunta 18 (5 pts)

¿Cuándo usarías un Store con Signals en lugar de un servicio simple?

a) Siempre, es la mejor práctica
b) Para estado complejo con múltiples operaciones CRUD
c) Solo para formularios
d) Nunca, usa RxJS

**Respuesta correcta:** b)

**Explicación:** Un Store es útil para estado complejo con loading, error, y operaciones CRUD. Para estado simple, un servicio con Signals es suficiente.

---

### Pregunta 19 (5 pts)

¿Qué patrón es correcto para sincronizar estado con localStorage?

a) Usar `toSignal` con localStorage
b) Usar un `effect` que guarda cuando la Signal cambia
c) Usar `computed` con localStorage
d) No se puede sincronizar con localStorage

**Respuesta correcta:** b)

**Explicación:** Un `effect` que observa la Signal y guarda en localStorage es el patrón correcto para sincronización.

---

### Pregunta 20 (5 pts)

¿Cómo combinas datos de HTTP con filtros locales?

a) Usar solo RxJS con combineLatest
b) Usar `toSignal` para HTTP y `computed` para filtrar
c) Usar solo Signals sin HTTP
d) No se puede combinar

**Respuesta correcta:** b)

**Explicación:** El patrón híbrido: `toSignal` para datos HTTP, Signal para filtros, y `computed` para combinar.

---

## Preguntas de Código

### Pregunta 21 (10 pts)

¿Qué está mal en este código?

```typescript
@Component({...})
export class MyComponent {
  users = toSignal(this.http.get<User[]>('/api/users'));
  
  constructor() {
    effect(() => {
      console.log(this.users());
      this.users.update(u => [...u, { id: 0, name: 'New' }]);
    });
  }
}
```

a) No se puede usar `toSignal` en componentes
b) El effect crea un loop infinito
c) Falta valor inicial en `toSignal`
d) b) y c) son correctas

**Respuesta correcta:** d)

**Explicación:** El effect observa `users` y la actualiza, creando un loop. Además, falta valor inicial.

---

### Pregunta 22 (10 pts)

¿Cómo corregirías este código?

```typescript
searchTerm = signal('');

results = toSignal(
  toObservable(this.searchTerm).pipe(
    switchMap(term => this.http.get(`/api/search?q=${term}`))
  )
);
```

a) Agregar `debounceTime(300)` antes de `switchMap`
b) Agregar valor inicial a `toSignal`
c) Usar `computed` en lugar de `toSignal`
d) a) y b) son correctas

**Respuesta correcta:** d)

**Explicación:** Falta debounce para evitar spam de peticiones y valor inicial para evitar undefined.

---

## Ejercicio Práctico

### Pregunta 23 (20 pts)

Implementa un servicio de búsqueda que:

1. Use Signal para el término de búsqueda
2. Use toObservable con debounce
3. Use switchMap para HTTP
4. Use toSignal para resultados
5. Use computed para resultados filtrados

**Espacio para respuesta:**

```typescript
@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly http = inject(HttpClient);
  
  // 1. Signal para término
  searchTerm = signal('');
  
  // 2-4. Pipeline con toObservable, debounce, switchMap, toSignal
  private searchResults$ = toObservable(this.searchTerm).pipe(
    debounceTime(300),
    filter(term => term.length >= 2),
    distinctUntilChanged(),
    switchMap(term => 
      this.http.get<SearchResult[]>(`/api/search?q=${term}`).pipe(
        catchError(() => of([]))
      )
    )
  );
  
  results = toSignal(this.searchResults$, { initialValue: [] });
  
  // 5. Computed para filtrar
  filteredResults = computed(() => {
    const results = this.results();
    // Aplicar filtros adicionales si es necesario
    return results;
  });
}
```

---

## Respuestas Correctas

| Pregunta | Respuesta |
|----------|-----------|
| 1 | b) |
| 2 | c) |
| 3 | b) |
| 4 | b) |
| 5 | b) |
| 6 | b) |
| 7 | b) |
| 8 | b) |
| 9 | b) |
| 10 | b) |
| 11 | b) |
| 12 | b) |
| 13 | b) |
| 14 | a) |
| 15 | b) |
| 16 | d) |
| 17 | d) |
| 18 | b) |
| 19 | b) |
| 20 | b) |
| 21 | d) |
| 22 | d) |

---

## Tabla de Puntuación

| Puntos | Calificación |
|--------|--------------|
| 90-100 | Excelente |
| 80-89 | Muy Bien |
| 70-79 | Aprobado |
| 60-69 | Necesita refuerzo |
| < 60 | Reprobar |

---

*Assessment - Día 12 - Curso Angular 21 - UyuniAdmin Frontend*
