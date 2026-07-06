# Día 2: Arquitectura DDD Lite

## Información General

| Aspecto | Detalle |
|---------|---------|
| **Módulo** | 1 - Fundamentos y Arquitectura |
| **Duración** | 4-5 horas |
| **Nivel** | Básico-Intermedio |
| **Prerrequisitos** | Día 1 completado |

## Objetivos de Aprendizaje

Al finalizar este día, el estudiante será capaz de:

1. **Comprender** los principios de Domain-Driven Design (DDD) aplicados a Angular
2. **Diferenciar** entre Smart Components y Dumb Components
3. **Implementar** ChangeDetectionStrategy.OnPush para optimizar rendimiento
4. **Aplicar** el patrón de inyección de dependencias con `inject()`
5. **Estructurar** features siguiendo la arquitectura del proyecto UyuniAdmin

## Temario

1. **Introducción a DDD Lite** (45 min)
   - ¿Qué es DDD?
   - DDD vs DDD Lite
   - Beneficios para proyectos Angular

2. **Smart vs Dumb Components** (60 min)
   - Definición y diferencias
   - Cuándo usar cada tipo
   - Ejemplos del proyecto UyuniAdmin

3. **ChangeDetectionStrategy.OnPush** (60 min)
   - Cómo funciona el change detection
   - Default vs OnPush
   - Patrones inmutables

4. **Patrón inject()** (45 min)
   - Inyección moderna en Angular
   - Ventajas sobre constructor
   - Uso en servicios y componentes

5. **Estructura de Features** (60 min)
   - Organización interna
   - Lazy loading
   - Rutas anidadas

## Estructura de Clase

### Hook (5 min)
Mostrar un componente con problemas de rendimiento y preguntar: "¿Por qué esta aplicación es lenta?"

### Contexto (10 min)
Explicar que el 60% de los problemas de rendimiento en Angular se deben a un mal uso del change detection.

### Explicación Simple (40 min)
- Analogía: Smart Components son "gerentes", Dumb Components son "trabajadores"
- OnPush es como un "semáforo" que solo cambia cuando hay datos nuevos

### Demo/Código (60 min)
- Crear un Smart Component (SignInComponent)
- Crear un Dumb Component (SignInFormComponent)
- Implementar OnPush
- Medir rendimiento con Angular DevTools

### Error Común (15 min)
- OnPush con objetos mutables
- Solución: usar immutable patterns

### Mini Reto (30 min)
- Convertir un componente existente a OnPush
- Crear un Dumb Component para un caso específico

### Cierre (10 min)
- Resumen de conceptos
- Preview del Día 3

## Materiales

| Archivo | Descripción |
|---------|-------------|
| [`contenido.md`](./contenido.md) | Contenido teórico completo |
| [`slides/dia-02-arquitectura-ddd_Marp.md`](./slides/dia-02-arquitectura-ddd_Marp.md) | Presentación Marp |
| [`ejercicios/lab-01.md`](./ejercicios/lab-01.md) | Práctica guiada: Smart/Dumb Components |
| [`ejercicios/lab-02.md`](./ejercicios/lab-02.md) | Práctica independiente: OnPush |
| [`assessment/preguntas.md`](./assessment/preguntas.md) | 50 preguntas de opción múltiple |
| [`recursos/bibliografia.md`](./recursos/bibliografia.md) | Referencias y recursos |
| [`recursos/cheatsheet.md`](./recursos/cheatsheet.md) | Guía rápida de referencia |
| [`recursos/script-audio.md`](./recursos/script-audio.md) | Guion de podcast |
| [`recursos/script-video-youtube.md`](./recursos/script-video-youtube.md) | Guion de video YouTube |

## Conceptos Clave

### DDD Lite
```
Domain-Driven Design Lite = DDD simplificado para aplicaciones CRUD
- Bounded Contexts → Features
- Aggregates → Módulos
- Repositories → Services
- Entities → Models
```

### Smart vs Dumb
```
Smart Component (Pages)          Dumb Component (UI)
─────────────────────────        ─────────────────────────
✓ Tiene servicios                ✓ Solo recibe @Input
✓ Maneja estado                  ✓ Solo emite @Output
✓ Tiene lógica de negocio        ✓ Sin lógica de negocio
✓ Se comunica con API            ✓ Sin servicios HTTP
✓ Ubicado en /pages              ✓ Ubicado en /components
```

### OnPush Pattern
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush  // ← Clave
})
export class MyComponent {
  // Solo se actualiza cuando:
  // 1. @Input cambia (referencia nueva)
  // 2. Evento del DOM
  // 3. Async pipe
  // 4. signal() actualiza
}
```

## Ejemplo del Proyecto

### Smart Component: SignInComponent
```typescript
// src/app/features/auth/pages/sign-in/sign-in.component.ts
@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [SignInFormComponent, AuthPageLayoutComponent],
  templateUrl: './sign-in.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignInComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  
  isLoading = signal(false);
  error = signal<string | null>(null);
  
  onLogin(credentials: LoginCredentials): void {
    this.isLoading.set(true);
    this.authService.login(credentials).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.error.set(err.message);
        this.isLoading.set(false);
      }
    });
  }
}
```

### Dumb Component: SignInFormComponent
```typescript
// src/app/features/auth/components/signin-form/signin-form.component.ts
@Component({
  selector: 'app-signin-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signin-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignInFormComponent {
  readonly onSubmit = output<LoginCredentials>();
  readonly isLoading = input<boolean>(false);
  
  form = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });
  
  handleSubmit(): void {
    if (this.form.valid) {
      this.onSubmit.emit(this.form.value as LoginCredentials);
    }
  }
}
```

## Criterios de Evaluación

| Criterio | Excelente | Bueno | Aceptable |
|----------|-----------|-------|-----------|
| DDD Lite | Explica todos los conceptos | Entiende la estructura | Conoce los términos |
| Smart/Dumb | Crea ambos tipos correctamente | Diferencia claramente | Sabe cuál usar |
| OnPush | Implementa con patrones inmutables | Usa OnPush correctamente | Conoce el concepto |
| inject() | Usa en todos los casos | Prefiere sobre constructor | Sabe la sintaxis |

## Preparación del Instructor

### Antes de la Clase
1. Revisar el proyecto UyuniAdmin
2. Preparar ejemplos de componentes Smart y Dumb
3. Configurar Angular DevTools para demo
4. Preparar métricas de rendimiento

### Durante la Clase
1. Usar analogías para conceptos abstractos
2. Mostrar código real del proyecto
3. Hacer pausas para preguntas
4. Fomentar participación en el mini reto

### Después de la Clase
1. Revisar ejercicios enviados
2. Proporcionar feedback
3. Actualizar FAQs según preguntas

---

*Curso: Angular 21 Enterprise*
*Día: 2 de 18*
*Próximo: Día 3 - Lazy Loading y Rutas*
