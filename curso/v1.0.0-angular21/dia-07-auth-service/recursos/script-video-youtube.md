# Script Video YouTube - Día 7: AuthService

## Título: "AuthService en Angular 21: El Corazón de la Autenticación"

---

## Estructura del Video

### INTRO (0:00 - 0:45)

**[Pantalla: Título animado con logo Angular]**

Hola desarrolladores, bienvenidos al Día 7 del curso completo de Angular 21. Hoy vamos a construir el servicio más importante de toda la aplicación: AuthService.

**[Pantalla: Diagrama de arquitectura con AuthService en el centro]**

Miren este diagrama. Todo gira alrededor de AuthService. Login, logout, tokens, roles, menús. Sin este servicio, la aplicación no funciona.

Hoy vamos a implementarlo desde cero.

---

### HOOK (0:45 - 1:30)

**[Pantalla: Escenario de usuario]**

Imaginen este escenario: Un usuario abre tu aplicación, ingresa sus credenciales, y... ¿qué pasa detrás de escena?

¿Cómo sabe la aplicación quién es el usuario? ¿Cómo sabe qué puede ver? ¿Cómo recuerda su rol la próxima vez que abre la app?

Todo esto lo resuelve AuthService. Y hoy vamos a desglosarlo completamente.

---

### CONTEXTO (1:30 - 2:30)

**[Pantalla: Responsabilidades de AuthService]**

AuthService tiene cuatro responsabilidades principales:

**[Mostrar lista animada]**

1. Login y logout - Entrar y salir de la aplicación
2. Gestión de tokens - OAuth2 con access y refresh tokens
3. Estado del usuario - Quién está logueado y qué roles tiene
4. Menús dinámicos - Cada rol ve diferentes opciones

Todo esto usando Angular Signals para reactividad máxima.

---

### ESTRUCTURA_BÁSICA (2:30 - 4:00)

**[Pantalla: VS Code con auth.service.ts]**

Empecemos con la estructura básica.

**[Mostrar código]**

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);
  private router = inject(Router);
  private logger = inject(LoggerService);
}
```

Primero, el decorador @Injectable con providedIn: 'root'. Esto crea un singleton global.

Luego, inyectamos los servicios necesarios. Noten que usamos inject(), no constructor. Esta es la forma moderna en Angular 21.

---

### SIGNALS_PRIVADAS (4:00 - 5:30)

**[Pantalla: Signals privadas]**

Ahora las signals. Esta es la parte más importante.

**[Mostrar código]**

```typescript
// Signals privadas
private userSignal = signal<User | null>(null);
private rolesSignal = signal<UserRole[]>([]);
private tokenSignal = signal<string | null>(null);
private activeRoleSignal = signal<UserRole | null>(null);
private menuSignal = signal<MenuGroup[]>([]);
```

¿Por qué privadas? Porque queremos encapsulamiento. Solo AuthService puede modificar estas signals.

Los componentes pueden leer, pero no pueden modificar directamente. Esto previene bugs y mantiene la arquitectura limpia.

---

### SIGNALS_PÚBLICAS (5:30 - 7:00)

**[Pantalla: Signals públicas]**

Para exponer las signals, usamos asReadonly().

**[Mostrar código]**

```typescript
// Signals públicas (readonly)
readonly currentUser = this.userSignal.asReadonly();
readonly currentRoles = this.rolesSignal.asReadonly();
readonly activeRole = this.activeRoleSignal.asReadonly();
readonly currentMenu = this.menuSignal.asReadonly();
```

asReadonly() crea una versión que solo permite lectura. Los componentes pueden suscribirse, pero no pueden modificar.

También tenemos computed signals:

```typescript
readonly isAuthenticated = computed(() => !!this.tokenSignal());
```

Esta signal se recalcula automáticamente cuando tokenSignal cambia. Si hay token, isAuthenticated es true. Si no, es false.

---

### LOGIN (7:00 - 9:30)

**[Pantalla: Método login]**

Ahora el flujo de login.

**[Mostrar código]**

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

**[Mostrar diagrama de OAuth2]**

Importante: OAuth2 Password Grant usa form-urlencoded, no JSON. El body es username=valor&password=valor.

Si el login es exitoso, guardamos los tokens y refrescamos el perfil.

---

### SETSESSION (9:30 - 10:30)

**[Pantalla: Método setSession]**

```typescript
private setSession(accessToken: string, refreshToken: string): void {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
  this.tokenSignal.set(accessToken);
}
```

Doble almacenamiento: localStorage para persistencia, signal para reactividad.

Cuando el usuario recarga la página, el token sigue ahí. Cuando el token cambia, todos los componentes se enteran automáticamente.

---

### LOGOUT (10:30 - 12:00)

**[Pantalla: Método logout]**

El logout es igual de importante.

**[Mostrar código]**

```typescript
logout(): void {
  const refreshToken = localStorage.getItem('refresh_token');
  if (refreshToken) {
    this.http.post(`${url}/auth/logout`, { refresh_token: refreshToken })
      .subscribe({
        next: () => this.clearSession(),
        error: () => this.clearSession()
      });
  } else {
    this.clearSession();
  }
}
```

Noten que siempre llamamos clearSession, incluso si el request falla. El usuario debe poder cerrar sesión sin importar qué.

---

### CLEARSESSION (12:00 - 13:30)

**[Pantalla: Método clearSession]**

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

Esto es crucial: Limpiamos TODO. localStorage y signals. Si dejas algo sin limpiar, tendrás bugs.

---

### ROLES (13:30 - 15:00)

**[Pantalla: Gestión de roles]**

Hablemos de roles.

**[Mostrar código]**

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

Obtenemos los roles del backend y los almacenamos. Si hay roles, establecemos el primero como activo.

**[Mostrar setActiveRole]**

```typescript
setActiveRole(role: UserRole, navigate = true): void {
  this.activeRoleSignal.set(role);
  localStorage.setItem('active_role_slug', role.slug);
  this.fetchMenu(role.slug);
}
```

Guardamos el rol activo en localStorage. Si el usuario recarga, restauramos su último rol.

---

### MENÚS (15:00 - 16:00)

**[Pantalla: Menús dinámicos]**

```typescript
fetchMenu(roleSlug: string): void {
  this.http.get<MenuGroup[]>(`${this.configService.apiUrl}/auth/me/menu/${roleSlug}`)
    .subscribe(menu => this.menuSignal.set(menu));
}
```

Cada rol tiene su menú. El sidebar consume currentMenu directamente.

---

### ERROR_COMÚN (16:00 - 17:30)

**[Pantalla: Código incorrecto vs correcto]**

El error más común: No limpiar el estado.

**[Mostrar código incorrecto]**

```typescript
// ❌ MAL
logout() {
  localStorage.clear();
  this.router.navigate(['/signin']);
}
```

Las signals siguen teniendo datos. El usuario ve su nombre, el menú sigue visible.

**[Mostrar código correcto]**

```typescript
// ✅ BIEN
private clearSession(): void {
  localStorage.removeItem('access_token');
  // ... limpiar todo
  this.tokenSignal.set(null);
  this.userSignal.set(null);
  // ... resetear todas las signals
  this.router.navigate(['/signin']);
}
```

---

### MINI_RETO (17:30 - 18:30)

**[Pantalla: Desafío]**

Tu reto: Implementa hasRole(roleName: string): boolean

**[Mostrar solución]**

```typescript
hasRole(roleName: string): boolean {
  return this.rolesSignal().some(role => role.name === roleName);
}
```

Úsalo en componentes para verificar permisos.

---

### CIERRE (18:30 - 19:30)

**[Pantalla: Resumen]**

Hoy construimos AuthService:

1. Signals privadas y públicas
2. Login con OAuth2
3. Logout que limpia todo
4. Roles dinámicos
5. Menús por rol

**[Pantalla: Preview del próximo día]**

Mañana: HTTP Interceptors. Veremos cómo inyectar tokens automáticamente y manejar errores 401.

---

### OUTRO (19:30 - 20:00)

**[Pantalla: Call to action]**

Si este video te fue útil, dale like y suscríbete. El código está en el repositorio del curso.

Recuerda practicar con los labs. La mejor forma de aprender es haciendo.

Nos vemos mañana en el Día 8. ¡Hasta entonces!

---

## Notas de Producción

### Visual
- Usar VS Code con tema oscuro
- Mostrar diagramas con animaciones
- B-roll de aplicación en funcionamiento
- Zoom en código importante

### Audio
- Voz clara y pausada
- Música de fondo suave en intro/outro
- Efectos de sonido para transiciones

### Duración
- Total: ~20 minutos
- Ideal para YouTube (15-20 min)

---

*Script Video YouTube - Día 7*
