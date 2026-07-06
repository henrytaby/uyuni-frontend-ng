# Services Reference - UyuniAdmin Frontend

## Core Services Overview

All core services are located in `src/app/core/` and are provided at the root level (`providedIn: 'root'`).

---

## AuthService

**Location**: `src/app/core/auth/auth.service.ts`

**Purpose**: Central authentication service handling all auth operations.

### Public API

```typescript
class AuthService {
  // Signals (State)
  isAuthenticated: Signal<boolean>
  currentUser: Signal<User | null>
  roles: Signal<Role[]>
  activeRole: Signal<Role | null>
  isLoading: Signal<boolean>
  accessToken: Signal<string | null>
  
  // Methods
  login(username: string, password: string): Observable<void>
  logout(): void
  refreshAccessToken(): Observable<string>
  setActiveRole(role: Role): void
  refreshProfile(): Observable<void>
  hasRole(roleName: string): boolean
}
```

### Usage

```typescript
// In component
private readonly authService = inject(AuthService);

// Check authentication
if (this.authService.isAuthenticated()) {
  // User is logged in
}

// Get current user
const user = this.authService.currentUser();

// Login
this.authService.login(username, password).subscribe({
  next: () => this.router.navigate(['/']),
  error: (err) => this.handleError(err)
});

// Logout
this.authService.logout();
```

---

## ConfigService

**Location**: `src/app/core/config/config.service.ts`

**Purpose**: Load and provide application configuration from `config.json`.

### Public API

```typescript
interface AppConfig {
  apiUrl: string;
  mockAuth?: boolean;
  // ... other config properties
}

class ConfigService {
  // Signals
  config: Signal<AppConfig | null>
  isLoaded: Signal<boolean>
  
  // Methods
  loadConfig(): Promise<void>
  getApiUrl(): string
  isMockAuth(): boolean
}
```

### Usage

```typescript
private readonly configService = inject(ConfigService);

// Get API URL
const apiUrl = this.configService.getApiUrl();

// Check mock auth mode
if (this.configService.isMockAuth()) {
  // Use mock data
}
```

### Configuration File

```json
// public/assets/config/config.json
{
  "apiUrl": "http://localhost:8080/api",
  "mockAuth": false
}
```

---

## LoadingService

**Location**: `src/app/core/services/loading.service.ts`

**Purpose**: Global loading state management with request counter.

### Public API

```typescript
class LoadingService {
  // Signals
  isLoading: Signal<boolean>
  loadingCount: Signal<number>
  
  // Methods
  show(): void
  hide(): void
  forceHide(): void
}
```

### Usage

```typescript
private readonly loadingService = inject(LoadingService);

// Show loading
this.loadingService.show();

// Hide loading
this.loadingService.hide();

// Check loading state in template
@if (loadingService.isLoading()) {
  <app-spinner />
}
```

### How It Works

- Uses a counter to track concurrent requests
- `show()` increments counter
- `hide()` decrements counter
- `isLoading` returns `true` when counter > 0
- Automatically resets on navigation events

---

## LoggerService

**Location**: `src/app/core/services/logger.service.ts`

**Purpose**: Structured logging with configurable levels.

### Public API

```typescript
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class LoggerService {
  // Methods
  debug(message: string, ...args: unknown[]): void
  info(message: string, ...args: unknown[]): void
  warn(message: string, ...args: unknown[]): void
  error(message: string, ...args: unknown[]): void
  setLevel(level: LogLevel): void
}
```

### Usage

```typescript
private readonly logger = inject(LoggerService);

// Different log levels
this.logger.debug('Component initialized', { id: this.id() });
this.logger.info('User logged in', { userId: user.id });
this.logger.warn('Deprecated API called');
this.logger.error('Failed to fetch data', error);
```

### Log Level Behavior

| Level | Development | Production |
|-------|-------------|------------|
| `debug` | ✅ Shown | ❌ Hidden |
| `info` | ✅ Shown | ✅ Shown |
| `warn` | ✅ Shown | ✅ Shown |
| `error` | ✅ Shown | ✅ Shown |

---

## TokenRefreshService

**Location**: `src/app/core/services/token-refresh.service.ts`

**Purpose**: Encapsulates JWT token refresh logic.

### Public API

```typescript
class TokenRefreshService {
  // Signals
  isRefreshing: Signal<boolean>
  
  // Methods
  refreshToken(refreshToken: string): Observable<TokenResponse>
  queueRequest<T>(request: Observable<T>): Observable<T>
  processQueue(error: unknown): void
}
```

### Usage

```typescript
private readonly tokenRefreshService = inject(TokenRefreshService);

// Refresh token
this.tokenRefreshService.refreshToken(refreshToken).subscribe({
  next: (tokens) => {
    // Store new tokens
  },
  error: (err) => {
    // Handle refresh failure
  }
});
```

### How It Works

1. When a 401 error occurs, check if already refreshing
2. If refreshing, queue the request
3. If not refreshing, start refresh process
4. On success, process queued requests with new token
5. On failure, reject all queued requests

---

## AuthErrorHandlerService

**Location**: `src/app/core/services/auth-error-handler.service.ts`

**Purpose**: Centralized authentication error handling.

### Public API

```typescript
class AuthErrorHandlerService {
  // Methods
  handleAuthError(error: HttpErrorResponse): Observable<never>
  isAuthError(error: unknown): boolean
  getErrorMessage(error: HttpErrorResponse): string
}
```

### Usage

```typescript
private readonly errorHandler = inject(AuthErrorHandlerService);

// In HTTP call
this.http.get('/api/data').pipe(
  catchError(error => {
    if (this.errorHandler.isAuthError(error)) {
      return this.errorHandler.handleAuthError(error);
    }
    return throwError(() => error);
  })
);
```

### Error Handling

| Status | Action |
|--------|--------|
| 401 | Attempt token refresh or logout |
| 403 | Show account locked message |
| Other | Show generic error message |

---

## NetworkErrorService

**Location**: `src/app/core/services/network-error.service.ts`

**Purpose**: Network error detection and recovery.

### Public API

```typescript
class NetworkErrorService {
  // Signals
  isOnline: Signal<boolean>
  
  // Methods
  isNetworkError(error: unknown): boolean
  retryWithBackoff<T>(request: Observable<T>, maxRetries?: number): Observable<T>
}
```

### Usage

```typescript
private readonly networkService = inject(NetworkErrorService);

// Check network status
if (!this.networkService.isOnline()) {
  // Show offline message
}

// Retry with exponential backoff
this.networkService.retryWithBackoff(
  this.http.get('/api/data'),
  3 // max retries
).subscribe(data => {
  // Handle data
});
```

---

## Interceptors

### authInterceptor

**Location**: `src/app/core/interceptors/auth.interceptor.ts`

**Purpose**: HTTP middleware for token injection and error handling.

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Attach token to request
  // 2. Handle 401 errors (token refresh)
  // 3. Handle 403 errors (account locked)
  // 4. Inject X-Active-Role header
};
```

### loadingInterceptor

**Location**: `src/app/core/interceptors/loading.interceptor.ts`

**Purpose**: Manage global loading state during HTTP requests.

```typescript
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Show loading spinner
  // 2. Execute request
  // 3. Hide loading spinner on complete/error
};
```

---

## Guards

### authGuard

**Location**: `src/app/core/guards/auth.guard.ts`

**Purpose**: Protect routes from unauthenticated access.

```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  
  return router.parseUrl('/signin');
};
```

---

## Error Handlers

### GlobalErrorHandler

**Location**: `src/app/core/handlers/global-error-handler.ts`

**Purpose**: Catch unhandled errors at application level.

```typescript
@Injectable({ providedIn: 'root' })
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    // Log error
    // Show user-friendly message
    // Report to monitoring service
  }
}
```

---

## IconRegistryService

**Location**: `src/app/shared/services/icon-registry.service.ts`

**Purpose**: Maps backend-driven icon slug strings to Lucide icon data, providing a central registry for dynamic icon resolution.

**Slug-First Approach**:
- **Slug as primary source**: Backend sends semantic slugs (e.g., `"staff"`, `"administration"`, `"admin"`), frontend resolves via IconRegistry
- **Icon field deprecated**: Backend may still send `icon` field but it's ignored in templates (kept for API compatibility)
- **Neutral fallback**: If slug not found, returns `LucideCircleDot.icon` (neutral dot, not alert)
- **No PrimeIcons mapping**: legacy `PRIMEICONS_TO_ICON` removed (slug-first is the only resolution path)

**Usage**:
```typescript
private readonly iconRegistry = inject(IconRegistryService);

// Template (slug-first approach)
<svg [lucideIcon]="iconRegistry.get(role.slug)" size="20"></svg>

// Register custom icon:
this.iconRegistry.register('custom-slug', LucideStar.icon);
```

**API**:
```typescript
class IconRegistryService {
  get(key: string): LucideIconData
  has(key: string): boolean
  register(slug: string, icon: LucideIconData): void

  // Diagnostic methods
  getDiagnostics(): IconRegistryEntry[]
  getMissingSlugs(): string[]
  printDiagnostics(): void
}

interface IconRegistryEntry {
  key: string;
  resolved: boolean;
  source: 'slug' | 'fallback';
  count: number;
}
```

---

## Dependency Graph

```
AuthService
    ├── TokenRefreshService
    ├── LoggerService
    └── ConfigService

authInterceptor
    ├── AuthService
    ├── TokenRefreshService
    ├── AuthErrorHandlerService
    └── LoggerService

AuthErrorHandlerService
    ├── AuthService
    └── LoggerService

NetworkErrorService
    └── LoggerService

LoadingService
    └── Router (for navigation events)
```

---

*Last updated: May 2026*
