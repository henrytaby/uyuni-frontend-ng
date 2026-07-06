import { ChangeDetectionStrategy,Component } from '@angular/core';

import { TagModule } from 'primeng/tag';
import { LucidePackage,LucideUsers } from '@lucide/angular';

@Component({
  selector: 'app-ecommerce-metrics',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TagModule, LucideUsers, LucidePackage],
  templateUrl: './ecommerce-metrics.component.html'
})
export class EcommerceMetricsComponent {
  // No custom icons needed, using PrimeIcons
}
