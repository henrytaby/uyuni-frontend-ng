import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy,Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LucideChevronRight,LucideHouse } from '@lucide/angular';

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

@Component({
  selector: 'app-page-breadcrumb',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    CommonModule,
    LucideHouse,
    LucideChevronRight
  ],
  templateUrl: './page-breadcrumb.component.html',
})
export class PageBreadcrumbComponent {
  pageTitle = input<string>('');
  items = input<BreadcrumbItem[]>([]);
}
