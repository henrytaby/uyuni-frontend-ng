import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { forkJoin, map, Observable } from 'rxjs';

import { ConfigService } from '@core/config/config.service';
import { LoggerService } from '@core/services/logger.service';

import { Staff, StaffParams } from '../models/staff.model';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  private readonly http = inject(HttpClient);
  private readonly configService = inject(ConfigService);
  private readonly logger = inject(LoggerService);

  private readonly baseUrl = `${this.configService.apiUrl}/core/staff/`;

  /**
   * Builds HttpParams from StaffParams
   */
  private buildHttpParams(params: StaffParams): HttpParams {
    let httpParams = new HttpParams();

    if (params.offset !== undefined) httpParams = httpParams.set('offset', params.offset.toString());
    if (params.limit !== undefined) httpParams = httpParams.set('limit', params.limit.toString());
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.sort_by) httpParams = httpParams.set('sort_by', params.sort_by);
    if (params.sort_order) httpParams = httpParams.set('sort_order', params.sort_order);
    if (params.is_active !== undefined) httpParams = httpParams.set('is_active', params.is_active.toString());
    if (params.org_unit_id !== undefined) httpParams = httpParams.set('org_unit_id', params.org_unit_id);

    return httpParams;
  }

  /**
   * Fetches a paginated list of staff members.
   */
  getStaff(params: StaffParams): Observable<Staff[]> {
    const httpParams = this.buildHttpParams(params);
    
    this.logger.debug('Fetching staff list', { params }, 'StaffService');
    return this.http.get<Staff[]>(this.baseUrl, { params: httpParams });
  }

  /**
   * Fetches the total count of staff members matching the filters.
   */
  getStaffCount(params: StaffParams): Observable<number> {
    const httpParams = this.buildHttpParams(params);

    this.logger.debug('Fetching staff count', { params }, 'StaffService');
    return this.http.get<{ total: number }>(`${this.baseUrl}count`, { params: httpParams }).pipe(
      map(response => response.total)
    );
  }

  /**
   * Orchestrates loading both data and total count in parallel.
   */
  loadStaffPage(params: StaffParams): Observable<{ data: Staff[], total: number }> {
    return forkJoin({
      data: this.getStaff(params),
      total: this.getStaffCount(params)
    }).pipe(
      map(result => {
        this.logger.info('Staff page loaded', { count: result.data.length, total: result.total }, 'StaffService');
        return result;
      })
    );
  }
}
