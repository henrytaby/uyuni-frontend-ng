# Día 12: Lab 02 - Estado Híbrido y Patrones

## Objetivo

Implementar patrones avanzados de estado híbrido combinando Signals y RxJS.

## Tiempo Estimado

60 minutos

---

## Ejercicio 1: Store con Signals

### Descripción

Crear un Store genérico usando Signals para manejar estado.

### Instrucciones

1. Crear la clase base `SignalStore` en `src/app/core/store/signal-store.ts`
2. Implementar métodos para manejar estado, loading y error
3. Crear un store concreto para productos

### Código Base

```typescript
// src/app/core/store/signal-store.ts
import { signal, computed } from '@angular/core';

interface StoreState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
}

export abstract class SignalStore<T> {
  // TODO: Implementar estado interno con Signal
  // TODO: Exponer signals públicas de solo lectura
  // TODO: Implementar métodos protegidos para actualizar estado
}
```

### Solución

```typescript
// src/app/core/store/signal-store.ts
import { signal, computed } from '@angular/core';

interface StoreState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
}

const initialState: StoreState<never> = {
  data: [],
  loading: false,
  error: null
};

export abstract class SignalStore<T> {
  // Estado interno
  private _state = signal<StoreState<T>>({
    data: [],
    loading: false,
    error: null
  });
  
  // Signals públicas de solo lectura
  readonly data = computed(() => this._state().data);
  readonly loading = computed(() => this._state().loading);
  readonly error = computed(() => this._state().error);
  
  // Computed adicionales
  readonly hasData = computed(() => this._state().data.length > 0);
  readonly hasError = computed(() => this._state().error !== null);
  readonly count = computed(() => this._state().data.length);
  
  // Métodos protegidos para actualizar estado
  protected setLoading(loading: boolean): void {
    this._state.update(state => ({ ...state, loading }));
  }
  
  protected setData(data: T[]): void {
    this._state.set({ data, loading: false, error: null });
  }
  
  protected addData(item: T): void {
    this._state.update(state => ({
      ...state,
      data: [...state.data, item]
    }));
  }
  
  protected updateData(id: keyof T, item: Partial<T>): void {
    this._state.update(state => ({
      ...state,
      data: state.data.map(d => 
        d[id] === item[id] ? { ...d, ...item } : d
      )
    }));
  }
  
  protected removeData(id: keyof T, itemId: T[keyof T]): void {
    this._state.update(state => ({
      ...state,
      data: state.data.filter(d => d[id] !== itemId)
    }));
  }
  
  protected setError(error: string | null): void {
    this._state.update(state => ({ ...state, error, loading: false }));
  }
  
  protected clearError(): void {
    this.setError(null);
  }
  
  protected reset(): void {
    this._state.set({ data: [], loading: false, error: null });
  }
}
```

---

## Ejercicio 2: Products Store

### Descripción

Implementar un store concreto para productos usando la clase base.

### Instrucciones

1. Crear `ProductsStore` extendiendo `SignalStore`
2. Implementar métodos para cargar, crear, actualizar y eliminar productos
3. Usar HttpClient con Signals

### Solución

```typescript
// src/app/features/products/store/products.store.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { SignalStore } from '@core/store/signal-store';
import { catchError, tap, Observable } from 'rxjs';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
}

@Injectable({ providedIn: 'root' })
export class ProductsStore extends SignalStore<Product> {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/products';
  
  // Filtros
  categoryFilter = signal<string | null>(null);
  minPriceFilter = signal<number>(0);
  maxPriceFilter = signal<number>(Infinity);
  
  // Productos filtrados
  filteredProducts = computed(() => {
    const products = this.data();
    const category = this.categoryFilter();
    const minPrice = this.minPriceFilter();
    const maxPrice = this.maxPriceFilter();
    
    return products.filter(product => {
      if (category && product.category !== category) return false;
      if (product.price < minPrice || product.price > maxPrice) return false;
      return true;
    });
  });
  
  // Categorías disponibles
  categories = computed(() => {
    const products = this.data();
    return [...new Set(products.map(p => p.category))];
  });
  
  // Estadísticas
  stats = computed(() => {
    const products = this.filteredProducts();
    
    return {
      total: products.length,
      totalStock: products.reduce((sum, p) => sum + p.stock, 0),
      averagePrice: products.length > 0 
        ? products.reduce((sum, p) => sum + p.price, 0) / products.length 
        : 0,
      totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0)
    };
  });
  
  // Cargar productos
  loadProducts(): void {
    this.setLoading(true);
    this.clearError();
    
    this.http.get<Product[]>(this.apiUrl).subscribe({
      next: (products) => this.setData(products),
      error: (error) => this.setError('Error al cargar productos')
    });
  }
  
  // Crear producto
  createProduct(product: Omit<Product, 'id'>): Observable<Product> {
    this.setLoading(true);
    
    return this.http.post<Product>(this.apiUrl, product).pipe(
      tap({
        next: (newProduct) => {
          this.addData(newProduct);
        },
        error: () => this.setError('Error al crear producto')
      }),
      catchError((error) => {
        this.setError('Error al crear producto');
        throw error;
      })
    );
  }
  
  // Actualizar producto
  updateProduct(id: number, updates: Partial<Product>): Observable<Product> {
    this.setLoading(true);
    
    return this.http.patch<Product>(`${this.apiUrl}/${id}`, updates).pipe(
      tap({
        next: (updatedProduct) => {
          this.updateData('id', updatedProduct);
        },
        error: () => this.setError('Error al actualizar producto')
      })
    );
  }
  
  // Eliminar producto
  deleteProduct(id: number): Observable<void> {
    this.setLoading(true);
    
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap({
        next: () => {
          this.removeData('id', id);
        },
        error: () => this.setError('Error al eliminar producto')
      })
    );
  }
  
  // Métodos de filtro
  setCategoryFilter(category: string | null): void {
    this.categoryFilter.set(category);
  }
  
  setPriceFilter(min: number, max: number): void {
    this.minPriceFilter.set(min);
    this.maxPriceFilter.set(max);
  }
  
  clearFilters(): void {
    this.categoryFilter.set(null);
    this.minPriceFilter.set(0);
    this.maxPriceFilter.set(Infinity);
  }
}
```

---

## Ejercicio 3: Servicio de Autenticación con Signals

### Descripción

Implementar un servicio de autenticación usando Signals para estado.

### Instrucciones

1. Crear `AuthStateService` con Signals
2. Implementar login, logout y refresh
3. Usar toSignal para datos de perfil

### Solución

```typescript
// src/app/core/auth/auth-state.service.ts
import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Observable, tap, finalize, catchError, of } from 'rxjs';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  
  // Estado de autenticación
  private _isAuthenticated = signal(false);
  private _currentUser = signal<User | null>(null);
  private _accessToken = signal<string | null>(null);
  private _isLoading = signal(false);
  private _error = signal<string | null>(null);
  
  // Signals públicas de solo lectura
  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly currentUser = this._currentUser.asReadonly();
  readonly accessToken = this._accessToken.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  
  // Computed
  readonly isLoggedIn = computed(() => this._isAuthenticated() && this._currentUser() !== null);
  readonly userName = computed(() => this._currentUser()?.name ?? 'Invitado');
  readonly userEmail = computed(() => this._currentUser()?.email ?? '');
  readonly userRole = computed(() => this._currentUser()?.role ?? 'guest');
  readonly isAdmin = computed(() => this._currentUser()?.role === 'admin');
  
  // Effect para persistir token
  constructor() {
    // Cargar token desde localStorage al iniciar
    const storedToken = localStorage.getItem('access_token');
    if (storedToken) {
      this._accessToken.set(storedToken);
      this.loadProfile();
    }
    
    // Effect para sincronizar con localStorage
    effect(() => {
      const token = this._accessToken();
      if (token) {
        localStorage.setItem('access_token', token);
      } else {
        localStorage.removeItem('access_token');
      }
    });
  }
  
  // Login
  login(credentials: LoginCredentials): Observable<User | null> {
    this._isLoading.set(true);
    this._error.set(null);
    
    return this.http.post<AuthTokens>('/auth/login', credentials).pipe(
      tap({
        next: (tokens) => {
          this._accessToken.set(tokens.access_token);
          this._isAuthenticated.set(true);
        },
        error: (err) => {
          this._error.set(this.getErrorMessage(err));
        }
      }),
      // Cargar perfil después del login
      tap(() => this.loadProfile()),
      finalize(() => this._isLoading.set(false)),
      catchError(() => of(null))
    );
  }
  
  // Cargar perfil
  private loadProfile(): void {
    this.http.get<User>('/auth/profile').subscribe({
      next: (user) => {
        this._currentUser.set(user);
        this._isAuthenticated.set(true);
      },
      error: () => {
        this.logout();
      }
    });
  }
  
  // Logout
  logout(): void {
    this._isAuthenticated.set(false);
    this._currentUser.set(null);
    this._accessToken.set(null);
    this._error.set(null);
    
    localStorage.removeItem('access_token');
    this.router.navigate(['/signin']);
  }
  
  // Refresh token
  refreshToken(): Observable<AuthTokens | null> {
    const token = this._accessToken();
    if (!token) {
      return of(null);
    }
    
    return this.http.post<AuthTokens>('/auth/refresh', { token }).pipe(
      tap({
        next: (tokens) => {
          this._accessToken.set(tokens.access_token);
        },
        error: () => {
          this.logout();
        }
      }),
      catchError(() => {
        this.logout();
        return of(null);
      })
    );
  }
  
  // Actualizar perfil
  updateProfile(updates: Partial<User>): Observable<User | null> {
    this._isLoading.set(true);
    
    return this.http.patch<User>('/auth/profile', updates).pipe(
      tap({
        next: (user) => {
          this._currentUser.set(user);
        }
      }),
      finalize(() => this._isLoading.set(false)),
      catchError(() => of(null))
    );
  }
  
  // Limpiar error
  clearError(): void {
    this._error.set(null);
  }
  
  // Mensaje de error
  private getErrorMessage(error: any): string {
    if (error.status === 401) {
      return 'Credenciales inválidas';
    }
    if (error.status === 403) {
      return 'Cuenta bloqueada';
    }
    if (error.status === 0) {
      return 'Error de conexión';
    }
    return 'Error al iniciar sesión';
  }
}
```

---

## Ejercicio 4: Componente con Estado Híbrido

### Descripción

Crear un componente que use el store y el servicio de autenticación.

### Instrucciones

1. Crear componente de lista de productos
2. Usar el ProductsStore
3. Implementar filtros con Signals
4. Mostrar estado de carga y error

### Solución

```typescript
// src/app/features/products/pages/product-list/product-list.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { ProductsStore } from '../../store/products.store';
import { AuthStateService } from '@core/auth/auth-state.service';
import { signal } from '@angular/core';

@Component({
  selector: 'app-product-list',
  standalone: true,
  template: `
    <div class="p-6">
      <h2 class="text-xl font-bold mb-4">Productos</h2>
      
      <!-- Filtros -->
      <div class="mb-6 flex gap-4">
        <select 
          class="p-2 border rounded"
          (change)="store.setCategoryFilter($any($event.target).value || null)">
          <option value="">Todas las categorías</option>
          @for (category of store.categories(); track category) {
            <option [value]="category">{{ category }}</option>
          }
        </select>
        
        <input 
          type="number"
          placeholder="Precio mín"
          class="p-2 border rounded w-24"
          (input)="minPrice.set($any($event.target).value)"
        />
        
        <input 
          type="number"
          placeholder="Precio máx"
          class="p-2 border rounded w-24"
          (input)="maxPrice.set($any($event.target).value)"
        />
        
        <button 
          class="px-4 py-2 bg-gray-200 rounded"
          (click)="applyPriceFilter()">
          Aplicar
        </button>
        
        <button 
          class="px-4 py-2 bg-gray-200 rounded"
          (click)="store.clearFilters()">
          Limpiar
        </button>
      </div>
      
      <!-- Estado de carga -->
      @if (store.loading()) {
        <p class="text-gray-500">Cargando productos...</p>
      }
      
      <!-- Error -->
      @if (store.error()) {
        <p class="text-red-500">{{ store.error() }}</p>
      }
      
      <!-- Estadísticas -->
      <div class="mb-4 p-4 bg-gray-100 rounded">
        <p>Total: {{ store.stats().total }} productos</p>
        <p>Stock total: {{ store.stats().totalStock }}</p>
        <p>Precio promedio: ${{ store.stats().averagePrice | number:'1.2-2' }}</p>
        <p>Valor total: ${{ store.stats().totalValue | number:'1.2-2' }}</p>
      </div>
      
      <!-- Lista de productos -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (product of store.filteredProducts(); track product.id) {
          <div class="p-4 border rounded">
            <h3 class="font-medium">{{ product.name }}</h3>
            <p class="text-gray-500">{{ product.category }}</p>
            <p class="text-lg font-bold">${{ product.price }}</p>
            <p class="text-sm">Stock: {{ product.stock }}</p>
            
            @if (authState.isAdmin()) {
              <div class="mt-2 flex gap-2">
                <button 
                  class="px-2 py-1 bg-blue-500 text-white rounded text-sm"
                  (click)="editProduct(product)">
                  Editar
                </button>
                <button 
                  class="px-2 py-1 bg-red-500 text-white rounded text-sm"
                  (click)="deleteProduct(product.id)">
                  Eliminar
                </button>
              </div>
            }
          </div>
        } @empty {
          <p class="text-gray-500 col-span-3">No hay productos</p>
        }
      </div>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  protected readonly store = inject(ProductsStore);
  protected readonly authState = inject(AuthStateService);
  
  // Filtros locales
  protected minPrice = signal<number>(0);
  protected maxPrice = signal<number>(Infinity);
  
  ngOnInit(): void {
    this.store.loadProducts();
  }
  
  protected applyPriceFilter(): void {
    this.store.setPriceFilter(
      this.minPrice() || 0,
      this.maxPrice() || Infinity
    );
  }
  
  protected editProduct(product: any): void {
    // Navegar a edición
    console.log('Edit:', product);
  }
  
  protected deleteProduct(id: number): void {
    if (confirm('¿Eliminar producto?')) {
      this.store.deleteProduct(id).subscribe();
    }
  }
}
```

---

## Ejercicio 5: Effect para Analytics

### Descripción

Implementar tracking de analytics usando effects.

### Instrucciones

1. Crear servicio de analytics
2. Usar effects para trackear navegación
3. Trackear eventos importantes

### Solución

```typescript
// src/app/core/services/analytics.service.ts
import { Injectable, inject, effect, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';

interface AnalyticsEvent {
  type: 'page_view' | 'action' | 'error' | 'search';
  name: string;
  data?: Record<string, any>;
  timestamp: Date;
  userId?: number;
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  
  // Estado
  lastPageView = signal<string | null>(null);
  eventCount = signal(0);
  
  // Trackear navegación
  constructor() {
    // Effect para trackear cambios de página
    effect(() => {
      const url = this.lastPageView();
      if (url) {
        this.trackEvent('page_view', { url });
      }
    });
    
    // Suscribirse a navegación
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      this.lastPageView.set((event as NavigationEnd).url);
    });
  }
  
  // Trackear evento
  trackEvent(type: AnalyticsEvent['type'], data?: Record<string, any>): void {
    const event: AnalyticsEvent = {
      type,
      name: type,
      data,
      timestamp: new Date()
    };
    
    // Enviar a backend (en producción)
    // this.http.post('/api/analytics', event).subscribe();
    
    // Log en desarrollo
    console.log('Analytics:', event);
    
    // Incrementar contador
    this.eventCount.update(c => c + 1);
  }
  
  // Trackear acción de usuario
  trackAction(action: string, data?: Record<string, any>): void {
    this.trackEvent('action', { action, ...data });
  }
  
  // Trackear búsqueda
  trackSearch(term: string, results: number): void {
    this.trackEvent('search', { term, results });
  }
  
  // Trackear error
  trackError(error: string, context?: Record<string, any>): void {
    this.trackEvent('error', { error, ...context });
  }
}
```

---

## Reto Final: Carrito de Compras con Estado Híbrido

### Descripción

Implementar un carrito de compras completo usando Signals y RxJS.

### Requisitos

1. Store para productos
2. Servicio de carrito con Signals
3. Computed para totales
4. Effect para persistencia
5. Integración con autenticación

### Solución

```typescript
// src/app/features/cart/services/cart.service.ts
import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthStateService } from '@core/auth/auth-state.service';
import { catchError, of } from 'rxjs';

interface CartItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
}

interface Discount {
  code: string;
  percentage: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly authState = inject(AuthStateService);
  
  // Estado del carrito
  items = signal<CartItem[]>([]);
  discount = signal<Discount | null>(null);
  shippingMethod = signal<'standard' | 'express' | 'pickup'>('standard');
  
  // Computed: subtotal
  subtotal = computed(() => 
    this.items().reduce((sum, item) => sum + (item.price * item.quantity), 0)
  );
  
  // Computed: descuento
  discountAmount = computed(() => {
    const discount = this.discount();
    if (!discount) return 0;
    return this.subtotal() * (discount.percentage / 100);
  });
  
  // Computed: envío
  shippingCost = computed(() => {
    const method = this.shippingMethod();
    const subtotal = this.subtotal();
    
    switch (method) {
      case 'express': return subtotal > 100 ? 5 : 15;
      case 'pickup': return 0;
      default: return subtotal > 50 ? 0 : 10;
    }
  });
  
  // Computed: total
  total = computed(() => 
    this.subtotal() - this.discountAmount() + this.shippingCost()
  );
  
  // Computed: cantidad de items
  itemCount = computed(() => 
    this.items().reduce((sum, item) => sum + item.quantity, 0)
  );
  
  // Computed: ¿carrito vacío?
  isEmpty = computed(() => this.items().length === 0);
  
  // Effect para persistir carrito
  constructor() {
    // Cargar carrito desde localStorage
    const stored = localStorage.getItem('cart');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        this.items.set(data.items || []);
        this.discount.set(data.discount || null);
      } catch (e) {
        console.error('Error loading cart:', e);
      }
    }
    
    // Effect para guardar en localStorage
    effect(() => {
      const items = this.items();
      const discount = this.discount();
      
      localStorage.setItem('cart', JSON.stringify({
        items,
        discount,
        updatedAt: new Date().toISOString()
      }));
    });
    
    // Effect para sincronizar con backend si está autenticado
    effect(() => {
      if (this.authState.isLoggedIn() && !this.isEmpty()) {
        this.syncCart();
      }
    });
  }
  
  // Agregar item
  addItem(item: Omit<CartItem, 'quantity'>): void {
    this.items.update(items => {
      const existingIndex = items.findIndex(i => i.productId === item.productId);
      
      if (existingIndex >= 0) {
        const updated = [...items];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1
        };
        return updated;
      }
      
      return [...items, { ...item, quantity: 1 }];
    });
  }
  
  // Remover item
  removeItem(productId: number): void {
    this.items.update(items => 
      items.filter(i => i.productId !== productId)
    );
  }
  
  // Actualizar cantidad
  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    
    this.items.update(items => 
      items.map(i => 
        i.productId === productId ? { ...i, quantity } : i
      )
    );
  }
  
  // Incrementar cantidad
  incrementQuantity(productId: number): void {
    this.items.update(items => 
      items.map(i => 
        i.productId === productId 
          ? { ...i, quantity: i.quantity + 1 } 
          : i
      )
    );
  }
  
  // Decrementar cantidad
  decrementQuantity(productId: number): void {
    const item = this.items().find(i => i.productId === productId);
    if (item && item.quantity > 1) {
      this.updateQuantity(productId, item.quantity - 1);
    } else {
      this.removeItem(productId);
    }
  }
  
  // Aplicar descuento
  applyDiscount(code: string): boolean {
    // En producción, validar con backend
    const discounts: Record<string, number> = {
      'DESCUENTO10': 10,
      'DESCUENTO20': 20,
      'PROMO50': 50
    };
    
    const percentage = discounts[code.toUpperCase()];
    if (percentage) {
      this.discount.set({ code, percentage });
      return true;
    }
    
    return false;
  }
  
  // Remover descuento
  removeDiscount(): void {
    this.discount.set(null);
  }
  
  // Cambiar método de envío
  setShippingMethod(method: 'standard' | 'express' | 'pickup'): void {
    this.shippingMethod.set(method);
  }
  
  // Vaciar carrito
  clearCart(): void {
    this.items.set([]);
    this.discount.set(null);
    this.shippingMethod.set('standard');
  }
  
  // Sincronizar con backend
  private syncCart(): void {
    if (!this.authState.isLoggedIn()) return;
    
    this.http.post('/api/cart/sync', {
      items: this.items(),
      discount: this.discount()
    }).pipe(
      catchError(() => of(null))
    ).subscribe();
  }
  
  // Checkout
  checkout(): Observable<any> {
    return this.http.post('/api/orders', {
      items: this.items(),
      subtotal: this.subtotal(),
      discount: this.discountAmount(),
      shipping: this.shippingCost(),
      total: this.total(),
      shippingMethod: this.shippingMethod()
    });
  }
}
```

---

## Criterios de Evaluación

| Criterio | Puntos |
|----------|--------|
| Ejercicio 1: SignalStore base | 20 pts |
| Ejercicio 2: ProductsStore | 20 pts |
| Ejercicio 3: AuthStateService | 20 pts |
| Ejercicio 4: Componente híbrido | 20 pts |
| Ejercicio 5: Analytics con effects | 20 pts |
| **Total** | **100 pts** |

---

*Lab 02 - Día 12 - Curso Angular 21 - UyuniAdmin Frontend*
