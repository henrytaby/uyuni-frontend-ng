# Día 3: Lazy Loading y Rutas

## Información General

| Aspecto | Detalle |
|---------|---------|
| **Módulo** | 1 - Fundamentos y Arquitectura |
| **Duración** | 4-5 horas |
| **Nivel** | Básico-Intermedio |
| **Prerrequisitos** | Días 1 y 2 completados |

## Objetivos de Aprendizaje

Al finalizar este día, el estudiante será capaz de:

1. **Implementar** Lazy Loading para optimizar el bundle inicial
2. **Configurar** rutas anidadas y child routes
3. **Crear** Route Guards funcionales para proteger rutas
4. **Usar** Resolvers para precargar datos
5. **Configurar** el sistema de routing del proyecto UyuniAdmin

## Temario

1. **Introducción al Routing** (30 min)
   - Router de Angular
   - Configuración básica
   - RouterLink y RouterOutlet

2. **Lazy Loading** (60 min)
   - ¿Qué es y por qué usarlo?
   - loadChildren vs loadComponent
   - Code splitting

3. **Rutas Anidadas** (45 min)
   - Child routes
   - Router outlets anidados
   - Parámetros de ruta

4. **Route Guards** (60 min)
   - CanActivate
   - CanActivateFn (functional guards)
   - CanDeactivate
   - CanMatch

5. **Resolvers** (45 min)
   - Resolve data antes de navegar
   - Functional resolvers
   - Manejo de errores

## Estructura de Clase

### Hook (5 min)
Mostrar una aplicación que carga todo el código al inicio y preguntar: "¿Por qué mi aplicación tarda 5 segundos en cargar?"

### Contexto (10 min)
Explicar que el 80% del código no se necesita en la primera carga. Lazy Loading reduce el bundle inicial hasta 70%.

### Explicación Simple (40 min)
- Analogía: Lazy Loading es como pedir comida por delivery, solo cocinas lo que vas a comer
- Guards son como porteros de un club, deciden quién entra
- Resolvers son como preparar la mesa antes de servir la comida

### Demo/Código (90 min)
- Configurar lazy loading en app.routes.ts
- Crear rutas anidadas para features
- Implementar authGuard funcional
- Crear un resolver para precargar datos

### Error Común (15 min)
- Circular dependency en lazy loading
- Guards que retornan Observable sin completar

### Mini Reto (30 min)
- Crear una nueva feature con lazy loading
- Proteger con un guard
- Agregar un resolver

### Cierre (10 min)
- Resumen de conceptos
- Preview del Día 4: Core Services

## Materiales

| Archivo | Descripción |
|---------|-------------|
| [`contenido.md`](./contenido.md) | Contenido teórico completo |
| [`slides/dia-03-lazy-loading_Marp.md`](./slides/dia-03-lazy-loading_Marp.md) | Presentación Marp |
| [`ejercicios/lab-01.md`](./ejercicios/lab-01.md) | Práctica: Lazy Loading |
| [`ejercicios/lab-02.md`](./ejercicios/lab-02.md) | Práctica: Guards y Resolvers |
| [`assessment/preguntas.md`](./assessment/preguntas.md) | 50 preguntas de opción múltiple |
| [`recursos/bibliografia.md`](./recursos/bibliografia.md) | Referencias y recursos |
| [`recursos/cheatsheet.md`](./recursos/cheatsheet.md) | Guía rápida de referencia |
| [`recursos/script-audio.md`](./recursos/script-audio.md) | Guion de podcast |
| [`recursos/script-video-youtube.md`](./recursos/script-video-youtube.md) | Guion de video YouTube |

## Conceptos Clave

### Lazy Loading

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('@features/dashboard/dashboard.routes')
      .then(m => m.routes)
  },
  {
    path: 'profile',
    loadComponent: () => import('@features/profile/pages/overview/overview.component')
      .then(m => m.OverviewComponent)
  }
];
```

### Route Guards

```typescript
// auth.guard.ts
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  
  return router.parseUrl('/signin');
};
```

### Resolvers

```typescript
// user.resolver.ts
export const userResolver: ResolveFn<User> = (route, state) => {
  const userService = inject(UserService);
  const id = route.paramMap.get('id');
  
  if (!id) {
    return throwError(() => new Error('User ID is required'));
  }
  
  return userService.getUser(id);
};
```

## Ejemplo del Proyecto

### app.routes.ts

```typescript
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { AppLayoutComponent } from '@shared/layout/app-layout/app-layout.component';

export const routes: Routes = [
  // Rutas públicas (sin autenticación)
  {
    path: 'signin',
    loadComponent: () => import('@features/auth/pages/sign-in/sign-in.component')
      .then(m => m.SignInComponent)
  },
  
  // Rutas protegidas (con autenticación)
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
        path: 'profile',
        loadChildren: () => import('@features/profile/profile.routes')
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

### Feature Routes

```typescript
// src/app/features/dashboard/dashboard.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    component: OverviewComponent
  },
  {
    path: 'detail/:id',
    loadComponent: () => import('./pages/detail/detail.component')
      .then(m => m.DetailComponent),
    resolve: {
      dashboard: dashboardResolver
    }
  }
];
```

## Criterios de Evaluación

| Criterio | Excelente | Bueno | Aceptable |
|----------|-----------|-------|-----------|
| Lazy Loading | Configura correctamente con preload | Entiende el concepto | Sabe qué es |
| Guards | Crea guards funcionales con tests | Implementa guards básicos | Conoce los tipos |
| Resolvers | Maneja errores y loading states | Implementa resolver básico | Sabe qué hace |
| Routing | Configura rutas anidadas complejas | Configura rutas básicas | Entiende RouterOutlet |

## Preparación del Instructor

### Antes de la Clase
1. Revisar el sistema de routing del proyecto UyuniAdmin
2. Preparar ejemplos de guards y resolvers
3. Configurar herramientas de análisis de bundle
4. Preparar métricas de rendimiento

### Durante la Clase
1. Mostrar el impacto de lazy loading en el bundle
2. Demostrar guards en acción
3. Hacer pausas para preguntas
4. Fomentar participación en el mini reto

### Después de la Clase
1. Revisar ejercicios enviados
2. Proporcionar feedback
3. Actualizar FAQs según preguntas

---

*Curso: Angular 21 Enterprise*
*Día: 3 de 18*
*Próximo: Día 4 - Core Services*
