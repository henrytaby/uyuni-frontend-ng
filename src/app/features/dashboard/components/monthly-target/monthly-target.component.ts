import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy,Component, OnInit } from '@angular/core';

import { ChartModule } from 'primeng/chart';
import { LucideArrowDown, LucideArrowUp } from '@lucide/angular';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-monthly-target',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ChartModule,
    CommonModule,
    LucideArrowDown,
    LucideArrowUp
  ],
  templateUrl: './monthly-target.component.html',
})
export class MonthlyTargetComponent implements OnInit {
  data: ChartData<'doughnut'> | undefined;
  options: ChartOptions<'doughnut'> | undefined;
  percentage = 75.55;

  ngOnInit() {
    this.data = {
      labels: ['Progreso', 'Restante'],
      datasets: [
        {
          data: [this.percentage, 100 - this.percentage],
          backgroundColor: [
            '#465FFF',
            '#E4E7EC' // Light gray for empty part
          ],
          hoverBackgroundColor: [
            '#465FFF',
            '#E4E7EC'
          ],
          borderWidth: 0
        }
      ]
    };

    this.options = {
      cutout: '80%',
      rotation: -90,
      circumference: 180,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: false
        }
      },
      maintainAspectRatio: false,
      responsive: true
    };
  }
}
