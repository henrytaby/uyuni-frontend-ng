# Cheatsheet: CI/CD y Deployment

## GitHub Actions

### Estructura Básica

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

## Triggers

### Push

```yaml
on:
  push:
    branches: [main, develop]
```

### Pull Request

```yaml
on:
  pull_request:
    branches: [main]
```

### Manual

```yaml
on:
  workflow_dispatch:
```

### Programado

```yaml
on:
  schedule:
    - cron: '0 0 * * *'  # Diario a medianoche
```

---

## Jobs

### Job Simple

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm test
```

### Job con Dependencias

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    
  build:
    needs: test
    runs-on: ubuntu-latest
```

### Job Condicional

```yaml
jobs:
  deploy:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
```

---

## Steps

### Checkout

```yaml
- uses: actions/checkout@v4
```

### Setup Node.js

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'
```

### Run Command

```yaml
- name: Install
  run: npm ci

- name: Test
  run: npm test -- --coverage
```

---

## Caching

### Cache de npm

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'
```

### Cache Manual

```yaml
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

---

## Secrets

### Usar Secrets

```yaml
- name: Deploy
  env:
    API_KEY: ${{ secrets.API_KEY }}
    DB_URL: ${{ secrets.DATABASE_URL }}
  run: npm run deploy
```

### Configurar Secrets

1. Ir a Settings > Secrets and variables > Actions
2. Click "New repository secret"
3. Añadir nombre y valor

---

## Artifacts

### Subir Artifact

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: coverage
    path: coverage/
    retention-days: 7
```

### Descargar Artifact

```yaml
- uses: actions/download-artifact@v4
  with:
    name: coverage
    path: coverage/
```

---

## Pipeline Completo

```yaml
name: CI/CD

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

  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: dist
      - # ... deploy steps
```

---

## Husky

### Instalación

```bash
npm install husky lint-staged --save-dev
npx husky init
```

### package.json

```json
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
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

### Pre-push Hook

```bash
# .husky/pre-push
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm test
```

---

## Commitlint

### Instalación

```bash
npm install @commitlint/cli @commitlint/config-conventional --save-dev
```

### Configuración

```javascript
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional']
};
```

### Commit-msg Hook

```bash
# .husky/commit-msg
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit $1
```

---

## Conventional Commits

### Formato

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Tipos

| Tipo | Uso |
|------|-----|
| `feat` | Nueva feature |
| `fix` | Bug fix |
| `docs` | Documentación |
| `style` | Formato |
| `refactor` | Refactoring |
| `test` | Tests |
| `chore` | Mantenimiento |
| `ci` | CI/CD |
| `perf` | Performance |

### Ejemplos

```bash
feat: add user authentication
fix: resolve login redirect issue
docs: update README
test: add unit tests for AuthService
ci: add GitHub Actions workflow
```

---

## Comandos CLI

### GitHub CLI

```bash
# Listar workflows
gh workflow list

# Ejecutar workflow
gh workflow run ci.yml

# Ver runs
gh run list

# Ver logs
gh run view <run-id>

# Re-run
gh run rerun <run-id>
```

### Husky

```bash
# Instalar
npx husky init

# Añadir hook
echo "npm test" > .husky/pre-push

# Deshabilitar temporalmente
HUSKY=0 git commit -m "..."
```

### Git

```bash
# Saltar hooks (NO recomendado)
git commit --no-verify -m "..."

# Ver hooks
ls .husky/
```

---

## Deployment Platforms

### GitHub Pages

```yaml
- uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./dist/app
```

### Vercel

```yaml
- uses: amondnet/vercel-action@v25
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
    vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Netlify

```yaml
- uses: netlify/actions/cli@master
  with:
    args: deploy --prod
  env:
    NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
    NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## Best Practices

### npm ci vs npm install

```yaml
# ✅ Bien - Determinístico
- run: npm ci

# ❌ Mal - Puede cambiar lockfile
- run: npm install
```

### Caching

```yaml
# ✅ Bien - Con cache
- uses: actions/setup-node@v4
  with:
    cache: 'npm'

# ❌ Mal - Sin cache
- uses: actions/setup-node@v4
```

### Secrets

```yaml
# ✅ Bien - Usar secrets
env:
  API_KEY: ${{ secrets.API_KEY }}

# ❌ Mal - Hardcodeado
env:
  API_KEY: abc123
```

### Job Dependencies

```yaml
# ✅ Bien - Ordenado
jobs:
  lint:
  test:
    needs: lint
  build:
    needs: test

# ❌ Mal - Sin orden
jobs:
  test:
  build:
  lint:
```

---

## Debugging

### Ver Logs

```bash
# GitHub CLI
gh run view <run-id>

# O en GitHub UI
# Actions > Run > Job > Step
```

### Debug Mode

```yaml
# Añadir a workflow
env:
  ACTIONS_STEP_DEBUG: true
  ACTIONS_RUNNER_DEBUG: true
```

### SSH into Runner

```yaml
- name: Debug
  uses: mxschmitt/action-tmate@v3
```

---

## Checklist de CI/CD

- [ ] Workflow configurado en .github/workflows/
- [ ] Triggers para push y PR
- [ ] Caching de dependencias
- [ ] Jobs separados: lint, test, build
- [ ] Artifacts subidos
- [ ] Secrets configurados
- [ ] Husky instalado
- [ ] Pre-commit hook activo
- [ ] Commitlint configurado

---

*Cheatsheet - Día 18 - CI/CD y Deployment - Curso Angular 21*
