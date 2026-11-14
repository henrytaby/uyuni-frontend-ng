import { CommonModule, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { InputNumber } from 'primeng/inputnumber';
import { Tooltip } from 'primeng/tooltip';
import {
  LucideCircleAlert,
  LucideDollarSign,
  LucideInfo,
  LucideLayers,
  LucidePackage
} from '@lucide/angular';

import { ProductMasterFormStore } from '../../../services/product-master-form.store';

@Component({
  selector: 'app-product-master-tab-pricing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DecimalPipe,
    InputNumber,
    Tooltip,
    LucidePackage,
    LucideDollarSign,
    LucideInfo,
    LucideCircleAlert,
    LucideLayers
  ],
  templateUrl: './product-master-tab-pricing.component.html',
  styleUrls: ['./product-master-tab-pricing.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductMasterTabPricingComponent {
  readonly store = inject(ProductMasterFormStore);
}
