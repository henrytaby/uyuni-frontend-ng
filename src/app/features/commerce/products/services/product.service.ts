import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { forkJoin, map, Observable } from 'rxjs';

import { ConfigService } from '@core/config/config.service';
import { CatalogService } from '@core/services/catalog.service';
import { LoggerService } from '@core/services/logger.service';

import {
  Product,
  ProductCatalogs,
  ProductCreatePayload,
  ProductParams,
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
}

