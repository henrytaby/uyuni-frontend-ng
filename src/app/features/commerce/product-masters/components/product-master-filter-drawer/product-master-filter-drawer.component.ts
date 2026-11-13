import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  model,
  output,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Button } from 'primeng/button';
import { Drawer } from 'primeng/drawer';
import { Select } from 'primeng/select';
import {
  LucideCircleCheck,
  LucideSlidersHorizontal,
  LucideSparkles,
  LucideTag,
  LucideTv,
  LucideX
} from '@lucide/angular';

import { CatalogItem } from '@core/models/catalog.model';

import { ProductMasterFilterState } from '../../services/product-master-filter.service';

@Component({
  selector: 'app-product-master-filter-drawer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Drawer,
    Button,
    Select,
    LucideSlidersHorizontal,
    LucideTag,
    LucideTv,
    LucideCircleCheck,
    LucideSparkles,
    LucideX
  ],
  templateUrl: './product-master-filter-drawer.component.html',
  styleUrls: ['./product-master-filter-drawer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductMasterFilterDrawerComponent {
  // Two-way visibility
  readonly visible = model<boolean>(false);

  // Inputs
  readonly categories = input<CatalogItem[]>([]);
  readonly liveBaskets = input<CatalogItem[]>([]);
  readonly filterState = input<ProductMasterFilterState>({
    selectedCategory: null,
    selectedLiveBasket: null,
    selectedActivo: null
  });

  // Outputs
  readonly filterApplied = output<ProductMasterFilterState>();
  readonly filterCleared = output<void>();

  // Internal draft signals (applied only when clicking 'Aplicar Filtros')
  readonly draftCategory = signal<string | null>(null);
  readonly draftLiveBasket = signal<string | null>(null);
  readonly draftActivo = signal<boolean | null>(null);

  readonly activeDraftCount = computed<number>(() => {
    let count = 0;
    if (this.draftCategory()) count++;
    if (this.draftLiveBasket()) count++;
    if (this.draftActivo() !== null) count++;
    return count;
  });

  constructor() {
    effect(() => {
      // Sincronizar estado actual cuando se abre el drawer
      if (this.visible()) {
        const current = this.filterState();
        this.draftCategory.set(current.selectedCategory ?? null);
        this.draftLiveBasket.set(current.selectedLiveBasket ?? null);
        this.draftActivo.set(current.selectedActivo ?? null);
      }
    });
  }

  resetDraft(): void {
    this.draftCategory.set(null);
    this.draftLiveBasket.set(null);
    this.draftActivo.set(null);
  }

  applyFilters(): void {
    this.filterApplied.emit({
      selectedCategory: this.draftCategory(),
      selectedLiveBasket: this.draftLiveBasket(),
      selectedActivo: this.draftActivo()
    });
    this.visible.set(false);
  }

  clearAll(): void {
    this.resetDraft();
    this.filterCleared.emit();
    this.visible.set(false);
  }
}
