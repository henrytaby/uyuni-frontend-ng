Read aloud in a warm, welcoming, and professional educational tone. Use a conversational style at a slightly brisk pace. Do not linger on pauses.

Speaker 1: ¡Hola! Bienvenidos al cuarto episodio del curso de Angular veintiuno Enterprise. Hoy vamos a hablar de algo que parece simple pero es fundamental: los Core Services.

Speaker 1: En los episodios anteriores configuramos el proyecto, aprendimos arquitectura y configuramos lazy loading. Hoy vamos a crear los servicios que dan vida a toda la aplicación.

Speaker 1: Vamos a construir Logger Service y Loading Service desde cero. Dos servicios que usarás en TODOS tus proyectos.

Speaker 1: Imagina que estás debuggeando un problema en producción. Abres la consola del navegador y ves... nada. O peor, ves información sensible expuesta.

Speaker 1: ¿Por qué? Porque usaste console punto log en todo el código. En desarrollo parece útil, pero en producción es un problema de seguridad.

Speaker 1: Otro escenario: tu aplicación hace múltiples peticiones HTTP. El spinner aparece y desaparece constantemente, creando un efecto de flash que confunde al usuario.

Speaker 1: Estos problemas se resuelven con Core Services bien diseñados. Logger Service para logging controlado, y Loading Service para estado de carga centralizado.

Speaker 1: Entendamos POR QUÉ los Core Services son tan importantes.

Speaker 1: Primero, son singletons. Una sola instancia para toda la aplicación. Esto significa que el estado es consistente en todas partes.

Speaker 1: Segundo, son transversales. Se usan en toda la aplicación, desde componentes hasta interceptors.

Speaker 1: Tercero, siguen el principio de responsabilidad única. Logger Service solo hace logging. Loading Service solo maneja estado de carga.

Speaker 1: En Angular moderno, usamos providedIn root para crear singletons. Y usamos la función inject para inyección de dependencias. Es más limpio que el constructor tradicional.

Speaker 1: Empecemos con Logger Service. El concepto es simple: reemplazar console punto log con un servicio controlado.

Speaker 1: Logger Service tiene niveles: debug, info, warn, y error. Cada nivel tiene un valor numérico. En desarrollo, mostramos todo desde debug. En producción, solo info y superiores.

Speaker 1: La implementación usa un método privado log que verifica si el nivel está habilitado. Si está habilitado, formatea el mensaje con timestamp y contexto, y lo envía a console.

Speaker 1: El resultado: logs consistentes, filtrables, y seguros. En producción, los logs debug simplemente no aparecen. No hay información sensible expuesta.

Speaker 1: Ahora hablemos de Loading Service. Este servicio resuelve el problema del estado de carga.

Speaker 1: La idea clave es un contador de peticiones. Cada vez que una petición HTTP inicia, incrementamos el contador. Cuando termina, lo decrementamos.

Speaker 1: Usamos Angular Signals para el estado. Un signal writable para el contador, y un signal computed para isLoading. Computed significa que se recalcula automáticamente cuando el contador cambia.

Speaker 1: La magia está en que múltiples peticiones pueden estar activas simultáneamente. El spinner permanece visible mientras haya al menos una petición activa. Solo cuando el contador llega a cero, se oculta.

Speaker 1: Loading Service por sí solo no hace nada. Necesita integrarse con HTTP. Aquí es donde entra el interceptor.

Speaker 1: Un interceptor funcional es una función que recibe la request y un handler. Antes de pasar la request al handler, llamamos a loadingService punto show. Después, usamos el operador finalize para llamar a hide.

Speaker 1: Finalize se ejecuta tanto en éxito como en error. Esto garantiza que el contador siempre se decrementa.

Speaker 1: El resultado: cada petición HTTP automáticamente muestra y oculta el loading. Sin código repetitivo en componentes.

Speaker 1: Finalmente, hablemos de testing. Los servicios son fáciles de testear porque no tienen dependencias de UI.

Speaker 1: Para Logger Service, espiamos los métodos de console y verificamos que se llaman con los parámetros correctos. También verificamos que el filtrado por nivel funciona.

Speaker 1: Para Loading Service, verificamos que show incrementa el contador, hide lo decrementa, y que isLoading refleja el estado correctamente.

Speaker 1: La clave es usar beforeEach para crear el servicio y afterEach para limpiar los mocks. Jest hace esto muy sencillo.

Speaker 1: Resumamos lo que aprendimos hoy:

Speaker 1: Primero, los Core Services son singletons transversales que siguen el principio de responsabilidad única.

Speaker 1: Segundo, Logger Service proporciona logging controlado con niveles, formato consistente, y filtrado por entorno.

Speaker 1: Tercero, Loading Service maneja el estado de carga con un contador de peticiones y Signals reactivas.

Speaker 1: Y cuarto, los interceptors integran Loading Service con HTTP automáticamente.

Speaker 1: En el próximo episodio, Día cinco, aprenderemos sobre Config Service y Token Refresh Service. Veremos cómo cargar configuración desde JSON y cómo manejar tokens JWT.

Speaker 1: Si este episodio te ayudó, compártelo con otros desarrolladores. Y si tienes preguntas, déjalas en los comentarios.

Speaker 1: Los ejercicios de hoy incluyen implementar Logger Service con niveles y Loading Service con interceptor. La práctica es la mejor forma de dominar estos conceptos.

Speaker 1: ¡Nos vemos en el próximo episodio del curso de Angular veintiuno Enterprise!
