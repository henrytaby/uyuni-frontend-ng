# Día 9: Sistema de Autenticación - Guards y Integración

## Contenido Detallado

---

## 1. HOOK: El Problema de la Puerta Abierta

### Escenario Real

Imagina que desarrollas una aplicación bancaria. Un usuario malintencionado escribe directamente en la barra del navegador:

```
https://mibanco.com/cuentas/transferir
```

¿Qué pasa si no tienes Guards? **La página carga sin verificar si el usuario está autenticado.**

Esto es como dejar la puerta del banco abierta con todos los cajeros funcionando. Cualquiera puede entrar y operar.

### El Problema

En Angular, las rutas son accesibles por defecto. Cualquiera puede navegar a cualquier URL si conoce la dirección. Esto es un **problema de seguridad crítico**.

### La Solución

Los **Guards** son como porteros de seguridad. Verifican las credenciales antes de permitir el acceso a una ruta.

---

## 2. CONTEXTO: ¿Qué son los Guards?

### Definición

Los Guards (guardias) en Angular son funciones o clases que deciden si una ruta puede ser activada, desactivada o cargada.

### Analogía

Piensa en un guard como el **portero de un club exclusivo**:

1. Llega un cliente (usuario intenta navegar)
2. El portero verifica su membresía (Guard ejecuta su lógica)
3. Si tiene membresía → Entra (ruta se activa)
4. Si no tiene → Lo envía a la entrada principal (redirige a login)

### Tipos de Guards en Angular

| Tipo | Función | Cuándo usar |
|------|---------|-------------|
| `CanActivateFn` | ¿Puede activar esta ruta? | Proteger páginas de acceso |
| `CanDeactivateFn` | ¿Puede salir de esta ruta? | Prevenir pérdida de datos no guardados |
| `CanLoadFn` | ¿Puede cargar este módulo? | Proteger lazy loading |
| `CanMatchFn` | ¿Puede coincidir esta ruta? | Routing condicional |
| `ResolveFn` | Pre-cargar datos | Cargar datos antes de navegar |

### Guards Funcionales vs Guards de Clase

**Antes (Angular 13 y anteriores):**

```typescript
// ❌ Patrón legacy - NO usar
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  
  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    this.router.navigate(['/signin']);
    return false;
  }
}
```

**Ahora (Angular 14+):**

```typescript
// ✅ Patrón moderno - USAR
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  router.navigate(['/signin']);
  return false;
};
```

### Ventajas de los Guards Funcionales

1. **Menos código**: No necesitan decorador `@Injectable`
2. **Tree-shakeable**: Se eliminan si no se usan
3. **Consistencia**: Mismo patrón que interceptores funcionales
4. **Simplicidad**: Funciones puras, más fáciles de testear

---

## 3. EXPLICACIÓN SIMPLE: Cómo Funciona un Guard

### Flujo de Ejecución

```
Usuario hace clic en "/dashboard"
            │
            ▼
    Router recibe navegación
            │
            ▼
    ┌───────────────────┐
    │ ¿Hay Guards en    │
    │ la ruta?          │
    └───────┬───────────┘
            │
       ┌────┴────┐
       │         │
      Sí        No
       │         │
       ▼         ▼
  Ejecutar    Activar
  Guards      ruta
       │
       ▼
┌─────────────────┐
│ Guard retorna:  │
├─────────────────┤
│ true  → Activa  │
│ false → Bloquea │
│ UrlTree → Redirect │
└─────────────────┘
```

### Valores de Retorno

Un Guard puede retornar:

| Valor | Significado |
|-------|-------------|
| `true` | Permitir navegación |
| `false` | Bloquear navegación |
| `UrlTree` | Redirigir a otra ruta |
| `Observable<boolean \| UrlTree>` | Decisión asíncrona |
| `Promise<boolean \| UrlTree>` | Decisión asíncrona |

### El Código del Proyecto

Veamos el [`auth.guard.ts`](../../../src/app/core/guards/auth.guard.ts):

```typescript
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';

export const authGuard: CanActivateFn = () => {
  // 1. Inyectar dependencias
  const authService = inject(AuthService);
  const router = inject(Router);

  // 2. Verificar autenticación
  if (authService.isAuthenticated()) {
    return true;  // Usuario autenticado → Permitir acceso
  }

  // 3. Usuario no autenticado → Redirigir
  router.navigate(['/signin']);
  return false;
};
```

### Análisis Línea por Línea

1. **Importaciones**:
   - `CanActivateFn`: Tipo de guard funcional
   - `Router`: Para navegación programática
   - `inject`: Función de inyección de dependencias
   - `AuthService`: Servicio de autenticación

2. **Declaración del Guard**:
   ```typescript
   export const authGuard: CanActivateFn = () => {
   ```
   - Es una **constante** (no una clase)
   - Tipo `CanActivateFn` (función que retorna boolean/UrlTree)
   - Arrow function sin parámetros (versión simplificada)

3. **Inyección de Dependencias**:
   ```typescript
   const authService = inject(AuthService);
   const router = inject(Router);
   ```
   - `inject()` obtiene instancias del contenedor de DI
   - Funciona dentro del contexto de ejecución de Angular

4. **Lógica de Decisión**:
   ```typescript
   if (authService.isAuthenticated()) {
     return true;
   }
   ```
   - Llama al método `isAuthenticated()` del AuthService
   - Retorna `true` si el usuario está autenticado

5. **Manejo de No Autenticado**:
   ```typescript
   router.navigate(['/signin']);
   return false;
   ```
   - Redirige al usuario a la página de login
   - Retorna `false` para bloquear la navegación original

---

## 4. DEMO/CÓDIGO: Implementación Completa

### Paso 1: Crear el Guard

```bash
# Crear archivo manualmente (recomendado para Guards funcionales)
touch src/app/core/guards/auth.guard.ts
```

### Paso 2: Implementar el Guard

```typescript
// src/app/core/guards/auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/signin']);
  return false;
};
```

### Paso 3: Registrar en Rutas

```typescript
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AppLayoutComponent } from '@shared/layout/app-layout/app-layout.component';
import { authGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard], // ← Guard aplicado
    children: [
      { path: '', loadChildren: () => import('@features/dashboard/dashboard.routes').then(m => m.routes) },
      { path: 'profile', loadChildren: () => import('@features/profile/profile.routes').then(m => m.routes) },
      // ... más rutas protegidas
    ]
  },
  // Rutas públicas (sin guard)
  {
    path: '',
    loadChildren: () => import('@features/auth/auth.routes').then(m => m.routes)
  },
  { path: '**', loadComponent: () => import('@features/system/pages/not-found/not-found.component').then(m => m.NotFoundComponent) }
];
```

### Paso 4: Verificar Funcionamiento

1. Iniciar la aplicación: `npm start`
2. Abrir navegador en `http://localhost:4200`
3. Sin autenticar, intentar acceder a `/dashboard`
4. Debería redirigir automáticamente a `/signin`

### Alternativa: Usar UrlTree para Redirect

```typescript
// Versión con UrlTree (más idiomática)
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // En lugar de navigate() + return false
  // Retornamos directamente el UrlTree
  return router.parseUrl('/signin');
};
```

**Ventaja de UrlTree**: El router maneja la redirección de forma más eficiente.

---

## 5. ERROR COMÚN: Problemas Frecuentes

### Error 1: Usar `inject()` Fuera de Contexto

```typescript
// ❌ ERROR: inject() fuera del contexto de Angular
const authService = inject(AuthService); // Fuera de la función

export const authGuard: CanActivateFn = () => {
  // ...
};
```

**Problema**: `inject()` solo funciona dentro del contexto de ejecución de Angular.

**Solución**:

```typescript
// ✅ CORRECTO: inject() dentro de la función
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService); // Dentro del contexto
  // ...
};
```

### Error 2: Olvidar Retornar Valor

```typescript
// ❌ ERROR: Función sin retorno explícito
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  router.navigate(['/signin']);
  // Falta return false;
};
```

**Problema**: La función retorna `undefined` implícitamente, lo que puede causar comportamiento inesperado.

**Solución**:

```typescript
// ✅ CORRECTO: Siempre retornar valor
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  router.navigate(['/signin']);
  return false; // ← Siempre retornar
};
```

### Error 3: No Manejar Rutas Anidadas

```typescript
// ❌ Problema: Guard solo en ruta padre
{
  path: 'admin',
  canActivate: [authGuard],
  children: [
    { path: 'users', component: UsersComponent }, // ¿Hereda el guard?
    { path: 'settings', component: SettingsComponent }
  ]
}
```

**Realidad**: Los Guards en rutas padre SÍ protegen rutas hijas, pero es buena práctica ser explícito.

**Mejor Práctica**:

```typescript
// ✅ Ser explícito sobre qué se protege
{
  path: 'admin',
  canActivate: [authGuard],
  children: [
    { path: 'users', component: UsersComponent },
    { path: 'settings', component: SettingsComponent }
  ]
}
// O si necesitas protección adicional en hijas:
{
  path: 'admin',
  canActivate: [authGuard],
  children: [
    { path: 'users', component: UsersComponent, canActivate: [adminGuard] },
    { path: 'settings', component: SettingsComponent }
  ]
}
```

### Error 4: Redirección Infinita

```typescript
// ❌ ERROR: Bucle infinito
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (!authService.isAuthenticated()) {
    router.navigate(['/signin']); // ¿Y si /signin también tiene el guard?
  }
  return true;
};

// En routes:
{ path: 'signin', component: SignInComponent, canActivate: [authGuard] } // ← ERROR
```

**Problema**: Si `/signin` también tiene el guard, se crea un bucle infinito.

**Solución**: Las rutas públicas NO deben tener el guard:

```typescript
// ✅ CORRECTO: Rutas públicas sin guard
{ path: 'signin', component: SignInComponent } // Sin canActivate
```

---

## 6. MINI RETO: Implementar un Guard de Roles

### Descripción

Implementa un `adminGuard` que verifique si el usuario tiene rol de administrador.

### Requisitos

1. Crear `src/app/core/guards/admin.guard.ts`
2. Verificar que el usuario tenga el rol 'admin'
3. Si no tiene el rol, redirigir a `/dashboard`
4. Si no está autenticado, redirigir a `/signin`

### Código Base

```typescript
// src/app/core/guards/admin.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';

export const adminGuard: CanActivateFn = () => {
  // TODO: Implementar lógica
  // 1. Verificar si está autenticado
  // 2. Verificar si tiene rol 'admin'
  // 3. Redirigir según corresponda
};
```

### Solución

```typescript
// src/app/core/guards/admin.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar autenticación primero
  if (!authService.isAuthenticated()) {
    return router.parseUrl('/signin');
  }

  // Verificar rol de admin
  if (authService.hasRole('admin')) {
    return true;
  }

  // No tiene rol de admin → Redirigir a dashboard
  return router.parseUrl('/dashboard');
};
```

### Uso en Rutas

```typescript
{
  path: 'admin',
  canActivate: [authGuard, adminGuard], // Ambos guards
  children: [
    { path: 'users', component: AdminUsersComponent },
    { path: 'settings', component: AdminSettingsComponent }
  ]
}
```

---

## 7. CIERRE: Resumen y Próximos Pasos

### Resumen del Día

| Concepto | Descripción |
|----------|-------------|
| **Guard** | Función que controla acceso a rutas |
| **CanActivateFn** | Tipo de guard para activación de rutas |
| **inject()** | Función para inyección de dependencias |
| **UrlTree** | Objeto para redirecciones |
| **canActivate** | Propiedad de ruta para aplicar guards |

### Puntos Clave

1. ✅ Los Guards protegen rutas de acceso no autorizado
2. ✅ Los Guards funcionales son el patrón moderno en Angular
3. ✅ `inject()` permite obtener servicios dentro de funciones
4. ✅ Los Guards pueden retornar `true`, `false` o `UrlTree`
5. ✅ Las rutas públicas NO deben tener Guards

### Flujo de Autenticación Completo

```
┌─────────────────────────────────────────────────────────────────┐
│                    SISTEMA DE AUTENTICACIÓN                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Usuario accede a ruta protegida                             │
│              │                                                   │
│              ▼                                                   │
│  2. authGuard verifica autenticación                            │
│              │                                                   │
│         ┌────┴────┐                                              │
│        Sí         No                                             │
│         │          │                                             │
│         ▼          ▼                                             │
│  3a. Accede    3b. Redirige /signin                             │
│      a ruta          │                                           │
│         │            ▼                                           │
│         │     4. Usuario hace login                              │
│         │            │                                           │
│         │            ▼                                           │
│         │     5. AuthService.login()                            │
│         │            │                                           │
│         │            ▼                                           │
│         │     6. Guarda tokens en localStorage                   │
│         │            │                                           │
│         │            ▼                                           │
│         │     7. Redirige a ruta protegida                       │
│         │            │                                           │
│         └────────────┘                                           │
│                      │                                           │
│                      ▼                                           │
│              8. authGuard permite acceso                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Próximos Pasos

1. **Día 10**: RxJS Fundamentos - Programación reactiva
2. **Práctica**: Implementar más Guards (CanDeactivate para formularios)
3. **Proyecto**: Agregar Guards de roles a tu proyecto

### Recursos Adicionales

- [Angular Router Documentation](https://angular.io/guide/router)
- [Guards en Angular](https://angular.io/guide/router#preventing-unauthorized-access)
- [`contenido.md`](./contenido.md) - Este documento
- [`lab-01.md`](./ejercicios/lab-01.md) - Ejercicio práctico
- [`lab-02.md`](./ejercicios/lab-02.md) - Tests del Guard

---

## 8. Tests Unitarios para Guards

### Estructura de Test

```typescript
// src/app/core/guards/auth.guard.spec.ts
import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '@core/auth/auth.service';

describe('authGuard', () => {
  let mockAuthService: jest.Mocked<AuthService>;
  let mockRouter: jest.Mocked<Router>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    // Crear mocks
    mockAuthService = {
      isAuthenticated: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    mockRouter = {
      navigate: jest.fn(),
      parseUrl: jest.fn((url: string) => ({ url })),
    } as unknown as jest.Mocked<Router>;

    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = { url: '/protected' } as RouterStateSnapshot;

    // Configurar TestBed
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  describe('when user is authenticated', () => {
    it('should return true', () => {
      // Arrange
      mockAuthService.isAuthenticated.mockReturnValue(true);

      // Act
      const result = TestBed.runInInjectionContext(() =>
        authGuard(mockRoute, mockState)
      );

      // Assert
      expect(result).toBe(true);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('when user is not authenticated', () => {
    it('should return false and navigate to signin', () => {
      // Arrange
      mockAuthService.isAuthenticated.mockReturnValue(false);

      // Act
      const result = TestBed.runInInjectionContext(() =>
        authGuard(mockRoute, mockState)
      );

      // Assert
      expect(result).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/signin']);
    });
  });
});
```

### Conceptos Clave de Testing

1. **`TestBed.runInInjectionContext()`**: Ejecuta código dentro del contexto de DI de Angular
2. **Mocks**: Simulamos AuthService y Router para aislar el guard
3. **Arrange-Act-Assert**: Patrón de organización de tests

---

*Fin del contenido del Día 9*
