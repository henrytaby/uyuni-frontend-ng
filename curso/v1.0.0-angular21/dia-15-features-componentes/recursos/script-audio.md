# Script de Audio: Día 15 - Features y Componentes

## Información del Audio

| Atributo | Valor |
|----------|-------|
| **Duración estimada** | 25-30 minutos |
| **Formato** | Podcast educativo |
| **Audiencia** | Desarrolladores Angular con <1 año de experiencia |

---

## Intro (0:00 - 1:30)

**[Música de entrada suave - 10 segundos]**

**Narrador:**
"¡Bienvenidos al Día 15 del Curso de Angular 21!

Hoy vamos a integrar todo lo que hemos aprendido hasta ahora. Vamos a hablar de Features y Componentes, específicamente de la separación entre Smart Components y Dumb Components.

Si alguna vez te has preguntado: '¿Dónde pongo esta lógica? ¿En el componente o en el servicio?', este episodio es para ti.

Al final del día, serás capaz de crear features completos con una arquitectura limpia y mantenible."

**[Música de transición - 5 segundos]**

---

## Sección 1: El Problema (1:30 - 4:00)

**Narrador:**
"Imagina que estás trabajando en un proyecto grande. Tienes un componente de usuarios que hace TODO:

- Carga datos del servidor
- Maneja el estado
- Renderiza la UI
- Maneja la navegación
- Valida formularios
- Maneja errores

¿El resultado? Un componente de 800 líneas que nadie quiere tocar.

Este es el problema de los componentes monolíticos. Cuando un componente hace demasiado, se vuelve:

1. Difícil de mantener
2. Imposible de testear
3. No reutilizable
4. Frágil - un cambio rompe tres cosas

La solución es separar responsabilidades. Y aquí es donde entran los Smart y Dumb Components."

---

## Sección 2: Smart vs Dumb (4:00 - 8:00)

**Narrador:**
"Vamos a desglosar esto.

**Smart Components, también llamados Pages:**

Son el cerebro de tu feature. Su responsabilidad es:
- Coordinar componentes hijos
- Manejar estado con Signals
- Cargar datos desde servicios
- Manejar navegación
- Responder a eventos de componentes hijos

Los Smart Components SÍ inyectan servicios. SÍ manejan lógica de negocio. Son routables, o sea, tienen una URL asociada.

**Dumb Components, también llamados UI Components:**

Son la cara bonita de tu aplicación. Su responsabilidad es:
- Mostrar datos
- Emitir eventos al padre
- Manejar estado local de UI (como hover o focus)

Los Dumb Components NO inyectan servicios de negocio. Solo usan Input y Output signals. Son reutilizables y predecibles.

Piénsalo así: Si cambias los datos de entrada, el componente siempre se ve igual. No hay sorpresas."

---

## Sección 3: Input y Output Signals (8:00 - 12:00)

**Narrador:**
"En Angular 21, la comunicación entre componentes se hace con signals.

**Input signals** son para recibir datos del padre:

```typescript
user = input.required<User>();
```

El `.required()` significa que el padre DEBE pasar este dato. Si no lo pasa, hay error.

También puedes hacer inputs opcionales:

```typescript
title = input<string>('Título por defecto');
```

**Output signals** son para emitir eventos al padre:

```typescript
userClick = output<User>();
```

Y para emitir:

```typescript
this.userClick.emit(this.user());
```

**Model signals** son para two-way binding:

```typescript
filter = model.required<UserFilter>();
```

Esto permite que el padre y el hijo compartan estado de forma bidireccional."

---

## Sección 4: Estructura de un Feature (12:00 - 16:00)

**Narrador:**
"Todo feature en UyuniAdmin sigue la misma estructura:

```
feature/
├── pages/        # Smart Components
├── components/   # Dumb Components
├── services/     # Feature Services
├── models/       # Domain Models
└── feature.routes.ts
```

Esta consistencia es clave. Cuando un nuevo desarrollador entra al proyecto, sabe exactamente dónde buscar.

**Pages** contiene las páginas principales: List, Detail, Form.

**Components** contiene componentes reutilizables: Cards, Forms, Filters.

**Services** contiene la lógica de datos: CRUD operations, cache.

**Models** contiene los tipos: interfaces, types, constantes.

Y **feature.routes.ts** configura el routing del feature."

---

## Sección 5: Feature Services (16:00 - 20:00)

**Narrador:**
"Los Feature Services encapsulan la lógica de datos de un feature.

Sus responsabilidades son:
- Hacer llamadas HTTP
- Transformar datos
- Manejar cache
- Centralizar error handling

Un patrón común es usar signals para el cache:

```typescript
private usersCache = signal<User[]>([]);
readonly users = this.usersCache.asReadonly();
```

El `asReadonly()` es importante. Expone el signal como solo lectura, así los componentes no pueden modificarlo directamente.

Cuando necesitas actualizar el cache:

```typescript
this.usersCache.update(users => [...users, newUser]);
```

Siempre de forma inmutable. Nunca mutes el array directamente."

---

## Sección 6: Routing (20:00 - 23:00)

**Narrador:**
"El routing de features usa lazy loading por defecto.

En el archivo de rutas del feature:

```typescript
export const USERS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./pages/list/...') },
  { path: 'new', loadComponent: () => import('./pages/form/...') },
  { path: ':id', loadComponent: () => import('./pages/detail/...') }
];
```

**IMPORTANTE**: El orden de las rutas importa.

La ruta 'new' debe ir ANTES que ':id'. Si no, Angular interpretará 'new' como un ID.

Y en app.routes.ts:

```typescript
{
  path: 'users',
  loadChildren: () => import('./features/users/users.routes')
}
```

Así el feature completo se carga bajo demanda."

---

## Sección 7: Errores Comunes (23:00 - 26:00)

**Narrador:**
"Hablemos de los errores más comunes:

**Error 1: Inyectar servicios en Dumb Components**

Si un componente solo muestra datos, NO debe inyectar servicios. Usa Input signals.

**Error 2: Mutar signals directamente**

Nunca hagas `this.users().push(user)`. Usa `this.users.update(users => [...users, user])`.

**Error 3: Orden incorrecto de rutas**

Rutas específicas antes que parámetros. 'new' antes que ':id'.

**Error 4: No usar asReadonly()**

Expón signals como readonly para evitar modificaciones externas."

---

## Cierre (26:00 - 28:00)

**Narrador:**
"Para resumir:

1. Los Smart Components manejan lógica de negocio
2. Los Dumb Components son presentación pura
3. Input signals reciben datos, Output signals emiten eventos
4. Los Feature Services encapsulan datos y cache
5. El routing usa lazy loading por defecto

En los labs de hoy, vas a crear dos features completos: Dashboard y Users.

Recuerda: la separación de responsabilidades no es solo teoría. Es la diferencia entre un proyecto mantenible y un proyecto que nadie quiere tocar.

¡Nos vemos en el próximo episodio!"

**[Música de salida - 10 segundos]**

---

## Notas de Producción

### Música
- Intro: Música suave, estilo tech podcast
- Transiciones: Efectos sutiles
- Outro: Misma música del intro

### Efectos de Sonido
- Teclado tecleando al mostrar código
- "Ding" para puntos importantes
- Transición suave entre secciones

### Tono
- Educativo pero conversacional
- Ejemplos prácticos
- Evitar jerga innecesaria

### Pacing
- Velocidad moderada
- Pausas después de conceptos importantes
- Énfasis en palabras clave

---

*Script de Audio - Día 15 - Curso Angular 21 - UyuniAdmin Frontend*
