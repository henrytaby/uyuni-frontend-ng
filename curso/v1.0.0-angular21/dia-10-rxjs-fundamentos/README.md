# Día 10: RxJS Fundamentos - Programación Reactiva

## 📋 Información General

- **Duración:** 4 horas
- **Módulo:** 4 - RxJS y Estado Avanzado
- **Prerrequisitos:** Días 1-9 completados
- **Nivel:** Intermedio

## 🎯 Objetivos de Aprendizaje

Al finalizar este día, el estudiante será capaz de:

1. **Comprender el paradigma de programación reactiva**
2. **Crear y usar Observables** en Angular
3. **Implementar Observers** para manejar datos
4. **Usar Subjects** para comunicación entre componentes
5. **Aplicar operadores básicos** de RxJS
6. **Manejar suscripciones** correctamente

## 📚 Contenido del Día

### Teoría
- ¿Qué es la programación reactiva?
- Observables vs Promises
- Observer pattern
- Subjects: BehaviorSubject, ReplaySubject, Subject
- Operadores básicos: map, filter, tap

### Práctica
- Crear Observables manuales
- Usar HttpClient con Observables
- Implementar Subjects para estado compartido
- Manejar suscripciones con takeUntil

### Proyecto Real
- Análisis de uso de RxJS en el proyecto
- Observables en AuthService
- Subjects en LoadingService
- Operadores en interceptors

## 📁 Estructura de Archivos

```
dia-10-rxjs-fundamentos/
├── README.md                    # Este archivo
├── contenido.md                 # Contenido detallado
├── slides/
│   └── dia-10-rxjs-fundamentos_Marp.md          # Diapositivas
├── ejercicios/
│   ├── lab-01.md               # Lab: Observables y Observers
│   └── lab-02.md               # Lab: Subjects y Operadores
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
| [`auth.service.ts`](../../../src/app/core/auth/auth.service.ts) | Uso de Observables con HttpClient |
| [`loading.service.ts`](../../../src/app/core/services/loading.service.ts) | Uso de Signals (alternativa moderna) |
| [`auth.interceptor.ts`](../../../src/app/core/interceptors/auth.interceptor.ts) | Operadores RxJS |
| [`token-refresh.service.ts`](../../../src/app/core/services/token-refresh.service.ts) | Subjects y Observables |

## 🚀 Cómo Empezar

1. Lee el [`contenido.md`](./contenido.md) para la teoría completa
2. Revisa las [`slides/dia-10-rxjs-fundamentos_Marp.md`](./slides/dia-10-rxjs-fundamentos_Marp.md)
3. Completa los ejercicios en orden:
   - [`lab-01.md`](./ejercicios/lab-01.md) - Observables y Observers
   - [`lab-02.md`](./ejercicios/lab-02.md) - Subjects y Operadores
4. Evalúa tu conocimiento con [`assessment/preguntas.md`](./assessment/preguntas.md)

## 📊 Conceptos Clave

### Observable

```typescript
// Crear un Observable básico
const observable = new Observable<string>(subscriber => {
  subscriber.next('Hola');
  subscriber.next('Mundo');
  subscriber.complete();
});

// Suscribirse
observable.subscribe({
  next: value => console.log(value),
  complete: () => console.log('Completado')
});
```

### Observer

```typescript
// Observer completo
const observer = {
  next: (value: T) => console.log('Valor:', value),
  error: (err: Error) => console.error('Error:', err),
  complete: () => console.log('Completado')
};
```

### Subject

```typescript
// BehaviorSubject - tiene valor inicial
const subject = new BehaviorSubject<string>('valor inicial');

// ReplaySubject - replay de valores
const replay = new ReplaySubject<string>(3); // últimos 3 valores

// Subject - sin valor inicial
const plain = new Subject<string>();
```

### Operadores Básicos

```typescript
import { map, filter, tap } from 'rxjs/operators';

observable.pipe(
  filter(value => value.length > 3),  // Filtrar
  map(value => value.toUpperCase()),   // Transformar
  tap(value => console.log('Debug:', value)) // Side effect
);
```

## ⏱️ Cronograma Sugerido

| Tiempo | Actividad |
|--------|-----------|
| 0:00 - 0:45 | Teoría: Programación Reactiva |
| 0:45 - 1:30 | Demo: Observables y Observers |
| 1:30 - 2:15 | Lab 01: Crear Observables |
| 2:15 - 2:30 | Descanso |
| 2:30 - 3:15 | Teoría: Subjects y Operadores |
| 3:15 - 4:00 | Lab 02: Subjects en Angular |

## ✅ Criterios de Éxito

Al finalizar el día, deberías poder:

- [ ] Explicar qué es un Observable y cómo difiere de una Promise
- [ ] Crear Observables manuales
- [ ] Implementar Observers con next, error, complete
- [ ] Usar Subjects para comunicación entre componentes
- [ ] Aplicar operadores básicos: map, filter, tap
- [ ] Manejar suscripciones correctamente

## 🔗 Siguiente Día

**Día 11:** RxJS Operadores - Operadores de creación, transformación y filtrado

---

*Curso de Angular 21 - UyuniAdmin Frontend*
*Versión: 1.0.0*
