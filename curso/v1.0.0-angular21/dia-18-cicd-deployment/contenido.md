# Contenido Detallado: Día 18 - CI/CD y Deployment

## Overview

| Sección | Duración | Descripción |
|---------|----------|-------------|
| 1. Hook | 5 min | Introducción con problema real |
| 2. Contexto | 10 min | Por qué CI/CD importa |
| 3. Explicación | 40 min | GitHub Actions, Husky, pipelines |
| 4. Demo | 30 min | Configuración en vivo |
| 5. Error Común | 15 min | Errores típicos |
| 6. Mini Reto | 20 min | Ejercicio práctico |
| 7. Cierre | 10 min | Resumen y cierre del curso |

---

## 1. Hook: El Despliegue que Falló (5 min)

### Historia Real

"En 2019, un desarrollador hizo push a producción un viernes a las 5pm. El código rompió el checkout. La empresa perdió $100,000 en ventas durante el fin de semana. Nadie se dio cuenta hasta el lunes."

### Conexión con CI/CD

"¿Cómo se previene esto? Con CI/CD:

- **CI (Continuous Integration)**: Cada push corre tests automáticamente
- **CD (Continuous Deployment)**: Solo código que pasa tests se despliega
- **Quality Gates**: Si algo falla, el despliegue se detiene

Sin CI/CD, confías en la suerte. Con CI/CD, confías en automatización."

### Pregunta Inicial

"¿Cuántas veces has roto producción por un cambio que 'parecía inocente'? CI/CD previene eso."

---

## 2. Contexto: Por Qué CI/CD Importa (10 min)

### Qué es CI/CD

| Concepto | Definición |
|----------|------------|
| **CI** | Integrar código frecuentemente, verificando con tests |
| **CD** | Desplegar automáticamente a producción |
| **Pipeline** | Secuencia de pasos automatizados |

### Beneficios

1. **Detección temprana de bugs**: Los tests corren en cada push
2. **Consistencia**: El mismo proceso siempre
3. **Velocidad**: Deploy en minutos, no horas
4. **Confianza**: Si pasa el pipeline, está listo
5. **Trazabilidad**: Historial de qué se desplegó y cuándo

### El Pipeline Típico

```
Push → Install → Lint → Test → Build → Deploy
  ↓       ↓       ↓      ↓       ↓        ↓
GitHub  npm ci  ESLint  Jest   Angular  Platform
```

### Herramientas del Ecosistema

| Herramienta | Uso |
|-------------|-----|
| **GitHub Actions** | CI/CD en GitHub |
| **GitLab CI** | CI/CD en GitLab |
| **Jenkins** | CI/CD self-hosted |
| **Husky** | Pre-commit hooks |
| **Lint-staged** | Lint solo archivos modificados |

---

## 3. Explicación: GitHub Actions (40 min)

### 3.1 Estructura de un Workflow

```yaml
# .github/workflows/ci.yml
name: CI                    # Nombre del workflow

on:                         # Cuándo ejecutar
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:                       # Trabajos a ejecutar
  build:
    runs-on: ubuntu-latest  # Runner
    
    steps:                  # Pasos del job
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
```

### 3.2 Triggers (Eventos)

```yaml
on:
  # Push a ramas específicas
  push:
    branches: [main, develop]
  
  # Pull requests
  pull_request:
    branches: [main]
  
  # Manual
  workflow_dispatch:
  
  # Programado
  schedule:
    - cron: '0 0 * * *'  # Diario a medianoche
```

### 3.3 Jobs y Steps

```yaml
jobs:
  # Job 1: Test
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test
  
  # Job 2: Build (depende de test)
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
```

### 3.4 Caching

```yaml
- name: Cache node modules
  uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

### 3.5 Secrets y Variables

```yaml
- name: Deploy
  env:
    API_KEY: ${{ secrets.API_KEY }}
    ENVIRONMENT: ${{ vars.ENVIRONMENT }}
  run: |
    npm run deploy -- --api-key=$API_KEY
```

### 3.6 Artifacts

```yaml
- name: Upload coverage
  uses: actions/upload-artifact@v4
  with:
    name: coverage-report
    path: coverage/

- name: Download coverage
  uses: actions/download-artifact@v4
  with:
    name: coverage-report
```

---

## 4. Explicación: Husky y Pre-commit Hooks

### 4.1 Instalación

```bash
# Instalar Husky
npm install husky --save-dev

# Inicializar Husky
npx husky init

# Crear hook
echo "npx lint-staged" > .husky/pre-commit
```

### 4.2 Configuración de package.json

```json
{
  "scripts": {
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.ts": ["eslint --fix"],
    "*.html": ["eslint --fix"],
    "*.scss": ["stylelint --fix"]
  }
}
```

### 4.3 Hooks Disponibles

| Hook | Cuándo se ejecuta |
|------|-------------------|
| `pre-commit` | Antes de cada commit |
| `pre-push` | Antes de cada push |
| `commit-msg` | Para validar mensaje de commit |
| `pre-rebase` | Antes de rebase |

### 4.4 Commitlint

```bash
# Instalar
npm install @commitlint/cli @commitlint/config-conventional --save-dev

# Configurar
echo "module.exports = { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js

# Añadir a hook
echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg
```

### 4.5 Formato de Commits

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

## 5. Demo: Pipeline Completo (30 min)

### Demo 1: Workflow de CI

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
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
      
      - name: Run ESLint
        run: npm run lint

  test:
    runs-on: ubuntu-latest
    needs: lint
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
        run: npm test -- --coverage --coverageReporters=lcov
      
      - name: Upload coverage
        uses: actions/upload-artifact@v4
        with:
          name: coverage
          path: coverage/

  build:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Upload build
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
```

### Demo 2: Workflow de CD

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Download build
        uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist/
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Demo 3: Husky Setup

```bash
# 1. Instalar Husky
npm install husky lint-staged --save-dev

# 2. Inicializar
npx husky init

# 3. Configurar pre-commit
cat > .husky/pre-commit << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
EOF

# 4. Configurar package.json
# Añadir:
# "lint-staged": {
#   "*.ts": ["eslint --fix"],
#   "*.html": ["eslint --fix"]
# }

# 5. Probar
git add .
git commit -m "test: test husky"
```

---

## 6. Error Común: Errores Típicos en CI/CD (15 min)

### Error 1: No Cachear Dependencias

```yaml
# ❌ Mal - Sin cache
- run: npm install

# ✅ Bien - Con cache
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'
- run: npm ci
```

### Error 2: Secrets en Código

```yaml
# ❌ Mal - Secret hardcodeado
- run: deploy --key=abc123

# ✅ Bien - Secret desde GitHub
- run: deploy --key=${{ secrets.DEPLOY_KEY }}
```

### Error 3: No Usar npm ci

```yaml
# ❌ Mal - npm install puede cambiar lockfile
- run: npm install

# ✅ Bien - npm ci es determinístico
- run: npm ci
```

### Error 4: Jobs Sin Dependencias

```yaml
# ❌ Mal - Jobs corren en paralelo sin orden
jobs:
  test:
    runs-on: ubuntu-latest
  build:
    runs-on: ubuntu-latest

# ✅ Bien - Build depende de test
jobs:
  test:
    runs-on: ubuntu-latest
  build:
    needs: test
    runs-on: ubuntu-latest
```

### Error 5: No Limitar Triggers

```yaml
# ❌ Mal - Corre en cualquier push
on: push

# ✅ Bien - Solo en ramas importantes
on:
  push:
    branches: [main, develop]
```

---

## 7. Mini Reto: Crear Pipeline Completo (20 min)

### Objetivo

Crear un pipeline de CI/CD que:
1. Corra en cada push a main/develop
2. Ejecute lint, test, y build
3. Cachee node_modules
4. Suba artifacts de coverage y build

### Código Base

```yaml
# .github/workflows/ci.yml
# TODO: Completar el workflow

name: CI

on:
  # TODO: Configurar triggers

jobs:
  # TODO: Añadir job de lint
  
  # TODO: Añadir job de test (depende de lint)
  
  # TODO: Añadir job de build (depende de test)
```

### Solución

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

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
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm test -- --coverage
      - uses: actions/upload-artifact@v4
        with:
          name: coverage
          path: coverage/

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
```

---

## 8. Cierre: Resumen y Cierre del Curso (10 min)

### Resumen del Día

| Tema | Aprendido |
|------|-----------|
| **GitHub Actions** | Workflows, jobs, steps, triggers |
| **Caching** | Acelerar pipelines con cache |
| **Secrets** | Manejar credenciales de forma segura |
| **Artifacts** | Compartir archivos entre jobs |
| **Husky** | Pre-commit hooks para calidad |
| **Lint-staged** | Lint solo archivos modificados |

### Resumen del Curso

| Módulo | Días | Temas |
|--------|------|-------|
| 1 | 1-3 | Fundamentos y Arquitectura |
| 2 | 4-6 | Core Services |
| 3 | 7-9 | Sistema de Autenticación |
| 4 | 10-12 | RxJS y Estado Avanzado |
| 5 | 13-14 | UI y Estilos |
| 6 | 15-16 | Features y Componentes |
| 7 | 17-18 | Testing y CI/CD |

### Lo que Lograste

Al completar este curso, ahora puedes:

1. ✅ Crear aplicaciones Angular 21 con arquitectura DDD Lite
2. ✅ Implementar autenticación con JWT
3. ✅ Gestionar estado con Signals y RxJS
4. ✅ Crear UI con PrimeNG y Tailwind CSS
5. ✅ Escribir tests con Jest
6. ✅ Configurar CI/CD con GitHub Actions

### Próximos Pasos

1. **Practicar**: Aplica lo aprendido en proyectos personales
2. **Contribuir**: Contribuye a proyectos open source
3. **Especializarte**: Profundiza en áreas específicas
4. **Compartir**: Enseña a otros lo que aprendiste

### Recursos para Continuar

- [Angular Docs](https://angular.dev)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Jest Docs](https://jestjs.io)
- [PrimeNG Docs](https://primeng.org)

---

## Checklist de Aprendizaje

- [ ] Entiendo qué es CI/CD
- [ ] Sé configurar GitHub Actions
- [ ] Puedo crear workflows con jobs
- [ ] Entiendo cómo usar secrets
- [ ] Sé configurar Husky
- [ ] Puedo crear pre-commit hooks

---

## Despedida

"¡Felicidades por completar el Curso de Angular 21!

Has aprendido desde los fundamentos hasta deployment. Has construido una aplicación completa con arquitectura profesional.

El viaje no termina aquí. Angular evoluciona constantemente. Mantente actualizado. Practica. Y sobre todo, disfruta construyendo software.

¡Nos vemos en el código!"

---

*Día 18 - Módulo 7: Testing y CI/CD - Curso Angular 21 - UyuniAdmin Frontend*
