# Assessment: Día 17 - Testing

## Información General

| Atributo | Valor |
|----------|-------|
| **Total de Preguntas** | 10 |
| **Tiempo Estimado** | 15 minutos |
| **Puntaje Mínimo** | 70% (7 respuestas correctas) |

---

## Preguntas de Opción Múltiple

### Pregunta 1: AAA Pattern

¿Qué significa el patrón AAA en testing?

- [ ] A) Async, Await, Action
- [ ] B) Arrange, Act, Assert
- [ ] C) Angular, Application, Architecture
- [ ] D) Automatic, Automated, Autonomous

<details>
<summary>Respuesta Correcta</summary>

**B) Arrange, Act, Assert**

El patrón AAA estructura los tests en tres fases:
- **Arrange**: Configurar el entorno del test
- **Act**: Ejecutar la acción a testear
- **Assert**: Verificar el resultado

</details>

---

### Pregunta 2: TestBed

¿Cuál es el propósito principal de TestBed en Angular?

- [ ] A) Ejecutar tests en paralelo
- [ ] B) Configurar el entorno de testing para componentes y servicios
- [ ] C) Generar reportes de coverage
- [ ] D) Mockear automáticamente todas las dependencias

<details>
<summary>Respuesta Correcta</summary>

**B) Configurar el entorno de testing para componentes y servicios**

TestBed es la utilidad principal de Angular para configurar el entorno de testing. Permite:
- Configurar módulos de testing
- Crear componentes para testing
- Inyectar servicios
- Compilar componentes

</details>

---

### Pregunta 3: ComponentFixture

¿Qué método se debe llamar después de cambiar un signal en un componente para que los cambios se reflejen en el DOM?

- [ ] A) `component.update()`
- [ ] B) `fixture.detectChanges()`
- [ ] C) `fixture.updateTemplate()`
- [ ] D) `component.refresh()`

<details>
<summary>Respuesta Correcta</summary>

**B) `fixture.detectChanges()`**

Después de cambiar signals o inputs en un componente, se debe llamar `fixture.detectChanges()` para que Angular actualice el DOM. Sin esta llamada, los cambios no se reflejan en el template.

</details>

---

### Pregunta 4: Mocking

¿Cuál es la forma correcta de mockear un servicio en TestBed?

- [ ] A) 
```typescript
TestBed.configureTestingModule({
  imports: [AuthService]
});
```

- [ ] B)
```typescript
TestBed.configureTestingModule({
  providers: [
    { provide: AuthService, useValue: mockAuthService }
  ]
});
```

- [ ] C)
```typescript
TestBed.configureTestingModule({
  services: [mockAuthService]
});
```

- [ ] D)
```typescript
TestBed.mock(AuthService, mockAuthService);
```

<details>
<summary>Respuesta Correcta</summary>

**B)**
```typescript
TestBed.configureTestingModule({
  providers: [
    { provide: AuthService, useValue: mockAuthService }
  ]
});
```

Se usa `providers` con `provide` y `useValue` para proporcionar un mock del servicio.

</details>

---

### Pregunta 5: Testing de Guards

¿Qué método de TestBed se usa para testear guards funcionales?

- [ ] A) `TestBed.createComponent()`
- [ ] B) `TestBed.inject()`
- [ ] C) `TestBed.runInInjectionContext()`
- [ ] D) `TestBed.compileComponents()`

<details>
<summary>Respuesta Correcta</summary>

**C) `TestBed.runInInjectionContext()`**

Los guards funcionales usan `inject()` internamente, que requiere un contexto de inyección. `runInInjectionContext` proporciona ese contexto.

```typescript
const result = TestBed.runInInjectionContext(() => 
  authGuard(mockRoute, mockState)
);
```

</details>

---

### Pregunta 6: Spies

¿Cómo se limpian los spies después de cada test?

- [ ] A) `spy.clear()`
- [ ] B) `jest.clearAllMocks()` en `afterEach`
- [ ] C) `spy.reset()`
- [ ] D) Los spies se limpian automáticamente

<details>
<summary>Respuesta Correcta</summary>

**B) `jest.clearAllMocks()` en `afterEach`**

Es buena práctica limpiar los mocks después de cada test:

```typescript
afterEach(() => {
  jest.clearAllMocks();
});
```

O usar `jest.restoreAllMocks()` para restaurar la implementación original.

</details>

---

### Pregunta 7: Coverage

¿Cuál es el coverage mínimo recomendado para statements?

- [ ] A) 50%
- [ ] B) 60%
- [ ] C) 80%
- [ ] D) 100%

<details>
<summary>Respuesta Correcta</summary>

**C) 80%**

El estándar de la industria es un mínimo de 80% de coverage para statements. Sin embargo, el coverage no lo es todo - la calidad de los tests importa más que el número.

```javascript
coverageThreshold: {
  global: {
    statements: 80
  }
}
```

</details>

---

### Pregunta 8: Testing de Signals

¿Cómo se testea un signal en un servicio?

- [ ] A) Se suscribe al signal
- [ ] B) Se llama al signal como función: `signal()`
- [ ] C) Se usa `signal.value`
- [ ] D) Se usa `signal.get()`

<details>
<summary>Respuesta Correcta</summary>

**B) Se llama al signal como función: `signal()`**

Los signals son funciones. Para obtener su valor, se llaman:

```typescript
expect(service.isLoading()).toBe(true);
```

</details>

---

### Pregunta 9: Testing de Outputs

¿Cómo se verifica que un output se emitió?

- [ ] A) Se usa `expect(component.output).toHaveEmitted()`
- [ ] B) Se subscribe al output y se usa un spy
- [ ] C) Se usa `fixture.checkOutputs()`
- [ ] D) Se accede a `component.output.value`

<details>
<summary>Respuesta Correcta</summary>

**B) Se subscribe al output y se usa un spy**

```typescript
it('should emit on click', () => {
  const spy = jest.fn();
  component.onClick.subscribe(spy);
  
  fixture.detectChanges();
  fixture.nativeElement.querySelector('button').click();
  
  expect(spy).toHaveBeenCalled();
});
```

</details>

---

### Pregunta 10: Pirámide de Testing

¿Por qué se recomienda tener más unit tests que E2E tests?

- [ ] A) Los E2E tests son más difíciles de escribir
- [ ] B) Los unit tests son más rápidos y aislados
- [ ] C) Los E2E tests no detectan bugs
- [ ] D) Los unit tests son más populares

<details>
<summary>Respuesta Correcta</summary>

**B) Los unit tests son más rápidos y aislados**

La pirámide de testing recomienda:
- **Muchos unit tests**: Rápidos, aislados, fáciles de debuggear
- **Algunos integration tests**: Prueban interacciones
- **Pocos E2E tests**: Lentos, pero prueban flujos completos

Los unit tests dan feedback rápido y ayudan a localizar errores.

</details>

---

## Ejercicios Prácticos

### Ejercicio 1: Completar el Test (5 min)

Completa el siguiente test para el `LoadingService`:

```typescript
describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('should handle multiple show/hide calls', () => {
    // Arrange: Llamar show() 3 veces
    
    // Act: Llamar hide() 2 veces
    
    // Assert: Verificar que isLoading() es true
    
  });
});
```

<details>
<summary>Solución</summary>

```typescript
it('should handle multiple show/hide calls', () => {
  // Arrange
  service.show();
  service.show();
  service.show();
  
  // Act
  service.hide();
  service.hide();
  
  // Assert
  expect(service.isLoading()).toBe(true);
});
```

</details>

---

### Ejercicio 2: Escribir Test para Componente (10 min)

Escribe un test para verificar que un componente muestra "No user" cuando el usuario es null:

```typescript
describe('UserGreetingComponent', () => {
  let component: UserGreetingComponent;
  let fixture: ComponentFixture<UserGreetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserGreetingComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UserGreetingComponent);
    component = fixture.componentInstance;
  });

  // Escribe el test aquí
  
});
```

<details>
<summary>Solución</summary>

```typescript
it('should display "No user" when user is null', () => {
  // Arrange
  component.user.set(null);
  
  // Act
  fixture.detectChanges();
  
  // Assert
  const greeting = fixture.nativeElement.querySelector('.greeting');
  expect(greeting.textContent).toBe('No user');
});
```

</details>

---

## Respuestas

| Pregunta | Respuesta |
|----------|-----------|
| 1 | B |
| 2 | B |
| 3 | B |
| 4 | B |
| 5 | C |
| 6 | B |
| 7 | C |
| 8 | B |
| 9 | B |
| 10 | B |

---

## Evaluación

| Puntaje | Resultado |
|---------|-----------|
| 10/10 | ¡Excelente! Dominas testing en Angular |
| 8-9/10 | Muy bien. Repasa los conceptos que fallaste |
| 7/10 | Aprobado. Practica más con los labs |
| < 7 | Repasa el contenido del día antes de continuar |

---

*Assessment - Día 17 - Testing - Curso Angular 21*
