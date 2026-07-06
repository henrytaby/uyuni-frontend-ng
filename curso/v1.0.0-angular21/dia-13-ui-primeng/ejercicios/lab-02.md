# Día 13: Lab 02 - Tabla de Datos con PrimeNG

## Objetivo

Implementar una tabla de datos completa con paginación, ordenamiento, filtros, selección y operaciones CRUD.

## Tiempo Estimado

60 minutos

---

## Ejercicio 1: Tabla Básica

### Descripción

Crear una tabla de usuarios con las siguientes columnas:
- Checkbox para selección
- Nombre (ordenable)
- Email (ordenable)
- Rol (ordenable)
- Estado (badge)
- Acciones (editar, eliminar)

### Instrucciones

1. Crear el componente `UsersTableComponent`
2. Configurar paginación (10, 20, 50 por página)
3. Implementar ordenamiento por columnas
4. Agregar badges para estado

### Solución

```typescript
// src/app/features/users/components/users-table/users-table.component.ts
import { Component, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    TagModule,
    InputTextModule,
    DropdownModule
  ],
  template: `
    <div class="card">
      <p-table 
        [value]="users()"
        [paginator]="true"
        [rows]="10"
        [rowsPerPageOptions]="[10, 20, 50]"
        [tableStyle]="{ 'min-width': '60rem' }"
        [rowHover]="true"
        [(selection)]="selectedUsers"
        dataKey="id">
        
        <!-- Caption con toolbar -->
        <ng-template pTemplate="caption">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold">Usuarios</h2>
            <p-button 
              label="Nuevo" 
              icon="pi pi-plus"
              severity="success"
              (onClick)="addNew()" />
          </div>
        </ng-template>
        
        <!-- Header -->
        <ng-template pTemplate="header">
          <tr>
            <th style="width: 3rem">
              <p-tableHeaderCheckbox />
            </th>
            <th pSortableColumn="name">
              Nombre <p-sortIcon field="name" />
            </th>
            <th pSortableColumn="email">
              Email <p-sortIcon field="email" />
            </th>
            <th pSortableColumn="role">
              Rol <p-sortIcon field="role" />
            </th>
            <th pSortableColumn="status">
              Estado <p-sortIcon field="status" />
            </th>
            <th pSortableColumn="createdAt">
              Fecha <p-sortIcon field="createdAt" />
            </th>
            <th style="width: 8rem">Acciones</th>
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
              <p-tag 
                [value]="user.status === 'active' ? 'Activo' : 'Inactivo'"
                [severity]="user.status === 'active' ? 'success' : 'danger'" />
            </td>
            <td>{{ user.createdAt | date:'dd/MM/yyyy' }}</td>
            <td>
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
                (onClick)="deleteUser(user)" />
            </td>
          </tr>
        </ng-template>
        
        <!-- Empty state -->
        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="7" class="text-center py-8">
              <i class="pi pi-users text-4xl text-gray-300 mb-4"></i>
              <p class="text-gray-500">No hay usuarios registrados</p>
            </td>
          </tr>
        </ng-template>
        
        <!-- Footer con selección -->
        <ng-template pTemplate="summary">
          <div class="flex justify-between items-center">
            <span>
              {{ selectedUsers().length }} usuarios seleccionados
            </span>
            @if (selectedUsers().length > 0) {
              <p-button 
                label="Eliminar seleccionados"
                icon="pi pi-trash"
                severity="danger"
                outlined
                (onClick)="deleteSelected()" />
            }
          </div>
        </ng-template>
        
      </p-table>
    </div>
  `
})
export class UsersTableComponent {
  users = signal<User[]>([
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', role: 'Admin', status: 'active', createdAt: new Date('2024-01-15') },
    { id: 2, name: 'María García', email: 'maria@example.com', role: 'Editor', status: 'active', createdAt: new Date('2024-02-20') },
    { id: 3, name: 'Carlos López', email: 'carlos@example.com', role: 'User', status: 'inactive', createdAt: new Date('2024-03-10') },
    { id: 4, name: 'Ana Martínez', email: 'ana@example.com', role: 'User', status: 'active', createdAt: new Date('2024-04-05') },
    { id: 5, name: 'Pedro Sánchez', email: 'pedro@example.com', role: 'Editor', status: 'active', createdAt: new Date('2024-05-12') },
    // ... más usuarios
  ]);
  
  selectedUsers = signal<User[]>([]);
  
  addNew(): void {
    console.log('Agregar nuevo usuario');
  }
  
  editUser(user: User): void {
    console.log('Editar:', user);
  }
  
  deleteUser(user: User): void {
    console.log('Eliminar:', user);
  }
  
  deleteSelected(): void {
    console.log('Eliminar seleccionados:', this.selectedUsers());
  }
}
```

---

## Ejercicio 2: Filtros Avanzados

### Descripción

Agregar filtros a la tabla:
- Filtro global (búsqueda en todas las columnas)
- Filtro por estado (dropdown)
- Filtro por rol (dropdown)

### Instrucciones

1. Agregar `@ViewChild` para acceder a la tabla
2. Implementar filtro global con input
3. Implementar filtros por columna con dropdowns

### Solución

```typescript
import { Component, signal, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';

@Component({
  // ... imports
  template: `
    <div class="card">
      <!-- Toolbar con filtros -->
      <div class="flex flex-wrap gap-4 mb-4">
        <!-- Filtro global -->
        <div class="flex-1 min-w-[200px]">
          <input 
            pInputText
            type="text"
            (input)="onGlobalFilter($event)"
            placeholder="Buscar usuario..."
            class="w-full" />
        </div>
        
        <!-- Filtro por estado -->
        <p-dropdown 
          [options]="statusOptions"
          [(ngModel)]="selectedStatus"
          placeholder="Filtrar por estado"
          (onChange)="onStatusFilter($event)"
          [showClear]="true"
          optionLabel="label"
          optionValue="value" />
        
        <!-- Filtro por rol -->
        <p-dropdown 
          [options]="roleOptions"
          [(ngModel)]="selectedRole"
          placeholder="Filtrar por rol"
          (onChange)="onRoleFilter($event)"
          [showClear]="true"
          optionLabel="label"
          optionValue="value" />
        
        <!-- Limpiar filtros -->
        <p-button 
          icon="pi pi-filter-slash"
          label="Limpiar"
          outlined
          (onClick)="clearFilters()" />
      </div>
      
      <p-table 
        #dt
        [value]="users()"
        [globalFilterFields]="['name', 'email', 'role']"
        [paginator]="true"
        [rows]="10">
        <!-- ... resto de la tabla -->
      </p-table>
    </div>
  `
})
export class UsersTableComponent {
  @ViewChild('dt') table!: Table;
  
  selectedStatus = signal<string | null>(null);
  selectedRole = signal<string | null>(null);
  
  statusOptions = [
    { label: 'Activo', value: 'active' },
    { label: 'Inactivo', value: 'inactive' }
  ];
  
  roleOptions = [
    { label: 'Admin', value: 'Admin' },
    { label: 'Editor', value: 'Editor' },
    { label: 'User', value: 'User' }
  ];
  
  onGlobalFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.table.filterGlobal(value, 'contains');
  }
  
  onStatusFilter(event: any): void {
    const value = event.value;
    this.table.filter(value, 'status', 'equals');
  }
  
  onRoleFilter(event: any): void {
    const value = event.value;
    this.table.filter(value, 'role', 'equals');
  }
  
  clearFilters(): void {
    this.table.clear();
    this.selectedStatus.set(null);
    this.selectedRole.set(null);
  }
}
```

---

## Ejercicio 3: CRUD con Dialog

### Descripción

Implementar operaciones CRUD completas:
- Crear usuario (dialog)
- Editar usuario (dialog)
- Eliminar usuario (confirmación)
- Eliminar múltiples (confirmación)

### Instrucciones

1. Agregar Dialog para crear/editar
2. Agregar ConfirmDialog para eliminar
3. Implementar Toast para notificaciones
4. Manejar estado del formulario

### Solución

```typescript
import { Component, signal, inject } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

@Component({
  selector: 'app-users-crud',
  standalone: true,
  imports: [
    TableModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    TagModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <p-toast position="top-right" />
    <p-confirmDialog header="Confirmación" icon="pi pi-exclamation-triangle" />
    
    <div class="card">
      <!-- Toolbar -->
      <div class="flex justify-between mb-4">
        <h2 class="text-xl font-bold">Usuarios</h2>
        <p-button 
          label="Nuevo Usuario" 
          icon="pi pi-plus"
          (onClick)="openDialog()" />
      </div>
      
      <!-- Tabla -->
      <p-table 
        [value]="users()"
        [paginator]="true"
        [rows]="10"
        [(selection)]="selectedUsers"
        dataKey="id">
        
        <ng-template pTemplate="header">
          <tr>
            <th style="width: 3rem"><p-tableHeaderCheckbox /></th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </ng-template>
        
        <ng-template pTemplate="body" let-user>
          <tr>
            <td><p-tableCheckbox [value]="user" /></td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>
              <p-tag 
                [value]="user.status === 'active' ? 'Activo' : 'Inactivo'"
                [severity]="user.status === 'active' ? 'success' : 'danger'" />
            </td>
            <td>
              <p-button icon="pi pi-pencil" rounded text (onClick)="editUser(user)" />
              <p-button icon="pi pi-trash" rounded text severity="danger" (onClick)="confirmDelete(user)" />
            </td>
          </tr>
        </ng-template>
        
        <ng-template pTemplate="summary">
          @if (selectedUsers().length > 0) {
            <div class="flex justify-end">
              <p-button 
                label="Eliminar seleccionados ({{ selectedUsers().length }})"
                icon="pi pi-trash"
                severity="danger"
                outlined
                (onClick)="confirmDeleteSelected()" />
            </div>
          }
        </ng-template>
      </p-table>
    </div>
    
    <!-- Dialog de creación/edición -->
    <p-dialog 
      [(visible)]="dialogVisible"
      [header]="editingUser() ? 'Editar Usuario' : 'Nuevo Usuario'"
      [modal]="true"
      [style]="{ width: '450px' }">
      
      <div class="flex flex-col gap-4">
        <!-- Nombre -->
        <div class="flex flex-col gap-2">
          <label for="name">Nombre *</label>
          <input 
            pInputText 
            id="name"
            [(ngModel)]="formData().name" />
        </div>
        
        <!-- Email -->
        <div class="flex flex-col gap-2">
          <label for="email">Email *</label>
          <input 
            pInputText 
            id="email"
            type="email"
            [(ngModel)]="formData().email" />
        </div>
        
        <!-- Rol -->
        <div class="flex flex-col gap-2">
          <label for="role">Rol</label>
          <p-dropdown 
            [options]="roleOptions"
            [(ngModel)]="formData().role"
            optionLabel="label"
            optionValue="value"
            placeholder="Selecciona rol" />
        </div>
        
        <!-- Estado -->
        <div class="flex flex-col gap-2">
          <label for="status">Estado</label>
          <p-dropdown 
            [options]="statusOptions"
            [(ngModel)]="formData().status"
            optionLabel="label"
            optionValue="value"
            placeholder="Selecciona estado" />
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
  `
})
export class UsersCrudComponent {
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  
  // Datos
  users = signal<User[]>([
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', role: 'Admin', status: 'active' },
    { id: 2, name: 'María García', email: 'maria@example.com', role: 'Editor', status: 'active' },
    { id: 3, name: 'Carlos López', email: 'carlos@example.com', role: 'User', status: 'inactive' }
  ]);
  
  selectedUsers = signal<User[]>([]);
  
  // Dialog
  dialogVisible = signal(false);
  editingUser = signal<User | null>(null);
  formData = signal({
    name: '',
    email: '',
    role: 'User',
    status: 'active'
  });
  
  // Opciones
  roleOptions = [
    { label: 'Admin', value: 'Admin' },
    { label: 'Editor', value: 'Editor' },
    { label: 'User', value: 'User' }
  ];
  
  statusOptions = [
    { label: 'Activo', value: 'active' },
    { label: 'Inactivo', value: 'inactive' }
  ];
  
  // Abrir dialog para nuevo
  openDialog(): void {
    this.editingUser.set(null);
    this.formData.set({
      name: '',
      email: '',
      role: 'User',
      status: 'active'
    });
    this.dialogVisible.set(true);
  }
  
  // Abrir dialog para editar
  editUser(user: User): void {
    this.editingUser.set(user);
    this.formData.set({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
    this.dialogVisible.set(true);
  }
  
  // Cerrar dialog
  closeDialog(): void {
    this.dialogVisible.set(false);
  }
  
  // Guardar usuario
  saveUser(): void {
    const editing = this.editingUser();
    const data = this.formData();
    
    if (!data.name || !data.email) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Nombre y email son requeridos'
      });
      return;
    }
    
    if (editing) {
      // Actualizar
      this.users.update(users => 
        users.map(u => 
          u.id === editing.id 
            ? { ...u, ...data }
            : u
        )
      );
      this.messageService.add({
        severity: 'success',
        summary: 'Actualizado',
        detail: 'Usuario actualizado correctamente'
      });
    } else {
      // Crear
      const newUser: User = {
        id: Date.now(),
        ...data
      };
      this.users.update(users => [...users, newUser]);
      this.messageService.add({
        severity: 'success',
        summary: 'Creado',
        detail: 'Usuario creado correctamente'
      });
    }
    
    this.closeDialog();
  }
  
  // Confirmar eliminación individual
  confirmDelete(user: User): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar a ${user.name}?`,
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
  
  // Confirmar eliminación múltiple
  confirmDeleteSelected(): void {
    this.confirmationService.confirm({
      message: `¿Eliminar ${this.selectedUsers().length} usuarios seleccionados?`,
      accept: () => {
        const ids = this.selectedUsers().map(u => u.id);
        this.users.update(users => users.filter(u => !ids.includes(u.id)));
        this.selectedUsers.set([]);
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminados',
          detail: 'Usuarios eliminados correctamente'
        });
      }
    });
  }
}
```

---

## Ejercicio 4: Exportación de Datos

### Descripción

Agregar funcionalidad de exportación:
- Exportar a CSV
- Exportar a Excel
- Exportar solo seleccionados

### Instrucciones

1. Instalar `xlsx` y `file-saver`
2. Crear servicio de exportación
3. Agregar botones de exportación

### Solución

```typescript
// export.service.ts
import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Injectable({ providedIn: 'root' })
export class ExportService {
  exportToCSV(data: any[], filename: string): void {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(workbook, { bookType: 'csv', type: 'array' });
    this.saveFile(excelBuffer, `${filename}.csv`, 'text/csv');
  }
  
  exportToExcel(data: any[], filename: string): void {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveFile(excelBuffer, `${filename}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  }
  
  private saveFile(buffer: any, filename: string, mimeType: string): void {
    const blob = new Blob([buffer], { type: mimeType });
    saveAs(blob, filename);
  }
}

// En el componente
import { ExportService } from '@core/services/export.service';

@Component({...})
export class UsersTableComponent {
  private exportService = inject(ExportService);
  
  exportCSV(): void {
    const data = this.selectedUsers().length > 0 
      ? this.selectedUsers() 
      : this.users();
    
    this.exportService.exportToCSV(data, 'usuarios');
  }
  
  exportExcel(): void {
    const data = this.selectedUsers().length > 0 
      ? this.selectedUsers() 
      : this.users();
    
    this.exportService.exportToExcel(data, 'usuarios');
  }
}

// Template
<div class="flex gap-2">
  <p-button 
    label="CSV" 
    icon="pi pi-download"
    severity="help"
    outlined
    (onClick)="exportCSV()" />
  <p-button 
    label="Excel" 
    icon="pi pi-file-excel"
    severity="success"
    outlined
    (onClick)="exportExcel()" />
</div>
```

---

## Ejercicio 5: Virtual Scroll

### Descripción

Implementar virtual scroll para manejar grandes datasets (1000+ registros).

### Instrucciones

1. Generar datos de prueba (1000 usuarios)
2. Configurar virtual scroll en la tabla
3. Medir performance

### Solución

```typescript
@Component({
  template: `
    <p-table 
      [value]="largeDataset()"
      [virtualScroll]="true"
      [virtualScrollItemSize]="48"
      scrollHeight="500px"
      [tableStyle]="{ 'min-width': '60rem' }">
      
      <ng-template pTemplate="header">
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Email</th>
        </tr>
      </ng-template>
      
      <ng-template pTemplate="body" let-user>
        <tr style="height: 48px">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
        </tr>
      </ng-template>
    </p-table>
  `
})
export class VirtualScrollComponent {
  // Generar 1000 usuarios
  largeDataset = signal(
    Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      name: `Usuario ${i + 1}`,
      email: `user${i + 1}@example.com`
    }))
  );
}
```

---

## Criterios de Evaluación

| Criterio | Puntos |
|----------|--------|
| Tabla con paginación y ordenamiento | 20 pts |
| Filtros global y por columna | 20 pts |
| CRUD con Dialog y ConfirmDialog | 25 pts |
| Toast para notificaciones | 15 pts |
| Selección múltiple | 10 pts |
| Exportación de datos | 10 pts |
| **Total** | **100 pts** |

---

*Lab 02 - Día 13 - Curso Angular 21 - UyuniAdmin Frontend*
