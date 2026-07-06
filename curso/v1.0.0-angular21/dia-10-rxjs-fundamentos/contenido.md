# Día 10: RxJS Fundamentos - Programación Reactiva

## Contenido Detallado

---

## 1. HOOK: El Problema del Código Asíncrono

### Escenario Real

Imagina que necesitas cargar datos de un usuario, luego sus pedidos, y finalmente los detalles de cada pedido. Con el código tradicional, terminas en el "Callback Hell":

```typescript
// ❌ Callback Hell - El infierno de los callbacks
getUser(userId, (user) => {
  getOrders(user.id, (orders) => {
    orders.forEach((order) => {
      getOrderDetails(order.id, (details) => {
        // ¡Estamos 3 niveles de profundidad!
        console.log(details);
      });
    });
  });
});
```

### El Problema

El código asíncrono es difícil de:
- Leer (indentación profunda)
- Mantener (lógica escondida en callbacks)
- Manejar errores (try-catch no funciona bien)
- Componer (combinar múltiples operaciones)

### La Solución

**RxJS** y la **Programación Reactiva** ofrecen una forma elegante de manejar operaciones asíncronas.

---

## 2. CONTEXTO: ¿Qué es la Programación Reactiva?

### Definición

La programación reactiva es un paradigma de programación que se enfoca en manejar flujos de datos asíncronos y la propagación de cambios.

### Analogía: El Río de Datos

Imagina un río que fluye:

```
Fuente → → → → → → → → → → → → → Destino
        ↑ Operadores (filtros, transformaciones)
```

- **Fuente**: El origen de los datos (clicks, HTTP, timers)
- **Flujo**: El río donde viajan los datos
- **Operadores**: Filtros y transformaciones en el camino
- **Destino**: Donde se consumen los datos

### Observable Pattern

RxJS implementa el patrón Observer:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Observable │ ──→ │  Observer   │ ──→ │  Component  │
│  (Fuente)   │     │  (Destino)  │     │  (UI)       │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Observable vs Promise

| Característica | Promise | Observable |
|----------------|---------|------------|
| Valores | Un solo valor | Múltiples valores |
| Cancelación | No se puede cancelar | Cancelable con unsubscribe |
| Ejecución | Inmediata | Lazy (solo al suscribir) |
| Operadores | .then() | Docenas de operadores |
| Sintaxis | async/await | pipe() |

---

## 3. EXPLICACIÓN SIMPLE: Observables y Observers

### Observable

Un **Observable** es un productor de datos. Es como un stream que puede emitir múltiples valores a lo largo del tiempo.

```typescript
import { Observable } from 'rxjs';

// Crear un Observable manual
const observable = new Observable<string>(subscriber => {
  // Emitir valores
  subscriber.next('Hola');
  subscriber.next('Mundo');
  
  // Completar el stream
  subscriber.complete();
});
```

### Observer

Un **Observer** es un consumidor de datos. Define qué hacer con cada valor emitido.

```typescript
// Observer completo
const observer = {
  next: (value: string) => console.log('Valor:', value),
  error: (err: Error) => console.error('Error:', err),
  complete: () => console.log('¡Completado!')
};

// Suscribirse al Observable
observable.subscribe(observer);
```

### Ciclo de Vida del Observable

```
┌─────────────────────────────────────────────────────────┐
│                    CICLO DE VIDA                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Crear Observable → Suscribir → Recibir valores         │
│         │              │              │                  │
│         │              │              ▼                  │
│         │              │      next() → Manejar dato     │
│         │              │              │                  │
│         │              │              ▼                  │
│         │              │      error() → Manejar error   │
│         │              │           o                     │
│         │              │      complete() → Finalizar    │
│         │              │              │                  │
│         │              ▼              ▼                  │
│         │        unsubscribe() ←────────┘               │
│         │              │                                 │
│         └──────────────┘                                 │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Ejemplo Práctico: Timer

```typescript
import { Observable } from 'rxjs';

// Observable que emite cada segundo
const timer$ = new Observable<number>(subscriber => {
  let count = 0;
  
  const intervalId = setInterval(() => {
    subscriber.next(count++);
    
    // Detener después de 5 emisiones
    if (count >= 5) {
      subscriber.complete();
      clearInterval(intervalId);
    }
  }, 1000);
  
  // Cleanup function (se ejecuta al unsubscribe)
  return () => {
    clearInterval(intervalId);
    console.log('Cleanup: intervalo limpiado');
  };
});

// Suscribirse
const subscription = timer$.subscribe({
  next: value => console.log('Tick:', value),
  complete: () => console.log('Timer completado')
});

// Cancelar después de 3 segundos
setTimeout(() => {
  subscription.unsubscribe();
  console.log('Suscripción cancelada');
}, 3000);
```

---

## 4. DEMO/CÓDIGO: Observables en Angular

### HttpClient con Observables

Angular usa Observables para HTTP requests:

```typescript
// auth.service.ts
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  // HttpClient retorna un Observable
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/auth/login', credentials);
  }

  // Uso en componente
  // this.authService.login(creds).subscribe({
  //   next: response => this.handleLogin(response),
  //   error: error => this.handleError(error)
  // });
}
```

### Crear Observable desde Evento del DOM

```typescript
import { fromEvent } from 'rxjs';

// Observable desde evento de click
const clicks$ = fromEvent(document, 'click');

clicks$.subscribe({
  next: (event) => console.log('Click en:', event.target)
});
```

### Observable con Operadores

```typescript
import { fromEvent } from 'rxjs';
import { map, filter, debounceTime } from 'rxjs/operators';

// Búsqueda con debounce
const searchInput = document.getElementById('search') as HTMLInputElement;

fromEvent<InputEvent>(searchInput, 'input').pipe(
  // Esperar 300ms después del último keystroke
  debounceTime(300),
  
  // Obtener el valor del input
  map(event => (event.target as HTMLInputElement).value),
  
  // Filtrar búsquedas vacías o muy cortas
  filter(value => value.length >= 3),
  
  // Log para debug
  tap(value => console.log('Buscando:', value))
).subscribe({
  next: searchTerm => this.searchProducts(searchTerm)
});
```

---

## 5. ERROR COMÚN: Problemas con Suscripciones

### Error 1: No Cancelar Suscripciones

```typescript
// ❌ PROBLEMA: Memory leak
export class MyComponent implements OnInit {
  ngOnInit(): void {
    this.http.get('/api/data').subscribe(data => {
      this.data = data;
    });
    // Si el componente se destruye antes de que llegue la respuesta,
    // la suscripción sigue activa = MEMORY LEAK
  }
}
```

**Solución**: Usar `takeUntil` o el operador `async`:

```typescript
// ✅ SOLUCIÓN 1: takeUntil
export class MyComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.http.get('/api/data').pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => {
      this.data = data;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// ✅ SOLUCIÓN 2: AsyncPipe (mejor)
@Component({
  template: `<div>{{ data$ | async }}</div>`
})
export class MyComponent {
  data$ = this.http.get('/api/data');
}
```

### Error 2: Suscripciones Anidadas

```typescript
// ❌ PROBLEMA: Suscripciones anidadas (anti-pattern)
this.http.get('/api/user/1').subscribe(user => {
  this.http.get(`/api/orders/${user.id}`).subscribe(orders => {
    this.orders = orders;
  });
});
```

**Solución**: Usar operadores de combinación:

```typescript
// ✅ SOLUCIÓN: switchMap
this.http.get<User>('/api/user/1').pipe(
  switchMap(user => this.http.get<Order[]>(`/api/orders/${user.id}`))
).subscribe(orders => {
  this.orders = orders;
});
```

### Error 3: No Manejar Errores

```typescript
// ❌ PROBLEMA: Sin manejo de errores
this.http.get('/api/data').subscribe(data => {
  this.data = data;
});
// Si hay error, la aplicación crashea
```

**Solución**: Siempre manejar errores:

```typescript
// ✅ SOLUCIÓN: Manejar error
this.http.get('/api/data').subscribe({
  next: data => this.data = data,
  error: error => {
    console.error('Error:', error);
    this.showError('No se pudieron cargar los datos');
  }
});

// O con catchError
this.http.get('/api/data').pipe(
  catchError(error => {
    console.error('Error:', error);
    return of([]); // Retornar valor por defecto
  })
).subscribe(data => this.data = data);
```

---

## 6. MINI RETO: Crear un Observable de Búsqueda

### Descripción

Implementa un Observable que maneje búsquedas con debounce y cancelación de peticiones anteriores.

### Requisitos

1. Escuchar el evento `input` de un campo de búsqueda
2. Aplicar debounce de 300ms
3. Filtrar búsquedas vacías
4. Cancelar peticiones anteriores si llega una nueva
5. Manejar errores

### Código Base

```typescript
// search.component.ts
export class SearchComponent {
  private readonly http = inject(HttpClient);
  
  // TODO: Implementar búsqueda reactiva
  setupSearch(): void {
    // 1. Obtener referencia al input
    // 2. Crear Observable desde evento
    // 3. Aplicar operadores
    // 4. Suscribirse
  }
}
```

### Solución

```typescript
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, map, filter, distinctUntilChanged, switchMap, catchError, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  template: `
    <input #searchInput type="text" placeholder="Buscar...">
    <ul>
      @for (result of results$ | async; track result.id) {
        <li>{{ result.name }}</li>
      }
    </ul>
  `
})
export class SearchComponent implements OnInit, OnDestroy {
  private readonly http = inject(HttpClient);
  private destroy$ = new Subject<void>();
  
  results$ = new Observable<any[]>();

  ngOnInit(): void {
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearch(): void {
    const searchInput = document.querySelector('#searchInput') as HTMLInputElement;
    
    this.results$ = fromEvent<InputEvent>(searchInput, 'input').pipe(
      // Cleanup al destruir componente
      takeUntil(this.destroy$),
      
      // Obtener valor del input
      map(event => (event.target as HTMLInputElement).value),
      
      // Ignorar si el valor no cambió
      distinctUntilChanged(),
      
      // Esperar 300ms
      debounceTime(300),
      
      // Filtrar búsquedas vacías o muy cortas
      filter(value => value.length >= 2),
      
      // Log para debug
      tap(value => console.log('Buscando:', value)),
      
      // Cambiar a nuevo Observable (cancela el anterior)
      switchMap(searchTerm => 
        this.http.get<any[]>(`/api/search?q=${searchTerm}`).pipe(
          // Manejar errores individualmente
          catchError(error => {
            console.error('Error en búsqueda:', error);
            return of([]); // Retornar array vacío
          })
        )
      )
    );
  }
}
```

---

## 7. CIERRE: Resumen y Próximos Pasos

### Resumen del Día

| Concepto | Descripción |
|----------|-------------|
| **Observable** | Productor de datos asíncronos |
| **Observer** | Consumidor de datos (next, error, complete) |
| **Subscription** | Representa la conexión Observable-Observer |
| **Subject** | Observable que puede emitir valores manualmente |
| **Operadores** | Funciones para transformar streams |

### Puntos Clave

1. ✅ Los Observables son streams de datos asíncronos
2. ✅ Los Observers definen cómo manejar los datos
3. ✅ Siempre cancelar suscripciones para evitar memory leaks
4. ✅ Usar operadores para transformar y filtrar datos
5. ✅ Preferir AsyncPipe sobre suscripciones manuales

### Comparación Final

```
┌─────────────────────────────────────────────────────────────┐
│              OBSERVABLE vs PROMISE vs SIGNAL                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  PROMISE:                                                    │
│  - Un solo valor                                            │
│  - No cancelable                                            │
│  - async/await                                              │
│                                                              │
│  OBSERVABLE:                                                 │
│  - Múltiples valores                                        │
│  - Cancelable                                               │
│  - Operadores poderosos                                     │
│                                                              │
│  SIGNAL (Angular 16+):                                       │
│  - Estado reactivo síncrono                                 │
│  - Más simple que Observable                                │
│  - Ideal para estado local                                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Próximos Pasos

1. **Día 11**: RxJS Operadores - Operadores avanzados
2. **Día 12**: Estado con Signals y RxJS - Combinando ambos
3. **Práctica**: Implementar búsqueda reactiva en tu proyecto

### Recursos Adicionales

- [RxJS Documentation](https://rxjs.dev/)
- [Learn RxJS](https://www.learnrxjs.io/)
- [RxMarbles](https://rxmarbles.com/) - Visualización de operadores

---

## 8. Subjects: Tipos y Uso

### Subject

Un **Subject** es un Observable que puede emitir valores manualmente. Es tanto Observable como Observer.

```typescript
import { Subject } from 'rxjs';

const subject = new Subject<number>();

// Suscribirse (como Observable)
subject.subscribe({
  next: value => console.log('Observer A:', value)
});

subject.subscribe({
  next: value => console.log('Observer B:', value)
});

// Emitir valores (como Observer)
subject.next(1);
subject.next(2);
subject.next(3);

// Output:
// Observer A: 1
// Observer B: 1
// Observer A: 2
// Observer B: 2
// Observer A: 3
// Observer B: 3
```

### BehaviorSubject

Tiene un **valor inicial** y emite el valor más reciente a nuevos suscriptores.

```typescript
import { BehaviorSubject } from 'rxjs';

const behaviorSubject = new BehaviorSubject<string>('valor inicial');

// Nuevos suscriptores reciben el valor actual
behaviorSubject.subscribe({
  next: value => console.log('Observer A:', value)
});
// Output: Observer A: valor inicial

behaviorSubject.next('nuevo valor');

behaviorSubject.subscribe({
  next: value => console.log('Observer B:', value)
});
// Output: Observer B: nuevo valor

console.log('Valor actual:', behaviorSubject.value);
// Output: Valor actual: nuevo valor
```

### ReplaySubject

Replay de los últimos N valores a nuevos suscriptores.

```typescript
import { ReplaySubject } from 'rxjs';

const replaySubject = new ReplaySubject<string>(2); // Últimos 2 valores

replaySubject.next('valor 1');
replaySubject.next('valor 2');
replaySubject.next('valor 3');

// Nuevo suscriptor recibe los últimos 2 valores
replaySubject.subscribe({
  next: value => console.log('Observer:', value)
});
// Output:
// Observer: valor 2
// Observer: valor 3
```

### AsyncSubject

Solo emite el último valor cuando se completa.

```typescript
import { AsyncSubject } from 'rxjs';

const asyncSubject = new AsyncSubject<number>();

asyncSubject.subscribe({
  next: value => console.log('Observer:', value),
  complete: () => console.log('Completado')
});

asyncSubject.next(1);
asyncSubject.next(2);
asyncSubject.next(3);
asyncSubject.complete();
// Output: Observer: 3
```

### Uso en Angular

```typescript
// Servicio con BehaviorSubject para estado compartido
@Injectable({ providedIn: 'root' })
export class UserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  
  // Exponer como Observable (solo lectura)
  currentUser$ = this.currentUserSubject.asObservable();
  
  // Getter para valor actual
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }
  
  // Método para actualizar
  setUser(user: User): void {
    this.currentUserSubject.next(user);
  }
  
  // Método para limpiar
  clearUser(): void {
    this.currentUserSubject.next(null);
  }
}
```

---

*Fin del contenido del Día 10*
