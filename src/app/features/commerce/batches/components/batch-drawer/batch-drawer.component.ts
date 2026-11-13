import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ConfirmationService, MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Drawer } from 'primeng/drawer';
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { Textarea } from 'primeng/textarea';
import { Tooltip } from 'primeng/tooltip';
import {
  LucideBoxes,
  LucideCopy,
  LucideDollarSign,
  LucideInfo,
  LucideShieldCheck,
  LucideTag
} from '@lucide/angular';

import { CatalogItem } from '@core/models/catalog.model';
import { LoggerService } from '@core/services/logger.service';

import {
  Batch,
  BatchCreatePayload,
  BatchUpdatePayload
} from '../../models/batch.model';
import { BatchService } from '../../services/batch.service';

@Component({
  selector: 'app-batch-drawer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Drawer,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Button,
    InputText,
    InputNumber,
    Select,
    Textarea,
    Tooltip,
    LucideBoxes,
    LucideTag,
    LucideDollarSign,
    LucideInfo,
    LucideCopy,
    LucideShieldCheck
  ],
  templateUrl: './batch-drawer.component.html',
  styleUrls: ['./batch-drawer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BatchDrawerComponent {
  private readonly batchService = inject(BatchService);
  private readonly logger = inject(LoggerService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  // Two-way and inputs
  readonly visible = model<boolean>(false);
  readonly batch = input<Batch | null>(null);
  readonly mode = input<'create' | 'edit'>('create');
  readonly investmentRounds = input<CatalogItem[]>([]);
  readonly statuses = input<CatalogItem[]>([]);
  readonly financialStatuses = input<CatalogItem[]>([]);

  // Outputs
  readonly batchSaved = output<Batch>();
  readonly batchDeleted = output<string>();
  readonly batchRecalculated = output<Batch>();

  // State
  readonly activeTab = signal<string>('0');
  readonly isSubmitting = signal<boolean>(false);
  readonly isLoadingDetails = signal<boolean>(false);
  readonly isRecalculating = signal<boolean>(false);
  readonly freshBatch = signal<Batch | null>(null);

  readonly currentDisplayBatch = computed<Batch | null>(() => {
    return this.freshBatch() || this.batch();
  });

  onTabChange(tab: string | number | undefined): void {
    if (tab !== undefined) {
      this.activeTab.set(String(tab));
    }
  }

  // Form Signals - Tab 0: Identificación & Procedencia
  readonly code = signal<string>('');
  readonly name = signal<string>('');
  readonly investmentRoundId = signal<string | null>(null);
  readonly provider = signal<string>('');
  readonly batchType = signal<string>('');
  readonly purchaseDate = signal<string>('');

  // Form Signals - Tab 1: Costos y Existencias
  readonly currency = signal<string>('BOB');
  readonly purchasePrice = signal<number>(0);
  readonly freightCost = signal<number>(0);
  readonly initialItemsCount = signal<number>(0);
  readonly mermaItemsCount = signal<number>(0);

  // Form Signals - Tab 2: Estados y Observaciones
  readonly status = signal<string>('active');
  readonly financialStatus = signal<string>('EN_RECUPERACION');
  readonly observations = signal<string>('');

  // Auto-calculated Values
  readonly calculatedTotalCost = computed<number>(() => {
    const purchase = this.purchasePrice() || 0;
    const freight = this.freightCost() || 0;
    return Math.round((purchase + freight) * 100) / 100;
  });

  readonly calculatedSellableItems = computed<number>(() => {
    const init = this.initialItemsCount() || 0;
    const merma = this.mermaItemsCount() || 0;
    return Math.max(0, init - merma);
  });

  readonly calculatedUnitCost = computed<number>(() => {
    const total = this.calculatedTotalCost();
    const sellable = this.calculatedSellableItems();
    if (sellable <= 0) return 0;
    return Math.round((total / sellable) * 100) / 100;
  });

  // Validations
  readonly codeValidation = computed<{ isValid: boolean; error: string | null }>(() => {
    const val = this.code().trim();
    if (!val) {
      return { isValid: false, error: 'El código del lote o caja es obligatorio (Ej: ATAUD-01).' };
    }
    return { isValid: true, error: null };
  });

  readonly nameValidation = computed<{ isValid: boolean; error: string | null }>(() => {
    const val = this.name().trim();
    if (!val) {
      return { isValid: false, error: 'El nombre descriptivo de la caja es obligatorio.' };
    }
    return { isValid: true, error: null };
  });

  readonly costsValidation = computed<{ isValid: boolean; error: string | null }>(() => {
    if (this.purchasePrice() < 0 || this.freightCost() < 0) {
      return { isValid: false, error: 'Los costos de compra y flete no pueden ser negativos.' };
    }
    return { isValid: true, error: null };
  });

  readonly countsValidation = computed<{ isValid: boolean; error: string | null }>(() => {
    const init = this.initialItemsCount() || 0;
    const merma = this.mermaItemsCount() || 0;
    if (init < 0 || merma < 0) {
      return { isValid: false, error: 'Las cantidades de unidades no pueden ser negativas.' };
    }
    if (merma > init) {
      return { isValid: false, error: 'La merma no puede superar las unidades iniciales.' };
    }
    return { isValid: true, error: null };
  });

  readonly isFormValid = computed<boolean>(() => {
    return (
      this.codeValidation().isValid &&
      this.nameValidation().isValid &&
      this.costsValidation().isValid &&
      this.countsValidation().isValid
    );
  });

  private lastOpenedBatchId: string | null = null;
  private lastVisibleState = false;

  constructor() {
    effect(() => {
      const isVisible = this.visible();
      const currentBatch = this.batch();
      const currentMode = this.mode();

      if (!isVisible) {
        this.lastVisibleState = false;
        this.lastOpenedBatchId = null;
        return;
      }

      const bId = currentBatch?.id ?? null;
      const isNewOpen = !this.lastVisibleState || this.lastOpenedBatchId !== bId;
      this.lastVisibleState = true;
      this.lastOpenedBatchId = bId;

      if (isNewOpen) {
        this.activeTab.set('0');

        if (currentMode === 'edit' && bId) {
          this.freshBatch.set(null);
          this.initForm(currentBatch);

          this.isLoadingDetails.set(true);
          this.batchService.getBatchById(bId).subscribe({
            next: fresh => {
              this.freshBatch.set(fresh);
              this.initForm(fresh);
              this.isLoadingDetails.set(false);
            },
            error: err => {
              this.logger.error('Error fetching authoritative batch detail', err, 'BatchDrawerComponent');
              this.isLoadingDetails.set(false);
            }
          });
        } else {
          this.freshBatch.set(null);
          this.initForm(null);
        }
      }
    });
  }

  private initForm(b: Batch | null): void {
    if (b) {
      this.code.set(b.code || '');
      this.name.set(b.name || '');
      this.investmentRoundId.set(b.investment_round_id || null);
      this.provider.set(b.provider || '');
      this.batchType.set(b.batch_type || '');
      this.purchaseDate.set(b.purchase_date ? String(b.purchase_date).substring(0, 10) : '');
      this.currency.set(b.currency || 'BOB');
      this.purchasePrice.set(b.purchase_price ?? 0);
      this.freightCost.set(b.freight_cost ?? 0);
      this.initialItemsCount.set(b.initial_items_count ?? 0);
      this.mermaItemsCount.set(b.merma_items_count ?? 0);
      this.status.set(b.status || 'active');
      this.financialStatus.set(b.financial_status || 'EN_RECUPERACION');
      this.observations.set(b.observations || '');
    } else {
      this.code.set('');
      this.name.set('');
      this.investmentRoundId.set(null);
      this.provider.set('');
      this.batchType.set('');
      this.purchaseDate.set('');
      this.currency.set('BOB');
      this.purchasePrice.set(0);
      this.freightCost.set(0);
      this.initialItemsCount.set(0);
      this.mermaItemsCount.set(0);
      this.status.set('active');
      this.financialStatus.set('EN_RECUPERACION');
      this.observations.set('');
    }
  }

  saveBatch(): void {
    if (!this.isFormValid()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario Incompleto',
        detail: 'Por favor, revise los campos obligatorios antes de guardar.'
      });
      return;
    }

    this.isSubmitting.set(true);

    if (this.mode() === 'create') {
      const payload: BatchCreatePayload = {
        code: this.code().trim().toUpperCase(),
        name: this.name().trim(),
        investment_round_id: this.investmentRoundId() || null,
        provider: this.provider().trim() || null,
        batch_type: this.batchType().trim() || null,
        purchase_date: this.purchaseDate() || null,
        currency: this.currency() || 'BOB',
        purchase_price: this.purchasePrice() || 0,
        freight_cost: this.freightCost() || 0,
        total_cost: this.calculatedTotalCost(),
        initial_items_count: this.initialItemsCount() || 0,
        merma_items_count: this.mermaItemsCount() || 0,
        sellable_items_count: this.calculatedSellableItems(),
        unit_cost: this.calculatedUnitCost(),
        status: this.status() || 'active',
        financial_status: this.financialStatus() || 'EN_RECUPERACION',
        observations: this.observations().trim() || null
      };

      this.batchService.createBatch(payload).subscribe({
        next: created => {
          this.isSubmitting.set(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Lote / Caja Registrada',
            detail: `La caja "${created.name}" fue registrada correctamente.`
          });
          this.batchSaved.emit(created);
          this.visible.set(false);
        },
        error: err => {
          this.isSubmitting.set(false);
          this.logger.error('Error creating batch', err, 'BatchDrawerComponent');
          const detail = err?.error?.detail || 'Ocurrió un error al registrar el lote o caja.';
          this.messageService.add({
            severity: 'error',
            summary: 'Error al Crear',
            detail
          });
        }
      });
    } else {
      const current = this.currentDisplayBatch();
      if (!current?.id) {
        this.isSubmitting.set(false);
        return;
      }

      const payload: BatchUpdatePayload = {
        code: this.code().trim().toUpperCase(),
        name: this.name().trim(),
        investment_round_id: this.investmentRoundId() || null,
        provider: this.provider().trim() || null,
        batch_type: this.batchType().trim() || null,
        purchase_date: this.purchaseDate() || null,
        currency: this.currency() || 'BOB',
        purchase_price: this.purchasePrice() || 0,
        freight_cost: this.freightCost() || 0,
        total_cost: this.calculatedTotalCost(),
        initial_items_count: this.initialItemsCount() || 0,
        merma_items_count: this.mermaItemsCount() || 0,
        sellable_items_count: this.calculatedSellableItems(),
        unit_cost: this.calculatedUnitCost(),
        status: this.status() || 'active',
        financial_status: this.financialStatus() || 'EN_RECUPERACION',
        observations: this.observations().trim() || null
      };

      this.batchService.updateBatch(current.id, payload).subscribe({
        next: updated => {
          this.isSubmitting.set(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Lote Actualizado',
            detail: `La caja "${updated.name}" fue actualizada exitosamente.`
          });
          this.batchSaved.emit(updated);
          this.visible.set(false);
        },
        error: err => {
          this.isSubmitting.set(false);
          this.logger.error('Error updating batch', err, 'BatchDrawerComponent');
          const detail = err?.error?.detail || 'Ocurrió un error al actualizar el lote o caja.';
          this.messageService.add({
            severity: 'error',
            summary: 'Error al Actualizar',
            detail
          });
        }
      });
    }
  }

  confirmDelete(): void {
    const current = this.currentDisplayBatch();
    if (!current?.id) return;

    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar la caja "${current.name}" (${current.code})? Esta acción no se puede deshacer.`,
      header: 'Confirmar Eliminación de Caja',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      rejectButtonStyleClass: 'p-button-text p-button-secondary p-button-sm',
      accept: () => {
        this.isSubmitting.set(true);
        this.batchService.deleteBatch(current.id).subscribe({
          next: () => {
            this.isSubmitting.set(false);
            this.messageService.add({
              severity: 'success',
              summary: 'Lote Eliminado',
              detail: `La caja "${current.name}" fue eliminada del sistema.`
            });
            this.batchDeleted.emit(current.id);
            this.visible.set(false);
          },
          error: err => {
            this.isSubmitting.set(false);
            this.logger.error('Error deleting batch', err, 'BatchDrawerComponent');
            const detail = err?.error?.detail || 'No se pudo eliminar el lote o caja.';
            this.messageService.add({
              severity: 'error',
              summary: 'Error al Eliminar',
              detail
            });
          }
        });
      }
    });
  }

  recalculateFromProducts(): void {
    const current = this.currentDisplayBatch();
    if (!current?.id) return;

    this.isRecalculating.set(true);
    this.batchService.recalculateBatch(current.id, true, false).subscribe({
      next: updated => {
        this.isRecalculating.set(false);
        this.freshBatch.set(updated);
        this.initForm(updated);
        this.messageService.add({
          severity: 'success',
          summary: 'Caja Recalculada',
          detail: 'Se sincronizaron conteos y costo unitario con los productos físicos registrados.'
        });
        this.batchRecalculated.emit(updated);
      },
      error: err => {
        this.isRecalculating.set(false);
        this.logger.error('Error recalculating batch', err, 'BatchDrawerComponent');
        this.messageService.add({
          severity: 'error',
          summary: 'Error al Recalcular',
          detail: err?.error?.detail || 'No se pudieron recalcular las existencias.'
        });
      }
    });
  }

  copyToClipboard(text: string, label: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.messageService.add({
        severity: 'info',
        summary: 'Copiado al Portapapeles',
        detail: `${label} copiado con éxito.`,
        life: 2000
      });
    });
  }
}
