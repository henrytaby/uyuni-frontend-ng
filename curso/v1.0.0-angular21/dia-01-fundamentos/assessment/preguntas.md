# Banco de Preguntas - Día 1: Fundamentos

## Metadatos

| Aspecto | Detalle |
|---------|---------|
| **Total de preguntas** | 50 |
| **Básicas** | 20 |
| **Intermedias** | 20 |
| **Avanzadas** | 10 |
| **Tiempo estimado** | 45-60 minutos |

---

## Preguntas Básicas (20)

### 1. ¿Qué es un Standalone Component en Angular 21?

a) Un componente que no tiene template  
b) Un componente que no necesita declararse en un NgModule ✅  
c) Un componente que no puede tener dependencias  
d) Un componente que solo funciona en producción  

**Explicación**: Los Standalone Components son autónomos y no requieren ser declarados en un NgModule. Angular 21 los usa por defecto.

---

### 2. ¿Cuál es el propósito principal de los Path Aliases?

a) Mejorar el rendimiento de la aplicación  
b) Crear rutas más cortas y legibles para imports ✅  
c) Evitar el uso de TypeScript  
d) Compilar más rápido el código  

**Explicación**: Los Path Aliases permiten usar rutas cortas como `@core/auth` en lugar de rutas relativas largas como `../../../core/auth`.

---

### 3. ¿Qué archivo se modifica para configurar Path Aliases?

a) `package.json`  
b) `angular.json`  
c) `tsconfig.json` ✅  
d) `app.module.ts`  

**Explicación**: Los Path Aliases se configuran en `tsconfig.json` bajo la propiedad `compilerOptions.paths`.

---

### 4. ¿Cuál es el alias estándar para servicios globales en una arquitectura enterprise?

a) `@services/*`  
b) `@core/*` ✅  
c) `@global/*`  
d) `@common/*`  

**Explicación**: Por convención, `@core/*` se usa para servicios singleton globales como AuthService, ConfigService, etc.

---

### 5. ¿Qué significa TypeScript Strict Mode?

a) Que el código es más difícil de escribir  
b) Que se habilitan todas las verificaciones de tipo estrictas ✅  
c) Que solo se pueden usar tipos primitivos  
d) Que no se puede usar `any`  

**Explicación**: Strict Mode habilita verificaciones como `noImplicitAny`, `strictNullChecks`, etc., para detectar más errores en compilación.

---

### 6. ¿Cuál es la estructura de carpetas recomendada para proyectos enterprise?

a) `src/components/`, `src/services/`, `src/models/`  
b) `src/app/core/`, `src/app/shared/`, `src/app/features/` ✅  
c) `src/modules/`, `src/utils/`, `src/assets/`  
d) `src/domain/`, `src/data/`, `src/presentation/`  

**Explicación**: La estructura Core/Shared/Features es el estándar para proyectos Angular enterprise.

---

### 7. ¿Qué comando se usa para crear un nuevo proyecto Angular 21?

a) `ng init`  
b) `ng new proyecto --standalone` ✅  
c) `create-angular proyecto`  
d) `ng create proyecto`  

**Explicación**: `ng new` crea un nuevo proyecto y la flag `--standalone` configura componentes standalone por defecto.

---

### 8. ¿Qué capa NO debe importar de las otras?

a) Features  
b) Shared  
c) Core ✅  
d) Ninguna, todas pueden importar de todas  

**Explicación**: Core es la capa más baja y no debe depender de Features o Shared para evitar dependencias circulares.

---

### 9. ¿Cuál es el operador para acceso seguro a propiedades en TypeScript strict?

a) `.` (punto)  
b) `?.` (optional chaining) ✅  
c) `::` (double colon)  
d) `->` (arrow)  

**Explicación**: El optional chaining `?.` permite acceder a propiedades de forma segura, retornando `undefined` si el objeto es null.

---

### 10. ¿Qué significa el error "Object is possibly 'null'"?

a) El objeto no existe  
b) TypeScript detecta que el valor puede ser null ✅  
c) El objeto tiene un error de sintaxis  
d) El objeto está mal tipado  

**Explicación**: Con strict mode, TypeScript advierte cuando una variable puede ser null y se accede a sus propiedades sin verificación.

---

### 11. ¿Cuál es la forma correcta de manejar valores null?

a) Ignorar el error  
b) Usar `as any`  
c) Usar optional chaining `?.` o nullish coalescing `??` ✅  
d) Desactivar strict mode  

**Explicación**: Optional chaining y nullish coalescing son las formas correctas de manejar valores potencialmente null.

---

### 12. ¿Qué alias se usa para componentes UI reutilizables?

a) `@core/*`  
b) `@shared/*` ✅  
c) `@ui/*`  
d) `@components/*`  

**Explicación**: `@shared/*` es el alias estándar para componentes, pipes y directivas reutilizables.

---

### 13. ¿Qué propiedad en tsconfig.json habilita strict mode?

a) `"strict": true` ✅  
b) `"strictMode": true`  
c) `"enableStrict": true`  
d) `"typescriptStrict": true`  

**Explicación**: La propiedad `"strict": true` habilita todas las verificaciones estrictas de TypeScript.

---

### 14. ¿Qué se debe hacer después de modificar tsconfig.json?

a) Nada, los cambios son automáticos  
b) Reiniciar el servidor de desarrollo ✅  
c) Ejecutar `npm install`  
d) Borrar la carpeta node_modules  

**Explicación**: Los cambios en tsconfig.json requieren reiniciar el servidor para que surtan efecto.

---

### 15. ¿Cuál es el alias para módulos de dominio/negocio?

a) `@domain/*`  
b) `@features/*` ✅  
c) `@modules/*`  
d) `@business/*`  

**Explicación**: `@features/*` es el alias estándar para módulos de funcionalidad como auth, dashboard, profile.

---

### 16. ¿Qué es el "infierno de imports"?

a) Un error de compilación  
b) Imports con muchas rutas relativas `../../../` ✅  
c) Imports circulares  
d) Imports de librerías externas  

**Explicación**: El "infierno de imports" se refiere a imports con rutas relativas largas y difíciles de mantener.

---

### 17. ¿Qué ventaja tienen los Standalone Components?

a) Son más rápidos en ejecución  
b) Permiten mejor tree-shaking y lazy loading ✅  
c) Usan menos memoria  
d) Son más fáciles de depurar  

**Explicación**: Los Standalone Components mejoran el tree-shaking porque no requieren NgModules intermedios.

---

### 18. ¿Qué es `baseUrl` en tsconfig.json?

a) La URL del servidor de desarrollo  
b) El directorio base para resolver rutas ✅  
c) La URL de la API  
d) El directorio de salida del build  

**Explicación**: `baseUrl` define el directorio desde donde se resuelven los Path Aliases.

---

### 19. ¿Cuándo se debe usar import relativo?

a) Siempre  
b) Solo para imports entre módulos diferentes  
c) Para imports dentro del mismo módulo ✅  
d) Nunca, siempre usar alias  

**Explicación**: Los imports relativos son apropiados para archivos dentro del mismo módulo o carpeta.

---

### 20. ¿Qué significa `providedIn: 'root'` en un servicio?

a) El servicio solo funciona en el componente raíz  
b) El servicio se proporciona a nivel de aplicación (singleton) ✅  
c) El servicio requiere permisos de administrador  
d) El servicio está en la carpeta root  

**Explicación**: `providedIn: 'root'` hace que el servicio sea un singleton a nivel de aplicación.

---

## Preguntas Intermedias (20)

### 21. ¿Cómo se configura un Path Alias para múltiples extensiones?

a) `"@core/*": ["src/app/core/*.ts"]`  
b) `"@core/*": ["src/app/core/*"]` ✅  
c) `"@core": ["src/app/core"]`  
d) `"@core/**": ["src/app/core/**"]`  

**Explicación**: El wildcard `*` al final permite que el alias funcione con cualquier archivo dentro del directorio.

---

### 22. ¿Qué error ocurre si hay imports circulares?

a) Syntax Error  
b) Warning: Circular dependency detected ✅  
c) Runtime Error  
d) No ocurre ningún error  

**Explicación**: Los imports circulares generan un warning en compilación y pueden causar problemas en runtime.

---

### 23. ¿Cuál es la diferencia entre `?.` y `??`?

a) No hay diferencia  
b) `?.` es para acceso seguro, `??` es para valor por defecto ✅  
c) `?.` es para arrays, `??` es para objetos  
d) `??` es para acceso seguro, `?.` es para valor por defecto  

**Explicación**: Optional chaining (`?.`) accede de forma segura, nullish coalescing (`??`) proporciona un valor por defecto.

---

### 24. ¿Cómo se importa un componente standalone?

a) `import { Component } from '@angular/core'` y declararlo  
b) `import { MiComponent } from './mi.component'` y agregarlo a `imports` ✅  
c) Solo se puede importar en el AppModule  
d) No se puede importar, debe estar en el mismo archivo  

**Explicación**: Los componentes standalone se importan directamente y se agregan al array `imports` del componente que los usa.

---

### 25. ¿Qué propiedad de tsconfig.json controla los errores de null?

a) `"strictNullChecks": true` ✅  
b) `"nullChecks": true`  
c) `"checkNull": true`  
d) `"strictNull": true`  

**Explicación**: `strictNullChecks` es la propiedad específica que controla la verificación de null y undefined.

---

### 26. ¿Cuál es el orden recomendado para organizar imports?

a) Aleatorio  
b) Alfabético sin importar el origen  
c) Angular → Terceros → Alias → Relativos ✅  
d) Relativos → Alias → Terceros → Angular  

**Explicación**: El orden estándar es: Angular core, librerías de terceros, alias del proyecto, imports relativos.

---

### 27. ¿Qué significa el error "Cannot find module '@core/...'"?

a) El módulo no tiene exports  
b) El alias no está configurado o el archivo no existe ✅  
c) TypeScript está desactualizado  
d) El archivo tiene errores de sintaxis  

**Explicación**: Este error indica que el Path Alias no está configurado correctamente o el archivo no existe en la ruta especificada.

---

### 28. ¿Cómo se crea un servicio con Angular CLI?

a) `ng create service core/logger`  
b) `ng generate service core/logger` ✅  
c) `ng new service core/logger`  
d) `ng add service core/logger`  

**Explicación**: `ng generate service` o `ng s` es el comando para crear servicios.

---

### 29. ¿Qué es el tree-shaking en Angular?

a) Una técnica de animación  
b) Eliminación de código no usado en el bundle final ✅  
c) Una forma de organizar imports  
d) Un tipo de testing  

**Explicación**: El tree-shaking elimina código no referenciado del bundle final, reduciendo el tamaño.

---

### 30. ¿Por qué Core no debe importar de Features?

a) Por rendimiento  
b) Para evitar dependencias circulares y mantener la arquitectura limpia ✅  
c) Porque Features no tiene exports  
d) Porque Core es más antiguo  

**Explicación**: Core es la capa base y no debe depender de capas superiores para mantener la arquitectura limpia.

---

### 31. ¿Qué configuración de VS Code ayuda con los Path Aliases?

a) `"typescript.suggest.paths": true` ✅  
b) `"typescript.aliases": true`  
c) `"editor.paths": true`  
d) `"angular.aliases": true`  

**Explicación**: `typescript.suggest.paths` habilita las sugerencias de autocompletado para Path Aliases.

---

### 32. ¿Cómo se verifica la configuración de TypeScript sin ejecutar la app?

a) `npm run check`  
b) `npx tsc --noEmit` ✅  
c) `ng check`  
d) `npm verify`  

**Explicación**: `npx tsc --noEmit` verifica errores de TypeScript sin generar archivos de salida.

---

### 33. ¿Qué es un barrel export?

a) Un tipo de componente  
b) Un archivo que re-exporta múltiples módulos ✅  
c) Una configuración de webpack  
d) Un error de compilación  

**Explicación**: Un barrel (index.ts) agrupa exports de múltiples archivos para simplificar imports.

---

### 34. ¿Cuál es la diferencia entre `loadComponent` y `loadChildren`?

a) No hay diferencia  
b) `loadComponent` carga un componente, `loadChildren` carga un módulo de rutas ✅  
c) `loadComponent` es síncrono, `loadChildren` es asíncrono  
d) `loadChildren` está deprecado  

**Explicación**: `loadComponent` carga un componente individual, `loadChildren` carga un módulo con múltiples rutas.

---

### 35. ¿Qué propiedad en angular.json define los alias?

a) Ninguna, los alias se definen en tsconfig.json ✅  
b) `"paths"`  
c) `"aliases"`  
d) `"imports"`  

**Explicación**: Los Path Aliases son una característica de TypeScript, no de Angular, por eso se configuran en tsconfig.json.

---

### 36. ¿Cómo se previene el error "Object is possibly 'undefined'"?

a) Usando `!` después de la variable  
b) Verificando con `if` o usando optional chaining ✅  
c) Desactivando strict mode  
d) Usando `as any`  

**Explicación**: La verificación explícita o el optional chaining son las formas correctas de prevenir este error.

---

### 37. ¿Qué es `noImplicitReturns` en tsconfig.json?

a) Prohíbe el uso de `return`  
b) Asegura que todas las rutas de código retornen un valor ✅  
c) Hace obligatorio el return en constructores  
d) Desactiva los returns implícitos  

**Explicación**: `noImplicitReturns` genera error si una función no retorna en todas sus rutas.

---

### 38. ¿Cuándo es apropiado usar `@env/*`?

a) Para componentes de entorno  
b) Para archivos de configuración de ambiente ✅  
c) Para variables CSS  
d) Para tests  

**Explicación**: `@env/*` se usa para importar archivos de environment como `environment.ts` y `environment.prod.ts`.

---

### 39. ¿Qué comando genera un componente standalone?

a) `ng generate component nombre --standalone` ✅  
b) `ng generate component nombre --no-module`  
c) `ng generate standalone nombre`  
d) `ng create component nombre --standalone`  

**Explicación**: La flag `--standalone` genera un componente standalone. En Angular 17+ es el comportamiento por defecto.

---

### 40. ¿Qué es ChangeDetectionStrategy.OnPush?

a) Una estrategia de routing  
b) Una optimización que reduce verificaciones de cambio ✅  
c) Un tipo de componente  
d) Una configuración de build  

**Explicación**: OnPush optimiza el rendimiento verificando cambios solo cuando cambian las inputs.

---

## Preguntas Avanzadas (10)

### 41. ¿Cómo se configuran múltiples rutas base para un mismo alias?

a) No es posible  
b) Usando un array de rutas en la configuración ✅  
c) Creando múltiples alias  
d) Usando wildcards anidados  

**Explicación**: Se puede configurar un alias con múltiples rutas base: `"@core/*": ["src/app/core/*", "src/lib/core/*"]`.

---

### 42. ¿Qué es el patrón de inyección `inject()` en Angular 21?

a) Un patrón de diseño obsoleto  
b) Una función para inyectar dependencias sin constructor ✅  
c) Un tipo de servicio  
d) Una configuración de módulo  

**Explicación**: `inject()` es la forma moderna de inyectar dependencias en Angular, más concisa que el constructor.

---

### 43. ¿Cómo se resuelven conflictos de nombres con Path Aliases?

a) No se pueden resolver  
b) Usando imports con nombres diferentes  
c) Renombrando con `as` o usando rutas más específicas ✅  
d) Desactivando el alias  

**Explicación**: Se puede usar `import { X as Y }` o especificar rutas más detalladas para evitar conflictos.

---

### 44. ¿Qué es `forwardRef()` en Angular?

a) Una referencia a un componente futuro  
b) Una solución para dependencias circulares ✅  
c) Un tipo de routing  
d) Una forma de lazy loading  

**Explicación**: `forwardRef()` permite referenciar una dependencia que aún no está definida, útil para dependencias circulares.

---

### 45. ¿Cómo afecta strict mode a los genéricos?

a) No afecta  
b) Hace más estricta la inferencia de tipos genéricos ✅  
c) Prohíbe el uso de genéricos  
d) Solo afecta a genéricos de Angular  

**Explicación**: Strict mode hace que TypeScript sea más estricto al inferir tipos genéricos, detectando más errores.

---

### 46. ¿Qué es `strictTemplates` en Angular?

a) Una plantilla estricta  
b) Verificación de tipos en templates HTML ✅  
c) Un tipo de componente  
d) Una configuración de estilo  

**Explicación**: `strictTemplates` habilita verificación de tipos en los templates, detectando errores en HTML.

---

### 47. ¿Cómo se implementa un barrel export correctamente?

```typescript
// index.ts
export * from './service';  // ❌ No recomendado
export { Service } from './service';  // ✅ Recomendado
```

a) Ambas formas son iguales  
b) La segunda es mejor porque evita exportar todo ✅  
c) La primera es mejor porque es más corta  
d) Ninguna es correcta  

**Explicación**: Los exports explícitos son mejores para tree-shaking y evitan exportar accidentalmente internals.

---

### 48. ¿Qué es `strictInputAccessModifiers`?

a) Restringe el acceso a inputs  
b) Verifica que los inputs tengan modificadores de acceso correctos ✅  
c) Hace los inputs privados  
d) Desactiva los inputs públicos  

**Explicación**: Esta opción verifica que los `@Input()` tengan modificadores de acceso consistentes.

---

### 49. ¿Cómo se optimiza el uso de Path Aliases en monorepos?

a) Usando un solo tsconfig.json  
b) Configurando aliases en cada proyecto y usando TypeScript Project References ✅  
c) No se pueden usar aliases en monorepos  
d) Usando rutas relativas  

**Explicación**: Los monorepos usan TypeScript Project References con aliases configurados por proyecto.

---

### 50. ¿Qué impacto tienen los Path Aliases en el build de producción?

a) Aumentan el tamaño del bundle  
b) No tienen impacto, se resuelven en compilación ✅  
c) Ralentizan el build  
d) Requieren configuración especial  

**Explicación**: Los Path Aliases se resuelven en tiempo de compilación y no afectan el bundle de producción.

---

## Respuestas Rápidas

| # | Respuesta | # | Respuesta | # | Respuesta | # | Respuesta | # | Respuesta |
|---|-----------|---|-----------|---|-----------|---|-----------|---|-----------|
| 1 | b | 11 | c | 21 | b | 31 | a | 41 | b |
| 2 | b | 12 | b | 22 | b | 32 | b | 42 | b |
| 3 | c | 13 | a | 23 | b | 33 | b | 43 | c |
| 4 | b | 14 | b | 24 | b | 34 | b | 44 | b |
| 5 | b | 15 | b | 25 | a | 35 | a | 45 | b |
| 6 | b | 16 | b | 26 | c | 36 | b | 46 | b |
| 7 | b | 17 | b | 27 | b | 37 | b | 47 | b |
| 8 | c | 18 | b | 28 | b | 38 | b | 48 | b |
| 9 | b | 19 | c | 29 | b | 39 | a | 49 | b |
| 10 | b | 20 | b | 30 | b | 40 | b | 50 | b |

---

*Curso: Angular 21 Enterprise*
*Día: 1 de 18*
*Banco de Preguntas: 50 preguntas*
