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
  LucideCoins,
  LucideDollarSign,
  LucideShieldCheck,
  LucideSlidersHorizontal,
  LucideSparkles,
  LucideX
} from '@lucide/angular';

import { CatalogItem } from '@core/models/catalog.model';

import { BatchFilterState } from '../../services/batch-filter.service';

@Component({
  selector: 'app-batch-filter-drawer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Drawer,
    Button,
    Select,
    LucideSlidersHorizontal,
    LucideShieldCheck,
    LucideDollarSign,
    LucideCoins,
    LucideSparkles,
    LucideX
  ],
  templateUrl: './batch-filter-drawer.component.html',
  styleUrls: ['./batch-filter-drawer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BatchFilterDrawerComponent {
  // Two-way visibility
  readonly visible = model<boolean>(false);

  // Inputs
  readonly statuses = input<CatalogItem[]>([]);
  readonly financialStatuses = input<CatalogItem[]>([]);
  readonly investmentRounds = input<CatalogItem[]>([]);
  readonly filterState = input<BatchFilterState>({
    selectedStatus: null,
    selectedFinancialStatus: null,
    selectedRound: null
  });

  // Outputs
  readonly filterApplied = output<BatchFilterState>();
  readonly filterCleared = output<void>();

  // Internal draft signals
  readonly draftStatus = signal<string | null>(null);
  readonly draftFinancialStatus = signal<string | null>(null);
  readonly draftRound = signal<string | null>(null);

  readonly activeDraftCount = computed<number>(() => {
    let count = 0;
    if (this.draftStatus()) count++;
    if (this.draftFinancialStatus()) count++;
    if (this.draftRound()) count++;
    return count;
  });

  constructor() {
    effect(() => {
      if (this.visible()) {
        const current = this.filterState();
        this.draftStatus.set(current.selectedStatus ?? null);
        this.draftFinancialStatus.set(current.selectedFinancialStatus ?? null);
        this.draftRound.set(current.selectedRound ?? null);
      }
    });
  }

  resetDraft(): void {
    this.draftStatus.set(null);
    this.draftFinancialStatus.set(null);
    this.draftRound.set(null);
  }

  applyFilters(): void {
    const newState: BatchFilterState = {
      selectedStatus: this.draftStatus(),
      selectedFinancialStatus: this.draftFinancialStatus(),
      selectedRound: this.draftRound()
    };
    this.filterApplied.emit(newState);
    this.visible.set(false);
  }

  clearFilters(): void {
    this.resetDraft();
    this.filterCleared.emit();
    this.visible.set(false);
  }
}
