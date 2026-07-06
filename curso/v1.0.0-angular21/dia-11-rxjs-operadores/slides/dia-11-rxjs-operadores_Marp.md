# Día 11: Slides - RxJS Operadores

## Slide 1: Título

# RxJS Operadores
## Transformación y Control de Flujos

**Día 11 - Módulo 4: RxJS y Estado Avanzado**

Curso Angular 21 - UyuniAdmin Frontend

---

## Slide 2: Agenda

### Hoy Aprenderemos

1. ✅ Operadores de Creación
2. ✅ Operadores de Transformación
3. ✅ Operadores de Filtrado
4. ✅ Operadores de Combinación
5. ✅ Manejo de Errores
6. ✅ Patrones Comunes en Angular

---

## Slide 3: Hook - El Problema

### ¿Cómo manejas peticiones dependientes?

```typescript
// ❌ Callback Hell
this.http.get('/user/1').subscribe(user => {
  this.http.get(`/orders/${user.id}`).subscribe(orders => {
    this.http.get(`/details/${orders[0].id}`).subscribe(details => {
      // ¡Ayuda!
    });
  });
});
```

---

## Slide 4: Hook - La Solución

### Con operadores de transformación

```typescript
// ✅ Elegante y mantenible
this.http.get('/user/1').pipe(
  switchMap(user => this.http.get(`/orders/${user.id}`)),
  switchMap(orders => this.http.get(`/details/${orders[0].id}`))
).subscribe(details => {
  // Código limpio
});
```

---

## Slide 5: ¿Qué son los Operadores?

### Definición

> Los operadores son funciones que transforman, filtran o combinan los valores emitidos por un Observable.

### Características

- Son **puros**: No modifican el Observable original
- Son **componibles**: Se encadenan con `pipe()`
- Son **inmutables**: Retornan un nuevo Observable

---

## Slide 6: Categorías de Operadores

```
┌─────────────────────────────────────────────────────┐
│                  OPERADORES RXJS                    │
├─────────────┬─────────────┬─────────────┬──────────┤
│  Creación   │Transformación│  Filtrado  │Combinación│
├─────────────┼─────────────┼─────────────┼──────────┤
│ of          │ map         │ filter      │combineLatest│
│ from        │ switchMap   │ take        │ forkJoin  │
│ fromEvent   │ mergeMap    │ takeUntil   │ merge     │
│ interval    │ concatMap   │ debounceTime│ zip       │
│ timer       │ exhaustMap  │ distinctUntil│          │
└─────────────┴─────────────┴─────────────┴──────────┘
```

---

## Slide 7: Operadores de Creación

### Crear Observables desde diferentes fuentes

| Operador | Fuente | Ejemplo |
|----------|--------|---------|
| `of` | Valores estáticos | `of(1, 2, 3)` |
| `from` | Arrays/Promises | `from([1, 2, 3])` |
| `fromEvent` | Eventos DOM | `fromEvent(input, 'input')` |
| `interval` | Periódico | `interval(1000)` |
| `timer` | Diferido | `timer(1000, 500)` |

---

## Slide 8: of vs from

### Diferencia clave

```typescript
// of: emite el array COMPLETO
of([1, 2, 3]).subscribe(console.log);
// Output: [1, 2, 3]

// from: emite CADA elemento
from([1, 2, 3]).subscribe(console.log);
// Output: 1, 2, 3
```

---

## Slide 9: fromEvent - Eventos DOM

### Escuchar eventos del usuario

```typescript
fromEvent<InputEvent>(inputElement, 'input').pipe(
  map(e => (e.target as HTMLInputElement).value),
  debounceTime(300)
).subscribe(term => {
  console.log('Buscar:', term);
});
```

---

## Slide 10: Operadores de Transformación

### Los más importantes para Angular

| Operador | Comportamiento | Uso |
|----------|----------------|-----|
| `map` | Transforma valores | Mapeo simple |
| `switchMap` | Cancela anterior | Búsquedas |
| `mergeMap` | Paralelo | Requests múltiples |
| `concatMap` | Secuencial | Operaciones ordenadas |
| `exhaustMap` | Ignora nuevos | Prevenir spam |

---

## Slide 11: map - Transformación Simple

### Como Array.map() pero para Observables

```typescript
of(1, 2, 3, 4, 5).pipe(
  map(x => x * 10)
).subscribe(console.log);
// Output: 10, 20, 30, 40, 50
```

### Diagrama

```
Input:  ---1---2---3---4---5---|
         ↓   ↓   ↓   ↓   ↓
map(x => x * 10)
         ↓   ↓   ↓   ↓   ↓
Output: ---10--20--30--40--50--|
```

---

## Slide 12: switchMap - El Rey de las Búsquedas

### Cancela la petición anterior cuando llega una nueva

```typescript
fromEvent<InputEvent>(searchInput, 'input').pipe(
  map(e => (e.target as HTMLInputElement).value),
  switchMap(term => this.http.get(`/api/search?q=${term}`))
).subscribe(results => this.results = results);
```

### Diagrama

```
Input:    a----b----c----
           \    \    \
HTTP:      --a-- --b-- --c--
                ↑    ↑
           cancela cancela
           
Output:    ------b----c--
```

---

## Slide 13: switchMap - Casos de Uso

### ✅ Usar cuando:

- Búsquedas con autocomplete
- Navegación basada en parámetros
- Cualquier operación que pueda quedar obsoleta

### ❌ NO usar cuando:

- Necesitas todas las respuestas
- El orden de llegada importa
- Las operaciones son independientes

---

## Slide 14: mergeMap - Paralelo

### Ejecuta todos los Observables en paralelo

```typescript
of(1, 2, 3).pipe(
  mergeMap(id => this.http.get(`/api/users/${id}`))
).subscribe(user => console.log(user));

// Output: user2, user1, user3 (orden no garantizado)
```

### Diagrama

```
Input:    ---1---2---3---
           \   \   \
HTTP:      --1--2--3-- (paralelo)
           
Output:    ---u1--u2--u3--- (orden variable)
```

---

## Slide 15: concatMap - Secuencial

### Ejecuta uno después de otro, en orden

```typescript
of(user1, user2, user3).pipe(
  concatMap(user => this.http.post('/api/users', user))
).subscribe(response => console.log(response));

// Output: response1, response2, response3 (siempre en orden)
```

### Diagrama

```
Input:    ---u1---u2---u3---
           \    \    \
HTTP:      --1--| --2--| --3--|
               
Output:    ------r1----r2----r3--|
```

---

## Slide 16: exhaustMap - Ignorar Nuevos

### Ignora nuevos valores mientras hay uno en curso

```typescript
fromEvent(submitButton, 'click').pipe(
  exhaustMap(() => this.http.post('/api/save', formData))
).subscribe(response => {
  console.log('Guardado:', response);
});
```

### Diagrama

```
Clicks:    a--b--c----d--
            \  ↓  ↓    
HTTP:       --a-------d--
               ↑
           ignorados
```

---

## Slide 17: Comparación Visual

### ¿Qué operador usar?

```
┌─────────────────────────────────────────────────────┐
│              ¿Qué necesito?                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ¿Cancelar operaciones anteriores?                  │
│         ↓ Sí                    ↓ No               │
│    switchMap              ¿Ejecutar en paralelo?    │
│                              ↓ Sí    ↓ No          │
│                          mergeMap  ¿Orden importa? │
│                                     ↓ Sí    ↓ No   │
│                                 concatMap  exhaustMap│
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Slide 18: Operadores de Filtrado

### Controlar qué valores pasan

| Operador | Función |
|----------|---------|
| `filter` | Solo valores que cumplen condición |
| `take` | Solo los primeros N valores |
| `takeUntil` | Hasta que otro Observable emita |
| `first` | Solo el primer valor |
| `last` | Solo el último valor |
| `distinctUntilChanged` | Evitar duplicados consecutivos |
| `debounceTime` | Esperar inactividad |

---

## Slide 19: filter y take

### Filtrar valores

```typescript
// Solo números pares
of(1, 2, 3, 4, 5, 6).pipe(
  filter(x => x % 2 === 0)
).subscribe(console.log);
// Output: 2, 4, 6

// Solo los primeros 3
interval(1000).pipe(
  take(3)
).subscribe(console.log);
// Output: 0, 1, 2, Complete
```

---

## Slide 20: takeUntil - Cleanup Esencial

### Evitar memory leaks

```typescript
@Component({...})
export class MyComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.http.get('/api/data').pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => this.data = data);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

---

## Slide 21: debounceTime vs throttleTime

### Controlar frecuencia de emisiones

```typescript
// debounceTime: Espera 300ms sin emisiones
fromEvent(input, 'input').pipe(
  debounceTime(300)
).subscribe(term => console.log('Buscar:', term));

// throttleTime: Máximo una emisión cada 300ms
fromEvent(window, 'scroll').pipe(
  throttleTime(300)
).subscribe(() => console.log('Scroll'));
```

---

## Slide 22: Operadores de Combinación

### Combinar múltiples Observables

| Operador | Comportamiento |
|----------|----------------|
| `combineLatest` | Combina últimos valores de cada uno |
| `forkJoin` | Espera a que todos completen |
| `merge` | Intercala valores |
| `zip` | Combina por índice |

---

## Slide 23: forkJoin - El Perfecto para HTTP

### Esperar múltiples requests

```typescript
forkJoin({
  users: this.http.get<User[]>('/api/users'),
  orders: this.http.get<Order[]>('/api/orders'),
  stats: this.http.get<Stats>('/api/stats')
}).subscribe(({ users, orders, stats }) => {
  this.users = users;
  this.orders = orders;
  this.stats = stats;
});
```

### Solo emite una vez, cuando todos completan

---

## Slide 24: combineLatest vs forkJoin

### Diferencia clave

```
combineLatest:
Observable 1: --a----b----c----|
Observable 2: ----x----y----z--|
              ↓
Output:       --[a,x]-[b,x]-[b,y]-[c,y]-[c,z]|
              (emite cada vez que cualquiera cambia)

forkJoin:
Observable 1: --a----b----c----|
Observable 2: ----x----y----z--|
              ↓
Output:       ------------------[c,z]|
              (solo emite al final)
```

---

## Slide 25: Manejo de Errores

### catchError y retry

```typescript
this.http.get('/api/data').pipe(
  retry(3), // Reintenta 3 veces
  catchError(error => {
    console.error('Error:', error);
    return of([]); // Valor por defecto
  })
).subscribe(data => this.data = data);
```

### ⚠️ catchError DEBE retornar un Observable

---

## Slide 26: Patrones Comunes

### Búsqueda Reactiva Completa

```typescript
searchUsers(): void {
  fromEvent<InputEvent>(this.searchInput.nativeElement, 'input').pipe(
    map(e => (e.target as HTMLInputElement).value),
    filter(term => term.length >= 2),
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(term => 
      this.http.get<User[]>(`/api/users?q=${term}`).pipe(
        catchError(() => of([]))
      )
    )
  ).subscribe(users => this.users.set(users));
}
```

---

## Slide 27: Patrones Comunes

### Cargar Datos con Loading

```typescript
loadData(): void {
  this.loading.set(true);
  
  this.http.get<Data[]>('/api/data').pipe(
    timeout(10000),
    retry(2),
    catchError(error => {
      this.notificationService.showError('Error al cargar');
      return of([]);
    }),
    finalize(() => this.loading.set(false))
  ).subscribe(data => this.data.set(data));
}
```

---

## Slide 28: Errores Comunes

### ❌ Suscripciones Anidadas

```typescript
// ❌ MAL
this.http.get('/user/1').subscribe(user => {
  this.http.get(`/orders/${user.id}`).subscribe(orders => {
    // Anti-pattern
  });
});

// ✅ BIEN
this.http.get('/user/1').pipe(
  switchMap(user => this.http.get(`/orders/${user.id}`))
).subscribe(orders => this.orders = orders);
```

---

## Slide 29: Errores Comunes

### ❌ No Cancelar Suscripciones

```typescript
// ❌ MAL
ngOnInit(): void {
  this.http.get('/api/data').subscribe(data => this.data = data);
}

// ✅ BIEN
ngOnInit(): void {
  this.http.get('/api/data').pipe(
    takeUntil(this.destroy$)
  ).subscribe(data => this.data = data);
}
```

---

## Slide 30: Errores Comunes

### ❌ catchError sin retornar Observable

```typescript
// ❌ MAL
this.http.get('/api/data').pipe(
  catchError(error => {
    console.error(error);
    // No retorna nada!
  })
);

// ✅ BIEN
this.http.get('/api/data').pipe(
  catchError(error => {
    console.error(error);
    return of([]); // Retorna Observable
  })
);
```

---

## Slide 31: Mini Reto

### Implementa una búsqueda con:

1. ✅ Debounce de 300ms
2. ✅ Filtrar búsquedas vacías
3. ✅ Cancelar peticiones anteriores
4. ✅ Manejar errores
5. ✅ Mostrar loading

**Tiempo: 15 minutos**

---

## Slide 32: Solución del Mini Reto

```typescript
searchProducts(): void {
  this.loading.set(true);
  
  fromEvent<InputEvent>(this.searchInput.nativeElement, 'input').pipe(
    map(e => (e.target as HTMLInputElement).value),
    filter(term => term.trim().length > 0),
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(term => 
      this.http.get<Product[]>(`/api/products?q=${term}`).pipe(
        catchError(() => of([])),
        finalize(() => this.loading.set(false))
      )
    )
  ).subscribe(products => this.products.set(products));
}
```

---

## Slide 33: Resumen del Día

### Operadores Cubiertos

| Categoría | Operadores |
|-----------|------------|
| Creación | `of`, `from`, `fromEvent`, `interval`, `timer` |
| Transformación | `map`, `switchMap`, `mergeMap`, `concatMap`, `exhaustMap` |
| Filtrado | `filter`, `take`, `takeUntil`, `debounceTime`, `distinctUntilChanged` |
| Combinación | `combineLatest`, `forkJoin`, `merge` |
| Errores | `catchError`, `retry` |
| Utilidad | `tap`, `finalize`, `timeout` |

---

## Slide 34: Puntos Clave

### Recuerda

1. **switchMap** cancela operaciones anteriores
2. **mergeMap** ejecuta en paralelo
3. **concatMap** ejecuta secuencialmente
4. **takeUntil** evita memory leaks
5. **catchError** debe retornar un Observable

---

## Slide 35: Próximo Día

### Día 12: Estado con Signals y RxJS

- Integración de Signals con Observables
- `toSignal()` y `toObservable()`
- Patrones de estado reactivos
- Computed signals con Observables

---

## Slide 36: Recursos

### Lectura Recomendada

- 📖 [RxJS Official Docs](https://rxjs.dev/)
- 🎮 [RxMarbles](https://rxmarbles.com/) - Visualización interactiva
- 📚 [Learn RxJS](https://www.learnrxjs.io/)
- 🌳 [Operator Decision Tree](https://rxjs.dev/operator-decision-tree)

---

## Slide 37: Cierre

### ¡Preguntas?

**Ejercicios:**
- [Lab 01: Operadores de Transformación](../ejercicios/lab-01.md)
- [Lab 02: Operadores de Combinación](../ejercicios/lab-02.md)

**Assessment:** [Preguntas de Evaluación](../assessment/preguntas.md)

---

*Slides del Día 11 - Curso Angular 21 - UyuniAdmin Frontend*
