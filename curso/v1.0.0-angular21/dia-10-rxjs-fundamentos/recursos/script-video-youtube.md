# Día 10: Guion de Video YouTube - RxJS Fundamentos

## Información del Video

- **Título:** "RxJS en Angular 21: De Principiante a Experto"
- **Duración:** 15-20 minutos
- **Formato:** Tutorial con demo en vivo
- **Thumbnail:** Logo de RxJS con código Angular

---

## Estructura del Video

### 0:00 - 1:00 | Intro y Hook

**[Escena: Presentador en cámara, fondo con logo de RxJS]**

**Presentador:** "¿Alguna vez has visto código asíncrono que parece una escalera hacia el infierno?"

**[Efecto: Código con indentación profunda apareciendo]**

```typescript
getUser(userId, (user) => {
  getOrders(user.id, (orders) => {
    getOrderDetails(orders[0].id, (details) => {
      // ¡Ayuda! Estoy en el callback hell
    });
  });
});
```

**Presentador:** "Esto es el Callback Hell. Y RxJS es tu salida."

**[Efecto: Logo de RxJS con luz brillante]**

**Presentador:** "Hoy aprenderás RxJS desde cero. ¡Vamos allá!"

---

### 1:00 - 3:00 | ¿Qué es RxJS?

**[Escena: Presentador con gráficos animados]**

**Presentador:** "RxJS significa Reactive Extensions for JavaScript. Es una biblioteca para programación reactiva."

**[Animación: Río de datos fluyendo]**

**Presentador:** "Imagina un río. El agua fluye desde la fuente, pasa por filtros, y llega al destino. En RxJS, los datos son como el agua."

**Presentador:** "El concepto clave es el Observable. Un Observable es un stream que puede emitir múltiples valores a lo largo del tiempo."

**[Gráfico: Observable emitiendo valores]**

```
Observable: ---1---2---3---4---5---|
             ↓   ↓   ↓   ↓   ↓
Observer:   recibe cada valor
```

---

### 3:00 - 5:00 | Observable vs Promise

**[Escena: Comparación lado a lado]**

**Presentador:** "¿Por qué no usar solo Promises?"

**[Tabla comparativa]**

| Promise | Observable |
|---------|------------|
| 1 valor | Múltiples valores |
| No cancelable | Cancelable |
| Ejecución inmediata | Lazy |
| .then() | 100+ operadores |

**Presentador:** "Una Promise solo puede resolver un valor. Un Observable puede emitir infinitos valores."

**Presentador:** "Una Promise no se puede cancelar. Un Observable sí, con unsubscribe."

**Presentador:** "Y lo más importante: RxJS tiene operadores poderosos para transformar streams."

---

### 5:00 - 8:00 | Crear un Observable

**[Escena: IDE abierto]**

**Presentador:** "Vamos a crear nuestro primer Observable."

**[Escribiendo código]**

```typescript
import { Observable } from 'rxjs';

const observable = new Observable<string>(subscriber => {
  subscriber.next('Hola');
  subscriber.next('Mundo');
  subscriber.complete();
});
```

**Presentador:** "El subscriber tiene tres métodos: next para emitir valores, error para errores, y complete para finalizar."

**Presentador:** "Ahora nos suscribimos:"

```typescript
observable.subscribe({
  next: value => console.log('Valor:', value),
  error: err => console.error('Error:', err),
  complete: () => console.log('¡Completado!')
});
```

**[Ejecutando código]**

**Presentador:** "¡Y vemos los valores en consola!"

---

### 8:00 - 11:00 | Subjects

**[Escena: Presentador con diagrama]**

**Presentador:** "Ahora hablemos de Subjects. Un Subject es especial: es tanto Observable como Observer."

**[Diagrama: Subject con múltiples suscriptores]**

**Presentador:** "El más usado en Angular es BehaviorSubject."

```typescript
import { BehaviorSubject } from 'rxjs';

const state = new BehaviorSubject<string>('valor inicial');

// Nuevos suscriptores reciben el valor actual
state.subscribe(value => console.log('A:', value));
// Output: A: valor inicial

state.next('nuevo valor');

state.subscribe(value => console.log('B:', value));
// Output: B: nuevo valor
```

**Presentador:** "BehaviorSubject tiene un valor inicial. Nuevos suscriptores reciben inmediatamente el valor más reciente."

**Presentador:** "Es perfecto para manejar estado en servicios."

---

### 11:00 - 14:00 | Operadores Básicos

**[Escena: IDE con código]**

**Presentador:** "RxJS tiene más de 100 operadores. Veamos los básicos."

**Presentador:** "map: transforma valores."

```typescript
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

of(1, 2, 3).pipe(
  map(x => x * 10)
).subscribe(console.log);
// Output: 10, 20, 30
```

**Presentador:** "filter: filtra valores."

```typescript
import { filter } from 'rxjs/operators';

of(1, 2, 3, 4, 5).pipe(
  filter(x => x > 2)
).subscribe(console.log);
// Output: 3, 4, 5
```

**Presentador:** "tap: para debugging."

```typescript
import { tap } from 'rxjs/operators';

of(1, 2, 3).pipe(
  tap(x => console.log('Debug:', x)),
  map(x => x * 2)
).subscribe(console.log);
```

---

### 14:00 - 16:00 | Búsqueda Reactiva

**[Escena: Demo en vivo]**

**Presentador:** "Ahora un ejemplo real: búsqueda con debounce."

```typescript
fromEvent<InputEvent>(searchInput, 'input').pipe(
  debounceTime(300),           // Esperar 300ms
  map(e => e.target.value),    // Obtener valor
  filter(term => term.length >= 2), // Filtrar cortos
  distinctUntilChanged(),      // No repetir
  switchMap(term => this.http.get(`/api/search?q=${term}`))
).subscribe(results => this.results = results);
```

**Presentador:** "Esto espera 300ms después del último keystroke, filtra búsquedas cortas, evita duplicados, y cancela peticiones anteriores."

**Presentador:** "¡Así se hace una búsqueda profesional!"

---

### 16:00 - 18:00 | Errores Comunes

**[Escena: Presentador con advertencias]**

**Presentador:** "Tres errores que debes evitar:"

**[Error 1: Memory Leak]**

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

**[Error 2: Suscripciones Anidadas]**

```typescript
// ❌ MAL
this.http.get('/user/1').subscribe(user => {
  this.http.get(`/orders/${user.id}`).subscribe(orders => {
    // Anti-pattern
  });
});

// ✅ BIEN
this.http.get('/user/1').pipe(
  switchMap(user => this.http.get(`/orders/${user.id}`))
).subscribe(orders => this.orders = orders);
```

**[Error 3: Sin Manejo de Errores]**

```typescript
// ❌ MAL
this.http.get('/api/data').subscribe(data => this.data = data);

// ✅ BIEN
this.http.get('/api/data').subscribe({
  next: data => this.data = data,
  error: err => this.showError(err)
});
```

---

### 18:00 - 20:00 | Cierre

**[Escena: Presentador en cámara]**

**Presentador:** "Hoy aprendiste:"

**[Resumen en pantalla]**

- Qué es RxJS y la programación reactiva
- Diferencia entre Observable y Promise
- Cómo usar Subjects para estado
- Operadores básicos: map, filter, tap
- Búsqueda reactiva con debounce

**Presentador:** "RxJS es fundamental para Angular. Tómate tu tiempo para practicarlo."

**Presentador:** "En el próximo video, profundizamos en operadores avanzados."

**[Efecto: Call to action]**

**Presentador:** "Si te gustó, dale like y suscríbete. Los ejercicios están en la descripción."

**Presentador:** "¡Nos vemos en el próximo video!"

**[Efecto: Logo del curso y links]**

---

## Notas de Producción

### Visual
- Usar tema oscuro en el IDE
- Resaltar código con colores
- Animaciones para diagramas de streams
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
- Título: "RxJS en Angular 21: Guía Completa para Principiantes"
- Tags: Angular, RxJS, Observable, Subject, Tutorial
- Descripción: Aprende RxJS desde cero en Angular 21. Observables, Subjects, operadores y más.

### Thumbnail
- Logo de RxJS
- Texto: "RxJS en Angular 21"
- Subtítulo: "Guía para Principiantes"
- Colores: Rosa/Magenta de RxJS + Azul Angular

---

## Links para Descripción

1. [Contenido del Día 10](../contenido.md)
2. [Ejercicios Prácticos](../ejercicios/lab-01.md)
3. [Subjects y Operadores](../ejercicios/lab-02.md)
4. [RxJS Documentation](https://rxjs.dev/)
5. [RxMarbles](https://rxmarbles.com/)

---

*Guion de Video YouTube - Día 10*
*Curso Angular 21 - UyuniAdmin Frontend*
