# Lab 01: Implementar Lazy Loading

## Objetivo

Implementar lazy loading para una nueva feature de configuración.

## Duración

**60 minutos**

## Prerrequisitos

- Haber completado Días 1 y 2
- Entender el concepto de routing
- Tener el proyecto base configurado

---

## Escenario

Vamos a crear una feature de **Configuración (Settings)** con lazy loading. La feature tendrá:

1. **SettingsLayoutComponent**: Layout con sidebar
2. **GeneralSettingsComponent**: Configuración general
3. **SecuritySettingsComponent**: Configuración de seguridad
4. **NotificationSettingsComponent**: Configuración de notificaciones

---

## Paso 1: Crear Estructura de Carpetas (5 min)

### Instrucciones

Crea la siguiente estructura:

```
src/app/features/settings/
├── pages/
│   ├── settings-layout/
│   │   ├── settings-layout.component.ts
│   │   └── settings-layout.component.html
│   ├── general/
│   │   ├── general.component.ts
│   │   └── general.component.html
│   ├── security/
│   │   ├── security.component.ts
│   │   └── security.component.html
│   └── notifications/
│       ├── notifications.component.ts
│       └── notifications.component.html
└── settings.routes.ts
```

### Comandos

```bash
# Crear carpetas
mkdir -p src/app/features/settings/pages/settings-layout
mkdir -p src/app/features/settings/pages/general
mkdir -p src/app/features/settings/pages/security
mkdir -p src/app/features/settings/pages/notifications
```

---

## Paso 2: Crear Componentes (15 min)

### Archivo: `settings-layout.component.ts`

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-settings-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './settings-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsLayoutComponent {}
```

### Archivo: `settings-layout.component.html`

```html
<div class="flex min-h-screen">
  <!-- Sidebar -->
  <aside class="w-64 bg-gray-100 dark:bg-gray-800 p-4">
    <h2 class="text-lg font-bold mb-4">Configuración</h2>
    
    <nav class="space-y-2">
      <a 
        routerLink="general"
        routerLinkActive="bg-blue-500 text-white"
        class="block px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        General
      </a>
      <a 
        routerLink="security"
        routerLinkActive="bg-blue-500 text-white"
        class="block px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        Seguridad
      </a>
      <a 
        routerLink="notifications"
        routerLinkActive="bg-blue-500 text-white"
        class="block px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        Notificaciones
      </a>
    </nav>
  </aside>
  
  <!-- Content -->
  <main class="flex-1 p-6">
    <router-outlet></router-outlet>
  </main>
</div>
```

### Archivo: `general.component.ts`

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-general-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-2xl">
      <h1 class="text-2xl font-bold mb-6">Configuración General</h1>
      
      <div class="space-y-6">
        <!-- Idioma -->
        <div>
          <label class="block text-sm font-medium mb-2">Idioma</label>
          <select class="w-full p-2 border rounded">
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </div>
        
        <!-- Zona horaria -->
        <div>
          <label class="block text-sm font-medium mb-2">Zona horaria</label>
          <select class="w-full p-2 border rounded">
            <option value="America/La_Paz">America/La_Paz (UTC-4)</option>
            <option value="UTC">UTC</option>
          </select>
        </div>
        
        <!-- Tema -->
        <div>
          <label class="block text-sm font-medium mb-2">Tema</label>
          <div class="flex gap-4">
            <label class="flex items-center">
              <input type="radio" name="theme" value="light" class="mr-2">
              Claro
            </label>
            <label class="flex items-center">
              <input type="radio" name="theme" value="dark" class="mr-2">
              Oscuro
            </label>
            <label class="flex items-center">
              <input type="radio" name="theme" value="system" class="mr-2">
              Sistema
            </label>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralSettingsComponent {}
```

### Archivo: `security.component.ts`

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-security-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-2xl">
      <h1 class="text-2xl font-bold mb-6">Seguridad</h1>
      
      <div class="space-y-6">
        <!-- Cambiar contraseña -->
        <div class="p-4 border rounded">
          <h2 class="font-semibold mb-4">Cambiar contraseña</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm mb-1">Contraseña actual</label>
              <input type="password" class="w-full p-2 border rounded">
            </div>
            <div>
              <label class="block text-sm mb-1">Nueva contraseña</label>
              <input type="password" class="w-full p-2 border rounded">
            </div>
            <div>
              <label class="block text-sm mb-1">Confirmar contraseña</label>
              <input type="password" class="w-full p-2 border rounded">
            </div>
            <button class="px-4 py-2 bg-blue-500 text-white rounded">
              Actualizar contraseña
            </button>
          </div>
        </div>
        
        <!-- Autenticación de dos factores -->
        <div class="p-4 border rounded">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="font-semibold">Autenticación de dos factores</h2>
              <p class="text-sm text-gray-500">Añade una capa extra de seguridad</p>
            </div>
            <button class="px-4 py-2 bg-green-500 text-white rounded">
              Activar
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecuritySettingsComponent {}
```

### Archivo: `notifications.component.ts`

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-notification-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-2xl">
      <h1 class="text-2xl font-bold mb-6">Notificaciones</h1>
      
      <div class="space-y-4">
        <!-- Email notifications -->
        <div class="p-4 border rounded">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="font-semibold">Notificaciones por email</h2>
              <p class="text-sm text-gray-500">Recibe actualizaciones importantes</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" class="sr-only peer" checked>
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
        
        <!-- Push notifications -->
        <div class="p-4 border rounded">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="font-semibold">Notificaciones push</h2>
              <p class="text-sm text-gray-500">Recibe alertas en el navegador</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
        
        <!-- Weekly digest -->
        <div class="p-4 border rounded">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="font-semibold">Resumen semanal</h2>
              <p class="text-sm text-gray-500">Recibe un resumen cada semana</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" class="sr-only peer" checked>
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationSettingsComponent {}
```

---

## Paso 3: Crear Rutas de la Feature (10 min)

### Archivo: `settings.routes.ts`

```typescript
// src/app/features/settings/settings.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/settings-layout/settings-layout.component')
      .then(m => m.SettingsLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'general',
        pathMatch: 'full'
      },
      {
        path: 'general',
        loadComponent: () => import('./pages/general/general.component')
          .then(m => m.GeneralSettingsComponent)
      },
      {
        path: 'security',
        loadComponent: () => import('./pages/security/security.component')
          .then(m => m.SecuritySettingsComponent)
      },
      {
        path: 'notifications',
        loadComponent: () => import('./pages/notifications/notifications.component')
          .then(m => m.NotificationSettingsComponent)
      }
    ]
  }
];
```

---

## Paso 4: Registrar en app.routes.ts (5 min)

### Archivo: `app.routes.ts`

```typescript
// Agregar la ruta de settings
{
  path: 'settings',
  loadChildren: () => import('@features/settings/settings.routes')
    .then(m => m.routes)
}
```

### Ejemplo completo

```typescript
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { AppLayoutComponent } from '@shared/layout/app-layout/app-layout.component';

export const routes: Routes = [
  // Rutas públicas
  {
    path: 'signin',
    loadComponent: () => import('@features/auth/pages/sign-in/sign-in.component')
      .then(m => m.SignInComponent)
  },
  
  // Rutas protegidas
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('@features/dashboard/dashboard.routes')
          .then(m => m.routes)
      },
      {
        path: 'settings',  // ← Nueva ruta
        loadChildren: () => import('@features/settings/settings.routes')
          .then(m => m.routes)
      }
    ]
  },
  
  // Wildcard
  {
    path: '**',
    loadComponent: () => import('@features/system/pages/not-found/not-found.component')
      .then(m => m.NotFoundComponent)
  }
];
```

---

## Paso 5: Agregar Link en Sidebar (5 min)

### Archivo: `sidebar.component.html`

```html
<!-- Agregar link a settings -->
<nav>
  <a routerLink="/dashboard" routerLinkActive="active">
    <i class="pi pi-home"></i>
    Dashboard
  </a>
  
  <!-- Nuevo link -->
  <a routerLink="/settings" routerLinkActive="active">
    <i class="pi pi-cog"></i>
    Configuración
  </a>
</nav>
```

---

## Paso 6: Verificar Lazy Loading (10 min)

### Usar Chrome DevTools

1. Abrir Chrome DevTools (F12)
2. Ir a pestaña "Network"
3. Filtrar por "JS"
4. Navegar a `/settings`
5. Verificar que aparece un nuevo chunk: `settings.component.html`

### Verificar Bundle

```bash
# Construir para producción
npm run build

# Ver tamaño de chunks
ls -la dist/browser/
```

### Resultado esperado

```
main.js           500KB  (bundle inicial)
dashboard.js      200KB  (lazy loaded)
settings.js       150KB  (lazy loaded) ← Nuevo
profile.js        100KB  (lazy loaded)
```

---

## Paso 7: Medir Impacto (10 min)

### Comparar tiempos de carga

| Métrica | Sin Lazy Loading | Con Lazy Loading |
|---------|------------------|------------------|
| Bundle inicial | 2MB | 500KB |
| Tiempo de carga | 5s | 1.5s |
| Chunks adicionales | 0 | 4 |

### Usar Lighthouse

```bash
# Ejecutar Lighthouse en Chrome
# 1. Abrir DevTools
# 2. Ir a pestaña "Lighthouse"
# 3. Click en "Analyze page load"
# 4. Comparar métricas
```

---

## Preguntas de Reflexión

1. **¿Por qué usamos `loadChildren` en lugar de `loadComponent` para la ruta principal?**
   - Porque la ruta tiene children, necesitamos cargar el layout y sus rutas hijas.

2. **¿Qué pasa si navegamos directamente a `/settings/security`?**
   - Angular carga el chunk de settings, luego el layout, y finalmente el componente security.

3. **¿Cómo podemos precargar la feature de settings?**
   - Usando `PreloadAllModules` o una estrategia personalizada.

---

## Solución de Problemas

### Error: "Cannot find module '@features/settings/settings.routes'"

**Solución**: Verificar que el alias esté configurado en `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@features/*": ["src/app/features/*"]
    }
  }
}
```

### Error: "No provider for Router"

**Solución**: Verificar que `provideRouter()` está en `app.config.ts`:
```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // ...
  ]
};
```

### El componente no se muestra

**Solución**: Verificar que hay un `<router-outlet>` en el componente padre.

---

## Extensión Opcional

Si terminas antes, intenta:

1. **Agregar preload strategy** para settings
2. **Crear un resolver** para cargar configuración del usuario
3. **Agregar un guard** que verifique permisos de admin
4. **Implementar breadcrumb** basado en la ruta actual

---

## Entregables

Al finalizar este lab, debes tener:

1. ✅ Feature de settings con lazy loading
2. ✅ Layout con sidebar y router-outlet
3. ✅ 3 páginas de configuración
4. ✅ Rutas anidadas funcionando
5. ✅ Verificación de chunks en DevTools

---

*Lab 01 - Lazy Loading*
*Curso: Angular 21 Enterprise*
*Día: 3 de 18*
