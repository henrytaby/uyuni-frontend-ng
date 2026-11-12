# 📚 Portal de Documentación Técnica — UyuniAdmin Frontend

Bienvenido al centro de documentación técnica y operativa del frontend de UyuniAdmin (**Angular v21 + PrimeNG v21 + Tailwind CSS v4**).

---

## 🗂️ Módulos de Funcionalidad (Feature Modules)

Cada módulo cuenta con su documentación técnica exhaustiva en su respectiva carpeta:

* [🚀 **Suite de Despliegue, Infraestructura y Producción** (`docs/deployment/README.md`)](deployment/README.md):
  * **[Despliegue en VPS Linux (Ubuntu + Nginx)](deployment/UBUNTU_VPS_DEPLOYMENT_GUIDE.md)**: Configuración completa de Nginx, compresión Gzip, caché inmutable, SSL con Certbot y script de actualización continua.
  * **[Despliegue en Render.com (Static Site Gratuito)](deployment/RENDER_DEPLOYMENT_GUIDE.md)**: Despliegue continuo con CDN global, manejo nativo de SPA con `_redirects` y SSL automático ($0.00/mes).
  * **[Despliegue en Vercel (Edge Network)](deployment/VERCEL_DEPLOYMENT_GUIDE.md)**: Despliegue serverless perimétrico, archivo `vercel.json` con rewrites y headers, y previsualización por Pull Requests.
  * **[Manual de Replicación para Clientes (Marca Blanca)](deployment/CLIENT_REPLICATION_PLAYBOOK.md)**: Guía paso a paso para dar de alta una nueva empresa cliente con branding y API aislada.

* [👥 **Módulo de Gestión de Usuarios y Auditoría** (`docs/users/README.md`)](users/README.md):
  * Administración de operadores y cuentas.
  * Asignación de roles y permisos del sistema (**RBAC**).
  * Auditoría forense de inicios de sesión (IP, dispositivo, SO y navegador).
  * Drawer multitab con validaciones estrictas y desacoplamiento de efectos reactivos.
  * Hacks, gotchas y solución a trampas de reactividad en Signals.

* [👤 **Módulo de Autoservicio y Mi Perfil** (`docs/profile/README.md`)](profile/README.md):
  * Modelo de seguridad **Anti-IDOR** (`/api/auth/me`).
  * Edición de información personal y preferencias de ubicación/zona horaria con buscadores integrados.
  * Modal seguro de cambio de contraseñas.
  * Sincronización en tiempo real del avatar y sesión en la barra superior.
  * Detección de cambios (*Dirty Checking*) y prevención de peticiones redundantes.

---

## 🧭 Guías de Arquitectura y Estándares Globales

* [🏛️ **Enterprise Architecture** (`docs/ENTERPRISE_ARCHITECTURE.md`)](ENTERPRISE_ARCHITECTURE.md): Principios DDD Lite, modularización y flujo de dependencias.
* [⚡ **Change Detection OnPush** (`docs/CHANGE_DETECTION_ONPUSH_GUIDE.md`)](CHANGE_DETECTION_ONPUSH_GUIDE.md): Guía de reactividad con Signals y `ChangeDetectionStrategy.OnPush`.
* [🧪 **Unit Testing Guide** (`docs/UNIT_TESTING_GUIDE.md`)](UNIT_TESTING_GUIDE.md): Buenas prácticas y ejecución de pruebas Jest.
* [🛠️ **Create Feature Module Guide** (`docs/developer_guide/create-feature-module-guide.md`)](developer_guide/create-feature-module-guide.md): Guía paso a paso para crear un nuevo módulo en la aplicación.

