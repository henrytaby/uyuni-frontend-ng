# Assessment: Día 16 - Integración Completa

## Información del Assessment

| Atributo | Valor |
|----------|-------|
| **Tiempo estimado** | 20 minutos |
| **Total de preguntas** | 15 |
| **Puntuación mínima** | 70% (11 correctas) |
| **Tipo** | Selección múltiple y código |

---

## Instrucciones

1. Lee cada pregunta cuidadosamente
2. Selecciona la respuesta correcta
3. Para preguntas de código, analiza el código proporcionado
4. Al finalizar, verifica tus respuestas con la clave de respuestas

---

## Preguntas de Selección Múltiple

### Pregunta 1: Arquitectura de Integración

**¿Cuál es la capa responsable de hacer llamadas HTTP?**

A) Presentation Layer
B) Business Layer
C) Infrastructure Layer
D) Data Layer

---

### Pregunta 2: AuthService en Features

**¿Cómo accedo al usuario logueado desde un componente?**

A) `this.authService.user.value`
B) `this.authService.currentUser()`
C) `this.authService.getUser()`
D) `localStorage.getItem('user')`

---

### Pregunta 3: Layout

**¿Dónde se coloca el router-outlet en AppLayoutComponent?**

A) En el sidebar
B) En el header
C) En el main content area
D) En el AppComponent

---

### Pregunta 4: Sidebar Dinámico

**¿Qué signal se usa para filtrar items del sidebar por rol?**

A) `signal()`
B) `input()`
C) `computed()`
D) `output()`

---

### Pregunta 5: Flujo de Datos

**¿En qué orden fluyen los datos en una operación HTTP?**

A) Service → Component → Interceptor → API
B) Component → Service → Interceptor → API
C) Interceptor → Component → Service → API
D) API → Service → Component → Interceptor

---

### Pregunta 6: Logout

**¿Qué debe hacer el método logout()?**

A) Solo eliminar token de localStorage
B) Solo navegar a /signin
C) Eliminar token, limpiar estado y navegar
D) Recargar la página

---

### Pregunta 7: Header Dropdown

**¿Qué información se muestra en el dropdown del usuario?**

A) Solo el nombre
B) Nombre, email y roles
C) Solo el avatar
D) Nombre y avatar

---

### Pregunta 8: Rutas Protegidas

**¿Qué componente NO debe tener el authGuard?**

A) Dashboard
B) Users
C) SignIn
D) Profile

---

### Pregunta 9: Loading State

**¿Dónde se muestra el loading spinner global?**

A) En cada componente
B) En AppLayoutComponent
C) En AppComponent
D) En el interceptor

---

### Pregunta 10: Error Handling

**¿Qué código HTTP indica token expirado?**

A) 200
B) 401
C) 403
D) 500

---

## Preguntas de Código

### Pregunta 11: Análisis de Código

**Analiza el siguiente código:**

```typescript
export class DashboardComponent {
  private authService = inject(AuthService);
  
  user = this.authService.currentUser;
  
  getUserName(): string {
    return this.user().name;
  }
}
```

**¿Qué problema potencial tiene este código?**

A) El signal no está bien definido
B) `user()` puede ser null
C) Falta el tipo de retorno
D) No hay problema, el código es correcto

---

### Pregunta 12: Análisis de Código

**Analiza el siguiente código:**

```typescript
onLogout(): void {
  this.authService.logout();
  this.router.navigate(['/signin']);
}
```

**¿Qué falta en este código?**

A) Nada, el código es correcto
B) Esperar a que logout termine
C) Eliminar el token manualmente
D) Mostrar mensaje de confirmación

---

### Pregunta 13: Completar Código

**Completa el código para filtrar items del sidebar:**

```typescript
visibleMenuItems = _____________(() => {
  const currentRole = this.authService.activeRole()?.name || 'user';
  return this.allMenuItems().___________(item => 
    item.roles.___________(currentRole)
  );
});
```

**¿Cuál es la respuesta correcta?**

A) `signal; filter; includes`
B) `computed; filter; includes`
C) `computed; map; contains`
D) `signal; map; contains`

---

### Pregunta 14: Routing

**Analiza la siguiente configuración:**

```typescript
export const routes: Routes = [
  { path: 'signin', loadComponent: () => import('./auth/...') },
  { 
    path: '', 
    canActivate: [authGuard],
    loadComponent: () => import('./layout/...'),
    children: [
      { path: 'dashboard', loadChildren: () => import('./dashboard/...') }
    ]
  }
];
```

**¿Por qué signin NO tiene el guard?**

A) Es un error, todas las rutas deben tener guard
B) Signin es una ruta pública
C) El guard está en el componente
D) Falta configuración

---

### Pregunta 15: Interceptor

**¿Qué headers añade el authInterceptor?**

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.accessToken();
  const activeRole = authService.activeRole();
  
  let authReq = req;
  
  if (token) {
    authReq = authReq.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'X-Active-Role': activeRole()?.id || ''
      }
    });
  }
  
  return next(authReq);
};
```

**¿Qué headers se añaden?**

A) Solo Authorization
B) Solo X-Active-Role
C) Authorization y X-Active-Role
D) Ninguno

---

## Clave de Respuestas

| Pregunta | Respuesta | Explicación |
|----------|-----------|-------------|
| 1 | C | Infrastructure Layer maneja HTTP, interceptors y guards |
| 2 | B | `currentUser()` es un signal que retorna el usuario actual |
| 3 | C | El router-outlet va en el main content area del layout |
| 4 | C | `computed()` deriva estado basado en otros signals |
| 5 | B | Component → Service → Interceptor → API es el orden correcto |
| 6 | C | Logout debe limpiar token, estado y navegar |
| 7 | B | El dropdown muestra nombre, email y roles disponibles |
| 8 | C | SignIn es una ruta pública, no requiere autenticación |
| 9 | C | El loading global va en AppComponent para persistir |
| 10 | B | 401 Unauthorized indica token inválido o expirado |
| 11 | B | `user()` puede ser null si no hay usuario logueado |
| 12 | A | El código es correcto, logout es síncrono |
| 13 | B | `computed; filter; includes` es la combinación correcta |
| 14 | B | SignIn es público, no requiere autenticación |
| 15 | C | Se añaden Authorization y X-Active-Role |

---

## Evaluación

### Calificación:

- **13-15 correctas**: ¡Excelente! Dominas la integración completa
- **11-12 correctas**: Buen trabajo. Repasa los conceptos que fallaste
- **9-10 correctas**: Aprobado. Necesitas reforzar algunos conceptos
- **Menos de 9**: No aprobado. Revisa el contenido del día antes de continuar

### Próximos pasos según tu resultado:

- **Excelente**: Continúa con el Día 17 - Testing
- **Buen trabajo**: Repasa los labs antes de continuar
- **Aprobado**: Repasa el contenido.md y los slides
- **No aprobado**: Repite el contenido del día y los labs

---

## Preguntas de Reflexión

1. ¿Por qué es importante separar las capas de la arquitectura?
2. ¿Qué ventajas tiene el sidebar dinámico por rol?
3. ¿Cómo afecta el flujo de datos al debugging?
4. ¿Por qué el loading global va en AppComponent?

---

*Assessment - Día 16 - Curso Angular 21 - UyuniAdmin Frontend*
