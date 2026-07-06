# Tech Stack - UyuniAdmin Frontend

## Core Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| **Angular** | v21.2.17 | Core framework |
| **@angular/cdk** | v21.2.14 | Component Dev Kit (BreakpointService, a11y utilities) |
| **TypeScript** | v5.9.3 | Primary language |
| **Zone.js** | v0.16.2 | Change detection |
| **tslib** | v2.8.1 | Runtime helpers for TS decorators |

## UI Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| **PrimeNG** | v21.1.9 | UI component library (MIT - last open source version) |
| **@primeuix/themes** | v2.0.3 | Theme system (Aura) |
| **PrimeIcons** | v7.0.0 | Icon library (PrimeNG component props + social/brand icons only) |
| **Tailwind CSS** | v4.3.2 | Utility-first CSS |
| **@tailwindcss/postcss** | v4.3.2 | Tailwind v4 PostCSS plugin |
| **tailwindcss-primeui** | v0.6.1 | PrimeNG + Tailwind integration |
| **postcss** | v8.5.16 | CSS processing pipeline |

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
| **Chart.js** | v4.5.1 | Data visualization (used via PrimeNG `ChartModule`) |
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
| **typescript-eslint** | v8.62.1 | TypeScript ESLint rules |
| **eslint-plugin-simple-import-sort** | v13.0.0 | Import sorting (enforces order: Angular → PrimeNG/RxJS → @core → @shared → @features) |
| **Jest** | v30.4.2 | Testing framework |
| **jest-preset-angular** | v16.2.0 | Angular + Jest integration |
| **jest-environment-jsdom** | v30.4.1 | DOM environment for Jest |
| **@types/jest** | v30.0.0 | TypeScript definitions for Jest |
| **Husky** | v9.1.7 | Git hooks |
| **lint-staged** | v16.4.0 | Pre-commit linting |

## Build & Bundling

| Tool | Purpose |
|------|---------|
| **Vite** | Development server |
| **Esbuild** | Production bundler |
| **PostCSS** | CSS processing via `@tailwindcss/postcss` |

## Dependency Overrides

| Package | Version | Reason |
|---------|---------|--------|
| **undici** | ^7.18.2 | Security/compatibility override |

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

*Last updated: July 2026*
