# Cheatsheet - Día 5: ConfigService y TokenRefreshService

## ConfigService

### Carga de Configuración

```typescript
async loadConfig(): Promise<void> {
  const response = await fetch('assets/config/config.json');
  const config = await response.json();
  this.validateConfig(config);
  this.config.set({ ...DEFAULT_CONFIG, ...config });
}
```

### APP_INITIALIZER

```typescript
// app.config.ts
{
  provide: APP_INITIALIZER,
  useFactory: (config: ConfigService) => () => config.loadConfig(),
  multi: true,
  deps: [ConfigService]
}
```

### Getters

```typescript
getApiUrl(): string
isMockAuth(): boolean
getTimeout(): number
isFeatureEnabled(feature: string): boolean
```

---

## TokenRefreshService

### Refresh Token

```typescript
refreshToken(refreshToken: string): Observable<TokenResponse> {
  this.refreshing.set(true);
  return this.http.post('/auth/refresh', { refreshToken }).pipe(
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

### Cola de Peticiones

```typescript
queueRequest<T>(request$: Observable<T>): Observable<T> {
  if (!this.refreshing()) return request$;
  
  return new Observable(subscriber => {
    this.queue.push({ request$, subject: new Subject() });
  });
}
```

---

## Flujo de Refresh

```
401 Error → Check Refresh Token → Refresh → Retry Request
                ↓
         No Token → Logout
```

---

*Cheatsheet - Día 5*
