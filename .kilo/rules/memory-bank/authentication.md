# Authentication System - UyuniAdmin Frontend

## Overview

The authentication system uses **OAuth2 Password Grant** with **JWT (JSON Web Tokens)**. It's designed for security, robustness, and network fault tolerance.

## Token Strategy

| Token Type | Lifetime | Storage |
|------------|----------|---------|
| **Access Token** | ~30 minutes | localStorage |
| **Refresh Token** | ~7 days | localStorage |

## Key Components

### Core Services

| Service | Location | Purpose |
|---------|----------|---------|
| `AuthService` | `core/auth/auth.service.ts` | Login, logout, session management |
| `TokenRefreshService` | `core/services/token-refresh.service.ts` | Token renewal logic |
| `AuthErrorHandlerService` | `core/services/auth-error-handler.service.ts` | Error handling |
| `LoggerService` | `core/services/logger.service.ts` | Structured logging |
| `ConfigService` | `core/config/config.service.ts` | Configuration loading |

### Interceptors

| Interceptor | Purpose |
|-------------|---------|
| `auth.interceptor.ts` | Token injection, error handling, silent refresh |
| `loading.interceptor.ts` | Global loading state management |

### Guards

| Guard | Purpose |
|-------|---------|
| `auth.guard.ts` | Route protection, authentication check |

## Authentication Flow

### Login Process

```
User Input → SignInComponent → AuthService.login()
    ↓
POST /auth/login (x-www-form-urlencoded)
    ↓
┌─────────────────────────────────────────┐
│ Success (200):                          │
│   - Store tokens in localStorage        │
│   - Load user profile                   │
│   - Redirect to dashboard               │
├─────────────────────────────────────────┤
│ Invalid Credentials (401):              │
│   - Show error message                  │
│   - Allow retry                         │
├─────────────────────────────────────────┤
│ Account Locked (403):                   │
│   - Show lockout time                   │
│   - Disable login form                  │
└─────────────────────────────────────────┘
```

### Silent Token Refresh

```
HTTP Request → 401 Response
    ↓
Is Login URL? → YES → Propagate error
    ↓ NO
Is Refreshing? → YES → Queue request
    ↓ NO
Has Refresh Token? → NO → Logout
    ↓ YES
POST /auth/refresh
    ↓
┌─────────────────────────────────────────┐
│ Success:                                │
│   - Store new tokens                    │
│   - Retry queued requests               │
├─────────────────────────────────────────┤
│ Failure:                                │
│   - Clear session                       │
│   - Redirect to login                   │
└─────────────────────────────────────────┘
```

## State Management

### Auth State (Signals)

```typescript
// AuthService signals
isAuthenticated = signal<boolean>(false);
currentUser = signal<User | null>(null);
roles = signal<Role[]>([]);
activeRole = signal<Role | null>(null);
isLoading = signal<boolean>(false);
```

### Token Storage

```typescript
// localStorage keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data'
};
```

## Role-Based Access

### Role Context

The system supports multi-role users. The active role is sent with every request:

```typescript
// Automatic header injection
X-Active-Role: <role_id>
```

### Role Switching

Users with multiple roles can switch between them via the header dropdown. This triggers a profile reload and updates the active role context.

## Security Features

### Token Handling
- Automatic token attachment to requests
- Silent refresh before expiration
- Secure token storage in localStorage
- Token cleanup on logout

### Error Handling
- 401: Automatic refresh attempt
- 403: Account locked notification
- Network errors: Graceful degradation

### Session Management
- Auto-logout on token expiration
- Session persistence across tabs
- Clean state cleanup on logout

## Configuration

### Mock Authentication (Development)

```json
// public/assets/config/config.json
{
  "mockAuth": true,
  "apiUrl": "http://localhost:8080/api"
}
```

When `mockAuth` is `true`, the system bypasses real authentication for development.

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/login` | POST | Authenticate user |
| `/auth/refresh` | POST | Refresh access token |
| `/auth/logout` | POST | Invalidate session |
| `/user/profile` | GET | Get user data and roles |

## Best Practices

### DO ✅
- Use `inject()` for service injection
- Handle errors with `AuthErrorHandlerService`
- Log important events with `LoggerService`
- Use signals for reactive state

### DON'T ❌
- Store tokens in sessionStorage (loses persistence)
- Handle auth errors directly in components
- Use `console.log` for production logging
- Create circular dependencies between services

## Files Reference

```
src/app/
├── core/
│   ├── auth/
│   │   └── auth.service.ts           # Main auth service
│   ├── interceptors/
│   │   └── auth.interceptor.ts       # HTTP middleware
│   ├── guards/
│   │   └── auth.guard.ts             # Route protection
│   └── services/
│       ├── token-refresh.service.ts  # Token renewal
│       └── auth-error-handler.service.ts  # Error handling
├── features/
│   └── auth/
│       ├── pages/
│       │   ├── sign-in/              # Login page
│       │   └── sign-up/              # Registration page
│       └── models/
│           └── auth.models.ts        # Auth types
└── shared/
    └── components/
        └── header/
            └── user-dropdown/        # Logout button
```

---

*Last updated: May 2026*
