# Día 13: Assessment - UI con PrimeNG

## Información General

- **Tiempo estimado:** 30 minutos
- **Total de preguntas:** 20
- **Puntaje máximo:** 100 puntos
- **Puntaje mínimo aprobatorio:** 70 puntos

---

## Sección 1: Configuración de PrimeNG (25 pts)

### Pregunta 1 (5 pts)

¿Cuál es la forma correcta de configurar PrimeNG en Angular 21?

a) Importar `PrimeNGModule` en `app.module.ts`
b) Usar `providePrimeNG()` en `app.config.ts`
c) Agregar `<primeng-root>` en `index.html`
d) No requiere configuración

**Respuesta correcta:** b)

**Explicación:** En Angular 21 con standalone components, PrimeNG se configura usando `providePrimeNG()` en el `ApplicationConfig`.

---

### Pregunta 2 (5 pts)

¿Qué paquete contiene el tema Aura?

a) `primeng`
b) `primeicons`
c) `@primeuix/themes`
d) `@primeng/themes`

**Respuesta correcta:** c)

**Explicación:** El tema Aura está en el paquete `@primeuix/themes`, que reemplazó al deprecated `@primeng/themes`.

---

### Pregunta 3 (5 pts)

¿Cómo se importa un componente PrimeNG en un componente standalone?

a) `imports: [PrimeNG]`
b) `imports: [ButtonModule]`
c) `imports: [p-button]`
d) No requiere importación

**Respuesta correcta:** b)

**Explicación:** Cada componente PrimeNG tiene su propio módulo que debe importarse, como `ButtonModule` para `p-button`.

---

### Pregunta 4 (5 pts)

¿Qué propiedad activa el efecto ripple en los botones?

a) `ripple: true` en el componente
b) `ripple: true` en la configuración global
c) `effect: 'ripple'` en el botón
d) Se activa automáticamente

**Respuesta correcta:** b)

**Explicación:** El efecto ripple se configura globalmente con `providePrimeNG({ ripple: true })`.

---

### Pregunta 5 (5 pts)

¿Cuál es el selector correcto para el componente Button?

a) `<button pButton>`
b) `<p-button>`
c) `<primeng-button>`
d) `<ng-button>`

**Respuesta correcta:** b)

**Explicación:** Los componentes PrimeNG usan el prefijo `p-`, como `<p-button>`, `<p-table>`, etc.

---

## Sección 2: Componentes de Formulario (25 pts)

### Pregunta 6 (5 pts)

¿Qué directiva se usa para convertir un input en InputText de PrimeNG?

a) `pInput`
b) `pInputText`
c) `primengInput`
d) `inputPrime`

**Respuesta correcta:** b)

**Explicación:** La directiva `pInputText` aplica los estilos de PrimeNG a un input nativo.

---

### Pregunta 7 (5 pts)

¿Cómo se configura un Dropdown para mostrar una propiedad específica del objeto?

a) `displayField="name"`
b) `optionLabel="name"`
c) `showProperty="name"`
d) `label="name"`

**Respuesta correcta:** b)

**Explicación:** `optionLabel` especifica qué propiedad del objeto mostrar como etiqueta.

---

### Pregunta 8 (5 pts)

¿Qué propiedad habilita la búsqueda en un Dropdown?

a) `searchable="true"`
b) `filter="true"`
c) `search="true"`
d) `autocomplete="true"`

**Respuesta correcta:** b)

**Explicación:** La propiedad `filter` habilita el campo de búsqueda en Dropdown y MultiSelect.

---

### Pregunta 9 (5 pts)

¿Cómo se obtiene el valor seleccionado de un MultiSelect?

a) `[(value)]="selected"`
b) `[(ngModel)]="selected"`
c) `[selection]="selected"`
d) `[selected]="selected"`

**Respuesta correcta:** b)

**Explicación:** PrimeNG usa `ngModel` para two-way binding, igual que los inputs nativos.

---

### Pregunta 10 (5 pts)

¿Qué componente se usa para entrada de números con formato?

a) `p-input-text type="number"`
b) `p-input-number`
c) `p-number`
d) `p-numeric`

**Respuesta correcta:** b)

**Explicación:** `p-inputNumber` (módulo `InputNumberModule`) proporciona entrada numérica con formato.

---

## Sección 3: Componentes de Datos (25 pts)

### Pregunta 11 (5 pts)

¿Qué propiedad habilita la paginación en una tabla?

a) `[paging]="true"`
b) `[paginator]="true"`
c) `[pagination]="true"`
d) `[pages]="true"`

**Respuesta correcta:** b)

**Explicación:** La propiedad `paginator` activa la paginación en `p-table`.

---

### Pregunta 12 (5 pts)

¿Cómo se define el número de filas por página?

a) `[pageSize]="10"`
b) `[rows]="10"`
c) `[perPage]="10"`
d) `[limit]="10"`

**Respuesta correcta:** b)

**Explicación:** La propiedad `rows` define cuántas filas mostrar por página.

---

### Pregunta 13 (5 pts)

¿Qué directiva se usa para hacer una columna ordenable?

a) `pSortable`
b) `pSortableColumn`
c) `sortable`
d) `orderable`

**Respuesta correcta:** b)

**Explicación:** `pSortableColumn` en el `<th>` hace la columna ordenable.

---

### Pregunta 14 (5 pts)

¿Cómo se accede a la instancia de la tabla para aplicar filtros?

a) `@ViewChild('table') table;`
b) `@ViewChild('dt') table: Table;`
c) `@Input() table: Table;`
d) `@ContentChild(Table) table;`

**Respuesta correcta:** b)

**Explicación:** Se usa `@ViewChild` con el tipo `Table` de PrimeNG para acceder a los métodos de la tabla.

---

### Pregunta 15 (5 pts)

¿Qué propiedad habilita el scroll virtual para grandes datasets?

a) `[virtualScroll]="true"`
b) `[virtual]="true"`
c) `[lazyScroll]="true"`
d) `[infiniteScroll]="true"`

**Respuesta correcta:** a)

**Explicación:** `virtualScroll` activa el renderizado virtual, renderizando solo las filas visibles.

---

## Sección 4: Componentes de UI (25 pts)

### Pregunta 16 (5 pts)

¿Qué servicio se requiere para mostrar notificaciones Toast?

a) `NotificationService`
b) `MessageService`
c) `ToastService`
d) `AlertService`

**Respuesta correcta:** b)

**Explicación:** `MessageService` de `primeng/api` maneja las notificaciones Toast.

---

### Pregunta 17 (5 pts)

¿Cómo se muestra un diálogo de confirmación?

a) `DialogService.confirm()`
b) `ConfirmationService.confirm()`
c) `ConfirmDialog.open()`
d) `MessageService.confirm()`

**Respuesta correcta:** b)

**Explicación:** `ConfirmationService.confirm()` muestra el diálogo de confirmación.

---

### Pregunta 18 (5 pts)

¿Qué severidades están disponibles para Toast y Button?

a) `primary, secondary, danger`
b) `success, info, warn, error`
c) `info, warning, error, success`
d) `normal, important, critical`

**Respuesta correcta:** b)

**Explicación:** Las severidades son: `success`, `info`, `warn`, `error` (y `secondary`, `contrast` para buttons).

---

### Pregunta 19 (5 pts)

¿Cómo se hace un Dialog modal?

a) `[modal]="true"`
b) `[blocking]="true"`
c) `[overlay]="true"`
d) `[backdrop]="true"`

**Respuesta correcta:** a)

**Explicación:** La propiedad `modal` hace que el diálogo bloquee la interacción con el fondo.

---

### Pregunta 20 (5 pts)

¿Dónde se deben proporcionar MessageService y ConfirmationService?

a) En `app.config.ts` globalmente
b) En cada componente que los use
c) En el componente raíz del feature
d) b) o c) son correctas

**Respuesta correcta:** d)

**Explicación:** Pueden proporcionarse en el componente que los usa o en un componente padre del feature.

---

## Preguntas de Código

### Pregunta 21 (10 pts)

¿Qué está mal en este código?

```typescript
@Component({
  selector: 'app-demo',
  standalone: true,
  template: `
    <p-button label="Click" />
    <p-dropdown [options]="items" />
  `
})
export class DemoComponent {
  items = ['A', 'B', 'C'];
}
```

a) Falta `[(ngModel)]` en el dropdown
b) No se importan los módulos de PrimeNG
c) El array debe ser de objetos
d) b) y c) son correctas

**Respuesta correcta:** d)

**Explicación:** Faltan las importaciones (`ButtonModule`, `DropdownModule`) y el dropdown funciona mejor con objetos y `optionLabel`.

---

### Pregunta 22 (10 pts)

¿Cómo corregirías este código para que el Toast funcione?

```typescript
@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [ToastModule],
  template: `<p-toast />`
})
export class DemoComponent {
  constructor(private messageService: MessageService) {}
  
  show() {
    this.messageService.add({ severity: 'success', summary: 'OK' });
  }
}
```

a) Agregar `providers: [MessageService]`
b) Cambiar a `inject(MessageService)`
c) Importar `MessageService` de `primeng/api`
d) a) y c) son correctas

**Respuesta correcta:** d)

**Explicación:** Se necesita el provider y la importación correcta de `MessageService` desde `primeng/api`.

---

## Ejercicio Práctico

### Pregunta 23 (20 pts)

Implementa un componente con:
1. Tabla de productos (nombre, precio, categoría)
2. Paginación (5, 10, 20)
3. Ordenamiento por nombre y precio
4. Filtro global
5. Botón para agregar (abre dialog)

**Espacio para respuesta:**

```typescript
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <p-toast />
    
    <div class="card">
      <!-- Toolbar -->
      <div class="flex justify-between mb-4">
        <input 
          pInputText
          (input)="dt.filterGlobal($any($event.target).value, 'contains')"
          placeholder="Buscar..." />
        <p-button label="Nuevo" icon="pi pi-plus" (onClick)="openDialog()" />
      </div>
      
      <!-- Tabla -->
      <p-table 
        #dt
        [value]="products()"
        [paginator]="true"
        [rows]="10"
        [rowsPerPageOptions]="[5, 10, 20]"
        [globalFilterFields]="['name', 'category']">
        
        <ng-template pTemplate="header">
          <tr>
            <th pSortableColumn="name">Nombre <p-sortIcon field="name" /></th>
            <th pSortableColumn="price">Precio <p-sortIcon field="price" /></th>
            <th pSortableColumn="category">Categoría <p-sortIcon field="category" /></th>
          </tr>
        </ng-template>
        
        <ng-template pTemplate="body" let-product>
          <tr>
            <td>{{ product.name }}</td>
            <td>{{ product.price | currency }}</td>
            <td>{{ product.category }}</td>
          </tr>
        </ng-template>
      </p-table>
    </div>
    
    <!-- Dialog -->
    <p-dialog 
      [(visible)]="dialogVisible"
      header="Nuevo Producto"
      [modal]="true">
      <!-- Formulario -->
    </p-dialog>
  `
})
export class ProductsComponent {
  products = signal([
    { name: 'Laptop', price: 999, category: 'Electrónica' },
    { name: 'Mouse', price: 29, category: 'Accesorios' }
  ]);
  
  dialogVisible = signal(false);
  
  openDialog(): void {
    this.dialogVisible.set(true);
  }
}
```

---

## Respuestas Correctas

| Pregunta | Respuesta |
|----------|-----------|
| 1 | b) |
| 2 | c) |
| 3 | b) |
| 4 | b) |
| 5 | b) |
| 6 | b) |
| 7 | b) |
| 8 | b) |
| 9 | b) |
| 10 | b) |
| 11 | b) |
| 12 | b) |
| 13 | b) |
| 14 | b) |
| 15 | a) |
| 16 | b) |
| 17 | b) |
| 18 | b) |
| 19 | a) |
| 20 | d) |
| 21 | d) |
| 22 | d) |

---

## Tabla de Puntuación

| Puntos | Calificación |
|--------|--------------|
| 90-100 | Excelente |
| 80-89 | Muy Bien |
| 70-79 | Aprobado |
| 60-69 | Necesita refuerzo |
| < 60 | Reprobar |

---

*Assessment - Día 13 - Curso Angular 21 - UyuniAdmin Frontend*
