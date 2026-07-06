# Script de Audio: Día 18 - CI/CD y Deployment

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
"¡Bienvenidos al Día 18 del Curso de Angular 21!

Y más importante aún: ¡Bienvenidos al último día del curso!

Hoy vamos a hablar de CI/CD. De cómo automatizar todo lo que hemos aprendido. De cómo hacer que tu código se despliegue solo, sin intervención manual.

Al final de hoy, tendrás una aplicación completa, con tests, y con deployment automático. Todo lo que necesitas para trabajar profesionalmente."

**[Música de transición - 5 segundos]**

---

## Sección 1: Por Qué CI/CD Importa (1:30 - 4:00)

**Narrador:**
"En 2019, un desarrollador hizo push a producción un viernes a las 5pm. El código rompió el checkout. La empresa perdió 100,000 dólares en ventas durante el fin de semana. Nadie se dio cuenta hasta el lunes.

¿Cómo se previene esto? Con CI/CD.

CI significa Continuous Integration. Cada vez que haces push, los tests corren automáticamente. Si fallan, el código no se integra.

CD significa Continuous Deployment. Solo código que pasa todos los tests se despliega a producción.

Sin CI/CD, confías en la suerte. Con CI/CD, confías en automatización."

---

## Sección 2: GitHub Actions (4:00 - 8:00)

**Narrador:**
"GitHub Actions es la herramienta de CI/CD integrada en GitHub. Es gratuita para repositorios públicos, y tiene minutos gratuitos para repositorios privados.

La configuración va en archivos YAML, en el directorio .github/workflows.

Un workflow tiene tres partes: nombre, triggers, y jobs.

El nombre es descriptivo. Los triggers definen cuándo ejecutar: push, pull request, manual, o programado. Los jobs son las unidades de trabajo."

---

## Sección 3: Jobs y Steps (8:00 - 12:00)

**Narrador:**
"Un job es una secuencia de steps que se ejecutan en el mismo runner. Puedes tener múltiples jobs, y hacer que dependan entre sí.

Por ejemplo: un job de lint, un job de test que depende de lint, y un job de build que depende de test.

Si lint falla, test no corre. Si test falla, build no corre. Es una cascada de quality gates.

Cada step puede ser una action predefinida o un comando de shell. Actions como checkout y setup-node son muy comunes."

---

## Sección 4: Caching y Secrets (12:00 - 16:00)

**Narrador:**
"El caching es crucial para pipelines rápidos. Sin cache, cada run descarga todas las dependencias. Con cache, solo la primera vez.

GitHub Actions tiene cache integrado para npm. Solo añade cache: npm en setup-node.

Los secrets son variables encriptadas. Nunca hardcodees API keys o tokens en el código. Úsalos como secrets en GitHub.

Se configuran en Settings, Secrets and variables, Actions. Y se usan con la sintaxis secrets.NOMBRE."

---

## Sección 5: Husky y Pre-commit Hooks (16:00 - 20:00)

**Narrador:**
"Husky es una herramienta para Git hooks. Permite ejecutar scripts antes de commit, antes de push, o al escribir el mensaje de commit.

El hook más común es pre-commit. Con lint-staged, corre ESLint solo en los archivos modificados. Ahorra tiempo y asegura calidad.

Otro hook útil es commit-msg. Con commitlint, valida que el mensaje siga conventional commits. Formato: tipo: descripción.

Por ejemplo: feat: add login. O fix: resolve redirect bug."

---

## Sección 6: El Pipeline Completo (20:00 - 24:00)

**Narrador:**
"Un pipeline completo tiene cuatro jobs: lint, test, build, deploy.

Lint corre ESLint. Verifica que el código sigue las reglas.

Test corre Jest. Verifica que los tests pasan.

Build compila la aplicación. Genera los archivos de producción.

Deploy sube los archivos a la plataforma de hosting. Solo si todo lo anterior pasó.

El resultado: cada push a main dispara el pipeline. Si pasa, producción se actualiza automáticamente."

---

## Cierre del Curso (24:00 - 28:00)

**Narrador:**
"Y así terminamos el Curso de Angular 21.

Hemos cubierto mucho en 18 días:

Días 1-3: Fundamentos y Arquitectura. Aprendiste DDD Lite, lazy loading, y rutas.

Días 4-6: Core Services. Logger, Loading, Config, Token Refresh, Error Handlers.

Días 7-9: Autenticación. AuthService, Interceptors, Guards.

Días 10-12: RxJS y Estado. Observables, Operators, Signals.

Días 13-14: UI y Estilos. PrimeNG, Tailwind CSS.

Días 15-16: Features y Componentes. Smart vs Dumb, integración completa.

Días 17-18: Testing y CI/CD. Jest, GitHub Actions, Husky.

Has construido una aplicación completa. Con arquitectura profesional. Con tests. Con deployment automático.

¿Qué sigue? Practica. Construye proyectos personales. Contribuye a open source. Y sobre todo, disfruta construyendo software.

Gracias por acompañarme en este viaje. Nos vemos en el código."

**[Música de salida - 10 segundos]**

---

## Notas de Producción

### Música
- Intro: Música suave, estilo tech podcast
- Transiciones: Efectos sutiles
- Outro: Misma música del intro, pero más solemne

### Efectos de Sonido
- Teclado tecleando al mostrar código
- "Ding" para puntos importantes
- Aplausos al final (cierre del curso)

### Tono
- Educativo pero conversacional
- Emotivo en el cierre
- Celebratorio al final

### Pacing
- Velocidad moderada
- Pausas después de conceptos importantes
- Énfasis en palabras clave

---

*Script de Audio - Día 18 - CI/CD y Deployment - Curso Angular 21*
