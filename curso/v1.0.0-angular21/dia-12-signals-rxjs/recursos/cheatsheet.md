# Día 12: Cheatsheet - Estado con Signals y RxJS

## toSignal - Observable → Signal

### Sintaxis Básica

```typescript
import { toSignal } from '@angular/core/rxjs-interop';

// Sin valor inicial (undefined hasta que emita)
data = toSignal(this.http.get<Data[]>('/api/data'));

// Con valor inicial
users = toSignal(
  this.http.get<User[]>('/api/users'),
  { initialValue: [] }
);

// Con manejo de errores
users = toSignal(
  this.http.get<User[]>('/api/users').pipe(
    catchError(() => of([]))
  ),
  { initialValue: [] }
);
```

### Opciones

```typescript
interface ToSignalOptions {
  initialValue?: T;           // Valor antes de que el Observable emita
  requireSync?: boolean;      // Error si no emite inmediatamente
  manualCleanup?: boolean;    // Cleanup manual (default: false)
  equal?: (a: T, b: T) => boolean;  // Función de igualdad
}
```

### Patrones Comunes

```typescript
// HTTP con loading
data = toSignal(
  this.http.get<Data>('/api/data').pipe(
    startWith(null),  // Valor inicial
    catchError(() => of(null))
  ),
  { initialValue: null }
);

// Con selector
selectedUser = toSignal(
  this.route.paramMap.pipe(
    map(params => params.get('id')),
    switchMap(id => this.http.get<User>(`/api/users/${id}`))
  )
);
```

---

## toObservable - Signal → Observable

### Sintaxis Básica

```typescript
import { toObservable } from '@angular/core/rxjs-interop';

// Signal → Observable
searchTerm = signal('');
searchTerm$ = toObservable(this.searchTerm);

// Con operadores
searchResults$ = toObservable(this.searchTerm).pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(term => this.http.get(`/api/search?q=${term}`))
);
```

### Características

- El Observable **nunca completa**
- Emite cada vez que la Signal cambia
- Se desuscribe automáticamente cuando el contexto se destruye

---

## Flujo Híbrido Completo

### Patrón de Búsqueda

```typescript
@Injectable({ providedIn: 'root' })
export class SearchService {
  private http = inject(HttpClient);
  
  // 1. Signal para input
  searchTerm = signal('');
  
  // 2. Pipeline RxJS
  private results$ = toObservable(this.searchTerm).pipe(
    debounceTime(300),
    filter(term => term.length >= 2),
    distinctUntilChanged(),
    switchMap(term => 
      this.http.get<Result[]>(`/api/search?q=${term}`).pipe(
        catchError(() => of([]))
      )
    )
  );
  
  // 3. Signal para resultado
  results = toSignal(this.results$, { initialValue: [] });
  
  // 4. Computed para derivados
  resultCount = computed(() => this.results().length);
  hasResults = computed(() => this.results().length > 0);
}
```

---

## Computed Signals

### Sintaxis

```typescript
import { computed, signal } from '@angular/core';

// Computed básico
firstName = signal('John');
lastName = signal('Doe');
fullName = computed(() => `${this.firstName()} ${this.lastName()}`);

// Computed con lógica
items = signal<Item[]>([]);
filteredItems = computed(() => {
  const items = this.items();
  const category = this.categoryFilter();
  
  return category 
    ? items.filter(i => i.category === category)
    : items;
});

// Computed con múltiples dependencias
stats = computed(() => ({
  total: this.items().length,
  active: this.items().filter(i => i.active).length,
  totalValue: this.items().reduce((sum, i) => sum + i.value, 0)
}));
```

---

## Effects

### Sintaxis Básica

```typescript
import { effect } from '@angular/core';

// Effect básico
effect(() => {
  console.log('User changed:', this.user());
});

// Con cleanup
effect((onCleanup) => {
  const subscription = this.data$.subscribe();
  onCleanup(() => subscription.unsubscribe());
});
```

### Patrones Comunes

```typescript
// Persistir en localStorage
effect(() => {
  localStorage.setItem('user', JSON.stringify(this.user()));
});

// Sincronizar con backend
effect(() => {
  if (this.isAuthenticated()) {
    this.syncService.sync(this.data());
  }
});

// Analytics
effect(() => {
  this.analytics.track('page_view', { url: this.currentUrl() });
});
```

### Reglas Importantes

```typescript
// ❌ NO actualizar Signal observada (loop infinito)
effect(() => {
  this.count.update(c => c + 1); // ERROR si count está en el effect
});

// ✅ Usar computed para valores derivados
doubleCount = computed(() => this.count() * 2);

// ✅ Effect para side effects
effect(() => {
  console.log('Count:', this.count());
});
```

---

## Store con Signals

### Patrón Base

```typescript
interface StoreState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
}

export abstract class SignalStore<T> {
  private _state = signal<StoreState<T>>({
    data: [],
    loading: false,
    error: null
  });
  
  // Signals públicas de solo lectura
  readonly data = computed(() => this._state().data);
  readonly loading = computed(() => this._state().loading);
  readonly error = computed(() => this._state().error);
  
  // Métodos protegidos
  protected setLoading(loading: boolean): void {
    this._state.update(s => ({ ...s, loading }));
  }
  
  protected setData(data: T[]): void {
    this._state.set({ data, loading: false, error: null });
  }
  
  protected setError(error: string): void {
    this._state.update(s => ({ ...s, error, loading: false }));
  }
}
```

### Store Concreto

```typescript
@Injectable({ providedIn: 'root' })
export class ProductsStore extends SignalStore<Product> {
  private http = inject(HttpClient);
  
  // Filtros
  categoryFilter = signal<string | null>(null);
  
  // Productos filtrados
  filteredProducts = computed(() => {
    const products = this.data();
    const category = this.categoryFilter();
    
    return category 
      ? products.filter(p => p.category === category)
      : products;
  });
  
  // Cargar productos
  loadProducts(): void {
    this.setLoading(true);
    this.http.get<Product[]>('/api/products').subscribe({
      next: (data) => this.setData(data),
      error: (err) => this.setError('Error al cargar')
    });
  }
}
```

---

## Comparación: Signals vs RxJS

| Característica | Signals | RxJS |
|----------------|---------|------|
| **Uso principal** | Estado síncrono | Flujos asíncronos |
| **Suscripción** | Automática | Manual |
| **Operadores** | No tiene | Muchos operadores |
| **Async** | No | Sí (HTTP, eventos) |
| **Cleanup** | Automático | Manual |
| **Debounce** | No nativo | `debounceTime` |
| **Cancelación** | No | `takeUntil`, `switchMap` |

### Cuándo usar cada uno

```typescript
// ✅ Signals para:
// - Estado local de componentes
// - Estado global simple
// - Valores derivados (computed)
// - UI reactiva

// ✅ RxJS para:
// - HTTP requests
// - Eventos de usuario (input, scroll)
// - WebSockets
// - Flujos complejos con debounce, retry

// ✅ Combinados:
// - HTTP → toSignal → Signal
// - Signal → toObservable → RxJS → toSignal
```

---

## Snippets Útiles

### Servicio con Estado

```typescript
@Injectable({ providedIn: 'root' })
export class MyService {
  private _data = signal<Data | null>(null);
  private _loading = signal(false);
  private _error = signal<string | null>(null);
  
  readonly data = this._data.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  
  readonly hasData = computed(() => this._data() !== null);
  
  constructor(private http: HttpClient) {}
  
  loadData(): void {
    this._loading.set(true);
    this._error.set(null);
    
    this.http.get<Data>('/api/data').subscribe({
      next: (data) => {
        this._data.set(data);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set('Error al cargar');
        this._loading.set(false);
      }
    });
  }
}
```

### Componente con Búsqueda

```typescript
@Component({
  standalone: true,
  template: `
    <input (input)="search.set($any($event.target).value)" />
    @if (loading()) {
      <p>Cargando...</p>
    }
    @for (result of results(); track result.id) {
      <p>{{ result.name }}</p>
    }
  `
})
export class SearchComponent {
  search = signal('');
  
  private results$ = toObservable(this.search).pipe(
    debounceTime(300),
    filter(term => term.length >= 2),
    switchMap(term => this.http.get<Result[]>(`/api/search?q=${term}`)),
    catchError(() => of([]))
  );
  
  results = toSignal(this.results$, { initialValue: [] });
  
  constructor(private http: HttpClient) {}
}
```

---

## Errores Comunes

### 1. Usar toSignal fuera de contexto de inyección

```typescript
// ❌ Error
const data = toSignal(http.get('/api')); // Error: fuera de contexto

// ✅ Correcto
@Injectable()
export class MyService {
  data = toSignal(this.http.get('/api')); // OK: en contexto
}
```

### 2. No manejar errores en HTTP

```typescript
// ❌ Error si falla
data = toSignal(this.http.get('/api'));

// ✅ Con manejo de errores
data = toSignal(
  this.http.get('/api').pipe(
    catchError(() => of(null))
  ),
  { initialValue: null }
);
```

### 3. Actualizar Signal en effect que la observa

```typescript
// ❌ Loop infinito
effect(() => {
  this.count.update(c => c + 1); // count está en el effect
});

// ✅ Usar computed
doubleCount = computed(() => this.count() * 2);
```

---

## Debugging

### Inspeccionar Signals

```typescript
// En DevTools
// 1. Instalar Angular DevTools
// 2. Ir a "Components"
// 3. Seleccionar componente
// 4. Ver Signals en "Properties"

// En código
effect(() => {
  console.log('Signal value:', this.mySignal());
});
```

### Inspeccionar Observables

```typescript
// Con tap
searchResults$ = toObservable(this.search).pipe(
  tap(term => console.log('Search term:', term)),
  debounceTime(300),
  tap(debounced => console.log('Debounced:', debounced)),
  switchMap(term => this.http.get(`/api/search?q=${term}`))
);
```

---

*Cheatsheet - Día 12 - Curso Angular 21 - UyuniAdmin Frontend*
