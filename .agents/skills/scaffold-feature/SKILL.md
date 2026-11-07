---
name: scaffold-feature
description: Guide and instructions to create a new DDD Lite feature module in UyuniAdmin Frontend.
---

# Scaffold Feature Module Skill

## When to Use
Use this skill whenever you need to create a new domain module in `src/app/features/<feature-name>`.

## Feature Directory Structure
```
src/app/features/<feature-name>/
├── pages/                  # Smart Components (routable views, handle data coordination)
│   └── <feature>-page/     # e.g., staff-page.component.ts
├── components/             # Dumb Components (presentational UI, pure inputs/outputs)
│   ├── <feature>-list/
│   └── <feature>-form/
├── services/               # Feature-specific services (API calls, state, filters)
│   └── <feature>.service.ts
├── models/                 # Domain types and interfaces
│   └── <feature>.model.ts
└── <feature-name>.routes.ts # Feature routing with lazy loading
```

## Mandatory Standards to Enforce

1. **Standalone Components**: Do NOT generate `NgModule`.
2. **OnPush**: Every component must have `changeDetection: ChangeDetectionStrategy.OnPush`.
3. **Signals**:
   - Inputs: `readonly data = input<MyModel>();`
   - Outputs: `readonly onSave = output<MyModel>();`
4. **Dependency Injection**:
   - Use `private readonly service = inject(MyService);`
5. **Path Aliases**:
   - Use `@core/*`, `@shared/*`, `@features/*`, `@env/*`.
6. **Icons**:
   - Use `@lucide/angular` static components (e.g. `LucidePlus`) or `LucideDynamicIcon` with `iconRegistry.get(...)`.
7. **Routing**:
   - Export `routes: Routes = [...]` in `<feature-name>.routes.ts`.
   - Register route in `src/app/app.routes.ts` via `loadChildren: () => import('@features/<feature>/<feature>.routes').then(m => m.routes)`.

