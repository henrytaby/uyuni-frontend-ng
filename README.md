# Uyuni Frontend (Angular Enterprise)

![Angular Version](https://img.shields.io/badge/Angular-v21+-dd0031.svg)
![TailwindCSS Version](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)
![PrimeNG Version](https://img.shields.io/badge/PrimeNG-v21-06b6d4.svg)
![Architecture](https://img.shields.io/badge/Architecture-DDD%20Lite-blue)
![License](https://img.shields.io/badge/License-MIT-green)

Bienvenido a **Uyuni Frontend**, una aplicación empresarial moderna construida con **Angular v21** y **TailwindCSS**, siguiendo una arquitectura escalable basada en **Domain-Driven Design (DDD)** y **Modular Monolith**.

---

## 🚀 Características Principales

-   **Arquitectura Enterprise**: Estructura sólida basada en DDD Lite y Modular Monolith dividida en `Core`, `Shared` y `Features`.
-   **Lazy Loading**: Carga perezosa implementada en el 100% de los módulos de funcionalidad y rutas.
-   **Angular Signals**: Gestión de estado reactivo moderna con inputs, outputs y estado interno basado en Signals.
-   **PrimeNG v21**: Biblioteca de componentes premium completamente integrada con la arquitectura standalone.
-   **TailwindCSS v4**: Estilizado moderno y eficiente utilizando la sintaxis canónica de Tailwind v4.
-   **Iconos Lucide**: Integración completa de `@lucide/angular` como sistema de iconos principal basado en slugs semánticos.
-   **Detección OnPush**: Estrategia `ChangeDetectionStrategy.OnPush` en el 100% de los componentes para un rendimiento óptimo.
-   **Escudo de Resiliencia**: Robustez ante fallas de red con reconexión y reintentos automatizados (`NetworkErrorService`).
-   **Carga Híbrida y Skeletons**: Visualizaciones con skeletons y loaders con debounce de 300ms y fail-safe de 6 segundos.
-   **Path Aliases**: Importaciones limpias mediante alias (`@core`, `@shared`, `@features`, `@env`) eliminando imports relativos complejos.
-   **Husky + Lint-Staged**: Pre-commit hooks para asegurar la consistencia y calidad del código en cada commit.

---

## 🛠️ Requisitos Previos

Asegúrate de tener instalado:

-   **Node.js**: v20.11.0 o superior (Recomendado v22+).
-   **NPM**: v10+ o **Yarn** / **PNPM** como gestor de paquetes.
-   **Angular CLI**: v21+ (`npm install -g @angular/cli`).
-   **Git**: v2.0+ (para Husky hooks).

---

### 🔧 Configuración (Runtime)
El proyecto utiliza una configuración externa (`config.json`) que **no se sube al repositorio**.
Para iniciar en local, debes crearla a partir del ejemplo:

```bash
cp public/assets/config/config.example.json public/assets/config/config.json
```

---

## 📦 Instalación y Uso

1.  **Clonar el repositorio**:
    ```bash
    git clone https://github.com/henrytaby/uyuni-frontend-ng.git
    cd uyuni-frontend-ng
    ```

2.  **Instalar dependencias**:
    ```bash
    npm install
    ```

3.  **Correr en desarrollo**:
    ```bash
    npm start
    # O explícitamente:
    ng serve
    ```
    La aplicación estará disponible en `http://localhost:4200/`.

4.  **Construir para producción**:
    ```bash
    npm run build
    ```
    Los archivos compilados se generarán en `dist/ng-uyuniadmin/`.

---

## 🏛️ Arquitectura del Proyecto

Este proyecto no sigue la estructura plana tradicional de Angular. Utilizamos **DDD Lite** para organizar el código por dominios de negocio.

### Estructura de Carpetas

```
src/app/
├── core/           # 🧠 Singletons (Auth, Config, Guards). Una sola instancia.
├── shared/         # 🛠️ UI Components (Buttons, Modales, Inputs). Reutilizables.
├── features/       # 💼 Módulos de Negocio (Dashboard, Invoice, Users).
│   ├── dashboard/
│   ├── invoice/
│   │   ├── pages/      # Smart Components (Vistas con lógica)
│   │   ├── components/ # Dumb Components (Tablas, Listas específicas)
│   │   ├── models/     # Interfaces de dominio
│   │   ├── services/   # Lógica de negocio HTTP
│   │   └── invoice.routes.ts # 🚦 Micro-ruteo y Lazy Loading específico del módulo
│   └── ...
└── app.routes.ts   # 🚦 Router principal (Lazy Loading)
```

> 📘 **Documentación Detallada**: Para una guía profunda sobre la arquitectura, patrones y cómo crear nuevos módulos, lee la **[Guía de Arquitectura e Inicio](docs/ARCHITECTURE.md)**.

---

## 🎨 Patrones de Diseño

-   **Smart vs Dumb Components**:
    -   **Smart (Pages)**: Gestionan datos, inyectan servicios.
    -   **Dumb (Components)**: Solo reciben `@Input` y emiten `@Output`.
-   **Angular Signals**:
    -   Uso de `signal()`, `computed()` y `effect()` para reactividad fina.
-   **Feature Isolation**:
    -   Un módulo Feature no debe importar componentes privados de otro módulo Feature.

---

## 📚 Documentación Adicional

-   **[ARCHITECTURE.md](docs/ARCHITECTURE.md)**: Guía completa de arquitectura empresarial para desarrolladores.
-   **[NETWORK_RESILIENCE.md](docs/NETWORK_RESILIENCE.md)**: Documentación del Escudo de Resiliencia (Manejo de errores de conexión).
-   **[LOADING_SKELETON_SYSTEM.md](docs/LOADING_SKELETON_SYSTEM.md)**: Documentación del Sistema Híbrido de Carga y Skeletons (Gold Standard).
-   **[LAYOUT_GUIDE.md](docs/LAYOUT_GUIDE.md)**: Detalle del sistema de plantillas y layouts.
-   **[UNIT_TESTING_GUIDE.md](docs/UNIT_TESTING_GUIDE.md)**: Guía de pruebas unitarias configuradas con Jest.
-   **[CHANGE_DETECTION_ONPUSH_GUIDE.md](docs/CHANGE_DETECTION_ONPUSH_GUIDE.md)**: Guía detallada sobre la estrategia de detección de cambios OnPush.
-   **[docs/developer_guide/create-feature-module-guide.md](docs/developer_guide/create-feature-module-guide.md)**: Guía completa para crear nuevos módulos feature paso a paso.
-   **[docs/developer_guide/catalogs_bulk_guide.md](docs/developer_guide/catalogs_bulk_guide.md)**: Guía detallada sobre el uso de catálogos masivos.
-   **[Tailwind CSS v4 Docs](https://tailwindcss.com/docs)**: Documentación oficial de la versión instalada.
-   **Angular Style Guide**: Seguimos estrictamente las recomendaciones oficiales.

---

## 🛡️ Calidad de Código

El proyecto incluye herramientas pre-configuradas para asegurar la calidad y consistencia del código:

### 1. Linting (Análisis Estático)
Utilizamos **ESLint** con las reglas oficiales de Angular.
```bash
npm run lint
```

### 2. Testing (Pruebas Unitarias)
Utilizamos **Jest** como motor de pruebas (más rápido que Karma).
```bash
npm test
```

### 3. Strict Mode
TypeScript está configurado en **Modo Estricto** para prevenir errores comunes y asegurar un tipado fuerte.


---

---

## 🚀 Despliegue en Producción (VPS)

Para guías detalladas sobre cómo desplegar en un servidor Ubuntu con Nginx:

👉 **[Ver Guía de Despliegue (DEPLOYMENT_GUIDE.md)](docs/DEPLOYMENT_GUIDE.md)**
*(Incluye configuración de Nginx con Gzip y Compresión)*

---

## 🤝 Contribución

1.  Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`).
2.  Desarrolla siguiendo la estructura `src/app/features/<nombre>`.
3.  Asegúrate de que el build pase (`npm run build`).
4.  Abre un Merge Request (MR).

---

&copy; 2026 Uyuni Project. Built with utilizing Angular 21.
