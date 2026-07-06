# Guion de Audio (Podcast) - Día 3: Lazy Loading y Rutas

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
"¡Hola! Bienvenidos al tercer episodio del curso de Angular 21 Enterprise. Soy tu instructor y hoy vamos a hablar de algo que parece técnico pero tiene un impacto enorme en la experiencia del usuario: Lazy Loading y Rutas.

En los episodios anteriores configuramos el proyecto y aprendimos sobre arquitectura. Hoy vamos a resolver un problema muy común: ¿por qué algunas aplicaciones tardan tanto en cargar?

La respuesta está en cómo cargamos el código. Y hoy aprenderemos a hacerlo correctamente."

---

### [01:30 - 03:30] Hook: El Problema

**Narrador**:
"Imagina que acabas de construir una aplicación Angular con 10 features: dashboard, perfil, configuración, usuarios, reportes, y más.

Cuando compilas para producción, el bundle tiene 2 megabytes. El usuario abre la aplicación y espera... 5 segundos antes de ver algo.

¿Por qué? Porque estás cargando TODO el código al inicio. Dashboard, perfil, configuración, todo junto. Incluso features que el usuario quizás nunca use.

[PAUSA]

Esto es como ir de compras y comprar TODO el supermercado, aunque solo necesites pan y leche. Ineficiente, ¿verdad?

Lazy Loading es la solución. Cargamos solo lo que se necesita, cuando se necesita."

---

### [03:30 - 06:00] Contexto: Por Qué Importa

**Narrador**:
"Entendamos POR QUÉ esto importa tanto.

Las estadísticas muestran que el 80% del código de una aplicación no se necesita en la primera carga. El usuario entra al dashboard, no a configuración. ¿Por qué cargar configuración al inicio?

Google hizo un estudio: cada segundo adicional de carga reduce las conversiones en 7%. En aplicaciones enterprise, esto significa usuarios frustrados y menos productividad.

Lazy Loading divide el código en chunks, archivos separados que se cargan bajo demanda. El bundle inicial pasa de 2MB a 500KB. El tiempo de carga de 5 segundos a 1.5 segundos.

La diferencia es enorme para la experiencia del usuario."

---

### [06:00 - 09:00] Concepto 1: Lazy Loading

**Narrador**:
"Empecemos con Lazy Loading. El concepto es simple: cargar código solo cuando se necesita.

En Angular, esto se hace con dos funciones: loadChildren y loadComponent.

loadChildren se usa para cargar módulos completos, con múltiples rutas. Por ejemplo, toda la feature de dashboard con sus páginas y componentes.

loadComponent se usa para cargar un solo componente. Útil cuando tienes una página aislada.

La sintaxis usa import dinámico de JavaScript. Es como decirle al navegador: 'Cuando el usuario vaya a esta ruta, descarga este archivo'.

El resultado: el navegador crea chunks separados. Puedes verlos en Chrome DevTools, en la pestaña Network. Cada vez que navegas a una nueva feature, aparece un nuevo archivo JavaScript."

---

### [09:00 - 12:00] Concepto 2: Route Guards

**Narrador**:
"Ahora hablemos de Route Guards. Si Lazy Loading es sobre cuándo cargar, Guards son sobre QUIÉN puede acceder.

Imagina un club nocturno. Hay un portero que decide quién entra. Los Guards son ese portero.

En Angular, un Guard es una función que se ejecuta antes de activar una ruta. Retorna true para permitir el acceso, false para bloquearlo, o una URL para redirigir.

El caso más común es autenticación. Si el usuario no está logueado, el guard lo redirige a login. Simple pero poderoso.

Desde Angular 14, los guards son funciones, no clases. Esto los hace más simples y fáciles de probar. Usamos inject para obtener servicios, igual que en componentes."

---

### [12:00 - 15:00] Concepto 3: Resolvers

**Narrador**:
"El tercer concepto es Resolvers. Mientras los Guards deciden SI puedes entrar, los Resolvers preparan lo que vas a ver.

Imagina que vas a un restaurante. El mesero prepara la mesa antes de que te sientes. Los Resolvers hacen eso: cargan los datos antes de que el componente se active.

Sin resolver, el componente se muestra vacío mientras carga los datos. Con resolver, el componente se muestra con los datos listos.

La diferencia es sutil pero importante. El usuario no ve estados de carga intermitentes. La experiencia se siente más fluida.

Los resolvers también son funciones desde Angular 14. Retornan Observables, Promises, o valores síncronos."

---

### [15:00 - 17:00] Concepto 4: Rutas Anidadas

**Narrador**:
"Finalmente, hablemos de rutas anidadas. Esto permite tener componentes dentro de componentes, cada uno con su propio router-outlet.

El ejemplo clásico es un layout con sidebar. El layout es el componente padre, y el contenido cambia según la ruta hija.

En la configuración, defines children dentro de una ruta. Cada child tiene su propio path y componente.

En el template del padre, usas router-outlet donde quieres que aparezca el componente hijo. Puedes tener múltiples outlets si necesitas.

Las rutas anidadas son perfectas para áreas de la aplicación que comparten layout, como configuración con múltiples páginas."

---

### [17:00 - 18:30] Resumen

**Narrador**:
"Resumamos lo que aprendimos hoy:

Primero, Lazy Loading carga código bajo demanda, reduciendo el bundle inicial hasta 75%.

Segundo, los Guards controlan quién puede acceder a cada ruta, protegiendo áreas sensibles.

Tercero, los Resolvers precargan datos antes de activar el componente, evitando estados vacíos.

Y cuarto, las rutas anidadas permiten layouts complejos con múltiples niveles de navegación."

---

### [18:30 - 20:00] Cierre

**Narrador**:
"En el próximo episodio, Día 4, aprenderemos sobre Core Services. Veremos LoggerService, LoadingService, ConfigService, y TokenRefreshService. Estos servicios son la base de la aplicación.

Si este episodio te ayudó, compártelo con otros desarrolladores. Y si tienes preguntas, déjalas en los comentarios.

Los ejercicios de hoy incluyen crear una feature con lazy loading, implementar guards, y usar resolvers. La práctica es la mejor forma de dominar estos conceptos.

¡Nos vemos en el próximo episodio del curso de Angular 21 Enterprise!"

**Música**: Outro, fade out

---

## Notas de Producción

### Pacing
- Hablar a velocidad moderada
- Hacer pausas donde se indica [PAUSA]
- Enfatizar términos clave (Lazy Loading, Guards, Resolvers)

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
*Día: 3 de 18*
*Formato: Podcast*
