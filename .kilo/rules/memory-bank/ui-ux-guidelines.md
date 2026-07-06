# UI/UX Guidelines - UyuniAdmin Frontend

## Design Philosophy

### Core Principles
- **High Density**: Compact elements, 14px base font
- **Professional Aesthetics**: Corporate, clean, modern
- **Accessibility**: WCAG 2.1 AA compliance
- **Responsive**: Mobile-first approach

---

## Theme System

### PrimeNG Aura Theme
```typescript
// app.config.ts
providePrimeNG({
  ripple: true,
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.dark',
      cssLayer: {
        name: 'primeng',
        order: 'base, primeng, components, utilities'
      }
    }
  }
})
```

### Dark Mode
- Toggle via `.dark` class on `<html>` element
- Synchronized with Tailwind dark mode
- Persisted in localStorage

### Brand Colors
```css
/* Primary brand color */
--brand-primary: #38240c;

/* Semantic colors */
--color-success: #22c55e;
--color-warning: #f59e0b;
--color-error: #ef4444;
--color-info: #3b82f6;
```

---

## Typography

### Font Family
```css
/* Self-hosted Roboto */
font-family: 'Roboto', sans-serif;

/* Font weights */
--font-light: 300;
--font-regular: 400;
--font-medium: 500;
--font-bold: 700;
```

### Font Sizes
```css
/* Base: 14px */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
```

---

## Spacing System

### CSS Tokens
```css
/* Layout tokens */
--main-padding: 1.5rem;
--header-height: 64px;
--sidebar-width: 260px;
--sidebar-collapsed-width: 80px;
```

### Tailwind Spacing
```html
<!-- Use Tailwind spacing utilities -->
<div class="p-4">        <!-- 1rem -->
<div class="gap-2">      <!-- 0.5rem -->
<div class="mt-6">       <!-- 1.5rem -->
```

---

## Component Patterns

### Buttons
```html
<!-- Primary button -->
<p-button label="Save" icon="pi pi-check" severity="primary" />

<!-- Secondary button -->
<p-button label="Cancel" severity="secondary" outlined />

<!-- Danger button -->
<p-button label="Delete" icon="pi pi-trash" severity="danger" />
```

### Forms
```html
<!-- Form field with label -->
<div class="flex flex-col gap-2">
  <label for="email" class="text-sm font-medium">Email</label>
  <input pInputText id="email" type="email" class="w-full" />
</div>
```

### Cards
```html
<!-- Standard card -->
<p-card>
  <ng-template pTemplate="header">
    <h3 class="text-lg font-semibold">Card Title</h3>
  </ng-template>
  <p>Card content goes here...</p>
</p-card>
```

### Tables
```html
<!-- Data table -->
<p-table [value]="data()" [paginator]="true" [rows]="10">
  <ng-template pTemplate="header">
    <tr>
      <th pSortableColumn="name">Name</th>
      <th>Email</th>
    </tr>
  </ng-template>
  <ng-template pTemplate="body" let-row>
    <tr>
      <td>{{ row.name }}</td>
      <td>{{ row.email }}</td>
    </tr>
  </ng-template>
</p-table>
```

---

## Layout Patterns

### Page Layout
```html
<!-- Standard page layout -->
<div class="p-6">
  <!-- Page header -->
  <div class="mb-6">
    <h1 class="text-2xl font-bold">Page Title</h1>
    <p class="text-gray-500">Page description</p>
  </div>
  
  <!-- Content area -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Content cards -->
  </div>
</div>
```

### Responsive Grid
```html
<!-- Responsive grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  <!-- Grid items -->
</div>
```

### Mobile vs Desktop
```html
<!-- Mobile: vertical, Desktop: horizontal -->
<div class="flex flex-col lg:flex-row gap-4">
  <div class="flex-1">Content A</div>
  <div class="flex-1">Content B</div>
</div>

<!-- Show/hide based on breakpoint -->
<div class="hidden lg:flex">Desktop only</div>
<div class="lg:hidden">Mobile only</div>
```

---

## Loading States

### Global Loader
```html
<!-- In AppComponent (root level) -->
<p-blockUI [blocked]="isLoading()">
  <i class="pi pi-spinner pi-spin text-4xl"></i>
</p-blockUI>
```

### Skeleton Screens
```html
<!-- Skeleton for content loading -->
<div class="animate-pulse">
  <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
  <div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
  <div class="h-32 bg-gray-200 rounded"></div>
</div>
```

---

## Feedback & Notifications

### Toast Messages
```typescript
// Success message
this.messageService.add({
  severity: 'success',
  summary: 'Success',
  detail: 'Operation completed successfully'
});

// Error message
this.messageService.add({
  severity: 'error',
  summary: 'Error',
  detail: 'Operation failed'
});
```

### Confirmation Dialogs
```typescript
this.confirmationService.confirm({
  message: 'Are you sure you want to delete this item?',
  header: 'Confirm Delete',
  icon: 'pi pi-exclamation-triangle',
  accept: () => {
    // Delete action
  }
});
```

---

## Accessibility (a11y)

### Keyboard Navigation
```html
<!-- Ensure keyboard accessibility -->
<button (click)="onClick()" (keydown.enter)="onClick()">
  Click me
</button>

<!-- Use tabindex for custom interactive elements -->
<div tabindex="0" (keydown.enter)="onActivate()">
  Custom interactive element
</div>
```

### ARIA Labels
```html
<!-- Add ARIA labels for screen readers -->
<button aria-label="Close dialog" (click)="close()">
  <i class="pi pi-times"></i>
</button>

<nav aria-label="Main navigation">
  <!-- Navigation items -->
</nav>
```

### Focus Management
```typescript
// Focus trap for modals
// Use PrimeNG Dialog with focusTrap option
<p-dialog [focusOnShow]="true">
  <!-- Dialog content -->
</p-dialog>
```

---

## Icons

### Lucide Icons (Primary)
```html
<!-- Static Lucide icons (preferred for fixed template icons) -->
<svg lucideMenu size="20"></svg>
<svg lucideHouse size="16"></svg>

<!-- Dynamic icon binding via IconRegistryService (slug-first) -->
<svg [lucideIcon]="iconRegistry.get(slug || '')" size="20"></svg>
```

### Slug-First Icon Resolution
- **Slug as primary source**: Templates use `iconRegistry.get(entity.slug || '')` directly
- **Icon field deprecated**: Backend may still send `icon` field but it's ignored in templates
- **Neutral fallback**: `LucideCircleDot` (neutral dot) for unmapped slugs — not `LucideCircleAlert` (which looks like an error)
- **Never use**: `iconRegistry.get(entity.icon || entity.slug || '')` — the `icon` field is deprecated

### PrimeIcons (Legacy/Restricted)
```html
<!-- Only for PrimeNG icon="" props and social/brand icons -->
<p-button icon="pi pi-times" />
<i class="pi pi-facebook"></i> <!-- Social icons only -->
```

### Common Lucide Icons
| Lucide Component | Usage |
|------------------|-------|
| `LucideHouse` | Dashboard/Home |
| `LucideUser` | User/Profile |
| `LucideSettings` | Settings/Management |
| `LucideShield` | Admin/Roles/Security |
| `LucideUsers` | Staff/Users/Viewer role |
| `LucideBuilding` | Institution/Organization |
| `LucidePackage` | Fixed Assets/Products |
| `LucideLogOut` | Logout |
| `LucidePencil` | Edit |
| `LucideSearch` | Search |
| `LucideListFilter` | Filter/Clear |
| `LucideCircleAlert` | Warning/Error |
| `LucideCircleCheck` | Success/Check |
| `LucideCircleDot` | Neutral fallback (unmapped slug) |
| `LucideChevronDown` | Expand/Dropdown |
| `LucideChevronRight` | Breadcrumb/Next |
| `LucideMenu` | Hamburger menu |
| `LucideX` | Close/Dismiss |
| `LucideEllipsis` | More options |
| `LucideSun` / `LucideMoon` | Theme toggle |
| `LucideWifi` | Network status |
| `LucideDynamicIcon` | Dynamic icon binding (`[lucideIcon]`) |

### IconRegistryService
Backend-driven icons use `IconRegistryService` to map slug strings to Lucide icon data. See Services Reference for details.

---

## Localization

### Language
- **UI Language**: Spanish (es-ES)
- All user-facing text must be in Spanish

### Text Examples
```html
<!-- Spanish UI text -->
<button>Guardar</button>
<button>Cancelar</button>
<label>Nombre de usuario</label>
<p>Error al cargar los datos</p>
```

---

## Performance

### Image Optimization
```html
<!-- Use appropriate image sizes -->
<img src="image.webp" alt="Description" loading="lazy" />
```

### Animation Performance
```css
/* Use GPU-accelerated properties */
.animate-dropdown-in {
  animation: dropdown-in 0.2s ease-out;
}

@keyframes dropdown-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## Custom Scrollbars

```css
/* Custom scrollbar styles */
@utility custom-scrollbar {
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    @apply bg-gray-200 rounded-full;
  }
}

/* Dark mode scrollbar */
.dark {
  &::-webkit-scrollbar-thumb {
    @apply bg-gray-800;
  }
}
```

---

*Last updated: July 2026*
