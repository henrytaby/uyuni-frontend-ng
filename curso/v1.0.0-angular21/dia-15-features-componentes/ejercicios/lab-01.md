# Lab 01: Feature Dashboard

## Información del Lab

| Atributo | Valor |
|----------|-------|
| **Duración** | 45 minutos |
| **Dificultad** | Intermedio |
| **Objetivo** | Crear un feature dashboard completo |

---

## Objetivos de Aprendizaje

Al completar este lab, serás capaz de:

1. Crear la estructura de un feature
2. Implementar un Smart Component (Page)
3. Crear Dumb Components reutilizables
4. Configurar routing lazy loaded
5. Integrar todo en el módulo principal

---

## Prerrequisitos

- Haber completado el contenido del Día 15
- Conocimiento de Signals y Input/Output
- Conocimiento de lazy loading

---

## Escenario

Vas a crear un feature de dashboard que muestra métricas y gráficos:

```
┌─────────────────────────────────────────────────────────────┐
│                    DASHBOARD OVERVIEW                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │ Users   │  │ Sales   │  │ Orders  │  │ Revenue │        │
│  │ 1,234   │  │ $12K    │  │ 567     │  │ $45K    │        │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘        │
│                                                              │
│  ┌─────────────────────────┐  ┌─────────────────────────┐  │
│  │     Sales Chart         │  │     Target Progress     │  │
│  │                         │  │                         │  │
│  │     [Chart.js]          │  │     [Progress Bar]      │  │
│  │                         │  │                         │  │
│  └─────────────────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Paso 1: Crear Estructura del Feature (5 min)

### 1.1 Crear carpetas

```bash
# Crear estructura de carpetas
mkdir -p src/app/features/dashboard/pages/overview
mkdir -p src/app/features/dashboard/components/metric-card
mkdir -p src/app/features/dashboard/components/chart-card
mkdir -p src/app/features/dashboard/services
mkdir -p src/app/features/dashboard/models
```

### 1.2 Estructura resultante

```
dashboard/
├── pages/
│   └── overview/
│       ├── overview.component.ts
│       └── overview.component.html
├── components/
│   ├── metric-card/
│   │   ├── metric-card.component.ts
│   │   └── metric-card.component.html
│   └── chart-card/
│       ├── chart-card.component.ts
│       └── chart-card.component.html
├── services/
│   └── dashboard.service.ts
├── models/
│   └── dashboard.models.ts
└── dashboard.routes.ts
```

---

## Paso 2: Crear Modelos (5 min)

### 2.1 Definir interfaces

Crea `src/app/features/dashboard/models/dashboard.models.ts`:

```typescript
export interface DashboardMetrics {
  users: number;
  usersChange: number;
  sales: number;
  salesChange: number;
  orders: number;
  ordersChange: number;
  revenue: number;
  revenueChange: number;
}

export interface MetricCard {
  id: string;
  title: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: string;
  color: 'blue' | 'green' | 'yellow' | 'red';
}

export interface SalesData {
  month: string;
  sales: number;
  target: number;
}

export interface Target {
  current: number;
  target: number;
  label: string;
}
```

---

## Paso 3: Crear Feature Service (10 min)

### 3.1 DashboardService

Crea `src/app/features/dashboard/services/dashboard.service.ts`:

```typescript
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoggerService } from '@core/services/logger.service';
import { ConfigService } from '@core/config/config.service';
import { 
  DashboardMetrics, 
  SalesData, 
  Target 
} from '../models/dashboard.models';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private logger = inject(LoggerService);
  private configService = inject(ConfigService);
  
  private apiUrl = this.configService.getApiUrl();
  
  // Cache
  private metricsCache = signal<DashboardMetrics | null>(null);
  private salesCache = signal<SalesData[] | null>(null);
  private targetCache = signal<Target | null>(null);
  
  /**
   * Obtiene las métricas del dashboard
   */
  getMetrics(): Observable<DashboardMetrics> {
    // Mock data para desarrollo
    const mockMetrics: DashboardMetrics = {
      users: 1234,
      usersChange: 12,
      sales: 12000,
      salesChange: 8,
      orders: 567,
      ordersChange: -3,
      revenue: 45000,
      revenueChange: 15
    };
    
    // En producción, usar HTTP
    // return this.http.get<DashboardMetrics>(`${this.apiUrl}/dashboard/metrics`);
    
    this.metricsCache.set(mockMetrics);
    return of(mockMetrics);
  }
  
  /**
   * Obtiene datos de ventas mensuales
   */
  getSalesData(): Observable<SalesData[]> {
    const mockData: SalesData[] = [
      { month: 'Ene', sales: 4000, target: 3500 },
      { month: 'Feb', sales: 3000, target: 3500 },
      { month: 'Mar', sales: 5000, target: 4000 },
      { month: 'Abr', sales: 4500, target: 4000 },
      { month: 'May', sales: 6000, target: 5000 },
      { month: 'Jun', sales: 5500, target: 5000 }
    ];
    
    this.salesCache.set(mockData);
    return of(mockData);
  }
  
  /**
   * Obtiene el objetivo actual
   */
  getTarget(): Observable<Target> {
    const mockTarget: Target = {
      current: 75000,
      target: 100000,
      label: 'Meta de Ventas Q2'
    };
    
    this.targetCache.set(mockTarget);
    return of(mockTarget);
  }
  
  /**
   * Invalida todo el cache
   */
  invalidateCache(): void {
    this.metricsCache.set(null);
    this.salesCache.set(null);
    this.targetCache.set(null);
    this.logger.info('Dashboard cache invalidated');
  }
}
```

---

## Paso 4: Crear Dumb Components (15 min)

### 4.1 MetricCardComponent

Crea `src/app/features/dashboard/components/metric-card/metric-card.component.ts`:

```typescript
import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricCard } from '../../models/dashboard.models';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 
             hover:shadow-lg transition-shadow cursor-pointer"
      (click)="onCardClick()">
      
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
          {{ card().title }}
        </h3>
        <span 
          [class]="getColorClasses()"
          class="p-2 rounded-lg">
          <i [class]="card().icon" class="text-xl"></i>
        </span>
      </div>
      
      <p class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {{ card().value }}
      </p>
      
      <div class="flex items-center gap-1">
        @if (card().change >= 0) {
          <i class="pi pi-arrow-up text-green-500 text-sm"></i>
        } @else {
          <i class="pi pi-arrow-down text-red-500 text-sm"></i>
        }
        <span 
          [class]="card().change >= 0 ? 'text-green-500' : 'text-red-500'"
          class="text-sm font-medium">
          {{ Math.abs(card().change) }}%
        </span>
        <span class="text-sm text-gray-500 dark:text-gray-400">
          {{ card().changeLabel }}
        </span>
      </div>
    </div>
  `
})
export class MetricCardComponent {
  card = input.required<MetricCard>();
  cardClick = output<MetricCard>();
  
  protected readonly Math = Math;
  
  onCardClick(): void {
    this.cardClick.emit(this.card());
  }
  
  getColorClasses(): string {
    const colors: Record<string, string> = {
      blue: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
      green: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400',
      yellow: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400',
      red: 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
    };
    return colors[this.card().color] || colors.blue;
  }
}
```

### 4.2 ChartCardComponent

Crea `src/app/features/dashboard/components/chart-card/chart-card.component.ts`:

```typescript
import { Component, input, output, AfterViewInit, ElementRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-chart-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {{ title() }}
      </h3>
      <div class="relative" style="height: 250px;">
        <canvas #chartCanvas></canvas>
      </div>
    </div>
  `
})
export class ChartCardComponent implements AfterViewInit {
  title = input.required<string>();
  data = input.required<{ labels: string[]; values: number[]; targets?: number[] }>();
  
  chartCanvas = viewChild.required<ElementRef<HTMLCanvasElement>>('chartCanvas');
  
  private chart: Chart | null = null;
  
  ngAfterViewInit(): void {
    this.createChart();
  }
  
  private createChart(): void {
    const canvas = this.chartCanvas().nativeHTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    if (this.chart) {
      this.chart.destroy();
    }
    
    const chartData = this.data();
    
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: 'Ventas',
            data: chartData.values,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true
          },
          ...(chartData.targets ? [{
            label: 'Objetivo',
            data: chartData.targets,
            borderColor: 'rgb(156, 163, 175)',
            borderDash: [5, 5],
            tension: 0.4,
            fill: false
          }] : [])
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
```

---

## Paso 5: Crear Smart Component (Page) (10 min)

### 5.1 OverviewComponent

Crea `src/app/features/dashboard/pages/overview/overview.component.ts`:

```typescript
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, finalize } from 'rxjs';
import { MetricCardComponent } from '../../components/metric-card/metric-card.component';
import { ChartCardComponent } from '../../components/chart-card/chart-card.component';
import { DashboardService } from '../../services/dashboard.service';
import { LoggerService } from '@core/services/logger.service';
import { MetricCard, DashboardMetrics, SalesData, Target } from '../../models/dashboard.models';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [
    CommonModule,
    MetricCardComponent,
    ChartCardComponent
  ],
  template: `
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p class="text-gray-500 dark:text-gray-400">
          Resumen de métricas y rendimiento
        </p>
      </div>
      
      <!-- Loading state -->
      @if (isLoading()) {
        <div class="flex justify-center items-center h-64">
          <i class="pi pi-spinner pi-spin text-4xl text-blue-500"></i>
        </div>
      } @else {
        <!-- Metrics Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          @for (card of metricCards(); track card.id) {
            <app-metric-card 
              [card]="card"
              (cardClick)="onMetricClick($event)" />
          }
        </div>
        
        <!-- Charts Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <app-chart-card 
            title="Ventas Mensuales"
            [data]="salesChartData()" />
            
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Progreso de Meta
            </h3>
            @if (target()) {
              <div class="space-y-4">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500 dark:text-gray-400">
                    {{ target()!.label }}
                  </span>
                  <span class="font-medium text-gray-900 dark:text-white">
                    {{ target()!.current | currency }} / {{ target()!.target | currency }}
                  </span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <div 
                    class="bg-blue-500 h-4 rounded-full transition-all duration-500"
                    [style.width.%]="getProgressPercentage()">
                  </div>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ getProgressPercentage() | number:'1.0-0' }}% completado
                </p>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class OverviewComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private logger = inject(LoggerService);
  
  // Estado
  isLoading = signal(true);
  metrics = signal<DashboardMetrics | null>(null);
  salesData = signal<SalesData[]>([]);
  target = signal<Target | null>(null);
  
  // Computed
  metricCards = signal<MetricCard[]>([]);
  salesChartData = signal<{ labels: string[]; values: number[]; targets: number[] }>({
    labels: [],
    values: [],
    targets: []
  });
  
  ngOnInit(): void {
    this.loadDashboardData();
  }
  
  private loadDashboardData(): void {
    this.isLoading.set(true);
    
    forkJoin({
      metrics: this.dashboardService.getMetrics(),
      sales: this.dashboardService.getSalesData(),
      target: this.dashboardService.getTarget()
    }).pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: ({ metrics, sales, target }) => {
        this.metrics.set(metrics);
        this.salesData.set(sales);
        this.target.set(target);
        
        // Transformar a metric cards
        this.metricCards.set([
          {
            id: 'users',
            title: 'Usuarios',
            value: metrics.users.toLocaleString(),
            change: metrics.usersChange,
            changeLabel: 'vs mes anterior',
            icon: 'pi pi-users',
            color: 'blue'
          },
          {
            id: 'sales',
            title: 'Ventas',
            value: `$${(metrics.sales / 1000).toFixed(0)}K`,
            change: metrics.salesChange,
            changeLabel: 'vs mes anterior',
            icon: 'pi pi-dollar',
            color: 'green'
          },
          {
            id: 'orders',
            title: 'Pedidos',
            value: metrics.orders.toLocaleString(),
            change: metrics.ordersChange,
            changeLabel: 'vs ayer',
            icon: 'pi pi-shopping-cart',
            color: 'yellow'
          },
          {
            id: 'revenue',
            title: 'Ingresos',
            value: `$${(metrics.revenue / 1000).toFixed(0)}K`,
            change: metrics.revenueChange,
            changeLabel: 'vs mes anterior',
            icon: 'pi pi-chart-line',
            color: 'red'
          }
        ]);
        
        // Transformar sales data
        this.salesChartData.set({
          labels: sales.map(s => s.month),
          values: sales.map(s => s.sales),
          targets: sales.map(s => s.target)
        });
        
        this.logger.info('Dashboard data loaded');
      },
      error: (err) => {
        this.logger.error('Failed to load dashboard data', err);
      }
    });
  }
  
  onMetricClick(card: MetricCard): void {
    this.logger.info('Metric card clicked', { id: card.id });
    // Navegación o acción específica
  }
  
  getProgressPercentage(): number {
    const target = this.target();
    if (!target) return 0;
    return Math.min((target.current / target.target) * 100, 100);
  }
}
```

---

## Paso 6: Configurar Routing (5 min)

### 6.1 Feature Routes

Crea `src/app/features/dashboard/dashboard.routes.ts`:

```typescript
import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => 
      import('./pages/overview/overview.component').then(m => m.OverviewComponent)
  }
];
```

### 6.2 App Routes

Actualiza `src/app/app.routes.ts`:

```typescript
import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => 
          import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
      },
      // ... otros features
    ]
  },
  // Auth routes (sin guard)
  {
    path: 'signin',
    loadComponent: () => 
      import('./features/auth/pages/sign-in/sign-in.component').then(m => m.SignInComponent)
  },
  // ... otras rutas
];
```

---

## Verificación

### Checklist de completitud:

- [ ] La estructura de carpetas está creada
- [ ] Los modelos están definidos
- [ ] El servicio funciona correctamente
- [ ] Los dumb components son reutilizables
- [ ] El smart component coordina todo
- [ ] El routing está configurado

### Comando de verificación:

```bash
# Iniciar el servidor de desarrollo
npm start

# Navegar a http://localhost:4200/dashboard
# Verificar que el dashboard se renderiza correctamente
```

---

## Retos Adicionales

### Reto 1: Agregar refresh
Agregar un botón de refresh que invalide el cache y recargue los datos.

### Reto 2: Agregar filtros de fecha
Permitir filtrar los datos por rango de fechas.

### Reto 3: Agregar más gráficos
Agregar un gráfico de torta para distribución de ventas por categoría.

---

## Solución de Problemas

### Problema: Los gráficos no se renderizan
**Solución:** Verifica que Chart.js esté instalado y registrado.

### Problema: El routing no funciona
**Solución:** Verifica que el feature esté importado en app.routes.ts.

### Problema: Los signals no actualizan
**Solución:** Asegúrate de usar .set() o .update() para modificar signals.

---

*Lab 01 - Día 15 - Curso Angular 21 - UyuniAdmin Frontend*
