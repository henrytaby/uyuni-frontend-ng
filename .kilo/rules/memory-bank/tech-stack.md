# Tech Stack - UyuniAdmin Frontend

## Core Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| **Angular** | v21.2.17 | Core framework |
| **TypeScript** | v5.9.3 | Primary language |
| **Zone.js** | v0.16.2 | Change detection |

## UI Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| **PrimeNG** | v21.1.9 | UI component library (MIT - last open source version) |
| **@primeuix/themes** | v2.0.3 | Theme system (Aura) |
| **PrimeIcons** | v7.0.0 | Icon library |
| **Tailwind CSS** | v4.3.2 | Utility-first CSS |
| **tailwindcss-primeui** | v0.6.1 | PrimeNG + Tailwind integration |

## State Management

| Technology | Purpose |
|------------|---------|
| **Angular Signals** | Reactive state management (preferred) |
| **RxJS** | v7.8.2 | Async operations and HTTP |

## HTTP & API

| Technology | Purpose |
|------------|---------|
| **HttpClient** | API communication |
| **HTTP Interceptors** | Token injection, loading states |
| **JWT** | Authentication tokens |

## Additional Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| **Chart.js** | v4.5.1 | Data visualization |
| **FullCalendar** | v6.1.20 | Calendar component |
| **Swiper** | v12.1.4 | Touch slider |
| **Flatpickr** | v4.6.13 | Date picker |
| **PrismJS** | v1.30.0 | Syntax highlighting |
| **ng-otp-input** | v2.0.9 | OTP input component |
| **@lucide/angular** | v1.23.0 | Primary icon library (tree-shakable) |

### Icon Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| **@lucide/angular** | v1.23.0 | Primary icon library (tree-shakable, per-icon imports) |
| **PrimeIcons** | v7.0.0 | Legacy/PrimeNG component icons + social/brand icons only |
| **IconRegistryService** | - | Centralized slug → Lucide icon mapping (slug-first approach) |

**IconResolution Pattern**:
- **Slug-first approach**: Backend sends semantic slugs (e.g., `"staff"`, `"administration"`), frontend resolves via `IconRegistryService.get(slug)`
- **Icon field deprecated**: Backend may still send `icon` field but it's ignored in templates
- **Neutral fallback**: If slug not found, returns `LucideCircleDot` (neutral dot, not alert)
- **No PrimeIcons mapping**: legacy `PRIMEICONS_TO_ICON` removed (slug-first is the only resolution path)

**Usage**:
```typescript
// Component TS
import { IconRegistryService } from '@shared/services/icon-registry.service';
readonly iconRegistry = inject(IconRegistryService);

// Template
<svg [lucideIcon]="iconRegistry.get(slug || '')" size="20"></svg>
```

## Development Tools

| Tool | Version | Purpose |
|------|---------|---------|
| **Angular CLI** | v21.2.18 | Build tooling |
| **Angular Build** | v21.2.18 | Vite/Esbuild bundler |
| **ESLint** | v9.39.4 | Code linting |
| **angular-eslint** | v21.4.0 | Angular lint rules |
| **Jest** | v30.4.2 | Testing framework |
| **jest-preset-angular** | v16.2.0 | Angular + Jest integration |

## Build & Bundling

| Tool | Purpose |
|------|---------|
| **Vite** | Development server |
| **Esbuild** | Production bundler |
| **PostCSS** | CSS processing |

## Path Aliases

Configured in `tsconfig.json`:

| Alias | Path | Usage |
|-------|------|-------|
| `@core/*` | `src/app/core/*` | Global services, guards, interceptors |
| `@shared/*` | `src/app/shared/*` | Reusable UI components, layout |
| `@features/*` | `src/app/features/*` | Feature modules |
| `@env/*` | `src/environments/*` | Environment configuration |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Security Features

- JWT-based authentication
- Refresh token rotation
- HTTP interceptor for token injection
- Role-based access control
- Global error handling

---

*Last updated: May 2026*
