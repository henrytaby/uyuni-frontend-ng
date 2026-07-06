# Día 13: UI con PrimeNG

## Información del Día

| Atributo | Valor |
|----------|-------|
| **Módulo** | 5 - UI y Estilos |
| **Duración** | 4 horas |
| **Prerrequisitos** | Días 1-12 completados |
| **Nivel** | Intermedio |

---

## Objetivos de Aprendizaje

Al finalizar este día, serás capaz de:

1. **Configurar PrimeNG v21** en un proyecto Angular standalone
2. **Usar componentes core** de PrimeNG (Button, Input, Table, Dialog)
3. **Personalizar el tema Aura** con Tailwind CSS
4. **Implementar patrones de UI** comunes en aplicaciones enterprise
5. **Manejar eventos y estados** de componentes PrimeNG

---

## Temario

### 1. Introducción a PrimeNG (45 min)
- ¿Qué es PrimeNG y por qué usarlo?
- Diferencias entre PrimeNG v20 y v21
- Configuración con Angular standalone
- El tema Aura y su arquitectura

### 2. Componentes de Formulario (60 min)
- InputText, InputNumber, InputMask
- Dropdown, MultiSelect, AutoComplete
- Calendar, DatePicker
- Validación con PrimeNG

### 3. Componentes de Datos (60 min)
- Table con paginación y ordenamiento
- Tree y TreeTable
- VirtualScroller para grandes datasets
- Exportación de datos

### 4. Componentes de UI (45 min)
- Dialog, Sidebar, OverlayPanel
- Toast y Messages
- ConfirmDialog
- Tooltip y Badge

### 5. Personalización de Tema (30 min)
- Modificar variables CSS del tema Aura
- Integración con Tailwind CSS v4
- Dark mode con PrimeNG
- Crear componentes personalizados

---

## Estructura de Archivos

```
dia-13-ui-primeng/
├── README.md                    # Este archivo
├── contenido.md                 # Contenido detallado
├── slides/
│   └── dia-13-ui-primeng_Marp.md          # Diapositivas
├── ejercicios/
│   ├── lab-01.md               # Lab: Formularios
│   └── lab-02.md               # Lab: Tabla de datos
├── assessment/
│   └── preguntas.md            # Preguntas de evaluación
└── recursos/
    ├── bibliografia.md          # Recursos adicionales
    ├── cheatsheet.md            # Referencia rápida
    ├── script-audio.md          # Guion de podcast
    └── script-video-youtube.md  # Guion de video
```

---

## Componentes PrimeNG en UyuniAdmin

El proyecto UyuniAdmin utiliza los siguientes componentes PrimeNG:

| Componente | Uso | Archivo |
|------------|-----|---------|
| `p-button` | Acciones, formularios | Múltiples |
| `p-inputText` | Campos de texto | Sign-in, Sign-up |
| `p-table` | Lista de datos | Tables feature |
| `p-dialog` | Modales | Confirmaciones |
| `p-toast` | Notificaciones | Global |
| `p-calendar` | Selector de fecha | Calendar feature |
| `p-dropdown` | Selectores | Filtros |
| `p-card` | Contenedores | Dashboard |
| `p-menu` | Navegación | Sidebar |
| `p-progressBar` | Indicadores | Loading |

---

## Proyecto Práctico

Construiremos un **módulo de gestión de usuarios** que incluye:

1. **Lista de usuarios** con tabla paginada
2. **Formulario de creación/edición** con validación
3. **Diálogo de confirmación** para eliminar
4. **Notificaciones** de éxito/error
5. **Filtros** con dropdowns

---

## Recursos Necesarios

### Documentación Oficial
- [PrimeNG Documentation](https://primeng.org/)
- [PrimeNG v21 Guide](https://primeng.org/guides)
- [Aura Theme](https://primeng.org/theming)

### Archivos del Proyecto
- [`src/app/app.config.ts`](../../../src/app/app.config.ts) - Configuración de PrimeNG
- [`src/app/features/tables/`](../../../src/app/features/tables/) - Ejemplos de tablas
- [`src/app/features/forms/`](../../../src/app/features/forms/) - Ejemplos de formularios

---

## Próximos Pasos

1. Lee el [`contenido.md`](./contenido.md) para la teoría completa
2. Revisa las [`slides/dia-13-ui-primeng_Marp.md`](./slides/dia-13-ui-primeng_Marp.md)
3. Completa los labs en orden
4. Responde el assessment
5. Consulta los recursos adicionales

---

*README - Día 13 - Curso Angular 21 - UyuniAdmin Frontend*
