# Día 13: Slides - UI con PrimeNG

## Slide 1: Portada

# UI con PrimeNG
## Día 13 - Curso Angular 21

**Módulo:** 5 - UI y Estilos
**Duración:** 4 horas

---

## Slide 2: Agenda

# Temario del Día

1. **Introducción a PrimeNG** (45 min)
2. **Componentes de Formulario** (60 min)
3. **Componentes de Datos** (60 min)
4. **Componentes de UI** (45 min)
5. **Personalización de Tema** (30 min)

---

## Slide 3: Hook - El Problema

# ¿Construir o Usar?

**Necesitas:**
- Tablas con paginación y filtros
- Formularios con validación
- Diálogos modales
- Notificaciones

**¿Construir desde cero?**
- Meses de desarrollo
- Testing cross-browser
- Accesibilidad WCAG
- Responsive design

---

## Slide 4: Solución - PrimeNG

# PrimeNG v21

**Biblioteca UI enterprise-grade para Angular**

- ✅ 90+ componentes
- ✅ Tema Aura moderno
- ✅ Accesibilidad integrada
- ✅ Standalone ready
- ✅ TypeScript tipado

---

## Slide 5: Comparación

# PrimeNG vs Alternativas

| Biblioteca | Componentes | Angular 21 | Accesibilidad |
|------------|-------------|------------|---------------|
| **PrimeNG** | 90+ | ✅ | ✅ WCAG 2.1 |
| Angular Material | 40+ | ✅ | ✅ |
| NG-ZORRO | 60+ | ✅ | ✅ |
| Clarity | 50+ | ❌ | ✅ |

---

## Slide 6: Instalación

# Configuración Inicial

```bash
npm install primeng @primeuix/themes primeicons
```

**Dependencias:**
- `primeng`: Componentes UI
- `@primeuix/themes`: Sistema de temas
- `primeicons`: Iconos vectoriales

---

## Slide 7: Configuración

# app.config.ts

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
          darkModeSelector: '.dark'
        }
      }
    })
  ]
};
```

---

## Slide 8: Estilos

# styles.css

```css
@import "primeng/resources/primeng.css";
@import "primeicons/primeicons.css";
@import "@primeuix/themes/aura";

/* Con Tailwind CSS v4 */
@import "tailwindcss";
@plugin "tailwindcss-primeui";
```

---

## Slide 9: Button Component

# Primer Componente

```typescript
import { ButtonModule } from 'primeng/button';

@Component({
  imports: [ButtonModule],
  template: `
    <p-button label="Guardar" icon="pi pi-save" />
    <p-button label="Cancelar" severity="secondary" outlined />
    <p-button label="Eliminar" severity="danger" />
  `
})
```

---

## Slide 10: Button Props

# Propiedades del Button

| Propiedad | Valores |
|-----------|---------|
| `severity` | primary, secondary, success, info, warn, danger |
| `variant` | outlined, raised, text, rounded |
| `icon` | pi pi-* (PrimeIcons) |
| `loading` | Muestra spinner |
| `disabled` | Deshabilita el botón |

---

## Slide 11: Error Común

# ⚠️ Importar el Módulo

```typescript
// ❌ ERROR: Componente no renderiza
@Component({
  template: `<p-button label="Click" />`
})

// ✅ CORRECTO: Importar módulo
@Component({
  imports: [ButtonModule],
  template: `<p-button label="Click" />`
})
```

---

## Slide 12: Formularios

# Componentes de Formulario

| Componente | Uso |
|------------|-----|
| `InputText` | Texto básico |
| `InputNumber` | Números con formato |
| `Dropdown` | Select con búsqueda |
| `MultiSelect` | Múltiples opciones |
| `Calendar` | Selector de fecha |

---

## Slide 13: InputText

# Campo de Texto

```typescript
import { InputTextModule } from 'primeng/inputtext';

@Component({
  imports: [InputTextModule, FormsModule],
  template: `
    <input 
      pInputText 
      [(ngModel)]="username"
      placeholder="Usuario" />
  `
})
```

---

## Slide 14: Dropdown

# Selector con Búsqueda

```typescript
import { DropdownModule } from 'primeng/dropdown';

@Component({
  imports: [DropdownModule],
  template: `
    <p-dropdown 
      [options]="countries"
      optionLabel="name"
      optionValue="code"
      [filter]="true"
      placeholder="Selecciona país" />
  `
})
```

---

## Slide 15: MultiSelect

# Selección Múltiple

```typescript
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  imports: [MultiSelectModule],
  template: `
    <p-multiSelect 
      [options]="roles"
      optionLabel="name"
      [(ngModel)]="selectedRoles"
      placeholder="Selecciona roles" />
  `
})
```

---

## Slide 16: Table Component

# Componentes de Datos

**p-table** - El más poderoso:

- ✅ Paginación
- ✅ Ordenamiento
- ✅ Filtrado global y por columna
- ✅ Selección simple/múltiple
- ✅ Virtual scroll
- ✅ Exportación

---

## Slide 17: Table Básico

# Estructura

```typescript
<p-table [value]="users" [paginator]="true" [rows]="10">
  <ng-template pTemplate="header">
    <tr>
      <th pSortableColumn="name">Nombre</th>
      <th>Email</th>
    </tr>
  </ng-template>
  
  <ng-template pTemplate="body" let-user>
    <tr>
      <td>{{ user.name }}</td>
      <td>{{ user.email }}</td>
    </tr>
  </ng-template>
</p-table>
```

---

## Slide 18: Table con Filtros

# Filtro Global

```typescript
<p-table 
  #dt
  [value]="users"
  [globalFilterFields]="['name', 'email']">
  
  <ng-template pTemplate="caption">
    <input 
      pInputText
      (input)="dt.filterGlobal($event.target.value, 'contains')" />
  </ng-template>
  
  <!-- header y body -->
</p-table>
```

---

## Slide 19: Table con Selección

# Selección Múltiple

```typescript
<p-table 
  [(selection)]="selectedUsers"
  dataKey="id">
  
  <ng-template pTemplate="header">
    <tr>
      <th><p-tableHeaderCheckbox /></th>
      <th>Nombre</th>
    </tr>
  </ng-template>
  
  <ng-template pTemplate="body" let-user>
    <tr>
      <td><p-tableCheckbox [value]="user" /></td>
      <td>{{ user.name }}</td>
    </tr>
  </ng-template>
</p-table>
```

---

## Slide 20: Virtual Scroll

# Grandes Datasets

```typescript
// ❌ Sin virtual scroll - Renderiza todo
<p-table [value]="largeDataset()" [paginator]="true" />

// ✅ Con virtual scroll - Solo visible
<p-table 
  [value]="largeDataset()"
  [virtualScroll]="true"
  [virtualScrollItemSize]="40"
  scrollHeight="400px" />
```

---

## Slide 21: UI Components

# Feedback al Usuario

| Componente | Uso |
|------------|-----|
| `Dialog` | Modales y formularios |
| `ConfirmDialog` | Confirmaciones |
| `Toast` | Notificaciones |
| `Messages` | Mensajes inline |

---

## Slide 22: Toast

# Notificaciones

```typescript
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  imports: [ToastModule],
  providers: [MessageService],
  template: `<p-toast position="top-right" />`
})

// Uso
messageService.add({
  severity: 'success',
  summary: 'Éxito',
  detail: 'Operación completada'
});
```

---

## Slide 23: Severities

# Tipos de Mensaje

| Severity | Uso | Color |
|----------|-----|-------|
| `success` | Operación exitosa | Verde |
| `info` | Información | Azul |
| `warn` | Advertencia | Amarillo |
| `error` | Error | Rojo |

---

## Slide 24: ConfirmDialog

# Confirmación

```typescript
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  imports: [ConfirmDialogModule],
  providers: [ConfirmationService],
  template: `<p-confirmDialog />`
})

// Uso
confirmationService.confirm({
  message: '¿Eliminar registro?',
  accept: () => { /* eliminar */ }
});
```

---

## Slide 25: Dialog

# Modal

```typescript
<p-dialog 
  [(visible)]="dialogVisible"
  header="Nuevo Usuario"
  [modal]="true">
  
  <ng-template pTemplate="footer">
    <p-button label="Cancelar" outlined />
    <p-button label="Guardar" />
  </ng-template>
</p-dialog>
```

---

## Slide 26: Providers

# ⚠️ Providers Requeridos

```typescript
// Toast requiere MessageService
@Component({
  providers: [MessageService]
})

// ConfirmDialog requiere ConfirmationService
@Component({
  providers: [ConfirmationService]
})

// O ambos en el componente raíz
@Component({
  providers: [MessageService, ConfirmationService]
})
```

---

## Slide 27: Personalización

# Tema Aura

**Sistema de Design Tokens:**

- `primary`: Color principal
- `surface`: Fondos
- `border`: Bordes
- `text`: Textos
- `highlight`: Elementos destacados

---

## Slide 28: Variables CSS

# Sobrescribir Colores

```css
:root {
  --p-primary-color: #38240c;
  --p-primary-hover-color: #4a2d10;
  
  --p-success-color: #22c55e;
  --p-danger-color: #ef4444;
}

.dark {
  --p-primary-color: #c4a77d;
  --p-surface-0: #1a1a1a;
}
```

---

## Slide 29: Tema Personalizado

# Extender Aura

```typescript
const UyuniTheme = {
  ...Aura,
  semantic: {
    ...Aura.semantic,
    primary: {
      500: '#38240c' // Color principal
    }
  }
};

providePrimeNG({
  theme: { preset: UyuniTheme }
});
```

---

## Slide 30: Resumen

# Lo que Aprendimos

| Sección | Conceptos |
|---------|-----------|
| Introducción | PrimeNG v21, Aura, configuración |
| Formularios | InputText, Dropdown, MultiSelect |
| Datos | Table, paginación, filtros |
| UI | Dialog, Toast, ConfirmDialog |
| Tema | Design Tokens, personalización |

---

## Slide 31: Próximos Pasos

# Continúa Aprendiendo

1. ✅ Completar labs del día
2. ✅ Responder assessment
3. 📅 Día 14: Estilos con Tailwind CSS v4

---

## Slide 32: Recursos

# Documentación

- 📚 [PrimeNG Documentation](https://primeng.org/)
- 🎨 [Aura Theme](https://primeng.org/theming)
- 🔧 [PrimeIcons](https://primeicons.org/)
- 📖 [UyuniAdmin Source](../../../src/app/)

---

*Slides - Día 13 - Curso Angular 21 - UyuniAdmin Frontend*
