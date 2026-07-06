# Presentación - Día 7: AuthService

---

## Slide 1: Título

# AuthService
## El Corazón de la Autenticación

**Día 7 - Angular 21 en Producción**

---

## Slide 2: Hook

# Escenario

Tu aplicación está lista. Los usuarios intentan entrar...

- ¿Cómo sabes quién está autenticado?
- ¿Cómo gestionas los tokens?
- ¿Cómo manejas múltiples roles?

**AuthService es la respuesta.**

---

## Slide 3: Agenda

# Temario de Hoy

1. Introducción a AuthService
2. Estado con Signals
3. Login y Logout
4. Gestión de Roles
5. Menús Dinámicos

---

## Slide 4: ¿Qué es AuthService?

# El Servicio Central

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  // Estado del usuario
  // Gestión de tokens
  // Roles y permisos
  // Menús dinámicos
}
```

**Responsabilidades claras, código organizado.**

---

## Slide 5: Inyección de Dependencias

# Servicios Inyectados

```typescript
export class AuthService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);
  private router = inject(Router);
  private logger = inject(LoggerService);
  private tokenRefreshService = inject(TokenRefreshService);
}
```

**6 servicios, un propósito: autenticación.**

---

## Slide 6: Signals Privadas

# Estado Interno

```typescript
private userSignal = signal<User | null>(null);
private rolesSignal = signal<UserRole[]>([]);
private tokenSignal = signal<string | null>(null);
private activeRoleSignal = signal<UserRole | null>(null);
```

**Privadas = Solo el servicio puede modificar.**

---

## Slide 7: Signals Públicas

# Exposición Segura

```typescript
readonly currentUser = this.userSignal.asReadonly();
readonly currentRoles = this.rolesSignal.asReadonly();
readonly isAuthenticated = computed(() => !!this.tokenSignal());
```

**asReadonly() = Leer pero no modificar.**

---

## Slide 8: Computed Signals

# Estado Derivado

```typescript
readonly isAuthenticated = computed(() => 
  !!this.tokenSignal()
);
```

- Se recalcula automáticamente
- No se puede modificar directamente
- Eficiente y reactivo

---

## Slide 9: Flujo de Login

# OAuth2 Password Grant

```typescript
login(credentials: { username: string; password: string }) {
  const body = new URLSearchParams();
  body.set('username', credentials.username);
  body.set('password', credentials.password);

  return this.http.post<TokenResponse>(url, body.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
}
```

**Estándar OAuth2, no JSON.**

---

## Slide 10: Almacenamiento

# localStorage + Signals

```typescript
private setSession(accessToken: string, refreshToken: string) {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
  this.tokenSignal.set(accessToken);
}
```

**Doble almacenamiento: persistencia + reactividad.**

---

## Slide 11: Logout

# Limpieza Completa

```typescript
private clearSession() {
  // Limpiar localStorage
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  
  // Resetear signals
  this.tokenSignal.set(null);
  this.userSignal.set(null);
  this.rolesSignal.set([]);
  
  // Navegar
  this.router.navigate(['/signin']);
}
```

**¡Siempre limpiar TODO!**

---

## Slide 12: Gestión de Roles

# Multi-rol

```typescript
fetchRoles() {
  this.http.get<UserRole[]>('/auth/me/roles').subscribe(roles => {
    this.rolesSignal.set(roles);
    if (roles.length > 0) {
      this.setActiveRole(roles[0]);
    }
  });
}
```

**Un usuario, múltiples roles.**

---

## Slide 13: Rol Activo

# Persistencia

```typescript
setActiveRole(role: UserRole) {
  this.activeRoleSignal.set(role);
  localStorage.setItem('active_role_slug', role.slug);
  this.fetchMenu(role.slug);
}
```

**El rol se recuerda entre sesiones.**

---

## Slide 14: Menús Dinámicos

# Por Rol

```typescript
fetchMenu(roleSlug: string) {
  this.http.get<MenuGroup[]>(`/auth/me/menu/${roleSlug}`)
    .subscribe(menu => this.menuSignal.set(menu));
}
```

**Cada rol ve diferentes opciones.**

---

## Slide 15: Mock Auth

# Desarrollo Sin Backend

```typescript
if (config?.featureFlags?.mockAuth) {
  this.setSession('mock-token', 'mock-refresh');
  return of(mockResponse);
}
```

**Feature flag para desarrollo local.**

---

## Slide 16: Restauración

# Al Cargar la App

```typescript
constructor() {
  if (this.tokenSignal()) {
    setTimeout(() => this.refreshProfile(), 0);
  }
}
```

**¿Por qué setTimeout? Evitar problemas con interceptors.**

---

## Slide 17: Error Común #1

# ❌ No Limpiar Estado

```typescript
// MAL
logout() {
  localStorage.clear();
  this.router.navigate(['/signin']);
}
```

**Problema:** Signals quedan con datos viejos.

---

## Slide 18: Error Común #2

# ❌ Signals Modificables

```typescript
// MAL
userSignal = signal<User | null>(null); // Pública
```

**Problema:** Cualquiera puede modificar el estado.

---

## Slide 19: Buenas Prácticas

# Resumen

1. ✅ Signals privadas, expuestas como readonly
2. ✅ Limpiar TODO en logout
3. ✅ Persistir estado crítico
4. ✅ Manejar todos los errores
5. ✅ Loggear eventos importantes

---

## Slide 20: Mini Reto

# Tu Turno

Implementa un método `hasRole(roleName: string): boolean`

que retorne `true` si el usuario tiene el rol especificado.

**Pista:** Usa `this.currentRoles()`.

---

## Slide 21: Cierre

# Hoy Aprendimos

- AuthService como servicio central
- Signals para estado reactivo
- Login/Logout con OAuth2
- Gestión de roles y menús
- Mock auth para desarrollo

**Mañana: Interceptors HTTP.**

---

## Slide 22: Próximo Día

# Día 8: Interceptors

- authInterceptor
- Token injection
- Error handling
- Request queue

**¡No te lo pierdas!**

---

*Presentación - Día 7: AuthService*
