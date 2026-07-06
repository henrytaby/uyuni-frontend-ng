# Lab 02: Crear Componentes con Path Aliases

## Objetivo

Crear componentes utilizando Path Aliases y verificar que la configuración funciona correctamente.

## Tiempo Estimado

20 minutos

## Prerrequisitos

- [ ] Lab 01 completado
- [ ] Proyecto configurado con Path Aliases
- [ ] Servidor de desarrollo funcionando

---

## Instrucciones Paso a Paso

### Paso 1: Crear un Servicio en Core (5 min)

Crea el archivo `src/app/core/logger/logger.service.ts`:

```typescript
// src/app/core/logger/logger.service.ts
import { Injectable } from '@angular/core';

/**
 * Servicio de logging para la aplicación.
 * Proporciona métodos para registrar mensajes con diferentes niveles.
 */
@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  
  /**
   * Registra un mensaje de información
   */
  info(message: string, context?: string): void {
    console.log(`[INFO${context ? ` - ${context}` : ''}] ${message}`);
  }

  /**
   * Registra un mensaje de advertencia
   */
  warn(message: string, context?: string): void {
    console.warn(`[WARN${context ? ` - ${context}` : ''}] ${message}`);
  }

  /**
   * Registra un mensaje de error
   */
  error(message: string, error?: unknown, context?: string): void {
    console.error(`[ERROR${context ? ` - ${context}` : ''}] ${message}`, error || '');
  }
}
```

---

### Paso 2: Crear un Componente en Shared (5 min)

Crea el archivo `src/app/shared/components/button/button.component.ts`:

```typescript
// src/app/shared/components/button/button.component.ts
import { Component, input, output } from '@angular/core';

/**
 * Componente de botón reutilizable.
 * 
 * @example
 * ```html
 * <app-button 
 *   label="Guardar" 
 *   variant="primary" 
 *   (onClick)="handleClick()" />
 * ```
 */
@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button 
      [class]="buttonClass"
      [disabled]="disabled()"
      (click)="handleClick()">
      {{ label() }}
    </button>
  `,
  styles: [`
    .btn {
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-primary {
      background-color: #38240c;
      color: white;
      border: none;
    }
    .btn-primary:hover:not(:disabled) {
      background-color: #5e3d14;
    }
    .btn-secondary {
      background-color: #f3f4f6;
      color: #1f2937;
      border: 1px solid #d1d5db;
    }
    .btn-secondary:hover:not(:disabled) {
      background-color: #e5e7eb;
    }
    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class ButtonComponent {
  /** Texto del botón */
  readonly label = input.required<string>();
  
  /** Variante del botón: 'primary' | 'secondary' */
  readonly variant = input<'primary' | 'secondary'>('primary');
  
  /** Si el botón está deshabilitado */
  readonly disabled = input<boolean>(false);
  
  /** Evento emitido al hacer clic */
  readonly onClick = output<void>();

  get buttonClass(): string {
    return `btn btn-${this.variant()}`;
  }

  handleClick(): void {
    if (!this.disabled()) {
      this.onClick.emit();
    }
  }
}
```

---

### Paso 3: Crear una Página en Features (5 min)

Crea el archivo `src/app/features/dashboard/pages/overview/overview.component.ts`:

```typescript
// src/app/features/dashboard/pages/overview/overview.component.ts
import { Component, inject } from '@angular/core';
import { LoggerService } from '@core/logger/logger.service';
import { ButtonComponent } from '@shared/components/button/button.component';

/**
 * Página principal del Dashboard.
 * Demuestra el uso de Path Aliases.
 */
@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <div class="dashboard">
      <h1>Dashboard</h1>
      <p>Bienvenido al Mini UyuniAdmin</p>
      
      <div class="actions">
        <app-button 
          label="Acción Principal"
          variant="primary"
          (onClick)="handlePrimaryAction()" />
        
        <app-button 
          label="Acción Secundaria"
          variant="secondary"
          (onClick)="handleSecondaryAction()" />
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 2rem;
    }
    .actions {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }
  `]
})
export class DashboardOverviewComponent {
  private readonly logger = inject(LoggerService);

  handlePrimaryAction(): void {
    this.logger.info('Acción principal ejecutada', 'DashboardComponent');
  }

  handleSecondaryAction(): void {
    this.logger.info('Acción secundaria ejecutada', 'DashboardComponent');
  }
}
```

---

### Paso 4: Verificar Imports (5 min)

Abre cada archivo y verifica que:

1. **LoggerService** usa import relativo (mismo módulo):
   ```typescript
   // No hay imports externos en logger.service.ts
   ```

2. **ButtonComponent** usa import relativo (mismo módulo):
   ```typescript
   import { Component, input, output } from '@angular/core';
   // Solo imports de Angular
   ```

3. **DashboardOverviewComponent** usa Path Aliases:
   ```typescript
   import { LoggerService } from '@core/logger/logger.service';      // ✅ Alias
   import { ButtonComponent } from '@shared/components/button/button.component'; // ✅ Alias
   ```

**Verificación visual**:
- Usa Ctrl+Click en cada import
- Debe navegar al archivo correcto
- No debe mostrar errores de TypeScript

---

## ✅ Criterios de Aceptación

- [ ] LoggerService creado en `@core/logger/`
- [ ] ButtonComponent creado en `@shared/components/`
- [ ] DashboardOverviewComponent creado en `@features/dashboard/pages/`
- [ ] Todos los imports usan Path Aliases correctamente
- [ ] El proyecto compila sin errores
- [ ] Ctrl+Click navega a los archivos correctos

---

## 💡 Tips

### Tip 1: Organización de Imports

Sigue este orden en tus archivos:

```typescript
// 1. Angular imports
import { Component, inject } from '@angular/core';

// 2. Third-party imports
import { Observable } from 'rxjs';

// 3. Alias imports (alfabético)
import { LoggerService } from '@core/logger/logger.service';
import { ButtonComponent } from '@shared/components/button/button.component';

// 4. Relative imports
import { User } from './models/user.model';
```

### Tip 2: Crear archivos rápidamente

Usa el comando `ng generate`:

```bash
# Generar servicio
ng generate service core/logger/logger

# Generar componente
ng generate component shared/components/button

# Versión corta
ng s core/logger/logger
ng c shared/components/button
```

---

## 🐛 Errores Comunes

### Error: "Cannot find module '@core/...'"

**Verificar**:
1. El archivo existe en la ruta correcta
2. El nombre del archivo coincide
3. Se reinició el servidor

### Error: "Type 'X' is not assignable to type 'Y'"

**Verificar**:
1. Los tipos están correctamente definidos
2. Los imports son correctos
3. No hay typos en los nombres

---

## 🎯 Mini Reto Final

**Tu tarea**:
1. Crea un nuevo componente `CardComponent` en `@shared/components/card/`
2. Úsalo en el Dashboard
3. El card debe tener título y contenido como inputs

**Tiempo**: 10 minutos

---

## Solución del Mini Reto

<details>
<summary>Ver solución</summary>

```typescript
// src/app/shared/components/card/card.component.ts
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div class="card">
      <h2 class="card-title">{{ title() }}</h2>
      <div class="card-content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .card {
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      padding: 1.5rem;
    }
    .card-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }
  `]
})
export class CardComponent {
  readonly title = input.required<string>();
}
```

Uso en Dashboard:

```typescript
// En imports
import { CardComponent } from '@shared/components/card/card.component';

// En template
<app-card title="Estadísticas">
  <p>Contenido del card...</p>
</app-card>
```

</details>

---

*Curso: Angular 21 Enterprise*
*Lab: 02 de 02*
