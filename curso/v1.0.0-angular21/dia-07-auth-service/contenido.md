# Contenido - Día 7: Sistema de Autenticación - AuthService

## 1. Introducción a AuthService

### 1.1 ¿Qué es AuthService?

AuthService es el servicio central que gestiona toda la autenticación en la aplicación. Es el "corazón" del sistema de auth.

**Responsabilidades:**
- Login y logout de usuarios
- Gestión de tokens (access y refresh)
- Estado del usuario actual
- Gestión de roles
- Menús dinámicos por rol

### 1.2 Ubicación

```
src/app/core/auth/auth.service.ts
```

### 1.3 Decorador @Injectable

```typescript
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // ...
}
```

**¿Por qué providedIn: 'root'?**
- Crea un singleton global
- No necesita declararse en providers
- Disponible en toda la aplicación

---

## 2. Inyección de Dependencias

### 2.1 Servicios Inyectados

AuthService depende de varios servicios:

```typescript
export class AuthService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);
  private router = inject(Router);
  private loadingService = inject(LoadingService);
  private logger = inject(LoggerService);
  private tokenRefreshService = inject(TokenRefreshService);
}
```

### 2.2 Por qué usar inject()

| Patrón | Ventajas |
|--------|----------|
| `inject()` | Sintaxis concisa, mejor type inference, funciona en contexto funcional |
| Constructor | Legacy, más verboso |

**Regla:** Siempre usar `inject()` en Angular 21.

---

## 3. Estado con Signals

### 3.1 Signals Privadas

```typescript
// State Signals (privadas)
private userSignal = signal<User | null>(null);
private rolesSignal = signal<UserRole[]>([]);
private tokenSignal = signal<string | null>(localStorage.getItem('access_token'));
private activeRoleSignal = signal<UserRole | null>(null);
private menuSignal = signal<MenuGroup[]>([]);
private loadingRolesSignal = signal<boolean>(false);
```

**¿Por qué privadas?**
- Encapsulamiento
- Control de mutaciones
- Solo el servicio puede modificar el estado

### 3.2 Signals Públicas (Readonly)

```typescript
// Exposed as readonly
readonly currentUser = this.userSignal.asReadonly();
readonly currentRoles = this.rolesSignal.asReadonly();
readonly activeRole = this.activeRoleSignal.asReadonly();
readonly currentMenu = this.menuSignal.asReadonly();
readonly isLoadingRoles = this.loadingRolesSignal.asReadonly();
```

**asReadonly():**
- Expone la signal como solo lectura
- Componentes pueden leer pero no modificar
- Patrón de encapsulamiento

### 3.3 Computed Signals

```typescript
readonly isAuthenticated = computed(() => !!this.tokenSignal());
```

**¿Qué hace computed()?**
- Deriva estado de otras signals
- Se recalcula automáticamente
- No se puede modificar directamente

**Ejemplo de uso:**
```typescript
// En componente
@if (authService.isAuthenticated()) {
  <p>Bienvenido, {{ authService.currentUser()?.username }}</p>
} @else {
  <a routerLink="/signin">Iniciar sesión</a>
}
```

---

## 4. Flujo de Login

### 4.1 Método login()

```typescript
login(credentials: { username: string; password: string }): Observable<TokenResponse> {
  const config = this.configService.config();

  // Mock Auth para desarrollo
  if (config?.featureFlags?.mockAuth) {
    this.setSession('mock-access-token', 'mock-refresh-token');
    this.userSignal.set({
      id: 1,
      username: credentials.username,
      email: 'admin@example.com',
      is_verified: true,
      first_name: 'Mock',
      last_name: 'Admin'
    });
    return of({ access_token: 'mock-access-token', refresh_token: 'mock-refresh-token', token_type: 'bearer' });
  }

  // Login real
  const url = `${this.configService.apiUrl}/auth/login`;
  const body = new URLSearchParams();
  body.set('username', credentials.username);
  body.set('password', credentials.password);

  return this.http.post<TokenResponse>(url, body.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }).pipe(
    tap(response => {
      this.setSession(response.access_token, response.refresh_token);
      this.refreshProfile();
    })
  );
}
```

### 4.2 OAuth2 Password Grant

El backend espera:
- Content-Type: `application/x-www-form-urlencoded`
- Body: `username=valor&password=valor`

**¿Por qué no JSON?**
- OAuth2 Password Grant usa form-urlencoded
- Estándar RFC 6749

### 4.3 Método setSession()

```typescript
private setSession(accessToken: string, refreshToken: string): void {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
  this.tokenSignal.set(accessToken);
}
```

**Almacenamiento:**
- localStorage: Persiste entre sesiones
- Signal: Estado reactivo en memoria

---

## 5. Flujo de Logout

### 5.1 Método logout()

```typescript
logout(): void {
  const refreshToken = localStorage.getItem('refresh_token');
  const url = `${this.configService.apiUrl}/auth/logout`;

  if (refreshToken) {
    this.loadingService.forceReset();
    this.http.post(url, { refresh_token: refreshToken }).subscribe({
      next: () => {
        this.logger.info('User logged out successfully');
        this.clearSession();
      },
      error: () => {
        this.logger.warn('Logout request failed, clearing session anyway');
        this.clearSession();
      }
    });
  } else {
    this.clearSession();
  }
}
```

### 5.2 Método clearSession()

```typescript
private clearSession(): void {
  this.loadingService.forceReset();
  this.tokenRefreshService.reset();

  // Limpiar localStorage
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('active_role_slug');

  // Resetear signals
  this.tokenSignal.set(null);
  this.userSignal.set(null);
  this.rolesSignal.set([]);
  this.activeRoleSignal.set(null);
  this.menuSignal.set([]);

  this.logger.info('Session cleared');
  this.router.navigate(['/signin']);
}
```

**Importante:** Siempre limpiar TODO el estado.

---

## 6. Gestión de Roles

### 6.1 Método fetchRoles()

```typescript
fetchRoles(): void {
  this.loadingRolesSignal.set(true);
  this.http.get<UserRole[]>(`${this.configService.apiUrl}/auth/me/roles`).subscribe({
    next: (roles) => {
      this.rolesSignal.set(roles);
      
      if (roles.length > 0) {
        const storedSlug = localStorage.getItem('active_role_slug');
        const matchedRole = roles.find(r => r.slug === storedSlug);
        
        if (matchedRole) {
          this.setActiveRole(matchedRole, false);
        } else {
          this.setActiveRole(roles[0], false);
        }
      } else {
        this.activeRoleSignal.set(null);
      }
      this.loadingRolesSignal.set(false);
    },
    error: (err) => {
      this.logger.error('Error fetching roles', err);
      this.loadingRolesSignal.set(false);
    }
  });
}
```

### 6.2 Método setActiveRole()

```typescript
setActiveRole(role: UserRole, navigate = true): void {
  this.activeRoleSignal.set(role);
  localStorage.setItem('active_role_slug', role.slug);
  this.fetchMenu(role.slug);
  
  if (navigate) {
    this.router.navigate(['/']);
  }
}
```

**Persistencia:**
- El rol activo se guarda en localStorage
- Se restaura al recargar la página

---

## 7. Menús Dinámicos

### 7.1 Método fetchMenu()

```typescript
fetchMenu(roleSlug: string): void {
  this.http.get<MenuGroup[]>(`${this.configService.apiUrl}/auth/me/menu/${roleSlug}`).subscribe({
    next: (menu) => {
      this.menuSignal.set(menu);
      this.logger.debug('Menu fetched', { roleSlug, items: menu.length });
    },
    error: (err) => {
      this.logger.error('Error fetching menu', err);
      this.menuSignal.set([]);
    }
  });
}
```

### 7.2 Uso en Sidebar

```typescript
// En sidebar.component.ts
menuItems = this.authService.currentMenu;

// En template
@for (group of menuItems()) {
  <div class="menu-group">
    <h3>{{ group.title }}</h3>
    @for (item of group.items) {
      <a [routerLink]="item.path">{{ item.label }}</a>
    }
  </div>
}
```

---

## 8. Refresh Token

### 8.1 Método refreshToken()

```typescript
refreshToken(): Observable<TokenResponse> {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) {
    return throwError(() => new Error('No refresh token available'));
  }

  const url = `${this.configService.apiUrl}/auth/refresh`;
  const params = new HttpParams().set('refresh_token', refreshToken);

  return this.http.post<TokenResponse>(url, {}, { params }).pipe(
    tap(response => {
      this.setSession(response.access_token, response.refresh_token);
    }),
    catchError(err => {
      this.logger.error('Token refresh failed', err);
      this.clearSession();
      return throwError(() => err);
    })
  );
}
```

---

## 9. Mock Authentication

### 9.1 Feature Flag

```json
// public/assets/config/config.json
{
  "apiUrl": "http://localhost:8080/api",
  "featureFlags": {
    "mockAuth": true
  }
}
```

### 9.2 Uso en Desarrollo

```typescript
if (config?.featureFlags?.mockAuth) {
  // Simular login exitoso
  this.setSession('mock-access-token', 'mock-refresh-token');
  this.userSignal.set(mockUser);
  return of(mockResponse);
}
```

**Ventajas:**
- Desarrollo sin backend
- Tests más rápidos
- Demo sin dependencias

---

## 10. Restauración de Sesión

### 10.1 En el Constructor

```typescript
constructor() {
  if (this.tokenSignal()) {
    setTimeout(() => this.refreshProfile(), 0);
  }
}
```

**¿Por qué setTimeout?**
- Permite que AuthService se construya completamente
- Evita problemas con AuthInterceptor
- Diferido hasta el siguiente ciclo de eventos

### 10.2 Método refreshProfile()

```typescript
private refreshProfile(): void {
  this.http.get<User>(`${this.configService.apiUrl}/auth/me`).subscribe({
    next: (user) => {
      this.userSignal.set(user);
    },
    error: (err) => {
      if (err.status === 401 || err.status === 403) {
        this.logout();
      }
    }
  });
  
  this.fetchRoles();
}
```

---

## 11. Errores Comunes

### 11.1 No Limpiar Estado

```typescript
// ❌ MAL
logout() {
  localStorage.clear();
  this.router.navigate(['/signin']);
}

// ✅ BIEN
logout() {
  this.clearSession(); // Limpia localStorage Y signals
}
```

### 11.2 Signals Públicas Modificables

```typescript
// ❌ MAL
userSignal = signal<User | null>(null); // Pública y modificable

// ✅ BIEN
private userSignal = signal<User | null>(null);
readonly currentUser = this.userSignal.asReadonly();
```

### 11.3 No Manejar Errores

```typescript
// ❌ MAL
this.http.get(url).subscribe(data => this.data.set(data));

// ✅ BIEN
this.http.get(url).subscribe({
  next: (data) => this.data.set(data),
  error: (err) => this.logger.error('Failed', err)
});
```

---

## 12. Buenas Prácticas

1. **Encapsulamiento:** Signals privadas, expuestas como readonly
2. **Single Responsibility:** AuthService solo maneja auth
3. **Logging:** Registrar eventos importantes
4. **Error Handling:** Manejar todos los errores
5. **Persistencia:** Guardar estado crítico en localStorage
6. **Restauración:** Reconstruir sesión al cargar

---

## 13. Resumen

| Concepto | Descripción |
|----------|-------------|
| Signals | Estado reactivo privado |
| asReadonly() | Exponer signals sin permitir modificación |
| computed() | Derivar estado de otras signals |
| localStorage | Persistir tokens y rol activo |
| Mock Auth | Desarrollo sin backend |

---

*Contenido - Día 7: AuthService*
