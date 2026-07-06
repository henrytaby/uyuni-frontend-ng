# Lab 01: Observables y Observers

## Objetivo

Aprender a crear Observables manuales y manejar suscripciones correctamente.

## Tiempo Estimado

45 minutos

## Prerrequisitos

- Haber completado el contenido teórico del Día 10
- Tener configurado el proyecto UyuniAdmin
- Conocer los conceptos básicos de TypeScript

---

## Ejercicio 1: Crear un Observable Básico

### Instrucciones

1. Crea un Observable que emita los números del 1 al 5
2. Cada número debe emitirse con un intervalo de 1 segundo
3. Al finalizar, debe completarse

### Código Inicial

```typescript
// src/app/core/services/practice/practice.observable.ts
import { Observable } from 'rxjs';

// TODO: Crear el Observable
export const numberObservable = new Observable<number>(subscriber => {
  // Implementar emisión de números 1-5
});
```

### Solución Esperada

```typescript
// src/app/core/services/practice/practice.observable.ts
import { Observable } from 'rxjs';

export const numberObservable = new Observable<number>(subscriber => {
  let count = 1;
  
  const intervalId = setInterval(() => {
    subscriber.next(count);
    count++;
    
    if (count > 5) {
      clearInterval(intervalId);
      subscriber.complete();
    }
  }, 1000);
  
  // Cleanup function
  return () => {
    clearInterval(intervalId);
    console.log('Observable limpiado');
  };
});
```

### Validación

```typescript
// En un componente
numberObservable.subscribe({
  next: value => console.log('Valor:', value),
  complete: () => console.log('¡Completado!')
});

// Output esperado:
// Valor: 1 (después de 1s)
// Valor: 2 (después de 2s)
// Valor: 3 (después de 3s)
// Valor: 4 (después de 4s)
// Valor: 5 (después de 5s)
// ¡Completado!
```

---

## Ejercicio 2: Implementar un Observer Completo

### Instrucciones

1. Crea un Observer que maneje next, error y complete
2. El Observer debe loguear cada tipo de evento
3. Prueba con diferentes Observables

### Código Base

```typescript
// TODO: Crear Observer
const myObserver = {
  // Implementar next, error, complete
};
```

### Solución Esperada

```typescript
// Observer completo
const myObserver = {
  next: (value: number) => {
    console.log('📥 Valor recibido:', value);
  },
  error: (err: Error) => {
    console.error('❌ Error:', err.message);
  },
  complete: () => {
    console.log('✅ Stream completado');
  }
};

// Uso
numberObservable.subscribe(myObserver);
```

---

## Ejercicio 3: Observable con Error

### Instrucciones

1. Crea un Observable que emita valores pero eventualmente lance un error
2. Maneja el error en el Observer
3. Verifica que el error detiene el stream

### Solución Esperada

```typescript
import { Observable } from 'rxjs';

export const errorObservable = new Observable<number>(subscriber => {
  let count = 1;
  
  const intervalId = setInterval(() => {
    if (count <= 3) {
      subscriber.next(count);
      count++;
    } else if (count === 4) {
      clearInterval(intervalId);
      subscriber.error(new Error('Error simulado en el valor 4'));
    }
  }, 1000);
  
  return () => clearInterval(intervalId);
});

// Uso
errorObservable.subscribe({
  next: value => console.log('Valor:', value),
  error: err => console.error('Error capturado:', err.message),
  complete: () => console.log('Esto NO se ejecuta si hay error')
});

// Output:
// Valor: 1
// Valor: 2
// Valor: 3
// Error capturado: Error simulado en el valor 4
```

---

## Ejercicio 4: Cancelar Suscripción

### Instrucciones

1. Crea un Observable infinito (que nunca se completa)
2. Suscríbete y cancela después de 3 segundos
3. Verifica que el cleanup se ejecuta

### Solución Esperada

```typescript
import { Observable } from 'rxjs';

// Observable infinito
export const infiniteObservable = new Observable<number>(subscriber => {
  let count = 0;
  
  const intervalId = setInterval(() => {
    subscriber.next(count++);
    console.log('Emitiendo:', count);
  }, 500);
  
  // Cleanup
  return () => {
    clearInterval(intervalId);
    console.log('🧹 Cleanup ejecutado');
  };
});

// Uso con cancelación
const subscription = infiniteObservable.subscribe({
  next: value => console.log('Recibido:', value)
});

// Cancelar después de 3 segundos
setTimeout(() => {
  subscription.unsubscribe();
  console.log('Suscripción cancelada');
}, 3000);

// Output:
// Emitiendo: 1, Recibido: 0
// Emitiendo: 2, Recibido: 1
// Emitiendo: 3, Recibido: 2
// Emitiendo: 4, Recibido: 3
// Emitiendo: 5, Recibido: 4
// Emitiendo: 6, Recibido: 5
// Suscripción cancelada
// 🧹 Cleanup ejecutado
```

---

## Ejercicio 5: Observable desde Promise

### Instrucciones

1. Convierte una Promise existente a Observable usando `from()`
2. Maneja tanto el éxito como el error

### Solución Esperada

```typescript
import { from } from 'rxjs';

// Promise existente
const fetchUser = (id: number): Promise<User> => {
  return fetch(`/api/users/${id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Usuario no encontrado');
      }
      return response.json();
    });
};

// Convertir a Observable
const user$ = from(fetchUser(1));

user$.subscribe({
  next: user => console.log('Usuario:', user),
  error: err => console.error('Error:', err.message),
  complete: () => console.log('Completado')
});
```

---

## Ejercicio 6: Observable desde Eventos del DOM

### Instrucciones

1. Crea un Observable desde eventos de click
2. Filtra solo los clicks en botones
3. Extrae el texto del botón

### Solución Esperada

```typescript
import { fromEvent } from 'rxjs';
import { map, filter } from 'rxjs/operators';

// Observable desde clicks
const clicks$ = fromEvent<MouseEvent>(document, 'click');

clicks$.pipe(
  // Filtrar solo elementos button
  filter(event => (event.target as HTMLElement).tagName === 'BUTTON'),
  
  // Extraer texto del botón
  map(event => (event.target as HTMLButtonElement).textContent)
).subscribe({
  next: text => console.log('Click en botón:', text)
});

// HTML: <button>Guardar</button>
// Output al hacer click: Click en botón: Guardar
```

---

## Ejercicio 7: Múltiples Observers

### Instrucciones

1. Crea un Observable que emita valores
2. Suscribe dos Observers diferentes
3. Verifica que ambos reciben los mismos valores

### Solución Esperada

```typescript
import { Observable } from 'rxjs';

const sharedObservable = new Observable<string>(subscriber => {
  console.log('🔄 Observable ejecutado');
  subscriber.next('A');
  subscriber.next('B');
  subscriber.next('C');
  subscriber.complete();
});

// Observer 1
sharedObservable.subscribe({
  next: value => console.log('Observer 1:', value),
  complete: () => console.log('Observer 1 completado')
});

// Observer 2
sharedObservable.subscribe({
  next: value => console.log('Observer 2:', value),
  complete: () => console.log('Observer 2 completado')
});

// Output:
// 🔄 Observable ejecutado
// Observer 1: A
// Observer 1: B
// Observer 1: C
// Observer 1 completado
// 🔄 Observable ejecutado  <-- Se ejecuta de nuevo!
// Observer 2: A
// Observer 2: B
// Observer 2: C
// Observer 2 completado
```

**Nota importante**: Cada suscripción ejecuta el Observable de forma independiente.

---

## Ejercicio 8: takeUntil para Cancelación

### Instrucciones

1. Implementa el patrón takeUntil para cancelar suscripciones
2. Usa un Subject como señal de cancelación
3. Verifica que todas las suscripciones se cancelan

### Solución Esperada

```typescript
import { Component, OnDestroy } from '@angular/core';
import { Subject, interval } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

@Component({
  selector: 'app-example',
  template: `<div>{{ counter }}</div>`
})
export class ExampleComponent implements OnDestroy {
  counter = 0;
  private destroy$ = new Subject<void>();

  constructor() {
    // Observable que emite cada segundo
    interval(1000).pipe(
      takeUntil(this.destroy$),  // Cancelar cuando destroy$ emita
      map(value => value + 1)
    ).subscribe({
      next: value => this.counter = value
    });
  }

  ngOnDestroy(): void {
    // Emitir señal de cancelación
    this.destroy$.next();
    this.destroy$.complete();
    console.log('Componente destruido, suscripciones canceladas');
  }
}
```

---

## Validación Final

### Checklist

- [ ] Creé un Observable manual con `new Observable()`
- [ ] Implementé un Observer con next, error, complete
- [ ] Manejé errores en Observables
- [ ] Cancelé suscripciones con `unsubscribe()`
- [ ] Usé `from()` para convertir Promises
- [ ] Usé `fromEvent()` para eventos del DOM
- [ ] Implementé `takeUntil` para cancelación

### Comandos de Verificación

```bash
# Ejecutar tests si existen
npm test -- --testPathPattern=practice

# Verificar sintaxis
npx tsc --noEmit
```

---

## Siguiente Paso

Completa el [Lab 02](./lab-02.md) para aprender sobre Subjects y Operadores.

---

*Lab 01 - Observables y Observers*
*Curso Angular 21 - UyuniAdmin Frontend*
