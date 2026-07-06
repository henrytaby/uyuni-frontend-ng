# Assessment - Día 3: Lazy Loading y Rutas

## Instrucciones

- **Total de preguntas**: 50
- **Tiempo estimado**: 30 minutos
- **Puntuación mínima**: 70% (35 respuestas correctas)

---

## Sección 1: Routing Básico (10 preguntas)

### Pregunta 1

**¿Qué servicio se usa para navegar imperativamente en Angular?**

A) ActivatedRoute  
B) Router  
C) NavigationService  
D) Location  

<details>
<summary>Respuesta</summary>

**B) Router**

El servicio Router proporciona métodos como `navigate()` y `navigateByUrl()` para navegación imperativa.
</details>

---

### Pregunta 2

**¿Qué directiva se usa como placeholder para el componente de la ruta actual?**

A) routerLink  
B) routerOutlet  
C) router-outlet  
D) routeView  

<details>
<summary>Respuesta</summary>

**C) router-outlet**

`<router-outlet>` es el elemento donde Angular renderiza el componente de la ruta activa.
</details>

---

### Pregunta 3

**¿Cómo se define un parámetro de ruta?**

A) `{ path: 'user', params: ['id'] }`  
B) `{ path: 'user/:id', component: UserComponent }`  
C) `{ path: 'user', param: 'id' }`  
D) `{ path: 'user', queryParams: { id: true } }`  

<details>
<summary>Respuesta</summary>

**B) `{ path: 'user/:id', component: UserComponent }`**

Los parámetros de ruta se definen con dos puntos `:paramName` en el path.
</details>

---

### Pregunta 4

**¿Qué servicio proporciona información sobre la ruta actual?**

A) Router  
B) ActivatedRoute  
C) RouteConfig  
D) Navigation  

<details>
<summary>Respuesta</summary>

**B) ActivatedRoute**

ActivatedRoute proporciona información sobre la ruta actual, incluyendo parámetros, query params, y data.
</details>

---

### Pregunta 5

**¿Cómo se accede a un query parameter?**

A) `this.route.params`  
B) `this.route.queryParamMap`  
C) `this.route.queryParams`  
D) `this.route.snapshot.queryParams`  

<details>
<summary>Respuesta</summary>

**B) `this.route.queryParamMap`** o **D) `this.route.snapshot.queryParams`**

Ambas son válidas. `queryParamMap` es un Observable, `snapshot.queryParams` es síncrono.
</details>

---

### Pregunta 6

**¿Qué directiva agrega una clase CSS cuando el link está activo?**

A) routerLinkActive  
B) routerActive  
C) activeLink  
D) linkActive  

<details>
<summary>Respuesta</summary>

**A) routerLinkActive**

`routerLinkActive="active"` agrega la clase "active" cuando la ruta del link está activa.
</details>

---

### Pregunta 7

**¿Cómo se navega programáticamente a una ruta con parámetros?**

A) `this.router.navigate('/user', id)`  
B) `this.router.navigate(['/user', id])`  
C) `this.router.go('/user/' + id)`  
D) `this.router.link('/user', id)`  

<details>
<summary>Respuesta</summary>

**B) `this.router.navigate(['/user', id])`**

`navigate()` recibe un array con los segmentos de la ruta.
</details>

---

### Pregunta 8

**¿Qué propiedad de ActivatedRoute contiene los datos del resolver?**

A) `params`  
B) `data`  
C) `resolve`  
D) `snapshot`  

<details>
<summary>Respuesta</summary>

**B) `data`**

Los datos resueltos por resolvers están disponibles en `route.data` (Observable) o `route.snapshot.data` (síncrono).
</details>

---

### Pregunta 9

**¿Cómo se define una ruta wildcard?**

A) `{ path: 'any', component: NotFoundComponent }`  
B) `{ path: '*', component: NotFoundComponent }`  
C) `{ path: '**', component: NotFoundComponent }`  
D) `{ path: 'default', component: NotFoundComponent }`  

<details>
<summary>Respuesta</summary>

**C) `{ path: '**', component: NotFoundComponent }`**

`**` es el patrón wildcard que coincide con cualquier ruta no definida.
</details>

---

### Pregunta 10

**¿Qué método del Router permite navegar con query parameters?**

A) `navigate()` con queryParams option  
B) `navigateWithParams()`  
C) `setQueryParams()`  
D) `navigateByUrl()`  

<details>
<summary>Respuesta</summary>

**A) `navigate()` con queryParams option**

```typescript
this.router.navigate(['/search'], { queryParams: { q: 'angular' } });
```
</details>

---

## Sección 2: Lazy Loading (15 preguntas)

### Pregunta 11

**¿Qué es Lazy Loading?**

A) Cargar todo el código al inicio  
B) Cargar código solo cuando se necesita  
C) Cargar código en segundo plano  
D) Cachear código en el navegador  

<details>
<summary>Respuesta</summary>

**B) Cargar código solo cuando se necesita**

Lazy Loading retrasa la carga de código hasta que el usuario navega a esa ruta.
</details>

---

### Pregunta 12

**¿Qué función se usa para cargar un módulo lazy?**

A) `lazyLoad()`  
B) `loadModule()`  
C) `loadChildren()`  
D) `importModule()`  

<details>
<summary>Respuesta</summary>

**C) `loadChildren()`**

`loadChildren` se usa para cargar módulos lazy, mientras que `loadComponent` carga componentes individuales.
</details>

---

### Pregunta 13

**¿Cuál es la sintaxis correcta para lazy loading de un módulo?**

A) `loadChildren: './dashboard.module#DashboardModule'`  
B) `loadChildren: () => import('./dashboard.routes').then(m => m.routes)`  
C) `loadModule: () => import('./dashboard.module')`  
D) `lazy: () => import('./dashboard.module')`  

<details>
<summary>Respuesta</summary>

**B) `loadChildren: () => import('./dashboard.routes').then(m => m.routes)`**

La sintaxis moderna usa `import()` dinámico con promesas.
</details>

---

### Pregunta 14

**¿Cuál es el beneficio principal de Lazy Loading?**

A) Código más fácil de escribir  
B) Reduce el bundle inicial  
C) Mejora el SEO  
D) Facilita el testing  

<details>
<summary>Respuesta</summary>

**B) Reduce el bundle inicial**

Lazy Loading divide el código en chunks, reduciendo el tamaño del bundle inicial.
</details>

---

### Pregunta 15

**¿Qué es un chunk en el contexto de Lazy Loading?**

A) Un archivo de configuración  
B) Un archivo JavaScript generado por code splitting  
C) Un componente Angular  
D) Un servicio HTTP  

<details>
<summary>Respuesta</summary>

**B) Un archivo JavaScript generado por code splitting**

Los chunks son archivos JavaScript separados que se cargan bajo demanda.
</details>

---

### Pregunta 16

**¿Qué estrategia de preloading carga todos los módulos lazy en segundo plano?**

A) NoPreloading  
B) PreloadAllModules  
C) PreloadAll  
D) LazyPreloading  

<details>
<summary>Respuesta</summary>

**B) PreloadAllModules**

Esta estrategia precarga todos los módulos lazy después de que la aplicación inicia.
</details>

---

### Pregunta 17

**¿Cuándo se usa `loadComponent` en lugar de `loadChildren`?**

A) Para cargar módulos  
B) Para cargar componentes individuales  
C) Para cargar servicios  
D) Para cargar guards  

<details>
<summary>Respuesta</summary>

**B) Para cargar componentes individuales**

`loadComponent` se usa para cargar un solo componente, `loadChildren` para módulos con múltiples rutas.
</details>

---

### Pregunta 18

**¿Qué herramienta se usa para verificar los chunks generados?**

A) Angular CLI  
B) Chrome DevTools Network tab  
C) npm audit  
D) Jest  

<details>
<summary>Respuesta</summary>

**B) Chrome DevTools Network tab**

En la pestaña Network se pueden ver los chunks cargados al navegar.
</details>

---

### Pregunta 19

**¿Qué pasa si un usuario navega directamente a una ruta lazy loaded?**

A) La aplicación falla  
B) Angular carga el chunk necesario y navega  
C) El usuario ve un error 404  
D) La aplicación recarga la página  

<details>
<summary>Respuesta</summary>

**B) Angular carga el chunk necesario y navega**

Angular carga el chunk correspondiente y luego navega a la ruta.
</details>

---

### Pregunta 20

**¿Cómo se configura una estrategia de preloading personalizada?**

A) Implementando `PreloadingStrategy`  
B) Extendiendo `BasePreloading`  
C) Usando `@Preload()` decorator  
D) Configurando en `angular.json`  

<details>
<summary>Respuesta</summary>

**A) Implementando `PreloadingStrategy`**

Se crea una clase que implementa la interface `PreloadingStrategy`.
</details>

---

### Pregunta 21

**¿Qué es code splitting?**

A) Dividir el código en múltiples archivos  
B) Dividir el código en componentes  
C) Dividir el código en módulos  
D) Dividir el código en servicios  

<details>
<summary>Respuesta</summary>

**A) Dividir el código en múltiples archivos**

Code splitting es la técnica de dividir el bundle en múltiples archivos que se cargan bajo demanda.
</details>

---

### Pregunta 22

**¿Qué impacto tiene Lazy Loading en el tiempo de carga inicial?**

A) Lo aumenta  
B) Lo reduce  
C) No tiene impacto  
D) Depende del navegador  

<details>
<summary>Respuesta</summary>

**B) Lo reduce**

Al cargar menos código inicialmente, el tiempo de carga se reduce significativamente.
</details>

---

### Pregunta 23

**¿Se puede usar Lazy Loading con componentes standalone?**

A) No, solo con NgModules  
B) Sí, con `loadComponent`  
C) Solo con rutas anidadas  
D) Solo en producción  

<details>
<summary>Respuesta</summary>

**B) Sí, con `loadComponent`**

Los componentes standalone se pueden cargar lazy con `loadComponent`.
</details>

---

### Pregunta 24

**¿Qué archivo se genera para una feature lazy loaded?**

A) `feature.module.js`  
B) Un chunk con hash único  
C) `feature.component.js`  
D) `lazy.js`  

<details>
<summary>Respuesta</summary>

**B) Un chunk con hash único**

El bundler genera archivos como `dashboard.component.html` con un hash único.
</details>

---

### Pregunta 25

**¿Por qué es importante el orden de las rutas con wildcard?**

A) No es importante  
B) La wildcard debe ir al final  
C) La wildcard debe ir al inicio  
D) Solo importa en producción  

<details>
<summary>Respuesta</summary>

**B) La wildcard debe ir al final**

Si la wildcard va primero, captura todas las rutas y las demás nunca se evalúan.
</details>

---

## Sección 3: Route Guards (15 preguntas)

### Pregunta 26

**¿Qué es un Route Guard?**

A) Un componente de seguridad  
B) Una función que controla la navegación  
C) Un servicio HTTP  
D) Un interceptor  

<details>
<summary>Respuesta</summary>

**B) Una función que controla la navegación**

Los guards deciden si un usuario puede acceder a una ruta o no.
</details>

---

### Pregunta 27

**¿Qué tipo de guard verifica si se puede activar una ruta?**

A) CanDeactivate  
B) CanActivate  
C) CanLoad  
D) CanMatch  

<details>
<summary>Respuesta</summary>

**B) CanActivate**

`CanActivate` determina si una ruta puede ser activada.
</details>

---

### Pregunta 28

**¿Qué tipo de guard previene salir de una ruta?**

A) CanActivate  
B) CanDeactivate  
C) CanLoad  
D) CanLeave  

<details>
<summary>Respuesta</summary>

**B) CanDeactivate**

`CanDeactivate` determina si el usuario puede salir de una ruta.
</details>

---

### Pregunta 29

**¿Qué retorna un guard para permitir la navegación?**

A) `true`  
B) `false`  
C) `null`  
D) `undefined`  

<details>
<summary>Respuesta</summary>

**A) `true`**

Retornar `true` permite la navegación.
</details>

---

### Pregunta 30

**¿Qué retorna un guard para redirigir?**

A) Un string con la URL  
B) Un UrlTree  
C) Un RouteConfig  
D) Un Navigation  

<details>
<summary>Respuesta</summary>

**B) Un UrlTree**

`router.parseUrl('/login')` retorna un UrlTree que causa redirección.
</details>

---

### Pregunta 31

**¿Qué versión de Angular introdujo los functional guards?**

A) Angular 12  
B) Angular 14  
C) Angular 16  
D) Angular 18  

<details>
<summary>Respuesta</summary>

**B) Angular 14**

Angular 14 introdujo guards funcionales como alternativa a los guards basados en clases.
</details>

---

### Pregunta 32

**¿Qué tipo de guard se usa para lazy loading?**

A) CanActivate  
B) CanLoad  
C) CanDeactivate  
D) CanActivateChild  

<details>
<summary>Respuesta</summary>

**B) CanLoad**

`CanLoad` determina si un módulo lazy puede ser cargado.
</details>

---

### Pregunta 33

**¿Cómo se inyecta un servicio en un functional guard?**

A) En el constructor  
B) Con `inject()`  
C) Con `@Injectable()`  
D) No se puede  

<details>
<summary>Respuesta</summary>

**B) Con `inject()`**

Los functional guards usan `inject()` para obtener dependencias.
</details>

---

### Pregunta 34

**¿Qué pasa si un guard retorna un Observable?**

A) El guard falla  
B) Angular se suscribe y espera el valor  
C) Se ignora  
D) Se convierte a Promise  

<details>
<summary>Respuesta</summary>

**B) Angular se suscribe y espera el valor**

Angular maneja Observables automáticamente en guards.
</details>

---

### Pregunta 35

**¿Se pueden usar múltiples guards en una ruta?**

A) No, solo uno  
B) Sí, en un array  
C) Solo en rutas anidadas  
D) Solo con CanActivate  

<details>
<summary>Respuesta</summary>

**B) Sí, en un array**

```typescript
canActivate: [authGuard, adminGuard]
```
</details>

---

### Pregunta 36

**¿En qué orden se ejecutan múltiples guards?**

A) En paralelo  
B) En el orden del array  
C) Aleatorio  
D) En reverso  

<details>
<summary>Respuesta</summary>

**B) En el orden del array**

Los guards se ejecutan secuencialmente en el orden declarado.
</details>

---

### Pregunta 37

**¿Qué tipo de guard verifica acceso a rutas hijas?**

A) CanActivate  
B) CanActivateChild  
C) CanDeactivate  
D) CanLoad  

<details>
<summary>Respuesta</summary>

**B) CanActivateChild**

`CanActivateChild` se ejecuta para cada ruta hija.
</details>

---

### Pregunta 38

**¿Qué es CanMatch?**

A) Un guard que verifica si la ruta coincide  
B) Un guard de autenticación  
C) Un guard de lazy loading  
D) Un guard de permisos  

<details>
<summary>Respuesta</summary>

**A) Un guard que verifica si la ruta coincide**

`CanMatch` determina si una ruta coincide con la URL solicitada.
</details>

---

### Pregunta 39

**¿Qué pasa si un guard retorna `false`?**

A) La navegación continúa  
B) La navegación se cancela  
C) Se redirige a home  
D) Se muestra un error  

<details>
<summary>Respuesta</summary>

**B) La navegación se cancela**

El usuario permanece en la ruta actual.
</details>

---

### Pregunta 40

**¿Cómo se define un functional guard?**

A) Como una clase  
B) Como una función  
C) Como un servicio  
D) Como un componente  

<details>
<summary>Respuesta</summary>

**B) Como una función**

```typescript
export const myGuard: CanActivateFn = (route, state) => { ... };
```
</details>

---

## Sección 4: Resolvers (10 preguntas)

### Pregunta 41

**¿Qué es un Resolver?**

A) Un guard de autenticación  
B) Una función que precarga datos antes de navegar  
C) Un servicio HTTP  
D) Un interceptor  

<details>
<summary>Respuesta</summary>

**B) Una función que precarga datos antes de navegar**

Los resolvers cargan datos antes de que el componente se active.
</details>

---

### Pregunta 42

**¿Qué tipo de función es un functional resolver?**

A) `CanActivateFn`  
B) `ResolveFn<T>`  
C) `ResolverFn<T>`  
D) `DataFn<T>`  

<details>
<summary>Respuesta</summary>

**B) `ResolveFn<T>`**

Los resolvers funcionales usan el tipo `ResolveFn<T>`.
</details>

---

### Pregunta 43

**¿Dónde se accede a los datos resueltos?**

A) En `route.params`  
B) En `route.data`  
C) En `route.resolve`  
D) En `route.snapshot`  

<details>
<summary>Respuesta</summary>

**B) En `route.data`**

Los datos resueltos están en `route.data` (Observable) o `route.snapshot.data` (síncrono).
</details>

---

### Pregunta 44

**¿Qué pasa si un resolver falla?**

A) La navegación continúa con datos null  
B) La navegación se cancela  
C) Se muestra un error  
D) Depende de cómo se maneje el error  

<details>
<summary>Respuesta</summary>

**D) Depende de cómo se maneje el error**

Si se usa `catchError` y retorna `of(null)`, la navegación continúa con null.
</details>

---

### Pregunta 45

**¿Se pueden usar múltiples resolvers en una ruta?**

A) No, solo uno  
B) Sí, en un objeto  
C) Solo en rutas anidadas  
D) Solo con lazy loading  

<details>
<summary>Respuesta</summary>

**B) Sí, en un objeto**

```typescript
resolve: {
  user: userResolver,
  posts: postsResolver
}
```
</details>

---

### Pregunta 46

**¿Cuándo se ejecuta un resolver?**

A) Después de activar el componente  
B) Antes de activar el componente  
C) Solo en lazy loading  
D) Solo en rutas protegidas  

<details>
<summary>Respuesta</summary>

**B) Antes de activar el componente**

El resolver se ejecuta antes de que el componente se active.
</details>

---

### Pregunta 47

**¿Qué retorna un resolver?**

A) Solo boolean  
B) Un Observable, Promise, o valor síncrono  
C) Solo Observable  
D) Solo Promise  

<details>
<summary>Respuesta</summary>

**B) Un Observable, Promise, o valor síncrono**

Los resolvers pueden retornar cualquier tipo de dato asíncrono o síncrono.
</details>

---

### Pregunta 48

**¿Cómo se define un resolver en la configuración de rutas?**

A) `resolver: { user: userResolver }`  
B) `resolve: { user: userResolver }`  
C) `resolvers: [userResolver]`  
D) `data: { user: userResolver }`  

<details>
<summary>Respuesta</summary>

**B) `resolve: { user: userResolver }`**

La propiedad `resolve` define los resolvers para una ruta.
</details>

---

### Pregunta 49

**¿Qué ventaja tiene usar un resolver?**

A) Reduce el bundle size  
B) Evita mostrar componentes vacíos  
C) Mejora el SEO  
D) Facilita el testing  

<details>
<summary>Respuesta</summary>

**B) Evita mostrar componentes vacíos**

Los datos están disponibles cuando el componente se activa.
</details>

---

### Pregunta 50

**¿Cómo se accede a los parámetros de ruta en un resolver?**

A) `route.params`  
B) `route.paramMap`  
C) A través del primer parámetro `route`  
D) `this.route.snapshot`  

<details>
<summary>Respuesta</summary>

**C) A través del primer parámetro `route`**

```typescript
export const userResolver: ResolveFn<User> = (route, state) => {
  const id = route.paramMap.get('id');
  // ...
};
```
</details>

---

## Respuestas Rápidas

| Pregunta | Respuesta | Pregunta | Respuesta |
|----------|-----------|----------|-----------|
| 1 | B | 26 | B |
| 2 | C | 27 | B |
| 3 | B | 28 | B |
| 4 | B | 29 | A |
| 5 | B/D | 30 | B |
| 6 | A | 31 | B |
| 7 | B | 32 | B |
| 8 | B | 33 | B |
| 9 | C | 34 | B |
| 10 | A | 35 | B |
| 11 | B | 36 | B |
| 12 | C | 37 | B |
| 13 | B | 38 | A |
| 14 | B | 39 | B |
| 15 | B | 40 | B |
| 16 | B | 41 | B |
| 17 | B | 42 | B |
| 18 | B | 43 | B |
| 19 | B | 44 | D |
| 20 | A | 45 | B |
| 21 | A | 46 | B |
| 22 | B | 47 | B |
| 23 | B | 48 | B |
| 24 | B | 49 | B |
| 25 | B | 50 | C |

---

## Evaluación

| Puntuación | Nivel |
|------------|-------|
| 45-50 | Excelente |
| 35-44 | Bueno |
| 25-34 | Aceptable |
| < 25 | Necesita repasar |

---

*Assessment - Día 3: Lazy Loading y Rutas*
*Curso: Angular 21 Enterprise*
*Día: 3 de 18*
