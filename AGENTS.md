# AGENTS.md - UyuniAdmin Frontend

Unified context file for AI agents (Kilo, Claude, Gemini, etc.). This is the single source of truth for project conventions, architecture, and standards.

## Project Identity

| Attribute | Value |
|-----------|-------|
| **Name** | Uyuni Frontend (UyuniAdmin) |
| **Version** | 1.0.3 |
| **Type** | Enterprise Admin Dashboard |
| **Framework** | Angular v21.2.17 (Standalone Components) |
| **UI** | PrimeNG v21.1.9 + Tailwind CSS v4.3.2 |
| **Architecture** | DDD Lite / Modular Monolith |
| **Language** | TypeScript 5.9.3 |
| **Status** | Production Ready |
| **Last Audit** | May 2026 |

## Quick Commands

```bash
npm start          # Development server (http://localhost:4200)
npm run build      # Production build
npm run watch      # Build in watch mode (development)
npm test           # Run all tests (Jest)
npm test -- path/to/component.spec.ts  # Run specific test
npm test -- --coverage                # Run tests with coverage
npm run lint       # Lint codebase (ESLint)
npx eslint --fix src/                 # Lint and fix
```

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Angular | 21.2.17 | Core framework |
| PrimeNG | 21.1.9 | UI component library |
| @primeuix/themes | 2.0.3 | Aura theme system |
| @lucide/angular | v1.23.0 | Primary icon library (tree-shakable) |
| PrimeIcons | 7.0.0 | Icon library (legacy, PrimeNG component props only) |
| Tailwind CSS | 4.3.2 | Utility-first CSS (v4.3.2 syntax) |
| tailwindcss-primeui | 0.6.1 | PrimeNG + Tailwind integration |
| RxJS | 7.8.2 | Async operations and HTTP |
| Zone.js | 0.16.2 | Change detection |
| Chart.js | 4.5.1 | Data visualization |
| FullCalendar | 6.1.20 | Calendar component |
| Swiper | 12.1.4 | Touch slider |
| Flatpickr | 4.6.13 | Date picker |
| PrismJS | 1.30.0 | Syntax highlighting |
| ng-otp-input | 2.0.9 | OTP input component |
| Jest | 30.4.2 | Testing framework |
| ESLint | 9.39.4 | Code linting |
| angular-eslint | 21.4.0 | Angular lint rules |
| Husky | 9.1.7 | Git hooks |
| lint-staged | 16.4.0 | Pre-commit linting |

## PrimeNG v20+ API Standards

**⚠️ CRITICAL**: This project uses PrimeNG v21.1.9. All AI agents must use the modern PrimeNG v20+ API and ignore any recommendations for v17, v18, or v19 patterns.

### Version Information
- **Current Version**: PrimeNG v21.1.9
- **Theme System**: @primeuix/themes v2.0.3 (not @primeng/themes)
- **Status**: v20+ features are stable and recommended

### PrimeNG v20+ Migration Guide

#### 1. Theme Imports (MUST USE @primeuix/themes)
```typescript
// ✅ CORRECT - v21 imports
import { Aura } from '@primeuix/themes/aura';

// ❌ FORBIDDEN - Legacy @primeng/themes
import { Aura } from '@primeng/themes/aura'; // This will show deprecation warnings
```

#### 2. Component APIs
```typescript
// ✅ CORRECT - v21 modern API
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { DataTable } from 'primeng/datatable';
import { Dialog } from 'primeng/dialog';

// ❌ FORBIDDEN - Legacy v17/v18 patterns
// Old property names like 'styleClass' are deprecated in favor of 'class'
```

#### 3. @Input/@Output to Signals Migration
```typescript
// ✅ CORRECT - v21 signal-based components
@Component({
  selector: 'app-custom-button',
  standalone: true,
  imports: [Button, CommonModule],
  templateUrl: './custom-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomButtonComponent {
  // Signal inputs (preferred)
  readonly label = input.required<string>();
  readonly icon = input<string>();
  readonly severity = input<'primary' | 'secondary' | 'success' | 'danger' | 'warn'>('primary');

  // Output signals
  readonly onClick = output<void>();

  handleClick(): void {
    this.onClick.emit();
  }
}
```

#### 4. Common v20+ Best Practices
- **No @Input/@Output decorators**: Use `input()` and `output()` functions
- **No module imports**: PrimeNG v20+ is designed for standalone components
- **@primeuix/themes**: Always use `@primeuix/themes` (NOT `@primeng/themes`)
- **No deprecated properties**: Specifically, **never** use `styleClass` on PrimeNG components; use standard `class` instead to comply with v21+ guidelines.
- **TypeScript strictness**: Use proper typing for all component properties

#### 5. Checking for Deprecation Warnings
```bash
# Build and check for deprecation warnings
npm run build

# Look for warnings like:
# - "DEPRECATED: property 'styleClass' is deprecated, use 'class'"
# - "DEPRECATED: @Input() is no longer recommended, use input()"
```

#### 6. PrimeNG Changelog Reference
- PrimeNG v20.0.0 (April 2024): Full standalone component support
- PrimeNG v21.0.0 (October 2024): Full @primeuix/themes migration
- PrimeNG v21.1.9 (Current): Bug fixes and improvements

### Action Items for AI Agents
1. **ALWAYS use PrimeNG v21 imports** from `primeng/*` or `@primeuix/themes/*`
2. **IGNORE v17/v18 recommendations** from official docs
3. **Use signal-based components** with `input()`/`output()` functions
4. **Avoid legacy decorators** `@Input()`, `@Output()`, `@InputNumber()`, etc.
5. **Check @primeuix/themes** for theme-related configurations
6. **Review PrimeNG changelog** when implementing new features
7. **NEVER use `styleClass`**: Always use standard `class` attributes on PrimeNG elements.

### Deprecation Map (v17/v18 → v21)
| Legacy (v17/v18) | Modern (v21) | Status |
|------------------|--------------|--------|
| `@Input()` decorator | `input()` function | ✅ v20+ |
| `@Output()` decorator | `output()` function | ✅ v20+ |
| `@InputNumber()` decorator | `input<number>()` | ✅ v20+ |
| `@InputText()` decorator | `input<string>()` | ✅ v20+ |
| `@primeng/themes` | `@primeuix/themes` | ✅ v21+ |
| `styleClass` property | `class` property | ✅ v21+ |
| `selection` event | `selectionChange` event | ✅ v21+ |

### Q&A
**Q: Why use v21 instead of v17/v18?**
A: v21 is the current stable version with full standalone support, better TypeScript typing, and active maintenance. Using v21 prevents deprecation warnings and future migration costs.

**Q: Will my code break if I use v21?**
A: No, v21 is backward compatible with v20. However, you should use the modern API patterns (signals, @primeuix/themes) instead of legacy decorators.

**Q: How do I know if I'm using deprecated features?**
A: Run `npm run build` and check for deprecation warnings. Also, PrimeNG v21 will emit warnings at runtime for deprecated properties.

### Lucide Icons (Primary Icon Library)

**⚠️ CRITICAL**: This project uses `@lucide/angular` v1.23.0 as the primary icon library. All new icons MUST use Lucide instead of PrimeIcons.

#### Import Pattern
```typescript
// ✅ CORRECT - Per-icon tree-shaking imports
import { LucideMenu, LucideX, LucideDynamicIcon } from '@lucide/angular';

@Component({
  imports: [LucideMenu, LucideX, LucideDynamicIcon]
})

// ❌ FORBIDDEN - Do not import LucideIcon (it's a type, not a component)
import { LucideIcon } from '@lucide/angular'; // WRONG
```

#### Static Icon Usage (template)
```html
<!-- ✅ CORRECT - Static icon with attribute selector -->
<svg lucideMenu size="20"></svg>
<svg lucideChevronDown size="16"></svg>

<!-- ❌ FORBIDDEN - PrimeIcons for general UI icons -->
<i class="pi pi-bars"></i>
<i class="pi pi-times"></i>
```

#### Dynamic Icon Usage (backend-driven)
```html
<!-- ✅ CORRECT - Slug-first approach (no icon field needed) -->
<svg [lucideIcon]="iconRegistry.get(slug || '')" size="20"></svg>

<!-- ❌ DEPRECATED - Using icon field (backend still sends but ignored) -->
<svg [lucideIcon]="iconRegistry.get(icon || slug || '')" size="20"></svg>
```

#### LucideDynamicIcon - The `[lucideIcon]` directive
- `LucideDynamicIcon` (selector: `svg[lucideIcon]`) is a standalone component that provides dynamic icon binding
- MUST be imported in any component that uses `[lucideIcon]` attribute binding
- NOT needed for static icon usage (e.g., `<svg lucideMenu>`)

#### IconRegistryService
- Location: `@shared/services/icon-registry.service.ts`
- Purpose: Maps backend slug strings → Lucide icon data (slug-first approach)
- **Slug as primary source**: Backend sends semantic slugs (e.g., `"staff"`, `"administration"`, `"admin"`), frontend resolves via IconRegistry
- **Icon field deprecated**: Backend may still send `icon` field but it's ignored in templates
- **Neutral fallback**: If slug not found, returns `LucideCircleDot` (neutral dot, not alert)
- Usage: `iconRegistry.get(slug)` returns `LucideIconData`
- No PrimeIcons mapping: legacy `PRIMEICONS_TO_ICON` removed (slug-first is the only resolution path)
- Call `iconRegistry.register(slug, iconData)` to add custom mappings
- Diagnostic: `iconRegistry.printDiagnostics()` shows which slugs resolved and which need mapping

#### Slug-First Icon System (Phase 8)
**Goal**: Make slug the primary source of truth for icon resolution, eliminating dependency on `icon` field.

**Why slug-first?**
1. Slug is semantic and sufficient for icon resolution
2. Backend already sends slug (e.g., `"staff"`, `"administration"`)
3. Eliminates `icon` field from templates (cleaner code)
4. Neutral fallback prevents confusing error alerts for unmapped slugs

**Template usage**:
```html
<!-- ✅ Slug-first (preferred) -->
<svg [lucideIcon]="iconRegistry.get(nav.slug || '')" size="20"></svg>

<!-- ❌ Icon-first (deprecated) -->
<svg [lucideIcon]="iconRegistry.get(nav.icon || nav.slug || '')" size="20"></svg>
```

**Models**:
```typescript
// ✅ Model with slug-only (icon is optional but ignored)
export interface MenuModule {
  slug: string;  // Primary source
  icon?: string; // @deprecated — kept for API compatibility only
}

// ✅ Neutral fallback in IconRegistryService
private readonly FALLBACK = LucideCircleDot.icon;  // Neutral dot, not alert
```

#### PrimeIcons Retention Policy
PrimeIcons (`pi pi-*`) are ONLY retained for:
1. **PrimeNG component `icon=""` props** (e.g., `<p-button icon="pi pi-times">`)
2. **Social/brand icons** (Facebook, Twitter, LinkedIn, Instagram) — Lucide explicitly removed brand icons
3. **Legacy backward compatibility** via `IconRegistryService` mapping

#### Icon Name Mapping (v1.16)

| Old Name | Lucide v1.16 Name |
|----------|-------------------|
| `MoreHorizontal` | `LucideEllipsis` |
| `Home` | `LucideHouse` |
| `HelpCircle` | `LucideCircleQuestionMark` |
| `CheckCircle` | `LucideCircleCheck` |
| `FilterX` | `LucideListFilter` |
| `BarChart3` | `LucideChartBar` |
| `Loader2` | `LucideLoaderCircle` |
| `ExclamationCircle` | `LucideCircleAlert` |

#### Global Configuration
- `strokeWidth: 1.5` configured in `app.config.ts` via `provideLucideConfig({ strokeWidth: 1.5 })`

## Architecture

### Directory Structure

```
src/app/
├── core/                    # Global singleton services
│   ├── auth/               # AuthService (authentication)
│   ├── config/             # ConfigService (runtime config)
│   ├── guards/             # authGuard (route protection)
│   ├── handlers/           # GlobalErrorHandler
│   ├── interceptors/       # authInterceptor, loadingInterceptor
│   ├── models/             # Global types (menu.models)
│   └── services/           # LoadingService, LoggerService, TokenRefreshService,
│                           # AuthErrorHandlerService, NetworkErrorService, BreakpointService
├── shared/                  # Reusable UI
│   ├── components/         # header/, sidebar/, ui/
│   ├── layout/             # app-layout/
│   ├── models/             # Shared types
│   ├── pipe/               # Custom pipes
│   └── services/           # ThemeService
├── features/               # Domain modules (lazy-loaded)
│   ├── auth/               # /signin, /signup
│   ├── dashboard/          # / (main dashboard)
│   ├── calendar/           # /calendar
│   ├── charts/             # /charts/bar, /charts/line
│   ├── forms/              # /forms/form-elements, /forms/form-layout
│   ├── tables/             # /tables/basic, /tables/data
│   ├── invoice/            # /invoice/list, /invoice/detail
│   ├── profile/            # /profile
│   ├── system/             # /blank, /prime-demo, /** (404)
│   └── ui/                 # /ui (UI components demo)
├── app.component.ts         # Root component + global loader
├── app.config.ts            # App configuration (PrimeNG Aura, interceptors)
└── app.routes.ts            # Root routing (lazy-loaded)
```

### Feature Module Structure

```
feature/
├── pages/                  # Smart Components (routable views)
├── components/             # Dumb Components (domain-specific UI)
├── services/               # Feature-specific API services
├── models/                 # Domain types and interfaces
└── feature.routes.ts       # Feature routing (lazy-loaded)
```

### Dependency Flow

```
Features → Core + Shared
Shared → Core
Core → Nothing (no dependencies on Features or Shared)
Features → NOT other Features directly
```

## Mandatory Standards

### 1. Path Aliases (STRICT)

```typescript
// CORRECT
import { AuthService } from '@core/auth/auth.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { User } from '@features/profile/models/user.model';

// FORBIDDEN - Deep relative imports across modules
import { AuthService } from '../../../core/auth/auth.service';
```

Aliases configured in `tsconfig.json`:
- `@core/*` → `src/app/core/*`
- `@shared/*` → `src/app/shared/*`
- `@features/*` → `src/app/features/*`
- `@env/*` → `src/environments/*`

### 2. Dependency Injection - inject()

```typescript
// CORRECT
export class MyComponent {
  private readonly authService = inject(AuthService);
}

// FORBIDDEN (legacy pattern)
export class MyComponent {
  constructor(private authService: AuthService) {}
}
```

Exception: `constructor()` is acceptable when needed for `effect()` or signal initialization.

### 3. Signals for State

```typescript
// Writable signals
isLoading = signal(false);
user = signal<User | null>(null);

// Computed signals
fullName = computed(() => `${this.user()?.firstName} ${this.user()?.lastName}`);

// Signal inputs/outputs (PREFERRED over @Input/@Output)
readonly id = input.required<string>();
readonly title = input<string>('Default');
readonly onSave = output<User>();
```

### 4. ChangeDetectionStrategy.OnPush

ALL components MUST use `ChangeDetectionStrategy.OnPush`. Currently 56/56 components comply.

### 5. Logging - LoggerService

```typescript
// CORRECT
private readonly logger = inject(LoggerService);
this.logger.info('User logged in', { userId: user.id });

// FORBIDDEN in production code
console.log('User logged in:', user);
```

### 6. TypeScript Strictness

- Zero tolerance for `any` types where avoidable
- `strict: true` enabled in tsconfig.json
- `strictNullChecks`, `noImplicitReturns`, `noFallthroughCasesInSwitch` all enabled

### 7. Component Selector Convention

- Components: `element`, `app` prefix, `kebab-case` (e.g., `<app-user-profile>`)
- Directives: `attribute`, `app` prefix, `camelCase` (e.g., `[appHighlight]`)

### 8. Lazy Loading

ALL features MUST be lazy-loaded via `loadChildren` or `loadComponent` in route definitions.

### 9. UI Language

All user-facing text MUST be in **Spanish**.

### 10. Import Sorting (ESLint enforced)

Order: Angular → PrimeNG/RxJS → Third-party → @core → @shared → @features → Relative → Styles

## Core Services API

### AuthService (`@core/auth/auth.service.ts`)
- Signals: `isAuthenticated`, `currentUser`, `roles`, `activeRole`, `isLoading`, `accessToken`
- Methods: `login()`, `logout()`, `refreshAccessToken()`, `setActiveRole()`, `refreshProfile()`, `hasRole()`

### ConfigService (`@core/config/config.service.ts`)
- Signals: `config`, `isLoaded`
- Methods: `loadConfig()`, `getApiUrl()`, `isMockAuth()`
- Config file: `public/assets/config/config.json` (gitignored, copy from `config.example.json`)

### LoadingService (`@core/services/loading.service.ts`)
- Signals: `isLoading`, `loadingCount`
- Methods: `show()`, `hide()`, `forceHide()`
- Features: 300ms debounce, 6s fail-safe timeout, navigation auto-reset

### LoggerService (`@core/services/logger.service.ts`)
- Methods: `debug()`, `info()`, `warn()`, `error()`, `setLevel()`
- Levels: debug (dev only), info, warn, error

### TokenRefreshService (`@core/services/token-refresh.service.ts`)
- Signals: `isRefreshing`
- Methods: `refreshToken()`, `queueRequest()`, `processQueue()`

### AuthErrorHandlerService (`@core/services/auth-error-handler.service.ts`)
- Methods: `handleAuthError()`, `isAuthError()`, `getErrorMessage()`

### NetworkErrorService (`@core/services/network-error.service.ts`)
- Signals: `isOnline`
- Methods: `isNetworkError()`, `retryWithBackoff()`

### CatalogService (`@core/services/catalog.service.ts`)
- Description: Stateless, batchable HTTP service to fetch multiple organizational catalogs in a single POST request to `/api/catalogs/bulk`.
- Methods: `getBulkCatalogs(request)`
- Models: `CatalogItem`, `CatalogBulkRequest`, `CatalogBulkResponse`
- Reference Guide: Detailed guide and diagram at [docs/developer_guide/catalogs_bulk_guide.md](file:///opt/uyuni/an-uyuni-frontend/docs/developer_guide/catalogs_bulk_guide.md)

### Interceptors
- `authInterceptor`: Token injection, 401/403 handling, silent refresh, `X-Active-Role` header
- `loadingInterceptor`: Global loading state, asset filtering (regex for images/fonts)

### Guards
- `authGuard`: Redirects to `/signin` if not authenticated

## Authentication

- **Flow**: OAuth2 Password Grant with JWT
- **Tokens**: Access (~30min) + Refresh (~7 days) in localStorage
- **Refresh**: Silent token refresh on 401, request queuing during refresh
- **Multi-tenant**: `X-Active-Role` header injected per request
- **Mock mode**: `config.json` → `mockAuth: true` bypasses real auth

## UI/UX Design System

### Project Type Context
**⚠️ CRITICAL**: This is an **Enterprise Administrative Dashboard (ERP-style)**, NOT a marketing/landing page website. Design decisions must reflect business/administrative applications, not consumer-facing web experiences.

### Data Density Principles for Enterprise Systems

#### Why High Density is Mandatory
1. **Information Overload Management**: ERP systems contain massive amounts of structured data
2. **Efficiency for Power Users**: Administrators use the system for 4-8+ hours daily
3. **Reduced Mouse Movement**: Compact layouts minimize cursor travel for data entry
4. **Information Hierarchy**: Dense layouts enable better scanning and pattern recognition
5. **Business Workflow**: Administrative tasks require processing thousands of records efficiently

#### High Density Guidelines
```typescript
// ✅ CORRECT - Enterprise Data Density
- Compact spacing: 4px-8px between elements
- 14px base font size (readable but efficient)
- Smaller padding in tables: 4px-8px
- Row height: 32px-40px (not 50px+)
- Column width: 80px-200px (not 200px-300px)
- Font weights: 400-500 (not 600-700)
- Dense tables: Show 15-20 rows per page (not 10)
- Compact cards: 12px-16px padding (not 20px-24px)
```

#### Low Density (Web Marketing) Patterns - FORBIDDEN
```typescript
// ❌ FORBIDDEN - Web-style layouts (NOT for this project)
- Large hero sections with lots of whitespace
- Massive buttons and cards
- 20px-30px padding everywhere
- 20-30 rows per table page
- Hero images and banners
- Newsletter sign-up forms at the top
- Marketing-oriented UI elements
```

### Current Density Standards
- **Base Font**: 14px (not 16px-18px)
- **Spacing**: 4px-8px between adjacent elements
- **Row Height**: 32px-40px in data tables
- **Padding**: 8px-12px in compact containers
- **Card Padding**: 12px-16px (not 20px-24px)
- **Table Rows**: 15-20 visible rows per page
- **Font Weight**: 400-500 for body text
- **Density Category**: High Density (B2B Enterprise)

### Enterprise-First Design Principles

1. **Information First, Visuals Second**
   - Data tables are primary interface (not dashboards)
   - Statistics visible without scrolling
   - Action buttons secondary to data presentation
   - Filter/search always prominent

2. **Efficiency Over Aesthetics**
   - Minimize clicks to complete tasks
   - Keyboard shortcuts for power users
   - Bulk operations (checkboxes, multi-select)
   - Fast navigation (breadcrumbs, quick filters)

3. **Data Integrity First**
   - Clear field labels and validation
   - Consistent data formats
   - Status indicators always visible
   - Error messages prominent

4. **Business Workflow Alignment**
   - Process flows match organizational structure
   - Approval hierarchies visible
   - Permission-based layouts
   - Audit trail indicators

5. **Professional Appearance**
   - Corporate color palette (not playful)
   - Consistent terminology (business-focused)
   - Crisp typography (not decorative)
   - Clean, organized layouts (not busy)

### Responsive Considerations (High Density)
```html
<!-- ✅ CORRECT - Dense but responsive -->
<div class="p-2">            <!-- Compact padding -->
  <p-data-table [rows]="20"> <!-- Dense pagination -->
    <p-column [style.width.px]="100"> <!-- Narrow columns -->
  </p-data-table>
</div>

<!-- ❌ FORBIDDEN - Web-style responsive -->
<div class="p-6">            <!-- Too much padding -->
  <p-data-table [rows]="10"> <!-- Too sparse -->
    <p-column [style.width.px]="200"> <!-- Too wide -->
  </p-data-table>
</div>
```

### Density Comparison Table

| Element | Web/Marketing | ERP/Enterprise (This Project) |
|---------|---------------|------------------------------|
| Font Size | 16px-18px | 14px |
| Table Rows/Page | 10-15 | 15-20 |
| Row Height | 50px+ | 32px-40px |
| Element Spacing | 12px-16px | 4px-8px |
| Card Padding | 20px-24px | 12px-16px |
| Button Size | Large (48px+) | Compact (32px-40px) |
| Focus on Visuals | Hero banners, images | Data density, clarity |
| Target Audience | General consumers | Power users/admins |
| Usage Time | Minutes | 4-8+ hours |

### Theme System
- **Theme**: PrimeNG Aura with `.dark` class for dark mode
- **Brand color**: `#38240c` (corporate, professional)
- **Density Override**: `.dense-table` class for additional compactness

### Tailwind CSS v4.3.2 Syntax Standards

**⚠️ CRITICAL**: This project uses **Tailwind CSS v4.3.2** with the new v4 syntax. All AI agents must use the canonical Tailwind v4 class order and variant syntax.

#### Tailwind v4 Canonical Class Order
```html
<!-- ✅ CORRECT - Tailwind v4 canonical order -->
<div class="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 hover:py-1! text-sm font-medium rounded-md">
  Content
</div>

<!-- ❌ FORBIDDEN - Old Tailwind v3 variant order -->
<div class="!px-4 py-2 px-4 hover:!bg-blue-600 hover:bg-blue-500">
  Content
</div>
```

#### Important Rule: The `!` Suffix Modifier Must Come Last
In Tailwind CSS v4, the important modifier is strictly a **suffix** (postfix). You must place the `!` exclamation mark at the **very end** of the class name, after the utility and any variants.

```html
<!-- ✅ CORRECT - ! modifier at the very end of the utility -->
<div class="py-1!">  <!-- v4 syntax: utility + ! suffix -->
<div class="hover:py-1!">  <!-- hover variant + utility + ! suffix -->

<!-- ❌ FORBIDDEN - ! modifier in the middle or at the start -->
<div class="!py-1">  <!-- WRONG - Old v3 syntax, will trigger warnings -->
<div class="hover:!py-1">  <!-- WRONG - Old v3 syntax with ! in the middle -->
```

#### Common Tailwind v4 Patterns

##### Modifier Order (from outer to inner)
```html
<!-- ✅ CORRECT - Complete modifier stack -->
<div class="group-hover:focus-within:dark:bg-gray-800 group-hover:dark:px-4 px-2 py-1">
  Content
</div>

<!-- Breakdown: group-hover:focus-within:dark:bg-gray-800 -->
1. group-hover:focus-within: (modifier chain)
2. dark: (dark mode modifier)
3. bg-gray-800 (utility class)
```

##### Responsive + Modifier Chain
```html
<!-- ✅ CORRECT - Responsive + modifier chain -->
<div class="lg:hover:py-2! hover:dark:bg-blue-600 hover:bg-blue-500 px-4 py-1">
  Content
</div>

<!-- Breakdown: lg:hover:py-2! -->
1. lg: (responsive breakpoint)
2. hover: (hover modifier)
3. py-2! (utility with ! important suffix modifier last)
```

##### Form & Layout Utilities
```html
<!-- ✅ CORRECT - v4 canonical order -->
<input
  class="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700
         focus:border-blue-500 focus:ring-blue-500 sm:text-sm
         focus:ring-2!"  <!-- Important suffix modifier last -->
/>

<!-- Focus ring must use ! suffix to override border width -->
```

#### Tailwind v4 vs v3 Key Differences

| Feature | Tailwind v3 (Old) | Tailwind v4 (Current) |
|---------|------------------|----------------------|
| Modifier Order | `!` can be at start or middle | `!` must be a suffix at the very end |
| Variant Chain | Chained after utility | Before utility |
| Dark Mode | `dark:` anywhere | `dark:` before utility |
| Hover Mods | `hover:dark:` not standard | `hover:dark:` is valid |
| Config | Tailwind.config.js | CSS @theme directive |

#### Deprecation Warnings to Avoid
```bash
# ❌ This will show suggestCanonicalClasses error
<div class="!py-1">  <!-- WRONG - v3 syntax -->

# ✅ Use this instead
<div class="py-1!">  <!-- CORRECT - v4 canonical syntax -->
```

#### Common Corrections
```html
<!-- Fix: !py-1 -->
<!-- ❌ Wrong -->
<div class="!py-1">

<!-- ✅ Correct -->
<div class="py-1!">

<!-- Fix: !px-4 py-2 -->
<!-- ❌ Wrong -->
<div class="!px-4 py-2">

<!-- ✅ Correct -->
<div class="px-4! py-2">

<!-- Fix: hover:!bg-blue-600 -->
<!-- ❌ Wrong -->
<div class="hover:!bg-blue-600">

<!-- ✅ Correct -->
<div class="hover:bg-blue-600!">
```

#### Best Practices for Tailwind v4
1. **Always place `!` modifier last** after all utility classes
2. **Modifier chain before utilities**: `group-hover:focus-within:dark:`
3. **Responsive modifiers**: `lg:` should be at the start
4. **Order**: `[responsive]:[modifier-chain]:[utility][!modifier]`
5. **Group variants**: `group-hover:` must come before `dark:`
6. **Documentation**: Reference https://tailwindcss.com/docs/class-order

### Accessibility (High Density Compromises)
- Maintain WCAG 2.1 AA compliance
- Increase contrast ratios for dense elements
- Larger click targets (24px+ minimum)
- Keyboard navigation fully functional
- Screen reader labels for all interactive elements

## Testing

- **Framework**: Jest 30 + jest-preset-angular 16
- **Setup**: `src/setup-jest.ts`
- **Current**: 222 tests, 11 suites (core only), all passing
- **Coverage thresholds**: 80% statements, 70% branches, 75% functions
- **Note**: Feature components have 0 test coverage (improvement needed)
- **Pattern**: Use `TestBed.runInInjectionContext()` for functional guards/interceptors

## Pre-commit Hooks

Husky v9 + lint-staged:
- `*.ts` and `*.html` → `eslint --fix` + auto-stage
- Run on every `git commit`, bypass with `--no-verify` (discouraged)

## Important Files

| File | Purpose |
|------|---------|
| `src/app/app.routes.ts` | Main router with lazy loading |
| `src/app/app.config.ts` | App config (PrimeNG, interceptors, error handler) |
| `tsconfig.json` | Path aliases + strict compiler options |
| `jest.config.js` | Test config with module mapping |
| `eslint.config.js` | ESLint + Angular rules + import sorting |
| `angular.json` | Build config, budgets (4MB warn, 5MB error) |
| `public/assets/config/config.json` | Runtime config (gitignored) |

## Known Issues (from May 2026 Audit)

| Issue | Severity | Location |
|-------|----------|----------|
| console.log in feature components | Medium | profile/ (3), tables/ (5), forms/ (1), auth/ (1) |
| Legacy @Input/@Output decorators | Low | dropdown.component.ts, signin-form.component.ts |
| `any` type usage | Low | calendar.component.ts:181, forms-overview.component.ts:75 |
| Zero feature test coverage | High | All features/ have 0 spec files |

## Reference Documentation

- [Architecture Patterns](.kilo/rules/memory-bank/architecture-patterns.md)
- [Authentication System](.kilo/rules/memory-bank/authentication.md)
- [Coding Standards](.kilo/rules/memory-bank/coding-standards.md)
- [Features & Modules](.kilo/rules/memory-bank/features-modules.md)
- [Services Reference](.kilo/rules/memory-bank/services-reference.md)
- [UI/UX Guidelines](.kilo/rules/memory-bank/ui-ux-guidelines.md)
- [Tech Stack](.kilo/rules/memory-bank/tech-stack.md)
- [Decisions History](.kilo/rules/memory-bank/decisions-history.md)
- [Project Overview](.kilo/rules/memory-bank/project-overview.md)

---
*Last updated: May 2026 | Audit v1.5*
