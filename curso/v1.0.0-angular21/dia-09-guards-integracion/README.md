# Día 9: Sistema de Autenticación - Guards y Integración

## 📋 Información General

- **Duración:** 4 horas
- **Módulo:** 3 - Sistema de Autenticación
- **Prerrequisitos:** Días 1-8 completados
- **Nivel:** Intermedio

## 🎯 Objetivos de Aprendizaje

Al finalizar este día, el estudiante será capaz de:

1. **Implementar Guards funcionales** en Angular 21 usando `CanActivateFn`
2. **Proteger rutas** de acceso no autorizado
3. **Integrar Guards** con el sistema de autenticación
4. **Redirigir usuarios** a páginas de login cuando no están autenticados
5. **Escribir tests unitarios** para Guards funcionales
6. **Comprender el flujo completo** de autenticación en la aplicación

## 📚 Contenido del Día

### Teoría
- ¿Qué son los Guards en Angular?
- Tipos de Guards: CanActivate, CanDeactivate, CanMatch, CanLoad
- Guards funcionales vs Guards basados en clases
- Inyección de dependencias en Guards funcionales

### Práctica
- Implementación de `authGuard`
- Integración con `AuthService`
- Configuración en rutas
- Tests unitarios con Jest

### Proyecto Real
- Análisis de [`auth.guard.ts`](../../../src/app/core/guards/auth.guard.ts)
- Integración en [`app.routes.ts`](../../../src/app/app.routes.ts)
- Tests en [`auth.guard.spec.ts`](../../../src/app/core/guards/auth.guard.spec.ts)

## 📁 Estructura de Archivos

```
dia-09-guards-integracion/
├── README.md                    # Este archivo
├── contenido.md                 # Contenido detallado
├── slides/
│   └── dia-09-guards-integracion_Marp.md          # Diapositivas
├── ejercicios/
│   ├── lab-01.md               # Lab: Implementar authGuard
│   └── lab-02.md               # Lab: Tests del Guard
├── assessment/
│   └── preguntas.md            # Preguntas de evaluación
└── recursos/
    ├── bibliografia.md          # Recursos adicionales
    ├── cheatsheet.md            # Resumen rápido
    ├── script-audio.md          # Guion para podcast
    └── script-video-youtube.md  # Guion para video
```

## 🔗 Archivos del Proyecto Relacionados

| Archivo | Propósito |
|---------|-----------|
| [`auth.guard.ts`](../../../src/app/core/guards/auth.guard.ts) | Guard funcional de autenticación |
| [`auth.guard.spec.ts`](../../../src/app/core/guards/auth.guard.spec.ts) | Tests del guard |
| [`app.routes.ts`](../../../src/app/app.routes.ts) | Configuración de rutas con guards |
| [`auth.service.ts`](../../../src/app/core/auth/auth.service.ts) | Servicio de autenticación |

## 🚀 Cómo Empezar

1. Lee el [`contenido.md`](./contenido.md) para la teoría completa
2. Revisa las [`slides/dia-09-guards-integracion_Marp.md`](./slides/dia-09-guards-integracion_Marp.md)
3. Completa los ejercicios en orden:
   - [`lab-01.md`](./ejercicios/lab-01.md) - Implementar authGuard
   - [`lab-02.md`](./ejercicios/lab-02.md) - Tests del Guard
4. Evalúa tu conocimiento con [`assessment/preguntas.md`](./assessment/preguntas.md)

## 📊 Flujo de Autenticación Completo

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUJO DE AUTENTICACIÓN                       │
└─────────────────────────────────────────────────────────────────┘

Usuario accede a ruta protegida
            │
            ▼
    ┌───────────────┐
    │  authGuard    │
    │  CanActivate  │
    └───────┬───────┘
            │
            ▼
    ┌───────────────────┐
    │ ¿Está autenticado?│
    └───────┬───────────┘
            │
       ┌────┴────┐
       │         │
      Sí        No
       │         │
       ▼         ▼
  Permitir    Redirigir
  acceso      /signin
       │         │
       ▼         ▼
  Cargar      Mostrar
  componente  login
```

## 💡 Conceptos Clave

### Guard Funcional (Angular 14+)

```typescript
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  
  router.navigate(['/signin']);
  return false;
};
```

### Integración en Rutas

```typescript
export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard], // ← Guard aplicado
    children: [
      { path: '', loadChildren: () => import('./dashboard.routes') }
    ]
  }
];
```

## ⏱️ Cronograma Sugerido

| Tiempo | Actividad |
|--------|-----------|
| 0:00 - 0:45 | Teoría: Guards en Angular |
| 0:45 - 1:30 | Demo: Implementación de authGuard |
| 1:30 - 2:15 | Lab 01: Implementar Guard |
| 2:15 - 2:30 | Descanso |
| 2:30 - 3:15 | Lab 02: Tests del Guard |
| 3:15 - 4:00 | Integración completa y Q&A |

## ✅ Criterios de Éxito

Al finalizar el día, deberías poder:

- [ ] Explicar qué son los Guards y para qué sirven
- [ ] Implementar un Guard funcional usando `CanActivateFn`
- [ ] Usar `inject()` para obtener servicios en Guards
- [ ] Configurar Guards en las rutas
- [ ] Escribir tests unitarios para Guards
- [ ] Entender el flujo completo de autenticación

## 🔗 Siguiente Día

**Día 10:** RxJS Fundamentos - Introducción a la programación reactiva

---

*Curso de Angular 21 - UyuniAdmin Frontend*
*Versión: 1.0.0*
