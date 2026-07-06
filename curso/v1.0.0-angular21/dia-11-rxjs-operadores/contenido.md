# Día 11: Contenido Detallado - RxJS Operadores

## Índice

1. [Operadores de Creación](#1-operadores-de-creación)
2. [Operadores de Transformación](#2-operadores-de-transformación)
3. [Operadores de Filtrado](#3-operadores-de-filtrado)
4. [Operadores de Combinación](#4-operadores-de-combinación)
5. [Operadores de Manejo de Errores](#5-operadores-de-manejo-de-errores)
6. [Operadores de Utilidad](#6-operadores-de-utilidad)
7. [Patrones Comunes en Angular](#7-patrones-comunes-en-angular)

---

## 1. Operadores de Creación

### 1.1 ¿Qué son los Operadores de Creación?

Los operadores de creación generan Observables desde diferentes fuentes de datos. Son el punto de entrada para crear streams.

### 1.2 `of` - Valores Estáticos

Crea un Observable que emite una secuencia de valores y luego completa.

```typescript
import { of } from 'rxjs';

// Emitir valores individuales
of(1, 2, 3, 4, 5).subscribe({
  next: value => console.log(value),
  complete: () => console.log('Completado')
});
// Output: 1, 2, 3, 4, 5, Completado

// Emitir un solo valor
of('Hola Mundo').subscribe(console.log);
// Output: Hola Mundo

// Emitir objetos
const user = { id: 1, name: 'Juan' };
of(user).subscribe(console.log);
// Output: { id: 1, name: 'Juan' }
```

**Uso en Angular:**
- Valores por defecto
- Mock data en tests
- Datos estáticos de configuración

### 1.3 `from` - Arrays y Promises

Convierte arrays, promises, o iterables en Observables.

```typescript
import { from } from 'rxjs';

// Desde un array
from([1, 2, 3, 4, 5]).subscribe(console.log);
// Output: 1, 2, 3, 4, 5 (un valor a la vez)

// Desde una Promise
from(fetch('/api/users')).subscribe({
  next: response => console.log(response),
  error: err => console.error('Error:', err)
});

// Desde un string (iterable)
from('Hola').subscribe(console.log);
// Output: H, o, l, a
```

**Diferencia con `of`:**
```typescript
// of emite el array completo como un valor
of([1, 2, 3]).subscribe(console.log);
// Output: [1, 2, 3]

// from emite cada elemento del array
from([1, 2, 3]).subscribe(console.log);
// Output: 1, 2, 3
```

### 1.4 `fromEvent` - Eventos DOM

Crea un Observable desde eventos del DOM.

```typescript
import { fromEvent } from 'rxjs';

// Evento de click en documento
fromEvent(document, 'click').subscribe(event => {
  console.log('Click en:', (event as MouseEvent).clientX, (event as MouseEvent).clientY);
});

// Evento de input en un elemento
const input = document.getElementById('search')!;
fromEvent<InputEvent>(input, 'input').subscribe(event => {
  console.log('Valor:', (event.target as HTMLInputElement).value);
});

// Evento de scroll
fromEvent(window, 'scroll').subscribe(() => {
  console.log('Scroll position:', window.scrollY);
});
```

### 1.5 `interval` - Emisión Periódica

Emite valores secuenciales cada X milisegundos.

```typescript
import { interval } from 'rxjs';

// Emitir cada 1 segundo
interval(1000).subscribe(n => console.log(n));
// Output: 0, 1, 2, 3, 4... (nunca completa)

// Con take para limitar
interval(1000).pipe(
  take(5)
).subscribe(n => console.log(n));
// Output: 0, 1, 2, 3, 4, Completado
```

### 1.6 `timer` - Emisión Diferida

Similar a `interval`, pero con un delay inicial.

```typescript
import { timer } from 'rxjs';

// Emitir después de 2 segundos
timer(2000).subscribe(() => console.log('¡Listo!'));

// Emitir después de 1 segundo, luego cada 500ms
timer(1000, 500).subscribe(n => console.log(n));
// Output: (después de 1s) 0, (después de 0.5s) 1, 2, 3...
```

---

## 2. Operadores de Transformación

### 2.1 `map` - Transformación Simple

Transforma cada valor emitido aplicando una función.

```typescript
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

of(1, 2, 3, 4, 5).pipe(
  map(x => x * 10)
).subscribe(console.log);
// Output: 10, 20, 30, 40, 50

// Transformar objetos
of({ name: 'Juan', age: 25 }).pipe(
  map(user => ({ ...user, isAdult: user.age >= 18 }))
).subscribe(console.log);
// Output: { name: 'Juan', age: 25, isAdult: true }
```

### 2.2 `switchMap` - Cambiar de Observable

El operador más importante para HTTP en Angular. Cancela el Observable anterior cuando llega un nuevo valor.

```typescript
import { fromEvent } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// Búsqueda: cancela peticiones anteriores
fromEvent<InputEvent>(searchInput, 'input').pipe(
  map(e => (e.target as HTMLInputElement).value),
  switchMap(term => this.http.get(`/api/search?q=${term}`))
).subscribe(results => {
  this.results = results;
});
```

**Diagrama de comportamiento:**
```
Input:    a----b----c----
           \    \    \
HTTP:      --a-- --b-- --c--
                ↑    ↑
           cancela cancela
           
Output:    ------b----c--
```

**Uso en UyuniAdmin:**
```typescript
// auth.interceptor.ts - Token refresh
return this.tokenRefreshService.refreshToken(refreshToken).pipe(
  switchMap(tokens => {
    // Reintenta con nuevo token
    return next(this.addToken(req, tokens.access_token));
  })
);
```

### 2.3 `mergeMap` (flatMap) - Paralelo

Ejecuta todos los Observables en paralelo, sin cancelar anteriores.

```typescript
import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

// Cargar múltiples usuarios en paralelo
of(1, 2, 3).pipe(
  mergeMap(id => this.http.get(`/api/users/${id}`))
).subscribe(user => console.log(user));

// El orden de llegada puede variar
// Output: user2, user1, user3 (orden no garantizado)
```

**Cuándo usar:**
- Operaciones que pueden ir en paralelo
- Cuando no importa el orden
- Múltiples requests independientes

### 2.4 `concatMap` - Secuencial

Ejecuta los Observables uno después de otro, en orden.

```typescript
import { of } from 'rxjs';
import { concatMap } from 'rxjs/operators';

// Guardar en orden
of(user1, user2, user3).pipe(
  concatMap(user => this.http.post('/api/users', user))
).subscribe(response => console.log(response));

// Output: response1, response2, response3 (siempre en orden)
```

**Cuándo usar:**
- Operaciones que dependen del orden
- Cuando la secuencia es importante
- Evitar race conditions

### 2.5 `exhaustMap` - Ignorar Nuevos

Ignora nuevos valores mientras hay uno en curso.

```typescript
import { fromEvent } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';

// Prevenir múltiples submits
fromEvent(submitButton, 'click').pipe(
  exhaustMap(() => this.http.post('/api/save', this.form.value))
).subscribe(response => {
  console.log('Guardado:', response);
});
```

**Diagrama de comportamiento:**
```
Clicks:    a--b--c----d--
            \  ↓  ↓    
HTTP:       --a-------d--
               ↑
           ignorados
```

**Cuándo usar:**
- Prevenir spam de clicks
- Formularios de submit
- Operaciones que no deben repetirse

### 2.6 Comparación de Operadores de Transformación

| Operador | Comportamiento | Cancela anterior | Orden garantizado | Uso típico |
|----------|----------------|------------------|-------------------|------------|
| `switchMap` | Cambia al nuevo | ✅ Sí | ❌ No | Búsquedas, navegación |
| `mergeMap` | Todos en paralelo | ❌ No | ❌ No | Requests paralelos |
| `concatMap` | Uno a uno | ❌ No | ✅ Sí | Operaciones secuenciales |
| `exhaustMap` | Ignora nuevos | ❌ No | ✅ Sí | Prevenir spam |

---

## 3. Operadores de Filtrado

### 3.1 `filter` - Filtrar Valores

Solo deja pasar valores que cumplen una condición.

```typescript
import { of } from 'rxjs';
import { filter } from 'rxjs/operators';

of(1, 2, 3, 4, 5, 6).pipe(
  filter(x => x % 2 === 0) // Solo pares
).subscribe(console.log);
// Output: 2, 4, 6

// Filtrar objetos
of(user1, user2, user3).pipe(
  filter(user => user.age >= 18)
).subscribe(console.log);
```

### 3.2 `take` - Limitar Emisiones

Toma solo los primeros N valores.

```typescript
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';

interval(1000).pipe(
  take(3)
).subscribe(console.log);
// Output: 0, 1, 2, Completado
```

### 3.3 `takeUntil` - Hasta que Otro Emita

Emite valores hasta que otro Observable emita.

```typescript
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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

### 3.4 `takeWhile` - Mientras Cumpla Condición

Emite mientras la condición sea verdadera.

```typescript
import { interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

interval(1000).pipe(
  takeWhile(x => x < 5)
).subscribe(console.log);
// Output: 0, 1, 2, 3, 4, Completado
```

### 3.5 `first` y `last` - Primero y Último

```typescript
import { of } from 'rxjs';
import { first, last } from 'rxjs/operators';

of(1, 2, 3, 4, 5).pipe(
  first()
).subscribe(console.log);
// Output: 1

of(1, 2, 3, 4, 5).pipe(
  last()
).subscribe(console.log);
// Output: 5

// Con condición
of(1, 2, 3, 4, 5).pipe(
  first(x => x > 2)
).subscribe(console.log);
// Output: 3
```

### 3.6 `distinctUntilChanged` - Evitar Duplicados

Solo emite si el valor es diferente al anterior.

```typescript
import { of } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

of(1, 1, 2, 2, 2, 3, 3, 1).pipe(
  distinctUntilChanged()
).subscribe(console.log);
// Output: 1, 2, 3, 1

// Con objetos (usar comparador personalizado)
of(
  { id: 1, name: 'Juan' },
  { id: 1, name: 'Juan' },
  { id: 2, name: 'Maria' }
).pipe(
  distinctUntilChanged((prev, curr) => prev.id === curr.id)
).subscribe(console.log);
```

### 3.7 `debounceTime` - Esperar Inactividad

Espera un tiempo sin emisiones antes de emitir.

```typescript
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

fromEvent<InputEvent>(searchInput, 'input').pipe(
  map(e => (e.target as HTMLInputElement).value),
  debounceTime(300) // Espera 300ms sin typing
).subscribe(term => {
  console.log('Buscar:', term);
});
```

### 3.8 `throttleTime` - Limitar Frecuencia

Emite como máximo una vez cada X milisegundos.

```typescript
import { fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

fromEvent(window, 'scroll').pipe(
  throttleTime(200) // Máximo una vez cada 200ms
).subscribe(() => {
  console.log('Scroll position:', window.scrollY);
});
```

---

## 4. Operadores de Combinación

### 4.1 `combineLatest` - Combinar Últimos Valores

Combina los últimos valores de múltiples Observables.

```typescript
import { combineLatest } from 'rxjs';

combineLatest([
  this.http.get('/api/users'),
  this.http.get('/api/orders')
]).subscribe(([users, orders]) => {
  console.log('Users:', users.length);
  console.log('Orders:', orders.length);
});

// Emite cada vez que cualquiera de los Observables emite
// Output: [users, orders], [users', orders], [users', orders']...
```

### 4.2 `forkJoin` - Esperar Todos

Espera a que todos los Observables completen y emite un array con los últimos valores.

```typescript
import { forkJoin } from 'rxjs';

// Cargar múltiples recursos en paralelo
forkJoin({
  users: this.http.get<User[]>('/api/users'),
  orders: this.http.get<Order[]>('/api/orders'),
  stats: this.http.get<Stats>('/api/stats')
}).subscribe(({ users, orders, stats }) => {
  this.users = users;
  this.orders = orders;
  this.stats = stats;
});

// Solo emite una vez, cuando todos completan
```

**Uso en UyuniAdmin:**
```typescript
// Cargar datos del dashboard
loadDashboardData(): Observable<DashboardData> {
  return forkJoin({
    metrics: this.http.get('/api/metrics'),
    recentOrders: this.http.get('/api/orders/recent'),
    notifications: this.http.get('/api/notifications')
  });
}
```

### 4.3 `merge` - Intercalar Valores

Combina múltiples Observables en uno, emitiendo valores a medida que llegan.

```typescript
import { merge, interval } from 'rxjs';

const source1$ = interval(1000);
const source2$ = interval(500);

merge(source1$, source2$).subscribe(console.log);
// Output: 0 (source2), 0 (source1), 1 (source2), 1 (source2), 1 (source1)...
```

### 4.4 `zip` - Combinar por Índice

Combina valores de múltiples Observables por su índice.

```typescript
import { zip, of } from 'rxjs';

zip(
  of('A', 'B', 'C'),
  of(1, 2, 3)
).subscribe(([letter, number]) => {
  console.log(letter, number);
});
// Output: A 1, B 2, C 3
```

### 4.5 `withLatestFrom` - Combinar con Último

Combina el valor actual con el último valor de otro Observable.

```typescript
import { fromEvent } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';

fromEvent(saveButton, 'click').pipe(
  withLatestFrom(this.form.valueChanges)
).subscribe(([click, formValue]) => {
  this.save(formValue);
});
```

---

## 5. Operadores de Manejo de Errores

### 5.1 `catchError` - Capturar Errores

Maneja errores en el stream.

```typescript
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

this.http.get('/api/users').pipe(
  catchError(error => {
    console.error('Error:', error);
    return of([]); // Retorna valor por defecto
  })
).subscribe(users => {
  this.users = users;
});
```

**Reintentar con valor alternativo:**
```typescript
this.http.get('/api/users').pipe(
  catchError(error => {
    if (error.status === 404) {
      return this.http.get('/api/users/backup');
    }
    return of([]);
  })
);
```

### 5.2 `retry` - Reintentar

Reintenta la operación N veces antes de fallar.

```typescript
import { retry } from 'rxjs/operators';

this.http.get('/api/data').pipe(
  retry(3) // Reintenta 3 veces
).subscribe(data => {
  this.data = data;
});
```

### 5.3 `retryWhen` - Reintento Condicional

Control personalizado de reintentos.

```typescript
import { retryWhen, delay, take } from 'rxjs/operators';

this.http.get('/api/data').pipe(
  retryWhen(errors => 
    errors.pipe(
      delay(1000), // Espera 1 segundo
      take(3)      // Máximo 3 reintentos
    )
  )
);
```

---

## 6. Operadores de Utilidad

### 6.1 `tap` - Efectos Secundarios

Ejecuta código sin modificar el stream. Útil para debugging.

```typescript
import { tap } from 'rxjs/operators';

this.http.get('/api/users').pipe(
  tap(users => console.log('Users loaded:', users.length)),
  tap({
    next: users => console.log('Next:', users),
    error: err => console.error('Error:', err),
    complete: () => console.log('Complete')
  })
);
```

### 6.2 `delay` - Retrasar Emisiones

Retrasa todas las emisiones.

```typescript
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

of('Hola').pipe(
  delay(2000) // Retrasa 2 segundos
).subscribe(console.log);
```

### 6.3 `timeout` - Límite de Tiempo

Lanza error si no hay emisión en el tiempo especificado.

```typescript
import { timeout } from 'rxjs/operators';

this.http.get('/api/data').pipe(
  timeout(5000) // Error si no responde en 5 segundos
);
```

### 6.4 `finalize` - Cleanup

Ejecuta código cuando el Observable completa o tiene error.

```typescript
import { finalize } from 'rxjs/operators';

this.loadingService.show();

this.http.get('/api/data').pipe(
  finalize(() => this.loadingService.hide())
).subscribe(data => {
  this.data = data;
});
```

---

## 7. Patrones Comunes en Angular

### 7.1 Búsqueda Reactiva Completa

```typescript
searchUsers(term: string): Observable<User[]> {
  return fromEvent<InputEvent>(this.searchInput.nativeElement, 'input').pipe(
    map(e => (e.target as HTMLInputElement).value),
    filter(term => term.length >= 2),      // Mínimo 2 caracteres
    debounceTime(300),                      // Esperar 300ms
    distinctUntilChanged(),                 // Evitar duplicados
    switchMap(term =>                       // Cambiar a búsqueda
      this.http.get<User[]>(`/api/users?q=${term}`).pipe(
        catchError(error => {
          this.logger.error('Search failed', error);
          return of([]);                    // Valor por defecto
        })
      )
    )
  );
}
```

### 7.2 Cargar Datos con Loading

```typescript
loadData(): void {
  this.loading.set(true);
  
  this.http.get<Data[]>('/api/data').pipe(
    timeout(10000),
    retry(2),
    catchError(error => {
      this.notificationService.showError('Error al cargar datos');
      return of([]);
    }),
    finalize(() => this.loading.set(false))
  ).subscribe(data => {
    this.data.set(data);
  });
}
```

### 7.3 Formulario con Validación Reactiva

```typescript
// Guardar solo cuando el formulario es válido
this.form.valueChanges.pipe(
  debounceTime(300),
  filter(() => this.form.valid),
  distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
  switchMap(value => this.http.post('/api/save', value))
).subscribe(response => {
  this.notificationService.showSuccess('Guardado');
});
```

### 7.4 Cancelar al Destruir Componente

```typescript
@Component({...})
export class MyComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    // Múltiples suscripciones con un solo cleanup
    this.http.get('/api/data').pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => this.data.set(data));

    this.http.get('/api/users').pipe(
      takeUntil(this.destroy$)
    ).subscribe(users => this.users.set(users));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### 7.5 Polling con Interval

```typescript
// Actualizar datos cada 30 segundos
interval(30000).pipe(
  switchMap(() => this.http.get('/api/notifications')),
  takeUntil(this.destroy$)
).subscribe(notifications => {
  this.notifications.set(notifications);
});
```

---

## Resumen del Día

### Operadores Cubiertos

| Categoría | Operadores |
|-----------|------------|
| Creación | `of`, `from`, `fromEvent`, `interval`, `timer` |
| Transformación | `map`, `switchMap`, `mergeMap`, `concatMap`, `exhaustMap` |
| Filtrado | `filter`, `take`, `takeUntil`, `first`, `last`, `distinctUntilChanged`, `debounceTime` |
| Combinación | `combineLatest`, `forkJoin`, `merge`, `zip`, `withLatestFrom` |
| Errores | `catchError`, `retry`, `retryWhen` |
| Utilidad | `tap`, `delay`, `timeout`, `finalize` |

### Puntos Clave

1. **switchMap** cancela operaciones anteriores - ideal para búsquedas
2. **mergeMap** ejecuta en paralelo - para operaciones independientes
3. **concatMap** ejecuta secuencialmente - para operaciones ordenadas
4. **takeUntil** es esencial para evitar memory leaks
5. **catchError** debe retornar un Observable (usar `of()` para valores por defecto)

---

*Contenido del Día 11 - Curso Angular 21 - UyuniAdmin Frontend*
