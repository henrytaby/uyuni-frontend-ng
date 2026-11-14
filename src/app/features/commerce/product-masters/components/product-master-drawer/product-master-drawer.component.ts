import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDragPreview,
  CdkDropList,
  moveItemInArray
} from '@angular/cdk/drag-drop';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { HttpEvent, HttpEventType } from '@angular/common/http';
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
import { Dialog } from 'primeng/dialog';
import { Drawer } from 'primeng/drawer';
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { ProgressBar } from 'primeng/progressbar';
import { Select } from 'primeng/select';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { Textarea } from 'primeng/textarea';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Tooltip } from 'primeng/tooltip';
import { forkJoin } from 'rxjs';
import {
  LucideCheck,
  LucideCircleAlert,
  LucideCloudUpload,
  LucideCopy,
  LucideDollarSign,
  LucideExternalLink,
  LucideEye,
  LucideGripVertical,
  LucideImage,
  LucideImages,
  LucideInfo,
  LucideLayers,
  LucideMaximize2,
  LucideMinimize2,
  LucidePackage,
  LucideRefreshCw,
  LucideStar,
  LucideTag,
  LucideTrash2,
  LucideX
} from '@lucide/angular';

import { CatalogItem } from '@core/models/catalog.model';
import { LoggerService } from '@core/services/logger.service';

import { CloudinaryUrlPipe } from '@shared/pipe/cloudinary-url.pipe';
import { createZipArchive, ZipFileEntry } from '@shared/utils/zip.utils';

import {
  ProductImage,
  ProductImageReorderItem,
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
    ProgressBar,
    Dialog,
    LucideCircleAlert,
    LucideTag,
    LucideDollarSign,
    LucideImage,
    LucideImages,
    LucidePackage,
    LucideExternalLink,
    LucideCopy,
    LucideInfo,
    LucideLayers,
    LucideCloudUpload,
    LucideStar,
    LucideTrash2,
    LucideEye,
    LucideCheck,
    LucideRefreshCw,
    LucideX,
    LucideMaximize2,
    LucideMinimize2,
    LucideGripVertical,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    CdkDragPreview,
    CdkScrollable,
    CloudinaryUrlPipe
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

  // Multimedia Gallery State
  readonly images = signal<ProductImage[]>([]);
  readonly isLoadingImages = signal<boolean>(false);
  readonly isUploadingImages = signal<boolean>(false);
  readonly uploadProgress = signal<number>(0);
  readonly isDragOver = signal<boolean>(false);
  readonly previewImage = signal<ProductImage | null>(null);
  readonly isDownloadingImage = signal<boolean>(false);
  readonly isReorderingImages = signal<boolean>(false);

  // Multimedia Selection & Bulk Actions
  readonly selectedImageIds = signal<Set<string>>(new Set());
  readonly isBulkDeleting = signal<boolean>(false);
  readonly isDownloadingZip = signal<boolean>(false);
  readonly zipProgress = signal<string>('');

  readonly selectedCount = computed(() => this.selectedImageIds().size);
  readonly isAllSelected = computed(
    () => this.images().length > 0 && this.selectedImageIds().size === this.images().length
  );
  readonly hasSelectedCover = computed(() => {
    const set = this.selectedImageIds();
    return this.images().some(img => img.is_cover && set.has(img.id));
  });

  onTabChange(tab: string | number | undefined): void {
    if (tab !== undefined) {
      this.activeTab.set(String(tab));
    }
  }

  toggleMaximize(): void {
    this.isMaximized.update(v => !v);
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
    // En modo creación es opcional: si se deja en blanco el backend asigna el número consecutivo automáticamente
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

      // Galería de imágenes
      if (prod.images && prod.images.length > 0) {
        this.images.set(prod.images);
      } else {
        this.images.set([]);
      }
      this.isUploadingImages.set(false);
      this.uploadProgress.set(0);
      this.isDragOver.set(false);
      this.previewImage.set(null);

      if (prod.id) {
        this.loadGallery(prod.id);
      }
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

      // Galería en modo creación
      this.images.set([]);
      this.isLoadingImages.set(false);
      this.isUploadingImages.set(false);
      this.uploadProgress.set(0);
      this.isDragOver.set(false);
      this.previewImage.set(null);
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

  // ===========================================================================
  // GESTIÓN DE GALERÍA MULTIMEDIA Y CLOUDINARY
  // ===========================================================================

  loadGallery(masterId: string): void {
    this.isLoadingImages.set(true);
    this.productMasterService.getImages(masterId, 'CATALOG').subscribe({
      next: imgs => {
        this.images.set(imgs);
        this.selectedImageIds.set(new Set());
        this.isLoadingImages.set(false);
        const cover = imgs.find(i => i.is_cover);
        const newCoverUrl = cover ? cover.url : null;
        this.coverImageUrl.set(newCoverUrl || '');
        if (this.freshProduct()) {
          this.freshProduct.update(p => (p ? { ...p, cover_image_url: newCoverUrl } : null));
        }
        this.coverImageChanged.emit({ masterId, coverUrl: newCoverUrl });
      },
      error: err => {
        this.logger.error('Error fetching product images gallery', err, 'ProductMasterDrawerComponent');
        this.isLoadingImages.set(false);
      }
    });
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);

    const dt = event.dataTransfer;
    if (dt && dt.files && dt.files.length > 0) {
      this.uploadSelectedFiles(dt.files);
    }
  }

  onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadSelectedFiles(input.files);
      input.value = '';
    }
  }

  uploadSelectedFiles(fileList: FileList | File[]): void {
    const prodId = this.currentDisplayProduct()?.id;
    if (!prodId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Ficha No Guardada',
        detail: 'Debe guardar la ficha maestra antes de subir fotografías.'
      });
      return;
    }

    const filesArray: File[] = Array.from(fileList);
    const validFiles: File[] = [];
    const maxBytes = 10 * 1024 * 1024; // 10MB

    for (const file of filesArray) {
      if (!file.type.startsWith('image/')) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Formato No Válido',
          detail: `"${file.name}" no es una imagen compatible (JPG, PNG, WEBP, AVIF).`
        });
        continue;
      }
      if (file.size > maxBytes) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Archivo Demasiado Pesado',
          detail: `"${file.name}" supera el tamaño máximo permitido de 10 MB.`
        });
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    this.isUploadingImages.set(true);
    this.uploadProgress.set(0);

    const hasCover = this.images().some(i => i.is_cover);
    const shouldSetCover = !hasCover;

    this.productMasterService.uploadImagesWithProgress(prodId, validFiles, 'CATALOG', shouldSetCover).subscribe({
      next: (event: HttpEvent<ProductImage[]>) => {
        if (event.type === HttpEventType.UploadProgress) {
          const total = event.total || 0;
          if (total > 0) {
            const percent = Math.round((100 * event.loaded) / total);
            this.uploadProgress.set(percent);
          } else {
            this.uploadProgress.set(50);
          }
        } else if (event.type === HttpEventType.Response) {
          this.isUploadingImages.set(false);
          this.uploadProgress.set(100);
          const newImages = event.body || [];
          this.messageService.add({
            severity: 'success',
            summary: 'Subida Exitosa',
            detail: `Se subieron ${newImages.length} fotografía(s) al catálogo exitosamente.`
          });
          this.loadGallery(prodId);
        }
      },
      error: err => {
        this.isUploadingImages.set(false);
        this.uploadProgress.set(0);
        this.logger.error('Error uploading product images', err, 'ProductMasterDrawerComponent');
        const detail = err?.error?.detail || 'Ocurrió un error al subir las imágenes al servidor.';
        this.messageService.add({
          severity: 'error',
          summary: 'Error de Subida',
          detail
        });
      }
    });
  }

  setAsCover(img: ProductImage): void {
    const prodId = this.currentDisplayProduct()?.id;
    if (!prodId) return;

    if (img.is_cover) {
      this.messageService.add({
        severity: 'info',
        summary: 'Portada Actual',
        detail: 'Esta fotografía ya es la portada oficial de la ficha maestra.'
      });
      return;
    }

    this.productMasterService.setCoverImage(prodId, img.id).subscribe({
      next: updatedCover => {
        this.images.update(list =>
          list.map(item => ({
            ...item,
            is_cover: item.id === updatedCover.id
          }))
        );
        this.coverImageUrl.set(updatedCover.url);

        if (this.freshProduct()) {
          this.freshProduct.update(p => (p ? { ...p, cover_image_url: updatedCover.url } : null));
        }

        this.coverImageChanged.emit({ masterId: prodId, coverUrl: updatedCover.url });

        this.messageService.add({
          severity: 'success',
          summary: 'Portada Actualizada',
          detail: 'La fotografía se asignó como portada oficial exitosamente.'
        });
      },
      error: err => {
        this.logger.error('Error setting cover image', err, 'ProductMasterDrawerComponent');
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo asignar la imagen como portada.'
        });
      }
    });
  }

  /**
   * Reordena la posición de las fotografías mediante Drag & Drop (Optimistic UI)
   * y persiste el nuevo orden en el Backend.
   */
  onImageDrop(event: CdkDragDrop<ProductImage[]>): void {
    if (event.previousIndex === event.currentIndex) {
      return;
    }

    const prodId = this.currentDisplayProduct()?.id;
    if (!prodId) return;

    const currentImages = this.images();
    const previousImages = [...currentImages];
    const reordered = [...currentImages];
    moveItemInArray(reordered, event.previousIndex, event.currentIndex);

    // Actualización optimista inmediata en la UI con sort_order correlativo
    const updatedImages = reordered.map((img, index) => ({
      ...img,
      sort_order: index + 1
    }));
    this.images.set(updatedImages);

    const payload: ProductImageReorderItem[] = updatedImages.map(img => ({
      id: img.id,
      sort_order: img.sort_order
    }));

    this.isReorderingImages.set(true);

    this.productMasterService.reorderImages(prodId, payload).subscribe({
      next: confirmedImages => {
        this.isReorderingImages.set(false);
        this.images.set(confirmedImages);
        this.messageService.add({
          severity: 'info',
          summary: 'Orden Actualizado',
          detail: 'Se guardó la nueva posición de las fotografías.',
          life: 2000
        });
      },
      error: err => {
        this.isReorderingImages.set(false);
        this.images.set(previousImages);
        this.logger.error('Error reordering images', err, 'ProductMasterDrawerComponent');
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo guardar el nuevo orden de las fotografías.'
        });
      }
    });
  }

  confirmDeleteImage(img: ProductImage): void {
    const prodId = this.currentDisplayProduct()?.id;
    if (!prodId) return;

    this.confirmationService.confirm({
      header: 'Eliminar Fotografía',
      message: `¿Desea eliminar permanentemente esta fotografía del catálogo? ${
        img.is_cover ? 'Esta imagen es la portada oficial actual; el sistema reasignará otra disponible.' : ''
      }`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonProps: {
        severity: 'danger'
      },
      rejectButtonProps: {
        severity: 'secondary',
        outlined: true
      },
      accept: () => {
        this.productMasterService.deleteImage(prodId, img.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Fotografía Eliminada',
              detail: 'La imagen fue removida del catálogo exitosamente.'
            });
            this.selectedImageIds.update(set => {
              const next = new Set(set);
              next.delete(img.id);
              return next;
            });
            this.loadGallery(prodId);
          },
          error: err => {
            this.logger.error('Error deleting product image', err, 'ProductMasterDrawerComponent');
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar la imagen.'
            });
          }
        });
      }
    });
  }

  openPreview(img: ProductImage): void {
    this.previewImage.set(img);
  }

  closePreview(): void {
    this.previewImage.set(null);
  }

  onPreviewVisibleChange(isVisible: boolean): void {
    if (!isVisible) {
      this.closePreview();
    }
  }

  formatBytes(bytes: number | null | undefined): string {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  /**
   * Descarga la fotografía en alta resolución original.
   * Utiliza fetch + Blob para forzar el guardado local y asignar un nombre amigable.
   * En caso de restricción de red, utiliza la transformación 'fl_attachment' de Cloudinary.
   */
  async downloadImage(image: ProductImage): Promise<void> {
    if (!image?.url) return;

    const productName = this.currentDisplayProduct()?.name || `producto_${this.currentDisplayProduct()?.item_number || 'maestro'}`;
    const cleanTitle = (image.title || productName)
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9_-]+/g, '_')
      .replace(/^_+|_+$/g, '');
    const extension = (image.format || 'jpg').toLowerCase().replace(/^\./, '');
    const targetFilename = `${cleanTitle || 'fotografia'}.${extension}`;

    this.isDownloadingImage.set(true);

    try {
      const response = await fetch(image.url);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = targetFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
    } catch {
      let downloadUrl = image.url;
      if (downloadUrl.includes('res.cloudinary.com') && downloadUrl.includes('/upload/')) {
        downloadUrl = downloadUrl.replace('/upload/', `/upload/fl_attachment:${cleanTitle}/`);
      }
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = targetFilename;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      this.isDownloadingImage.set(false);
    }
  }

  // ===========================================================================
  // SELECCIÓN MÚLTIPLE Y ACCIONES MASIVAS (BULK ACTIONS)
  // ===========================================================================

  toggleSelectImage(imgId: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.selectedImageIds.update(set => {
      const next = new Set(set);
      if (next.has(imgId)) {
        next.delete(imgId);
      } else {
        next.add(imgId);
      }
      return next;
    });
  }

  toggleSelectAll(): void {
    if (this.isAllSelected()) {
      this.selectedImageIds.set(new Set());
    } else {
      this.selectedImageIds.set(new Set(this.images().map(img => img.id)));
    }
  }

  clearSelection(): void {
    this.selectedImageIds.set(new Set());
  }

  confirmBulkDelete(): void {
    const prodId = this.currentDisplayProduct()?.id;
    const count = this.selectedCount();
    if (!prodId || count === 0) return;

    const selectedSet = this.selectedImageIds();
    const hasCover = this.hasSelectedCover();

    this.confirmationService.confirm({
      header: `Eliminar ${count} ${count === 1 ? 'Fotografía' : 'Fotografías'}`,
      message: `¿Desea eliminar permanentemente ${
        count === 1 ? 'la fotografía seleccionada' : `las ${count} fotografías seleccionadas`
      } del catálogo? Esta acción no se puede deshacer. ${
        hasCover
          ? '⚠️ Una de las imágenes seleccionadas es la Portada Oficial actual; el sistema reasignará otra disponible si queda alguna.'
          : ''
      }`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: `Eliminar ${count} ${count === 1 ? 'Foto' : 'Fotos'}`,
      rejectLabel: 'Cancelar',
      acceptButtonProps: {
        severity: 'danger'
      },
      rejectButtonProps: {
        severity: 'secondary',
        outlined: true
      },
      accept: () => {
        this.isBulkDeleting.set(true);
        const idsToDelete = Array.from(selectedSet);
        forkJoin(idsToDelete.map(id => this.productMasterService.deleteImage(prodId, id))).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Fotografías Eliminadas',
              detail: `Se ${count === 1 ? 'eliminó 1 fotografía' : `eliminaron ${count} fotografías`} del catálogo exitosamente.`
            });
            this.selectedImageIds.set(new Set());
            this.isBulkDeleting.set(false);
            this.loadGallery(prodId);
          },
          error: err => {
            this.logger.error('Error in bulk deleting product images', err, 'ProductMasterDrawerComponent');
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Ocurrió un problema al eliminar algunas fotografías.'
            });
            this.isBulkDeleting.set(false);
            this.loadGallery(prodId);
          }
        });
      }
    });
  }

  /**
   * Descarga las fotografías en un archivo comprimido .ZIP en el navegador del cliente.
   * Si onlySelected es true, comprime solo las seleccionadas; de lo contrario, comprime todo el álbum.
   */
  async downloadImagesZip(onlySelected = false): Promise<void> {
    const allImages = this.images();
    const selectedIds = this.selectedImageIds();
    const targetImages = onlySelected
      ? allImages.filter(img => selectedIds.has(img.id))
      : allImages;

    if (targetImages.length === 0) return;

    this.isDownloadingZip.set(true);
    this.zipProgress.set(`0/${targetImages.length}`);

    const productName = this.currentDisplayProduct()?.name || `producto_${this.currentDisplayProduct()?.item_number || 'maestro'}`;
    const cleanProductName = productName
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9_-]+/g, '_')
      .replace(/^_+|_+$/g, '');

    try {
      const fileEntries: ZipFileEntry[] = [];
      let completedCount = 0;

      for (let i = 0; i < targetImages.length; i++) {
        const img = targetImages[i];
        this.zipProgress.set(`${completedCount + 1}/${targetImages.length}`);

        const response = await fetch(img.url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} al descargar imagen`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const extension = (img.format || 'jpg').toLowerCase().replace(/^\./, '');
        const prefix = String(i + 1).padStart(2, '0');
        const coverTag = img.is_cover ? '_PORTADA' : '';
        const filename = `${prefix}${coverTag}_${cleanProductName || 'foto'}_${img.id.slice(0, 6)}.${extension}`;

        fileEntries.push({
          name: filename,
          data: new Uint8Array(arrayBuffer)
        });
        completedCount++;
      }

      this.zipProgress.set('Comprimiendo ZIP...');
      const zipBlob = createZipArchive(fileEntries);
      const blobUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${cleanProductName || 'catalogo'}_fotos.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);

      this.messageService.add({
        severity: 'success',
        summary: 'Descarga Completa',
        detail: `Se descargaron y empaquetaron ${targetImages.length} fotos en el archivo ZIP correctamente.`
      });
    } catch (err) {
      this.logger.error('Error generating images zip', err, 'ProductMasterDrawerComponent');
      this.messageService.add({
        severity: 'error',
        summary: 'Error en Descarga',
        detail: 'No se pudieron descargar todas las imágenes para empaquetar el ZIP.'
      });
    } finally {
      this.isDownloadingZip.set(false);
      this.zipProgress.set('');
    }
  }
}
