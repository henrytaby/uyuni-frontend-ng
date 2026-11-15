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
import { Drawer } from 'primeng/drawer';
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { Tag } from 'primeng/tag';
import { Textarea } from 'primeng/textarea';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Tooltip } from 'primeng/tooltip';
import {
  LucideBoxes,
  LucideCamera,
  LucideCheck,
  LucideCircleAlert,
  LucideCircleCheck,
  LucideCopy,
  LucideDollarSign,
  LucideInfo,
  LucideMaximize2,
  LucideMinimize2,
  LucidePackage,
  LucideSearch,
  LucideShieldCheck,
  LucideTag,
  LucideTrendingUp,
  LucideX
} from '@lucide/angular';

import { CatalogItem } from '@core/models/catalog.model';
import { LoggerService } from '@core/services/logger.service';

import { CloudinaryUrlPipe } from '@shared/pipe/cloudinary-url.pipe';

import { Batch } from '@features/commerce/batches/models/batch.model';
import { BatchService } from '@features/commerce/batches/services/batch.service';
import { ProductMaster } from '@features/commerce/product-masters/models/product-master.model';
import { ProductMasterService } from '@features/commerce/product-masters/services/product-master.service';

import {
  Product,
  ProductCreatePayload,
  ProductRealImage,
  ProductUpdatePayload
} from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ProductRealGalleryComponent } from '../product-real-gallery/product-real-gallery.component';

@Component({
  selector: 'app-product-drawer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CdkScrollable,
    Drawer,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Tag,
    Button,
    InputText,
    InputNumber,
    Select,
    Textarea,
    ToggleSwitch,
    Tooltip,
    CloudinaryUrlPipe,
    ProductRealGalleryComponent,
    LucideTag,
    LucideDollarSign,
    LucidePackage,
    LucideSearch,
    LucideInfo,
    LucideCircleAlert,
    LucideCircleCheck,
    LucideCopy,
    LucideShieldCheck,
    LucideMaximize2,
    LucideMinimize2,
    LucideX,
    LucideCheck,
    LucideTrendingUp,
    LucideBoxes,
    LucideCamera
  ],
  templateUrl: './product-drawer.component.html',
  styleUrls: ['./product-drawer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDrawerComponent {
  private readonly productService = inject(ProductService);
  private readonly productMasterService = inject(ProductMasterService);
  private readonly batchService = inject(BatchService);
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
  readonly savingAction = signal<'save' | 'saveAndClose' | null>(null);
  readonly isMaximized = signal<boolean>(false);
  readonly isLoadingDetails = signal<boolean>(false);
  readonly freshProduct = signal<Product | null>(null);

  // Fotografías Reales de Almacén
  readonly realImages = signal<ProductRealImage[]>([]);
  readonly realImagesCount = signal<number>(0);

  // Entities cache
  private readonly batchesCache = new Map<string, Batch>();
  private readonly masterProductsCache = new Map<string, ProductMaster>();
  readonly selectedBatch = signal<Batch | null>(null);
  readonly selectedMasterProduct = signal<ProductMaster | null>(null);

  readonly currentDisplayProduct = computed<Product | null>(() => {
    return this.freshProduct() || this.product();
  });

  // Form Signals
  readonly masterProductId = signal<string | null>(null);
  readonly batchId = signal<string | null>(null);
  readonly variantName = signal<string>('');
  readonly costPrice = signal<number | null>(null);
  readonly publishedPrice = signal<number>(0);
  readonly minimumPrice = signal<number>(0);
  readonly initialQuantity = signal<number>(1);
  readonly soldQuantity = signal<number>(0); // Read-only
  readonly mermaQuantity = signal<number>(0);
  readonly physicalCondition = signal<string>('OPERATIONAL');
  readonly defectDetail = signal<string>('');
  readonly isReviewed = signal<boolean>(false);

  // Snapshot for dirty detection
  private readonly initialSnapshot = signal<string>('');

  private generateSnapshot(): string {
    return JSON.stringify({
      masterProductId: this.masterProductId(),
      batchId: this.batchId(),
      variantName: this.variantName().trim(),
      costPrice: this.costPrice(),
      publishedPrice: this.publishedPrice(),
      minimumPrice: this.minimumPrice(),
      initialQuantity: this.initialQuantity(),
      mermaQuantity: this.mermaQuantity(),
      physicalCondition: this.physicalCondition(),
      defectDetail: this.defectDetail().trim(),
      isReviewed: this.isReviewed()
    });
  }

  readonly isDirty = computed<boolean>(() => {
    if (this.mode() === 'create') {
      return (
        this.masterProductId() !== null ||
        this.batchId() !== null ||
        this.variantName().trim() !== '' ||
        this.costPrice() !== null ||
        this.publishedPrice() > 0 ||
        this.minimumPrice() > 0 ||
        this.initialQuantity() !== 1 ||
        this.mermaQuantity() !== 0 ||
        this.defectDetail().trim() !== '' ||
        this.isReviewed() !== false
      );
    }
    return this.generateSnapshot() !== this.initialSnapshot();
  });

  // Dynamic Rule 1: Costing method behavior
  readonly costingMethod = computed<string>(() => {
    return this.selectedBatch()?.costing_method || 'SPECIFIC_ITEM';
  });

  readonly isCostPriceDisabled = computed<boolean>(() => {
    const method = this.costingMethod();
    return method === 'WEIGHTED_RETAIL' || method === 'FLAT_AVERAGE';
  });

  // Dynamic Rule 2: Automatic 100% status calculation
  readonly calculatedAvailableQuantity = computed<number>(() => {
    const init = this.initialQuantity() || 0;
    const sold = this.soldQuantity() || 0;
    const merma = this.mermaQuantity() || 0;
    return Math.max(0, init - sold - merma);
  });

  readonly calculatedProductStatus = computed<{
    value: 'AVAILABLE' | 'SOLD_OUT' | 'SCRAPPED';
    label: string;
    severity: 'success' | 'secondary' | 'danger';
  }>(() => {
    const initial = this.initialQuantity() || 0;
    const sold = this.soldQuantity() || 0;
    const merma = this.mermaQuantity() || 0;
    const available = Math.max(0, initial - sold - merma);

    if (merma >= initial && initial > 0) {
      return { value: 'SCRAPPED', label: 'Merma Total (Baja)', severity: 'danger' };
    }
    if (available === 0 && sold > 0) {
      return { value: 'SOLD_OUT', label: 'Agotado', severity: 'secondary' };
    }
    return { value: 'AVAILABLE', label: 'Disponible', severity: 'success' };
  });

  // Dynamic Rule 4: Real-time margin cards
  readonly estimatedMargin = computed<number | null>(() => {
    const pub = this.publishedPrice();
    const cost = this.costPrice();
    if (pub > 0 && cost !== null && cost !== undefined) {
      return pub - cost;
    }
    return null;
  });

  readonly discountMargin = computed<number>(() => {
    const pub = this.publishedPrice();
    const min = this.minimumPrice();
    if (pub > 0 && min > 0) {
      return Math.max(0, pub - min);
    }
    return 0;
  });

  readonly coverImageUrl = computed<string | null>(() => {
    return (
      this.currentDisplayProduct()?.image_url ||
      this.selectedMasterProduct()?.cover_image_url ||
      null
    );
  });

  // Validations
  readonly masterProductValidation = computed<{ isValid: boolean; error: string | null }>(() => {
    if (!this.masterProductId()) {
      return { isValid: false, error: 'Debe asociar este producto físico a una Ficha Maestra.' };
    }
    return { isValid: true, error: null };
  });

  readonly pricingValidation = computed<{ isValid: boolean; error: string | null }>(() => {
    const pub = this.publishedPrice();
    const min = this.minimumPrice();

    if (pub <= 0) {
      return { isValid: false, error: 'El precio publicado de venta debe ser mayor a 0.' };
    }
    if (min <= 0) {
      return { isValid: false, error: 'El piso mínimo de regateo debe ser mayor a 0.' };
    }
    if (pub < min) {
      return {
        isValid: false,
        error: `El precio publicado (${pub.toFixed(2)}) no puede ser inferior al piso de regateo (${min.toFixed(2)}).`
      };
    }

    return { isValid: true, error: null };
  });

  readonly costPriceValidation = computed<{ isValid: boolean; error: string | null }>(() => {
    if (this.isCostPriceDisabled()) {
      return { isValid: true, error: null };
    }
    const cost = this.costPrice();
    if (cost === null || cost === undefined || cost <= 0) {
      return {
        isValid: false,
        error: 'En lotes tipo Bazar / Reventa por Ítem, el precio de costo unitario es obligatorio (> 0).'
      };
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
    if (merma < 0) {
      return { isValid: false, error: 'La cantidad en merma no puede ser negativa.' };
    }
    if (merma > init) {
      return { isValid: false, error: 'No puede declarar más unidades en merma de las que llegaron en total.' };
    }
    if (this.mode() === 'edit' && init < sold) {
      return {
        isValid: false,
        error: `La cantidad inicial (${init}) no puede ser menor a las unidades ya vendidas (${sold}).`
      };
    }
    if (sold + merma > init) {
      return { isValid: false, error: 'La suma de vendidas y mermas supera la cantidad inicial de la caja.' };
    }

    return { isValid: true, error: null };
  });

  readonly isFormValid = computed<boolean>(() => {
    return (
      this.masterProductValidation().isValid &&
      this.pricingValidation().isValid &&
      this.costPriceValidation().isValid &&
      this.quantityValidation().isValid
    );
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
        this.realImages.set([]);
        this.realImagesCount.set(0);

        if (currentMode === 'edit' && prodId) {
          this.freshProduct.set(null);
          this.initForm(currentProd);
          this.loadRealImages(prodId);

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

  loadRealImages(prodId: string): void {
    if (!prodId) return;
    this.productService.getImages(prodId).subscribe({
      next: imgs => {
        this.realImages.set(imgs);
        this.realImagesCount.set(imgs.length);
      },
      error: err => {
        this.logger.error('Error fetching product real images', err, 'ProductDrawerComponent');
      }
    });
  }

  onTabChange(tab: string | number | undefined): void {
    if (tab !== undefined) {
      this.activeTab.set(String(tab));
    }
  }

  onVisibleChange(newVisible: boolean): void {
    if (!newVisible) {
      this.requestClose();
    } else {
      this.visible.set(true);
    }
  }

  toggleMaximize(): void {
    this.isMaximized.update(val => !val);
  }

  requestClose(): void {
    if (!this.isDirty()) {
      this.visible.set(false);
      return;
    }

    this.confirmationService.confirm({
      header: 'Cambios sin guardar',
      message:
        'Tienes modificaciones sin guardar en la existencia física. Si cierras ahora, se perderán los cambios realizados. ¿Deseas descartar los cambios y salir?',
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

  // Dynamic Rule 3: Intelligent prefilling on Master Product change
  onMasterProductChange(id: string | null): void {
    this.masterProductId.set(id);
    if (!id) {
      this.selectedMasterProduct.set(null);
      return;
    }

    if (this.masterProductsCache.has(id)) {
      const master = this.masterProductsCache.get(id)!;
      this.selectedMasterProduct.set(master);
      this.applyMasterPricing(master);
    } else {
      this.productMasterService.getProductMasterById(id).subscribe({
        next: master => {
          this.masterProductsCache.set(master.id, master);
          this.selectedMasterProduct.set(master);
          this.applyMasterPricing(master);
        },
        error: err => {
          this.logger.error('Error fetching master product details', err, 'ProductDrawerComponent');
        }
      });
    }
  }

  private applyMasterPricing(master: ProductMaster): void {
    if (this.mode() === 'create' || this.publishedPrice() <= 0) {
      this.publishedPrice.set(master.published_price);
    }
    if (this.mode() === 'create' || this.minimumPrice() <= 0) {
      this.minimumPrice.set(master.minimum_price);
    }
  }

  // Dynamic Rule 1: Batch change updates costing method and disables/enables cost input
  onBatchChange(id: string | null): void {
    this.batchId.set(id);
    if (!id) {
      this.selectedBatch.set(null);
      return;
    }

    if (this.batchesCache.has(id)) {
      this.selectedBatch.set(this.batchesCache.get(id)!);
    } else {
      this.batchService.getBatchById(id).subscribe({
        next: batch => {
          this.batchesCache.set(batch.id, batch);
          this.selectedBatch.set(batch);
        },
        error: err => {
          this.logger.error('Error fetching batch details', err, 'ProductDrawerComponent');
        }
      });
    }
  }

  // Dynamic Rule 5: Auto switch to DAMAGED_SCRAP if merma total
  onInitialQuantityChange(qty: number | null): void {
    const val = qty ?? 1;
    this.initialQuantity.set(val);
    const merma = this.mermaQuantity();
    if (merma >= val && val > 0) {
      this.physicalCondition.set('DAMAGED_SCRAP');
    }
  }

  onMermaQuantityChange(qty: number | null): void {
    const val = qty ?? 0;
    this.mermaQuantity.set(val);
    const init = this.initialQuantity();
    if (val >= init && init > 0) {
      this.physicalCondition.set('DAMAGED_SCRAP');
    }
  }

  private initForm(prod: Product | null): void {
    if (prod) {
      this.masterProductId.set(prod.master_product_id);
      this.batchId.set(prod.batch_id || null);
      this.variantName.set(prod.variant_name || '');
      this.costPrice.set(prod.cost_price ?? null);
      this.publishedPrice.set(prod.published_price ?? 0);
      this.minimumPrice.set(prod.minimum_price ?? 0);
      this.initialQuantity.set(prod.initial_quantity ?? 1);
      this.soldQuantity.set(prod.sold_quantity ?? 0);
      this.mermaQuantity.set(prod.merma_quantity ?? 0);
      this.physicalCondition.set(prod.physical_condition || 'OPERATIONAL');
      this.defectDetail.set(prod.defect_detail || '');
      this.isReviewed.set(prod.is_reviewed ?? false);

      if (prod.batch_id) {
        this.onBatchChange(prod.batch_id);
      } else {
        this.selectedBatch.set(null);
      }

      if (prod.master_product_id) {
        if (this.masterProductsCache.has(prod.master_product_id)) {
          this.selectedMasterProduct.set(this.masterProductsCache.get(prod.master_product_id)!);
        } else {
          this.productMasterService.getProductMasterById(prod.master_product_id).subscribe({
            next: master => {
              this.masterProductsCache.set(master.id, master);
              this.selectedMasterProduct.set(master);
            },
            error: () => {
              // Non-blocking fallback
            }
          });
        }
      }
    } else {
      this.masterProductId.set(null);
      this.batchId.set(null);
      this.variantName.set('');
      this.costPrice.set(null);
      this.publishedPrice.set(0);
      this.minimumPrice.set(0);
      this.initialQuantity.set(1);
      this.soldQuantity.set(0);
      this.mermaQuantity.set(0);
      this.physicalCondition.set('OPERATIONAL');
      this.defectDetail.set('');
      this.isReviewed.set(false);
      this.selectedBatch.set(null);
      this.selectedMasterProduct.set(null);
    }
    this.initialSnapshot.set(this.generateSnapshot());
  }

  saveProduct(closeAfterSave = true): void {
    if (!this.isFormValid()) {
      const errorMsg =
        this.masterProductValidation().error ||
        this.pricingValidation().error ||
        this.costPriceValidation().error ||
        this.quantityValidation().error ||
        'Por favor, revise los campos obligatorios antes de guardar.';

      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario Inválido',
        detail: errorMsg
      });
      return;
    }

    this.savingAction.set(closeAfterSave ? 'saveAndClose' : 'save');
    this.isSubmitting.set(true);

    const commonPayload = {
      master_product_id: this.masterProductId()!,
      batch_id: this.batchId(),
      variant_name: this.variantName().trim() || null,
      cost_price: this.costPrice(),
      published_price: this.publishedPrice(),
      minimum_price: this.minimumPrice(),
      initial_quantity: this.initialQuantity(),
      sold_quantity: this.soldQuantity(),
      merma_quantity: this.mermaQuantity(),
      available_quantity: this.calculatedAvailableQuantity(),
      status: this.calculatedProductStatus().value,
      physical_condition: this.physicalCondition(),
      defect_detail: this.defectDetail().trim() || null,
      is_reviewed: this.isReviewed()
    };

    if (this.mode() === 'create') {
      const payload: ProductCreatePayload = commonPayload;

      this.productService.createProduct(payload).subscribe({
        next: created => {
          this.isSubmitting.set(false);
          this.savingAction.set(null);
          this.messageService.add({
            severity: 'success',
            summary: 'Producto Registrado',
            detail: `Producto físico registrado exitosamente en inventario.`
          });
          this.productSaved.emit(created);
          if (closeAfterSave) {
            this.visible.set(false);
          } else {
            this.freshProduct.set(created);
            this.initForm(created);
          }
        },
        error: err => {
          this.isSubmitting.set(false);
          this.savingAction.set(null);
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
        this.savingAction.set(null);
        return;
      }

      const payload: ProductUpdatePayload = commonPayload;

      this.productService.updateProduct(id, payload).subscribe({
        next: updated => {
          this.isSubmitting.set(false);
          this.savingAction.set(null);
          this.messageService.add({
            severity: 'success',
            summary: 'Producto Actualizado',
            detail: `Existencia física actualizada exitosamente.`
          });
          this.productSaved.emit(updated);
          if (closeAfterSave) {
            this.visible.set(false);
          } else {
            this.freshProduct.set(updated);
            this.initForm(updated);
          }
        },
        error: err => {
          this.isSubmitting.set(false);
          this.savingAction.set(null);
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

  /**
   * Helper para descomponer el label de una ficha maestra en número de catálogo (#xxx) y nombre,
   * permitiendo renderizar un selector con diseño ERP limpio, profesional y de alta densidad.
   */
  parseMasterItem(optOrValue?: CatalogItem | string | null): { itemNumber: string; name: string } {
    if (!optOrValue) return { itemNumber: '', name: '' };

    let label = '';
    if (typeof optOrValue === 'string') {
      const found = this.masterProducts().find(m => String(m.value) === optOrValue);
      label = found ? found.label : optOrValue;
    } else if (optOrValue && typeof optOrValue === 'object' && 'label' in optOrValue) {
      label = optOrValue.label || '';
    }

    if (!label) return { itemNumber: '', name: '' };

    const trimmed = label.trim();
    const match = trimmed.match(/^([#0-9A-Z\-_]+)\s*-\s*(.+)$/);
    if (match) {
      const rawNumber = match[1].trim();
      const itemNumber = rawNumber.startsWith('#') ? rawNumber : `#${rawNumber}`;
      return { itemNumber, name: match[2].trim() };
    }
    return { itemNumber: '', name: trimmed };
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
