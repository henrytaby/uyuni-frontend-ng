# Día 13: Cheatsheet - UI con PrimeNG

## Configuración

### Instalación

```bash
npm install primeng @primeuix/themes primeicons
```

### app.config.ts

```typescript
import { providePrimeNG } from 'primeng/config';
import { Aura } from '@primeuix/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [
    providePrimeNG({
      ripple: true,
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.dark',
          cssLayer: { name: 'primeng', order: 'base, primeng, components, utilities' }
        }
      }
    })
  ]
};
```

### styles.css

```css
@import "primeng/resources/primeng.css";
@import "primeicons/primeicons.css";
@import "@primeuix/themes/aura";

/* Con Tailwind CSS v4 */
@import "tailwindcss";
@plugin "tailwindcss-primeui";
```

---

## Button

### Importación

```typescript
import { ButtonModule } from 'primeng/button';
```

### Uso Básico

```html
<p-button label="Guardar" />
<p-button label="Editar" icon="pi pi-pencil" />
<p-button icon="pi pi-plus" rounded />
```

### Severities

```html
<p-button label="Primary" />
<p-button label="Secondary" severity="secondary" />
<p-button label="Success" severity="success" />
<p-button label="Info" severity="info" />
<p-button label="Warning" severity="warn" />
<p-button label="Danger" severity="danger" />
<p-button label="Contrast" severity="contrast" />
```

### Variantes

```html
<p-button label="Outlined" outlined />
<p-button label="Raised" raised />
<p-button label="Rounded" rounded />
<p-button label="Text" text />
<p-button label="Link" link />
```

### Estados

```html
<p-button label="Loading" loading />
<p-button label="Disabled" disabled />
```

---

## InputText

### Importación

```typescript
import { InputTextModule } from 'primeng/inputtext';
```

### Uso

```html
<input pInputText [(ngModel)]="value" />
<input pInputText type="email" />
<input pInputText type="password" />
```

### Con Validación

```html
<input 
  pInputText 
  [(ngModel)]="value"
  [class.ng-invalid]="invalid"
  [class.ng-dirty]="touched" />
```

---

## InputNumber

### Importación

```typescript
import { InputNumberModule } from 'primeng/inputnumber';
```

### Uso

```html
<p-inputNumber [(ngModel)]="value" />
<p-inputNumber [(ngModel)]="value" mode="currency" currency="USD" />
<p-inputNumber [(ngModel)]="value" [min]="0" [max]="100" />
<p-inputNumber [(ngModel)]="value" [step]="5" />
```

---

## Dropdown

### Importación

```typescript
import { DropdownModule } from 'primeng/dropdown';
```

### Uso Básico

```html
<p-dropdown 
  [options]="items"
  [(ngModel)]="selected"
  optionLabel="name"
  optionValue="id"
  placeholder="Selecciona..." />
```

### Con Búsqueda

```html
<p-dropdown 
  [options]="items"
  [filter]="true"
  filterPlaceHolder="Buscar..."
  optionLabel="name" />
```

### Propiedades

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `options` | array | Lista de opciones |
| `optionLabel` | string | Propiedad a mostrar |
| `optionValue` | string | Propiedad como valor |
| `filter` | boolean | Habilita búsqueda |
| `placeholder` | string | Texto placeholder |
| `disabled` | boolean | Deshabilita |

---

## MultiSelect

### Importación

```typescript
import { MultiSelectModule } from 'primeng/multiselect';
```

### Uso

```html
<p-multiSelect 
  [options]="items"
  [(ngModel)]="selected"
  optionLabel="name"
  optionValue="id"
  placeholder="Selecciona..." />
```

### Propiedades

```html
<p-multiSelect 
  [options]="items"
  [showHeader]="true"
  [selectAll]="true"
  [filter]="true" />
```

---

## Calendar

### Importación

```typescript
import { CalendarModule } from 'primeng/calendar';
```

### Uso

```html
<p-calendar [(ngModel)]="date" />
<p-calendar [(ngModel)]="date" dateFormat="dd/mm/yy" />
<p-calendar [(ngModel)]="dates" selectionMode="multiple" />
<p-calendar [(ngModel)]="range" selectionMode="range" />
```

### Propiedades

```html
<p-calendar 
  [minDate]="minDate"
  [maxDate]="maxDate"
  [showTime]="true"
  [hourFormat]="24"
  placeholder="Selecciona fecha" />
```

---

## Table

### Importación

```typescript
import { TableModule } from 'primeng/table';
```

### Estructura Básica

```html
<p-table [value]="data" [paginator]="true" [rows]="10">
  <ng-template pTemplate="header">
    <tr>
      <th>Nombre</th>
      <th>Email</th>
    </tr>
  </ng-template>
  
  <ng-template pTemplate="body" let-item>
    <tr>
      <td>{{ item.name }}</td>
      <td>{{ item.email }}</td>
    </tr>
  </ng-template>
</p-table>
```

### Con Ordenamiento

```html
<p-table [value]="data">
  <ng-template pTemplate="header">
    <tr>
      <th pSortableColumn="name">Nombre <p-sortIcon field="name" /></th>
      <th pSortableColumn="email">Email <p-sortIcon field="email" /></th>
    </tr>
  </ng-template>
  <!-- body -->
</p-table>
```

### Con Selección

```html
<p-table 
  [value]="data"
  [(selection)]="selected"
  dataKey="id">
  
  <ng-template pTemplate="header">
    <tr>
      <th><p-tableHeaderCheckbox /></th>
      <th>Nombre</th>
    </tr>
  </ng-template>
  
  <ng-template pTemplate="body" let-item>
    <tr>
      <td><p-tableCheckbox [value]="item" /></td>
      <td>{{ item.name }}</td>
    </tr>
  </ng-template>
</p-table>
```

### Con Filtro Global

```html
<p-table 
  #dt
  [value]="data"
  [globalFilterFields]="['name', 'email']">
  
  <ng-template pTemplate="caption">
    <input 
      pInputText
      (input)="dt.filterGlobal($event.target.value, 'contains')" />
  </ng-template>
  
  <!-- header y body -->
</p-table>
```

### Virtual Scroll

```html
<p-table 
  [value]="largeData"
  [virtualScroll]="true"
  [virtualScrollItemSize]="48"
  scrollHeight="500px">
  <!-- templates -->
</p-table>
```

### Propiedades

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `value` | array | Datos de la tabla |
| `paginator` | boolean | Habilita paginación |
| `rows` | number | Filas por página |
| `rowsPerPageOptions` | array | Opciones de filas |
| `globalFilterFields` | array | Campos para filtro global |
| `selection` | array | Items seleccionados |
| `dataKey` | string | Campo único para selección |
| `virtualScroll` | boolean | Habilita scroll virtual |

---

## Dialog

### Importación

```typescript
import { DialogModule } from 'primeng/dialog';
```

### Uso

```html
<p-dialog 
  [(visible)]="showDialog"
  header="Título"
  [modal]="true"
  [style]="{ width: '450px' }">
  
  <p>Contenido del diálogo</p>
  
  <ng-template pTemplate="footer">
    <p-button label="Cerrar" (onClick)="showDialog = false" />
  </ng-template>
</p-dialog>
```

### Propiedades

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `visible` | boolean | Controla visibilidad |
| `header` | string | Título |
| `modal` | boolean | Bloquea fondo |
| `closable` | boolean | Muestra botón cerrar |
| `draggable` | boolean | Permite arrastrar |
| `resizable` | boolean | Permite redimensionar |

---

## Toast

### Importación

```typescript
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
```

### Configuración

```typescript
@Component({
  imports: [ToastModule],
  providers: [MessageService]
})
```

### Template

```html
<p-toast position="top-right" />
```

### Uso

```typescript
messageService.add({
  severity: 'success',
  summary: 'Éxito',
  detail: 'Operación completada'
});

// Múltiples mensajes
messageService.addAll([
  { severity: 'info', summary: 'Info 1' },
  { severity: 'warn', summary: 'Warning' }
]);

// Limpiar
messageService.clear();
```

### Severities

| Severity | Color | Uso |
|----------|-------|-----|
| `success` | Verde | Operación exitosa |
| `info` | Azul | Información |
| `warn` | Amarillo | Advertencia |
| `error` | Rojo | Error |

---

## ConfirmDialog

### Importación

```typescript
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
```

### Configuración

```typescript
@Component({
  imports: [ConfirmDialogModule],
  providers: [ConfirmationService]
})
```

### Template

```html
<p-confirmDialog 
  header="Confirmación"
  icon="pi pi-exclamation-triangle"
  acceptLabel="Sí"
  rejectLabel="No" />
```

### Uso

```typescript
confirmationService.confirm({
  message: '¿Estás seguro?',
  header: 'Confirmar',
  icon: 'pi pi-exclamation-triangle',
  accept: () => {
    // Acción al aceptar
  },
  reject: () => {
    // Acción al rechazar
  }
});
```

---

## Tag

### Importación

```typescript
import { TagModule } from 'primeng/tag';
```

### Uso

```html
<p-tag value="Activo" />
<p-tag value="Nuevo" severity="success" />
<p-tag value="Pendiente" severity="warning" />
<p-tag value="Error" severity="danger" />
<p-tag value="Info" severity="info" />
```

---

## Personalización de Tema

### Variables CSS

```css
:root {
  /* Color primario */
  --p-primary-color: #38240c;
  --p-primary-hover-color: #4a2d10;
  --p-primary-active-color: #5a3815;
  
  /* Colores semánticos */
  --p-success-color: #22c55e;
  --p-info-color: #3b82f6;
  --p-warning-color: #f59e0b;
  --p-danger-color: #ef4444;
  
  /* Superficies */
  --p-surface-0: #ffffff;
  --p-surface-50: #f8fafc;
  --p-surface-100: #f1f5f9;
}

/* Dark mode */
.dark {
  --p-primary-color: #c4a77d;
  --p-surface-0: #1a1a1a;
  --p-surface-50: #252525;
}
```

### Tema Personalizado

```typescript
import { Aura } from '@primeuix/themes/aura';

const CustomTheme = {
  ...Aura,
  semantic: {
    ...Aura.semantic,
    primary: {
      50: '#f5f0e8',
      100: '#e6d9c4',
      500: '#38240c',
      600: '#2e1d0a',
      700: '#231608'
    }
  }
};

providePrimeNG({
  theme: { preset: CustomTheme }
});
```

---

## Errores Comunes

### 1. No Importar el Módulo

```typescript
// ❌ Error
@Component({
  template: `<p-button label="Click" />`
})

// ✅ Correcto
@Component({
  imports: [ButtonModule],
  template: `<p-button label="Click" />`
})
```

### 2. Falta Provider para MessageService

```typescript
// ❌ Error: No provider for MessageService
@Component({
  imports: [ToastModule],
  template: `<p-toast />`
})

// ✅ Correcto
@Component({
  imports: [ToastModule],
  providers: [MessageService],
  template: `<p-toast />`
})
```

### 3. Dropdown sin optionLabel

```typescript
// ❌ Muestra [object Object]
<p-dropdown [options]="items" />

// ✅ Muestra la propiedad correcta
<p-dropdown [options]="items" optionLabel="name" />
```

### 4. Table sin dataKey para Selección

```typescript
// ❌ Selección no funciona correctamente
<p-table [(selection)]="selected">

// ✅ Con dataKey
<p-table [(selection)]="selected" dataKey="id">
```

---

## Snippets Útiles

### CRUD Completo

```typescript
@Component({
  imports: [TableModule, DialogModule, ToastModule, ConfirmDialogModule, ButtonModule],
  providers: [MessageService, ConfirmationService],
  template: `
    <p-toast />
    <p-confirmDialog />
    
    <p-table [value]="items()" [(selection)]="selected" dataKey="id">
      <!-- header y body -->
    </p-table>
    
    <p-dialog [(visible)]="dialogVisible" header="Nuevo">
      <!-- formulario -->
    </p-dialog>
  `
})
export class CrudComponent {
  items = signal<Item[]>([]);
  selected = signal<Item[]>([]);
  dialogVisible = signal(false);
}
```

### Tabla con Todo

```typescript
<p-table 
  #dt
  [value]="data()"
  [paginator]="true"
  [rows]="10"
  [rowsPerPageOptions]="[10, 20, 50]"
  [globalFilterFields]="['name', 'email']"
  [(selection)]="selected"
  dataKey="id"
  [rowHover]="true"
  [tableStyle]="{ 'min-width': '60rem' }">
  
  <ng-template pTemplate="caption">
    <input pInputText (input)="dt.filterGlobal($event.target.value, 'contains')" />
  </ng-template>
  
  <ng-template pTemplate="header">
    <tr>
      <th><p-tableHeaderCheckbox /></th>
      <th pSortableColumn="name">Nombre <p-sortIcon field="name" /></th>
    </tr>
  </ng-template>
  
  <ng-template pTemplate="body" let-item>
    <tr>
      <td><p-tableCheckbox [value]="item" /></td>
      <td>{{ item.name }}</td>
    </tr>
  </ng-template>
</p-table>
```

---

*Cheatsheet - Día 13 - Curso Angular 21 - UyuniAdmin Frontend*
