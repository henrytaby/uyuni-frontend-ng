# Slides: Día 17 - Testing

## Slide 1: Título

# Testing en Angular 21

## Día 17 - Módulo 7: Testing y CI/CD

---

## Slide 2: Agenda

### Temas de Hoy

1. ✅ Por qué testing importa
2. ✅ Configuración de Jest
3. ✅ Testing de Servicios
4. ✅ Testing de Componentes
5. ✅ Testing de Guards e Interceptors
6. ✅ Coverage y Best Practices

---

## Slide 3: Hook - El Bug Costoso

### Knight Capital Group (2012)

**$440 millones perdidos en 45 minutos**

Por un bug que no fue testeado.

> "En Angular, los bugs pueden ser igual de costosos"

---

## Slide 4: Por Qué Testing Importa

### Beneficios

| Beneficio | Impacto |
|-----------|---------|
| Detecta bugs temprano | Menor costo de corrección |
| Documenta comportamiento | Tests = Documentación viva |
| Facilita refactoring | Confianza al cambiar código |
| Mejora el diseño | Código testeable = Código limpio |

---

## Slide 5: Pirámide de Testing

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

### En Angular 21

- **Unit Tests**: Jest
- **Integration Tests**: Jest + TestBed
- **E2E**: Playwright / Cypress

---

## Slide 6: Jest vs Jasmine+Karma

| Feature | Jasmine+Karma | Jest |
|---------|---------------|------|
| Velocidad | Lento | Rápido (parallel) |
| Watch Mode | Básico | Avanzado |
| Mocking | Manual | Automático |
| Coverage | Plugin | Integrado |
| DX | Media | Excelente |

---

## Slide 7: Configuración de Jest

### jest.config.js

```javascript
module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 75,
      lines: 80
    }
  }
};
```

---

## Slide 8: Estructura de un Test

### AAA Pattern

```
Arrange → Act → Assert
```

```typescript
it('should work', () => {
  // Arrange: Configurar
  const service = new LoggerService();
  
  // Act: Ejecutar
  service.info('test');
  
  // Assert: Verificar
  expect(console.info).toHaveBeenCalled();
});
```

---

## Slide 9: Testing de Servicios - Básico

```typescript
describe('LoggerService', () => {
  let service: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
```

---

## Slide 10: Testing de Signals

```typescript
it('should update loading state', () => {
  // Arrange
  expect(service.isLoading()).toBe(false);
  
  // Act
  service.show();
  
  // Assert
  expect(service.isLoading()).toBe(true);
});
```

### Los Signals se testean como cualquier valor

---

## Slide 11: Mocking de HttpClient

```typescript
beforeEach(() => {
  httpMock = {
    get: jest.fn(),
    post: jest.fn()
  } as any;

  TestBed.configureTestingModule({
    providers: [
      ConfigService,
      { provide: HttpClient, useValue: httpMock }
    ]
  });
});
```

---

## Slide 12: Mock Return Values

```typescript
it('should load config', () => {
  // Arrange
  const mockConfig = { apiUrl: 'http://test.api' };
  httpMock.get.mockReturnValue(of(mockConfig));

  // Act
  service.loadConfig();

  // Assert
  expect(httpMock.get).toHaveBeenCalledWith(
    '/assets/config/config.json'
  );
});
```

---

## Slide 13: Testing de Componentes

```typescript
beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [UserDropdownComponent]
  }).compileComponents();

  fixture = TestBed.createComponent(UserDropdownComponent);
  component = fixture.componentInstance;
});
```

---

## Slide 14: detectChanges()

```typescript
it('should display user name', () => {
  // Arrange
  component.userName.set('John Doe');
  
  // Act
  fixture.detectChanges(); // ← IMPORTANTE!
  
  // Assert
  const el = fixture.nativeElement.querySelector('.name');
  expect(el.textContent).toBe('John Doe');
});
```

---

## Slide 15: Testing de Inputs

```typescript
it('should accept title input', () => {
  component.title.set('My Title');
  fixture.detectChanges();
  
  const title = fixture.nativeElement.querySelector('h1');
  expect(title.textContent).toBe('My Title');
});
```

---

## Slide 16: Testing de Outputs

```typescript
it('should emit on click', () => {
  const spy = jest.fn();
  component.onClick.subscribe(spy);
  
  fixture.detectChanges();
  fixture.nativeElement.querySelector('button').click();
  
  expect(spy).toHaveBeenCalled();
});
```

---

## Slide 17: Testing de Guards

```typescript
it('should return true when authenticated', () => {
  mockAuthService.isAuthenticated = signal(true);

  const result = TestBed.runInInjectionContext(() => 
    authGuard(mockRoute, mockState)
  );

  expect(result).toBe(true);
});
```

### `runInInjectionContext` es clave para guards funcionales

---

## Slide 18: Testing de Interceptors

```typescript
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
```

---

## Slide 19: Error Común #1

### No Limpiar Spies

```typescript
// ❌ Mal
it('test', () => {
  jest.spyOn(console, 'log');
  // Spy persiste en otros tests
});

// ✅ Bien
afterEach(() => {
  jest.restoreAllMocks();
});
```

---

## Slide 20: Error Común #2

### Olvidar detectChanges()

```typescript
// ❌ Mal
it('test', () => {
  component.title.set('Test');
  expect(element.textContent).toContain('Test');
  // Falla porque UI no se actualizó
});

// ✅ Bien
it('test', () => {
  component.title.set('Test');
  fixture.detectChanges();
  expect(element.textContent).toContain('Test');
});
```

---

## Slide 21: Error Común #3

### Tests Dependientes

```typescript
// ❌ Mal
let user;
it('test 1', () => { user = { name: 'John' }; });
it('test 2', () => { expect(user.name)... }); // Depende del anterior

// ✅ Bien
beforeEach(() => { user = { name: 'John' }; });
it('test', () => { expect(user.name)... }); // Aislado
```

---

## Slide 22: Coverage Thresholds

```javascript
coverageThreshold: {
  global: {
    branches: 70,    // 70% de branches cubiertas
    functions: 75,   // 75% de funciones cubiertas
    lines: 80,       // 80% de líneas cubiertas
    statements: 80   // 80% de statements cubiertos
  }
}
```

### Objetivo: 80% mínimo

---

## Slide 23: Comandos de Testing

```bash
# Correr todos los tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Test específico
npm test -- --testPathPattern=logger
```

---

## Slide 24: Nombrar Tests

### ✅ Buenas Prácticas

```typescript
// ✅ Descriptivo
it('should return true when user is admin', () => {});
it('should display error message when login fails', () => {});
it('should disable button when form is invalid', () => {});

// ❌ Vago
it('works', () => {});
it('test 1', () => {});
```

---

## Slide 25: Mini Reto

### Objetivo

Escribir tests para AuthService:

1. Login exitoso
2. Login fallido (401)
3. Logout limpia estado
4. Token refresh funciona

**Tiempo: 20 minutos**

---

## Slide 26: Resumen

### Lo que Aprendimos

| Tema | Comando/Concepto |
|------|------------------|
| Configuración | jest.config.js |
| AAA Pattern | Arrange-Act-Assert |
| Services | TestBed.inject() |
| Components | ComponentFixture |
| Guards | runInInjectionContext() |
| Coverage | --coverage flag |

---

## Slide 27: Checklist

- [ ] Entiendo la pirámide de testing
- [ ] Sé configurar Jest
- [ ] Puedo testear servicios
- [ ] Puedo testear componentes
- [ ] Sé mockear dependencias
- [ ] Entiendo coverage thresholds

---

## Slide 28: Próximo Día

# Día 18: CI/CD y Deployment

- GitHub Actions
- Pipeline de CI/CD
- Deployment a producción

---

## Slide 29: Recursos

### Documentación

- [Jest Docs](https://jestjs.io)
- [Angular Testing Guide](https://angular.dev/guide/testing)
- [Testing Signals](https://angular.dev/guide/testing/signals)

---

## Slide 30: Q&A

# ¿Preguntas?

---

*Slides - Día 17 - Testing - Curso Angular 21*
