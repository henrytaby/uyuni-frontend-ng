# Día 11: Lab 01 - Operadores de Transformación

## Objetivo

Practicar con los operadores de transformación más importantes: `map`, `switchMap`, `mergeMap`, `concatMap` y `exhaustMap`.

## Tiempo Estimado

60 minutos

---

## Ejercicio 1: map - Transformación Simple

### Descripción

Crear un servicio que transforme datos de usuarios.

### Instrucciones

1. Crear el archivo `src/app/core/services/user-transform.service.ts`
2. Implementar transformaciones con `map`

### Código Base

```typescript
// src/app/core/services/user-transform.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
}

export interface UserViewModel {
  id: number;
  fullName: string;
  email: string;
  isAdult: boolean;
  initials: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserTransformService {
  private readonly http = inject(HttpClient);

  // TODO: Implementar transformación a UserViewModel
  getUsers(): Observable<UserViewModel[]> {
    return this.http.get<User[]>('/api/users').pipe(
      // Tu código aquí
    );
  }

  // TODO: Implementar transformación con estadísticas
  getUsersWithStats(): Observable<{ users: UserViewModel[]; averageAge: number }> {
    return this.http.get<User[]>('/api/users').pipe(
      // Tu código aquí
    );
  }
}
```

### Solución

```typescript
// getUsers()
getUsers(): Observable<UserViewModel[]> {
  return this.http.get<User[]>('/api/users').pipe(
    map(users => users.map(user => ({
      id: user.id,
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      isAdult: user.age >= 18,
      initials: `${user.firstName[0]}${user.lastName[0]}`
    })))
  );
}

// getUsersWithStats()
getUsersWithStats(): Observable<{ users: UserViewModel[]; averageAge: number }> {
  return this.http.get<User[]>('/api/users').pipe(
    map(users => {
      const viewModels = users.map(user => ({
        id: user.id,
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        isAdult: user.age >= 18,
        initials: `${user.firstName[0]}${user.lastName[0]}`
      }));
      
      const averageAge = users.reduce((sum, u) => sum + u.age, 0) / users.length;
      
      return { users: viewModels, averageAge };
    })
  );
}
```

---

## Ejercicio 2: switchMap - Búsqueda Reactiva

### Descripción

Implementar un componente de búsqueda que cancele peticiones anteriores.

### Instrucciones

1. Crear el componente `src/app/features/users/pages/user-search/user-search.component.ts`
2. Implementar búsqueda con `switchMap`

### Código Base

```typescript
// src/app/features/users/pages/user-search/user-search.component.ts
import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { fromEvent, Observable } from 'rxjs';
import { map, switchMap, debounceTime, filter, distinctUntilChanged, catchError, of } from 'rxjs/operators';

interface User {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-user-search',
  standalone: true,
  template: `
    <div class="p-6">
      <h2 class="text-xl font-bold mb-4">Buscar Usuarios</h2>
      
      <input 
        #searchInput
        type="text" 
        placeholder="Escribe para buscar..."
        class="w-full p-3 border rounded-lg mb-4"
      />
      
      @if (isLoading()) {
        <p class="text-gray-500">Buscando...</p>
      }
      
      @if (errorMessage()) {
        <p class="text-red-500">{{ errorMessage() }}</p>
      }
      
      <ul class="space-y-2">
        @for (user of users(); track user.id) {
          <li class="p-3 bg-gray-100 rounded">
            {{ user.name }} - {{ user.email }}
          </li>
        }
      </ul>
    </div>
  `
})
export class UserSearchComponent {
  private readonly http = inject(HttpClient);
  
  users = signal<User[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');
  
  // TODO: Implementar búsqueda reactiva
  // Pistas:
  // 1. Usar @ViewChild para obtener el input
  // 2. Usar fromEvent para escuchar el evento 'input'
  // 3. Aplicar debounceTime(300)
  // 4. Aplicar filter para términos vacíos
  // 5. Aplicar distinctUntilChanged
  // 6. Usar switchMap para la petición HTTP
  // 7. Manejar errores con catchError
}
```

### Solución

```typescript
import { Component, inject, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { fromEvent } from 'rxjs';
import { map, switchMap, debounceTime, filter, distinctUntilChanged, catchError, tap, finalize } from 'rxjs/operators';

interface User {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-user-search',
  standalone: true,
  template: `
    <div class="p-6">
      <h2 class="text-xl font-bold mb-4">Buscar Usuarios</h2>
      
      <input 
        #searchInput
        type="text" 
        placeholder="Escribe para buscar..."
        class="w-full p-3 border rounded-lg mb-4"
      />
      
      @if (isLoading()) {
        <p class="text-gray-500">Buscando...</p>
      }
      
      @if (errorMessage()) {
        <p class="text-red-500">{{ errorMessage() }}</p>
      }
      
      <ul class="space-y-2">
        @for (user of users(); track user.id) {
          <li class="p-3 bg-gray-100 rounded">
            {{ user.name }} - {{ user.email }}
          </li>
        }
      </ul>
    </div>
  `
})
export class UserSearchComponent implements AfterViewInit {
  private readonly http = inject(HttpClient);
  
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  
  users = signal<User[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');
  
  ngAfterViewInit(): void {
    this.setupSearch();
  }
  
  private setupSearch(): void {
    fromEvent<InputEvent>(this.searchInput.nativeElement, 'input').pipe(
      map(event => (event.target as HTMLInputElement).value),
      filter(term => term.trim().length >= 2), // Mínimo 2 caracteres
      debounceTime(300), // Esperar 300ms
      distinctUntilChanged(), // Evitar duplicados
      tap(() => {
        this.isLoading.set(true);
        this.errorMessage.set('');
      }),
      switchMap(term => 
        this.http.get<User[]>(`/api/users/search?q=${term}`).pipe(
          catchError(error => {
            this.errorMessage.set('Error al buscar usuarios');
            return of([] as User[]);
          }),
          finalize(() => this.isLoading.set(false))
        )
      )
    ).subscribe(users => {
      this.users.set(users);
    });
  }
}
```

---

## Ejercicio 3: mergeMap - Carga Paralela

### Descripción

Cargar detalles de múltiples usuarios en paralelo.

### Instrucciones

1. Crear un método que cargue detalles de varios usuarios simultáneamente
2. Usar `mergeMap` para ejecutar las peticiones en paralelo

### Código Base

```typescript
// src/app/features/users/services/user-detail.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';

interface UserDetail {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserDetailService {
  private readonly http = inject(HttpClient);

  // TODO: Cargar detalles de múltiples usuarios en paralelo
  loadUserDetails(userIds: number[]): Observable<UserDetail[]> {
    // Tu código aquí
    // Pistas:
    // 1. Usar from(userIds)
    // 2. Aplicar mergeMap para cada petición
    // 3. Usar toArray() para agrupar resultados
    // 4. Manejar errores individualmente
  }
}
```

### Solución

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { mergeMap, map, catchError, toArray } from 'rxjs/operators';

interface UserDetail {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserDetailService {
  private readonly http = inject(HttpClient);

  loadUserDetails(userIds: number[]): Observable<UserDetail[]> {
    return from(userIds).pipe(
      mergeMap(id => 
        this.http.get<UserDetail>(`/api/users/${id}`).pipe(
          catchError(error => {
            console.error(`Error loading user ${id}:`, error);
            return of(null); // Retornar null para usuarios con error
          })
        )
      ),
      // Filtrar usuarios null (que tuvieron error)
      map(user => user !== null),
      toArray() // Agrupar todos los resultados en un array
    );
  }

  // Versión alternativa con límite de concurrencia
  loadUserDetailsWithConcurrency(userIds: number[], maxConcurrent = 3): Observable<UserDetail[]> {
    return from(userIds).pipe(
      mergeMap(id => 
        this.http.get<UserDetail>(`/api/users/${id}`).pipe(
          catchError(error => of(null))
        ),
        maxConcurrent // Limitar a 3 peticiones simultáneas
      ),
      map((user): user is UserDetail => user !== null),
      toArray()
    );
  }
}
```

---

## Ejercicio 4: concatMap - Operaciones Secuenciales

### Descripción

Guardar una lista de usuarios en orden, uno después de otro.

### Instrucciones

1. Implementar un método que guarde usuarios secuencialmente
2. Usar `concatMap` para garantizar el orden

### Código Base

```typescript
// src/app/features/users/services/user-save.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { concatMap, map, toArray } from 'rxjs/operators';

interface User {
  id?: number;
  name: string;
  email: string;
}

interface SaveResult {
  user: User;
  success: boolean;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserSaveService {
  private readonly http = inject(HttpClient);

  // TODO: Guardar usuarios en orden secuencial
  saveUsersSequentially(users: User[]): Observable<SaveResult[]> {
    // Tu código aquí
    // Pistas:
    // 1. Usar from(users)
    // 2. Aplicar concatMap para cada petición
    // 3. Manejar errores sin detener el proceso
    // 4. Usar toArray() para agrupar resultados
  }
}
```

### Solución

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { concatMap, map, toArray, catchError } from 'rxjs/operators';

interface User {
  id?: number;
  name: string;
  email: string;
}

interface SaveResult {
  user: User;
  success: boolean;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserSaveService {
  private readonly http = inject(HttpClient);

  saveUsersSequentially(users: User[]): Observable<SaveResult[]> {
    return from(users).pipe(
      concatMap(user => 
        this.http.post<User>('/api/users', user).pipe(
          map(savedUser => ({
            user: savedUser,
            success: true
          })),
          catchError(error => of({
            user,
            success: false,
            error: error.message || 'Error al guardar'
          }))
        )
      ),
      toArray()
    );
  }

  // Versión con logging de progreso
  saveUsersWithProgress(users: User[]): Observable<SaveResult> {
    return from(users).pipe(
      concatMap((user, index) => 
        this.http.post<User>('/api/users', user).pipe(
          map(savedUser => {
            console.log(`Guardado ${index + 1}/${users.length}: ${savedUser.name}`);
            return {
              user: savedUser,
              success: true
            } as SaveResult;
          }),
          catchError(error => {
            console.error(`Error en ${index + 1}/${users.length}: ${user.name}`);
            return of({
              user,
              success: false,
              error: error.message
            } as SaveResult);
          })
        )
      )
    );
  }
}
```

---

## Ejercicio 5: exhaustMap - Prevenir Spam

### Descripción

Implementar un botón de guardar que ignore clicks múltiples.

### Instrucciones

1. Crear un componente con un formulario
2. Usar `exhaustMap` para prevenir múltiples submits

### Código Base

```typescript
// src/app/features/forms/pages/user-form/user-form.component.ts
import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { fromEvent } from 'rxjs';
import { exhaustMap, tap, finalize } from 'rxjs/operators';

interface FormData {
  name: string;
  email: string;
}

@Component({
  selector: 'app-user-form',
  standalone: true,
  template: `
    <div class="p-6 max-w-md mx-auto">
      <h2 class="text-xl font-bold mb-4">Crear Usuario</h2>
      
      <form #form class="space-y-4">
        <div>
          <label class="block mb-1">Nombre</label>
          <input 
            name="name" 
            type="text" 
            class="w-full p-2 border rounded"
            [(ngModel)]="formData.name"
          />
        </div>
        
        <div>
          <label class="block mb-1">Email</label>
          <input 
            name="email" 
            type="email" 
            class="w-full p-2 border rounded"
            [(ngModel)]="formData.email"
          />
        </div>
        
        <button 
          #submitBtn
          type="button"
          class="w-full p-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          [disabled]="isSubmitting()">
          {{ isSubmitting() ? 'Guardando...' : 'Guardar' }}
        </button>
      </form>
      
      @if (successMessage()) {
        <p class="mt-4 text-green-600">{{ successMessage() }}</p>
      }
    </div>
  `
})
export class UserFormComponent {
  private readonly http = inject(HttpClient);
  
  formData: FormData = { name: '', email: '' };
  isSubmitting = signal(false);
  successMessage = signal('');
  
  // TODO: Implementar submit con exhaustMap
  // Pistas:
  // 1. Usar @ViewChild para obtener el botón
  // 2. Usar fromEvent para escuchar clicks
  // 3. Aplicar exhaustMap para ignorar clicks mientras guarda
}
```

### Solución

```typescript
import { Component, inject, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { fromEvent } from 'rxjs';
import { exhaustMap, tap, finalize } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

interface FormData {
  name: string;
  email: string;
}

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="p-6 max-w-md mx-auto">
      <h2 class="text-xl font-bold mb-4">Crear Usuario</h2>
      
      <form #form class="space-y-4">
        <div>
          <label class="block mb-1">Nombre</label>
          <input 
            name="name" 
            type="text" 
            class="w-full p-2 border rounded"
            [(ngModel)]="formData.name"
          />
        </div>
        
        <div>
          <label class="block mb-1">Email</label>
          <input 
            name="email" 
            type="email" 
            class="w-full p-2 border rounded"
            [(ngModel)]="formData.email"
          />
        </div>
        
        <button 
          #submitBtn
          type="button"
          class="w-full p-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          [disabled]="isSubmitting()">
          {{ isSubmitting() ? 'Guardando...' : 'Guardar' }}
        </button>
      </form>
      
      @if (successMessage()) {
        <p class="mt-4 text-green-600">{{ successMessage() }}</p>
      }
    </div>
  `
})
export class UserFormComponent implements AfterViewInit {
  private readonly http = inject(HttpClient);
  
  @ViewChild('submitBtn') submitBtn!: ElementRef<HTMLButtonElement>;
  
  formData: FormData = { name: '', email: '' };
  isSubmitting = signal(false);
  successMessage = signal('');
  
  ngAfterViewInit(): void {
    this.setupSubmit();
  }
  
  private setupSubmit(): void {
    fromEvent(this.submitBtn.nativeElement, 'click').pipe(
      tap(() => {
        this.isSubmitting.set(true);
        this.successMessage.set('');
      }),
      exhaustMap(() => 
        this.http.post('/api/users', this.formData).pipe(
          finalize(() => this.isSubmitting.set(false))
        )
      )
    ).subscribe({
      next: (response) => {
        this.successMessage.set('¡Usuario creado exitosamente!');
        this.formData = { name: '', email: '' };
      },
      error: (error) => {
        console.error('Error:', error);
        // El error se maneja aquí, pero exhaustMap permite nuevos intentos
      }
    });
  }
}
```

---

## Reto Final: Combinar Operadores

### Descripción

Implementar un flujo completo de búsqueda con todas las mejores prácticas.

### Requisitos

1. Debounce de 300ms
2. Filtrar términos vacíos
3. Cancelar peticiones anteriores
4. Mostrar loading
5. Manejar errores
6. Limitar resultados a 10
7. Transformar resultados

### Código Base

```typescript
// Implementa tu solución aquí
searchUsers(): void {
  // Tu código aquí
}
```

### Solución

```typescript
searchUsers(): void {
  fromEvent<InputEvent>(this.searchInput.nativeElement, 'input').pipe(
    // 1. Obtener valor del input
    map(event => (event.target as HTMLInputElement).value),
    
    // 2. Filtrar términos vacíos
    filter(term => term.trim().length >= 2),
    
    // 3. Debounce para evitar spam
    debounceTime(300),
    
    // 4. Evitar duplicados
    distinctUntilChanged(),
    
    // 5. Mostrar loading
    tap(() => {
      this.isLoading.set(true);
      this.errorMessage.set('');
    }),
    
    // 6. Cancelar peticiones anteriores
    switchMap(term => 
      this.http.get<User[]>(`/api/users/search?q=${term}`).pipe(
        // 7. Limitar resultados
        map(users => users.slice(0, 10)),
        
        // 8. Transformar resultados
        map(users => users.map(user => ({
          ...user,
          displayName: `${user.name} (${user.email})`
        }))),
        
        // 9. Manejar errores
        catchError(error => {
          this.errorMessage.set('Error al buscar. Intenta nuevamente.');
          return of([]);
        }),
        
        // 10. Ocultar loading
        finalize(() => this.isLoading.set(false))
      )
    )
  ).subscribe(users => {
    this.users.set(users);
  });
}
```

---

## Criterios de Evaluación

| Criterio | Puntos |
|----------|--------|
| Ejercicio 1: map | 20 pts |
| Ejercicio 2: switchMap | 20 pts |
| Ejercicio 3: mergeMap | 20 pts |
| Ejercicio 4: concatMap | 20 pts |
| Ejercicio 5: exhaustMap | 20 pts |
| **Total** | **100 pts** |

---

*Lab 01 - Día 11 - Curso Angular 21 - UyuniAdmin Frontend*
