# Día 10: Bibliografía y Recursos - RxJS Fundamentos

## Recursos de RxJS

### Documentación Oficial

| Recurso | URL | Descripción |
|---------|-----|-------------|
| RxJS Official | [rxjs.dev](https://rxjs.dev/) | Documentación oficial de RxJS |
| RxJS API | [rxjs.dev/api](https://rxjs.dev/api) | Referencia completa de la API |
| RxJS Guide | [rxjs.dev/guide/overview](https://rxjs.dev/guide/overview) | Guía oficial |
| RxJS Operators | [rxjs.dev/guide/operators](https://rxjs.dev/guide/operators) | Guía de operadores |

### Herramientas de Visualización

| Herramienta | URL | Uso |
|-------------|-----|-----|
| RxMarbles | [rxmarbles.com](https://rxmarbles.com/) | Visualización interactiva de operadores |
| RxViz | [rxviz.com](https://rxviz.com/) | Visualización de Observables |
| RxJS Learn | [learnrxjs.io](https://www.learnrxjs.io/) | Guía completa de operadores |

---

## Artículos y Tutoriales

### Fundamentos

1. **The Introduction to Reactive Programming**
   - URL: https://gist.github.com/staltz/868e7e9bc2a7b8c1f754
   - Autor: André Staltz
   - Idioma: Inglés
   - Nivel: Principiante-Intermedio

2. **RxJS Quick Start**
   - URL: https://rxjs.dev/guide/overview
   - Autor: RxJS Team
   - Idioma: Inglés
   - Nivel: Principiante

3. **Understanding RxJS Observables**
   - URL: https://www.learnrxjs.io/learn-rxjs/concepts/rxjs-observables
   - Autor: Learn RxJS
   - Idioma: Inglés
   - Nivel: Principiante

### Subjects

1. **RxJS Subjects: A Complete Guide**
   - URL: https://www.learnrxjs.io/learn-rxjs/concepts/rxjs-subjects
   - Autor: Learn RxJS
   - Idioma: Inglés
   - Nivel: Intermedio

2. **BehaviorSubject vs ReplaySubject vs Subject**
   - URL: https://rxjs.dev/guide/subject
   - Autor: RxJS Team
   - Idioma: Inglés
   - Nivel: Intermedio

### Operadores

1. **RxJS Operators Guide**
   - URL: https://rxjs.dev/guide/operators
   - Autor: RxJS Team
   - Idioma: Inglés
   - Nivel: Intermedio

2. **Operator Decision Tree**
   - URL: https://rxjs.dev/operator-decision-tree
   - Autor: RxJS Team
   - Idioma: Inglés
   - Nivel: Todos

---

## Videos

### YouTube

1. **RxJS Basics - Fireship**
   - Canal: Fireship
   - Duración: ~10 min
   - URL: https://www.youtube.com/@Fireship/search?query=rxjs
   - Idioma: Inglés

2. **RxJS Observables Tutorial**
   - Canal: Academind
   - Duración: ~30 min
   - URL: https://www.youtube.com/@academind/search?query=rxjs
   - Idioma: Inglés

3. **Understanding RxJS Subjects**
   - Canal: Angular University
   - Duración: ~20 min
   - URL: https://www.youtube.com/@AngularUniversity/search?query=rxjs%20subjects
   - Idioma: Inglés

### Cursos Recomendados

1. **RxJS Masterclass**
   - Plataforma: Ultimate Courses
   - Instructor: Todd Motto
   - URL: https://ultimatecourses.com/courses/rxjs

2. **RxJS in Action**
   - Plataforma: Manning Publications
   - Libro: RxJS in Action
   - URL: https://www.manning.com/books/rxjs-in-action

---

## Libros

### RxJS

1. **"RxJS in Action"**
   - Autores: Paul P. Daniels, Luis Atencio
   - Editorial: Manning
   - Nivel: Intermedio-Avanzado

2. **"Reactive Programming with RxJS 5"**
   - Autor: Sergi Mansilla
   - Editorial: Pragmatic Bookshelf
   - Nivel: Intermedio

3. **"RxJS for the Angular Developer"**
   - Autor: Nate Murray
   - Disponible: ng-book
   - Nivel: Intermedio

---

## Patrones y Mejores Prácticas

### Artículos

1. **RxJS Best Practices**
   - URL: https://javascript.plainenglish.io/rxjs-best-practices-in-angular-2024-2025-f443caa27c2e
   - Temas: Memory leaks, takeUntil, AsyncPipe

2. **Avoiding RxJS Memory Leaks**
   - URL: https://dev.to/devin-rosario/best-practices-for-angular-state-management-2pm1
   - Temas: Unsubscribe, takeUntil, AsyncPipe

3. **RxJS Error Handling**
   - URL: https://rxjs.dev/guide/error-handling
   - Temas: catchError, retry, onError

---

## Proyectos de Ejemplo

### GitHub

1. **RxJS Examples**
   - URL: https://github.com/ReactiveX/rxjs/tree/master/spec
   - Descripción: Tests oficiales de RxJS

2. **Angular RxJS Patterns**
   - URL: https://github.com/ngrx/platform
   - Descripción: NgRx - State management con RxJS

3. **UyuniAdmin Frontend**
   - URL: `./src/app`
   - Descripción: Uso real de RxJS en servicios (local)

---

## Comunidad

### Foros

1. **Stack Overflow**
   - Tag: `rxjs`, `observable`
   - URL: https://stackoverflow.com/questions/tagged/rxjs

2. **RxJS GitHub Discussions**
   - URL: https://github.com/ReactiveX/rxjs/discussions

3. **Discord RxJS**
   - URL: https://discord.gg/rxjs

### Blogs

1. **RxJS Blog**
   - URL: https://rxjs.dev/blog

2. **Ben Lesh (RxJS Core Team)**
   - URL: https://twitter.com/benlesh
   - Nota: Twitter/X para actualizaciones

3. **Nicholas Jamieson (RxJS Core Team)**
   - URL: https://ncjamieson.com/

---

## Conceptos Relacionados

### Para Profundizar

| Tema | Relación con RxJS |
|------|---------------------|
| Angular Signals | Alternativa moderna para estado síncrono |
| NgRx | State management basado en RxJS |
| WebSockets | Observable para tiempo real |
| Server-Sent Events | Observable para push del servidor |

---

## Comparación con Alternativas

### RxJS vs Signals

| Característica | RxJS | Signals |
|----------------|------|---------|
| Tipo | Asíncrono | Síncrono |
| Valores | Múltiples | Único valor actual |
| Operadores | 100+ | Ninguno |
| Curva de aprendizaje | Alta | Baja |
| Uso ideal | HTTP, eventos, streams | Estado local |

---

## Próximos Pasos

### Día 11: RxJS Operadores

- Operadores de creación
- Operadores de transformación
- Operadores de filtrado
- Operadores de combinación

### Recursos Recomendados

1. **RxMarbles**
   - URL: https://rxmarbles.com/
   - Descripción: Visualización de operadores

2. **Learn RxJS**
   - URL: https://www.learnrxjs.io/
   - Descripción: Guía completa de operadores

---

*Recursos del Día 10 - RxJS Fundamentos*
*Curso Angular 21 - UyuniAdmin Frontend*
