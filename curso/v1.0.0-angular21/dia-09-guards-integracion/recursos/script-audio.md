# Día 9: Guion de Audio - Guards y Protección de Rutas

## Podcast: "Angular en Profundidad"

**Duración estimada:** 25-30 minutos
**Formato:** Podcast educativo
**Audiencia:** Desarrolladores con menos de 1 año en Angular

---

## Intro (0:00 - 1:30)

**[Música de entrada suave]**

**Narrador:** "¡Bienvenidos a 'Angular en Profundidad', el podcast donde exploramos los conceptos más importantes de Angular para llevarte de principiante a experto!"

**Narrador:** "Soy tu instructor y hoy estamos en el Día 9 de nuestro curso completo de Angular 21. Hoy vamos a hablar de un tema crucial para la seguridad de tu aplicación: los Guards."

**Narrador:** "Imagina esto: tienes una aplicación bancaria. Un usuario malintencionado escribe directamente en su navegador: 'mi-banco.com/transferir'. ¿Qué pasa si no tienes Guards? Pues... la página carga sin verificar si el usuario está autenticado. Es como dejar la puerta del banco abierta con todos los cajeros funcionando."

**Narrador:** "Hoy aprenderemos a cerrar esa puerta. Vamos allá."

**[Música de transición]**

---

## Sección 1: ¿Qué son los Guards? (1:30 - 6:00)

**Narrador:** "Entonces, ¿qué es exactamente un Guard en Angular?"

**Narrador:** "Un Guard es como un portero de seguridad. Su trabajo es verificar las credenciales antes de permitir el acceso a una ruta. Piensa en el portero de un club exclusivo: llega un cliente, el portero verifica su membresía, y si la tiene, lo deja entrar. Si no... lo envía a la entrada principal."

**Narrador:** "En términos técnicos, un Guard es una función o clase que decide si una ruta puede ser activada, desactivada o cargada."

**Narrador:** "Angular tiene varios tipos de Guards:"

**Narrador:** "Primero, está `CanActivateFn`. Este es el más común. Verifica si un usuario puede acceder a una ruta. Lo usarías para proteger páginas que requieren autenticación."

**Narrador:** "Segundo, `CanDeactivateFn`. Este se ejecuta cuando intentas salir de una ruta. Es perfecto para prevenir que un usuario pierda cambios no guardados en un formulario."

**Narrador:** "Tercero, `CanLoadFn`. Este protege el lazy loading. Solo carga el módulo si el usuario tiene permiso."

**Narrador:** "Cuarto, `CanMatchFn`. Este permite routing condicional, mostrando diferentes componentes según ciertas condiciones."

**Narrador:** "Y quinto, `ResolveFn`. Este pre-carga datos antes de navegar a una ruta."

**Narrador:** "Hoy nos enfocaremos en `CanActivateFn`, que es el más usado para autenticación."

**[Pausa breve]**

---

## Sección 2: Guards Funcionales vs Guards de Clase (6:00 - 10:00)

**Narrador:** "Ahora, hablemos de un cambio importante en Angular 14."

**Narrador:** "Antes de Angular 14, los Guards se implementaban como clases con el decorador `@Injectable`. Tenías que crear una clase, implementar una interfaz, y usar el constructor para inyectar dependencias. Era mucho código."

**Narrador:** "Pero desde Angular 14, tenemos los Guards funcionales. Son más simples, más limpios, y más eficientes."

**Narrador:** "¿Por qué son mejores? Tres razones:"

**Narrador:** "Primero, son tree-shakeable. Si no usas un Guard, se elimina del bundle final. Con las clases, aunque no las uses, pueden quedar en el bundle."

**Narrador:** "Segundo, requieren menos código. No necesitas decorador, no necesitas constructor. Solo una función."

**Narrador:** "Tercero, son más consistentes. Usan el mismo patrón que los interceptores funcionales, que vimos en el día anterior."

**Narrador:** "Veamos cómo se ve un Guard funcional en código."

**[Pausa breve]**

---

## Sección 3: Implementación de authGuard (10:00 - 16:00)

**Narrador:** "Vamos a implementar nuestro primer Guard. Abre tu editor de código y crea un archivo llamado `auth.guard.ts` en la carpeta `core/guards`."

**Narrador:** "La estructura básica es así:"

**Narrador:** "Primero, importamos `CanActivateFn` y `Router` de `@angular/router`. También importamos `inject` de `@angular/core`. Y finalmente, importamos nuestro `AuthService`."

**Narrador:** "Luego, declaramos el Guard como una constante. El tipo es `CanActivateFn`, que es una función que retorna boolean o UrlTree."

**Narrador:** "Dentro de la función, usamos `inject()` para obtener instancias de nuestros servicios. Esto es importante: `inject()` solo funciona dentro del contexto de ejecución de Angular, así que debe estar dentro de la función del Guard."

**Narrador:** "La lógica es simple: si el usuario está autenticado, retornamos `true`. Si no, redirigimos a la página de login y retornamos `false`."

**Narrador:** "El código completo se ve así:"

**Narrador:** "```typescript
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/signin']);
  return false;
};
```"

**Narrador:** "Una alternativa más idiomática es usar `UrlTree`. En lugar de llamar a `navigate()` y retornar `false`, puedes retornar directamente `router.parseUrl('/signin')`. El router maneja la redirección de forma más eficiente."

**[Pausa breve]**

---

## Sección 4: Integración en Rutas (16:00 - 20:00)

**Narrador:** "Ahora que tenemos nuestro Guard, ¿cómo lo usamos?"

**Narrador:** "Abre tu archivo de rutas, normalmente `app.routes.ts`. Importa el Guard y agrégalo a la propiedad `canActivate` de la ruta que quieres proteger."

**Narrador:** "Por ejemplo:"

**Narrador:** "```typescript
{
  path: 'dashboard',
  canActivate: [authGuard],
  component: DashboardComponent
}
```"

**Narrador:** "Cuando el usuario intente navegar a `/dashboard`, el router ejecutará `authGuard`. Si retorna `true`, la ruta se activa. Si retorna `false` o un `UrlTree`, la navegación se bloquea o redirige."

**Narrador:** "Puedes tener múltiples Guards en una ruta. Se ejecutan en orden, de izquierda a derecha. Si uno falla, los siguientes no se ejecutan."

**Narrador:** "Por ejemplo, si tienes `canActivate: [authGuard, adminGuard]`, primero se ejecuta `authGuard`. Si pasa, entonces se ejecuta `adminGuard`. Solo si ambos pasan, la ruta se activa."

**Narrador:** "Un punto importante: las rutas públicas, como `/signin`, NO deben tener el Guard. ¿Por qué? Porque crearías un bucle infinito. El usuario intenta acceder a `/dashboard`, el Guard lo redirige a `/signin`, pero si `/signin` también tiene el Guard... ¡bucle infinito!"

**[Pausa breve]**

---

## Sección 5: Errores Comunes (20:00 - 24:00)

**Narrador:** "Hablemos de los errores más comunes cuando trabajas con Guards."

**Narrador:** "Error número uno: usar `inject()` fuera de contexto. Recuerda, `inject()` solo funciona dentro del contexto de ejecución de Angular. Si lo pones fuera de la función del Guard, obtendrás un error."

**Narrador:** "Error número dos: olvidar retornar un valor. Si tu Guard no tiene un `return` explícito en todos los caminos, puede retornar `undefined` implícitamente, causando comportamiento inesperado."

**Narrador:** "Error número tres: crear bucles infinitos. Ya lo mencioné, pero es tan importante que vale la pena repetirlo. Las rutas públicas NO deben tener Guards."

**Narrador:** "Error número cuatro: no manejar rutas anidadas correctamente. Los Guards en rutas padre protegen las rutas hijas, pero a veces necesitas protección adicional en las hijas."

**[Pausa breve]**

---

## Sección 6: Testing de Guards (24:00 - 27:00)

**Narrador:** "Finalmente, hablemos de cómo testear Guards."

**Narrador:** "La clave es usar `TestBed.runInInjectionContext()`. Esta función ejecuta código dentro del contexto de inyección de Angular, permitiendo que `inject()` funcione correctamente en los tests."

**Narrador:** "Necesitarás mockear el `AuthService` y el `Router`. Con Jest, puedes usar `jest.fn()` para crear funciones mock."

**Narrador:** "Un test típico verifica tres cosas: que el Guard retorna `true` cuando está autenticado, que retorna `false` y redirige cuando no está autenticado, y que se llama a `isAuthenticated()` exactamente una vez."

**Narrador:** "Los tests de Guards son rápidos de ejecutar y te dan mucha confianza en tu código."

**[Pausa breve]**

---

## Cierre (27:00 - 28:30)

**Narrador:** "Y eso es todo por hoy."

**Narrador:** "Hoy aprendimos qué son los Guards, cómo implementar Guards funcionales, cómo integrarlos en las rutas, los errores más comunes, y cómo testearlos."

**Narrador:** "Recuerda: los Guards son tu primera línea de defensa para proteger rutas sensibles. Úsalos sabiamente."

**Narrador:** "Mañana, en el Día 10, comenzaremos con RxJS Fundamentals. Aprenderemos sobre Observables, Observers, y operadores básicos. Es un tema fundamental para Angular."

**Narrador:** "Si tienes preguntas, revisa los materiales del curso en la carpeta `dia-09-guards-integracion`. Hay ejercicios prácticos, una evaluación, y más recursos."

**Narrador:** "¡Gracias por escuchar! Nos vemos mañana."

**[Música de salida]**

---

## Notas de Producción

### Música
- Intro: Música suave de tecnología (10 segundos)
- Transiciones: Efecto de "whoosh" suave
- Outro: Misma música del intro (10 segundos)

### Efectos de Sonido
- Pausas: Silencio de 2 segundos
- Código: Efecto de "typing" opcional al leer código

### Pacing
- Velocidad: Moderada, 150 palabras por minuto
- Pausas: Dar tiempo al listener para procesar
- Énfasis: Resaltar palabras clave como "Guard", "inject", "canActivate"

### Referencias
- Mencionar archivos del proyecto real
- Referenciar días anteriores (Día 7: AuthService, Día 8: Interceptors)
- Conectar con el siguiente día (Día 10: RxJS)

---

*Guion de Audio - Día 9*
*Curso Angular 21 - UyuniAdmin Frontend*
