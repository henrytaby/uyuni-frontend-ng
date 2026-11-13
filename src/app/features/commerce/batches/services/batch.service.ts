import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { forkJoin, map, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from '@core/config/config.service';
import { CatalogService } from '@core/services/catalog.service';
import { LoggerService } from '@core/services/logger.service';

import {
  Batch,
  BatchCatalogs,
  BatchCreatePayload,
  BatchParams,
  BatchUpdatePayload
} from '../models/batch.model';

@Injectable({
  providedIn: 'root'
})
export class BatchService {
  private readonly http = inject(HttpClient);
  private readonly configService = inject(ConfigService);
  private readonly catalogService = inject(CatalogService);
  private readonly logger = inject(LoggerService);

  private get baseUrl(): string {
    return `${this.configService.apiUrl}/commerce/batches`;
  }

  /**
   * Construye HttpParams a partir de BatchParams para el listado
   */
  private buildHttpParams(params: BatchParams): HttpParams {
    let httpParams = new HttpParams();

    if (params.offset !== undefined) httpParams = httpParams.set('offset', params.offset.toString());
    if (params.limit !== undefined) httpParams = httpParams.set('limit', params.limit.toString());
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.sort_by) httpParams = httpParams.set('sort_by', params.sort_by);
    if (params.sort_order) httpParams = httpParams.set('sort_order', params.sort_order);

    return httpParams;
  }

  /**
   * Obtiene la lista paginada de lotes y cajas
   */
  getBatches(params: BatchParams): Observable<Batch[]> {
    const httpParams = this.buildHttpParams(params);
    this.logger.debug('Fetching batches list', { params }, 'BatchService');
    return this.http.get<Batch[]>(`${this.baseUrl}/`, { params: httpParams });
  }

  /**
   * Obtiene el conteo total de lotes/cajas que coinciden con los filtros
   */
  getBatchesCount(params: BatchParams): Observable<number> {
    let httpParams = new HttpParams();
    if (params.search) httpParams = httpParams.set('search', params.search);

    this.logger.debug('Fetching batches count', { params }, 'BatchService');
    return this.http.get<{ total: number }>(`${this.baseUrl}/count`, { params: httpParams }).pipe(
      map(response => response.total)
    );
  }

  /**
   * Carga en paralelo la lista de lotes y el conteo total para la tabla lazy
   */
  loadBatchPage(params: BatchParams): Observable<{ data: Batch[]; total: number }> {
    return forkJoin({
      data: this.getBatches(params),
      total: this.getBatchesCount(params)
    }).pipe(
      map(result => {
        this.logger.info(
          'Batches page loaded',
          { count: result.data.length, total: result.total },
          'BatchService'
        );
        return result;
      })
    );
  }

  /**
   * Obtiene un lote o caja por su ID único
   */
  getBatchById(id: string): Observable<Batch> {
    this.logger.debug('Fetching batch by ID', { id }, 'BatchService');
    return this.http.get<Batch>(`${this.baseUrl}/${id}`);
  }

  /**
   * Registra un nuevo lote o caja
   */
  createBatch(payload: BatchCreatePayload): Observable<Batch> {
    this.logger.info('Creating batch', { code: payload.code, name: payload.name }, 'BatchService');
    return this.http.post<Batch>(`${this.baseUrl}/`, payload);
  }

  /**
   * Actualiza los datos de un lote o caja
   */
  updateBatch(id: string, payload: BatchUpdatePayload): Observable<Batch> {
    this.logger.info('Updating batch', { id, payload }, 'BatchService');
    return this.http.put<Batch>(`${this.baseUrl}/${id}`, payload);
  }

  /**
   * Elimina un lote o caja
   */
  deleteBatch(id: string): Observable<{ message: string }> {
    this.logger.info('Deleting batch', { id }, 'BatchService');
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }

  /**
   * Recalcula automáticamente existencias y costo unitario desde los productos físicos asociados
   */
  recalculateBatch(id: string, revalueSales = true, forceProductCounts = false): Observable<Batch> {
    this.logger.info('Recalculating batch from products', { id, revalueSales, forceProductCounts }, 'BatchService');
    const params = new HttpParams()
      .set('revalue_sales', revalueSales.toString())
      .set('force_product_counts', forceProductCounts.toString());
    return this.http.post<Batch>(`${this.baseUrl}/${id}/recalculate`, {}, { params });
  }

  /**
   * Distribuye el costo relativo de la caja entre los productos según ponderación
   */
  allocateRelativeCosts(id: string, basis = 'official_price', revalueSales = true): Observable<Batch> {
    this.logger.info('Allocating relative costs', { id, basis, revalueSales }, 'BatchService');
    const params = new HttpParams()
      .set('basis', basis)
      .set('revalue_sales', revalueSales.toString());
    return this.http.post<Batch>(`${this.baseUrl}/${id}/allocate-relative-costs`, {}, { params });
  }

  /**
   * Obtiene los catálogos de soporte para lotes y cajas
   */
  getBatchCatalogs(): Observable<BatchCatalogs> {
    this.logger.debug('Fetching bulk commerce catalogs for batches', null, 'BatchService');

    const staticStatuses = [
      { value: 'active', label: 'Activo' },
      { value: 'liquidated', label: 'Liquidado' },
      { value: 'archived', label: 'Archivado' }
    ];

    const staticFinancialStatuses = [
      { value: 'EN_RECUPERACION', label: 'En Recuperación' },
      { value: 'RECUPERADO', label: 'Recuperado / Ganancia' }
    ];

    return this.catalogService
      .getBulkCatalogs({
        commerce_investment_rounds: {}
      })
      .pipe(
        map(res => ({
          investmentRounds: res['commerce_investment_rounds'] || [],
          statuses: staticStatuses,
          financialStatuses: staticFinancialStatuses
        })),
        catchError(err => {
          this.logger.error('Error fetching bulk catalogs for batches', err, 'BatchService');
          return of({
            investmentRounds: [],
            statuses: staticStatuses,
            financialStatuses: staticFinancialStatuses
          });
        })
      );
  }
}
