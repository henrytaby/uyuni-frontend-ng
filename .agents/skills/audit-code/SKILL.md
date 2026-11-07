---
name: audit-code
description: Audit project components and services against Angular 21, PrimeNG 21, and Tailwind v4 conventions.
---

# Code Audit Skill

## When to Use
Use this skill before opening PRs, committing code, or completing feature development to ensure 100% architectural compliance.

## Audit Checklist

### 1. Angular 21 & Reactivity
- [ ] Every component has `changeDetection: ChangeDetectionStrategy.OnPush`.
- [ ] No `@Input()` or `@Output()` decorators; use `input()` and `output()` signal functions.
- [ ] No constructor DI; use `inject(...)`.
- [ ] No relative cross-module imports (`../../../`); use `@core`, `@shared`, `@features`, `@env`.

### 2. Clean Code & Logging
- [ ] No `console.log`, `console.warn`, or `console.error` in production code. Use `inject(LoggerService)`.
- [ ] No `any` types where an interface or type can be defined.

### 3. PrimeNG & Theming
- [ ] No imports from `@primeng/themes`; always use `@primeuix/themes`.
- [ ] No `styleClass` attributes on PrimeNG components; use standard `class`.
- [ ] No `pi pi-*` icons for general UI; use `@lucide/angular`.

### 4. Tailwind CSS v4
- [ ] Suffix `!` used for important utilities (e.g. `py-1!`, `hover:py-1!`), never prefix `!py-1`.
- [ ] Follows ERP high-density spacing (padding 8-16px, row height 32-40px).

## Verification Commands
```bash
# Lint checks
npm run lint

# Build check (validates AOT and TypeScript compilation)
npm run build

# Unit tests
npm test
```

