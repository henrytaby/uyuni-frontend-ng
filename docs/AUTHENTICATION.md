# 🔐 Documentación del Sistema de Autenticación

Este documento describe la arquitectura, flujos y decisiones técnicas del sistema de autenticación implementado en **UyuniAdmin**.

## 1. Visión General

El sistema utiliza un esquema **OAuth2 Password Grant** modificado, basado en **JWT (JSON Web Tokens)**. Está diseñado para ser robusto, seguro y tolerante a fallos de red, con una arquitectura que previene condiciones de carrera y dependencias circulares.

### Características Clave
- **Tokens**: Access Token (ej. 30 min) y Refresh Token (ej. 7 días).
- **Almacenamiento**: `localStorage` (Persistencia entre pestañas).
- **Estado**: Gestionado por **Angular Signals** (Reactividad granular).
- **Intercepción**: Manejo automático de adjunción de tokens y renovación transparente (Silent Refresh).
- **Contexto**: Inyección automática del header `X-Active-Role` para filtrado de datos en backend.
- **Seguridad**: Bloqueo de cuenta (403), Auto-Logout, y limpieza de estado.

---

## 2. Estructura de Archivos

Los componentes clave se encuentran distribuidos siguiendo una arquitectura modular:

```text
src/app/
├── core/
│   ├── auth/
│   │   └── auth.service.ts        # Lógica central (Login, Logout, Refresh, Profile)
│   ├── config/
│   │   └── config.service.ts      # Infraestructura (Carga config.json con HttpBackend)
│   ├── interceptors/
│   │   ├── auth.interceptor.ts    # Middleware HTTP (Token Injection y Error Handling)
│   │   └── loading.interceptor.ts # UI (Spinner global - Robusto por contador en Raíz)
│   ├── guards/
│   │   └── auth.guard.ts          # Protección de rutas
│   └── services/
│       ├── logger.service.ts           # Sistema de logging estructurado
│       ├── token-refresh.service.ts    # Encapsula lógica de renovación de tokens
│       └── auth-error-handler.service.ts # Manejo centralizado de errores de auth
├── features/
│   └── auth/
│       └── pages/
│           ├── sign-in/           # Página de Login (Manejo de UI y Errores)
│           └── ...
└── shared/
    └── components/
        └── header/
            └── user-dropdown/     # Botón de Logout (Interacción usuario)
```

---

## 3. Diagramas de Flujo

### 3.1. Flujo de Login (Inicio de Sesión)

Cuando el usuario ingresa sus credenciales en `/signin`:

```mermaid
sequenceDiagram
    actor U as Usuario
    participant C as SignInComponent
    participant S as AuthService
    participant API as Backend API

    U->>C: Ingresa Usuario/Pass
    C->>S: login(user, pass)
    S->>API: POST /auth/login (x-www-form-urlencoded)
    
    alt Credenciales Válidas
        API-->>S: 200 OK {access_token, refresh_token}
        S->>S: setSession() (Guarda en LocalStorage)
        S->>S: refreshProfile() (Carga Usuario/Roles)
        S-->>C: Éxito
        C->>U: Redirección al Dashboard
    else Credenciales Inválidas
        API-->>S: 401 Unauthorized
        S-->>C: Error Observable
        C->>U: Muestra "Usuario incorrecto"
    else Cuenta Bloqueada
        API-->>S: 403 Forbidden {wait_seconds: 300}
        S-->>C: Error Observable
        C->>U: Muestra "Bloqueado por 5 min"
    end
```

### 3.2. Flujo del AuthInterceptor (El Guardián Silencioso)

Este es el corazón del sistema. Cada petición HTTP pasa por aquí.

```mermaid
flowchart TD
    Request[Petición Saliente] --> TokenCheck{¿Hay Token?}
    TokenCheck -- Sí --> Attach[Adjuntar Header Auth: Bearer ...] --> Send
    TokenCheck -- No --> Send[Enviar al Backend]
    
    Send --> Response{¿Respuesta?}
    
    Response -- 200 OK --> Return[Retornar Datos]
    Response -- 401 Unauthorized --> IsLogin{¿Es URL Login?}
    
    IsLogin -- Sí --> Error[Retornar Error de Login]
    IsLogin -- No --> RefreshProcess[Proceso de Renovación]
    
    subgraph RefreshProcess
        direction TB
        Lock[Pausar otras peticiones] --> CallRefresh[Llamar /auth/refresh]
        CallRefresh -- Éxito --> Update[Actualizar Token Local] --> Retry[Reintentar Petición Original]
        CallRefresh -- Fallo --> Logout[Cerrar Sesión Global]
    end
```

### 3.3. Contexto de Rol (Multi-Tenancy Lógico)

Para que el backend sepa "quién eres y bajo qué sombrero estás operando", el `AuthInterceptor` inyecta contexto adicional:

| Header | Valor | Descripción |
| :--- | :--- | :--- |
| `Authorization` | `Bearer <token>` | Identidad del usuario (Quién eres). |
| `X-Active-Role` | `<role_slug>` | Rol activo seleccionado (Qué permisos usas ahora). |

> **Nota**: El backend debe leer `X-Active-Role` para filtrar listados (ej. "Mis Ventas" vs "Todas las Ventas") sin necesidad de enviar el rol como parámetro en cada URL.

---

## 4. Travesía de una Petición (Paso a Paso Detallado)

A continuación, detallamos qué sucede exactamente bajo el capó cuando un token expira y se renueva automáticamente.

### Escenario: El usuario está navegando y su token ha expirado.

| Paso | Archivo / Componente | Método Ejecutado | Explicación Técnica (Por qué) |
| :--- | :--- | :--- | :--- |
| **1** | `Cualquier Componente` | `httpClient.get('/api/data')` | El usuario intenta cargar datos. Angular lanza una petición HTTP normal. |
| **2** | `auth.interceptor.ts` | `intercept(req, next)` | **Interceptación Inicial**. El interceptor ve que hay un token en `localStorage` (aunque esté vencido, él no lo sabe aún) y lo adjunta en el header `Authorization: Bearer xyz`. |
| **3** | `Backend (FastAPI)` | `verify_token` | El servidor recibe el token, verifica su firma y tiempo de expiración. Detecta que **ha expirado**. |
| **4** | `Backend (FastAPI)` | `Response 401` | El servidor rechaza la petición con un error HTTP `401 Unauthorized`. |
| **5** | `auth.interceptor.ts` | `catchError()` | **Captura del Error**. El interceptor atrapa el error 401 antes de que llegue al componente. Verifica: `¿Es la URL de login? NO`. Entonces inicia el protocolo de recuperación. |
| **6** | `auth.interceptor.ts` | `handle401Error()` | **Semáforo**. Usa `TokenRefreshService` para gestionar el estado de renovación. Si llegan otras peticiones simultáneas, las pone en cola para no bombardear al servidor. |
| **7** | `token-refresh.service.ts` | `refreshToken()` | **Llamada de Rescate**. Encapsula la lógica de renovación de tokens, delegando a `AuthService` para la petición POST a `/auth/refresh`. |
| **8** | `Backend (FastAPI)` | `refresh_token_endpoint` | Valida el `refresh_token`. Si es válido, genera un **nuevo** `access_token` y lo devuelve. |
| **9** | `auth.service.ts` | `tap(setSession)` | Recibe el nuevo token y actualiza inmediatamente el `localStorage` y las Signals del estado global. |
| **10** | `auth.interceptor.ts` | `switchMap()` | **Reintento**. Toma la petición original fallida (del Paso 1), le cambia el token viejo por el **nuevo token**, y la vuelve a lanzar al servidor. |
| **11** | `Cualquier Componente` | `.subscribe(data)` | El componente recibe los datos solicitados en el Paso 1. **Nunca se enteró** de que hubo un error 401 ni de que se renovó el token. Para el usuario, fue transparente. |

---

## 5. Explicación Técnica Detallada de Arquitectura

### 5. Configuración y Carga Robusta

Para evitar ciclos infinitos de inyección, el sistema utiliza **`HttpBackend`** en `ConfigService`, permitiendo cargar la configuración de la API antes de que los interceptores entren en juego. 

Además, se ha implementado el **Truly Global Loader** en el `AppComponent`, asegurando que cualquier transición de autenticación (como un cierre de sesión forzado) tenga un feedback visual limpio y que el bloqueo de la interfaz nunca quede huérfano.

#### 5.1 Filtrado de Assets en Interceptor
El interceptor de carga utiliza expresiones regulares para ignorar recursos estáticos, evitando que el spinner se "pegue" mientras se descargan logos de la Uyuni o fotos de perfil.

**¿Por qué es especial?**
Usamos el patrón **`HttpBackend`** mediante `inject()` para evitar inyecciones circulares.

```typescript
private handler = inject(HttpBackend);
private http = new HttpClient(this.handler);

// HttpClient "puro" que NO usa interceptores
```

*   **Razón**: Si usáramos el `HttpClient` normal, este intentaría pasar por el `AuthInterceptor`. El `AuthInterceptor` necesita `AuthService`, y `AuthService` necesita `ConfigService` (para saber la URL). Esto crearía un círculo infinito (`Circular Dependency`).
*   **Solución**: Al usar `HttpBackend`, `ConfigService` es independiente de todo el sistema de autenticación. Carga primero (`APP_INITIALIZER`), y una vez listo, el resto de la app despierta.

### 5.2. Inicialización de Sesión (`AuthService`)

Resolvemos un problema sutil de concurrencia mediante el uso de `effect()` o inicialización diferida:

```typescript
constructor() {
  if (this.tokenSignal()) {
    // DIFERIDO (0ms)
    setTimeout(() => this.refreshProfile(), 0);
  }
}
```

> [!NOTE]
> Aunque el servicio usa `inject()`, la lógica de inicialización diferida se mantiene para evitar que el interceptor intente inyectar un servicio que aún está en proceso de construcción.


### 5.3. Reactividad con Signals

En lugar de `BehaviorSubjects` (RxJS antiguo), usamos **Signals**:

```typescript
private userSignal = signal<User | null>(null);
readonly currentUser = this.userSignal.asReadonly();
```

*   **Ventaja**: La UI se actualiza de forma granular. No necesitamos suscripciones manuales ni `async pipe` complejos en el HTML. Si `userSignal` cambia, cualquier parte de la UI que lo use se repinta automáticamente.

---

## 6. Manejo de Errores Específicos

### 6.1 Servicio Centralizado de Errores (`AuthErrorHandlerService`)

Se ha implementado un servicio dedicado para el manejo centralizado de errores de autenticación, siguiendo el principio de **Single Responsibility**.

**Características:**
- **Códigos de error tipados** (`AuthErrorCode`): Proporciona constantes para todos los tipos de error de autenticación.
- **Mensajes user-friendly**: Traduce errores técnicos a mensajes comprensibles para el usuario.
- **Detección de tipo de error**: Método `getErrorType()` para clasificar errores HTTP.

**Uso:**
```typescript
// En el componente de login
this.authService.login(credentials).subscribe({
  error: (error) => {
    const errorType = this.authErrorHandler.getErrorType(error);
    const message = this.authErrorHandler.getErrorMessage(error);
    // Mostrar mensaje al usuario
  }
});
```

### 6.2 Bloqueo de Cuenta (API Integration)
El backend devuelve información detallada cuando se bloquea una cuenta. El frontend la captura y formatea:

- **Código**: `403 Forbidden`
- **Body**: `{ detail: { code: 'ACCOUNT_LOCKED', wait_seconds: 178, max_attempts: 5 } }`
- **Display**: "Cuenta bloqueada tras 5 intentos fallidos. Inténtalo de nuevo en 3 minutos."
