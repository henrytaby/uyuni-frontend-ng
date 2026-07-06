# Día 9: Sistema de Autenticación - Guards y Integración

## Diapositivas de Presentación

---

## Slide 1: Portada

# 🛡️ Guards y Protección de Rutas

## Día 9 - Sistema de Autenticación

**Curso Angular 21 - UyuniAdmin Frontend**

---

## Slide 2: El Problema

# 🔓 La Puerta Abierta

### ¿Qué pasa si un usuario accede directamente a:

```
https://miapp.com/admin/usuarios
```

### Sin Guards:
- ❌ La página carga sin verificar autenticación
- ❌ Datos sensibles expuestos
- ❌ Vulnerabilidad de seguridad crítica

### Con Guards:
- ✅ Se verifica autenticación antes de cargar
- ✅ Redirección automática a login
- ✅ Protección de rutas sensibles

---

## Slide 3: ¿Qué son los Guards?

# 🛡️ Guards en Angular

### Definición
Funciones o clases que deciden si una ruta puede ser activada, desactivada o cargada.

### Analogía: El Portero del Club

```
┌─────────────────┐
│   CLIENTE       │
│   (Usuario)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   PORTERO       │
│   (Guard)       │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
   Sí        No
  (tiene    (no tiene
  membresía) membresía)
    │         │
    ▼         ▼
  ENTRAR   ENTRADA
  RUTA     PRINCIPAL
```

---

## Slide 4: Tipos de Guards

# 📋 Tipos de Guards en Angular

| Tipo | Propósito | Uso Común |
|------|-----------|-----------|
| `CanActivateFn` | ¿Puede activar? | Proteger páginas |
| `CanDeactivateFn` | ¿Puede salir? | Formularios no guardados |
| `CanLoadFn` | ¿Puede cargar módulo? | Lazy loading protegido |
| `CanMatchFn` | ¿Puede coincidir? | Routing condicional |
| `ResolveFn` | Pre-cargar datos | Cargar datos antes de navegar |

---

## Slide 5: Guards Funcionales vs Clases

# 🔄 Evolución de Guards

### Antes (Angular 13-)

```typescript
// ❌ Patrón legacy
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  canActivate(): boolean {
    // ...
  }
}
```

### Ahora (Angular 14+)

```typescript
// ✅ Patrón moderno
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  // ...
};
```

---

## Slide 6: Ventajas de Guards Funcionales

# ✅ ¿Por qué usar Guards Funcionales?

### Beneficios

1. **Menos código**
   - Sin decorador `@Injectable`
   - Sin constructor

2. **Tree-shakeable**
   - Se eliminan si no se usan
   - Bundles más pequeños

3. **Consistencia**
   - Mismo patrón que interceptores
   - API unificada

4. **Testeabilidad**
   - Funciones puras
   - Más fáciles de mockear

---

## Slide 7: Código del Proyecto

# 📝 auth.guard.ts

```typescript
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;  // ✅ Usuario autenticado
  }

  router.navigate(['/signin']);
  return false;   // ❌ Usuario no autenticado
};
```

---

## Slide 8: Flujo de Ejecución

# 🔄 Flujo del Guard

```
Usuario navega a "/dashboard"
            │
            ▼
    Router recibe navegación
            │
            ▼
    ┌───────────────────┐
    │ ¿Hay canActivate? │
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
│ true  → Activa  │
│ false → Bloquea │
│ UrlTree → Redirect │
└─────────────────┘
```

---

## Slide 9: Valores de Retorno

# 📤 ¿Qué puede retornar un Guard?

| Valor | Efecto |
|-------|--------|
| `true` | ✅ Permitir navegación |
| `false` | ❌ Bloquear navegación |
| `UrlTree` | 🔀 Redirigir a otra ruta |
| `Observable<boolean>` | ⏳ Decisión asíncrona |
| `Promise<boolean>` | ⏳ Decisión asíncrona |

### Ejemplo con UrlTree

```typescript
// Más idiomático
return router.parseUrl('/signin');

// En lugar de
router.navigate(['/signin']);
return false;
```

---

## Slide 10: Integración en Rutas

# 🔗 Configuración en app.routes.ts

```typescript
import { authGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard], // ← Guard aplicado
    children: [
      { path: '', loadChildren: () => import('./dashboard.routes') },
      { path: 'profile', loadChildren: () => import('./profile.routes') },
      // ... más rutas protegidas
    ]
  },
  // Rutas públicas (sin guard)
  { path: 'signin', component: SignInComponent },
  { path: '**', component: NotFoundComponent }
];
```

---

## Slide 11: Error Común #1

# ❌ Error: inject() Fuera de Contexto

```typescript
// ❌ INCORRECTO
const authService = inject(AuthService); // Fuera de la función

export const authGuard: CanActivateFn = () => {
  // Error: inject() fuera de contexto
};
```

```typescript
// ✅ CORRECTO
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService); // Dentro del contexto
  // ...
};
```

### Regla
`inject()` solo funciona dentro del contexto de ejecución de Angular.

---

## Slide 12: Error Común #2

# ❌ Error: Olvidar Retornar Valor

```typescript
// ❌ INCORRECTO
export const authGuard: CanActivateFn = () => {
  if (authService.isAuthenticated()) {
    return true;
  }
  router.navigate(['/signin']);
  // Falta return false;
};
```

```typescript
// ✅ CORRECTO
export const authGuard: CanActivateFn = () => {
  if (authService.isAuthenticated()) {
    return true;
  }
  router.navigate(['/signin']);
  return false; // ← Siempre retornar
};
```

---

## Slide 13: Error Común #3

# ❌ Error: Bucle Infinito

```typescript
// ❌ INCORRECTO: signin también tiene guard
{ path: 'signin', component: SignInComponent, canActivate: [authGuard] }
```

### Problema
1. Usuario accede a `/dashboard`
2. Guard redirige a `/signin`
3. `/signin` también tiene guard
4. Guard redirige a `/signin` → **BUCLE INFINITO**

```typescript
// ✅ CORRECTO: Rutas públicas sin guard
{ path: 'signin', component: SignInComponent } // Sin canActivate
```

---

## Slide 14: Mini Reto

# 🎯 Reto: Implementar adminGuard

### Requisitos
1. Crear `admin.guard.ts`
2. Verificar si usuario tiene rol 'admin'
3. Si no tiene rol → redirigir a `/dashboard`
4. Si no está autenticado → redirigir a `/signin`

### Código Base

```typescript
export const adminGuard: CanActivateFn = () => {
  // TODO: Implementar
};
```

---

## Slide 15: Solución del Reto

# ✅ Solución: adminGuard

```typescript
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Verificar autenticación
  if (!authService.isAuthenticated()) {
    return router.parseUrl('/signin');
  }

  // 2. Verificar rol
  if (authService.hasRole('admin')) {
    return true;
  }

  // 3. No es admin
  return router.parseUrl('/dashboard');
};
```

---

## Slide 16: Uso de Múltiples Guards

# 🔐 Guards Encadenados

```typescript
{
  path: 'admin',
  canActivate: [authGuard, adminGuard], // Se ejecutan en orden
  children: [
    { path: 'users', component: AdminUsersComponent },
    { path: 'settings', component: AdminSettingsComponent }
  ]
}
```

### Orden de Ejecución

```
1. authGuard → ¿Está autenticado?
      │
      ▼ (true)
2. adminGuard → ¿Tiene rol admin?
      │
      ▼ (true)
3. Activar ruta
```

---

## Slide 17: Testing de Guards

# 🧪 Estructura de Test

```typescript
describe('authGuard', () => {
  let mockAuthService: jest.Mocked<AuthService>;
  let mockRouter: jest.Mocked<Router>;

  beforeEach(() => {
    mockAuthService = { isAuthenticated: jest.fn() };
    mockRouter = { navigate: jest.fn(), parseUrl: jest.fn() };
    
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
});
```

---

## Slide 18: Flujo Completo de Autenticación

# 🔄 Visión General del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    SISTEMA DE AUTENTICACIÓN                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Usuario → Ruta Protegida → authGuard → ¿Autenticado?       │
│                                           │                  │
│                                      ┌────┴────┐             │
│                                     Sí         No            │
│                                      │          │            │
│                                      ▼          ▼            │
│                               Acceder      /signin           │
│                               ruta                           │
│                                                              │
│  Login → AuthService → Token → localStorage                 │
│                         │                                    │
│                         ▼                                    │
│              authInterceptor → HTTP requests                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Slide 19: Resumen del Día

# 📝 Lo que Aprendimos

| Concepto | Descripción |
|----------|-------------|
| **Guard** | Función que controla acceso a rutas |
| **CanActivateFn** | Tipo de guard para activación |
| **inject()** | Inyección de dependencias en funciones |
| **UrlTree** | Redirecciones idiomáticas |
| **canActivate** | Propiedad de ruta para guards |

### Puntos Clave

1. ✅ Guards protegen rutas de acceso no autorizado
2. ✅ Guards funcionales son el patrón moderno
3. ✅ `inject()` obtiene servicios en funciones
4. ✅ Siempre retornar valor (true/false/UrlTree)
5. ✅ Rutas públicas NO llevan Guards

---

## Slide 20: Próximos Pasos

# 🚀 ¿Qué Sigue?

### Día 10: RxJS Fundamentos
- Programación reactiva
- Observables y Observers
- Operadores básicos

### Práctica Recomendada
- Implementar `CanDeactivateFn` para formularios
- Crear Guards específicos por roles
- Escribir tests para tus Guards

### Recursos
- [`contenido.md`](./contenido.md) - Teoría completa
- [`lab-01.md`](./ejercicios/lab-01.md) - Ejercicios prácticos
- [`lab-02.md`](./ejercicios/lab-02.md) - Tests

---

## Slide 21: Cierre

# 🎉 ¡Gracias!

## Preguntas y Discusión

### Recursos del Día
- 📄 [Contenido Detallado](./contenido.md)
- 🔬 [Lab 01: Implementar Guard](./ejercicios/lab-01.md)
- 🧪 [Lab 02: Tests](./ejercicios/lab-02.md)
- 📝 [Evaluación](./assessment/preguntas.md)

---

*Curso de Angular 21 - UyuniAdmin Frontend*
*Día 9: Guards y Protección de Rutas*
