# New Feature Workflow

Step-by-step workflow for implementing a new feature in UyuniAdmin Frontend.

## Steps

1. **Domain Modeling**
   - Create `src/app/features/<feature>/models/<feature>.model.ts`.
   - Define TypeScript interfaces matching backend response schemas.

2. **Service Layer**
   - Create `src/app/features/<feature>/services/<feature>.service.ts`.
   - Inject `HttpClient`, `ConfigService`, and `LoggerService`.
   - Implement typed HTTP methods using reactive signals or RxJS observables.

3. **Presentational Components (Dumb)**
   - Create presentational components in `src/app/features/<feature>/components/`.
   - Use `input()`, `output()`, and `ChangeDetectionStrategy.OnPush`.
   - Style with Tailwind CSS v4 and PrimeNG components (`class`, not `styleClass`).

4. **Smart Pages (Container)**
   - Create routable views in `src/app/features/<feature>/pages/`.
   - Wire services, handle loading states, and coordinate presentation.

5. **Route Configuration**
   - Create `src/app/features/<feature>/<feature>.routes.ts`.
   - Lazy load routes in `src/app/app.routes.ts`.

6. **Quality Gate**
   - Run `npm run lint` and `npm test`.

