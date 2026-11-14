import { computed, inject, Injectable, signal } from '@angular/core';

import {
  ProductImage,
  ProductMaster,
  ProductMasterCreatePayload,
  ProductMasterExternalLink,
  ProductMasterUpdatePayload
} from '../models/product-master.model';
import { ProductMasterService } from './product-master.service';

/**
 * Scoped Form Store para la Ficha Maestra.
 * Gestiona de forma centralizada y reactiva el estado, validaciones y cálculos
 * derivados de todos los formularios de la ficha, sirviendo a los componentes de pestañas.
 * Debe proveerse a nivel de componente (`providers: [ProductMasterFormStore]` en ProductMasterDrawerComponent).
 */
@Injectable()
export class ProductMasterFormStore {
  readonly productMasterService = inject(ProductMasterService);

  // Modo del formulario y productos base
  readonly mode = signal<'create' | 'edit'>('create');
  readonly rawProduct = signal<ProductMaster | null>(null);
  readonly freshProduct = signal<ProductMaster | null>(null);
  readonly isLoadingDetails = signal<boolean>(false);
  readonly isSubmitting = signal<boolean>(false);

  readonly currentProduct = computed<ProductMaster | null>(() => {
    return this.freshProduct() || this.rawProduct();
  });

  // Datos Comerciales
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

  // Imágenes (sincronizadas con app-product-master-gallery)
  readonly images = signal<ProductImage[]>([]);

  // Enlaces externos (sincronizados con app-product-master-links)
  readonly referenceLinks = signal<ProductMasterExternalLink[]>([]);
  readonly marketplaceLinks = signal<ProductMasterExternalLink[]>([]);

  // Snapshot para detección de modificaciones sin guardar
  readonly initialFormSnapshot = signal<string>('');

  readonly isDirty = computed<boolean>(() => {
    const init = this.initialFormSnapshot();
    if (!init) return false;
    return init !== this.getFormSnapshotString();
  });

  // Validaciones
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

    if (min > published && published > 0) {
      return {
        isValid: true,
        error: null,
        warning: 'El precio mínimo protegido es mayor al precio publicado de venta'
      };
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

  // Métricas de Stock Físico Consolidado
  readonly totalAvailableStock = computed(() => this.currentProduct()?.total_available_stock ?? 0);
  readonly totalSoldStock = computed(() => this.currentProduct()?.total_sold_stock ?? 0);
  readonly totalMermaStock = computed(() => this.currentProduct()?.total_merma_stock ?? 0);
  readonly totalHistoricalStock = computed(() => {
    return this.totalAvailableStock() + this.totalSoldStock() + this.totalMermaStock();
  });

  // Simulador de Margen de Regateo (Base: Precio Publicado de Venta Real)
  readonly negotiationMargin = computed<{ amount: number; percentage: number; hasMargin: boolean }>(() => {
    const published = this.publishedPrice() ?? 0;
    const official = this.officialPrice() ?? 0;
    const min = this.minimumPrice() ?? 0;

    const base = published > 0 ? published : official;
    const amount = base > min ? base - min : 0;
    const percentage = base > 0 && amount > 0 ? (amount / base) * 100 : 0;

    return {
      amount,
      percentage,
      hasMargin: amount > 0
    };
  });

  getFormSnapshotString(): string {
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

  initForm(prod: ProductMaster | null, mode: 'create' | 'edit'): void {
    this.mode.set(mode);
    this.rawProduct.set(prod);
    this.freshProduct.set(null);

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

      this.images.set(prod.images && prod.images.length > 0 ? prod.images : []);
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

  applyFreshDetails(fresh: ProductMaster): void {
    this.freshProduct.set(fresh);
    this.initForm(fresh, 'edit');
  }

  buildCreatePayload(): ProductMasterCreatePayload {
    const num = this.itemNumber();
    const codeValue = this.code().trim() ? this.code().trim() : null;

    return {
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
  }

  buildUpdatePayload(): ProductMasterUpdatePayload {
    const codeValue = this.code().trim() ? this.code().trim() : null;

    return {
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
  }

  onCoverImageChanged(coverUrl: string | null): void {
    this.coverImageUrl.set(coverUrl || '');
    if (this.freshProduct()) {
      this.freshProduct.update(p => (p ? { ...p, cover_image_url: coverUrl } : null));
    }
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

  markClean(): void {
    this.initialFormSnapshot.set(this.getFormSnapshotString());
  }

  resetSnapshot(): void {
    this.initialFormSnapshot.set('');
  }
}
