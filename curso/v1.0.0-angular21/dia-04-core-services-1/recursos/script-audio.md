# Guion de Audio (Podcast) - Día 4: Core Services

## Metadatos

| Aspecto | Detalle |
|---------|---------|
| **Duración** | 18-20 minutos |
| **Formato** | Podcast técnico |
| **Audiencia** | Desarrolladores con menos de 1 año en Angular |
| **Tono** | Conversacional, educativo, amigable |

---

## Guion Completo

### [00:00 - 01:30] Intro

**Música**: Intro suave, fade in

**Narrador**:
"¡Hola! Bienvenidos al cuarto episodio del curso de Angular 21 Enterprise. Hoy vamos a hablar de algo que parece simple pero es fundamental: los Core Services.

En los episodios anteriores configuramos el proyecto, aprendimos arquitectura y configuramos lazy loading. Hoy vamos a crear los servicios que dan vida a toda la aplicación.

Vamos a construir LoggerService y LoadingService desde cero. Dos servicios que usarás en TODOS tus proyectos."

---

### [01:30 - 03:30] Hook: El Problema

**Narrador**:
"Imagina que estás debuggeando un problema en producción. Abres la consola del navegador y ves... nada. O peor, ves información sensible expuesta.

[PAUSA]

¿Por qué? Porque usaste console.log en todo el código. En desarrollo parece útil, pero en producción es un problema de seguridad.

Otro escenario: tu aplicación hace múltiples peticiones HTTP. El spinner aparece y desaparece constantemente, creando un efecto de 'flash' que confunde al usuario.

[PAUSA]

Estos problemas se resuelven con Core Services bien diseñados. LoggerService para logging controlado, y LoadingService para estado de carga centralizado."

---

### [03:30 - 06:00] Contexto: Por Qué Importa

**Narrador**:
"Entendamos POR QUÉ los Core Services son tan importantes.

Primero, son singletons. Una sola instancia para toda la aplicación. Esto significa que el estado es consistente en todas partes.

Segundo, son transversales. Se usan en toda la aplicación, desde componentes hasta interceptors.

Tercero, siguen el principio de responsabilidad única. LoggerService solo hace logging. LoadingService solo maneja estado de carga.

[PAUSA]

En Angular moderno, usamos providedIn root para crear singletons. Y usamos la función inject para inyección de dependencias. Es más limpio que el constructor tradicional."

---

### [06:00 - 09:00] Concepto 1: LoggerService

**Narrador**:
"Empecemos con LoggerService. El concepto es simple: reemplazar console.log con un servicio controlado.

LoggerService tiene niveles: debug, info, warn, y error. Cada nivel tiene un valor numérico. En desarrollo, mostramos todo desde debug. En producción, solo info y superiores.

La implementación usa un método privado 'log' que verifica si el nivel está habilitado. Si está habilitado, formatea el mensaje con timestamp y contexto, y lo envía a console.

[PAUSA]

El resultado: logs consistentes, filtrables, y seguros. En producción, los logs debug simplemente no aparecen. No hay información sensible expuesta."

---

### [09:00 - 12:00] Concepto 2: LoadingService

**Narrador**:
"Ahora hablemos de LoadingService. Este servicio resuelve el problema del estado de carga.

La idea clave es un contador de peticiones. Cada vez que una petición HTTP inicia, incrementamos el contador. Cuando termina, lo decrementamos.

Usamos Angular Signals para el estado. Un signal writable para el contador, y un signal computed para isLoading. Computed significa que se recalcula automáticamente cuando el contador cambia.

[PAUSA]

La magia está en que múltiples peticiones pueden estar activas simultáneamente. El spinner permanece visible mientras haya al menos una petición activa. Solo cuando el contador llega a cero, se oculta."

---

### [12:00 - 15:00] Concepto 3: HTTP Interceptor

**Narrador**:
"LoadingService por sí solo no hace nada. Necesita integrarse con HTTP. Aquí es donde entra el interceptor.

Un interceptor funcional es una función que recibe la request y un handler. Antes de pasar la request al handler, llamamos a loadingService.show. Después, usamos el operador finalize para llamar a hide.

Finalize se ejecuta tanto en éxito como en error. Esto garantiza que el contador siempre se decrementa.

[PAUSA]

El resultado: cada petición HTTP automáticamente muestra y oculta el loading. Sin código repetitivo en componentes."

---

### [15:00 - 17:00] Concepto 4: Testing

**Narrador**:
"Finalmente, hablemos de testing. Los servicios son fáciles de testear porque no tienen dependencias de UI.

Para LoggerService, espiamos los métodos de console y verificamos que se llaman con los parámetros correctos. También verificamos que el filtrado por nivel funciona.

Para LoadingService, verificamos que show incrementa el contador, hide lo decrementa, y que isLoading refleja el estado correctamente.

[PAUSA]

La clave es usar beforeEach para crear el servicio y afterEach para limpiar los mocks. Jest hace esto muy sencillo."

---

### [17:00 - 18:30] Resumen

**Narrador**:
"Resumamos lo que aprendimos hoy:

Primero, los Core Services son singletons transversales que siguen el principio de responsabilidad única.

Segundo, LoggerService proporciona logging controlado con niveles, formato consistente, y filtrado por entorno.

Tercero, LoadingService maneja el estado de carga con un contador de peticiones y Signals reactivas.

Y cuarto, los interceptors integran LoadingService con HTTP automáticamente."

---

### [18:30 - 20:00] Cierre

**Narrador**:
"En el próximo episodio, Día 5, aprenderemos sobre ConfigService y TokenRefreshService. Veremos cómo cargar configuración desde JSON y cómo manejar tokens JWT.

Si este episodio te ayudó, compártelo con otros desarrolladores. Y si tienes preguntas, déjalas en los comentarios.

Los ejercicios de hoy incluyen implementar LoggerService con niveles y LoadingService con interceptor. La práctica es la mejor forma de dominar estos conceptos.

¡Nos vemos en el próximo episodio del curso de Angular 21 Enterprise!"

**Música**: Outro, fade out

---

## Notas de Producción

### Pacing
- Hablar a velocidad moderada
- Hacer pausas donde se indica [PAUSA]
- Enfatizar términos clave (Singleton, Signals, Interceptor)

### Tono
- Amigable y conversacional
- Usar analogías de la vida real
- Evitar jerga técnica excesiva

### Música
- Intro: 10 segundos, fade in
- Outro: 15 segundos, fade out
- Estilo: Tech/Corporate, tempo moderado

---

*Curso: Angular 21 Enterprise*
*Día: 4 de 18*
*Formato: Podcast*
