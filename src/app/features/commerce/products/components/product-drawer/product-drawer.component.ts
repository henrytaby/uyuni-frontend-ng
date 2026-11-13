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
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Tooltip } from 'primeng/tooltip';
import {
  LucideCircleAlert,
  LucideCopy,
  LucideDollarSign,
  LucideInfo,
  LucidePackage,
  LucideShieldCheck,
  LucideTag
} from '@lucide/angular';

import { CatalogItem } from '@core/models/catalog.model';
import { LoggerService } from '@core/services/logger.service';

import {
  Product,
  ProductCreatePayload,
  ProductUpdatePayload
} from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-drawer',
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
    ToggleSwitch,
    Tooltip,
    LucideTag,
    LucideDollarSign,
    LucidePackage,
    LucideInfo,
    LucideCircleAlert,
    LucideCopy,
    LucideShieldCheck
  ],
  templateUrl: './product-drawer.component.html',
  styleUrls: ['./product-drawer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDrawerComponent {
  private readonly productService = inject(ProductService);
  private readonly logger = inject(LoggerService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  // Two-way and inputs
  readonly visible = model<boolean>(false);
  readonly product = input<Product | null>(null);
  readonly mode = input<'create' | 'edit'>('create');
  readonly masterProducts = input<CatalogItem[]>([]);
  readonly batches = input<CatalogItem[]>([]);
  readonly statuses = input<CatalogItem[]>([]);
  readonly physicalConditions = input<CatalogItem[]>([]);

  // Outputs
  readonly productSaved = output<Product>();
  readonly productDeleted = output<string>();

  // State
  readonly activeTab = signal<string>('0');
  readonly isSubmitting = signal<boolean>(false);
  readonly isLoadingDetails = signal<boolean>(false);
  readonly freshProduct = signal<Product | null>(null);

  readonly currentDisplayProduct = computed<Product | null>(() => {
    return this.freshProduct() || this.product();
  });

  onTabChange(tab: string | number | undefined): void {
    if (tab !== undefined) {
      this.activeTab.set(String(tab));
    }
  }

  // Form Signals
  readonly masterProductId = signal<string | null>(null);
  readonly batchId = signal<string | null>(null);
  readonly variantName = signal<string>('');
  readonly sheetRowId = signal<number | null>(null);
  readonly costPrice = signal<number | null>(null);
  readonly initialQuantity = signal<number>(1);
  readonly soldQuantity = signal<number>(0);
  readonly mermaQuantity = signal<number>(0);
  readonly status = signal<string>('AVAILABLE');
  readonly physicalCondition = signal<string>('OPERATIONAL');
  readonly defectDetail = signal<string>('');
  readonly isReviewed = signal<boolean>(false);

  // Computed Values
  readonly calculatedAvailableQuantity = computed<number>(() => {
    const init = this.initialQuantity() || 0;
    const sold = this.soldQuantity() || 0;
    const merma = this.mermaQuantity() || 0;
    return Math.max(0, init - sold - merma);
  });

  // Validations
  readonly masterProductValidation = computed<{ isValid: boolean; error: string | null }>(() => {
    if (!this.masterProductId()) {
      return { isValid: false, error: 'Debe asociar este producto físico a una Ficha Maestra.' };
    }
    return { isValid: true, error: null };
  });

  readonly quantityValidation = computed<{ isValid: boolean; error: string | null }>(() => {
    const init = this.initialQuantity();
    const sold = this.soldQuantity();
    const merma = this.mermaQuantity();

    if (init < 1) {
      return { isValid: false, error: 'La cantidad inicial debe ser al menos 1 unidad.' };
    }
    if (sold < 0 || merma < 0) {
      return { isValid: false, error: 'Las cantidades vendidas y mermas no pueden ser negativas.' };
    }
    if (sold + merma > init) {
      return { isValid: false, error: 'La suma de vendidas y mermas no puede superar la cantidad inicial.' };
    }

    return { isValid: true, error: null };
  });

  readonly isFormValid = computed<boolean>(() => {
    return this.masterProductValidation().isValid && this.quantityValidation().isValid;
  });

  private lastOpenedProductId: string | null = null;
  private lastVisibleState = false;

  constructor() {
    effect(() => {
      const isVisible = this.visible();
      const currentProd = this.product();
      const currentMode = this.mode();

      if (!isVisible) {
        this.lastVisibleState = false;
        this.lastOpenedProductId = null;
        return;
      }

      const prodId = currentProd?.id ?? null;
      const isNewOpen = !this.lastVisibleState || this.lastOpenedProductId !== prodId;
      this.lastVisibleState = true;
      this.lastOpenedProductId = prodId;

      if (isNewOpen) {
        this.activeTab.set('0');

        if (currentMode === 'edit' && prodId) {
          this.freshProduct.set(null);
          this.initForm(currentProd);

          this.isLoadingDetails.set(true);
          this.productService.getProductById(prodId).subscribe({
            next: fresh => {
              this.freshProduct.set(fresh);
              this.initForm(fresh);
              this.isLoadingDetails.set(false);
            },
            error: err => {
              this.logger.error('Error fetching authoritative product detail', err, 'ProductDrawerComponent');
              this.isLoadingDetails.set(false);
            }
          });
        } else {
          this.freshProduct.set(null);
          this.initForm(null);
        }
      }
    });
  }

  private initForm(prod: Product | null): void {
    if (prod) {
      this.masterProductId.set(prod.master_product_id);
      this.batchId.set(prod.batch_id || null);
      this.variantName.set(prod.variant_name || '');
      this.sheetRowId.set(prod.sheet_row_id ?? null);
      this.costPrice.set(prod.cost_price ?? null);
      this.initialQuantity.set(prod.initial_quantity ?? 1);
      this.soldQuantity.set(prod.sold_quantity ?? 0);
      this.mermaQuantity.set(prod.merma_quantity ?? 0);
      this.status.set(prod.status || 'AVAILABLE');
      this.physicalCondition.set(prod.physical_condition || 'OPERATIONAL');
      this.defectDetail.set(prod.defect_detail || '');
      this.isReviewed.set(prod.is_reviewed ?? false);
    } else {
      this.masterProductId.set(null);
      this.batchId.set(null);
      this.variantName.set('');
      this.sheetRowId.set(null);
      this.costPrice.set(null);
      this.initialQuantity.set(1);
      this.soldQuantity.set(0);
      this.mermaQuantity.set(0);
      this.status.set('AVAILABLE');
      this.physicalCondition.set('OPERATIONAL');
      this.defectDetail.set('');
      this.isReviewed.set(false);
    }
  }

  saveProduct(): void {
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
      const payload: ProductCreatePayload = {
        master_product_id: this.masterProductId()!,
        batch_id: this.batchId(),
        variant_name: this.variantName().trim() || null,
        sheet_row_id: this.sheetRowId(),
        cost_price: this.costPrice(),
        initial_quantity: this.initialQuantity(),
        sold_quantity: this.soldQuantity(),
        merma_quantity: this.mermaQuantity(),
        available_quantity: this.calculatedAvailableQuantity(),
        status: this.status(),
        physical_condition: this.physicalCondition(),
        defect_detail: this.defectDetail().trim() || null,
        is_reviewed: this.isReviewed()
      };

      this.productService.createProduct(payload).subscribe({
        next: created => {
          this.isSubmitting.set(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Producto Registrado',
            detail: `Producto físico registrado exitosamente en inventario.`
          });
          this.productSaved.emit(created);
          this.visible.set(false);
        },
        error: err => {
          this.isSubmitting.set(false);
          this.logger.error('Error creating product', err, 'ProductDrawerComponent');
          const detail = err?.error?.detail || 'No se pudo registrar el producto físico.';
          this.messageService.add({
            severity: 'error',
            summary: 'Error al Registrar',
            detail
          });
        }
      });
    } else {
      const id = this.currentDisplayProduct()?.id;
      if (!id) {
        this.isSubmitting.set(false);
        return;
      }

      const payload: ProductUpdatePayload = {
        master_product_id: this.masterProductId()!,
        batch_id: this.batchId(),
        variant_name: this.variantName().trim() || null,
        sheet_row_id: this.sheetRowId(),
        cost_price: this.costPrice(),
        initial_quantity: this.initialQuantity(),
        sold_quantity: this.soldQuantity(),
        merma_quantity: this.mermaQuantity(),
        available_quantity: this.calculatedAvailableQuantity(),
        status: this.status(),
        physical_condition: this.physicalCondition(),
        defect_detail: this.defectDetail().trim() || null,
        is_reviewed: this.isReviewed()
      };

      this.productService.updateProduct(id, payload).subscribe({
        next: updated => {
          this.isSubmitting.set(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Producto Actualizado',
            detail: `Existencia física actualizada exitosamente.`
          });
          this.productSaved.emit(updated);
          this.visible.set(false);
        },
        error: err => {
          this.isSubmitting.set(false);
          this.logger.error('Error updating product', err, 'ProductDrawerComponent');
          const detail = err?.error?.detail || 'No se pudo actualizar el producto físico.';
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
    const prod = this.currentDisplayProduct();
    if (!prod) return;

    this.confirmationService.confirm({
      header: 'Confirmar Eliminación',
      message: `¿Está seguro de eliminar esta existencia física de inventario? Esta acción no se puede deshacer.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar Producto',
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
        this.productService.deleteProduct(prod.id).subscribe({
          next: () => {
            this.isSubmitting.set(false);
            this.messageService.add({
              severity: 'success',
              summary: 'Producto Eliminado',
              detail: `La unidad física fue eliminada del inventario exitosamente.`
            });
            this.productDeleted.emit(prod.id);
            this.visible.set(false);
          },
          error: err => {
            this.isSubmitting.set(false);
            this.logger.error('Error deleting product', err, 'ProductDrawerComponent');
            const detail = err?.error?.detail || 'No se pudo eliminar el producto físico.';
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

  copyToClipboard(text: string, label: string): void {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      this.messageService.add({
        severity: 'info',
        summary: 'Copiado',
        detail: `${label} copiado al portapapeles.`
      });
    });
  }
}
