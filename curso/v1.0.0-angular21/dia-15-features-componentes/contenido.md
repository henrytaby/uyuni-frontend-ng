# Día 15: Contenido Detallado - Features y Componentes

## 1. Arquitectura de Features (45 min)

### 1.1 Hook: El Problema de los Componentes Monolíticos

**Situación:** Tienes un componente de 800 líneas que maneja todo: UI, lógica de negocio, llamadas HTTP, estado, y navegación. Un cambio rompe tres cosas diferentes.

**Problema real:** Los componentes monolíticos son:
- **Difíciles de mantener**: Un cambio afecta múltiples responsabilidades
- **Imposibles de testear**: Demasiadas dependencias
- **No reutilizables**: Lógica acoplada a UI específica
- **Difíciles de entender**: Demasiado código en un lugar

**Solución:** Separar en Smart Components (pages) y Dumb Components (UI), con servicios para la lógica.

---

### 1.2 Contexto: Estructura de un Feature

Un feature en UyuniAdmin sigue esta estructura:

```
feature/
├── pages/                    # Smart Components
│   ├── list/
│   │   ├── list.component.ts
│   │   └── list.component.html
│   └── detail/
│       ├── detail.component.ts
│       └── detail.component.html
├── components/               # Dumb Components
│   ├── item-card/
│   └── item-form/
├── services/                 # Feature Services
│   └── feature.service.ts
├── models/                   # Domain Models
│   └── feature.models.ts
└── feature.routes.ts         # Routing
```

**Principios clave:**
- **Pages** contienen lógica de negocio y coordinación
- **Components** son puros de presentación, sin lógica de negocio
- **Services** encapsulan llamadas HTTP y lógica de datos
- **Models** definen tipos y interfaces del dominio

---

### 1.3 Explicación: Smart vs Dumb Components

#### Smart Components (Pages)

| Característica | Descripción |
|----------------|-------------|
| **Propósito** | Coordinar lógica de negocio |
| **Dependencias** | Servicios, Router, Store |
| **Estado** | Manejan estado con Signals |
| **Routing** | Son routables (tienen ruta) |
| **Ejemplos** | UserListPage, UserDetailPage |

```typescript
// Smart Component - Page
@Component({
  selector: 'app-user-list-page',
  standalone: true,
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-6">Usuarios</h1>
      
      <!-- Usa dumb components -->
      <app-user-filter 
        (filterChange)="onFilterChange($event)" />
      
      @if (isLoading()) {
        <app-loading-spinner />
      } @else {
        <app-user-list 
          [users]="users()"
          (userSelect)="onUserSelect($event)" />
      }
    </div>
  `
})
export class UserListPageComponent {
  // Inyecta servicios
  private userService = inject(UserService);
  private router = inject(Router);
  
  // Estado con Signals
  users = signal<User[]>([]);
  isLoading = signal(true);
  filter = signal<UserFilter>({} as UserFilter);
  
  // Lógica de negocio
  ngOnInit(): void {
    this.loadUsers();
  }
  
  loadUsers(): void {
    this.isLoading.set(true);
    this.userService.getUsers(this.filter())
      .subscribe({
        next: (data) => {
          this.users.set(data);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error loading users', err);
          this.isLoading.set(false);
        }
      });
  }
  
  onFilterChange(filter: UserFilter): void {
    this.filter.set(filter);
    this.loadUsers();
  }
  
  onUserSelect(user: User): void {
    this.router.navigate(['/users', user.id]);
  }
}
```

#### Dumb Components (UI)

| Característica | Descripción |
|----------------|-------------|
| **Propósito** | Presentación pura |
| **Dependencias** | Sin servicios, solo Input/Output |
| **Estado** | Solo estado local de UI |
| **Routing** | No son routables |
| **Ejemplos** | UserCard, UserForm, UserFilter |

```typescript
// Dumb Component - UI
@Component({
  selector: 'app-user-list',
  standalone: true,
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      @for (user of users(); track user.id) {
        <app-user-card 
          [user]="user"
          (click)="onUserClick.emit(user)" />
      }
    </div>
  `
})
export class UserListComponent {
  // Solo Input/Output, sin servicios
  users = input.required<User[]>();
  userClick = output<User>();
  
  // Sin lógica de negocio
}
```

---

### 1.4 Demo: Estructura del Feature Dashboard

Veamos el feature dashboard de UyuniAdmin:

```
dashboard/
├── pages/
│   └── overview/
│       ├── overview.component.ts
│       └── overview.component.html
├── components/
│   ├── ecommerce-metrics/
│   ├── monthly-sales-chart/
│   └── monthly-target/
└── dashboard.routes.ts
```

**OverviewComponent (Smart):**
```typescript
@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [
    EcommerceMetricsComponent,
    MonthlySalesChartComponent,
    MonthlyTargetComponent
  ],
  template: `
    <div class="p-6">
      <app-ecommerce-metrics [metrics]="metrics()" />
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <app-monthly-sales-chart [data]="salesData()" />
        <app-monthly-target [target]="target()" />
      </div>
    </div>
  `
})
export class OverviewComponent {
  private dashboardService = inject(DashboardService);
  
  metrics = signal<DashboardMetrics | null>(null);
  salesData = signal<SalesData[]>([]);
  target = signal<Target | null>(null);
  
  constructor() {
    this.loadDashboardData();
  }
  
  private loadDashboardData(): void {
    forkJoin({
      metrics: this.dashboardService.getMetrics(),
      sales: this.dashboardService.getSalesData(),
      target: this.dashboardService.getTarget()
    }).subscribe({
      next: ({ metrics, sales, target }) => {
        this.metrics.set(metrics);
        this.salesData.set(sales);
        this.target.set(target);
      }
    });
  }
}
```

---

### 1.5 Error Común: Lógica en Dumb Components

```typescript
// ❌ ERROR: Lógica de negocio en dumb component
@Component({
  template: `
    <div (click)="loadUserDetails()">
      {{ user().name }}
    </div>
  `
})
export class UserCardComponent {
  private userService = inject(UserService); // ❌ No inyectar servicios
  private router = inject(Router); // ❌ No usar router
  
  user = input.required<User>();
  
  loadUserDetails(): void {
    this.userService.getUser(this.user().id).subscribe(...); // ❌ Lógica de negocio
    this.router.navigate(['/users', this.user().id]); // ❌ Navegación
  }
}

// ✅ CORRECTO: Dumb component puro
@Component({
  template: `
    <div (click)="onCardClick.emit(user())">
      {{ user().name }}
    </div>
  `
})
export class UserCardComponent {
  user = input.required<User>();
  cardClick = output<User>(); // ✅ Solo emite eventos
}
```

---

### 1.6 Mini Reto: Identificar Smart vs Dumb

**Objetivo:** Dado el siguiente código, identificar qué componentes son Smart y cuáles son Dumb.

```typescript
// Componente A
@Component({ ... })
export class ProductListComponent {
  private productService = inject(ProductService);
  products = signal<Product[]>([]);
  
  ngOnInit() {
    this.productService.getProducts().subscribe(p => this.products.set(p));
  }
}

// Componente B
@Component({ ... })
export class ProductCardComponent {
  product = input.required<Product>();
  cardClick = output<Product>();
}

// Componente C
@Component({ ... })
export class ProductFilterComponent {
  filter = model<ProductFilter>({});
  filterChange = output<ProductFilter>();
}
```

**Solución:**
- **Componente A (Smart)**: Inyecta servicio, maneja estado, hace llamadas HTTP
- **Componente B (Dumb)**: Solo Input/Output, sin dependencias
- **Componente C (Dumb)**: Solo maneja estado local de UI, sin servicios

---

### 1.7 Cierre de Sección

**Resumen:**
- Features tienen estructura clara: pages, components, services, models
- Smart Components (pages) manejan lógica de negocio
- Dumb Components (UI) son puros de presentación
- La separación mejora mantenibilidad y testabilidad

**Próximo paso:** Crear Smart Components en detalle.

---

## 2. Smart Components - Pages (60 min)

### 2.1 Hook: La Página que Hace Demasiado

**Situación:** Necesitas crear una página de listado de usuarios. ¿Pones todo en un componente?

---

### 2.2 Contexto: Responsabilidades de una Page

Una Page es responsable de:

| Responsabilidad | Descripción |
|-----------------|-------------|
| **Coordinación** | Orquestar componentes hijos |
| **Estado** | Manejar estado con Signals |
| **Datos** | Cargar datos desde servicios |
| **Navegación** | Manejar routing |
| **Eventos** | Responder a eventos de hijos |

---

### 2.3 Explicación: Crear una Page

#### Estructura base

```typescript
@Component({
  selector: 'app-user-list-page',
  standalone: true,
  imports: [
    CommonModule,
    UserListComponent,
    UserFilterComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './user-list-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListPageComponent implements OnInit {
  // 1. Inyección de dependencias
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private logger = inject(LoggerService);
  
  // 2. Estado con Signals
  users = signal<User[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  filter = signal<UserFilter>(this.getDefaultFilter());
  
  // 3. Computed signals
  filteredUsers = computed(() => {
    const currentFilter = this.filter();
    const allUsers = this.users();
    
    return allUsers.filter(user => {
      if (currentFilter.status && user.status !== currentFilter.status) return false;
      if (currentFilter.search && !user.name.toLowerCase().includes(currentFilter.search.toLowerCase())) return false;
      return true;
    });
  });
  
  // 4. Lifecycle
  ngOnInit(): void {
    this.loadUsers();
    this.subscribeToQueryParams();
  }
  
  // 5. Métodos públicos
  onFilterChange(filter: UserFilter): void {
    this.filter.set(filter);
    this.updateQueryParams(filter);
  }
  
  onUserSelect(user: User): void {
    this.router.navigate(['/users', user.id]);
  }
  
  onUserEdit(user: User): void {
    this.router.navigate(['/users', user.id, 'edit']);
  }
  
  onUserDelete(user: User): void {
    this.deleteUser(user);
  }
  
  // 6. Métodos privados
  private loadUsers(): void {
    this.isLoading.set(true);
    this.error.set(null);
    
    this.userService.getUsers().pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: (users) => {
        this.users.set(users);
        this.logger.info('Users loaded', { count: users.length });
      },
      error: (err) => {
        this.error.set('Error al cargar usuarios');
        this.logger.error('Failed to load users', err);
      }
    });
  }
  
  private deleteUser(user: User): void {
    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.users.update(users => users.filter(u => u.id !== user.id));
        this.logger.info('User deleted', { userId: user.id });
      },
      error: (err) => {
        this.logger.error('Failed to delete user', err);
      }
    });
  }
  
  private subscribeToQueryParams(): void {
    this.route.queryParams.pipe(
      map(params => this.parseFilterFromParams(params))
    ).subscribe(filter => {
      this.filter.set(filter);
    });
  }
  
  private updateQueryParams(filter: UserFilter): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: filter,
      queryParamsHandling: 'merge'
    });
  }
  
  private getDefaultFilter(): UserFilter {
    return {
      status: undefined,
      search: ''
    };
  }
  
  private parseFilterFromParams(params: Params): UserFilter {
    return {
      status: params['status'] || undefined,
      search: params['search'] || ''
    };
  }
}
```

---

### 2.4 Demo: Page con PrimeNG Table

```typescript
@Component({
  selector: 'app-user-list-page',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule
  ],
  template: `
    <div class="p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Usuarios</h1>
        <p-button 
          label="Nuevo Usuario" 
          icon="pi pi-plus"
          (onClick)="onCreateUser()" />
      </div>
      
      <!-- Filters -->
      <div class="flex gap-4 mb-6">
        <input 
          pInputText 
          type="text" 
          placeholder="Buscar..."
          [ngModel]="filter().search"
          (ngModelChange)="onSearchChange($event)"
          class="w-64" />
        
        <p-dropdown 
          [options]="statusOptions"
          [(ngModel)]="statusFilter"
          placeholder="Estado"
          (onChange)="onStatusChange($event)"
          optionLabel="label"
          optionValue="value" />
      </div>
      
      <!-- Table -->
      <p-table 
        [value]="filteredUsers()"
        [loading]="isLoading()"
        [paginator]="true"
        [rows]="10"
        [totalRecords]="filteredUsers().length"
        [rowsPerPageOptions]="[10, 20, 50]"
        styleClass="p-datatable-sm">
        
        <ng-template pTemplate="header">
          <tr>
            <th pSortableColumn="name">Nombre</th>
            <th pSortableColumn="email">Email</th>
            <th pSortableColumn="status">Estado</th>
            <th>Acciones</th>
          </tr>
        </ng-template>
        
        <ng-template pTemplate="body" let-user>
          <tr>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>
              <p-tag 
                [value]="user.status"
                [severity]="user.status === 'active' ? 'success' : 'danger'" />
            </td>
            <td>
              <p-button 
                icon="pi pi-eye"
                styleClass="p-button-text p-button-sm"
                (onClick)="onUserSelect(user)" />
              <p-button 
                icon="pi pi-pencil"
                styleClass="p-button-text p-button-sm"
                (onClick)="onUserEdit(user)" />
              <p-button 
                icon="pi pi-trash"
                styleClass="p-button-text p-button-sm p-button-danger"
                (onClick)="confirmDelete(user)" />
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `
})
export class UserListPageComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);
  private confirmationService = inject(ConfirmationService);
  
  users = signal<User[]>([]);
  isLoading = signal(true);
  filter = signal<UserFilter>({ search: '', status: undefined });
  
  statusFilter: string | undefined;
  
  statusOptions = [
    { label: 'Todos', value: undefined },
    { label: 'Activos', value: 'active' },
    { label: 'Inactivos', value: 'inactive' }
  ];
  
  filteredUsers = computed(() => {
    const { search, status } = this.filter();
    return this.users().filter(user => {
      if (status && user.status !== status) return false;
      if (search && !user.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  });
  
  ngOnInit(): void {
    this.loadUsers();
  }
  
  private loadUsers(): void {
    this.isLoading.set(true);
    this.userService.getUsers().pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: (users) => this.users.set(users),
      error: (err) => console.error('Error loading users', err)
    });
  }
  
  onSearchChange(search: string): void {
    this.filter.update(f => ({ ...f, search }));
  }
  
  onStatusChange(event: any): void {
    this.filter.update(f => ({ ...f, status: event.value }));
  }
  
  onUserSelect(user: User): void {
    this.router.navigate(['/users', user.id]);
  }
  
  onUserEdit(user: User): void {
    this.router.navigate(['/users', user.id, 'edit']);
  }
  
  onCreateUser(): void {
    this.router.navigate(['/users', 'new']);
  }
  
  confirmDelete(user: User): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar a ${user.name}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteUser(user)
    });
  }
  
  private deleteUser(user: User): void {
    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.users.update(users => users.filter(u => u.id !== user.id));
      }
    });
  }
}
```

---

### 2.5 Error Común: Estado Mutable

```typescript
// ❌ ERROR: Mutar el estado directamente
this.users().push(newUser); // No funciona con signals

// ✅ CORRECTO: Usar update o set
this.users.update(users => [...users, newUser]);

// ❌ ERROR: Mutar objeto en signal
this.filter().search = 'test'; // No dispara cambios

// ✅ CORRECTO: Crear nuevo objeto
this.filter.update(f => ({ ...f, search: 'test' }));
```

---

### 2.6 Mini Reto: Crear User Detail Page

**Objetivo:** Crear una página de detalle de usuario que:
1. Cargue el usuario desde el servicio usando el ID de la ruta
2. Muestre la información del usuario
3. Permita navegar a edición
4. Maneje estados de carga y error

**Solución:**

```typescript
@Component({
  selector: 'app-user-detail-page',
  standalone: true,
  template: `
    <div class="p-6">
      @if (isLoading()) {
        <app-loading-spinner />
      } @else if (error()) {
        <app-error-message [message]="error()" />
      } @else if (user()) {
        <div class="max-w-2xl mx-auto">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex justify-between items-start mb-6">
              <h1 class="text-2xl font-bold">{{ user()!.name }}</h1>
              <div class="flex gap-2">
                <p-button 
                  icon="pi pi-pencil"
                  label="Editar"
                  (onClick)="onEdit()" />
                <p-button 
                  icon="pi pi-arrow-left"
                  label="Volver"
                  styleClass="p-button-secondary"
                  (onClick)="onBack()" />
              </div>
            </div>
            
            <div class="space-y-4">
              <div>
                <label class="text-sm text-gray-500">Email</label>
                <p class="text-lg">{{ user()!.email }}</p>
              </div>
              <div>
                <label class="text-sm text-gray-500">Estado</label>
                <p-tag 
                  [value]="user()!.status"
                  [severity]="user()!.status === 'active' ? 'success' : 'danger'" />
              </div>
              <div>
                <label class="text-sm text-gray-500">Fecha de registro</label>
                <p class="text-lg">{{ user()!.createdAt | date:'medium' }}</p>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class UserDetailPageComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  
  user = signal<User | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);
  
  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.loadUser(userId);
    } else {
      this.error.set('ID de usuario no válido');
      this.isLoading.set(false);
    }
  }
  
  private loadUser(id: string): void {
    this.isLoading.set(true);
    this.userService.getUser(id).pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: (user) => this.user.set(user),
      error: (err) => {
        this.error.set('Error al cargar el usuario');
        console.error(err);
      }
    });
  }
  
  onEdit(): void {
    this.router.navigate(['/users', this.user()!.id, 'edit']);
  }
  
  onBack(): void {
    this.router.navigate(['/users']);
  }
}
```

---

### 2.7 Cierre de Sección

**Resumen:**
- Pages son Smart Components que coordinan lógica
- Usan Signals para estado reactivo
- Inyectan servicios y Router
- Manejan eventos de componentes hijos
- Siguen patrón consistente: estado, lifecycle, métodos

**Próximo paso:** Crear Dumb Components.

---

## 3. Dumb Components - UI Components (60 min)

### 3.1 Hook: El Componente que Nadie Reutiliza

**Situación:** Creaste un componente de tarjeta de usuario. Meses después, necesitas la misma tarjeta en otra página, pero tiene hardcoded el servicio de usuarios y la navegación. No puedes reutilizarlo.

---

### 3.2 Contexto: Principios de Dumb Components

| Principio | Descripción |
|-----------|-------------|
| **Sin servicios** | No inyectar servicios de negocio |
| **Solo Input/Output** | Comunicación por signals |
| **Estado local mínimo** | Solo estado de UI (hover, focus) |
| **Sin efectos secundarios** | No hacer llamadas HTTP |
| **Predecibles** | Mismo input = mismo output |

---

### 3.3 Explicación: Input/Output Signals

#### Input Signals

```typescript
@Component({
  selector: 'app-user-card',
  standalone: true,
  template: `
    <div class="bg-white rounded-lg shadow p-4">
      <img [src]="user().avatar" class="w-16 h-16 rounded-full" />
      <h3 class="text-lg font-semibold">{{ user().name }}</h3>
      <p class="text-gray-500">{{ user().email }}</p>
    </div>
  `
})
export class UserCardComponent {
  // Input requerido
  user = input.required<User>();
  
  // Input opcional con default
  showAvatar = input<boolean>(true);
  
  // Input con transform
  size = input<'sm' | 'md' | 'lg', 'md'>(value => value || 'md');
}
```

#### Output Signals

```typescript
@Component({
  selector: 'app-user-card',
  standalone: true,
  template: `
    <div 
      class="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-lg"
      (click)="onCardClick()">
      <!-- content -->
    </div>
  `
})
export class UserCardComponent {
  user = input.required<User>();
  
  // Output signal
  cardClick = output<User>();
  
  // Output con tipo específico
  deleteClick = output<string>();
  
  onCardClick(): void {
    this.cardClick.emit(this.user());
  }
}
```

#### Two-way Binding con model()

```typescript
@Component({
  selector: 'app-user-filter',
  standalone: true,
  template: `
    <input 
      pInputText
      [ngModel]="filter().search"
      (ngModelChange)="onSearchChange($event)" />
    
    <p-dropdown 
      [ngModel]="filter().status"
      (ngModelChange)="onStatusChange($event)" />
  `
})
export class UserFilterComponent {
  // model() crea un signal con two-way binding
  filter = model.required<UserFilter>();
  
  onSearchChange(search: string): void {
    this.filter.update(f => ({ ...f, search }));
  }
  
  onStatusChange(status: string): void {
    this.filter.update(f => ({ ...f, status }));
  }
}
```

---

### 3.4 Demo: Componentes de UI Comunes

#### UserCardComponent

```typescript
@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [TagModule, ButtonModule],
  template: `
    <div 
      class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 
             hover:shadow-lg transition-shadow cursor-pointer"
      [class.opacity-50]="user().status === 'inactive'"
      (click)="onCardClick()">
      
      <div class="flex items-start gap-4">
        @if (showAvatar()) {
          <img 
            [src]="user().avatar || '/assets/default-avatar.png'"
            [alt]="user().name"
            class="w-12 h-12 rounded-full object-cover" />
        }
        
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {{ user().name }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
            {{ user().email }}
          </p>
          
          <div class="mt-2">
            <p-tag 
              [value]="user().status === 'active' ? 'Activo' : 'Inactivo'"
              [severity]="user().status === 'active' ? 'success' : 'danger'" />
          </div>
        </div>
        
        @if (showActions()) {
          <div class="flex gap-1">
            <p-button 
              icon="pi pi-pencil"
              styleClass="p-button-text p-button-sm"
              (click)="onEditClick($event)" />
            <p-button 
              icon="pi pi-trash"
              styleClass="p-button-text p-button-sm p-button-danger"
              (click)="onDeleteClick($event)" />
          </div>
        }
      </div>
    </div>
  `
})
export class UserCardComponent {
  // Inputs
  user = input.required<User>();
  showAvatar = input<boolean>(true);
  showActions = input<boolean>(false);
  
  // Outputs
  cardClick = output<User>();
  editClick = output<User>();
  deleteClick = output<User>();
  
  onCardClick(): void {
    this.cardClick.emit(this.user());
  }
  
  onEditClick(event: Event): void {
    event.stopPropagation(); // Prevenir propagación al card
    this.editClick.emit(this.user());
  }
  
  onDeleteClick(event: Event): void {
    event.stopPropagation();
    this.deleteClick.emit(this.user());
  }
}
```

#### UserFormComponent

```typescript
@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    ButtonModule
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-2">Nombre</label>
        <input 
          pInputText 
          formControlName="name"
          class="w-full"
          [class.ng-invalid]="form.get('name')?.invalid && form.get('name')?.touched" />
        @if (form.get('name')?.invalid && form.get('name')?.touched) {
          <small class="text-red-500">El nombre es requerido</small>
        }
      </div>
      
      <div>
        <label class="block text-sm font-medium mb-2">Email</label>
        <input 
          pInputText 
          formControlName="email"
          type="email"
          class="w-full" />
      </div>
      
      <div>
        <label class="block text-sm font-medium mb-2">Estado</label>
        <p-dropdown 
          formControlName="status"
          [options]="statusOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Seleccionar estado" />
      </div>
      
      <div class="flex justify-end gap-2 pt-4">
        <p-button 
          type="button"
          label="Cancelar"
          styleClass="p-button-secondary"
          (onClick)="onCancel.emit()" />
        <p-button 
          type="submit"
          label="Guardar"
          [loading]="submitting()"
          [disabled]="form.invalid" />
      </div>
    </form>
  `
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  
  // Inputs
  user = input<User | null>(null);
  submitting = input<boolean>(false);
  
  // Outputs
  submit = output<FormData>();
  cancel = output<void>();
  
  form!: FormGroup;
  
  statusOptions = [
    { label: 'Activo', value: 'active' },
    { label: 'Inactivo', value: 'inactive' }
  ];
  
  ngOnInit(): void {
    this.initForm();
  }
  
  private initForm(): void {
    const userData = this.user();
    
    this.form = this.fb.group({
      name: [userData?.name || '', Validators.required],
      email: [userData?.email || '', [Validators.required, Validators.email]],
      status: [userData?.status || 'active', Validators.required]
    });
  }
  
  onSubmit(): void {
    if (this.form.valid) {
      this.submit.emit(this.form.value);
    }
  }
}
```

---

### 3.5 Error Común: Efectos Secundarios en Dumb Components

```typescript
// ❌ ERROR: Llamada HTTP en dumb component
@Component({ ... })
export class UserCardComponent {
  private userService = inject(UserService); // ❌
  
  user = input.required<User>();
  
  constructor() {
    // ❌ Efecto secundario en dumb component
    effect(() => {
      this.userService.logView(this.user().id).subscribe();
    });
  }
}

// ✅ CORRECTO: El padre maneja el efecto secundario
// En el smart component:
@Component({ ... })
export class UserListPageComponent {
  constructor() {
    effect(() => {
      const user = this.selectedUser();
      if (user) {
        this.userService.logView(user.id).subscribe();
      }
    });
  }
}
```

---

### 3.6 Mini Reto: Crear UserStatsComponent

**Objetivo:** Crear un componente de estadísticas de usuario que:
1. Reciba un usuario por Input
2. Muestre estadísticas (posts, comentarios, likes)
3. Sea completamente reusable
4. No tenga dependencias de servicios

**Solución:**

```typescript
export interface UserStats {
  posts: number;
  comments: number;
  likes: number;
}

@Component({
  selector: 'app-user-stats',
  standalone: true,
  template: `
    <div class="grid grid-cols-3 gap-4">
      <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ stats().posts }}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400">Posts</p>
      </div>
      
      <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ stats().comments }}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400">Comentarios</p>
      </div>
      
      <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ stats().likes }}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400">Likes</p>
      </div>
    </div>
  `
})
export class UserStatsComponent {
  stats = input.required<UserStats>();
}
```

---

### 3.7 Cierre de Sección

**Resumen:**
- Dumb Components son puros de presentación
- Usan input() para recibir datos
- Usan output() para emitir eventos
- Usan model() para two-way binding
- No tienen efectos secundarios

**Próximo paso:** Feature Services.

---

## 4. Feature Services (45 min)

### 4.1 Hook: Lógica Duplicada en Componentes

**Situación:** Tres componentes diferentes necesitan cargar usuarios. Cada uno tiene su propia llamada HTTP con manejo de errores duplicado.

---

### 4.2 Contexto: Responsabilidades de Feature Services

| Responsabilidad | Descripción |
|-----------------|-------------|
| **HTTP calls** | Llamadas a API del feature |
| **Data transformation** | Transformar respuestas |
| **Caching** | Cache de datos frecuentes |
| **Error handling** | Manejo centralizado de errores |
| **State management** | Estado compartido del feature |

---

### 4.3 Explicación: Crear un Feature Service

```typescript
@Injectable({
  providedIn: 'root' // Singleton para todo el feature
})
export class UserService {
  private http = inject(HttpClient);
  private logger = inject(LoggerService);
  private configService = inject(ConfigService);
  
  // Cache de usuarios
  private usersCache = signal<User[] | null>(null);
  
  // API URL
  private apiUrl = this.configService.getApiUrl();
  
  /**
   * Obtiene todos los usuarios
   */
  getUsers(): Observable<User[]> {
    // Retornar cache si existe
    if (this.usersCache()) {
      return of(this.usersCache()!);
    }
    
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      tap(users => this.usersCache.set(users)),
      catchError(error => this.handleError('getUsers', error))
    );
  }
  
  /**
   * Obtiene un usuario por ID
   */
  getUser(id: string): Observable<User> {
    // Intentar obtener del cache primero
    const cached = this.usersCache()?.find(u => u.id === id);
    if (cached) {
      return of(cached);
    }
    
    return this.http.get<User>(`${this.apiUrl}/users/${id}`).pipe(
      catchError(error => this.handleError('getUser', error))
    );
  }
  
  /**
   * Crea un nuevo usuario
   */
  createUser(user: CreateUserRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, user).pipe(
      tap(newUser => {
        // Actualizar cache
        this.usersCache.update(users => 
          users ? [...users, newUser] : [newUser]
        );
        this.logger.info('User created', { userId: newUser.id });
      }),
      catchError(error => this.handleError('createUser', error))
    );
  }
  
  /**
   * Actualiza un usuario
   */
  updateUser(id: string, user: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, user).pipe(
      tap(updatedUser => {
        // Actualizar cache
        this.usersCache.update(users => 
          users?.map(u => u.id === id ? updatedUser : u) || null
        );
        this.logger.info('User updated', { userId: id });
      }),
      catchError(error => this.handleError('updateUser', error))
    );
  }
  
  /**
   * Elimina un usuario
   */
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`).pipe(
      tap(() => {
        // Actualizar cache
        this.usersCache.update(users => 
          users?.filter(u => u.id !== id) || null
        );
        this.logger.info('User deleted', { userId: id });
      }),
      catchError(error => this.handleError('deleteUser', error))
    );
  }
  
  /**
   * Invalida el cache
   */
  invalidateCache(): void {
    this.usersCache.set(null);
  }
  
  /**
   * Manejo centralizado de errores
   */
  private handleError(operation: string, error: HttpErrorResponse): Observable<never> {
    this.logger.error(`UserService.${operation} failed`, error);
    
    let errorMessage = 'Ha ocurrido un error';
    
    if (error.status === 404) {
      errorMessage = 'Usuario no encontrado';
    } else if (error.status === 401) {
      errorMessage = 'No autorizado';
    } else if (error.status === 0) {
      errorMessage = 'Error de conexión';
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
```

---

### 4.4 Demo: Servicio con Estado Compartido

```typescript
@Injectable({ providedIn: 'root' })
export class UserStateService {
  private userService = inject(UserService);
  
  // Estado compartido
  users = signal<User[]>([]);
  selectedUser = signal<User | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);
  
  // Computed signals
  activeUsers = computed(() => 
    this.users().filter(u => u.status === 'active')
  );
  
  userCount = computed(() => this.users().length);
  
  /**
   * Carga usuarios y actualiza estado
   */
  loadUsers(): void {
    this.isLoading.set(true);
    this.error.set(null);
    
    this.userService.getUsers().pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: (users) => this.users.set(users),
      error: (err) => this.error.set(err.message)
    });
  }
  
  /**
   * Selecciona un usuario
   */
  selectUser(user: User | null): void {
    this.selectedUser.set(user);
  }
  
  /**
   * Crea un usuario
   */
  createUser(data: CreateUserRequest): Observable<User> {
    return this.userService.createUser(data).pipe(
      tap(newUser => {
        this.users.update(users => [...users, newUser]);
      })
    );
  }
  
  /**
   * Actualiza un usuario
   */
  updateUser(id: string, data: UpdateUserRequest): Observable<User> {
    return this.userService.updateUser(id, data).pipe(
      tap(updatedUser => {
        this.users.update(users => 
          users.map(u => u.id === id ? updatedUser : u)
        );
        if (this.selectedUser()?.id === id) {
          this.selectedUser.set(updatedUser);
        }
      })
    );
  }
  
  /**
   * Elimina un usuario
   */
  deleteUser(id: string): Observable<void> {
    return this.userService.deleteUser(id).pipe(
      tap(() => {
        this.users.update(users => users.filter(u => u.id !== id));
        if (this.selectedUser()?.id === id) {
          this.selectedUser.set(null);
        }
      })
    );
  }
}
```

---

### 4.5 Error Común: Servicio con Estado Global Incorrecto

```typescript
// ❌ ERROR: Estado mutable sin signals
@Injectable({ providedIn: 'root' })
export class UserService {
  users: User[] = []; // ❌ No reactivo
  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users').pipe(
      tap(users => this.users = users) // ❌ No notifica cambios
    );
  }
}

// ✅ CORRECTO: Estado con signals
@Injectable({ providedIn: 'root' })
export class UserStateService {
  users = signal<User[]>([]); // ✅ Reactivo
  
  loadUsers(): void {
    this.http.get<User[]>('/api/users').pipe(
      tap(users => this.users.set(users)) // ✅ Notifica cambios
    ).subscribe();
  }
}
```

---

### 4.6 Mini Reto: Crear UserService Completo

**Objetivo:** Crear un UserService que:
1. Tenga métodos CRUD completos
2. Maneje cache con signals
3. Tenga manejo de errores centralizado
4. Use LoggerService para logging

**Solución:** Ver código en sección 4.3

---

### 4.7 Cierre de Sección

**Resumen:**
- Feature Services encapsulan lógica de datos
- Usan signals para estado reactivo
- Manejan cache y errores centralizadamente
- Son inyectados en Smart Components

**Próximo paso:** Integración completa.

---

## 5. Integración Completa (30 min)

### 5.1 Hook: El Feature que Funciona

**Situación:** Tienes todos los componentes y servicios. ¿Cómo los conectas?

---

### 5.2 Contexto: Flujo de Datos en Features

```
┌─────────────────────────────────────────────────────────────┐
│                        PAGE (Smart)                          │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Estado: users, isLoading, error                        │ │
│  │  Servicios: UserService, Router                         │ │
│  │  Eventos: onUserSelect, onUserDelete                    │ │
│  └─────────────────────────────────────────────────────────┘ │
│                           │                                   │
│                           ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              DUMB COMPONENTS                             │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │ │
│  │  │UserCard  │  │UserFilter│  │UserForm  │              │ │
│  │  │          │  │          │  │          │              │ │
│  │  │Input:    │  │Input:    │  │Input:    │              │ │
│  │  │ - user   │  │ - filter │  │ - user   │              │ │
│  │  │          │  │          │  │          │              │ │
│  │  │Output:   │  │Output:   │  │Output:   │              │ │
│  │  │ - click  │  │ - change │  │ - submit │              │ │
│  │  └──────────┘  └──────────┘  └──────────┘              │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    FEATURE SERVICE                           │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  - getUsers()                                           │ │
│  │  - getUser(id)                                          │ │
│  │  - createUser(data)                                     │ │
│  │  - updateUser(id, data)                                 │ │
│  │  - deleteUser(id)                                       │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      HTTP CLIENT                             │
│  GET /users                                                  │
│  GET /users/:id                                              │
│  POST /users                                                 │
│  PUT /users/:id                                              │
│  DELETE /users/:id                                           │
└─────────────────────────────────────────────────────────────┘
```

---

### 5.3 Explicación: Routing del Feature

```typescript
// users.routes.ts
import { Routes } from '@angular/router';

export const USER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/list/user-list-page.component').then(m => m.UserListPageComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/form/user-form-page.component').then(m => m.UserFormPageComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/detail/user-detail-page.component').then(m => m.UserDetailPageComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/form/user-form-page.component').then(m => m.UserFormPageComponent)
  }
];

// En app.routes.ts
{
  path: 'users',
  loadChildren: () => import('./features/users/users.routes').then(m => m.USER_ROUTES)
}
```

---

### 5.4 Demo: Feature Completo

Ver archivos del proyecto UyuniAdmin:
- [`src/app/features/dashboard/`](../../../src/app/features/dashboard/)
- [`src/app/features/auth/`](../../../src/app/features/auth/)
- [`src/app/features/profile/`](../../../src/app/features/profile/)

---

### 5.5 Cierre del Día

**Resumen General:**

| Sección | Conceptos Clave |
|---------|-----------------|
| Arquitectura | Estructura de feature, Smart vs Dumb |
| Smart Components | Pages, estado, servicios, routing |
| Dumb Components | Input/Output, presentación pura |
| Feature Services | CRUD, cache, errores |
| Integración | Flujo de datos, routing |

**Próximos Pasos:**
1. Completar los labs del día
2. Responder el assessment
3. Día 16: Integración Completa

---

*Contenido Detallado - Día 15 - Curso Angular 21 - UyuniAdmin Frontend*
