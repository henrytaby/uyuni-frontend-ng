# PrimeNG & Iconography Standards - UyuniAdmin Frontend

## Library Versions
- **PrimeNG**: v21.1.9
- **Themes**: `@primeuix/themes` v2.0.3 (Aura)
- **Primary Icons**: `@lucide/angular` v1.23.0
- **Legacy Icons**: `primeicons` v7.0.0 (restricted use)

## 1. PrimeNG Modern Component API
Always import individual components directly from `primeng/*`:
```typescript
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
```

## 2. Theme System
Theme configuration must import from `@primeuix/themes`, never legacy `@primeng/themes`:
```typescript
// ✅ CORRECT
import { Aura } from '@primeuix/themes/aura';

// ❌ FORBIDDEN
import { Aura } from '@primeng/themes/aura';
```

## 3. Class vs styleClass Property
In PrimeNG v21+, `styleClass` is deprecated. Use the standard `class` attribute:
```html
<!-- ✅ CORRECT -->
<p-button label="Guardar" class="p-button-sm" />
<p-dialog header="Detalles" [modal]="true" class="w-full max-w-lg" />

<!-- ❌ FORBIDDEN -->
<p-button label="Guardar" styleClass="p-button-sm" />
```

## 4. Lucide Icons (Primary Icon Library)
Use `@lucide/angular` for all application iconography.

### Static Icons
Import specific icon components from `@lucide/angular`:
```typescript
import { LucideMenu, LucideX, LucidePlus, LucideTrash2 } from '@lucide/angular';

@Component({
  imports: [LucideMenu, LucideX, LucidePlus, LucideTrash2]
})
```
```html
<svg lucideMenu size="20"></svg>
<svg lucidePlus size="16"></svg>
```

### Dynamic Backend Icons (Slug-First)
For icons driven by backend navigation/modules, resolve dynamically via `IconRegistryService`:
```typescript
import { LucideDynamicIcon } from '@lucide/angular';
import { IconRegistryService } from '@shared/services/icon-registry.service';

@Component({
  imports: [LucideDynamicIcon]
})
export class SidebarComponent {
  protected readonly iconRegistry = inject(IconRegistryService);
}
```
```html
<!-- Slug-first resolution -->
<svg [lucideIcon]="iconRegistry.get(item.slug || '')" size="20"></svg>
```

### PrimeIcons Retention Policy
PrimeIcons (`pi pi-*`) are ONLY allowed for:
1. PrimeNG native `icon` props where an SVG component cannot be passed directly (e.g., `<p-button icon="pi pi-check">`).
2. Social / brand icons not present in Lucide.

