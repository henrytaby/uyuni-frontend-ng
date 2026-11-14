import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { forkJoin, map, Observable } from 'rxjs';

import { ConfigService } from '@core/config/config.service';
import { LoggerService } from '@core/services/logger.service';

import {
  CommerceRound,
  RoundCreatePayload,
  RoundQueryParams,
  RoundUpdatePayload
} from '../models/round.model';

@Injectable({
  providedIn: 'root'
})
export class RoundService {
  private readonly http = inject(HttpClient);
  private readonly configService = inject(ConfigService);
  private readonly logger = inject(LoggerService);

  private get baseRoundsUrl(): string {
    return `${this.configService.apiUrl}/commerce/rounds`;
  }

  private buildHttpParams(params: RoundQueryParams): HttpParams {
    let httpParams = new HttpParams();
    if (params.offset !== undefined) httpParams = httpParams.set('offset', params.offset.toString());
    if (params.limit !== undefined) httpParams = httpParams.set('limit', params.limit.toString());
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.sort_by) httpParams = httpParams.set('sort_by', params.sort_by);
    if (params.sort_order) httpParams = httpParams.set('sort_order', params.sort_order);
    return httpParams;
  }

  getRounds(params: RoundQueryParams = {}): Observable<CommerceRound[]> {
    const httpParams = this.buildHttpParams(params);
    this.logger.debug('Fetching investment rounds', { params }, 'RoundService');
    return this.http.get<CommerceRound[]>(`${this.baseRoundsUrl}/`, { params: httpParams });
  }

  getRoundsCount(search?: string): Observable<number> {
    let httpParams = new HttpParams();
    if (search) httpParams = httpParams.set('search', search);
    return this.http.get<{ total: number }>(`${this.baseRoundsUrl}/count`, { params: httpParams }).pipe(
      map(res => res.total)
    );
  }

  loadRoundsPage(params: RoundQueryParams = {}): Observable<{ data: CommerceRound[]; total: number }> {
    return forkJoin({
      data: this.getRounds(params),
      total: this.getRoundsCount(params.search)
    });
  }

  createRound(payload: RoundCreatePayload): Observable<CommerceRound> {
    this.logger.info('Creating investment round', { code: payload.code, name: payload.name }, 'RoundService');
    return this.http.post<CommerceRound>(`${this.baseRoundsUrl}/`, payload);
  }

  updateRound(id: string, payload: RoundUpdatePayload): Observable<CommerceRound> {
    this.logger.info('Updating investment round', { id, payload }, 'RoundService');
    return this.http.put<CommerceRound>(`${this.baseRoundsUrl}/${id}`, payload);
  }

  deleteRound(id: string): Observable<{ message: string }> {
    this.logger.info('Deleting investment round', { id }, 'RoundService');
    return this.http.delete<{ message: string }>(`${this.baseRoundsUrl}/${id}`);
  }

  recalculateRound(id: string): Observable<CommerceRound> {
    this.logger.info('Recalculating round metrics', { id }, 'RoundService');
    return this.http.post<CommerceRound>(`${this.baseRoundsUrl}/${id}/recalculate`, {});
  }
}
