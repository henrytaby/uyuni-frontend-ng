# Día 12: Slides - Estado con Signals y RxJS

## Slide 1: Título

# Estado con Signals y RxJS
## Integración y Patrones Híbridos

**Día 12 - Módulo 4: RxJS y Estado Avanzado**

Curso Angular 21 - UyuniAdmin Frontend

---

## Slide 2: Agenda

### Hoy Aprenderemos

1. ✅ Integración Signals + RxJS
2. ✅ toSignal: Observable → Signal
3. ✅ toObservable: Signal → Observable
4. ✅ Estado en Servicios
5. ✅ Computed con Observables
6. ✅ Effects y Side Effects

---

## Slide 3: Hook - El Problema

### ¿Cómo combinas estado local con datos asíncronos?

```typescript
// ❌ Dos sistemas separados
export class UserService {
  // Signal para estado local
  selectedUserId = signal<number | null>(null);
  
  // Observable para HTTP
  users$ = this.http.get<User[]>('/api/users');
  
  // ¿Cómo combinarlos?
}
```

---

## Slide 4: Hook - La Solución

### Integración con RxJS Interop

```typescript
// ✅ Un sistema unificado
export class UserService {
  // Signal para estado local
  selectedUserId = signal<number | null>(null);
  
  // Observable → Signal
  users = toSignal(this.http.get<User[]>('/api/users'));
  
  // Computed que combina ambos
  selectedUser = computed(() => 
    this.users().find(u => u.id === this.selectedUserId())
  );
}
```

---

## Slide 5: ¿Por qué Integrar?

### Lo mejor de ambos mundos

| Signals | RxJS |
|---------|------|
| Estado síncrono | Operaciones asíncronas |
| UI reactiva simple | HTTP, WebSockets |
| Computed values | Operadores poderosos |
| Fácil de usar | Debounce, throttle |

**La integración combina las fortalezas de ambos**

---

## Slide 6: toSignal - Observable a Signal

### Sintaxis Básica

```typescript
import { toSignal } from '@angular/core/rxjs-interop';

// Convierte Observable a Signal
users = toSignal(this.http.get<User[]>('/api/users'));

// Con valor inicial
users = toSignal(
  this.http.get<User[]>('/api/users'),
  { initialValue: [] }
);
```

---

## Slide 7: toSignal - Valor Inicial

### Sin valor inicial vs Con valor inicial

```typescript
// ❌ Sin valor inicial (undefined hasta que emita)
users = toSignal(this.http.get<User[]>('/api/users'));
// Tipo: Signal<User[] | undefined>

// ✅ Con valor inicial
users = toSignal(
  this.http.get<User[]>('/api/users'),
  { initialValue: [] }
);
// Tipo: Signal<User[]>
```

---

## Slide 8: toSignal - Manejo de Errores

### Los errores se propagan

```typescript
// ✅ Manejar errores antes de convertir
users = toSignal(
  this.http.get<User[]>('/api/users').pipe(
    catchError(error => {
      console.error('Error:', error);
      return of([]); // Valor por defecto
    })
  ),
  { initialValue: [] }
);
```

---

## Slide 9: toSignal - Cleanup Automático

### No necesitas takeUntil

```typescript
@Component({...})
export class UserListComponent {
  // ✅ toSignal maneja la suscripción automáticamente
  users = toSignal(this.http.get<User[]>('/api/users'));
  
  // No necesitas ngOnDestroy para cleanup
}
```

---

## Slide 10: toObservable - Signal a Observable

### Sintaxis Básica

```typescript
import { toObservable } from '@angular/core/rxjs-interop';

// Signal para input
searchTerm = signal('');

// Convertir a Observable
searchTerm$ = toObservable(this.searchTerm);
```

---

## Slide 11: toObservable - Con Operadores

### Usar operadores RxJS

```typescript
searchTerm = signal('');

// Observable con operadores
searchResults$ = toObservable(this.searchTerm).pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(term => this.http.get(`/api/search?q=${term}`))
);

// Convertir resultado a Signal
searchResults = toSignal(this.searchResults$, { initialValue: [] });
```

---

## Slide 12: Flujo Completo

### Búsqueda Reactiva

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Signal    │ ──► │ toObservable │ ──► │  Operadores │
│ searchTerm  │     │              │     │  RxJS       │
└─────────────┘     └──────────────┘     └─────────────┘
                                               │
                                               ▼
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Signal    │ ◄── │  toSignal    │ ◄── │  Observable │
│ results     │     │              │     │  HTTP       │
└─────────────┘     └──────────────┘     └─────────────┘
```

---

## Slide 13: Estado en Servicios

### Patrón de Servicio con Signals

```typescript
@Injectable({ providedIn: 'root' })
export class UserService {
  // Estado síncrono
  selectedUserId = signal<number | null>(null);
  isLoading = signal(false);
  
  // Datos desde HTTP
  users = toSignal(this.http.get<User[]>('/api/users'));
  
  // Computed
  selectedUser = computed(() => 
    this.users().find(u => u.id === this.selectedUserId())
  );
}
```

---

## Slide 14: Computed con Observables

### Combinar múltiples fuentes

```typescript
// Filtros locales
selectedDepartmentId = signal<number | null>(null);

// Datos desde HTTP
users = toSignal(this.http.get<User[]>('/api/users'));
departments = toSignal(this.http.get<Department[]>('/api/departments'));

// Computed que combina todo
filteredUsers = computed(() => {
  const deptId = this.selectedDepartmentId();
  const users = this.users();
  
  if (!deptId) return users;
  return users.filter(u => u.departmentId === deptId);
});
```

---

## Slide 15: Effects Básicos

### Side Effects con Signals

```typescript
constructor() {
  // Effect que reacciona a cambios
  effect(() => {
    const id = this.userId();
    if (id) {
      this.loadUser(id);
    }
  });
}
```

---

## Slide 16: Effect con Cleanup

### Cleanup automático

```typescript
constructor() {
  effect((onCleanup) => {
    const intervalId = setInterval(() => {
      this.count.update(c => c + 1);
    }, 1000);
    
    // Cleanup cuando el effect se re-ejecuta
    onCleanup(() => clearInterval(intervalId));
  });
}
```

---

## Slide 17: Effects vs Computed

### ¿Cuándo usar cada uno?

| Computed | Effect |
|----------|--------|
| Valores derivados | Side effects |
| Sin side effects | Logging, HTTP |
| Reactivo | Imperativo |
| Automático | Manual |

**Regla: Usa computed para valores, effect para acciones**

---

## Slide 18: Patrón Store con Signals

### Store Base

```typescript
export abstract class SignalStore<T> {
  private _state = signal({
    items: [],
    loading: false,
    error: null
  });
  
  readonly items = computed(() => this._state().items);
  readonly loading = computed(() => this._state().loading);
  readonly error = computed(() => this._state().error);
  
  protected setItems(items: T[]): void {
    this._state.update(s => ({ ...s, items }));
  }
}
```

---

## Slide 19: Store Extendido

### Products Store

```typescript
@Injectable({ providedIn: 'root' })
export class ProductsStore extends SignalStore<Product> {
  private readonly http = inject(HttpClient);
  
  loadProducts(): void {
    this.setLoading(true);
    
    this.http.get<Product[]>('/api/products').subscribe({
      next: (products) => this.setItems(products),
      error: (err) => this.setError('Error al cargar')
    });
  }
}
```

---

## Slide 20: Uso en Componente

### Componente con Store

```typescript
@Component({...})
export class ProductsComponent {
  private readonly store = inject(ProductsStore);
  
  // Acceso directo a Signals
  products = this.store.items;
  loading = this.store.loading;
  error = this.store.error;
  
  ngOnInit(): void {
    this.store.loadProducts();
  }
}
```

---

## Slide 21: Errores Comunes

### ❌ Effect para computar valores

```typescript
// ❌ MAL
effect(() => {
  this.fullName.set(`${this.firstName()} ${this.lastName()}`);
});

// ✅ BIEN
fullName = computed(() => `${this.firstName()} ${this.lastName()}`);
```

---

## Slide 22: Errores Comunes

### ❌ Sin valor inicial

```typescript
// ❌ MAL
users = toSignal(this.http.get<User[]>('/api/users'));
// Tipo: Signal<User[] | undefined>

// ✅ BIEN
users = toSignal(
  this.http.get<User[]>('/api/users'),
  { initialValue: [] }
);
// Tipo: Signal<User[]>
```

---

## Slide 23: Errores Comunes

### ❌ Effect infinito

```typescript
// ❌ MAL: Loop infinito
effect(() => {
  console.log(this.count());
  this.count.update(c => c + 1); // Dispara el effect de nuevo
});

// ✅ BIEN: No modificar la Signal observada
effect(() => {
  console.log(this.count());
  // No modificar count aquí
});
```

---

## Slide 24: Cuándo Usar Cada Uno

### Tabla de Decisión

| Situación | Usar |
|-----------|------|
| Estado local de componente | Signals |
| Datos desde HTTP | toSignal |
| Operaciones con debounce | toObservable + RxJS |
| Estado global | Signals en servicio |
| Eventos complejos | RxJS |
| WebSockets | RxJS → toSignal |

---

## Slide 25: Mini Reto

### Implementa un servicio de búsqueda

1. ✅ Signal para término de búsqueda
2. ✅ toObservable con debounce
3. ✅ switchMap para HTTP
4. ✅ toSignal para resultado
5. ✅ Computed para resultados filtrados

**Tiempo: 15 minutos**

---

## Slide 26: Solución del Mini Reto

```typescript
@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly http = inject(HttpClient);
  
  searchTerm = signal('');
  
  private search$ = toObservable(this.searchTerm).pipe(
    debounceTime(300),
    filter(term => term.length >= 2),
    switchMap(term => 
      this.http.get<Product[]>(`/api/products?q=${term}`).pipe(
        catchError(() => of([]))
      )
    )
  );
  
  results = toSignal(this.search$, { initialValue: [] });
}
```

---

## Slide 27: Resumen del Día

### API Cubierta

| Función | Uso |
|---------|-----|
| `toSignal` | Observable → Signal |
| `toObservable` | Signal → Observable |
| `signal` | Estado reactivo |
| `computed` | Valores derivados |
| `effect` | Side effects |

---

## Slide 28: Puntos Clave

### Recuerda

1. **toSignal** convierte Observables a Signals
2. **toObservable** permite usar operadores RxJS
3. **computed** es más eficiente que effect
4. **Siempre maneja errores** antes de convertir
5. **Usa asReadonly()** para exponer Signals

---

## Slide 29: Próximo Día

### Día 13: UI con PrimeNG

- Componentes de PrimeNG v21
- Integración con Signals
- Temas y personalización
- Formularios y tablas

---

## Slide 30: Recursos

### Lectura Recomendada

- 📖 [Angular Signals](https://angular.dev/guide/signals)
- 📖 [RxJS Interop](https://angular.dev/guide/signals/rxjs-interop)
- 📖 [toSignal API](https://angular.dev/api/core/rxjs-interop/toSignal)
- 📖 [toObservable API](https://angular.dev/api/core/rxjs-interop/toObservable)

---

## Slide 31: Cierre

### ¡Preguntas?

**Ejercicios:**
- [Lab 01: toSignal y toObservable](../ejercicios/lab-01.md)
- [Lab 02: Estado Híbrido](../ejercicios/lab-02.md)

**Assessment:** [Preguntas de Evaluación](../assessment/preguntas.md)

---

*Slides del Día 12 - Curso Angular 21 - UyuniAdmin Frontend*
