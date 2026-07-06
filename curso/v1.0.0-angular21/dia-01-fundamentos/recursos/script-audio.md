# Guion de Audio (Podcast) - Día 1: Fundamentos

## Metadatos

| Aspecto | Detalle |
|---------|---------|
| **Duración** | 15-20 minutos |
| **Formato** | Podcast técnico |
| **Audiencia** | Desarrolladores con menos de 1 año en Angular |
| **Tono** | Conversacional, educativo, amigable |

---

## Guion Completo

### [00:00 - 01:00] Intro

**Música**: Intro suave, fade in

**Narrador**:
"¡Hola! Bienvenidos al primer episodio del curso de Angular 21 Enterprise. Soy tu instructor y hoy vamos a comenzar con algo fundamental: la configuración correcta de un proyecto Angular profesional.

Este curso está basado en un proyecto real llamado UyuniAdmin, un dashboard enterprise que usa las mejores prácticas de la industria. Al final del curso, serás capaz de construir aplicaciones como esta.

Hoy, en el Día 1, vamos a resolver un problema que afecta al 80% de los proyectos Angular: el famoso 'infierno de imports'."

---

### [01:00 - 02:30] Hook: El Problema

**Narrador**:
"¿Alguna vez has visto código como este?

[PAUSA]

import AuthService from punto, punto, punto, punto, punto, punto, core, auth, auth.service.

¿Les suena familiar? Ese es el 'infierno de imports'. Cuando tienes que subir 5, 6, 7 niveles de carpetas solo para importar un servicio.

El problema no es solo que se ve feo. Es que cuando mueves un archivo, TODOS los imports se rompen. Y si trabajas en equipo, cada desarrollador tiene que adivinar cuántos puntos necesita.

Hoy vamos a resolver esto para siempre. Al final de este episodio, tus imports se verán limpios y profesionales."

---

### [02:30 - 05:00] Contexto: Por Qué Importa

**Narrador**:
"Antes de entrar en código, entendamos POR QUÉ esto es importante.

En el desarrollo enterprise, trabajamos en equipos grandes. Un proyecto profesional puede tener 50, 100, incluso 200 componentes. Sin una estructura clara, el código se vuelve inmantenible.

Las empresas como Google, Microsoft y Amazon usan arquitecturas similares a la que aprenderemos hoy. Este conocimiento te diferencia de un desarrollador junior a uno que puede trabajar en proyectos enterprise.

Además, hay un dato interesante: el 70% de los proyectos Angular tienen problemas de estructura. Y el 45% del tiempo de desarrollo se pierde en refactorizaciones que podrían evitarse con una buena arquitectura desde el inicio."

---

### [05:00 - 08:00] Concepto 1: Standalone Components

**Narrador**:
"Empecemos con el primer concepto: Standalone Components.

En Angular 21, los componentes son standalone por defecto. ¿Qué significa esto?

Antes, necesitábamos NgModules. Era como si cada componente tuviera que ser miembro de un club para poder funcionar. Ahora, los componentes son autónomos, pueden funcionar por sí solos.

Imagina la diferencia: antes, para crear un componente de botón, tenías que crear el componente, luego declararlo en un módulo, luego importar ese módulo donde lo querías usar. Ahora, simplemente importas el componente directamente.

Esto tiene varias ventajas: mejor tree-shaking, que significa que el código no usado no se incluye en tu bundle. También hace el lazy loading más fácil, porque no necesitas cargar módulos enteros."

---

### [08:00 - 11:00] Concepto 2: Path Aliases

**Narrador**:
"Ahora hablemos de Path Aliases, el corazón de la solución.

Un Path Alias es como un contacto guardado en tu celular. En lugar de memorizar el número de teléfono completo, guardas 'Juan Pérez'. Cuando quieres llamar a Juan, solo buscas su nombre.

En código, en lugar de escribir:

[PAUSA]

import AuthService from 6 niveles de puntos... core, auth, auth.service

Escribes simplemente:

[PAUSA]

import AuthService from @core/auth/auth.service

El @core es el alias. Es un nombre corto que representa la ruta completa.

La configuración se hace en el archivo tsconfig.json, en la sección de paths. Ahí defines qué significa cada alias. Por ejemplo, @core apunta a src/app/core, @shared a src/app/shared, y así."

---

### [11:00 - 13:00] Concepto 3: TypeScript Strict Mode

**Narrador**:
"El tercer concepto importante es TypeScript Strict Mode.

Imagina que tienes un inspector de construcción muy exigente. No deja pasar nada que no esté perfectamente construido. Al principio parece molesto, pero al final tienes un edificio sólido.

Eso es Strict Mode. Es una configuración de TypeScript que habilita todas las verificaciones estrictas.

Por ejemplo, si tienes una variable que puede ser null, TypeScript te obliga a manejar ese caso. No puedes simplemente ignorarlo.

Esto parece más trabajo al principio, pero te ahorra horas de debugging. Porque los errores los encuentras en tiempo de compilación, no cuando el usuario ya está usando la aplicación."

---

### [13:00 - 15:00] Concepto 4: Estructura Enterprise

**Narrador**:
"Finalmente, hablemos de la estructura de carpetas.

En proyectos enterprise, usamos una arquitectura de 3 capas: Core, Shared y Features.

Core es donde viven los servicios globales, como autenticación, configuración, logging. Estos servicios son singletons, significa que solo hay una instancia en toda la aplicación.

Shared es para componentes reutilizables. Botones, inputs, modales. Todo lo que se usa en múltiples lugares.

Y Features es donde está la lógica de negocio. Cada feature es un módulo: auth, dashboard, profile, etc.

La regla importante es que Core NO puede importar de Features o Shared. Core es la capa base, no debe depender de las capas superiores."

---

### [15:00 - 17:00] Demo Mental

**Narrador**:
"Hagamos un ejercicio mental.

Imagina que estás creando un nuevo servicio llamado LoggerService. ¿Dónde lo pondrías?

[PAUSA DE 3 SEGUNDOS]

Correcto, en Core, porque es un servicio global.

Ahora, ¿cómo lo importarías en otro archivo?

[PAUSA DE 3 SEGUNDOS]

Usando el alias: import LoggerService from @core/logger/logger.service.

Y si TypeScript te dice 'Object is possibly null', ¿qué harías?

[PAUSA DE 3 SEGUNDOS]

Usarías optional chaining: user?.name, o nullish coalescing: user?.name ?? 'Unknown'."

---

### [17:00 - 18:30] Resumen

**Narrador**:
"Resumamos lo que aprendimos hoy:

Primero, Angular 21 usa Standalone Components por defecto, eliminando la necesidad de NgModules.

Segundo, los Path Aliases permiten imports limpios como @core/auth en lugar de rutas largas con puntos.

Tercero, TypeScript Strict Mode detecta errores en tiempo de compilación, ahorrándote horas de debugging.

Y cuarto, la estructura Enterprise separa el código en Core, Shared y Features, manteniendo todo organizado."

---

### [18:30 - 20:00] Cierre

**Narrador**:
"En el próximo episodio, profundizaremos en la arquitectura DDD Lite. Aprenderemos sobre Smart Components vs Dumb Components, y cómo usar ChangeDetectionStrategy.OnPush para optimizar el rendimiento.

Si este episodio te ayudó, compártelo con otros desarrolladores. Y si tienes preguntas, déjalas en los comentarios.

Recuerda que todo el código y materiales están disponibles en el repositorio del curso.

¡Nos vemos en el próximo episodio del curso de Angular 21 Enterprise!"

**Música**: Outro, fade out

---

## Notas de Producción

### Pacing
- Hablar a velocidad moderada
- Hacer pausas donde se indica [PAUSA]
- Enfatizar palabras clave (alias, strict mode, standalone)

### Tono
- Amigable y conversacional
- Evitar jerga técnica excesiva
- Usar analogías para conceptos complejos

### Música
- Intro: 10 segundos, fade in
- Outro: 15 segundos, fade out
- Estilo: Tech/Corporate, tempo moderado

---

*Curso: Angular 21 Enterprise*
*Día: 1 de 18*
*Formato: Podcast*
