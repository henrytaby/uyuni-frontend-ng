import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { forkJoin, map, Observable } from 'rxjs';

import { ConfigService } from '@core/config/config.service';
import { CatalogService } from '@core/services/catalog.service';
import { LoggerService } from '@core/services/logger.service';

import {
  CommerceCatalogs,
  ProductMaster,
  ProductMasterCreatePayload,
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
}
