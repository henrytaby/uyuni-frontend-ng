marp: true
theme: default
paginate: true
backgroundColor: #fff
style: |
  section {
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
  }
  h1 { color: #38240c; font-size: 2em; }
  h2 { color: #38240c; font-size: 1.5em; }
  code { background: #f5f5f5; padding: 2px 6px; border-radius: 4px; }
  pre { background: #2d2d2d; color: #f8f8f2; padding: 16px; border-radius: 8px; font-size: 12px; }

---

# Día 5: ConfigService y TokenRefreshService

**Curso: Angular 21 Enterprise**

---

# Agenda del Día

1. **Hook** - El problema de la configuración hardcodeada
2. **Contexto** - Por qué externalizar configuración
3. **ConfigService** - Carga y validación
4. **APP_INITIALIZER** - Inicialización temprana
5. **TokenRefreshService** - Refresh automático
6. **Integración** - Con AuthInterceptor
7. **Testing** - Tests unitarios

---

# Hook: El Problema

## Configuración Hardcodeada

```typescript
// ❌ Problema
export class ApiService {
  private apiUrl = 'http://localhost:8080/api';
  
  getUsers() {
    return this.http.get(`${this.apiUrl}/users`);
  }
}
```

### Problemas:
- 🔴 Diferentes URLs por entorno
- 🔴 Cambios requieren recompilar
- 🔴 Información sensible expuesta
- 🔴 Difícil mantenimiento

---

# Hook: Token Expirado

## Sin Refresh Token

```
Request → 401 → Logout

Usuario pierde sesión aunque tiene refresh token válido.
```

## Con Refresh Token

```
Request → 401 → Refresh → Retry

Sesión continúa sin interrupción.
```

---

# Contexto: Configuración Externa

## Beneficios

| Beneficio | Descripción |
|-----------|-------------|
| Sin recompilar | Cambios sin rebuild |
| Por entorno | Diferentes configs |
| Seguro | Secrets fuera del código |
| Mantenible | Un solo lugar |

---

# ConfigService: Estructura

```
src/app/core/config/
├── config.model.ts      # Interfaces
├── config.service.ts    # Servicio
└── config.service.spec.ts # Tests
```

---

# ConfigService: Modelo

```typescript
export interface AppConfig {
  apiUrl: string;
  mockAuth?: boolean;
  timeout?: number;
  features?: {
    darkMode?: boolean;
    notifications?: boolean;
  };
}
```

---

# ConfigService: Implementación

```typescript
@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config = signal<AppConfig | null>(null);
  private loaded = signal(false);

  async loadConfig(): Promise<void> {
    const response = await fetch('assets/config/config.json');
    const config = await response.json();
    this.validateConfig(config);
    this.config.set({ ...DEFAULT_CONFIG, ...config });
    this.loaded.set(true);
  }

  getApiUrl(): string {
    return this.config()?.apiUrl ?? '';
  }
}
```

---

# ConfigService: Validación

```typescript
private validateConfig(config: Partial<AppConfig>): void {
  if (!config.apiUrl) {
    throw new Error('apiUrl is required');
  }
  
  if (typeof config.apiUrl !== 'string') {
    throw new Error('apiUrl must be a string');
  }
}
```

---

# Archivo de Configuración

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

---

# APP_INITIALIZER

## ¿Qué es?

Ejecuta funciones antes de que la app inicie completamente.

```
bootstrapApplication()
       │
       ▼
APP_INITIALIZER (loadConfig)
       │
       ├─ Success → Continue
       │
       └─ Error → App fails
```

---

# APP_INITIALIZER: Configuración

```typescript
// app.config.ts
function initializeApp(configService: ConfigService) {
  return () => configService.loadConfig();
}

export const appConfig: ApplicationConfig = {
  providers: [
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

# TokenRefreshService: Flujo

```
┌─────────────────────────────────────────┐
│         REFRESH TOKEN FLOW               │
├─────────────────────────────────────────┤
│  1. Request falla con 401               │
│     │                                    │
│     ▼                                    │
│  2. ¿Hay refresh token?                  │
│     │                                    │
│     ├─ No → Logout                       │
│     │                                    │
│     └─ Sí → ¿Ya refrescando?            │
│              │                           │
│              ├─ Sí → Encolar             │
│              │                           │
│              └─ No → POST /auth/refresh  │
└─────────────────────────────────────────┘
```

---

# TokenRefreshService: Estado

```typescript
@Injectable({ providedIn: 'root' })
export class TokenRefreshService {
  private refreshing = signal(false);
  private queue: QueuedRequest[] = [];

  isRefreshing = this.refreshing.asReadonly();
}
```

---

# TokenRefreshService: Refresh

```typescript
refreshToken(refreshToken: string): Observable<TokenResponse> {
  this.refreshing.set(true);
  
  return this.http.post<TokenResponse>('/auth/refresh', {
    refreshToken
  }).pipe(
    tap(response => {
      this.refreshing.set(false);
      this.processQueue(null, response);
    }),
    catchError(error => {
      this.refreshing.set(false);
      this.processQueue(error, null);
      return throwError(() => error);
    })
  );
}
```

---

# TokenRefreshService: Cola

```typescript
queueRequest<T>(request$: Observable<T>): Observable<T> {
  if (!this.refreshing()) {
    return request$;
  }

  return new Observable(subscriber => {
    this.queue.push({ request$, subject: new Subject() });
  });
}

private processQueue(error: any, tokens: TokenResponse | null): void {
  this.queue.forEach(item => {
    if (error) {
      item.subject.error(error);
    } else {
      item.request$.subscribe(item.subject);
    }
  });
  this.queue = [];
}
```

---

# Integración con AuthInterceptor

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // ... agregar token
  
  return next(authReq).pipe(
    catchError(error => {
      if (error.status === 401) {
        return handleTokenExpired(/* ... */);
      }
      return throwError(() => error);
    })
  );
};
```

---

# Manejo de Token Expirado

```typescript
function handleTokenExpired(/* ... */): Observable<HttpEvent<any>> {
  if (tokenRefreshService.isRefreshing()) {
    // Ya se está refrescando, encolar
    return tokenRefreshService.queueRequest(
      /* retry request after refresh */
    );
  }

  // Iniciar refresh
  return tokenRefreshService.refreshToken(refreshToken).pipe(
    switchMap(() => {
      // Reintentar con nuevo token
      return next(req.clone({
        setHeaders: { Authorization: `Bearer ${newToken}` }
      }));
    })
  );
}
```

---

# Testing: ConfigService

```typescript
it('should load config from assets', async () => {
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ apiUrl: 'http://test.api' })
  });

  await service.loadConfig();

  expect(service.isLoaded()).toBe(true);
  expect(service.getApiUrl()).toBe('http://test.api');
});
```

---

# Testing: TokenRefreshService

```typescript
it('should call refresh endpoint', () => {
  httpMock.post.mockReturnValue(of({ accessToken: 'token' }));

  service.refreshToken('refresh').subscribe();

  expect(httpMock.post).toHaveBeenCalledWith(
    'http://test.api/auth/refresh',
    { refreshToken: 'refresh' }
  );
});
```

---

# Error Común 1: Config No Encontrada

```typescript
// ❌ Error: 404 en config.json
// La app no inicia

// ✅ Solución: Manejar error gracefully
async loadConfig(): Promise<void> {
  try {
    // ... load config
  } catch (error) {
    console.error('Config load failed, using defaults');
    this.config.set(DEFAULT_CONFIG);
    this.loaded.set(true);
  }
}
```

---

# Error Común 2: Race Condition

```typescript
// ❌ Problema: Múltiples refresh simultáneos
// Cada 401 dispara un refresh

// ✅ Solución: Usar cola de peticiones
if (tokenRefreshService.isRefreshing()) {
  return tokenRefreshService.queueRequest(request$);
}
```

---

# Buenas Prácticas

## ConfigService
- ✅ Validar configuración
- ✅ Usar valores por defecto
- ✅ Manejar errores gracefully
- ✅ Documentar propiedades

## TokenRefreshService
- ✅ Cola de peticiones
- ✅ Limpiar cola después de procesar
- ✅ Logout en error
- ✅ Log de eventos

---

# Resumen del Día

| Concepto | Descripción |
|----------|-------------|
| **ConfigService** | Carga configuración externa |
| **APP_INITIALIZER** | Ejecuta antes del bootstrap |
| **TokenRefreshService** | Maneja refresh de tokens |
| **Cola de peticiones** | Evita race conditions |
| **Integración** | AuthInterceptor usa ambos |

---

# Próximo Día

## Día 6: AuthErrorHandlerService y NetworkErrorService

- Manejo centralizado de errores de auth
- Detección y recuperación de errores de red
- Retry con exponential backoff

---

# ¡Gracias!

## Ejercicios del Día

1. **Lab 01**: Implementar ConfigService
2. **Lab 02**: Implementar TokenRefreshService

### Recursos:
- `contenido.md` - Material completo
- `ejercicios/` - Labs prácticos
- `assessment/` - 50 preguntas

**¡Nos vemos en el Día 6!**
