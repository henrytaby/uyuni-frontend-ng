# Angular Standards - UyuniAdmin Frontend

## Core Framework Version
- **Angular**: v21.2.17
- **TypeScript**: 5.9.3 (Strict mode enabled)
- **Change Detection**: Zone.js 0.16.2 with mandatory `ChangeDetectionStrategy.OnPush`

## 1. Standalone Components
All components, directives, and pipes must be standalone (`standalone: true` or default in v21).
```typescript
@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule, Button],
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserCardComponent {}
```

## 2. Mandatory OnPush Change Detection
Every component without exception must specify:
```typescript
changeDetection: ChangeDetectionStrategy.OnPush
```

## 3. Signal-Based Reactivity
Prefer Angular Signals over legacy `@Input()` and `@Output()` decorators:
```typescript
// ✅ Modern Signal API (v20+)
readonly id = input.required<string>();
readonly label = input<string>('Default');
readonly isOpen = signal(false);
readonly onSelect = output<string>();

// Computed values
readonly upperLabel = computed(() => this.label().toUpperCase());

// ❌ FORBIDDEN: Legacy Decorators
@Input() id!: string;
@Output() onSelect = new EventEmitter<string>();
```

## 4. Dependency Injection via inject()
Use `inject()` instead of constructor injection:
```typescript
// ✅ Modern inject() pattern
export class UserListComponent {
  private readonly userService = inject(UserService);
  private readonly logger = inject(LoggerService);
  private readonly router = inject(Router);
}

// ❌ Legacy constructor injection
export class UserListComponent {
  constructor(private userService: UserService) {}
}
```

## 5. Strict Path Aliases
Always import across architectural boundaries using tsconfig aliases:
- `@core/*` -> `src/app/core/*`
- `@shared/*` -> `src/app/shared/*`
- `@features/*` -> `src/app/features/*`
- `@env/*` -> `src/environments/*`

Relative imports (`../../`) across modules are strictly forbidden.

## 6. Logging
Use `LoggerService` from `@core/services/logger.service`:
```typescript
// ✅ Use LoggerService
private readonly logger = inject(LoggerService);
this.logger.info('Action executed', { id });

// ❌ NEVER use console.log in production code
console.log('Action executed', id);
```

