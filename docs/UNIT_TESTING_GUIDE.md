# Unit Testing Guide - UyuniAdmin Frontend

## Overview

This guide documents the unit testing implementation for UyuniAdmin Frontend, following Jest 30 + jest-preset-angular best practices.

## Testing Stack

| Tool | Version | Purpose |
|------|---------|---------|
| **Jest** | 30.2.0 | Test runner and assertion library |
| **jest-preset-angular** | 16.0.0 | Angular + Jest integration |
| **TestBed** | Angular | Component and service testing |
| **fakeAsync/tick** | Angular | Async operations testing |

## Test File Structure

```
src/app/
├── core/
│   ├── auth/
│   │   └── auth.service.ts
│   │   └── auth.service.spec.ts        # Tests for AuthService
│   ├── config/
│   │   └── config.service.ts
│   │   └── config.service.spec.ts      # Tests for ConfigService
│   └── services/
│       ├── logger.service.ts
│       ├── logger.service.spec.ts      # Tests for LoggerService
│       ├── loading.service.ts
│       ├── loading.service.spec.ts     # Tests for LoadingService
│       └── ...
```

## Running Tests

### All Tests
```bash
npm test
```

### Specific Test File
```bash
npm test -- --testPathPatterns="logger.service.spec.ts"
```

### With Coverage
```bash
npm test -- --coverage
```

### Watch Mode
```bash
npm test -- --watch
```

## Coverage Thresholds

Configured in `jest.config.js`:

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

## Testing Patterns

### 1. Service Testing (No Dependencies)

**Example: LoggerService**

```typescript
describe('LoggerService', () => {
  let service: LoggerService;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    service = new LoggerService();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should log info messages', () => {
    service.info('Test message', { key: 'value' });
    expect(consoleSpy).toHaveBeenCalled();
  });
});
```

### 2. Service Testing (With Dependencies)

**Example: LoadingService**

```typescript
describe('LoadingService', () => {
  let service: LoadingService;
  let routerMock: jest.Mocked<Router>;

  beforeEach(() => {
    routerMock = {
      events: of({} as NavigationEnd)
    } as unknown as jest.Mocked<Router>;

    service = new LoadingService(routerMock);
  });

  it('should increment counter on show()', () => {
    service.show();
    expect(service.loadingCount()).toBe(1);
    expect(service.isLoading()).toBe(true);
  });
});
```

### 3. Service Testing (With TestBed)

**Example: ConfigService**

```typescript
describe('ConfigService', () => {
  let service: ConfigService;
  let httpMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    httpMock = {
      get: jest.fn(),
      post: jest.fn()
    } as unknown as jest.Mocked<HttpClient>;

    TestBed.configureTestingModule({
      providers: [
        ConfigService,
        { provide: HttpClient, useValue: httpMock }
      ]
    });

    service = TestBed.inject(ConfigService);
  });

  it('should load config from assets', fakeAsync(() => {
    httpMock.get.mockReturnValue(of({ apiUrl: 'http://test.api' }));
    
    service.loadConfig();
    tick();
    
    expect(service.config()).toBeDefined();
  }));
});
```

### 4. Testing Signals

```typescript
it('should update signal value', () => {
  expect(service.someSignal()).toBe(initialValue);
  
  service.updateSignal(newValue);
  
  expect(service.someSignal()).toBe(newValue);
});

it('should compute derived value', () => {
  service.count.set(5);
  
  expect(service.doubleCount()).toBe(10);
});
```

### 5. Testing Async Operations

```typescript
it('should handle async operation', fakeAsync(() => {
  let result: string | undefined;
  
  service.asyncMethod().subscribe({
    next: (value) => result = value
  });
  
  tick(); // Advance time
  
  expect(result).toBe('expected value');
}));
```

### 6. Testing HTTP Calls

```typescript
it('should make HTTP POST call', fakeAsync(() => {
  httpMock.post.mockReturnValue(of(mockResponse));

  service.login({ username: 'test', password: 'test' }).subscribe();
  tick();

  expect(httpMock.post).toHaveBeenCalledWith(
    'http://api/auth/login',
    'username=test&password=test',
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
}));
```

### 7. Testing Error Handling

```typescript
it('should handle HTTP error', fakeAsync(() => {
  const errorResponse = new HttpErrorResponse({
    status: 401,
    error: { message: 'Unauthorized' }
  });
  httpMock.get.mockReturnValue(throwError(() => errorResponse));

  let error: HttpErrorResponse | undefined;
  service.fetchData().subscribe({
    error: (err) => error = err
  });
  tick();

  expect(error).toBeDefined();
  expect(error?.status).toBe(401);
}));
```

## Test Organization

### AAA Pattern

All tests follow the **Arrange-Act-Assert** pattern:

```typescript
it('should do something', fakeAsync(() => {
  // Arrange
  const input = 'test';
  httpMock.get.mockReturnValue(of(mockData));

  // Act
  let result: Data | undefined;
  service.getData(input).subscribe({
    next: (data) => result = data
  });
  tick();

  // Assert
  expect(result).toBeDefined();
  expect(httpMock.get).toHaveBeenCalledWith('api/endpoint/test');
}));
```

### Describe Blocks

Organize tests logically:

```typescript
describe('ServiceName', () => {
  describe('methodName', () => {
    it('should handle success case', () => {});
    it('should handle error case', () => {});
    it('should handle edge case', () => {});
  });

  describe('anotherMethod', () => {
    it('should do something', () => {});
  });
});
```

## Mocking Strategies

### Creating Mocks

```typescript
// Simple mock
const mockService = {
  method: jest.fn()
} as unknown as MockService;

// Mock with return value
mockService.method.mockReturnValue(of(mockData));

// Mock with implementation
mockService.method.mockImplementation((arg) => {
  return of(processedData);
});

// Mock with error
mockService.method.mockReturnValue(throwError(() => new Error('Failed')));
```

### Mocking HttpClient

```typescript
let httpMock: jest.Mocked<HttpClient>;

beforeEach(() => {
  httpMock = {
    get: jest.fn().mockReturnValue(of(mockData)),
    post: jest.fn().mockReturnValue(of(mockResponse))
  } as unknown as jest.Mocked<HttpClient>;
});
```

### Mocking Router

```typescript
let routerMock: jest.Mocked<Router>;

beforeEach(() => {
  routerMock = {
    navigate: jest.fn(),
    events: of({} as NavigationEnd)
  } as unknown as jest.Mocked<Router>;
});
```

### Mocking localStorage

```typescript
beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
});

it('should store token', () => {
  service.setToken('test-token');
  expect(localStorage.getItem('access_token')).toBe('test-token');
});
```

## Coverage Report

### Current Coverage (Core Services)

| Service | Statements | Branches | Functions | Lines |
|---------|------------|----------|-----------|-------|
| AuthService | 95.79% | 68.42% | 92.59% | 96.46% |
| ConfigService | 100% | 100% | 100% | 100% |
| LoggerService | 100% | 100% | 100% | 100% |
| LoadingService | 100% | 100% | 100% | 100% |
| AuthErrorHandlerService | 97.72% | 100% | 100% | 97.72% |
| NetworkErrorService | 100% | 100% | 100% | 100% |
| TokenRefreshService | 100% | 100% | 100% | 100% |

### Current Coverage (Guards & Interceptors)

| File | Tests | Coverage | Status |
|------|-------|----------|--------|
| authGuard | 8 | 100% | ✅ |
| authInterceptor | 20 | 100% | ✅ |

### Total Tests

- **Test Suites**: 10
- **Tests**: 222
- **Coverage**: Core services + guards/interceptors fully tested

## Best Practices

### DO ✅

1. **Use `fakeAsync` + `tick()`** for async operations
2. **Clear mocks in `afterEach`** to avoid test pollution
3. **Use `jest.Mocked<T>`** for type-safe mocks
4. **Test signals directly** with `.signal()` calls
5. **Mock dependencies** at the provider level
6. **Follow AAA pattern** consistently
7. **Test edge cases** (null, undefined, empty arrays)
8. **Test error paths** not just happy paths

### DON'T ❌

1. **Don't use `done()` callback** - use `fakeAsync/tick` instead
2. **Don't test implementation details** - test behavior
3. **Don't share state between tests** - use `beforeEach`
4. **Don't skip tests** without good reason
5. **Don't use `any` types** in tests
6. **Don't mock what you're testing**

## Troubleshooting

### Common Issues

#### 1. "Cannot read properties of undefined"

**Problem**: Mock not properly configured.

**Solution**: Ensure all methods used are mocked:
```typescript
httpMock = {
  get: jest.fn(),
  post: jest.fn()
} as unknown as jest.Mocked<HttpClient>;
```

#### 2. "Expected number of calls: >= 1, Received: 0"

**Problem**: Async operation not completed.

**Solution**: Use `fakeAsync` and `tick()`:
```typescript
it('should call API', fakeAsync(() => {
  service.fetchData();
  tick(); // Wait for async
  expect(httpMock.get).toHaveBeenCalled();
}));
```

#### 3. "Signal not updated"

**Problem**: Signal update not detected.

**Solution**: Signals are synchronous, no need for async:
```typescript
service.count.set(5);
expect(service.count()).toBe(5); // Works immediately
```

#### 4. "Coverage threshold not met"

**Problem**: Global coverage includes untested files.

**Solution**: Focus on specific paths or exclude files:
```javascript
collectCoverageFrom: [
  'src/app/**/*.ts',
  '!src/app/**/*.spec.ts',
  '!src/app/**/index.ts'
]
```

## Future Improvements

1. **Add component tests** for UI components
2. **Add integration tests** for feature modules
3. **Add E2E tests** with Playwright or Cypress
4. **Increase coverage thresholds** to 90%+
5. **Add mutation testing** with Stryker

## References

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Angular Testing Guide](https://angular.io/guide/testing)
- [jest-preset-angular](https://testing-library.com/docs/angular-testing-library/intro/)

---

*Last updated: May 2026*
