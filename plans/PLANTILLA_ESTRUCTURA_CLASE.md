# Plantilla de Estructura de Clase - Curso Angular 21 Enterprise

## Filosofía Pedagógica

Esta plantilla combina:
1. **Tu enfoque**: Hook → Contexto → Explicación → Demo → Error común → Mini reto → Cierre
2. **Mejores prácticas de la industria**: Learning Objectives, Scaffolding, Spaced Repetition
3. **Metodología 4C**: Connection, Concept, Concrete Practice, Conclusion
4. **Contenido multimedia**: Videos YouTube, Podcasts, Slides interactivos

---

## Estructura de Cada Día (4 horas)

### Bloque 1: Teoría (1 hora)

#### 1.1 Hook / Enganche (5 min)
**Propósito**: Captar atención y generar curiosidad

**Tipos de Hook efectivos**:
- **Pregunta provocadora**: "¿Por qué el 80% de los proyectos Angular fallan?"
- **Demo impactante**: Mostrar el resultado final antes de empezar
- **Historia real**: "En un proyecto enterprise, un error de autenticación costó $2M..."
- **Dato sorprendente**: "Angular 21 es 40% más rápido que Angular 15"
- **Problema común**: "¿Alguna vez te has encontrado con el 'infierno de imports'?"

**Ejemplo para Día 1**:
```
🪝 Hook: "Miren este código..."

import { AuthService } from '../../../../../../core/auth/auth.service';
import { UserService } from '../../../../../../core/user/user.service';
import { ConfigService } from '../../../../../../core/config/config.service';

¿Les suena familiar? Hoy vamos a resolver esto para siempre."
```

#### 1.2 Contexto (10 min)
**Propósito**: Explicar POR QUÉ es importante este tema

**Elementos**:
- Situación actual del mercado
- Problemas que resuelve
- Beneficios de aprenderlo
- Conexión con días anteriores

**Ejemplo para Día 1**:
```
📍 Contexto:
"En el desarrollo enterprise, trabajamos en equipos de 10-50 desarrolladores.
Sin una estructura clara, el código se vuelve inmantenible en meses.
Las empresas como Google, Microsoft y Amazon usan arquitecturas similares
a la que aprenderemos hoy. Este conocimiento te diferencia de un junior
a un desarrollador enterprise."
```

#### 1.3 Explicación Simple (30 min)
**Propósito**: Enseñar conceptos de forma clara y progresiva

**Técnica**: Regla de las 3 C
1. **Concepto**: Definición simple
2. **Comparación**: Analogía con algo conocido
3. **Código**: Ejemplo mínimo funcional

**Estructura por tema**:
```
┌─────────────────────────────────────────┐
│ TEMA: Path Aliases                      │
├─────────────────────────────────────────┤
│ 📖 Concepto:                            │
│ "Un alias es un nombre corto para una   │
│  ruta larga, como un acceso directo"    │
│                                         │
│ 🔄 Comparación:                         │
│ "Es como guardar un contacto en tu      │
│  celular: en lugar de memorizar el      │
│  número, usas el nombre"                │
│                                         │
│ 💻 Código:                              │
│ // tsconfig.json                        │
│ "paths": {                              │
│   "@core/*": ["src/app/core/*"]         │
│ }                                       │
│                                         │
│ // Uso                                  │
│ import { AuthService } from '@core/...';│
└─────────────────────────────────────────┘
```

#### 1.4 Cierre Parcial (15 min)
**Propósito**: Resumir y verificar comprensión

**Elementos**:
- Resumen de 3 puntos clave
- Pregunta de verificación
- Preview del siguiente bloque

---

### Bloque 2: Demo en Vivo (1 hora)

#### 2.1 Contexto de la Demo (5 min)
**Propósito**: Explicar qué vamos a construir

**Elementos**:
- Objetivo de la demo
- Resultado esperado
- Tiempo estimado

#### 2.2 Demo Paso a Paso (40 min)
**Propósito**: Mostrar implementación real

**Técnica**: Coding en vivo con explicación

**Estructura**:
```
1. Crear archivo/configuración
2. Escribir código base
3. Explicar cada línea
4. Ejecutar y verificar
5. Iterar si es necesario
```

#### 2.3 Error Común (10 min)
**Propósito**: Prevenir errores frecuentes

**Estructura**:
```
❌ Error Común: "El alias no funciona"

Síntoma:
- TypeScript no reconoce el import
- Error: Cannot find module '@core/...'

Causa:
- No se configuró correctamente tsconfig.json
- No se reinició el servidor de desarrollo

Solución:
1. Verificar configuración en tsconfig.json
2. Reiniciar el servidor: npm start

Prevención:
- Siempre reiniciar después de cambios en tsconfig
```

#### 2.4 Mini Reto (5 min)
**Propósito**: Desafío rápido para verificar comprensión

**Ejemplo**:
```
🎯 Mini Reto (2 minutos):
"Agrega un nuevo alias @models que apunte a src/app/models
y úsalo para importar un modelo User."

Solución en 2 minutos...
```

---

### Bloque 3: Práctica Guiada (1.5 horas)

#### 3.1 Instrucciones del Lab (10 min)
**Propósito**: Explicar el ejercicio paso a paso

**Estructura del Lab**:
```markdown
## Lab 01: Configuración de Path Aliases

### Objetivo
Configurar path aliases para evitar imports relativos largos.

### Tiempo estimado
30 minutos

### Prerrequisitos
- Node.js 20+ instalado
- Angular CLI instalado globalmente

### Pasos

#### Paso 1: Crear proyecto (5 min)
```bash
ng new mini-uyuniadmin --standalone
cd mini-uyuniadmin
```

#### Paso 2: Configurar tsconfig.json (10 min)
Abrir tsconfig.json y agregar...

#### Paso 3: Crear estructura de carpetas (10 min)
Crear las siguientes carpetas...

#### Paso 4: Verificar configuración (5 min)
Crear un archivo de prueba...

### ✅ Criterios de Aceptación
- [ ] El proyecto compila sin errores
- [ ] Los imports usan aliases
- [ ] La estructura sigue DDD Lite

### 💡 Tips
- Usa Ctrl+Click para verificar que el alias funciona
- Reinicia el servidor si hay errores
```

#### 3.2 Práctica Supervisada (60 min)
**Propósito**: Los estudiantes practican con apoyo

**Dinámica**:
- Estudiantes trabajan en parejas
- Instructor circula y responde dudas
- Pausas cada 15 min para preguntas
- Mostrar solución parcial si hay bloqueos

#### 3.3 Error Común en Práctica (10 min)
**Propósito**: Abordar errores que surgieron

**Dinámica**:
- Recopilar errores comunes de los estudiantes
- Explicar causa y solución
- Documentar en "FAQ del día"

#### 3.4 Revisión de Solución (10 min)
**Propósito**: Mostrar solución correcta

**Dinámica**:
- Mostrar código solución
- Comparar con código de estudiantes
- Explicar diferencias y mejoras

---

### Bloque 4: Práctica Independiente (30 min)

#### 4.1 Mini Reto Final (20 min)
**Propósito**: Desafío individual sin asistencia

**Estructura**:
```markdown
🎯 Mini Reto Final: "Configura tu propio alias"

Instrucciones:
1. Crea un alias @utils para utilidades
2. Crea un archivo string.utils.ts
3. Importa y usa una función del archivo

Tiempo: 15 minutos
Entregable: Código funcionando en tu repositorio
```

#### 4.2 Cierre del Día (10 min)
**Propósito**: Resumir y conectar con siguiente clase

**Elementos**:
```
📋 Resumen del Día:
✅ Aprendimos qué son los path aliases
✅ Configuramos tsconfig.json
✅ Creamos estructura DDD Lite básica

🔗 Conexión con mañana:
"Mañana profundizaremos en la arquitectura DDD Lite
y crearemos nuestros primeros módulos lazy-loaded."

📚 Tarea opcional:
- Leer documentación de Angular sobre standalone components
- Experimentar con más aliases

❓ Preguntas finales: (3 min)
```

---

## Plantilla de Archivos por Día

### 1. contenido.md (Teoría Extensa)

```markdown
# Día X: [Título]

## Objetivos de Aprendizaje
Al finalizar este día, serás capaz de:
- [ ] Objetivo 1
- [ ] Objetivo 2
- [ ] Objetivo 3

## 1. Hook
[Contenido del hook con ejemplo]

## 2. Contexto
[Por qué es importante, situación actual, beneficios]

## 3. Explicación Simple

### 3.1 Concepto 1
- Definición
- Analogía
- Código ejemplo

### 3.2 Concepto 2
...

## 4. Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| ... | ... | ... |

## 5. Mejores Prácticas
1. ...
2. ...

## 6. Resumen
- Punto clave 1
- Punto clave 2
- Punto clave 3
```

### 2. slides/presentacion.md (Marp)

```markdown
---
marp: true
theme: default
paginate: true
---

# Día X: [Título]
## Curso Angular 21 Enterprise

---

## 🎯 Objetivos de Hoy
1. Objetivo 1
2. Objetivo 2
3. Objetivo 3

---

## 🪝 Hook
[Contenido impactante]

---

## 📍 Contexto
[Por qué importa]

---

## 📖 Concepto 1
[Explicación]

---

## 💻 Código
```typescript
// Ejemplo de código
```

---

## ❌ Error Común
[Descripción y solución]

---

## 🎯 Mini Reto
[Descripción del reto]

---

## 📋 Resumen
- Punto 1
- Punto 2
- Punto 3

---

## ❓ Preguntas
```

### 3. assessment/preguntas.md

```markdown
# Banco de Preguntas - Día X

## Preguntas Básicas (20)

### 1. ¿Qué es un path alias en TypeScript?
a) Una variable de entorno
b) Un acceso directo para imports ✓
c) Un tipo de dato
d) Una función del compilador

**Explicación**: Un path alias permite usar rutas cortas...

---

## Preguntas Intermedias (20)
...

---

## Preguntas Avanzadas (10)
...
```

### 4. ejercicios/lab-XX.md

```markdown
# Lab XX: [Título]

## Objetivo
[Qué lograrás]

## Tiempo Estimado
XX minutos

## Prerrequisitos
- [ ] Requisito 1
- [ ] Requisito 2

## Instrucciones Paso a Paso

### Paso 1: [Título] (X min)
[Instrucciones detalladas]

### Paso 2: [Título] (X min)
[Instrucciones detalladas]

## ✅ Criterios de Aceptación
- [ ] Criterio 1
- [ ] Criterio 2

## 💡 Tips
- Tip 1
- Tip 2

## 🐛 Errores Comunes
- Error 1: Solución
```

### 5. recursos/script-audio.md

```markdown
# Guion de Audio - Día X

## Metadatos
- Duración: 15-20 min
- Formato: Podcast técnico
- Audiencia: Desarrolladores con < 1 año en Angular

## Guion

### Intro (1 min)
"Hola y bienvenidos al Día X del curso de Angular 21 Enterprise.
Hoy vamos a hablar sobre [tema]..."

### Hook (1 min)
"¿Alguna vez te has encontrado con...?"

### Desarrollo (12 min)
[Explicación conversacional]

### Cierre (2 min)
"En resumen, hoy aprendimos...
Nos vemos en el próximo episodio."
```

### 6. recursos/script-video-youtube.md

```markdown
# Guion de Video YouTube - Día X

## Metadatos del Video
- **Título**: Angular 21 Enterprise - Día X: [Tema]
- **Duración**: 30-45 minutos
- **Formato**: Tutorial con screencast
- **Thumbnail**: Sugerencia de imagen
- **Tags**: Angular, TypeScript, Enterprise, Tutorial

## Estructura del Video

### 0. Pre-Intro (0-30 seg)
**Visual**: Logo del curso + música intro
**Audio**: "Angular 21 Enterprise - Día X"

---

### 1. Intro y Hook (30 seg - 2 min)
**Visual**: Instructor en cámara + texto con título
**Audio**:
"¡Hola! Bienvenidos al Día X del curso de Angular 21 Enterprise.
Soy [Nombre] y hoy vamos a resolver un problema que afecta al 80%
de los proyectos Angular..."

**Hook específico**:
"¿Alguna vez has visto imports como este?"
[Muestra código con imports largos]
"Hoy vamos a solucionar esto para siempre."

---

### 2. Contexto (2-5 min)
**Visual**: Slides con diagramas
**Audio**:
"Antes de empezar, entendamos POR QUÉ esto es importante.
En proyectos enterprise, trabajamos en equipos grandes.
Sin una estructura clara, el código se vuelve inmantenible..."

**Puntos clave**:
- Situación actual del mercado
- Problemas que resuelve
- Beneficios de aprenderlo

---

### 3. Explicación Teórica (5-10 min)
**Visual**: Slides + código en VS Code
**Audio**:
"Vamos a entender el concepto con una analogía simple.
Imagina que [analogía]..."

**Estructura por concepto**:
1. Definición simple
2. Analogía cotidiana
3. Código mínimo
4. Explicación línea por línea

---

### 4. Demo en Vivo (10-20 min)
**Visual**: Screencast de VS Code + terminal
**Audio**:
"Ahora vamos a implementarlo paso a paso.
Primero, creamos el archivo..."

**Estructura de la demo**:
1. Setup inicial
2. Código base
3. Explicación mientras escribes
4. Ejecución y verificación
5. Iteración si es necesario

**Tips para la demo**:
- Escribe código en tiempo real (no copy-paste)
- Explica cada línea mientras escribes
- Muestra errores y cómo solucionarlos
- Usa zoom para código importante

---

### 5. Error Común (3-5 min)
**Visual**: Código con error + solución
**Audio**:
"Ahora, hablemos de un error muy común que verás.
Cuando intentas [acción], a veces obtienes este error..."

**Estructura**:
1. Mostrar el error
2. Explicar la causa
3. Mostrar la solución
4. Prevenir futuros errores

---

### 6. Mini Reto (2-3 min)
**Visual**: Pantalla con instrucciones
**Audio**:
"Antes de terminar, tengo un reto para ti.
Tu tarea es [descripción del reto].
Pausa el video e inténtalo.
Cuando estés listo, continúa para ver la solución."

---

### 7. Solución del Reto (3-5 min)
**Visual**: Screencast de la solución
**Audio**:
"¿Lo lograste? Aquí está una posible solución.
[Explica la solución paso a paso]
Hay múltiples formas de resolverlo, esta es una de ellas."

---

### 8. Cierre y Call to Action (2-3 min)
**Visual**: Instructor en cámara + resumen
**Audio**:
"En resumen, hoy aprendimos:
- Punto clave 1
- Punto clave 2
- Punto clave 3

En el próximo video, veremos [preview del siguiente día].

Si este video te ayudó, dale like y suscríbete.
Déjame en los comentarios si tienes preguntas.

¡Nos vemos en el próximo video!"

---

### 9. Outro (30 seg)
**Visual**: Logo + links a recursos
**Audio**: Música outro

---

## Notas de Producción

### Equipo Necesario
- Micrófono de calidad (Blue Yeti o similar)
- Cámara HD (o webcam de calidad)
- Software de grabación (OBS Studio)
- Software de edición (DaVinci Resolve / Premiere)
- Iluminación adecuada

### Tips de Grabación
- Graba en bloques de 5-10 min
- Usa teleprompter para intro/outro
- Prepara código de antemano
- Graba audio por separado para mejor calidad
- Haz múltiples tomas si es necesario

### Thumbnails
- Tamaño: 1280x720
- Incluir: Logo del curso, número de día, tema
- Colores: Brand colors del curso
- Texto: Grande y legible

### SEO para YouTube
- Título: "Angular 21 [Tema] - Tutorial Enterprise"
- Descripción: Incluir timestamps, links, código
- Tags: Angular, TypeScript, Enterprise, Tutorial
- Playlist: Curso Angular 21 Enterprise

### Accesibilidad
- Subtítulos en español
- Subtítulos en inglés (opcional)
- Descripción detallada del código
- Transcripción completa
```

---

## Checklist de Preparación por Día

### Antes de la Clase
- [ ] Revisar contenido.md completo
- [ ] Preparar código de demo
- [ ] Verificar que el código funciona
- [ ] Preparar slides en Marp
- [ ] Tener solución de labs lista
- [ ] Preparar errores comunes intencionales

### Durante la Clase
- [ ] Seguir estructura de bloques
- [ ] Respetar tiempos
- [ ] Hacer pausas para preguntas
- [ ] Circula durante práctica
- [ ] Documentar errores que surgen

### Después de la Clase
- [ ] Actualizar FAQ con errores nuevos
- [ ] Recopilar feedback
- [ ] Ajustar contenido si es necesario
- [ ] Preparar siguiente día

---

*Plantilla creada: Marzo 2026*
*Basada en mejores prácticas de formación tecnológica*
