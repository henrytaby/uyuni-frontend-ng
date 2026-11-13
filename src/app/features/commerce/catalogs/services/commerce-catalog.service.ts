import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { forkJoin, map, Observable } from 'rxjs';

import { ConfigService } from '@core/config/config.service';
import { LoggerService } from '@core/services/logger.service';

import {
  CatalogQueryParams,
  CategoryCreatePayload,
  CategoryUpdatePayload,
  ChannelCreatePayload,
  ChannelUpdatePayload,
  CommerceCategory,
  CommerceChannel,
  CommerceLiveBasket,
  CommerceRound,
  LiveBasketCreatePayload,
  LiveBasketUpdatePayload,
  RoundCreatePayload,
  RoundUpdatePayload
} from '../models/commerce-catalog.model';

@Injectable({
  providedIn: 'root'
})
export class CommerceCatalogService {
  private readonly http = inject(HttpClient);
  private readonly configService = inject(ConfigService);
  private readonly logger = inject(LoggerService);

  private get baseCommerceUrl(): string {
    return `${this.configService.apiUrl}/commerce`;
  }

  private buildHttpParams(params: CatalogQueryParams): HttpParams {
    let httpParams = new HttpParams();
    if (params.offset !== undefined) httpParams = httpParams.set('offset', params.offset.toString());
    if (params.limit !== undefined) httpParams = httpParams.set('limit', params.limit.toString());
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.sort_by) httpParams = httpParams.set('sort_by', params.sort_by);
    if (params.sort_order) httpParams = httpParams.set('sort_order', params.sort_order);
    return httpParams;
  }

  // =========================================================================
  // 1. CATEGORÍAS DE PRODUCTO
  // =========================================================================

  getCategories(params: CatalogQueryParams): Observable<CommerceCategory[]> {
    const httpParams = this.buildHttpParams(params);
    this.logger.debug('Fetching categories', { params }, 'CommerceCatalogService');
    return this.http.get<CommerceCategory[]>(`${this.baseCommerceUrl}/categories/`, { params: httpParams });
  }

  getCategoriesCount(search?: string): Observable<number> {
    let httpParams = new HttpParams();
    if (search) httpParams = httpParams.set('search', search);
    return this.http.get<{ total: number }>(`${this.baseCommerceUrl}/categories/count`, { params: httpParams }).pipe(
      map(res => res.total)
    );
  }

  loadCategoriesPage(params: CatalogQueryParams): Observable<{ data: CommerceCategory[]; total: number }> {
    return forkJoin({
      data: this.getCategories(params),
      total: this.getCategoriesCount(params.search)
    });
  }

  createCategory(payload: CategoryCreatePayload): Observable<CommerceCategory> {
    this.logger.info('Creating category', { code: payload.code, name: payload.name }, 'CommerceCatalogService');
    return this.http.post<CommerceCategory>(`${this.baseCommerceUrl}/categories/`, payload);
  }

  updateCategory(id: string, payload: CategoryUpdatePayload): Observable<CommerceCategory> {
    this.logger.info('Updating category', { id, payload }, 'CommerceCatalogService');
    return this.http.put<CommerceCategory>(`${this.baseCommerceUrl}/categories/${id}`, payload);
  }

  deleteCategory(id: string): Observable<{ message: string }> {
    this.logger.info('Deleting category', { id }, 'CommerceCatalogService');
    return this.http.delete<{ message: string }>(`${this.baseCommerceUrl}/categories/${id}`);
  }

  // =========================================================================
  // 2. CANALES DE VENTA
  // =========================================================================

  getChannels(params: CatalogQueryParams): Observable<CommerceChannel[]> {
    const httpParams = this.buildHttpParams(params);
    this.logger.debug('Fetching sales channels', { params }, 'CommerceCatalogService');
    return this.http.get<CommerceChannel[]>(`${this.baseCommerceUrl}/channels/`, { params: httpParams });
  }

  getChannelsCount(search?: string): Observable<number> {
    let httpParams = new HttpParams();
    if (search) httpParams = httpParams.set('search', search);
    return this.http.get<{ total: number }>(`${this.baseCommerceUrl}/channels/count`, { params: httpParams }).pipe(
      map(res => res.total)
    );
  }

  loadChannelsPage(params: CatalogQueryParams): Observable<{ data: CommerceChannel[]; total: number }> {
    return forkJoin({
      data: this.getChannels(params),
      total: this.getChannelsCount(params.search)
    });
  }

  createChannel(payload: ChannelCreatePayload): Observable<CommerceChannel> {
    this.logger.info('Creating sales channel', { code: payload.code, name: payload.name }, 'CommerceCatalogService');
    return this.http.post<CommerceChannel>(`${this.baseCommerceUrl}/channels/`, payload);
  }

  updateChannel(id: string, payload: ChannelUpdatePayload): Observable<CommerceChannel> {
    this.logger.info('Updating sales channel', { id, payload }, 'CommerceCatalogService');
    return this.http.put<CommerceChannel>(`${this.baseCommerceUrl}/channels/${id}`, payload);
  }

  deleteChannel(id: string): Observable<{ message: string }> {
    this.logger.info('Deleting sales channel', { id }, 'CommerceCatalogService');
    return this.http.delete<{ message: string }>(`${this.baseCommerceUrl}/channels/${id}`);
  }

  // =========================================================================
  // 3. CANASTAS LIVE
  // =========================================================================

  getLiveBaskets(params: CatalogQueryParams): Observable<CommerceLiveBasket[]> {
    const httpParams = this.buildHttpParams(params);
    this.logger.debug('Fetching live baskets', { params }, 'CommerceCatalogService');
    return this.http.get<CommerceLiveBasket[]>(`${this.baseCommerceUrl}/live-baskets/`, { params: httpParams });
  }

  getLiveBasketsCount(search?: string): Observable<number> {
    let httpParams = new HttpParams();
    if (search) httpParams = httpParams.set('search', search);
    return this.http.get<{ total: number }>(`${this.baseCommerceUrl}/live-baskets/count`, { params: httpParams }).pipe(
      map(res => res.total)
    );
  }

  loadLiveBasketsPage(params: CatalogQueryParams): Observable<{ data: CommerceLiveBasket[]; total: number }> {
    return forkJoin({
      data: this.getLiveBaskets(params),
      total: this.getLiveBasketsCount(params.search)
    });
  }

  createLiveBasket(payload: LiveBasketCreatePayload): Observable<CommerceLiveBasket> {
    this.logger.info('Creating live basket', { code: payload.code, label: payload.label }, 'CommerceCatalogService');
    return this.http.post<CommerceLiveBasket>(`${this.baseCommerceUrl}/live-baskets/`, payload);
  }

  updateLiveBasket(id: string, payload: LiveBasketUpdatePayload): Observable<CommerceLiveBasket> {
    this.logger.info('Updating live basket', { id, payload }, 'CommerceCatalogService');
    return this.http.put<CommerceLiveBasket>(`${this.baseCommerceUrl}/live-baskets/${id}`, payload);
  }

  deleteLiveBasket(id: string): Observable<{ message: string }> {
    this.logger.info('Deleting live basket', { id }, 'CommerceCatalogService');
    return this.http.delete<{ message: string }>(`${this.baseCommerceUrl}/live-baskets/${id}`);
  }

  // =========================================================================
  // 4. RONDAS DE INVERSIÓN
  // =========================================================================

  getRounds(params: CatalogQueryParams): Observable<CommerceRound[]> {
    const httpParams = this.buildHttpParams(params);
    this.logger.debug('Fetching investment rounds', { params }, 'CommerceCatalogService');
    return this.http.get<CommerceRound[]>(`${this.baseCommerceUrl}/rounds/`, { params: httpParams });
  }

  getRoundsCount(search?: string): Observable<number> {
    let httpParams = new HttpParams();
    if (search) httpParams = httpParams.set('search', search);
    return this.http.get<{ total: number }>(`${this.baseCommerceUrl}/rounds/count`, { params: httpParams }).pipe(
      map(res => res.total)
    );
  }

  loadRoundsPage(params: CatalogQueryParams): Observable<{ data: CommerceRound[]; total: number }> {
    return forkJoin({
      data: this.getRounds(params),
      total: this.getRoundsCount(params.search)
    });
  }

  createRound(payload: RoundCreatePayload): Observable<CommerceRound> {
    this.logger.info('Creating investment round', { code: payload.code, name: payload.name }, 'CommerceCatalogService');
    return this.http.post<CommerceRound>(`${this.baseCommerceUrl}/rounds/`, payload);
  }

  updateRound(id: string, payload: RoundUpdatePayload): Observable<CommerceRound> {
    this.logger.info('Updating investment round', { id, payload }, 'CommerceCatalogService');
    return this.http.put<CommerceRound>(`${this.baseCommerceUrl}/rounds/${id}`, payload);
  }

  deleteRound(id: string): Observable<{ message: string }> {
    this.logger.info('Deleting investment round', { id }, 'CommerceCatalogService');
    return this.http.delete<{ message: string }>(`${this.baseCommerceUrl}/rounds/${id}`);
  }
}

