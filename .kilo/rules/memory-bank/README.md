# Memory Bank - UyuniAdmin Frontend

## 📚 Overview

This memory bank contains comprehensive documentation about the UyuniAdmin Frontend project. It serves as a knowledge base for Kilo Code (and other AI assistants) to understand the project's architecture, patterns, and conventions.

> **Note**: This memory-bank is located in `.kilocode/rules/memory-bank/` which is the standard location for Kilo Code memory-bank files.

## 📁 File Structure

| File | Description |
|------|-------------|
| [`project-overview.md`](./project-overview.md) | Project identity, purpose, and quick start |
| [`tech-stack.md`](./tech-stack.md) | Technologies, frameworks, and dependencies |
| [`architecture-patterns.md`](./architecture-patterns.md) | Architectural decisions and patterns |
| [`authentication.md`](./authentication.md) | Authentication system details |
| [`features-modules.md`](./features-modules.md) | Feature modules documentation |
| [`coding-standards.md`](./coding-standards.md) | Code style and conventions |
| [`ui-ux-guidelines.md`](./ui-ux-guidelines.md) | UI/UX design system |
| [`services-reference.md`](./services-reference.md) | Core services API reference |
| [`decisions-history.md`](./decisions-history.md) | Technical decisions and lessons |

## 🚀 Quick Reference

### Project Info
- **Name**: UyuniAdmin Frontend
- **Framework**: Angular v21
- **UI**: PrimeNG v21 + Tailwind CSS v4
- **Architecture**: DDD Lite / Modular Monolith

### Key Commands
```bash
npm start      # Development server
npm run build  # Production build
npm test       # Run tests
npm run lint   # Lint code
```

### Path Aliases
| Alias | Usage |
|-------|-------|
| `@core/*` | Global services, guards, interceptors |
| `@shared/*` | Reusable UI components |
| `@features/*` | Feature modules |
| `@env/*` | Environment config |

### Core Services
| Service | Purpose |
|---------|---------|
| `AuthService` | Authentication |
| `ConfigService` | Configuration |
| `LoadingService` | Loading state |
| `LoggerService` | Logging |
| `TokenRefreshService` | Token renewal |

### Feature Modules
- `auth` - Authentication pages
- `dashboard` - Main dashboard
- `calendar` - Calendar feature
- `charts` - Data visualization
- `forms` - Form components
- `tables` - Data tables
- `invoice` - Invoice management
- `profile` - User profile
- `system` - System pages (404, blank)
- `ui` - UI components demo

## 🔗 Related Documentation

### Project Docs (`/docs`)
- [`ARCHITECTURE.md`](../../../docs/ARCHITECTURE.md) - Detailed architecture guide
- [`AUTHENTICATION.md`](../../../docs/AUTHENTICATION.md) - Auth system documentation
- [`ENTERPRISE_ARCHITECTURE.md`](../../../docs/ENTERPRISE_ARCHITECTURE.md) - Enterprise patterns
- [`DEPLOYMENT_GUIDE.md`](../../../docs/DEPLOYMENT_GUIDE.md) - Deployment instructions
- [`LAYOUT_GUIDE.md`](../../../docs/LAYOUT_GUIDE.md) - Layout system guide
- [`LOADING_SKELETON_SYSTEM.md`](../../../docs/LOADING_SKELETON_SYSTEM.md) - Loading patterns
- [`NETWORK_RESILIENCE.md`](../../../docs/NETWORK_RESILIENCE.md) - Network error handling

### AI Context
- [`GEMINI.md`](../../../GEMINI.md) - AI context file for Gemini

### Project Rules
- [`project-rules.md`](../project-rules.md) - Quick reference rules for Kilo Code

## 📝 Recent Changes (January 2026)

1. **Legacy Refactoring**: Removed `_legacy` folder
2. **Route Correction**: Full lazy loading implemented
3. **inject() Migration**: Core services refactored
4. **Asset Cleanup**: Removed unused images
5. **404 Redesign**: New minimalist error page
6. **PrimeNG v21**: Migrated to @primeuix/themes
7. **Tailwind v4**: Updated configuration
8. **Layout Signals**: Migrated to Angular Signals
9. **Clean Code**: Added LoggerService, TokenRefreshService, AuthErrorHandlerService
10. **Security**: Updated swiper to v12 (vulnerability fix)

## 🎯 Enterprise Score

**Current Score: 7.85/10**

| Category | Score |
|----------|-------|
| Architecture | 8.5/10 |
| Clean Code | 7.5/10 |
| Security | 8/10 |
| Performance | 8/10 |
| Testing | 6/10 |
| Documentation | 8/10 |

### Improvement Areas
- [ ] Increase unit test coverage
- [ ] Add E2E tests
- [ ] Implement error boundaries
- [ ] Add performance monitoring

---

*Memory Bank created: March 2026*
*Last updated: March 2026*
