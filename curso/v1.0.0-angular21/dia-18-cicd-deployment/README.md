# Día 18: CI/CD y Deployment

## Información General

| Atributo | Valor |
|----------|-------|
| **Módulo** | 7 - Testing y CI/CD |
| **Duración** | 3 horas |
| **Prerrequisitos** | Días 1-17 completados |
| **Nivel** | Intermedio |

## Objetivos de Aprendizaje

Al finalizar este día, el estudiante será capaz de:

1. **Configurar GitHub Actions** para CI/CD
2. **Crear pipelines** de build y test
3. **Configurar deployment** a diferentes entornos
4. **Implementar Husky** para pre-commit hooks
5. **Automatizar quality checks** en el pipeline

## Estructura de Archivos

```
dia-18-cicd-deployment/
├── README.md                 # Este archivo
├── contenido.md              # Contenido detallado
├── slides/
│   └── dia-18-cicd-deployment_Marp.md       # Slides de la clase
├── ejercicios/
│   ├── lab-01.md            # Lab: Configurar GitHub Actions
│   └── lab-02.md            # Lab: Deployment pipeline
├── assessment/
│   └── preguntas.md         # Preguntas de evaluación
└── recursos/
    ├── bibliografia.md       # Recursos adicionales
    ├── cheatsheet.md         # Referencia rápida
    ├── script-audio.md       # Guion de podcast
    └── script-video-youtube.md # Guion de video
```

## Temas Cubiertos

### 1. GitHub Actions
- Workflows y jobs
- Triggers y events
- Secrets y variables
- Artifacts y caching

### 2. Pipeline de CI
- Install dependencies
- Lint check
- Test execution
- Build production

### 3. Pipeline de CD
- Build optimization
- Environment configuration
- Deployment strategies
- Rollback procedures

### 4. Husky y Pre-commit Hooks
- Instalación y configuración
- Lint-staged
- Commitlint
- Automated checks

### 5. Quality Gates
- Coverage thresholds
- Lint rules
- Security scanning
- Performance budgets

## Conceptos Clave

| Concepto | Descripción |
|----------|-------------|
| **CI** | Continuous Integration - Integrar código frecuentemente |
| **CD** | Continuous Deployment - Desplegar automáticamente |
| **Pipeline** | Secuencia de pasos automatizados |
| **Workflow** | Configuración de GitHub Actions |
| **Job** | Unidad de trabajo en un workflow |
| **Artifact** | Archivo producido por un job |

## Ejemplos de Código

### GitHub Actions Workflow

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
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Run tests
        run: npm test -- --coverage
      
      - name: Build
        run: npm run build
```

### Husky Configuration

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

### Pre-commit Hook

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

## Labs del Día

| Lab | Título | Duración | Descripción |
|-----|--------|----------|-------------|
| 01 | GitHub Actions | 45 min | Configurar pipeline de CI |
| 02 | Deployment | 45 min | Configurar deployment automático |

## Recursos Necesarios

- Cuenta de GitHub
- Repositorio del proyecto
- Node.js 20+
- Acceso a plataforma de deployment (Vercel, Netlify, etc.)

## Evaluación

- 10 preguntas de opción múltiple
- 2 ejercicios prácticos
- Pipeline funcional en GitHub

## Cierre del Curso

Este es el último día del curso. Al completar este día, tendrás:
- Una aplicación Angular 21 completa
- Tests con coverage > 80%
- CI/CD configurado
- Deployment automatizado

---

*Día 18 - Módulo 7: Testing y CI/CD - Curso Angular 21 - UyuniAdmin Frontend*
