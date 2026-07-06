# Cheatsheet - Día 1: Fundamentos

## Comandos CLI

```bash
# Crear proyecto
ng new proyecto --standalone --routing --style=css

# Crear componente
ng generate component features/auth/login
ng g c features/auth/login  # Versión corta

# Crear servicio
ng generate service core/auth/auth
ng g s core/auth/auth  # Versión corta

# Ejecutar servidor
npm start
ng serve

# Verificar TypeScript
npx tsc --noEmit

# Build producción
ng build --configuration production
```

---

## Path Aliases

### Configuración (tsconfig.json)

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@core/*": ["src/app/core/*"],
      "@shared/*": ["src/app/shared/*"],
      "@features/*": ["src/app/features/*"],
      "@env/*": ["src/environments/*"]
    }
  }
}
```

### Uso

```typescript
// ❌ Sin alias
import { AuthService } from '../../../../../core/auth/auth.service';

// ✅ Con alias
import { AuthService } from '@core/auth/auth.service';
```

---

## Estructura de Carpetas

```
src/app/
├── core/           # 🧠 Singletons globales
│   ├── auth/
│   ├── config/
│   ├── guards/
│   ├── interceptors/
│   └── services/
│
├── shared/         # 🛠️ Reutilizables
│   ├── components/
│   ├── layout/
│   ├── pipes/
│   └── directives/
│
├── features/       # 💼 Dominio
│   ├── auth/
│   ├── dashboard/
│   └── profile/
│
├── app.component.ts
├── app.config.ts
└── app.routes.ts
```

---

## Standalone Components

### Componente Básico

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule],
  template: `<p>Example</p>`
})
export class ExampleComponent {}
```

### Con Inputs/Outputs

```typescript
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `<button (click)="onClick.emit()">{{ label() }}</button>`
})
export class ButtonComponent {
  readonly label = input.required<string>();
  readonly disabled = input<boolean>(false);
  readonly onClick = output<void>();
}
```

---

## TypeScript Strict Mode

### Configuración

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitOverride": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Manejo de Null

```typescript
// ❌ Error con strict
const name = user.name;  // Object is possibly 'null'

// ✅ Optional chaining
const name = user?.name;

// ✅ Nullish coalescing
const name = user?.name ?? 'Unknown';

// ✅ Type guard
if (user) {
  const name = user.name;
}
```

---

## Orden de Imports

```typescript
// 1. Angular
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

// 2. Terceros
import { Observable } from 'rxjs';

// 3. Alias (alfabético)
import { AuthService } from '@core/auth/auth.service';
import { ConfigService } from '@core/config/config.service';
import { ButtonComponent } from '@shared/components/button/button.component';

// 4. Relativos
import { User } from './models/user.model';
```

---

## Reglas de Dependencia

```
┌─────────────────────────────────────────┐
│              FEATURES                    │
│  (Auth, Dashboard, Profile, etc.)       │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│              SHARED                      │
│  (Components, Pipes, Directives)        │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│               CORE                       │
│  (Services, Guards, Interceptors)       │
└─────────────────────────────────────────┘

✅ Features → Shared → Core
❌ Core NO → Features o Shared
```

---

## Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `Cannot find module '@core/...'` | Alias no configurado | Verificar tsconfig.json y reiniciar |
| `Object is possibly 'null'` | Strict mode | Usar `?.` o `??` |
| `Circular dependency` | Imports circulares | Revisar arquitectura |
| `Property 'X' does not exist` | Typo o tipo incorrecto | Verificar nombre y tipo |

---

## VS Code Settings

```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "typescript.preferences.importModuleSpecifierEnding": "minimal",
  "typescript.suggest.paths": true
}
```

---

## Inyección de Dependencias

```typescript
// ✅ Moderno (Angular 14+)
export class MyComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
}

// ❌ Legacy (antes de Angular 14)
export class MyComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
}
```

---

## Servicios

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'  // Singleton a nivel de app
})
export class AuthService {
  private http = inject(HttpClient);
  
  login(credentials: LoginRequest): Observable<User> {
    return this.http.post<User>('/api/auth/login', credentials);
  }
}
```

---

## Routing Básico

```typescript
// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('@features/dashboard/dashboard.component')
      .then(m => m.DashboardComponent)
  },
  {
    path: 'auth',
    loadChildren: () => import('@features/auth/auth.routes')
      .then(m => m.routes)
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' }
];
```

---

## Quick Reference

| Concepto | Sintaxis |
|----------|----------|
| Input requerido | `readonly prop = input.required<T>()` |
| Input opcional | `readonly prop = input<T>(defaultValue)` |
| Output | `readonly event = output<T>()` |
| Signal computado | `readonly computed = computed(() => this.prop() * 2)` |
| Inject service | `private service = inject(Service)` |
| Optional chaining | `user?.name` |
| Nullish coalescing | `value ?? 'default'` |

---

*Curso: Angular 21 Enterprise*
*Día: 1 de 18*
