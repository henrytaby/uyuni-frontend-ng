# Assessment: Día 18 - CI/CD y Deployment

## Información General

| Atributo | Valor |
|----------|-------|
| **Total de Preguntas** | 10 |
| **Tiempo Estimado** | 15 minutos |
| **Puntaje Mínimo** | 70% (7 respuestas correctas) |

---

## Preguntas de Opción Múltiple

### Pregunta 1: CI/CD

¿Qué significa CI?

- [ ] A) Code Integration
- [ ] B) Continuous Integration
- [ ] C) Central Infrastructure
- [ ] D) Code Implementation

<details>
<summary>Respuesta Correcta</summary>

**B) Continuous Integration**

CI significa Continuous Integration. Es la práctica de integrar código frecuentemente, verificando con tests automáticos.

</details>

---

### Pregunta 2: GitHub Actions

¿En qué directorio se colocan los workflows de GitHub Actions?

- [ ] A) `.github/workflows/`
- [ ] B) `.workflows/`
- [ ] C) `.ci/`
- [ ] D) `.actions/`

<details>
<summary>Respuesta Correcta</summary>

**A) `.github/workflows/`**

Los workflows de GitHub Actions se colocan en `.github/workflows/` con extensión `.yml` o `.yaml`.

</details>

---

### Pregunta 3: Triggers

¿Qué trigger ejecuta el workflow en cada push a main?

```yaml
on:
  push:
    branches: [main]
```

- [ ] A) Solo en pull requests
- [ ] B) En cada push a cualquier rama
- [ ] C) En cada push a la rama main
- [ ] D) Manualmente

<details>
<summary>Respuesta Correcta</summary>

**C) En cada push a la rama main**

El trigger `push` con `branches: [main]` ejecuta el workflow solo cuando hay push a la rama main.

</details>

---

### Pregunta 4: Jobs

¿Cómo se hace que un job dependa de otro?

- [ ] A) `requires: otroJob`
- [ ] B) `depends: otroJob`
- [ ] C) `needs: otroJob`
- [ ] D) `after: otroJob`

<details>
<summary>Respuesta Correcta</summary>

**C) `needs: otroJob`**

La palabra clave `needs` especifica las dependencias de un job. El job no comenzará hasta que los jobs en `needs` terminen exitosamente.

```yaml
jobs:
  build:
    needs: test
```

</details>

---

### Pregunta 5: Caching

¿Por qué es importante cachear dependencias en CI?

- [ ] A) Para reducir el tamaño del repositorio
- [ ] B) Para acelerar el pipeline
- [ ] C) Para evitar instalar dependencias
- [ ] D) Para tener versiones específicas

<details>
<summary>Respuesta Correcta</summary>

**B) Para acelerar el pipeline**

Cachear dependencias evita descargarlas en cada run, reduciendo significativamente el tiempo del pipeline.

</details>

---

### Pregunta 6: Secrets

¿Dónde se configuran los secrets en GitHub?

- [ ] A) En el archivo ci.yml
- [ ] B) En package.json
- [ ] C) En Settings > Secrets and variables > Actions
- [ ] D) En el código fuente

<details>
<summary>Respuesta Correcta</summary>

**C) En Settings > Secrets and variables > Actions**

Los secrets se configuran en el repositorio en Settings > Secrets and variables > Actions. Nunca se deben hardcodear en el código.

</details>

---

### Pregunta 7: npm ci vs npm install

¿Cuál es la diferencia entre `npm ci` y `npm install`?

- [ ] A) `npm ci` es más rápido
- [ ] B) `npm ci` usa package-lock.json y es determinístico
- [ ] C) `npm install` instala más rápido
- [ ] D) No hay diferencia

<details>
<summary>Respuesta Correcta</summary>

**B) `npm ci` usa package-lock.json y es determinístico**

`npm ci` (Clean Install) usa exactamente las versiones en package-lock.json, es determinístico y falla si hay inconsistencias. Ideal para CI.

</details>

---

### Pregunta 8: Husky

¿Qué es Husky?

- [ ] A) Un linter para JavaScript
- [ ] B) Un framework de testing
- [ ] C) Una herramienta para Git hooks
- [ ] D) Un bundler para Angular

<details>
<summary>Respuesta Correcta</summary>

**C) Una herramienta para Git hooks**

Husky permite ejecutar scripts en eventos de Git como pre-commit, pre-push, commit-msg, etc.

</details>

---

### Pregunta 9: Commitlint

¿Cuál es el formato correcto para un mensaje de commit según conventional commits?

- [ ] A) `Added new feature`
- [ ] B) `feat: add new feature`
- [ ] C) `[FEAT] add new feature`
- [ ] D) `ADD: new feature`

<details>
<summary>Respuesta Correcta</summary>

**B) `feat: add new feature`**

El formato conventional commit es: `type: description`. Los tipos comunes son: feat, fix, docs, style, refactor, test, chore.

</details>

---

### Pregunta 10: Artifacts

¿Para qué se usan los artifacts en GitHub Actions?

- [ ] A) Para cachear dependencias
- [ ] B) Para compartir archivos entre jobs o workflows
- [ ] C) Para almacenar secrets
- [ ] D) Para configurar el runner

<details>
<summary>Respuesta Correcta</summary>

**B) Para compartir archivos entre jobs o workflows**

Los artifacts permiten subir archivos (como coverage reports o builds) y descargarlos en otros jobs o workflows.

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: coverage
    path: coverage/
```

</details>

---

## Ejercicios Prácticos

### Ejercicio 1: Completar Workflow (5 min)

Completa el siguiente workflow para que corra tests y suba el coverage:

```yaml
name: CI

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      # TODO: Setup Node.js con cache
      
      # TODO: Instalar dependencias
      
      # TODO: Correr tests con coverage
      
      # TODO: Subir artifact de coverage
```

<details>
<summary>Solución</summary>

```yaml
name: CI

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test -- --coverage
      
      - name: Upload coverage
        uses: actions/upload-artifact@v4
        with:
          name: coverage
          path: coverage/
```

</details>

---

### Ejercicio 2: Configurar Pre-commit Hook (10 min)

Escribe los comandos para configurar Husky con lint-staged:

<details>
<summary>Solución</summary>

```bash
# 1. Instalar dependencias
npm install husky lint-staged --save-dev

# 2. Inicializar Husky
npx husky init

# 3. Configurar pre-commit hook
echo "npx lint-staged" > .husky/pre-commit

# 4. Añadir configuración a package.json
# "lint-staged": {
#   "*.ts": ["eslint --fix"]
# }
```

</details>

---

## Respuestas

| Pregunta | Respuesta |
|----------|-----------|
| 1 | B |
| 2 | A |
| 3 | C |
| 4 | C |
| 5 | B |
| 6 | C |
| 7 | B |
| 8 | C |
| 9 | B |
| 10 | B |

---

## Evaluación

| Puntaje | Resultado |
|---------|-----------|
| 10/10 | ¡Excelente! Dominas CI/CD |
| 8-9/10 | Muy bien. Repasa los conceptos que fallaste |
| 7/10 | Aprobado. Practica más con los labs |
| < 7 | Repasa el contenido del día antes de continuar |

---

## ¡Felicidades!

Has completado el assessment del último día del curso.

### Próximos Pasos

1. Revisa los conceptos que no dominas
2. Practica con proyectos personales
3. Contribuye a proyectos open source
4. ¡Sigue aprendiendo!

---

*Assessment - Día 18 - CI/CD y Deployment - Curso Angular 21*
