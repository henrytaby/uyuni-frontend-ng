# Día 15: Features y Componentes

## Información del Día

| Atributo | Valor |
|----------|-------|
| **Módulo** | 6 - Features y Componentes |
| **Duración** | 4 horas |
| **Prerrequisitos** | Días 1-14 completados |
| **Nivel** | Intermedio-Avanzado |

---

## Objetivos de Aprendizaje

Al finalizar este día, serás capaz de:

1. **Crear features completos** siguiendo la arquitectura DDD Lite
2. **Implementar Smart Components** (pages) con lógica de negocio
3. **Crear Dumb Components** (UI) reutilizables
4. **Estructurar features** con la convención del proyecto
5. **Integrar servicios** y gestionar estado en features

---

## Temario

### 1. Arquitectura de Features (45 min)
- Estructura de un feature module
- Smart vs Dumb Components
- Separación de responsabilidades
- Lazy loading de features

### 2. Smart Components - Pages (60 min)
- Creación de páginas con lógica
- Integración con servicios
- Manejo de estado con Signals
- Navegación y routing

### 3. Dumb Components - UI Components (60 min)
- Componentes de presentación
- Input/Output signals
- Comunicación padre-hijo
- Reutilización y composición

### 4. Feature Services (45 min)
- Servicios específicos de feature
- Encapsulamiento de lógica
- Integración con Core services
- Patrones de datos

### 5. Integración Completa (30 min)
- Conectar todos los elementos
- Flujo de datos en features
- Testing de integración
- Mejores prácticas

---

## Estructura de Archivos

```
dia-15-features-componentes/
├── README.md                    # Este archivo
├── contenido.md                 # Contenido detallado
├── slides/
│   └── dia-15-features-componentes_Marp.md          # Diapositivas
├── ejercicios/
│   ├── lab-01.md               # Lab: Feature Dashboard
│   └── lab-02.md               # Lab: Feature Users
├── assessment/
│   └── preguntas.md            # Preguntas de evaluación
└── recursos/
    ├── bibliografia.md          # Recursos adicionales
    ├── cheatsheet.md            # Referencia rápida
    ├── script-audio.md          # Guion de podcast
    └── script-video-youtube.md  # Guion de video
```

---

## Features en UyuniAdmin

El proyecto UyuniAdmin tiene múltiples features:

| Feature | Ruta | Descripción |
|---------|------|-------------|
| **auth** | `/signin`, `/signup` | Autenticación |
| **dashboard** | `/` | Dashboard principal |
| **calendar** | `/calendar` | Calario de eventos |
| **charts** | `/charts` | Gráficos |
| **forms** | `/forms` | Formularios |
| **tables** | `/tables` | Tablas de datos |
| **invoice** | `/invoice` | Facturación |
| **profile** | `/profile` | Perfil de usuario |
| **system** | `/blank`, `**` | Páginas del sistema |

---

## Estructura de un Feature

```
feature/
├── pages/                    # Smart Components (routables)
│   └── overview/
│       ├── overview.component.ts
│       └── overview.component.html
├── components/               # Dumb Components (UI)
│   └── metric-card/
│       ├── metric-card.component.ts
│       └── metric-card.component.html
├── services/                 # Feature-specific services
│   └── feature.service.ts
├── models/                   # Domain models
│   └── feature.models.ts
└── feature.routes.ts         # Feature routing
```

---

## Proyecto Práctico

Construiremos un **feature de Users** completo que incluye:

1. **Página de listado** con tabla y filtros
2. **Página de detalle** con información del usuario
3. **Componentes reutilizables** (user-card, user-form)
4. **Servicio de usuarios** con CRUD
5. **Modelos tipados** para la entidad User

---

## Recursos Necesarios

### Documentación Oficial
- [Angular Components](https://angular.dev/guide/components)
- [Angular Routing](https://angular.dev/guide/routing)
- [Component Interaction](https://angular.dev/guide/component-interaction)

### Archivos del Proyecto
- [`src/app/features/dashboard/`](../../../src/app/features/dashboard/) - Feature dashboard
- [`src/app/features/auth/`](../../../src/app/features/auth/) - Feature auth
- [`src/app/features/profile/`](../../../src/app/features/profile/) - Feature profile

---

## Próximos Pasos

1. Lee el [`contenido.md`](./contenido.md) para la teoría completa
2. Revisa las [`slides/dia-15-features-componentes_Marp.md`](./slides/dia-15-features-componentes_Marp.md)
3. Completa los labs en orden
4. Responde el assessment
5. Consulta los recursos adicionales

---

*README - Día 15 - Curso Angular 21 - UyuniAdmin Frontend*
