# Project Rules - UyuniAdmin Frontend

## 🎯 Project Identity

| Attribute | Value |
|-----------|-------|
| **Name** | UyuniAdmin Frontend |
| **Framework** | Angular v21 (Standalone Components) |
| **UI** | PrimeNG v21 + Tailwind CSS v4 |
| **Architecture** | DDD Lite / Modular Monolith |

## 📁 Project Structure

```
src/app/
├── core/           # Global singleton services
├── shared/         # Reusable UI components
├── features/       # Feature modules (lazy-loaded)
└── app.config.ts   # Application configuration
```

## 🔑 Key Principles

### 1. Path Aliases (MANDATORY)
```typescript
// ✅ Correct - Use path aliases
import { AuthService } from '@core/auth/auth.service';
import { ButtonComponent } from '@shared/components/button/button.component';

// ❌ Wrong - Avoid relative imports across modules
import { AuthService } from '../../../core/auth/auth.service';
```

### 2. Dependency Injection
```typescript
// ✅ Use inject() function (Angular 14+)
export class MyComponent {
  private readonly authService = inject(AuthService);
}

// ❌ Avoid constructor injection (legacy pattern)
export class MyComponent {
  constructor(private authService: AuthService) {}
}
```

### 3. Signals for State
```typescript
// ✅ Use signals for reactive state
isLoading = signal(false);
user = signal<User | null>(null);
fullName = computed(() => `${this.user()?.firstName} ${this.user()?.lastName}`);
```

### 4. Logging
```typescript
// ✅ Use LoggerService instead of console.log
private readonly logger = inject(LoggerService);
this.logger.info('User logged in', { userId: user.id });

// ❌ Never use console.log in production code
console.log('User logged in:', user);
```

## 📚 Memory Bank

Detailed documentation is available in the memory-bank:

| File | Description |
|------|-------------|
| [`memory-bank/project-overview.md`](memory-bank/project-overview.md) | Project identity and purpose |
| [`memory-bank/tech-stack.md`](memory-bank/tech-stack.md) | Technologies and dependencies |
| [`memory-bank/architecture-patterns.md`](memory-bank/architecture-patterns.md) | Architectural decisions |
| [`memory-bank/authentication.md`](memory-bank/authentication.md) | Auth system documentation |
| [`memory-bank/features-modules.md`](memory-bank/features-modules.md) | Feature modules reference |
| [`memory-bank/coding-standards.md`](memory-bank/coding-standards.md) | Code style conventions |
| [`memory-bank/ui-ux-guidelines.md`](memory-bank/ui-ux-guidelines.md) | Design system |
| [`memory-bank/services-reference.md`](memory-bank/services-reference.md) | Core services API |
| [`memory-bank/decisions-history.md`](memory-bank/decisions-history.md) | Technical decisions log |

## 🚀 Quick Commands

```bash
npm start      # Development server
npm run build  # Production build
npm test       # Run tests
npm run lint   # Lint code
```

---

*Last updated: May 2026*
