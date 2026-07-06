import { ChangeDetectionStrategy,Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ChartModule } from 'primeng/chart';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ChartData, ChartOptions } from 'chart.js';


@Component({
  selector: 'app-statics-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChartModule, SelectButtonModule, DatePickerModule, FormsModule],
  templateUrl: './statics-chart.component.html',
})
export class StatisticsChartComponent implements OnInit {
  dateValue: Date[] | undefined;
  data: ChartData | undefined;
  options: ChartOptions | undefined;

  periodOptions: { label: string; value: string }[] = [
    { label: 'Mensual', value: 'monthly' },
    { label: 'Trimestral', value: 'quarterly' },
    { label: 'Anual', value: 'annually' }
  ];

  selectedPeriod = 'monthly';


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
                  data: [180, 190, 170, 160, 175, 165, 170, 205, 230, 210, 240, 235],
                  fill: true,
                  borderColor: documentStyle.getPropertyValue('--p-primary-500') || '#734c19',
                  tension: 0.4,
                  backgroundColor: 'rgba(115, 76, 25, 0.2)'
              },
              {
                  label: 'Revenue',
                  data: [40, 30, 50, 40, 55, 40, 70, 100, 110, 120, 150, 140],
                  fill: true,
                  borderColor: '#9CB9FF',
                  tension: 0.4,
                  backgroundColor: 'rgba(156, 185, 255, 0.2)'
              }
          ]
      };

      this.options = {
          responsive: true,
          maintainAspectRatio: false,
          aspectRatio: 0.6,
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
              },
              y: {
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
}
