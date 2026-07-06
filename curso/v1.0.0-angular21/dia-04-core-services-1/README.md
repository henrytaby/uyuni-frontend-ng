# Día 4: Core Services - LoggerService y LoadingService

## Información General

| Aspecto | Detalle |
|---------|---------|
| **Módulo** | 2 - Core Services |
| **Duración** | 3 horas |
| **Prerrequisitos** | Días 1-3 completados |
| **Archivos de referencia** | `src/app/core/services/logger.service.ts`, `loading.service.ts` |

## Objetivos de Aprendizaje

Al finalizar este día, el estudiante será capaz de:

1. **Crear servicios singleton** con `providedIn: 'root'`
2. **Implementar LoggerService** con niveles de log configurables
3. **Implementar LoadingService** con contador de peticiones
4. **Usar Signals** para estado reactivo en servicios
5. **Inyectar servicios** con la función `inject()`
6. **Escribir tests unitarios** para servicios

## Estructura de Clase

### 1. Hook (15 min)
- Demo: Aplicación con console.log vs LoggerService
- Problema: Dificultad para debuggear en producción

### 2. Contexto (20 min)
- Por qué necesitamos servicios core
- Patrón Singleton en Angular
- Inyección de dependencias moderna

### 3. Explicación (60 min)
- LoggerService: niveles, formato, producción
- LoadingService: contador, Signals, navegación
- Testing de servicios

### 4. Demo/Código (45 min)
- Implementar LoggerService paso a paso
- Implementar LoadingService paso a paso
- Tests unitarios

### 5. Error Común (15 min)
- Servicios sin providedIn
- Dependencias circulares
- Signals mal usadas

### 6. Mini Reto (20 min)
- Crear NotificationService con Signals
- Implementar contador de notificaciones

### 7. Cierre (10 min)
- Resumen de conceptos
- Preview del Día 5

## Materiales

| Archivo | Descripción |
|---------|-------------|
| [`contenido.md`](./contenido.md) | Contenido teórico completo |
| [`slides/dia-04-core-services-1_Marp.md`](./slides/dia-04-core-services-1_Marp.md) | Presentación Marp |
| [`ejercicios/lab-01.md`](./ejercicios/lab-01.md) | Lab: LoggerService |
| [`ejercicios/lab-02.md`](./ejercicios/lab-02.md) | Lab: LoadingService |
| [`assessment/preguntas.md`](./assessment/preguntas.md) | 50 preguntas de opción múltiple |
| [`recursos/bibliografia.md`](./recursos/bibliografia.md) | Referencias y recursos |
| [`recursos/cheatsheet.md`](./recursos/cheatsheet.md) | Guía rápida |
| [`recursos/script-audio.md`](./recursos/script-audio.md) | Guion de podcast |
| [`recursos/script-video-youtube.md`](./recursos/script-video-youtube.md) | Guion de video YouTube |

## Conceptos Clave

```
┌─────────────────────────────────────────────────────────────┐
│                    CORE SERVICES                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  LoggerService          LoadingService                       │
│  ┌──────────────┐      ┌──────────────┐                     │
│  │ debug()      │      │ show()       │                     │
│  │ info()       │      │ hide()       │                     │
│  │ warn()       │      │ forceHide()  │                     │
│  │ error()      │      │              │                     │
│  │              │      │ Signals:     │                     │
│  │ Niveles:     │      │ isLoading    │                     │
│  │ - debug      │      │ loadingCount │                     │
│  │ - info       │      └──────────────┘                     │
│  │ - warn       │                                           │
│  │ - error      │      Características:                     │
│  └──────────────┘      - Contador de peticiones             │
│                        - Reset en navegación                │
│  Características:      - Signal reactivo                    │
│  - Timestamp           - Thread-safe                        │
│  - Contexto app                                            │
│  - Filtrado nivel                                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Código de Referencia

### LoggerService

```typescript
@Injectable({ providedIn: 'root' })
export class LoggerService {
  private level: LogLevel = 'debug';

  debug(message: string, ...args: unknown[]): void {
    this.log('debug', message, args);
  }

  info(message: string, ...args: unknown[]): void {
    this.log('info', message, args);
  }

  warn(message: string, ...args: unknown[]): void {
    this.log('warn', message, args);
  }

  error(message: string, ...args: unknown[]): void {
    this.log('error', message, args);
  }

  private log(level: LogLevel, message: string, args: unknown[]): void {
    if (this.shouldLog(level)) {
      const timestamp = new Date().toISOString();
      console[level](`[${timestamp}] [${level.toUpperCase()}]`, message, ...args);
    }
  }
}
```

### LoadingService

```typescript
@Injectable({ providedIn: 'root' })
export class LoadingService {
  private count = signal(0);
  
  isLoading = computed(() => this.count() > 0);
  loadingCount = this.count.asReadonly();

  show(): void {
    this.count.update(c => c + 1);
  }

  hide(): void {
    this.count.update(c => Math.max(0, c - 1));
  }

  forceHide(): void {
    this.count.set(0);
  }
}
```

## Ejercicios del Día

### Lab 01: LoggerService
- Crear LoggerService con niveles configurables
- Agregar formato de timestamp
- Implementar filtrado por nivel
- Escribir tests unitarios

### Lab 02: LoadingService
- Crear LoadingService con contador
- Implementar Signals para estado
- Integrar con interceptor HTTP
- Escribir tests unitarios

## Evaluación

- 50 preguntas de opción múltiple
- Cobertura: LoggerService (25), LoadingService (25)
- Tiempo estimado: 30 minutos

## Próximo Día

**Día 5**: ConfigService y TokenRefreshService
- Carga de configuración desde JSON
- Manejo de tokens JWT
- Refresh token automático

---

*Curso: Angular 21 Enterprise*
*Día: 4 de 18*
