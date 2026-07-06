# Assessment - Día 2: Arquitectura DDD Lite

## Instrucciones

- **Total de preguntas**: 50
- **Tiempo estimado**: 30 minutos
- **Puntuación mínima**: 70% (35 respuestas correctas)

---

## Sección 1: DDD Lite (10 preguntas)

### Pregunta 1

**¿Qué significa DDD?**

A) Data-Driven Design  
B) Domain-Driven Development  
C) Domain-Driven Design  
D) Database-Driven Design  

<details>
<summary>Respuesta</summary>

**C) Domain-Driven Design**

DDD fue propuesto por Eric Evans en 2003 y se centra en el dominio del problema.
</details>

---

### Pregunta 2

**¿Cuál es la principal diferencia entre DDD completo y DDD Lite?**

A) DDD Lite no usa entidades  
B) DDD Lite es más simple y pragmático  
C) DDD Lite no requiere servicios  
D) DDD Lite solo funciona con Angular  

<details>
<summary>Respuesta</summary>

**B) DDD Lite es más simple y pragmático**

DDD Lite simplifica los conceptos de DDD para aplicaciones CRUD/Enterprise, sin eventos de dominio ni agregados complejos.
</details>

---

### Pregunta 3

**En el mapeo DDD → Angular, ¿qué concepto DDD corresponde a un Feature Module?**

A) Entity  
B) Value Object  
C) Bounded Context  
D) Repository  

<details>
<summary>Respuesta</summary>

**C) Bounded Context**

Un Bounded Context en DDD se mapea a un Feature Module en Angular, representando un área delimitada del dominio.
</details>

---

### Pregunta 4

**¿Dónde se ubican los servicios globales en la arquitectura DDD Lite de Angular?**

A) En features/  
B) En core/  
C) En shared/  
D) En app/  

<details>
<summary>Respuesta</summary>

**B) En core/**

Los servicios globales (singletons) como AuthService, ConfigService se ubican en `core/`.
</details>

---

### Pregunta 5

**¿Cuál es la regla de dependencia para Core?**

A) Core puede importar de Features  
B) Core puede importar de Shared  
C) Core NO puede importar de Features ni Shared  
D) Core puede importar de cualquier módulo  

<details>
<summary>Respuesta</summary>

**C) Core NO puede importar de Features ni Shared**

Core es la capa base y no debe depender de las capas superiores.
</details>

---

### Pregunta 6

**¿Qué tipo de componentes se encuentran en shared/?**

A) Smart Components  
B) Dumb Components reutilizables  
C) Pages  
D) Services  

<details>
<summary>Respuesta</summary>

**B) Dumb Components reutilizables**

Shared contiene componentes UI reutilizables como botones, inputs, modales.
</details>

---

### Pregunta 7

**¿Cuál es la estructura correcta de una feature?**

A) feature/pages/components/services/models  
B) feature/pages/components/services/models/routes  
C) feature/smart/dumb/services/models  
D) feature/components/services/models  

<details>
<summary>Respuesta</summary>

**B) feature/pages/components/services/models/routes**

Una feature tiene: pages (Smart), components (Dumb), services, models y routes.
</details>

---

### Pregunta 8

**¿Qué es un Value Object en DDD?**

A) Un objeto con identidad  
B) Un objeto inmutable sin identidad  
C) Un servicio  
D) Un repositorio  

<details>
<summary>Respuesta</summary>

**B) Un objeto inmutable sin identidad**

Los Value Objects no tienen identidad y son inmutables, como una dirección o un rango de fechas.
</details>

---

### Pregunta 9

**En Angular, ¿cómo se representa típicamente un Value Object?**

A) Como un servicio  
B) Como una interface TypeScript  
C) Como un componente  
D) Como un módulo  

<details>
<summary>Respuesta</summary>

**B) Como una interface TypeScript**

En DDD Lite, los Value Objects se representan como interfaces TypeScript inmutables.
</details>

---

### Pregunta 10

**¿Por qué DDD Lite es apropiado para aplicaciones Angular?**

A) Porque es el único soportado  
B) Porque balancea estructura y velocidad de desarrollo  
C) Porque es más fácil que no usar arquitectura  
D) Porque lo requiere Angular CLI  

<details>
<summary>Respuesta</summary>

**B) Porque balancea estructura y velocidad de desarrollo**

DDD Lite proporciona estructura sin la complejidad del DDD completo, ideal para aplicaciones enterprise.
</details>

---

## Sección 2: Smart vs Dumb Components (15 preguntas)

### Pregunta 11

**¿Qué caracteriza a un Smart Component?**

A) No tiene servicios  
B) Solo recibe inputs  
C) Contiene lógica de negocio y coordina componentes  
D) Solo presenta información  

<details>
<summary>Respuesta</summary>

**C) Contiene lógica de negocio y coordina componentes**

Los Smart Components tienen lógica de negocio, inyectan servicios y coordinan Dumb Components.
</details>

---

### Pregunta 12

**¿Dónde se ubican típicamente los Smart Components?**

A) En /components/  
B) En /pages/  
C) En /services/  
D) En /core/  

<details>
<summary>Respuesta</summary>

**B) En /pages/**

Los Smart Components (páginas) se ubican en `/pages/` dentro de cada feature.
</details>

---

### Pregunta 13

**¿Qué caracteriza a un Dumb Component?**

A) Inyecta servicios HTTP  
B) Maneja estado global  
C) Solo presenta información y emite eventos  
D) Contiene lógica de navegación  

<details>
<summary>Respuesta</summary>

**C) Solo presenta información y emite eventos**

Los Dumb Components solo presentan información, reciben inputs y emiten outputs.
</details>

---

### Pregunta 14

**¿Cuál es la analogía correcta para Smart vs Dumb?**

A) Smart = Vista, Dumb = Controlador  
B) Smart = Gerente, Dumb = Trabajador  
C) Smart = Modelo, Dumb = Vista  
D) Smart = Servicio, Dumb = Componente  

<details>
<summary>Respuesta</summary>

**B) Smart = Gerente, Dumb = Trabajador**

El Smart Component (gerente) coordina y toma decisiones, el Dumb Component (trabajador) ejecuta tareas específicas.
</details>

---

### Pregunta 15

**¿Qué código representa un Dumb Component?**

A)
```typescript
@Component({...})
export class UserCard {
  private userService = inject(UserService);
  deleteUser() { this.userService.delete(); }
}
```

B)
```typescript
@Component({...})
export class UserCard {
  readonly user = input.required<User>();
  readonly deleteClick = output<number>();
}
```

C)
```typescript
@Component({...})
export class UserCard {
  users = signal<User[]>([]);
  ngOnInit() { this.loadUsers(); }
}
```

D)
```typescript
@Component({...})
export class UserCard {
  constructor(private router: Router) {}
}
```

<details>
<summary>Respuesta</summary>

**B)**
```typescript
@Component({...})
export class UserCard {
  readonly user = input.required<User>();
  readonly deleteClick = output<number>();
}
```

Un Dumb Component solo recibe inputs y emite outputs, sin servicios.
</details>

---

### Pregunta 16

**¿Cuándo usar un Smart Component?**

A) Para mostrar un botón reutilizable  
B) Para una página que coordina múltiples componentes  
C) Para un input de formulario  
D) Para una tarjeta de información  

<details>
<summary>Respuesta</summary>

**B) Para una página que coordina múltiples componentes**

Los Smart Components se usan para páginas completas que coordinan múltiples Dumb Components.
</details>

---

### Pregunta 17

**¿Cuándo usar un Dumb Component?**

A) Para una página de login  
B) Para el dashboard principal  
C) Para un componente de tarjeta reutilizable  
D) Para un servicio de autenticación  

<details>
<summary>Respuesta</summary>

**C) Para un componente de tarjeta reutilizable**

Los Dumb Components son ideales para componentes UI reutilizables.
</details>

---

### Pregunta 18

**¿Qué NO debe tener un Dumb Component?**

A) @Input decorators  
B) @Output decorators  
C) Servicios inyectados  
D) Template HTML  

<details>
<summary>Respuesta</summary>

**C) Servicios inyectados**

Los Dumb Components NO deben inyectar servicios, solo reciben datos via inputs.
</details>

---

### Pregunta 19

**¿Por qué es importante separar Smart y Dumb?**

A) Para que el código sea más largo  
B) Para mejorar testabilidad y reutilización  
C) Porque lo requiere Angular  
D) Para usar más archivos  

<details>
<summary>Respuesta</summary>

**B) Para mejorar testabilidad y reutilización**

La separación mejora la testabilidad (Dumb es fácil de probar) y reutilización (Dumb se puede usar en múltiples lugares).
</details>

---

### Pregunta 20

**En el proyecto UyuniAdmin, ¿qué es SignInComponent?**

A) Dumb Component  
B) Smart Component  
C) Service  
D) Model  

<details>
<summary>Respuesta</summary>

**B) Smart Component**

SignInComponent está en `/pages/`, inyecta AuthService y Router, y coordina SignInFormComponent.
</details>

---

### Pregunta 21

**En el proyecto UyuniAdmin, ¿qué es SignInFormComponent?**

A) Smart Component  
B) Dumb Component  
C) Service  
D) Guard  

<details>
<summary>Respuesta</summary>

**B) Dumb Component**

SignInFormComponent está en `/components/`, solo recibe inputs y emite outputs.
</details>

---

### Pregunta 22

**¿Cómo se comunica un Dumb Component con su padre?**

A) Inyectando un servicio compartido  
B) A través de @Output events  
C) Modificando variables globales  
D) Usando localStorage  

<details>
<summary>Respuesta</summary>

**B) A través de @Output events**

Los Dumb Components se comunican con el padre emitiendo eventos via @Output.
</details>

---

### Pregunta 23

**¿Qué patrón usa un Smart Component para manejar estado?**

A) Variables globales  
B) Signals o RxJS  
C) localStorage  
D) URL parameters  

<details>
<summary>Respuesta</summary>

**B) Signals o RxJS**

Los Smart Components manejan estado con signals (local) o RxJS (async/HTTP).
</details>

---

### Pregunta 24

**¿Qué tipo de tests son más fáciles en Dumb Components?**

A) Tests de integración  
B) Tests E2E  
C) Tests unitarios  
D) Tests de carga  

<details>
<summary>Respuesta</summary>

**C) Tests unitarios**

Los Dumb Components son fáciles de probar unitariamente porque no tienen dependencias.
</details>

---

### Pregunta 25

**¿Puede un Smart Component usar otro Smart Component?**

A) No, nunca  
B) Sí, pero no es recomendado  
C) Sí, es común  
D) Solo en casos especiales  

<details>
<summary>Respuesta</summary>

**B) Sí, pero no es recomendado**

Típicamente un Smart Component usa Dumb Components. Usar Smart dentro de Smart puede indicar problemas de diseño.
</details>

---

## Sección 3: ChangeDetectionStrategy.OnPush (15 preguntas)

### Pregunta 26

**¿Qué es Change Detection en Angular?**

A) Un sistema de routing  
B) Un mecanismo para detectar cambios y actualizar la vista  
C) Un sistema de autenticación  
D) Un patrón de diseño  

<details>
<summary>Respuesta</summary>

**B) Un mecanismo para detectar cambios y actualizar la vista**

Change Detection es el proceso de Angular para detectar cambios en los datos y actualizar el DOM.
</details>

---

### Pregunta 27

**¿Cuál es la estrategia por defecto en Angular?**

A) OnPush  
B) Default  
C) Manual  
D) Automatic  

<details>
<summary>Respuesta</summary>

**B) Default**

Por defecto, Angular usa `ChangeDetectionStrategy.Default` que verifica todo en cada evento.
</details>

---

### Pregunta 28

**¿Cuándo verifica OnPush un componente?**

A) En cada evento  
B) Solo cuando @Input cambia (nueva referencia)  
C) Cada segundo  
D) Nunca  

<details>
<summary>Respuesta</summary>

**B) Solo cuando @Input cambia (nueva referencia)**

OnPush solo verifica cuando hay nueva referencia en @Input, evento del DOM, async pipe, o signal.
</details>

---

### Pregunta 29

**¿Cómo se configura OnPush en un componente?**

A) `@Component({ onPush: true })`  
B) `@Component({ changeDetection: ChangeDetectionStrategy.OnPush })`  
C) `@Component({ strategy: 'onPush' })`  
D) `@Component({ detection: 'onPush' })`  

<details>
<summary>Respuesta</summary>

**B) `@Component({ changeDetection: ChangeDetectionStrategy.OnPush })`**

Se configura con la propiedad `changeDetection` del decorator `@Component`.
</details>

---

### Pregunta 30

**¿Qué código causa problemas con OnPush?**

A) `this.users = [...this.users, newUser];`  
B) `this.users.push(newUser);`  
C) `this.users.update(users => [...users, newUser]);`  
D) `this.users.set([...this.users(), newUser]);`  

<details>
<summary>Respuesta</summary>

**B) `this.users.push(newUser);`**

`push()` muta el array sin crear nueva referencia, OnPush no detectará el cambio.
</details>

---

### Pregunta 31

**¿Cuál es la forma correcta de actualizar un array con OnPush?**

A) `this.items.push(newItem);`  
B) `this.items = [...this.items, newItem];`  
C) `this.items[0] = newItem;`  
D) `this.items.splice(0, 0, newItem);`  

<details>
<summary>Respuesta</summary>

**B) `this.items = [...this.items, newItem];`**

Se debe crear un nuevo array con spread operator para que OnPush detecte el cambio.
</details>

---

### Pregunta 32

**¿Cuál es la forma correcta de actualizar un objeto con OnPush?**

A) `this.user.name = 'New Name';`  
B) `this.user = { ...this.user, name: 'New Name' };`  
C) `Object.assign(this.user, { name: 'New Name' });`  
D) `this.user.name.setValue('New Name');`  

<details>
<summary>Respuesta</summary>

**B) `this.user = { ...this.user, name: 'New Name' };`**

Se debe crear un nuevo objeto con spread operator para nueva referencia.
</details>

---

### Pregunta 33

**¿Qué herramienta se usa para medir el rendimiento de Change Detection?**

A) Chrome DevTools Console  
B) Angular DevTools Profiler  
C) VS Code Debugger  
D) npm audit  

<details>
<summary>Respuesta</summary>

**B) Angular DevTools Profiler**

Angular DevTools tiene un profiler para medir el tiempo de Change Detection.
</details>

---

### Pregunta 34

**¿Qué dispara Change Detection en Default strategy?**

A) Solo cambios en signals  
B) Cualquier evento (click, timer, HTTP, etc.)  
C) Solo cambios en @Input  
D) Solo navegación  

<details>
<summary>Respuesta</summary>

**B) Cualquier evento (click, timer, HTTP, etc.)**

Default strategy verifica todo el árbol en cualquier evento asíncrono.
</details>

---

### Pregunta 35

**¿OnPush funciona con signals?**

A) No, son incompatibles  
B) Sí, signals notifican cambios automáticamente  
C) Solo con configuración especial  
D) Solo en componentes específicos  

<details>
<summary>Respuesta</summary>

**B) Sí, signals notifican cambios automáticamente**

Signals funcionan perfectamente con OnPush, notificando cambios automáticamente.
</details>

---

### Pregunta 36

**¿Qué método de signal se usa para actualizar con función?**

A) `signal.set()`  
B) `signal.update()`  
C) `signal.change()`  
D) `signal.modify()`  

<details>
<summary>Respuesta</summary>

**B) `signal.update()`**

`update()` recibe una función que recibe el valor actual y retorna el nuevo.
</details>

---

### Pregunta 37

**¿Cuál es el beneficio principal de OnPush?**

A) Código más corto  
B) Mejor rendimiento  
C) Más fácil de escribir  
D) Menos archivos  

<details>
<summary>Respuesta</summary>

**B) Mejor rendimiento**

OnPush reduce las verificaciones innecesarias, mejorando el rendimiento.
</details>

---

### Pregunta 38

**¿Qué pasa si mutas un objeto con OnPush?**

A) Angular lanza error  
B) La vista no se actualiza  
C) Angular lo detecta automáticamente  
D) El componente se destruye  

<details>
<summary>Respuesta</summary>

**B) La vista no se actualiza**

Al mutar un objeto, la referencia no cambia, OnPush no detecta el cambio y la vista no se actualiza.
</details>

---

### Pregunta 39

**¿Cómo se elimina un item de un array con OnPush?**

A) `this.items.splice(index, 1);`  
B) `this.items = this.items.filter((_, i) => i !== index);`  
C) `delete this.items[index];`  
D) `this.items.remove(index);`  

<details>
<summary>Respuesta</summary>

**B) `this.items = this.items.filter((_, i) => i !== index);`**

`filter()` crea un nuevo array, manteniendo la inmutabilidad.
</details>

---

### Pregunta 40

**¿Qué es un patrón inmutable?**

A) Modificar datos existentes  
B) Crear nuevos datos en lugar de modificar existentes  
C) Usar variables globales  
D) Evitar usar objetos  

<details>
<summary>Respuesta</summary>

**B) Crear nuevos datos en lugar de modificar existentes**

Los patrones inmutables crean nuevas referencias en lugar de mutar datos existentes.
</details>

---

## Sección 4: Patrón inject() (10 preguntas)

### Pregunta 41

**¿Qué es inject()?**

A) Un decorador  
B) Una función para inyección de dependencias  
C) Un módulo  
D) Un pipe  

<details>
<summary>Respuesta</summary>

**B) Una función para inyección de dependencias**

`inject()` es una función introducida en Angular 14 para inyectar dependencias.
</details>

---

### Pregunta 42

**¿En qué versión de Angular se introdujo inject()?**

A) Angular 12  
B) Angular 14  
C) Angular 16  
D) Angular 18  

<details>
<summary>Respuesta</summary>

**B) Angular 14**

`inject()` se introdujo en Angular 14 como la forma moderna de inyección.
</details>

---

### Pregunta 43

**¿Cuál es la sintaxis correcta de inject()?**

A) `inject AuthService`  
B) `inject(AuthService)`  
C) `@inject(AuthService)`  
D) `inject[AuthService]`  

<details>
<summary>Respuesta</summary>

**B) `inject(AuthService)`**

La sintaxis es `inject(Clase)` y retorna la instancia del servicio.
</details>

---

### Pregunta 44

**¿Dónde se puede usar inject()?**

A) Solo en constructores  
B) En cualquier lugar dentro del contexto de inyección  
C) Solo en servicios  
D) Solo en componentes  

<details>
<summary>Respuesta</summary>

**B) En cualquier lugar dentro del contexto de inyección**

Se puede usar en propiedades de clase, functional guards, interceptors, etc.
</details>

---

### Pregunta 45

**¿Qué ventaja tiene inject() sobre constructor injection?**

A) Es más rápido en runtime  
B) Sintaxis más concisa y funciona en funciones  
C) Es más seguro  
D) Usa menos memoria  

<details>
<summary>Respuesta</summary>

**B) Sintaxis más concisa y funciona en funciones**

`inject()` es más conciso y permite inyección en functional guards e interceptors.
</details>

---

### Pregunta 46

**¿Cómo se usa inject() en un functional guard?**

A)
```typescript
export const myGuard = () => {
  const auth = inject(AuthService);
  return auth.isLoggedIn();
}
```

B)
```typescript
export const myGuard = constructor(private auth: AuthService) {
  return auth.isLoggedIn();
}
```

C)
```typescript
export const myGuard = inject(AuthService).isLoggedIn();
```

D)
```typescript
export const myGuard = AuthService.inject();
```

<details>
<summary>Respuesta</summary>

**A)**
```typescript
export const myGuard = () => {
  const auth = inject(AuthService);
  return auth.isLoggedIn();
}
```

En functional guards, se usa `inject()` dentro de la función.
</details>

---

### Pregunta 47

**¿Por qué se recomienda usar readonly con inject()?**

A) Para mejor rendimiento  
B) Para prevenir reasignación accidental  
C) Es obligatorio por TypeScript  
D) Para mejor documentación  

<details>
<summary>Respuesta</summary>

**B) Para prevenir reasignación accidental**

`readonly` asegura que no se reasigne la referencia del servicio.
</details>

---

### Pregunta 48

**¿Se puede usar inject() en interceptors?**

A) No, solo en componentes  
B) Sí, en functional interceptors  
C) Solo con configuración especial  
D) No, interceptors usan constructor  

<details>
<summary>Respuesta</summary>

**B) Sí, en functional interceptors**

Los functional interceptors pueden usar `inject()` para obtener servicios.
</details>

---

### Pregunta 49

**¿Cuál es la forma moderna de inyectar un servicio?**

A) `constructor(private auth: AuthService) {}`  
B) `private readonly auth = inject(AuthService);`  
C) `@Inject(AuthService) auth: AuthService`  
D) `this.auth = new AuthService()`  

<details>
<summary>Respuesta</summary>

**B) `private readonly auth = inject(AuthService);`**

La forma moderna usa `inject()` con `readonly` en propiedades de clase.
</details>

---

### Pregunta 50

**¿Qué error ocurre si se usa inject() fuera del contexto de inyección?**

A) SyntaxError  
B) RuntimeError: NG0203  
C) TypeError  
D) No hay error, retorna undefined  

<details>
<summary>Respuesta</summary>

**B) RuntimeError: NG0203**

Angular lanza el error NG0203 cuando `inject()` se usa fuera del contexto de inyección.
</details>

---

## Respuestas Rápidas

| Pregunta | Respuesta | Pregunta | Respuesta |
|----------|-----------|----------|-----------|
| 1 | C | 26 | B |
| 2 | B | 27 | B |
| 3 | C | 28 | B |
| 4 | B | 29 | B |
| 5 | C | 30 | B |
| 6 | B | 31 | B |
| 7 | B | 32 | B |
| 8 | B | 33 | B |
| 9 | B | 34 | B |
| 10 | B | 35 | B |
| 11 | C | 36 | B |
| 12 | B | 37 | B |
| 13 | C | 38 | B |
| 14 | B | 39 | B |
| 15 | B | 40 | B |
| 16 | B | 41 | B |
| 17 | C | 42 | B |
| 18 | C | 43 | B |
| 19 | B | 44 | B |
| 20 | B | 45 | B |
| 21 | B | 46 | A |
| 22 | B | 47 | B |
| 23 | B | 48 | B |
| 24 | C | 49 | B |
| 25 | B | 50 | B |

---

## Evaluación

| Puntuación | Nivel |
|------------|-------|
| 45-50 | Excelente |
| 35-44 | Bueno |
| 25-34 | Aceptable |
| < 25 | Necesita repasar |

---

*Assessment - Día 2: Arquitectura DDD Lite*
*Curso: Angular 21 Enterprise*
*Día: 2 de 18*
