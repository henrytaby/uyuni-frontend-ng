# Script de Audio: Día 17 - Testing

## Información del Audio

| Atributo | Valor |
|----------|-------|
| **Duración estimada** | 25-30 minutos |
| **Formato** | Podcast educativo |
| **Audiencia** | Desarrolladores Angular con <1 año de experiencia |

---

## Intro (0:00 - 1:30)

**[Música de entrada suave - 10 segundos]**

**Narrador:**
"¡Bienvenidos al Día 17 del Curso de Angular 21!

Hoy hablaremos de un tema que muchos desarrolladores evitan, pero que es crucial: Testing.

¿Alguna vez has desplegado código que rompió algo en producción? ¿Te ha pasado que un cambio pequeño causó un bug grande? Testing previene eso.

Hoy aprenderás a escribir tests unitarios para tus servicios, componentes, guards e interceptors. Y lo más importante: aprenderás a disfrutarlo."

**[Música de transición - 5 segundos]**

---

## Sección 1: Por Qué Testing Importa (1:30 - 4:00)

**Narrador:**
"En 2012, Knight Capital Group perdió 440 millones de dólares en 45 minutos por un bug en su software de trading. El bug fue causado por código que no debería estar activo, pero nadie lo testeó.

En aplicaciones Angular, los bugs pueden ser igual de costosos. Un usuario que no puede loguearse es una venta perdida. Un formulario que no valida es datos corruptos. Un guard que no funciona es una brecha de seguridad.

Testing no es opcional. Es tu red de seguridad."

---

## Sección 2: La Pirámide de Testing (4:00 - 7:00)

**Narrador:**
"Existe un concepto llamado la Pirámide de Testing. Imagina una pirámide con tres niveles.

En la base están los Unit Tests. Son muchos, son rápidos, y testean unidades aisladas de código. Un servicio, una función, un componente.

En el medio están los Integration Tests. Testean cómo interactúan las unidades entre sí. Un componente con su servicio, un servicio con HTTP.

En la cima están los E2E Tests. Son pocos, son lentos, pero testean flujos completos de usuario. Login, navegación, checkout.

La regla es simple: muchos unit tests, algunos integration tests, pocos E2E tests."

---

## Sección 3: Jest vs Jasmine (7:00 - 10:00)

**Narrador:**
"Angular 21 usa Jest por defecto. Antes se usaba Jasmine con Karma.

¿Por qué el cambio? Jest es más rápido. Ejecuta tests en paralelo. Tiene watch mode que detecta cambios. Tiene mocking integrado. Y coverage sin configuración extra.

La configuración es simple. Un archivo jest.config.js y un setup-jest.ts. Eso es todo.

En el package.json tienes los scripts: npm test, npm run test:watch, npm run test:coverage."

---

## Sección 4: El Patrón AAA (10:00 - 13:00)

**Narrador:**
"Todos los tests siguen el patrón AAA: Arrange, Act, Assert.

Arrange es configurar el entorno. Crear el servicio, preparar los datos, mockear dependencias.

Act es ejecutar la acción. Llamar al método, hacer click, disparar el evento.

Assert es verificar el resultado. ¿El valor es el esperado? ¿Se llamó al método? ¿El estado cambió?

Este patrón hace los tests legibles y mantenibles. Cualquiera que lea el test entiende qué se está testeando."

---

## Sección 5: Testing de Servicios (13:00 - 17:00)

**Narrador:**
"Para testear servicios, usamos TestBed. TestBed configura el entorno de testing.

Primero, inyectamos el servicio con TestBed.inject. Luego, testeamos sus métodos.

Veamos un ejemplo con LoggerService. El test verifica que info() loguea con el prefijo correcto. Usamos un spy en console.info para verificar la llamada.

Para servicios con HttpClient, mockeamos el cliente. Creamos un objeto con métodos jest.fn(). Y configuramos el retorno con mockReturnValue.

La clave es: no testeamos HTTP, testeamos que el servicio llama a HTTP correctamente."

---

## Sección 6: Testing de Signals (17:00 - 20:00)

**Narrador:**
"Los signals se testean como cualquier valor. La diferencia es que son funciones.

Para obtener el valor de un signal, lo llamas: signal(). Para verificar que cambió, lo llamas después de la acción.

Veamos LoadingService. El signal isLoading es un computed. Pero no importa, se testea igual.

Primero verificamos el estado inicial: isLoading() es false. Luego llamamos show(). Finalmente verificamos: isLoading() es true.

Para computed signals, es lo mismo. Cambias los signals de los que depende, y verificas el resultado."

---

## Sección 7: Testing de Componentes (20:00 - 24:00)

**Narrador:**
"Los componentes se testean con ComponentFixture. Es un wrapper que permite interactuar con el componente.

Hay algo importante: después de cambiar un signal o input, debes llamar fixture.detectChanges(). Sin eso, el DOM no se actualiza.

Para testear inputs, usas component.input.set(valor). Para testear outputs, te suscribes y usas un spy.

Para testear eventos del DOM, seleccionas el elemento y haces click. Y verificas que el output se emitió.

Para componentes con servicios, mockeamos el servicio en TestBed. Usamos provide y useValue."

---

## Sección 8: Errores Comunes (24:00 - 27:00)

**Narrador:**
"Hablemos de los errores más comunes en testing.

Error número 1: No limpiar los spies. Los spies persisten entre tests. Usa afterEach con jest.restoreAllMocks.

Error número 2: Olvidar detectChanges. El DOM no se actualiza mágicamente. Llama fixture.detectChanges() después de cada cambio.

Error número 3: Tests dependientes. Cada test debe ser aislado. No compartas estado entre tests. Usa beforeEach para configurar.

Error número 4: Testear implementación en lugar de comportamiento. No accedas a variables privadas. Testea lo que el usuario ve."

---

## Cierre (27:00 - 29:00)

**Narrador:**
"Para resumir:

1. Testing es tu red de seguridad
2. Sigue la pirámide: muchos unit, pocos E2E
3. Usa el patrón AAA
4. TestBed para servicios, ComponentFixture para componentes
5. Siempre llama detectChanges
6. Limpia los spies en afterEach

En los labs de hoy, vas a escribir tests para LoggerService, LoadingService, y componentes. Vas a alcanzar 80% de coverage.

Recuerda: un test que falla es bueno. Te dice qué está mal. Un test que pasa es mejor. Te dice que todo está bien.

¡Nos vemos en el próximo episodio!"

**[Música de salida - 10 segundos]**

---

## Notas de Producción

### Música
- Intro: Música suave, estilo tech podcast
- Transiciones: Efectos sutiles
- Outro: Misma música del intro

### Efectos de Sonido
- Teclado tecleando al mostrar código
- "Ding" para puntos importantes
- Transición suave entre secciones

### Tono
- Educativo pero conversacional
- Ejemplos prácticos
- Evitar jerga innecesaria

### Pacing
- Velocidad moderada
- Pausas después de conceptos importantes
- Énfasis en palabras clave

---

*Script de Audio - Día 17 - Testing - Curso Angular 21*
