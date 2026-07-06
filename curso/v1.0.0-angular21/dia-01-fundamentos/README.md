# Día 1: Introducción a Angular 21 y Configuración del Proyecto

## Información del Día

| Aspecto | Detalle |
|---------|---------|
| **Módulo** | 1 - Fundamentos y Arquitectura |
| **Duración** | 4 horas |
| **Prerrequisitos** | Conocimientos básicos de TypeScript, HTML, CSS |
| **Archivos de referencia** | [`tsconfig.json`](../../../tsconfig.json), [`angular.json`](../../../angular.json) |

---

## Objetivos de Aprendizaje

Al finalizar este día, serás capaz de:

1. ✅ Entender las novedades de Angular 21 y los Standalone Components
2. ✅ Configurar un proyecto Angular enterprise desde cero
3. ✅ Implementar Path Aliases para evitar el "infierno de imports"
4. ✅ Configurar TypeScript strict mode para máxima seguridad
5. ✅ Estructurar un proyecto siguiendo buenas prácticas

---

## Agenda del Día

| Bloque | Duración | Tema |
|--------|----------|------|
| **Bloque 1** | 1h | Teoría: Angular 21, Path Aliases, TypeScript |
| **Bloque 2** | 1h | Demo: Crear proyecto y configurar aliases |
| **Bloque 3** | 1.5h | Práctica: Configurar proyecto paso a paso |
| **Bloque 4** | 0.5h | Práctica independiente y cierre |

---

## Materiales del Día

### Contenido Teórico
- 📄 [`contenido.md`](./contenido.md) - Teoría extensa y explicaciones

### Presentación
- 📊 [`slides/dia-01-fundamentos_Marp.md`](./slides/dia-01-fundamentos_Marp.md) - Marp slides

### Ejercicios
- 🧪 [`ejercicios/lab-01.md`](./ejercicios/lab-01.md) - Práctica guiada
- 🧪 [`ejercicios/lab-02.md`](./ejercicios/lab-02.md) - Práctica independiente
- 💾 [`ejercicios/solucion/`](./ejercicios/solucion/) - Código solución

### Evaluación
- ❓ [`assessment/preguntas.md`](./assessment/preguntas.md) - 50 preguntas

### Recursos
- 📚 [`recursos/bibliografia.md`](./recursos/bibliografia.md) - Enlaces y referencias
- 📝 [`recursos/cheatsheet.md`](./recursos/cheatsheet.md) - Resumen rápido
- 🎙️ [`recursos/script-audio.md`](./recursos/script-audio.md) - Guion podcast
- 🎬 [`recursos/script-video-youtube.md`](./recursos/script-video-youtube.md) - Guion video

---

## Resumen del Día

### Conceptos Clave
1. **Angular 21**: Standalone Components por defecto, sin NgModules
2. **Path Aliases**: Accesos directos para imports limpios
3. **TypeScript Strict**: Máxima seguridad en tiempo de compilación
4. **Estructura Enterprise**: Core, Shared, Features

### Comandos Utilizados
```bash
# Crear proyecto
ng new mini-uyuniadmin --standalone

# Instalar dependencias
npm install

# Ejecutar servidor
npm start
```

### Configuración Clave
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@core/*": ["src/app/core/*"],
      "@shared/*": ["src/app/shared/*"],
      "@features/*": ["src/app/features/*"]
    }
  }
}
```

---

## Siguiente Día

**Día 2**: Arquitectura DDD Lite y Estructura Modular
- Domain-Driven Design aplicado a Angular
- Separación Core/Shared/Features
- Smart vs Dumb Components
- ChangeDetectionStrategy.OnPush

---

*Curso: Angular 21 Enterprise*
*Versión: 1.0.0*
*Día: 1 de 18*
