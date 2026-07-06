# Script de Video YouTube: Día 18 - CI/CD y Deployment

## Información del Video

| Atributo | Valor |
|----------|-------|
| **Título** | Angular 21 CI/CD: GitHub Actions + Husky desde Cero |
| **Duración** | 25-30 minutos |
| **Formato** | Tutorial con código en vivo |
| **Thumbnail** | Pipeline diagram con checks verdes |

---

## Estructura del Video

| Tiempo | Sección | Duración |
|--------|---------|----------|
| 0:00 | Intro y Hook | 2 min |
| 2:00 | GitHub Actions Basics | 4 min |
| 6:00 | Demo: Crear Workflow | 8 min |
| 14:00 | Demo: Husky Setup | 6 min |
| 20:00 | Errores Comunes | 3 min |
| 23:00 | Cierre del Curso | 4 min |

---

## Sección 1: Intro y Hook (0:00 - 2:00)

### Visual
- **0:00 - 0:15**: Pantalla con logo del curso y título
- **0:15 - 0:45**: Cara del presentador, fondo de oficina
- **0:45 - 2:00**: Animación del pipeline

### Guión

**[0:00 - 0:15]**
*(Pantalla con título animado)*
"Angular 21 CI/CD: GitHub Actions + Husky desde Cero"

**[0:15 - 0:45]**
*(Cara del presentador)*
"¡Hola! Bienvenidos al Día 18 del Curso de Angular 21. Y más importante: ¡Bienvenidos al último día! Hoy vamos a automatizar todo."

**[0:45 - 2:00]**
*(Animación: pipeline de CI/CD)*
"Imagina esto: haces push, y mágicamente tu código se testa, se buildea, y se despliega. Sin intervención manual. Eso es CI/CD. Y hoy vas a configurarlo."

---

## Sección 2: GitHub Actions Basics (2:00 - 6:00)

### Visual
- **2:00 - 4:00**: Diagrama de workflow
- **4:00 - 6:00**: Estructura de archivos

### Guión

**[2:00 - 4:00]**
*(Diagrama de workflow)*
"GitHub Actions funciona con workflows. Un workflow tiene triggers, jobs, y steps. Los triggers definen cuándo ejecutar: push, pull request, manual. Los jobs son las unidades de trabajo. Y los steps son las acciones individuales."

**[4:00 - 6:00]**
*(Estructura de archivos)*
"La configuración va en .github/workflows/. Archivos YAML con extensión .yml. Puedes tener múltiples workflows: uno para CI, otro para deploy, otro para release."

---

## Sección 3: Demo - Crear Workflow (6:00 - 14:00)

### Visual
- **6:00 - 8:00**: Crear archivo ci.yml
- **8:00 - 10:00**: Añadir jobs
- **10:00 - 12:00**: Configurar caching
- **12:00 - 14:00**: Push y verificar

### Guión

**[6:00 - 8:00]**
*(VS Code - crear archivo)*
"Vamos a crear nuestro primer workflow. Archivo: .github/workflows/ci.yml. Empezamos con el nombre y los triggers."

```yaml
name: CI
on:
  push:
    branches: [main, develop]
```

**[8:00 - 10:00]**
*(Añadir jobs)*
"Ahora añadimos los jobs. Empezamos con lint. Checkout, setup-node, npm ci, npm run lint."

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
```

**[10:00 - 12:00]**
*(Configurar caching)*
"Importantísimo: añadir cache. Sin esto, cada run descarga todas las dependencias. Añadimos cache: npm en setup-node."

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'  # ← Esto ahorra minutos
```

**[12:00 - 14:00]**
*(Push y verificar)*
"Ahora hacemos push y vamos a GitHub. En el tab Actions, vemos el workflow corriendo. Si todo está bien, vemos checks verdes."

---

## Sección 4: Demo - Husky Setup (14:00 - 20:00)

### Visual
- **14:00 - 16:00**: Instalar Husky
- **16:00 - 18:00**: Configurar pre-commit
- **18:00 - 20:00**: Probar hook

### Guión

**[14:00 - 16:00]**
*(Terminal - instalar)*
"Ahora vamos a configurar Husky para pre-commit hooks. Primero instalamos: npm install husky lint-staged --save-dev. Luego inicializamos: npx husky init."

**[16:00 - 18:00]**
*(Configurar package.json)*
"En package.json, añadimos la configuración de lint-staged. Para archivos .ts y .html, corre eslint --fix."

```json
"lint-staged": {
  "*.ts": ["eslint --fix"],
  "*.html": ["eslint --fix"]
}
```

**[18:00 - 20:00]**
*(Probar hook)*
"Ahora probamos. Hacemos un cambio, stageamos, y hacemos commit. Si hay errores de lint, el commit se bloquea. Si todo está bien, el commit pasa."

---

## Sección 5: Errores Comunes (20:00 - 23:00)

### Visual
- **20:00 - 21:00**: Error 1 - Sin cache
- **21:00 - 22:00**: Error 2 - Secrets hardcodeados
- **22:00 - 23:00**: Error 3 - npm install

### Guión

**[20:00 - 21:00]**
*(Código con X roja)*
"Error número 1: No cachear dependencias. Sin cache, cada run tarda 5 minutos más. Añade cache: npm."

**[21:00 - 22:00]**
*(Código con X roja)*
"Error número 2: Hardcodear secrets. NUNCA pongas API keys en el código. Usa secrets de GitHub."

**[22:00 - 23:00]**
*(Código con X roja)*
"Error número 3: Usar npm install en lugar de npm ci. npm ci es determinístico, usa exactamente lo que está en package-lock.json."

---

## Sección 6: Cierre del Curso (23:00 - 27:00)

### Visual
- **23:00 - 25:00**: Resumen del curso
- **25:00 - 27:00**: Despedida

### Guión

**[23:00 - 25:00]**
*(Animación: resumen de módulos)*
"Y así terminamos el Curso de Angular 21. 18 días de aprendizaje intensivo.

Días 1-3: Fundamentos y Arquitectura.
Días 4-6: Core Services.
Días 7-9: Autenticación.
Días 10-12: RxJS y Estado.
Días 13-14: UI y Estilos.
Días 15-16: Features y Componentes.
Días 17-18: Testing y CI/CD.

Has construido una aplicación completa con arquitectura profesional."

**[25:00 - 27:00]**
*(Cara del presentador)*
"¿Qué sigue? Practica. Construye proyectos personales. Contribuye a open source. Y sobre todo, disfruta construyendo software.

Si este curso te ayudó, dale like, suscríbete, y compártelo con otros desarrolladores.

Gracias por acompañarme en este viaje. ¡Nos vemos en el código!"

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
4. **Terminal**: Comandos de instalación
5. **GitHub**: Actions tab

### B-Roll
- Pipeline diagram animado
- Código en VS Code
- GitHub Actions corriendo
- Terminal con comandos

### Thumbnails
- Opción 1: Pipeline con checks verdes
- Opción 2: Presentador + código
- Opción 3: "Curso Completado" badge

### SEO
- **Título**: "Angular 21 CI/CD: GitHub Actions + Husky desde Cero"
- **Descripción**: "Aprende a configurar CI/CD en Angular 21 con GitHub Actions y Husky. Pipeline completo con lint, test, build y deploy. Último día del curso."
- **Tags**: Angular 21, CI/CD, GitHub Actions, Husky, Deployment

---

## Recursos Adicionales

### Links en Descripción
1. Código del episodio: [GitHub link]
2. GitHub Actions Docs: https://docs.github.com/en/actions
3. Husky Docs: https://typicode.github.io/husky/
4. Curso completo: [Playlist link]

### Pinned Comment
"¡Gracias por completar el Curso de Angular 21! 🎉

¿Qué te parejo el curso? ¿Qué mejorarías? Déjame tu comentario 👇

Código del episodio: [link]
Curso completo: [link]"

---

## Celebración

### Al Final del Video

- Añadir efecto de confeti
- Mensaje: "¡Felicidades por completar el curso!"
- Badge: "Angular 21 Developer"

---

*Script de Video YouTube - Día 18 - CI/CD y Deployment - Curso Angular 21*
