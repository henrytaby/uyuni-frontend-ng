import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { forkJoin, map, Observable } from 'rxjs';

import { ConfigService } from '@core/config/config.service';
import { SKIP_LOADER_HEADER } from '@core/interceptors/loading.interceptor';
import { CatalogService } from '@core/services/catalog.service';
import { LoggerService } from '@core/services/logger.service';

import {
  ImageReorderItem,
  Product,
  ProductCatalogs,
  ProductCreatePayload,
  ProductParams,
  ProductRealImage,
  ProductUpdatePayload
} from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly configService = inject(ConfigService);
  private readonly catalogService = inject(CatalogService);
  private readonly logger = inject(LoggerService);

  private get baseUrl(): string {
    return `${this.configService.apiUrl}/commerce/products`;
  }

  /**
   * Construye HttpParams a partir de ProductParams para el listado
   */
  private buildHttpParams(params: ProductParams): HttpParams {
    let httpParams = new HttpParams();

    if (params.offset !== undefined) httpParams = httpParams.set('offset', params.offset.toString());
    if (params.limit !== undefined) httpParams = httpParams.set('limit', params.limit.toString());
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.sort_by) httpParams = httpParams.set('sort_by', params.sort_by);
    if (params.sort_order) httpParams = httpParams.set('sort_order', params.sort_order);
    if (params.batch_id) httpParams = httpParams.set('batch_id', params.batch_id);
    if (params.master_product_id) httpParams = httpParams.set('master_product_id', params.master_product_id);
    if (params.status) httpParams = httpParams.set('status', params.status);

    return httpParams;
  }

  /**
   * Obtiene la lista paginada de productos físicos
   */
  getProducts(params: ProductParams): Observable<Product[]> {
    const httpParams = this.buildHttpParams(params);
    this.logger.debug('Fetching products list', { params }, 'ProductService');
    return this.http.get<Product[]>(`${this.baseUrl}/`, { params: httpParams });
  }

  /**
   * Obtiene el conteo total de productos físicos que coinciden con los filtros
   */
  getProductsCount(params: ProductParams): Observable<number> {
    let httpParams = new HttpParams();
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.batch_id) httpParams = httpParams.set('batch_id', params.batch_id);
    if (params.master_product_id) httpParams = httpParams.set('master_product_id', params.master_product_id);
    if (params.status) httpParams = httpParams.set('status', params.status);

    this.logger.debug('Fetching products count', { params }, 'ProductService');
    return this.http.get<{ total: number }>(`${this.baseUrl}/count`, { params: httpParams }).pipe(
      map(response => response.total)
    );
  }

  /**
   * Carga en paralelo la lista de productos y el conteo total para la tabla lazy
   */
  loadProductPage(params: ProductParams): Observable<{ data: Product[]; total: number }> {
    return forkJoin({
      data: this.getProducts(params),
      total: this.getProductsCount(params)
    }).pipe(
      map(result => {
        this.logger.info(
          'Products page loaded',
          { count: result.data.length, total: result.total },
          'ProductService'
        );
        return result;
      })
    );
  }

  /**
   * Obtiene un producto físico por su ID único
   */
  getProductById(id: string): Observable<Product> {
    this.logger.debug('Fetching product by ID', { id }, 'ProductService');
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  /**
   * Obtiene un producto físico por el SKU / código de la ficha maestra
   */
  getProductBySku(sku: string): Observable<Product> {
    this.logger.debug('Fetching product by SKU', { sku }, 'ProductService');
    return this.http.get<Product>(`${this.baseUrl}/by-sku/${sku}`);
  }

  /**
   * Registra una nueva existencia física de producto
   */
  createProduct(payload: ProductCreatePayload): Observable<Product> {
    this.logger.info('Creating physical product', { master_product_id: payload.master_product_id }, 'ProductService');
    return this.http.post<Product>(`${this.baseUrl}/`, payload);
  }

  /**
   * Actualiza los datos de un producto físico
   */
  updateProduct(id: string, payload: ProductUpdatePayload): Observable<Product> {
    this.logger.info('Updating physical product', { id, payload }, 'ProductService');
    return this.http.put<Product>(`${this.baseUrl}/${id}`, payload);
  }

  /**
   * Elimina un producto físico del inventario
   */
  deleteProduct(id: string): Observable<{ message: string }> {
    this.logger.info('Deleting physical product', { id }, 'ProductService');
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }

  /**
   * Obtiene los catálogos de soporte para productos físicos en una sola petición bulk
   */
  getProductCatalogs(): Observable<ProductCatalogs> {
    this.logger.debug('Fetching bulk commerce catalogs for products', null, 'ProductService');
    return this.catalogService
      .getBulkCatalogs({
        commerce_product_masters: {},
        commerce_batches: {},
        commerce_product_statuses: {},
        commerce_physical_conditions: {}
      })
      .pipe(
        map(res => ({
          masterProducts: res['commerce_product_masters'] || [],
          batches: res['commerce_batches'] || [],
          statuses: res['commerce_product_statuses'] || [],
          physicalConditions: res['commerce_physical_conditions'] || []
        }))
      );
  }

  // ===========================================================================
  // FOTOGRAFÍAS REALES DE ALMACÉN (/images)
  // ===========================================================================

  /**
   * Obtiene la lista de fotografías reales de un producto físico
   */
  getImages(productId: string): Observable<ProductRealImage[]> {
    this.logger.debug('Fetching product real images', { productId }, 'ProductService');
    return this.http.get<ProductRealImage[]>(`${this.baseUrl}/${productId}/images`, {
      headers: { [SKIP_LOADER_HEADER]: 'true' }
    });
  }

  /**
   * Sube una o múltiples fotografías reales al servidor reportando progreso HTTP
   */
  uploadImagesWithProgress(
    productId: string,
    files: File[],
    isPublic = false
  ): Observable<HttpEvent<ProductRealImage[]>> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file, file.name);
    });
    formData.append('is_public', String(isPublic));

    this.logger.info(
      'Uploading physical product real images with progress tracking',
      { productId, count: files.length, isPublic },
      'ProductService'
    );

    const req = new HttpRequest<FormData>('POST', `${this.baseUrl}/${productId}/images`, formData, {
      reportProgress: true,
      headers: new HttpHeaders({ [SKIP_LOADER_HEADER]: 'true' })
    });

    return this.http.request<ProductRealImage[]>(req);
  }

  /**
   * Reordena la secuencia sort_order de las fotografías reales
   */
  reorderImages(productId: string, items: ImageReorderItem[]): Observable<ProductRealImage[]> {
    this.logger.info('Reordering product real images', { productId, count: items.length }, 'ProductService');
    return this.http.put<ProductRealImage[]>(`${this.baseUrl}/${productId}/images/reorder`, items, {
      headers: { [SKIP_LOADER_HEADER]: 'true' }
    });
  }

  /**
   * Alterna la visibilidad pública o actualiza metadatos de una fotografía real
   */
  togglePublic(productId: string, imageId: string, isPublic: boolean): Observable<ProductRealImage> {
    this.logger.info('Toggling public visibility for product real image', { productId, imageId, isPublic }, 'ProductService');
    return this.http.patch<ProductRealImage>(
      `${this.baseUrl}/${productId}/images/${imageId}`,
      { is_public: isPublic },
      { headers: { [SKIP_LOADER_HEADER]: 'true' } }
    );
  }

  /**
   * Elimina permanentemente una fotografía real del producto
   */
  deleteImage(productId: string, imageId: string): Observable<{ message: string }> {
    this.logger.info('Deleting product real image', { productId, imageId }, 'ProductService');
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${productId}/images/${imageId}`, {
      headers: { [SKIP_LOADER_HEADER]: 'true' }
    });
  }
}

