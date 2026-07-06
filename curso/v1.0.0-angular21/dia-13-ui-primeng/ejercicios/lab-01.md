# Día 13: Lab 01 - Formularios con PrimeNG

## Objetivo

Implementar un formulario completo de registro de usuario utilizando componentes de formulario de PrimeNG.

## Tiempo Estimado

60 minutos

---

## Ejercicio 1: Formulario Básico

### Descripción

Crear un formulario de registro con los siguientes campos:
- Nombre completo (requerido)
- Email (requerido, formato válido)
- Teléfono (con máscara)
- Fecha de nacimiento
- País (dropdown)
- Intereses (multiselect)

### Instrucciones

1. Crear el componente `UserRegistrationComponent`
2. Importar los módulos necesarios de PrimeNG
3. Implementar validación básica
4. Mostrar errores en tiempo real

### Código Base

```typescript
// src/app/features/users/components/user-registration/user-registration.component.ts
import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';

interface UserForm {
  fullName: string;
  email: string;
  phone: string;
  birthDate: Date | null;
  country: string | null;
  interests: string[];
}

@Component({
  selector: 'app-user-registration',
  standalone: true,
  imports: [
    FormsModule,
    InputTextModule,
    InputMaskModule,
    CalendarModule,
    DropdownModule,
    MultiSelectModule,
    ButtonModule
  ],
  templateUrl: './user-registration.component.html'
})
export class UserRegistrationComponent {
  // TODO: Implementar formulario
}
```

### Solución

```typescript
// user-registration.component.ts
import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

interface UserForm {
  fullName: string;
  email: string;
  phone: string;
  birthDate: Date | null;
  country: string | null;
  interests: string[];
}

@Component({
  selector: 'app-user-registration',
  standalone: true,
  imports: [
    FormsModule,
    InputTextModule,
    InputMaskModule,
    CalendarModule,
    DropdownModule,
    MultiSelectModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <p-toast />
    
    <div class="max-w-2xl mx-auto p-6">
      <h2 class="text-2xl font-bold mb-6">Registro de Usuario</h2>
      
      <form class="flex flex-col gap-4">
        <!-- Nombre completo -->
        <div class="flex flex-col gap-2">
          <label for="fullName" class="font-medium">
            Nombre completo *
          </label>
          <input 
            pInputText 
            id="fullName"
            [(ngModel)]="form().fullName"
            (blur)="touchedFields.update(t => ({ ...t, fullName: true }))"
            [class.border-red-500]="isFieldInvalid('fullName')"
            placeholder="Juan Pérez" />
          @if (isFieldInvalid('fullName')) {
            <small class="text-red-500">Nombre es requerido</small>
          }
        </div>
        
        <!-- Email -->
        <div class="flex flex-col gap-2">
          <label for="email" class="font-medium">
            Email *
          </label>
          <input 
            pInputText 
            id="email"
            type="email"
            [(ngModel)]="form().email"
            (blur)="touchedFields.update(t => ({ ...t, email: true }))"
            [class.border-red-500]="isFieldInvalid('email')"
            placeholder="juan@ejemplo.com" />
          @if (isFieldInvalid('email')) {
            <small class="text-red-500">{{ emailError() }}</small>
          }
        </div>
        
        <!-- Teléfono -->
        <div class="flex flex-col gap-2">
          <label for="phone" class="font-medium">
            Teléfono
          </label>
          <input 
            pInputMask
            id="phone"
            mask="+999 9999 9999"
            [(ngModel)]="form().phone"
            placeholder="+591 7123 4567" />
        </div>
        
        <!-- Fecha de nacimiento -->
        <div class="flex flex-col gap-2">
          <label for="birthDate" class="font-medium">
            Fecha de nacimiento
          </label>
          <p-calendar 
            [(ngModel)]="form().birthDate"
            [maxDate]="maxDate"
            dateFormat="dd/mm/yy"
            placeholder="Selecciona fecha"
            inputId="birthDate" />
        </div>
        
        <!-- País -->
        <div class="flex flex-col gap-2">
          <label for="country" class="font-medium">
            País
          </label>
          <p-dropdown 
            [options]="countries"
            [(ngModel)]="form().country"
            optionLabel="name"
            optionValue="code"
            placeholder="Selecciona país"
            [filter]="true"
            inputId="country" />
        </div>
        
        <!-- Intereses -->
        <div class="flex flex-col gap-2">
          <label class="font-medium">Intereses</label>
          <p-multiSelect 
            [options]="interestOptions"
            [(ngModel)]="form().interests"
            optionLabel="name"
            optionValue="id"
            placeholder="Selecciona intereses"
            [showHeader]="true" />
        </div>
        
        <!-- Botones -->
        <div class="flex gap-4 mt-4">
          <p-button 
            label="Registrar"
            icon="pi pi-check"
            severity="success"
            (onClick)="submit()" />
          <p-button 
            label="Limpiar"
            severity="secondary"
            outlined
            (onClick)="reset()" />
        </div>
      </form>
    </div>
  `
})
export class UserRegistrationComponent {
  private messageService = inject(MessageService);
  
  // Estado del formulario
  form = signal<UserForm>({
    fullName: '',
    email: '',
    phone: '',
    birthDate: null,
    country: null,
    interests: []
  });
  
  // Campos tocados
  touchedFields = signal({
    fullName: false,
    email: false
  });
  
  // Fecha máxima (hace 18 años)
  maxDate = new Date();
  
  // Opciones de países
  countries = [
    { name: 'Bolivia', code: 'BO' },
    { name: 'Argentina', code: 'AR' },
    { name: 'Brasil', code: 'BR' },
    { name: 'Chile', code: 'CL' },
    { name: 'Perú', code: 'PE' },
    { name: 'Colombia', code: 'CO' },
    { name: 'México', code: 'MX' }
  ];
  
  // Opciones de intereses
  interestOptions = [
    { id: 'tech', name: 'Tecnología' },
    { id: 'sports', name: 'Deportes' },
    { id: 'music', name: 'Música' },
    { id: 'travel', name: 'Viajes' },
    { id: 'reading', name: 'Lectura' },
    { id: 'gaming', name: 'Videojuegos' }
  ];
  
  // Validación de email
  emailError = computed(() => {
    const email = this.form().email;
    if (!email) return 'Email es requerido';
    if (!email.includes('@')) return 'Email inválido';
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return 'Formato inválido';
    return null;
  });
  
  // Validación de campo
  isFieldInvalid(field: string): boolean {
    const touched = this.touchedFields()[field as keyof typeof this.touchedFields()];
    if (!touched) return false;
    
    if (field === 'fullName') {
      return !this.form().fullName;
    }
    if (field === 'email') {
      return !!this.emailError();
    }
    return false;
  }
  
  // Validación completa
  isValid(): boolean {
    return !!this.form().fullName && !this.emailError();
  }
  
  // Enviar formulario
  submit(): void {
    // Marcar todos como tocados
    this.touchedFields.set({
      fullName: true,
      email: true
    });
    
    if (!this.isValid()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor completa los campos requeridos'
      });
      return;
    }
    
    // Aquí iría la llamada al servicio
    console.log('Formulario enviado:', this.form());
    
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Usuario registrado correctamente'
    });
  }
  
  // Limpiar formulario
  reset(): void {
    this.form.set({
      fullName: '',
      email: '',
      phone: '',
      birthDate: null,
      country: null,
      interests: []
    });
    this.touchedFields.set({
      fullName: false,
      email: false
    });
  }
  
  constructor() {
    // Configurar fecha máxima (18 años atrás)
    const today = new Date();
    this.maxDate.setFullYear(today.getFullYear() - 18);
  }
}
```

---

## Ejercicio 2: Validación Avanzada

### Descripción

Agregar validación avanzada:
- Nombre: mínimo 3 caracteres, solo letras
- Email: formato válido con regex
- Teléfono: formato internacional
- Fecha: mayor de 18 años

### Instrucciones

1. Crear validadores personalizados
2. Mostrar mensajes de error específicos
3. Deshabilitar botón si formulario es inválido

### Solución

```typescript
// Agregar al componente anterior

// Validadores
nameError = computed(() => {
  const name = this.form().fullName;
  if (!name) return 'Nombre es requerido';
  if (name.length < 3) return 'Mínimo 3 caracteres';
  if (!name.match(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/)) return 'Solo letras permitidas';
  return null;
});

phoneError = computed(() => {
  const phone = this.form().phone;
  if (!phone) return null; // Opcional
  if (!phone.match(/^\+\d{3}\s\d{4}\s\d{4}$/)) return 'Formato: +999 9999 9999';
  return null;
});

ageError = computed(() => {
  const birthDate = this.form().birthDate;
  if (!birthDate) return null;
  
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1;
  }
  
  if (age < 18) return 'Debes ser mayor de 18 años';
  return null;
});

// Validación completa
isValid(): boolean {
  return !this.nameError() && 
         !this.emailError() && 
         !this.phoneError() && 
         !this.ageError();
}

// Actualizar template
// Agregar [disabled]="!isValid()" al botón de registrar
```

---

## Ejercicio 3: Formulario Reactivo

### Descripción

Convertir el formulario a Reactive Forms con FormBuilder.

### Instrucciones

1. Usar FormBuilder para crear el formulario
2. Agregar validadores síncronos y asíncronos
3. Mostrar errores dinámicamente

### Solución

```typescript
// user-registration-reactive.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-registration-reactive',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <p-toast />
    
    <div class="max-w-2xl mx-auto p-6">
      <h2 class="text-2xl font-bold mb-6">Registro (Reactive)</h2>
      
      <form [formGroup]="userForm" class="flex flex-col gap-4">
        <!-- Nombre -->
        <div class="flex flex-col gap-2">
          <label for="fullName">Nombre *</label>
          <input 
            pInputText 
            id="fullName"
            formControlName="fullName"
            [class.border-red-500]="isInvalid('fullName')" />
          @if (isInvalid('fullName')) {
            <small class="text-red-500">{{ getError('fullName') }}</small>
          }
        </div>
        
        <!-- Email -->
        <div class="flex flex-col gap-2">
          <label for="email">Email *</label>
          <input 
            pInputText 
            id="email"
            type="email"
            formControlName="email"
            [class.border-red-500]="isInvalid('email')" />
          @if (isInvalid('email')) {
            <small class="text-red-500">{{ getError('email') }}</small>
          }
        </div>
        
        <!-- Botones -->
        <div class="flex gap-4 mt-4">
          <p-button 
            label="Registrar"
            severity="success"
            (onClick)="submit()"
            [disabled]="userForm.invalid" />
          <p-button 
            label="Limpiar"
            severity="secondary"
            outlined
            (onClick)="reset()" />
        </div>
      </form>
      
      <!-- Debug -->
      <pre class="mt-4 p-4 bg-gray-100 rounded text-sm">
        {{ userForm.value | json }}
      </pre>
    </div>
  `
})
export class UserRegistrationReactiveComponent implements OnInit {
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  
  userForm!: FormGroup;
  
  ngOnInit(): void {
    this.userForm = this.fb.group({
      fullName: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      phone: [''],
      birthDate: [null],
      country: [null],
      interests: [[]]
    });
  }
  
  isInvalid(field: string): boolean {
    const control = this.userForm.get(field);
    return !!(control?.invalid && control?.touched);
  }
  
  getError(field: string): string {
    const control = this.userForm.get(field);
    if (!control?.errors) return '';
    
    if (control.errors['required']) return 'Campo requerido';
    if (control.errors['minlength']) return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
    if (control.errors['pattern']) return 'Formato inválido';
    if (control.errors['email']) return 'Email inválido';
    
    return 'Error desconocido';
  }
  
  submit(): void {
    if (this.userForm.invalid) {
      this.markAllAsTouched();
      return;
    }
    
    console.log('Formulario:', this.userForm.value);
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Usuario registrado'
    });
  }
  
  reset(): void {
    this.userForm.reset();
  }
  
  private markAllAsTouched(): void {
    Object.values(this.userForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }
}
```

---

## Ejercicio 4: Validador Asíncrono

### Descripción

Agregar validación asíncrona para verificar si el email ya existe.

### Instrucciones

1. Crear validador asíncrono
2. Simular verificación con delay
3. Mostrar indicador de carga

### Solución

```typescript
// email-exists.validator.ts
import { AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

// Simulación de emails existentes
const existingEmails = ['admin@example.com', 'user@example.com', 'test@example.com'];

export function emailExistsValidator(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    // Simular delay de red
    return timer(500).pipe(
      switchMap(() => {
        const email = control.value;
        if (!email) return of(null);
        
        const exists = existingEmails.includes(email.toLowerCase());
        return of(exists ? { emailExists: true } : null);
      })
    );
  };
}

// En el componente
this.userForm = this.fb.group({
  email: ['', 
    [Validators.required, Validators.email],
    [emailExistsValidator()] // Validador asíncrono
  ]
});

// Template - mostrar error
@if (userForm.get('email')?.errors?.['emailExists']) {
  <small class="text-red-500">Este email ya está registrado</small>
}

// Mostrar indicador de carga
@if (userForm.get('email')?.pending) {
  <i class="pi pi-spinner pi-spin text-blue-500"></i>
}
```

---

## Criterios de Evaluación

| Criterio | Puntos |
|----------|--------|
| Formulario básico con todos los campos | 25 pts |
| Validación de campos requeridos | 20 pts |
| Validación de formato (email, teléfono) | 20 pts |
| Mensajes de error específicos | 15 pts |
| Botón deshabilitado si inválido | 10 pts |
| Limpieza del formulario | 10 pts |
| **Total** | **100 pts** |

---

*Lab 01 - Día 13 - Curso Angular 21 - UyuniAdmin Frontend*
