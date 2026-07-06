# Guion de Video YouTube - Día 3: Lazy Loading y Rutas en Angular 21

## Metadatos del Video

| Aspecto | Detalle |
|---------|---------|
| **Título** | Lazy Loading y Rutas en Angular 21 - Curso Enterprise Día 3 |
| **Duración** | 25-30 minutos |
| **Formato** | Tutorial con demo en vivo |
| **Thumbnail** | Split: código vs bundle analyzer |

---

## Estructura del Video

### [00:00 - 01:00] Intro

**Visual**: Logo del curso animado → Host en cámara

**Audio**:
"¡Hola! Bienvenidos al Día 3 del curso de Angular 21 Enterprise. Hoy vamos a transformar nuestra aplicación con Lazy Loading y Rutas.

Al final de este video, tu aplicación cargará 3 veces más rápido y tendrás control total sobre quién accede a cada página.

¡Vamos!"

**Visual**: Título animado: "Día 3: Lazy Loading y Rutas"

---

### [01:00 - 03:00] Hook: El Problema

**Visual**: Screen recording - Chrome DevTools Network tab

**Audio**:
"Miren esto. Esta es una aplicación Angular típica sin lazy loading. El bundle principal tiene 2.1 megabytes.

[PAUSA]

El usuario abre la app y espera... 1, 2, 3, 4, 5 segundos. Cinco segundos antes de ver algo.

¿Por qué? Porque estamos cargando TODO al inicio. Dashboard, perfil, configuración, reportes... todo junto.

Esto es como comprar todo el supermercado cuando solo necesitas pan."

**Visual**: Gráfico de barras - Bundle size comparison

---

### [03:00 - 05:00] Contexto

**Visual**: Host en cámara + gráficos

**Audio**:
"Las estadísticas son claras: cada segundo de carga adicional reduce conversiones en 7%.

En aplicaciones enterprise, esto significa usuarios frustrados, menos productividad, y más tickets de soporte.

La buena noticia: el 80% del código no se necesita en la primera carga. El usuario entra al dashboard, no a configuración.

Lazy Loading nos permite cargar solo lo necesario, cuando se necesita."

**Visual**: Animación - Bundle dividiéndose en chunks

---

### [05:00 - 10:00] Concepto 1: Lazy Loading

**Visual**: Screen recording - VS Code

**Audio**:
"Vamos al código. Abrimos app.routes.ts.

Esta es la configuración tradicional sin lazy loading:

```typescript
export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'users', component: UsersComponent }
];
```

Todo se importa al inicio. El bundle crece con cada feature.

Ahora, con lazy loading:

```typescript
export const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard.routes').then(m => m.routes)
  }
];
```

La diferencia: usamos import dinámico. El código de dashboard no se carga hasta que el usuario navega a esa ruta."

**Visual**: Demo en vivo - Navegación y Network tab

**Audio**:
"Vean el Network tab. Cuando navego a dashboard, aparece un nuevo chunk: dashboard.component.js. Eso es lazy loading en acción."

---

### [10:00 - 15:00] Concepto 2: Route Guards

**Visual**: Screen recording - VS Code

**Audio**:
"Ahora hablemos de Guards. Si Lazy Loading es cuándo cargar, Guards son QUIÉN puede acceder.

Creamos un guard con el CLI:

```bash
ng g guard guards/auth --functional
```

El código generado:

```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  
  return router.parseUrl('/signin');
};
```

[PAUSA]

Analicemos: usamos inject para obtener AuthService, verificamos si está autenticado, y retornamos true o una redirección."

**Visual**: Demo en vivo - Guard bloqueando acceso

**Audio**:
"Miren esto. Intento navegar a dashboard sin estar logueado. El guard me redirige a signin. Perfecto."

---

### [15:00 - 20:00] Concepto 3: Resolvers

**Visual**: Screen recording - VS Code

**Audio**:
"El tercer concepto: Resolvers. Preparan datos antes de activar el componente.

Sin resolver, el componente se muestra vacío mientras carga datos. Con resolver, el componente se muestra con datos listos.

Creamos el resolver:

```typescript
export const userResolver: ResolveFn<User> = (route, state) => {
  const userService = inject(UserService);
  const id = route.paramMap.get('id');
  return userService.getUser(id!);
};
```

Y lo usamos en la ruta:

```typescript
{
  path: 'user/:id',
  resolve: { user: userResolver },
  component: UserDetailComponent
}
```

En el componente, accedemos a los datos:

```typescript
user = this.route.snapshot.data['user'];
```"

**Visual**: Split screen - Con y sin resolver

**Audio**:
"Vean la diferencia. Sin resolver: loading, loading, datos. Con resolver: datos inmediatamente. La experiencia es más fluida."

---

### [20:00 - 23:00] Concepto 4: Rutas Anidadas

**Visual**: Screen recording - VS Code + navegador

**Audio**:
"Finalmente, rutas anidadas. Perfectas para layouts complejos.

Definimos children en la ruta:

```typescript
{
  path: 'settings',
  component: SettingsLayoutComponent,
  children: [
    { path: 'general', component: GeneralComponent },
    { path: 'security', component: SecurityComponent }
  ]
}
```

En el template del layout:

```html
<nav>
  <a routerLink=\"general\">General</a>
  <a routerLink=\"security\">Security</a>
</nav>
<router-outlet></router-outlet>
```

El router-outlet es donde aparece el componente hijo."

**Visual**: Demo en vivo - Navegación anidada

---

### [23:00 - 25:00] Error Común

**Visual**: Screen recording - Terminal con error

**Audio**:
"Ahora, el error más común que verán.

[PAUSA]

Este error: 'Cannot find module' suele aparecer cuando la ruta del import está mal.

```typescript
// ❌ Mal
loadChildren: './dashboard.module#DashboardModule'

// ✅ Bien
loadChildren: () => import('./dashboard.routes').then(m => m.routes)
```

La sintaxis antigua con # ya no funciona en Angular 17+. Siempre usen import dinámico con .then()."

**Visual**: Código corregido en VS Code

---

### [25:00 - 27:00] Mini Reto

**Visual**: Host en cámara

**Audio**:
"Ahora un mini reto para ustedes.

Tienen 5 minutos para:

1. Crear una feature 'products' con lazy loading
2. Agregar un guard que solo permita acceso a administradores
3. Crear un resolver que cargue la lista de productos

Pausen el video y intenten. Luego volveré con la solución."

**Visual**: Contador de 5 minutos en pantalla

---

### [27:00 - 29:00] Solución del Reto

**Visual**: Screen recording - VS Code

**Audio**:
"¿Listos? Aquí está la solución.

Primero, creamos la feature:

```bash
ng g component features/products/pages/list --standalone
```

Luego, el archivo de rutas:

```typescript
// products.routes.ts
import { Routes } from '@angular/router';
import { ProductListComponent } from './pages/list/product-list.component';

export const routes: Routes = [
  { path: '', component: ProductListComponent }
];
```

En app.routes.ts:

```typescript
{
  path: 'products',
  canActivate: [adminGuard],
  loadChildren: () => import('./features/products/products.routes').then(m => m.routes)
}
```

Y el resolver:

```typescript
export const productsResolver: ResolveFn<Product[]> = () => {
  return inject(ProductService).getProducts();
};
```"

---

### [29:00 - 30:00] Cierre

**Visual**: Host en cámara + resumen visual

**Audio**:
"¡Excelente! Hoy aprendieron:

1. Lazy Loading para cargar código bajo demanda
2. Guards para controlar acceso
3. Resolvers para precargar datos
4. Rutas anidadas para layouts complejos

En el próximo video, Día 4, veremos Core Services: LoggerService, LoadingService, ConfigService y TokenRefreshService.

Si este video les ayudó, denle like y suscríbanse. Los ejercicios completos están en la descripción.

¡Nos vemos en el próximo video!"

**Visual**: Outro con links a ejercicios y siguiente video

---

## Notas de Producción

### Visual
- Usar screen recording de alta calidad (1080p mínimo)
- Zoom a código importante (150%)
- Highlight de líneas clave
- Transiciones suaves entre secciones

### Audio
- Micrófono de buena calidad
- Reducir ruido de fondo
- Normalizar volumen
- Música sutil de fondo (opcional)

### Edición
- Cortar pausas largas
- Agregar callouts para términos clave
- Usar picture-in-picture para demos
- Incluir código en descripción

### SEO
- Tags: Angular 21, Lazy Loading, Route Guards, Tutorial
- Descripción con timestamps
- Cards con videos relacionados

---

## Recursos Adicionales

### En Descripción
- [ ] Código fuente del episodio
- [ ] Ejercicios prácticos
- [ ] Cheatsheet PDF
- [ ] Link al siguiente video

### Cards
- [ ] Día 1: Fundamentos
- [ ] Día 2: Arquitectura DDD
- [ ] Playlist del curso

---

*Curso: Angular 21 Enterprise*
*Día: 3 de 18*
*Formato: Video YouTube*
