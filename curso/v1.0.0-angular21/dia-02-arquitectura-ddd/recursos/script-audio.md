# Guion de Audio (Podcast) - Día 2: Arquitectura DDD Lite

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
"¡Hola! Bienvenidos al segundo episodio del curso de Angular 21 Enterprise. Soy tu instructor y hoy vamos a profundizar en la arquitectura del proyecto.

En el episodio anterior configuramos el proyecto con Path Aliases. Hoy vamos a entender CÓMO organizar el código de manera profesional.

Vamos a hablar de DDD Lite, Smart Components, Dumb Components, y algo que puede parecer técnico pero es crucial: ChangeDetectionStrategy.OnPush.

Al final de este episodio, entenderás cómo el proyecto UyuniAdmin está organizado y por qué esa organización importa."

---

### [01:30 - 03:30] Hook: El Problema

**Narrador**:
"Imagina que acabas de unirte a un equipo de desarrollo. Te asignan una tarea simple: agregar un botón de 'eliminar' en una tarjeta de usuario.

Abres el proyecto y ves 50 carpetas. ¿Dónde pones el código? ¿En qué archivo va la lógica? ¿Y si el botón necesita llamar a una API?

[PAUSA]

Si no hay una arquitectura clara, cada desarrollador hace lo que quiere. Unos ponen la lógica en el componente, otros en un servicio, otros en un archivo separado.

El resultado: código desordenado, difícil de mantener, y propenso a bugs.

Hoy vamos a resolver esto con una arquitectura probada: DDD Lite."

---

### [03:30 - 06:00] Contexto: Por Qué Importa

**Narrador**:
"Antes de entrar en detalles, entendamos POR QUÉ la arquitectura importa.

En proyectos enterprise, el código se mantiene durante años. Un desarrollador escribe código hoy, y otro lo modifica dentro de 6 meses. Si no hay estructura, cada cambio es una pesadilla.

La arquitectura DDD Lite, que significa Domain-Driven Design Lite, nos da reglas claras:

Primero, separar el código por dominio de negocio. No por tipo técnico, sino por lo que hace para el negocio.

Segundo, distinguir entre componentes que piensan y componentes que muestran. Smart y Dumb.

Tercero, optimizar el rendimiento con OnPush.

Estas reglas no son arbitrarias. Vienen de años de experiencia en proyectos grandes."

---

### [06:00 - 09:00] Concepto 1: DDD Lite

**Narrador**:
"Empecemos con DDD Lite. El DDD completo fue propuesto por Eric Evans en 2003. Es una metodología para proyectos muy complejos.

Pero para aplicaciones web típicas, el DDD completo es excesivo. Por eso existe DDD Lite, que es una versión simplificada.

La idea principal es organizar el código en 'contextos delimitados'. En Angular, esto se traduce en Features.

Por ejemplo, en el proyecto UyuniAdmin tenemos features como auth, dashboard, profile, calendar. Cada feature es un contexto separado.

Dentro de cada feature, hay una estructura consistente: pages para componentes inteligentes, components para componentes de presentación, services para lógica, y models para datos.

Esta estructura tiene una regla importante: las features no se importan entre sí. Si necesitas algo de otra feature, probablemente debería estar en core o shared."

---

### [09:00 - 12:00] Concepto 2: Smart vs Dumb

**Narrador**:
"Ahora hablemos de Smart y Dumb Components. Esta es quizás la distinción más importante del día.

Imagina una empresa. Hay gerentes y hay trabajadores. Los gerentes toman decisiones, coordinan equipos, se comunican con otros departamentos. Los trabajadores ejecutan tareas específicas, son especialistas en lo que hacen.

En Angular, los Smart Components son los gerentes. Tienen lógica de negocio, inyectan servicios, coordinan otros componentes. Se ubican en la carpeta pages.

Los Dumb Components son los trabajadores. Solo muestran información, reciben datos, emiten eventos. No tienen lógica de negocio, no inyectan servicios. Se ubican en la carpeta components.

Por ejemplo, en el login de UyuniAdmin, SignInComponent es Smart. Inyecta AuthService, maneja el estado de carga, decide qué hacer después del login.

SignInFormComponent es Dumb. Solo muestra el formulario, valida los campos, y emite un evento cuando el usuario hace submit.

Esta separación tiene beneficios enormes. Los Dumb Components son fáciles de probar y reutilizar. Los Smart Components centralizan la lógica."

---

### [12:00 - 15:00] Concepto 3: OnPush

**Narrador**:
"El tercer concepto es ChangeDetectionStrategy.OnPush. Este tema puede parecer técnico, pero tiene un impacto enorme en el rendimiento.

Angular tiene un sistema llamado Change Detection que detecta cuando los datos cambian y actualiza la vista. Por defecto, verifica TODO en cada evento. Cada click, cada timer, cada respuesta HTTP.

En aplicaciones grandes, esto es ineficiente. Imagina verificar 100 componentes cada vez que el usuario hace click.

OnPush es una estrategia que solo verifica un componente cuando realmente hay un cambio. Específicamente, cuando los inputs cambian con una nueva referencia, cuando hay un evento del DOM en ese componente, o cuando un signal actualiza.

La clave aquí es 'nueva referencia'. Si mutas un objeto o un array, OnPush no detecta el cambio. Por eso es importante usar patrones inmutables: crear nuevos objetos y arrays en lugar de modificar los existentes."

---

### [15:00 - 17:00] Concepto 4: inject()

**Narrador**:
"Finalmente, hablemos de inject(). Es la forma moderna de inyección de dependencias en Angular.

Antes, usábamos el constructor. Cada servicio que necesitabas iba en el constructor. Si tenías 5 servicios, el constructor era largo y repetitivo.

Con inject(), simplemente declaras una propiedad privada readonly y llamas a inject con el servicio que necesitas. Es más conciso y funciona en más lugares, como functional guards e interceptors.

Por ejemplo, en lugar de escribir constructor, private auth: AuthService, private router: Router, simplemente escribes private readonly auth = inject(AuthService), private readonly router = inject(Router).

Parece un cambio pequeño, pero cuando trabajas en proyectos grandes, cada línea de código menos cuenta."

---

### [17:00 - 18:30] Resumen

**Narrador**:
"Resumamos lo que aprendimos hoy:

Primero, DDD Lite organiza el código por dominio de negocio, con features que no se importan entre sí.

Segundo, Smart Components son gerentes con lógica de negocio, Dumb Components son trabajadores que solo presentan información.

Tercero, OnPush optimiza el rendimiento verificando solo cuando hay cambios reales, pero requiere patrones inmutables.

Y cuarto, inject() es la forma moderna de inyectar dependencias, más concisa y versátil."

---

### [18:30 - 20:00] Cierre

**Narrador**:
"En el próximo episodio, Día 3, aprenderemos sobre Lazy Loading y Rutas. Veremos cómo cargar código solo cuando se necesita, cómo proteger rutas con guards, y cómo resolver datos antes de navegar.

Si este episodio te ayudó, compártelo con otros desarrolladores. Y si tienes preguntas, déjalas en los comentarios.

Recuerda que los ejercicios prácticos de hoy están en el repositorio del curso. Crear una feature completa con Smart y Dumb Components es la mejor forma de entender estos conceptos.

¡Nos vemos en el próximo episodio del curso de Angular 21 Enterprise!"

**Música**: Outro, fade out

---

## Notas de Producción

### Pacing
- Hablar a velocidad moderada
- Hacer pausas donde se indica [PAUSA]
- Enfatizar términos clave (Smart, Dumb, OnPush, inject)

### Tono
- Amigable y conversacional
- Usar analogías de negocio (gerentes/trabajadores)
- Evitar jerga técnica excesiva

### Música
- Intro: 10 segundos, fade in
- Outro: 15 segundos, fade out
- Estilo: Tech/Corporate, tempo moderado

---

*Curso: Angular 21 Enterprise*
*Día: 2 de 18*
*Formato: Podcast*
