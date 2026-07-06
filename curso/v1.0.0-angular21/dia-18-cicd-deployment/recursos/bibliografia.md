# Bibliografía: Día 18 - CI/CD y Deployment

## Documentación Oficial

### GitHub Actions

| Recurso | URL | Descripción |
|---------|-----|-------------|
| GitHub Actions Docs | https://docs.github.com/en/actions | Documentación oficial |
| Workflow Syntax | https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions | Sintaxis de workflows |
| Events | https://docs.github.com/en/actions/reference/events-that-trigger-workflows | Triggers disponibles |
| Secrets | https://docs.github.com/en/actions/security-guides/encrypted-secrets | Manejo de secrets |

### Husky

| Recurso | URL | Descripción |
|---------|-----|-------------|
| Husky Docs | https://typicode.github.io/husky/ | Documentación oficial |
| lint-staged | https://github.com/okonet/lint-staged | Lint-staged GitHub |
| commitlint | https://commitlint.js.org/ | Commitlint docs |

---

## Artículos y Tutoriales

### GitHub Actions

1. **"GitHub Actions for Angular"**
   - Autor: Angular Blog
   - URL: https://blog.angular.dev/
   - Tema: CI/CD para Angular

2. **"Complete GitHub Actions Guide"**
   - Autor: GitHub
   - URL: https://docs.github.com/en/actions/learn-github-actions
   - Tema: Guía completa

3. **"Caching in GitHub Actions"**
   - Autor: GitHub Docs
   - URL: https://docs.github.com/en/actions/using-workflows/caching-dependencies
   - Tema: Caching strategies

### Husky y Git Hooks

1. **"Husky v9 Guide"**
   - Autor: Typicode
   - URL: https://typicode.github.io/husky/
   - Tema: Configuración de Husky

2. **"Conventional Commits"**
   - Autor: Conventional Commits
   - URL: https://www.conventionalcommits.org/
   - Tema: Formato de commits

---

## Libros Recomendados

### CI/CD

| Libro | Autor | Año | Tema |
|-------|-------|-----|------|
| "Continuous Delivery" | Jez Humble | 2010 | Fundamentos de CD |
| "DevOps Handbook" | Gene Kim | 2016 | DevOps practices |
| "Accelerate" | Nicole Forsgren | 2018 | Métricas de rendimiento |

### Git y Version Control

| Libro | Autor | Año | Tema |
|-------|-------|-----|------|
| "Pro Git" | Scott Chacon | 2014 | Git completo |
| "Git for Teams" | Emma Jane Westby | 2015 | Git en equipo |

---

## Videos y Cursos

### YouTube

1. **"GitHub Actions Crash Course"**
   - Canal: Traversy Media
   - Duración: 30 min
   - URL: https://www.youtube.com/@TraversyMedia/search?query=github%20actions

2. **"Husky Tutorial"**
   - Canal: Web Dev Simplified
   - Duración: 15 min
   - URL: https://www.youtube.com/@WebDevSimplified/search?query=husky

3. **"CI/CD for Angular"**
   - Canal: Angular University
   - Duración: 45 min
   - URL: https://www.youtube.com/@AngularUniversity/search?query=ci%2Fcd

### Cursos Online

1. **"GitHub Actions Certification"**
   - Plataforma: GitHub Learning
   - Duración: 4 horas
   - Nivel: Intermedio

2. **"DevOps with GitHub Actions"**
   - Plataforma: Udemy
   - Duración: 8 horas
   - Nivel: Avanzado

---

## Herramientas

### CI/CD Platforms

| Herramienta | Uso | URL |
|-------------|-----|-----|
| GitHub Actions | CI/CD en GitHub | https://github.com/features/actions |
| GitLab CI | CI/CD en GitLab | https://docs.gitlab.com/ee/ci/ |
| CircleCI | CI/CD cloud | https://circleci.com/ |
| Jenkins | CI/CD self-hosted | https://www.jenkins.io/ |

### Git Hooks Tools

| Herramienta | Uso |
|-------------|-----|
| Husky | Git hooks manager |
| lint-staged | Lint solo staged files |
| commitlint | Validar mensajes de commit |
| standard-version | Changelog automático |

### Deployment Platforms

| Plataforma | Uso |
|------------|-----|
| Vercel | Frontend deployment |
| Netlify | Static sites |
| GitHub Pages | Free hosting |
| AWS S3 | Cloud storage |
| Firebase Hosting | Google cloud |

---

## Patrones y Best Practices

### Pipeline Structure

```yaml
# Estructura típica
jobs:
  lint:      # 1. Calidad de código
  test:      # 2. Tests
  build:     # 3. Build
  deploy:    # 4. Deploy (solo main)
```

### Caching Strategy

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'  # Cache npm dependencies
```

### Secrets Management

```yaml
# ✅ Bien - Usar secrets
env:
  API_KEY: ${{ secrets.API_KEY }}

# ❌ Mal - Hardcodear
env:
  API_KEY: abc123
```

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: Nueva feature
- `fix`: Bug fix
- `docs`: Documentación
- `style`: Formato
- `refactor`: Refactoring
- `test`: Tests
- `chore`: Mantenimiento
- `ci`: CI/CD

---

## Comandos Útiles

### GitHub Actions CLI

```bash
# Ver workflows
gh workflow list

# Ejecutar workflow manualmente
gh workflow run ci.yml

# Ver runs
gh run list

# Ver logs
gh run view <run-id>
```

### Husky Commands

```bash
# Instalar
npm install husky --save-dev

# Inicializar
npx husky init

# Añadir hook
echo "npm test" > .husky/pre-push

# Deshabilitar temporalmente
HUSKY=0 git commit -m "..."
```

### Git Hooks

```bash
# Saltar hooks (NO recomendado)
git commit --no-verify -m "..."

# Ver hooks disponibles
ls .husky/
```

---

## Glosario

| Término | Definición |
|---------|------------|
| **CI** | Continuous Integration - Integrar código frecuentemente |
| **CD** | Continuous Deployment - Desplegar automáticamente |
| **Workflow** | Configuración de un pipeline en GitHub Actions |
| **Job** | Unidad de trabajo en un workflow |
| **Step** | Paso individual dentro de un job |
| **Artifact** | Archivo producido por un job |
| **Secret** | Variable encriptada en GitHub |
| **Runner** | Servidor que ejecuta los jobs |
| **Hook** | Script que se ejecuta en eventos de Git |
| **Staged** | Archivos listos para commit |

---

## Próximos Pasos

1. **Practicar**: Crear pipelines para proyectos personales
2. **Automatizar**: Añadir más checks automáticos
3. **Monitorear**: Configurar alertas de fallos
4. **Mejorar**: Optimizar tiempos de pipeline

---

## Recursos de Cierre del Curso

### Documentación Angular

- [Angular Docs](https://angular.dev)
- [Angular CLI](https://angular.io/cli)
- [Angular Material](https://material.angular.io)

### Comunidad

- [Angular Reddit](https://reddit.com/r/angular)
- [Angular Discord](https://discord.gg/angular)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/angular)

### Mantente Actualizado

- [Angular Blog](https://blog.angular.io)
- [Angular Twitter](https://twitter.com/angular)
- [Angular YouTube](https://youtube.com/angular)

---

*Bibliografía - Día 18 - CI/CD y Deployment - Curso Angular 21*
