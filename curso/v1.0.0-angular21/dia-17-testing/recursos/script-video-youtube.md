# Script de Video YouTube: Día 17 - Testing

## Información del Video

| Atributo | Valor |
|----------|-------|
| **Título** | Angular 21 Testing: Unit Tests con Jest desde Cero |
| **Duración** | 25-30 minutos |
| **Formato** | Tutorial con código en vivo |
| **Thumbnail** | Código de test con check verde |

---

## Estructura del Video

| Tiempo | Sección | Duración |
|--------|---------|----------|
| 0:00 | Intro y Hook | 2 min |
| 2:00 | Pirámide de Testing | 3 min |
| 5:00 | Configuración de Jest | 3 min |
| 8:00 | Demo: Testing de Servicio | 8 min |
| 16:00 | Demo: Testing de Componente | 6 min |
| 22:00 | Errores Comunes | 3 min |
| 25:00 | Resumen y Cierre | 2 min |

---

## Sección 1: Intro y Hook (0:00 - 2:00)

### Visual
- **0:00 - 0:15**: Pantalla con logo del curso y título
- **0:15 - 0:45**: Cara del presentador, fondo de oficina
- **0:45 - 2:00**: Animación de la pirámide de testing

### Guión

**[0:00 - 0:15]**
*(Pantalla con título animado)*
"Angular 21 Testing: Unit Tests con Jest desde Cero"

**[0:15 - 0:45]**
*(Cara del presentador)*
"¡Hola! Bienvenidos al Día 17 del Curso de Angular 21. Hoy vamos a hablar de testing. Y no, no es aburrido. Es tu superpoder como desarrollador."

**[0:45 - 2:00]**
*(Animación: pirámide de testing)*
"¿Sabías que un bug que llega a producción cuesta 100 veces más que uno encontrado en desarrollo? Testing es tu red de seguridad. Hoy aprenderás a escribir tests para servicios, componentes, guards e interceptors."

---

## Sección 2: Pirámide de Testing (2:00 - 5:00)

### Visual
- **2:00 - 3:30**: Diagrama de pirámide animado
- **3:30 - 5:00**: Ejemplos de cada tipo

### Guión

**[2:00 - 3:30]**
*(Diagrama de pirámide)*
"La pirámide de testing tiene tres niveles. En la base: Unit Tests. Son muchos, son rápidos, testean unidades aisladas. En el medio: Integration Tests. Testean interacciones. En la cima: E2E Tests. Son pocos, son lentos, pero testean flujos completos."

**[3:30 - 5:00]**
*(Ejemplos)*
"La regla es: muchos unit tests, algunos integration tests, pocos E2E tests. Hoy nos enfocamos en unit tests con Jest."

---

## Sección 3: Configuración de Jest (5:00 - 8:00)

### Visual
- **5:00 - 6:30**: Archivo jest.config.js
- **6:30 - 8:00**: package.json scripts

### Guión

**[5:00 - 6:30]**
*(Código de jest.config.js)*
"Angular 21 usa Jest por defecto. La configuración está en jest.config.js. El preset es jest-preset-angular. Y los coverage thresholds están configurados: 80% para statements."

**[6:30 - 8:00]**
*(package.json)*
"Los scripts son simples: npm test para correr todos, npm run test:watch para watch mode, npm run test:coverage para ver coverage."

---

## Sección 4: Demo - Testing de Servicio (8:00 - 16:00)

### Visual
- **8:00 - 10:00**: Estructura de test
- **10:00 - 12:00**: Test de creación
- **12:00 - 14:00**: Test de método
- **14:00 - 16:00**: Test con spy

### Guión

**[8:00 - 10:00]**
*(Código de test vacío)*
"Vamos a testear LoggerService. Primero, la estructura. Describe con el nombre del servicio, beforeEach para configurar, e it para cada test."

**[10:00 - 12:00]**
*(Test de creación)*
"El primer test siempre es: 'should be created'. Verifica que el servicio se inyecta correctamente."

**[12:00 - 14:00]**
*(Test de método)*
"Ahora testeamos el método info. Seguimos el patrón AAA: Arrange, Act, Assert. Arrange: creamos un spy en console.info. Act: llamamos al método. Assert: verificamos que se llamó con los argumentos correctos."

**[14:00 - 16:00]**
*(Test con spy)*
"Importantísimo: limpiar los spies en afterEach. Si no, el spy persiste en otros tests y causa problemas."

---

## Sección 5: Demo - Testing de Componente (16:00 - 22:00)

### Visual
- **16:00 - 18:00**: Configuración de fixture
- **18:00 - 20:00**: Test de rendering
- **20:00 - 22:00**: Test de interacción

### Guión

**[16:00 - 18:00]**
*(Código de fixture)*
"Para componentes, usamos ComponentFixture. Configuramos TestBed con imports, creamos el fixture, y accedemos al componentInstance."

**[18:00 - 20:00]**
*(Test de rendering)*
"Después de cambiar un signal, DEBES llamar fixture.detectChanges(). Sin eso, el DOM no se actualiza. Es el error más común."

**[20:00 - 22:00]**
*(Test de interacción)*
"Para testear outputs, nos suscribimos con un spy. Para testear clicks, seleccionamos el elemento y hacemos click. Y verificamos que el spy fue llamado."

---

## Sección 6: Errores Comunes (22:00 - 25:00)

### Visual
- **22:00 - 23:00**: Error 1 - No limpiar spies
- **23:00 - 24:00**: Error 2 - Olvidar detectChanges
- **24:00 - 25:00**: Error 3 - Tests dependientes

### Guión

**[22:00 - 23:00]**
*(Código con X roja)*
"Error número 1: No limpiar los spies. Los spies persisten entre tests. Usa afterEach con jest.restoreAllMocks."

**[23:00 - 24:00]**
*(Código con X roja)*
"Error número 2: Olvidar detectChanges. El DOM no se actualiza solo. Llama fixture.detectChanges() después de cada cambio."

**[24:00 - 25:00]**
*(Código con X roja)*
"Error número 3: Tests dependientes. Cada test debe ser aislado. No compartas estado entre tests."

---

## Sección 7: Resumen y Cierre (25:00 - 27:00)

### Visual
- **25:00 - 26:00**: Resumen con puntos clave
- **26:00 - 27:00**: Call to action

### Guión

**[25:00 - 26:00]**
*(Animación con puntos clave)*
"Para resumir:
1. Testing es tu red de seguridad
2. Sigue la pirámide: muchos unit, pocos E2E
3. Usa el patrón AAA
4. Siempre llama detectChanges
5. Limpia los spies en afterEach"

**[26:00 - 27:00]**
*(Cara del presentador)*
"En los labs de hoy, vas a escribir tests para LoggerService, LoadingService, y componentes. Vas a alcanzar 80% de coverage.

Si este video te ayudó, dale like y suscríbete. Nos vemos en el próximo episodio donde hablaremos de CI/CD y Deployment."

---

## Notas de Producción

### Setup de Grabación
- **Cámara**: 1080p, fondo limpio
- **Micrófono**: Audio claro sin eco
- **Iluminación**: Bien iluminado, sin sombras
- **Software**: OBS Studio con escenas

### Escenas de OBS
1. **Intro**: Logo + título animado
2. **Presentador**: Cámara + fondo
3. **Código**: VS Code con syntax highlighting
4. **Diagrama**: Pirámide de testing
5. **Demo**: Código en vivo

### B-Roll
- Pirámide de testing animada
- Código en VS Code
- Terminal con tests pasando
- Coverage report

### Thumbnails
- Opción 1: Código de test con check verde
- Opción 2: Pirámide de testing
- Opción 3: Presentador + código

### SEO
- **Título**: "Angular 21 Testing: Unit Tests con Jest desde Cero"
- **Descripción**: "Aprende a escribir unit tests en Angular 21 con Jest. Testing de servicios, componentes, guards e interceptors. Tutorial completo."
- **Tags**: Angular 21, Jest, Unit Testing, Angular testing, Jest tutorial

---

## Recursos Adicionales

### Links en Descripción
1. Código del episodio: [GitHub link]
2. Jest Docs: https://jestjs.io
3. Angular Testing Guide: https://angular.dev/guide/testing
4. Curso completo: [Playlist link]

### Pinned Comment
"¿Tienes preguntas sobre testing? Déjalas en los comentarios y te ayudo. 👇

Código del episodio: [link]
Curso completo: [link]"

---

*Script de Video YouTube - Día 17 - Testing - Curso Angular 21*
