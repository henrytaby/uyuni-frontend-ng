import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { ToggleSwitch } from 'primeng/toggleswitch';

import { CatalogItem } from '@core/models/catalog.model';

import { MarkdownEditorComponent } from '@shared/components/markdown-editor/markdown-editor.component';

import { ProductMasterFormStore } from '../../../services/product-master-form.store';
import { ProductMasterLinksComponent } from '../../product-master-links/product-master-links.component';

@Component({
  selector: 'app-product-master-tab-commercial',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputText,
    InputNumber,
    Select,
    Textarea,
    ToggleSwitch,
    MarkdownEditorComponent,
    ProductMasterLinksComponent
  ],
  templateUrl: './product-master-tab-commercial.component.html',
  styleUrls: ['./product-master-tab-commercial.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductMasterTabCommercialComponent {
  readonly store = inject(ProductMasterFormStore);

  readonly categories = input<CatalogItem[]>([]);
  readonly liveBaskets = input<CatalogItem[]>([]);
}
