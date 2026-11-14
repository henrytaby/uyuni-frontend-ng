import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Textarea } from 'primeng/textarea';
import { ToggleSwitch } from 'primeng/toggleswitch';

import { ProductMasterFormStore } from '../../../services/product-master-form.store';
import { ProductMasterLinksComponent } from '../../product-master-links/product-master-links.component';

@Component({
  selector: 'app-product-master-tab-marketing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Textarea,
    ToggleSwitch,
    ProductMasterLinksComponent
  ],
  templateUrl: './product-master-tab-marketing.component.html',
  styleUrls: ['./product-master-tab-marketing.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductMasterTabMarketingComponent {
  readonly store = inject(ProductMasterFormStore);
}
