import { CdkScrollable } from '@angular/cdk/scrolling';
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
  LucideCheck,
  LucideCircleAlert,
  LucideCopy,
  LucideDollarSign,
  LucideImages,
  LucideInfo,
  LucideLayers,
  LucideMaximize2,
  LucideMinimize2,
  LucidePackage,
  LucideShare2,
  LucideTag
} from '@lucide/angular';

import { CatalogItem } from '@core/models/catalog.model';
import { LoggerService } from '@core/services/logger.service';

import { MarkdownEditorComponent } from '@shared/components/markdown-editor/markdown-editor.component';
import { CloudinaryUrlPipe } from '@shared/pipe/cloudinary-url.pipe';

import {
  ProductImage,
  ProductMaster,
  ProductMasterCreatePayload,
  ProductMasterExternalLink,
  ProductMasterUpdatePayload
} from '../../models/product-master.model';
import { ProductMasterService } from '../../services/product-master.service';
import { ProductMasterGalleryComponent } from '../product-master-gallery/product-master-gallery.component';
import { ProductMasterLinksComponent } from '../product-master-links/product-master-links.component';

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
    LucideImages,
    LucidePackage,
    LucideCopy,
    LucideInfo,
    LucideLayers,
    LucideCheck,
    LucideMaximize2,
    LucideMinimize2,
    LucideShare2,
    CdkScrollable,
    CloudinaryUrlPipe,
    MarkdownEditorComponent,
    ProductMasterGalleryComponent,
    ProductMasterLinksComponent
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
  readonly coverImageChanged = output<{ masterId: string; coverUrl: string | null }>();

  // State
  readonly isMaximized = signal<boolean>(false);
  readonly activeTab = signal<string>('0');
  readonly isSubmitting = signal<boolean>(false);
  readonly isLoadingDetails = signal<boolean>(false);
  readonly freshProduct = signal<ProductMaster | null>(null);

  // Snapshot para detección de cambios no guardados
  private readonly initialFormSnapshot = signal<string>('');

  readonly isDirty = computed<boolean>(() => {
    const init = this.initialFormSnapshot();
    if (!init) return false;
    return init !== this.getFormSnapshotString();
  });

  // Images state (synced with gallery child component)
  readonly images = signal<ProductImage[]>([]);

  // Multi-link state (synced with links child component)
  readonly referenceLinks = signal<ProductMasterExternalLink[]>([]);
  readonly marketplaceLinks = signal<ProductMasterExternalLink[]>([]);

  onTabChange(tab: string | number | undefined): void {
    if (tab !== undefined) {
      this.activeTab.set(String(tab));
    }
  }

  toggleMaximize(): void {
    this.isMaximized.update(v => !v);
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
        'Tienes modificaciones sin guardar en la ficha maestra. Si cierras ahora, se perderán los cambios realizados. ¿Deseas descartar los cambios y salir?',
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
        this.initialFormSnapshot.set('');
        this.visible.set(false);
      }
    });
  }

  onCoverImageChanged(event: { masterId: string; coverUrl: string | null }): void {
    this.coverImageUrl.set(event.coverUrl || '');
    if (this.freshProduct()) {
      this.freshProduct.update(p => (p ? { ...p, cover_image_url: event.coverUrl } : null));
    }
    this.coverImageChanged.emit(event);
  }

  onLinkPrimaryChanged(event: { masterId: string; linkId: string; url: string; linkType: string }): void {
    if (event.linkType === 'REFERENCE') {
      this.externalInfoUrl.set(event.url);
      if (this.freshProduct()) {
        this.freshProduct.update(p => (p ? { ...p, external_info_url: event.url } : null));
      }
    } else if (event.linkType === 'MARKETPLACE') {
      this.marketplaceUrl.set(event.url);
      if (event.url) {
        this.isPublishedMarketplace.set(true);
      }
      if (this.freshProduct()) {
        this.freshProduct.update(p =>
          p ? { ...p, marketplace_url: event.url, is_published_marketplace: true } : null
        );
      }
    }
  }

  private getFormSnapshotString(): string {
    return JSON.stringify({
      code: (this.code() || '').trim(),
      name: (this.name() || '').trim(),
      description: (this.description() || '').trim(),
      categoryId: this.categoryId(),
      liveBasketId: this.liveBasketId(),
      brand: (this.brand() || '').trim(),
      modelName: (this.modelName() || '').trim(),
      officialPrice: Number(this.officialPrice() || 0),
      minimumPrice: Number(this.minimumPrice() || 0),
      publishedPrice: Number(this.publishedPrice() || 0),
      currency: this.currency(),
      features: (this.features() || '').trim(),
      marketingDetails: (this.marketingDetails() || '').trim(),
      isReviewed: Boolean(this.isReviewed()),
      isWhatsappPublished: Boolean(this.isWhatsappPublished()),
      isActive: Boolean(this.isActive())
    });
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
      return { isValid: true, error: null };
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
        this.isMaximized.set(false);
        this.initialFormSnapshot.set('');
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
      this.code.set(prod.code || '');
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

      // Galería de imágenes sincronizada
      if (prod.images && prod.images.length > 0) {
        this.images.set(prod.images);
      } else {
        this.images.set([]);
      }

      // Enlaces externos sincronizados
      this.referenceLinks.set(prod.reference_links || []);
      this.marketplaceLinks.set(prod.marketplace_links || []);
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

      this.images.set([]);
      this.referenceLinks.set([]);
      this.marketplaceLinks.set([]);
    }

    this.initialFormSnapshot.set(this.getFormSnapshotString());
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

    const num = this.itemNumber();
    const codeValue = this.code().trim() ? this.code().trim() : null;

    if (this.mode() === 'create') {
      const payload: ProductMasterCreatePayload = {
        item_number: num && num > 0 ? num : null,
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
          this.initialFormSnapshot.set('');
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
            detail: `Los cambios en la ficha maestra #${updated.item_number} se guardaron exitosamente.`
          });
          this.productSaved.emit(updated);
          this.initialFormSnapshot.set(this.getFormSnapshotString());
          this.visible.set(false);
        },
        error: err => {
          this.isSubmitting.set(false);
          this.logger.error('Error updating product master', err, 'ProductMasterDrawerComponent');
          const detail = err?.error?.detail || 'Ocurrió un error al actualizar la ficha maestra.';
          this.messageService.add({
            severity: 'error',
            summary: 'Error al Guardar',
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
      header: 'Eliminar Ficha Maestra',
      message: `¿Está seguro de eliminar permanentemente la Ficha Maestra #${prod.item_number} "${prod.name}"? Esta acción no se puede deshacer y desvinculará todas sus fotografías de catálogo.`,
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
