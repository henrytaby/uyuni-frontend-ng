# Lab 01: Configuración de Proyecto Angular Enterprise

## Objetivo

Configurar un proyecto Angular 21 con Path Aliases y estructura enterprise desde cero.

## Tiempo Estimado

30 minutos

## Prerrequisitos

- [ ] Node.js 20+ instalado
- [ ] Angular CLI instalado globalmente (`npm install -g @angular/cli`)
- [ ] VS Code con extensión Angular Language Service
- [ ] Terminal o línea de comandos

---

## Instrucciones Paso a Paso

### Paso 1: Crear el Proyecto (5 min)

Abre tu terminal y ejecuta:

```bash
# Crear nuevo proyecto con standalone components
ng new mini-uyuniadmin --standalone --routing --style=css

# Cuando pregunte:
# ? Which stylesheet format would you like to use? CSS
# ? Do you want to enable Server-Side Rendering? No
```

Navega al proyecto:

```bash
cd mini-uyuniadmin
```

Verifica que funciona:

```bash
npm start
```

Abre el navegador en `http://localhost:4200` y verifica que ves la página de bienvenida de Angular.

---

### Paso 2: Configurar Path Aliases (10 min)

Abre el archivo `tsconfig.json` en la raíz del proyecto.

Busca la sección `compilerOptions` y agrega las siguientes configuraciones:

```json
{
  "compilerOptions": {
    // ... configuraciones existentes ...
    
    "baseUrl": "./",
    "paths": {
      "@core/*": ["src/app/core/*"],
      "@shared/*": ["src/app/shared/*"],
      "@features/*": ["src/app/features/*"],
      "@env/*": ["src/environments/*"]
    }
  }
}
```

**⚠️ Importante**: Después de modificar `tsconfig.json`, debes reiniciar el servidor:

```bash
# Detener el servidor con Ctrl+C
# Luego reiniciar
npm start
```

---

### Paso 3: Crear Estructura de Carpetas (10 min)

En tu terminal, ejecuta:

```bash
# Crear estructura de carpetas
mkdir -p src/app/core
mkdir -p src/app/shared/components
mkdir -p src/app/shared/layout
mkdir -p src/app/features/auth/pages
mkdir -p src/app/features/auth/components
mkdir -p src/app/features/dashboard/pages
mkdir -p src/app/features/dashboard/components
```

Crea archivos de prueba:

```bash
# Archivos de prueba para verificar aliases
touch src/app/core/core.module.ts
touch src/app/shared/components/button.component.ts
touch src/app/features/auth/auth.routes.ts
```

---

### Paso 4: Verificar Configuración (5 min)

Abre `src/app/app.component.ts` y agrega imports de prueba:

```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Imports de prueba para verificar aliases
// Descomenta después de crear los archivos
// import { coreModule } from '@core/core.module';
// import { ButtonComponent } from '@shared/components/button.component';
// import { authRoutes } from '@features/auth/auth.routes';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'mini-uyuniadmin';
}
```

**Verificación**:
1. Si VS Code no muestra errores en los imports, la configuración está correcta
2. Usa Ctrl+Click sobre el import para verificar que navega al archivo correcto

---

## ✅ Criterios de Aceptación

Verifica que tu proyecto cumple con:

- [ ] El proyecto compila sin errores (`npm start` funciona)
- [ ] `tsconfig.json` tiene los path aliases configurados
- [ ] La estructura de carpetas tiene Core, Shared y Features
- [ ] Los imports con alias funcionan (Ctrl+Click navega al archivo)
- [ ] TypeScript strict mode está habilitado

---

## 💡 Tips

### Tip 1: Verificar configuración de TypeScript

```bash
# Verificar errores de TypeScript sin ejecutar
npx tsc --noEmit
```

### Tip 2: Configurar VS Code

Crea el archivo `.vscode/settings.json`:

```json
{
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "typescript.suggest.paths": true
}
```

### Tip 3: Autocompletado de Imports

Cuando escribas un import, VS Code sugerirá automáticamente los alias:
- Escribe `import {` y luego el nombre del archivo
- Selecciona la sugerencia con el alias `@core/...`

---

## 🐛 Errores Comunes

### Error: "Cannot find module '@core/...'"

**Causa**: No se reinició el servidor después de modificar `tsconfig.json`

**Solución**:
```bash
# Detener servidor (Ctrl+C)
npm start
```

### Error: "Module not found"

**Causa**: El archivo no existe en la ruta especificada

**Solución**: Verificar que el archivo existe y la ruta es correcta

### Error: VS Code no reconoce los alias

**Causa**: VS Code no ha recargado la configuración

**Solución**:
1. `Ctrl+Shift+P`
2. Escribe "Reload Window"
3. Enter

---

## 📸 Capturas de Referencia

### Estructura de carpetas esperada:

```
mini-uyuniadmin/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   └── core.module.ts
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   │   └── button.component.ts
│   │   │   └── layout/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── pages/
│   │   │   │   ├── components/
│   │   │   │   └── auth.routes.ts
│   │   │   └── dashboard/
│   │   │       ├── pages/
│   │   │       └── components/
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   └── environments/
├── angular.json
├── package.json
└── tsconfig.json
```

---

## Siguiente Paso

Continúa con el **Lab 02** para crear tu primer componente usando Path Aliases.

---

*Curso: Angular 21 Enterprise*
*Lab: 01 de 02*
