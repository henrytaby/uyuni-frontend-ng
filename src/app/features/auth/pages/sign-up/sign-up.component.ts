import { ChangeDetectionStrategy,Component } from '@angular/core';

import { AuthPageLayoutComponent } from '@features/auth/components/layout/auth-page-layout/auth-page-layout.component';
import { SignupFormComponent } from '@features/auth/components/signup-form/signup-form.component';

@Component({
  selector: 'app-sign-up',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AuthPageLayoutComponent,
    SignupFormComponent,
  ],
  templateUrl: './sign-up.component.html',
  styles: ``
})
export class SignUpComponent {

}
