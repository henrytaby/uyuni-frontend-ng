# Curso Completo de Angular 21 Enterprise

> **Versión:** 1.0.0  
> **Basado en:** Proyecto UyuniAdmin Frontend  
> **Duración:** 18 días  
> **Nivel:** Principiante a Intermedio (< 1 año de experiencia)

---

## 📋 Descripción

Este curso está diseñado para desarrolladores con menos de 1 año de experiencia en Angular que desean aprender a construir aplicaciones enterprise completas utilizando las mejores prácticas y patrones modernos.

El curso está basado en el proyecto real **UyuniAdmin Frontend**, un dashboard administrativo enterprise-grade con autenticación OAuth2, gestión de estado con Signals, y arquitectura DDD Lite.

---

## 🎯 Objetivos de Aprendizaje

Al completar este curso, serás capaz de:

1. **Configurar proyectos Angular 21** con TypeScript strict mode y Path Aliases
2. **Implementar arquitectura DDD Lite** con separación Core/Shared/Features
3. **Crear servicios robustos** con Signals y RxJS
4. **Construir sistemas de autenticación** completos con JWT
5. **Desarrollar UIs profesionales** con PrimeNG y Tailwind CSS v4
6. **Escribir pruebas unitarias** con Jest y coverage > 80%
7. **Configurar CI/CD** con GitHub Actions y Husky

---

## 📅 Estructura del Curso

### Módulo 1: Fundamentos y Arquitectura (Días 1-3)

| Día | Tema | Contenido |
|-----|------|-----------|
| 1 | Fundamentos | Angular 21, Standalone Components, Path Aliases, TypeScript strict |
| 2 | Arquitectura DDD Lite | Core/Shared/Features, Smart vs Dumb, OnPush |
| 3 | Lazy Loading y Rutas | Route-level code splitting, Guards, Resolvers |

### Módulo 2: Core Services (Días 4-6)

| Día | Tema | Contenido |
|-----|------|-----------|
| 4 | LoggerService y LoadingService | Logging estructurado, Estado de carga global |
| 5 | ConfigService y TokenRefreshService | Configuración dinámica, Refresh de tokens |
| 6 | AuthErrorHandlerService y NetworkErrorService | Manejo de errores, Retry con backoff |

### Módulo 3: Sistema de Autenticación (Días 7-9)

| Día | Tema | Contenido |
|-----|------|-----------|
| 7 | AuthService | Login, Logout, Signals de estado, Roles |
| 8 | HTTP Interceptors | Token injection, Silent refresh, Error handling |
| 9 | Guards e Integración | authGuard, Role-based access, Integración completa |

### Módulo 4: RxJS y Estado Avanzado (Días 10-12)

| Día | Tema | Contenido |
|-----|------|-----------|
| 10 | RxJS Fundamentos | Observables, Observers, Subjects, Subscription |
| 11 | RxJS Operadores | map, filter, switchMap, mergeMap, catchError |
| 12 | Signals y RxJS Interop | toSignal, toObservable, Estado híbrido |

### Módulo 5: UI y Estilos (Días 13-14)

| Día | Tema | Contenido |
|-----|------|-----------|
| 13 | PrimeNG v21 | Componentes standalone, Tema Aura, Formularios |
| 14 | Tailwind CSS v4 | @theme, @utility, Dark mode, PrimeUI plugin |

### Módulo 6: Features y Componentes (Días 15-16)

| Día | Tema | Contenido |
|-----|------|-----------|
| 15 | Features y Componentes | Estructura de feature, Smart vs Dumb en práctica |
| 16 | Integración Completa | Dashboard con auth, roles, y datos reales |

### Módulo 7: Testing y CI/CD (Días 17-18)

| Día | Tema | Contenido |
|-----|------|-----------|
| 17 | Testing con Jest | Unit tests, TestBed, Coverage, AAA Pattern |
| 18 | CI/CD y Deployment | GitHub Actions, Husky, lint-staged, commitlint |

---

## 📁 Estructura de Archivos por Día

Cada día contiene los siguientes materiales:

```
dia-XX-tema/
├── README.md                      # Información general del día
├── contenido.md                   # Contenido detallado de la clase
├── slides/
│   └── dia-XX-tema_Marp.md        # Presentación Marp (exportable a PDF/PPTX)
├── ejercicios/
│   ├── lab-01.md                  # Laboratorio práctico 1
│   └── lab-02.md                  # Laboratorio práctico 2
├── assessment/
│   └── preguntas.md               # 10 preguntas de evaluación
└── recursos/
    ├── bibliografia.md            # Recursos y lecturas adicionales
    ├── cheatsheet.md              # Referencia rápida
    ├── script-audio.md            # Guion para podcast (25-30 min)
    └── script-video-youtube.md    # Guion para video YouTube (25-30 min)
```

---

## 🛠️ Requisitos Previos

### Conocimientos Necesarios

- JavaScript ES6+ (async/await, destructuring, modules)
- HTML y CSS básicos
- Terminal/línea de comandos
- Git básico

### Software Requerido

| Software | Versión | Propósito |
|----------|---------|-----------|
| Node.js | >= 20.x | Runtime de JavaScript |
| npm | >= 10.x | Gestor de paquetes |
| VS Code | Latest | Editor recomendado |
| Git | >= 2.x | Control de versiones |

### Extensiones Recomendadas para VS Code

- **Angular Language Service** - IntelliSense para Angular
- **Marp for VS Code** - Presentaciones desde Markdown
- **Tailwind CSS IntelliSense** - Autocompletado de clases
- **ESLint** - Linting en tiempo real

---

## 🚀 Cómo Usar Este Curso

### Opción 1: Estudio Autodidacta

```bash
# Clonar el repositorio
git clone <repo-url>
cd curso/v1.0.0-angular21

# Leer el contenido de cada día en orden
# Comenzar con el Día 1
cd dia-01-fundamentos

# Leer README.md y contenido.md
# Realizar los laboratorios
# Verificar con las preguntas de assessment
```

### Opción 2: Clase Presencial/Virtual

1. **Antes de clase**: Leer `README.md` y `contenido.md`
2. **Durante clase**: Seguir `slides/dia-XX-tema_Marp.md`
3. **Después de clase**: Completar `ejercicios/lab-01.md` y `lab-02.md`
4. **Evaluación**: Responder `assessment/preguntas.md`

### Opción 3: Multimedia

- **Podcast**: Escuchar `recursos/script-audio.md` (25-30 min)
- **YouTube**: Ver video basado en `recursos/script-video-youtube.md`

---

## 📊 Estadísticas del Curso

| Métrica | Valor |
|---------|-------|
| Total de días | 18 |
| Total de módulos | 7 |
| Archivos de contenido | 184 |
| Presentaciones Marp | 18 |
| Laboratorios prácticos | 36 |
| Preguntas de evaluación | 180 |
| Guiones de video/podcast | 36 |

---

## 📚 Documentación Adicional

| Documento | Descripción |
|-----------|-------------|
| [`docs/MARP_GUIA.md`](docs/MARP_GUIA.md) | Guía completa de Marp para presentaciones |
| [`plans/CURSO_ANGULAR_21_PLAN_EXTENDED.md`](../../plans/CURSO_ANGULAR_21_PLAN_EXTENDED.md) | Plan detallado del curso |
| [`plans/PLANTILLA_ESTRUCTURA_CLASE.md`](../../plans/PLANTILLA_ESTRUCTURA_CLASE.md) | Plantilla de estructura de clase |

---

## 🎓 Metodología de Enseñanza

Cada clase sigue la estructura:

1. **🪝 Hook** - Problema real que motiva el tema
2. **📍 Contexto** - Por qué importa este tema
3. **📖 Explicación** - Conceptos clave con analogías
4. **💻 Demo** - Código en vivo
5. **❌ Error Común** - Errores típicos a evitar
6. **🎯 Mini Reto** - Ejercicio práctico corto
7. **📋 Cierre** - Resumen y conexión con siguiente clase

---

## 🔗 Proyecto Base

Este curso está basado en el proyecto **UyuniAdmin Frontend**:

- **Repositorio**: `/opt/uyuni/an-uyuni-frontend`
- **Documentación**: [`docs/`](../../docs/)
- **Memory Bank**: [`.kilocode/rules/memory-bank/`](../../.kilocode/rules/memory-bank/)

### Arquitectura del Proyecto Base

```
src/app/
├── core/           # 🧠 Singletons globales
│   ├── auth/       # AuthService
│   ├── config/     # ConfigService
│   ├── guards/     # Route guards
│   ├── interceptors/ # HTTP interceptors
│   └── services/   # Logger, Loading, TokenRefresh, etc.
├── shared/         # 🛠️ Componentes reutilizables
│   ├── components/ # Header, Sidebar
│   └── layout/     # AppLayout
└── features/       # 💼 Módulos de dominio
    ├── auth/       # Autenticación
    ├── dashboard/  # Dashboard principal
    ├── calendar/   # Calendario
    └── ...         # Otras features
```

---

## 📝 Licencia

Este material educativo es de uso interno. Para uso externo, contactar al autor.

---

## 👨‍🏫 Autor

Curso generado a partir del análisis del proyecto UyuniAdmin Frontend.

---

*Última actualización: Marzo 2026*  
*Versión del curso: 1.0.0*
