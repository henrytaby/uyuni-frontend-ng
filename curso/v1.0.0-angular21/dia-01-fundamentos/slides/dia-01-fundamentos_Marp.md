---
marp: true
theme: default
paginate: true
backgroundColor: #fff
color: #1f2937
---

# Día 1: Introducción a Angular 21
## Configuración del Proyecto Enterprise

**Curso: Angular 21 Enterprise**
**Versión: 1.0.0**

---

## 🎯 Objetivos de Hoy

1. Entender las novedades de Angular 21
2. Configurar un proyecto enterprise desde cero
3. Implementar Path Aliases
4. Configurar TypeScript strict mode
5. Estructurar el proyecto correctamente

---

## 🪝 Hook: El Problema

```typescript
// ❌ El infierno de imports
import { AuthService } from '../../../../../../core/auth/auth.service';
import { UserService } from '../../../../../../core/user/user.service';
import { ConfigService } from '../../../../../../core/config/config.service';
```

**¿Les suena familiar?**

---

## 🪝 Hook: La Solución

```typescript
// ✅ Imports limpios con Path Aliases
import { AuthService } from '@core/auth/auth.service';
import { UserService } from '@core/user/user.service';
import { ConfigService } from '@core/config/config.service';
```

**¡Hoy vamos a resolver esto para siempre!**

---

## 📍 Contexto: ¿Por qué importa?

### Situación del Mercado

| Antes (2018) | Ahora (2026) |
|--------------|--------------|
| NgModules obligatorios | Standalone Components |
| Imports relativos | Path Aliases estándar |
| Configuración básica | TypeScript strict mode |

---

## 📍 Contexto: El Problema en Cifras

- **70%** de proyectos Angular tienen problemas de estructura
- **45%** del tiempo se pierde en refactorizaciones
- **80%** de los bugs se deben a errores de tipado

---

## 📖 Concepto 1: Standalone Components

### ¿Qué son?

Componentes que **no necesitan NgModules**. Son autónomos y autocontenidos.

---

## 📖 Concepto 1: Comparación

### Antes (NgModule)

```typescript
@NgModule({
  declarations: [SignInComponent],
  imports: [CommonModule]
})
export class AuthModule {}
```

### Ahora (Standalone)

```typescript
@Component({
  standalone: true,
  imports: [CommonModule]
})
export class SignInComponent {}
```

---

## 📖 Concepto 1: Ventajas

| Ventaja | Descripción |
|---------|-------------|
| Tree-shaking | Solo se incluye lo que usas |
| Lazy loading | Más fácil de implementar |
| Menos boilerplate | No necesitas NgModules |
| Mejor DX | Menos archivos, más claridad |

---

## 📖 Concepto 2: Path Aliases

### ¿Qué es?

Un **nombre corto** que representa una ruta larga.

> Como guardar un contacto: en lugar de memorizar el número, usas el nombre.

---

## 📖 Concepto 2: Configuración

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@core/*": ["src/app/core/*"],
      "@shared/*": ["src/app/shared/*"],
      "@features/*": ["src/app/features/*"]
    }
  }
}
```

---

## 📖 Concepto 2: Alias Estándar

| Alias | Uso |
|-------|-----|
| `@core/*` | Servicios globales, guards, interceptors |
| `@shared/*` | Componentes UI, pipes, directives |
| `@features/*` | Módulos de dominio |
| `@env/*` | Variables de entorno |

---

## 📖 Concepto 3: TypeScript Strict Mode

### ¿Qué es?

Configuración que habilita **todas las verificaciones estrictas**.

> Como un inspector muy exigente: no deja pasar nada imperfecto.

---

## 📖 Concepto 3: Configuración

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitOverride": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

---

## 📖 Concepto 3: Beneficios

```typescript
// ❌ Sin strict: Compila pero falla
function getEmail(user: any) {
  return user.email.toLowerCase();
}

// ✅ Con strict: Error en compilación
function getEmail(user: User | null) {
  return user?.email?.toLowerCase() ?? '';
}
```

---

## 📖 Concepto 4: Estructura Enterprise

### La Regla de las 3 Capas

```
src/app/
├── core/      🧠 Singletons globales
├── shared/    🛠️ Componentes reutilizables
└── features/  💼 Módulos de dominio
```

---

## 📖 Concepto 4: Reglas de Dependencia

```
Features → Shared → Core

❌ Core NO puede importar de Features
❌ Core NO puede importar de Shared
```

---

## 💻 Demo: Crear Proyecto

```bash
# Crear proyecto con standalone
ng new mini-uyuniadmin --standalone

# Entrar al proyecto
cd mini-uyuniadmin

# Instalar dependencias
npm install

# Ejecutar servidor
npm start
```

---

## 💻 Demo: Configurar Path Aliases

### Paso 1: Abrir tsconfig.json

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@core/*": ["src/app/core/*"],
      "@shared/*": ["src/app/shared/*"],
      "@features/*": ["src/app/features/*"]
    }
  }
}
```

---

## 💻 Demo: Crear Estructura

```bash
# Crear carpetas
mkdir -p src/app/core
mkdir -p src/app/shared
mkdir -p src/app/features

# Crear archivos de prueba
touch src/app/core/core.ts
touch src/app/shared/shared.ts
touch src/app/features/features.ts
```

---

## 💻 Demo: Verificar Configuración

```typescript
// En cualquier componente
import { core } from '@core/core';
import { shared } from '@shared/shared';
import { features } from '@features/features';

// Si no hay error, ¡funciona!
```

---

## ❌ Error Común 1

### "Cannot find module '@core/...'"

**Causa**: No se configuró el alias o no se reinició el servidor.

**Solución**:
1. Verificar `tsconfig.json`
2. Reiniciar: `Ctrl+C` → `npm start`

---

## ❌ Error Común 2

### "Object is possibly 'null'"

```typescript
const user = authService.currentUser();
console.log(user.name); // ❌ Error
```

**Solución**:
```typescript
console.log(user?.name); // ✅ OK
```

---

## 🎯 Mini Reto

**Tu tarea**:
1. Crea un nuevo alias `@utils` para utilidades
2. Crea un archivo `string.utils.ts`
3. Importa y usa una función

**Tiempo**: 5 minutos

---

## 🎯 Solución del Mini Reto

```json
// tsconfig.json
"@utils/*": ["src/app/utils/*"]
```

```typescript
// src/app/utils/string.utils.ts
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
```

```typescript
// Uso
import { capitalize } from '@utils/string.utils';
console.log(capitalize('hello')); // 'Hello'
```

---

## 📋 Resumen del Día

### Aprendimos:

✅ Angular 21 usa Standalone Components por defecto

✅ Path Aliases permiten imports limpios

✅ TypeScript Strict Mode detecta errores

✅ Estructura Enterprise: Core, Shared, Features

---

## 🔗 Conexión con Mañana

**Día 2**: Arquitectura DDD Lite

- Domain-Driven Design aplicado a Angular
- Separación Core/Shared/Features en detalle
- Smart vs Dumb Components
- ChangeDetectionStrategy.OnPush

---

## 📚 Tarea Opcional

1. Leer documentación oficial de Angular sobre Standalone Components
2. Experimentar con más aliases
3. Crear un proyecto de prueba con la estructura aprendida

---

## ❓ Preguntas

¿Qué dudas tienen sobre lo que vimos hoy?

---

## 📎 Recursos

- 📄 [`contenido.md`](./contenido.md) - Teoría completa
- 🧪 [`ejercicios/lab-01.md`](./ejercicios/lab-01.md) - Práctica
- ❓ [`assessment/preguntas.md`](./assessment/preguntas.md) - 50 preguntas

---

# ¡Gracias!

**Curso: Angular 21 Enterprise**
**Día 1 de 18**

*Nos vemos mañana para Arquitectura DDD Lite*
