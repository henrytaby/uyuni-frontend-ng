# Guía de Optimizaciones de Performance - UyuniAdmin

## Índice

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Change Detection Strategy: OnPush](#2-change-detection-strategy-onpush)
3. [Virtual Scrolling para Listas Largas](#3-virtual-scrolling-para-listas-largas)
4. [Preloading Strategy para Lazy Loading](#4-preloading-strategy-para-lazy-loading)
5. [Matriz de Decisión](#5-matriz-de-decisión)
6. [Plan de Implementación](#6-plan-de-implementación)

---

## 1. Resumen Ejecutivo

| Técnica | Estado en UyuniAdmin | Impacto | Complejidad |
|---------|---------------------|---------|-------------|
| **OnPush** | ✅ Implementado (52 componentes) | Alto | Media |
| **Virtual Scrolling** | ⬜ No implementado | Alto | Baja |
| **Preloading Strategy** | ⬜ No implementado | Medio | Baja |

### Beneficios Esperados

```
┌─────────────────────────────────────────────────────────────────┐
│                    MEJORAS DE PERFORMANCE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  OnPush (✅)          Virtual Scroll        Preloading          │
│  ───────────          ─────────────        ──────────          │
│  -30% CPU cycles      -90% DOM nodes       -50% load time      │
│  -20% memory          -80% render time     Better UX           │
│  Faster UI            Smooth scrolling     Instant navigation  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Change Detection Strategy: OnPush

### 2.1 ¿Qué es Change Detection?

Change Detection es el mecanismo de Angular que sincroniza el estado de la aplicación con el DOM. Cada vez que un evento ocurre (click, HTTP request, timer, etc.), Angular recorre todos los componentes verificando si hay cambios y actualiza el DOM si es necesario.

### 2.2 Estrategias Disponibles

#### Default (Estrategia por defecto)
```typescript
@Component({
  selector: 'app-example',
  // changeDetection: ChangeDetectionStrategy.Default (implícito)
})
export class ExampleComponent { }
```

**Comportamiento:**
- Angular verifica el componente en **cada evento** del navegador
- Verifica **todos los componentes** desde la raíz hasta las hojas
- No importa si el evento está relacionado con el componente

**Diagrama de flujo Default:**
```
Evento (click, HTTP, timer, etc.)
    │
    ▼
┌─────────────────────────────────────┐
│     Angular recorre TODO el árbol   │
│                                     │
│     AppComponent ────────────► ✓    │
│         │                           │
│         ▼                           │
│     HeaderComponent ────────► ✓    │
│         │                           │
│         ▼                           │
│     DashboardComponent ─────► ✓    │
│         │                           │
│         ▼                           │
│     MetricCardComponent ────► ✓    │
│         │                           │
│         ▼                           │
│     ... (todos los componentes)     │
│                                     │
└─────────────────────────────────────┘
    │
    ▼
Actualización del DOM si hay cambios
```

#### OnPush (Estrategia optimizada)
```typescript
@Component({
  selector: 'app-example',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleComponent { }
```

**Comportamiento:**
- Angular **solo verifica** el componente cuando:
  1. La referencia del `@Input()` cambia (nueva referencia, no mutación)
  2. Un evento originado **dentro** del componente (click, submit, etc.)
  3. Uso explícito de `ChangeDetectorRef.markForCheck()`
  4. Un `Observable` vinculado con `async` pipe emite un valor
  5. Una `Signal` utilizada en el template cambia

**Diagrama de flujo OnPush:**
```
Evento (click, HTTP, timer, etc.)
    │
    ▼
┌─────────────────────────────────────┐
│   Angular verifica SOLO si hay      │
│   cambios en las referencias        │
│                                     │
│     AppComponent ────────────► ✓    │
│         │                           │
│         ▼                           │
│     HeaderComponent ────────► ✗    │  ← Saltado (sin cambios)
│         │                           │
│         ▼                           │
│     DashboardComponent ─────► ✓    │  ← Verificado (evento interno)
│         │                           │
│         ▼                           │
│     MetricCardComponent ────► ✗    │  ← Saltado (input sin cambiar)
│                                     │
└─────────────────────────────────────┘
    │
    ▼
Menos verificaciones = Mejor performance
```

### 2.3 Estado Actual en UyuniAdmin

**✅ IMPLEMENTADO** - 52 componentes ya usan `OnPush`:

```typescript
// Ejemplo de componente con OnPush en UyuniAdmin
@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush, // ← Implementado
  templateUrl: './metric-card.component.html'
})
export class MetricCardComponent {
  // Usando Signals para estado reactivo
  value = signal(0);
  label = input.required<string>();
}
```

### 2.4 Consideraciones Importantes

#### ⚠️ Requiere Inmutabilidad

```typescript
// ❌ MALO: Mutación de array (OnPush NO detecta el cambio)
this.items.push(newItem);

// ✅ BUENO: Nueva referencia (OnPush detecta el cambio)
this.items = [...this.items, newItem];

// ❌ MALO: Mutación de objeto
this.user.name = 'Nuevo Nombre';

// ✅ BUENO: Nuevo objeto
this.user = { ...this.user, name: 'Nuevo Nombre' };
```

#### ✅ Compatibilidad con Signals

```typescript
// OnPush funciona perfectamente con Signals
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleComponent {
  // Signals automáticamente notifican cambios
  count = signal(0);
  doubleCount = computed(() => this.count() * 2);
  
  increment(): void {
    this.count.update(v => v + 1); // OnPush detecta esto
  }
}
```

---

## 3. Virtual Scrolling para Listas Largas

### 3.1 ¿Qué es Virtual Scrolling?

Virtual Scrolling es una técnica que renderiza **solo los elementos visibles** en la ventana del navegador, manteniendo el resto en memoria virtual. A medida que el usuario hace scroll, los elementos se crean y destruyen dinámicamente.

### 3.2 El Problema

Sin Virtual Scrolling, si tienes una lista de 10,000 elementos:

```
┌─────────────────────────────────────────────────────────────────┐
│                    SIN VIRTUAL SCROLL                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐                                           │
│  │ Elemento 1       │ ──► DOM Node                              │
│  ├──────────────────┤                                           │
│  │ Elemento 2       │ ──► DOM Node                              │
│  ├──────────────────┤                                           │
│  │ ...              │                                           │
│  ├──────────────────┤                                           │
│  │ Elemento 9999    │ ──► DOM Node                              │
│  ├──────────────────┤                                           │
│  │ Elemento 10000   │ ──► DOM Node                              │
│  └──────────────────┘                                           │
│                                                                  │
│  Total: 10,000 nodos DOM                                        │
│  Memoria: ~50-100 MB                                            │
│  Tiempo de render: 2-5 segundos                                 │
│  Scroll: Laggy, bloqueos                                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.3 La Solución

Con Virtual Scrolling:

```
┌─────────────────────────────────────────────────────────────────┐
│                    CON VIRTUAL SCROLL                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐                                           │
│  │ Elemento 45      │ ──► DOM Node (visible)                    │
│  ├──────────────────┤                                           │
│  │ Elemento 46      │ ──► DOM Node (visible)                    │
│  ├──────────────────┤                                           │
│  │ Elemento 47      │ ──► DOM Node (visible)                    │
│  ├──────────────────┤                                           │
│  │ Elemento 48      │ ──► DOM Node (visible)                    │
│  ├──────────────────┤                                           │
│  │ Elemento 49      │ ──► DOM Node (visible)                    │
│  └──────────────────┘                                           │
│                                                                  │
│  Total: ~10-20 nodos DOM (solo visibles)                        │
│  Memoria: ~1-2 MB                                               │
│  Tiempo de render: <100ms                                       │
│  Scroll: Suave, 60fps                                           │
│                                                                  │
│  Elementos 1-44 y 50-10000: En memoria virtual                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.4 Implementación con Angular CDK

#### Paso 1: Instalar Angular CDK (si no está instalado)

```bash
npm install @angular/cdk
```

#### Paso 2: Importar el módulo

```typescript
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [ScrollingModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-list.component.html'
})
export class UserListComponent {
  users = signal<User[]>([]);
}
```

#### Paso 3: Template con Virtual Scroll

```html
<!-- user-list.component.html -->
<cdk-virtual-scroll-viewport 
  itemSize="72" 
  class="h-[500px] border rounded">
  
  <div *cdkVirtualFor="let user of users(); trackBy: trackByUserId"
       class="flex items-center p-4 border-b hover:bg-gray-50 dark:hover:bg-gray-800">
    
    <img [src]="user.avatar" class="w-10 h-10 rounded-full mr-3" />
    <div>
      <p class="font-medium">{{ user.name }}</p>
      <p class="text-sm text-gray-500">{{ user.email }}</p>
    </div>
    
  </div>
  
</cdk-virtual-scroll-viewport>
```

#### Paso 4: TrackBy para optimización adicional

```typescript
trackByUserId(index: number, user: User): string {
  return user.id;
}
```

### 3.5 Cuándo Usar Virtual Scrolling

| Criterio | Sin Virtual Scroll | Con Virtual Scroll |
|----------|-------------------|-------------------|
| **Cantidad de items** | < 50 items | > 100 items |
| **Complejidad de item** | Simple (texto) | Complejo (imágenes, múltiples elementos) |
| **Memoria disponible** | No es preocupación | Limitada |
| **Frecuencia de actualización** | Alta (real-time) | Media/Baja |
| **Necesidad de búsqueda** | Sí (filtrado) | Sí (con buffer) |

### 3.6 Casos de Uso en UyuniAdmin

| Componente | Items Estimados | ¿Necesita Virtual Scroll? |
|------------|-----------------|---------------------------|
| Tabla de usuarios | 100-10,000 | ✅ Sí |
| Lista de facturas | 50-5,000 | ✅ Sí |
| Calendario eventos | 10-100 | ❌ No |
| Notificaciones | 10-50 | ❌ No |
| Logs del sistema | 1,000-100,000 | ✅ Sí |

### 3.7 Consideraciones

#### ✅ Ventajas
- Reduce drásticamente el número de nodos DOM
- Mejora el rendimiento de scroll
- Reduce el uso de memoria
- Mejor experiencia de usuario en listas grandes

#### ⚠️ Desventajas
- Complejidad adicional en el código
- No funciona bien con elementos de altura variable (requiere configuración adicional)
- Puede haber problemas con sticky headers
- Requiere `trackBy` para buen rendimiento

---

## 4. Preloading Strategy para Lazy Loading

### 4.1 ¿Qué es Preloading?

Preloading es la carga anticipada de módulos lazy-loaded en segundo plano, mientras el usuario navega por la aplicación. Esto permite que cuando el usuario navegue a una ruta pre-cargada, la navegación sea instantánea.

### 4.2 El Problema

Sin Preloading:

```
┌─────────────────────────────────────────────────────────────────┐
│                    SIN PRELOADING                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Tiempo: 0s                                                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Usuario carga la app                                    │    │
│  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │    │
│  │ Dashboard (cargado)                                     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Tiempo: 5s (usuario hace click en Calendar)                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Usuario espera...                                       │    │
│  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │    │
│  │ Loading Calendar... ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │    │
│  │ (2 segundos de espera)                                  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Tiempo: 10s (usuario hace click en Tables)                     │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Usuario espera de nuevo...                              │    │
│  │ Loading Tables... ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │    │
│  │ (2 segundos de espera)                                  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Total de esperas: 4+ segundos                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 4.3 La Solución

Con Preloading:

```
┌─────────────────────────────────────────────────────────────────┐
│                    CON PRELOADING                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Tiempo: 0s                                                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Usuario carga la app                                    │    │
│  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │    │
│  │ Dashboard (cargado)                                     │    │
│  │ Preloading: Calendar, Tables, Charts... (background)    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Tiempo: 5s (usuario hace click en Calendar)                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Navegación INSTANTÁNEA                                  │    │
│  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │    │
│  │ Calendar ya está cargado en memoria                     │    │
│  │ (0 segundos de espera)                                  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Tiempo: 10s (usuario hace click en Tables)                     │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Navegación INSTANTÁNEA                                  │    │
│  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │    │
│  │ Tables ya está cargado en memoria                       │    │
│  │ (0 segundos de espera)                                  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Total de esperas: 0 segundos                                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 4.4 Estrategias de Preloading

#### 4.4.1 PreloadAllModules (Cargar todo)

```typescript
// app.config.ts
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withPreloading(PreloadAllModules) // ← Carga todos los módulos en background
    )
  ]
};
```

**Comportamiento:**
- Carga **todos** los módulos lazy después de que la app inicial carga
- Simple de implementar
- Puede consumir ancho de banda innecesario

**Cuándo usar:**
- Aplicaciones pequeñas/medianas
- Conexiones rápidas
- Cuando todos los módulos son igualmente importantes

#### 4.4.2 NoPreloading (Por defecto)

```typescript
import { provideRouter } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes) // Sin preloading
  ]
};
```

**Comportamiento:**
- No carga ningún módulo anticipadamente
- Cada navegación dispara la carga del módulo

**Cuándo usar:**
- Aplicaciones con módulos muy grandes
- Conexiones lentas (mobile)
- Cuando el usuario raramente navega a ciertas secciones

#### 4.4.3 Custom Preloading Strategy (Selectiva)

```typescript
// core/strategies/selective-preloading.strategy.ts
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

export interface PreloadableRoute extends Route {
  data?: {
    preload?: boolean;
    preloadDelay?: number;
  };
}

@Injectable({ providedIn: 'root' })
export class SelectivePreloadingStrategy implements PreloadingStrategy {
  preload(route: PreloadableRoute, load: () => Observable<any>): Observable<any> {
    // Solo precargar si la ruta tiene preload: true
    if (route.data?.preload) {
      return load();
    }
    return of(null);
  }
}
```

**Uso en rutas:**
```typescript
// app.routes.ts
const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('@features/dashboard/dashboard.routes')
      .then(m => m.routes),
    data: { preload: true } // ← Se precargará
  },
  {
    path: 'admin',
    loadChildren: () => import('@features/admin/admin.routes')
      .then(m => m.routes),
    data: { preload: false } // ← No se precargará
  }
];
```

**Configuración:**
```typescript
// app.config.ts
import { SelectivePreloadingStrategy } from '@core/strategies/selective-preloading.strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withPreloading(SelectivePreloadingStrategy)
    )
  ]
};
```

### 4.5 Estado Actual en UyuniAdmin

**⬜ NO IMPLEMENTADO** - Actualmente usa lazy loading sin preloading:

```typescript
// app.config.ts actual
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes) // Sin withPreloading()
  ]
};
```

### 4.6 Recomendación para UyuniAdmin

Dado el tamaño del proyecto y las características:

```typescript
// RECOMENDADO: PreloadAllModules
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withPreloading(PreloadAllModules)
    )
  ]
};
```

**Justificación:**
1. El proyecto tiene ~10 feature modules (no es excesivo)
2. Es un dashboard administrativo (el usuario navega frecuentemente)
3. Mejora significativamente la UX
4. Implementación simple (1 línea de código)

### 4.7 Consideraciones

#### ✅ Ventajas
- Navegación instantánea entre secciones
- Mejor UX percibida
- Aprovecha el tiempo idle del navegador
- Simple de implementar

#### ⚠️ Desventajas
- Consume ancho de banda adicional
- Puede afectar la carga inicial si hay muchos módulos
- No ideal para conexiones lentas

---

## 5. Matriz de Decisión

### 5.1 ¿Qué implementar?

| Técnica | ¿Implementar? | Prioridad | Justificación |
|---------|---------------|-----------|---------------|
| **OnPush** | ✅ Ya implementado | - | 52 componentes actualizados |
| **Virtual Scrolling** | ✅ Sí | Alta | Tablas con muchos registros |
| **Preloading** | ✅ Sí | Media | Mejora UX de navegación |

### 5.2 Impacto por Feature

```
┌─────────────────────────────────────────────────────────────────┐
│                    IMPACTO POR FEATURE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Feature          OnPush    Virtual Scroll    Preloading        │
│  ───────────────  ──────    ─────────────    ──────────        │
│  Dashboard        Alto      Bajo             Medio              │
│  Tables           Alto      MUY ALTO         Medio              │
│  Calendar         Alto      Bajo             Medio              │
│  Charts           Alto      Bajo             Medio              │
│  Invoice List     Alto      ALTO             Medio              │
│  Auth             Alto      N/A              Bajo               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Plan de Implementación

### 6.1 Fase 1: Preloading (Prioridad Media)

**Tiempo estimado:** 30 minutos

**Pasos:**
1. Modificar `app.config.ts` para agregar `withPreloading(PreloadAllModules)`
2. Verificar que no hay errores en consola
3. Probar navegación entre secciones

**Archivo a modificar:**
```
src/app/app.config.ts
```

**Código:**
```typescript
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withPreloading(PreloadAllModules)
    ),
    // ... otros providers
  ]
};
```

### 6.2 Fase 2: Virtual Scrolling (Prioridad Alta)

**Tiempo estimado:** 2-4 horas

**Pasos:**
1. Instalar `@angular/cdk` si no está instalado
2. Identificar componentes con listas largas
3. Implementar `cdk-virtual-scroll-viewport`
4. Agregar `trackBy` functions
5. Probar con datos reales

**Componentes candidatos:**
- `src/app/features/tables/` - Tablas de datos
- `src/app/features/invoice/pages/list/` - Lista de facturas
- Cualquier componente con `*ngFor` sobre arrays grandes

**Ejemplo de implementación:**
```typescript
// Antes
<div *ngFor="let item of items()">
  {{ item.name }}
</div>

// Después
<cdk-virtual-scroll-viewport itemSize="48" class="h-[400px]">
  <div *cdkVirtualFor="let item of items(); trackBy: trackById">
    {{ item.name }}
  </div>
</cdk-virtual-scroll-viewport>
```

### 6.3 Checklist de Implementación

```markdown
## Preloading
- [ ] Modificar app.config.ts
- [ ] Verificar navegación instantánea
- [ ] Medir tiempo de carga inicial vs navegación

## Virtual Scrolling
- [ ] Instalar @angular/cdk
- [ ] Identificar componentes con listas largas (> 50 items)
- [ ] Implementar en tablas
- [ ] Implementar en lista de facturas
- [ ] Agregar trackBy functions
- [ ] Probar con 1000+ items
- [ ] Verificar scroll suave (60fps)
```

---

## 7. Referencias

- [Angular Change Detection](https://angular.io/guide/change-detection)
- [Angular CDK Virtual Scrolling](https://material.angular.io/cdk/scrolling/overview)
- [Angular Preloading Strategy](https://angular.io/guide/lazy-loading-ngmodules#preloading-modules)
- [Angular Performance Checklist](https://angular.io/guide/performance-best-practices)

---

*Documento creado: Marzo 2026*
*Última actualización: Marzo 2026*
