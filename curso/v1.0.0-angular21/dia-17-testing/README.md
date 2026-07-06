# Día 17: Testing

## Información General

| Atributo | Valor |
|----------|-------|
| **Módulo** | 7 - Testing y CI/CD |
| **Duración** | 3 horas |
| **Prerrequisitos** | Días 1-16 completados |
| **Nivel** | Intermedio |

## Objetivos de Aprendizaje

Al finalizar este día, el estudiante será capaz de:

1. **Configurar Jest** en proyectos Angular 21
2. **Escribir unit tests** para servicios y componentes
3. **Testear Signals** y estado reactivo
4. **Mockear dependencias** correctamente
5. **Alcanzar coverage** mínimo del 80%

## Estructura de Archivos

```
dia-17-testing/
├── README.md                 # Este archivo
├── contenido.md              # Contenido detallado
├── slides/
│   └── dia-17-testing_Marp.md       # Slides de la clase
├── ejercicios/
│   ├── lab-01.md            # Lab: Testing de servicios
│   └── lab-02.md            # Lab: Testing de componentes
├── assessment/
│   └── preguntas.md         # Preguntas de evaluación
└── recursos/
    ├── bibliografia.md       # Recursos adicionales
    ├── cheatsheet.md         # Referencia rápida
    ├── script-audio.md       # Guion de podcast
    └── script-video-youtube.md # Guion de video
```

## Temas Cubiertos

### 1. Configuración de Jest
- Instalación y configuración
- jest.config.js
- setup-jest.ts
- Integración con Angular CLI

### 2. Testing de Servicios
- TestBed configuration
- Inyección de dependencias
- Mocking de HttpClient
- Testing de Signals

### 3. Testing de Componentes
- ComponentFixture
- DebugElement
- Testing de inputs/outputs
- Testing de eventos

### 4. Testing de Guards e Interceptors
- Testing funcional guards
- Testing HTTP interceptors
- TestBed.runInInjectionContext

### 5. Coverage y Best Practices
- Coverage thresholds
- Nombrar tests descriptivamente
- AAA Pattern (Arrange-Act-Assert)

## Conceptos Clave

| Concepto | Descripción |
|----------|-------------|
| **Jest** | Framework de testing de JavaScript |
| **TestBed** | Utilidad de Angular para testing |
| **Fixture** | Wrapper para testing de componentes |
| **Mock** | Objeto que simula comportamiento |
| **Spy** | Función que registra llamadas |
| **Coverage** | Porcentaje de código testeado |

## Ejemplos de Código

### Test de Servicio Básico

```typescript
describe('LoggerService', () => {
  let service: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log info messages', () => {
    const consoleSpy = jest.spyOn(console, 'info');
    service.info('Test message');
    expect(consoleSpy).toHaveBeenCalledWith('[INFO]', 'Test message');
  });
});
```

### Test de Componente con Signals

```typescript
describe('UserDropdownComponent', () => {
  let component: UserDropdownComponent;
  let fixture: ComponentFixture<UserDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDropdownComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UserDropdownComponent);
    component = fixture.componentInstance;
  });

  it('should display user name', () => {
    component.user.set({ name: 'John Doe' });
    fixture.detectChanges();
    
    const userName = fixture.nativeElement.querySelector('.user-name');
    expect(userName.textContent).toBe('John Doe');
  });
});
```

### Test de Guard

```typescript
describe('authGuard', () => {
  it('should return true when authenticated', () => {
    const mockAuthService = { isAuthenticated: () => true };
    
    TestBed.runInInjectionContext(() => {
      const result = authGuard(mockRoute, mockState);
      expect(result).toBe(true);
    });
  });
});
```

## Labs del Día

| Lab | Título | Duración | Descripción |
|-----|--------|----------|-------------|
| 01 | Testing de Servicios | 45 min | Testear LoggerService, LoadingService |
| 02 | Testing de Componentes | 45 min | Testear UserDropdownComponent |

## Recursos Necesarios

- Node.js 18+
- Jest configurado en el proyecto
- VS Code con extensiones de testing
- Proyecto UyuniAdmin como referencia

## Evaluación

- 10 preguntas de opción múltiple
- 2 ejercicios prácticos
- Coverage mínimo esperado: 80%

## Siguiente Día

**Día 18: CI/CD y Deployment**
- GitHub Actions
- Pipeline de CI/CD
- Deployment a producción

---

*Día 17 - Módulo 7: Testing y CI/CD - Curso Angular 21 - UyuniAdmin Frontend*
