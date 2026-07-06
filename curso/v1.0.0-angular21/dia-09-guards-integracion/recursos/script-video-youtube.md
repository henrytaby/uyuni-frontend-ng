# Día 9: Guion de Video YouTube - Guards y Protección de Rutas

## Información del Video

- **Título:** "Guards en Angular 21: Protege tus Rutas como un Pro"
- **Duración:** 15-20 minutos
- **Formato:** Tutorial con demo en vivo
- **Thumbnail:** Icono de escudo con código Angular

---

## Estructura del Video

### 0:00 - 1:00 | Intro y Hook

**[Escena: Presentador en cámara, fondo con logo de Angular]**

**Presentador:** "¿Qué pasa si un usuario escribe directamente en su navegador: `miapp.com/admin/usuarios`?"

**[Efecto: Pantalla dividida mostrando URL y página cargando]**

**Presentador:** "Sin Guards... la página carga. Tus datos sensibles están expuestos. Es como dejar la puerta de tu casa abierta."

**[Efecto: Puerta abriéndose sola]**

**Presentador:** "Hoy aprenderás a cerrar esa puerta con Guards en Angular 21."

**[Efecto: Logo de Angular con candado]**

**Presentador:** "¡Vamos allá!"

---

### 1:00 - 3:00 | ¿Qué son los Guards?

**[Escena: Presentador con gráficos animados]**

**Presentador:** "Un Guard es como un portero de club. Verifica las credenciales antes de dejar entrar."

**[Animación: Persona llegando a puerta, portero verificando, dejando pasar o rechazando]**

**Presentador:** "En Angular, un Guard es una función que decide si una ruta puede activarse."

**[Gráfico: Tipos de Guards]**

**Presentador:** "Hay varios tipos:"

**[Aparecen tarjetas con cada tipo]**

- "CanActivateFn: ¿Puede acceder?"
- "CanDeactivateFn: ¿Puede salir?"
- "CanLoadFn: ¿Puede cargar el módulo?"
- "CanMatchFn: ¿Coincide la ruta?"
- "ResolveFn: Pre-cargar datos"

**Presentador:** "Hoy nos enfocamos en CanActivateFn, el más usado para autenticación."

---

### 3:00 - 5:00 | Guards Funcionales vs Clases

**[Escena: Código comparativo en pantalla]**

**Presentador:** "Antes de Angular 14, los Guards eran clases con mucho boilerplate."

**[Código legacy aparece tachado]**

```typescript
// ❌ Legacy - No usar
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(): boolean { ... }
}
```

**Presentador:** "Desde Angular 14, tenemos Guards funcionales. Más limpios y tree-shakeable."

**[Código moderno aparece con check verde]**

```typescript
// ✅ Moderno - Usar
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  // ...
};
```

**Presentador:** "Tres ventajas: menos código, tree-shakeable, y consistente con interceptores."

---

### 5:00 - 10:00 | Demo: Implementar authGuard

**[Escena: IDE abierto con proyecto Angular]**

**Presentador:** "Vamos a implementar nuestro primer Guard. Abre tu proyecto."

**[Navegación: src/app/core/guards/]**

**Presentador:** "Crea un archivo `auth.guard.ts`."

**[Escribiendo código en vivo]**

**Presentador:** "Primero, las importaciones:"

```typescript
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';
```

**Presentador:** "Ahora, declaramos el Guard:"

```typescript
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.parseUrl('/signin');
};
```

**[Zoom en la función]**

**Presentador:** "Nota cómo usamos `inject()` dentro de la función. Esto es crucial: `inject()` solo funciona en el contexto de Angular."

**Presentador:** "La lógica es simple: si está autenticado, retorna `true`. Si no, retorna un `UrlTree` que redirige a `/signin`."

---

### 10:00 - 13:00 | Integración en Rutas

**[Escena: Archivo app.routes.ts]**

**Presentador:** "Ahora, integremos el Guard en nuestras rutas."

**[Navegación: src/app/app.routes.ts]**

**Presentador:** "Importa el Guard:"

```typescript
import { authGuard } from '@core/guards/auth.guard';
```

**Presentador:** "Y agrégalo a la ruta protegida:"

```typescript
export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard], // ← Aquí
    children: [
      { path: '', loadChildren: () => import('./dashboard.routes') }
    ]
  },
  // Rutas públicas SIN guard
  { path: 'signin', component: SignInComponent }
];
```

**[Resaltando la diferencia]**

**Presentador:** "Mira: las rutas protegidas tienen `canActivate`, las públicas NO."

**Presentador:** "Si pusieras el Guard en `/signin`, crearías un bucle infinito. ¡Cuidado con eso!"

---

### 13:00 - 15:00 | Probando el Guard

**[Escena: Terminal y navegador]**

**Presentador:** "Vamos a probarlo."

**[Terminal: npm start]**

**Presentador:** "Iniciamos el servidor..."

**[Navegador: localhost:4200]**

**Presentador:** "Sin autenticar, intentamos acceder a `/dashboard`."

**[Efecto: Redirección automática a /signin]**

**Presentador:** "¡Boom! Nos redirige automáticamente a login."

**[Haciendo login]**

**Presentador:** "Ahora nos autenticamos..."

**[Navegando a /dashboard]**

**Presentador:** "Y ahora podemos acceder a `/dashboard` sin problemas."

**Presentador:** "Así de simple es proteger tus rutas."

---

### 15:00 - 17:00 | Errores Comunes

**[Escena: Presentador con advertencias]**

**Presentador:** "Tres errores que debes evitar:"

**[Tarjeta 1: inject() fuera de contexto]**

```typescript
// ❌ ERROR
const auth = inject(AuthService); // Fuera de la función
export const authGuard: CanActivateFn = () => { ... };
```

**Presentador:** "Error uno: `inject()` fuera de la función. No funciona."

**[Tarjeta 2: Falta return]**

```typescript
// ❌ ERROR
if (!auth.isAuthenticated()) {
  router.navigate(['/signin']);
  // Falta return false;
}
```

**Presentador:** "Error dos: olvidar el `return`. Tu Guard debe siempre retornar algo."

**[Tarjeta 3: Bucle infinito]**

```typescript
// ❌ ERROR
{ path: 'signin', canActivate: [authGuard], ... }
```

**Presentador:** "Error tres: poner el Guard en rutas públicas. Bucle infinito."

---

### 17:00 - 19:00 | Mini Reto

**[Escena: Presentador con desafío]**

**Presentador:** "Te dejo un reto: implementa un `adminGuard`."

**[Requisitos en pantalla]**

**Presentador:** "Requisitos:"

1. Verificar si el usuario tiene rol 'admin'
2. Si no tiene rol, redirigir a `/forbidden`
3. Si no está autenticado, redirigir a `/signin`

**[Pausa para pensar]**

**Presentador:** "Pausa el video e inténtalo."

**[...10 segundos después...]**

**Presentador:** "¿Listo? Aquí está la solución:"

```typescript
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    return router.parseUrl('/signin');
  }

  if (auth.hasRole('admin')) {
    return true;
  }

  return router.parseUrl('/forbidden');
};
```

---

### 19:00 - 20:00 | Cierre

**[Escena: Presentador en cámara]**

**Presentador:** "Hoy aprendiste:"

**[Resumen en pantalla]**

- Qué son los Guards y para qué sirven
- Cómo implementar Guards funcionales
- Cómo integrarlos en tus rutas
- Errores comunes a evitar

**Presentador:** "Los Guards son tu primera línea de defensa. Úsalos siempre que necesites proteger rutas."

**Presentador:** "En el próximo video, comenzamos con RxJS. Es fundamental para Angular."

**[Efecto: Call to action]**

**Presentador:** "Si te gustó este video, dale like y suscríbete. Los ejercicios están en la descripción."

**Presentador:** "¡Nos vemos en el próximo video!"

**[Efecto: Logo del curso y links]**

---

## Notas de Producción

### Visual
- Usar tema oscuro en el IDE
- Resaltar código con colores
- Animaciones simples para diagramas
- Zoom en código importante

### Audio
- Micrófono de calidad
- Sin ruido de fondo
- Música de fondo suave (royalty-free)

### Edición
- Cortar pausas largas
- Agregar transiciones suaves
- Resaltar errores con efecto rojo
- Resaltar soluciones con efecto verde

### SEO
- Título: "Guards en Angular 21: Protege tus Rutas"
- Tags: Angular, Angular 21, Guards, Router, Tutorial
- Descripción: Aprende a implementar Guards funcionales en Angular 21 para proteger tus rutas de acceso no autorizado.

### Thumbnail
- Icono de escudo/candado
- Texto: "Guards en Angular 21"
- Logo de Angular
- Colores: Azul Angular + Rojo para énfasis

---

## Links para Descripción

1. [Contenido del Día 9](../contenido.md)
2. [Ejercicios Prácticos](../ejercicios/lab-01.md)
3. [Tests del Guard](../ejercicios/lab-02.md)
4. [Documentación de Angular Router](https://angular.io/guide/router)
5. [Código del Proyecto](../../../src/app/core/guards/)

---

*Guion de Video YouTube - Día 9*
*Curso Angular 21 - UyuniAdmin Frontend*
