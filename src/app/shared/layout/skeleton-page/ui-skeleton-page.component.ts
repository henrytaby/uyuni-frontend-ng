import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy,Component } from '@angular/core';

import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-ui-skeleton-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, SkeletonModule],
  templateUrl: './ui-skeleton-page.component.html',
  styles: ``
})
export class UiSkeletonPageComponent {}
