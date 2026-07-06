# Cheatsheet - Día 7: AuthService

## Estructura Básica

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);
  private router = inject(Router);
  private logger = inject(LoggerService);
  private tokenRefreshService = inject(TokenRefreshService);
}
```

---

## Signals

### Privadas (Modificables)
```typescript
private userSignal = signal<User | null>(null);
private rolesSignal = signal<UserRole[]>([]);
private tokenSignal = signal<string | null>(null);
private activeRoleSignal = signal<UserRole | null>(null);
private menuSignal = signal<MenuGroup[]>([]);
```

### Públicas (Readonly)
```typescript
readonly currentUser = this.userSignal.asReadonly();
readonly currentRoles = this.rolesSignal.asReadonly();
readonly activeRole = this.activeRoleSignal.asReadonly();
readonly currentMenu = this.menuSignal.asReadonly();
```

### Computed
```typescript
readonly isAuthenticated = computed(() => !!this.tokenSignal());
```

---

## Login

### Método Principal
```typescript
login(credentials: { username: string; password: string }): Observable<TokenResponse> {
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

### OAuth2 Password Grant
| Header | Valor |
|--------|-------|
| Content-Type | application/x-www-form-urlencoded |

| Body | Valor |
|------|-------|
| username | usuario |
| password | contraseña |

---

## Logout

### Método Principal
```typescript
logout(): void {
  const refreshToken = localStorage.getItem('refresh_token');
  if (refreshToken) {
    this.http.post(`${url}/auth/logout`, { refresh_token: refreshToken })
      .subscribe({ next: () => this.clearSession(), error: () => this.clearSession() });
  } else {
    this.clearSession();
  }
}
```

### Limpieza de Sesión
```typescript
private clearSession(): void {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('active_role_slug');

  this.tokenSignal.set(null);
  this.userSignal.set(null);
  this.rolesSignal.set([]);
  this.activeRoleSignal.set(null);
  this.menuSignal.set([]);

  this.router.navigate(['/signin']);
}
```

---

## Roles

### Fetch Roles
```typescript
fetchRoles(): void {
  this.http.get<UserRole[]>(`${this.configService.apiUrl}/auth/me/roles`)
    .subscribe(roles => {
      this.rolesSignal.set(roles);
      if (roles.length > 0) {
        this.setActiveRole(roles[0], false);
      }
    });
}
```

### Set Active Role
```typescript
setActiveRole(role: UserRole, navigate = true): void {
  this.activeRoleSignal.set(role);
  localStorage.setItem('active_role_slug', role.slug);
  this.fetchMenu(role.slug);
  if (navigate) this.router.navigate(['/']);
}
```

### Check Role
```typescript
hasRole(roleName: string): boolean {
  return this.rolesSignal().some(role => role.name === roleName);
}
```

---

## Menús

### Fetch Menu
```typescript
fetchMenu(roleSlug: string): void {
  this.http.get<MenuGroup[]>(`${this.configService.apiUrl}/auth/me/menu/${roleSlug}`)
    .subscribe(menu => this.menuSignal.set(menu));
}
```

---

## Mock Auth

### Configuración
```json
// public/assets/config/config.json
{
  "featureFlags": {
    "mockAuth": true
  }
}
```

### Uso
```typescript
if (config?.featureFlags?.mockAuth) {
  this.setSession('mock-token', 'mock-refresh');
  return of({ access_token: 'mock-token', ... });
}
```

---

## Restauración de Sesión

### Constructor
```typescript
constructor() {
  if (this.tokenSignal()) {
    setTimeout(() => this.refreshProfile(), 0);
  }
}
```

### Refresh Profile
```typescript
private refreshProfile(): void {
  this.http.get<User>(`${this.configService.apiUrl}/auth/me`)
    .subscribe(user => this.userSignal.set(user));
  this.fetchRoles();
}
```

---

## Endpoints

| Endpoint | Método | Propósito |
|----------|--------|-----------|
| `/auth/login` | POST | Autenticar usuario |
| `/auth/logout` | POST | Cerrar sesión |
| `/auth/refresh` | POST | Refrescar token |
| `/auth/me` | GET | Obtener perfil |
| `/auth/me/roles` | GET | Obtener roles |
| `/auth/me/menu/{slug}` | GET | Obtener menú |

---

## localStorage Keys

| Key | Propósito |
|-----|-----------|
| `access_token` | Token de acceso |
| `refresh_token` | Token de refresco |
| `active_role_slug` | Rol activo |

---

## Buenas Prácticas

1. ✅ Signals privadas, expuestas como readonly
2. ✅ Limpiar TODO en logout
3. ✅ Persistir estado crítico
4. ✅ Usar inject() para DI
5. ✅ Loggear eventos importantes

---

*Cheatsheet - Día 7*
