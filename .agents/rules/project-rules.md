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

Detailed documentation is available in `.agents/memory/`:

| File | Description |
|------|-------------|
| [`project-overview.md`](../memory/project-overview.md) | Project identity and purpose |
| [`tech-stack.md`](../memory/tech-stack.md) | Technologies and dependencies |
| [`architecture-patterns.md`](../memory/architecture-patterns.md) | Architectural decisions |
| [`authentication.md`](../memory/authentication.md) | Auth system documentation |
| [`features-modules.md`](../memory/features-modules.md) | Feature modules reference |
| [`coding-standards.md`](../memory/coding-standards.md) | Code style conventions |
| [`ui-ux-guidelines.md`](../memory/ui-ux-guidelines.md) | Design system |
| [`services-reference.md`](../memory/services-reference.md) | Core services API |
| [`decisions-history.md`](../memory/decisions-history.md) | Technical decisions log |

## 🚀 Quick Commands

```bash
npm start      # Development server
npm run build  # Production build
npm test       # Run tests
npm run lint   # Lint code
```

---

*Last updated: July 2026*
