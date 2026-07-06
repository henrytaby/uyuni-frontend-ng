import { Location } from '@angular/common';
import { ChangeDetectionStrategy,Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { LucideCircleAlert } from '@lucide/angular';

@Component({
  selector: 'app-not-found',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    ButtonModule,
    RippleModule,
    LucideCircleAlert
  ],
  templateUrl: './not-found.component.html',
  styles: ``
})
export class NotFoundComponent {
  private location = inject(Location);
  currentYear: number = new Date().getFullYear();

  goBack(): void {
    this.location.back();
  }
}
