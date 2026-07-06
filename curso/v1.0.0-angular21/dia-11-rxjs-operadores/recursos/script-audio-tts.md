Read aloud in a warm, welcoming, and professional educational tone. Use a conversational style at a slightly brisk pace. Do not linger on pauses.

Speaker 1: ¡Bienvenidos al Día once del Curso de Angular veintiuno! Hoy vamos a profundizar en uno de los temas más poderosos de RxJS: los operadores.

Speaker 1: Si ayer aprendimos qué son los Observables, hoy aprenderemos a transformarlos, filtrarlos y combinarlos. Es la diferencia entre tener datos crudos y tener exactamente lo que necesitas.

Speaker 1: Soy tu instructor y hoy vamos a explorar: operadores de creación, transformación, filtrado y combinación. ¡Vamos allá!

Speaker 1: Empecemos con los operadores de creación. Estos son el punto de entrada: crean Observables desde diferentes fuentes.

Speaker 1: El primero es of. Es simple pero útil. Crea un Observable que emite los valores que le pases y luego completa.

Speaker 1: Por ejemplo: of uno coma dos coma tres emite uno, dos, tres y completa. Es perfecto para valores estáticos o datos de prueba.

Speaker 1: Luego tenemos from. Este es interesante porque convierte arrays, Promises, o iterables en Observables.

Speaker 1: La diferencia clave: of abre corchetes uno coma dos coma tres close corchetes emite el array completo como un valor. from abre corchetes uno coma dos coma tres close corchetes emite cada número por separado.

Speaker 1: También está fromEvent, que es genial para eventos del DOM. Puedes escuchar clicks, inputs, scrolls... cualquier evento.

Speaker 1: Y finalmente interval y timer. Interval mil emite cada segundo. Timer dos mil coma mil espera dos segundos y luego emite cada segundo.

Speaker 1: Estos operadores son la base. Sin ellos, no tendríamos Observables para transformar.

Speaker 1: Ahora entremos en lo jugoso: los operadores de transformación. Estos son los más usados en Angular.

Speaker 1: Empecemos con map. Es igual que el map de arrays: transforma cada valor. Si tienes un Observable de números, puedes multiplicarlos, convertirlos a strings, lo que necesites.

Speaker 1: Pero los verdaderos protagonistas son switchMap, mergeMap, concatMap y exhaustMap. Estos son los que confunden a muchos developers.

Speaker 1: SwitchMap es el rey de las búsquedas. ¿Por qué? Porque cancela la operación anterior cuando llega un nuevo valor.

Speaker 1: Imagina una búsqueda con autocomplete. El usuario escribe a, luego an, luego ang. Sin switchMap, tendrías tres peticiones volando. Con switchMap, las dos primeras se cancelan automáticamente.

Speaker 1: Esto es genial porque evita respuestas desactualizadas. Si a responde después de ang, ¿qué haces con esa respuesta? Nada bueno.

Speaker 1: MergeMap es diferente. Ejecuta todo en paralelo. Si necesitas cargar detalles de cinco usuarios simultáneamente, mergeMap es tu amigo.

Speaker 1: Pero cuidado: el orden de llegada no está garantizado. El usuario dos puede llegar antes que el uno.

Speaker 1: ConcatMap es el opuesto. Ejecuta uno a uno, en orden. Si necesitas guardar cinco usuarios secuencialmente, usa concatMap.

Speaker 1: Y finalmente exhaustMap. Este es especial: ignora nuevos valores mientras hay uno en curso.

Speaker 1: El caso de uso clásico: un botón de guardar. El usuario hace click, click, click. Con exhaustMap, solo el primero se procesa. Los demás se ignoran hasta que el primero termine.

Speaker 1: ¿Cómo recordar cuál usar? Piensa en el comportamiento: switchMap cancela, mergeMap paraleliza, concatMap ordena, exhaustMap ignora.

Speaker 1: Pasemos a los operadores de filtrado. Estos controlan qué valores pasan y cuáles no.

Speaker 1: Filter es obvio: solo deja pasar valores que cumplen una condición. Como el filter de arrays.

Speaker 1: Take es útil: toma solo los primeros N valores. Take tres toma los primeros tres y completa.

Speaker 1: Pero el más importante en Angular es takeUntil. Este es tu mejor amigo para evitar memory leaks.

Speaker 1: En Angular, cuando un componente se destruye, sus suscripciones deberían cancelarse. Sin takeUntil, la suscripción sigue viva, causando memory leaks y errores.

Speaker 1: El patrón es simple: crea un Subject llamado destroy dólar sign, úsalo con takeUntil, y en ngOnDestroy, emite y completa.

Speaker 1: También tenemos debounceTime y throttleTime. Estos controlan la frecuencia de emisiones.

Speaker 1: DebounceTime trescientos espera trescientos milisegundos sin emisiones antes de emitir. Es perfecto para búsquedas: espera a que el usuario deje de escribir.

Speaker 1: ThrottleTime trescientos emite como máximo una vez cada trescientos milisegundos. Es ideal para scroll o resize: no necesitas cada pixel, solo actualizaciones periódicas.

Speaker 1: Y distinctUntilChanged evita duplicados consecutivos. Si el usuario escribe a a, solo emite una a.

Speaker 1: Ahora los operadores de combinación. Estos te permiten trabajar con múltiples Observables.

Speaker 1: ForkJoin es el más usado para HTTP. Espera a que todos los Observables completen y emite un objeto con todos los resultados.

Speaker 1: Es perfecto para cargar datos en paralelo. Por ejemplo, cargar usuarios, órdenes y estadísticas al mismo tiempo.

Speaker 1: CombineLatest es diferente. Emite cada vez que cualquiera de los Observables emite, combinando los últimos valores.

Speaker 1: Úsalo cuando necesitas reaccionar a cambios en múltiples fuentes. Por ejemplo, un carrito de compras que depende de items y descuentos.

Speaker 1: Merge simplemente intercala valores de múltiples Observables. Úsalo cuando tienes múltiples fuentes del mismo tipo de datos.

Speaker 1: La diferencia clave: forkJoin emite una vez al final, combineLatest emite continuamente, merge intercala valores.

Speaker 1: Finalmente, hablemos de manejo de errores. Esto es crítico en aplicaciones reales.

Speaker 1: CatchError captura errores en el stream. Pero hay una regla importante: DEBE retornar un Observable.

Speaker 1: Si no hay valor alternativo, retorna of abre corchetes close corchetes o EMPTY. Pero nunca retornes undefined o null.

Speaker 1: Retry es simple: reintenta la operación N veces antes de fallar. Útil para operaciones que pueden fallar temporalmente.

Speaker 1: Y finalize ejecuta código cuando el Observable completa o tiene error. Es perfecto para ocultar loaders.

Speaker 1: Hoy cubrimos mucho terreno. Repasemos:

Speaker 1: Operadores de creación: of, from, fromEvent, interval, timer.

Speaker 1: Operadores de transformación: map, switchMap, mergeMap, concatMap, exhaustMap.

Speaker 1: Operadores de filtrado: filter, take, takeUntil, debounceTime, distinctUntilChanged.

Speaker 1: Operadores de combinación: forkJoin, combineLatest, merge.

Speaker 1: Y manejo de errores: catchError, retry, finalize.

Speaker 1: El consejo del día: practica con RxMarbles. Ver los diagramas te ayuda a entender visualmente cada operador.

Speaker 1: Mañana veremos cómo integrar RxJS con Angular Signals. Es la combinación perfecta de estado reactivo.

Speaker 1: ¡Nos vemos en el próximo episodio!
