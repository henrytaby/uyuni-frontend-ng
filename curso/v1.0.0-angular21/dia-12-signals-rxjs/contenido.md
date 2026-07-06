# Día 12: Contenido Detallado - Estado con Signals y RxJS

## Índice

1. [Introducción a la Integración](#1-introducción-a-la-integración)
2. [toSignal: Observable a Signal](#2-tosignal-observable-a-signal)
3. [toObservable: Signal a Observable](#3-toobservable-signal-a-observable)
4. [Estado en Servicios con Signals](#4-estado-en-servicios-con-signals)
5. [Computed Signals con Observables](#5-computed-signals-con-observables)
6. [Effects y Side Effects](#6-effects-y-side-effects)
7. [Patrones de Estado Híbrido](#7-patrones-de-estado-híbrido)
8. [Mejores Prácticas](#8-mejores-prácticas)

---

## 1. Introducción a la Integración

### 1.1 ¿Por qué integrar Signals y RxJS?

Angular 21 introduce Signals como el sistema de reactividad preferido, pero RxJS sigue siendo esencial para operaciones asíncronas.

**Signals son ideales para:**
- Estado local de componentes
- Estado síncrono
- UI reactiva simple
- Computed values

**RxJS es ideal para:**
- Operaciones HTTP
- Eventos complejos
- WebSockets
- Streams de datos

**La integración combina lo mejor de ambos:**
- Signals para estado local y UI
- RxJS para operaciones asíncronas
- Conversión fluida entre ambos

### 1.2 El Problema de los Dos Sistemas

Sin integración, tenías que elegir:

```typescript
// ❌ Opción 1: Solo RxJS (verbose)
export class UserComponent {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();
  
  // Necesitas async pipe o suscripciones manuales
}

// ❌ Opción 2: Solo Signals (limitado para async)
export class UserComponent {
  user = signal<User | null>(null);
  
  // ¿Cómo manejas HTTP? Tienes que suscribirte manualmente
  loadUser() {
    this.http.get<User>('/api/user').subscribe(user => {
      this.user.set(user); // Manual y propenso a errores
    });
  }
}
```

### 1.3 La Solución: RxJS Interop

Angular proporciona `@angular/core/rxjs-interop` para integrar ambos sistemas:

```typescript
import { toSignal, toObservable } from '@angular/core/rxjs-interop';

// Observable → Signal
users = toSignal(this.http.get<User[]>('/api/users'));

// Signal → Observable
searchTerm$ = toObservable(this.searchTerm);
```

---

## 2. toSignal: Observable a Signal

### 2.1 Sintaxis Básica

`toSignal` convierte un Observable en una Signal de solo lectura.

```typescript
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

interface User {
  id: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  
  // Convierte Observable a Signal
  users = toSignal(this.http.get<User[]>('/api/users'));
}
```

### 2.2 Valor Inicial

Por defecto, la Signal es `undefined` hasta que el Observable emite. Puedes proporcionar un valor inicial:

```typescript
// Sin valor inicial (undefined hasta que emita)
users = toSignal(this.http.get<User[]>('/api/users'));
// Tipo: Signal<User[] | undefined>

// Con valor inicial
users = toSignal(
  this.http.get<User[]>('/api/users'),
  { initialValue: [] }
);
// Tipo: Signal<User[]>
```

### 2.3 Manejo de Errores

Los errores en el Observable se propagan a la Signal. Maneja errores con operadores RxJS:

```typescript
users = toSignal(
  this.http.get<User[]>('/api/users').pipe(
    catchError(error => {
      console.error('Error loading users:', error);
      return of([]); // Valor por defecto en caso de error
    })
  ),
  { initialValue: [] }
);
```

### 2.4 Cleanup Automático

`toSignal` maneja automáticamente las suscripciones:

```typescript
@Component({...})
export class UserListComponent implements OnDestroy {
  // No necesitas takeUntil, toSignal maneja el cleanup
  users = toSignal(this.http.get<User[]>('/api/users'));
  
  ngOnDestroy(): void {
    // toSignal se desuscribe automáticamente
  }
}
```

### 2.5 Ejemplo Completo

```typescript
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';

interface User {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  template: `
    <div class="p-6">
      <h2 class="text-xl font-bold mb-4">Usuarios</h2>
      
      @if (users(); as users) {
        <ul>
          @for (user of users; track user.id) {
            <li class="p-2 border-b">{{ user.name }} - {{ user.email }}</li>
          }
        </ul>
      } @else {
        <p>Cargando usuarios...</p>
      }
    </div>
  `
})
export class UserListComponent {
  private readonly http = inject(HttpClient);
  
  // Observable → Signal con manejo de errores
  users = toSignal(
    this.http.get<User[]>('/api/users').pipe(
      catchError(() => of([]))
    ),
    { initialValue: [] }
  );
}
```

---

## 3. toObservable: Signal a Observable

### 3.1 Sintaxis Básica

`toObservable` convierte una Signal en un Observable.

```typescript
import { toObservable } from '@angular/core/rxjs-interop';
import { signal, Component } from '@angular/core';

@Component({...})
export class SearchComponent {
  // Signal para el término de búsqueda
  searchTerm = signal('');
  
  // Convertir a Observable
  searchTerm$ = toObservable(this.searchTerm);
}
```

### 3.2 Uso con Operadores RxJS

El Observable permite usar todos los operadores de RxJS:

```typescript
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({...})
export class SearchComponent {
  private readonly http = inject(HttpClient);
  
  searchTerm = signal('');
  
  // Signal → Observable con operadores
  searchResults$ = toObservable(this.searchTerm).pipe(
    debounceTime(300),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    switchMap(term => this.http.get<User[]>(`/api/users?q=${term}`))
  );
  
  // Convertir resultado a Signal
  searchResults = toSignal(this.searchResults$, { initialValue: [] });
}
```

### 3.3 Ejemplo: Búsqueda Reactiva

```typescript
import { Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, switchMap, catchError, of } from 'rxjs';

interface User {
  id: number;
  name: string;
}

@Component({
  selector: 'app-search',
  standalone: true,
  template: `
    <div class="p-6">
      <input 
        type="text"
        placeholder="Buscar usuarios..."
        class="w-full p-3 border rounded mb-4"
        (input)="searchTerm.set($any($event.target).value)"
      />
      
      @for (user of searchResults(); track user.id) {
        <div class="p-2 border-b">{{ user.name }}</div>
      } @empty {
        <p class="text-gray-500">No se encontraron resultados</p>
      }
    </div>
  `
})
export class SearchComponent {
  private readonly http = inject(HttpClient);
  
  // Estado local con Signal
  searchTerm = signal('');
  
  // Pipeline RxJS
  private searchResults$ = toObservable(this.searchTerm).pipe(
    debounceTime(300),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    switchMap(term => 
      this.http.get<User[]>(`/api/users?q=${term}`).pipe(
        catchError(() => of([]))
      )
    )
  );
  
  // Resultado como Signal
  searchResults = toSignal(this.searchResults$, { initialValue: [] });
}
```

---

## 4. Estado en Servicios con Signals

### 4.1 Patrón de Servicio con Signals

Los servicios pueden usar Signals para estado síncrono y RxJS para operaciones asíncronas:

```typescript
import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, tap } from 'rxjs';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  
  // Estado síncrono con Signals
  selectedUserId = signal<number | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);
  
  // Datos desde HTTP como Signal
  users = toSignal(
    this.http.get<User[]>('/api/users'),
    { initialValue: [] }
  );
  
  // Computed que combina Signals
  selectedUser = computed(() => {
    const id = this.selectedUserId();
    const users = this.users();
    return users.find(u => u.id === id) || null;
  });
  
  // Método que actualiza Signals
  loadUsers(): void {
    this.isLoading.set(true);
    this.error.set(null);
    
    this.http.get<User[]>('/api/users').subscribe({
      next: (users) => {
        // Si no usas toSignal, actualiza manualmente
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar usuarios');
        this.isLoading.set(false);
      }
    });
  }
  
  selectUser(id: number): void {
    this.selectedUserId.set(id);
  }
}
```

### 4.2 Servicio con Estado Completo

```typescript
import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { Observable, tap, catchError, of, BehaviorSubject } from 'rxjs';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly http = inject(HttpClient);
  
  // Estado del carrito con Signals
  items = signal<CartItem[]>([]);
  discountCode = signal<string | null>(null);
  
  // Productos disponibles (desde HTTP)
  products = toSignal(
    this.http.get<Product[]>('/api/products').pipe(
      catchError(() => of([]))
    ),
    { initialValue: [] }
  );
  
  // Computed signals
  subtotal = computed(() => 
    this.items().reduce((sum, item) => 
      sum + (item.product.price * item.quantity), 0
    )
  );
  
  discount = computed(() => {
    const code = this.discountCode();
    if (code === 'DESCUENTO10') {
      return this.subtotal() * 0.1;
    }
    return 0;
  });
  
  total = computed(() => 
    this.subtotal() - this.discount()
  );
  
  itemCount = computed(() => 
    this.items().reduce((sum, item) => sum + item.quantity, 0)
  );
  
  // Métodos
  addToCart(product: Product): void {
    const currentItems = this.items();
    const existingIndex = currentItems.findIndex(
      item => item.product.id === product.id
    );
    
    if (existingIndex >= 0) {
      const updated = [...currentItems];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + 1
      };
      this.items.set(updated);
    } else {
      this.items.update(items => [...items, { product, quantity: 1 }]);
    }
  }
  
  removeFromCart(productId: number): void {
    this.items.update(items => 
      items.filter(item => item.product.id !== productId)
    );
  }
  
  applyDiscount(code: string): void {
    this.discountCode.set(code);
  }
  
  clearCart(): void {
    this.items.set([]);
    this.discountCode.set(null);
  }
}
```

---

## 5. Computed Signals con Observables

### 5.1 Computed con toSignal

Combina múltiples fuentes de datos:

```typescript
import { Component, inject, signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';

interface User {
  id: number;
  name: string;
  departmentId: number;
}

interface Department {
  id: number;
  name: string;
}

@Component({...})
export class UserDepartmentComponent {
  private readonly http = inject(HttpClient);
  
  // Filtro local
  selectedDepartmentId = signal<number | null>(null);
  
  // Datos desde HTTP
  users = toSignal(this.http.get<User[]>('/api/users'), { initialValue: [] });
  departments = toSignal(this.http.get<Department[]>('/api/departments'), { initialValue: [] });
  
  // Computed que combina todo
  filteredUsers = computed(() => {
    const deptId = this.selectedDepartmentId();
    const users = this.users();
    
    if (!deptId) return users;
    
    return users.filter(u => u.departmentId === deptId);
  });
  
  // Computed con lookup
  usersWithDepartment = computed(() => {
    const users = this.filteredUsers();
    const departments = this.departments();
    
    return users.map(user => ({
      ...user,
      departmentName: departments.find(d => d.id === user.departmentId)?.name || 'Sin departamento'
    }));
  });
}
```

### 5.2 Computed Avanzado

```typescript
import { Component, inject, signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';

interface Order {
  id: number;
  userId: number;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

interface User {
  id: number;
  name: string;
}

@Component({...})
export class DashboardComponent {
  private readonly http = inject(HttpClient);
  
  // Filtros
  statusFilter = signal<string>('all');
  dateRange = signal<{ start: Date; end: Date } | null>(null);
  
  // Datos
  orders = toSignal(this.http.get<Order[]>('/api/orders'), { initialValue: [] });
  users = toSignal(this.http.get<User[]>('/api/users'), { initialValue: [] });
  
  // Computed: órdenes filtradas
  filteredOrders = computed(() => {
    let orders = this.orders();
    
    // Filtrar por estado
    const status = this.statusFilter();
    if (status !== 'all') {
      orders = orders.filter(o => o.status === status);
    }
    
    // Filtrar por fecha
    const range = this.dateRange();
    if (range) {
      orders = orders.filter(o => {
        const date = new Date(o.createdAt);
        return date >= range.start && date <= range.end;
      });
    }
    
    return orders;
  });
  
  // Computed: estadísticas
  stats = computed(() => {
    const orders = this.filteredOrders();
    
    return {
      total: orders.length,
      totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
      pending: orders.filter(o => o.status === 'pending').length,
      completed: orders.filter(o => o.status === 'completed').length,
      averageOrderValue: orders.length > 0 
        ? orders.reduce((sum, o) => sum + o.total, 0) / orders.length 
        : 0
    };
  });
  
  // Computed: órdenes con información de usuario
  ordersWithUser = computed(() => {
    const orders = this.filteredOrders();
    const users = this.users();
    
    return orders.map(order => ({
      ...order,
      userName: users.find(u => u.id === order.userId)?.name || 'Desconocido'
    }));
  });
}
```

---

## 6. Effects y Side Effects

### 6.1 Effects Básicos

Los effects ejecutan código cuando cambian las Signals:

```typescript
import { Component, inject, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({...})
export class UserComponent {
  private readonly http = inject(HttpClient);
  
  userId = signal<number | null>(null);
  
  constructor() {
    // Effect que reacciona a cambios
    effect(() => {
      const id = this.userId();
      if (id) {
        this.loadUser(id);
      }
    });
  }
  
  private loadUser(id: number): void {
    this.http.get(`/api/users/${id}`).subscribe(user => {
      console.log('User loaded:', user);
    });
  }
}
```

### 6.2 Effect con Cleanup

```typescript
import { Component, inject, signal, effect } from '@angular/core';

@Component({...})
export class TimerComponent {
  count = signal(0);
  
  constructor() {
    effect((onCleanup) => {
      const intervalId = setInterval(() => {
        this.count.update(c => c + 1);
      }, 1000);
      
      // Cleanup cuando el effect se re-ejecuta o el componente se destruye
      onCleanup(() => clearInterval(intervalId));
    });
  }
}
```

### 6.3 Effect con toObservable

Combina effects con RxJS para operaciones complejas:

```typescript
import { Component, inject, signal, effect } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({...})
export class SearchComponent {
  private readonly http = inject(HttpClient);
  
  searchTerm = signal('');
  
  constructor() {
    // Crear Observable desde Signal
    const searchTerm$ = toObservable(this.searchTerm);
    
    // Usar operadores RxJS
    searchTerm$.pipe(
      debounceTime(300),
      switchMap(term => this.http.get(`/api/search?q=${term}`))
    ).subscribe(results => {
      console.log('Results:', results);
    });
  }
}
```

### 6.4 Effect para Sincronización

```typescript
import { Component, inject, signal, effect } from '@angular/core';
import { localStorageSync } from './local-storage-sync';

@Component({...})
export class SettingsComponent {
  // Signal que se sincroniza con localStorage
  theme = signal<'light' | 'dark'>(
    localStorage.getItem('theme') as 'light' | 'dark' || 'light'
  );
  
  constructor() {
    // Effect para sincronizar con localStorage
    effect(() => {
      localStorage.setItem('theme', this.theme());
    });
  }
  
  toggleTheme(): void {
    this.theme.update(t => t === 'light' ? 'dark' : 'light');
  }
}
```

---

## 7. Patrones de Estado Híbrido

### 7.1 Patrón: Servicio con Estado Global

```typescript
// user.state.ts
import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, tap } from 'rxjs';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class UserStateService {
  private readonly http = inject(HttpClient);
  
  // Estado privado
  private _currentUser = signal<User | null>(null);
  private _isAuthenticated = signal(false);
  private _isLoading = signal(false);
  
  // Signals públicas de solo lectura
  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  
  // Computed
  readonly isAdmin = computed(() => 
    this._currentUser()?.role === 'admin'
  );
  
  readonly userName = computed(() => 
    this._currentUser()?.name || 'Invitado'
  );
  
  // Métodos
  login(credentials: { email: string; password: string }): Observable<User> {
    this._isLoading.set(true);
    
    return this.http.post<User>('/auth/login', credentials).pipe(
      tap({
        next: (user) => {
          this._currentUser.set(user);
          this._isAuthenticated.set(true);
        },
        finalize: () => this._isLoading.set(false)
      })
    );
  }
  
  logout(): void {
    this._currentUser.set(null);
    this._isAuthenticated.set(false);
  }
  
  updateProfile(updates: Partial<User>): Observable<User> {
    return this.http.patch<User>('/auth/profile', updates).pipe(
      tap(user => this._currentUser.set(user))
    );
  }
}
```

### 7.2 Patrón: Componente con Estado Local

```typescript
import { Component, inject, signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserStateService } from './user.state.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  template: `
    <div class="p-6">
      @if (userState.isLoading()) {
        <p>Cargando...</p>
      } @else if (userState.currentUser(); as user) {
        <h2>{{ user.name }}</h2>
        <p>{{ user.email }}</p>
        
        @if (userState.isAdmin()) {
          <button class="bg-red-500 text-white p-2 rounded">
            Panel de Admin
          </button>
        }
      }
    </div>
  `
})
export class UserProfileComponent {
  protected readonly userState = inject(UserStateService);
}
```

### 7.3 Patrón: Store con Signals

```typescript
// store.ts
import { signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

interface State {
  items: any[];
  loading: boolean;
  error: string | null;
}

export abstract class SignalStore<T> {
  // Estado privado
  private _state = signal<State>({
    items: [],
    loading: false,
    error: null
  });
  
  // Signals públicas
  readonly items = computed(() => this._state().items);
  readonly loading = computed(() => this._state().loading);
  readonly error = computed(() => this._state().error);
  
  // Métodos protegidos
  protected setLoading(loading: boolean): void {
    this._state.update(s => ({ ...s, loading }));
  }
  
  protected setItems(items: T[]): void {
    this._state.update(s => ({ ...s, items, loading: false }));
  }
  
  protected setError(error: string | null): void {
    this._state.update(s => ({ ...s, error, loading: false }));
  }
}

// products.store.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignalStore } from './store';

interface Product {
  id: number;
  name: string;
  price: number;
}

@Injectable({ providedIn: 'root' })
export class ProductsStore extends SignalStore<Product> {
  private readonly http = inject(HttpClient);
  
  loadProducts(): void {
    this.setLoading(true);
    this.setError(null);
    
    this.http.get<Product[]>('/api/products').subscribe({
      next: (products) => this.setItems(products),
      error: (err) => this.setError('Error al cargar productos')
    });
  }
}
```

---

## 8. Mejores Prácticas

### 8.1 Cuándo usar cada uno

| Situación | Usar |
|-----------|------|
| Estado local de componente | Signals |
| Datos desde HTTP | toSignal |
| Operaciones con debounce/throttle | toObservable + RxJS |
| Estado global | Signals en servicio |
| Eventos complejos | RxJS |
| WebSockets | RxJS → toSignal |

### 8.2 Reglas de Oro

1. **Siempre proporciona valor inicial** en toSignal para evitar undefined
2. **Maneja errores** en el Observable antes de convertirlo
3. **No uses effects** para computar valores, usa computed
4. **Evita effects infinitos** - no actualices Signals dentro de effects que dependen de ellas
5. **Usa asReadonly()** para exponer Signals públicas

### 8.3 Anti-Patrones

```typescript
// ❌ MAL: Effect para computar
effect(() => {
  this.fullName.set(`${this.firstName()} ${this.lastName()}`);
});

// ✅ BIEN: Computed
fullName = computed(() => `${this.firstName()} ${this.lastName()}`);

// ❌ MAL: Sin valor inicial
users = toSignal(this.http.get<User[]>('/api/users'));

// ✅ BIEN: Con valor inicial
users = toSignal(this.http.get<User[]>('/api/users'), { initialValue: [] });

// ❌ MAL: Effect infinito
effect(() => {
  console.log(this.count());
  this.count.update(c => c + 1); // Loop infinito
});

// ✅ BIEN: Effect sin modificar la Signal que observa
effect(() => {
  console.log(this.count());
  // No modificar count aquí
});
```

---

## Resumen del Día

### API Cubierta

| Función | Uso |
|---------|-----|
| `toSignal` | Observable → Signal |
| `toObservable` | Signal → Observable |
| `signal` | Estado reactivo |
| `computed` | Valores derivados |
| `effect` | Side effects |

### Puntos Clave

1. **toSignal** convierte Observables a Signals automáticamente
2. **toObservable** permite usar operadores RxJS con Signals
3. **computed** es más eficiente que effect para valores derivados
4. **Siempre maneja errores** antes de convertir a Signal
5. **Usa asReadonly()** para exponer Signals públicas

---

*Contenido del Día 12 - Curso Angular 21 - UyuniAdmin Frontend*
