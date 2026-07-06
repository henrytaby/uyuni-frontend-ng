# Bibliografía: Día 17 - Testing

## Documentación Oficial

### Angular Testing

| Recurso | URL | Descripción |
|---------|-----|-------------|
| Angular Testing Guide | https://angular.dev/guide/testing | Guía oficial de testing |
| Testing Services | https://angular.dev/guide/testing/services | Testing de servicios |
| Testing Components | https://angular.dev/guide/testing/components | Testing de componentes |
| Testing Signals | https://angular.dev/guide/testing/signals | Testing de signals |

### Jest

| Recurso | URL | Descripción |
|---------|-----|-------------|
| Jest Docs | https://jestjs.io/docs/getting-started | Documentación oficial |
| Jest API | https://jestjs.io/docs/api | Referencia de API |
| Jest Configuration | https://jestjs.io/docs/configuration | Configuración |
| Jest Matchers | https://jestjs.io/docs/expect | Matchers disponibles |

---

## Artículos y Tutoriales

### Testing en Angular

1. **"Testing Angular - A Complete Guide"**
   - Autor: Angular University
   - URL: https://angular-university.io/course/angular-testing-course
   - Tema: Curso completo de testing

2. **"Angular Testing in Action"**
   - Autor: Netlify Blog
   - URL: https://www.netlify.com/blog/angular-testing
   - Tema: Best practices de testing

3. **"Testing Angular Signals"**
   - Autor: Angular Blog
   - URL: https://blog.angular.dev/
   - Tema: Testing específico de signals

### Jest Best Practices

1. **"Jest Best Practices"**
   - Autor: GitHub Repository
   - URL: https://github.com/jestjs/jest
   - Tema: Best practices de testing

2. **"Effective Jest Testing"**
   - Autor: Kent C. Dodds
   - URL: https://kentcdodds.com/blog/effective-jest-testing
   - Tema: Estrategias de testing

---

## Libros Recomendados

### Testing en JavaScript/TypeScript

| Libro | Autor | Año | Tema |
|-------|-------|-----|------|
| "Testing JavaScript Applications" | Lucas da Costa | 2023 | Testing en JS moderno |
| "Unit Testing Principles" | Vladimir Khorikov | 2020 | Principios de unit testing |
| "The Art of Unit Testing" | Roy Osherove | 2013 | Fundamentos de testing |

### Angular Testing

| Libro | Autor | Año | Tema |
|-------|-------|-----|------|
| "Angular Testing Tips" | Nishu Goel | 2023 | Tips prácticos |
| "Testing Angular Applications" | Jesse Palmer | 2018 | Testing completo |

---

## Videos y Cursos

### YouTube

1. **"Angular Testing Crash Course"**
   - Canal: Fireship
   - Duración: 15 min
   - URL: https://www.youtube.com/@Fireship/search?query=angular%20testing

2. **"Jest Testing Tutorial"**
   - Canal: Traversy Media
   - Duración: 30 min
   - URL: https://www.youtube.com/@TraversyMedia/search?query=jest

3. **"Testing Angular Components"**
   - Canal: Angular University
   - Duración: 45 min
   - URL: https://www.youtube.com/@AngularUniversity/search?query=testing

### Cursos Online

1. **"Angular Testing Course"**
   - Plataforma: Udemy
   - Duración: 8 horas
   - Nivel: Intermedio

2. **"Testing JavaScript with Jest"**
   - Plataforma: Testing JavaScript
   - Autor: Kent C. Dodds
   - Duración: 10 horas

---

## Herramientas

### VS Code Extensions

| Extensión | Descripción |
|-----------|-------------|
| Jest Runner | Ejecutar tests individuales |
| Jest Snippets | Snippets para Jest |
| Coverage Gutters | Mostrar coverage en editor |
| Test Explorer UI | UI para tests |

### Librerías de Testing

| Librería | Uso |
|----------|-----|
| Jest | Framework de testing |
| @testing-library/angular | Testing de componentes |
| jest-preset-angular | Preset para Angular |
| jest-marbles | Testing de observables |

---

## Patrones y Best Practices

### AAA Pattern

```typescript
it('should work', () => {
  // Arrange
  const service = new MyService();
  
  // Act
  const result = service.doSomething();
  
  // Assert
  expect(result).toBe(expected);
});
```

### Naming Convention

```typescript
// ✅ Bueno: Descriptivo
it('should return true when user is admin', () => {});

// ❌ Malo: Vago
it('works', () => {});
```

### One Assertion Per Test

```typescript
// ✅ Bueno: Un assertion
it('should set loading to true', () => {
  service.show();
  expect(service.isLoading()).toBe(true);
});

// ❌ Malo: Múltiples assertions
it('should work', () => {
  expect(service.isLoading()).toBe(false);
  service.show();
  expect(service.isLoading()).toBe(true);
  service.hide();
  expect(service.isLoading()).toBe(false);
});
```

---

## Coverage Thresholds

### Configuración Recomendada

```javascript
// jest.config.js
coverageThreshold: {
  global: {
    branches: 70,    // 70% de branches
    functions: 75,   // 75% de funciones
    lines: 80,       // 80% de líneas
    statements: 80   // 80% de statements
  }
}
```

### Interpretación

| Métrica | Qué mide |
|---------|----------|
| **Branches** | Cobertura de condicionales (if/else) |
| **Functions** | Cobertura de funciones llamadas |
| **Lines** | Cobertura de líneas ejecutadas |
| **Statements** | Cobertura de statements |

---

## Debugging Tests

### Usando debugger

```typescript
it('should debug', () => {
  const service = new MyService();
  debugger; // VS Code se detiene aquí
  service.doSomething();
});
```

### Usando console.log

```typescript
it('should debug', () => {
  const result = service.doSomething();
  console.log('Result:', result);
  expect(result).toBe(expected);
});
```

### VS Code Debug Configuration

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Jest Debug",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand"],
      "console": "integratedTerminal"
    }
  ]
}
```

---

## Comandos Útiles

### Jest CLI

```bash
# Correr todos los tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# Test específico
npm test -- --testPathPattern=logger

# Update snapshots
npm test -- -u

# Correr solo tests fallidos
npm test -- --onlyFailures
```

### Debugging

```bash
# Correr con Node debugger
node --inspect-brk ./node_modules/.bin/jest --runInBand

# Ver coverage en navegador
open coverage/lcov-report/index.html
```

---

## Glosario

| Término | Definición |
|---------|------------|
| **Unit Test** | Test de una unidad aislada de código |
| **Integration Test** | Test de interacción entre unidades |
| **E2E Test** | Test de flujo completo de usuario |
| **Mock** | Objeto que simula comportamiento |
| **Spy** | Función que registra llamadas |
| **Stub** | Implementación simplificada |
| **Fixture** | Wrapper para testing de componentes |
| **Coverage** | Porcentaje de código testeado |
| **Assertion** | Verificación de resultado esperado |
| **Matcher** | Función que compara valores |

---

## Próximos Pasos

1. **Practicar**: Completar los labs del día
2. **Coverage**: Alcanzar 80% en tu proyecto
3. **CI/CD**: Integrar tests en pipeline (Día 18)

---

*Bibliografía - Día 17 - Testing - Curso Angular 21*
