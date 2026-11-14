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
  LucideBoxes,
  LucideShieldCheck,
  LucideSlidersHorizontal,
  LucideSparkles,
  LucideTag,
  LucideX
} from '@lucide/angular';

import { CatalogItem } from '@core/models/catalog.model';

import { ProductFilterState } from '../../services/product-filter.service';

@Component({
  selector: 'app-product-filter-drawer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Drawer,
    Button,
    Select,
    LucideSlidersHorizontal,
    LucideBoxes,
    LucideTag,
    LucideShieldCheck,
    LucideSparkles,
    LucideX
  ],
  templateUrl: './product-filter-drawer.component.html',
  styleUrls: ['./product-filter-drawer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductFilterDrawerComponent {
  // Two-way visibility
  readonly visible = model<boolean>(false);

  // Inputs
  readonly batches = input<CatalogItem[]>([]);
  readonly masterProducts = input<CatalogItem[]>([]);
  readonly statuses = input<CatalogItem[]>([]);
  readonly filterState = input<ProductFilterState>({
    selectedBatch: null,
    selectedMasterProduct: null,
    selectedStatus: null
  });

  // Outputs
  readonly filterApplied = output<ProductFilterState>();
  readonly filterCleared = output<void>();

  // Internal draft signals (applied only on 'Aplicar Filtros')
  readonly draftBatch = signal<string | null>(null);
  readonly draftMasterProduct = signal<string | null>(null);
  readonly draftStatus = signal<string | null>(null);

  readonly activeDraftCount = computed<number>(() => {
    let count = 0;
    if (this.draftBatch()) count++;
    if (this.draftMasterProduct()) count++;
    if (this.draftStatus()) count++;
    return count;
  });

  constructor() {
    effect(() => {
      if (this.visible()) {
        const current = this.filterState();
        this.draftBatch.set(current.selectedBatch ?? null);
        this.draftMasterProduct.set(current.selectedMasterProduct ?? null);
        this.draftStatus.set(current.selectedStatus ?? null);
      }
    });
  }

  resetDraft(): void {
    this.draftBatch.set(null);
    this.draftMasterProduct.set(null);
    this.draftStatus.set(null);
  }

  applyFilters(): void {
    const newState: ProductFilterState = {
      selectedBatch: this.draftBatch(),
      selectedMasterProduct: this.draftMasterProduct(),
      selectedStatus: this.draftStatus()
    };
    this.filterApplied.emit(newState);
    this.visible.set(false);
  }

  clearAll(): void {
    this.resetDraft();
    this.filterCleared.emit();
    this.visible.set(false);
  }
}
