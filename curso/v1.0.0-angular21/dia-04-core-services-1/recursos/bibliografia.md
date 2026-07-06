# Bibliografía y Recursos - Día 4

## Documentación Oficial

### Angular

| Recurso | URL | Descripción |
|---------|-----|-------------|
| **Dependency Injection** | https://angular.dev/guide/di | Guía oficial de DI |
| **Signals** | https://angular.dev/guide/signals | Documentación de Signals |
| **HTTP Interceptors** | https://angular.dev/guide/http/interceptors | Interceptors funcionales |
| **Testing** | https://angular.dev/guide/testing | Guía de testing |

### RxJS

| Recurso | URL | Descripción |
|---------|-----|-------------|
| **finalize operator** | https://rxjs.dev/api/operators/finalize | Documentación del operador |
| **filter operator** | https://rxjs.dev/api/operators/filter | Filtrado de observables |

---

## Artículos y Blogs

### Core Services

1. **"Angular Services — Complete Guide with Patterns and Examples"**
   - https://medium.com/@wm4012388/angular-services-complete-guide-with-patterns-and-examples-f52ccb5e8a77
   - Conceptos fundamentales de servicios

2. **"Angular Singleton Services: The Definitive Guide"**
   - https://techielearn.in/tutorials/angular/services-and-dependency-injection/singleton-services-in-angular
   - Patrón singleton en Angular

3. **"Angular Signals: A Complete Guide"**
   - https://blog.angular.dev/angular-signals-is-here
   - Guía completa de Signals

### Logging

4. **"Better Logging in Angular Applications"**
   - https://www.hone.sh/chat?q=angular%20logging%20best%20practices
   - Mejores prácticas de logging

5. **"Angular Logging Best Practices"**
   - https://www.telerik.com/blogs/angular-logging
   - Logging para producción

### Loading States

6. **"Managing Loading States in Angular"**
   - https://blog.openreplay.com/manage-state-angular/
   - Patrones de loading

7. **"Angular HTTP Loading Indicator"**
   - https://www.telerik.com/blogs/loading-indicator
   - Implementación de indicadores

---

## Videos

### Angular Official

1. **"Angular Dependency Injection Deep Dive"**
   - https://www.youtube.com/@Angular/search?query=dependency%20injection
   - Deep dive en DI

2. **"Introducing Angular Signals"**
   - https://www.youtube.com/@Angular/search?query=signals
   - Presentación de Signals

### Tutoriales

3. **"Angular Services Tutorial"**
   - https://www.youtube.com/@AngularUniversity/search?query=services
   - Tutorial de servicios

4. **"Angular HTTP Interceptors"**
   - https://www.youtube.com/@AngularUniversity/search?query=interceptors
   - Interceptors paso a paso

---

## Libros

### Recomendados

1. **"Angular in Action"** - Mark Rajan
   - Capítulo 5: Dependency Injection
   - Capítulo 7: HTTP and Observables

2. **"Ng-Book: The Complete Guide to Angular"**
   - Sección: Services and Dependency Injection
   - Sección: Reactive Programming

3. **"Angular Design Patterns"** - Mathieu Nayrolles
   - Patrón Singleton
   - Patrón Observer

---

## Herramientas

### Testing

| Herramienta | URL | Uso |
|-------------|-----|-----|
| **Jest** | https://jestjs.io/ | Testing framework |
| **jest-preset-angular** | https://github.com/thymikee/jest-preset-angular | Integración Angular |

### Debugging

| Herramienta | URL | Uso |
|-------------|-----|-----|
| **Angular DevTools** | https://angular.dev/tools/devtools | Debug de componentes |
| **Redux DevTools** | https://github.com/reduxjs/redux-devtools | Debug de estado |

---

## Código Fuente de Referencia

### Proyecto UyuniAdmin

| Archivo | Ruta | Descripción |
|---------|------|-------------|
| LoggerService | `src/app/core/services/logger.service.ts` | Implementación completa |
| LoadingService | `src/app/core/services/loading.service.ts` | Implementación completa |
| loading.interceptor | `src/app/core/interceptors/loading.interceptor.ts` | Interceptor HTTP |

### Tests de Referencia

| Archivo | Ruta | Descripción |
|---------|------|-------------|
| logger.service.spec.ts | `src/app/core/services/logger.service.spec.ts` | Tests de LoggerService |
| loading.service.spec.ts | `src/app/core/services/loading.service.spec.ts` | Tests de LoadingService |

---

## Patrones de Diseño

### Singleton

```typescript
@Injectable({ providedIn: 'root' })
export class MyService {
  // Una instancia en toda la app
}
```

**Referencia**: https://refactoring.guru/design-patterns/singleton

### Observer (Signals)

```typescript
count = signal(0);
isLoading = computed(() => this.count() > 0);
```

**Referencia**: https://refactoring.guru/design-patterns/observer

---

## Glosario

| Término | Definición |
|---------|------------|
| **Singleton** | Patrón que asegura una sola instancia |
| **Signal** | Valor reactivo que notifica cambios |
| **Computed Signal** | Signal derivado de otros signals |
| **inject()** | Función para inyectar dependencias |
| **providedIn** | Metadata que define el scope del servicio |
| **Interceptor** | Middleware para HTTP requests |
| **finalize** | Operador que ejecuta código al completar |

---

## Ejercicios Adicionales

### Reto 1: Logger con Persistencia

Implementar persistencia de logs en localStorage:

```typescript
// Agregar a LoggerService
enablePersistence(maxEntries: number): void {}
getPersistedLogs(): LogEntry[] {}
clearPersistedLogs(): void {}
```

### Reto 2: Loading por Feature

Implementar loading states independientes:

```typescript
// LoadingService extendido
isLoadingFeature(feature: string): Signal<boolean> {}
showFeature(feature: string): void {}
hideFeature(feature: string): void {}
```

### Reto 3: Logger con Remote Logging

Enviar logs a un servidor:

```typescript
// LoggerService extendido
enableRemoteLogging(endpoint: string): void {}
sendToServer(entry: LogEntry): void {}
```

---

## Próximos Pasos

1. **Día 5**: ConfigService y TokenRefreshService
2. **Día 6**: AuthErrorHandlerService y NetworkErrorService
3. **Día 7**: AuthService completo

---

*Recursos - Día 4*
*Curso: Angular 21 Enterprise*
*Día: 4 de 18*
