import { CdkScrollable } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  HostListener,
  inject,
  input,
  model,
  output,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ConfirmationService, MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { Drawer } from 'primeng/drawer';
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { Tag } from 'primeng/tag';
import { Textarea } from 'primeng/textarea';
import { Tooltip } from 'primeng/tooltip';
import {
  LucideBoxes,
  LucideCheck,
  LucideCopy,
  LucideDollarSign,
  LucideInfo,
  LucideMaximize2,
  LucideMinimize2,
  LucidePackage,
  LucideShieldCheck,
  LucideTag,
  LucideX
} from '@lucide/angular';

import { CatalogItem } from '@core/models/catalog.model';
import { LoggerService } from '@core/services/logger.service';

import { Product } from '@features/commerce/products/models/product.model';
import { ProductService } from '@features/commerce/products/services/product.service';

import {
  Batch,
  BatchCreatePayload,
  BatchUpdatePayload
} from '../../models/batch.model';
import { BatchService } from '../../services/batch.service';

function parseDateString(val?: string | null): Date | null {
  if (!val) return null;
  const datePart = String(val).substring(0, 10);
  const parts = datePart.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      return new Date(year, month, day);
    }
  }
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
}

function formatDateToIsoString(d: Date | null): string | null {
  if (!d || isNaN(d.getTime())) return null;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

@Component({
  selector: 'app-batch-drawer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Drawer,
    DatePicker,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Button,
    InputText,
    InputNumber,
    Select,
    Tag,
    TableModule,
    Textarea,
    Tooltip,
    CdkScrollable,
    LucideBoxes,
    LucideTag,
    LucideDollarSign,
    LucideInfo,
    LucidePackage,
    LucideCopy,
    LucideShieldCheck,
    LucideCheck,
    LucideMaximize2,
    LucideMinimize2,
    LucideX
  ],
  templateUrl: './batch-drawer.component.html',
  styleUrls: ['./batch-drawer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BatchDrawerComponent {
  private readonly batchService = inject(BatchService);
  private readonly productService = inject(ProductService);
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

  // Shell State
  readonly isMaximized = signal<boolean>(false);
  readonly activeTab = signal<string>('0');
  readonly savingAction = signal<'save' | 'saveAndClose' | null>(null);
  readonly isSubmitting = signal<boolean>(false);
  readonly isLoadingDetails = signal<boolean>(false);
  readonly isRecalculating = signal<boolean>(false);
  readonly isAllocatingCosts = signal<boolean>(false);
  readonly freshBatch = signal<Batch | null>(null);
  readonly initialSnapshot = signal<string>('');

  // Products linked to this batch
  readonly batchProducts = signal<Product[]>([]);
  readonly isLoadingProducts = signal<boolean>(false);

  readonly currentDisplayBatch = computed<Batch | null>(() => {
    return this.freshBatch() || this.batch();
  });

  onTabChange(tab: string | number | undefined): void {
    if (tab !== undefined) {
      this.activeTab.set(String(tab));
    }
  }

  toggleMaximize(): void {
    this.isMaximized.update(v => !v);
  }

  // Options
  readonly costingMethodOptions = [
    { label: 'Caja Sorpresa / Prorrateo Comercial (Amazon)', value: 'WEIGHTED_RETAIL' },
    { label: 'Bazar / Reventa / Costeo por Ítem (Específico)', value: 'SPECIFIC_ITEM' },
    { label: 'Lote Mayorista Homogéneo (Partes Iguales)', value: 'FLAT_AVERAGE' }
  ];

  readonly currencyOptions = [
    { label: 'BOB (Bs)', value: 'BOB' },
    { label: 'USD ($)', value: 'USD' }
  ];

  readonly defaultStatusOptions = [
    { label: 'Activo', value: 'active' },
    { label: 'Archivado', value: 'archived' }
  ];

  readonly statusOptions = computed(() => {
    const inputStatuses = this.statuses();
    if (inputStatuses && inputStatuses.length > 0) {
      const filtered = inputStatuses.filter(s => s.value === 'active' || s.value === 'archived');
      if (filtered.length > 0) return filtered;
    }
    return this.defaultStatusOptions;
  });

  // Form Signals - Tab 0: Identificación & Compra
  readonly code = signal<string>('');
  readonly name = signal<string>('');
  readonly costingMethod = signal<string>('WEIGHTED_RETAIL');
  readonly investmentRoundId = signal<string | null>(null);
  readonly provider = signal<string>('');
  readonly batchType = signal<string>('');
  readonly purchaseDate = signal<Date | null>(null);

  // Form Signals - Tab 1: Costos y Rendimiento
  readonly currency = signal<string>('BOB');
  readonly purchasePrice = signal<number>(0);
  readonly freightCost = signal<number>(0);
  readonly initialItemsCount = signal<number>(0);
  readonly mermaItemsCount = signal<number>(0);

  // Form Signals - Tab 2: Estado y Sincronización
  readonly status = signal<string>('active');
  readonly financialStatus = signal<string>('EN_RECUPERACION');
  readonly observations = signal<string>('');

  // Dynamic conditions
  readonly isPurchasePriceDisabled = computed<boolean>(() => {
    return this.costingMethod() === 'SPECIFIC_ITEM';
  });

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
      this.nameValidation().isValid &&
      this.costsValidation().isValid &&
      this.countsValidation().isValid
    );
  });

  private generateSnapshot(): string {
    return JSON.stringify({
      code: this.code().trim().toUpperCase(),
      name: this.name().trim(),
      costingMethod: this.costingMethod(),
      investmentRoundId: this.investmentRoundId(),
      provider: this.provider().trim(),
      batchType: this.batchType().trim(),
      purchaseDate: formatDateToIsoString(this.purchaseDate()),
      currency: this.currency().trim().toUpperCase(),
      purchasePrice: this.purchasePrice(),
      freightCost: this.freightCost(),
      status: this.status(),
      observations: this.observations().trim()
    });
  }

  readonly isDirty = computed<boolean>(() => {
    if (this.mode() === 'create') {
      return (
        this.name().trim() !== '' ||
        this.code().trim() !== '' ||
        this.provider().trim() !== '' ||
        this.batchType().trim() !== '' ||
        this.observations().trim() !== '' ||
        this.purchasePrice() > 0 ||
        this.freightCost() > 0 ||
        this.investmentRoundId() !== null
      );
    }
    return this.generateSnapshot() !== this.initialSnapshot();
  });

  onCostingMethodChange(method: string): void {
    this.costingMethod.set(method);
    if (method === 'SPECIFIC_ITEM') {
      const sumCost = this.batchProducts().reduce(
        (acc, p) => acc + ((p.cost_price ?? 0) * (p.initial_quantity || 1)),
        0
      );
      if (sumCost > 0) {
        this.purchasePrice.set(Math.round(sumCost * 100) / 100);
      } else if (this.mode() === 'create') {
        this.purchasePrice.set(0);
      }
    }
  }

  getFinancialStatusSeverity(status: string): 'success' | 'warn' | 'info' | 'secondary' {
    switch (status) {
      case 'RECUPERADO':
        return 'success';
      case 'CASI_TABLAS':
        return 'warn';
      case 'EN_RECUPERACION':
        return 'info';
      default:
        return 'secondary';
    }
  }

  getFinancialStatusLabel(status: string): string {
    const found = this.financialStatuses().find(f => String(f.value) === status);
    if (found) return found.label;
    const fallbackMap: Record<string, string> = {
      RECUPERADO: 'RECUPERADO',
      CASI_TABLAS: 'CASI TABLAS',
      EN_RECUPERACION: 'EN RECUPERACIÓN'
    };
    return fallbackMap[status] || status || 'EN RECUPERACIÓN';
  }

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
        this.isMaximized.set(false);
        this.initialSnapshot.set('');
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
          this.loadBatchProducts(bId);

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
          this.batchProducts.set([]);
          this.initForm(null);
        }
      }
    });
  }

  private initForm(b: Batch | null): void {
    if (b) {
      this.code.set(b.code || '');
      this.name.set(b.name || '');
      this.costingMethod.set(b.costing_method || 'WEIGHTED_RETAIL');
      this.investmentRoundId.set(b.investment_round_id || null);
      this.provider.set(b.provider || '');
      this.batchType.set(b.batch_type || '');
      this.purchaseDate.set(parseDateString(b.purchase_date));
      this.currency.set(b.currency?.toUpperCase() === 'USD' ? 'USD' : 'BOB');
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
      this.costingMethod.set('WEIGHTED_RETAIL');
      this.investmentRoundId.set(null);
      this.provider.set('');
      this.batchType.set('');
      this.purchaseDate.set(null);
      this.currency.set('BOB');
      this.purchasePrice.set(0);
      this.freightCost.set(0);
      this.initialItemsCount.set(0);
      this.mermaItemsCount.set(0);
      this.status.set('active');
      this.financialStatus.set('EN_RECUPERACION');
      this.observations.set('');
    }
    this.initialSnapshot.set(this.generateSnapshot());
  }

  onVisibleChange(newVisible: boolean): void {
    if (!newVisible) {
      this.requestClose();
    } else {
      this.visible.set(true);
    }
  }

  requestClose(): void {
    if (!this.isDirty()) {
      this.visible.set(false);
      return;
    }

    this.confirmationService.confirm({
      header: 'Cambios sin guardar',
      message:
        'Tienes modificaciones sin guardar en el lote o caja. Si cierras ahora, se perderán los cambios realizados. ¿Deseas descartar los cambios y salir?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Descartar y Salir',
      rejectLabel: 'Continuar Editando',
      acceptButtonProps: {
        severity: 'danger'
      },
      rejectButtonProps: {
        severity: 'secondary',
        outlined: true
      },
      accept: () => {
        this.visible.set(false);
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.visible()) return;

    if (document.querySelector('.p-dialog-mask, .p-confirm-dialog')) {
      return;
    }

    const target = event.target as HTMLElement | null;
    if (!target) return;

    if (target.classList?.contains('p-drawer-mask')) {
      this.requestClose();
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: Event): void {
    if (!this.visible()) return;

    if (document.querySelector('.p-dialog-mask, .p-confirm-dialog')) {
      return;
    }

    event.preventDefault();
    this.requestClose();
  }

  saveBatch(closeAfterSave = true): void {
    if (!this.isFormValid()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario Incompleto',
        detail: 'Por favor, revise los campos obligatorios antes de guardar.'
      });
      return;
    }

    this.savingAction.set(closeAfterSave ? 'saveAndClose' : 'save');
    this.isSubmitting.set(true);

    const codeVal = this.code().trim();
    const finalCode = codeVal ? codeVal.toUpperCase() : null;
    const dateIso = formatDateToIsoString(this.purchaseDate());

    if (this.mode() === 'create') {
      const payload: BatchCreatePayload = {
        code: finalCode,
        name: this.name().trim(),
        costing_method: this.costingMethod() || 'WEIGHTED_RETAIL',
        investment_round_id: this.investmentRoundId() || null,
        provider: this.provider().trim() || null,
        batch_type: this.batchType().trim() || null,
        purchase_date: dateIso,
        currency: this.currency() || 'BOB',
        purchase_price: this.isPurchasePriceDisabled() ? 0 : (this.purchasePrice() || 0),
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
          this.savingAction.set(null);
          this.messageService.add({
            severity: 'success',
            summary: 'Lote / Caja Registrada',
            detail: `La caja "${created.name}" fue registrada correctamente.`
          });
          this.batchSaved.emit(created);
          if (closeAfterSave) {
            this.visible.set(false);
          } else {
            this.freshBatch.set(created);
            this.initForm(created);
            this.loadBatchProducts(created.id);
          }
        },
        error: err => {
          this.isSubmitting.set(false);
          this.savingAction.set(null);
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
        this.savingAction.set(null);
        return;
      }

      const payload: BatchUpdatePayload = {
        code: finalCode,
        name: this.name().trim(),
        costing_method: this.costingMethod() || 'WEIGHTED_RETAIL',
        investment_round_id: this.investmentRoundId() || null,
        provider: this.provider().trim() || null,
        batch_type: this.batchType().trim() || null,
        purchase_date: dateIso,
        currency: this.currency() || 'BOB',
        purchase_price: this.isPurchasePriceDisabled() ? undefined : (this.purchasePrice() || 0),
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
          this.savingAction.set(null);
          this.messageService.add({
            severity: 'success',
            summary: 'Lote Actualizado',
            detail: `La caja "${updated.name}" fue actualizada exitosamente.`
          });
          this.batchSaved.emit(updated);
          if (closeAfterSave) {
            this.visible.set(false);
          } else {
            this.freshBatch.set(updated);
            this.initForm(updated);
          }
        },
        error: err => {
          this.isSubmitting.set(false);
          this.savingAction.set(null);
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
      header: 'Confirmar Eliminación de Caja',
      message: `¿Está seguro de eliminar la caja "${current.name}" (${current.code || 'Sin código'})? Esta acción no se puede deshacer.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonProps: {
        severity: 'danger'
      },
      rejectButtonProps: {
        severity: 'secondary',
        outlined: true
      },
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
            const detail = err?.error?.detail || 'No se pudo eliminar el lote o caja. Verifique si contiene productos vinculados.';
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
        this.loadBatchProducts(current.id);
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

  confirmAllocateRelativeCosts(): void {
    const current = this.currentDisplayBatch();
    if (!current?.id) return;

    const total = this.calculatedTotalCost();
    const prodsCount = this.batchProducts().length;

    this.confirmationService.confirm({
      header: 'Prorratear Costos Ponderados',
      message: `¿Desea prorratear el costo total de la caja (${total.toFixed(2)} ${this.currency()}) entre los ${prodsCount} productos según su valor de venta comercial? Esta acción distribuirá el costo exacto al centavo entre la mercadería física desempacada.`,
      icon: 'pi pi-percentage',
      acceptLabel: 'Sí, Prorratear',
      rejectLabel: 'Cancelar',
      acceptButtonProps: {
        severity: 'primary'
      },
      rejectButtonProps: {
        severity: 'secondary',
        outlined: true
      },
      accept: () => {
        this.isAllocatingCosts.set(true);
        this.batchService.allocateRelativeCosts(current.id, 'official_price', true).subscribe({
          next: updated => {
            this.isAllocatingCosts.set(false);
            this.freshBatch.set(updated);
            this.initForm(updated);
            this.loadBatchProducts(current.id);
            this.messageService.add({
              severity: 'success',
              summary: 'Costos Prorrateados',
              detail: `Se distribuyeron los costos entre los ${prodsCount} productos de la caja exitosamente.`
            });
            this.batchRecalculated.emit(updated);
          },
          error: err => {
            this.isAllocatingCosts.set(false);
            this.logger.error('Error allocating relative costs', err, 'BatchDrawerComponent');
            const detail = err?.error?.detail || 'No se pudieron prorratear los costos de la caja.';
            this.messageService.add({
              severity: 'error',
              summary: 'Error al Prorratear',
              detail
            });
          }
        });
      }
    });
  }

  loadBatchProducts(bId: string): void {
    this.isLoadingProducts.set(true);
    this.productService.getProducts({ batch_id: bId, limit: 100 }).subscribe({
      next: prods => {
        this.batchProducts.set(prods || []);
        this.isLoadingProducts.set(false);
      },
      error: err => {
        this.logger.error('Error fetching batch products', err, 'BatchDrawerComponent');
        this.isLoadingProducts.set(false);
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
