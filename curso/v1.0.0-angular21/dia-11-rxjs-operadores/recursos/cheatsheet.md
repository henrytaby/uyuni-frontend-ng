# Día 11: Cheatsheet - RxJS Operadores

## Operadores de Creación

### `of` - Valores Estáticos
```typescript
import { of } from 'rxjs';

of(1, 2, 3).subscribe(console.log);        // 1, 2, 3
of('Hola').subscribe(console.log);          // Hola
of({ id: 1 }).subscribe(console.log);       // { id: 1 }
```

### `from` - Arrays/Promises
```typescript
import { from } from 'rxjs';

from([1, 2, 3]).subscribe(console.log);     // 1, 2, 3 (cada uno)
from(fetch('/api/data')).subscribe(console.log);
from('Hola').subscribe(console.log);        // H, o, l, a
```

### `fromEvent` - Eventos DOM
```typescript
import { fromEvent } from 'rxjs';

fromEvent(button, 'click').subscribe(console.log);
fromEvent<InputEvent>(input, 'input').subscribe(e => {
  console.log((e.target as HTMLInputElement).value);
});
```

### `interval` - Emisión Periódica
```typescript
import { interval } from 'rxjs';

interval(1000).subscribe(n => console.log(n)); // 0, 1, 2, 3...
interval(1000).pipe(take(3)).subscribe();      // 0, 1, 2, Complete
```

### `timer` - Emisión Diferida
```typescript
import { timer } from 'rxjs';

timer(2000).subscribe(() => console.log('Listo')); // Después de 2s
timer(1000, 500).subscribe(n => console.log(n));   // 0 (después de 1s), 1, 2...
```

---

## Operadores de Transformación

### `map` - Transformar Valores
```typescript
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

of(1, 2, 3).pipe(
  map(x => x * 10)
).subscribe(console.log); // 10, 20, 30
```

### `switchMap` - Cambiar Observable (Cancela Anterior)
```typescript
import { fromEvent } from 'rxjs';
import { switchMap } from 'rxjs/operators';

fromEvent(searchInput, 'input').pipe(
  switchMap(term => http.get(`/api/search?q=${term}`))
).subscribe(results => ...);
```

**Cuándo usar:** Búsquedas, navegación, operaciones que pueden quedar obsoletas

### `mergeMap` - Paralelo (Todos)
```typescript
import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

of(1, 2, 3).pipe(
  mergeMap(id => http.get(`/api/users/${id}`))
).subscribe(user => ...);
```

**Cuándo usar:** Operaciones paralelas independientes

### `concatMap` - Secuencial (Uno a Uno)
```typescript
import { of } from 'rxjs';
import { concatMap } from 'rxjs/operators';

of(user1, user2, user3).pipe(
  concatMap(user => http.post('/api/users', user))
).subscribe(response => ...);
```

**Cuándo usar:** Operaciones ordenadas, dependientes

### `exhaustMap` - Ignorar Nuevos
```typescript
import { fromEvent } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';

fromEvent(submitBtn, 'click').pipe(
  exhaustMap(() => http.post('/api/save', data))
).subscribe(response => ...);
```

**Cuándo usar:** Prevenir spam de clicks, formularios

---

## Operadores de Filtrado

### `filter` - Filtrar Valores
```typescript
import { of } from 'rxjs';
import { filter } from 'rxjs/operators';

of(1, 2, 3, 4, 5).pipe(
  filter(x => x % 2 === 0)
).subscribe(console.log); // 2, 4
```

### `take` - Tomar N Valores
```typescript
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';

interval(1000).pipe(
  take(3)
).subscribe(console.log); // 0, 1, 2, Complete
```

### `takeUntil` - Hasta que Otro Emita
```typescript
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({...})
export class MyComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    http.get('/api/data').pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => this.data = data);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### `first` / `last` - Primero/Último
```typescript
import { of } from 'rxjs';
import { first, last } from 'rxjs/operators';

of(1, 2, 3).pipe(first()).subscribe(); // 1
of(1, 2, 3).pipe(last()).subscribe();  // 3
of(1, 2, 3).pipe(first(x => x > 1)).subscribe(); // 2
```

### `distinctUntilChanged` - Evitar Duplicados
```typescript
import { of } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

of(1, 1, 2, 2, 3).pipe(
  distinctUntilChanged()
).subscribe(console.log); // 1, 2, 3
```

### `debounceTime` - Esperar Inactividad
```typescript
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

fromEvent(input, 'input').pipe(
  debounceTime(300)
).subscribe(term => console.log('Buscar:', term));
```

### `throttleTime` - Limitar Frecuencia
```typescript
import { fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

fromEvent(window, 'scroll').pipe(
  throttleTime(200)
).subscribe(() => console.log('Scroll'));
```

---

## Operadores de Combinación

### `forkJoin` - Esperar Todos
```typescript
import { forkJoin } from 'rxjs';

forkJoin({
  users: http.get<User[]>('/api/users'),
  orders: http.get<Order[]>('/api/orders')
}).subscribe(({ users, orders }) => {
  console.log(users.length, orders.length);
});
```

**Emite una vez cuando todos completan**

### `combineLatest` - Combinar Últimos
```typescript
import { combineLatest } from 'rxjs';

combineLatest([
  user$,
  orders$
]).subscribe(([user, orders]) => {
  console.log(user.name, orders.length);
});
```

**Emite cada vez que cualquiera cambia**

### `merge` - Intercalar
```typescript
import { merge, interval } from 'rxjs';

merge(
  interval(1000),
  interval(500)
).subscribe(console.log); // 0, 0, 1, 1, 2, 2...
```

### `zip` - Por Índice
```typescript
import { zip, of } from 'rxjs';

zip(
  of('A', 'B', 'C'),
  of(1, 2, 3)
).subscribe(([letter, number]) => {
  console.log(letter, number); // A 1, B 2, C 3
});
```

---

## Operadores de Error

### `catchError` - Manejar Errores
```typescript
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

http.get('/api/data').pipe(
  catchError(error => {
    console.error(error);
    return of([]); // DEBE retornar Observable
  })
).subscribe(data => ...);
```

### `retry` - Reintentar
```typescript
import { retry } from 'rxjs/operators';

http.get('/api/data').pipe(
  retry(3) // Reintenta 3 veces
).subscribe(data => ...);
```

### `finalize` - Cleanup
```typescript
import { finalize } from 'rxjs/operators';

loading.show();

http.get('/api/data').pipe(
  finalize(() => loading.hide())
).subscribe(data => ...);
```

---

## Operadores de Utilidad

### `tap` - Efectos Secundarios
```typescript
import { tap } from 'rxjs/operators';

http.get('/api/data').pipe(
  tap(data => console.log('Data:', data)),
  tap({
    next: data => console.log('Next:', data),
    error: err => console.error('Error:', err),
    complete: () => console.log('Complete')
  })
).subscribe();
```

### `delay` - Retrasar
```typescript
import { delay } from 'rxjs/operators';

of('Hola').pipe(
  delay(2000)
).subscribe(console.log); // Después de 2s
```

### `timeout` - Límite de Tiempo
```typescript
import { timeout } from 'rxjs/operators';

http.get('/api/data').pipe(
  timeout(5000) // Error si no responde en 5s
).subscribe();
```

---

## Patrones Comunes

### Búsqueda Reactiva Completa
```typescript
fromEvent<InputEvent>(input, 'input').pipe(
  map(e => (e.target as HTMLInputElement).value),
  filter(term => term.length >= 2),
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(term => 
    http.get(`/api/search?q=${term}`).pipe(
      catchError(() => of([]))
    )
  )
).subscribe(results => this.results = results);
```

### Cargar Datos con Loading
```typescript
loading.set(true);

http.get<Data[]>('/api/data').pipe(
  timeout(10000),
  retry(2),
  catchError(error => {
    notification.error('Error al cargar');
    return of([]);
  }),
  finalize(() => loading.set(false))
).subscribe(data => this.data.set(data));
```

### Cleanup con takeUntil
```typescript
private destroy$ = new Subject<void>();

ngOnInit(): void {
  http.get('/api/data').pipe(
    takeUntil(this.destroy$)
  ).subscribe();
  
  interval(30000).pipe(
    takeUntil(this.destroy$)
  ).subscribe();
}

ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}
```

---

## Tabla de Decisión

### ¿Qué Operador de Transformación Usar?

| Necesito... | Operador |
|-------------|----------|
| Cancelar operaciones anteriores | `switchMap` |
| Ejecutar en paralelo | `mergeMap` |
| Ejecutar secuencialmente | `concatMap` |
| Ignorar nuevas mientras hay una activa | `exhaustMap` |

### ¿Qué Operador de Combinación Usar?

| Necesito... | Operador |
|-------------|----------|
| Esperar a que todos completen | `forkJoin` |
| Combinar valores más recientes | `combineLatest` |
| Intercalar valores de múltiples fuentes | `merge` |
| Combinar por índice | `zip` |

---

## Errores Comunes

### ❌ Suscripciones Anidadas
```typescript
// MAL
http.get('/user/1').subscribe(user => {
  http.get(`/orders/${user.id}`).subscribe(orders => {
    // Anti-pattern
  });
});

// BIEN
http.get('/user/1').pipe(
  switchMap(user => http.get(`/orders/${user.id}`))
).subscribe(orders => ...);
```

### ❌ No Cancelar Suscripciones
```typescript
// MAL
ngOnInit(): void {
  http.get('/api/data').subscribe(data => this.data = data);
}

// BIEN
ngOnInit(): void {
  http.get('/api/data').pipe(
    takeUntil(this.destroy$)
  ).subscribe(data => this.data = data);
}
```

### ❌ catchError sin Retornar Observable
```typescript
// MAL
http.get('/api/data').pipe(
  catchError(error => {
    console.error(error);
    // No retorna nada
  })
);

// BIEN
http.get('/api/data').pipe(
  catchError(error => {
    console.error(error);
    return of([]); // Retorna Observable
  })
);
```

---

## Snippets Útiles

### Búsqueda con Debounce
```typescript
fromEvent<InputEvent>(input, 'input').pipe(
  map(e => (e.target as HTMLInputElement).value),
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(term => http.get(`/api/search?q=${term}`))
);
```

### Carga Paralela
```typescript
forkJoin({
  data1: http.get('/api/data1'),
  data2: http.get('/api/data2'),
  data3: http.get('/api/data3')
}).subscribe(({ data1, data2, data3 }) => ...);
```

### Polling
```typescript
interval(30000).pipe(
  switchMap(() => http.get('/api/notifications')),
  takeUntil(destroy$)
).subscribe(notifications => ...);
```

---

*Cheatsheet - Día 11 - Curso Angular 21 - UyuniAdmin Frontend*
