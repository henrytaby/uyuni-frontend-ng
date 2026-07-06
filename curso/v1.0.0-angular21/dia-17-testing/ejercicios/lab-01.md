# Lab 01: Testing de Servicios

## Información del Lab

| Atributo | Valor |
|----------|-------|
| **Duración** | 45 minutos |
| **Dificultad** | Intermedio |
| **Objetivo** | Escribir tests unitarios para servicios Angular |

---

## Objetivos de Aprendizaje

Al completar este lab, serás capaz de:

1. Configurar TestBed para testing de servicios
2. Escribir tests siguiendo el patrón AAA
3. Mockear dependencias correctamente
4. Testear signals y estado reactivo
5. Verificar coverage de los tests

---

## Prerrequisitos

- Proyecto UyuniAdmin clonado
- Jest configurado
- VS Code con extensiones de testing
- Conocimiento de LoggerService y LoadingService

---

## Ejercicio 1: Testing de LoggerService (15 min)

### Descripción

Escribir tests unitarios para el `LoggerService` que verifiquen:
- Creación del servicio
- Logs de diferentes niveles
- Formato de mensajes

### Código Base

```typescript
// src/app/core/services/logger.service.ts
@Injectable({ providedIn: 'root' })
export class LoggerService {
  private level: LogLevel = 'debug';

  debug(message: string, ...args: unknown[]): void {
    if (this.level === 'debug') {
      console.debug(`[DEBUG]`, message, ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    console.info(`[INFO]`, message, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    console.warn(`[WARN]`, message, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    console.error(`[ERROR]`, message, ...args);
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }
}
```

### Instrucciones Paso a Paso

#### Paso 1: Crear el archivo de test

```bash
# El archivo ya existe en:
# src/app/core/services/logger.service.spec.ts
```

#### Paso 2: Configurar el TestBed

```typescript
// logger.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggerService);
  });

  // Tests irán aquí
});
```

#### Paso 3: Test de creación

```typescript
it('should be created', () => {
  expect(service).toBeTruthy();
});
```

#### Paso 4: Test de info()

```typescript
it('should log info messages with [INFO] prefix', () => {
  // Arrange
  const consoleSpy = jest.spyOn(console, 'info');
  
  // Act
  service.info('Test message');
  
  // Assert
  expect(consoleSpy).toHaveBeenCalledWith('[INFO]', 'Test message');
  consoleSpy.mockRestore();
});
```

#### Paso 5: Test de error() con contexto

```typescript
it('should log error with context object', () => {
  // Arrange
  const consoleSpy = jest.spyOn(console, 'error');
  const context = { userId: '123', action: 'login' };
  
  // Act
  service.error('Login failed', context);
  
  // Assert
  expect(consoleSpy).toHaveBeenCalledWith(
    '[ERROR]',
    'Login failed',
    context
  );
  consoleSpy.mockRestore();
});
```

#### Paso 6: Test de warn()

```typescript
it('should log warn messages', () => {
  // Arrange
  const consoleSpy = jest.spyOn(console, 'warn');
  
  // Act
  service.warn('Deprecated method called');
  
  // Assert
  expect(consoleSpy).toHaveBeenCalledWith('[WARN]', 'Deprecated method called');
  consoleSpy.mockRestore();
});
```

#### Paso 7: Test de debug() con nivel

```typescript
it('should log debug when level is debug', () => {
  // Arrange
  const consoleSpy = jest.spyOn(console, 'debug');
  service.setLevel('debug');
  
  // Act
  service.debug('Debug message');
  
  // Assert
  expect(consoleSpy).toHaveBeenCalledWith('[DEBUG]', 'Debug message');
  consoleSpy.mockRestore();
});

it('should not log debug when level is info', () => {
  // Arrange
  const consoleSpy = jest.spyOn(console, 'debug');
  service.setLevel('info');
  
  // Act
  service.debug('Debug message');
  
  // Assert
  expect(consoleSpy).not.toHaveBeenCalled();
  consoleSpy.mockRestore();
});
```

### Solución Completa

```typescript
// logger.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggerService);
  });

  afterEach(() => {
    if (consoleSpy) {
      consoleSpy.mockRestore();
    }
  });

  describe('creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('info', () => {
    it('should log info messages with [INFO] prefix', () => {
      consoleSpy = jest.spyOn(console, 'info');
      service.info('Test message');
      expect(consoleSpy).toHaveBeenCalledWith('[INFO]', 'Test message');
    });

    it('should log info with multiple arguments', () => {
      consoleSpy = jest.spyOn(console, 'info');
      service.info('User logged in', { id: '123' }, 'success');
      expect(consoleSpy).toHaveBeenCalledWith(
        '[INFO]',
        'User logged in',
        { id: '123' },
        'success'
      );
    });
  });

  describe('error', () => {
    it('should log error messages with [ERROR] prefix', () => {
      consoleSpy = jest.spyOn(console, 'error');
      service.error('Test error');
      expect(consoleSpy).toHaveBeenCalledWith('[ERROR]', 'Test error');
    });

    it('should log error with context object', () => {
      consoleSpy = jest.spyOn(console, 'error');
      const context = { userId: '123', action: 'login' };
      service.error('Login failed', context);
      expect(consoleSpy).toHaveBeenCalledWith('[ERROR]', 'Login failed', context);
    });
  });

  describe('warn', () => {
    it('should log warn messages with [WARN] prefix', () => {
      consoleSpy = jest.spyOn(console, 'warn');
      service.warn('Deprecated method');
      expect(consoleSpy).toHaveBeenCalledWith('[WARN]', 'Deprecated method');
    });
  });

  describe('debug', () => {
    it('should log debug when level is debug', () => {
      consoleSpy = jest.spyOn(console, 'debug');
      service.setLevel('debug');
      service.debug('Debug message');
      expect(consoleSpy).toHaveBeenCalledWith('[DEBUG]', 'Debug message');
    });

    it('should not log debug when level is info', () => {
      consoleSpy = jest.spyOn(console, 'debug');
      service.setLevel('info');
      service.debug('Debug message');
      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });

  describe('setLevel', () => {
    it('should change log level', () => {
      consoleSpy = jest.spyOn(console, 'debug');
      
      service.setLevel('info');
      service.debug('Should not appear');
      expect(consoleSpy).not.toHaveBeenCalled();
      
      service.setLevel('debug');
      service.debug('Should appear');
      expect(consoleSpy).toHaveBeenCalledWith('[DEBUG]', 'Should appear');
    });
  });
});
```

---

## Ejercicio 2: Testing de LoadingService (15 min)

### Descripción

Escribir tests unitarios para el `LoadingService` que verifiquen:
- Estado inicial
- Contador de requests
- Signals reactivos
- Método forceHide()

### Código Base

```typescript
// src/app/core/services/loading.service.ts
@Injectable({ providedIn: 'root' })
export class LoadingService {
  private loadingCount = signal(0);
  
  isLoading = computed(() => this.loadingCount() > 0);

  show(): void {
    this.loadingCount.update(count => count + 1);
  }

  hide(): void {
    this.loadingCount.update(count => Math.max(0, count - 1));
  }

  forceHide(): void {
    this.loadingCount.set(0);
  }
}
```

### Instrucciones Paso a Paso

#### Paso 1: Configurar el test

```typescript
// loading.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  // Tests irán aquí
});
```

#### Paso 2: Test de estado inicial

```typescript
it('should start with loading false', () => {
  expect(service.isLoading()).toBe(false);
});
```

#### Paso 3: Test de show/hide

```typescript
it('should set isLoading to true after show()', () => {
  service.show();
  expect(service.isLoading()).toBe(true);
});

it('should set isLoading to false after hide()', () => {
  service.show();
  service.hide();
  expect(service.isLoading()).toBe(false);
});
```

#### Paso 4: Test de requests concurrentes

```typescript
it('should track multiple concurrent requests', () => {
  service.show();
  service.show();
  service.show();
  
  // isLoading sigue true
  expect(service.isLoading()).toBe(true);
});

it('should not set false until all requests complete', () => {
  service.show();
  service.show();
  service.hide();
  
  // Aún hay un request pendiente
  expect(service.isLoading()).toBe(true);
});
```

#### Paso 5: Test de forceHide()

```typescript
it('should force hide regardless of count', () => {
  service.show();
  service.show();
  service.show();
  
  service.forceHide();
  
  expect(service.isLoading()).toBe(false);
});
```

### Solución Completa

```typescript
// loading.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  describe('initial state', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should start with isLoading false', () => {
      expect(service.isLoading()).toBe(false);
    });
  });

  describe('show/hide', () => {
    it('should set isLoading to true after show()', () => {
      service.show();
      expect(service.isLoading()).toBe(true);
    });

    it('should set isLoading to false after hide()', () => {
      service.show();
      service.hide();
      expect(service.isLoading()).toBe(false);
    });

    it('should not go below zero', () => {
      service.hide(); // Intenta decrementar de 0
      expect(service.isLoading()).toBe(false);
    });
  });

  describe('concurrent requests', () => {
    it('should track multiple show calls', () => {
      service.show();
      service.show();
      service.show();
      expect(service.isLoading()).toBe(true);
    });

    it('should not set false until all complete', () => {
      service.show();
      service.show();
      service.hide();
      expect(service.isLoading()).toBe(true);
      
      service.hide();
      expect(service.isLoading()).toBe(false);
    });
  });

  describe('forceHide', () => {
    it('should force hide regardless of count', () => {
      service.show();
      service.show();
      service.show();
      
      service.forceHide();
      
      expect(service.isLoading()).toBe(false);
    });

    it('should work when already hidden', () => {
      service.forceHide();
      expect(service.isLoading()).toBe(false);
    });
  });
});
```

---

## Ejercicio 3: Testing de ConfigService (15 min)

### Descripción

Escribir tests para el `ConfigService` que verifiquen:
- Carga de configuración
- Manejo de errores
- Signals reactivos

### Código de Test

```typescript
// config.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { ConfigService } from './config.service';

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

  describe('loadConfig', () => {
    it('should load config successfully', async () => {
      // Arrange
      const mockConfig = {
        apiUrl: 'http://test.api',
        mockAuth: true
      };
      httpMock.get.mockReturnValue(of(mockConfig));

      // Act
      await service.loadConfig();

      // Assert
      expect(httpMock.get).toHaveBeenCalledWith('/assets/config/config.json');
      expect(service.config()).toEqual(mockConfig);
      expect(service.isLoaded()).toBe(true);
    });

    it('should handle load error', async () => {
      // Arrange
      httpMock.get.mockReturnValue(throwError(() => new Error('Network error')));

      // Act & Assert
      await expect(service.loadConfig()).rejects.toThrow('Network error');
      expect(service.isLoaded()).toBe(false);
    });
  });

  describe('getApiUrl', () => {
    it('should return apiUrl when config loaded', async () => {
      // Arrange
      const mockConfig = { apiUrl: 'http://test.api' };
      httpMock.get.mockReturnValue(of(mockConfig));
      await service.loadConfig();

      // Act & Assert
      expect(service.getApiUrl()).toBe('http://test.api');
    });

    it('should throw when config not loaded', () => {
      // Assert
      expect(() => service.getApiUrl()).toThrow('Config not loaded');
    });
  });

  describe('isMockAuth', () => {
    it('should return true when mockAuth is true', async () => {
      // Arrange
      const mockConfig = { apiUrl: 'http://test.api', mockAuth: true };
      httpMock.get.mockReturnValue(of(mockConfig));
      await service.loadConfig();

      // Act & Assert
      expect(service.isMockAuth()).toBe(true);
    });

    it('should return false when mockAuth is false', async () => {
      // Arrange
      const mockConfig = { apiUrl: 'http://test.api', mockAuth: false };
      httpMock.get.mockReturnValue(of(mockConfig));
      await service.loadConfig();

      // Act & Assert
      expect(service.isMockAuth()).toBe(false);
    });

    it('should return false when mockAuth not defined', async () => {
      // Arrange
      const mockConfig = { apiUrl: 'http://test.api' };
      httpMock.get.mockReturnValue(of(mockConfig));
      await service.loadConfig();

      // Act & Assert
      expect(service.isMockAuth()).toBe(false);
    });
  });
});
```

---

## Verificación

### Correr los tests

```bash
# Correr todos los tests de servicios
npm test -- --testPathPattern="services"

# Correr con coverage
npm run test:coverage

# Ver coverage report
open coverage/lcov-report/index.html
```

### Resultado Esperado

```
PASS src/app/core/services/logger.service.spec.ts
PASS src/app/core/services/loading.service.spec.ts
PASS src/app/core/services/config.service.spec.ts

Test Suites: 3 passed, 3 total
Tests:       25 passed, 25 total
Coverage:    85% statements, 80% branches
```

---

## Checklist de Completitud

- [ ] LoggerService tiene tests para todos los métodos
- [ ] LoadingService tiene tests para show/hide/forceHide
- [ ] ConfigService tiene tests para load/error
- [ ] Todos los tests pasan
- [ ] Coverage es mayor a 80%

---

## Retos Adicionales

### Reto 1: Testear setLevel() más exhaustivamente

Escribir tests que verifiquen todos los niveles de log.

### Reto 2: Testear edge cases

¿Qué pasa si hide() se llama más veces que show()?

### Reto 3: Añadir tests de integración

Testear cómo LoadingService interactúa con el interceptor.

---

*Lab 01 - Día 17 - Testing - Curso Angular 21*
