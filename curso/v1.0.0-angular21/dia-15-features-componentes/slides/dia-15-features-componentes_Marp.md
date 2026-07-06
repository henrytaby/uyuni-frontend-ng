# Slides: Día 15 - Features y Componentes

## Slide 1: Portada

```
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║     ███████╗ █████╗  ██████╗ ███████╗                         ║
║     ██╔════╝██╔══██╗██╔════╝ ██╔════╝                         ║
║     █████╗  ███████║██║  ███╗█████╗                           ║
║     ██╔══╝  ██╔══██║██║   ██║██╔══╝                           ║
║     ██║     ██║  ██║╚██████╔╝███████╗                         ║
║     ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚══════╝                         ║
║                                                                ║
║              & COMPONENTS                                      ║
║                                                                ║
║     ██████╗ ██████╗ ██████╗ ███████╗                          ║
║    ██╔════╝██╔═══██╗██╔══██╗██╔════╝                          ║
║    ██║     ██║   ██║██║  ██║█████╗                            ║
║    ██║     ██║   ██║██║  ██║██╔══╝                            ║
║    ╚██████╗╚██████╔╝██████╔╝███████╗                          ║
║     ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝                          ║
║                                                                ║
║              [Día 15 - Módulo 6: Features]                     ║
║                                                                ║
║     Curso Angular 21 - UyuniAdmin Frontend                     ║
║     Duración: 4 horas                                          ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- Bienvenida al día 15 del curso
- Este día es parte del Módulo 6: Features y Componentes
- Integraremos todo lo aprendido hasta ahora

---

## Slide 2: Agenda del Día

```
╔════════════════════════════════════════════════════════════════╗
║                        📋 AGENDA                               ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   1️⃣  Arquitectura de Features              [45 min]          ║
║       • Estructura de un feature                               ║
║       • Smart vs Dumb Components                               ║
║       • Separación de responsabilidades                        ║
║                                                                ║
║   2️⃣  Smart Components - Pages              [60 min]          ║
║       • Creación de páginas                                    ║
║       • Estado con Signals                                     ║
║       • Integración con servicios                              ║
║                                                                ║
║   3️⃣  Dumb Components - UI                  [60 min]          ║
║       • Input/Output signals                                   ║
║       • Componentes de presentación                            ║
║       • Reutilización                                          ║
║                                                                ║
║   4️⃣  Feature Services                      [45 min]          ║
║       • CRUD operations                                        ║
║       • Cache y estado                                         ║
║       • Error handling                                         ║
║                                                                ║
║   5️⃣  Integración Completa                  [30 min]          ║
║       • Flujo de datos                                         ║
║       • Routing                                                ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- El día está dividido en 5 secciones principales
- Hay 2 labs prácticos
- El enfoque es integrar todo lo aprendido

---

## Slide 3: El Problema de los Componentes Monolíticos

```
╔════════════════════════════════════════════════════════════════╗
║                    ❌ EL PROBLEMA                              ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   📄 user.component.ts (800+ líneas)                           ║
║                                                                ║
║   export class UserComponent {                                 ║
║     // HTTP calls                                              ║
║     // State management                                        ║
║     // UI logic                                                ║
║     // Navigation                                              ║
║     // Form validation                                         ║
║     // Error handling                                          ║
║     // ... todo en un solo lugar                               ║
║   }                                                            ║
║                                                                ║
║   ┌─────────────────────────────────────────────────────────┐  ║
║   │  🤔 ¿Qué problemas ves aquí?                             │  ║
║   │                                                          │  ║
║   │  • Difícil de mantener                                   │  ║
║   │  • Imposible de testear                                  │  ║
║   │  • No reutilizable                                       │  ║
║   │  • Un cambio rompe 3 cosas                               │  ║
║   └─────────────────────────────────────────────────────────┘  ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- Pregunta a los estudiantes: ¿Qué problemas ven?
- Los componentes monolíticos son una anti-pattern
- La solución es separar responsabilidades

---

## Slide 4: La Solución - Smart vs Dumb

```
╔════════════════════════════════════════════════════════════════╗
║                    ✅ LA SOLUCIÓN                              ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   ┌─────────────────────────────────────────────────────────┐  ║
║   │              SMART COMPONENTS (Pages)                    │  ║
║   │                                                          │  ║
║   │  • Contienen lógica de negocio                           │  ║
║   │  • Inyectan servicios                                    │  ║
║   │  • Manejan estado con Signals                            │  ║
║   │  • Son routables                                         │  ║
║   │  • Coordinan dumb components                             │  ║
║   └─────────────────────────────────────────────────────────┘  ║
║                           │                                    ║
║                           ▼                                    ║
║   ┌─────────────────────────────────────────────────────────┐  ║
║   │              DUMB COMPONENTS (UI)                        │  ║
║   │                                                          │  ║
║   │  • Solo presentación                                     │  ║
║   │  • Sin servicios                                         │  ║
║   │  • Input/Output signals                                  │  ║
║   │  • No son routables                                      │  ║
║   │  • Reutilizables                                         │  ║
║   └─────────────────────────────────────────────────────────┘  ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- Smart Components = Pages = Lógica de negocio
- Dumb Components = UI = Presentación pura
- La separación mejora mantenibilidad y testabilidad

---

## Slide 5: Estructura de un Feature

```
╔════════════════════════════════════════════════════════════════╗
║                 📁 FEATURE STRUCTURE                           ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   feature/                                                     ║
║   ├── pages/                    # Smart Components             ║
║   │   ├── list/                                                ║
║   │   │   ├── list.component.ts                                ║
║   │   │   └── list.component.html                              ║
║   │   └── detail/                                              ║
║   │       ├── detail.component.ts                              ║
║   │       └── detail.component.html                            ║
║   │                                                            ║
║   ├── components/               # Dumb Components              ║
║   │   ├── item-card/                                           ║
║   │   └── item-form/                                           ║
║   │                                                            ║
║   ├── services/                 # Feature Services             ║
║   │   └── feature.service.ts                                   ║
║   │                                                            ║
║   ├── models/                   # Domain Models                ║
║   │   └── feature.models.ts                                    ║
║   │                                                            ║
║   └── feature.routes.ts         # Routing                      ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- Estructura consistente en todos los features
- pages/ para Smart Components
- components/ para Dumb Components
- services/ para lógica de datos
- models/ para tipos

---

## Slide 6: Smart Components - Responsabilidades

```
╔════════════════════════════════════════════════════════════════╗
║                   🧠 SMART COMPONENTS                          ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   ┌──────────────────┬──────────────────────────────────────┐  ║
║   │ Responsabilidad  │ Descripción                          │  ║
║   ├──────────────────┼──────────────────────────────────────┤  ║
║   │ Coordinación     │ Orquestar componentes hijos          │  ║
║   │ Estado           │ Manejar estado con Signals           │  ║
║   │ Datos            │ Cargar datos desde servicios         │  ║
║   │ Navegación       │ Manejar routing                      │  ║
║   │ Eventos          │ Responder a eventos de hijos         │  ║
║   └──────────────────┴──────────────────────────────────────┘  ║
║                                                                ║
║   ──────────────────────────────────────────────────────────── ║
║                                                                ║
║   📦 Ejemplos en UyuniAdmin:                                   ║
║                                                                ║
║   • OverviewComponent (dashboard)                              ║
║   • SignInComponent (auth)                                     ║
║   • ProfileOverviewComponent (profile)                         ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- Smart Components son el cerebro del feature
- Coordinan todo: datos, estado, navegación
- Usan servicios y Router

---

## Slide 7: Smart Component - Código

```
╔════════════════════════════════════════════════════════════════╗
║                   💻 SMART COMPONENT                           ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   @Component({                                                 ║
║     selector: 'app-user-list-page',                            ║
║     standalone: true                                           ║
║   })                                                           ║
║   export class UserListPageComponent implements OnInit {       ║
║     // 1. Inyección de dependencias                            ║
║     private userService = inject(UserService);                 ║
║     private router = inject(Router);                           ║
║                                                                ║
║     // 2. Estado con Signals                                   ║
║     users = signal<User[]>([]);                                ║
║     isLoading = signal(true);                                  ║
║                                                                ║
║     // 3. Lifecycle                                            ║
║     ngOnInit(): void {                                         ║
║       this.loadUsers();                                        ║
║     }                                                          ║
║                                                                ║
║     // 4. Métodos                                              ║
║     private loadUsers(): void { ... }                          ║
║     onUserSelect(user: User): void { ... }                     ║
║   }                                                            ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- Estructura clara: inyección, estado, lifecycle, métodos
- Usar inject() para dependencias
- Signals para estado reactivo

---

## Slide 8: Dumb Components - Responsabilidades

```
╔════════════════════════════════════════════════════════════════╗
║                   🎨 DUMB COMPONENTS                           ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   ┌──────────────────┬──────────────────────────────────────┐  ║
║   │ Principio        │ Descripción                          │  ║
║   ├──────────────────┼──────────────────────────────────────┤  ║
║   │ Sin servicios    │ No inyectar servicios de negocio     │  ║
║   │ Solo Input/Output│ Comunicación por signals             │  ║
║   │ Estado local     │ Solo estado de UI (hover, focus)     │  ║
║   │ Sin efectos      │ No hacer llamadas HTTP               │  ║
║   │ Predecibles      │ Mismo input = mismo output           │  ║
║   └──────────────────┴──────────────────────────────────────┘  ║
║                                                                ║
║   ──────────────────────────────────────────────────────────── ║
║                                                                ║
║   📦 Ejemplos en UyuniAdmin:                                   ║
║                                                                ║
║   • EcommerceMetricsComponent                                  ║
║   • MonthlySalesChartComponent                                 ║
║   • SigninFormComponent                                        ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- Dumb Components son puros de presentación
- Sin efectos secundarios
- Predecibles y testeables

---

## Slide 9: Input/Output Signals

```
╔════════════════════════════════════════════════════════════════╗
║                   📤 INPUT/OUTPUT                              ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   // Input signal (recibir datos)                              ║
║   user = input.required<User>();                               ║
║   showAvatar = input<boolean>(true);                           ║
║                                                                ║
║   ──────────────────────────────────────────────────────────── ║
║                                                                ║
║   // Output signal (emitir eventos)                            ║
║   cardClick = output<User>();                                  ║
║   deleteClick = output<string>();                              ║
║                                                                ║
║   ──────────────────────────────────────────────────────────── ║
║                                                                ║
║   // model signal (two-way binding)                            ║
║   filter = model.required<UserFilter>();                       ║
║                                                                ║
║   ──────────────────────────────────────────────────────────── ║
║                                                                ║
║   // Uso en template                                           ║
║   <app-user-card                                               ║
║     [user]="selectedUser()"                                    ║
║     [showAvatar]="true"                                        ║
║     (cardClick)="onUserSelect($event)" />                      ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- input() para recibir datos del padre
- output() para emitir eventos al padre
- model() para two-way binding

---

## Slide 10: Dumb Component - Código

```
╔════════════════════════════════════════════════════════════════╗
║                   💻 DUMB COMPONENT                            ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   @Component({                                                 ║
║     selector: 'app-user-card',                                 ║
║     standalone: true                                           ║
║   })                                                           ║
║   export class UserCardComponent {                             ║
║     // Solo Input/Output, sin servicios                        ║
║     user = input.required<User>();                             ║
║     showAvatar = input<boolean>(true);                         ║
║                                                                ║
║     cardClick = output<User>();                                ║
║     editClick = output<User>();                                ║
║                                                                ║
║     // Sin lógica de negocio                                   ║
║     onCardClick(): void {                                      ║
║       this.cardClick.emit(this.user());                        ║
║     }                                                          ║
║   }                                                            ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- Sin inyección de servicios
- Solo Input/Output signals
- Código simple y predecible

---

## Slide 11: Feature Services

```
╔════════════════════════════════════════════════════════════════╗
║                   🔧 FEATURE SERVICES                          ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   ┌──────────────────┬──────────────────────────────────────┐  ║
║   │ Responsabilidad  │ Descripción                          │  ║
║   ├──────────────────┼──────────────────────────────────────┤  ║
║   │ HTTP calls       │ Llamadas a API del feature           │  ║
║   │ Data transform   │ Transformar respuestas               │  ║
║   │ Caching          │ Cache de datos frecuentes            │  ║
║   │ Error handling   │ Manejo centralizado de errores       │  ║
║   │ State management │ Estado compartido del feature        │  ║
║   └──────────────────┴──────────────────────────────────────┘  ║
║                                                                ║
║   ──────────────────────────────────────────────────────────── ║
║                                                                ║
║   📦 Ejemplos en UyuniAdmin:                                   ║
║                                                                ║
║   • AuthService (auth)                                         ║
║   • DashboardService (dashboard)                               ║
║   • ProfileService (profile)                                   ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- Feature Services encapsulan lógica de datos
- Manejan cache y errores
- Son inyectados en Smart Components

---

## Slide 12: Feature Service - Código

```
╔════════════════════════════════════════════════════════════════╗
║                   💻 FEATURE SERVICE                           ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   @Injectable({ providedIn: 'root' })                          ║
║   export class UserService {                                   ║
║     private http = inject(HttpClient);                         ║
║                                                                ║
║     // Cache con signals                                       ║
║     private usersCache = signal<User[] | null>(null);          ║
║                                                                ║
║     getUsers(): Observable<User[]> {                           ║
║       if (this.usersCache()) {                                 ║
║         return of(this.usersCache()!);                         ║
║       }                                                        ║
║       return this.http.get<User[]>('/api/users').pipe(         ║
║         tap(users => this.usersCache.set(users))               ║
║       );                                                       ║
║     }                                                          ║
║                                                                ║
║     createUser(user: CreateUserRequest): Observable<User> {    ║
║       return this.http.post<User>('/api/users', user).pipe(    ║
║         tap(newUser => this.usersCache.update(                 ║
║           users => [...(users || []), newUser]                 ║
║         ))                                                     ║
║       );                                                       ║
║     }                                                          ║
║   }                                                            ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notes del presentador:**
- Cache con signals para estado reactivo
- Métodos CRUD completos
- Manejo de errores centralizado

---

## Slide 13: Flujo de Datos

```
╔════════════════════════════════════════════════════════════════╗
║                   🔄 DATA FLOW                                 ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   ┌─────────────────────────────────────────────────────────┐  ║
║   │                    PAGE (Smart)                          │  ║
║   │  users = signal<User[]>([])                             │  ║
║   │  isLoading = signal(true)                               │  ║
║   └────────────────────────┬────────────────────────────────┘  ║
║                            │                                   ║
║              ┌─────────────┴─────────────┐                    ║
║              ▼                           ▼                    ║
║   ┌──────────────────┐      ┌──────────────────┐              ║
║   │   UserService    │      │     Router       │              ║
║   │                  │      │                  │              ║
║   │  getUsers()      │      │  navigate()      │              ║
║   │  createUser()    │      │                  │              ║
║   └────────┬─────────┘      └──────────────────┘              ║
║            │                                                   ║
║            ▼                                                   ║
║   ┌──────────────────┐                                        ║
║   │   HttpClient     │                                        ║
║   │                  │                                        ║
║   │  GET /users      │                                        ║
║   │  POST /users     │                                        ║
║   └──────────────────┘                                        ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- Page coordina todo
- UserService maneja datos
- Router maneja navegación
- HttpClient hace las llamadas

---

## Slide 14: Routing del Feature

```
╔════════════════════════════════════════════════════════════════╗
║                   🛣️ FEATURE ROUTING                           ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   // users.routes.ts                                           ║
║   export const USER_ROUTES: Routes = [                         ║
║     {                                                          ║
║       path: '',                                                ║
║       loadComponent: () => import('./pages/list/...')          ║
║     },                                                         ║
║     {                                                          ║
║       path: 'new',                                             ║
║       loadComponent: () => import('./pages/form/...')          ║
║     },                                                         ║
║     {                                                          ║
║       path: ':id',                                             ║
║       loadComponent: () => import('./pages/detail/...')        ║
║     },                                                         ║
║     {                                                          ║
║       path: ':id/edit',                                        ║
║       loadComponent: () => import('./pages/form/...')          ║
║     }                                                          ║
║   ];                                                           ║
║                                                                ║
║   // En app.routes.ts                                          ║
║   { path: 'users', loadChildren: () => import('...') }         ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- Cada feature tiene su propio archivo de rutas
- Lazy loading con loadComponent
- Rutas anidadas para CRUD

---

## Slide 15: Errores Comunes

```
╔════════════════════════════════════════════════════════════════╗
║                 ⚠️ ERRORES COMUNES                             ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   1️⃣  Lógica en Dumb Components                                ║
║                                                                ║
║   ❌ export class UserCardComponent {                          ║
║        private userService = inject(UserService);              ║
║      }                                                         ║
║   ✅ export class UserCardComponent {                          ║
║        user = input.required<User>();                          ║
║      }                                                         ║
║                                                                ║
║   ──────────────────────────────────────────────────────────── ║
║                                                                ║
║   2️⃣  Estado Mutable                                           ║
║                                                                ║
║   ❌ this.users().push(newUser);                               ║
║   ✅ this.users.update(users => [...users, newUser]);          ║
║                                                                ║
║   ──────────────────────────────────────────────────────────── ║
║                                                                ║
║   3️⃣  Efectos Secundarios en Dumb                              ║
║                                                                ║
║   ❌ effect(() => this.userService.log(...))                   ║
║   ✅ // El padre maneja el efecto secundario                   ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- No inyectar servicios en dumb components
- No mutar estado directamente
- No hacer efectos secundarios en dumb components

---

## Slide 16: Labs del Día

```
╔════════════════════════════════════════════════════════════════╗
║                    🧪 LABS                                     ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   📋 Lab 01: Feature Dashboard                                 ║
║                                                                ║
║   • Crear feature dashboard completo                           ║
║   • Smart Component: OverviewPage                              ║
║   • Dumb Components: MetricCard, ChartCard                     ║
║   • Feature Service: DashboardService                          ║
║   • Routing lazy loaded                                        ║
║   • Duración: 45 min                                           ║
║                                                                ║
║   ──────────────────────────────────────────────────────────── ║
║                                                                ║
║   📋 Lab 02: Feature Users                                     ║
║                                                                ║
║   • Crear feature users con CRUD                               ║
║   • Pages: List, Detail, Form                                  ║
║   • Components: UserCard, UserForm, UserFilter                 ║
║   • Service: UserService con cache                             ║
║   • Models: User, UserFilter                                   ║
║   • Duración: 45 min                                           ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- Lab 01: Feature Dashboard
- Lab 02: Feature Users con CRUD
- Tiempo estimado: 90 min total

---

## Slide 17: Resumen del Día

```
╔════════════════════════════════════════════════════════════════╗
║                   📝 RESUMEN                                   ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   ✅ Lo que aprendimos hoy:                                    ║
║                                                                ║
║   1️⃣  Features tienen estructura clara: pages, components,      ║
║       services, models                                         ║
║                                                                ║
║   2️⃣  Smart Components (pages) manejan lógica de negocio       ║
║                                                                ║
║   3️⃣  Dumb Components (UI) son puros de presentación           ║
║                                                                ║
║   4️⃣  Input/Output signals para comunicación                   ║
║                                                                ║
║   5️⃣  Feature Services encapsulan lógica de datos              ║
║                                                                ║
║   6️⃣  Routing lazy loaded por feature                          ║
║                                                                ║
║   ──────────────────────────────────────────────────────────── ║
║                                                                ║
║   🎯 Próximo día: Integración Completa                         ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- Repasar los 6 puntos clave
- Asegurar que todos completaron los labs
- Preparar para el día 16

---

## Slide 18: Cierre

```
╔════════════════════════════════════════════════════════════════╗
║                   👋 CIERRE                                    ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║                    🎉 ¡Día 15 Completado!                      ║
║                                                                ║
║   ┌─────────────────────────────────────────────────────────┐  ║
║   │                                                          │  ║
║   │   📋 Checklist antes de continuar:                      │  ║
║   │                                                          │  ║
║   │   [ ] Completaste los 2 labs                             │  ║
║   │   [ ] Respondiste el assessment                          │  ║
║   │   [ ] Entiendes Smart vs Dumb                            │  ║
║   │   [ ] Puedes crear un feature completo                   │  ║
║   │                                                          │  ║
║   └─────────────────────────────────────────────────────────┘  ║
║                                                                ║
║   ──────────────────────────────────────────────────────────── ║
║                                                                ║
║   📅 Próximo: Día 16 - Integración Completa                    ║
║                                                                ║
║   🎯 Objetivo: Integrar todos los elementos                    ║
║                                                                ║
║                   ¡Nos vemos mañana! 👋                         ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- Verificar que todos completaron las actividades
- Responder preguntas
- Motivar para el siguiente día

---

*Slides de Presentación - Día 15 - Curso Angular 21 - UyuniAdmin Frontend*
