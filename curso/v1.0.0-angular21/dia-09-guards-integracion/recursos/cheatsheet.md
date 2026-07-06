# Día 9: Cheatsheet - Guards y Protección de Rutas

## Referencia Rápida

---

## Tipos de Guards

| Tipo | Uso | Ejemplo |
|------|-----|---------|
| `CanActivateFn` | Proteger acceso a rutas | Verificar autenticación |
| `CanDeactivateFn` | Prevenir salida de rutas | Formularios no guardados |
| `CanLoadFn` | Proteger lazy loading | Cargar módulo solo si autorizado |
| `CanMatchFn` | Routing condicional | Diferentes componentes según condición |
| `ResolveFn` | Pre-cargar datos | Cargar datos antes de navegar |

---

## Guard Básico

```typescript
// auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.parseUrl('/signin');
};
```

---

## Valores de Retorno

```typescript
// Retornar true - Permitir acceso
return true;

// Retornar false - Bloquear acceso
return false;

// Retornar UrlTree - Redirigir
return router.parseUrl('/signin');

// Retornar Observable - Asíncrono
return authService.isAuthenticated$.pipe(
  map(auth => auth ? true : router.parseUrl('/signin'))
);

// Retornar Promise - Asíncrono
return authService.checkAuth().then(auth => auth || router.parseUrl('/signin'));
```

---

## Configuración en Rutas

```typescript
// app.routes.ts
import { authGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
  // Ruta protegida con un guard
  {
    path: 'dashboard',
    canActivate: [authGuard],
    component: DashboardComponent
  },
  
  // Ruta con múltiples guards (se ejecutan en orden)
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [
      { path: 'users', component: AdminUsersComponent }
    ]
  },
  
  // Ruta pública (sin guard)
  {
    path: 'signin',
    component: SignInComponent
  }
];
```

---

## Guard con Parámetros de Ruta

```typescript
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,  // Info de la ruta
  state: RouterStateSnapshot       // URL actual
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Acceder a la URL que se intenta visitar
  const targetUrl = state.url;
  
  // Acceder a parámetros de la ruta
  const id = route.params['id'];
  
  if (authService.isAuthenticated()) {
    return true;
  }
  
  // Guardar URL original para redirección
  return router.parseUrl(`/signin?returnUrl=${encodeURIComponent(targetUrl)}`);
};
```

---

## Guard con Redirección Post-Login

```typescript
// Guard
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  const returnUrl = encodeURIComponent(state.url);
  return router.parseUrl(`/signin?returnUrl=${returnUrl}`);
};

// Componente de Login
export class SignInComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  login(credentials: LoginCredentials): void {
    this.authService.login(credentials).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigate([returnUrl]);
      }
    });
  }
}
```

---

## CanDeactivate para Formularios

```typescript
// unsaved-changes.guard.ts
import { CanDeactivateFn } from '@angular/router';
import { inject } from '@angular/core';

export interface CanComponentDeactivate {
  canDeactivate(): boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (component) => {
  return component.canDeactivate ? component.canDeactivate() : true;
};

// En el componente
export class EditUserComponent implements CanComponentDeactivate {
  hasUnsavedChanges = signal(false);

  canDeactivate(): boolean {
    if (this.hasUnsavedChanges()) {
      return confirm('¿Tienes cambios sin guardar. ¿Seguro que quieres salir?');
    }
    return true;
  }
}

// En rutas
{
  path: 'user/:id/edit',
  component: EditUserComponent,
  canDeactivate: [unsavedChangesGuard]
}
```

---

## Resolve para Pre-cargar Datos

```typescript
// user.resolver.ts
import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '@core/services/user.service';

export const userResolver: ResolveFn<User> = (route) => {
  const userService = inject(UserService);
  const id = route.params['id'];
  return userService.getUser(id);
};

// En rutas
{
  path: 'user/:id',
  component: UserDetailComponent,
  resolve: { user: userResolver }
}

// En el componente
export class UserDetailComponent {
  private readonly route = inject(ActivatedRoute);
  
  user = this.route.snapshot.data['user'];
}
```

---

## Testing de Guards

```typescript
// auth.guard.spec.ts
import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '@core/auth/auth.service';

describe('authGuard', () => {
  let mockAuthService: jest.Mocked<AuthService>;
  let mockRouter: jest.Mocked<Router>;

  beforeEach(() => {
    mockAuthService = { isAuthenticated: jest.fn() } as any;
    mockRouter = { navigate: jest.fn(), parseUrl: jest.fn() } as any;

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    });
  });

  it('should return true when authenticated', () => {
    mockAuthService.isAuthenticated.mockReturnValue(true);
    
    const result = TestBed.runInInjectionContext(() => authGuard());
    
    expect(result).toBe(true);
  });

  it('should redirect when not authenticated', () => {
    mockAuthService.isAuthenticated.mockReturnValue(false);
    mockRouter.parseUrl.mockReturnValue({ url: '/signin' } as any);
    
    const result = TestBed.runInInjectionContext(() => authGuard());
    
    expect(mockRouter.parseUrl).toHaveBeenCalledWith('/signin');
  });
});
```

---

## Errores Comunes

### Error 1: inject() Fuera de Contexto

```typescript
// ❌ INCORRECTO
const authService = inject(AuthService); // Fuera de la función

export const authGuard: CanActivateFn = () => {
  // ...
};

// ✅ CORRECTO
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService); // Dentro de la función
  // ...
};
```

### Error 2: Falta Retorno

```typescript
// ❌ INCORRECTO
export const authGuard: CanActivateFn = () => {
  if (authService.isAuthenticated()) {
    return true;
  }
  router.navigate(['/signin']);
  // Falta return false;
};

// ✅ CORRECTO
export const authGuard: CanActivateFn = () => {
  if (authService.isAuthenticated()) {
    return true;
  }
  router.navigate(['/signin']);
  return false; // ← Siempre retornar
};
```

### Error 3: Bucle Infinito

```typescript
// ❌ INCORRECTO: signin también tiene guard
{ path: 'signin', component: SignInComponent, canActivate: [authGuard] }

// ✅ CORRECTO: Rutas públicas sin guard
{ path: 'signin', component: SignInComponent }
```

---

## Comandos Útiles

```bash
# Crear archivo de guard manualmente
touch src/app/core/guards/auth.guard.ts

# Ejecutar tests del guard
npm test -- --testPathPattern=auth.guard

# Ejecutar tests con cobertura
npm test -- --testPathPattern=auth.guard --coverage

# Verificar sintaxis
npx tsc --noEmit src/app/core/guards/auth.guard.ts
```

---

## Checklist de Implementación

- [ ] Crear archivo en `src/app/core/guards/`
- [ ] Usar `CanActivateFn` como tipo
- [ ] Inyectar dependencias con `inject()`
- [ ] Retornar `true`, `false` o `UrlTree`
- [ ] Agregar a `canActivate` en rutas
- [ ] Rutas públicas SIN guard
- [ ] Escribir tests unitarios
- [ ] Verificar cobertura 100%

---

## Diagrama de Flujo

```
Usuario → Navegación → Router → Guard → ¿Autenticado?
                                              │
                                         ┌────┴────┐
                                        Sí        No
                                         │         │
                                         ▼         ▼
                                    Activar    Redirigir
                                    Ruta       /signin
```

---

*Cheatsheet del Día 9 - Guards y Protección de Rutas*
*Curso Angular 21 - UyuniAdmin Frontend*
