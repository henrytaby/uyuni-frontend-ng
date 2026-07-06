# Guion de Video YouTube - Día 4: Core Services en Angular 21

## Metadatos del Video

| Aspecto | Detalle |
|---------|---------|
| **Título** | LoggerService y LoadingService en Angular 21 - Curso Enterprise Día 4 |
| **Duración** | 25-30 minutos |
| **Formato** | Tutorial con demo en vivo |
| **Thumbnail** | Split: código vs consola formateada |

---

## Estructura del Video

### [00:00 - 01:00] Intro

**Visual**: Logo del curso animado → Host en cámara

**Audio**:
"¡Hola! Bienvenidos al Día 4 del curso de Angular 21 Enterprise. Hoy vamos a crear los servicios más importantes de cualquier aplicación: LoggerService y LoadingService.

Al final de este video, tendrás logging profesional con niveles y un sistema de loading centralizado que funciona automáticamente con HTTP.

¡Vamos!"

**Visual**: Título animado: "Día 4: Core Services"

---

### [01:00 - 03:00] Hook: El Problema

**Visual**: Screen recording - Consola del navegador

**Audio**:
"Miren esto. Esta es una aplicación típica con console.log por todos lados.

[PAUSA]

En desarrollo parece útil. Pero en producción... información sensible expuesta, logs de debug que no deberían verse, y ningún control sobre qué se muestra.

Ahora miren esto: una aplicación con LoggerService.

[PAUSA]

Timestamps, niveles de severidad, y en producción solo se muestran los logs importantes. Mucho mejor."

**Visual**: Split screen - Antes vs Después

---

### [03:00 - 05:00] Contexto

**Visual**: Host en cámara + diagrama

**Audio**:
"Los Core Services son la base de la aplicación. Son singletons, lo que significa una sola instancia para toda la app.

En Angular moderno, usamos providedIn root para crear singletons. Y usamos la función inject para inyección de dependencias.

[PAUSA]

Hoy vamos a crear dos servicios: LoggerService para logging controlado, y LoadingService para estado de carga centralizado."

**Visual**: Diagrama de arquitectura

---

### [05:00 - 10:00] Concepto 1: LoggerService

**Visual**: Screen recording - VS Code

**Audio**:
"Empecemos con LoggerService. Primero, generamos el servicio:

```bash
ng g service core/services/logger
```

Ahora implementamos los niveles de log:

```typescript
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  private level: LogLevel = 'debug';
  
  private readonly levels = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  };
}
```

[PAUSA]

La jerarquía es importante: debug es el nivel más bajo, error el más alto. Cuando configuramos el nivel en 'info', los debug logs no se muestran."

**Visual**: Código en VS Code con highlights

---

### [06:00 - 10:00] LoggerService: Métodos

**Visual**: Screen recording - VS Code

**Audio**:
"Ahora implementamos los métodos públicos:

```typescript
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
```

Y el método privado que hace el trabajo:

```typescript
private log(level: LogLevel, message: string, args: unknown[]): void {
  if (!this.shouldLog(level)) return;
  
  const timestamp = new Date().toISOString();
  const formatted = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  
  console[level](formatted, ...args);
}
```"

**Visual**: Demo en vivo - Consola formateada

---

### [10:00 - 15:00] Concepto 2: LoadingService

**Visual**: Screen recording - VS Code

**Audio**:
"Ahora vamos con LoadingService. Este servicio usa Angular Signals para manejar el estado.

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

[PAUSA]

La clave es el contador. Cada show incrementa, cada hide decrementa. isLoading es un signal computed que retorna true si count es mayor que 0."

**Visual**: Diagrama del contador

---

### [15:00 - 20:00] Concepto 3: HTTP Interceptor

**Visual**: Screen recording - VS Code

**Audio**:
"LoadingService por sí solo no hace nada. Necesitamos integrarlo con HTTP. Creamos un interceptor:

```bash
ng g interceptor core/interceptors/loading --functional
```

```typescript
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  
  loadingService.show();
  
  return next(req).pipe(
    finalize(() => loadingService.hide())
  );
};
```

[PAUSA]

El operador finalize se ejecuta tanto en éxito como en error. Esto garantiza que siempre se llame a hide."

**Visual**: Demo en vivo - Network tab

---

### [20:00 - 23:00] Error Común

**Visual**: Screen recording - Terminal con error

**Audio**:
"Ahora, el error más común que verán.

[PAUSA]

Este error: 'No provider for LoggerService' aparece cuando olvidan el providedIn.

```typescript
// ❌ Mal
@Injectable()
export class LoggerService {}

// ✅ Bien
@Injectable({ providedIn: 'root' })
export class LoggerService {}
```

Otro error común: dependencias circulares. Si ServiceA depende de ServiceB y ServiceB depende de ServiceA, Angular no puede resolverlo."

**Visual**: Código corregido en VS Code

---

### [23:00 - 25:00] Mini Reto

**Visual**: Host en cámara

**Audio**:
"Ahora un mini reto para ustedes.

Tienen 5 minutos para:

1. Crear un NotificationService con Signals
2. Implementar un contador de notificaciones
3. Agregar métodos show() y dismiss()

Pausen el video y intenten. Luego volveré con la solución."

**Visual**: Contador de 5 minutos en pantalla

---

### [25:00 - 27:00] Solución del Reto

**Visual**: Screen recording - VS Code

**Audio**:
"¿Listos? Aquí está la solución.

```typescript
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private count = signal(0);
  
  notificationCount = this.count.asReadonly();
  hasNotifications = computed(() => this.count() > 0);

  show(): void {
    this.count.update(c => c + 1);
  }

  dismiss(): void {
    this.count.update(c => Math.max(0, c - 1));
  }

  clear(): void {
    this.count.set(0);
  }
}
```

Muy similar a LoadingService, ¿verdad? El patrón es el mismo: signal writable, computed, y métodos para modificar."

---

### [27:00 - 30:00] Cierre

**Visual**: Host en cámara + resumen visual

**Audio**:
"¡Excelente! Hoy aprendieron:

1. LoggerService con niveles de log y filtrado
2. LoadingService con contador y Signals
3. HTTP Interceptor para integración automática
4. Testing de servicios con Jest

En el próximo video, Día 5, veremos ConfigService y TokenRefreshService. Aprenderemos a cargar configuración y manejar tokens JWT.

Si este video les ayudó, denle like y suscríbanse. Los ejercicios completos están en la descripción.

¡Nos vemos en el próximo video!"

**Visual**: Outro con links a ejercicios y siguiente video

---

## Notas de Producción

### Visual
- Usar screen recording de alta calidad (1080p mínimo)
- Zoom a código importante (150%)
- Highlight de líneas clave
- Transiciones suaves entre secciones

### Audio
- Micrófono de buena calidad
- Reducir ruido de fondo
- Normalizar volumen
- Música sutil de fondo (opcional)

### Edición
- Cortar pausas largas
- Agregar callouts para términos clave
- Usar picture-in-picture para demos
- Incluir código en descripción

### SEO
- Tags: Angular 21, Core Services, LoggerService, LoadingService, Signals
- Descripción con timestamps
- Cards con videos relacionados

---

## Recursos Adicionales

### En Descripción
- [ ] Código fuente del episodio
- [ ] Ejercicios prácticos
- [ ] Cheatsheet PDF
- [ ] Link al siguiente video

### Cards
- [ ] Día 1: Fundamentos
- [ ] Día 2: Arquitectura DDD
- [ ] Día 3: Lazy Loading
- [ ] Playlist del curso

---

*Curso: Angular 21 Enterprise*
*Día: 4 de 18*
*Formato: Video YouTube*
