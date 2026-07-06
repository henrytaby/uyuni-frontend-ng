# Día 9: Evaluación - Guards y Protección de Rutas

## Preguntas de Evaluación

---

## Sección 1: Conceptos Básicos (20 puntos)

### Pregunta 1.1 (5 puntos)

**¿Qué es un Guard en Angular y cuál es su propósito principal?**

a) Un componente que muestra mensajes de error
b) Una función o clase que controla el acceso a las rutas
c) Un servicio que maneja la autenticación
d) Un interceptor para peticiones HTTP

<details>
<summary>Respuesta</summary>

**b) Una función o clase que controla el acceso a las rutas**

Los Guards en Angular son mecanismos que permiten controlar la navegación, decidiendo si una ruta puede ser activada, desactivada o cargada.
</details>

---

### Pregunta 1.2 (5 puntos)

**¿Cuál es la ventaja principal de usar Guards funcionales sobre Guards basados en clases?**

a) Son más fáciles de entender
b) Son tree-shakeable y requieren menos código
c) Funcionan mejor con RxJS
d) Son compatibles con versiones anteriores

<details>
<summary>Respuesta</summary>

**b) Son tree-shakeable y requieren menos código**

Los Guards funcionales (introducidos en Angular 14) no requieren decorador `@Injectable`, son más concisos y pueden ser eliminados por tree-shaking si no se usan.
</details>

---

### Pregunta 1.3 (5 puntos)

**¿Qué tipo de Guard usarías para prevenir que un usuario salga de un formulario con cambios no guardados?**

a) `CanActivateFn`
b) `CanDeactivateFn`
c) `CanLoadFn`
d) `ResolveFn`

<details>
<summary>Respuesta</summary>

**b) `CanDeactivateFn`**

`CanDeactivateFn` se ejecuta antes de que un usuario salga de una ruta, permitiendo verificar si hay cambios pendientes y mostrar una confirmación.
</details>

---

### Pregunta 1.4 (5 puntos)

**¿Qué valores puede retornar un Guard?**

a) Solo `true` o `false`
b) `true`, `false` o `Observable<boolean>`
c) `true`, `false`, `UrlTree`, `Observable<boolean | UrlTree>` o `Promise<boolean | UrlTree>`
d) Cualquier valor de tipo `boolean`

<details>
<summary>Respuesta</summary>

**c) `true`, `false`, `UrlTree`, `Observable<boolean | UrlTree>` o `Promise<boolean | UrlTree>`**

Un Guard puede retornar valores síncronos (`true`, `false`, `UrlTree`) o asíncronos (`Observable`, `Promise`).
</details>

---

## Sección 2: Implementación (30 puntos)

### Pregunta 2.1 (10 puntos)

**¿Qué está mal en el siguiente código?**

```typescript
const authService = inject(AuthService);

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  router.navigate(['/signin']);
};
```

<details>
<summary>Respuesta</summary>

**Errores identificados:**

1. **`inject()` fuera de contexto**: `inject(AuthService)` está fuera de la función del guard. Debe estar dentro del contexto de ejecución de Angular.

2. **Falta retorno**: Cuando el usuario no está autenticado, falta el `return false;` después de `router.navigate()`.

**Código corregido:**

```typescript
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService); // ← Dentro de la función
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  router.navigate(['/signin']);
  return false; // ← Agregar retorno
};
```
</details>

---

### Pregunta 2.2 (10 puntos)

**Escribe un Guard que verifique si el usuario tiene el rol 'admin'. Si no lo tiene, debe redirigir a '/forbidden'.**

```typescript
// Tu código aquí
```

<details>
<summary>Respuesta</summary>

```typescript
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

  // No tiene rol de admin
  return router.parseUrl('/forbidden');
};
```
</details>

---

### Pregunta 2.3 (10 puntos)

**¿Cómo configurarías múltiples Guards en una ruta? Explica el orden de ejecución.**

```typescript
// Ejemplo de configuración
{
  path: 'admin',
  canActivate: [authGuard, adminGuard],
  component: AdminComponent
}
```

<details>
<summary>Respuesta</summary>

**Configuración:**

```typescript
{
  path: 'admin',
  canActivate: [authGuard, adminGuard], // Se ejecutan de izquierda a derecha
  component: AdminComponent
}
```

**Orden de ejecución:**

1. Se ejecuta `authGuard` primero
2. Si `authGuard` retorna `true`, se ejecuta `adminGuard`
3. Si `authGuard` retorna `false` o `UrlTree`, NO se ejecuta `adminGuard`
4. Solo si ambos retornan `true`, la ruta se activa

**Importante:** Los Guards se ejecutan en orden secuencial. Si uno falla, los siguientes no se ejecutan.
</details>

---

## Sección 3: Testing (25 puntos)

### Pregunta 3.1 (10 puntos)

**¿Por qué es necesario usar `TestBed.runInInjectionContext()` al testear Guards funcionales?**

<details>
<summary>Respuesta</summary>

**Respuesta:**

`TestBed.runInInjectionContext()` es necesario porque los Guards funcionales usan `inject()` para obtener dependencias. La función `inject()` solo funciona dentro de un contexto de inyección de Angular.

Sin `runInInjectionContext()`, `inject()` lanzaría un error porque no puede resolver las dependencias fuera del contexto de DI.

**Ejemplo:**

```typescript
// ❌ Error: inject() fuera de contexto
const result = authGuard(mockRoute, mockState);

// ✅ Correcto: dentro del contexto de DI
const result = TestBed.runInInjectionContext(() =>
  authGuard(mockRoute, mockState)
);
```
</details>

---

### Pregunta 3.2 (15 puntos)

**Escribe un test para verificar que el Guard redirige a `/signin` cuando el usuario no está autenticado.**

```typescript
// Tu código aquí
```

<details>
<summary>Respuesta</summary>

```typescript
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
    mockAuthService = {
      isAuthenticated: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    mockRouter = {
      navigate: jest.fn(),
      parseUrl: jest.fn((url: string) => ({ url })),
    } as unknown as jest.Mocked<Router>;

    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = { url: '/protected' } as RouterStateSnapshot;

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  it('should redirect to /signin when user is not authenticated', () => {
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
```
</details>

---

## Sección 4: Escenarios Prácticos (25 puntos)

### Pregunta 4.1 (10 puntos)

**Un usuario intenta acceder a `/dashboard` sin estar autenticado. Describe el flujo completo de navegación.**

<details>
<summary>Respuesta</summary>

**Flujo completo:**

1. **Usuario navega**: Escribe `/dashboard` en la URL o hace clic en un enlace
2. **Router recibe navegación**: Angular Router intercepta la navegación
3. **Verifica Guards**: Router ve que `/dashboard` tiene `canActivate: [authGuard]`
4. **Ejecuta authGuard**: 
   - `authGuard` inyecta `AuthService` y `Router`
   - Llama a `authService.isAuthenticated()`
   - Retorna `false` (no autenticado)
5. **Router bloquea navegación**: La ruta `/dashboard` no se activa
6. **Redirección**: El guard llama a `router.navigate(['/signin'])` o retorna `router.parseUrl('/signin')`
7. **Nueva navegación**: Router navega a `/signin`
8. **Componente de login**: Se carga `SignInComponent`
9. **Usuario hace login**: Ingresa credenciales y se autentica
10. **Redirección post-login**: Después del login, se redirige a la URL original o al dashboard

**Diagrama:**

```
/dashboard → authGuard → isAuthenticated() = false → /signin
                                                          │
                                                          ▼
                                                    [Login Form]
                                                          │
                                                          ▼
                                                    Login success
                                                          │
                                                          ▼
                                                    /dashboard
```
</details>

---

### Pregunta 4.2 (10 puntos)

**¿Cómo implementarías un Guard que guarde la URL original y redirija después del login?**

<details>
<summary>Respuesta</summary>

**Guard con returnUrl:**

```typescript
// auth.guard.ts
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Guardar URL original como query parameter
  const returnUrl = encodeURIComponent(state.url);
  return router.parseUrl(`/signin?returnUrl=${returnUrl}`);
};
```

**Componente de Login:**

```typescript
// sign-in.component.ts
export class SignInComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  login(credentials: LoginCredentials): void {
    this.authService.login(credentials).subscribe({
      next: () => {
        // Obtener URL de retorno de query params
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigate([returnUrl]);
      },
      error: (error) => {
        // Manejar error
      }
    });
  }
}
```
</details>

---

### Pregunta 4.3 (5 puntos)

**¿Por qué es importante que las rutas públicas (como `/signin`) NO tengan el Guard aplicado?**

<details>
<summary>Respuesta</summary>

**Razón principal: Bucle infinito de redirección**

Si `/signin` tuviera el `authGuard`:

1. Usuario intenta acceder a `/dashboard`
2. `authGuard` redirige a `/signin`
3. Router intenta activar `/signin`
4. `authGuard` se ejecuta de nuevo (porque `/signin` también lo tiene)
5. Usuario no autenticado → redirige a `/signin`
6. **Bucle infinito**

**Configuración correcta:**

```typescript
// ✅ Rutas públicas SIN guard
{ path: 'signin', component: SignInComponent }

// ✅ Rutas protegidas CON guard
{
  path: 'dashboard',
  canActivate: [authGuard],
  component: DashboardComponent
}
```
</details>

---

## Puntuación Total

| Sección | Puntos | Tu Puntuación |
|---------|--------|---------------|
| Sección 1: Conceptos Básicos | 20 | |
| Sección 2: Implementación | 30 | |
| Sección 3: Testing | 25 | |
| Sección 4: Escenarios Prácticos | 25 | |
| **Total** | **100** | |

---

## Criterios de Evaluación

| Puntuación | Nivel |
|------------|-------|
| 90-100 | Excelente - Dominas completamente el tema |
| 70-89 | Bueno - Tienes una sólida comprensión |
| 50-69 | Aprobado - Necesitas reforzar algunos conceptos |
| 0-49 | Insuficiente - Revisa el contenido y vuelve a intentarlo |

---

## Respuestas Adicionales

### ¿Dónde encuentro más información?

- [Contenido del Día 9](../contenido.md)
- [Lab 01: Implementar authGuard](../ejercicios/lab-01.md)
- [Lab 02: Tests del Guard](../ejercicios/lab-02.md)
- [Documentación de Angular Router](https://angular.io/guide/router)

---

*Evaluación del Día 9 - Guards y Protección de Rutas*
*Curso Angular 21 - UyuniAdmin Frontend*
