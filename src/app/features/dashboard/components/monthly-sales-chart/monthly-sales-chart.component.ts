import { ChangeDetectionStrategy,Component, OnInit } from '@angular/core';

import { ChartModule } from 'primeng/chart';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-monthly-sales-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ChartModule,
  ],
  templateUrl: './monthly-sales-chart.component.html',
})
export class MonthlySalesChartComponent implements OnInit {
  data: ChartData | undefined;
  options: ChartOptions | undefined;
  isOpen = false;

  ngOnInit() {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color') || '#1f2937';
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary') || '#6b7280';
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border') || '#e5e7eb';

      this.data = {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
              {
                  label: 'Sales',
                  data: [168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112],
                  backgroundColor: documentStyle.getPropertyValue('--p-primary-500') || '#734c19',
                  borderColor: documentStyle.getPropertyValue('--p-primary-500') || '#734c19',
                  borderWidth: 1
              }
          ]
      };

      this.options = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
              legend: {
                  labels: {
                      color: textColor,
                      usePointStyle: true,
                      padding: 15
                  }
              }
          },
          scales: {
              y: {
                  beginAtZero: true,
                  ticks: {
                      color: textColorSecondary
                  },
                  grid: {
                      color: surfaceBorder,
                  },
                  border: {
                      display: false
                  }
              },
              x: {
                  ticks: {
                      color: textColorSecondary
                  },
                  grid: {
                      color: surfaceBorder,
                  },
                  border: {
                      display: false
                  }
              }
          }
      };
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }
}