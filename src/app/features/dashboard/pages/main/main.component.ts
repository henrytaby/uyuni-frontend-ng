import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AuthService } from '@core/auth/auth.service';

import { AdminViewComponent } from '../../components/admin-view/admin-view.component';
import { ClientViewComponent } from '../../components/client-view/client-view.component';
import { DefaultViewComponent } from '../../components/default-view/default-view.component';

@Component({
  selector: 'app-dashboard-main',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AdminViewComponent, ClientViewComponent, DefaultViewComponent],
  templateUrl: './main.component.html'
})
export class MainComponent {
  private authService = inject(AuthService);
  
  // Usamos el signal directamente para la reactividad en el HTML
  activeRole = this.authService.activeRole;
}
