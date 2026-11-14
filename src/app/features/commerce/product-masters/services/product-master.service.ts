import { HttpClient, HttpEvent, HttpParams, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { forkJoin, map, Observable } from 'rxjs';

import { ConfigService } from '@core/config/config.service';
import { CatalogService } from '@core/services/catalog.service';
import { LoggerService } from '@core/services/logger.service';

import {
  CommerceCatalogs,
  ProductImage,
  ProductImageReorderItem,
  ProductLinkType,
  ProductMaster,
  ProductMasterCreatePayload,
  ProductMasterExternalLink,
  ProductMasterExternalLinkCreate,
  ProductMasterExternalLinkReorderItem,
  ProductMasterExternalLinkUpdate,
  ProductMasterParams,
  ProductMasterUpdatePayload
} from '../models/product-master.model';

@Injectable({
  providedIn: 'root'
})
export class ProductMasterService {
  private readonly http = inject(HttpClient);
  private readonly configService = inject(ConfigService);
  private readonly catalogService = inject(CatalogService);
  private readonly logger = inject(LoggerService);

  private get baseUrl(): string {
    return `${this.configService.apiUrl}/commerce/product-masters`;
  }

  /**
   * Construye HttpParams a partir de ProductMasterParams
   */
  private buildHttpParams(params: ProductMasterParams): HttpParams {
    let httpParams = new HttpParams();

    if (params.offset !== undefined) httpParams = httpParams.set('offset', params.offset.toString());
    if (params.limit !== undefined) httpParams = httpParams.set('limit', params.limit.toString());
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.sort_by) httpParams = httpParams.set('sort_by', params.sort_by);
    if (params.sort_order) httpParams = httpParams.set('sort_order', params.sort_order);
    if (params.category_id) httpParams = httpParams.set('category_id', params.category_id);
    if (params.live_basket_id) httpParams = httpParams.set('live_basket_id', params.live_basket_id);
    if (params.is_active !== undefined) httpParams = httpParams.set('is_active', params.is_active.toString());

    return httpParams;
  }

  /**
   * Obtiene la lista paginada de fichas maestras
   */
  getProductMasters(params: ProductMasterParams): Observable<ProductMaster[]> {
    const httpParams = this.buildHttpParams(params);
    this.logger.debug('Fetching product masters list', { params }, 'ProductMasterService');
    return this.http.get<ProductMaster[]>(`${this.baseUrl}/`, { params: httpParams });
  }

  /**
   * Obtiene el conteo total de fichas maestras que coinciden con los filtros
   */
  getProductMastersCount(params: ProductMasterParams): Observable<number> {
    let httpParams = new HttpParams();
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.category_id) httpParams = httpParams.set('category_id', params.category_id);
    if (params.live_basket_id) httpParams = httpParams.set('live_basket_id', params.live_basket_id);
    if (params.is_active !== undefined) httpParams = httpParams.set('is_active', params.is_active.toString());

    this.logger.debug('Fetching product masters count', { params }, 'ProductMasterService');
    return this.http.get<{ total: number; count: number }>(`${this.baseUrl}/count`, { params: httpParams }).pipe(
      map(response => response.total)
    );
  }

  /**
   * Carga datos y conteo en paralelo para PrimeNG Lazy Loading
   */
  loadProductMasterPage(params: ProductMasterParams): Observable<{ data: ProductMaster[]; total: number }> {
    return forkJoin({
      data: this.getProductMasters(params),
      total: this.getProductMastersCount(params)
    }).pipe(
      map(result => {
        this.logger.info(
          'Product masters page loaded',
          { count: result.data.length, total: result.total },
          'ProductMasterService'
        );
        return result;
      })
    );
  }

  /**
   * Obtiene una ficha maestra por su ID único
   */
  getProductMasterById(id: string): Observable<ProductMaster> {
    this.logger.debug('Fetching product master by ID', { id }, 'ProductMasterService');
    return this.http.get<ProductMaster>(`${this.baseUrl}/${id}`);
  }

  /**
   * Obtiene una ficha maestra por su número de catálogo numérico
   */
  getProductMasterByNumber(itemNumber: number): Observable<ProductMaster> {
    this.logger.debug('Fetching product master by item number', { itemNumber }, 'ProductMasterService');
    return this.http.get<ProductMaster>(`${this.baseUrl}/by-number/${itemNumber}`);
  }

  /**
   * Crea una nueva ficha maestra
   */
  createProductMaster(payload: ProductMasterCreatePayload): Observable<ProductMaster> {
    this.logger.info('Creating product master', { item_number: payload.item_number, name: payload.name }, 'ProductMasterService');
    return this.http.post<ProductMaster>(`${this.baseUrl}/`, payload);
  }

  /**
   * Actualiza una ficha maestra existente
   */
  updateProductMaster(id: string, payload: ProductMasterUpdatePayload): Observable<ProductMaster> {
    this.logger.info('Updating product master', { id, payload }, 'ProductMasterService');
    return this.http.put<ProductMaster>(`${this.baseUrl}/${id}`, payload);
  }

  /**
   * Elimina una ficha maestra por su ID
   */
  deleteProductMaster(id: string): Observable<{ message: string }> {
    this.logger.info('Deleting product master', { id }, 'ProductMasterService');
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }

  /**
   * Obtiene los catálogos requeridos (categorías y canastas live) en una sola llamada bulk
   */
  getCommerceCatalogs(): Observable<CommerceCatalogs> {
    this.logger.debug('Fetching bulk commerce catalogs for product masters', null, 'ProductMasterService');
    return this.catalogService
      .getBulkCatalogs({
        commerce_categories: {},
        commerce_live_baskets: {}
      })
      .pipe(
        map(res => ({
          categories: res['commerce_categories'] || [],
          liveBaskets: res['commerce_live_baskets'] || []
        }))
      );
  }

  // ===========================================================================
  // MULTI-FOTOGRAFÍA Y GALERÍA MULTIMEDIA (CLOUDINARY)
  // ===========================================================================

  /**
   * Sube una o múltiples fotografías a Cloudinary reportando el progreso de subida HTTP
   */
  uploadImagesWithProgress(
    masterId: string,
    files: File[],
    imageType = 'CATALOG',
    isCover = false
  ): Observable<HttpEvent<ProductImage[]>> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file, file.name);
    });
    formData.append('image_type', imageType);
    formData.append('is_cover', isCover ? 'true' : 'false');

    this.logger.info(
      'Uploading product master images with progress tracking',
      { masterId, count: files.length, imageType, isCover },
      'ProductMasterService'
    );

    const req = new HttpRequest<FormData>('POST', `${this.baseUrl}/${masterId}/images`, formData, {
      reportProgress: true
    });

    return this.http.request<ProductImage[]>(req);
  }

  /**
   * Obtiene la galería de imágenes de una ficha maestra
   */
  getImages(masterId: string, imageType?: string): Observable<ProductImage[]> {
    let httpParams = new HttpParams();
    if (imageType) httpParams = httpParams.set('image_type', imageType);

    this.logger.debug('Fetching product master images', { masterId, imageType }, 'ProductMasterService');
    return this.http.get<ProductImage[]>(`${this.baseUrl}/${masterId}/images`, { params: httpParams });
  }

  /**
   * Define una imagen específica como la portada oficial (is_cover = true)
   */
  setCoverImage(masterId: string, imageId: string): Observable<ProductImage> {
    this.logger.info('Setting cover image for product master', { masterId, imageId }, 'ProductMasterService');
    return this.http.patch<ProductImage>(`${this.baseUrl}/${masterId}/images/${imageId}/cover`, {});
  }

  /**
   * Elimina una imagen de la base de datos y destruye su asset en Cloudinary
   */
  deleteImage(masterId: string, imageId: string): Observable<{ message: string }> {
    this.logger.info('Deleting product master image', { masterId, imageId }, 'ProductMasterService');
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${masterId}/images/${imageId}`);
  }

  /**
   * Reordena la secuencia de imágenes de la galería
   */
  reorderImages(masterId: string, items: ProductImageReorderItem[]): Observable<ProductImage[]> {
    this.logger.info('Reordering product master images', { masterId, count: items.length }, 'ProductMasterService');
    return this.http.put<ProductImage[]>(`${this.baseUrl}/${masterId}/images/reorder`, items);
  }

  // ===========================================================================
  // ENLACES EXTERNOS MULTI-PORTAL Y MARKETPLACE (/links)
  // ===========================================================================

  /**
   * Obtiene la lista de enlaces externos asociados a una ficha maestra
   */
  getExternalLinks(
    masterId: string,
    options?: { link_type?: ProductLinkType; only_public?: boolean }
  ): Observable<ProductMasterExternalLink[]> {
    let httpParams = new HttpParams();
    if (options?.link_type) httpParams = httpParams.set('link_type', options.link_type);
    if (options?.only_public !== undefined) httpParams = httpParams.set('only_public', options.only_public.toString());

    this.logger.debug('Fetching product master external links', { masterId, options }, 'ProductMasterService');
    return this.http.get<ProductMasterExternalLink[]>(`${this.baseUrl}/${masterId}/links`, { params: httpParams });
  }

  /**
   * Agrega un nuevo enlace externo o publicación de Marketplace a la ficha maestra
   */
  addExternalLink(
    masterId: string,
    payload: ProductMasterExternalLinkCreate
  ): Observable<ProductMasterExternalLink> {
    this.logger.info('Adding external link to product master', { masterId, payload }, 'ProductMasterService');
    return this.http.post<ProductMasterExternalLink>(`${this.baseUrl}/${masterId}/links`, payload);
  }

  /**
   * Actualiza metadatos de un enlace externo (etiqueta, url, visibilidad pública)
   */
  updateExternalLink(
    masterId: string,
    linkId: string,
    payload: ProductMasterExternalLinkUpdate
  ): Observable<ProductMasterExternalLink> {
    this.logger.info('Updating external link', { masterId, linkId, payload }, 'ProductMasterService');
    return this.http.patch<ProductMasterExternalLink>(`${this.baseUrl}/${masterId}/links/${linkId}`, payload);
  }

  /**
   * Designa un enlace como principal de su categoría ('REFERENCE' o 'MARKETPLACE')
   */
  setPrimaryExternalLink(masterId: string, linkId: string): Observable<ProductMasterExternalLink> {
    this.logger.info('Setting primary external link', { masterId, linkId }, 'ProductMasterService');
    return this.http.patch<ProductMasterExternalLink>(`${this.baseUrl}/${masterId}/links/${linkId}/primary`, {});
  }

  /**
   * Reordena la secuencia de enlaces externos
   */
  reorderExternalLinks(
    masterId: string,
    items: ProductMasterExternalLinkReorderItem[]
  ): Observable<ProductMasterExternalLink[]> {
    this.logger.info('Reordering external links', { masterId, count: items.length }, 'ProductMasterService');
    return this.http.put<ProductMasterExternalLink[]>(`${this.baseUrl}/${masterId}/links/reorder`, items);
  }

  /**
   * Elimina un enlace externo de la ficha maestra
   */
  deleteExternalLink(masterId: string, linkId: string): Observable<{ message: string }> {
    this.logger.info('Deleting external link', { masterId, linkId }, 'ProductMasterService');
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${masterId}/links/${linkId}`);
  }
}

