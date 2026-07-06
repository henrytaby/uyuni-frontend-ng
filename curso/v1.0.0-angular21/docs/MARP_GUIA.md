# Guía de Marp para Presentaciones

## ¿Qué es Marp?

**Marp** (Markdown Presentation Ecosystem) es una herramienta que convierte archivos Markdown en presentaciones de diapositivas profesionales. Es ampliamente utilizada en el ecosistema de desarrollo por su simplicidad y potencia.

### Ventajas de Marp

| Ventaja | Descripción |
|---------|-------------|
| **Simplicidad** | Escribe presentaciones en Markdown puro |
| **Versionado** | Los archivos .md se pueden gestionar con Git |
| **Portabilidad** | Funciona en cualquier editor con soporte Markdown |
| **Exportación** | Exporta a PDF, PPTX, HTML |
| **Temas** | Temas personalizables y estilos CSS |
| **Código** | Syntax highlighting automático |

---

## Instalación

### Opción 1: Extensión VS Code (Recomendada)

```bash
# Instalar desde el marketplace
# Buscar: "Marp for VS Code"
# ID: marp-team.marp-vscode
```

### Opción 2: CLI Global

```bash
# Instalar Marp CLI
npm install -g @marp-team/marp-cli

# Convertir a PDF
marp presentacion_Marp.md --pdf

# Convertir a HTML
marp presentacion_Marp.md --html

# Convertir a PPTX
marp presentacion_Marp.md --pptx
```

---

## Convenciones de Nomenclatura

### Formato Estándar

```
*_Marp.md    → Archivos de presentación Marp
*.md         → Archivos Markdown normales
```

### Ejemplos

```
dia-01_Marp.md        ✅ Correcto
presentacion_Marp.md  ✅ Correcto
slides_Marp.md        ✅ Correcto

presentacion.md       ❌ No se procesará como Marp
slides.md             ❌ No se procesará como Marp
```

---

## Estructura de un Archivo Marp

### Frontmatter Requerido

```markdown
---
marp: true
theme: default
paginate: true
backgroundColor: #fff
color: #1f2937
---
```

### Propiedades del Frontmatter

| Propiedad | Valores | Descripción |
|-----------|---------|-------------|
| `marp` | `true` | Activa el procesamiento Marp |
| `theme` | `default`, `gaia`, `uncover` | Tema visual |
| `paginate` | `true`, `false` | Muestra número de página |
| `backgroundColor` | Color CSS | Color de fondo |
| `color` | Color CSS | Color del texto |
| `size` | `16:9`, `4:3` | Proporción de diapositiva |

---

## Sintaxis de Diapositivas

### Separador de Diapositivas

```markdown
---  # Nueva diapositiva (3 guiones)
```

### Diapositiva de Título

```markdown
---
marp: true
---

# Título Principal
## Subtítulo

Contenido de la primera diapositiva
```

### Diapositiva de Contenido

```markdown
---

## Título de Diapositiva

- Punto 1
- Punto 2
- Punto 3
```

---

## Elementos Especiales

### Código con Syntax Highlighting

```markdown
```typescript
const greeting: string = 'Hello, World!';
console.log(greeting);
```
```

### Tablas

```markdown
| Columna 1 | Columna 2 |
|-----------|-----------|
| Dato 1    | Dato 2    |
| Dato 3    | Dato 4    |
```

### Imágenes

```markdown
![Descripción](ruta/imagen.png)
```

### Citas

```markdown
> Esta es una cita destacada
```

---

## Directivas de Diapositiva

### Cambiar Fondo de una Diapositiva

```markdown
---
marp: true
---

# Diapositiva Normal

---

<!-- _backgroundColor: #1e3a5f -->
<!-- _color: white -->

# Diapositiva con Fondo Oscuro
```

### Ocultar Paginación

```markdown
<!-- _paginate: false -->

# Portada sin Número de Página
```

### Tamaño Personalizado

```markdown
<!-- _size: 4:3 -->

# Diapositiva 4:3
```

---

## Temas Disponibles

### 1. Default

```markdown
---
marp: true
theme: default
---
```

- Fondo blanco
- Texto oscuro
- Estilo limpio y profesional

### 2. Gaia

```markdown
---
marp: true
theme: gaia
---
```

- Inspirado en presentaciones de Google
- Colores vibrantes
- Ideal para presentaciones creativas

### 3. Uncover

```markdown
---
marp: true
theme: uncover
---
```

- Minimalista
- Centrado en el contenido
- Transiciones suaves

---

## Ejemplo Completo

```markdown
---
marp: true
theme: default
paginate: true
backgroundColor: #fff
color: #1f2937
---

# Curso Angular 21
## Día 1: Fundamentos

**Instructor:** Tu Nombre
**Fecha:** Enero 2026

---

## 🎯 Objetivos

1. Entender Angular 21
2. Configurar el proyecto
3. Crear primeros componentes

---

## 📖 Conceptos Clave

### Standalone Components

```typescript
@Component({
  standalone: true,
  selector: 'app-root',
  template: `<h1>Hello World</h1>`
})
export class AppComponent {}
```

---

## ❌ Error Común

**Problema:** Imports relativos largos

```typescript
// ❌ Mal
import { Service } from '../../../../core/service';

// ✅ Bien
import { Service } from '@core/service';
```

---

## 🎯 Mini Reto

Crea un componente standalone que muestre tu nombre.

**Tiempo:** 5 minutos

---

## 📋 Resumen

- ✅ Angular 21 usa standalone por defecto
- ✅ Path aliases simplifican imports
- ✅ TypeScript strict mode detecta errores

---

# ¡Gracias!

¿Preguntas?
```

---

## Exportación

### Desde VS Code

1. Abrir el archivo `*_Marp.md`
2. Click derecho → "Export slide deck"
3. Seleccionar formato: PDF, HTML, PPTX

### Desde CLI

```bash
# Exportar a PDF
marp dia-01_Marp.md --pdf --allow-local-files

# Exportar a HTML (recomendado para web)
marp dia-01_Marp.md --html

# Exportar a PowerPoint
marp dia-01_Marp.md --pptx

# Especificar tema
marp dia-01_Marp.md --theme theme.css --pdf
```

---

## Integración con el Curso

### Estructura Propuesta

```
curso/v1.0.0-angular21/
├── dia-01-fundamentos/
│   └── slides/
│       └── dia-01_Marp.md    ← Archivo Marp
├── dia-02-arquitectura/
│   └── slides/
│       └── dia-02_Marp.md
└── ...
```

### Convención de Nombres

```
dia-{NN}_{tema}_Marp.md

Ejemplos:
- dia-01_fundamentos_Marp.md
- dia-02_arquitectura_Marp.md
- dia-03_lazy-loading_Marp.md
```

---

## Atajos de VS Code

| Atajo | Acción |
|-------|--------|
| `Ctrl+Shift+V` | Vista previa Markdown |
| `Ctrl+K V` | Vista previa lateral |
| `Ctrl+S` | Guardar (actualiza preview) |

---

## Recursos Adicionales

- [Documentación Oficial de Marp](https://marpit.marp.app/)
- [Marp for VS Code](https://marketplace.visualstudio.com/items?itemName=marp-team.marp-vscode)
- [Marp CLI](https://github.com/marp-team/marp-cli)
- [Galería de Temas](https://github.com/marp-team/marp-core)

---

## Preguntas Frecuentes

### ¿Puedo usar emojis?

Sí, Marp soporta emojis nativamente:

```markdown
# 🎯 Objetivos
✅ Completado
❌ Pendiente
```

### ¿Puedo usar HTML?

Sí, pero con limitaciones:

```markdown
<div style="color: red; font-size: 24px;">
  Texto personalizado
</div>
```

### ¿Cómo centro contenido?

```markdown
<!-- _class: center -->

# Título Centrado
```

### ¿Cómo hago una diapositiva sin encabezado?

```markdown
---

Contenido sin título

> Solo contenido y elementos
```

---

*Última actualización: Marzo 2026*
