# Architecture Patterns - UyuniAdmin Frontend

## Architectural Style

**Domain-Driven Design (DDD) Lite** with **Modular Monolith** structure, adapted for Angular v21.

## Core Principles

### 1. Separation of Concerns
- Clear distinction between business logic, UI presentation, and global configuration
- Smart Components (pages) vs Dumb Components (UI components)
- Services handle business logic, components handle presentation

### 2. Lazy Loading by Default
- All feature modules loaded on demand
- Optimizes initial bundle size and performance
- Route-level code splitting

### 3. Standalone Components
- No NgModules (except for legacy library configurations)
- Self-contained components with explicit imports
- Tree-shakeable dependencies

### 4. Single Responsibility Principle
- Each service/component has one clear purpose
- Avoid god objects and monolithic services

### 5. ChangeDetectionStrategy.OnPush
- All components use `ChangeDetectionStrategy.OnPush` (36 components)
- Optimizes performance by reducing unnecessary change detection cycles
- Works seamlessly with Angular Signals
- Requires immutable patterns for objects and arrays

## Directory Structure

```
src/app/
├── core/                    # 🧠 Singletons (Global Services)
│   ├── auth/               # Authentication logic
│   │   ├── auth.service.ts
│   │   └── auth.service.spec.ts
│   ├── config/             # Configuration
│   │   ├── config.service.ts
│   │   ├── config.model.ts
│   │   └── config.service.spec.ts
│   ├── guards/             # Route guards
│   │   └── auth.guard.ts (+ spec)
│   ├── handlers/           # Error handlers
│   │   └── global-error-handler.ts
│   ├── interceptors/       # HTTP interceptors
│   │   ├── auth.interceptor.ts (+ spec)
│   │   └── loading.interceptor.ts
│   ├── models/             # Global models
│   │   ├── menu.models.ts
│   │   └── catalog.model.ts
│   └── services/           # Global utility services (+ specs)
│       ├── loading.service.ts
│       ├── logger.service.ts
│       ├── token-refresh.service.ts
│       ├── auth-error-handler.service.ts
│       ├── network-error.service.ts
│       ├── breakpoint.service.ts        # @angular/cdk based
│       └── catalog.service.ts           # Bulk catalog fetch
│
├── shared/                  # 🛠️ Reusable UI
│   ├── components/
│   │   ├── header/         # theme-toggle, user-dropdown, role-selector
│   │   ├── ui/             # dropdown, dropdown-item
│   │   └── common/         # page-breadcrumb
│   ├── layout/             # app-layout, app-header, app-sidebar, backdrop, skeleton-page
│   ├── services/           # icon-registry, sidebar, theme
│   ├── models/             # user-role.model.ts
│   └── pipe/               # safe-html.pipe.ts
│
├── features/               # 💼 Domain Modules
│   ├── auth/               # Authentication feature (/signin, /signup)
│   ├── dashboard/          # Dashboard feature (/)
│   ├── profile/            # Profile feature (/profile)
│   ├── staff/              # Staff management (/staff)
│   ├── users/              # User management (/users)
│   └── system/             # System pages (/blank, **)
│
├── app.component.ts        # Root component
├── app.config.ts           # Application config
└── app.routes.ts           # Root routing
```

## Feature Module Structure

Each feature follows a consistent internal structure:

```
feature/
├── pages/                  # Smart Components (routable)
│   └── overview/
│       ├── overview.component.ts
│       └── overview.component.html
├── components/             # Dumb Components (UI)
│   └── metric-card/
│       ├── metric-card.component.ts
│       └── metric-card.component.html
├── services/               # Feature-specific services
│   └── feature.service.ts
├── models/                 # Domain models
│   └── feature.models.ts
└── feature.routes.ts       # Feature routing (lazy-loaded)
```

## Dependency Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      FEATURES                                │
│  (Dashboard, Profile, Staff, Users, Auth, System)           │
└─────────────────────┬───────────────────────────────────────┘
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│      CORE       │     │     SHARED      │
│  (Singletons)   │     │  (UI Components)│
│                 │     │                 │
│ - AuthService   │     │ - Layout        │
│ - ConfigService │     │ - Header        │
│ - Guards        │     │ - Sidebar       │
│ - Interceptors  │     │ - Common UI     │
└─────────────────┘     └─────────────────┘
```

**Rules:**
- Features can depend on Core and Shared
- Shared can depend on Core
- Core must NOT depend on Features or Shared
- Features should NOT depend on other Features directly

## State Management

### Angular Signals (Preferred)
```typescript
// Local component state
isLoading = signal(false);
userData = signal<User | null>(null);

// Computed values
fullName = computed(() => 
  `${this.userData()?.firstName} ${this.userData()?.lastName}`
);
```

### RxJS (For async operations)
```typescript
// HTTP calls and streams
getUserProfile(): Observable<User> {
  return this.http.get<User>('/api/user/profile');
}
```

## Dependency Injection

### Modern inject() Pattern (Required)
```typescript
// ✅ Correct - Modern pattern
export class MyComponent {
  private authService = inject(AuthService);
  private configService = inject(ConfigService);
}

// ❌ Avoid - Constructor injection (legacy)
export class MyComponent {
  constructor(
    private authService: AuthService,
    private configService: ConfigService
  ) {}
}
```

## Routing Strategy

### Lazy Loading
```typescript
// Feature routes loaded on demand
{
  path: 'dashboard',
  loadChildren: () => import('@features/dashboard/dashboard.routes')
    .then(m => m.routes)
}
```

### Route Protection
```typescript
// Auth guard for protected routes
{
  path: '',
  component: AppLayoutComponent,
  canActivate: [authGuard],
  children: [...]
}
```

## HTTP Interception

### Functional Interceptors
```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.accessToken();
  
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  
  return next(req);
};
```

## Error Handling

### Global Error Handler
```typescript
@Injectable({ providedIn: 'root' })
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    // Log to monitoring service
    // Show user-friendly message
  }
}
```

### HTTP Error Handling
- 401: Automatic token refresh or logout
- 403: Account locked notification
- 500: Generic error message
- Network errors: Retry with exponential backoff

## Design Patterns Used

| Pattern | Usage |
|---------|-------|
| **Singleton** | Core services (providedIn: 'root') |
| **Observer** | RxJS streams, Signals |
| **Interceptor** | HTTP middleware |
| **Guard** | Route protection |
| **Facade** | Services abstracting complex logic |
| **Repository** | Services abstracting API calls |
| **Registry** | `IconRegistryService` — slug → Lucide icon mapping (slug-first approach) |

### Slug → Icon Registry Pattern

Backend sends semantic slugs (e.g., `"staff"`, `"administration"`) instead of icon class names. The frontend `IconRegistryService` resolves slugs to Lucide icon data, decoupling the backend from the icon library:

```typescript
// Backend sends: { slug: "staff", icon: "pi pi-users" }  ← icon field deprecated
// Template uses: iconRegistry.get(entity.slug || '')      ← slug-first
// IconRegistry resolves: "staff" → LucideUsers.icon
// Fallback: unmapped slug → LucideCircleDot.icon (neutral, not error-like)
```

This pattern is the industry standard for ERPs (SAP Fiori, Odoo, ERPNext) and enables future icon library changes without backend modifications.

---

*Last updated: July 2026*
