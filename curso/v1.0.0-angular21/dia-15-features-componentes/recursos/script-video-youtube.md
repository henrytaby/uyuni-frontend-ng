# Script de Video YouTube: Día 15 - Features y Componentes

## Información del Video

| Atributo | Valor |
|----------|-------|
| **Título** | Angular 21: Smart vs Dumb Components - Arquitectura Limpia |
| **Duración** | 25-30 minutos |
| **Formato** | Tutorial con código en vivo |
| **Thumbnail** | Split screen: Smart Component (cerebro) vs Dumb Component (cara) |

---

## Estructura del Video

| Tiempo | Sección | Duración |
|--------|---------|----------|
| 0:00 | Intro y Hook | 2 min |
| 2:00 | El Problema | 3 min |
| 5:00 | Smart vs Dumb | 5 min |
| 10:00 | Demo: Crear Feature | 10 min |
| 20:00 | Errores Comunes | 3 min |
| 23:00 | Resumen y Cierre | 2 min |

---

## Sección 1: Intro y Hook (0:00 - 2:00)

### Visual
- **0:00 - 0:15**: Pantalla con logo del curso y título
- **0:15 - 0:45**: Cara del presentador, fondo de oficina
- **0:45 - 2:00**: Animación del problema

### Guión

**[0:00 - 0:15]**
*(Pantalla con título animado)*
"Angular 21: Smart vs Dumb Components"

**[0:15 - 0:45]**
*(Cara del presentador)*
"¡Hola! Bienvenidos al Día 15 del Curso de Angular 21. Hoy vamos a resolver uno de los problemas más comunes en el desarrollo de aplicaciones: ¿Dónde pongo esta lógica?"

**[0:45 - 2:00]**
*(Animación: componente monolítico explotando)*
"Imagina que tienes un componente de 800 líneas que hace TODO: carga datos, maneja estado, renderiza UI, navega, valida... Es una bomba de tiempo. Hoy aprenderás a separar responsabilidades con Smart y Dumb Components."

---

## Sección 2: El Problema (2:00 - 5:00)

### Visual
- **2:00 - 3:00**: Código de componente monolítico
- **3:00 - 4:00**: Diagrama de problemas
- **4:00 - 5:00**: Solución visual

### Guión

**[2:00 - 3:00]**
*(Mostrando código en VS Code)*
"Mira este componente. Tiene 800 líneas. Inyecta 5 servicios. Maneja estado, navegación, validación... Todo en un solo lugar."

**[3:00 - 4:00]**
*(Diagrama animado)*
"¿Qué pasa cuando necesitas cambiar algo? Un cambio rompe tres cosas. ¿Y si quieres reutilizar la UI en otra página? No puedes, porque está acoplada a la lógica."

**[4:00 - 5:00]**
*(Diagrama de solución)*
"La solución es separar. Smart Components para lógica, Dumb Components para presentación. Vamos a ver cómo."

---

## Sección 3: Smart vs Dumb (5:00 - 10:00)

### Visual
- **5:00 - 6:30**: Tabla comparativa animada
- **6:30 - 8:00**: Ejemplo de Smart Component
- **8:00 - 10:00**: Ejemplo de Dumb Component

### Guión

**[5:00 - 6:30]**
*(Tabla comparativa animada)*
"Smart Components, o Pages, son el cerebro. Manejan lógica de negocio, inyectan servicios, coordinan componentes hijos.

Dumb Components, o UI Components, son la cara. Solo muestran datos, emiten eventos, son reutilizables."

**[6:30 - 8:00]**
*(Código de Smart Component)*
"Un Smart Component se ve así:
- Inyecta servicios
- Maneja estado con Signals
- Coordina dumb components
- Es routable"

**[8:00 - 10:00]**
*(Código de Dumb Component)*
"Un Dumb Component se ve así:
- Solo Input y Output signals
- Sin servicios de negocio
- Código simple y predecible
- Altamente reutilizable"

---

## Sección 4: Demo - Crear Feature (10:00 - 20:00)

### Visual
- **10:00 - 12:00**: Crear estructura de carpetas
- **12:00 - 14:00**: Crear modelos
- **14:00 - 16:00**: Crear Feature Service
- **16:00 - 18:00**: Crear Dumb Components
- **18:00 - 20:00**: Crear Smart Component

### Guión

**[10:00 - 12:00]**
*(Terminal mostrando comandos)*
"Vamos a crear un feature de usuarios. Primero, la estructura de carpetas:

```bash
mkdir -p src/app/features/users/{pages,components,services,models}
```

Esta estructura consistente hace que cualquier desarrollador pueda encontrar lo que necesita."

**[12:00 - 14:00]**
*(VS Code mostrando modelos)*
"Ahora los modelos. Definimos interfaces para User, CreateUserRequest, UserFilter... Esto nos da type safety."

**[14:00 - 16:00]**
*(VS Code mostrando servicio)*
"El Feature Service encapsula la lógica de datos. Observa cómo usamos signals para el cache:

```typescript
private usersCache = signal<User[]>([]);
readonly users = this.usersCache.asReadonly();
```

El `asReadonly()` es crucial. Expone el signal como solo lectura."

**[16:00 - 18:00]**
*(VS Code mostrando dumb component)*
"Ahora el Dumb Component. Mira que NO inyecta servicios. Solo Input y Output:

```typescript
user = input.required<User>();
userClick = output<User>();
```

Este componente es 100% reutilizable. Puedes usarlo en cualquier feature."

**[18:00 - 20:00]**
*(VS Code mostrando smart component)*
"Finalmente, el Smart Component. Aquí sí inyectamos servicios, manejamos estado, coordinamos:

```typescript
private userService = inject(UserService);
users = signal<User[]>([]);

ngOnInit(): void {
  this.loadUsers();
}
```

El flujo es: Service → Smart Component → Dumb Component."

---

## Sección 5: Errores Comunes (20:00 - 23:00)

### Visual
- **20:00 - 21:00**: Error 1 - Inyectar servicios en Dumb
- **21:00 - 22:00**: Error 2 - Mutar signals
- **22:00 - 23:00**: Error 3 - Orden de rutas

### Guión

**[20:00 - 21:00]**
*(Código con X roja)*
"Error número 1: Inyectar servicios en Dumb Components. Si el componente solo muestra datos, NO debe inyectar servicios. Usa Input signals."

**[21:00 - 22:00]**
*(Código con X roja)*
"Error número 2: Mutar signals directamente. Nunca hagas `this.users().push(user)`. Usa `this.users.update(users => [...users, user])`."

**[22:00 - 23:00]**
*(Código con X roja)*
"Error número 3: Orden incorrecto de rutas. La ruta 'new' debe ir ANTES que ':id'. Si no, Angular interpretará 'new' como un ID."

---

## Sección 6: Resumen y Cierre (23:00 - 25:00)

### Visual
- **23:00 - 24:00**: Resumen con puntos clave
- **24:00 - 25:00**: Call to action

### Guión

**[23:00 - 24:00]**
*(Animación con puntos clave)*
"Para resumir:
1. Smart Components manejan lógica de negocio
2. Dumb Components son presentación pura
3. Input signals reciben, Output signals emiten
4. Feature Services encapsulan datos
5. Lazy loading por defecto"

**[24:00 - 25:00]**
*(Cara del presentador)*
"En los labs de hoy, vas a crear dos features completos: Dashboard y Users. Practica esta separación, porque es la base de aplicaciones mantenibles.

Si este video te ayudó, dale like y suscríbete. Nos vemos en el próximo episodio donde integraremos todo en una aplicación completa."

---

## Notas de Producción

### Setup de Grabación
- **Cámara**: 1080p, fondo limpio
- **Micrófono**: Audio claro sin eco
- **Iluminación**: Bien iluminado, sin sombras
- **Software**: OBS Studio con escenas

### Escenas de OBS
1. **Intro**: Logo + título animado
2. **Presentador**: Cámara + fondo
3. **Código**: VS Code con syntax highlighting
4. **Diagrama**: Animaciones de arquitectura
5. **Split**: Código vs Diagrama

### B-Roll
- Terminal ejecutando comandos
- VS Code con código
- Navegador mostrando resultado
- Diagramas animados

### Thumbnails
- Opción 1: Split screen Smart vs Dumb
- Opción 2: Presentador + código de fondo
- Opción 3: Diagrama de arquitectura

### SEO
- **Título**: "Angular 21: Smart vs Dumb Components - Arquitectura Limpia"
- **Descripción**: "Aprende a separar responsabilidades en Angular 21 con Smart y Dumb Components. Tutorial completo con código en vivo."
- **Tags**: Angular 21, Angular tutorial, Smart Components, Dumb Components, Angular architecture

---

## Recursos Adicionales

### Links en Descripción
1. Código del episodio: [GitHub link]
2. Documentación de Angular: https://angular.dev
3. Curso completo: [Playlist link]
4. Discord de la comunidad: [Discord link]

### Pinned Comment
"¿Tienes preguntas sobre Smart vs Dumb Components? Déjalas en los comentarios y te ayudo. 👇

Código del episodio: [link]
Curso completo: [link]"

---

*Script de Video YouTube - Día 15 - Curso Angular 21 - UyuniAdmin Frontend*
