# Assessment: Día 15 - Features y Componentes

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

### Pregunta 1: Smart vs Dumb Components

**¿Cuál es la característica principal de un Smart Component (Page)?**

A) No puede tener estado local
B) Contiene lógica de negocio y coordina dumb components
C) Solo recibe datos a través de Input signals
D) No puede inyectar servicios

---

### Pregunta 2: Dumb Components

**¿Qué NO debe tener un Dumb Component?**

A) Input signals
B) Output signals
C) Inyección de servicios de negocio
D) Estado local de UI (hover, focus)

---

### Pregunta 3: Input Signals

**¿Cómo se define un Input signal requerido en Angular 21?**

A) `@Input() user: User;`
B) `user = input<User>();`
C) `user = input.required<User>();`
D) `user: Input<User>;`

---

### Pregunta 4: Output Signals

**¿Cómo se emite un evento desde un Output signal?**

A) `this.output.emit(data);`
B) `this.output.next(data);`
C) `this.output.set(data);`
D) `this.output.fire(data);`

---

### Pregunta 5: Estructura de Feature

**¿En qué carpeta se colocan los Smart Components (Pages)?**

A) `components/`
B) `pages/`
C) `smart/`
D) `containers/`

---

### Pregunta 6: Feature Services

**¿Cuál es la responsabilidad principal de un Feature Service?**

A) Manejar el routing del feature
B) Renderizar componentes de UI
C) Encapsular llamadas HTTP y lógica de datos
D) Manejar la autenticación global

---

### Pregunta 7: Routing Lazy Loading

**¿Cómo se configura lazy loading para un feature?**

A) `{ path: 'users', component: UserListComponent }`
B) `{ path: 'users', loadChildren: () => import('...') }`
C) `{ path: 'users', loadComponent: UserListComponent }`
D) `{ path: 'users', module: UsersModule }`

---

### Pregunta 8: Comunicación Padre-Hijo

**¿Cómo se comunica un Dumb Component con su padre?**

A) Inyectando el servicio del padre
B) Usando Output signals para emitir eventos
C) Modificando directamente el estado del padre
D) Usando variables globales

---

### Pregunta 9: Cache en Services

**¿Por qué es útil tener cache en un Feature Service?**

A) Para evitar llamadas HTTP repetitivas
B) Para persistir datos en localStorage
C) Para sincronizar entre pestañas del navegador
D) Para encriptar datos sensibles

---

### Pregunta 10: Two-way Binding

**¿Qué signal se usa para two-way binding en Angular 21?**

A) `input()`
B) `output()`
C) `model()`
D) `twoWay()`

---

## Preguntas de Código

### Pregunta 11: Análisis de Código

**Analiza el siguiente código:**

```typescript
@Component({
  selector: 'app-product-card',
  standalone: true
})
export class ProductCardComponent {
  private productService = inject(ProductService);
  
  product = input.required<Product>();
  
  onDelete(): void {
    this.productService.deleteProduct(this.product().id);
  }
}
```

**¿Qué problema tiene este código?**

A) El input signal está mal definido
B) El componente inyecta un servicio de negocio (no es dumb)
C) Falta el decorador @Component
D) El método onDelete está mal escrito

---

### Pregunta 12: Análisis de Código

**Analiza el siguiente código:**

```typescript
@Component({
  selector: 'app-user-list-page',
  standalone: true
})
export class UserListPageComponent implements OnInit {
  private userService = inject(UserService);
  
  users = signal<User[]>([]);
  
  ngOnInit(): void {
    this.userService.getUsers().subscribe(users => {
      this.users.set(users);
    });
  }
  
  addUser(user: User): void {
    this.users().push(user);
  }
}
```

**¿Qué problema tiene el método addUser?**

A) No hay problema, el código es correcto
B) Está mutando el signal directamente en lugar de usar .update()
C) Falta subscribirse al resultado
D) El método debería ser privado

---

### Pregunta 13: Completar Código

**Completa el código para crear un Output signal:**

```typescript
@Component({
  selector: 'app-item-card',
  standalone: true
})
export class ItemCardComponent {
  item = input.required<Item>();
  
  // Crear Output signal para emitir cuando se hace clic
  _____________ = _____________<Item>();
  
  onClick(): void {
    this.itemClick._____(this.item());
  }
}
```

**¿Cuál es la respuesta correcta?**

A) `itemClick; output; emit`
B) `itemClick = output(); emit`
C) `itemClick = output<Item>(); emit`
D) `itemClick: output; emit`

---

### Pregunta 14: Routing

**Analiza la siguiente configuración de rutas:**

```typescript
export const USERS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./pages/list/...') },
  { path: ':id', loadComponent: () => import('./pages/detail/...') },
  { path: 'new', loadComponent: () => import('./pages/form/...') }
];
```

**¿Cuál es el problema con este orden de rutas?**

A) No hay problema, el orden es correcto
B) La ruta 'new' debería ir antes que ':id'
C) La ruta ':id' debería ir primero
D) Falta la ruta por defecto

---

### Pregunta 15: Feature Service

**¿Qué método falta para completar el CRUD en este servicio?**

```typescript
@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  
  getProducts(): Observable<Product[]> { ... }
  
  getProductById(id: string): Observable<Product> { ... }
  
  createProduct(product: CreateProductRequest): Observable<Product> { ... }
  
  // Falta método para actualizar
  _______________(request: UpdateProductRequest): Observable<Product> {
    return this.http._____<Product>(`${this.apiUrl}/products/${request.id}`, request);
  }
  
  deleteProduct(id: string): Observable<void> { ... }
}
```

**¿Cuál es la respuesta correcta?**

A) `updateProduct; patch`
B) `updateProduct; put`
C) `editProduct; patch`
D) `saveProduct; post`

---

## Clave de Respuestas

| Pregunta | Respuesta | Explicación |
|----------|-----------|-------------|
| 1 | B | Los Smart Components contienen lógica de negocio y coordinan dumb components |
| 2 | C | Los Dumb Components no deben inyectar servicios de negocio, solo Input/Output |
| 3 | C | `input.required<User>()` define un Input signal requerido |
| 4 | A | Se usa `.emit()` para emitir eventos desde un Output signal |
| 5 | B | Los Smart Components (Pages) se colocan en `pages/` |
| 6 | C | Los Feature Services encapsulan llamadas HTTP y lógica de datos |
| 7 | B | `loadChildren` se usa para lazy loading de feature modules |
| 8 | B | Los Dumb Components usan Output signals para emitir eventos al padre |
| 9 | A | El cache evita llamadas HTTP repetitivas y mejora rendimiento |
| 10 | C | `model()` se usa para two-way binding |
| 11 | B | Un Dumb Component no debe inyectar servicios de negocio |
| 12 | B | Está mutando el signal con `.push()` en lugar de usar `.update()` |
| 13 | C | `itemClick = output<Item>(); emit` es la sintaxis correcta |
| 14 | B | La ruta 'new' debe ir antes que ':id' para evitar que 'new' se interprete como un ID |
| 15 | A | `updateProduct; patch` es correcto para actualizaciones parciales |

---

## Evaluación

### Calificación:

- **13-15 correctas**: ¡Excelente! Dominas los conceptos de Features y Componentes
- **11-12 correctas**: Buen trabajo. Repasa los conceptos que fallaste
- **9-10 correctas**: Aprobado. Necesitas reforzar algunos conceptos
- **Menos de 9**: No aprobado. Revisa el contenido del día antes de continuar

### Próximos pasos según tu resultado:

- **Excelente**: Continúa con el Día 16 - Integración Completa
- **Buen trabajo**: Repasa los labs antes de continuar
- **Aprobado**: Repasa el contenido.md y los slides
- **No aprobado**: Repite el contenido del día y los labs

---

## Preguntas de Reflexión

1. ¿Por qué es importante separar Smart y Dumb Components?
2. ¿Qué ventajas tiene el cache en Feature Services?
3. ¿Cómo afecta el orden de las rutas con parámetros?
4. ¿Cuándo usarías `model()` en lugar de `input()` y `output()`?

---

*Assessment - Día 15 - Curso Angular 21 - UyuniAdmin Frontend*
