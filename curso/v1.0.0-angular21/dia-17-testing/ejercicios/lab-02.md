# Lab 02: Testing de Componentes

## Información del Lab

| Atributo | Valor |
|----------|-------|
| **Duración** | 45 minutos |
| **Dificultad** | Intermedio |
| **Objetivo** | Escribir tests unitarios para componentes Angular |

---

## Objetivos de Aprendizaje

Al completar este lab, serás capaz de:

1. Configurar ComponentFixture para testing
2. Testear inputs y outputs de componentes
3. Testear eventos del DOM
4. Mockear servicios inyectados
5. Verificar rendering de templates

---

## Prerrequisitos

- Lab 01 completado
- Conocimiento de UserDropdownComponent
- Entendimiento de signals en componentes

---

## Ejercicio 1: Testing de Componente Simple (15 min)

### Descripción

Escribir tests para un componente simple `MetricCardComponent` que:
- Acepta inputs: title, value, icon
- Emite output: cardClick
- Tiene estados: loading, error

### Código del Componente

```typescript
// src/app/shared/components/metric-card/metric-card.component.ts
@Component({
  selector: 'app-metric-card',
  standalone: true,
  template: `
    <div class="card" (click)="onCardClick()" [class.loading]="loading()">
      @if (loading()) {
        <div class="skeleton">Loading...</div>
      } @else if (error()) {
        <div class="error">{{ error() }}</div>
      } @else {
        <div class="icon">{{ icon() }}</div>
        <h3 class="title">{{ title() }}</h3>
        <p class="value">{{ value() }}</p>
      }
    </div>
  `
})
export class MetricCardComponent {
  readonly title = input<string>('');
  readonly value = input<string>('');
  readonly icon = input<string>('');
  readonly loading = input<boolean>(false);
  readonly error = input<string | null>(null);
  
  readonly cardClick = output<void>();

  onCardClick(): void {
    this.cardClick.emit();
  }
}
```

### Instrucciones Paso a Paso

#### Paso 1: Configurar el test

```typescript
// metric-card.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MetricCardComponent } from './metric-card.component';

describe('MetricCardComponent', () => {
  let component: MetricCardComponent;
  let fixture: ComponentFixture<MetricCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetricCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MetricCardComponent);
    component = fixture.componentInstance;
  });

  // Tests irán aquí
});
```

#### Paso 2: Test de creación

```typescript
it('should create', () => {
  expect(component).toBeTruthy();
});
```

#### Paso 3: Test de rendering básico

```typescript
it('should display title and value', () => {
  // Arrange
  component.title.set('Revenue');
  component.value.set('$10,000');
  
  // Act
  fixture.detectChanges();
  
  // Assert
  const titleEl = fixture.nativeElement.querySelector('.title');
  const valueEl = fixture.nativeElement.querySelector('.value');
  
  expect(titleEl.textContent).toBe('Revenue');
  expect(valueEl.textContent).toBe('$10,000');
});
```

#### Paso 4: Test de icon

```typescript
it('should display icon', () => {
  // Arrange
  component.icon.set('📊');
  
  // Act
  fixture.detectChanges();
  
  // Assert
  const iconEl = fixture.nativeElement.querySelector('.icon');
  expect(iconEl.textContent).toBe('📊');
});
```

#### Paso 5: Test de loading state

```typescript
it('should show loading skeleton when loading is true', () => {
  // Arrange
  component.loading.set(true);
  
  // Act
  fixture.detectChanges();
  
  // Assert
  const skeleton = fixture.nativeElement.querySelector('.skeleton');
  expect(skeleton).toBeTruthy();
  expect(skeleton.textContent).toContain('Loading');
  
  // No debe mostrar contenido
  const title = fixture.nativeElement.querySelector('.title');
  expect(title).toBeNull();
});
```

#### Paso 6: Test de error state

```typescript
it('should show error message when error is set', () => {
  // Arrange
  component.error.set('Failed to load data');
  
  // Act
  fixture.detectChanges();
  
  // Assert
  const errorEl = fixture.nativeElement.querySelector('.error');
  expect(errorEl).toBeTruthy();
  expect(errorEl.textContent).toBe('Failed to load data');
});
```

#### Paso 7: Test de output

```typescript
it('should emit cardClick when card is clicked', () => {
  // Arrange
  const clickSpy = jest.fn();
  component.cardClick.subscribe(clickSpy);
  fixture.detectChanges();
  
  // Act
  const card = fixture.nativeElement.querySelector('.card');
  card.click();
  
  // Assert
  expect(clickSpy).toHaveBeenCalledTimes(1);
});
```

### Solución Completa

```typescript
// metric-card.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MetricCardComponent } from './metric-card.component';

describe('MetricCardComponent', () => {
  let component: MetricCardComponent;
  let fixture: ComponentFixture<MetricCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetricCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MetricCardComponent);
    component = fixture.componentInstance;
  });

  describe('creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default values', () => {
      expect(component.title()).toBe('');
      expect(component.value()).toBe('');
      expect(component.icon()).toBe('');
      expect(component.loading()).toBe(false);
      expect(component.error()).toBeNull();
    });
  });

  describe('rendering', () => {
    it('should display title and value', () => {
      component.title.set('Revenue');
      component.value.set('$10,000');
      fixture.detectChanges();
      
      const titleEl = fixture.nativeElement.querySelector('.title');
      const valueEl = fixture.nativeElement.querySelector('.value');
      
      expect(titleEl.textContent).toBe('Revenue');
      expect(valueEl.textContent).toBe('$10,000');
    });

    it('should display icon', () => {
      component.icon.set('📊');
      fixture.detectChanges();
      
      const iconEl = fixture.nativeElement.querySelector('.icon');
      expect(iconEl.textContent).toBe('📊');
    });

    it('should apply loading class when loading', () => {
      component.loading.set(true);
      fixture.detectChanges();
      
      const card = fixture.nativeElement.querySelector('.card');
      expect(card.classList.contains('loading')).toBe(true);
    });
  });

  describe('states', () => {
    it('should show loading skeleton when loading', () => {
      component.loading.set(true);
      fixture.detectChanges();
      
      const skeleton = fixture.nativeElement.querySelector('.skeleton');
      expect(skeleton).toBeTruthy();
      expect(skeleton.textContent).toContain('Loading');
    });

    it('should not show content when loading', () => {
      component.title.set('Test');
      component.loading.set(true);
      fixture.detectChanges();
      
      const title = fixture.nativeElement.querySelector('.title');
      expect(title).toBeNull();
    });

    it('should show error message when error', () => {
      component.error.set('Failed to load');
      fixture.detectChanges();
      
      const errorEl = fixture.nativeElement.querySelector('.error');
      expect(errorEl).toBeTruthy();
      expect(errorEl.textContent).toBe('Failed to load');
    });

    it('should not show content when error', () => {
      component.title.set('Test');
      component.error.set('Error');
      fixture.detectChanges();
      
      const title = fixture.nativeElement.querySelector('.title');
      expect(title).toBeNull();
    });
  });

  describe('interactions', () => {
    it('should emit cardClick on click', () => {
      const clickSpy = jest.fn();
      component.cardClick.subscribe(clickSpy);
      fixture.detectChanges();
      
      const card = fixture.nativeElement.querySelector('.card');
      card.click();
      
      expect(clickSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit cardClick multiple times on multiple clicks', () => {
      const clickSpy = jest.fn();
      component.cardClick.subscribe(clickSpy);
      fixture.detectChanges();
      
      const card = fixture.nativeElement.querySelector('.card');
      card.click();
      card.click();
      card.click();
      
      expect(clickSpy).toHaveBeenCalledTimes(3);
    });
  });
});
```

---

## Ejercicio 2: Testing de Componente con Servicio (15 min)

### Descripción

Escribir tests para `UserDropdownComponent` que:
- Inyecta AuthService
- Muestra información del usuario
- Permite logout
- Permite cambiar rol

### Código del Componente

```typescript
// src/app/shared/components/header/user-dropdown/user-dropdown.component.ts
@Component({
  selector: 'app-user-dropdown',
  standalone: true,
  template: `
    <div class="dropdown">
      <button class="user-btn">
        <span class="user-name">{{ user()?.name }}</span>
        <span class="user-role">{{ activeRole()?.name }}</span>
      </button>
      
      <div class="dropdown-menu">
        <button class="logout-btn" (click)="onLogout()">
          Logout
        </button>
        
        @for (role of roles(); track role.id) {
          <button (click)="onRoleChange(role)">
            {{ role.name }}
          </button>
        }
      </div>
    </div>
  `
})
export class UserDropdownComponent {
  private readonly authService = inject(AuthService);
  
  user = this.authService.currentUser;
  roles = this.authService.roles;
  activeRole = this.authService.activeRole;
  
  onLogout(): void {
    this.authService.logout();
  }
  
  onRoleChange(role: Role): void {
    this.authService.setActiveRole(role);
  }
}
```

### Instrucciones Paso a Paso

#### Paso 1: Configurar el test con mock

```typescript
// user-dropdown.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDropdownComponent } from './user-dropdown.component';
import { AuthService } from '@core/auth/auth.service';
import { signal } from '@angular/core';

describe('UserDropdownComponent', () => {
  let component: UserDropdownComponent;
  let fixture: ComponentFixture<UserDropdownComponent>;
  let authServiceMock: jest.Mocked<AuthService>;

  beforeEach(async () => {
    // Crear mock del AuthService
    authServiceMock = {
      currentUser: signal({ id: '1', name: 'John Doe', email: 'john@test.com' }),
      roles: signal([
        { id: '1', name: 'admin' },
        { id: '2', name: 'user' }
      ]),
      activeRole: signal({ id: '1', name: 'admin' }),
      logout: jest.fn(),
      setActiveRole: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [UserDropdownComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserDropdownComponent);
    component = fixture.componentInstance;
  });

  // Tests irán aquí
});
```

#### Paso 2: Test de creación

```typescript
it('should create', () => {
  fixture.detectChanges();
  expect(component).toBeTruthy();
});
```

#### Paso 3: Test de visualización de usuario

```typescript
it('should display user name', () => {
  fixture.detectChanges();
  
  const userName = fixture.nativeElement.querySelector('.user-name');
  expect(userName.textContent).toBe('John Doe');
});
```

#### Paso 4: Test de visualización de rol

```typescript
it('should display active role', () => {
  fixture.detectChanges();
  
  const userRole = fixture.nativeElement.querySelector('.user-role');
  expect(userRole.textContent).toBe('admin');
});
```

#### Paso 5: Test de logout

```typescript
it('should call logout on logout button click', () => {
  fixture.detectChanges();
  
  const logoutBtn = fixture.nativeElement.querySelector('.logout-btn');
  logoutBtn.click();
  
  expect(authServiceMock.logout).toHaveBeenCalledTimes(1);
});
```

#### Paso 6: Test de cambio de rol

```typescript
it('should call setActiveRole on role button click', () => {
  fixture.detectChanges();
  
  const roleButtons = fixture.nativeElement.querySelectorAll('.dropdown-menu button');
  // Segundo botón es el primer rol (después de logout)
  roleButtons[1].click();
  
  expect(authServiceMock.setActiveRole).toHaveBeenCalledWith(
    { id: '1', name: 'admin' }
  );
});
```

### Solución Completa

```typescript
// user-dropdown.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDropdownComponent } from './user-dropdown.component';
import { AuthService } from '@core/auth/auth.service';
import { signal } from '@angular/core';

describe('UserDropdownComponent', () => {
  let component: UserDropdownComponent;
  let fixture: ComponentFixture<UserDropdownComponent>;
  let authServiceMock: jest.Mocked<AuthService>;

  const mockUser = { id: '1', name: 'John Doe', email: 'john@test.com' };
  const mockRoles = [
    { id: '1', name: 'admin' },
    { id: '2', name: 'user' }
  ];
  const mockActiveRole = { id: '1', name: 'admin' };

  beforeEach(async () => {
    authServiceMock = {
      currentUser: signal(mockUser),
      roles: signal(mockRoles),
      activeRole: signal(mockActiveRole),
      logout: jest.fn(),
      setActiveRole: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [UserDropdownComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserDropdownComponent);
    component = fixture.componentInstance;
  });

  describe('creation', () => {
    it('should create', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    it('should have user signal from AuthService', () => {
      expect(component.user()).toEqual(mockUser);
    });

    it('should have roles signal from AuthService', () => {
      expect(component.roles()).toEqual(mockRoles);
    });
  });

  describe('rendering', () => {
    it('should display user name', () => {
      fixture.detectChanges();
      
      const userName = fixture.nativeElement.querySelector('.user-name');
      expect(userName.textContent).toBe('John Doe');
    });

    it('should display active role', () => {
      fixture.detectChanges();
      
      const userRole = fixture.nativeElement.querySelector('.user-role');
      expect(userRole.textContent).toBe('admin');
    });

    it('should display all roles in dropdown', () => {
      fixture.detectChanges();
      
      const roleButtons = fixture.nativeElement.querySelectorAll('.dropdown-menu button');
      // Primer botón es logout, los demás son roles
      expect(roleButtons.length).toBe(3); // 1 logout + 2 roles
    });
  });

  describe('interactions', () => {
    it('should call logout on logout button click', () => {
      fixture.detectChanges();
      
      const logoutBtn = fixture.nativeElement.querySelector('.logout-btn');
      logoutBtn.click();
      
      expect(authServiceMock.logout).toHaveBeenCalledTimes(1);
    });

    it('should call setActiveRole on role button click', () => {
      fixture.detectChanges();
      
      const roleButtons = fixture.nativeElement.querySelectorAll('.dropdown-menu button');
      // Click en el segundo rol (user)
      roleButtons[2].click();
      
      expect(authServiceMock.setActiveRole).toHaveBeenCalledWith(mockRoles[1]);
    });
  });

  describe('reactive updates', () => {
    it('should update when user changes', () => {
      fixture.detectChanges();
      
      // Cambiar el usuario
      authServiceMock.currentUser.set({ id: '2', name: 'Jane Doe', email: 'jane@test.com' });
      fixture.detectChanges();
      
      const userName = fixture.nativeElement.querySelector('.user-name');
      expect(userName.textContent).toBe('Jane Doe');
    });

    it('should update when active role changes', () => {
      fixture.detectChanges();
      
      // Cambiar el rol activo
      authServiceMock.activeRole.set({ id: '2', name: 'user' });
      fixture.detectChanges();
      
      const userRole = fixture.nativeElement.querySelector('.user-role');
      expect(userRole.textContent).toBe('user');
    });
  });
});
```

---

## Ejercicio 3: Testing de Guards (15 min)

### Descripción

Escribir tests para el `authGuard` que:
- Retorna true cuando está autenticado
- Redirige a login cuando no está autenticado
- Preserva la URL original

### Código del Guard

```typescript
// src/app/core/guards/auth.guard.ts
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.parseUrl('/signin');
};
```

### Solución Completa

```typescript
// auth.guard.spec.ts
import { authGuard } from './auth.guard';
import { AuthService } from '@core/auth/auth.service';
import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

describe('authGuard', () => {
  let mockAuthService: jest.Mocked<AuthService>;
  let mockRouter: jest.Mocked<Router>;
  let mockRoute: any;
  let mockState: any;

  beforeEach(() => {
    mockAuthService = {
      isAuthenticated: signal(false)
    } as any;

    mockRouter = {
      parseUrl: jest.fn().mockReturnValue('/signin')
    } as any;

    mockRoute = {} as any;
    mockState = { url: '/dashboard' } as any;

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    });
  });

  describe('when authenticated', () => {
    it('should return true', () => {
      mockAuthService.isAuthenticated = signal(true);

      const result = TestBed.runInInjectionContext(() => 
        authGuard(mockRoute, mockState)
      );

      expect(result).toBe(true);
    });

    it('should not call router.parseUrl', () => {
      mockAuthService.isAuthenticated = signal(true);

      TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      expect(mockRouter.parseUrl).not.toHaveBeenCalled();
    });
  });

  describe('when not authenticated', () => {
    it('should return UrlTree', () => {
      mockAuthService.isAuthenticated = signal(false);

      const result = TestBed.runInInjectionContext(() => 
        authGuard(mockRoute, mockState)
      );

      expect(result).not.toBe(true);
    });

    it('should redirect to /signin', () => {
      mockAuthService.isAuthenticated = signal(false);

      TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      expect(mockRouter.parseUrl).toHaveBeenCalledWith('/signin');
    });
  });
});
```

---

## Verificación

### Correr los tests

```bash
# Correr tests de componentes
npm test -- --testPathPattern="components"

# Correr tests de guards
npm test -- --testPathPattern="guards"

# Coverage completo
npm run test:coverage
```

### Resultado Esperado

```
PASS src/app/shared/components/metric-card/metric-card.component.spec.ts
PASS src/app/shared/components/header/user-dropdown/user-dropdown.component.spec.ts
PASS src/app/core/guards/auth.guard.spec.ts

Test Suites: 3 passed, 3 total
Tests:       30 passed, 30 total
```

---

## Checklist de Completitud

- [ ] MetricCardComponent tiene tests para todos los estados
- [ ] UserDropdownComponent tiene tests con mock de AuthService
- [ ] authGuard tiene tests para ambos escenarios
- [ ] Todos los tests pasan
- [ ] Coverage es mayor a 80%

---

## Retos Adicionales

### Reto 1: Testear componente con formulario

Escribir tests para un componente con reactive forms.

### Reto 2: Testear componente con async pipe

Escribir tests para un componente que usa async pipe.

### Reto 3: Testear interceptor

Escribir tests para el authInterceptor.

---

*Lab 02 - Día 17 - Testing - Curso Angular 21*
