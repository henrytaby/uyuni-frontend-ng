# Día 12: Bibliografía y Recursos - Estado con Signals y RxJS

## Documentación Oficial

### Angular Signals

| Recurso | URL | Descripción |
|---------|-----|-------------|
| Angular Signals Guide | https://angular.dev/guide/signals | Guía oficial de Signals |
| Signal-based Inputs | https://angular.dev/guide/signals/inputs | Inputs con Signals |
| RxJS Interop | https://angular.dev/guide/signals/rxjs-interop | toSignal y toObservable |
| Computed Signals | https://angular.dev/guide/signals#computed-signals | Signals computadas |
| Effects | https://angular.dev/guide/signals#effects | Side effects con Signals |

### RxJS

| Recurso | URL | Descripción |
|---------|-----|-------------|
| RxJS Official Docs | https://rxjs.dev/ | Documentación oficial |
| RxJS Operators | https://rxjs.dev/guide/operators | Operadores RxJS |
| RxJS Marbles | https://rxmarbles.com/ | Visualización de operadores |

---

## Artículos y Blogs

### Signals

1. **"Angular Signals: A Comprehensive Introduction"**
   - Autor: Angular Team
   - URL: https://blog.angular.dev/angular-signals-is-here
   - Tema: Introducción completa a Signals

2. **"Understanding Angular's Reactivity with Signals"**
   - Autor: Netanel Basal
   - URL: https://netbasal.com/
   - Tema: Profundización en reactividad

3. **"Signals vs RxJS: When to Use What"**
   - Autor: Joshua Morony
   - URL: https://www.youtube.com/@JoshuaMorony/search?query=signals%20vs%20rxjs
   - Tema: Comparación práctica

4. **"The Complete Guide to Angular Signals"**
   - Autor: Tim Deschryver
   - URL: https://timdeschryver.dev/
   - Tema: Guía exhaustiva

### RxJS Interop

1. **"toSignal and toObservable: Bridging Signals and RxJS"**
   - Autor: Angular Team
   - Tema: Interoperabilidad

2. **"Converting RxJS Streams to Signals"**
   - Autor: Lars Gyrup Brink Nielsen
   - Tema: Patrones de conversión

3. **"Hybrid State Management in Angular"**
   - Autor: Michael Hladky
   - Tema: Estado híbrido

---

## Videos y Cursos

### YouTube

| Canal | Video | Duración |
|-------|-------|----------|
| Angular | "Introducing Signals in Angular" | 45 min |
| Joshua Morony | "Angular Signals Crash Course" | 60 min |
| Fireship | "Angular Signals in 100 Seconds" | 3 min |
| Angular University | "Signals vs RxJS" | 30 min |
| NG-DE Conf | "Deep Dive into Signals" | 45 min |

### Cursos Online

1. **"Angular Signals Fundamentals"**
   - Plataforma: Pluralsight
   - Duración: 2 horas
   - Nivel: Intermedio

2. **"Advanced Angular State Management"**
   - Plataforma: Udemy
   - Duración: 4 horas
   - Nivel: Avanzado

3. **"RxJS Masterclass"**
   - Plataforma: Angular University
   - Duración: 8 horas
   - Nivel: Intermedio-Avanzado

---

## Libros

1. **"Angular Signals: The Definitive Guide"**
   - Autor: Various
   - Año: 2024
   - Capítulos relevantes: 5-8

2. **"RxJS in Action"**
   - Autor: Paul P. Daniels
   - Año: 2017
   - Capítulos: 1-4 (Fundamentos), 6-8 (Operadores)

3. **"Angular Design Patterns"**
   - Autor: Mathieu Nayrolles
   - Año: 2024
   - Capítulos: 3-5 (Estado y Signals)

---

## Repositorios de Ejemplo

### Proyectos de Referencia

1. **Angular Signals Examples**
   - URL: https://github.com/angular/angular/tree/main/packages/core/test/signals
   - Descripción: Tests oficiales de Signals

2. **RxJS Interop Examples**
   - URL: https://github.com/angular/angular/tree/main/packages/rxjs
   - Descripción: Ejemplos de interoperabilidad

3. **SignalStore Pattern**
   - URL: https://github.com/ngrx/platform (SignalStore)
   - Descripción: Patrón de Store con Signals

---

## Herramientas

### Debugging

| Herramienta | Uso | URL |
|-------------|-----|-----|
| Angular DevTools | Inspeccionar Signals | Chrome Extension |
| RxJS Debugger | Visualizar streams | VS Code Extension |
| Redux DevTools | Time-travel debugging | Chrome Extension |

### Testing

| Herramienta | Uso |
|-------------|-----|
| Jest | Unit tests para Signals |
| Jasmine | Tests nativos de Angular |
| Spectator | Testing helpers |

---

## Patrones y Best Practices

### Documentación de Patrones

1. **"Signal-based State Management"**
   - Fuente: Angular Blog
   - Tema: Patrones de estado

2. **"Computed vs Effect: Decision Matrix"**
   - Fuente: Community Wiki
   - Tema: Cuándo usar cada uno

3. **"Hybrid State Architecture"**
   - Fuente: Enterprise Patterns
   - Tema: Arquitectura híbrida

---

## Comunidad

### Foros y Discord

- **Angular Discord**: https://discord.gg/angular
- **Reddit**: r/Angular
- **Stack Overflow**: Tag [angular-signals]

### Cuentas de Twitter/X

- @angular
- @AngularInDepth
- @JoshuaAMorony
- @NetanelBasal
- @tim_deschryver

---

## Recursos del Proyecto UyuniAdmin

### Archivos Relevantes

| Archivo | Descripción |
|---------|-------------|
| `src/app/core/auth/auth.service.ts` | AuthService con Signals |
| `src/app/core/services/loading.service.ts` | LoadingService con Signals |
| `src/app/core/interceptors/auth.interceptor.ts` | Interceptor con toSignal |

### Documentación Interna

- [`docs/ARCHITECTURE.md`](../../../docs/ARCHITECTURE.md)
- [`docs/AUTHENTICATION.md`](../../../docs/AUTHENTICATION.md)
- [`.kilocode/rules/memory-bank/architecture-patterns.md`](../../../.kilocode/rules/memory-bank/architecture-patterns.md)

---

## Glosario

| Término | Definición |
|---------|------------|
| **Signal** | Contenedor reactivo de valor que notifica cambios |
| **Computed Signal** | Signal derivada de otras Signals |
| **Effect** | Función que ejecuta side effects cuando Signals cambian |
| **toSignal** | Función que convierte Observable a Signal |
| **toObservable** | Función que convierte Signal a Observable |
| **Reactive Context** | Contexto donde se leen Signals (computed, effect, templates) |
| **Dependency Graph** | Grafo de dependencias entre Signals |

---

## Próximos Pasos

1. **Día 13**: UI con PrimeNG
2. **Día 14**: Estilos con Tailwind CSS v4
3. **Día 15**: Features y Componentes

---

*Bibliografía - Día 12 - Curso Angular 21 - UyuniAdmin Frontend*
