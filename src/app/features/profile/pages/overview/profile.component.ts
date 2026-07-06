
import { ChangeDetectionStrategy,Component } from '@angular/core';

import { PageBreadcrumbComponent } from '@shared/components/common/page-breadcrumb/page-breadcrumb.component';

import { UserAddressCardComponent } from '../../components/user-address-card/user-address-card.component';
import { UserInfoCardComponent } from '../../components/user-info-card/user-info-card.component';
import { UserMetaCardComponent } from '../../components/user-meta-card/user-meta-card.component';

@Component({
  selector: 'app-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageBreadcrumbComponent,
    UserMetaCardComponent,
    UserInfoCardComponent,
    UserAddressCardComponent
],
  templateUrl: './profile.component.html',
  styles: ``
})
export class ProfileComponent {

}
