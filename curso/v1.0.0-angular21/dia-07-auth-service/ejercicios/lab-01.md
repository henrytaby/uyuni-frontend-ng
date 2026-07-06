# Lab 01: Login y Logout

## Objetivo
Implementar los métodos login() y logout() de AuthService.

## Ejercicios
1. Crear AuthService con signals
2. Implementar login con OAuth2
3. Implementar logout con limpieza
4. Probar con mock auth

## Código Base

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);
  private router = inject(Router);
  private logger = inject(LoggerService);

  // Signals
  private tokenSignal = signal<string | null>(null);
  private userSignal = signal<User | null>(null);

  // Readonly
  readonly isAuthenticated = computed(() => !!this.tokenSignal());
  readonly currentUser = this.userSignal.asReadonly();

  login(credentials: { username: string; password: string }): Observable<TokenResponse> {
    // TODO: Implementar
  }

  logout(): void {
    // TODO: Implementar
  }
}
```

## Solución Paso a Paso

### Paso 1: Implementar login()

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

### Paso 2: Implementar setSession()

```typescript
private setSession(accessToken: string, refreshToken: string): void {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
  this.tokenSignal.set(accessToken);
}
```

### Paso 3: Implementar logout()

```typescript
logout(): void {
  const refreshToken = localStorage.getItem('refresh_token');
  
  if (refreshToken) {
    const url = `${this.configService.apiUrl}/auth/logout`;
    this.http.post(url, { refresh_token: refreshToken }).subscribe({
      next: () => this.clearSession(),
      error: () => this.clearSession()
    });
  } else {
    this.clearSession();
  }
}
```

### Paso 4: Implementar clearSession()

```typescript
private clearSession(): void {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  
  this.tokenSignal.set(null);
  this.userSignal.set(null);
  
  this.router.navigate(['/signin']);
}
```

## Testing

```typescript
// En componente
onLogin() {
  this.authService.login({
    username: this.username(),
    password: this.password()
  }).subscribe({
    next: () => this.router.navigate(['/']),
    error: (err) => this.showError(err)
  });
}
```

---

*Lab 01 - Día 7*
