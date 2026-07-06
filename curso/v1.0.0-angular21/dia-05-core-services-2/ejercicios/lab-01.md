# Lab 01: Implementar ConfigService

## Objetivo

Crear un ConfigService completo que cargue configuración desde un archivo JSON externo, la valide, y la exponga via Signals.

## Duración

**45 minutos**

---

## Ejercicio 1: Crear Modelo de Configuración

### Paso 1: Crear archivo de modelo

```typescript
// src/app/core/config/config.model.ts
export interface AppConfig {
  apiUrl: string;
  mockAuth?: boolean;
  timeout?: number;
  features?: {
    darkMode?: boolean;
    notifications?: boolean;
    analytics?: boolean;
  };
}

export const DEFAULT_CONFIG: AppConfig = {
  apiUrl: '',
  mockAuth: false,
  timeout: 30000,
  features: {
    darkMode: false,
    notifications: true,
    analytics: false
  }
};
```

---

## Ejercicio 2: Crear Archivo de Configuración

### Paso 1: Crear directorio y archivo

```bash
mkdir -p public/assets/config
```

### Paso 2: Crear config.json

```json
// public/assets/config/config.json
{
  "apiUrl": "http://localhost:8080/api",
  "mockAuth": false,
  "timeout": 30000,
  "features": {
    "darkMode": false,
    "notifications": true,
    "analytics": false
  }
}
```

---

## Ejercicio 3: Implementar ConfigService

### Paso 1: Generar el servicio

```bash
ng g service core/config/config
```

### Paso 2: Implementar carga de configuración

```typescript
// src/app/core/config/config.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { AppConfig, DEFAULT_CONFIG } from './config.model';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config = signal<AppConfig | null>(null);
  private loaded = signal(false);
  private error = signal<string | null>(null);

  config$ = this.config.asReadonly();
  isLoaded = this.loaded.asReadonly();
  hasError = computed(() => this.error() !== null);
  errorMessage = this.error.asReadonly();

  async loadConfig(): Promise<void> {
    try {
      const response = await fetch('assets/config/config.json');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const config = await response.json();
      this.validateConfig(config);
      
      const mergedConfig = { ...DEFAULT_CONFIG, ...config };
      this.config.set(mergedConfig);
      this.loaded.set(true);
      
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.error.set(message);
      throw error;
    }
  }

  private validateConfig(config: Partial<AppConfig>): void {
    if (!config.apiUrl) {
      throw new Error('apiUrl is required in configuration');
    }
    
    if (typeof config.apiUrl !== 'string') {
      throw new Error('apiUrl must be a string');
    }
    
    try {
      new URL(config.apiUrl);
    } catch {
      throw new Error('apiUrl must be a valid URL');
    }
  }

  getApiUrl(): string {
    return this.config()?.apiUrl ?? DEFAULT_CONFIG.apiUrl;
  }

  isMockAuth(): boolean {
    return this.config()?.mockAuth ?? DEFAULT_CONFIG.mockAuth ?? false;
  }

  getTimeout(): number {
    return this.config()?.timeout ?? DEFAULT_CONFIG.timeout!;
  }

  isFeatureEnabled(feature: keyof NonNullable<AppConfig['features']>): boolean {
    return this.config()?.features?.[feature] ?? DEFAULT_CONFIG.features?.[feature] ?? false;
  }

  getConfig(): AppConfig | null {
    return this.config();
  }
}
```

---

## Ejercicio 4: Configurar APP_INITIALIZER

### Paso 1: Actualizar app.config.ts

```typescript
// src/app/app.config.ts
import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { ConfigService } from '@core/config/config.service';

function initializeApp(configService: ConfigService): () => Promise<void> {
  return () => configService.loadConfig().catch(error => {
    console.error('Failed to load config:', error);
    // No bloquear la app, usar defaults
    return Promise.resolve();
  });
}

export const appConfig: ApplicationConfig = {
  providers: [
    // ... otros providers
    
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true,
      deps: [ConfigService]
    }
  ]
};
```

---

## Ejercicio 5: Usar ConfigService en un Servicio

### Paso 1: Crear UserService

```typescript
// src/app/core/services/user.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '@core/config/config.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly configService = inject(ConfigService);

  getUsers() {
    const apiUrl = this.configService.getApiUrl();
    return this.http.get(`${apiUrl}/users`);
  }

  getUser(id: string) {
    const apiUrl = this.configService.getApiUrl();
    return this.http.get(`${apiUrl}/users/${id}`);
  }
}
```

---

## Ejercicio 6: Tests Unitarios

```typescript
// src/app/core/config/config.service.spec.ts
import { ConfigService } from './config.service';
import { DEFAULT_CONFIG } from './config.model';

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(() => {
    service = new ConfigService();
    (global.fetch as jest.Mock) = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('loadConfig', () => {
    it('should load and validate config', async () => {
      const mockConfig = { apiUrl: 'http://test.api' };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockConfig)
      });

      await service.loadConfig();

      expect(service.isLoaded()).toBe(true);
      expect(service.getApiUrl()).toBe('http://test.api');
    });

    it('should merge with defaults', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ apiUrl: 'http://test.api' })
      });

      await service.loadConfig();

      expect(service.getTimeout()).toBe(DEFAULT_CONFIG.timeout);
    });

    it('should throw if apiUrl missing', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({})
      });

      await expect(service.loadConfig()).rejects.toThrow('apiUrl is required');
    });

    it('should throw if apiUrl invalid URL', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ apiUrl: 'not-a-url' })
      });

      await expect(service.loadConfig()).rejects.toThrow('valid URL');
    });
  });

  describe('getters', () => {
    beforeEach(async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          apiUrl: 'http://test.api',
          mockAuth: true,
          features: { darkMode: true }
        })
      });
      await service.loadConfig();
    });

    it('should return apiUrl', () => {
      expect(service.getApiUrl()).toBe('http://test.api');
    });

    it('should return mockAuth', () => {
      expect(service.isMockAuth()).toBe(true);
    });

    it('should return feature status', () => {
      expect(service.isFeatureEnabled('darkMode')).toBe(true);
      expect(service.isFeatureEnabled('notifications')).toBe(true); // default
    });
  });
});
```

---

## Verificación

### Ejecutar tests

```bash
npm test -- --include="**/config.service.spec.ts"
```

### Verificar en la aplicación

```typescript
// En un componente
ngOnInit(): void {
  console.log('API URL:', this.configService.getApiUrl());
  console.log('Mock Auth:', this.configService.isMockAuth());
  console.log('Dark Mode:', this.configService.isFeatureEnabled('darkMode'));
}
```

---

## Retos Adicionales

1. **Agregar cache**: Evitar recargar config si ya está cargada
2. **Hot reload**: Recargar config sin reiniciar la app
3. **Validación avanzada**: Validar features y timeout

---

*Lab 01 - ConfigService*
*Curso: Angular 21 Enterprise*
*Día: 5 de 18*
