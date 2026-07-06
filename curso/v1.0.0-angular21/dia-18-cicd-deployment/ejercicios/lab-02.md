# Lab 02: Deployment Pipeline

## Información del Lab

| Atributo | Valor |
|----------|-------|
| **Duración** | 45 minutos |
| **Dificultad** | Intermedio |
| **Objetivo** | Configurar deployment automático con Husky |

---

## Objetivos de Aprendizaje

Al completar este lab, serás capaz de:

1. Configurar Husky para pre-commit hooks
2. Implementar lint-staged para checks automáticos
3. Configurar commitlint para mensajes de commit
4. Crear workflow de deployment

---

## Prerrequisitos

- Lab 01 completado
- Proyecto con ESLint configurado
- Repositorio de GitHub

---

## Ejercicio 1: Configurar Husky (15 min)

### Descripción

Instalar y configurar Husky para pre-commit hooks.

### Instrucciones Paso a Paso

#### Paso 1: Instalar dependencias

```bash
npm install husky lint-staged --save-dev
```

#### Paso 2: Inicializar Husky

```bash
npx husky init
```

Esto crea:
- `.husky/` directory
- `.husky/pre-commit` file
- Script `prepare` en package.json

#### Paso 3: Configurar package.json

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

#### Paso 4: Configurar pre-commit hook

```bash
# Editar .husky/pre-commit
cat > .husky/pre-commit << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running pre-commit checks..."
npx lint-staged
EOF
```

#### Paso 5: Probar

```bash
# Hacer un cambio
echo "test" >> src/app/app.component.ts

# Stagear
git add src/app/app.component.ts

# Intentar commit (fallará si hay errores de lint)
git commit -m "test: test husky"
```

---

## Ejercicio 2: Configurar Commitlint (10 min)

### Descripción

Añadir validación de mensajes de commit.

### Instrucciones

#### Paso 1: Instalar commitlint

```bash
npm install @commitlint/cli @commitlint/config-conventional --save-dev
```

#### Paso 2: Crear configuración

```javascript
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // Nueva feature
        'fix',      // Bug fix
        'docs',     // Documentación
        'style',    // Formato
        'refactor', // Refactoring
        'test',     // Tests
        'chore',    // Mantenimiento
        'perf',     // Performance
        'ci'        // CI/CD
      ]
    ],
    'subject-case': [2, 'always', 'lower-case']
  }
};
```

#### Paso 3: Añadir hook

```bash
# Crear hook de commit-msg
cat > .husky/commit-msg << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit $1
EOF

# Hacer ejecutable
chmod +x .husky/commit-msg
```

#### Paso 4: Probar

```bash
# Commit con mensaje inválido (fallará)
git commit -m "mensaje sin tipo"

# Commit con mensaje válido (pasará)
git commit -m "feat: add new feature"
```

---

## Ejercicio 3: Configurar Pre-push Hook (10 min)

### Descripción

Añadir hook que corre tests antes de push.

### Instrucciones

```bash
# Crear hook de pre-push
cat > .husky/pre-push << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🧪 Running tests before push..."
npm test
EOF

# Hacer ejecutable
chmod +x .husky/pre-push
```

### Verificar

```bash
# Intentar push (correrá tests)
git push origin main
```

---

## Ejercicio 4: Workflow de Deployment (10 min)

### Descripción

Crear workflow que despliega automáticamente a producción.

### Instrucciones

#### Paso 1: Crear deploy.yml

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
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build -- --configuration=production
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist/an-uyuni-frontend/browser
```

#### Paso 2: Configurar GitHub Pages

1. Ir a Settings > Pages
2. Source: GitHub Actions
3. Guardar

#### Paso 3: Configurar angular.json

```json
{
  "projects": {
    "an-uyuni-frontend": {
      "architect": {
        "build": {
          "configurations": {
            "production": {
              "baseHref": "/an-uyuni-frontend/"
            }
          }
        }
      }
    }
  }
}
```

---

## Solución Completa

### Estructura de Archivos

```
.husky/
├── _
│   └── husky.sh
├── pre-commit
├── pre-push
└── commit-msg

.github/
└── workflows/
    ├── ci.yml
    └── deploy.yml

commitlint.config.js
```

### package.json completo

```json
{
  "name": "an-uyuni-frontend",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "ng lint",
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.ts": ["eslint --fix"],
    "*.html": ["eslint --fix"]
  },
  "devDependencies": {
    "@commitlint/cli": "^18.0.0",
    "@commitlint/config-conventional": "^18.0.0",
    "husky": "^9.0.0",
    "lint-staged": "^15.0.0"
  }
}
```

### Workflow de CI/CD completo

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD

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
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  test:
    name: Test
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
      - uses: actions/upload-artifact@v4
        with:
          name: coverage
          path: coverage/

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build -- --configuration=production
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/

  deploy:
    name: Deploy
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist/
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist/an-uyuni-frontend/browser
```

---

## Verificación

### Probar Husky

```bash
# 1. Hacer cambio con error de lint
echo "const x:any = 1" >> src/app/app.component.ts

# 2. Intentar commit
git add .
git commit -m "test: test lint"

# Resultado: Error de lint, commit bloqueado
```

### Probar Commitlint

```bash
# 1. Intentar commit con mensaje inválido
git commit -m "mensaje sin tipo"

# Resultado: Error, mensaje rechazado

# 2. Commit con mensaje válido
git commit -m "feat: add new feature"

# Resultado: Commit aceptado
```

### Probar Pipeline

```bash
# Push a main
git push origin main

# Verificar en GitHub Actions:
# 1. Lint job pasa
# 2. Test job pasa
# 3. Build job pasa
# 4. Deploy job ejecuta
```

---

## Checklist de Completitud

- [ ] Husky instalado y configurado
- [ ] Pre-commit hook ejecuta lint-staged
- [ ] Commitlint valida mensajes de commit
- [ ] Pre-push hook corre tests
- [ ] Workflow de deploy configurado
- [ ] Pipeline completo funciona en GitHub

---

## Retos Adicionales

### Reto 1: Añadir conventional-changelog

Generar CHANGELOG automáticamente desde commits.

### Reto 2: Añadir release automation

Crear releases automáticamente con semantic versioning.

### Reto 3: Añadir notificaciones

Enviar notificaciones a Slack/Discord cuando deploy completa.

---

*Lab 02 - Día 18 - CI/CD y Deployment - Curso Angular 21*
