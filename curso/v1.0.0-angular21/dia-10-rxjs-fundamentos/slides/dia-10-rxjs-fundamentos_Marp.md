# Día 10: RxJS Fundamentos - Slides

## Diapositivas de Presentación

---

## Slide 1: Portada

# 🌊 RxJS Fundamentos

## Programación Reactiva en Angular

**Día 10 - Módulo 4: RxJS y Estado Avanzado**

**Curso Angular 21 - UyuniAdmin Frontend**

---

## Slide 2: El Problema

# 😱 El Callback Hell

### Código tradicional asíncrono:

```javascript
getUser(userId, (user) => {
  getOrders(user.id, (orders) => {
    orders.forEach((order) => {
      getOrderDetails(order.id, (details) => {
        // ¡3 niveles de profundidad!
      });
    });
  });
});
```

### Problemas:
- ❌ Difícil de leer
- ❌ Difícil de mantener
- ❌ Manejo de errores complejo
- ❌ No se puede cancelar

---

## Slide 3: La Solución

# ✨ Programación Reactiva

### RxJS ofrece:
- ✅ Código legible y mantenible
- ✅ Manejo de errores centralizado
- ✅ Cancelación de operaciones
- ✅ Operadores poderosos

### Analogía: El Río de Datos

```
Fuente → → → Operadores → → → Destino
(click)    (filter, map)      (UI)
```

---

## Slide 4: Observable Pattern

# 🔄 Patrón Observer

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Observable │ ──→ │  Observer   │ ──→ │  Component  │
│  (Fuente)   │     │  (Destino)  │     │  (UI)       │
└─────────────┘     └─────────────┘     └─────────────┘
     next() ────────────→ Manejar valor
     error() ───────────→ Manejar error
     complete() ────────→ Finalizar
```

---

## Slide 5: Observable vs Promise

# ⚔️ Comparación

| Característica | Promise | Observable |
|----------------|---------|------------|
| Valores | 1 solo | Múltiples |
| Cancelación | ❌ No | ✅ Sí |
| Ejecución | Inmediata | Lazy |
| Operadores | .then() | 100+ |
| Retry | ❌ No | ✅ Sí |

---

## Slide 6: Observable Básico

# 📦 Crear un Observable

```typescript
import { Observable } from 'rxjs';

const observable = new Observable<string>(subscriber => {
  subscriber.next('Hola');
  subscriber.next('Mundo');
  subscriber.complete();
});
```

### Tres métodos del subscriber:
- `next(value)` - Emitir valor
- `error(err)` - Emitir error
- `complete()` - Finalizar stream

---

## Slide 7: Observer

# 👀 El Observer

```typescript
const observer = {
  next: (value: string) => console.log('Valor:', value),
  error: (err: Error) => console.error('Error:', err),
  complete: () => console.log('¡Completado!')
};

observable.subscribe(observer);
```

### Suscripción:
- `next` - Se ejecuta por cada valor
- `error` - Se ejecuta si hay error
- `complete` - Se ejecuta al finalizar

---

## Slide 8: Ciclo de Vida

# 🔄 Lifecycle del Observable

```
Crear Observable
      │
      ▼
  Suscribirse
      │
      ▼
  Recibir valores (next)
      │
      ├─→ error() → Manejar error
      │
      └─→ complete() → Finalizar
              │
              ▼
        unsubscribe()
```

---

## Slide 9: HttpClient

# 🌐 RxJS en Angular

### HttpClient retorna Observables:

```typescript
// auth.service.ts
login(credentials: LoginCredentials): Observable<AuthResponse> {
  return this.http.post<AuthResponse>('/auth/login', credentials);
}

// Uso
this.authService.login(creds).subscribe({
  next: response => this.handleLogin(response),
  error: error => this.handleError(error)
});
```

---

## Slide 10: Operadores Básicos

# 🔧 Operadores Comunes

```typescript
import { map, filter, tap } from 'rxjs/operators';

observable.pipe(
  filter(value => value.length > 3),  // Filtrar
  map(value => value.toUpperCase()),   // Transformar
  tap(value => console.log('Debug:', value)) // Side effect
);
```

| Operador | Propósito |
|----------|-----------|
| `map` | Transformar valores |
| `filter` | Filtrar valores |
| `tap` | Side effects (debug) |
| `debounceTime` | Esperar antes de emitir |

---

## Slide 11: Error #1 - Memory Leak

# ❌ No Cancelar Suscripciones

```typescript
// ❌ PROBLEMA
ngOnInit(): void {
  this.http.get('/api/data').subscribe(data => {
    this.data = data;
  });
  // Memory leak si componente se destruye
}
```

```typescript
// ✅ SOLUCIÓN: takeUntil
ngOnInit(): void {
  this.http.get('/api/data').pipe(
    takeUntil(this.destroy$)
  ).subscribe(data => this.data = data);
}

ngOnDestroy(): void {
  this.destroy$.next();
}
```

---

## Slide 12: Error #2 - Suscripciones Anidadas

# ❌ Anti-Pattern: Nested Subscribe

```typescript
// ❌ PROBLEMA
this.http.get('/api/user/1').subscribe(user => {
  this.http.get(`/api/orders/${user.id}`).subscribe(orders => {
    this.orders = orders;
  });
});
```

```typescript
// ✅ SOLUCIÓN: switchMap
this.http.get<User>('/api/user/1').pipe(
  switchMap(user => this.http.get<Order[]>(`/api/orders/${user.id}`))
).subscribe(orders => this.orders = orders);
```

---

## Slide 13: Error #3 - Sin Manejo de Errores

# ❌ No Manejar Errores

```typescript
// ❌ PROBLEMA
this.http.get('/api/data').subscribe(data => {
  this.data = data;
});
// ¡Error no manejado = crash!
```

```typescript
// ✅ SOLUCIÓN
this.http.get('/api/data').subscribe({
  next: data => this.data = data,
  error: error => this.showError('Error al cargar datos')
});
```

---

## Slide 14: Subjects

# 📢 Tipos de Subjects

| Tipo | Valor Inicial | Replay |
|------|---------------|--------|
| `Subject` | ❌ No | ❌ No |
| `BehaviorSubject` | ✅ Sí | Último valor |
| `ReplaySubject` | ❌ No | Últimos N valores |
| `AsyncSubject` | ❌ No | Último al completar |

---

## Slide 15: BehaviorSubject

# 🎯 El más usado en Angular

```typescript
const behaviorSubject = new BehaviorSubject<string>('inicial');

// Nuevos suscriptores reciben valor actual
behaviorSubject.subscribe(value => console.log('A:', value));
// Output: A: inicial

behaviorSubject.next('nuevo');

behaviorSubject.subscribe(value => console.log('B:', value));
// Output: B: nuevo

console.log(behaviorSubject.value); // 'nuevo'
```

---

## Slide 16: Subject en Servicio

# 🏗️ Patrón Estado Compartido

```typescript
@Injectable({ providedIn: 'root' })
export class UserService {
  private userSubject = new BehaviorSubject<User | null>(null);
  
  // Solo lectura (Observable)
  user$ = this.userSubject.asObservable();
  
  // Getter para valor actual
  get user(): User | null {
    return this.userSubject.value;
  }
  
  setUser(user: User): void {
    this.userSubject.next(user);
  }
}
```

---

## Slide 17: Búsqueda Reactiva

# 🔍 Ejemplo Completo

```typescript
fromEvent(searchInput, 'input').pipe(
  debounceTime(300),           // Esperar 300ms
  map(e => e.target.value),    // Obtener valor
  filter(value => value.length >= 2), // Filtrar cortos
  distinctUntilChanged(),      // Ignorar duplicados
  switchMap(term => this.search(term)) // Cambiar a HTTP
).subscribe(results => this.results = results);
```

---

## Slide 18: Diagrama de Marble

# 📊 Visualización de Operadores

```
source:     ---1---2---3---4---5---|
  filter(x => x > 2)
            -------3---4---5-------|
  map(x => x * 10)
            -------30--40--50------|
```

### Recurso: [rxmarbles.com](https://rxmarbles.com/)

---

## Slide 19: Resumen

# 📝 Lo que Aprendimos

| Concepto | Descripción |
|----------|-------------|
| **Observable** | Stream de datos asíncronos |
| **Observer** | Manejador de datos (next, error, complete) |
| **Subscription** | Conexión Observable-Observer |
| **Subject** | Observable + Observer (multicast) |
| **Operadores** | Transformación de streams |

### Puntos Clave:
1. ✅ Observables = Streams de datos
2. ✅ Siempre cancelar suscripciones
3. ✅ Usar operadores para transformar
4. ✅ BehaviorSubject para estado
5. ✅ Preferir AsyncPipe

---

## Slide 20: Próximos Pasos

# 🚀 ¿Qué Sigue?

### Día 11: RxJS Operadores
- Operadores de creación
- Operadores de transformación
- Operadores de filtrado
- Operadores de combinación

### Práctica:
- Implementar búsqueda reactiva
- Usar Subjects en servicios
- Manejar suscripciones correctamente

---

## Slide 21: Cierre

# 🎉 ¡Gracias!

## Preguntas y Discusión

### Recursos del Día:
- 📄 [Contenido Detallado](./contenido.md)
- 🔬 [Lab 01: Observables](./ejercicios/lab-01.md)
- 🧪 [Lab 02: Subjects](./ejercicios/lab-02.md)
- 📝 [Evaluación](./assessment/preguntas.md)

### Links Útiles:
- [RxJS Docs](https://rxjs.dev/)
- [Learn RxJS](https://www.learnrxjs.io/)
- [RxMarbles](https://rxmarbles.com/)

---

*Curso de Angular 21 - UyuniAdmin Frontend*
*Día 10: RxJS Fundamentos*
