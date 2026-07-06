# Día 11: Bibliografía y Recursos - RxJS Operadores

## Documentación Oficial

### RxJS
- [RxJS Official Documentation](https://rxjs.dev/) - Documentación completa de RxJS
- [RxJS Operator Decision Tree](https://rxjs.dev/operator-decision-tree) - Árbol de decisión para elegir operadores
- [RxJS API Reference](https://rxjs.dev/api/) - Referencia completa de la API

### Angular
- [Angular - Observables](https://angular.dev/guide/observables) - Guía oficial de Angular sobre Observables
- [Angular - RxJS](https://angular.dev/guide/rxjs) - Integración de RxJS en Angular
- [Angular - HTTP Client](https://angular.dev/guide/http) - Uso de HTTP con Observables

---

## Herramientas de Visualización

### RxMarbles
- [RxMarbles](https://rxmarbles.com/) - Visualización interactiva de operadores
- [RxMarbles - filter](https://rxmarbles.com/#filter) - Visualización de filter
- [RxMarbles - switchMap](https://rxmarbles.com/#switchMap) - Visualización de switchMap
- [RxMarbles - combineLatest](https://rxmarbles.com/#combineLatest) - Visualización de combineLatest

### Otras Herramientas
- [RxViz](https://rxviz.com/) - Visualización de Observables en tiempo real
- [RxJS Explorer](https://github.com/cartant/rxjs-explorer) - Explorador de operadores

---

## Tutoriales y Guías

### Tutoriales Completos
- [Learn RxJS](https://www.learnrxjs.io/) - Tutorial completo de RxJS
- [RxJS Introduction](https://rxjs.dev/guide/overview) - Introducción oficial
- [RxJS Guide](https://www.freecodecamp.org/news/learn-rxjs-for-angular/) - FreeCodeCamp RxJS Guide

### Artículos Específicos
- [Understanding switchMap](https://blog.angular-university.io/rxjs-switchmap-operator/) - Angular University
- [mergeMap vs switchMap vs concatMap](https://javascript.plainenglish.io/exploring-switchmap-mergemap-and-concatmap-in-rxjs-bc943a294580) - Comparación detallada
- [RxJS Error Handling](https://rxjs.dev/guide/error-handling) - Manejo de errores

---

## Videos

### Videos en Español
- [RxJS desde Cero](https://www.youtube.com/@codigofacilito/search?query=rxjs) - YouTube
- [Angular y RxJS](https://www.youtube.com/@AngularUniversity/search?query=rxjs) - Tutoriales en español

### Videos en Inglés
- [RxJS Operators - Angular University](https://www.youtube.com/@AngularUniversity/search?query=operators)
- [RxJS Quick Starts](https://www.youtube.com/@AngularUniversity/search?query=rxjs)
- [RxJS in Action](https://www.youtube.com/@manningpublications/search?query=rxjs)

---

## Libros

### Libros Gratuitos
- [RxJS 5 Ultimate](https://rxjs.dev/guide/overview) - Documentación oficial
- [The Introduction to Reactive Programming](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754) - Por André Staltz

### Libros de Paga
- "RxJS in Action" - Paul P. Daniels, Luis Atencio
- "Reactive Programming with RxJS" - Sergi Mansilla
- "Angular Development with RxJS" - Nishu Goel

---

## Blogs y Artículos

### Blogs Técnicos
- [Angular University Blog](https://blog.angular-university.io/) - Artículos sobre RxJS
- [RxJS Blog](https://rxjs.dev/blog) - Blog oficial
- [Ben Lesh's Blog](https://twitter.com/benlesh) - Creador de RxJS 5+

### Artículos Recomendados
- [Don't Unsubscribe](https://twitter.com/benlesh/status/rxjs-dont-unsubscribe) - Por Ben Lesh
- [Learning Path for RxJS](https://www.learnrxjs.io/) - Ruta de aprendizaje
- [Common RxJS Pitfalls](https://dev.to/devin-rosario/best-practices-for-angular-state-management-2pm1) - Errores comunes

---

## Ejemplos y Código

### Repositorios GitHub
- [RxJS Examples](https://github.com/ReactiveX/rxjs/tree/master/spec) - Ejemplos oficiales
- [Angular RxJS Examples](https://github.com/angular/angular/tree/master/packages/core) - Ejemplos de Angular
- [RxJS Recipes](https://rxjs.dev/guide/recipes) - Recetas comunes

### StackBlitz
- [RxJS Playground](https://stackblitz.com/edit/rxjs-playground) - Playground interactivo
- [Angular RxJS Demo](https://stackblitz.com/edit/angular-rxjs-demo) - Demo en Angular

---

## Herramientas de Desarrollo

### Extensiones de VS Code
- [RxJS Snippets](https://marketplace.visualstudio.com/items?itemName=kisstkondoros.vscode-rxjs-snippets) - Snippets para RxJS
- [Angular Language Service](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template) - Soporte para Angular

### Debugging
- [RxJS DevTools](https://github.com/nickolasburr/rxjs-devtools) - Herramientas de debugging
- [RxJS Spy](https://github.com/cartant/rxjs-spy) - Spy para debugging

---

## Comunidad

### Foros
- [Stack Overflow - RxJS](https://stackoverflow.com/questions/tagged/rxjs) - Preguntas y respuestas
- [Angular Discord](https://discord.gg/angular) - Comunidad de Angular
- [RxJS GitHub Discussions](https://github.com/ReactiveX/rxjs/discussions) - Discusiones oficiales

### Redes Sociales
- [Twitter - RxJS](https://twitter.com/RxJS) - Cuenta oficial
- [Reddit - RxJS](https://www.reddit.com/r/rxjs/) - Comunidad en Reddit

---

## Conceptos Relacionados

### Reactive Programming
- [The Reactive Manifesto](https://www.reactivemanifesto.org/) - Manifiesto Reactivo
- [Reactive Extensions](https://reactivex.io/) - Sitio oficial de ReactiveX
- [Reactive Programming Introduction](https://www.reactivemanifesto.org/) - Introducción

### Patrones de Diseño
- [Observer Pattern](https://en.wikipedia.org/wiki/Observer_pattern) - Patrón Observer
- [Reactive Patterns](https://blog.angular-university.io/angular-2-reactive-patterns/) - Patrones reactivos

---

## Recursos del Proyecto UyuniAdmin

### Código Fuente
- [`auth.interceptor.ts`](../../../../src/app/core/interceptors/auth.interceptor.ts) - Uso de switchMap para token refresh
- [`auth.service.ts`](../../../../src/app/core/auth/auth.service.ts) - Uso de catchError y retry
- [`token-refresh.service.ts`](../../../../src/app/core/services/token-refresh.service.ts) - BehaviorSubject y Subjects

### Documentación del Proyecto
- [Authentication System](../../../../docs/AUTHENTICATION.md) - Sistema de autenticación
- [Architecture Patterns](../../../../docs/ARCHITECTURE.md) - Patrones arquitectónicos
- [Network Resilience](../../../../docs/NETWORK_RESILIENCE.md) - Manejo de errores de red

---

## Práctica Adicional

### Ejercicios Recomendados
1. Implementar una búsqueda con debounce
2. Crear un sistema de notificaciones con merge
3. Cargar datos en paralelo con forkJoin
4. Implementar cleanup con takeUntil
5. Manejar errores con catchError y retry

### Proyectos de Práctica
- Clonar la funcionalidad de búsqueda de Google
- Implementar un chat en tiempo real
- Crear un dashboard con múltiples fuentes de datos
- Construir un sistema de notificaciones

---

## Actualizaciones y Versiones

### Historial de Versiones
- RxJS 7.x - Versión actual (usada en Angular 21)
- RxJS 6.x - Versión anterior (Angular 12-16)
- RxJS 5.x - Versión legacy

### Cambios Importantes
- [RxJS 7 Migration](https://rxjs.dev/guide/migration) - Guía de migración
- [Breaking Changes](https://github.com/ReactiveX/rxjs/blob/master/CHANGELOG.md) - Registro de cambios

---

*Bibliografía - Día 11 - Curso Angular 21 - UyuniAdmin Frontend*
