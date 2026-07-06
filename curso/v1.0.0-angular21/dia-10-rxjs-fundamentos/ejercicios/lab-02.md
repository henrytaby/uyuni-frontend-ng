# Lab 02: Subjects y Operadores

## Objetivo

Aprender a usar Subjects para comunicación entre componentes y operadores básicos de RxJS.

## Tiempo Estimado

45 minutos

## Prerrequisitos

- Haber completado el Lab 01
- Entender el concepto de Observable y Observer
- Conocer los tipos de Subjects

---

## Ejercicio 1: BehaviorSubject para Estado

### Instrucciones

1. Crea un servicio que maneje el estado del usuario con BehaviorSubject
2. Implementa métodos para obtener, actualizar y limpiar el estado
3. Expón el Observable como solo lectura

### Código Base

```typescript
// src/app/core/services/user-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class UserStateService {
  // TODO: Implementar con BehaviorSubject
}
```

### Solución Esperada

```typescript
// src/app/core/services/user-state.service.ts
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class UserStateService {
  // BehaviorSubject con valor inicial null
  private userSubject = new BehaviorSubject<User | null>(null);
  
  // Exponer como Observable (solo lectura)
  public user$: Observable<User | null> = this.userSubject.asObservable();
  
  // Getter para valor actual
  get currentUser(): User | null {
    return this.userSubject.value;
  }
  
  // Actualizar usuario
  setUser(user: User): void {
    this.userSubject.next(user);
  }
  
  // Actualizar parcialmente
  updateUser(partial: Partial<User>): void {
    const current = this.userSubject.value;
    if (current) {
      this.userSubject.next({ ...current, ...partial });
    }
  }
  
  // Limpiar usuario
  clearUser(): void {
    this.userSubject.next(null);
  }
}
```

---

## Ejercicio 2: Subject para Eventos

### Instrucciones

1. Crea un Subject para manejar notificaciones
2. Implementa métodos para emitir y escuchar notificaciones
3. Usa el Subject en múltiples componentes

### Solución Esperada

```typescript
// src/app/core/services/notification.service.ts
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface Notification {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  // Subject para notificaciones (sin valor inicial)
  private notificationSubject = new Subject<Notification>();
  
  // Observable para suscribirse
  public notifications$: Observable<Notification> = this.notificationSubject.asObservable();
  
  // Emitir notificación
  notify(type: Notification['type'], message: string): void {
    this.notificationSubject.next({
      type,
      message,
      timestamp: new Date()
    });
  }
  
  // Métodos de conveniencia
  success(message: string): void {
    this.notify('success', message);
  }
  
  error(message: string): void {
    this.notify('error', message);
  }
  
  warning(message: string): void {
    this.notify('warning', message);
  }
  
  info(message: string): void {
    this.notify('info', message);
  }
}

// Uso en componente
// notificationService.success('Operación exitosa');
// notificationService.error('Error al procesar');
```

---

## Ejercicio 3: ReplaySubject para Historial

### Instrucciones

1. Crea un ReplaySubject que guarde los últimos 5 mensajes
2. Nuevos suscriptores deben recibir el historial
3. Implementa un servicio de chat simple

### Solución Esperada

```typescript
// src/app/core/services/chat.service.ts
import { Injectable } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';

export interface ChatMessage {
  user: string;
  text: string;
  timestamp: Date;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  // ReplaySubject que guarda los últimos 5 mensajes
  private messagesSubject = new ReplaySubject<ChatMessage>(5);
  
  // Observable para suscribirse
  public messages$: Observable<ChatMessage> = this.messagesSubject.asObservable();
  
  // Enviar mensaje
  send(user: string, text: string): void {
    this.messagesSubject.next({
      user,
      text,
      timestamp: new Date()
    });
  }
}

// Uso
// chatService.send('Juan', 'Hola a todos');
// Nuevos suscriptores reciben los últimos 5 mensajes
```

---

## Ejercicio 4: Operadores Básicos - map

### Instrucciones

1. Usa el operador `map` para transformar valores
2. Transforma un Observable de números a sus cuadrados
3. Transforma un Observable de usuarios a solo sus nombres

### Solución Esperada

```typescript
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

// Números al cuadrado
const numbers$ = of(1, 2, 3, 4, 5);

numbers$.pipe(
  map(n => n * n)
).subscribe({
  next: value => console.log('Cuadrado:', value)
});
// Output: 1, 4, 9, 16, 25

// Usuarios a nombres
interface User {
  id: number;
  name: string;
  email: string;
}

const users$ = of<User>(
  { id: 1, name: 'Juan', email: 'juan@test.com' },
  { id: 2, name: 'María', email: 'maria@test.com' },
  { id: 3, name: 'Pedro', email: 'pedro@test.com' }
);

users$.pipe(
  map(user => user.name)
).subscribe({
  next: name => console.log('Nombre:', name)
});
// Output: Juan, María, Pedro
```

---

## Ejercicio 5: Operadores Básicos - filter

### Instrucciones

1. Usa el operador `filter` para filtrar valores
2. Filtra números pares
3. Filtra usuarios con email válido

### Solución Esperada

```typescript
import { of } from 'rxjs';
import { filter } from 'rxjs/operators';

// Números pares
const numbers$ = of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

numbers$.pipe(
  filter(n => n % 2 === 0)
).subscribe({
  next: value => console.log('Par:', value)
});
// Output: 2, 4, 6, 8, 10

// Usuarios con email válido
const users$ = of<User>(
  { id: 1, name: 'Juan', email: 'juan@test.com' },
  { id: 2, name: 'María', email: '' },  // Sin email
  { id: 3, name: 'Pedro', email: 'pedro@test.com' },
  { id: 4, name: 'Ana', email: null }   // Email null
);

users$.pipe(
  filter(user => user.email && user.email.includes('@'))
).subscribe({
  next: user => console.log('Usuario válido:', user.name)
});
// Output: Juan, Pedro
```

---

## Ejercicio 6: Operadores Básicos - tap

### Instrucciones

1. Usa el operador `tap` para debugging
2. Loguea valores antes y después de transformar
3. No modifiques el stream, solo observa

### Solución Esperada

```typescript
import { of } from 'rxjs';
import { tap, map } from 'rxjs/operators';

const numbers$ = of(1, 2, 3, 4, 5);

numbers$.pipe(
  // Log antes de transformar
  tap(value => console.log('📥 Antes:', value)),
  
  // Transformar
  map(value => value * 10),
  
  // Log después de transformar
  tap(value => console.log('📤 Después:', value))
).subscribe({
  next: value => console.log('✅ Final:', value)
});

// Output:
// 📥 Antes: 1
// 📤 Después: 10
// ✅ Final: 10
// 📥 Antes: 2
// 📤 Después: 20
// ✅ Final: 20
// ... etc
```

---

## Ejercicio 7: Combinando Operadores

### Instrucciones

1. Combina `filter`, `map` y `tap` en un solo pipe
2. Filtra usuarios activos
3. Transforma a nombres en mayúsculas
4. Loguea cada paso

### Solución Esperada

```typescript
import { of } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

interface User {
  id: number;
  name: string;
  active: boolean;
}

const users$ = of<User>(
  { id: 1, name: 'Juan', active: true },
  { id: 2, name: 'María', active: false },
  { id: 3, name: 'Pedro', active: true },
  { id: 4, name: 'Ana', active: false },
  { id: 5, name: 'Luis', active: true }
);

users$.pipe(
  // Debug: mostrar todos
  tap(user => console.log('📥 Input:', user.name, 'activo:', user.active)),
  
  // Filtrar solo activos
  filter(user => user.active),
  
  // Debug: mostrar filtrados
  tap(user => console.log('🔍 Filtrado:', user.name)),
  
  // Transformar a mayúsculas
  map(user => user.name.toUpperCase()),
  
  // Debug: mostrar transformados
  tap(name => console.log('📤 Output:', name))
).subscribe({
  next: name => console.log('✅ Resultado:', name)
});

// Output:
// 📥 Input: Juan activo: true
// 🔍 Filtrado: Juan
// 📤 Output: JUAN
// ✅ Resultado: JUAN
// 📥 Input: María activo: false
// (María no pasa el filtro)
// 📥 Input: Pedro activo: true
// 🔍 Filtrado: Pedro
// 📤 Output: PEDRO
// ✅ Resultado: PEDRO
// ... etc
```

---

## Ejercicio 8: debounceTime para Búsqueda

### Instrucciones

1. Implementa búsqueda con debounce
2. Espera 300ms antes de emitir
3. Filtra búsquedas vacías

### Solución Esperada

```typescript
import { fromEvent } from 'rxjs';
import { debounceTime, map, filter, distinctUntilChanged } from 'rxjs/operators';

// En un componente
export class SearchComponent {
  private searchInput = document.getElementById('search') as HTMLInputElement;
  
  setupSearch(): void {
    fromEvent<InputEvent>(this.searchInput, 'input').pipe(
      // Obtener valor del input
      map(event => (event.target as HTMLInputElement).value),
      
      // Esperar 300ms
      debounceTime(300),
      
      // Ignorar si no cambió
      distinctUntilChanged(),
      
      // Filtrar vacíos
      filter(value => value.length >= 2),
      
      // Debug
      tap(value => console.log('Buscando:', value))
    ).subscribe({
      next: searchTerm => this.performSearch(searchTerm)
    });
  }
  
  private performSearch(term: string): void {
    console.log('Ejecutando búsqueda:', term);
    // Llamar API...
  }
}
```

---

## Validación Final

### Checklist

- [ ] Usé BehaviorSubject para estado con valor inicial
- [ ] Usé Subject para eventos sin valor inicial
- [ ] Usé ReplaySubject para historial
- [ ] Usé `map` para transformar valores
- [ ] Usé `filter` para filtrar valores
- [ ] Usé `tap` para debugging
- [ ] Combiné operadores en un pipe
- [ ] Usé `debounceTime` para búsqueda

### Comandos de Verificación

```bash
# Ejecutar tests
npm test

# Verificar sintaxis
npx tsc --noEmit
```

---

## Siguiente Paso

Continúa con la [Evaluación](../assessment/preguntas.md) para verificar tu comprensión del tema.

---

*Lab 02 - Subjects y Operadores*
*Curso Angular 21 - UyuniAdmin Frontend*
