# Guion de Video YouTube - Día 1: Fundamentos

## Metadatos del Video

| Aspecto | Detalle |
|---------|---------|
| **Título** | Angular 21 Enterprise - Día 1: Configuración de Proyecto |
| **Duración** | 35-40 minutos |
| **Formato** | Tutorial con screencast |
| **Thumbnail** | Logo Angular + "Día 1" + "Path Aliases" |
| **Tags** | Angular, TypeScript, Enterprise, Tutorial, Angular 21 |

---

## Estructura del Video

### [0:00 - 0:30] Pre-Intro

**Visual**: Logo del curso animado + música intro

**Overlay**: 
```
Angular 21 Enterprise
Día 1: Configuración de Proyecto
```

**Audio**: Música intro (10 seg) → fade out

---

### [0:30 - 2:00] Intro y Hook

**Visual**: Instructor en cámara (plano medio)

**Overlay**: Título del video

**Audio**:
"¡Hola! Bienvenidos al primer día del curso de Angular 21 Enterprise.

Soy [Tu Nombre] y en este curso vamos a construir una aplicación real, paso a paso, usando las mejores prácticas de la industria.

Hoy, en el Día 1, vamos a resolver un problema que afecta al 80% de los proyectos Angular..."

**Visual**: Cambiar a pantalla con código

**Código en pantalla**:
```typescript
// ❌ El infierno de imports
import { AuthService } from '../../../../../../core/auth/auth.service';
import { UserService } from '../../../../../../core/user/user.service';
import { ConfigService } from '../../../../../../core/config/config.service';
```

**Audio**:
"¿Alguna vez has visto imports como estos? ¿Les suena familiar?

Este es el famoso 'infierno de imports'. Y hoy vamos a resolverlo para siempre."

---

### [2:00 - 5:00] Contexto

**Visual**: Slides con diagramas

**Slide 1**: "¿Por qué importa esto?"

**Audio**:
"Antes de empezar a escribir código, entendamos POR QUÉ esto es importante.

En proyectos enterprise, trabajamos en equipos de 10, 20, 50 desarrolladores. Sin una estructura clara, el código se vuelve inmantenible en meses."

**Slide 2**: Estadísticas

**Audio**:
"Miren estos datos:
- El 70% de los proyectos Angular tienen problemas de estructura
- El 45% del tiempo se pierde en refactorizaciones
- El 80% de los bugs se deben a errores de tipado

Las empresas como Google, Microsoft y Amazon usan las prácticas que aprenderemos hoy."

**Slide 3**: Beneficios

**Audio**:
"Al final de este video, podrás:
1. Configurar un proyecto Angular enterprise desde cero
2. Implementar Path Aliases para imports limpios
3. Usar TypeScript Strict Mode
4. Estructurar tu proyecto profesionalmente"

---

### [5:00 - 10:00] Explicación Teórica

**Visual**: Pantalla dividida - Slides + Código

**Audio**:
"Vamos a entender los conceptos clave antes de escribir código."

#### [5:00 - 7:00] Concepto 1: Standalone Components

**Slide**: "Standalone Components"

**Audio**:
"Primero, Standalone Components. En Angular 21, los componentes son standalone por defecto.

¿Qué significa esto?

Antes, necesitábamos NgModules. Era como si cada componente tuviera que ser miembro de un club para funcionar.

Ahora, los componentes son autónomos. Pueden funcionar por sí solos."

**Código en pantalla**:
```typescript
// Antes: NgModule
@NgModule({
  declarations: [MyComponent],
  imports: [CommonModule]
})
export class MyModule {}

// Ahora: Standalone
@Component({
  standalone: true,
  imports: [CommonModule]
})
export class MyComponent {}
```

**Audio**:
"Miren la diferencia. Antes, necesitábamos un archivo extra para el módulo. Ahora, todo está en un solo lugar."

#### [7:00 - 9:00] Concepto 2: Path Aliases

**Slide**: "Path Aliases"

**Audio**:
"Segundo, Path Aliases. Este es el corazón de la solución.

Un Path Alias es como un contacto guardado en tu celular. En lugar de memorizar un número largo, guardas un nombre corto."

**Código en pantalla**:
```typescript
// ❌ Sin alias
import { AuthService } from '../../../../../core/auth/auth.service';

// ✅ Con alias
import { AuthService } from '@core/auth/auth.service';
```

**Audio**:
"¿Ven la diferencia? El alias @core reemplaza toda esa ruta larga."

#### [9:00 - 10:00] Concepto 3: Estructura

**Slide**: "Estructura Enterprise"

**Audio**:
"Tercero, la estructura de carpetas. En proyectos enterprise usamos 3 capas:

- Core: Servicios globales, singletons
- Shared: Componentes reutilizables
- Features: Módulos de negocio

La regla importante: Core NO puede importar de Features o Shared."

---

### [10:00 - 25:00] Demo en Vivo

**Visual**: Screencast de VS Code + Terminal

**Audio**:
"Ahora vamos a la práctica. Vamos a crear un proyecto desde cero."

#### [10:00 - 13:00] Paso 1: Crear Proyecto

**Terminal en pantalla**:
```bash
ng new mini-uyuniadmin --standalone --routing --style=css
```

**Audio**:
"Primero, abrimos la terminal y ejecutamos el comando para crear un nuevo proyecto.

La flag --standalone configura componentes standalone por defecto.
--routing habilita el sistema de rutas.
--style=css define CSS como el preprocesador."

**Visual**: Esperar a que termine la instalación

**Audio**:
"Este proceso toma unos segundos. Mientras espera, les cuento que Angular 21 es mucho más rápido que versiones anteriores..."

#### [13:00 - 18:00] Paso 2: Configurar Path Aliases

**Visual**: Abrir tsconfig.json en VS Code

**Audio**:
"Ahora, abrimos el archivo tsconfig.json. Aquí es donde configuramos los Path Aliases."

**Código en pantalla** (mientras escribes):
```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@core/*": ["src/app/core/*"],
      "@shared/*": ["src/app/shared/*"],
      "@features/*": ["src/app/features/*"]
    }
  }
}
```

**Audio**:
"Agregamos baseUrl y paths. Cada alias apunta a una carpeta específica.

@core para servicios globales.
@shared para componentes reutilizables.
@features para módulos de negocio."

**Visual**: Guardar archivo

**Audio**:
"⚠️ IMPORTANTE: Después de modificar tsconfig.json, debemos reiniciar el servidor."

#### [18:00 - 22:00] Paso 3: Crear Estructura

**Terminal en pantalla**:
```bash
mkdir -p src/app/core
mkdir -p src/app/shared/components
mkdir -p src/app/features/auth
```

**Audio**:
"Ahora creamos la estructura de carpetas. Usamos mkdir -p para crear carpetas anidadas."

**Visual**: Mostrar estructura en VS Code

**Audio**:
"La estructura se ve así:
- core para servicios globales
- shared para componentes
- features para módulos de negocio"

#### [22:00 - 25:00] Paso 4: Verificar

**Visual**: Crear archivo de prueba

**Código en pantalla**:
```typescript
// src/app/core/logger/logger.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  info(message: string): void {
    console.log(`[INFO] ${message}`);
  }
}
```

**Audio**:
"Ahora creamos un servicio de prueba para verificar que los alias funcionan."

**Visual**: Importar en app.component.ts

**Código en pantalla**:
```typescript
import { LoggerService } from '@core/logger/logger.service';
```

**Audio**:
"Y aquí está la magia. Usamos el alias @core en lugar de la ruta relativa.

Si VS Code no muestra errores, la configuración está correcta.

Pueden usar Ctrl+Click para verificar que navega al archivo correcto."

---

### [25:00 - 30:00] Error Común

**Visual**: Pantalla con error simulado

**Audio**:
"Ahora hablemos de un error muy común que verán."

**Error en pantalla**:
```
Error: Cannot find module '@core/logger/logger.service'
```

**Audio**:
"Este error aparece cuando el alias no está configurado correctamente.

Las causas más comunes son:
1. No se reinició el servidor después de modificar tsconfig.json
2. Hay un typo en la configuración
3. El archivo no existe en la ruta especificada"

**Visual**: Mostrar solución

**Audio**:
"La solución es simple:
1. Verificar que tsconfig.json tiene la configuración correcta
2. Reiniciar el servidor con Ctrl+C y npm start
3. Verificar que el archivo existe"

**Terminal en pantalla**:
```bash
# Detener servidor: Ctrl+C
npm start
```

---

### [30:00 - 35:00] Mini Reto

**Visual**: Pantalla con instrucciones

**Audio**:
"Antes de terminar, tengo un reto para ustedes."

**Overlay**:
```
🎯 Mini Reto:
1. Crea un nuevo alias @utils para utilidades
2. Crea un archivo string.utils.ts
3. Importa y usa una función

Tiempo: 5 minutos
Pausa el video e inténtalo.
```

**Audio**:
"Su tarea es:
1. Agregar un nuevo alias @utils en tsconfig.json
2. Crear un archivo string.utils.ts en src/app/utils
3. Crear una función capitalize que convierta la primera letra a mayúscula
4. Importarla usando el alias

Pausen el video e inténtelo. Cuando estén listos, continúen para ver la solución."

**Visual**: Pantalla de espera (30 segundos)

---

### [35:00 - 38:00] Solución del Reto

**Visual**: Mostrar solución paso a paso

**Código en pantalla**:
```json
// tsconfig.json
"@utils/*": ["src/app/utils/*"]
```

**Audio**:
"Primero, agregamos el alias en tsconfig.json."

**Código en pantalla**:
```typescript
// src/app/utils/string.utils.ts
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
```

**Audio**:
"Luego, creamos el archivo con la función capitalize."

**Código en pantalla**:
```typescript
// Uso
import { capitalize } from '@utils/string.utils';

console.log(capitalize('hello')); // 'Hello'
```

**Audio**:
"Finalmente, importamos usando el alias @utils.

¿Lo lograron? Si tuvieron problemas, revisen los pasos anteriores."

---

### [38:00 - 40:00] Cierre

**Visual**: Instructor en cámara

**Audio**:
"En resumen, hoy aprendimos:

1. Angular 21 usa Standalone Components por defecto
2. Los Path Aliases permiten imports limpios como @core/auth
3. TypeScript Strict Mode detecta errores en compilación
4. La estructura Enterprise separa Core, Shared y Features"

**Visual**: Mostrar código limpio

**Código en pantalla**:
```typescript
// ✅ Imports limpios con Path Aliases
import { AuthService } from '@core/auth/auth.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { User } from '@features/auth/models/user.model';
```

**Audio**:
"Así se ven los imports limpios. Mucho mejor que el infierno de puntos, ¿verdad?"

**Visual**: Instructor en cámara

**Audio**:
"En el próximo video, Día 2, aprenderemos sobre Arquitectura DDD Lite. Veremos Smart Components vs Dumb Components, y cómo optimizar el rendimiento con ChangeDetectionStrategy.OnPush.

Si este video les ayudó, denle like y suscríbanse. Déjenme en los comentarios si tienen preguntas.

Los materiales de este video están en el repositorio del curso, incluyendo el código, slides y preguntas de práctica.

¡Nos vemos en el próximo video del curso de Angular 21 Enterprise!"

---

### [40:00 - 40:30] Outro

**Visual**: Logo del curso + links

**Overlay**:
```
📚 Materiales: github.com/curso/angular-21-enterprise
📱 Sígueme: @tu_usuario
💬 Comunidad: discord.gg/angular-enterprise
```

**Audio**: Música outro (15 seg) → fade out

---

## Notas de Producción

### Equipo Necesario
- Micrófono: Blue Yeti o similar
- Cámara: Webcam HD o cámara DSLR
- Software de grabación: OBS Studio
- Software de edición: DaVinci Resolve (gratis) o Premiere Pro
- Iluminación: Ring light o softboxes

### Configuración de Grabación
- Video: 1920x1080, 30fps
- Audio: 48kHz, mono
- Screencast: 1920x1080, 30fps

### Thumbnails
- Tamaño: 1280x720
- Elementos: Logo Angular, "Día 1", "Path Aliases", cara del instructor
- Colores: Brand colors del curso
- Texto: Grande y legible

### SEO para YouTube
- Título: "Angular 21 Enterprise - Día 1: Configuración y Path Aliases"
- Descripción: Timestamps, links, código
- Tags: Angular, TypeScript, Enterprise, Tutorial, Angular 21, Path Aliases
- Playlist: Curso Angular 21 Enterprise

### Accesibilidad
- Subtítulos en español (CC)
- Subtítulos en inglés (opcional)
- Descripción detallada del código
- Transcripción completa disponible

---

## Timestamps para YouTube

```
0:00 - Intro
0:30 - Hook: El problema de los imports
2:00 - Contexto: Por qué importa
5:00 - Concepto 1: Standalone Components
7:00 - Concepto 2: Path Aliases
9:00 - Concepto 3: Estructura Enterprise
10:00 - Demo: Crear proyecto
13:00 - Demo: Configurar aliases
18:00 - Demo: Crear estructura
22:00 - Demo: Verificar configuración
25:00 - Error común
30:00 - Mini reto
35:00 - Solución del reto
38:00 - Resumen
40:00 - Cierre
```

---

*Curso: Angular 21 Enterprise*
*Día: 1 de 18*
*Formato: Video YouTube*
