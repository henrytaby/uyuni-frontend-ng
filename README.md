# Uyuni Frontend (Angular Enterprise)

![Angular Version](https://img.shields.io/badge/Angular-v21+-dd0031.svg)
![TailwindCSS Version](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)
![PrimeNG Version](https://img.shields.io/badge/PrimeNG-v21-06b6d4.svg)
![Architecture](https://img.shields.io/badge/Architecture-DDD%20Lite-blue)
![License](https://img.shields.io/badge/License-MIT-green)

Bienvenido a **Uyuni Frontend**, una aplicación empresarial moderna construida con **Angular v21** y **TailwindCSS**, siguiendo una arquitectura escalable basada en **Domain-Driven Design (DDD)** y **Modular Monolith**.

---

## 🚀 Características Principales

-   **Arquitectura Enterprise**: Estructura sólida dividida en `Core`, `Shared` y `Features`.
-   **Lazy Loading**: Carga perezosa implementada en todos los módulos de funcionalidad.
-   **Angular Signals**: Gestión de estado reactivo moderna y performante.
-   **PrimeNG v21**: Biblioteca de componentes premium para aplicaciones empresariales.
-   **TailwindCSS v4**: Estilizado utilitario de próxima generación para un desarrollo UI ultra rápido.
-   **Standalone Components**: Adopción total del paradigma moderno de Angular (sin `NgModules` innecesarios).
-   **Path Aliases**: Configuración limpia (`@core`, `@features`) eliminando imports relativos.
-   **Rendimiento**: Optimizado para Core Web Vitals.
-   **Husky + Lint-Staged**: Pre-commit hooks para código limpio automáticamente.

---

## 🛠️ Requisitos Previos

Asegúrate de tener instalado:

-   **Node.js**: v20.11.0 o superior (Recomendado v22+).
-   **NPM**: v9+ o **Yarn** / **PNPM**.
-   **Angular CLI**: v21 (`npm install -g @angular/cli`).
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
    git clone https://gitlab.com/tu-empresa/uyuni-frontend.git
    cd uyuni-frontend
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

-   **[ARCHITECTURE.md](docs/ARCHITECTURE.md)**: Guía completa para desarrolladores.
-   **[NETWORK_RESILIENCE.md](docs/NETWORK_RESILIENCE.md)**: Documentación del Escudo de Resiliencia (Manejo de errores de conexión).
-   **[LOADING_SKELETON_SYSTEM.md](docs/LOADING_SKELETON_SYSTEM.md)**: Documentación del Sistema Híbrido de Carga y Skeletons (Gold Standard).
-   **[LAYOUT_GUIDE.md](docs/LAYOUT_GUIDE.md)**: Detalle del sistema de plantillas y layouts.
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
