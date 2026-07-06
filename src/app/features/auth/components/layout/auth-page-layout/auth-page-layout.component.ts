import { ChangeDetectionStrategy,Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GridShapeComponent } from '@features/auth/components/grid-shape/grid-shape.component';
import { ThemeToggleTwoComponent } from '@features/auth/components/theme-toggle-two/theme-toggle-two.component';

@Component({
  selector: 'app-auth-page-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GridShapeComponent,
    RouterModule,
    ThemeToggleTwoComponent,
  ],
  templateUrl: './auth-page-layout.component.html',
  styles: ``
})
export class AuthPageLayoutComponent {

}
