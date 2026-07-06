# Guion de Video YouTube - Día 2: Arquitectura DDD Lite

## Metadatos del Video

| Aspecto | Detalle |
|---------|---------|
| **Título** | Angular 21 Enterprise - Día 2: Arquitectura DDD Lite |
| **Duración** | 40-45 minutos |
| **Formato** | Tutorial con screencast |
| **Thumbnail** | Logo Angular + "Día 2" + "Smart vs Dumb" |
| **Tags** | Angular, DDD, Architecture, OnPush, Enterprise |

---

## Estructura del Video

### [0:00 - 0:30] Pre-Intro

**Visual**: Logo del curso animado + música intro

**Overlay**: 
```
Angular 21 Enterprise
Día 2: Arquitectura DDD Lite
```

**Audio**: Música intro (10 seg) → fade out

---

### [0:30 - 2:00] Intro y Hook

**Visual**: Instructor en cámara (plano medio)

**Audio**:
"¡Hola! Bienvenidos al segundo día del curso de Angular 21 Enterprise.

Ayer configuramos el proyecto con Path Aliases. Hoy vamos a entender CÓMO organizar el código de manera profesional.

Pero antes, una pregunta: ¿Alguna vez has abierto un proyecto y no sabes dónde poner tu código?"

**Visual**: Cambiar a pantalla con código desordenado

**Código en pantalla**:
```typescript
// ¿Dónde va esto?
export class UserCardComponent {
  private userService = inject(UserService);  // ¿En un componente?
  
  deleteUser() {
    this.userService.delete(this.user.id);    // ¿Lógica aquí?
  }
}
```

**Audio**:
"Si no hay una arquitectura clara, cada desarrollador hace lo que quiere. Y el resultado es código desordenado.

Hoy vamos a resolver esto con DDD Lite, Smart vs Dumb Components, y OnPush."

---

### [2:00 - 5:00] Contexto

**Visual**: Slides con diagramas

**Slide 1**: "¿Por qué importa la arquitectura?"

**Audio**:
"En proyectos enterprise, el código se mantiene durante años. Un desarrollador escribe código hoy, y otro lo modifica dentro de 6 meses.

Sin estructura, cada cambio es una pesadilla."

**Slide 2**: Estadísticas

**Audio**:
"Miren estos datos:
- El 60% de los problemas de rendimiento se deben a mal uso del change detection
- El 70% del tiempo de mantenimiento se gana con buena arquitectura
- Los equipos con arquitectura clara son 3x más productivos"

**Slide 3**: Beneficios

**Audio**:
"Al final de este video, podrás:
1. Organizar código con DDD Lite
2. Separar Smart y Dumb Components
3. Implementar OnPush correctamente
4. Usar inject() profesionalmente"

---

### [5:00 - 12:00] Explicación Teórica

**Visual**: Pantalla dividida - Slides + Código

#### [5:00 - 7:30] Concepto 1: DDD Lite

**Slide**: "DDD Lite"

**Audio**:
"Empecemos con DDD Lite. DDD significa Domain-Driven Design, propuesto por Eric Evans en 2003.

La versión Lite es una simplificación para aplicaciones web típicas.

La idea principal: organizar el código por dominio de negocio, no por tipo técnico."

**Código en pantalla**:
```
❌ Por tipo técnico:
src/app/
├── components/
├── services/
├── models/
└── pages/

✅ Por dominio (DDD Lite):
src/app/
├── core/        # Infraestructura
├── shared/      # Reutilizables
└── features/    # Dominios
    ├── auth/
    ├── dashboard/
    └── profile/
```

**Audio**:
"En el proyecto UyuniAdmin, cada feature es un contexto separado. Auth, Dashboard, Profile, Calendar.

Y hay una regla importante: las features NO se importan entre sí."

#### [7:30 - 10:00] Concepto 2: Smart vs Dumb

**Slide**: "Smart vs Dumb Components"

**Audio**:
"Ahora la distinción más importante: Smart y Dumb Components.

Imagina una empresa. Hay gerentes y trabajadores.

Los gerentes toman decisiones, coordinan equipos. Los trabajadores ejecutan tareas específicas.

En Angular, los Smart Components son gerentes. Tienen lógica de negocio, inyectan servicios, coordinan otros componentes.

Los Dumb Components son trabajadores. Solo muestran información, reciben datos, emiten eventos."

**Código en pantalla**:
```typescript
// Smart Component (Gerente)
@Component({...})
export class SignInComponent {
  private authService = inject(AuthService);  // ✅ Inyecta servicios
  private router = inject(Router);
  
  isLoading = signal(false);                   // ✅ Maneja estado
  
  onLogin(credentials: LoginCredentials) {    // ✅ Lógica de negocio
    this.authService.login(credentials)
      .subscribe(() => this.router.navigate(['/']));
  }
}

// Dumb Component (Trabajador)
@Component({...})
export class SignInFormComponent {
  readonly isLoading = input<boolean>(false); // ✅ Solo recibe datos
  readonly submitForm = output<Credentials>(); // ✅ Solo emite eventos
  
  // ❌ NO inyecta servicios
  // ❌ NO tiene lógica de negocio
}
```

#### [10:00 - 12:00] Concepto 3: OnPush

**Slide**: "ChangeDetectionStrategy.OnPush"

**Audio**:
"El tercer concepto es OnPush. Este tema es técnico pero crucial para el rendimiento.

Angular tiene Change Detection que detecta cambios y actualiza la vista.

Por defecto, verifica TODO en cada evento. Cada click, cada timer, cada HTTP.

OnPush solo verifica cuando HAY cambios reales: nueva referencia en inputs, evento del DOM, o signal actualizado."

---

### [12:00 - 30:00] Demo en Vivo

**Visual**: Screencast de VS Code + Terminal

**Audio**:
"Ahora vamos a la práctica. Vamos a crear una feature completa."

#### [12:00 - 15:00] Paso 1: Crear Estructura

**Terminal en pantalla**:
```bash
mkdir -p src/app/features/users/pages/user-list
mkdir -p src/app/features/users/components/user-card
mkdir -p src/app/features/users/services
mkdir -p src/app/features/users/models
```

**Audio**:
"Primero, creamos la estructura de carpetas. Noten que seguimos el patrón: pages para Smart, components para Dumb."

#### [15:00 - 18:00] Paso 2: Crear Model

**Visual**: Crear archivo user.model.ts

**Código en pantalla**:
```typescript
export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'user' | 'guest';
}
```

**Audio**:
"El modelo define la estructura de datos. Simple y claro."

#### [18:00 - 22:00] Paso 3: Crear Dumb Component

**Visual**: Crear user-card.component.ts

**Código en pantalla**:
```typescript
@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [ButtonModule, TagModule],
  templateUrl: './user-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush  // ← Importante
})
export class UserCardComponent {
  // Inputs: datos del padre
  readonly user = input.required<User>();
  readonly isLoading = input<boolean>(false);
  
  // Outputs: eventos al padre
  readonly deleteClick = output<number>();
  
  onDelete(): void {
    this.deleteClick.emit(this.user().id);
  }
}
```

**Audio**:
"Este es un Dumb Component. Noten:
- Solo tiene inputs y outputs
- No inyecta servicios
- Tiene OnPush
- La lógica es mínima, solo emite eventos"

#### [22:00 - 27:00] Paso 4: Crear Smart Component

**Visual**: Crear user-list.component.ts

**Código en pantalla**:
```typescript
@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [UserCardComponent, ProgressSpinnerModule],
  templateUrl: './user-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent {
  // Inyecta servicios
  private readonly userService = inject(UserService);
  
  // Estado con signals
  users = signal<User[]>([]);
  isLoading = signal(true);
  
  ngOnInit(): void {
    this.loadUsers();
  }
  
  private loadUsers(): void {
    this.isLoading.set(true);
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.isLoading.set(false);
      }
    });
  }
  
  onDeleteUser(id: number): void {
    // Patrón inmutable: crear nuevo array
    this.users.update(users => users.filter(u => u.id !== id));
  }
}
```

**Audio**:
"Este es el Smart Component. Noten:
- Inyecta UserService
- Maneja estado con signals
- Tiene lógica de negocio
- Usa patrones inmutables"

#### [27:00 - 30:00] Paso 5: Verificar

**Visual**: Mostrar la aplicación funcionando

**Audio**:
"Verifiquemos que funciona. La lista de usuarios se muestra correctamente, y cuando eliminamos uno, la vista se actualiza.

Esto funciona porque usamos signals y patrones inmutables."

---

### [30:00 - 35:00] Error Común

**Visual**: Pantalla con error simulado

**Audio**:
"Ahora hablemos de un error muy común."

**Código en pantalla**:
```typescript
// ❌ ERROR COMÚN: Mutar con OnPush
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent {
  users = signal<User[]>([]);
  
  addUser(user: User) {
    this.users().push(user);  // ❌ Mutación
  }
}
```

**Audio**:
"Este código tiene un problema grave. Estamos mutando el array con push.

OnPush no detectará el cambio porque la referencia no cambió."

**Visual**: Mostrar solución

**Código en pantalla**:
```typescript
// ✅ SOLUCIÓN: Crear nuevo array
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent {
  users = signal<User[]>([]);
  
  addUser(user: User) {
    this.users.update(users => [...users, user]);  // ✅ Nuevo array
  }
}
```

**Audio**:
"La solución es crear un nuevo array con spread operator. Así OnPush detecta el cambio."

---

### [35:00 - 40:00] Mini Reto

**Visual**: Pantalla con instrucciones

**Audio**:
"Antes de terminar, tengo un reto para ustedes."

**Overlay**:
```
🎯 Mini Reto:
1. Crea un Dumb Component: ProductCardComponent
2. Muestra: nombre, precio, imagen
3. Emite evento cuando se hace click en "Comprar"
4. Usa OnPush

Tiempo: 5 minutos
Pausa el video e inténtalo.
```

**Audio**:
"Su tarea es crear un Dumb Component para mostrar productos.

Pausen el video e inténtelo. Cuando estén listos, continúen para ver la solución."

**Visual**: Pantalla de espera (30 segundos)

---

### [40:00 - 43:00] Solución del Reto

**Visual**: Mostrar solución paso a paso

**Código en pantalla**:
```typescript
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [ButtonModule],
  template: `
    <div class="border rounded p-4">
      <img [src]="product().image" class="w-full h-40 object-cover">
      <h3 class="font-bold">{{ product().name }}</h3>
      <p class="text-green-600">${{ product().price }}</p>
      <p-button 
        label="Comprar" 
        (onClick)="onBuy()"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {
  readonly product = input.required<Product>();
  readonly buyClick = output<number>();
  
  onBuy(): void {
    this.buyClick.emit(this.product().id);
  }
}
```

**Audio**:
"La solución es un componente simple con input para el producto y output para el evento de compra.

¿Lo lograron? Si tuvieron problemas, revisen los pasos anteriores."

---

### [43:00 - 45:00] Cierre

**Visual**: Instructor en cámara

**Audio**:
"En resumen, hoy aprendimos:

1. DDD Lite organiza por dominio, no por tipo técnico
2. Smart Components tienen lógica, Dumb solo presentan
3. OnPush optimiza rendimiento con patrones inmutables
4. inject() es la forma moderna de inyección"

**Visual**: Mostrar código limpio

**Código en pantalla**:
```typescript
// ✅ Arquitectura correcta
features/
└── users/
    ├── pages/           ← Smart Components
    │   └── user-list/
    ├── components/      ← Dumb Components
    │   └── user-card/
    ├── services/        ← Lógica de negocio
    └── models/          ← Tipos de datos
```

**Audio**:
"Así se ve una feature bien organizada. Cada archivo tiene un propósito claro."

**Visual**: Instructor en cámara

**Audio**:
"En el próximo video, Día 3, aprenderemos sobre Lazy Loading y Rutas. Veremos cómo cargar código solo cuando se necesita, cómo proteger rutas con guards, y cómo resolver datos antes de navegar.

Si este video les ayudó, denle like y suscríbanse. Déjenme en los comentarios si tienen preguntas.

Los materiales de este video están en el repositorio del curso.

¡Nos vemos en el próximo video del curso de Angular 21 Enterprise!"

---

### [45:00 - 45:30] Outro

**Visual**: Logo del curso + links

**Overlay**:
```
📚 Materiales: github.com/curso/angular-21-enterprise
📱 Sígueme: @tu_usuario
💬 Comunidad: discord.gg/angular-enterprise
```

**Audio**: Música outro (15 seg) → fade out

---

## Timestamps para YouTube

```
0:00 - Intro
0:30 - Hook: El problema de la arquitectura
2:00 - Contexto: Por qué importa
5:00 - Concepto 1: DDD Lite
7:30 - Concepto 2: Smart vs Dumb
10:00 - Concepto 3: OnPush
12:00 - Demo: Crear estructura
15:00 - Demo: Crear model
18:00 - Demo: Crear Dumb Component
22:00 - Demo: Crear Smart Component
27:00 - Demo: Verificar funcionamiento
30:00 - Error común: Mutación con OnPush
35:00 - Mini reto
40:00 - Solución del reto
43:00 - Resumen
45:00 - Cierre
```

---

## Notas de Producción

### Equipo Necesario
- Micrófono: Blue Yeti o similar
- Cámara: Webcam HD o cámara DSLR
- Software de grabación: OBS Studio
- Software de edición: DaVinci Resolve (gratis) o Premiere Pro
- Iluminación: Ring light o softboxes

### Configuración de Grabación
- Video: 1920x1080, 30fps
- Audio: 48kHz, mono
- Screencast: 1920x1080, 30fps

### SEO para YouTube
- Título: "Angular 21 Enterprise - Día 2: Arquitectura DDD Lite (Smart vs Dumb + OnPush)"
- Descripción: Timestamps, links, código
- Tags: Angular, DDD, Architecture, OnPush, Enterprise, Smart Components
- Playlist: Curso Angular 21 Enterprise

---

*Curso: Angular 21 Enterprise*
*Día: 2 de 18*
*Formato: Video YouTube*
