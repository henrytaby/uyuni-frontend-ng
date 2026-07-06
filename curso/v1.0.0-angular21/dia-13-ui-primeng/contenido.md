# Día 13: Contenido Detallado - UI con PrimeNG

## 1. Introducción a PrimeNG (45 min)

### 1.1 Hook: El Problema de los Componentes UI

**Situación:** Necesitas construir una aplicación enterprise con tablas complejas, formularios con validación, diálogos de confirmación, y notificaciones. ¿Construyes todo desde cero?

**Problema real:** Construir componentes UI enterprise desde cero puede tomar meses. Necesitas:
- Accesibilidad (WCAG 2.1)
- Responsive design
- Internacionalización
- Temas y personalización
- Testing cross-browser

**Solución:** PrimeNG - una biblioteca de componentes UI enterprise-grade con más de 90 componentes.

---

### 1.2 Contexto: ¿Qué es PrimeNG?

PrimeNG es una biblioteca de componentes UI para Angular, mantenida por PrimeTek. En UyuniAdmin usamos la versión 21.

**Características principales:**
- **90+ componentes**: Desde botones hasta gráficos
- **Standalone ready**: Compatible con Angular standalone components
- **Tema Aura**: Sistema de diseño moderno y personalizable
- **Accesibilidad**: WCAG 2.1 AA compliance
- **TypeScript**: Tipado completo

**Comparación con otras bibliotecas:**

| Biblioteca | Componentes | Tema | Accesibilidad | Angular 21 |
|------------|-------------|------|---------------|------------|
| PrimeNG | 90+ | Aura | ✅ | ✅ |
| Angular Material | 40+ | Material | ✅ | ✅ |
| NG-ZORRO | 60+ | Ant Design | ✅ | ✅ |
| Clarity | 50+ | Clarity | ✅ | ❌ (deprecated) |

---

### 1.3 Explicación: Configuración de PrimeNG

#### Instalación

```bash
npm install primeng @primeuix/themes primeicons
```

**Dependencias:**
- `primeng`: Componentes UI
- `@primeuix/themes`: Sistema de temas (Aura)
- `primeicons`: Iconos

#### Configuración en app.config.ts

```typescript
// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { providePrimeNG } from 'primeng/config';
import { Aura } from '@primeuix/themes/aura';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    providePrimeNG({
      ripple: true, // Efecto ripple en botones
      theme: {
        preset: Aura, // Tema Aura
        options: {
          darkModeSelector: '.dark', // Selector para dark mode
          cssLayer: {
            name: 'primeng',
            order: 'base, primeng, components, utilities' // Orden de CSS layers
          }
        }
      }
    })
  ]
};
```

**Puntos clave:**
- `ripple: true`: Activa el efecto de onda en botones
- `preset: Aura`: Usa el tema Aura moderno
- `darkModeSelector`: Clase CSS para activar dark mode
- `cssLayer`: Controla el orden de especificidad CSS

#### Importar Estilos

```css
/* src/styles.css */
@import "primeng/resources/primeng.css";
@import "primeicons/primeicons.css";
@import "@primeuix/themes/aura";

/* O con Tailwind CSS v4 */
@import "tailwindcss";
@import "primeng/resources/primeng.css";
@import "primeicons/primeicons.css";
@plugin "tailwindcss-primeui";
```

---

### 1.4 Demo: Primer Componente

#### Button Component

```typescript
// src/app/features/demo/button-demo.component.ts
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-button-demo',
  standalone: true,
  imports: [ButtonModule],
  template: `
    <div class="flex gap-4 p-4">
      <!-- Botón básico -->
      <p-button label="Primary" />
      
      <!-- Botón con icono -->
      <p-button label="Guardar" icon="pi pi-save" />
      
      <!-- Botón outlined -->
      <p-button label="Cancelar" severity="secondary" outlined />
      
      <!-- Botón de danger -->
      <p-button label="Eliminar" icon="pi pi-trash" severity="danger" />
      
      <!-- Botón loading -->
      <p-button label="Cargando..." icon="pi pi-spinner pi-spin" [loading]="true" />
      
      <!-- Botón solo icono -->
      <p-button icon="pi pi-plus" severity="success" rounded />
    </div>
  `
})
export class ButtonDemoComponent {}
```

**Propiedades del Button:**

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `label` | string | Texto del botón |
| `icon` | string | Clase del icono (PrimeIcons) |
| `severity` | string | primary, secondary, success, info, warn, danger, contrast |
| `outlined` | boolean | Estilo outlined |
| `raised` | boolean | Efecto de elevación |
| `rounded` | boolean | Bordes redondeados |
| `text` | boolean | Estilo texto (sin fondo) |
| `loading` | boolean | Estado de carga |

---

### 1.5 Error Común: No Importar el Módulo

```typescript
// ❌ ERROR: Componente no funciona
@Component({
  selector: 'app-demo',
  standalone: true,
  template: `<p-button label="Click" />` // No renderiza
})
export class DemoComponent {}

// ✅ CORRECTO: Importar el módulo
@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [ButtonModule], // Importar ButtonModule
  template: `<p-button label="Click" />`
})
export class DemoComponent {}
```

**Regla:** Cada componente PrimeNG requiere importar su módulo correspondiente.

---

### 1.6 Mini Reto: Botones de Acción

**Objetivo:** Crear un grupo de botones para acciones de un formulario.

**Requisitos:**
1. Botón "Guardar" con icono, severity success
2. Botón "Cancelar" outlined, severity secondary
3. Botón "Eliminar" text, severity danger, con icono
4. Botón "Ayuda" solo icono, rounded

**Solución:**

```typescript
@Component({
  selector: 'app-form-actions',
  standalone: true,
  imports: [ButtonModule],
  template: `
    <div class="flex gap-2 justify-end">
      <p-button 
        label="Guardar" 
        icon="pi pi-save" 
        severity="success" 
        (onClick)="save()" />
      
      <p-button 
        label="Cancelar" 
        severity="secondary" 
        outlined 
        (onClick)="cancel()" />
      
      <p-button 
        label="Eliminar" 
        icon="pi pi-trash" 
        severity="danger" 
        text 
        (onClick)="delete()" />
      
      <p-button 
        icon="pi pi-question" 
        rounded 
        text
        (onClick)="showHelp()" />
    </div>
  `
})
export class FormActionsComponent {
  save() { console.log('Guardar'); }
  cancel() { console.log('Cancelar'); }
  delete() { console.log('Eliminar'); }
  showHelp() { console.log('Ayuda'); }
}
```

---

### 1.7 Cierre de Sección

**Resumen:**
- PrimeNG es una biblioteca UI enterprise-grade para Angular
- Se configura en `app.config.ts` con `providePrimeNG`
- El tema Aura proporciona un diseño moderno y personalizable
- Cada componente requiere importar su módulo

**Próximo paso:** Componentes de formulario.

---

## 2. Componentes de Formulario (60 min)

### 2.1 Hook: El Desafío de los Formularios

**Situación:** Necesitas un formulario con:
- Campos de texto con validación
- Selectores con búsqueda
- Calendario con rangos
- Upload de archivos

**Problema:** Cada tipo de input tiene sus propias complejidades. ¿Cómo manejarlos de forma consistente?

---

### 2.2 Contexto: Componentes de Formulario PrimeNG

PrimeNG ofrece componentes de formulario que extienden los inputs nativos con:

- **Validación visual**: Estados de error integrados
- **Estilos consistentes**: Diseño unificado con el tema
- **Accesibilidad**: Labels, aria attributes, keyboard navigation
- **Funcionalidad extra**: Máscaras, autocompletado, rangos

**Componentes principales:**

| Componente | Uso | Módulo |
|------------|-----|--------|
| `InputText` | Texto básico | `InputModule` |
| `InputNumber` | Números con formato | `InputNumberModule` |
| `InputMask` | Máscaras (teléfono, etc.) | `InputMaskModule` |
| `Dropdown` | Select con búsqueda | `DropdownModule` |
| `MultiSelect` | Múltiples opciones | `MultiSelectModule` |
| `Calendar` | Selector de fecha | `CalendarModule` |
| `AutoComplete` | Autocompletado | `AutoCompleteModule` |

---

### 2.3 Explicación: InputText y Validación

#### InputText Básico

```typescript
import { Component, signal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-input-demo',
  standalone: true,
  imports: [InputTextModule],
  template: `
    <div class="flex flex-col gap-2">
      <label for="username">Usuario</label>
      <input 
        pInputText 
        id="username"
        [(ngModel)]="username"
        placeholder="Ingresa tu usuario" />
    </div>
  `
})
export class InputDemoComponent {
  username = signal('');
}
```

#### InputText con Validación

```typescript
import { Component, signal, computed } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-validated-input',
  standalone: true,
  imports: [InputTextModule, FormsModule],
  template: `
    <div class="flex flex-col gap-2">
      <label for="email">Email</label>
      <input 
        pInputText 
        id="email"
        [(ngModel)]="email"
        [class.ng-invalid]="emailError()"
        [class.ng-dirty]="touched()" />
      
      @if (emailError()) {
        <small class="text-red-500">{{ emailError() }}</small>
      }
    </div>
  `
})
export class ValidatedInputComponent {
  email = signal('');
  touched = signal(false);
  
  emailError = computed(() => {
    const value = this.email();
    if (!value) return 'Email es requerido';
    if (!value.includes('@')) return 'Email inválido';
    return null;
  });
}
```

---

### 2.4 Demo: Dropdown y MultiSelect

#### Dropdown con Búsqueda

```typescript
import { Component, signal } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';

interface Country {
  name: string;
  code: string;
}

@Component({
  selector: 'app-dropdown-demo',
  standalone: true,
  imports: [DropdownModule],
  template: `
    <div class="flex flex-col gap-2">
      <label for="country">País</label>
      <p-dropdown 
        [options]="countries()"
        [(ngModel)]="selectedCountry"
        optionLabel="name"
        optionValue="code"
        placeholder="Selecciona un país"
        [filter]="true"
        filterPlaceHolder="Buscar país..."
        (onChange)="onCountryChange($event)" />
    </div>
  `
})
export class DropdownDemoComponent {
  selectedCountry = signal<string | null>(null);
  
  countries = signal<Country[]>([
    { name: 'Bolivia', code: 'BO' },
    { name: 'Argentina', code: 'AR' },
    { name: 'Brasil', code: 'BR' },
    { name: 'Chile', code: 'CL' },
    { name: 'Perú', code: 'PE' }
  ]);
  
  onCountryChange(event: any): void {
    console.log('País seleccionado:', event.value);
  }
}
```

#### MultiSelect

```typescript
import { Component, signal } from '@angular/core';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-multiselect-demo',
  standalone: true,
  imports: [MultiSelectModule],
  template: `
    <div class="flex flex-col gap-2">
      <label>Roles</label>
      <p-multiSelect 
        [options]="roles()"
        [(ngModel)]="selectedRoles"
        optionLabel="name"
        optionValue="id"
        placeholder="Selecciona roles"
        [filter]="true"
        [showHeader]="true"
        [selectAll]="true" />
    </div>
  `
})
export class MultiSelectDemoComponent {
  selectedRoles = signal<string[]>([]);
  
  roles = signal([
    { id: 'admin', name: 'Administrador' },
    { id: 'user', name: 'Usuario' },
    { id: 'guest', name: 'Invitado' },
    { id: 'editor', name: 'Editor' }
  ]);
}
```

---

### 2.5 Error Común: Opciones del Dropdown

```typescript
// ❌ ERROR: Dropdown vacío
<p-dropdown [options]="countries" /> // countries es string[]

// ✅ CORRECTO: Array de objetos con optionLabel
<p-dropdown 
  [options]="countries" 
  optionLabel="name" 
  optionValue="code" />

// ✅ TAMBIÉN: Array de strings simples
<p-dropdown 
  [options]="['Bolivia', 'Argentina', 'Brasil']" />
```

---

### 2.6 Mini Reto: Formulario de Usuario

**Objetivo:** Crear un formulario completo con:
1. InputText para nombre (validación requerido)
2. InputNumber para edad (min 18, max 100)
3. Dropdown para país
4. MultiSelect para intereses

**Solución:**

```typescript
import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';

interface UserForm {
  name: string;
  age: number | null;
  country: string | null;
  interests: string[];
}

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    FormsModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    MultiSelectModule,
    ButtonModule
  ],
  template: `
    <div class="flex flex-col gap-4 p-4 max-w-md">
      <!-- Nombre -->
      <div class="flex flex-col gap-2">
        <label for="name">Nombre *</label>
        <input 
          pInputText 
          id="name"
          [(ngModel)]="form().name"
          (blur)="touched.set(true)"
          [class.border-red-500]="touched() && !form().name" />
        @if (touched() && !form().name) {
          <small class="text-red-500">Nombre es requerido</small>
        }
      </div>
      
      <!-- Edad -->
      <div class="flex flex-col gap-2">
        <label for="age">Edad</label>
        <p-inputNumber 
          [(ngModel)]="form().age"
          [min]="18"
          [max]="100"
          inputId="age" />
      </div>
      
      <!-- País -->
      <div class="flex flex-col gap-2">
        <label for="country">País</label>
        <p-dropdown 
          [options]="countries"
          [(ngModel)]="form().country"
          optionLabel="name"
          optionValue="code"
          placeholder="Selecciona un país"
          inputId="country" />
      </div>
      
      <!-- Intereses -->
      <div class="flex flex-col gap-2">
        <label>Intereses</label>
        <p-multiSelect 
          [options]="interestOptions"
          [(ngModel)]="form().interests"
          optionLabel="name"
          optionValue="id"
          placeholder="Selecciona intereses" />
      </div>
      
      <!-- Botones -->
      <div class="flex gap-2">
        <p-button 
          label="Guardar" 
          icon="pi pi-save"
          severity="success"
          (onClick)="submit()" />
        <p-button 
          label="Limpiar" 
          severity="secondary"
          outlined
          (onClick)="reset()" />
      </div>
    </div>
  `
})
export class UserFormComponent {
  touched = signal(false);
  
  form = signal<UserForm>({
    name: '',
    age: null,
    country: null,
    interests: []
  });
  
  countries = [
    { name: 'Bolivia', code: 'BO' },
    { name: 'Argentina', code: 'AR' },
    { name: 'Brasil', code: 'BR' }
  ];
  
  interestOptions = [
    { id: 'tech', name: 'Tecnología' },
    { id: 'sports', name: 'Deportes' },
    { id: 'music', name: 'Música' },
    { id: 'travel', name: 'Viajes' }
  ];
  
  submit(): void {
    this.touched.set(true);
    if (this.form().name) {
      console.log('Formulario:', this.form());
    }
  }
  
  reset(): void {
    this.form.set({
      name: '',
      age: null,
      country: null,
      interests: []
    });
    this.touched.set(false);
  }
}
```

---

### 2.7 Cierre de Sección

**Resumen:**
- PrimeNG ofrece componentes de formulario con validación integrada
- `InputText` extiende inputs nativos con estilos
- `Dropdown` y `MultiSelect` manejan selecciones con búsqueda
- `InputNumber` proporciona validación numérica

**Próximo paso:** Componentes de datos (Table).

---

## 3. Componentes de Datos (60 min)

### 3.1 Hook: El Reto de las Tablas

**Situación:** Necesitas mostrar una lista de 1000+ usuarios con:
- Paginación
- Ordenamiento por columnas
- Filtros globales y por columna
- Selección múltiple
- Exportación a CSV

**Problema:** Implementar todo esto desde cero es complejo y propenso a errores.

---

### 3.2 Contexto: Table Component

El componente `Table` (p-table) de PrimeNG es uno de los más poderosos:

- **Paginación**: Navegación por páginas
- **Ordenamiento**: Por una o múltiples columnas
- **Filtrado**: Global y por columna
- **Selección**: Simple, múltiple, con checkbox
- **Virtual Scrolling**: Para grandes datasets
- **Exportación**: CSV, PDF, Excel
- **Responsive**: Columnas adaptables
- **Edición**: Inline y con diálogo

---

### 3.3 Explicación: Table Básico

```typescript
import { Component, signal } from '@angular/core';
import { TableModule } from 'primeng/table';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

@Component({
  selector: 'app-table-demo',
  standalone: true,
  imports: [TableModule],
  template: `
    <p-table 
      [value]="users()"
      [paginator]="true"
      [rows]="10"
      [rowsPerPageOptions]="[10, 20, 50]"
      [tableStyle]="{ 'min-width': '50rem' }">
      
      <!-- Header -->
      <ng-template pTemplate="header">
        <tr>
          <th pSortableColumn="name">Nombre <p-sortIcon field="name" /></th>
          <th pSortableColumn="email">Email <p-sortIcon field="email" /></th>
          <th pSortableColumn="role">Rol <p-sortIcon field="role" /></th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </ng-template>
      
      <!-- Body -->
      <ng-template pTemplate="body" let-user>
        <tr>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>
            <span 
              [class]="user.status === 'active' ? 'text-green-500' : 'text-red-500'">
              {{ user.status === 'active' ? 'Activo' : 'Inactivo' }}
            </span>
          </td>
          <td>
            <button pButton icon="pi pi-pencil" class="p-button-text" />
            <button pButton icon="pi pi-trash" class="p-button-text p-button-danger" />
          </td>
        </tr>
      </ng-template>
      
    </p-table>
  `
})
export class TableDemoComponent {
  users = signal<User[]>([
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', role: 'Admin', status: 'active' },
    { id: 2, name: 'María García', email: 'maria@example.com', role: 'User', status: 'active' },
    { id: 3, name: 'Carlos López', email: 'carlos@example.com', role: 'Editor', status: 'inactive' },
    // ... más usuarios
  ]);
}
```

---

### 3.4 Demo: Table con Filtros y Selección

```typescript
import { Component, signal, computed } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-advanced-table',
  standalone: true,
  imports: [TableModule, ButtonModule, InputTextModule, DropdownModule, ToastModule],
  providers: [MessageService],
  template: `
    <p-toast />
    
    <div class="card">
      <!-- Toolbar -->
      <div class="flex justify-between mb-4">
        <!-- Filtro global -->
        <div class="flex gap-2">
          <input 
            pInputText 
            type="text" 
            (input)="filterGlobal($event)"
            placeholder="Buscar..." />
          
          <p-dropdown 
            [options]="statusOptions"
            [(ngModel)]="selectedStatus"
            placeholder="Filtrar por estado"
            (onChange)="filterByStatus($event)"
            optionLabel="label"
            optionValue="value"
            [showClear]="true" />
        </div>
        
        <!-- Acciones -->
        <div class="flex gap-2">
          <p-button 
            label="Eliminar seleccionados"
            icon="pi pi-trash"
            severity="danger"
            outlined
            [disabled]="selectedUsers().length === 0"
            (onClick)="deleteSelected()" />
          
          <p-button 
            label="Nuevo"
            icon="pi pi-plus"
            (onClick)="addNew()" />
        </div>
      </div>
      
      <!-- Tabla -->
      <p-table 
        #dt
        [value]="users()"
        [paginator]="true"
        [rows]="10"
        [rowsPerPageOptions]="[10, 20, 50]"
        [globalFilterFields]="['name', 'email', 'role']"
        [(selection)]="selectedUsers"
        dataKey="id"
        [rowHover]="true"
        [tableStyle]="{ 'min-width': '60rem' }">
        
        <!-- Header -->
        <ng-template pTemplate="header">
          <tr>
            <th style="width: 3rem">
              <p-tableHeaderCheckbox />
            </th>
            <th pSortableColumn="name">Nombre <p-sortIcon field="name" /></th>
            <th pSortableColumn="email">Email <p-sortIcon field="email" /></th>
            <th pSortableColumn="role">Rol <p-sortIcon field="role" /></th>
            <th pSortableColumn="status">Estado <p-sortIcon field="status" /></th>
            <th>Acciones</th>
          </tr>
        </ng-template>
        
        <!-- Body -->
        <ng-template pTemplate="body" let-user>
          <tr>
            <td>
              <p-tableCheckbox [value]="user" />
            </td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>
              <span 
                [class]="user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                class="px-2 py-1 rounded text-sm">
                {{ user.status === 'active' ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td>
              <p-button icon="pi pi-pencil" rounded text (onClick)="editUser(user)" />
              <p-button icon="pi pi-trash" rounded text severity="danger" (onClick)="deleteUser(user)" />
            </td>
          </tr>
        </ng-template>
        
        <!-- Empty state -->
        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="6" class="text-center py-4">
              No se encontraron usuarios
            </td>
          </tr>
        </ng-template>
        
      </p-table>
    </div>
  `
})
export class AdvancedTableComponent {
  private messageService = inject(MessageService);
  
  users = signal<User[]>([...]);
  selectedUsers = signal<User[]>([]);
  selectedStatus = signal<string | null>(null);
  
  statusOptions = [
    { label: 'Activo', value: 'active' },
    { label: 'Inactivo', value: 'inactive' }
  ];
  
  @ViewChild('dt') table!: Table;
  
  filterGlobal(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.table.filterGlobal(value, 'contains');
  }
  
  filterByStatus(event: any): void {
    this.table.filter(event.value, 'status', 'equals');
  }
  
  deleteSelected(): void {
    const count = this.selectedUsers().length;
    this.users.update(users => 
      users.filter(u => !this.selectedUsers().includes(u))
    );
    this.selectedUsers.set([]);
    this.messageService.add({
      severity: 'success',
      summary: 'Eliminados',
      detail: `${count} usuarios eliminados`
    });
  }
  
  addNew(): void {
    // Abrir diálogo de creación
  }
  
  editUser(user: User): void {
    // Abrir diálogo de edición
  }
  
  deleteUser(user: User): void {
    this.users.update(users => users.filter(u => u.id !== user.id));
    this.messageService.add({
      severity: 'success',
      summary: 'Eliminado',
      detail: `Usuario ${user.name} eliminado`
    });
  }
}
```

---

### 3.5 Error Común: Performance con Grandes Datasets

```typescript
// ❌ ERROR: Renderizar 10,000 filas sin virtual scroll
<p-table [value]="largeDataset()" [paginator]="true" [rows]="10">
  // Renderiza TODAS las filas en el DOM
</p-table>

// ✅ CORRECTO: Usar virtual scroll
<p-table 
  [value]="largeDataset()"
  [virtualScroll]="true"
  [virtualScrollItemSize]="40"
  scrollHeight="400px">
  // Solo renderiza las filas visibles
</p-table>
```

---

### 3.6 Mini Reto: Tabla de Productos

**Objetivo:** Crear una tabla de productos con:
1. Columnas: nombre, precio, categoría, stock
2. Paginación (5, 10, 20 por página)
3. Ordenamiento por nombre y precio
4. Filtro global
5. Badge para stock bajo (< 10)

**Solución:**

```typescript
@Component({
  selector: 'app-products-table',
  standalone: true,
  imports: [TableModule, InputTextModule],
  template: `
    <p-table 
      #dt
      [value]="products()"
      [paginator]="true"
      [rows]="10"
      [rowsPerPageOptions]="[5, 10, 20]"
      [globalFilterFields]="['name', 'category']"
      [tableStyle]="{ 'min-width': '40rem' }">
      
      <!-- Toolbar -->
      <ng-template pTemplate="caption">
        <div class="flex justify-between">
          <input 
            pInputText 
            type="text"
            (input)="filterGlobal($event)"
            placeholder="Buscar producto..." />
        </div>
      </ng-template>
      
      <!-- Header -->
      <ng-template pTemplate="header">
        <tr>
          <th pSortableColumn="name">Producto <p-sortIcon field="name" /></th>
          <th pSortableColumn="price">Precio <p-sortIcon field="price" /></th>
          <th pSortableColumn="category">Categoría <p-sortIcon field="category" /></th>
          <th pSortableColumn="stock">Stock <p-sortIcon field="stock" /></th>
        </tr>
      </ng-template>
      
      <!-- Body -->
      <ng-template pTemplate="body" let-product>
        <tr>
          <td>{{ product.name }}</td>
          <td>{{ product.price | currency }}</td>
          <td>{{ product.category }}</td>
          <td>
            @if (product.stock < 10) {
              <span class="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                {{ product.stock }} (Bajo)
              </span>
            } @else {
              <span>{{ product.stock }}</span>
            }
          </td>
        </tr>
      </ng-template>
      
    </p-table>
  `
})
export class ProductsTableComponent {
  @ViewChild('dt') table!: Table;
  
  products = signal([
    { name: 'Laptop', price: 999.99, category: 'Electrónica', stock: 5 },
    { name: 'Mouse', price: 29.99, category: 'Accesorios', stock: 50 },
    { name: 'Teclado', price: 79.99, category: 'Accesorios', stock: 8 },
    { name: 'Monitor', price: 299.99, category: 'Electrónica', stock: 15 },
    // ... más productos
  ]);
  
  filterGlobal(event: Event): void {
    this.table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
```

---

### 3.7 Cierre de Sección

**Resumen:**
- `p-table` es el componente más poderoso de PrimeNG
- Soporta paginación, ordenamiento, filtros, y selección
- Virtual scroll para grandes datasets
- Templates para personalizar header, body, y empty state

**Próximo paso:** Componentes de UI (Dialog, Toast).

---

## 4. Componentes de UI (45 min)

### 4.1 Hook: Feedback al Usuario

**Situación:** El usuario hace clic en "Eliminar" y... ¿qué pasa?

- ¿Cómo confirmas la acción?
- ¿Cómo muestras éxito o error?
- ¿Cómo muestras un formulario en un modal?

---

### 4.2 Contexto: Componentes de Feedback

PrimeNG ofrece componentes para feedback:

| Componente | Uso |
|------------|-----|
| `Dialog` | Modales y formularios |
| `ConfirmDialog` | Confirmaciones |
| `Toast` | Notificaciones |
| `Messages` | Mensajes inline |
| `Tooltip` | Ayuda contextual |
| `Badge` | Indicadores |

---

### 4.3 Explicación: Toast y ConfirmDialog

#### Toast (Notificaciones)

```typescript
import { Component, inject } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-toast-demo',
  standalone: true,
  imports: [ToastModule],
  providers: [MessageService],
  template: `
    <p-toast position="top-right" />
    
    <button (click)="showSuccess()">Éxito</button>
    <button (click)="showError()">Error</button>
    <button (click)="showWarning()">Advertencia</button>
  `
})
export class ToastDemoComponent {
  private messageService = inject(MessageService);
  
  showSuccess(): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Operación completada'
    });
  }
  
  showError(): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Ocurrió un error'
    });
  }
  
  showWarning(): void {
    this.messageService.add({
      severity: 'warn',
      summary: 'Advertencia',
      detail: 'Esta acción puede ser peligrosa'
    });
  }
}
```

#### ConfirmDialog

```typescript
import { Component, inject } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-confirm-demo',
  standalone: true,
  imports: [ConfirmDialogModule],
  providers: [ConfirmationService],
  template: `
    <p-confirmDialog 
      header="Confirmación"
      icon="pi pi-exclamation-triangle"
      acceptLabel="Sí"
      rejectLabel="No" />
    
    <button (click)="confirmDelete()">Eliminar</button>
  `
})
export class ConfirmDemoComponent {
  private confirmationService = inject(ConfirmationService);
  
  confirmDelete(): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro de eliminar este registro?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log('Eliminado');
      },
      reject: () => {
        console.log('Cancelado');
      }
    });
  }
}
```

---

### 4.4 Demo: CRUD con Dialog

```typescript
import { Component, signal, inject } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';

interface User {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-crud-demo',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <p-toast />
    <p-confirmDialog />
    
    <div class="p-4">
      <p-button 
        label="Nuevo Usuario" 
        icon="pi pi-plus"
        (onClick)="openDialog()" />
      
      <!-- Lista de usuarios -->
      <ul class="mt-4">
        @for (user of users(); track user.id) {
          <li class="flex justify-between items-center p-2 border-b">
            <span>{{ user.name }} ({{ user.email }})</span>
            <div class="flex gap-2">
              <p-button 
                icon="pi pi-pencil" 
                rounded 
                text
                (onClick)="editUser(user)" />
              <p-button 
                icon="pi pi-trash" 
                rounded 
                text
                severity="danger"
                (onClick)="confirmDelete(user)" />
            </div>
          </li>
        }
      </ul>
      
      <!-- Dialog -->
      <p-dialog 
        [(visible)]="dialogVisible"
        [header]="editingUser() ? 'Editar Usuario' : 'Nuevo Usuario'"
        [modal]="true"
        [style]="{ width: '400px' }">
        
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <label for="name">Nombre</label>
            <input 
              pInputText 
              id="name"
              [(ngModel)]="formData().name" />
          </div>
          
          <div class="flex flex-col gap-2">
            <label for="email">Email</label>
            <input 
              pInputText 
              id="email"
              [(ngModel)]="formData().email" />
          </div>
        </div>
        
        <ng-template pTemplate="footer">
          <p-button 
            label="Cancelar" 
            severity="secondary"
            outlined
            (onClick)="closeDialog()" />
          <p-button 
            label="Guardar"
            (onClick)="saveUser()" />
        </ng-template>
      </p-dialog>
    </div>
  `
})
export class CrudDemoComponent {
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  
  users = signal<User[]>([
    { id: 1, name: 'Juan', email: 'juan@example.com' },
    { id: 2, name: 'María', email: 'maria@example.com' }
  ]);
  
  dialogVisible = signal(false);
  editingUser = signal<User | null>(null);
  formData = signal({ name: '', email: '' });
  
  openDialog(): void {
    this.editingUser.set(null);
    this.formData.set({ name: '', email: '' });
    this.dialogVisible.set(true);
  }
  
  editUser(user: User): void {
    this.editingUser.set(user);
    this.formData.set({ name: user.name, email: user.email });
    this.dialogVisible.set(true);
  }
  
  closeDialog(): void {
    this.dialogVisible.set(false);
  }
  
  saveUser(): void {
    const editing = this.editingUser();
    const data = this.formData();
    
    if (editing) {
      // Actualizar
      this.users.update(users => 
        users.map(u => 
          u.id === editing.id 
            ? { ...u, name: data.name, email: data.email }
            : u
        )
      );
      this.messageService.add({
        severity: 'success',
        summary: 'Actualizado',
        detail: 'Usuario actualizado'
      });
    } else {
      // Crear
      const newUser: User = {
        id: Date.now(),
        name: data.name,
        email: data.email
      };
      this.users.update(users => [...users, newUser]);
      this.messageService.add({
        severity: 'success',
        summary: 'Creado',
        detail: 'Usuario creado'
      });
    }
    
    this.closeDialog();
  }
  
  confirmDelete(user: User): void {
    this.confirmationService.confirm({
      message: `¿Eliminar a ${user.name}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.users.update(users => users.filter(u => u.id !== user.id));
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Usuario eliminado'
        });
      }
    });
  }
}
```

---

### 4.5 Error Común: Providers de MessageService

```typescript
// ❌ ERROR: MessageService no funciona
@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [ToastModule],
  template: `<p-toast />`
})
export class DemoComponent {
  // Error: No provider for MessageService
}

// ✅ CORRECTO: Agregar provider
@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [ToastModule],
  providers: [MessageService], // Agregar provider
  template: `<p-toast />`
})
export class DemoComponent {
  private messageService = inject(MessageService);
}
```

---

### 4.6 Mini Reto: Notificaciones CRUD

**Objetivo:** Implementar notificaciones para:
1. Éxito al crear
2. Éxito al actualizar
3. Confirmación antes de eliminar
4. Éxito al eliminar

**Solución:** Ver demo anterior.

---

### 4.7 Cierre de Sección

**Resumen:**
- `Toast` muestra notificaciones temporales
- `ConfirmDialog` solicita confirmación del usuario
- `Dialog` muestra contenido en un modal
- Requiere providers: `MessageService`, `ConfirmationService`

**Próximo paso:** Personalización de tema.

---

## 5. Personalización de Tema (30 min)

### 5.1 Hook: Tu Marca en la UI

**Situación:** Tu empresa tiene colores corporativos. ¿Cómo aplicas tu marca a PrimeNG?

---

### 5.2 Contexto: Sistema de Temas Aura

Aura es el sistema de temas de PrimeNG basado en Design Tokens. Cada componente tiene variables CSS personalizables.

**Estructura de tokens:**
- `primary`: Color principal
- `surface`: Fondos
- `border`: Bordes
- `text`: Textos
- `highlight`: Elementos destacados

---

### 5.3 Explicación: Personalizar Colores

```css
/* src/styles.css */

/* Sobrescribir variables del tema Aura */
:root {
  /* Color primario personalizado */
  --p-primary-color: #38240c;
  --p-primary-hover-color: #4a2d10;
  --p-primary-active-color: #5a3815;
  
  /* Colores semánticos */
  --p-success-color: #22c55e;
  --p-info-color: #3b82f6;
  --p-warning-color: #f59e0b;
  --p-danger-color: #ef4444;
}

/* Dark mode */
.dark {
  --p-primary-color: #c4a77d;
  --p-surface-0: #1a1a1a;
  --p-surface-50: #252525;
  --p-surface-100: #2a2a2a;
}
```

---

### 5.4 Demo: Tema Personalizado

```typescript
// app.config.ts
import { providePrimeNG } from 'primeng/config';
import { Aura } from '@primeuix/themes/aura';

// Tema personalizado
const UyuniTheme = {
  ...Aura,
  semantic: {
    ...Aura.semantic,
    primary: {
      50: '#f5f0e8',
      100: '#e6d9c4',
      200: '#d4bf9c',
      300: '#c2a574',
      400: '#b49256',
      500: '#38240c', // Color principal
      600: '#2e1d0a',
      700: '#231608',
      800: '#191005',
      900: '#0e0903'
    }
  }
};

export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    providePrimeNG({
      theme: {
        preset: UyuniTheme,
        options: {
          darkModeSelector: '.dark'
        }
      }
    })
  ]
};
```

---

### 5.5 Cierre de Sección

**Resumen:**
- Aura usa Design Tokens para personalización
- Sobrescribir variables CSS para colores personalizados
- Dark mode con selector `.dark`

---

## Cierre del Día

### Resumen General

| Sección | Conceptos Clave |
|---------|-----------------|
| Introducción | PrimeNG v21, Aura, configuración |
| Formularios | InputText, Dropdown, MultiSelect, validación |
| Datos | Table, paginación, filtros, selección |
| UI | Dialog, Toast, ConfirmDialog |
| Tema | Design Tokens, personalización, dark mode |

### Próximos Pasos

1. Completar los labs del día
2. Responder el assessment
3. Día 14: Estilos con Tailwind CSS v4

---

*Contenido Detallado - Día 13 - Curso Angular 21 - UyuniAdmin Frontend*
