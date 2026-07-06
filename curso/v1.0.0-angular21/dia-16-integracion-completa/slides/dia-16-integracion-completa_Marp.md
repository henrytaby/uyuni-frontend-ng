# Slides: Día 16 - Integración Completa

## Slide 1: Portada

```
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║     ███████╗██╗███╗   ██╗██╗███╗   ██╗███╗   ██╗██╗████████╗  ║
║     ██╔════╝██║████╗  ██║██║████╗  ██║████╗  ██║██║╚══██╔══╝  ║
║     █████╗  ██║██╔██╗ ██║██║██╔██╗ ██║██╔██╗ ██║██║   ██║     ║
║     ██╔══╝  ██║██║╚██╗██║██║██║╚██╗██║██║╚██╗██║██║   ██║     ║
║     ██║     ██║██║ ╚████║██║██║ ╚████║██║ ╚████║██║   ██║     ║
║     ╚═╝     ╚═╝╚═╝  ╚═══╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═══╝╚═╝   ╚═╝     ║
║                                                                ║
║              COMPLETA                                          ║
║                                                                ║
║     ███████╗██╗   ██╗███████╗████████╗                        ║
║     ██╔════╝██║   ██║██╔════╝╚══██╔══╝                        ║
║     ███████╗██║   ██║███████╗   ██║                           ║
║     ╚════██║██║   ██║╚════██║   ██║                           ║
║     ███████║╚██████╔╝███████║   ██║                           ║
║     ╚══════╝ ╚═════╝ ╚══════╝   ╚═╝                           ║
║                                                                ║
║              [Día 16 - Módulo 6: Features]                     ║
║                                                                ║
║     Curso Angular 21 - UyuniAdmin Frontend                     ║
║     Duración: 4 horas                                          ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- Bienvenida al día 16 del curso
- Este día integra todo lo aprendido
- El objetivo es una aplicación funcional

---

## Slide 2: Agenda del Día

```
╔════════════════════════════════════════════════════════════════╗
║                        📋 AGENDA                               ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   1️⃣  Arquitectura de Integración          [45 min]          ║
║       • Flujo de datos entre módulos                           ║
║       • Dependencias y comunicación                            ║
║       • Estado global vs local                                 ║
║                                                                ║
║   2️⃣  Autenticación + Features             [60 min]          ║
║       • Protección de rutas                                    ║
║       • Datos del usuario en features                          ║
║       • Contexto de rol activo                                 ║
║                                                                ║
║   3️⃣  Layout y Navegación                  [45 min]          ║
║       • AppLayoutComponent                                     ║
║       • Sidebar dinámico                                       ║
║       • Header con usuario                                     ║
║                                                                ║
║   4️⃣  Flujo de Datos Completo              [60 min]          ║
║       • HTTP → Interceptor → Service → Component               ║
║       • Manejo de errores global                               ║
║       • Loading states                                         ║
║                                                                ║
║   5️⃣  Proyecto Final                       [30 min]          ║
║       • Integración de todos los features                      ║
║       • Testing manual                                         ║
║       • Deploy local                                           ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- El día está dividido en 5 secciones
- Hay 2 labs prácticos
- El enfoque es integración completa

---

## Slide 3: El Puzzle Completo

```
╔════════════════════════════════════════════════════════════════╗
║                    🧩 EL PUZZLE                                ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   Hasta ahora hemos construido:                                ║
║                                                                ║
║   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        ║
║   │ Core Services │  │ Interceptors │  │    Guards    │        ║
║   │              │  │              │  │              │        ║
║   │ • Logger     │  │ • Auth       │  │ • AuthGuard  │        ║
║   │ • Loading    │  │ • Loading    │  │              │        ║
║   │ • Config     │  │              │  │              │        ║
║   │ • Auth       │  │              │  │              │        ║
║   └──────────────┘  └──────────────┘  └──────────────┘        ║
║                                                                ║
║   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        ║
║   │   Features   │  │ UI Components│  │   Routing    │        ║
║   │              │  │              │  │              │        ║
║   │ • Dashboard  │  │ • PrimeNG    │  │ • Lazy Load  │        ║
║   │ • Users      │  │ • Tailwind   │  │ • Guards     │        ║
║   │ • Profile    │  │              │  │              │        ║
║   └──────────────┘  └──────────────┘  └──────────────┘        ║
║                                                                ║
║   ──────────────────────────────────────────────────────────── ║
║                                                                ║
║   🎯 HOY: ¿Cómo conectamos todo?                               ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- Repasar las piezas construidas
- El desafío es conectarlas
- Preguntar: ¿Qué piezas recuerdan?

---

## Slide 4: Arquitectura de Integración

```
╔════════════════════════════════════════════════════════════════╗
║                 🏗️ ARQUITECTURA                                ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   ┌─────────────────────────────────────────────────────────┐  ║
║   │                    APP COMPONENT                         │  ║
║   │  • Router Outlet                                         │  ║
║   │  • Global Loading Spinner                                │  ║
║   │  • Toast Messages                                        │  ║
║   └─────────────────────────────────────────────────────────┘  ║
║                              │                                  ║
║              ┌───────────────┴───────────────┐                 ║
║              ▼                               ▼                  ║
║   ┌─────────────────────┐      ┌─────────────────────┐        ║
║   │   AUTH LAYOUT       │      │    APP LAYOUT       │        ║
║   │   (Sin sidebar)     │      │  (Con sidebar)      │        ║
║   └─────────────────────┘      └─────────────────────┘        ║
║                                        │                        ║
║                    ┌───────────────────┼───────────────────┐   ║
║                    ▼                   ▼                   ▼   ║
║              ┌──────────┐      ┌──────────┐      ┌──────────┐ ║
║              │Dashboard │      │  Users   │      │ Profile  │ ║
║              └──────────┘      └──────────┘      └──────────┘ ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- App Component es la raíz
- Auth Layout para páginas de autenticación
- App Layout para páginas protegidas
- Features se cargan dentro del layout

---

## Slide 5: Flujo de Datos

```
╔════════════════════════════════════════════════════════════════╗
║                    🔄 DATA FLOW                                ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   User Action → Component → Service → HTTP → Interceptor       ║
║        ↑                                              │        ║
║        │                                              ▼        ║
║        └──────────── Signal Update ←─────────── Response        ║
║                                                                ║
║   ──────────────────────────────────────────────────────────── ║
║                                                                ║
║   CAPAS:                                                       ║
║                                                                ║
║   1. Presentation Layer (Components)                           ║
║      • Smart Components (Pages)                                ║
║      • Dumb Components (UI)                                    ║
║      • Layouts                                                 ║
║                                                                ║
║   2. Business Layer (Services)                                 ║
║      • Feature Services                                        ║
║      • Core Services                                           ║
║      • State Management                                        ║
║                                                                ║
║   3. Infrastructure Layer (HTTP)                               ║
║      • Interceptors                                            ║
║      • Error Handlers                                          ║
║      • Guards                                                  ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- El flujo es bidireccional
- Cada capa tiene responsabilidades claras
- Los signals permiten reactividad

---

## Slide 6: AuthService en Features

```
╔════════════════════════════════════════════════════════════════╗
║                 🔐 AUTH + FEATURES                             ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   AuthService expone signals globales:                         ║
║                                                                ║
║   ┌─────────────────────────────────────────────────────────┐  ║
║   │  readonly currentUser = this._currentUser.asReadonly();  │  ║
║   │  readonly roles = this._roles.asReadonly();              │  ║
║   │  readonly activeRole = this._activeRole.asReadonly();    │  ║
║   │  readonly isAuthenticated = ...asReadonly();             │  ║
║   └─────────────────────────────────────────────────────────┘  ║
║                                                                ║
║   ──────────────────────────────────────────────────────────── ║
║                                                                ║
║   Uso en cualquier componente:                                 ║
║                                                                ║
║   export class DashboardComponent {                            ║
║     private authService = inject(AuthService);                 ║
║                                                                ║
║     user = this.authService.currentUser;                       ║
║     activeRole = this.authService.activeRole;                  ║
║   }                                                            ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- AuthService es singleton global
- Los signals son readonly
- Cualquier feature puede acceder

---

## Slide 7: Layout Structure

```
╔════════════════════════════════════════════════════════════════╗
║                   📐 LAYOUT                                    ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   ┌─────────────────────────────────────────────────────────┐  ║
║   │                        HEADER                            │  ║
║   │  [Logo] [Breadcrumb]              [User] [Logout]       │  ║
║   ├────────────┬────────────────────────────────────────────┤  ║
║   │            │                                             │  ║
║   │  SIDEBAR   │                  CONTENT                    │  ║
║   │            │                                             │  ║
║   │  • Home    │     ┌─────────────────────────────────┐    │  ║
║   │  • Users   │     │                                 │    │  ║
║   │  • Profile │     │         Router Outlet           │    │  ║
║   │            │     │                                 │    │  ║
║   │            │     └─────────────────────────────────┘    │  ║
║   │            │                                             │  ║
║   └────────────┴────────────────────────────────────────────┘  ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- Header siempre visible
- Sidebar colapsable
- Content area con router-outlet

---

## Slide 8: Sidebar Dinámico

```
╔════════════════════════════════════════════════════════════════╗
║                  📋 SIDEBAR DINÁMICO                           ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   El sidebar muestra items según el rol:                       ║
║                                                                ║
║   ┌─────────────────────────────────────────────────────────┐  ║
║   │  menuItems = signal<MenuItem[]>([                       │  ║
║   │    { path: '/dashboard', roles: ['admin', 'user'] },    │  ║
║   │    { path: '/users', roles: ['admin'] },                │  ║
║   │    { path: '/profile', roles: ['admin', 'user'] }       │  ║
║   │  ]);                                                     │  ║
║   │                                                          │  ║
║   │  visibleMenuItems = computed(() =>                      │  ║
║   │    this.menuItems().filter(item =>                      │  ║
║   │      item.roles.includes(currentRole)                   │  ║
║   │    )                                                     │  ║
║   │  );                                                      │  ║
║   └─────────────────────────────────────────────────────────┘  ║
║                                                                ║
║   ──────────────────────────────────────────────────────────── ║
║                                                                ║
║   Resultado:                                                   ║
║   • Admin ve: Dashboard, Users, Profile                       ║
║   • User ve: Dashboard, Profile                               ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- Los items se filtran por rol
- Computed signal para reactividad
- Cambios de rol actualizan el menú

---

## Slide 9: Flujo de Create User

```
╔════════════════════════════════════════════════════════════════╗
║                 📊 CREATE USER FLOW                            ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   1. USER ACTION      → Click "Guardar"                        ║
║           │                                                     ║
║           ▼                                                     ║
║   2. COMPONENT        → userService.createUser(form.value)     ║
║           │                                                     ║
║           ▼                                                     ║
║   3. SERVICE          → http.post('/api/users', request)       ║
║           │                                                     ║
║           ▼                                                     ║
║   4. INTERCEPTOR      → Add headers (Auth, Role)               ║
║           │                                                     ║
║           ▼                                                     ║
║   5. HTTP REQUEST     → POST /api/users                        ║
║           │                                                     ║
║           ▼                                                     ║
║   6. API RESPONSE     → { id: '123', name: 'John' }            ║
║           │                                                     ║
║           ▼                                                     ║
║   7. SERVICE          → Update cache                           ║
║           │                                                     ║
║           ▼                                                     ║
║   8. COMPONENT        → Navigate to /users                     ║
║           │                                                     ║
║           ▼                                                     ║
║   9. UI UPDATE        → User sees new user in list             ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- 9 pasos del click al UI update
- Cada paso es importante
- Errores pueden ocurrir en cualquier punto

---

## Slide 10: Errores Comunes

```
╔════════════════════════════════════════════════════════════════╗
║                 ⚠️ ERRORES COMUNES                             ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   1️⃣  Olvidar Subscribe                                         ║
║                                                                ║
║   ❌ this.userService.createUser(form.value);                  ║
║   ✅ this.userService.createUser(form.value).subscribe();      ║
║                                                                ║
║   ──────────────────────────────────────────────────────────── ║
║                                                                ║
║   2️⃣  Layout en Rutas Auth                                      ║
║                                                                ║
║   ❌ { path: 'signin', component: AppLayoutComponent }         ║
║   ✅ { path: 'signin', loadComponent: SignInComponent }        ║
║                                                                ║
║   ──────────────────────────────────────────────────────────── ║
║                                                                ║
║   3️⃣  Modificar Usuario Directamente                            ║
║                                                                ║
║   ❌ this.authService.currentUser().name = 'Nuevo';            ║
║   ✅ this.authService.refreshProfile().subscribe();            ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- Subscribe es obligatorio para HTTP
- Auth pages no deben tener layout
- Usar métodos del servicio para cambios

---

## Slide 11: Labs del Día

```
╔════════════════════════════════════════════════════════════════╗
║                    🧪 LABS                                     ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   📋 Lab 01: Integración Auth + Dashboard                      ║
║                                                                ║
║   • Conectar autenticación con dashboard                       ║
║   • Mostrar datos del usuario                                  ║
║   • Implementar logout                                         ║
║   • Sidebar dinámico por rol                                   ║
║   • Duración: 45 min                                           ║
║                                                                ║
║   ──────────────────────────────────────────────────────────── ║
║                                                                ║
║   📋 Lab 02: Proyecto Final                                    ║
║                                                                ║
║   • Integrar todos los features                                ║
║   • Crear flujo completo de navegación                         ║
║   • Testing manual de la aplicación                            ║
║   • Verificar manejo de errores                                ║
║   • Duración: 45 min                                           ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- Lab 01: Integración Auth + Dashboard
- Lab 02: Proyecto Final
- Tiempo estimado: 90 min total

---

## Slide 12: Checklist de Integración

```
╔════════════════════════════════════════════════════════════════╗
║                   ✅ CHECKLIST                                 ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   [ ] Autenticación funcionando                                ║
║       • Login redirect                                         ║
║       • Token storage                                          ║
║       • Logout                                                 ║
║                                                                ║
║   [ ] Dashboard con métricas                                   ║
║       • Datos del usuario                                      ║
║       • Métricas visibles                                      ║
║       • Gráficos renderizando                                  ║
║                                                                ║
║   [ ] CRUD de usuarios                                         ║
║       • Listar                                                 ║
║       • Crear                                                  ║
║       • Editar                                                 ║
║       • Eliminar                                               ║
║                                                                ║
║   [ ] Navegación fluida                                        ║
║       • Sidebar dinámico                                       ║
║       • Breadcrumbs                                            ║
║       • Back button                                            ║
║                                                                ║
║   [ ] Manejo de errores                                        ║
║       • Toast messages                                         ║
║       • Error boundaries                                       ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- Usar como guía de testing
- Verificar cada item
- Documentar problemas encontrados

---

## Slide 13: Resumen del Día

```
╔════════════════════════════════════════════════════════════════╗
║                   📝 RESUMEN                                   ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║   ✅ Lo que aprendimos hoy:                                    ║
║                                                                ║
║   1️⃣  Arquitectura de Integración - Conexión entre módulos     ║
║                                                                ║
║   2️⃣  Autenticación + Features - AuthService como puente       ║
║                                                                ║
║   3️⃣  Layout y Navegación - Consistencia visual                ║
║                                                                ║
║   4️⃣  Flujo de Datos - Del click al database                   ║
║                                                                ║
║   5️⃣  Proyecto Final - Integración completa                    ║
║                                                                ║
║   ──────────────────────────────────────────────────────────── ║
║                                                                ║
║   🎯 Próximo día: Testing                                      ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Notas del presentador:**
- Repasar los 5 puntos clave
- Asegurar que todos completaron los labs
- Preparar para el día 17

---

## Slide 14: Cierre

```
╔════════════════════════════════════════════════════════════════╗
║                   👋 CIERRE                                    ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║                    🎉 ¡Día 16 Completado!                      ║
║                                                                ║
║   ┌─────────────────────────────────────────────────────────┐  ║
║   │                                                          │  ║
║   │   📋 Checklist antes de continuar:                      │  ║
║   │                                                          │  ║
║   │   [ ] Completaste los 2 labs                             │  ║
║   │   [ ] Respondiste el assessment                          │  ║
║   │   [ ] Entiendes el flujo de datos                        │  ║
║   │   [ ] Puedes integrar un feature completo                │  ║
║   │                                                          │  ║
║   └─────────────────────────────────────────────────────────┘  ║
║                                                                ║
║   ──────────────────────────────────────────────────────────── ║
║                                                                ║
║   📅 Próximo: Día 17 - Testing                                 ║
║                                                                ║
║   🎯 Objetivo: Unit tests con Jest                             ║
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

*Slides de Presentación - Día 16 - Curso Angular 21 - UyuniAdmin Frontend*
