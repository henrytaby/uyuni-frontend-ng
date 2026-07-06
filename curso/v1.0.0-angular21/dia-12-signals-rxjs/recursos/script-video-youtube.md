# Día 12: Script de Video YouTube - Estado con Signals y RxJS

## Información del Video

- **Título:** "Angular Signals + RxJS: El Patrón Híbrido que NECESITAS conocer"
- **Duración:** 18-22 minutos
- **Categoría:** Educación / Programación
- **Tags:** Angular, Signals, RxJS, TypeScript, Tutorial

---

## Estructura del Video

| Tiempo | Sección | Duración |
|--------|---------|----------|
| 0:00 | Intro y Hook | 1 min |
| 1:00 | Contexto | 2 min |
| 3:00 | toSignal | 4 min |
| 7:00 | toObservable | 4 min |
| 11:00 | Patrón Híbrido | 4 min |
| 15:00 | Error Común | 2 min |
| 17:00 | Mini Reto | 2 min |
| 19:00 | Cierre | 1 min |

---

## Guión Detallado

### 0:00 - Intro y Hook

**[Cámara: Primer plano, fondo oscuro con logo Angular]**

**Narrador:** "¿Alguna vez te has preguntado cómo combinar Signals y RxJS en Angular? Hoy voy a mostrarte el patrón híbrido que usamos en aplicaciones enterprise para manejar estado de forma efectiva."

**[B-Roll: Código en pantalla mostrando toSignal y toObservable]**

**Narrador:** "En los próximos 20 minutos, aprenderás a usar `toSignal` para convertir Observables en Signals, `toObservable` para lo contrario, y un patrón de búsqueda con debounce que puedes usar en tus proyectos hoy mismo."

**[Cámara: Vuelve al presentador]**

**Narrador:** "Soy [Tu Nombre] y este es el Día 12 del Curso de Angular 21. ¡Vamos allá!"

---

### 1:00 - Contexto

**[Cámara: Presentador con pantalla de código al lado]**

**Narrador:** "Primero, entendamos el problema. Tienes dos herramientas para manejar estado en Angular: Signals y RxJS."

**[Gráfico animado: Split screen con Signals a la izquierda y RxJS a la derecha]**

**Narrador:** "Signals son perfectas para estado síncrono. Son simples, no requieren suscripciones, y se integran perfectamente con los templates."

**Narrador:** "RxJS es ideal para flujos asíncronos: HTTP, eventos de usuario, WebSockets. Tiene operadores poderosos como `debounceTime` y `switchMap`."

**[Pausa - 1 segundo]**

**Narrador:** "Pero... ¿qué pasa cuando necesitas ambos? Por ejemplo, una búsqueda con debounce que carga datos de una API y los muestra en el template."

**[Código en pantalla: Diagrama del flujo]**

**Narrador:** "La respuesta es el patrón híbrido: Signal para el input, toObservable para aplicar operadores RxJS, HTTP para la petición, y toSignal para el resultado."

---

### 3:00 - toSignal

**[Cámara: Pantalla de código]**

**Narrador:** "Vamos a ver `toSignal` en detalle. Esta función convierte un Observable en una Signal de solo lectura."

**[Código aparece en pantalla]**

```typescript
import { toSignal } from '@angular/core/rxjs-interop';

// Sin valor inicial
users = toSignal(this.http.get<User[]>('/api/users'));

// Con valor inicial
users = toSignal(
  this.http.get<User[]>('/api/users'),
  { initialValue: [] }
);
```

**Narrador:** "La primera versión tiene un problema: antes de que el Observable emita, la Signal es `undefined`. Por eso recomendamos siempre usar `initialValue`."

**[Pausa - 1 segundo]**

**Narrador:** "Otro punto importante: el manejo de errores. Si el Observable falla, la Signal no se actualiza. Necesitas usar `catchError`."

**[Código actualizado]**

```typescript
users = toSignal(
  this.http.get<User[]>('/api/users').pipe(
    catchError(() => of([]))
  ),
  { initialValue: [] }
);
```

**Narrador:** "Ahora, si la petición falla, la Signal tiene un array vacío en lugar de causar un error."

**[Cámara: Vuelve al presentador]**

**Narrador:** "La ventaja principal: no necesitas el async pipe ni suscripciones manuales. Solo usas `users()` en el template."

---

### 7:00 - toObservable

**[Cámara: Pantalla de código]**

**Narrador:** "Ahora veamos `toObservable`. Esta función convierte una Signal en un Observable."

**[Código aparece en pantalla]**

```typescript
import { toObservable } from '@angular/core/rxjs-interop';

searchTerm = signal('');

searchTerm$ = toObservable(this.searchTerm);
```

**Narrador:** "¿Por qué harías esto? Porque Signals no tienen operadores como `debounceTime`."

**[Código se expande]**

```typescript
searchResults$ = toObservable(this.searchTerm).pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(term => this.http.get(`/api/search?q=${term}`))
);
```

**Narrador:** "Aquí está la magia: convertimos la Signal a Observable, aplicamos debounce, evitamos duplicados, y hacemos la petición HTTP con switchMap."

**[Pausa - 1 segundo]**

**Narrador:** "Pero espera, esto devuelve un Observable. ¿Cómo lo usamos en el template?"

---

### 11:00 - Patrón Híbrido

**[Cámara: Pantalla de código completa]**

**Narrador:** "Aquí está el patrón híbrido completo:"

**[Código aparece en pantalla]**

```typescript
@Injectable({ providedIn: 'root' })
export class SearchService {
  private http = inject(HttpClient);
  
  // 1. Signal para el input
  searchTerm = signal('');
  
  // 2. Pipeline RxJS
  private results$ = toObservable(this.searchTerm).pipe(
    debounceTime(300),
    filter(term => term.length >= 2),
    distinctUntilChanged(),
    switchMap(term => 
      this.http.get<Result[]>(`/api/search?q=${term}`).pipe(
        catchError(() => of([]))
      )
    )
  );
  
  // 3. Signal para el resultado
  results = toSignal(this.results$, { initialValue: [] });
  
  // 4. Computed para valores derivados
  resultCount = computed(() => this.results().length);
  hasResults = computed(() => this.results().length > 0);
}
```

**Narrador:** "Este es el flujo completo: Signal → toObservable → operadores RxJS → HTTP → toSignal → Signal."

**[Diagrama animado del flujo]**

**Narrador:** "El componente solo ve Signals: `searchTerm` para actualizar, `results` para leer, y `resultCount` para mostrar el total."

**[Código del componente]**

```typescript
@Component({
  template: `
    <input (input)="search.set($event.target.value)" />
    <p>{{ resultCount() }} resultados</p>
    @for (result of results(); track result.id) {
      <p>{{ result.name }}</p>
    }
  `
})
export class SearchComponent {
  search = inject(SearchService);
}
```

**Narrador:** "Sin async pipe, sin suscripciones, sin cleanup. Solo Signals reactivas."

---

### 15:00 - Error Común

**[Cámara: Presentador con fondo rojo]**

**Narrador:** "Ahora, el error más común que veo en code reviews..."

**[Código con error]**

```typescript
// ❌ ERROR: Loop infinito
effect(() => {
  console.log('Count:', this.count());
  this.count.update(c => c + 1); // count está en el effect!
});
```

**Narrador:** "Este código actualiza `count` dentro de un effect que observa `count`. Resultado: loop infinito."

**[Pausa - 1 segundo]**

**Narrador:** "Angular detecta esto y lanza un error, pero es mejor evitarlo desde el diseño."

**[Código corregido]**

```typescript
// ✅ CORRECTO: Usar computed para valores derivados
doubleCount = computed(() => this.count() * 2);

// ✅ CORRECTO: Effect solo para side effects
effect(() => {
  console.log('Count changed:', this.count());
  // NO actualizar count aquí
});
```

**Narrador:** "La regla: `computed` para valores derivados, `effect` para side effects. Nunca actualices una Signal en un effect que la observa."

---

### 17:00 - Mini Reto

**[Cámara: Presentador]**

**Narrador:** "Aquí tienes un mini reto para practicar. Tienes 3 minutos para resolverlo."

**[Pregunta en pantalla]**

**"Implementa un servicio que:**
1. **Tenga una Signal para el término de búsqueda**
2. **Use toObservable con debounceTime(300)**
3. **Haga HTTP con switchMap**
4. **Use toSignal para los resultados**
5. **Tenga un computed para el total de resultados"**

**[Temporizador en pantalla: 3:00]**

**[Pausa para que el espectador intente]**

**[Después de 3 minutos]**

**Narrador:** "¿Lo lograste? Aquí está la solución:"

**[Solución en pantalla]**

```typescript
@Injectable({ providedIn: 'root' })
export class SearchService {
  private http = inject(HttpClient);
  
  searchTerm = signal('');
  
  private results$ = toObservable(this.searchTerm).pipe(
    debounceTime(300),
    filter(term => term.length >= 2),
    switchMap(term => 
      this.http.get<Result[]>(`/api/search?q=${term}`).pipe(
        catchError(() => of([]))
      )
    )
  );
  
  results = toSignal(this.results$, { initialValue: [] });
  totalResults = computed(() => this.results().length);
}
```

---

### 19:00 - Cierre

**[Cámara: Presentador]**

**Narrador:** "Hoy aprendiste el patrón híbrido para combinar Signals y RxJS en Angular."

**Narrador:** "`toSignal` para convertir Observables a Signals, `toObservable` para lo contrario, y el flujo completo para búsquedas con debounce."

**[Pausa - 1 segundo]**

**Narrador:** "Mañana veremos UI con PrimeNG. Aprenderemos a usar componentes enterprise y personalizar temas."

**Narrador:** "Si este video te ayudó, dale like y suscríbete. Los labs y el cheatsheet están en la descripción."

**Narrador:** "¡Nos vemos mañana!"

**[Outro con música y logo del curso]**

---

## Notas de Producción

### Visual

- Usar tema oscuro en el editor
- Fuente grande y legible (JetBrains Mono, 18px)
- Resaltar código importante con bordes o colores
- Usar diagramas animados para flujos

### Audio

- Micrófono de buena calidad
- Sin ruido de fondo
- Volumen consistente
- Pausas naturales entre secciones

### Thumbnails

**Opción 1:**
- Título: "Signals + RxJS"
- Subtítulo: "El Patrón Híbrido"
- Imagen: Código con toSignal y toObservable
- Colores: Rojo Angular + Azul RxJS

**Opción 2:**
- Título: "Angular 21"
- Subtítulo: "Estado Híbrido"
- Imagen: Diagrama del flujo Signal → Observable → Signal
- Colores: Gradiente Angular

### SEO

**Título:** "Angular Signals + RxJS: El Patrón Híbrido que NECESITAS conocer | Tutorial Angular 21"

**Descripción:**
"Aprende a combinar Angular Signals y RxJS usando toSignal y toObservable. Tutorial completo con ejemplo de búsqueda con debounce. Día 12 del Curso de Angular 21.

📌 En este video aprenderás:
- Qué es toSignal y cómo usarlo
- Qué es toObservable y cuándo usarlo
- Patrón híbrido para estado
- Error común con effects
- Mini reto práctico

🔗 Recursos:
- Lab 01: [link]
- Lab 02: [link]
- Cheatsheet: [link]

⏱️ Timestamps:
0:00 - Intro
1:00 - Contexto
3:00 - toSignal
7:00 - toObservable
11:00 - Patrón Híbrido
15:00 - Error Común
17:00 - Mini Reto
19:00 - Cierre

#Angular #Signals #RxJS #TypeScript #Tutorial"

---

*Script de Video YouTube - Día 12 - Curso Angular 21 - UyuniAdmin Frontend*
