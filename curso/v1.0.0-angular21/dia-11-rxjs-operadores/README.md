# Día 11: RxJS Operadores - Transformación y Control de Flujos

## 📋 Información General

- **Duración:** 6 horas
- **Módulo:** 4 - RxJS y Estado Avanzado
- **Prerrequisitos:** Día 10 (RxJS Fundamentos)
- **Nivel:** Intermedio

## 🎯 Objetivos de Aprendizaje

Al finalizar este día, el estudiante será capaz de:

1. **Usar operadores de creación** para generar Observables desde diferentes fuentes
2. **Aplicar operadores de transformación** como `map`, `switchMap`, `mergeMap` y `concatMap`
3. **Filtrar streams** con `filter`, `take`, `takeUntil`, `first`, `last`
4. **Combinar múltiples Observables** con `combineLatest`, `forkJoin`, `merge`
5. **Manejar errores** con `catchError` y `retry`
6. **Optimizar rendimiento** con `share`, `shareReplay`

## 📚 Contenido

### Teoría
- [Contenido Detallado](./contenido.md) - Material teórico completo
- [Presentación](./slides/dia-11-rxjs-operadores_Marp.md) - Slides para la clase

### Práctica
- [Lab 01: Operadores de Transformación](./ejercicios/lab-01.md) - switchMap, mergeMap, concatMap
- [Lab 02: Operadores de Combinación](./ejercicios/lab-02.md) - combineLatest, forkJoin, merge

### Evaluación
- [Preguntas de Assessment](./assessment/preguntas.md) - Evaluación del día

### Recursos
- [Bibliografía](./recursos/bibliografia.md) - Enlaces y referencias
- [Cheatsheet](./recursos/cheatsheet.md) - Referencia rápida de operadores
- [Script Audio](./recursos/script-audio.md) - Guion para podcast
- [Script Video YouTube](./recursos/script-video-youtube.md) - Guion para video

## 🗓️ Cronograma

| Hora | Actividad | Duración |
|------|-----------|----------|
| 0:00 - 0:30 | Hook y Contexto | 30 min |
| 0:30 - 1:30 | Operadores de Creación | 60 min |
| 1:30 - 2:30 | Operadores de Transformación | 60 min |
| 2:30 - 3:00 | Break | 30 min |
| 3:00 - 4:00 | Operadores de Filtrado | 60 min |
| 4:00 - 5:00 | Operadores de Combinación | 60 min |
| 5:00 - 5:30 | Mini Reto | 30 min |
| 5:30 - 6:00 | Cierre y Q&A | 30 min |

## 🎨 Estructura de Clase

### 1. Hook (0:00 - 0:15)
**Pregunta provocadora:** "¿Cómo manejas múltiples peticiones HTTP que dependen unas de otras?"

**Problema real:**
```typescript
// ❌ El infierno de las suscripciones anidadas
this.http.get('/user/1').subscribe(user => {
  this.http.get(`/orders/${user.id}`).subscribe(orders => {
    this.http.get(`/details/${orders[0].id}`).subscribe(details => {
      // ¡Ayuda! Estoy en el callback hell
    });
  });
});
```

**Solución con operadores:**
```typescript
// ✅ Elegante y mantenible
this.http.get('/user/1').pipe(
  switchMap(user => this.http.get(`/orders/${user.id}`)),
  switchMap(orders => this.http.get(`/details/${orders[0].id}`))
).subscribe(details => {
  // Código limpio y manejable
});
```

### 2. Contexto (0:15 - 0:30)
- Revisión rápida de Observables (Día 10)
- ¿Por qué necesitamos operadores?
- Categorías de operadores
- El patrón de diseño Pipeline

### 3. Explicación Simple (0:30 - 1:30)
Ver [contenido.md](./contenido.md) para detalle completo.

### 4. Demo/Código (1:30 - 4:00)
Ver [lab-01.md](./ejercicios/lab-01.md) y [lab-02.md](./ejercicios/lab-02.md).

### 5. Errores Comunes (4:00 - 4:30)
1. Usar `mergeMap` cuando se necesita `switchMap`
2. No cancelar suscripciones con `takeUntil`
3. Suscripciones anidadas en lugar de operadores
4. No manejar errores con `catchError`

### 6. Mini Reto (5:00 - 5:30)
Implementar un sistema de búsqueda con:
- Debounce de 300ms
- Filtrar búsquedas vacías
- Cancelar peticiones anteriores
- Manejar errores

### 7. Cierre (5:30 - 6:00)
- Resumen de operadores clave
- Cuándo usar cada tipo
- Recursos adicionales
- Preview del Día 12

## 📊 Operadores Clave

### De Creación
| Operador | Uso | Ejemplo |
|----------|-----|---------|
| `of` | Valores estáticos | `of(1, 2, 3)` |
| `from` | Arrays/Promises | `from([1, 2, 3])` |
| `fromEvent` | Eventos DOM | `fromEvent(input, 'input')` |
| `interval` | Emisión periódica | `interval(1000)` |
| `timer` | Emisión diferida | `timer(1000, 500)` |

### De Transformación
| Operador | Comportamiento | Uso típico |
|-----------|----------------|------------|
| `map` | Transforma cada valor | Mapeo de datos |
| `switchMap` | Cancela anterior | Búsquedas |
| `mergeMap` | Paralelo, todos | Múltiples requests |
| `concatMap` | Secuencial, uno a uno | Operaciones ordenadas |
| `exhaustMap` | Ignora nuevos | Prevención de spam |

### De Filtrado
| Operador | Comportamiento | Uso típico |
|----------|----------------|------------|
| `filter` | Filtra valores | Condiciones |
| `take` | Toma N valores | Limitar emisiones |
| `takeUntil` | Hasta que otro emita | Cleanup |
| `first` | Solo el primero | Obtener primer valor |
| `last` | Solo el último | Obtener último valor |
| `distinctUntilChanged` | Evita duplicados | Cambios reales |

### De Combinación
| Operador | Comportamiento | Uso típico |
|----------|----------------|------------|
| `combineLatest` | Combina últimos | Estado combinado |
| `forkJoin` | Espera todos | Requests paralelos |
| `merge` | Intercala valores | Múltiples fuentes |
| `zip` | Combina por índice | Sincronización |

## 🔗 Conexión con el Proyecto

En UyuniAdmin, los operadores se usan extensivamente:

### auth.interceptor.ts
```typescript
// switchMap para token refresh
return this.tokenRefreshService.refreshToken(refreshToken).pipe(
  switchMap(tokens => {
    // Reintenta la petición original con nuevo token
    return next(this.addToken(req, tokens.access_token));
  }),
  catchError(error => {
    // Maneja error de refresh
    this.authService.logout();
    return throwError(() => error);
  })
);
```

### Búsqueda de usuarios
```typescript
// Búsqueda reactiva con operadores
searchUsers(term: string): Observable<User[]> {
  return this.http.get<User[]>(`/api/users?q=${term}`).pipe(
    debounceTime(300),
    filter(t => t.length >= 2),
    distinctUntilChanged(),
    switchMap(term => this.http.get<User[]>(`/api/users?q=${term}`)),
    catchError(error => {
      this.logger.error('Search failed', error);
      return of([]);
    })
  );
}
```

### Carga de datos combinados
```typescript
// forkJoin para cargar múltiples recursos
loadDashboardData(): Observable<DashboardData> {
  return forkJoin({
    users: this.http.get<User[]>('/api/users'),
    orders: this.http.get<Order[]>('/api/orders'),
    stats: this.http.get<Stats>('/api/stats')
  }).pipe(
    map(({ users, orders, stats }) => ({
      totalUsers: users.length,
      totalOrders: orders.length,
      ...stats
    }))
  );
}
```

## 📝 Prerrequisitos

- Haber completado el Día 10 (RxJS Fundamentos)
- Conocer TypeScript básico
- Entender el concepto de Observable
- Saber qué es una suscripción

## 🚀 Después de este Día

El Día 12 cubrirá:
- Estado con Signals y RxJS
- Integración de Signals con Observables
- Patrones de estado reactivos
- Computed signals con Observables

## 📖 Referencias

- [RxJS Official Docs](https://rxjs.dev/)
- [RxMarbles - Visualización de operadores](https://rxmarbles.com/)
- [Learn RxJS](https://www.learnrxjs.io/)
- [RxJS Operator Decision Tree](https://rxjs.dev/operator-decision-tree)

---

*Día 11 - Curso Angular 21 - UyuniAdmin Frontend*
*Versión: 1.0.0*
