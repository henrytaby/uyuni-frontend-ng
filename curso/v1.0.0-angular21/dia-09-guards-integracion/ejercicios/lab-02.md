# Lab 02: Tests del Guard

## Objetivo

Escribir tests unitarios completos para el `authGuard` usando Jest.

## Tiempo Estimado

45 minutos

## Prerrequisitos

- Haber completado el Lab 01
- Conocer los fundamentos de testing con Jest
- Entender el uso de mocks

---

## Ejercicio 1: Configurar el Archivo de Test

### Instrucciones

1. Crea el archivo `src/app/core/guards/auth.guard.spec.ts`
2. Configura los mocks necesarios
3. Configura el TestBed

### Código Inicial

```typescript
// src/app/core/guards/auth.guard.spec.ts
import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '@core/auth/auth.service';

describe('authGuard', () => {
  // TODO: Configurar mocks y TestBed
});
```

### Solución Esperada

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
});
```

---

## Ejercicio 2: Test de Usuario Autenticado

### Instrucciones

1. Escribe un test que verifique que el guard retorna `true` cuando el usuario está autenticado
2. Verifica que NO se llama a `router.navigate`

### Código Base

```typescript
describe('when user is authenticated', () => {
  it('should return true', () => {
    // TODO: Implementar test
  });
});
```

### Solución Esperada

```typescript
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
```

### Conceptos Clave

- **`TestBed.runInInjectionContext()`**: Ejecuta código dentro del contexto de DI de Angular
- **Arrange-Act-Assert**: Patrón de organización de tests
- **`mockReturnValue()`**: Configura el valor de retorno del mock

---

## Ejercicio 3: Test de Usuario No Autenticado

### Instrucciones

1. Escribe un test que verifique que el guard retorna `false` cuando el usuario NO está autenticado
2. Verifica que se llama a `router.navigate` con `/signin`

### Código Base

```typescript
describe('when user is not authenticated', () => {
  it('should return false and navigate to signin', () => {
    // TODO: Implementar test
  });
});
```

### Solución Esperada

```typescript
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

  it('should call router.navigate with correct route', () => {
    // Arrange
    mockAuthService.isAuthenticated.mockReturnValue(false);

    // Act
    TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

    // Assert
    expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/signin']);
  });
});
```

---

## Ejercicio 4: Test de Llamada a isAuthenticated

### Instrucciones

1. Escribe un test que verifique que `isAuthenticated` se llama exactamente una vez
2. Verifica que NO se llama a `router.navigate` cuando está autenticado

### Solución Esperada

```typescript
describe('authentication check', () => {
  it('should call isAuthenticated exactly once', () => {
    // Arrange
    mockAuthService.isAuthenticated.mockReturnValue(true);

    // Act
    TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

    // Assert
    expect(mockAuthService.isAuthenticated).toHaveBeenCalledTimes(1);
  });

  it('should not call router.navigate when authenticated', () => {
    // Arrange
    mockAuthService.isAuthenticated.mockReturnValue(true);

    // Act
    TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

    // Assert
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
```

---

## Ejercicio 5: Tests de Edge Cases

### Instrucciones

1. Escribe tests para casos edge:
   - Múltiples llamadas independientes
   - Valores truthy/falsy (no estrictamente booleanos)

### Solución Esperada

```typescript
describe('edge cases', () => {
  it('should handle multiple calls independently', () => {
    // Primera llamada - autenticado
    mockAuthService.isAuthenticated.mockReturnValue(true);
    const result1 = TestBed.runInInjectionContext(() =>
      authGuard(mockRoute, mockState)
    );
    expect(result1).toBe(true);

    // Segunda llamada - no autenticado
    mockAuthService.isAuthenticated.mockReturnValue(false);
    const result2 = TestBed.runInInjectionContext(() =>
      authGuard(mockRoute, mockState)
    );
    expect(result2).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/signin']);
  });

  it('should work when isAuthenticated returns truthy value (not strictly boolean)', () => {
    // Arrange - algunas implementaciones retornan valores truthy
    mockAuthService.isAuthenticated.mockReturnValue(1 as unknown as boolean);

    // Act
    const result = TestBed.runInInjectionContext(() =>
      authGuard(mockRoute, mockState)
    );

    // Assert - el guard retorna true (truthy se convierte a true)
    expect(result).toBe(true);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should work when isAuthenticated returns falsy value (not strictly false)', () => {
    // Arrange
    mockAuthService.isAuthenticated.mockReturnValue(0 as unknown as boolean);

    // Act
    const result = TestBed.runInInjectionContext(() =>
      authGuard(mockRoute, mockState)
    );

    // Assert - el guard retorna false (falsy se convierte a false)
    expect(result).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/signin']);
  });
});
```

---

## Ejercicio 6: Test con UrlTree

### Contexto

Si el guard usa `router.parseUrl()` en lugar de `navigate()`, necesitamos ajustar los tests.

### Instrucciones

1. Modifica los tests para manejar el caso de `UrlTree`
2. Verifica que `parseUrl` se llama con la URL correcta

### Solución Esperada

```typescript
describe('with UrlTree redirect', () => {
  it('should return UrlTree when not authenticated', () => {
    // Arrange
    mockAuthService.isAuthenticated.mockReturnValue(false);
    mockRouter.parseUrl.mockReturnValue({ url: '/signin' } as any);

    // Act
    const result = TestBed.runInInjectionContext(() =>
      authGuard(mockRoute, mockState)
    );

    // Assert
    expect(result).toEqual({ url: '/signin' });
    expect(mockRouter.parseUrl).toHaveBeenCalledWith('/signin');
  });

  it('should include return URL in redirect', () => {
    // Arrange
    mockAuthService.isAuthenticated.mockReturnValue(false);
    mockState = { url: '/dashboard' } as RouterStateSnapshot;
    mockRouter.parseUrl.mockImplementation((url: string) => ({ url }));

    // Act
    const result = TestBed.runInInjectionContext(() =>
      authGuard(mockRoute, mockState)
    );

    // Assert
    expect(mockRouter.parseUrl).toHaveBeenCalled();
    // Verificar que incluye returnUrl
    const callArg = mockRouter.parseUrl.mock.calls[0][0];
    expect(callArg).toContain('returnUrl');
  });
});
```

---

## Ejercicio 7: Test con LoggerService

### Contexto

Si el guard usa `LoggerService` para logging, necesitamos mockearlo.

### Instrucciones

1. Agrega el mock de `LoggerService`
2. Verifica que se llaman los métodos de logging

### Solución Esperada

```typescript
import { LoggerService } from '@core/services/logger.service';

describe('authGuard with LoggerService', () => {
  let mockLogger: jest.Mocked<LoggerService>;

  beforeEach(() => {
    mockLogger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: LoggerService, useValue: mockLogger },
      ],
    });
  });

  it('should log debug message when checking access', () => {
    // Arrange
    mockAuthService.isAuthenticated.mockReturnValue(true);
    mockState = { url: '/dashboard' } as RouterStateSnapshot;

    // Act
    TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

    // Assert
    expect(mockLogger.debug).toHaveBeenCalledWith(
      expect.stringContaining('authGuard')
    );
  });

  it('should log info message when access denied', () => {
    // Arrange
    mockAuthService.isAuthenticated.mockReturnValue(false);
    mockState = { url: '/dashboard' } as RouterStateSnapshot;

    // Act
    TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

    // Assert
    expect(mockLogger.info).toHaveBeenCalledWith(
      expect.stringContaining('denegado')
    );
  });
});
```

---

## Ejercicio 8: Cobertura de Código

### Instrucciones

1. Ejecuta los tests con cobertura
2. Verifica que la cobertura sea del 100%

### Comandos

```bash
# Ejecutar tests con cobertura
npm test -- --coverage --testPathPattern=auth.guard

# Ver reporte de cobertura
cat coverage/lcov-report/core/guards/auth.guard.ts.html
```

### Métricas Esperadas

| Métrica | Objetivo |
|---------|----------|
| Statements | 100% |
| Branches | 100% |
| Functions | 100% |
| Lines | 100% |

---

## Archivo de Test Completo

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

    it('should call router.navigate with correct route', () => {
      // Arrange
      mockAuthService.isAuthenticated.mockReturnValue(false);

      // Act
      TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      // Assert
      expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/signin']);
    });
  });

  describe('authentication check', () => {
    it('should call isAuthenticated exactly once', () => {
      // Arrange
      mockAuthService.isAuthenticated.mockReturnValue(true);

      // Act
      TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      // Assert
      expect(mockAuthService.isAuthenticated).toHaveBeenCalledTimes(1);
    });

    it('should not call router.navigate when authenticated', () => {
      // Arrange
      mockAuthService.isAuthenticated.mockReturnValue(true);

      // Act
      TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      // Assert
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle multiple calls independently', () => {
      // Primera llamada - autenticado
      mockAuthService.isAuthenticated.mockReturnValue(true);
      const result1 = TestBed.runInInjectionContext(() =>
        authGuard(mockRoute, mockState)
      );
      expect(result1).toBe(true);

      // Segunda llamada - no autenticado
      mockAuthService.isAuthenticated.mockReturnValue(false);
      const result2 = TestBed.runInInjectionContext(() =>
        authGuard(mockRoute, mockState)
      );
      expect(result2).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/signin']);
    });

    it('should work when isAuthenticated returns truthy value', () => {
      mockAuthService.isAuthenticated.mockReturnValue(1 as unknown as boolean);
      const result = TestBed.runInInjectionContext(() =>
        authGuard(mockRoute, mockState)
      );
      expect(result).toBe(true);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should work when isAuthenticated returns falsy value', () => {
      mockAuthService.isAuthenticated.mockReturnValue(0 as unknown as boolean);
      const result = TestBed.runInInjectionContext(() =>
        authGuard(mockRoute, mockState)
      );
      expect(result).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/signin']);
    });
  });
});
```

---

## Validación Final

### Ejecutar Tests

```bash
# Ejecutar todos los tests del guard
npm test -- --testPathPattern=auth.guard

# Ejecutar con verbose
npm test -- --testPathPattern=auth.guard --verbose

# Ejecutar con cobertura
npm test -- --testPathPattern=auth.guard --coverage
```

### Resultado Esperado

```
PASS src/app/core/guards/auth.guard.spec.ts
  authGuard
    when user is authenticated
      ✓ should return true (5 ms)
    when user is not authenticated
      ✓ should return false and navigate to signin (2 ms)
      ✓ should call router.navigate with correct route (1 ms)
    authentication check
      ✓ should call isAuthenticated exactly once (1 ms)
      ✓ should not call router.navigate when authenticated (1 ms)
    edge cases
      ✓ should handle multiple calls independently (2 ms)
      ✓ should work when isAuthenticated returns truthy value (1 ms)
      ✓ should work when isAuthenticated returns falsy value (1 ms)

Test Suites: 1 passed, 1 total
Tests:       8 passed, 8 total
```

### Checklist

- [ ] El archivo `auth.guard.spec.ts` existe
- [ ] Todos los tests pasan
- [ ] La cobertura es del 100%
- [ ] Se testean casos edge
- [ ] Se usan mocks correctamente

---

## Siguiente Paso

Continúa con la [Evaluación](../assessment/preguntas.md) para verificar tu comprensión del tema.

---

*Lab 02 - Tests del Guard*
*Curso Angular 21 - UyuniAdmin Frontend*
