# Día 11: Lab 02 - Operadores de Combinación y Filtrado

## Objetivo

Practicar con operadores de combinación (`forkJoin`, `combineLatest`, `merge`) y filtrado avanzado.

## Tiempo Estimado

60 minutos

---

## Ejercicio 1: forkJoin - Carga Paralela de Datos

### Descripción

Cargar múltiples recursos en paralelo para un dashboard.

### Instrucciones

1. Crear el servicio `src/app/features/dashboard/services/dashboard-data.service.ts`
2. Implementar carga paralela con `forkJoin`

### Código Base

```typescript
// src/app/features/dashboard/services/dashboard-data.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface DashboardData {
  users: User[];
  orders: Order[];
  stats: Stats;
  notifications: Notification[];
}

export interface User {
  id: number;
  name: string;
}

export interface Order {
  id: number;
  total: number;
  status: string;
}

export interface Stats {
  totalRevenue: number;
  totalOrders: number;
  activeUsers: number;
}

export interface Notification {
  id: number;
  message: string;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardDataService {
  private readonly http = inject(HttpClient);

  // TODO: Implementar carga paralela con forkJoin
  loadDashboardData(): Observable<DashboardData> {
    // Tu código aquí
    // Pistas:
    // 1. Usar forkJoin con objeto para mejor legibilidad
    // 2. Manejar errores individualmente
    // 3. Retornar valores por defecto en caso de error
  }
}
```

### Solución

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface DashboardData {
  users: User[];
  orders: Order[];
  stats: Stats;
  notifications: Notification[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardDataService {
  private readonly http = inject(HttpClient);

  loadDashboardData(): Observable<DashboardData> {
    return forkJoin({
      users: this.http.get<User[]>('/api/users').pipe(
        catchError(() => of([]))
      ),
      orders: this.http.get<Order[]>('/api/orders').pipe(
        catchError(() => of([]))
      ),
      stats: this.http.get<Stats>('/api/stats').pipe(
        catchError(() => of({
          totalRevenue: 0,
          totalOrders: 0,
          activeUsers: 0
        }))
      ),
      notifications: this.http.get<Notification[]>('/api/notifications').pipe(
        catchError(() => of([]))
      )
    });
  }

  // Versión con transformación adicional
  loadDashboardDataWithMetrics(): Observable<DashboardData & { metrics: DashboardMetrics }> {
    return forkJoin({
      users: this.http.get<User[]>('/api/users').pipe(catchError(() => of([]))),
      orders: this.http.get<Order[]>('/api/orders').pipe(catchError(() => of([]))),
      stats: this.http.get<Stats>('/api/stats').pipe(catchError(() => of({} as Stats))),
      notifications: this.http.get<Notification[]>('/api/notifications').pipe(catchError(() => of([])))
    }).pipe(
      map(data => ({
        ...data,
        metrics: {
          totalUsers: data.users.length,
          totalOrders: data.orders.length,
          pendingOrders: data.orders.filter(o => o.status === 'pending').length,
          unreadNotifications: data.notifications.filter(n => !n.read).length
        }
      }))
    );
  }
}
```

---

## Ejercicio 2: combineLatest - Estado Combinado

### Descripción

Crear un servicio que combine múltiples fuentes de estado.

### Instrucciones

1. Crear el servicio `src/app/features/cart/services/cart-state.service.ts`
2. Implementar estado combinado con `combineLatest`

### Código Base

```typescript
// src/app/features/cart/services/cart-state.service.ts
import { Injectable, signal } from '@angular/core';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Discount {
  code: string;
  percentage: number;
}

interface CartState {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  itemCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartStateService {
  // TODO: Implementar con BehaviorSubjects
  // Pistas:
  // 1. Crear BehaviorSubjects para items y discount
  // 2. Usar combineLatest para combinarlos
  // 3. Calcular subtotal, discount y total con map
  // 4. Exponer como Observable público
}
```

### Solución

```typescript
import { Injectable } from '@angular/core';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Discount {
  code: string;
  percentage: number;
}

interface CartState {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  itemCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartStateService {
  // Estado interno con BehaviorSubjects
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  private discountSubject = new BehaviorSubject<Discount | null>(null);
  
  // Observables públicos
  items$ = this.itemsSubject.asObservable();
  discount$ = this.discountSubject.asObservable();
  
  // Estado combinado
  cartState$: Observable<CartState> = combineLatest([
    this.items$,
    this.discount$
  ]).pipe(
    map(([items, discount]) => {
      const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const discountAmount = discount ? subtotal * (discount.percentage / 100) : 0;
      const total = subtotal - discountAmount;
      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
      
      return {
        items,
        subtotal,
        discount: discountAmount,
        total,
        itemCount
      };
    })
  );

  // Getters para el valor actual
  get currentItems(): CartItem[] {
    return this.itemsSubject.value;
  }

  // Métodos para modificar el estado
  addItem(item: CartItem): void {
    const currentItems = this.itemsSubject.value;
    const existingIndex = currentItems.findIndex(i => i.id === item.id);
    
    if (existingIndex >= 0) {
      // Actualizar cantidad si ya existe
      const updatedItems = [...currentItems];
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: updatedItems[existingIndex].quantity + item.quantity
      };
      this.itemsSubject.next(updatedItems);
    } else {
      // Agregar nuevo item
      this.itemsSubject.next([...currentItems, item]);
    }
  }

  removeItem(itemId: number): void {
    const currentItems = this.itemsSubject.value;
    this.itemsSubject.next(currentItems.filter(item => item.id !== itemId));
  }

  updateQuantity(itemId: number, quantity: number): void {
    const currentItems = this.itemsSubject.value;
    const updatedItems = currentItems.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    );
    this.itemsSubject.next(updatedItems);
  }

  applyDiscount(discount: Discount): void {
    this.discountSubject.next(discount);
  }

  clearDiscount(): void {
    this.discountSubject.next(null);
  }

  clearCart(): void {
    this.itemsSubject.next([]);
    this.discountSubject.next(null);
  }
}
```

---

## Ejercicio 3: merge - Múltiples Fuentes

### Descripción

Combinar notificaciones de múltiples fuentes.

### Instrucciones

1. Crear un servicio que combine notificaciones de WebSocket y HTTP
2. Usar `merge` para intercalar las fuentes

### Código Base

```typescript
// src/app/features/notifications/services/notification.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, merge, Subject, timer } from 'rxjs';
import { map, switchMap, retry, catchError, of } from 'rxjs/operators';

interface Notification {
  id: number;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly http = inject(HttpClient);
  
  // TODO: Implementar fusión de fuentes
  // Pistas:
  // 1. Crear Subject para notificaciones en tiempo real
  // 2. Crear Observable para polling de notificaciones
  // 3. Usar merge para combinar ambas fuentes
}
```

### Solución

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, merge, Subject, timer } from 'rxjs';
import { map, switchMap, retry, catchError, of, filter, distinctUntilChanged } from 'rxjs/operators';

interface Notification {
  id: number;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly http = inject(HttpClient);
  
  // Subject para notificaciones en tiempo real (WebSocket simulado)
  private realtimeNotifications$ = new Subject<Notification>();
  
  // Observable para polling de notificaciones
  private pollingNotifications$: Observable<Notification[]> = timer(0, 30000).pipe(
    switchMap(() => this.http.get<Notification[]>('/api/notifications').pipe(
      retry(2),
      catchError(error => {
        console.error('Error fetching notifications:', error);
        return of([]);
      })
    ))
  );
  
  // Stream combinado de todas las notificaciones
  allNotifications$: Observable<Notification[]> = merge(
    // Polling: cada 30 segundos
    this.pollingNotifications$,
    // Realtime: cuando llegan
    this.realtimeNotifications$.pipe(
      map(notification => [notification])
    )
  ).pipe(
    // Acumular notificaciones
    map(notifications => notifications.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ))
  );

  // Solo notificaciones no leídas
  unreadNotifications$: Observable<Notification[]> = this.allNotifications$.pipe(
    map(notifications => notifications.filter(n => !n.read))
  );

  // Contador de no leídas
  unreadCount$: Observable<number> = this.unreadNotifications$.pipe(
    map(notifications => notifications.length)
  );

  // Método para agregar notificación en tiempo real
  addRealtimeNotification(notification: Notification): void {
    this.realtimeNotifications$.next(notification);
  }

  // Marcar como leída
  markAsRead(notificationId: number): Observable<void> {
    return this.http.patch<void>(`/api/notifications/${notificationId}/read`, {});
  }

  // Marcar todas como leídas
  markAllAsRead(): Observable<void> {
    return this.http.post<void>('/api/notifications/read-all', {});
  }
}
```

---

## Ejercicio 4: Filtrado Avanzado

### Descripción

Implementar un sistema de filtros para una lista de productos.

### Instrucciones

1. Crear un componente con múltiples filtros
2. Usar operadores de filtrado para aplicar los filtros

### Código Base

```typescript
// src/app/features/products/pages/product-list/product-list.component.ts
import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
}

interface ProductFilters {
  search: string;
  category: string | null;
  minPrice: number;
  maxPrice: number;
  inStock: boolean;
  minRating: number;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  template: `
    <div class="p-6">
      <!-- Filtros -->
      <div class="mb-6 space-y-4">
        <input 
          type="text" 
          placeholder="Buscar productos..."
          [value]="filters().search"
          (input)="updateFilter('search', $event)"
        />
        
        <select (change)="updateFilter('category', $event)">
          <option value="">Todas las categorías</option>
          <option value="electronics">Electrónica</option>
          <option value="clothing">Ropa</option>
          <option value="books">Libros</option>
        </select>
        
        <!-- Más filtros... -->
      </div>
      
      <!-- Lista de productos -->
      @for (product of products(); track product.id) {
        <div class="p-4 border rounded mb-2">
          {{ product.name }} - ${{ product.price }}
        </div>
      }
    </div>
  `
})
export class ProductListComponent {
  private readonly http = inject(HttpClient);
  
  // TODO: Implementar sistema de filtros
  // Pistas:
  // 1. Usar BehaviorSubject para los filtros
  // 2. Aplicar debounceTime para la búsqueda
  // 3. Usar combineLatest para combinar filtros y productos
  // 4. Filtrar productos con operadores
}
```

### Solución

```typescript
import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap, startWith } from 'rxjs/operators';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
}

interface ProductFilters {
  search: string;
  category: string | null;
  minPrice: number;
  maxPrice: number;
  inStock: boolean;
  minRating: number;
}

const DEFAULT_FILTERS: ProductFilters = {
  search: '',
  category: null,
  minPrice: 0,
  maxPrice: Infinity,
  inStock: false,
  minRating: 0
};

@Component({
  selector: 'app-product-list',
  standalone: true,
  template: `
    <div class="p-6">
      <!-- Filtros -->
      <div class="mb-6 space-y-4 bg-gray-50 p-4 rounded-lg">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Búsqueda -->
          <input 
            type="text" 
            placeholder="Buscar productos..."
            class="p-2 border rounded"
            (input)="updateFilter('search', $event)"
          />
          
          <!-- Categoría -->
          <select 
            class="p-2 border rounded"
            (change)="updateFilter('category', $event)">
            <option value="">Todas las categorías</option>
            <option value="electronics">Electrónica</option>
            <option value="clothing">Ropa</option>
            <option value="books">Libros</option>
          </select>
          
          <!-- En stock -->
          <label class="flex items-center gap-2">
            <input 
              type="checkbox"
              (change)="updateFilter('inStock', $event)"
            />
            Solo en stock
          </label>
        </div>
        
        <!-- Rango de precios -->
        <div class="flex gap-4">
          <input 
            type="number"
            placeholder="Precio mínimo"
            class="p-2 border rounded w-32"
            (input)="updateFilter('minPrice', $event)"
          />
          <input 
            type="number"
            placeholder="Precio máximo"
            class="p-2 border rounded w-32"
            (input)="updateFilter('maxPrice', $event)"
          />
        </div>
        
        <!-- Rating mínimo -->
        <div class="flex items-center gap-2">
          <span>Rating mínimo:</span>
          <select 
            class="p-2 border rounded"
            (change)="updateFilter('minRating', $event)">
            <option value="0">Todos</option>
            <option value="3">3+ estrellas</option>
            <option value="4">4+ estrellas</option>
            <option value="4.5">4.5+ estrellas</option>
          </select>
        </div>
      </div>
      
      <!-- Contador de resultados -->
      <p class="mb-4 text-gray-600">
        {{ products().length }} productos encontrados
      </p>
      
      <!-- Lista de productos -->
      @for (product of products(); track product.id) {
        <div class="p-4 border rounded mb-2 flex justify-between items-center">
          <div>
            <h3 class="font-semibold">{{ product.name }}</h3>
            <p class="text-sm text-gray-500">{{ product.category }}</p>
          </div>
          <div class="text-right">
            <p class="font-bold">${{ product.price }}</p>
            <p class="text-sm">
              @if (product.stock > 0) {
                <span class="text-green-600">En stock ({{ product.stock }})</span>
              } @else {
                <span class="text-red-600">Agotado</span>
              }
            </p>
            <p class="text-yellow-500">{{ '★'.repeat(Math.round(product.rating)) }}</p>
          </div>
        </div>
      } @empty {
        <p class="text-gray-500 text-center py-8">No se encontraron productos</p>
      }
    </div>
  `
})
export class ProductListComponent implements OnInit {
  private readonly http = inject(HttpClient);
  
  // Estado de filtros
  private filtersSubject = new BehaviorSubject<ProductFilters>(DEFAULT_FILTERS);
  
  // Productos filtrados
  products = signal<Product[]>([]);
  
  ngOnInit(): void {
    this.setupProductFiltering();
  }
  
  private setupProductFiltering(): void {
    // Combinar: cargar productos + aplicar filtros
    this.filtersSubject.pipe(
      // Debounce para la búsqueda
      debounceTime(300),
      // Evitar filtros duplicados
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      // Cargar productos (podría ser HTTP)
      switchMap(filters => {
        // En un caso real, esto sería:
        // return this.http.get<Product[]>('/api/products', { params: filters });
        return this.getMockProducts().pipe(
          map(products => this.applyFilters(products, filters))
        );
      })
    ).subscribe(filteredProducts => {
      this.products.set(filteredProducts);
    });
  }
  
  private applyFilters(products: Product[], filters: ProductFilters): Product[] {
    return products.filter(product => {
      // Filtro de búsqueda
      if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      // Filtro de categoría
      if (filters.category && product.category !== filters.category) {
        return false;
      }
      
      // Filtro de precio
      if (product.price < filters.minPrice || product.price > filters.maxPrice) {
        return false;
      }
      
      // Filtro de stock
      if (filters.inStock && product.stock <= 0) {
        return false;
      }
      
      // Filtro de rating
      if (product.rating < filters.minRating) {
        return false;
      }
      
      return true;
    });
  }
  
  private getMockProducts(): Observable<Product[]> {
    return of([
      { id: 1, name: 'Laptop', category: 'electronics', price: 999, stock: 10, rating: 4.5 },
      { id: 2, name: 'Camiseta', category: 'clothing', price: 25, stock: 50, rating: 4.0 },
      { id: 3, name: 'Libro Angular', category: 'books', price: 35, stock: 20, rating: 4.8 },
      { id: 4, name: 'Smartphone', category: 'electronics', price: 699, stock: 0, rating: 4.2 },
      { id: 5, name: 'Pantalones', category: 'clothing', price: 45, stock: 30, rating: 3.5 },
    ]);
  }
  
  updateFilter(key: keyof ProductFilters, event: Event): void {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    let value: string | number | boolean | null = target.value;
    
    // Convertir tipos según el campo
    if (key === 'minPrice' || key === 'maxPrice' || key === 'minRating') {
      value = value ? parseFloat(value) : (key === 'maxPrice' ? Infinity : 0);
    } else if (key === 'inStock') {
      value = (target as HTMLInputElement).checked;
    } else if (key === 'category' && value === '') {
      value = null;
    }
    
    const currentFilters = this.filtersSubject.value;
    this.filtersSubject.next({
      ...currentFilters,
      [key]: value
    });
  }
}
```

---

## Ejercicio 5: Patrones de Cleanup

### Descripción

Implementar múltiples suscripciones con cleanup centralizado.

### Instrucciones

1. Crear un componente con múltiples suscripciones
2. Usar `takeUntil` para cleanup

### Solución

```typescript
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, interval, fromEvent } from 'rxjs';
import { takeUntil, switchMap, debounceTime, map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div class="p-6">
      <h2 class="text-xl font-bold mb-4">Dashboard</h2>
      
      <!-- Datos del usuario -->
      <div class="mb-4">
        <h3>Usuario</h3>
        <p>{{ user()?.name }}</p>
      </div>
      
      <!-- Notificaciones -->
      <div class="mb-4">
        <h3>Notificaciones</h3>
        <p>{{ notifications().length }} nuevas</p>
      </div>
      
      <!-- Stats en tiempo real -->
      <div class="mb-4">
        <h3>Estadísticas</h3>
        <p>Visitas: {{ liveStats() }}</p>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly http = inject(HttpClient);
  
  // Subject para cleanup
  private destroy$ = new Subject<void>();
  
  // Estado con signals
  user = signal<{ name: string } | null>(null);
  notifications = signal<{ id: number; message: string }[]>([]);
  liveStats = signal(0);
  
  ngOnInit(): void {
    this.loadUserData();
    this.loadNotifications();
    this.setupLiveStats();
    this.setupKeyboardShortcuts();
  }
  
  ngOnDestroy(): void {
    // Un solo cleanup para todas las suscripciones
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private loadUserData(): void {
    this.http.get<{ name: string }>('/api/user').pipe(
      takeUntil(this.destroy$)
    ).subscribe(user => this.user.set(user));
  }
  
  private loadNotifications(): void {
    // Polling de notificaciones cada 30 segundos
    interval(30000).pipe(
      switchMap(() => this.http.get<{ id: number; message: string }[]>('/api/notifications')),
      takeUntil(this.destroy$)
    ).subscribe(notifications => this.notifications.set(notifications));
  }
  
  private setupLiveStats(): void {
    // Stats en tiempo real (simulado)
    interval(1000).pipe(
      map((_, index) => index * 10),
      takeUntil(this.destroy$)
    ).subscribe(stats => this.liveStats.set(stats));
  }
  
  private setupKeyboardShortcuts(): void {
    // Escuchar teclas globales
    fromEvent<KeyboardEvent>(document, 'keydown').pipe(
      debounceTime(100),
      takeUntil(this.destroy$)
    ).subscribe(event => {
      if (event.key === 'r' && event.ctrlKey) {
        this.refresh();
      }
    });
  }
  
  private refresh(): void {
    // Recargar todos los datos
    this.loadUserData();
    this.loadNotifications();
  }
}
```

---

## Reto Final: Dashboard Completo

### Descripción

Implementar un dashboard que combine todos los patrones aprendidos.

### Requisitos

1. Cargar datos en paralelo con `forkJoin`
2. Actualizar en tiempo real con `merge`
3. Filtrar con `combineLatest`
4. Cleanup con `takeUntil`
5. Manejar errores con `catchError`

### Solución

```typescript
import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { 
  forkJoin, 
  merge, 
  combineLatest, 
  Subject, 
  interval, 
  BehaviorSubject 
} from 'rxjs';
import { 
  takeUntil, 
  catchError, 
  switchMap, 
  map, 
  filter,
  startWith 
} from 'rxjs/operators';

interface DashboardState {
  users: User[];
  orders: Order[];
  stats: Stats;
  loading: boolean;
  error: string | null;
}

@Component({
  selector: 'app-complete-dashboard',
  standalone: true,
  template: `
    <div class="p-6">
      @if (loading()) {
        <p>Cargando...</p>
      }
      
      @if (error()) {
        <p class="text-red-500">{{ error() }}</p>
      }
      
      @if (!loading() && !error()) {
        <div class="grid grid-cols-3 gap-4">
          <div class="p-4 bg-blue-100 rounded">
            <h3>Usuarios</h3>
            <p class="text-2xl">{{ users().length }}</p>
          </div>
          <div class="p-4 bg-green-100 rounded">
            <h3>Órdenes</h3>
            <p class="text-2xl">{{ orders().length }}</p>
          </div>
          <div class="p-4 bg-yellow-100 rounded">
            <h3>Ingresos</h3>
            <p class="text-2xl">${{ stats()?.totalRevenue }}</p>
          </div>
        </div>
      }
    </div>
  `
})
export class CompleteDashboardComponent implements OnInit, OnDestroy {
  private readonly http = inject(HttpClient);
  private destroy$ = new Subject<void>();
  
  // Estado
  users = signal<User[]>([]);
  orders = signal<Order[]>([]);
  stats = signal<Stats | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  
  // Filtros
  private userFilter$ = new BehaviorSubject<string>('');
  private orderFilter$ = new BehaviorSubject<string>('');
  
  ngOnInit(): void {
    this.loadInitialData();
    this.setupRealtimeUpdates();
    this.setupFilters();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private loadInitialData(): void {
    forkJoin({
      users: this.http.get<User[]>('/api/users').pipe(
        catchError(() => [])
      ),
      orders: this.http.get<Order[]>('/api/orders').pipe(
        catchError(() => [])
      ),
      stats: this.http.get<Stats>('/api/stats').pipe(
        catchError(() => null)
      )
    }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: ({ users, orders, stats }) => {
        this.users.set(users);
        this.orders.set(orders);
        this.stats.set(stats);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar datos');
        this.loading.set(false);
      }
    });
  }
  
  private setupRealtimeUpdates(): void {
    // Actualizaciones periódicas
    const periodicUpdates$ = interval(60000).pipe(
      switchMap(() => forkJoin({
        users: this.http.get<User[]>('/api/users').pipe(catchError(() => [])),
        orders: this.http.get<Order[]>('/api/orders').pipe(catchError(() => []))
      }))
    );
    
    // Combinar con actualizaciones iniciales
    merge(
      periodicUpdates$
    ).pipe(
      takeUntil(this.destroy$)
    ).subscribe(({ users, orders }) => {
      this.users.set(users);
      this.orders.set(orders);
    });
  }
  
  private setupFilters(): void {
    combineLatest([
      this.userFilter$.pipe(startWith('')),
      this.http.get<User[]>('/api/users').pipe(startWith([]))
    ]).pipe(
      map(([filter, users]) => 
        users.filter(u => u.name.toLowerCase().includes(filter.toLowerCase()))
      ),
      takeUntil(this.destroy$)
    ).subscribe(filteredUsers => {
      // Actualizar usuarios filtrados
    });
  }
}
```

---

## Criterios de Evaluación

| Criterio | Puntos |
|----------|--------|
| Ejercicio 1: forkJoin | 20 pts |
| Ejercicio 2: combineLatest | 20 pts |
| Ejercicio 3: merge | 20 pts |
| Ejercicio 4: Filtrado Avanzado | 20 pts |
| Ejercicio 5: Cleanup Patterns | 20 pts |
| **Total** | **100 pts** |

---

*Lab 02 - Día 11 - Curso Angular 21 - UyuniAdmin Frontend*
