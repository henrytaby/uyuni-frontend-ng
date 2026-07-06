# Features & Modules - UyuniAdmin Frontend

## Feature Modules Overview

All features are located in `src/app/features/` and follow lazy loading.

| Feature | Route | Description |
|---------|-------|-------------|
| **auth** | `/signin`, `/signup` | Authentication pages |
| **dashboard** | `/` | Main dashboard with metrics |
| **calendar** | `/calendar` | Calendar and events |
| **charts** | `/charts` | Data visualization |
| **forms** | `/forms` | Form components |
| **tables** | `/tables` | Data tables |
| **invoice** | `/invoice` | Invoice management |
| **profile** | `/profile` | User profile |
| **system** | `/blank`, `**` | System pages (404, blank) |
| **ui** | `/ui` | UI components demo |

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
- `/` - Default route (dashboard overview)

### Structure
```
dashboard/
├── pages/
│   └── overview/          # Main dashboard page
├── components/
│   ├── ecommerce-metrics/ # KPI cards
│   ├── monthly-sales-chart/  # Sales chart
│   └── monthly-target/    # Target progress
└── dashboard.routes.ts
```

### Key Components
- `EcommerceMetricsComponent` - Displays KPIs (revenue, orders, etc.)
- `MonthlySalesChartComponent` - Chart.js line/bar chart
- `MonthlyTargetComponent` - Progress indicators

---

## Calendar Feature

**Location**: `src/app/features/calendar/`

### Route
- `/calendar` - Calendar overview

### Structure
```
calendar/
├── pages/
│   └── overview/          # Calendar page
├── components/            # Calendar-specific components
├── models/                # Event types
├── services/              # Event services
└── calendar.routes.ts
```

### Dependencies
- `@fullcalendar/angular` - Calendar component
- `@fullcalendar/daygrid` - Month view
- `@fullcalendar/timegrid` - Week/day view
- `@fullcalendar/interaction` - Drag & drop

---

## Charts Feature

**Location**: `src/app/features/charts/`

### Routes
- `/charts/bar` - Bar charts
- `/charts/line` - Line charts

### Structure
```
charts/
├── pages/
│   ├── bar-chart/         # Bar chart page
│   └── line-chart/        # Line chart page
├── components/
│   ├── bar/
│   │   └── bar-chart-one/ # Bar chart component
│   └── line/
│       └── line-chart-one/ # Line chart component
└── charts.routes.ts
```

### Dependencies
- `chart.js` - Charting library

---

## Forms Feature

**Location**: `src/app/features/forms/`

### Routes
- `/forms/form-elements` - Basic form elements
- `/forms/form-layout` - Form layouts

### Structure
```
forms/
├── pages/
│   ├── form-elements/     # Input components demo
│   └── form-layout/       # Layout variations
├── components/            # Form-specific components
└── forms.routes.ts
```

---

## Tables Feature

**Location**: `src/app/features/tables/`

### Routes
- `/tables/basic` - Basic tables
- `/tables/data` - Data tables with sorting/filtering

### Structure
```
tables/
├── pages/
│   ├── basic/             # Basic table page
│   └── data/              # Data table page
├── components/            # Table components
└── tables.routes.ts
```

### Dependencies
- PrimeNG Table component

---

## Invoice Feature

**Location**: `src/app/features/invoice/`

### Routes
- `/invoice/list` - Invoice list
- `/invoice/detail` - Invoice detail

### Structure
```
invoice/
├── pages/
│   ├── list/              # Invoice list page
│   └── detail/            # Invoice detail page
├── components/            # Invoice-specific components
└── invoice.routes.ts
```

---

## Profile Feature

**Location**: `src/app/features/profile/`

### Route
- `/profile` - User profile page

### Structure
```
profile/
├── pages/
│   └── overview/          # Profile page
├── components/            # Profile components
└── profile.routes.ts
```

### Features
- User information display
- Role switching
- Profile editing

---

## System Feature

**Location**: `src/app/features/system/`

### Routes
- `/blank` - Blank page template
- `**` - 404 Not Found

### Structure
```
system/
├── pages/
│   ├── blank/             # Blank template
│   └── not-found/         # 404 page
└── prime-demo/            # PrimeNG demo page
```

---

## UI Feature

**Location**: `src/app/features/ui/`

### Routes
- `/ui/alerts` - Alert components
- `/ui/buttons` - Button styles
- `/ui/cards` - Card components
- etc.

### Purpose
Demo page for UI components. Not for production use.

---

## Shared Module

**Location**: `src/app/shared/`

### Structure
```
shared/
├── layout/
│   └── app-layout/        # Main application layout
├── components/
│   ├── header/            # App header
│   │   └── user-dropdown/ # User menu
│   └── sidebar/           # Navigation sidebar
├── pipes/                 # Custom pipes
└── directives/            # Custom directives
```

### Key Components
- `AppLayoutComponent` - Main layout wrapper
- `AppHeaderComponent` - Top navigation bar
- `AppSidebarComponent` - Side navigation
- `UserDropdownComponent` - User menu with logout

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

### Interceptors

| Interceptor | Purpose |
|-------------|---------|
| `authInterceptor` | Token injection, error handling |
| `loadingInterceptor` | Loading state management |

### Guards

| Guard | Purpose |
|-------|---------|
| `authGuard` | Route protection |

---

*Last updated: May 2026*
