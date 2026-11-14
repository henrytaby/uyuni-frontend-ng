import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AuthService } from '@core/auth/auth.service';

import { UiSkeletonPageComponent } from '@shared/layout/skeleton-page/ui-skeleton-page.component';

import { AdminViewComponent } from '../../components/admin-view/admin-view.component';
import { ClientViewComponent } from '../../components/client-view/client-view.component';
import { DefaultViewComponent } from '../../components/default-view/default-view.component';

@Component({
  selector: 'app-dashboard-main',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AdminViewComponent, ClientViewComponent, DefaultViewComponent, UiSkeletonPageComponent],
  templateUrl: './main.component.html'
})
export class MainComponent {
  private authService = inject(AuthService);
  
  // Usamos los signals directamente para la reactividad en el HTML
  readonly activeRole = this.authService.activeRole;
  readonly isLoadingRoles = this.authService.isLoadingRoles;
}
