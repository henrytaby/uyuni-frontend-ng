# Contenido Completo - Día 5: ConfigService y TokenRefreshService

## Tabla de Contenidos

1. [Introducción a la Configuración](#1-introducción-a-la-configuración)
2. [ConfigService](#2-configservice)
3. [TokenRefreshService](#3-tokenrefreshservice)
4. [APP_INITIALIZER](#4-app_initializer)
5. [Integración](#5-integración)
6. [Testing](#6-testing)
7. [Buenas Prácticas](#7-buenas-prácticas)

---

## 1. Introducción a la Configuración

### 1.1 El Problema de la Configuración Hardcodeada

```typescript
// ❌ Problema: Valores hardcodeados
export class ApiService {
  private apiUrl = 'http://localhost:8080/api'; // Hardcodeado
  
  getUsers() {
    return this.http.get(`${this.apiUrl}/users`);
  }
}
```

**Problemas:**
- Diferentes URLs por entorno (dev, staging, prod)
- Cambios requieren recompilar
- Información sensible expuesta en código
- Difícil mantenimiento

### 1.2 Solución: ConfigService

```
┌─────────────────────────────────────────────────────────────┐
│                  CONFIGURACIÓN EXTERNA                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  config.json (assets)                                        │
│  {                                                           │
│    "apiUrl": "http://localhost:8080/api",                   │
│    "mockAuth": false,                                       │
│    "timeout": 30000                                         │
│  }                                                           │
│                                                              │
│  ConfigService                                               │
│  - Carga config.json al inicio                              │
│  - Expone configuración via Signals                         │
│  - Valida configuración requerida                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 1.3 Beneficios

| Beneficio | Descripción |
|-----------|-------------|
| **Sin recompilar** | Cambios sin rebuild |
| **Por entorno** | Diferentes configs por ambiente |
| **Seguro** | Secrets fuera del código |
| **Mantenible** | Un solo lugar para configuración |

---

## 2. ConfigService

### 2.1 Estructura de Archivos

```
src/app/core/config/
├── config.model.ts      # Interfaces de configuración
├── config.service.ts    # Servicio de configuración
└── config.service.spec.ts # Tests
```

### 2.2 Modelo de Configuración

```typescript
// src/app/core/config/config.model.ts
export interface AppConfig {
  apiUrl: string;
  mockAuth?: boolean;
  timeout?: number;
  features?: {
    darkMode?: boolean;
    notifications?: boolean;
  };
}

export const DEFAULT_CONFIG: AppConfig = {
  apiUrl: '',
  mockAuth: false,
  timeout: 30000,
  features: {
    darkMode: false,
    notifications: true
  }
};
```

### 2.3 Implementación de ConfigService

```typescript
// src/app/core/config/config.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { AppConfig, DEFAULT_CONFIG } from './config.model';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config = signal<AppConfig | null>(null);
  private loaded = signal(false);
  private error = signal<string | null>(null);

  // Signals públicas
  config$ = this.config.asReadonly();
  isLoaded = this.loaded.asReadonly();
  hasError = computed(() => this.error() !== null);

  /**
   * Carga la configuración desde assets/config/config.json
   */
  async loadConfig(): Promise<void> {
    try {
      const response = await fetch('assets/config/config.json');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const config = await response.json();
      
      // Validar configuración
      this.validateConfig(config);
      
      // Mezclar con defaults
      const mergedConfig = { ...DEFAULT_CONFIG, ...config };
      
      this.config.set(mergedConfig);
      this.loaded.set(true);
      
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.error.set(message);
      throw error;
    }
  }

  /**
   * Valida que la configuración tenga los campos requeridos
   */
  private validateConfig(config: Partial<AppConfig>): void {
    if (!config.apiUrl) {
      throw new Error('apiUrl is required in configuration');
    }
    
    if (typeof config.apiUrl !== 'string') {
      throw new Error('apiUrl must be a string');
    }
  }

  // Getters de conveniencia
  getApiUrl(): string {
    return this.config()?.apiUrl ?? DEFAULT_CONFIG.apiUrl;
  }

  isMockAuth(): boolean {
    return this.config()?.mockAuth ?? DEFAULT_CONFIG.mockAuth;
  }

  getTimeout(): number {
    return this.config()?.timeout ?? DEFAULT_CONFIG.timeout!;
  }

  isFeatureEnabled(feature: keyof NonNullable<AppConfig['features']>): boolean {
    return this.config()?.features?.[feature] ?? false;
  }
}
```

### 2.4 Archivo de Configuración

```json
// public/assets/config/config.json
{
  "apiUrl": "http://localhost:8080/api",
  "mockAuth": false,
  "timeout": 30000,
  "features": {
    "darkMode": false,
    "notifications": true
  }
}
```

### 2.5 Configuración por Entorno

```json
// public/assets/config/config.prod.json
{
  "apiUrl": "https://api.uyuni.com",
  "mockAuth": false,
  "timeout": 60000,
  "features": {
    "darkMode": true,
    "notifications": true
  }
}
```

---

## 3. TokenRefreshService

### 3.1 El Problema del Token Expirado

```
┌─────────────────────────────────────────────────────────────┐
│              FLUJO SIN TOKEN REFRESH                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Request → 401 Unauthorized → Logout                        │
│                                                              │
│  Problema: Usuario pierde sesión aunque tiene               │
│  refresh token válido.                                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              FLUJO CON TOKEN REFRESH                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Request → 401 → Refresh Token → Retry Request              │
│                                                              │
│  Beneficio: Sesión continúa sin interrupción.               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 OAuth2 Refresh Token Flow

```
┌─────────────────────────────────────────────────────────────┐
│                 REFRESH TOKEN FLOW                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Request falla con 401                                    │
│     │                                                        │
│     ▼                                                        │
│  2. ¿Hay refresh token?                                      │
│     │                                                        │
│     ├─ No → Logout                                           │
│     │                                                        │
│     └─ Sí → ¿Ya se está refrescando?                        │
│              │                                               │
│              ├─ Sí → Encolar request                         │
│              │        │                                      │
│              │        └─→ Esperar a que termine refresh     │
│              │                                               │
│              └─ No → Iniciar refresh                         │
│                       │                                      │
│                       ▼                                      │
│              POST /auth/refresh                              │
│                       │                                      │
│                       ├─ Success → Guardar nuevos tokens    │
│                       │            │                         │
│                       │            └─→ Procesar cola        │
│                       │                                      │
│                       └─ Error → Logout                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 Implementación de TokenRefreshService

```typescript
// src/app/core/services/token-refresh.service.ts
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, of, throwError } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { ConfigService } from '@core/config/config.service';
import { LoggerService } from '@core/services/logger.service';

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface QueuedRequest {
  request$: Observable<any>;
  subject: Subject<any>;
}

@Injectable({ providedIn: 'root' })
export class TokenRefreshService {
  private readonly http = inject(HttpClient);
  private readonly configService = inject(ConfigService);
  private readonly logger = inject(LoggerService);

  // Estado
  private refreshing = signal(false);
  private queue: QueuedRequest[] = [];

  // Signal pública
  isRefreshing = this.refreshing.asReadonly();

  /**
   * Refresca el token de acceso
   */
  refreshToken(refreshToken: string): Observable<TokenResponse> {
    this.logger.info('Refreshing token...');
    this.refreshing.set(true);

    const apiUrl = this.configService.getApiUrl();
    
    return this.http.post<TokenResponse>(`${apiUrl}/auth/refresh`, {
      refreshToken
    }).pipe(
      tap(response => {
        this.logger.info('Token refreshed successfully');
        this.refreshing.set(false);
        this.processQueue(null, response);
      }),
      catchError(error => {
        this.logger.error('Token refresh failed', error);
        this.refreshing.set(false);
        this.processQueue(error, null);
        return throwError(() => error);
      })
    );
  }

  /**
   * Encola una petición hasta que el refresh termine
   */
  queueRequest<T>(request$: Observable<T>): Observable<T> {
    // Si no estamos refrescando, ejecutar directamente
    if (!this.refreshing()) {
      return request$;
    }

    this.logger.debug('Queueing request until refresh completes');

    return new Observable<T>(subscriber => {
      const queuedRequest: QueuedRequest = {
        request$,
        subject: new Subject<any>()
      };

      this.queue.push(queuedRequest);

      // Retornar el subject para que el subscriber reciba el resultado
      queuedRequest.subject.subscribe({
        next: value => subscriber.next(value),
        error: error => subscriber.error(error),
        complete: () => subscriber.complete()
      });
    });
  }

  /**
   * Procesa la cola de peticiones pendientes
   */
  private processQueue(error: any, tokens: TokenResponse | null): void {
    this.logger.debug(`Processing ${this.queue.length} queued requests`);

    this.queue.forEach(queuedRequest => {
      if (error) {
        queuedRequest.subject.error(error);
      } else {
        // Reintentar la petición con el nuevo token
        queuedRequest.request$.subscribe({
          next: value => queuedRequest.subject.next(value),
          error: err => queuedRequest.subject.error(err),
          complete: () => queuedRequest.subject.complete()
        });
      }
    });

    // Limpiar la cola
    this.queue = [];
  }
}
```

---

## 4. APP_INITIALIZER

### 4.1 ¿Qué es APP_INITIALIZER?

`APP_INITIALIZER` es un token de inyección que permite ejecutar funciones antes de que la aplicación se inicialice completamente.

```
┌─────────────────────────────────────────────────────────────┐
│                 APP_INITIALIZER FLOW                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  bootstrapApplication()                                      │
│       │                                                      │
│       ▼                                                      │
│  APP_INITIALIZER (ConfigService.loadConfig)                  │
│       │                                                      │
│       ├─ Success → Continue bootstrap                        │
│       │                                                      │
│       └─ Error → App fails to start                         │
│                                                              │
│  AppComponent                                                 │
│  - ConfigService.config$ ya tiene valor                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Configuración en app.config.ts

```typescript
// src/app/app.config.ts
import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { ConfigService } from '@core/config/config.service';

function initializeApp(configService: ConfigService): () => Promise<void> {
  return () => configService.loadConfig();
}

export const appConfig: ApplicationConfig = {
  providers: [
    // ... otros providers
    
    // Inicializar configuración antes de que la app inicie
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true,
      deps: [ConfigService]
    }
  ]
};
```

### 4.3 Manejo de Errores en Inicialización

```typescript
function initializeApp(configService: ConfigService): () => Promise<void> {
  return () => configService.loadConfig().catch(error => {
    // Log del error pero no bloquear la app
    console.error('Failed to load config:', error);
    
    // La app puede usar valores por defecto
    return Promise.resolve();
  });
}
```

---

## 5. Integración

### 5.1 Uso de ConfigService en Servicios

```typescript
// src/app/features/user/user.service.ts
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly configService = inject(ConfigService);

  getUsers(): Observable<User[]> {
    const apiUrl = this.configService.getApiUrl();
    return this.http.get<User[]>(`${apiUrl}/users`);
  }
}
```

### 5.2 Integración con AuthInterceptor

```typescript
// src/app/core/interceptors/auth.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const tokenRefreshService = inject(TokenRefreshService);
  const configService = inject(ConfigService);

  // No agregar token a requests de auth
  if (req.url.includes('/auth/')) {
    return next(req);
  }

  const token = authService.accessToken();

  if (!token) {
    return next(req);
  }

  // Clonar request con token
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq).pipe(
    catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        // Token expirado, intentar refresh
        return handleTokenExpired(authService, tokenRefreshService, req, next);
      }
      return throwError(() => error);
    })
  );
};

function handleTokenExpired(
  authService: AuthService,
  tokenRefreshService: TokenRefreshService,
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> {
  const refreshToken = authService.refreshToken();

  if (!refreshToken) {
    authService.logout();
    return throwError(() => new Error('No refresh token'));
  }

  if (tokenRefreshService.isRefreshing()) {
    // Ya se está refrescando, encolar
    return tokenRefreshService.queueRequest(
      tokenRefreshService.refreshToken(refreshToken).pipe(
        switchMap(() => {
          const newToken = authService.accessToken();
          const authReq = req.clone({
            setHeaders: { Authorization: `Bearer ${newToken}` }
          });
          return next(authReq);
        })
      )
    );
  }

  // Iniciar refresh
  return tokenRefreshService.refreshToken(refreshToken).pipe(
    tap(tokens => {
      authService.setTokens(tokens);
    }),
    switchMap(() => {
      const newToken = authService.accessToken();
      const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${newToken}` }
      });
      return next(authReq);
    }),
    catchError(error => {
      authService.logout();
      return throwError(() => error);
    })
  );
}
```

---

## 6. Testing

### 6.1 Test de ConfigService

```typescript
// src/app/core/config/config.service.spec.ts
describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(() => {
    service = new ConfigService();
    // Mock fetch
    (global.fetch as jest.Mock) = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('loadConfig', () => {
    it('should load config from assets', async () => {
      const mockConfig = { apiUrl: 'http://test.api' };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockConfig)
      });

      await service.loadConfig();

      expect(service.isLoaded()).toBe(true);
      expect(service.getApiUrl()).toBe('http://test.api');
    });

    it('should throw error if apiUrl is missing', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({})
      });

      await expect(service.loadConfig()).rejects.toThrow('apiUrl is required');
    });

    it('should handle fetch error', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404
      });

      await expect(service.loadConfig()).rejects.toThrow();
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
    });
  });
});
```

### 6.2 Test de TokenRefreshService

```typescript
// src/app/core/services/token-refresh.service.spec.ts
describe('TokenRefreshService', () => {
  let service: TokenRefreshService;
  let httpMock: jest.Mocked<HttpClient>;
  let configServiceMock: jest.Mocked<ConfigService>;

  beforeEach(() => {
    httpMock = { post: jest.fn() } as any;
    configServiceMock = { getApiUrl: () => 'http://test.api' } as any;
    
    TestBed.configureTestingModule({
      providers: [
        TokenRefreshService,
        { provide: HttpClient, useValue: httpMock },
        { provide: ConfigService, useValue: configServiceMock },
        { provide: LoggerService, useValue: { info: jest.fn(), error: jest.fn() } }
      ]
    });

    service = TestBed.inject(TokenRefreshService);
  });

  describe('refreshToken', () => {
    it('should call refresh endpoint', () => {
      const mockResponse = {
        accessToken: 'new-token',
        refreshToken: 'new-refresh',
        expiresIn: 3600
      };

      httpMock.post.mockReturnValue(of(mockResponse));

      service.refreshToken('old-refresh').subscribe();

      expect(httpMock.post).toHaveBeenCalledWith(
        'http://test.api/auth/refresh',
        { refreshToken: 'old-refresh' }
      );
    });

    it('should set refreshing to true during refresh', (done) => {
      httpMock.post.mockReturnValue(of({ accessToken: 'token' }));

      expect(service.isRefreshing()).toBe(false);

      service.refreshToken('refresh').subscribe({
        complete: () => {
          expect(service.isRefreshing()).toBe(false);
          done();
        }
      });

      expect(service.isRefreshing()).toBe(true);
    });
  });

  describe('queueRequest', () => {
    it('should execute request if not refreshing', () => {
      const request$ = of('result');

      service.queueRequest(request$).subscribe(result => {
        expect(result).toBe('result');
      });
    });

    it('should queue request if refreshing', (done) => {
      httpMock.post.mockReturnValue(of({ accessToken: 'token' }));
      
      // Iniciar refresh
      service.refreshToken('refresh').subscribe();

      const request$ = of('queued-result');
      
      service.queueRequest(request$).subscribe(result => {
        expect(result).toBe('queued-result');
        done();
      });
    });
  });
});
```

---

## 7. Buenas Prácticas

### 7.1 ConfigService

| Práctica | Descripción |
|----------|-------------|
| **Validar configuración** | Verificar campos requeridos |
| **Usar defaults** | Valores por defecto para opcionales |
| **Manejar errores** | No bloquear la app si falla |
| **Documentar** | Comentar cada propiedad |

### 7.2 TokenRefreshService

| Práctica | Descripción |
|----------|-------------|
| **Cola de peticiones** | Evitar múltiples refresh simultáneos |
| **Limpiar cola** | Vaciar después de procesar |
| **Logout en error** | Redirigir a login si refresh falla |
| **Log de eventos** | Registrar refresh para debug |

### 7.3 Seguridad

```typescript
// ❌ No guardar tokens sensibles en config
{
  "apiUrl": "http://api.example.com",
  "apiKey": "secret-key" // ❌ No hacer esto
}

// ✅ Usar variables de entorno del servidor
// config.json no debe tener secrets
```

---

## Resumen del Día

| Concepto | Descripción |
|----------|-------------|
| **ConfigService** | Carga configuración externa |
| **APP_INITIALIZER** | Ejecuta código antes del bootstrap |
| **TokenRefreshService** | Maneja refresh de tokens |
| **Cola de peticiones** | Evita race conditions |
| **Integración** | AuthInterceptor usa ambos servicios |

---

*Curso: Angular 21 Enterprise*
*Día: 5 de 18*
