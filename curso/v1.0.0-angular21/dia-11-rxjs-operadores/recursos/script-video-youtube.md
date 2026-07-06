# Día 11: Guion de Video YouTube - RxJS Operadores

## Información del Video

- **Título:** "RxJS Operadores: switchMap, mergeMap, forkJoin y más"
- **Duración:** 18-22 minutos
- **Formato:** Tutorial con demo en vivo
- **Thumbnail:** Diagrama de operadores con código

---

## Estructura del Video

### 0:00 - 1:30 | Intro y Hook

**[Escena: Presentador en cámara, fondo con diagrama de operadores]**

**Presentador:** "¿Sabías que hay 4 operadores de transformación en RxJS y la mayoría de developers solo usan uno?"

**[Efecto: Pregunta en pantalla]**

**Presentador:** "Hoy vas a aprender los 4: switchMap, mergeMap, concatMap y exhaustMap. Y más importante: cuándo usar cada uno."

**[Efecto: Logo de RxJS con los 4 operadores]**

**Presentador:** "También veremos operadores de filtrado, combinación y manejo de errores. ¡Vamos a convertirte en un experto en RxJS!"

---

### 1:30 - 3:30 | Operadores de Creación

**[Escena: IDE abierto con código]**

**Presentador:** "Empecemos rápido con los operadores de creación."

**[Escribiendo código]**

```typescript
import { of, from, fromEvent, interval } from 'rxjs';

// of: valores estáticos
of(1, 2, 3).subscribe(console.log); // 1, 2, 3

// from: arrays o promises
from([1, 2, 3]).subscribe(console.log); // 1, 2, 3

// fromEvent: eventos DOM
fromEvent(button, 'click').subscribe(() => console.log('Click!'));
```

**Presentador:** "La diferencia clave: `of([1,2,3])` emite el array completo. `from([1,2,3])` emite cada elemento."

**[Diagrama animado]**

```
of([1,2,3])  → [1,2,3] (un valor)
from([1,2,3]) → 1, 2, 3 (tres valores)
```

**Presentador:** "Y `interval` para emisiones periódicas:"

```typescript
interval(1000).pipe(take(3)).subscribe(console.log);
// 0, 1, 2, Complete
```

---

### 3:30 - 8:00 | Operadores de Transformación

**[Escena: Presentador con diagrama]**

**Presentador:** "Ahora el meollo del video: los operadores de transformación."

**[Diagrama: Los 4 operadores]**

**Presentador:** "Empecemos con `switchMap`. Este es el más importante para Angular."

**[Escribiendo código]**

```typescript
// Búsqueda con switchMap
fromEvent<InputEvent>(searchInput, 'input').pipe(
  map(e => (e.target as HTMLInputElement).value),
  switchMap(term => this.http.get(`/api/search?q=${term}`))
).subscribe(results => this.results = results);
```

**[Animación: Diagrama de switchMap]**

```
Input:    a----b----c----
           \    \    \
HTTP:      --a-- --b-- --c--
                ↑    ↑
           cancela cancela
           
Output:    ------b----c--
```

**Presentador:** "¿Ves? Cuando llega 'b', cancela la petición de 'a'. Cuando llega 'c', cancela 'b'. Solo la última importa."

**Presentador:** "Úsalo para: búsquedas, navegación, cualquier operación que pueda quedar obsoleta."

---

**[Escena: Cambio a mergeMap]**

**Presentador:** "Ahora `mergeMap`. Este ejecuta todo en paralelo."

```typescript
// Cargar múltiples usuarios en paralelo
of(1, 2, 3).pipe(
  mergeMap(id => this.http.get(`/api/users/${id}`))
).subscribe(user => console.log(user));
```

**[Animación: Diagrama de mergeMap]**

```
Input:    ---1---2---3---
           \   \   \
HTTP:      --1--2--3-- (paralelo)
           
Output:    ---u1--u2--u3--- (orden variable)
```

**Presentador:** "El orden de llegada NO está garantizado. El usuario 2 puede llegar antes que el 1."

**Presentador:** "Úsalo para: operaciones paralelas independientes."

---

**[Escena: Cambio a concatMap]**

**Presentador:** "`concatMap` es el opuesto: ejecuta uno a uno, en orden."

```typescript
// Guardar usuarios secuencialmente
of(user1, user2, user3).pipe(
  concatMap(user => this.http.post('/api/users', user))
).subscribe(response => console.log(response));
```

**[Animación: Diagrama de concatMap]**

```
Input:    ---u1---u2---u3---
           \    \    \
HTTP:      --1--| --2--| --3--|
               
Output:    ------r1----r2----r3--|
```

**Presentador:** "Siempre en orden. Si el orden importa, usa concatMap."

---

**[Escena: Cambio a exhaustMap]**

**Presentador:** "Finalmente, `exhaustMap`. Este ignora nuevos valores mientras hay uno activo."

```typescript
// Prevenir múltiples submits
fromEvent(submitButton, 'click').pipe(
  exhaustMap(() => this.http.post('/api/save', formData))
).subscribe(response => console.log('Guardado'));
```

**[Animación: Diagrama de exhaustMap]**

```
Clicks:    a--b--c----d--
            \  ↓  ↓    
HTTP:       --a-------d--
               ↑
           ignorados
```

**Presentador:** "Perfecto para formularios. El usuario hace click, click, click... pero solo el primero se procesa."

---

### 8:00 - 11:00 | Operadores de Filtrado

**[Escena: IDE con código]**

**Presentador:** "Ahora los operadores de filtrado. Estos controlan qué valores pasan."

**Presentador:** "`filter` es simple:"

```typescript
of(1, 2, 3, 4, 5).pipe(
  filter(x => x % 2 === 0)
).subscribe(console.log); // 2, 4
```

**Presentador:** "`take` limita emisiones:"

```typescript
interval(1000).pipe(take(3)).subscribe(console.log);
// 0, 1, 2, Complete
```

**Presentador:** "Pero el más importante es `takeUntil`. Este evita memory leaks."

**[Escribiendo código completo]**

```typescript
@Component({...})
export class MyComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.http.get('/api/data').pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => this.data = data);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

**Presentador:** "Sin takeUntil, la suscripción sigue viva después de que el componente se destruye. Eso es un memory leak."

---

**[Escena: debounceTime y throttleTime]**

**Presentador:** "Dos operadores importantes para UX: `debounceTime` y `throttleTime`."

```typescript
// debounceTime: espera inactividad
fromEvent(input, 'input').pipe(
  debounceTime(300) // Espera 300ms sin typing
).subscribe(term => console.log('Buscar:', term));

// throttleTime: limita frecuencia
fromEvent(window, 'scroll').pipe(
  throttleTime(200) // Máximo una vez cada 200ms
).subscribe(() => console.log('Scroll'));
```

**[Diagrama comparativo]**

```
debounceTime:  Espera silencio → emite último
throttleTime:  Emite inmediato → ignora por X ms
```

---

### 11:00 - 14:00 | Operadores de Combinación

**[Escena: IDE con código]**

**Presentador:** "Operadores de combinación: cuando necesitas múltiples fuentes."

**Presentador:** "`forkJoin` es el rey del HTTP paralelo:"

```typescript
forkJoin({
  users: this.http.get<User[]>('/api/users'),
  orders: this.http.get<Order[]>('/api/orders'),
  stats: this.http.get<Stats>('/api/stats')
}).subscribe(({ users, orders, stats }) => {
  this.users = users;
  this.orders = orders;
  this.stats = stats;
});
```

**Presentador:** "Espera a que TODOS completen y emite una vez. Perfecto para cargar datos iniciales."

---

**[Escena: combineLatest]**

**Presentador:** "`combineLatest` es diferente:"

```typescript
combineLatest([
  this.user$,
  this.orders$
]).subscribe(([user, orders]) => {
  console.log(user.name, orders.length);
});
```

**[Diagrama]**

```
combineLatest:
Observable 1: --a----b----c----|
Observable 2: ----x----y----z--|
              ↓
Output:       --[a,x]-[b,x]-[b,y]-[c,y]-[c,z]|

forkJoin:
Observable 1: --a----b----c----|
Observable 2: ----x----y----z--|
              ↓
Output:       ------------------[c,z]|
```

**Presentador:** "combineLatest emite cada vez que cualquiera cambia. forkJoin solo emite al final."

---

### 14:00 - 16:00 | Manejo de Errores

**[Escena: Presentador con advertencia]**

**Presentador:** "Manejo de errores. Esto es crítico."

**Presentador:** "`catchError` captura errores, pero hay una regla:"

**[Efecto: Regla en pantalla]**

**Presentador:** "catchError DEBE retornar un Observable."

```typescript
// ❌ MAL
this.http.get('/api/data').pipe(
  catchError(error => {
    console.error(error);
    // No retorna nada!
  })
);

// ✅ BIEN
this.http.get('/api/data').pipe(
  catchError(error => {
    console.error(error);
    return of([]); // Retorna Observable
  })
);
```

**Presentador:** "Usa `of([])` para valores por defecto, o `EMPTY` para no emitir nada."

**Presentador:** "Y `retry` para reintentos automáticos:"

```typescript
this.http.get('/api/data').pipe(
  retry(3) // Reintenta 3 veces
);
```

---

### 16:00 - 18:00 | Errores Comunes

**[Escena: Presentador con lista de errores]**

**Presentador:** "Tres errores que debes evitar:"

**[Error 1: Suscripciones Anidadas]**

```typescript
// ❌ MAL
this.http.get('/user/1').subscribe(user => {
  this.http.get(`/orders/${user.id}`).subscribe(orders => {
    // Callback hell
  });
});

// ✅ BIEN
this.http.get('/user/1').pipe(
  switchMap(user => this.http.get(`/orders/${user.id}`))
).subscribe(orders => ...);
```

**[Error 2: Sin takeUntil]**

```typescript
// ❌ MAL
ngOnInit(): void {
  this.http.get('/api/data').subscribe(data => this.data = data);
}

// ✅ BIEN
ngOnInit(): void {
  this.http.get('/api/data').pipe(
    takeUntil(this.destroy$)
  ).subscribe(data => this.data = data);
}
```

**[Error 3: Operador Incorrecto]**

```typescript
// ❌ MAL: mergeMap para búsqueda
fromEvent(input, 'input').pipe(
  mergeMap(term => this.http.get(`/search?q=${term}`))
);

// ✅ BIEN: switchMap para búsqueda
fromEvent(input, 'input').pipe(
  switchMap(term => this.http.get(`/search?q=${term}`))
);
```

---

### 18:00 - 20:00 | Demo Práctica

**[Escena: Demo en vivo]**

**Presentador:** "Vamos a juntar todo en una búsqueda real:"

```typescript
searchProducts(): void {
  fromEvent<InputEvent>(this.searchInput.nativeElement, 'input').pipe(
    // 1. Obtener valor
    map(e => (e.target as HTMLInputElement).value),
    
    // 2. Filtrar vacíos
    filter(term => term.trim().length >= 2),
    
    // 3. Debounce
    debounceTime(300),
    
    // 4. Evitar duplicados
    distinctUntilChanged(),
    
    // 5. Mostrar loading
    tap(() => this.loading.set(true)),
    
    // 6. Cancelar anteriores
    switchMap(term => 
      this.http.get<Product[]>(`/api/products?q=${term}`).pipe(
        // 7. Manejar errores
        catchError(() => of([])),
        // 8. Ocultar loading
        finalize(() => this.loading.set(false))
      )
    )
  ).subscribe(products => this.products.set(products));
}
```

**[Ejecutando demo]**

**Presentador:** "¡Y así se ve en acción! Debounce, filtrado, cancelación, manejo de errores... todo en un solo pipeline."

---

### 20:00 - 22:00 | Cierre

**[Escena: Presentador en cámara]**

**Presentador:** "Hoy aprendiste:"

**[Resumen en pantalla]**

- Operadores de creación: of, from, fromEvent, interval
- Operadores de transformación: switchMap, mergeMap, concatMap, exhaustMap
- Operadores de filtrado: filter, take, takeUntil, debounceTime
- Operadores de combinación: forkJoin, combineLatest
- Manejo de errores: catchError, retry

**Presentador:** "La clave es saber CUÁNDO usar cada uno."

**[Diagrama de decisión]**

```
¿Cancelar anteriores? → switchMap
¿Ejecutar en paralelo? → mergeMap
¿Orden importante? → concatMap
¿Ignorar mientras activo? → exhaustMap
```

**Presentador:** "En el próximo video, integraremos RxJS con Angular Signals."

**[Efecto: Call to action]**

**Presentador:** "Si te gustó, dale like y suscríbete. Los ejercicios están en la descripción."

**Presentador:** "¡Nos vemos en el próximo video!"

**[Efecto: Logo del curso y links]**

---

## Notas de Producción

### Visual
- Usar tema oscuro en el IDE
- Resaltar código con colores
- Animaciones para diagramas de operadores
- Zoom en código importante

### Audio
- Micrófono de calidad
- Sin ruido de fondo
- Música de fondo suave (royalty-free)

### Edición
- Cortar pausas largas
- Agregar transiciones suaves
- Resaltar errores con efecto rojo
- Resaltar soluciones con efecto verde

### SEO
- Título: "RxJS Operadores: Guía Completa con Ejemplos"
- Tags: Angular, RxJS, switchMap, mergeMap, forkJoin, Tutorial
- Descripción: Aprende todos los operadores de RxJS: switchMap, mergeMap, concatMap, exhaustMap, forkJoin, combineLatest y más.

### Thumbnail
- Diagrama de los 4 operadores de transformación
- Texto: "RxJS Operadores"
- Subtítulo: "Guía Completa"
- Colores: Rosa de RxJS + Azul Angular

---

## Links para Descripción

1. [Contenido del Día 11](../contenido.md)
2. [Ejercicios Prácticos](../ejercicios/lab-01.md)
3. [Cheatsheet de Operadores](../cheatsheet.md)
4. [RxMarbles](https://rxmarbles.com/)
5. [RxJS Documentation](https://rxjs.dev/)

---

*Guion de Video YouTube - Día 11*
*Curso Angular 21 - UyuniAdmin Frontend*
