# Día 12: Estado con Signals y RxJS - Integración

## 📋 Información General

- **Duración:** 6 horas
- **Módulo:** 4 - RxJS y Estado Avanzado
- **Prerrequisitos:** Día 10 (RxJS Fundamentos), Día 11 (RxJS Operadores)
- **Nivel:** Intermedio-Avanzado

## 🎯 Objetivos de Aprendizaje

Al finalizar este día, el estudiante será capaz de:

1. **Integrar Signals con Observables** usando `toSignal()` y `toObservable()`
2. **Crear estado reactivo híbrido** combinando Signals y RxJS
3. **Implementar patrones de estado** con Signals en servicios
4. **Usar computed signals** con datos de Observables
5. **Gestionar efectos** con Signals para side effects
6. **Optimizar rendimiento** con el enfoque híbrido

## 📚 Contenido

### Teoría
- [Contenido Detallado](./contenido.md) - Material teórico completo
- [Presentación](./slides/dia-12-signals-rxjs_Marp.md) - Slides para la clase

### Práctica
- [Lab 01: toSignal y toObservable](./ejercicios/lab-01.md) - Conversión entre Signals y Observables
- [Lab 02: Estado Híbrido](./ejercicios/lab-02.md) - Patrones de estado con Signals y RxJS

### Evaluación
- [Preguntas de Assessment](./assessment/preguntas.md) - Evaluación del día

### Recursos
- [Bibliografía](./recursos/bibliografia.md) - Enlaces y referencias
- [Cheatsheet](./recursos/cheatsheet.md) - Referencia rápida
- [Script Audio](./recursos/script-audio.md) - Guion para podcast
- [Script Video YouTube](./recursos/script-video-youtube.md) - Guion para video

## 🗓️ Cronograma

| Hora | Actividad | Duración |
|------|-----------|----------|
| 0:00 - 0:30 | Hook y Contexto | 30 min |
| 0:30 - 1:30 | toSignal y toObservable | 60 min |
| 1:30 - 2:30 | Estado con Signals en Servicios | 60 min |
| 2:30 - 3:00 | Break | 30 min |
| 3:00 - 4:00 | Computed Signals con Observables | 60 min |
| 4:00 - 5:00 | Effects y Side Effects | 60 min |
| 5:00 - 5:30 | Mini Reto | 30 min |
| 5:30 - 6:00 | Cierre y Q&A | 30 min |

## 🎨 Estructura de Clase

### 1. Hook (0:00 - 0:15)
**Pregunta provocadora:** "¿Cómo combinas el estado local de Signals con datos asíncronos de RxJS?"

**Problema real:**
```typescript
// ❌ El problema: dos sistemas de estado separados
export class UserService {
  // Signals para estado local
  selectedUserId = signal<number | null>(null);
  
  // RxJS para HTTP
  users$ = this.http.get<User[]>('/api/users');
  
  // ¿Cómo combinarlos?
}
```

**Solución híbrida:**
```typescript
// ✅ Integración con toSignal
export class UserService {
  private readonly http = inject(HttpClient);
  
  selectedUserId = signal<number | null>(null);
  
  // Convertir Observable a Signal
  users = toSignal(this.http.get<User[]>('/api/users'), { initialValue: [] });
  
  // Computed que combina ambos
  selectedUser = computed(() => 
    this.users().find(u => u.id === this.selectedUserId())
  );
}
```

### 2. Contexto (0:15 - 0:30)
- Repaso de Signals (Día 1)
- Repaso de RxJS (Días 10-11)
- ¿Por qué integrarlos?
- Ventajas del enfoque híbrido

### 3. Explicación Simple (0:30 - 1:30)
Ver [contenido.md](./contenido.md) para detalle completo.

### 4. Demo/Código (1:30 - 4:00)
Ver [lab-01.md](./ejercicios/lab-01.md) y [lab-02.md](./ejercicios/lab-02.md).

### 5. Errores Comunes (4:00 - 4:30)
1. Usar `toSignal` sin valor inicial
2. Suscripciones manuales en lugar de Signals
3. No manejar errores en Observables convertidos
4. Effects infinitos

### 6. Mini Reto (5:00 - 5:30)
Implementar un servicio de búsqueda que:
- Use Signals para el término de búsqueda
- Use RxJS para la petición HTTP
- Combine ambos con toSignal
- Muestre resultados con computed

### 7. Cierre (5:30 - 6:00)
- Resumen de integración Signals + RxJS
- Cuándo usar cada enfoque
- Recursos adicionales
- Preview del Día 13

## 📊 API de Integración

### toSignal
```typescript
import { toSignal } from '@angular/core/rxjs-interop';

// Convierte Observable a Signal
users = toSignal(this.http.get<User[]>('/api/users'));

// Con valor inicial
users = toSignal(this.http.get<User[]>('/api/users'), { 
  initialValue: [] 
});

// Con manejo de errores
users = toSignal(
  this.http.get<User[]>('/api/users').pipe(
    catchError(() => of([]))
  ),
  { initialValue: [] }
);
```

### toObservable
```typescript
import { toObservable } from '@angular/core/rxjs-interop';

// Convierte Signal a Observable
searchTerm$ = toObservable(this.searchTerm);

// Usar con operadores RxJS
results$ = toObservable(this.searchTerm).pipe(
  debounceTime(300),
  switchMap(term => this.http.get(`/api/search?q=${term}`))
);
```

## 🔗 Conexión con el Proyecto

En UyuniAdmin, la integración se usa extensivamente:

### auth.service.ts
```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenRefreshService = inject(TokenRefreshService);
  
  // Signals para estado síncrono
  isAuthenticated = signal<boolean>(false);
  currentUser = signal<User | null>(null);
  roles = signal<Role[]>([]);
  activeRole = signal<Role | null>(null);
  isLoading = signal<boolean>(false);
  
  // Signal derivado del estado
  accessToken = signal<string | null>(null);
  
  // Método que usa RxJS internamente pero actualiza Signals
  login(username: string, password: string): Observable<void> {
    this.isLoading.set(true);
    
    return this.http.post<LoginResponse>('/auth/login', credentials).pipe(
      tap(response => {
        // Actualizar Signals
        this.accessToken.set(response.access_token);
        this.isAuthenticated.set(true);
      }),
      switchMap(() => this.loadProfile()),
      finalize(() => this.isLoading.set(false))
    );
  }
}
```

### Componente con estado híbrido
```typescript
@Component({
  template: `
    @if (isLoading()) {
      <app-loading />
    }
    
    @for (user of filteredUsers(); track user.id) {
      <div>{{ user.name }}</div>
    }
  `
})
export class UserListComponent {
  private readonly userService = inject(UserService);
  
  // Signal para filtro local
  filter = signal('');
  
  // Signal desde Observable
  users = toSignal(this.userService.getUsers(), { initialValue: [] });
  
  // Computed que combina ambos
  filteredUsers = computed(() => 
    this.users().filter(u => 
      u.name.toLowerCase().includes(this.filter().toLowerCase())
    )
  );
  
  // Signal para estado de UI
  isLoading = signal(false);
}
```

## 📝 Prerrequisitos

- Haber completado el Día 10 (RxJS Fundamentos)
- Haber completado el Día 11 (RxJS Operadores)
- Conocer Angular Signals básico
- Entender el concepto de estado reactivo

## 🚀 Después de este Día

El Día 13 cubrirá:
- UI con PrimeNG
- Componentes de PrimeNG v21
- Integración con Signals
- Temas y personalización

## 📖 Referencias

- [Angular Signals](https://angular.dev/guide/signals)
- [RxJS Interop](https://angular.dev/guide/signals/rxjs-interop)
- [toSignal API](https://angular.dev/api/core/rxjs-interop/toSignal)
- [toObservable API](https://angular.dev/api/core/rxjs-interop/toObservable)

---

*Día 12 - Curso Angular 21 - UyuniAdmin Frontend*
*Versión: 1.0.0*
