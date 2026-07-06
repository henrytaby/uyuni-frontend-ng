# Día 10: Cheatsheet - RxJS Fundamentos

## Referencia Rápida

---

## Observable Básico

```typescript
import { Observable } from 'rxjs';

const observable = new Observable<string>(subscriber => {
  subscriber.next('Hola');
  subscriber.next('Mundo');
  subscriber.complete();
  
  // Cleanup (opcional)
  return () => console.log('Cleanup');
});
```

---

## Observer

```typescript
const observer = {
  next: (value: T) => console.log('Valor:', value),
  error: (err: Error) => console.error('Error:', err),
  complete: () => console.log('Completado')
};

observable.subscribe(observer);
```

---

## Observable vs Promise

| Promise | Observable |
|---------|------------|
| Un solo valor | Múltiples valores |
| No cancelable | Cancelable |
| Ejecución inmediata | Lazy (al suscribir) |
| `.then()` | `.pipe()` + operadores |

---

## Crear Observables

```typescript
import { of, from, fromEvent, interval, timer } from 'rxjs';

// Desde valores
of(1, 2, 3);

// Desde Promise/Array
from([1, 2, 3]);
from(fetch('/api/data'));

// Desde evento DOM
fromEvent(document, 'click');
fromEvent(input, 'input');

// Intervalo
interval(1000); // Emite 0, 1, 2... cada segundo

// Timer
timer(1000); // Emite después de 1 segundo
timer(1000, 500); // Después de 1s, emite cada 500ms
```

---

## Subjects

```typescript
import { Subject, BehaviorSubject, ReplaySubject } from 'rxjs';

// Subject - Sin valor inicial
const subject = new Subject<string>();
subject.next('valor');

// BehaviorSubject - Con valor inicial
const behavior = new BehaviorSubject<string>('inicial');
console.log(behavior.value); // 'inicial'
behavior.next('nuevo');

// ReplaySubject - Replay de N valores
const replay = new ReplaySubject<string>(3); // Últimos 3
```

---

## Patrón Servicio con BehaviorSubject

```typescript
@Injectable({ providedIn: 'root' })
export class StateService {
  private stateSubject = new BehaviorSubject<State>(initialState);
  
  // Observable público (solo lectura)
  state$ = this.stateSubject.asObservable();
  
  // Getter para valor actual
  get currentState(): State {
    return this.stateSubject.value;
  }
  
  // Actualizar estado
  setState(newState: Partial<State>): void {
    this.stateSubject.next({ ...this.stateSubject.value, ...newState });
  }
}
```

---

## Operadores Básicos

### Importar

```typescript
import { map, filter, tap, take, takeUntil } from 'rxjs/operators';
```

### map - Transformar

```typescript
observable.pipe(
  map(x => x * 2)
);
// 1 → 2, 2 → 4, 3 → 6
```

### filter - Filtrar

```typescript
observable.pipe(
  filter(x => x > 2)
);
// 1, 2, 3, 4, 5 → 3, 4, 5
```

### tap - Debug

```typescript
observable.pipe(
  tap(x => console.log('Debug:', x))
);
// No modifica el stream
```

### take - Limitar

```typescript
observable.pipe(
  take(3)
);
// Solo toma los primeros 3 valores
```

### takeUntil - Cancelar

```typescript
private destroy$ = new Subject<void>();

observable.pipe(
  takeUntil(this.destroy$)
).subscribe();

ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}
```

---

## Operadores de Búsqueda

### debounceTime - Esperar

```typescript
import { debounceTime } from 'rxjs/operators';

fromEvent(input, 'input').pipe(
  debounceTime(300) // Espera 300ms
);
```

### distinctUntilChanged - No repetir

```typescript
import { distinctUntilChanged } from 'rxjs/operators';

observable.pipe(
  distinctUntilChanged() // No emite si es igual al anterior
);
```

### switchMap - Cambiar Observable

```typescript
import { switchMap } from 'rxjs/operators';

fromEvent(input, 'input').pipe(
  debounceTime(300),
  switchMap(term => this.http.get(`/api/search?q=${term}`))
);
// Cancela peticiones anteriores
```

---

## Manejo de Errores

### catchError

```typescript
import { catchError, of } from 'rxjs';

this.http.get('/api/data').pipe(
  catchError(error => {
    console.error('Error:', error);
    return of([]); // Valor por defecto
  })
);
```

### retry

```typescript
import { retry } from 'rxjs/operators';

this.http.get('/api/data').pipe(
  retry(3) // Reintenta 3 veces
);
```

---

## Búsqueda Reactiva Completa

```typescript
fromEvent<InputEvent>(searchInput, 'input').pipe(
  map(e => (e.target as HTMLInputElement).value),
  debounceTime(300),
  distinctUntilChanged(),
  filter(term => term.length >= 2),
  switchMap(term => this.searchService.search(term)),
  catchError(error => {
    console.error('Error:', error);
    return of([]);
  })
).subscribe(results => this.results = results);
```

---

## AsyncPipe (Mejor Práctica)

```typescript
// Componente
data$ = this.http.get('/api/data');

// Template
<div>{{ data$ | async }}</div>

// Con loading
@if (data$ | async; as data) {
  <div>{{ data.name }}</div>
} @else {
  <p>Cargando...</p>
}
```

---

## Errores Comunes

### 1. No cancelar suscripciones

```typescript
// ❌ Mal
ngOnInit(): void {
  this.http.get('/api/data').subscribe(data => this.data = data);
}

// ✅ Bien
ngOnInit(): void {
  this.http.get('/api/data').pipe(
    takeUntil(this.destroy$)
  ).subscribe(data => this.data = data);
}
```

### 2. Suscripciones anidadas

```typescript
// ❌ Mal
this.http.get('/user/1').subscribe(user => {
  this.http.get(`/orders/${user.id}`).subscribe(orders => {
    this.orders = orders;
  });
});

// ✅ Bien
this.http.get('/user/1').pipe(
  switchMap(user => this.http.get(`/orders/${user.id}`))
).subscribe(orders => this.orders = orders);
```

### 3. No manejar errores

```typescript
// ❌ Mal
this.http.get('/api/data').subscribe(data => this.data = data);

// ✅ Bien
this.http.get('/api/data').subscribe({
  next: data => this.data = data,
  error: err => this.showError(err)
});
```

---

## Comandos Útiles

```bash
# Instalar RxJS (ya incluido en Angular)
npm install rxjs

# Verificar versión
npm list rxjs

# Importar operadores
import { map, filter, tap } from 'rxjs/operators';
import { of, from, Subject } from 'rxjs';
```

---

## Diagrama de Marble

```
source:     ---1---2---3---4---5---|
  filter(x => x > 2)
            -------3---4---5-------|
  map(x => x * 10)
            -------30--40--50------|
```

---

## Checklist de Suscripción

- [ ] ¿Se cancela en ngOnDestroy?
- [ ] ¿Se usa takeUntil o AsyncPipe?
- [ ] ¿Se maneja el error?
- [ ] ¿Se evitan suscripciones anidadas?

---

*Cheatsheet del Día 10 - RxJS Fundamentos*
*Curso Angular 21 - UyuniAdmin Frontend*
