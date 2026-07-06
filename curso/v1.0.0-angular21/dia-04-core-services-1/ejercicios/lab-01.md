# Lab 01: Implementar LoggerService

## Objetivo

Crear un LoggerService completo con niveles de log, formato estructurado y configuración por entorno.

## Duración

**45 minutos**

## Prerrequisitos

- Proyecto Angular configurado (Día 1)
- Conocimiento de servicios e inyección de dependencias

---

## Ejercicio 1: Crear LoggerService Básico

### Paso 1: Generar el servicio

```bash
ng g service core/services/logger
```

### Paso 2: Definir tipos de log

```typescript
// src/app/core/services/logger.service.ts

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  args: unknown[];
}
```

### Paso 3: Implementar la clase base

```typescript
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  private level: LogLevel = 'debug';
  
  private readonly levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  };

  // Métodos públicos
  debug(message: string, ...args: unknown[]): void {}
  info(message: string, ...args: unknown[]): void {}
  warn(message: string, ...args: unknown[]): void {}
  error(message: string, ...args: unknown[]): void {}
  
  // Configuración
  setLevel(level: LogLevel): void {}
  
  // Métodos privados
  private log(level: LogLevel, message: string, args: unknown[]): void {}
  private shouldLog(level: LogLevel): boolean {}
  private formatMessage(level: LogLevel, message: string): string {}
}
```

---

## Ejercicio 2: Implementar Métodos de Log

### Paso 1: Implementar `shouldLog`

```typescript
private shouldLog(level: LogLevel): boolean {
  return this.levels[level] >= this.levels[this.level];
}
```

### Paso 2: Implementar `formatMessage`

```typescript
private formatMessage(level: LogLevel, message: string): string {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
}
```

### Paso 3: Implementar `log`

```typescript
private log(level: LogLevel, message: string, args: unknown[]): void {
  if (!this.shouldLog(level)) {
    return;
  }

  const formattedMessage = this.formatMessage(level, message);

  switch (level) {
    case 'debug':
      console.debug(formattedMessage, ...args);
      break;
    case 'info':
      console.info(formattedMessage, ...args);
      break;
    case 'warn':
      console.warn(formattedMessage, ...args);
      break;
    case 'error':
      console.error(formattedMessage, ...args);
      break;
  }
}
```

### Paso 4: Implementar métodos públicos

```typescript
debug(message: string, ...args: unknown[]): void {
  this.log('debug', message, args);
}

info(message: string, ...args: unknown[]): void {
  this.log('info', message, args);
}

warn(message: string, ...args: unknown[]): void {
  this.log('warn', message, args);
}

error(message: string, ...args: unknown[]): void {
  this.log('error', message, args);
}

setLevel(level: LogLevel): void {
  this.level = level;
}
```

---

## Ejercicio 3: Agregar Contexto de Aplicación

### Paso 1: Agregar propiedad de contexto

```typescript
@Injectable({ providedIn: 'root' })
export class LoggerService {
  private level: LogLevel = 'debug';
  private context = 'App'; // Nombre de la aplicación
  
  // ... resto del código
}
```

### Paso 2: Modificar `formatMessage`

```typescript
private formatMessage(level: LogLevel, message: string): string {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${this.context}] [${level.toUpperCase()}] ${message}`;
}
```

### Paso 3: Agregar método `setContext`

```typescript
setContext(context: string): void {
  this.context = context;
}
```

---

## Ejercicio 4: Agregar Método `group`

### Implementación

```typescript
/**
 * Inicia un grupo de logs colapsado
 */
group(label: string): void {
  if (this.shouldLog('debug')) {
    console.groupCollapsed(`[${this.context}] ${label}`);
  }
}

/**
 * Termina el grupo actual
 */
groupEnd(): void {
  console.groupEnd();
}
```

### Uso

```typescript
this.logger.group('User Operations');
this.logger.debug('Loading user');
this.logger.debug('Processing data');
this.logger.groupEnd();
```

---

## Ejercicio 5: Configuración por Entorno

### Paso 1: Crear archivos de entorno

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  logLevel: 'debug' as const
};

// src/environments/environment.prod.ts
export const environment = {
  production: true,
  logLevel: 'info' as const
};
```

### Paso 2: Configurar en app.config.ts

```typescript
import { environment } from '@env/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    // LoggerService ya tiene providedIn: 'root'
    // Configurar nivel en APP_INITIALIZER
    {
      provide: APP_INITIALIZER,
      useFactory: (logger: LoggerService) => () => {
        logger.setLevel(environment.logLevel);
        return Promise.resolve();
      },
      multi: true,
      deps: [LoggerService]
    }
  ]
};
```

---

## Ejercicio 6: Tests Unitarios

### Crear archivo de test

```typescript
// src/app/core/services/logger.service.spec.ts
import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;
  let consoleSpies: {
    debug: jest.SpyInstance;
    info: jest.SpyInstance;
    warn: jest.SpyInstance;
    error: jest.SpyInstance;
  };

  beforeEach(() => {
    service = new LoggerService();
    
    // Espiar todos los métodos de console
    consoleSpies = {
      debug: jest.spyOn(console, 'debug').mockImplementation(),
      info: jest.spyOn(console, 'info').mockImplementation(),
      warn: jest.spyOn(console, 'warn').mockImplementation(),
      error: jest.spyOn(console, 'error').mockImplementation()
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('debug', () => {
    it('should log debug message when level is debug', () => {
      service.setLevel('debug');
      service.debug('Test message', { key: 'value' });
      
      expect(consoleSpies.debug).toHaveBeenCalledWith(
        expect.stringContaining('[DEBUG]'),
        { key: 'value' }
      );
    });

    it('should not log debug when level is info', () => {
      service.setLevel('info');
      service.debug('Test message');
      
      expect(consoleSpies.debug).not.toHaveBeenCalled();
    });
  });

  describe('info', () => {
    it('should log info message when level is info', () => {
      service.setLevel('info');
      service.info('Info message');
      
      expect(consoleSpies.info).toHaveBeenCalled();
    });

    it('should not log info when level is warn', () => {
      service.setLevel('warn');
      service.info('Info message');
      
      expect(consoleSpies.info).not.toHaveBeenCalled();
    });
  });

  describe('error', () => {
    it('should always log error messages', () => {
      service.setLevel('error');
      service.error('Error message');
      
      expect(consoleSpies.error).toHaveBeenCalled();
    });
  });

  describe('setLevel', () => {
    it('should filter messages below level', () => {
      service.setLevel('warn');
      
      service.debug('debug');
      service.info('info');
      service.warn('warn');
      service.error('error');
      
      expect(consoleSpies.debug).not.toHaveBeenCalled();
      expect(consoleSpies.info).not.toHaveBeenCalled();
      expect(consoleSpies.warn).toHaveBeenCalled();
      expect(consoleSpies.error).toHaveBeenCalled();
    });
  });

  describe('formatMessage', () => {
    it('should include timestamp', () => {
      service.setLevel('info');
      service.info('Test');
      
      const call = consoleSpies.info.mock.calls[0][0];
      expect(call).toMatch(/\[\d{4}-\d{2}-\d{2}T/);
    });

    it('should include level', () => {
      service.setLevel('warn');
      service.warn('Test');
      
      const call = consoleSpies.warn.mock.calls[0][0];
      expect(call).toContain('[WARN]');
    });
  });
});
```

---

## Ejercicio 7: Uso en un Componente

### Crear componente de prueba

```typescript
// src/app/features/test/test.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { LoggerService } from '@core/services/logger.service';

@Component({
  selector: 'app-test',
  standalone: true,
  template: `<p>Test Component - Check console</p>`
})
export class TestComponent implements OnInit {
  private readonly logger = inject(LoggerService);

  ngOnInit(): void {
    this.logger.info('TestComponent initialized');
    this.logger.debug('Debug info', { id: 1, name: 'Test' });
    
    this.logger.group('User Operations');
    this.logger.debug('Step 1: Load user');
    this.logger.debug('Step 2: Process data');
    this.logger.groupEnd();
    
    this.simulateError();
  }

  private simulateError(): void {
    try {
      throw new Error('Simulated error');
    } catch (error) {
      this.logger.error('Caught error:', error);
    }
  }
}
```

---

## Verificación

### Ejecutar tests

```bash
npm test -- --include="**/logger.service.spec.ts"
```

### Verificar salida en consola

Al navegar al componente de prueba, deberías ver:

```
[2026-03-17T10:30:45.123Z] [App] [INFO] TestComponent initialized
[2026-03-17T10:30:45.125Z] [App] [DEBUG] Debug info {id: 1, name: 'Test'}
▼ [App] User Operations
    [2026-03-17T10:30:45.126Z] [App] [DEBUG] Step 1: Load user
    [2026-03-17T10:30:45.127Z] [App] [DEBUG] Step 2: Process data
[2026-03-17T10:30:45.128Z] [App] [ERROR] Caught error: Error: Simulated error
```

---

## Retos Adicionales

1. **Agregar timer**: Medir tiempo entre logs
   ```typescript
   const timerId = this.logger.startTimer('Operation');
   // ... operación
   this.logger.endTimer(timerId); // Log: "Operation took 150ms"
   ```

2. **Agregar persistencia**: Guardar logs en localStorage
   ```typescript
   this.logger.enablePersistence(100); // Guardar últimos 100 logs
   this.logger.getLogs(); // Obtener logs guardados
   ```

3. **Agregar colores**: Usar CSS en consola
   ```typescript
   // %c para estilos CSS
   console.debug(`%c${message}`, 'color: blue');
   ```

---

## Solución Completa

Ver archivo: `src/app/core/services/logger.service.ts`

---

*Lab 01 - LoggerService*
*Curso: Angular 21 Enterprise*
*Día: 4 de 18*
