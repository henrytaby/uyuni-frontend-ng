# Lab 02: ChangeDetectionStrategy.OnPush

## Objetivo

Implementar y medir el impacto de `ChangeDetectionStrategy.OnPush` en el rendimiento de componentes.

## Duración

**45 minutos**

## Prerrequisitos

- Haber completado Lab 01
- Entender el concepto de Change Detection
- Tener Angular DevTools instalado

---

## Escenario

Vamos a crear dos versiones de un componente contador:
1. **Versión Default**: Sin OnPush
2. **Versión OnPush**: Con OnPush y signals

Luego mediremos el rendimiento con Angular DevTools.

---

## Parte 1: Componente con Default Strategy (15 min)

### Crear componente de prueba

```bash
mkdir -p src/app/features/test/pages/default-test
```

### Archivo: `src/app/features/test/pages/default-test/default-test.component.ts`

```typescript
// default-test.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-default-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 class="text-xl font-bold mb-4">Default Strategy</h2>
      
      <div class="space-y-4">
        <!-- Contador principal -->
        <div class="text-center">
          <span class="text-4xl font-bold">{{ counter }}</span>
          <p class="text-sm text-gray-500">Contador: {{ counter }}</p>
        </div>
        
        <!-- Botones -->
        <div class="flex gap-2 justify-center">
          <button 
            (click)="increment()"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Incrementar
          </button>
          <button 
            (click)="triggerRandom()"
            class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Trigger Random (no cambia counter)
          </button>
        </div>
        
        <!-- Contador de verificaciones -->
        <div class="text-center text-sm text-gray-500">
          Verificaciones: {{ checkCount }}
        </div>
      </div>
    </div>
  `
  // NOTA: No especificamos changeDetection, usa Default
})
export class DefaultTestComponent {
  counter = 0;
  checkCount = 0;
  randomValue = 0;
  
  increment(): void {
    this.counter++;
  }
  
  triggerRandom(): void {
    // Este método NO cambia counter
    // Pero Angular verificará el componente de todas formas
    this.randomValue = Math.random();
    this.checkCount++;
  }
}
```

### Observación

Cuando haces click en "Trigger Random":
- `counter` NO cambia
- Pero Angular **verifica** el componente de todas formas
- El contador de verificaciones aumenta

---

## Parte 2: Componente con OnPush (15 min)

### Crear componente de prueba

```bash
mkdir -p src/app/features/test/pages/onpush-test
```

### Archivo: `src/app/features/test/pages/onpush-test/onpush-test.component.ts`

```typescript
// onpush-test.component.ts
import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-onpush-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 class="text-xl font-bold mb-4">OnPush Strategy</h2>
      
      <div class="space-y-4">
        <!-- Contador principal -->
        <div class="text-center">
          <span class="text-4xl font-bold">{{ counter() }}</span>
          <p class="text-sm text-gray-500">Contador: {{ counter() }}</p>
        </div>
        
        <!-- Botones -->
        <div class="flex gap-2 justify-center">
          <button 
            (click)="increment()"
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Incrementar
          </button>
          <button 
            (click)="triggerRandom()"
            class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Trigger Random (no cambia counter)
          </button>
        </div>
        
        <!-- Contador de verificaciones -->
        <div class="text-center text-sm text-gray-500">
          Verificaciones: {{ checkCount() }}
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush  // ← AQUÍ
})
export class OnPushTestComponent {
  // Usamos signals para estado reactivo
  counter = signal(0);
  checkCount = signal(0);
  randomValue = signal(0);
  
  increment(): void {
    // signal.update() notifica el cambio
    this.counter.update(c => c + 1);
    this.checkCount.update(c => c + 1);
  }
  
  triggerRandom(): void {
    // Este método cambia randomValue
    // Pero NO afecta al template directamente
    this.randomValue.set(Math.random());
    // NOTA: El contador de verificaciones NO aumenta
    // porque el template no depende de randomValue
  }
}
```

### Observación

Cuando haces click en "Trigger Random":
- `randomValue` cambia
- Pero el template NO depende de `randomValue`
- Angular **NO verifica** el componente
- El contador de verificaciones NO aumenta

---

## Parte 3: Comparación Visual (10 min)

### Crear componente comparador

```bash
mkdir -p src/app/features/test/pages/comparison
```

### Archivo: `src/app/features/test/pages/comparison/comparison.component.ts`

```typescript
// comparison.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultTestComponent } from '../default-test/default-test.component';
import { OnPushTestComponent } from '../onpush-test/onpush-test.component';

@Component({
  selector: 'app-comparison',
  standalone: true,
  imports: [CommonModule, DefaultTestComponent, OnPushTestComponent],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-6">Comparación: Default vs OnPush</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Default -->
        <div>
          <h2 class="text-lg font-semibold mb-2 text-red-500">
            ❌ Default Strategy
          </h2>
          <app-default-test />
          <p class="mt-2 text-sm text-gray-500">
            Cada evento dispara verificación
          </p>
        </div>
        
        <!-- OnPush -->
        <div>
          <h2 class="text-lg font-semibold mb-2 text-green-500">
            ✅ OnPush Strategy
          </h2>
          <app-onpush-test />
          <p class="mt-2 text-sm text-gray-500">
            Solo verifica cuando hay cambios reales
          </p>
        </div>
      </div>
      
      <!-- Instrucciones -->
      <div class="mt-8 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
        <h3 class="font-semibold mb-2">📋 Instrucciones:</h3>
        <ol class="list-decimal list-inside space-y-2 text-sm">
          <li>Haz click en "Trigger Random" en ambos componentes</li>
          <li>Observa el contador de verificaciones</li>
          <li>Default: aumenta en cada click</li>
          <li>OnPush: NO aumenta (no hay cambio relevante)</li>
        </ol>
      </div>
    </div>
  `
})
export class ComparisonComponent {}
```

---

## Parte 4: Medición con Angular DevTools (5 min)

### Pasos para medir

1. **Abrir Chrome DevTools** (F12)
2. **Ir a pestaña "Angular"**
3. **Seleccionar "Profiler"**
4. **Click en "Start Recording"**
5. **Interactuar con la aplicación**
6. **Click en "Stop Recording"**
7. **Analizar resultados**

### Qué buscar

```
┌─────────────────────────────────────────────────────────────┐
│                    PROFILER RESULTS                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Default Strategy:                                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Change Detection: 15ms                              │   │
│  │ Components checked: 5                               │   │
│  │ Cycles: 10                                          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  OnPush Strategy:                                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Change Detection: 2ms                               │   │
│  │ Components checked: 1                               │   │
│  │ Cycles: 2                                           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Mejora: 87% menos tiempo de change detection              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Ejercicio: Identificar Problemas

### Código con problema

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent {
  users: User[] = [];  // ❌ Problema: no es signal
  
  addUser(user: User) {
    this.users.push(user);  // ❌ Problema: mutación
  }
}
```

### ¿Qué está mal?

1. `users` no es signal, OnPush no detectará cambios
2. `push()` muta el array, no crea nueva referencia

### Solución

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent {
  users = signal<User[]>([]);  // ✅ Signal
  
  addUser(user: User) {
    this.users.update(users => [...users, user]);  // ✅ Nuevo array
  }
}
```

---

## Reto: Convertir Componente

### Componente original (Default)

```typescript
@Component({
  selector: 'app-todo-list',
  template: `
    <input [(ngModel)]="newTodo" placeholder="Nueva tarea">
    <button (click)="addTodo()">Agregar</button>
    <ul>
      <li *ngFor="let todo of todos">
        {{ todo }}
        <button (click)="removeTodo(todo)">X</button>
      </li>
    </ul>
    <p>Total: {{ todos.length }}</p>
  `
})
export class TodoListComponent {
  todos: string[] = [];
  newTodo = '';
  
  addTodo() {
    if (this.newTodo) {
      this.todos.push(this.newTodo);
      this.newTodo = '';
    }
  }
  
  removeTodo(todo: string) {
    const index = this.todos.indexOf(todo);
    this.todos.splice(index, 1);
  }
}
```

### Tu tarea

Convertir este componente a:
1. Usar `ChangeDetectionStrategy.OnPush`
2. Usar signals para estado
3. Usar patrones inmutables

---

## Solución del Reto

```typescript
@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [FormsModule],
  template: `
    <input 
      [(ngModel)]="newTodo" 
      placeholder="Nueva tarea"
      class="border p-2 rounded"
    >
    <button 
      (click)="addTodo()"
      class="px-4 py-2 bg-blue-500 text-white rounded"
    >
      Agregar
    </button>
    <ul>
      @for (todo of todos(); track todo) {
        <li class="flex justify-between items-center py-2">
          {{ todo }}
          <button 
            (click)="removeTodo(todo)"
            class="text-red-500"
          >
            X
          </button>
        </li>
      }
    </ul>
    <p>Total: {{ todos().length }}</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent {
  todos = signal<string[]>([]);
  newTodo = '';
  
  addTodo(): void {
    if (this.newTodo.trim()) {
      // Crear nuevo array (inmutable)
      this.todos.update(todos => [...todos, this.newTodo.trim()]);
      this.newTodo = '';
    }
  }
  
  removeTodo(todo: string): void {
    // Crear nuevo array filtrado (inmutable)
    this.todos.update(todos => todos.filter(t => t !== todo));
  }
}
```

---

## Puntos Clave

### Cuándo usar OnPush

✅ **SIEMPRE** en componentes nuevos
✅ Especialmente en:
- Listas con muchos items
- Componentes que se actualizan poco
- Dumb Components
- Componentes con datos inmutables

### Patrones Inmutables

| Operación | ❌ Mutación | ✅ Inmutable |
|-----------|------------|--------------|
| Agregar item | `arr.push(x)` | `[...arr, x]` |
| Eliminar item | `arr.splice(i,1)` | `arr.filter(...)` |
| Actualizar item | `arr[i] = x` | `arr.map(...)` |
| Modificar objeto | `obj.prop = x` | `{...obj, prop: x}` |

---

## Checklist de Verificación

- [ ] Componente tiene `changeDetection: ChangeDetectionStrategy.OnPush`
- [ ] Estado usa signals
- [ ] Arrays se actualizan con `update()` creando nuevos arrays
- [ ] Objetos se actualizan con spread operator
- [ ] No hay mutaciones directas

---

## Recursos Adicionales

- [Angular Change Detection Guide](https://angular.io/guide/change-detection)
- [OnPush Performance](https://blog.angular-university.io/onpush-change-detection-how-it-works/)
- [Angular DevTools](https://angular.io/guide/devtools)

---

*Lab 02 - ChangeDetectionStrategy.OnPush*
*Curso: Angular 21 Enterprise*
*Día: 2 de 18*
