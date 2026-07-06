Read aloud in a warm, welcoming, and professional educational tone. Use a conversational style at a slightly brisk pace. Do not linger on pauses.

Speaker 1: ¡Bienvenidos al Día doce del Curso de Angular veintiuno! Hoy vamos a resolver uno de los dilemas más comunes en el desarrollo moderno con Angular: ¿Cuándo usar Signals y cuándo usar RxJS? Y más importante aún, ¿cómo combinarlos de forma efectiva?

Speaker 1: Soy tu instructor y hoy vamos a explorar el estado híbrido. Aprenderás a usar toSignal para convertir Observables en Signals, toObservable para hacer lo contrario, y patrones avanzados para manejar estado en aplicaciones enterprise.

Speaker 1: Si alguna vez te has preguntado cómo hacer una búsqueda con debounce usando Signals, o cómo cargar datos HTTP y exponerlos como Signals, este episodio es para ti.

Speaker 1: Imagina este escenario: tienes un componente que necesita cargar datos de una API, mostrar un loading mientras carga, manejar errores si falla, y además permitir filtros locales. Con RxJS puro, terminas con un BehaviorSubject, un Observable combinado, y un async pipe en el template.

Speaker 1: Con Signals puro, no puedes hacer peticiones HTTP directamente. Necesitas RxJS para eso. Entonces... ¿qué hacemos?

Speaker 1: La respuesta es: usar ambos. Signals para el estado local y derivado, RxJS para operaciones asíncronas. Y Angular nos da las herramientas para conectarlos: toSignal y toObservable.

Speaker 1: Piénsalo así: Signals son como variables reactivas que notifican cuando cambian. RxJS es como un río de datos que fluye en el tiempo. toSignal te permite tomar un momento del río y convertirlo en una variable. toObservable te permite convertir una variable en un flujo.

Speaker 1: Vamos a profundizar en toSignal. Esta función toma un Observable y devuelve una Signal de solo lectura. El valor de la Signal se actualiza cada vez que el Observable emite.

Speaker 1: Aquí hay un ejemplo básico: imagina que quieres cargar usuarios de una API. Con el enfoque tradicional, usarías un Observable y el async pipe. Con toSignal, puedes hacer:

Speaker 1: users igual toSignal open paréntesis this punto http punto get User array close paréntesis close paréntesis.

Speaker 1: Y en el template, simplemente usas users open paréntesis close paréntesis como cualquier otra Signal. Sin async pipe, sin suscripciones manuales.

Speaker 1: Pero hay un detalle importante: ¿qué valor tiene la Signal antes de que el Observable emita por primera vez? Por defecto, es undefined. Pero puedes proporcionar un valor inicial con la opción initialValue.

Speaker 1: Por ejemplo: users igual toSignal open paréntesis this punto http punto get User array close paréntesis coma abre llaves initialValue dos puntos abre corchetes close corchetes close llaves close paréntesis. Ahora, la Signal tiene un array vacío hasta que la petición HTTP se complete.

Speaker 1: Otro punto crucial: el manejo de errores. Si el Observable emite un error, la Signal no se actualiza y el error se propaga. Por eso es importante usar catchError en el Observable antes de pasarlo a toSignal.

Speaker 1: El patrón recomendado es: users igual toSignal open paréntesis this punto http punto get User array close paréntesis punto pipe open paréntesis catchError open paréntesis open paréntesis close paréntesis igual greater than of open paréntesis abre corchetes close corchetes close paréntesis close paréntesis close paréntesis coma abre llaves initialValue dos puntos abre corchetes close corchetes close llaves close paréntesis. Así, si hay un error, la Signal tiene un array vacío en lugar de fallar.

Speaker 1: Ahora hablemos de toObservable. Esta función hace lo contrario: toma una Signal y la convierte en un Observable.

Speaker 1: ¿Por qué querrías hacer esto? Porque Signals no tienen operadores como debounceTime, switchMap, o distinctUntilChanged. Si quieres aplicar estos operadores, necesitas convertir la Signal a Observable primero.

Speaker 1: El caso de uso más común es una búsqueda con debounce. Tienes una Signal que representa el término de búsqueda, la conviertes a Observable, aplicas debounceTime, y luego haces la petición HTTP con switchMap.

Speaker 1: El código se ve así: primero, searchTerm igual signal abre paréntesis comilla comilla close paréntesis. Luego, searchResults dólar sign igual toObservable open paréntesis this punto searchTerm close paréntesis punto pipe open paréntesis debounceTime open paréntesis trescientos close paréntesis coma switchMap open paréntesis term igual greater than this punto http punto get slash api slash search q igual term close paréntesis close paréntesis close paréntesis. Finalmente, results igual toSignal open paréntesis this punto searchResults dólar sign coma abre llaves initialValue dos puntos abre corchetes close corchetes close llaves close paréntesis.

Speaker 1: Nota el flujo: Signal a toObservable a operadores RxJS a HTTP a toSignal. Es un patrón híbrido que aprovecha lo mejor de ambos mundos.

Speaker 1: Una característica importante: el Observable creado por toObservable nunca completa. Sigue emitiendo mientras la Signal exista. Esto es diferente a los Observables de HTTP, que completan después de una emisión.

Speaker 1: Ya cubrimos computed y effect en días anteriores, pero vale la pena revisarlos en el contexto del estado híbrido.

Speaker 1: computed es perfecto para valores derivados. Si tienes una Signal con datos de una API y otra Signal con un filtro, puedes usar computed para combinarlos.

Speaker 1: Por ejemplo: filteredProducts igual computed open paréntesis open paréntesis close paréntesis igual greater than this punto products open paréntesis close paréntesis punto filter open paréntesis p igual greater than p punto category igual igual this punto categoryFilter open paréntesis close paréntesis close paréntesis close paréntesis. Cada vez que products o categoryFilter cambian, filteredProducts se recalcula automáticamente.

Speaker 1: effect es para side effects. Un uso común es persistir estado en localStorage. Por ejemplo: effect open paréntesis open paréntesis close parénthesis igual greater than localStorage punto setItem open paréntesis cart coma JSON punto stringify open paréntesis this punto cart open paréntesis close paréntesis close paréntesis close paréntesis. Cada vez que el carrito cambia, se guarda automáticamente.

Speaker 1: Pero ten cuidado: no actualices una Signal dentro de un effect que la observa. Eso crea un loop infinito. Angular lo detecta y lanza un error, pero es mejor evitarlo desde el diseño.

Speaker 1: La regla de oro: usa computed para valores derivados, effect para side effects. Si necesitas actualizar una Signal basándote en otra, probablemente necesitas computed, no effect.

Speaker 1: Para aplicaciones más complejas, puedes crear un Store usando Signals. Un Store encapsula el estado, los métodos para actualizarlo, y computed para valores derivados.

Speaker 1: El patrón básico es: tienes una Signal privada para el estado, y expones Signals de solo lectura para que los componentes las consuman. Los métodos públicos actualizan el estado de forma controlada.

Speaker 1: Por ejemplo, un ProductsStore tendría: una Signal privada state con data, loading, error, Signals públicas data, loading, error como computed, y métodos loadProducts, addProduct, updateProduct, deleteProduct.

Speaker 1: Este patrón es similar a NgRx o Akita, pero mucho más simple. No hay actions, reducers, o selectors. Solo Signals y métodos.

Speaker 1: La ventaja es que el Store es fácil de testear, fácil de entender, y funciona perfectamente con Angular change detection. Los componentes solo leen Signals y llaman métodos, sin preocuparse por suscripciones.

Speaker 1: Hoy aprendimos a combinar Signals y RxJS de forma efectiva. toSignal para convertir Observables a Signals, toObservable para lo contrario, computed para valores derivados, y effect para side effects.

Speaker 1: El patrón híbrido te da lo mejor de ambos mundos: la simplicidad de Signals para estado local, y el poder de RxJS para operaciones asíncronas.

Speaker 1: Mañana continuaremos con UI y PrimeNG. Aprenderemos a usar componentes de PrimeNG, personalizar temas, y crear interfaces profesionales.

Speaker 1: Recuerda practicar con los labs del día de hoy. La mejor forma de aprender es escribiendo código.
