# Día 5: Core Services - ConfigService y TokenRefreshService

## Información General

| Aspecto | Detalle |
|---------|---------|
| **Módulo** | 2 - Core Services |
| **Duración** | 3 horas |
| **Prerrequisitos** | Días 1-4 completados |
| **Archivos de referencia** | `src/app/core/config/`, `src/app/core/services/token-refresh.service.ts` |

## Objetivos de Aprendizaje

Al finalizar este día, el estudiante será capaz de:

1. **Cargar configuración** desde archivos JSON externos
2. **Implementar ConfigService** con inicialización asíncrona
3. **Manejar tokens JWT** con refresh automático
4. **Implementar TokenRefreshService** con cola de peticiones
5. **Usar APP_INITIALIZER** para carga temprana
6. **Manejar errores** de configuración y tokens

## Estructura de Clase

### 1. Hook (15 min)
- Demo: Aplicación sin configuración vs con configuración
- Problema: Valores hardcodeados y tokens expirados

### 2. Contexto (20 min)
- Por qué externalizar configuración
- Flujo de OAuth2 refresh token
- Cola de peticiones durante refresh

### 3. Explicación (60 min)
- ConfigService: carga, validación, acceso
- TokenRefreshService: refresh, cola, errores
- APP_INITIALIZER y inicialización

### 4. Demo/Código (45 min)
- Implementar ConfigService paso a paso
- Implementar TokenRefreshService paso a paso
- Integración con AuthService

### 5. Error Común (15 min)
- Configuración no encontrada
- Refresh token expirado
- Race conditions en refresh

### 6. Mini Reto (20 min)
- Agregar nueva propiedad de configuración
- Implementar refresh proactivo

### 7. Cierre (10 min)
- Resumen de conceptos
- Preview del Día 6

## Materiales

| Archivo | Descripción |
|---------|-------------|
| [`contenido.md`](./contenido.md) | Contenido teórico completo |
| [`slides/dia-05-core-services-2_Marp.md`](./slides/dia-05-core-services-2_Marp.md) | Presentación Marp |
| [`ejercicios/lab-01.md`](./ejercicios/lab-01.md) | Lab: ConfigService |
| [`ejercicios/lab-02.md`](./ejercicios/lab-02.md) | Lab: TokenRefreshService |
| [`assessment/preguntas.md`](./assessment/preguntas.md) | 50 preguntas de opción múltiple |
| [`recursos/bibliografia.md`](./recursos/bibliografia.md) | Referencias y recursos |
| [`recursos/cheatsheet.md`](./recursos/cheatsheet.md) | Guía rápida |
| [`recursos/script-audio.md`](./recursos/script-audio.md) | Guion de podcast |
| [`recursos/script-video-youtube.md`](./recursos/script-video-youtube.md) | Guion de video YouTube |

## Conceptos Clave

```
┌─────────────────────────────────────────────────────────────┐
│                    CONFIG & TOKEN FLOW                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  APP_INITIALIZER                                             │
│       │                                                      │
│       ▼                                                      │
│  ConfigService.loadConfig()                                  │
│       │                                                      │
│       ▼                                                      │
│  config.json ──→ { apiUrl, mockAuth, ... }                  │
│                                                              │
│  HTTP Request (401)                                          │
│       │                                                      │
│       ▼                                                      │
│  TokenRefreshService                                         │
│       │                                                      │
│       ├─→ isRefreshing = true                                │
│       │                                                      │
│       ├─→ POST /auth/refresh                                 │
│       │      │                                               │
│       │      ├─→ Success: new tokens                         │
│       │      │        │                                      │
│       │      │        └─→ Process queued requests            │
│       │      │                                               │
│       │      └─→ Error: logout                               │
│       │                                                      │
│       └─→ Queue request until refresh completes              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Código de Referencia

### ConfigService

```typescript
@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config = signal<AppConfig | null>(null);
  private loaded = signal(false);

  config$ = this.config.asReadonly();
  isLoaded = this.loaded.asReadonly();

  async loadConfig(): Promise<void> {
    try {
      const response = await fetch('assets/config/config.json');
      const config = await response.json();
      this.config.set(config);
      this.loaded.set(true);
    } catch (error) {
      console.error('Failed to load config', error);
      throw error;
    }
  }

  getApiUrl(): string {
    return this.config()?.apiUrl ?? '';
  }

  isMockAuth(): boolean {
    return this.config()?.mockAuth ?? false;
  }
}
```

### TokenRefreshService

```typescript
@Injectable({ providedIn: 'root' })
export class TokenRefreshService {
  private refreshing = signal(false);
  private queue: QueuedRequest[] = [];

  isRefreshing = this.refreshing.asReadonly();

  refreshToken(refreshToken: string): Observable<TokenResponse> {
    this.refreshing.set(true);
    
    return this.http.post<TokenResponse>('/auth/refresh', { refreshToken }).pipe(
      tap(tokens => {
        this.refreshing.set(false);
        this.processQueue(null, tokens);
      }),
      catchError(error => {
        this.refreshing.set(false);
        this.processQueue(error, null);
        return throwError(() => error);
      })
    );
  }

  queueRequest<T>(request: Observable<T>): Observable<T> {
    if (!this.refreshing()) {
      return request;
    }

    return new Observable(subscriber => {
      this.queue.push({
        request,
        subscriber
      });
    });
  }
}
```

## Ejercicios del Día

### Lab 01: ConfigService
- Crear archivo de configuración JSON
- Implementar ConfigService con carga asíncrona
- Agregar validación de configuración
- Integrar con APP_INITIALIZER

### Lab 02: TokenRefreshService
- Implementar refresh token flow
- Crear cola de peticiones
- Manejar errores de refresh
- Integrar con auth interceptor

## Evaluación

- 50 preguntas de opción múltiple
- Cobertura: ConfigService (25), TokenRefreshService (25)
- Tiempo estimado: 30 minutos

## Próximo Día

**Día 6**: AuthErrorHandlerService y NetworkErrorService
- Manejo centralizado de errores de autenticación
- Detección y recuperación de errores de red
- Retry con exponential backoff

---

*Curso: Angular 21 Enterprise*
*Día: 5 de 18*
