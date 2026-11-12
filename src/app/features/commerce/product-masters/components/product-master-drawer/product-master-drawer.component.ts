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
  LucideExternalLink,
  LucideImage,
  LucideInfo,
  LucideLayers,
  LucidePackage,
  LucideTag
} from '@lucide/angular';

import { CatalogItem } from '@core/models/catalog.model';
import { LoggerService } from '@core/services/logger.service';

import {
  ProductMaster,
  ProductMasterCreatePayload,
  ProductMasterUpdatePayload
} from '../../models/product-master.model';
import { ProductMasterService } from '../../services/product-master.service';

@Component({
  selector: 'app-product-master-drawer',
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
    LucideCircleAlert,
    LucideTag,
    LucideDollarSign,
    LucideImage,
    LucidePackage,
    LucideExternalLink,
    LucideCopy,
    LucideInfo,
    LucideLayers
  ],
  templateUrl: './product-master-drawer.component.html',
  styleUrls: ['./product-master-drawer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductMasterDrawerComponent {
  private readonly productMasterService = inject(ProductMasterService);
  private readonly logger = inject(LoggerService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  // Two-way and inputs
  readonly visible = model<boolean>(false);
  readonly product = input<ProductMaster | null>(null);
  readonly mode = input<'create' | 'edit'>('create');
  readonly categories = input<CatalogItem[]>([]);
  readonly liveBaskets = input<CatalogItem[]>([]);

  // Outputs
  readonly productSaved = output<ProductMaster>();
  readonly productDeleted = output<string>();

  // State
  readonly activeTab = signal<string>('0');
  readonly isSubmitting = signal<boolean>(false);
  readonly isLoadingDetails = signal<boolean>(false);
  readonly freshProduct = signal<ProductMaster | null>(null);

  onTabChange(tab: string | number | undefined): void {
    if (tab !== undefined) {
      this.activeTab.set(String(tab));
    }
  }

  readonly currentDisplayProduct = computed<ProductMaster | null>(() => {
    return this.freshProduct() || this.product();
  });

  // Form Signals
  readonly itemNumber = signal<number | null>(null);
  readonly code = signal<string>('');
  readonly name = signal<string>('');
  readonly description = signal<string>('');
  readonly categoryId = signal<string | null>(null);
  readonly liveBasketId = signal<string | null>(null);
  readonly brand = signal<string>('');
  readonly modelName = signal<string>('');

  // Precios
  readonly officialPrice = signal<number>(0);
  readonly minimumPrice = signal<number>(0);
  readonly publishedPrice = signal<number>(0);
  readonly currency = signal<string>('BOB');

  // Multimedia & Marketing
  readonly coverImageUrl = signal<string>('');
  readonly marketplaceUrl = signal<string>('');
  readonly externalInfoUrl = signal<string>('');
  readonly features = signal<string>('');
  readonly marketingDetails = signal<string>('');
  readonly isReviewed = signal<boolean>(false);
  readonly isFbVerified = signal<boolean>(false);
  readonly hasVideo = signal<boolean>(false);
  readonly isPublishedMarketplace = signal<boolean>(false);
  readonly isWhatsappPublished = signal<boolean>(false);
  readonly isActive = signal<boolean>(true);

  // Validations
  readonly itemNumberValidation = computed<{ isValid: boolean; error: string | null }>(() => {
    const val = this.itemNumber();
    if (val === null || val === undefined || isNaN(val)) {
      return { isValid: false, error: 'El número de catálogo (# Ítem) es obligatorio' };
    }
    if (val <= 0) {
      return { isValid: false, error: 'El número debe ser un entero positivo mayor a cero' };
    }
    return { isValid: true, error: null };
  });

  readonly nameValidation = computed<{ isValid: boolean; error: string | null }>(() => {
    const val = this.name();
    if (!val || val.trim().length === 0) {
      return { isValid: false, error: 'El nombre comercial es obligatorio' };
    }
    if (val.trim().length < 3) {
      return { isValid: false, error: 'El nombre debe tener al menos 3 caracteres' };
    }
    return { isValid: true, error: null };
  });

  readonly priceValidation = computed<{ isValid: boolean; error: string | null; warning: string | null }>(() => {
    const official = this.officialPrice() ?? 0;
    const min = this.minimumPrice() ?? 0;
    const published = this.publishedPrice() ?? 0;

    if (official < 0 || min < 0 || published < 0) {
      return { isValid: false, error: 'Los precios no pueden ser negativos', warning: null };
    }

    if (min > official && official > 0) {
      return {
        isValid: true,
        error: null,
        warning: 'El precio mínimo protegido es mayor al precio oficial de lista'
      };
    }

    return { isValid: true, error: null, warning: null };
  });

  readonly isFormValid = computed<boolean>(() => {
    return this.itemNumberValidation().isValid && this.nameValidation().isValid && this.priceValidation().isValid;
  });

  // Stock summary computed
  readonly totalAvailableStock = computed(() => this.currentDisplayProduct()?.total_available_stock ?? 0);
  readonly totalSoldStock = computed(() => this.currentDisplayProduct()?.total_sold_stock ?? 0);
  readonly totalMermaStock = computed(() => this.currentDisplayProduct()?.total_merma_stock ?? 0);

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
          // Pre-populate con el snapshot inmediato
          this.freshProduct.set(null);
          this.initForm(currentProd);

          // Carga authoritative desde el backend
          this.isLoadingDetails.set(true);
          this.productMasterService.getProductMasterById(prodId).subscribe({
            next: fresh => {
              this.freshProduct.set(fresh);
              this.initForm(fresh);
              this.isLoadingDetails.set(false);
            },
            error: err => {
              this.logger.error('Error fetching authoritative product master detail', err, 'ProductMasterDrawerComponent');
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

  private initForm(prod: ProductMaster | null): void {
    if (prod) {
      this.itemNumber.set(prod.item_number);
      this.code.set(prod.code || String(prod.item_number));
      this.name.set(prod.name || '');
      this.description.set(prod.description || '');
      this.categoryId.set(prod.category_id || null);
      this.liveBasketId.set(prod.live_basket_id || null);
      this.brand.set(prod.brand || '');
      this.modelName.set(prod.model || '');
      this.officialPrice.set(prod.official_price || 0);
      this.minimumPrice.set(prod.minimum_price || 0);
      this.publishedPrice.set(prod.published_price || 0);
      this.currency.set(prod.currency || 'BOB');
      this.coverImageUrl.set(prod.cover_image_url || '');
      this.marketplaceUrl.set(prod.marketplace_url || '');
      this.externalInfoUrl.set(prod.external_info_url || '');
      this.features.set(prod.features || '');
      this.marketingDetails.set(prod.marketing_details || '');
      this.isReviewed.set(prod.is_reviewed ?? false);
      this.isFbVerified.set(prod.is_fb_verified ?? false);
      this.hasVideo.set(prod.has_video ?? false);
      this.isPublishedMarketplace.set(prod.is_published_marketplace ?? false);
      this.isWhatsappPublished.set(prod.is_whatsapp_published ?? false);
      this.isActive.set(prod.is_active ?? true);
    } else {
      this.itemNumber.set(null);
      this.code.set('');
      this.name.set('');
      this.description.set('');
      this.categoryId.set(null);
      this.liveBasketId.set(null);
      this.brand.set('');
      this.modelName.set('');
      this.officialPrice.set(0);
      this.minimumPrice.set(0);
      this.publishedPrice.set(0);
      this.currency.set('BOB');
      this.coverImageUrl.set('');
      this.marketplaceUrl.set('');
      this.externalInfoUrl.set('');
      this.features.set('');
      this.marketingDetails.set('');
      this.isReviewed.set(false);
      this.isFbVerified.set(false);
      this.hasVideo.set(false);
      this.isPublishedMarketplace.set(false);
      this.isWhatsappPublished.set(false);
      this.isActive.set(true);
    }
  }

  saveProduct(): void {
    if (!this.isFormValid()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario Incompleto',
        detail: 'Por favor, revise los campos obligatorios antes de continuar.'
      });
      return;
    }

    this.isSubmitting.set(true);

    const num = this.itemNumber()!;
    const codeValue = this.code().trim() || String(num);

    if (this.mode() === 'create') {
      const payload: ProductMasterCreatePayload = {
        item_number: num,
        code: codeValue,
        name: this.name().trim(),
        description: this.description().trim() || null,
        category_id: this.categoryId(),
        live_basket_id: this.liveBasketId(),
        brand: this.brand().trim() || null,
        model: this.modelName().trim() || null,
        official_price: this.officialPrice(),
        minimum_price: this.minimumPrice(),
        published_price: this.publishedPrice(),
        currency: this.currency(),
        cover_image_url: this.coverImageUrl().trim() || null,
        marketplace_url: this.marketplaceUrl().trim() || null,
        external_info_url: this.externalInfoUrl().trim() || null,
        features: this.features().trim() || null,
        marketing_details: this.marketingDetails().trim() || null,
        is_reviewed: this.isReviewed(),
        is_fb_verified: this.isFbVerified(),
        has_video: this.hasVideo(),
        is_published_marketplace: this.isPublishedMarketplace(),
        is_whatsapp_published: this.isWhatsappPublished(),
        is_active: this.isActive()
      };

      this.productMasterService.createProductMaster(payload).subscribe({
        next: created => {
          this.isSubmitting.set(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Ficha Creada',
            detail: `Ficha maestra #${created.item_number} "${created.name}" creada exitosamente.`
          });
          this.productSaved.emit(created);
          this.visible.set(false);
        },
        error: err => {
          this.isSubmitting.set(false);
          this.logger.error('Error creating product master', err, 'ProductMasterDrawerComponent');
          const detail = err?.error?.detail || 'No se pudo crear la ficha maestra.';
          this.messageService.add({
            severity: 'error',
            summary: 'Error al Crear',
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

      const payload: ProductMasterUpdatePayload = {
        item_number: num,
        code: codeValue,
        name: this.name().trim(),
        description: this.description().trim() || null,
        category_id: this.categoryId(),
        live_basket_id: this.liveBasketId(),
        brand: this.brand().trim() || null,
        model: this.modelName().trim() || null,
        official_price: this.officialPrice(),
        minimum_price: this.minimumPrice(),
        published_price: this.publishedPrice(),
        currency: this.currency(),
        cover_image_url: this.coverImageUrl().trim() || null,
        marketplace_url: this.marketplaceUrl().trim() || null,
        external_info_url: this.externalInfoUrl().trim() || null,
        features: this.features().trim() || null,
        marketing_details: this.marketingDetails().trim() || null,
        is_reviewed: this.isReviewed(),
        is_fb_verified: this.isFbVerified(),
        has_video: this.hasVideo(),
        is_published_marketplace: this.isPublishedMarketplace(),
        is_whatsapp_published: this.isWhatsappPublished(),
        is_active: this.isActive()
      };

      this.productMasterService.updateProductMaster(id, payload).subscribe({
        next: updated => {
          this.isSubmitting.set(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Ficha Actualizada',
            detail: `Ficha maestra #${updated.item_number} actualizada exitosamente.`
          });
          this.productSaved.emit(updated);
          this.visible.set(false);
        },
        error: err => {
          this.isSubmitting.set(false);
          this.logger.error('Error updating product master', err, 'ProductMasterDrawerComponent');
          const detail = err?.error?.detail || 'No se pudo actualizar la ficha maestra.';
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
      message: `¿Está seguro de eliminar la ficha maestra #${prod.item_number} "${prod.name}"? Esta acción no se puede deshacer.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar Ficha',
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
        this.productMasterService.deleteProductMaster(prod.id).subscribe({
          next: () => {
            this.isSubmitting.set(false);
            this.messageService.add({
              severity: 'success',
              summary: 'Ficha Eliminada',
              detail: `La ficha maestra #${prod.item_number} fue eliminada exitosamente.`
            });
            this.productDeleted.emit(prod.id);
            this.visible.set(false);
          },
          error: err => {
            this.isSubmitting.set(false);
            this.logger.error('Error deleting product master', err, 'ProductMasterDrawerComponent');
            const detail = err?.error?.detail || 'No se pudo eliminar la ficha maestra.';
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
