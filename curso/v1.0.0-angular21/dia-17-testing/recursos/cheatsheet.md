# Cheatsheet: Testing en Angular 21

## Configuración de Jest

### jest.config.js

```javascript
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

### setup-jest.ts

```typescript
import '@angular/compiler';
```

### package.json scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

---

## AAA Pattern

```typescript
it('description', () => {
  // Arrange - Configurar
  const service = new MyService();
  const input = 'test';
  
  // Act - Ejecutar
  const result = service.method(input);
  
  // Assert - Verificar
  expect(result).toBe('expected');
});
```

---

## Testing de Servicios

### Test Básico

```typescript
describe('MyService', () => {
  let service: MyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
```

### Con HttpClient Mock

```typescript
describe('ApiService', () => {
  let service: ApiService;
  let httpMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    httpMock = {
      get: jest.fn(),
      post: jest.fn()
    } as any;

    TestBed.configureTestingModule({
      providers: [
        ApiService,
        { provide: HttpClient, useValue: httpMock }
      ]
    });

    service = TestBed.inject(ApiService);
  });

  it('should fetch data', () => {
    const mockData = { id: 1 };
    httpMock.get.mockReturnValue(of(mockData));

    service.getData().subscribe(data => {
      expect(data).toEqual(mockData);
    });
  });
});
```

---

## Testing de Signals

### Signal Writable

```typescript
it('should update signal', () => {
  expect(service.count()).toBe(0);
  
  service.increment();
  
  expect(service.count()).toBe(1);
});
```

### Computed Signal

```typescript
it('should compute derived value', () => {
  service.firstName.set('John');
  service.lastName.set('Doe');
  
  expect(service.fullName()).toBe('John Doe');
});
```

---

## Testing de Componentes

### Test Básico

```typescript
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

### Con detectChanges()

```typescript
it('should display value', () => {
  component.title.set('Test');
  fixture.detectChanges(); // ← Importante!
  
  const el = fixture.nativeElement.querySelector('h1');
  expect(el.textContent).toBe('Test');
});
```

### Con Servicio Mock

```typescript
beforeEach(async () => {
  const mockAuthService = {
    currentUser: signal({ name: 'John' }),
    logout: jest.fn()
  } as any;

  await TestBed.configureTestingModule({
    imports: [MyComponent],
    providers: [
      { provide: AuthService, useValue: mockAuthService }
    ]
  }).compileComponents();
});
```

---

## Testing de Inputs/Outputs

### Input Signal

```typescript
it('should accept input', () => {
  component.title.set('My Title');
  fixture.detectChanges();
  
  expect(fixture.nativeElement.textContent).toContain('My Title');
});
```

### Output Signal

```typescript
it('should emit output', () => {
  const spy = jest.fn();
  component.onClick.subscribe(spy);
  
  fixture.detectChanges();
  fixture.nativeElement.querySelector('button').click();
  
  expect(spy).toHaveBeenCalled();
});
```

---

## Testing de Guards

```typescript
describe('authGuard', () => {
  it('should return true when authenticated', () => {
    mockAuthService.isAuthenticated = signal(true);

    const result = TestBed.runInInjectionContext(() => 
      authGuard(mockRoute, mockState)
    );

    expect(result).toBe(true);
  });
});
```

---

## Testing de Interceptors

```typescript
describe('authInterceptor', () => {
  it('should add Authorization header', (done) => {
    mockAuthService.accessToken = signal('test-token');
    mockHandler.mockReturnValue(of({}));

    TestBed.runInInjectionContext(() => {
      authInterceptor(mockRequest, mockHandler).subscribe(() => {
        const req = mockHandler.mock.calls[0][0];
        expect(req.headers.get('Authorization'))
          .toBe('Bearer test-token');
        done();
      });
    });
  });
});
```

---

## Jest Matchers

### Básicos

```typescript
expect(value).toBe(expected);           // Exactamente igual
expect(value).toEqual(expected);        // Deep equality
expect(value).toBeTruthy();             // truthy
expect(value).toBeFalsy();              // falsy
expect(value).toBeNull();               // null
expect(value).toBeUndefined();          // undefined
expect(value).toBeDefined();            // definido
```

### Números

```typescript
expect(value).toBeGreaterThan(5);
expect(value).toBeLessThan(10);
expect(value).toBeCloseTo(5.5, 1);      // Con precisión
```

### Strings

```typescript
expect(str).toMatch(/pattern/);
expect(str).toContain('substring');
expect(str).toHaveLength(5);
```

### Arrays

```typescript
expect(arr).toContain(item);
expect(arr).toHaveLength(3);
expect(arr).toContainEqual({ id: 1 });
```

### Objetos

```typescript
expect(obj).toHaveProperty('name');
expect(obj).toHaveProperty('address.city', 'NYC');
expect(obj).toMatchObject({ name: 'John' });
```

### Calls

```typescript
expect(fn).toHaveBeenCalled();
expect(fn).toHaveBeenCalledTimes(2);
expect(fn).toHaveBeenCalledWith(arg1, arg2);
expect(fn).toHaveBeenLastCalledWith(arg1);
```

---

## Jest Spies

### Crear Spy

```typescript
// Spy en método
const spy = jest.spyOn(service, 'method');

// Spy en console
const consoleSpy = jest.spyOn(console, 'log');

// Spy con mock implementation
jest.spyOn(service, 'method').mockReturnValue('mocked');
```

### Verificar Spy

```typescript
expect(spy).toHaveBeenCalled();
expect(spy).toHaveBeenCalledWith(arg1, arg2);
expect(spy).toHaveBeenCalledTimes(1);
```

### Limpiar Spy

```typescript
afterEach(() => {
  jest.clearAllMocks();      // Limpia contadores
  jest.restoreAllMocks();    // Restaura implementación
});
```

---

## Jest Mocks

### Mock Function

```typescript
const mockFn = jest.fn();
mockFn.mockReturnValue('value');
mockFn.mockReturnValueOnce('once');
mockFn.mockImplementation(() => 'impl');
```

### Mock Module

```typescript
jest.mock('./service', () => ({
  Service: jest.fn().mockImplementation(() => ({
    method: jest.fn()
  }))
}));
```

### Mock Timer

```typescript
jest.useFakeTimers();
jest.advanceTimersByTime(1000);
jest.runAllTimers();
jest.useRealTimers();
```

---

## Comandos CLI

```bash
# Correr todos
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage

# Test específico
npm test -- --testPathPattern=service

# Update snapshots
npm test -- -u

# Solo fallidos
npm test -- --onlyFailures

# Parallel
npm test -- --maxWorkers=4
```

---

## Coverage Thresholds

```javascript
coverageThreshold: {
  global: {
    branches: 70,     // if/else
    functions: 75,    // funciones
    lines: 80,        // líneas
    statements: 80    // statements
  }
}
```

---

## Best Practices

### Naming

```typescript
// ✅ Bueno
it('should return true when user is admin', () => {});

// ❌ Malo
it('test1', () => {});
```

### Un Assertion

```typescript
// ✅ Bueno
it('should set loading', () => {
  service.show();
  expect(service.isLoading()).toBe(true);
});

// ❌ Malo
it('should work', () => {
  expect(service.isLoading()).toBe(false);
  service.show();
  expect(service.isLoading()).toBe(true);
});
```

### Tests Aislados

```typescript
// ✅ Bueno
beforeEach(() => {
  service = new MyService();
});

// ❌ Malo
let service;
it('test1', () => { service = new MyService(); });
it('test2', () => { expect(service)... }); // Depende del anterior
```

---

## Debugging

### debugger

```typescript
it('should debug', () => {
  debugger; // VS Code se detiene aquí
  service.method();
});
```

### console.log

```typescript
it('should debug', () => {
  const result = service.method();
  console.log('Result:', result);
});
```

### VS Code Launch

```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand"]
}
```

---

## Estructura de Archivos

```
src/app/
├── core/
│   ├── services/
│   │   ├── logger.service.ts
│   │   └── logger.service.spec.ts    # Test
│   └── guards/
│       ├── auth.guard.ts
│       └── auth.guard.spec.ts        # Test
└── shared/
    └── components/
        ├── button.component.ts
        └── button.component.spec.ts  # Test
```

---

## Checklist de Testing

- [ ] Configurar Jest
- [ ] Escribir test de creación
- [ ] Testear métodos públicos
- [ ] Testear signals
- [ ] Testear inputs/outputs
- [ ] Mockear dependencias
- [ ] Verificar coverage > 80%
- [ ] Limpiar spies en afterEach

---

*Cheatsheet - Día 17 - Testing - Curso Angular 21*
