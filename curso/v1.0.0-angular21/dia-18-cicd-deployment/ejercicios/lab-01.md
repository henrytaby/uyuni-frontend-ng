# Lab 01: Configurar GitHub Actions

## Información del Lab

| Atributo | Valor |
|----------|-------|
| **Duración** | 45 minutos |
| **Dificultad** | Intermedio |
| **Objetivo** | Crear pipeline de CI con GitHub Actions |

---

## Objetivos de Aprendizaje

Al completar este lab, serás capaz de:

1. Crear workflows de GitHub Actions
2. Configurar triggers para push y PR
3. Implementar caching de dependencias
4. Subir artifacts de coverage y build

---

## Prerrequisitos

- Repositorio de GitHub con el proyecto
- Cuenta de GitHub activa
- Proyecto con tests configurados

---

## Ejercicio 1: Crear Workflow Básico (15 min)

### Descripción

Crear un workflow de CI que se ejecute en cada push a main y develop.

### Instrucciones Paso a Paso

#### Paso 1: Crear directorio de workflows

```bash
mkdir -p .github/workflows
```

#### Paso 2: Crear archivo ci.yml

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
```

#### Paso 3: Commit y push

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add GitHub Actions workflow"
git push origin main
```

#### Paso 4: Verificar en GitHub

1. Ir al repositorio en GitHub
2. Click en "Actions" tab
3. Ver el workflow corriendo

---

## Ejercicio 2: Añadir Caching (10 min)

### Descripción

Añadir caching de npm para acelerar el pipeline.

### Instrucciones

#### Actualizar ci.yml

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'  # ← Añadir cache
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
```

### Verificar

El segundo run debería ser más rápido gracias al cache.

---

## Ejercicio 3: Separar Jobs (10 min)

### Descripción

Separar lint, test y build en jobs independientes.

### Instrucciones

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
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm test -- --coverage
      
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
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      
      - name: Upload build
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
```

---

## Ejercicio 4: Añadir Quality Gates (10 min)

### Descripción

Añadir verificación de coverage mínimo.

### Instrucciones

```yaml
# Añadir al job de test
- name: Check coverage
  run: |
    COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
    if (( $(echo "$COVERAGE < 80" | bc -l) )); then
      echo "Coverage is below 80%"
      exit 1
    fi
```

### Alternativa con Jest

```json
// jest.config.js
module.exports = {
  // ... other config
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 75,
      lines: 80,
      statements: 80
    }
  }
};
```

---

## Solución Completa

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
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
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
    name: Test
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests with coverage
        run: npm test -- --coverage --coverageReporters=lcov
      
      - name: Upload coverage report
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/
          retention-days: 7

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: test
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build production
        run: npm run build -- --configuration=production
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
          retention-days: 7

  # Job adicional: Análisis de bundle
  analyze:
    name: Analyze Bundle
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Download build
        uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist/
      
      - name: Check bundle size
        run: |
          SIZE=$(du -sh dist/ | cut -f1)
          echo "Bundle size: $SIZE"
          # Alertar si es muy grande
          if [[ $SIZE =~ ([0-9]+)M ]]; then
            SIZE_NUM=${BASH_REMATCH[1]}
            if [ $SIZE_NUM -gt 5 ]; then
              echo "Warning: Bundle size exceeds 5MB"
            fi
          fi
```

---

## Verificación

### Correr el workflow

```bash
# Hacer un cambio pequeño
echo "# Test" >> README.md

# Commit y push
git add .
git commit -m "test: trigger CI"
git push origin main
```

### Verificar en GitHub

1. Ir a Actions tab
2. Ver los 4 jobs corriendo
3. Verificar que todos pasan
4. Descargar artifacts

---

## Checklist de Completitud

- [ ] Workflow creado en .github/workflows/ci.yml
- [ ] Triggers configurados para push y PR
- [ ] Caching de npm configurado
- [ ] Jobs separados: lint, test, build
- [ ] Artifacts subidos: coverage y dist
- [ ] Workflow pasa en GitHub

---

## Retos Adicionales

### Reto 1: Añadir job de security audit

Añadir un job que corra `npm audit` para detectar vulnerabilidades.

### Reto 2: Añadir job de bundle analysis

Usar `webpack-bundle-analyzer` para generar reporte de bundle.

### Reto 3: Notificaciones Slack

Añadir notificación a Slack cuando el pipeline falla.

---

*Lab 01 - Día 18 - CI/CD y Deployment - Curso Angular 21*
