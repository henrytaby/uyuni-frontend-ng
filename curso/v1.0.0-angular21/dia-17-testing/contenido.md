# Contenido Detallado: Día 17 - Testing

## Overview

| Sección | Duración | Descripción |
|---------|----------|-------------|
| 1. Hook | 5 min | Introducción con problema real |
| 2. Contexto | 10 min | Por qué testing importa |
| 3. Explicación | 40 min | Jest, TestBed, técnicas |
| 4. Demo | 30 min | Testing en vivo |
| 5. Error Común | 15 min | Errores típicos |
| 6. Mini Reto | 20 min | Ejercicio práctico |
| 7. Cierre | 10 min | Resumen y próximos pasos |

---

## 1. Hook: El Bug que Costó Millones (5 min)

### Historia Real

"En 2012, Knight Capital Group perdió $440 millones en 45 minutos por un bug en su software de trading. El bug fue causado por código que no debería estar activo, pero nadie lo testeó."

### Conexión con Angular

"En aplicaciones Angular, los bugs pueden ser igual de costosos:

- Un usuario no puede loguearse → Pérdida de ventas
- Un formulario no valida → Datos corruptos
- Un guard no funciona → Brecha de seguridad

Testing no es opcional. Es tu red de seguridad."

### Pregunta Inicial

"¿Cuántas veces has desplegado código que rompió algo en producción? Testing previene eso."

---

## 2. Contexto: Por Qué Testing Importa (10 min)

### Tipos de Testing

| Tipo | Propósito | Velocidad |
|------|-----------|-----------|
| **Unit** | Testear unidades aisladas | Rápido |
| **Integration** | Testear interacciones | Medio |
| **E2E** | Testear flujos completos | Lento |

### Pirámide de Testing

```
        /\
       /  \
      / E2E\        <- Pocos, lentos
     /------\
    /Integration\   <- Algunos
   /------------\
  /   Unit Tests  \  <- Muchos, rápidos
 /----------------\
```

### Beneficios del Unit Testing

1. **Detecta bugs temprano**: Antes de que lleguen a producción
2. **Documenta comportamiento**: Los tests son documentación viva
3. **Facilita refactoring**: Si los tests pasan, el código funciona
4. **Mejora el diseño**: Código testeable es código bien diseñado

### Testing en Angular 21

Angular 21 usa **Jest** por defecto (desde Angular 19). Antes se usaba Jasmine + Karma.

**Ventajas de Jest:**
- Más rápido (parallel test execution)
- Mejor DX (watch mode, snapshots)
- Mejor mocking
- Coverage integrado

---

## 3. Explicación: Testing en Angular (40 min)

### 3.1 Configuración de Jest

#### jest.config.js

```javascript
// jest.config.js
module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 75,
      lines: 80,
      statements: 80
    }
  }
};
```

#### setup-jest.ts

```typescript
// setup-jest.ts
import '@angular/compiler';
import '@angular/compiler-cli';
```

#### package.json scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### 3.2 Testing de Servicios

#### Estructura Básica

```typescript
// logger.service.spec.ts
describe('LoggerService', () => {
  let service: LoggerService;

  beforeEach(() => {
    // Arrange: Configurar el entorno
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggerService);
  });

  it('should be created', () => {
    // Assert: Verificar resultado
    expect(service).toBeTruthy();
  });

  it('should log info messages', () => {
    // Arrange
    const consoleSpy = jest.spyOn(console, 'info');
    
    // Act: Ejecutar la acción
    service.info('Test message');
    
    // Assert
    expect(consoleSpy).toHaveBeenCalledWith('[INFO]', 'Test message');
    consoleSpy.mockRestore();
  });
});
```

#### AAA Pattern

```
Arrange → Act → Assert
```

1. **Arrange**: Configurar el entorno del test
2. **Act**: Ejecutar la acción a testear
3. **Assert**: Verificar el resultado

### 3.3 Testing de Signals

#### Testear Signal Writable

```typescript
describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('should update loading state', () => {
    // Arrange
    expect(service.isLoading()).toBe(false);
    
    // Act
    service.show();
    
    // Assert
    expect(service.isLoading()).toBe(true);
    
    // Act
    service.hide();
    
    // Assert
    expect(service.isLoading()).toBe(false);
  });

  it('should handle concurrent requests', () => {
    // Arrange
    service.show();
    service.show();
    expect(service.loadingCount()).toBe(2);
    
    // Act
    service.hide();
    
    // Assert
    expect(service.isLoading()).toBe(true);
    expect(service.loadingCount()).toBe(1);
  });
});
```

#### Testear Computed Signal

```typescript
describe('AuthService computed signals', () => {
  it('should compute isAdmin correctly', () => {
    // Arrange
    const mockUser = { id: '1', name: 'Admin', role: 'admin' };
    service.currentUser.set(mockUser);
    
    // Act
    const isAdmin = service.isAdmin();
    
    // Assert
    expect(isAdmin).toBe(true);
  });
});
```

### 3.4 Mocking de Dependencias

#### Mock de HttpClient

```typescript
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';

describe('ConfigService', () => {
  let service: ConfigService;
  let httpMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    httpMock = {
      get: jest.fn()
    } as any;

    TestBed.configureTestingModule({
      providers: [
        ConfigService,
        { provide: HttpClient, useValue: httpMock }
      ]
    });

    service = TestBed.inject(ConfigService);
  });

  it('should load config from API', () => {
    // Arrange
    const mockConfig = { apiUrl: 'http://test.api' };
    httpMock.get.mockReturnValue(of(mockConfig));

    // Act
    service.loadConfig();

    // Assert
    expect(httpMock.get).toHaveBeenCalledWith('/assets/config/config.json');
  });

  it('should handle load error', async () => {
    // Arrange
    httpMock.get.mockReturnValue(throwError(() => new Error('Network error')));

    // Act & Assert
    await expect(service.loadConfig()).rejects.toThrow('Network error');
  });
});
```

#### Mock de Servicio

```typescript
describe('UserDropdownComponent', () => {
  let component: UserDropdownComponent;
  let fixture: ComponentFixture<UserDropdownComponent>;
  let authServiceMock: jest.Mocked<AuthService>;

  beforeEach(async () => {
    authServiceMock = {
      currentUser: signal(null),
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

  it('should call logout on button click', () => {
    // Arrange
    fixture.detectChanges();
    const logoutButton = fixture.nativeElement.querySelector('.logout-btn');

    // Act
    logoutButton.click();

    // Assert
    expect(authServiceMock.logout).toHaveBeenCalled();
  });
});
```

### 3.5 Testing de Componentes

#### Componente Básico

```typescript
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

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

  it('should emit cardClick on click', () => {
    // Arrange
    const spy = jest.fn();
    component.cardClick.subscribe(spy);
    
    // Act
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.card').click();
    
    // Assert
    expect(spy).toHaveBeenCalled();
  });
});
```

#### Testing de Inputs/Outputs

```typescript
describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
  });

  it('should accept label input', () => {
    // Act
    component.label.set('Click me');
    fixture.detectChanges();
    
    // Assert
    const button = fixture.nativeElement.querySelector('button');
    expect(button.textContent).toContain('Click me');
  });

  it('should emit onClick when clicked', () => {
    // Arrange
    const clickSpy = jest.fn();
    component.onClick.subscribe(clickSpy);
    
    // Act
    fixture.detectChanges();
    fixture.nativeElement.querySelector('button').click();
    
    // Assert
    expect(clickSpy).toHaveBeenCalled();
  });

  it('should be disabled when disabled input is true', () => {
    // Act
    component.disabled.set(true);
    fixture.detectChanges();
    
    // Assert
    const button = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBe(true);
  });
});
```

### 3.6 Testing de Guards

```typescript
import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

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

  it('should return true when authenticated', () => {
    // Arrange
    mockAuthService.isAuthenticated = signal(true);

    // Act
    const result = TestBed.runInInjectionContext(() => 
      authGuard(mockRoute, mockState)
    );

    // Assert
    expect(result).toBe(true);
  });

  it('should redirect to signin when not authenticated', () => {
    // Arrange
    mockAuthService.isAuthenticated = signal(false);

    // Act
    const result = TestBed.runInInjectionContext(() => 
      authGuard(mockRoute, mockState)
    );

    // Assert
    expect(result).not.toBe(true);
    expect(mockRouter.parseUrl).toHaveBeenCalledWith('/signin');
  });
});
```

### 3.7 Testing de Interceptors

```typescript
import { authInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';
import { HttpErrorResponse, HttpRequest, HttpHandler } from '@angular/common/http';
import { of, throwError } from 'rxjs';

describe('authInterceptor', () => {
  let mockAuthService: jest.Mocked<AuthService>;
  let mockHandler: jest.MockedFunction<any>;
  let mockRequest: HttpRequest<any>;

  beforeEach(() => {
    mockAuthService = {
      accessToken: signal('test-token'),
      isAuthenticated: signal(true)
    } as any;

    mockHandler = jest.fn();
    mockRequest = new HttpRequest('GET', '/api/test');
  });

  it('should add Authorization header when token exists', (done) => {
    // Arrange
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    mockHandler.mockReturnValue(of({} as any));

    // Act
    TestBed.runInInjectionContext(() => {
      authInterceptor(mockRequest, mockHandler).subscribe({
        next: () => {
          // Assert
          expect(mockHandler).toHaveBeenCalled();
          const modifiedRequest = mockHandler.mock.calls[0][0];
          expect(modifiedRequest.headers.get('Authorization')).toBe('Bearer test-token');
          done();
        }
      });
    });
  });

  it('should not add header when no token', (done) => {
    // Arrange
    mockAuthService.accessToken = signal(null);
    
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    mockHandler.mockReturnValue(of({} as any));

    // Act
    TestBed.runInInjectionContext(() => {
      authInterceptor(mockRequest, mockHandler).subscribe({
        next: () => {
          // Assert
          const modifiedRequest = mockHandler.mock.calls[0][0];
          expect(modifiedRequest.headers.get('Authorization')).toBeNull();
          done();
        }
      });
    });
  });
});
```

---

## 4. Demo: Testing en Vivo (30 min)

### Demo 1: Testear LoggerService

```typescript
// logger.service.spec.ts
describe('LoggerService', () => {
  let service: LoggerService;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggerService);
    consoleSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('info', () => {
    it('should log info messages', () => {
      const spy = jest.spyOn(console, 'info');
      service.info('Test message');
      expect(spy).toHaveBeenCalledWith('[INFO]', 'Test message');
    });
  });

  describe('error', () => {
    it('should log error messages', () => {
      service.error('Test error');
      expect(consoleSpy).toHaveBeenCalledWith('[ERROR]', 'Test error');
    });

    it('should log error with context', () => {
      const context = { userId: '123' };
      service.error('Test error', context);
      expect(consoleSpy).toHaveBeenCalledWith('[ERROR]', 'Test error', context);
    });
  });
});
```

### Demo 2: Testear LoadingService

```typescript
// loading.service.spec.ts
describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  describe('isLoading', () => {
    it('should start as false', () => {
      expect(service.isLoading()).toBe(false);
    });

    it('should be true after show()', () => {
      service.show();
      expect(service.isLoading()).toBe(true);
    });

    it('should be false after hide()', () => {
      service.show();
      service.hide();
      expect(service.isLoading()).toBe(false);
    });
  });

  describe('concurrent requests', () => {
    it('should track multiple show calls', () => {
      service.show();
      service.show();
      service.show();
      expect(service.loadingCount()).toBe(3);
    });

    it('should not hide until all requests complete', () => {
      service.show();
      service.show();
      service.hide();
      expect(service.isLoading()).toBe(true);
    });
  });

  describe('forceHide', () => {
    it('should force hide regardless of count', () => {
      service.show();
      service.show();
      service.forceHide();
      expect(service.isLoading()).toBe(false);
      expect(service.loadingCount()).toBe(0);
    });
  });
});
```

### Demo 3: Testear Componente

```typescript
// user-dropdown.component.spec.ts
describe('UserDropdownComponent', () => {
  let component: UserDropdownComponent;
  let fixture: ComponentFixture<UserDropdownComponent>;
  let authServiceMock: jest.Mocked<AuthService>;

  beforeEach(async () => {
    authServiceMock = {
      currentUser: signal({ id: '1', name: 'John', email: 'john@test.com' }),
      roles: signal([{ id: '1', name: 'admin' }]),
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

  it('should display user name', () => {
    fixture.detectChanges();
    const userName = fixture.nativeElement.querySelector('.user-name');
    expect(userName.textContent).toContain('John');
  });

  it('should call logout on logout click', () => {
    fixture.detectChanges();
    const logoutBtn = fixture.nativeElement.querySelector('.logout-btn');
    logoutBtn.click();
    expect(authServiceMock.logout).toHaveBeenCalled();
  });
});
```

---

## 5. Error Común: Errores Típicos en Testing (15 min)

### Error 1: No Limpiar Spies

```typescript
// ❌ Mal - Spy persiste entre tests
it('test 1', () => {
  jest.spyOn(console, 'log');
  // ...
});

it('test 2', () => {
  // console.log sigue espiado
});

// ✅ Bien - Limpiar en afterEach
afterEach(() => {
  jest.restoreAllMocks();
});
```

### Error 2: No Usar detectChanges()

```typescript
// ❌ Mal - UI no se actualiza
it('should display value', () => {
  component.title.set('Test');
  // Falta detectChanges()
  expect(fixture.nativeElement.textContent).toContain('Test');
});

// ✅ Bien
it('should display value', () => {
  component.title.set('Test');
  fixture.detectChanges(); // Actualiza UI
  expect(fixture.nativeElement.textContent).toContain('Test');
});
```

### Error 3: Testear Implementación en lugar de Comportamiento

```typescript
// ❌ Mal - Testea implementación interna
it('should set internal variable', () => {
  component['privateVar'] = true; // Accediendo privado
  expect(component['privateVar']).toBe(true);
});

// ✅ Bien - Testea comportamiento observable
it('should display correct text when enabled', () => {
  component.enable();
  fixture.detectChanges();
  expect(fixture.nativeElement.textContent).toContain('Enabled');
});
```

### Error 4: Tests Dependientes

```typescript
// ❌ Mal - Tests dependen uno del otro
let user: User;

it('should create user', () => {
  user = { name: 'John' };
});

it('should have name', () => {
  expect(user.name).toBe('John'); // Falla si el test anterior no corre
});

// ✅ Bien - Tests aislados
beforeEach(() => {
  user = { name: 'John' };
});

it('should have name', () => {
  expect(user.name).toBe('John');
});
```

### Error 5: No Testear Casos de Error

```typescript
// ❌ Mal - Solo testea el happy path
it('should load data', () => {
  service.getData().subscribe(data => {
    expect(data).toBeTruthy();
  });
});

// ✅ Bien - Testea errores también
it('should handle error', () => {
  httpMock.get.mockReturnValue(throwError(() => new Error('Network error')));
  
  service.getData().subscribe({
    error: (err) => {
      expect(err.message).toBe('Network error');
    }
  });
});
```

---

## 6. Mini Reto: Testing de AuthService (20 min)

### Objetivo

Escribir tests para el AuthService que cubran:
1. Login exitoso
2. Login fallido
3. Logout
4. Token refresh

### Código Base

```typescript
// auth.service.spec.ts
describe('AuthService', () => {
  let service: AuthService;
  let httpMock: jest.Mocked<HttpClient>;
  let router: jest.Mocked<Router>;

  beforeEach(() => {
    httpMock = {
      post: jest.fn()
    } as any;
    
    router = {
      navigate: jest.fn()
    } as any;

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: HttpClient, useValue: httpMock },
        { provide: Router, useValue: router }
      ]
    });

    service = TestBed.inject(AuthService);
  });

  // TODO: Implementar tests
  it('should login successfully', () => {
    // Arrange
    // Act
    // Assert
  });

  it('should handle login error', () => {
    // Arrange
    // Act
    // Assert
  });

  it('should logout and clear state', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

### Solución

```typescript
describe('AuthService', () => {
  let service: AuthService;
  let httpMock: jest.Mocked<HttpClient>;
  let router: jest.Mocked<Router>;

  beforeEach(() => {
    httpMock = { post: jest.fn() } as any;
    router = { navigate: jest.fn() } as any;

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: HttpClient, useValue: httpMock },
        { provide: Router, useValue: router }
      ]
    });

    service = TestBed.inject(AuthService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  describe('login', () => {
    it('should login successfully', () => {
      // Arrange
      const mockResponse = {
        access_token: 'test-token',
        refresh_token: 'refresh-token',
        user: { id: '1', name: 'John' }
      };
      httpMock.post.mockReturnValue(of(mockResponse));

      // Act
      service.login('john@test.com', 'password').subscribe();

      // Assert
      expect(httpMock.post).toHaveBeenCalledWith(
        '/auth/login',
        expect.any(Object),
        expect.any(Object)
      );
      expect(service.isAuthenticated()).toBe(true);
      expect(service.currentUser()).toEqual(mockResponse.user);
    });

    it('should handle login error', () => {
      // Arrange
      const mockError = new HttpErrorResponse({
        status: 401,
        error: { message: 'Invalid credentials' }
      });
      httpMock.post.mockReturnValue(throwError(() => mockError));

      // Act & Assert
      service.login('john@test.com', 'wrong').subscribe({
        error: (err) => {
          expect(err.status).toBe(401);
        }
      });
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('logout', () => {
    it('should logout and clear state', () => {
      // Arrange
      service.currentUser.set({ id: '1', name: 'John' });
      localStorage.setItem('access_token', 'test-token');

      // Act
      service.logout();

      // Assert
      expect(service.isAuthenticated()).toBe(false);
      expect(service.currentUser()).toBeNull();
      expect(localStorage.getItem('access_token')).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['/signin']);
    });
  });
});
```

---

## 7. Cierre: Resumen y Próximos Pasos (10 min)

### Resumen del Día

| Tema | Aprendido |
|------|-----------|
| **Jest Config** | jest.config.js, setup-jest.ts |
| **AAA Pattern** | Arrange-Act-Assert |
| **Testing Services** | TestBed, mocking, signals |
| **Testing Components** | ComponentFixture, detectChanges |
| **Testing Guards** | runInInjectionContext |
| **Testing Interceptors** | Mock handler, request verification |

### Comandos Clave

```bash
# Correr tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# Test específico
npm test -- --testPathPattern=logger.service
```

### Coverage Thresholds

```javascript
coverageThreshold: {
  global: {
    branches: 70,
    functions: 75,
    lines: 80,
    statements: 80
  }
}
```

### Próximos Pasos

1. **Práctica**: Completar labs del día
2. **Coverage**: Alcanzar 80% en tu proyecto
3. **Mañana**: CI/CD y Deployment

### Recursos Adicionales

- [Jest Docs](https://jestjs.io/docs/getting-started)
- [Angular Testing Guide](https://angular.dev/guide/testing)
- [Testing Signals](https://angular.dev/guide/testing/signals)

---

## Checklist de Aprendizaje

- [ ] Entiendo la pirámide de testing
- [ ] Sé configurar Jest en Angular
- [ ] Puedo escribir tests para servicios
- [ ] Puedo escribir tests para componentes
- [ ] Entiendo cómo mockear dependencias
- [ ] Sé testear guards e interceptors
- [ ] Conozco los errores comunes en testing

---

*Día 17 - Módulo 7: Testing y CI/CD - Curso Angular 21 - UyuniAdmin Frontend*
