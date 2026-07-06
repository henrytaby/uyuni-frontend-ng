# Día 13: Script de Video YouTube - UI con PrimeNG

## Información del Video

- **Título:** "PrimeNG en Angular 21: Tablas, Formularios y Diálogos en MINUTOS"
- **Duración:** 18-22 minutos
- **Categoría:** Educación / Programación
- **Tags:** Angular, PrimeNG, UI, TypeScript, Tutorial

---

## Estructura del Video

| Tiempo | Sección | Duración |
|--------|---------|----------|
| 0:00 | Intro y Hook | 1 min |
| 1:00 | Contexto | 2 min |
| 3:00 | Configuración | 3 min |
| 6:00 | Formularios | 4 min |
| 10:00 | Tabla de Datos | 5 min |
| 15:00 | Error Común | 2 min |
| 17:00 | Mini Reto | 2 min |
| 19:00 | Cierre | 1 min |

---

## Guión Detallado

### 0:00 - Intro y Hook

**[Cámara: Primer plano, fondo con logo Angular y PrimeNG]**

**Narrador:** "¿Quieres construir interfaces profesionales en Angular sin pasar meses desarrollando componentes? Hoy te muestro PrimeNG, la biblioteca que usamos en aplicaciones enterprise."

**[B-Roll: Demo de tabla con paginación, formulario con validación, y notificaciones]**

**Narrador:** "En los próximos 20 minutos, aprenderás a configurar PrimeNG, crear formularios con validación, implementar tablas con paginación y filtros, y mostrar notificaciones elegantes."

**[Cámara: Vuelve al presentador]**

**Narrador:** "Soy [Tu Nombre] y este es el Día 13 del Curso de Angular 21. ¡Vamos allá!"

---

### 1:00 - Contexto

**[Cámara: Presentador con pantalla dividida]**

**Narrador:** "Primero, entendamos qué es PrimeNG y por qué deberías usarlo."

**[Gráfico animado: Logo PrimeNG con características]**

**Narrador:** "PrimeNG es una biblioteca de componentes UI para Angular, creada por PrimeTek. Tiene más de 90 componentes, desde botones hasta gráficos."

**Narrador:** "¿Por qué usarla en lugar de construir tus propios componentes?"

**[Lista animada de ventajas]**

**Narrador:** "Primero, tiempo. Una tabla con paginación, ordenamiento, y filtros puede tomar semanas desde cero. Con PrimeNG, son minutos."

**Narrador:** "Segundo, calidad. Los componentes están probados, tienen accesibilidad integrada, y funcionan en todos los navegadores."

**Narrador:** "Tercero, consistencia. El tema Aura proporciona un diseño unificado que puedes personalizar para tu marca."

---

### 3:00 - Configuración

**[Cámara: Pantalla de código]**

**Narrador:** "Vamos a la práctica. Primero, instala PrimeNG y sus dependencias."

**[Terminal en pantalla]**

```bash
npm install primeng @primeuix/themes primeicons
```

**Narrador:** "Esto instala tres paquetes: primeng para los componentes, @primeuix/themes para el sistema de temas Aura, y primeicons para los iconos."

**[Pausa - 1 segundo]**

**Narrador:** "Ahora configura PrimeNG en tu app.config.ts."

**[Código aparece en pantalla]**

```typescript
import { providePrimeNG } from 'primeng/config';
import { Aura } from '@primeuix/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [
    providePrimeNG({
      ripple: true,
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.dark'
        }
      }
    })
  ]
};
```

**Narrador:** "La configuración tiene dos partes importantes: ripple activa el efecto de onda en botones, y theme configura el tema Aura con soporte para dark mode."

**[Pausa - 1 segundo]**

**Narrador:** "Finalmente, importa los estilos en tu styles.css."

**[Código CSS]**

```css
@import "primeng/resources/primeng.css";
@import "primeicons/primeicons.css";
@import "@primeuix/themes/aura";
```

---

### 6:00 - Formularios

**[Cámara: Pantalla de código]**

**Narrador:** "Ahora veamos los componentes de formulario. Empezando con el más simple: InputText."

**[Código aparece]**

```typescript
import { InputTextModule } from 'primeng/inputtext';

@Component({
  imports: [InputTextModule, FormsModule],
  template: `
    <input pInputText [(ngModel)]="username" />
  `
})
```

**Narrador:** "La directiva pInputText aplica los estilos de PrimeNG a un input nativo. Funciona con ngModel para two-way binding."

**[Pausa - 1 segundo]**

**Narrador:** "Ahora algo más interesante: Dropdown con búsqueda."

**[Código actualizado]**

```typescript
import { DropdownModule } from 'primeng/dropdown';

<p-dropdown 
  [options]="countries"
  optionLabel="name"
  optionValue="code"
  [filter]="true"
  placeholder="Selecciona país" />
```

**Narrador:** "optionLabel define qué propiedad mostrar, optionValue define qué propiedad usar como valor, y filter habilita la búsqueda."

**[Demo en vivo del dropdown con búsqueda]**

**Narrador:** "Mira cómo el usuario puede escribir para filtrar las opciones. Esto es muy útil cuando tienes muchas opciones."

---

### 10:00 - Tabla de Datos

**[Cámara: Pantalla de código]**

**Narrador:** "El componente más poderoso de PrimeNG es la tabla. Vamos a crear una tabla completa con paginación, ordenamiento, y filtros."

**[Código aparece gradualmente]**

```typescript
import { TableModule } from 'primeng/table';

<p-table 
  [value]="users"
  [paginator]="true"
  [rows]="10"
  [rowsPerPageOptions]="[10, 20, 50]">
  
  <ng-template pTemplate="header">
    <tr>
      <th pSortableColumn="name">
        Nombre <p-sortIcon field="name" />
      </th>
      <th>Email</th>
    </tr>
  </ng-template>
  
  <ng-template pTemplate="body" let-user>
    <tr>
      <td>{{ user.name }}</td>
      <td>{{ user.email }}</td>
    </tr>
  </ng-template>
</p-table>
```

**Narrador:** "Desglosemos esto: value es el array de datos, paginator activa la paginación, y rows define cuántas filas por página."

**[Pausa - 1 segundo]**

**Narrador:** "Para ordenamiento, agregas pSortableColumn en el header. El componente p-sortIcon muestra el indicador de orden."

**[Demo de la tabla ordenando y paginando]**

**Narrador:** "Ahora agreguemos filtro global."

**[Código actualizado]**

```typescript
<p-table 
  #dt
  [globalFilterFields]="['name', 'email']">
  
  <ng-template pTemplate="caption">
    <input 
      pInputText
      (input)="dt.filterGlobal($event.target.value, 'contains')" />
  </ng-template>
</p-table>
```

**Narrador:** "Necesitas ViewChild para acceder a la instancia de la tabla. Luego llamas filterGlobal con el valor de búsqueda."

**[Demo del filtro global en acción]**

---

### 15:00 - Error Común

**[Cámara: Presentador con fondo rojo]**

**Narrador:** "Ahora, el error más común que veo en proyectos que usan PrimeNG..."

**[Código con error]**

```typescript
// ❌ ERROR: Componente no funciona
@Component({
  template: `
    <p-button label="Click" />
    <p-dropdown [options]="items" />
  `
})
export class MyComponent {}
```

**Narrador:** "Este código no funciona. ¿Por qué? Porque no se importaron los módulos."

**[Pausa - 1 segundo]**

**Narrador:** "Cada componente PrimeNG tiene su propio módulo. Debes importarlo para usar el componente."

**[Código corregido]**

```typescript
// ✅ CORRECTO: Importar módulos
@Component({
  imports: [ButtonModule, DropdownModule],
  template: `
    <p-button label="Click" />
    <p-dropdown [options]="items" />
  `
})
export class MyComponent {}
```

**Narrador:** "Esto puede parecer tedioso, pero tiene una ventaja: tree-shaking. Solo incluyes en tu bundle los componentes que usas."

---

### 17:00 - Mini Reto

**[Cámara: Presentador]**

**Narrador:** "Aquí tienes un mini reto para practicar. Tienes 3 minutos."

**[Pregunta en pantalla]**

**"Implementa una tabla de productos con:**
1. **Columnas: nombre, precio, categoría**
2. **Paginación (5, 10, 20)**
3. **Ordenamiento por nombre**
4. **Filtro global**
5. **Badge para productos con stock bajo**"

**[Temporizador en pantalla: 3:00]**

**[Pausa para que el espectador intente]**

**[Después de 3 minutos]**

**Narrador:** "¿Lo lograste? Aquí está la solución:"

**[Solución en pantalla]**

```typescript
<p-table 
  #dt
  [value]="products"
  [paginator]="true"
  [rows]="10"
  [rowsPerPageOptions]="[5, 10, 20]"
  [globalFilterFields]="['name', 'category']">
  
  <ng-template pTemplate="caption">
    <input pInputText (input)="dt.filterGlobal($event.target.value, 'contains')" />
  </ng-template>
  
  <ng-template pTemplate="header">
    <tr>
      <th pSortableColumn="name">Nombre <p-sortIcon field="name" /></th>
      <th>Precio</th>
      <th>Categoría</th>
      <th>Stock</th>
    </tr>
  </ng-template>
  
  <ng-template pTemplate="body" let-product>
    <tr>
      <td>{{ product.name }}</td>
      <td>{{ product.price | currency }}</td>
      <td>{{ product.category }}</td>
      <td>
        @if (product.stock < 10) {
          <p-tag value="Bajo" severity="danger" />
        } @else {
          {{ product.stock }}
        }
      </td>
    </tr>
  </ng-template>
</p-table>
```

---

### 19:00 - Cierre

**[Cámara: Presentador]**

**Narrador:** "Hoy aprendiste a usar PrimeNG para construir UIs profesionales en Angular."

**Narrador:** "Vimos la configuración con providePrimeNG, los componentes de formulario como InputText y Dropdown, la poderosa tabla con paginación y filtros, y el error común de olvidar importar módulos."

**[Pausa - 1 segundo]**

**Narrador:** "Mañana veremos Tailwind CSS v4. Aprenderemos a usar utility classes para estilos rápidos y consistentes."

**Narrador:** "Si este video te ayudó, dale like y suscríbete. Los labs y el cheatsheet están en la descripción."

**Narrador:** "¡Nos vemos mañana!"

**[Outro con música y logo del curso]**

---

## Notas de Producción

### Visual

- Usar tema oscuro en el editor
- Fuente grande y legible (JetBrains Mono, 18px)
- Resaltar código importante con bordes o colores
- Usar demos en vivo para componentes interactivos

### Audio

- Micrófono de buena calidad
- Sin ruido de fondo
- Volumen consistente
- Pausas naturales entre secciones

### Thumbnails

**Opción 1:**
- Título: "PrimeNG Angular 21"
- Subtítulo: "Tablas y Formularios"
- Imagen: Tabla con paginación
- Colores: Azul PrimeNG + Rojo Angular

**Opción 2:**
- Título: "UI Profesional"
- Subtítulo: "Con PrimeNG"
- Imagen: Formulario con validación
- Colores: Gradiente azul

### SEO

**Título:** "PrimeNG en Angular 21: Tablas, Formularios y Diálogos en MINUTOS | Tutorial"

**Descripción:**
"Aprende a usar PrimeNG en Angular 21 para construir interfaces profesionales. Tutorial completo con tabla de datos, formularios con validación, y notificaciones. Día 13 del Curso de Angular 21.

📌 En este video aprenderás:
- Cómo configurar PrimeNG v21
- Componentes de formulario (InputText, Dropdown)
- Tabla con paginación y filtros
- Error común y cómo evitarlo
- Mini reto práctico

🔗 Recursos:
- Lab 01: [link]
- Lab 02: [link]
- Cheatsheet: [link]

⏱️ Timestamps:
0:00 - Intro
1:00 - Contexto
3:00 - Configuración
6:00 - Formularios
10:00 - Tabla de Datos
15:00 - Error Común
17:00 - Mini Reto
19:00 - Cierre

#Angular #PrimeNG #UI #TypeScript #Tutorial"

---

*Script de Video YouTube - Día 13 - Curso Angular 21 - UyuniAdmin Frontend*
