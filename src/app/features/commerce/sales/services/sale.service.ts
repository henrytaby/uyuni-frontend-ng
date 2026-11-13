import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { forkJoin, map, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from '@core/config/config.service';
import { CatalogService } from '@core/services/catalog.service';
import { LoggerService } from '@core/services/logger.service';

import {
  Sale,
  SaleCatalogs,
  SaleCreatePayload,
  SaleParams,
  SaleUpdatePayload
} from '../models/sale.model';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private readonly http = inject(HttpClient);
  private readonly configService = inject(ConfigService);
  private readonly catalogService = inject(CatalogService);
  private readonly logger = inject(LoggerService);

  private get baseUrl(): string {
    return `${this.configService.apiUrl}/commerce/sales`;
  }

  /**
   * Construye HttpParams a partir de SaleParams para el listado de ventas
   */
  private buildHttpParams(params: SaleParams): HttpParams {
    let httpParams = new HttpParams();

    if (params.offset !== undefined) httpParams = httpParams.set('offset', params.offset.toString());
    if (params.limit !== undefined) httpParams = httpParams.set('limit', params.limit.toString());
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.sort_by) httpParams = httpParams.set('sort_by', params.sort_by);
    if (params.sort_order) httpParams = httpParams.set('sort_order', params.sort_order);
    if (params.channel) httpParams = httpParams.set('channel', params.channel);
    if (params.payment_status) httpParams = httpParams.set('payment_status', params.payment_status);
    if (params.delivery_status) httpParams = httpParams.set('delivery_status', params.delivery_status);

    return httpParams;
  }

  /**
   * Obtiene la lista paginada de ventas
   */
  getSales(params: SaleParams): Observable<Sale[]> {
    const httpParams = this.buildHttpParams(params);
    this.logger.debug('Fetching sales list', { params }, 'SaleService');
    return this.http.get<Sale[]>(`${this.baseUrl}/`, { params: httpParams });
  }

  /**
   * Obtiene el conteo total de ventas que coinciden con los filtros aplicados
   */
  getSalesCount(params: SaleParams): Observable<number> {
    let httpParams = new HttpParams();
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.channel) httpParams = httpParams.set('channel', params.channel);
    if (params.payment_status) httpParams = httpParams.set('payment_status', params.payment_status);
    if (params.delivery_status) httpParams = httpParams.set('delivery_status', params.delivery_status);

    this.logger.debug('Fetching sales count', { params }, 'SaleService');
    return this.http.get<{ total: number }>(`${this.baseUrl}/count`, { params: httpParams }).pipe(
      map(response => response.total)
    );
  }

  /**
   * Carga en paralelo la lista de ventas y el conteo total para la tabla lazy
   */
  loadSalePage(params: SaleParams): Observable<{ data: Sale[]; total: number }> {
    return forkJoin({
      data: this.getSales(params),
      total: this.getSalesCount(params)
    }).pipe(
      map(result => {
        this.logger.info(
          'Sales page loaded',
          { count: result.data.length, total: result.total },
          'SaleService'
        );
        return result;
      })
    );
  }

  /**
   * Obtiene una venta detallada por su ID único (incluyendo ítems vendidos y costos)
   */
  getSaleById(id: string): Observable<Sale> {
    this.logger.debug('Fetching sale by ID', { id }, 'SaleService');
    return this.http.get<Sale>(`${this.baseUrl}/${id}`);
  }

  /**
   * Registra una nueva transacción de venta
   */
  createSale(payload: SaleCreatePayload): Observable<Sale> {
    this.logger.info('Creating sale', { customer_name: payload.customer_name, itemsCount: payload.items.length }, 'SaleService');
    return this.http.post<Sale>(`${this.baseUrl}/`, payload);
  }

  /**
   * Actualiza los datos de logística o contacto de una venta existente
   */
  updateSale(id: string, payload: SaleUpdatePayload): Observable<Sale> {
    this.logger.info('Updating sale', { id, payload }, 'SaleService');
    return this.http.put<Sale>(`${this.baseUrl}/${id}`, payload);
  }

  /**
   * Elimina una venta registrada
   */
  deleteSale(id: string): Observable<{ message: string }> {
    this.logger.info('Deleting sale', { id }, 'SaleService');
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }

  /**
   * Obtiene los catálogos requeridos para registrar y filtrar ventas en una sola petición bulk
   */
  getSaleCatalogs(): Observable<SaleCatalogs> {
    this.logger.debug('Fetching bulk commerce catalogs for sales', null, 'SaleService');

    return this.catalogService
      .getBulkCatalogs({
        commerce_sales_channels: {},
        commerce_payment_statuses: {},
        commerce_payment_methods: {},
        commerce_delivery_modalities: {},
        commerce_delivery_paid_by: {},
        commerce_delivery_statuses: {}
      })
      .pipe(
        map(res => ({
          salesChannels: res['commerce_sales_channels'] || [],
          paymentStatuses: res['commerce_payment_statuses'] || [],
          paymentMethods: res['commerce_payment_methods'] || [],
          deliveryModalities: res['commerce_delivery_modalities'] || [],
          deliveryPaidBy: res['commerce_delivery_paid_by'] || [],
          deliveryStatuses: res['commerce_delivery_statuses'] || []
        })),
        catchError(err => {
          this.logger.error('Error fetching bulk catalogs for sales', err, 'SaleService');
          return of({
            salesChannels: [],
            paymentStatuses: [],
            paymentMethods: [],
            deliveryModalities: [],
            deliveryPaidBy: [],
            deliveryStatuses: []
          });
        })
      );
  }
}
