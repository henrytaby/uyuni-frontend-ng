# Slides: Día 18 - CI/CD y Deployment

## Slide 1: Título

# CI/CD y Deployment

## Día 18 - Módulo 7: Testing y CI/CD

### ¡Último día del curso!

---

## Slide 2: Agenda

### Temas de Hoy

1. ✅ Por qué CI/CD importa
2. ✅ GitHub Actions
3. ✅ Husky y Pre-commit Hooks
4. ✅ Pipeline de CI
5. ✅ Pipeline de CD
6. ✅ Cierre del Curso

---

## Slide 3: Hook - El Despliegue que Falló

### Historia Real (2019)

**Un push el viernes a las 5pm**

- Código rompió el checkout
- $100,000 perdidos en ventas
- Nadie se dio cuenta hasta el lunes

> "Sin CI/CD, confías en la suerte"

---

## Slide 4: Qué es CI/CD

| Concepto | Definición |
|----------|------------|
| **CI** | Continuous Integration |
| **CD** | Continuous Deployment |
| **Pipeline** | Secuencia de pasos automatizados |

---

## Slide 5: El Pipeline Típico

```
Push → Install → Lint → Test → Build → Deploy
  ↓       ↓       ↓      ↓       ↓        ↓
GitHub  npm ci  ESLint  Jest   Angular  Platform
```

### Cada paso es un quality gate

---

## Slide 6: Beneficios de CI/CD

1. **Detección temprana** de bugs
2. **Consistencia** en el proceso
3. **Velocidad** de deployment
4. **Confianza** en el código
5. **Trazabilidad** de cambios

---

## Slide 7: GitHub Actions - Estructura

```yaml
name: CI

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test
```

---

## Slide 8: Triggers

```yaml
on:
  # Push a ramas
  push:
    branches: [main, develop]
  
  # Pull requests
  pull_request:
    branches: [main]
  
  # Manual
  workflow_dispatch:
  
  # Programado
  schedule:
    - cron: '0 0 * * *'
```

---

## Slide 9: Jobs con Dependencias

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm test

  build:
    needs: test    # ← Espera a test
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
```

---

## Slide 10: Caching

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'  # ← Cache automático
```

### Acelera pipelines significativamente

---

## Slide 11: Secrets

```yaml
- name: Deploy
  env:
    API_KEY: ${{ secrets.API_KEY }}
  run: npm run deploy
```

### NUNCA hardcodees secrets

---

## Slide 12: Artifacts

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: coverage
    path: coverage/
```

### Comparte archivos entre jobs

---

## Slide 13: Pipeline de CI Completo

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  test:
    needs: lint
    # ... test steps

  build:
    needs: test
    # ... build steps
```

---

## Slide 14: Husky - Pre-commit Hooks

### ¿Qué es?

Ejecuta checks antes de cada commit

### Instalación

```bash
npm install husky lint-staged --save-dev
npx husky init
```

---

## Slide 15: Configurar Husky

```json
// package.json
{
  "scripts": {
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.ts": ["eslint --fix"],
    "*.html": ["eslint --fix"]
  }
}
```

---

## Slide 16: Pre-commit Hook

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

### Se ejecuta ANTES de cada commit

---

## Slide 17: Commitlint

### Formato de Commits

```
feat: add new feature
fix: fix bug in login
docs: update README
style: format code
refactor: refactor service
test: add unit tests
chore: update dependencies
```

---

## Slide 18: Error Común #1

### No Cachear Dependencias

```yaml
# ❌ Mal
- run: npm install

# ✅ Bien
- uses: actions/setup-node@v4
  with:
    cache: 'npm'
- run: npm ci
```

---

## Slide 19: Error Común #2

### Secrets en Código

```yaml
# ❌ Mal
- run: deploy --key=abc123

# ✅ Bien
- run: deploy --key=${{ secrets.DEPLOY_KEY }}
```

---

## Slide 20: Error Común #3

### npm install vs npm ci

```yaml
# ❌ Mal - Puede cambiar lockfile
- run: npm install

# ✅ Bien - Determinístico
- run: npm ci
```

---

## Slide 21: Resumen del Día

| Tema | Aprendido |
|------|-----------|
| GitHub Actions | Workflows, jobs, steps |
| Caching | Acelerar pipelines |
| Secrets | Manejar credenciales |
| Husky | Pre-commit hooks |
| Artifacts | Compartir archivos |

---

## Slide 22: Resumen del Curso

| Módulo | Días | Temas |
|--------|------|-------|
| 1 | 1-3 | Fundamentos y Arquitectura |
| 2 | 4-6 | Core Services |
| 3 | 7-9 | Autenticación |
| 4 | 10-12 | RxJS y Estado |
| 5 | 13-14 | UI y Estilos |
| 6 | 15-16 | Features |
| 7 | 17-18 | Testing y CI/CD |

---

## Slide 23: Lo que Lograste

### Ahora puedes:

1. ✅ Crear apps Angular 21 con arquitectura profesional
2. ✅ Implementar autenticación JWT
3. ✅ Gestionar estado con Signals y RxJS
4. ✅ Crear UI con PrimeNG y Tailwind
5. ✅ Escribir tests con Jest
6. ✅ Configurar CI/CD con GitHub Actions

---

## Slide 24: Próximos Pasos

1. **Practicar** - Aplica en proyectos personales
2. **Contribuir** - Open source
3. **Especializarte** - Profundiza en áreas
4. **Compartir** - Enseña a otros

---

## Slide 25: Recursos

### Documentación

- [Angular Docs](https://angular.dev)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Jest](https://jestjs.io)
- [PrimeNG](https://primeng.org)

---

## Slide 26: ¡Felicidades!

# 🎉 Has completado el Curso de Angular 21

### 18 días de aprendizaje intensivo

### Una aplicación completa

### Habilidades profesionales

---

## Slide 27: Despedida

> "El viaje no termina aquí. Angular evoluciona constantemente. Mantente actualizado. Practica. Y sobre todo, disfruta construyendo software."

### ¡Nos vemos en el código!

---

## Slide 28: Q&A

# ¿Preguntas?

### Última oportunidad para resolver dudas

---

*Slides - Día 18 - CI/CD y Deployment - Curso Angular 21*
