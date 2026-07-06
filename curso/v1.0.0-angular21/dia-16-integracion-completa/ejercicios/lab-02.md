# Lab 02: Proyecto Final

## Información del Lab

| Atributo | Valor |
|----------|-------|
| **Duración** | 45 minutos |
| **Dificultad** | Avanzado |
| **Objetivo** | Integrar todos los features en una aplicación completa |

---

## Objetivos de Aprendizaje

Al completar este lab, serás capaz de:

1. Integrar todos los features del proyecto
2. Crear flujo completo de navegación
3. Realizar testing manual de la aplicación
4. Verificar manejo de errores
5. Documentar issues encontrados

---

## Prerrequisitos

- Haber completado el Lab 01
- Todos los features creados
- AuthService, Interceptors, Guards funcionando

---

## Escenario

Vas a realizar la integración final y testing manual de la aplicación:

```
┌─────────────────────────────────────────────────────────────┐
│                    APLICACIÓN COMPLETA                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  FLUJO DE TESTING:                                          │
│                                                              │
│  1. Login → Dashboard → Users → Profile → Logout            │
│                                                              │
│  2. Verificar cada feature:                                 │
│     • Dashboard: Métricas, gráficos                         │
│     • Users: CRUD completo                                  │
│     • Profile: Datos, cambio de rol                         │
│                                                              │
│  3. Verificar errores:                                      │
│     • 401: Token refresh                                    │
│     • 403: Account locked                                   │
│     • Network: Offline mode                                 │
│                                                              │
│  4. Verificar UI:                                           │
│     • Responsive                                            │
│     • Dark mode                                             │
│     • Loading states                                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Paso 1: Verificar Routing Completo (10 min)

### 1.1 Revisar app.routes.ts

Verifica que todas las rutas estén configuradas:

```typescript
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
  // Rutas públicas (sin layout)
  {
    path: 'signin',
    loadComponent: () => 
      import('@features/auth/pages/sign-in/sign-in.component')
        .then(m => m.SignInComponent)
  },
  {
    path: 'signup',
    loadComponent: () => 
      import('@features/auth/pages/sign-up/sign-up.component')
        .then(m => m.SignUpComponent)
  },
  
  // Rutas protegidas (con layout)
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => 
      import('@shared/layout/app-layout/app-layout.component')
        .then(m => m.AppLayoutComponent),
    children: [
      // Dashboard
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => 
          import('@features/dashboard/dashboard.routes')
            .then(m => m.DASHBOARD_ROUTES)
      },
      
      // Users
      {
        path: 'users',
        loadChildren: () => 
          import('@features/users/users.routes')
            .then(m => m.USERS_ROUTES)
      },
      
      // Profile
      {
        path: 'profile',
        loadChildren: () => 
          import('@features/profile/profile.routes')
            .then(m => m.PROFILE_ROUTES)
      },
      
      // Calendar
      {
        path: 'calendar',
        loadChildren: () => 
          import('@features/calendar/calendar.routes')
            .then(m => m.CALENDAR_ROUTES)
      },
      
      // Charts
      {
        path: 'charts',
        loadChildren: () => 
          import('@features/charts/charts.routes')
            .then(m => m.CHARTS_ROUTES)
      },
      
      // Tables
      {
        path: 'tables',
        loadChildren: () => 
          import('@features/tables/tables.routes')
            .then(m => m.TABLES_ROUTES)
      }
    ]
  },
  
  // 404
  {
    path: '**',
    loadComponent: () => 
      import('@features/system/pages/not-found/not-found.component')
        .then(m => m.NotFoundComponent)
  }
];
```

### 1.2 Verificar Feature Routes

Asegúrate de que cada feature tenga su archivo de rutas:

```bash
# Verificar que existan los archivos
ls -la src/app/features/*/dashboard.routes.ts
ls -la src/app/features/*/users.routes.ts
ls -la src/app/features/*/profile.routes.ts
```

---

## Paso 2: Testing Manual - Flujo de Autenticación (10 min)

### 2.1 Test: Login Exitoso

```markdown
## Test Case: Login Exitoso

**Precondiciones:**
- Usuario válido registrado
- Aplicación corriendo en localhost:4200

**Pasos:**
1. Navegar a http://localhost:4200
2. Verificar redirect a /signin
3. Ingresar credenciales válidas
4. Click en "Iniciar Sesión"

**Resultado Esperado:**
- [ ] Redirect a /dashboard
- [ ] Token guardado en localStorage
- [ ] Usuario visible en header
- [ ] Sidebar muestra menú según rol

**Resultado Real:**
_________________________________

**Status:** [ ] PASS / [ ] FAIL
```

### 2.2 Test: Login Fallido

```markdown
## Test Case: Login Fallido

**Precondiciones:**
- Aplicación corriendo

**Pasos:**
1. Navegar a /signin
2. Ingresar credenciales inválidas
3. Click en "Iniciar Sesión"

**Resultado Esperado:**
- [ ] Mensaje de error visible
- [ ] No hay redirect
- [ ] Token NO guardado
- [ ] Formulario muestra errores

**Resultado Real:**
_________________________________

**Status:** [ ] PASS / [ ] FAIL
```

### 2.3 Test: Logout

```markdown
## Test Case: Logout

**Precondiciones:**
- Usuario logueado

**Pasos:**
1. Click en avatar de usuario
2. Click en "Cerrar Sesión"

**Resultado Esperado:**
- [ ] Redirect a /signin
- [ ] Token eliminado de localStorage
- [ ] Estado de autenticación limpio

**Resultado Real:**
_________________________________

**Status:** [ ] PASS / [ ] FAIL
```

---

## Paso 3: Testing Manual - CRUD de Usuarios (10 min)

### 3.1 Test: Listar Usuarios

```markdown
## Test Case: Listar Usuarios

**Precondiciones:**
- Usuario admin logueado
- Usuarios en la base de datos

**Pasos:**
1. Click en "Usuarios" en sidebar
2. Verificar lista de usuarios

**Resultado Esperado:**
- [ ] Lista de usuarios visible
- [ ] Cada usuario muestra: nombre, email, rol, estado
- [ ] Acciones disponibles: editar, eliminar
- [ ] Filtros funcionando

**Resultado Real:**
_________________________________

**Status:** [ ] PASS / [ ] FAIL
```

### 3.2 Test: Crear Usuario

```markdown
## Test Case: Crear Usuario

**Precondiciones:**
- Usuario admin logueado
- En página de lista de usuarios

**Pasos:**
1. Click en "Nuevo Usuario"
2. Completar formulario
3. Click en "Guardar"

**Resultado Esperado:**
- [ ] Validación funciona
- [ ] Usuario creado exitosamente
- [ ] Toast de éxito visible
- [ ] Redirect a lista
- [ ] Nuevo usuario visible en lista

**Resultado Real:**
_________________________________

**Status:** [ ] PASS / [ ] FAIL
```

### 3.3 Test: Editar Usuario

```markdown
## Test Case: Editar Usuario

**Precondiciones:**
- Usuario admin logueado
- Usuario existente

**Pasos:**
1. Click en "Editar" de un usuario
2. Modificar datos
3. Click en "Guardar"

**Resultado Esperado:**
- [ ] Formulario pre-poblado
- [ ] Cambios guardados
- [ ] Toast de éxito
- [ ] Lista actualizada

**Resultado Real:**
_________________________________

**Status:** [ ] PASS / [ ] FAIL
```

### 3.4 Test: Eliminar Usuario

```markdown
## Test Case: Eliminar Usuario

**Precondiciones:**
- Usuario admin logueado
- Usuario existente

**Pasos:**
1. Click en "Eliminar" de un usuario
2. Confirmar eliminación

**Resultado Esperado:**
- [ ] Diálogo de confirmación
- [ ] Usuario eliminado
- [ ] Toast de éxito
- [ ] Lista actualizada

**Resultado Real:**
_________________________________

**Status:** [ ] PASS / [ ] FAIL
```

---

## Paso 4: Testing Manual - Manejo de Errores (10 min)

### 4.1 Test: Token Expirado

```markdown
## Test Case: Token Expirado

**Precondiciones:**
- Usuario logueado
- Token expirado (simular)

**Pasos:**
1. Modificar token en localStorage a valor inválido
2. Hacer una petición HTTP (ej: cargar usuarios)

**Resultado Esperado:**
- [ ] Interceptor detecta 401
- [ ] Intenta refresh token
- [ ] Si falla: redirect a login
- [ ] No muestra error técnico al usuario

**Resultado Real:**
_________________________________

**Status:** [ ] PASS / [ ] FAIL
```

### 4.2 Test: Network Error

```markdown
## Test Case: Network Error

**Precondiciones:**
- Usuario logueado

**Pasos:**
1. Desconectar internet
2. Intentar cargar datos

**Resultado Esperado:**
- [ ] Mensaje de "Sin conexión"
- [ ] Retry automático o manual
- [ ] No crashea la aplicación

**Resultado Real:**
_________________________________

**Status:** [ ] PASS / [ ] FAIL
```

### 4.3 Test: 403 Forbidden

```markdown
## Test Case: 403 Forbidden

**Precondiciones:**
- Usuario con rol limitado
- Intentar acceder a recurso de admin

**Pasos:**
1. Login como usuario "user"
2. Intentar navegar a /users

**Resultado Esperado:**
- [ ] Sidebar no muestra opción
- [ ] Si accede por URL: redirect o mensaje
- [ ] No muestra datos sensibles

**Resultado Real:**
_________________________________

**Status:** [ ] PASS / [ ] FAIL
```

---

## Paso 5: Testing Manual - UI/UX (5 min)

### 5.1 Test: Responsive

```markdown
## Test Case: Responsive Design

**Pasos:**
1. Abrir DevTools
2. Cambiar a vista móvil (375px)
3. Verificar sidebar colapsa
4. Verificar header responsive
5. Verificar formularios usables

**Resultado Esperado:**
- [ ] Sidebar colapsable en móvil
- [ ] Header muestra solo avatar
- [ ] Formularios son usables
- [ ] No hay scroll horizontal

**Resultado Real:**
_________________________________

**Status:** [ ] PASS / [ ] FAIL
```

### 5.2 Test: Dark Mode

```markdown
## Test Case: Dark Mode

**Pasos:**
1. Click en toggle de tema
2. Verificar cambio a dark mode
3. Verificar todos los componentes

**Resultado Esperado:**
- [ ] Fondo oscuro
- [ ] Texto legible
- [ ] Componentes con colores correctos
- [ ] Persiste al recargar

**Resultado Real:**
_________________________________

**Status:** [ ] PASS / [ ] FAIL
```

### 5.3 Test: Loading States

```markdown
## Test Case: Loading States

**Pasos:**
1. Navegar a página con datos
2. Observar estado de carga

**Resultado Esperado:**
- [ ] Spinner visible durante carga
- [ ] Skeleton o placeholder
- [ ] No hay "flash" de contenido
- [ ] UI no se rompe

**Resultado Real:**
_________________________________

**Status:** [ ] PASS / [ ] FAIL
```

---

## Documentación de Issues

### Template de Issue

```markdown
## Issue #X: [Título del Issue]

**Severidad:** [ ] Crítico / [ ] Mayor / [ ] Menor

**Descripción:**
Descripción clara del problema

**Pasos para Reproducir:**
1. Paso 1
2. Paso 2
3. Paso 3

**Resultado Esperado:**
Lo que debería pasar

**Resultado Real:**
Lo que realmente pasa

**Evidencia:**
- Screenshot
- Console logs
- Network tab

**Ambiente:**
- Browser: Chrome 120
- OS: Windows 11
- Angular: 21.1.0

**Asignado a:** _______________
```

---

## Checklist Final

### Funcionalidad

- [ ] Login funciona correctamente
- [ ] Logout limpia el estado
- [ ] Dashboard muestra datos del usuario
- [ ] CRUD de usuarios completo
- [ ] Profile muestra datos correctos
- [ ] Cambio de rol funciona

### Seguridad

- [ ] Rutas protegidas por guard
- [ ] Token se envía en cada petición
- [ ] Token refresh funciona
- [ ] Logout invalida sesión

### UI/UX

- [ ] Responsive funciona
- [ ] Dark mode funciona
- [ ] Loading states visibles
- [ ] Errores son user-friendly
- [ ] Navegación intuitiva

### Performance

- [ ] Lazy loading funciona
- [ ] No hay llamadas duplicadas
- [ ] Bundle size razonable
- [ ] No hay memory leaks

---

## Comandos de Verificación

```bash
# Build de producción
npm run build

# Verificar que no hay errores
# Verificar tamaño de bundles

# Linting
npm run lint

# Tests unitarios
npm test

# Verificar coverage
```

---

## Retos Adicionales

### Reto 1: Agregar E2E Test
Crear un test E2E con Cypress o Playwright para el flujo de login.

### Reto 2: Agregar Analytics
Integrar Google Analytics o similar para tracking de eventos.

### Reto 3: Agregar PWA
Convertir la aplicación en PWA con service worker.

---

## Solución de Problemas

### Problema: Rutas no funcionan
**Solución:** Verificar imports y lazy loading en app.routes.ts

### Problema: Guard bloquea todo
**Solución:** Verificar que las rutas auth no tengan el guard

### Problema: Interceptor no añade headers
**Solución:** Verificar que el interceptor esté en providers

---

*Lab 02 - Día 16 - Curso Angular 21 - UyuniAdmin Frontend*
