# Coding Standards - UyuniAdmin Frontend

## General Principles

### Clean Code
- Write readable, self-documenting code
- Use meaningful names for variables, functions, and classes
- Keep functions small and focused (Single Responsibility)
- Avoid deep nesting (max 3 levels)

### SOLID Principles
- **S**ingle Responsibility: One reason to change
- **O**pen/Closed: Open for extension, closed for modification
- **L**iskov Substitution: Subtypes must be substitutable
- **I**nterface Segregation: Many specific interfaces
- **D**ependency Inversion: Depend on abstractions

---

## TypeScript Standards

### Type Safety
```typescript
// ✅ Always use explicit types
interface User {
  id: string;
  name: string;
  email: string;
}

// ❌ Avoid 'any'
const user: any = {};  // BAD

// ✅ Use specific types
const user: User = { id: '1', name: 'John', email: 'john@example.com' };
```

### Null Safety
```typescript
// ✅ Use optional chaining
const name = user?.profile?.name;

// ✅ Use nullish coalescing
const displayName = name ?? 'Unknown';

// ✅ Use type guards
function isUser(obj: unknown): obj is User {
  return typeof obj === 'object' && obj !== null && 'id' in obj;
}
```

### Readonly for Immutability
```typescript
// ✅ Use readonly for immutable data
interface Config {
  readonly apiUrl: string;
  readonly timeout: number;
}

// ✅ Use ReadonlyArray for immutable arrays
const ROLES: ReadonlyArray<string> = ['admin', 'user', 'guest'];
```

---

## Angular Standards

### Component Structure
```typescript
// Component file structure (top to bottom):
// 1. Imports
// 2. Component decorator
// 3. Component class
//    a. Signals/State
//    b. Injected services
//    c. Input/Output signals
//    d. Lifecycle hooks
//    e. Public methods
//    f. Private methods

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './example.component.html',
  styleUrl: './example.component.css'
})
export class ExampleComponent {
  // 1. Signals (State)
  isLoading = signal(false);
  data = signal<Data | null>(null);
  
  // 2. Services (inject pattern)
  private readonly dataService = inject(DataService);
  private readonly logger = inject(LoggerService);
  
  // 3. Input/Output
  readonly id = input.required<string>();
  readonly onSave = output<Data>();
  
  // 4. Lifecycle
  ngOnInit(): void {
    this.loadData();
  }
  
  // 5. Public methods
  save(): void {
    // ...
  }
  
  // 6. Private methods
  private loadData(): void {
    // ...
  }
}
```

### Dependency Injection
```typescript
// ✅ Use inject() function (Angular 14+)
export class MyComponent {
  private readonly authService = inject(AuthService);
  private readonly http = inject(HttpClient);
}

// ❌ Avoid constructor injection (legacy pattern)
export class MyComponent {
  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {}
}
```

### Signals for State
```typescript
// ✅ Use signals for reactive state
export class MyComponent {
  // Writable signals
  count = signal(0);
  user = signal<User | null>(null);
  
  // Computed signals
  doubleCount = computed(() => this.count() * 2);
  isLoggedIn = computed(() => this.user() !== null);
  
  // Effects for side effects
  constructor() {
    effect(() => {
      console.log('Count changed:', this.count());
    });
  }
}
```

### Input/Output Signals
```typescript
// ✅ Use input() and output() functions
export class MyComponent {
  // Required input
  readonly id = input.required<string>();
  
  // Optional input with default
  readonly title = input<string>('Default Title');
  
  // Output
  readonly onSave = output<User>();
  
  // Emit output
  saveUser(user: User): void {
    this.onSave.emit(user);
  }
}
```

---

## Path Aliases (MANDATORY)

### Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@core/*": ["src/app/core/*"],
      "@shared/*": ["src/app/shared/*"],
      "@features/*": ["src/app/features/*"],
      "@env/*": ["src/environments/*"]
    }
  }
}
```

### Usage
```typescript
// ✅ Correct - Use path aliases
import { AuthService } from '@core/auth/auth.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { User } from '@features/profile/models/user.model';

// ❌ Wrong - Avoid relative imports across modules
import { AuthService } from '../../../core/auth/auth.service';
```

---

## Naming Conventions

### Files
```
feature.component.ts      # Component
feature.service.ts        # Service
feature.model.ts          # Interface/Type
feature.pipe.ts           # Pipe
feature.directive.ts      # Directive
feature.guard.ts          # Guard
feature.routes.ts         # Routing
```

### Classes
```typescript
// Components: PascalCase + Component suffix
export class UserProfileComponent { }

// Services: PascalCase + Service suffix
export class AuthService { }

// Interfaces: PascalCase (no prefix)
export interface User { }

// Types: PascalCase
export type UserRole = 'admin' | 'user' | 'guest';
```

### Variables & Functions
```typescript
// Variables: camelCase
const userName = 'John';
const isLoading = true;

// Functions: camelCase
function getUserById(id: string): User { }

// Private members: prefix with underscore (only in constructors)
// Or use readonly prefix for injected services
private readonly authService = inject(AuthService);
```

### Constants
```typescript
// Constants: SCREAMING_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRIES = 3;

// Or use PascalCase for config objects
const ApiConfig = {
  baseUrl: 'https://api.example.com',
  timeout: 30000
} as const;
```

---

## Error Handling

### Try-Catch
```typescript
// ✅ Handle errors appropriately
async function fetchData(): Promise<void> {
  try {
    const data = await this.http.get<Data>('/api/data').toPromise();
    this.data.set(data);
  } catch (error) {
    this.logger.error('Failed to fetch data', error);
    this.notificationService.showError('Failed to load data');
  }
}
```

### HTTP Errors
```typescript
// ✅ Use catchError in observables
getUser(id: string): Observable<User> {
  return this.http.get<User>(`/api/users/${id}`).pipe(
    catchError(error => {
      this.logger.error('Failed to get user', error);
      return throwError(() => new Error('User not found'));
    })
  );
}
```

---

## Logging

### LoggerService Usage
```typescript
// ✅ Use LoggerService instead of console.log
export class MyComponent {
  private readonly logger = inject(LoggerService);
  
  ngOnInit(): void {
    this.logger.info('Component initialized');
    this.logger.debug('User data:', this.user());
    this.logger.error('Failed to load data', error);
    this.logger.warn('Deprecated method called');
  }
}
```

### Log Levels
- `debug`: Development details (disabled in production)
- `info`: General information
- `warn`: Warning conditions
- `error`: Error conditions

---

## Testing Standards

### Unit Tests
```typescript
// test file: my-component.component.spec.ts
describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

### Test Naming
```typescript
// ✅ Descriptive test names
it('should display user name when user is logged in', () => { });
it('should show error message when login fails', () => { });
it('should disable submit button when form is invalid', () => { });
```

---

## Code Quality Tools

### ESLint
```bash
# Run linting
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

### Husky + Lint-Staged (Pre-commit Hooks)
```bash
# Automatically runs on every git commit
git commit -m "feat: add new feature"

# Pre-commit hook executes:
# 1. npx lint-staged
# 2. eslint --fix on *.ts and *.html files
# 3. Auto-stages fixed files

# Skip hook (NOT recommended for production)
git commit --no-verify -m "WIP"
```

### TypeScript Strict Mode
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

---

## Documentation

### Code Comments
```typescript
// ✅ Use JSDoc for public APIs
/**
 * Authenticates a user with the provided credentials.
 * @param credentials - The user's login credentials
 * @returns Observable that emits the authentication result
 * @throws {AuthenticationError} If credentials are invalid
 */
login(credentials: LoginCredentials): Observable<AuthResult> { }
```

### README Updates
- Update README.md when adding new features
- Document environment variables
- Include setup instructions for new dependencies

## Icon System (Slug-First)

### Slug-First Pattern
```typescript
// ✅ CORRECT — Slug as primary source for backend-driven icons
readonly iconRegistry = inject(IconRegistryService);
// Template: iconRegistry.get(entity.slug || '')

// ❌ FORBIDDEN — Using icon field (deprecated)
// Template: iconRegistry.get(entity.icon || entity.slug || '')
```

### Icon Usage Rules
1. **PrimeNG `icon=""` prop** → Use PrimeIcons (`icon="pi pi-pencil"`) — only until PrimeNG supports Lucide
2. **Backend-driven icons** → Use `IconRegistryService` + `[lucideIcon]` binding with slug
3. **Custom template icons** → Use Lucide standalone (`<svg lucidePencil>`)
4. **Never use PrimeIcons in templates** — always prefer Lucide
5. **Never mix**: Don't use Lucide names in PrimeNG props or PrimeIcons in Lucide components

### Adding New Icons
1. Check if icon exists in Lucide: https://lucide.dev/icons/
2. For standalone use: Import in component `imports: [LucideIconName]`
3. For backend-driven use: Add mapping to `IconRegistryService.SLUG_TO_ICON`
4. For PrimeNG `icon=""` props: Continue using PrimeIcons (temporary)

### Fallback
- Unmapped slugs show `LucideCircleDot` (neutral dot, not alert)
- Register missing slugs via `iconRegistry.register(slug, iconData)`

---

*Last updated: May 2026*
