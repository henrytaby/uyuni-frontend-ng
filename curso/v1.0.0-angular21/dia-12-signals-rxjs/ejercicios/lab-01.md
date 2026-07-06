# Día 12: Lab 01 - toSignal y toObservable

## Objetivo

Practicar la conversión entre Signals y Observables usando `toSignal` y `toObservable`.

## Tiempo Estimado

60 minutos

---

## Ejercicio 1: toSignal Básico

### Descripción

Crear un componente que cargue usuarios desde HTTP usando toSignal.

### Instrucciones

1. Crear el componente `src/app/features/users/pages/user-list/user-list.component.ts`
2. Usar `toSignal` para convertir el Observable HTTP a Signal
3. Mostrar los usuarios en el template

### Código Base

```typescript
// src/app/features/users/pages/user-list/user-list.component.ts
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';

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
      
      <!-- TODO: Mostrar usuarios -->
    </div>
  `
})
export class UserListComponent {
  private readonly http = inject(HttpClient);
  
  // TODO: Usar toSignal para cargar usuarios
}
```

### Solución

```typescript
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
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
        <ul class="space-y-2">
          @for (user of users; track user.id) {
            <li class="p-3 bg-gray-100 rounded">
              <span class="font-medium">{{ user.name }}</span>
              <span class="text-gray-500 ml-2">{{ user.email }}</span>
            </li>
          }
        </ul>
      } @else {
        <p class="text-gray-500">Cargando usuarios...</p>
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

## Ejercicio 2: toSignal con Valor Inicial

### Descripción

Crear un servicio que cargue productos con valor inicial y manejo de errores.

### Instrucciones

1. Crear el servicio `src/app/features/products/services/product.service.ts`
2. Usar `toSignal` con valor inicial
3. Manejar errores apropiadamente

### Código Base

```typescript
// src/app/features/products/services/product.service.ts
import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  
  // TODO: Cargar productos con toSignal
  // TODO: Agregar Signal para categoría seleccionada
  // TODO: Crear computed para productos filtrados
}
```

### Solución

```typescript
import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  
  // Filtro local
  selectedCategory = signal<string | null>(null);
  
  // Productos desde HTTP
  products = toSignal(
    this.http.get<Product[]>('/api/products').pipe(
      catchError(error => {
        console.error('Error loading products:', error);
        return of([]);
      })
    ),
    { initialValue: [] }
  );
  
  // Productos filtrados
  filteredProducts = computed(() => {
    const category = this.selectedCategory();
    const products = this.products();
    
    if (!category) return products;
    
    return products.filter(p => p.category === category);
  });
  
  // Categorías únicas
  categories = computed(() => {
    const products = this.products();
    return [...new Set(products.map(p => p.category))];
  });
  
  // Estadísticas
  stats = computed(() => {
    const products = this.filteredProducts();
    
    return {
      total: products.length,
      totalPrice: products.reduce((sum, p) => sum + p.price, 0),
      averagePrice: products.length > 0 
        ? products.reduce((sum, p) => sum + p.price, 0) / products.length 
        : 0
    };
  });
  
  // Métodos
  setCategory(category: string | null): void {
    this.selectedCategory.set(category);
  }
}
```

---

## Ejercicio 3: toObservable Básico

### Descripción

Crear un componente de búsqueda que use toObservable para debounce.

### Instrucciones

1. Crear el componente `src/app/features/search/pages/search/search.component.ts`
2. Usar `toObservable` para convertir Signal a Observable
3. Aplicar debounceTime y switchMap

### Código Base

```typescript
// src/app/features/search/pages/search/search.component.ts
import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

interface SearchResult {
  id: number;
  title: string;
  description: string;
}

@Component({
  selector: 'app-search',
  standalone: true,
  template: `
    <div class="p-6">
      <input 
        type="text"
        placeholder="Buscar..."
        class="w-full p-3 border rounded mb-4"
        (input)="searchTerm.set($any($event.target).value)"
      />
      
      <!-- TODO: Mostrar resultados -->
    </div>
  `
})
export class SearchComponent {
  private readonly http = inject(HttpClient);
  
  searchTerm = signal('');
  
  // TODO: Usar toObservable con debounce
}
```

### Solución

```typescript
import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, filter, switchMap, catchError, of } from 'rxjs';

interface SearchResult {
  id: number;
  title: string;
  description: string;
}

@Component({
  selector: 'app-search',
  standalone: true,
  template: `
    <div class="p-6">
      <input 
        type="text"
        placeholder="Buscar..."
        class="w-full p-3 border rounded mb-4"
        (input)="searchTerm.set($any($event.target).value)"
      />
      
      @if (isLoading()) {
        <p class="text-gray-500">Buscando...</p>
      }
      
      @for (result of searchResults(); track result.id) {
        <div class="p-3 border-b">
          <h3 class="font-medium">{{ result.title }}</h3>
          <p class="text-sm text-gray-500">{{ result.description }}</p>
        </div>
      } @empty {
        @if (searchTerm().length >= 2) {
          <p class="text-gray-500">No se encontraron resultados</p>
        }
      }
    </div>
  `
})
export class SearchComponent {
  private readonly http = inject(HttpClient);
  
  // Signal para el término de búsqueda
  searchTerm = signal('');
  
  // Signal para estado de carga
  isLoading = signal(false);
  
  // Signal → Observable con operadores RxJS
  private searchResults$ = toObservable(this.searchTerm).pipe(
    debounceTime(300),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    switchMap(term => {
      this.isLoading.set(true);
      return this.http.get<SearchResult[]>(`/api/search?q=${term}`).pipe(
        catchError(() => of([])),
        // Note: finalize no funciona bien con toSignal
      );
    })
  );
  
  // Observable → Signal
  searchResults = toSignal(this.searchResults$, { initialValue: [] as SearchResult[] });
  
  constructor() {
    // Effect para actualizar loading
    effect(() => {
      if (this.searchResults().length >= 0) {
        this.isLoading.set(false);
      }
    });
  }
}
```

---

## Ejercicio 4: Combinando toSignal y toObservable

### Descripción

Crear un flujo completo de búsqueda con filtros.

### Instrucciones

1. Crear un servicio de búsqueda con estado híbrido
2. Usar toObservable para el término de búsqueda
3. Usar toSignal para los resultados

### Solución

```typescript
// src/app/features/search/services/search.service.ts
import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap, catchError, of, map } from 'rxjs';

interface SearchResult {
  id: number;
  title: string;
  category: string;
  price: number;
}

interface SearchFilters {
  category: string | null;
  minPrice: number;
  maxPrice: number;
}

@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly http = inject(HttpClient);
  
  // Estado con Signals
  searchTerm = signal('');
  filters = signal<SearchFilters>({
    category: null,
    minPrice: 0,
    maxPrice: Infinity
  });
  
  // Signal → Observable para búsqueda
  private search$ = toObservable(this.searchTerm).pipe(
    debounceTime(300),
    distinctUntilChanged(),
    filter(term => term.length >= 2)
  );
  
  // Observable con switchMap para HTTP
  private results$ = this.search$.pipe(
    switchMap(term => 
      this.http.get<SearchResult[]>(`/api/search?q=${term}`).pipe(
        catchError(() => of([]))
      )
    )
  );
  
  // Observable → Signal
  rawResults = toSignal(this.results$, { initialValue: [] as SearchResult[] });
  
  // Computed con filtros aplicados
  results = computed(() => {
    const filters = this.filters();
    const results = this.rawResults();
    
    return results.filter(result => {
      // Filtro por categoría
      if (filters.category && result.category !== filters.category) {
        return false;
      }
      
      // Filtro por precio
      if (result.price < filters.minPrice || result.price > filters.maxPrice) {
        return false;
      }
      
      return true;
    });
  });
  
  // Categorías disponibles
  categories = computed(() => {
    const results = this.rawResults();
    return [...new Set(results.map(r => r.category))];
  });
  
  // Métodos
  setCategory(category: string | null): void {
    this.filters.update(f => ({ ...f, category }));
  }
  
  setPriceRange(min: number, max: number): void {
    this.filters.update(f => ({ ...f, minPrice: min, maxPrice: max }));
  }
  
  clearFilters(): void {
    this.filters.set({
      category: null,
      minPrice: 0,
      maxPrice: Infinity
    });
  }
}
```

---

## Ejercicio 5: Effect con toObservable

### Descripción

Sincronizar estado con localStorage usando effects.

### Instrucciones

1. Crear un servicio de configuración con persistencia
2. Usar effect para sincronizar con localStorage
3. Cargar estado inicial desde localStorage

### Solución

```typescript
// src/app/core/services/settings.service.ts
import { Injectable, signal, effect } from '@angular/core';

interface AppSettings {
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
  sidebarCollapsed: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  language: 'es',
  notifications: true,
  sidebarCollapsed: false
};

const STORAGE_KEY = 'app_settings';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  // Estado con Signal
  settings = signal<AppSettings>(this.loadFromStorage());
  
  // Computed signals para acceso fácil
  theme = computed(() => this.settings().theme);
  language = computed(() => this.settings().language);
  notifications = computed(() => this.settings().notifications);
  sidebarCollapsed = computed(() => this.settings().sidebarCollapsed);
  
  constructor() {
    // Effect para sincronizar con localStorage
    effect(() => {
      const settings = this.settings();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      
      // Aplicar tema al documento
      document.documentElement.classList.toggle('dark', settings.theme === 'dark');
    });
  }
  
  // Cargar desde localStorage
  private loadFromStorage(): AppSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
    return DEFAULT_SETTINGS;
  }
  
  // Métodos
  setTheme(theme: 'light' | 'dark'): void {
    this.settings.update(s => ({ ...s, theme }));
  }
  
  toggleTheme(): void {
    this.settings.update(s => ({
      ...s,
      theme: s.theme === 'light' ? 'dark' : 'light'
    }));
  }
  
  setLanguage(language: string): void {
    this.settings.update(s => ({ ...s, language }));
  }
  
  toggleNotifications(): void {
    this.settings.update(s => ({ ...s, notifications: !s.notifications }));
  }
  
  toggleSidebar(): void {
    this.settings.update(s => ({ ...s, sidebarCollapsed: !s.sidebarCollapsed }));
  }
  
  resetToDefaults(): void {
    this.settings.set(DEFAULT_SETTINGS);
  }
}
```

---

## Reto Final: Dashboard con Estado Híbrido

### Descripción

Implementar un dashboard que combine datos de múltiples fuentes.

### Requisitos

1. Cargar usuarios, órdenes y estadísticas con toSignal
2. Filtros con Signals
3. Computed que combine todo
4. Effect para logging

### Solución

```typescript
// src/app/features/dashboard/services/dashboard.service.ts
import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';

interface User {
  id: number;
  name: string;
  department: string;
}

interface Order {
  id: number;
  userId: number;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  activeUsers: number;
}

interface DashboardFilters {
  department: string | null;
  status: string;
  dateRange: { start: Date; end: Date } | null;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  
  // Filtros
  filters = signal<DashboardFilters>({
    department: null,
    status: 'all',
    dateRange: null
  });
  
  // Datos desde HTTP
  users = toSignal(
    this.http.get<User[]>('/api/users').pipe(catchError(() => of([]))),
    { initialValue: [] }
  );
  
  orders = toSignal(
    this.http.get<Order[]>('/api/orders').pipe(catchError(() => of([]))),
    { initialValue: [] }
  );
  
  stats = toSignal(
    this.http.get<Stats>('/api/stats').pipe(catchError(() => of(null))),
    { initialValue: null }
  );
  
  // Computed: órdenes filtradas
  filteredOrders = computed(() => {
    const orders = this.orders();
    const filters = this.filters();
    const users = this.users();
    
    let filtered = orders;
    
    // Filtrar por estado
    if (filters.status !== 'all') {
      filtered = filtered.filter(o => o.status === filters.status);
    }
    
    // Filtrar por fecha
    if (filters.dateRange) {
      filtered = filtered.filter(o => {
        const date = new Date(o.createdAt);
        return date >= filters.dateRange!.start && date <= filters.dateRange!.end;
      });
    }
    
    // Filtrar por departamento
    if (filters.department) {
      const deptUserIds = users
        .filter(u => u.department === filters.department)
        .map(u => u.id);
      filtered = filtered.filter(o => deptUserIds.includes(o.userId));
    }
    
    return filtered;
  });
  
  // Computed: estadísticas filtradas
  filteredStats = computed(() => {
    const orders = this.filteredOrders();
    
    return {
      total: orders.length,
      revenue: orders.reduce((sum, o) => sum + o.total, 0),
      pending: orders.filter(o => o.status === 'pending').length,
      completed: orders.filter(o => o.status === 'completed').length
    };
  });
  
  // Computed: departamentos únicos
  departments = computed(() => {
    const users = this.users();
    return [...new Set(users.map(u => u.department))];
  });
  
  // Effect para logging
  constructor() {
    effect(() => {
      console.log('Dashboard updated:', {
        filters: this.filters(),
        ordersCount: this.filteredOrders().length,
        stats: this.filteredStats()
      });
    });
  }
  
  // Métodos
  setDepartment(department: string | null): void {
    this.filters.update(f => ({ ...f, department }));
  }
  
  setStatus(status: string): void {
    this.filters.update(f => ({ ...f, status }));
  }
  
  setDateRange(start: Date, end: Date): void {
    this.filters.update(f => ({ ...f, dateRange: { start, end } }));
  }
  
  clearFilters(): void {
    this.filters.set({
      department: null,
      status: 'all',
      dateRange: null
    });
  }
}
```

---

## Criterios de Evaluación

| Criterio | Puntos |
|----------|--------|
| Ejercicio 1: toSignal básico | 20 pts |
| Ejercicio 2: toSignal con valor inicial | 20 pts |
| Ejercicio 3: toObservable básico | 20 pts |
| Ejercicio 4: Combinación completa | 20 pts |
| Ejercicio 5: Effect con persistencia | 20 pts |
| **Total** | **100 pts** |

---

*Lab 01 - Día 12 - Curso Angular 21 - UyuniAdmin Frontend*
