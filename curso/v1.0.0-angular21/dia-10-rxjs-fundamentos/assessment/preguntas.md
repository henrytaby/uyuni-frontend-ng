# Día 10: Evaluación - RxJS Fundamentos

## Preguntas de Evaluación

---

## Sección 1: Conceptos Básicos (20 puntos)

### Pregunta 1.1 (5 puntos)

**¿Cuál es la diferencia principal entre un Observable y una Promise?**

a) Ambos son iguales, solo cambia la sintaxis
b) Observable emite múltiples valores, Promise solo uno
c) Promise es más rápido que Observable
d) Observable solo funciona en Angular

<details>
<summary>Respuesta</summary>

**b) Observable emite múltiples valores, Promise solo uno**

Además, los Observables son cancelables, lazy (se ejecutan al suscribirse), y tienen operadores poderosos.
</details>

---

### Pregunta 1.2 (5 puntos)

**¿Qué métodos tiene un Observer completo?**

a) Solo `next()`
b) `next()` y `error()`
c) `next()`, `error()` y `complete()`
d) `subscribe()` y `unsubscribe()`

<details>
<summary>Respuesta</summary>

**c) `next()`, `error()` y `complete()`**

Un Observer completo implementa:
- `next(value)`: Maneja cada valor emitido
- `error(err)`: Maneja errores
- `complete()`: Se ejecuta cuando el stream termina
</details>

---

### Pregunta 1.3 (5 puntos)

**¿Cuándo se ejecuta el código dentro de un Observable?**

a) Cuando se crea el Observable
b) Cuando se suscribe un Observer
c) Cuando se importa el archivo
d) Inmediatamente al declararlo

<details>
<summary>Respuesta</summary>

**b) Cuando se suscribe un Observer**

Los Observables son "lazy". El código dentro del Observable solo se ejecuta cuando alguien se suscribe. Cada suscripción ejecuta el código independientemente.
</details>

---

### Pregunta 1.4 (5 puntos)

**¿Qué Subject tiene un valor inicial y emite el valor más reciente a nuevos suscriptores?**

a) `Subject`
b) `BehaviorSubject`
c) `ReplaySubject`
d) `AsyncSubject`

<details>
<summary>Respuesta</summary>

**b) `BehaviorSubject`**

`BehaviorSubject` requiere un valor inicial y siempre emite el valor más reciente a nuevos suscriptores. Es el más usado para manejar estado en Angular.
</details>

---

## Sección 2: Implementación (30 puntos)

### Pregunta 2.1 (10 puntos)

**¿Qué está mal en el siguiente código?**

```typescript
export class MyComponent implements OnInit {
  ngOnInit(): void {
    this.http.get('/api/data').subscribe(data => {
      this.data = data;
    });
  }
}
```

<details>
<summary>Respuesta</summary>

**Problema: Memory Leak**

La suscripción nunca se cancela. Si el componente se destruye antes de que llegue la respuesta, la suscripción sigue activa.

**Solución:**

```typescript
export class MyComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.http.get('/api/data').pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => {
      this.data = data;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

O mejor, usar AsyncPipe:

```typescript
data$ = this.http.get('/api/data');
// En template: {{ data$ | async }}
```
</details>

---

### Pregunta 2.2 (10 puntos)

**Escribe un servicio que use BehaviorSubject para manejar el estado de un contador.**

Requisitos:
- Valor inicial: 0
- Método para obtener el Observable
- Método para incrementar
- Método para decrementar
- Método para resetear

<details>
<summary>Respuesta</summary>

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CounterService {
  private counterSubject = new BehaviorSubject<number>(0);
  
  // Observable público (solo lectura)
  counter$: Observable<number> = this.counterSubject.asObservable();
  
  // Getter para valor actual
  get currentValue(): number {
    return this.counterSubject.value;
  }
  
  // Incrementar
  increment(): void {
    this.counterSubject.next(this.counterSubject.value + 1);
  }
  
  // Decrementar
  decrement(): void {
    this.counterSubject.next(this.counterSubject.value - 1);
  }
  
  // Resetear
  reset(value: number = 0): void {
    this.counterSubject.next(value);
  }
}
```
</details>

---

### Pregunta 2.3 (10 puntos)

**Transforma el siguiente código de Promises a Observables:**

```typescript
// Código con Promises
fetchUser(userId: string): Promise<User> {
  return fetch(`/api/users/${userId}`)
    .then(response => response.json());
}

// Uso
this.fetchUser('123').then(user => {
  console.log(user);
});
```

<details>
<summary>Respuesta</summary>

```typescript
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Código con Observables
@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);

  fetchUser(userId: string): Observable<User> {
    return this.http.get<User>(`/api/users/${userId}`);
  }
}

// Uso
this.userService.fetchUser('123').subscribe({
  next: user => console.log(user),
  error: err => console.error('Error:', err)
});

// O con AsyncPipe en template
// user$ = this.userService.fetchUser('123');
// {{ user$ | async | json }}
```
</details>

---

## Sección 3: Operadores (25 puntos)

### Pregunta 3.1 (10 puntos)

**¿Qué hace el siguiente código?**

```typescript
this.http.get<User[]>('/api/users').pipe(
  filter(users => users.length > 0),
  map(users => users.map(u => u.name)),
  tap(names => console.log('Nombres:', names))
).subscribe();
```

<details>
<summary>Respuesta</summary>

**Explicación paso a paso:**

1. `this.http.get<User[]>('/api/users')`: Hace petición HTTP, retorna Observable de usuarios

2. `filter(users => users.length > 0)`: Si el array está vacío, no emite nada

3. `map(users => users.map(u => u.name))`: Transforma el array de usuarios a array de nombres

4. `tap(names => console.log('Nombres:', names))`: Loguea los nombres sin modificar el stream

5. `.subscribe()`: Se suscribe (necesario para ejecutar)

**Resultado:** Obtiene usuarios, filtra arrays vacíos, extrae nombres, y los loguea.
</details>

---

### Pregunta 3.2 (10 puntos)

**Implementa una búsqueda con debounce que:**
1. Escuche el evento input de un campo
2. Espere 300ms antes de procesar
3. Filtre búsquedas de menos de 3 caracteres
4. No repita búsquedas idénticas consecutivas

<details>
<summary>Respuesta</summary>

```typescript
import { fromEvent } from 'rxjs';
import { debounceTime, map, filter, distinctUntilChanged, switchMap } from 'rxjs/operators';

// En componente
export class SearchComponent {
  private searchInput = document.getElementById('search') as HTMLInputElement;
  
  setupSearch(): void {
    fromEvent<InputEvent>(this.searchInput, 'input').pipe(
      // Obtener valor del input
      map(event => (event.target as HTMLInputElement).value),
      
      // Esperar 300ms
      debounceTime(300),
      
      // No repetir búsquedas idénticas
      distinctUntilChanged(),
      
      // Filtrar búsquedas cortas
      filter(value => value.length >= 3),
      
      // Cambiar a Observable de búsqueda (cancela anteriores)
      switchMap(term => this.searchService.search(term))
    ).subscribe({
      next: results => this.results = results,
      error: err => console.error('Error:', err)
    });
  }
}
```
</details>

---

### Pregunta 3.3 (5 puntos)

**¿Cuál es la diferencia entre `map` y `tap`?**

<details>
<summary>Respuesta</summary>

| Operador | Propósito | Modifica el stream |
|----------|-----------|-------------------|
| `map` | Transformar valores | ✅ Sí, retorna nuevo valor |
| `tap` | Side effects (debug, log) | ❌ No, pasa el valor sin cambios |

**Ejemplo:**

```typescript
// map: transforma el valor
observable.pipe(
  map(x => x * 2)  // 1 → 2, 2 → 4
)

// tap: solo observa, no transforma
observable.pipe(
  tap(x => console.log(x))  // 1 → 1, 2 → 2 (sin cambios)
)
```

`tap` es útil para debugging sin afectar el stream.
</details>

---

## Sección 4: Escenarios Prácticos (25 puntos)

### Pregunta 4.1 (10 puntos)

**Tienes un servicio que necesita notificar a múltiples componentes cuando ocurre un evento. ¿Qué tipo de Subject usarías y por qué?**

<details>
<summary>Respuesta</summary>

**Respuesta: Depende del caso de uso**

1. **Subject** - Si los componentes solo necesitan recibir eventos futuros:
   ```typescript
   private eventSubject = new Subject<Event>();
   event$ = this.eventSubject.asObservable();
   
   emitEvent(event: Event): void {
     this.eventSubject.next(event);
   }
   ```

2. **BehaviorSubject** - Si los componentes necesitan el último valor al suscribirse:
   ```typescript
   private stateSubject = new BehaviorSubject<State>(initialState);
   state$ = this.stateSubject.asObservable();
   ```

3. **ReplaySubject** - Si los componentes necesitan un historial de eventos:
   ```typescript
   private historySubject = new ReplaySubject<Event>(10); // Últimos 10
   history$ = this.historySubject.asObservable();
   ```

**Para notificaciones simples, usa `Subject`. Para estado, usa `BehaviorSubject`.**
</details>

---

### Pregunta 4.2 (10 puntos)

**¿Cómo manejarías una petición HTTP que puede fallar y necesita reintentar 3 veces antes de mostrar error?**

<details>
<summary>Respuesta</summary>

```typescript
import { HttpClient } from '@angular/common/http';
import { retry, catchError, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataService {
  private http = inject(HttpClient);

  getData(): Observable<Data> {
    return this.http.get<Data>('/api/data').pipe(
      // Reintentar 3 veces si falla
      retry(3),
      
      // Si aún falla después de 3 intentos
      catchError(error => {
        console.error('Error después de 3 intentos:', error);
        return throwError(() => new Error('No se pudo obtener los datos'));
      })
    );
  }
}

// Uso
this.dataService.getData().subscribe({
  next: data => console.log('Datos:', data),
  error: err => this.showError(err.message)
});
```

**Con delay entre reintentos:**

```typescript
import { retry, delay } from 'rxjs';

this.http.get<Data>('/api/data').pipe(
  retry({
    count: 3,
    delay: 1000 // Esperar 1 segundo entre reintentos
  }),
  catchError(error => throwError(() => error))
);
```
</details>

---

### Pregunta 4.3 (5 puntos)

**¿Por qué es importante usar `distinctUntilChanged` en una búsqueda?**

<details>
<summary>Respuesta</summary>

**Razón: Evitar peticiones duplicadas**

Si el usuario escribe "hola", borra y vuelve a escribir "hola", sin `distinctUntilChanged` se harían dos peticiones idénticas.

```typescript
fromEvent(searchInput, 'input').pipe(
  map(e => e.target.value),
  debounceTime(300),
  distinctUntilChanged(), // ← Evita duplicados
  switchMap(term => this.search(term))
);

// Sin distinctUntilChanged:
// "hola" → petición
// (borra)
// "hola" → petición (duplicada)

// Con distinctUntilChanged:
// "hola" → petición
// (borra)
// "hola" → NO hace petición (es igual al anterior)
```

Esto ahorra recursos del servidor y mejora la UX.
</details>

---

## Puntuación Total

| Sección | Puntos | Tu Puntuación |
|---------|--------|---------------|
| Sección 1: Conceptos Básicos | 20 | |
| Sección 2: Implementación | 30 | |
| Sección 3: Operadores | 25 | |
| Sección 4: Escenarios Prácticos | 25 | |
| **Total** | **100** | |

---

## Criterios de Evaluación

| Puntuación | Nivel |
|------------|-------|
| 90-100 | Excelente - Dominas RxJS fundamental |
| 70-89 | Bueno - Tienes sólida comprensión |
| 50-69 | Aprobado - Necesitas reforzar conceptos |
| 0-49 | Insuficiente - Revisa el contenido |

---

## Recursos Adicionales

- [Contenido del Día 10](../contenido.md)
- [Lab 01: Observables](../ejercicios/lab-01.md)
- [Lab 02: Subjects](../ejercicios/lab-02.md)
- [RxJS Documentation](https://rxjs.dev/)
- [Learn RxJS](https://www.learnrxjs.io/)

---

*Evaluación del Día 10 - RxJS Fundamentos*
*Curso Angular 21 - UyuniAdmin Frontend*
