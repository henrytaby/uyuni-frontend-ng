# Features & Modules - UyuniAdmin Frontend

## Feature Modules Overview

All features are located in `src/app/features/` and follow lazy loading.

| Feature | Route | Description |
|---------|-------|-------------|
| **auth** | `/signin`, `/signup` | Authentication pages |
| **dashboard** | `/` | Main dashboard with metrics and role-based views |
| **profile** | `/profile` | User profile page |
| **staff** | `/staff` | Staff management (list, filtering) |
| **users** | `/users` | User management (list, filtering) |
| **system** | `/blank`, `**` | System pages (404, blank template) |

---

## Auth Feature

**Location**: `src/app/features/auth/`

### Routes
- `/signin` - Login page
- `/signup` - Registration page

### Structure
```
auth/
├── pages/
│   ├── sign-in/           # Login page (Smart Component)
│   └── sign-up/           # Registration page
├── components/
│   ├── signin-form/       # Login form (Dumb Component)
│   ├── signup-form/       # Registration form
│   ├── grid-shape/        # Decorative grid
│   ├── theme-toggle-two/  # Dark mode toggle
│   └── layout/
│       └── auth-page-layout/  # Auth pages layout
├── models/
│   └── auth.models.ts     # Auth types
└── auth.routes.ts         # Feature routing
```

### Key Components
- `SignInComponent` - Handles login logic and error display
- `SignInFormComponent` - Reactive form for credentials
- `AuthPageLayoutComponent` - Shared layout for auth pages

---

## Dashboard Feature

**Location**: `src/app/features/dashboard/`

### Route
- `/` - Default route (dashboard main page)

### Structure
```
dashboard/
├── pages/
│   └── main/              # Main dashboard page (role-based view switching)
├── components/
│   ├── admin-view/        # Administrator dashboard view
│   ├── client-view/       # Client dashboard view
│   ├── default-view/      # Default dashboard view
│   ├── ecommerce-metrics/ # KPI cards
│   ├── monthly-sales-chart/  # Sales chart (Chart.js)
│   ├── monthly-target/    # Target progress
│   └── statics-chart/     # Statistics chart
└── dashboard.routes.ts
```

### Key Components
- `MainComponent` - Dashboard entry, selects view by active role
- `AdminViewComponent` / `ClientViewComponent` / `DefaultViewComponent` - Role-based views
- `EcommerceMetricsComponent` - Displays KPIs (revenue, orders, etc.)
- `MonthlySalesChartComponent` - Chart.js line/bar chart (via PrimeNG `ChartModule`)
- `MonthlyTargetComponent` - Progress indicators
- `StaticsChartComponent` - Statistics chart

---

## Profile Feature

**Location**: `src/app/features/profile/`

### Route
- `/profile` - User profile page

### Structure
```
profile/
├── pages/
│   └── overview/          # Profile page (ProfileComponent)
├── components/
│   ├── user-info-card/    # User basic info card
│   ├── user-meta-card/    # User metadata card
│   └── user-address-card/ # User address card
└── profile.routes.ts
```

### Features
- User information display
- Role switching (via shared header role-selector)
- Profile cards layout

---

## Staff Feature

**Location**: `src/app/features/staff/`

### Route
- `/staff` - Staff list

### Structure
```
staff/
├── pages/
│   └── staff-list/        # Staff list page (StaffListComponent)
├── services/
│   ├── staff.service.ts          # StaffService (HTTP API: /core/staff/)
│   └── staff-filter.service.ts  # StaffFilterService (filtering state)
├── models/
│   └── staff.model.ts     # Staff, StaffParams interfaces
└── staff.routes.ts
```

### Models
- `Staff` - Staff entity (id, full_name, email, cellphone, management_name, department_name, birth_date, is_active, staff_type, position_id, org_unit_id)
- `StaffParams` - Query/filter params (offset, limit, search, sort_by, sort_order, is_active, org_unit_id)

---

## Users Feature

**Location**: `src/app/features/users/`

### Route
- `/users` - User list

### Structure
```
users/
├── pages/
│   └── user-list/         # User list page (UserListComponent)
├── services/
│   ├── user.service.ts          # UserService (HTTP API: /core/users/)
│   └── user-filter.service.ts   # UserFilterService (filtering state)
├── models/
│   └── user.model.ts      # User, UserParams interfaces
└── user.routes.ts
```

### Models
- `User` - User entity (id, username, email, first_name, last_name, is_verified, is_active, is_superuser, created_at, updated_at, created_by_id, updated_by_id)
- `UserParams` - Query/filter params (offset, limit, search, sort_by, sort_order, is_active, is_verified, is_superuser)

---

## System Feature

**Location**: `src/app/features/system/`

### Routes
- `/blank` - Blank page template
- `**` - 404 Not Found

### Structure
```
system/
└── pages/
    ├── blank/             # Blank template (BlankComponent)
    └── not-found/         # 404 page (NotFoundComponent)
```

---

## Shared Module

**Location**: `src/app/shared/`

### Structure
```
shared/
├── layout/
│   ├── app-layout/        # Main application layout
│   ├── app-header/        # Top navigation bar
│   ├── app-sidebar/       # Side navigation
│   ├── backdrop/          # Mobile sidebar backdrop
│   └── skeleton-page/     # UI skeleton page (loading)
├── components/
│   ├── header/
│   │   ├── theme-toggle/  # Dark mode toggle
│   │   ├── user-dropdown/ # User menu (logout)
│   │   └── role-selector/ # Active role switching
│   ├── ui/
│   │   └── dropdown/      # Reusable dropdown (dropdown, dropdown-item)
│   └── common/
│       └── page-breadcrumb/ # Page breadcrumb
├── services/
│   ├── icon-registry.service.ts  # Slug → Lucide icon mapping
│   ├── sidebar.service.ts        # Sidebar state (toggle, collapse)
│   └── theme.service.ts          # Theme (light/dark) persistence
├── models/
│   └── user-role.model.ts        # Shared user/role types
└── pipe/
    └── safe-html.pipe.ts         # Safe HTML pipe
```

### Key Components
- `AppLayoutComponent` - Main layout wrapper
- `AppHeaderComponent` - Top navigation bar
- `AppSidebarComponent` - Side navigation
- `UserDropdownComponent` - User menu with logout
- `RoleSelectorComponent` - Active role switching
- `DropdownComponent` / `DropdownItemComponent` - Reusable dropdown UI

---

## Core Module

**Location**: `src/app/core/`

### Services

| Service | Purpose |
|---------|---------|
| `AuthService` | Authentication operations |
| `ConfigService` | Configuration management |
| `LoadingService` | Global loading state |
| `LoggerService` | Structured logging |
| `TokenRefreshService` | Token renewal |
| `AuthErrorHandlerService` | Auth error handling |
| `NetworkErrorService` | Network error recovery |
| `BreakpointService` | Responsive breakpoint state (uses `@angular/cdk`) |
| `CatalogService` | Stateless bulk catalog fetch (`/api/catalogs/bulk`) |

### Interceptors

| Interceptor | Purpose |
|-------------|---------|
| `authInterceptor` | Token injection, error handling |
| `loadingInterceptor` | Loading state management |

### Guards

| Guard | Purpose |
|-------|---------|
| `authGuard` | Route protection |

### Handlers

| Handler | Purpose |
|---------|---------|
| `GlobalErrorHandler` | Catches unhandled errors at app level |

### Models

| Model | Purpose |
|-------|---------|
| `menu.models.ts` | Global menu/navigation types |
| `catalog.model.ts` | Catalog bulk request/response types |

---

*Last updated: July 2026*
