# Día 14: Estilos con Tailwind CSS v4

## Información del Día

| Atributo | Valor |
|----------|-------|
| **Módulo** | 5 - UI y Estilos |
| **Duración** | 4 horas |
| **Prerrequisitos** | Días 1-13 completados |
| **Nivel** | Intermedio |

---

## Objetivos de Aprendizaje

Al finalizar este día, serás capaz de:

1. **Configurar Tailwind CSS v4** en un proyecto Angular
2. **Usar utility classes** para estilos rápidos
3. **Personalizar el tema** con `@theme` directive
4. **Integrar Tailwind con PrimeNG** usando el plugin primeui
5. **Implementar dark mode** con soporte para persistencia

---

## Temario

### 1. Introducción a Tailwind CSS v4 (45 min)
- ¿Qué es Tailwind CSS y por qué v4?
- Diferencias entre v3 y v4
- Configuración con Angular
- El nuevo sistema de configuración

### 2. Utility Classes (60 min)
- Layout: flex, grid, spacing
- Tipografía: fonts, sizes, colors
- Backgrounds y borders
- Responsive design
- States: hover, focus, dark

### 3. Personalización con @theme (45 min)
- Definir variables CSS
- Crear utilidades personalizadas
- Extender el tema base
- Integración con design tokens

### 4. Integración con PrimeNG (30 min)
- Plugin tailwindcss-primeui
- Sobrescribir estilos de componentes
- Coexistencia con el tema Aura

### 5. Dark Mode y Responsive (30 min)
- Implementar dark mode
- Persistencia con localStorage
- Breakpoints personalizados
- Mobile-first approach

---

## Estructura de Archivos

```
dia-14-tailwind-css/
├── README.md                    # Este archivo
├── contenido.md                 # Contenido detallado
├── slides/
│   └── dia-14-tailwind-css_Marp.md          # Diapositivas
├── ejercicios/
│   ├── lab-01.md               # Lab: Layout y Spacing
│   └── lab-02.md               # Lab: Dark Mode y Responsive
├── assessment/
│   └── preguntas.md            # Preguntas de evaluación
└── recursos/
    ├── bibliografia.md          # Recursos adicionales
    ├── cheatsheet.md            # Referencia rápida
    ├── script-audio.md          # Guion de podcast
    └── script-video-youtube.md  # Guion de video
```

---

## Tailwind CSS en UyuniAdmin

El proyecto UyuniAdmin utiliza Tailwind CSS v4 con:

| Característica | Uso |
|----------------|-----|
| `@theme` directive | Variables CSS personalizadas |
| `@utility` | Utilidades custom (custom-scrollbar) |
| Plugin primeui | Integración con PrimeNG |
| Dark mode | Selector `.dark` |
| Responsive | Breakpoints estándar |

---

## Proyecto Práctico

Construiremos un **dashboard responsive** que incluye:

1. **Layout con sidebar** colapsable
2. **Cards con estadísticas** usando grid responsive
3. **Tabla con estilos** personalizados
4. **Dark mode toggle** con persistencia
5. **Mobile navigation** adaptativa

---

## Recursos Necesarios

### Documentación Oficial
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [Tailwind CSS v4 Migration](https://tailwindcss.com/docs/upgrade-guide)
- [tailwindcss-primeui](https://github.com/primefaces/tailwindcss-primeui)

### Archivos del Proyecto
- [`src/styles.css`](../../../src/styles.css) - Configuración de Tailwind
- [`.postcssrc.json`](../../../.postcssrc.json) - PostCSS config
- [`src/app/shared/layout/`](../../../src/app/shared/layout/) - Layout components

---

## Próximos Pasos

1. Lee el [`contenido.md`](./contenido.md) para la teoría completa
2. Revisa las [`slides/dia-14-tailwind-css_Marp.md`](./slides/dia-14-tailwind-css_Marp.md)
3. Completa los labs en orden
4. Responde el assessment
5. Consulta los recursos adicionales

---

*README - Día 14 - Curso Angular 21 - UyuniAdmin Frontend*
