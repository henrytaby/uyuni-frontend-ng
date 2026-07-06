# Día 11: Assessment - RxJS Operadores

## Información General

- **Tiempo estimado:** 30 minutos
- **Total de preguntas:** 20
- **Puntaje máximo:** 100 puntos
- **Puntaje mínimo aprobatorio:** 70 puntos

---

## Sección 1: Operadores de Creación (20 pts)

### Pregunta 1 (5 pts)

¿Cuál es la diferencia principal entre `of` y `from`?

a) `of` emite valores sincrónicamente, `from` asincrónicamente
b) `of` emite el array completo como un valor, `from` emite cada elemento
c) `of` solo funciona con números, `from` con cualquier tipo
d) No hay diferencia, son intercambiables

**Respuesta correcta:** b)

**Explicación:** `of([1, 2, 3])` emite un valor: `[1, 2, 3]`. `from([1, 2, 3])` emite tres valores: `1`, `2`, `3`.

---

### Pregunta 2 (5 pts)

¿Qué operador usarías para crear un Observable que emita cada segundo?

a) `of(1000)`
b) `from([1000])`
c) `interval(1000)`
d) `timer(1000)`

**Respuesta correcta:** c)

**Explicación:** `interval(1000)` emite valores secuenciales cada 1000ms (0, 1, 2, 3...). `timer(1000)` solo emite una vez después del delay.

---

### Pregunta 3 (5 pts)

¿Cómo crearías un Observable desde el evento 'click' de un botón?

a) `of(button, 'click')`
b) `fromEvent(button, 'click')`
c) `interval(button.click)`
d) `timer(button, 'click')`

**Respuesta correcta:** b)

**Explicación:** `fromEvent` es el operador específico para crear Observables desde eventos del DOM.

---

### Pregunta 4 (5 pts)

¿Qué emite `timer(2000, 1000)`?

a) Un valor después de 2 segundos
b) Un valor cada 1 segundo
c) Espera 2 segundos, luego emite cada 1 segundo
d) Emite 2 valores cada 1 segundo

**Respuesta correcta:** c)

**Explicación:** El primer parámetro es el delay inicial (2000ms), el segundo es el período (1000ms).

---

## Sección 2: Operadores de Transformación (30 pts)

### Pregunta 5 (5 pts)

¿Qué operador usarías para una búsqueda con autocomplete?

a) `mergeMap`
b) `concatMap`
c) `switchMap`
d) `exhaustMap`

**Respuesta correcta:** c)

**Explicación:** `switchMap` cancela la petición anterior cuando llega un nuevo término de búsqueda, evitando respuestas desactualizadas.

---

### Pregunta 6 (5 pts)

¿Qué sucede con las peticiones anteriores cuando usas `switchMap` y llega un nuevo valor?

a) Se completan normalmente
b) Se cancelan
c) Se ponen en cola
d) Se ejecutan en paralelo

**Respuesta correcta:** b)

**Explicación:** `switchMap` cancela (unsubscribes) el Observable anterior antes de suscribirse al nuevo.

---

### Pregunta 7 (5 pts)

¿Cuándo usarías `mergeMap`?

a) Para búsquedas con autocomplete
b) Para operaciones secuenciales ordenadas
c) Para múltiples peticiones paralelas independientes
d) Para prevenir múltiples clicks en un botón

**Respuesta correcta:** c)

**Explicación:** `mergeMap` ejecuta todos los Observables en paralelo, ideal para operaciones independientes.

---

### Pregunta 8 (5 pts)

¿Cuál es la diferencia entre `concatMap` y `mergeMap`?

a) `concatMap` ejecuta en paralelo, `mergeMap` secuencialmente
b) `concatMap` ejecuta secuencialmente, `mergeMap` en paralelo
c) `concatMap` cancela anteriores, `mergeMap` no
d) No hay diferencia

**Respuesta correcta:** b)

**Explicación:** `concatMap` espera a que cada Observable complete antes de iniciar el siguiente. `mergeMap` ejecuta todos simultáneamente.

---

### Pregunta 9 (5 pts)

¿Qué operador usarías para prevenir múltiples submits en un formulario?

a) `switchMap`
b) `mergeMap`
c) `concatMap`
d) `exhaustMap`

**Respuesta correcta:** d)

**Explicación:** `exhaustMap` ignora nuevos valores mientras hay uno en curso, perfecto para prevenir spam de clicks.

---

### Pregunta 10 (5 pts)

¿Qué operador transforma cada valor emitido aplicando una función?

a) `filter`
b) `map`
c) `switchMap`
d) `tap`

**Respuesta correcta:** b)

**Explicación:** `map` transforma cada valor individualmente, similar a `Array.map()`.

---

## Sección 3: Operadores de Filtrado (20 pts)

### Pregunta 11 (5 pts)

¿Qué hace `takeUntil`?

a) Toma valores hasta que se complete el Observable
b) Toma valores hasta que otro Observable emita
c) Toma valores hasta que ocurra un error
d) Toma valores hasta N emisiones

**Respuesta correcta:** b)

**Explicación:** `takeUntil(notifier)` emite valores hasta que `notifier` emita un valor.

---

### Pregunta 12 (5 pts)

¿Por qué es importante usar `takeUntil` en componentes Angular?

a) Para mejorar el rendimiento
b) Para evitar memory leaks
c) Para ordenar las emisiones
d) Para transformar los valores

**Respuesta correcta:** b)

**Explicación:** Sin `takeUntil`, las suscripciones permanecen activas después de destruir el componente, causando memory leaks.

---

### Pregunta 13 (5 pts)

¿Qué hace `debounceTime(300)`?

a) Retrasa cada emisión 300ms
b) Espera 300ms sin emisiones antes de emitir
c) Emite cada 300ms
d) Limita a máximo una emisión cada 300ms

**Respuesta correcta:** b)

**Explicación:** `debounceTime` espera un período de inactividad antes de emitir el último valor.

---

### Pregunta 14 (5 pts)

¿Cuál es la diferencia entre `debounceTime` y `throttleTime`?

a) `debounceTime` emite el último valor, `throttleTime` el primero
b) `debounceTime` espera inactividad, `throttleTime` limita frecuencia
c) `debounceTime` es para inputs, `throttleTime` para scrolls
d) b) y c) son correctas

**Respuesta correcta:** d)

**Explicación:** Ambas b) y c) son correctas. `debounceTime` espera inactividad (ideal para búsquedas), `throttleTime` limita la frecuencia (ideal para scroll).

---

## Sección 4: Operadores de Combinación (20 pts)

### Pregunta 15 (5 pts)

¿Qué operador usarías para cargar múltiples recursos HTTP en paralelo y esperar a que todos completen?

a) `combineLatest`
b) `forkJoin`
c) `merge`
d) `zip`

**Respuesta correcta:** b)

**Explicación:** `forkJoin` espera a que todos los Observables completen y emite un array con los últimos valores.

---

### Pregunta 16 (5 pts)

¿Cuándo emite `combineLatest`?

a) Solo cuando todos los Observables completan
b) Cada vez que cualquiera de los Observables emite
c) Solo una vez al inicio
d) En intervalos regulares

**Respuesta correcta:** b)

**Explicación:** `combineLatest` emite cada vez que cualquiera de los Observables fuente emite, combinando los últimos valores de todos.

---

### Pregunta 17 (5 pts)

¿Cuál es la diferencia entre `forkJoin` y `combineLatest`?

a) `forkJoin` emite una vez al final, `combineLatest` emite continuamente
b) `forkJoin` emite continuamente, `combineLatest` una vez
c) `forkJoin` es para HTTP, `combineLatest` para eventos
d) No hay diferencia

**Respuesta correcta:** a)

**Explicación:** `forkJoin` espera a que todos completen y emite una vez. `combineLatest` emite cada vez que cualquiera cambia.

---

### Pregunta 18 (5 pts)

¿Qué hace `merge` con múltiples Observables?

a) Espera a que todos emitan
b) Intercala valores a medida que llegan
c) Combina por índice
d) Solo toma el primero en emitir

**Respuesta correcta:** b)

**Explicación:** `merge` combina múltiples Observables en uno, emitiendo valores a medida que llegan de cualquier fuente.

---

## Sección 5: Manejo de Errores (10 pts)

### Pregunta 19 (5 pts)

¿Qué DEBE retornar `catchError`?

a) `void`
b) Un valor cualquiera
c) Un Observable
d) Una Promise

**Respuesta correcta:** c)

**Explicación:** `catchError` debe retornar un Observable. Usualmente se usa `of(valor)` para retornar un valor por defecto.

---

### Pregunta 20 (5 pts)

¿Cómo reintentarías una petición HTTP 3 veces antes de fallar?

a) `retry(3)`
b) `retryWhen(3)`
c) `catchError(retry(3))`
d) `mergeMap(retry(3))`

**Respuesta correcta:** a)

**Explicación:** `retry(3)` reintenta la operación hasta 3 veces antes de propagar el error.

---

## Preguntas de Código

### Pregunta 21 (10 pts)

¿Qué está mal en este código?

```typescript
this.http.get('/api/users').pipe(
  catchError(error => {
    console.error(error);
    // No retorna nada
  })
).subscribe(users => this.users = users);
```

a) Falta el operador `map`
b) `catchError` no retorna un Observable
c) Falta `takeUntil`
d) b) y c) son correctas

**Respuesta correcta:** d)

**Explicación:** `catchError` debe retornar un Observable (ej: `return of([])`), y en componentes se recomienda usar `takeUntil` para cleanup.

---

### Pregunta 22 (10 pts)

¿Cómo corregirías este código?

```typescript
// Búsqueda con problemas
fromEvent(this.input.nativeElement, 'input').pipe(
  map(e => e.target.value),
  mergeMap(term => this.http.get(`/api/search?q=${term}`))
).subscribe(results => this.results = results);
```

a) Cambiar `mergeMap` por `switchMap`
b) Agregar `debounceTime(300)`
c) Agregar `filter(term => term.length >= 2)`
d) Todas las anteriores

**Respuesta correcta:** d)

**Explicación:** Para una búsqueda correcta se necesita: `switchMap` para cancelar anteriores, `debounceTime` para evitar spam, y `filter` para evitar búsquedas vacías.

---

## Ejercicio Práctico

### Pregunta 23 (20 pts)

Implementa una búsqueda reactiva con los siguientes requisitos:

1. Debounce de 300ms
2. Filtrar términos vacíos
3. Cancelar peticiones anteriores
4. Manejar errores
5. Mostrar loading

**Espacio para respuesta:**

```typescript
// Tu código aquí
searchProducts(): void {
  fromEvent<InputEvent>(this.searchInput.nativeElement, 'input').pipe(
    // 1. Obtener valor
    map(e => (e.target as HTMLInputElement).value),
    
    // 2. Filtrar vacíos
    filter(term => term.trim().length > 0),
    
    // 3. Debounce
    debounceTime(300),
    
    // 4. Evitar duplicados
    distinctUntilChanged(),
    
    // 5. Mostrar loading
    tap(() => this.loading.set(true)),
    
    // 6. Cancelar anteriores
    switchMap(term => 
      this.http.get<Product[]>(`/api/products?q=${term}`).pipe(
        // 7. Manejar errores
        catchError(() => of([])),
        // 8. Ocultar loading
        finalize(() => this.loading.set(false))
      )
    )
  ).subscribe(products => this.products.set(products));
}
```

---

## Respuestas Correctas

| Pregunta | Respuesta |
|----------|-----------|
| 1 | b) |
| 2 | c) |
| 3 | b) |
| 4 | c) |
| 5 | c) |
| 6 | b) |
| 7 | c) |
| 8 | b) |
| 9 | d) |
| 10 | b) |
| 11 | b) |
| 12 | b) |
| 13 | b) |
| 14 | d) |
| 15 | b) |
| 16 | b) |
| 17 | a) |
| 18 | b) |
| 19 | c) |
| 20 | a) |
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

*Assessment - Día 11 - Curso Angular 21 - UyuniAdmin Frontend*
