# Bibliografía: Día 16 - Integración Completa

## Recursos Oficiales

### Angular Documentation

| Recurso | URL | Descripción |
|---------|-----|-------------|
| **Architecture** | https://angular.dev/guide/architecture | Arquitectura de aplicaciones |
| **Routing** | https://angular.dev/guide/routing | Routing y navegación |
| **HTTP** | https://angular.dev/guide/http | Cliente HTTP |
| **Dependency Injection** | https://angular.dev/guide/dependency-injection | Inyección de dependencias |

### Angular Signals

| Recurso | URL | Descripción |
|---------|-----|-------------|
| **Signals Guide** | https://angular.dev/guide/signals | Guía oficial de Signals |
| **Computed Signals** | https://angular.dev/guide/signals#computed-signals | Signals computados |
| **Effects** | https://angular.dev/guide/signals#effects | Efectos en Signals |

---

## Artículos y Blogs

### Architecture Patterns

1. **"Angular Architecture Patterns"**
   - URL: https://angular.dev/guide/architecture
   - Descripción: Patrones de arquitectura enterprise

2. **"Large Scale Angular Applications"**
   - URL: https://angular.dev/guide/scalable-architecture
   - Descripción: Escalando aplicaciones Angular

3. **"State Management in Angular"**
   - URL: https://blog.angular.dev/angular-signals-is-here
   - Descripción: Manejo de estado con Signals

### Integration Patterns

1. **"Component Communication in Angular"**
   - URL: https://angular.dev/guide/inputs-outputs
   - Descripción: Comunicación entre componentes

2. **"HTTP Interceptors in Angular"**
   - URL: https://angular.dev/guide/http#intercepting-requests-and-responses
   - Descripción: Interceptores HTTP

3. **"Route Guards in Angular"**
   - URL: https://angular.dev/guide/router#guards
   - Descripción: Protección de rutas

---

## Libros Recomendados

### Angular Architecture

1. **"Enterprise Angular"** - Manfred Steyer
   - Capítulo sobre arquitectura modular
   - Capítulo sobre integración de módulos

2. **"Angular Development with TypeScript"** - Yakov Fain
   - Capítulo sobre Dependency Injection
   - Capítulo sobre HTTP y Observables

3. **"ng-book: The Complete Guide to Angular"** - Nate Murray
   - Capítulo sobre Routing avanzado
   - Capítulo sobre State Management

---

## Videos y Cursos

### Videos Oficiales

1. **Angular - YouTube Channel**
   - URL: https://www.youtube.com/@Angular/search?query=architecture
   - Videos sobre arquitectura y integración

2. **Angular Connect Conference**
   - URL: https://www.youtube.com/@AngularConnect/search?query=enterprise
   - Charlas sobre enterprise patterns

### Cursos Online

1. **Angular University**
   - URL: https://angular-university.io/
   - Curso: "Angular Architecture and Best Practices"

2. **Pluralsight**
   - URL: https://www.pluralsight.com/search?q=angular%20architecture
   - Curso: "Angular Large Scale Applications"

---

## Patrones y Arquitectura

### Design Patterns

1. **"Singleton Pattern"**
   - URL: https://refactoring.guru/design-patterns/singleton
   - Descripción: Patrón usado en servicios Angular

2. **"Observer Pattern"**
   - URL: https://refactoring.guru/design-patterns/observer
   - Descripción: Patrón base de RxJS y Signals

3. **"Facade Pattern"**
   - URL: https://refactoring.guru/design-patterns/facade
   - Descripción: Patrón para simplificar APIs complejas

### Best Practices

1. **"Angular Style Guide"**
   - URL: https://angular.dev/style-guide
   - Sección: Application Structure

2. **"Angular Performance Checklist"**
   - URL: https://angular.dev/guide/performance
   - Descripción: Optimización de rendimiento

---

## Herramientas

### Debugging

1. **Angular DevTools**
   - URL: https://angular.dev/tools/devtools
   - Descripción: Herramienta oficial de debugging

2. **Redux DevTools**
   - URL: https://github.com/reduxjs/redux-devtools
   - Descripción: Para debugging de estado

### Performance

1. **Angular Performance Budgets**
   - URL: https://angular.dev/cli/generate#budget-options
   - Descripción: Configuración de budgets

2. **Webpack Bundle Analyzer**
   - URL: https://www.npmjs.com/package/webpack-bundle-analyzer
   - Descripción: Análisis de bundles

---

## Ejemplos de Código

### Repositorios de Referencia

1. **Angular Official Examples**
   - URL: https://github.com/angular/angular/tree/main/packages
   - Ejemplos de arquitectura

2. **Angular Material**
   - URL: https://github.com/angular/components
   - Arquitectura de componentes

3. **UyuniAdmin Frontend**
   - URL: [Repositorio local]
   - Arquitectura completa implementada

---

## Conceptos Clave

### Capas de Arquitectura

| Capa | Responsabilidad |
|------|-----------------|
| **Presentation** | UI y componentes |
| **Business** | Lógica de negocio |
| **Infrastructure** | HTTP, interceptors, guards |
| **Data** | Modelos y tipos |

### Flujo de Datos

```
User Action → Component → Service → HTTP → Interceptor → API
     ↑                                                      │
     │                                                      ▼
     └──────────────── Signal Update ←───────────────── Response
```

---

## Glosario

| Término | Definición |
|---------|------------|
| **Integration** | Conexión de múltiples módulos |
| **Layout** | Estructura visual de la aplicación |
| **Guard** | Protección de rutas |
| **Interceptor** | Middleware HTTP |
| **Signal** | Estado reactivo |
| **Computed** | Signal derivado |
| **Lazy Loading** | Carga diferida |

---

## Próximos Pasos

1. **Practicar**: Integrar features en proyectos propios
2. **Explorar**: Investigar patrones avanzados
3. **Contribuir**: Revisar código de otros proyectos
4. **Documentar**: Crear documentación de arquitectura

---

*Bibliografía - Día 16 - Curso Angular 21 - UyuniAdmin Frontend*
