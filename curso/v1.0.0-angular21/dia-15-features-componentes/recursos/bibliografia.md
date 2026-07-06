# Bibliografía: Día 15 - Features y Componentes

## Recursos Oficiales

### Angular Documentation

| Recurso | URL | Descripción |
|---------|-----|-------------|
| **Component Basics** | https://angular.dev/guide/components | Fundamentos de componentes |
| **Component Inputs** | https://angular.dev/guide/components/inputs | Input signals y comunicación |
| **Component Outputs** | https://angular.dev/guide/components/outputs | Output signals y eventos |
| **Standalone Components** | https://angular.dev/guide/standalone-components | Componentes standalone |
| **Lazy Loading** | https://angular.dev/guide/lazy-loading | Carga diferida de módulos |

### Angular Signals

| Recurso | URL | Descripción |
|---------|-----|-------------|
| **Signals Guide** | https://angular.dev/guide/signals | Guía oficial de Signals |
| **Input Signals** | https://angular.dev/guide/signals#input-signals | Input signals específicamente |
| **Model Signals** | https://angular.dev/guide/signals#model-signals | Two-way binding con signals |

---

## Artículos y Blogs

### Smart vs Dumb Components

1. **"Clean Code: Container & Presentational Components in Angular"** - Telerik
   - URL: https://www.telerik.com/blogs/clean-code-using-container-presentational-components-angular
   - Descripción: Artículo actualizado sobre separación de componentes

2. **"Angular Smart Components vs Presentational Components"**
   - URL: https://www.telerik.com/blogs/angular-smart-components
   - Descripción: Aplicación del patrón en Angular

3. **"Component Architecture in Angular"**
   - URL: https://angular.dev/guide/components
   - Descripción: Arquitectura de componentes en Angular

### Feature Modules

1. **"Angular Feature Modules"**
   - URL: https://angular.dev/guide/architecture-modules
   - Descripción: Estructura de feature modules

2. **"Lazy Loading Feature Modules"**
   - URL: https://angular.dev/guide/lazy-loading-ngmodules
   - Descripción: Lazy loading de features

---

## Libros Recomendados

### Angular Books

1. **"Angular Development with TypeScript"** - Yakov Fain
   - Capítulo 8: Component Communication
   - Capítulo 9: Structural Directives

2. **"ng-book: The Complete Guide to Angular"** - Nate Murray
   - Capítulo sobre Component Architecture
   - Capítulo sobre State Management

3. **"Angular Architecture Patterns"** - Manfred Steyer
   - Capítulo sobre Feature Modules
   - Capítulo sobre Smart/Dumb Components

---

## Videos y Cursos

### Videos Oficiales

1. **Angular - YouTube Channel**
   - URL: https://www.youtube.com/@Angular/search?query=components
   - Videos sobre Signals y Componentes

2. **Angular Connect Conference**
   - URL: https://www.youtube.com/@AngularConnect/search?query=architecture
   - Charlas sobre arquitectura de componentes

### Cursos Online

1. **Angular University**
   - URL: https://angular-university.io/
   - Curso: "Angular Architecture and Best Practices"

2. **Pluralsight**
   - URL: https://www.pluralsight.com/search?q=angular%20components
   - Curso: "Angular Component Communication"

---

## Patrones y Arquitectura

### Design Patterns

1. **"Component-Based Architecture"**
   - URL: https://www.patterns.dev/posts/component-patterns
   - Descripción: Patrones de componentes

2. **"Single Responsibility Principle"**
   - URL: https://en.wikipedia.org/wiki/Single-responsibility_principle
   - Descripción: Principio SOLID aplicado a componentes

### Best Practices

1. **"Angular Style Guide"**
   - URL: https://angular.dev/style-guide
   - Sección: Component Design Patterns

2. **"Angular Coding Standards"**
   - URL: https://angular.dev/style-guide#coding-conventions
   - Descripción: Convenciones de código

---

## Herramientas

### Angular CLI

```bash
# Generar componente
ng generate component feature/pages/list --standalone

# Generar servicio
ng generate service feature/services/feature

# Generar módulo (para routing)
ng generate module feature --routing
```

### VS Code Extensions

1. **Angular Language Service**
   - IntelliSense para templates
   - Detección de errores en tiempo real

2. **Angular Snippets**
   - Snippets para componentes, servicios, etc.

3. **Nx Console**
   - Generación de código con GUI

---

## Ejemplos de Código

### Repositorios de Referencia

1. **Angular Official Examples**
   - URL: https://github.com/angular/angular/tree/main/packages/angular_devkit/schematics
   - Ejemplos de componentes standalone

2. **Angular Material**
   - URL: https://github.com/angular/components
   - Componentes de UI reutilizables

3. **UyuniAdmin Frontend**
   - URL: [Repositorio local]
   - Estructura de features implementada

---

## Conceptos Clave

### Smart Components (Pages)

| Concepto | Descripción |
|----------|-------------|
| **Responsabilidad** | Lógica de negocio y coordinación |
| **Dependencias** | Inyectan servicios |
| **Estado** | Manejan estado con Signals |
| **Routing** | Son routables |
| **Ubicación** | `pages/` folder |

### Dumb Components (UI)

| Concepto | Descripción |
|----------|-------------|
| **Responsabilidad** | Presentación pura |
| **Dependencias** | Sin servicios de negocio |
| **Comunicación** | Input/Output signals |
| **Reutilización** | Altamente reutilizables |
| **Ubicación** | `components/` folder |

---

## Glosario

| Término | Definición |
|---------|------------|
| **Smart Component** | Componente con lógica de negocio |
| **Dumb Component** | Componente de presentación pura |
| **Feature Module** | Módulo que encapsula una funcionalidad |
| **Lazy Loading** | Carga diferida de código |
| **Input Signal** | Signal para recibir datos del padre |
| **Output Signal** | Signal para emitir eventos al padre |
| **Model Signal** | Signal para two-way binding |
| **Cache** | Almacenamiento temporal de datos |

---

## Próximos Pasos

1. **Practicar**: Crear features completos siguiendo la estructura
2. **Refactorizar**: Aplicar patrón Smart/Dumb a proyectos existentes
3. **Explorar**: Investigar más sobre Signals y RxJS interop
4. **Contribuir**: Revisar código de otros desarrolladores

---

*Bibliografía - Día 15 - Curso Angular 21 - UyuniAdmin Frontend*
