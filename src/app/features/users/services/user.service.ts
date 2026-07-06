import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { forkJoin, map, Observable } from 'rxjs';

import { ConfigService } from '@core/config/config.service';
import { LoggerService } from '@core/services/logger.service';

import { User, UserParams } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly configService = inject(ConfigService);
  private readonly logger = inject(LoggerService);

  private readonly baseUrl = `${this.configService.apiUrl}/core/users/`;

  /**
   * Builds HttpParams from UserParams
   */
  private buildHttpParams(params: UserParams): HttpParams {
    let httpParams = new HttpParams();

    if (params.offset !== undefined) httpParams = httpParams.set('offset', params.offset.toString());
    if (params.limit !== undefined) httpParams = httpParams.set('limit', params.limit.toString());
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.sort_by) httpParams = httpParams.set('sort_by', params.sort_by);
    if (params.sort_order) httpParams = httpParams.set('sort_order', params.sort_order);
    if (params.is_active !== undefined) httpParams = httpParams.set('is_active', params.is_active.toString());
    if (params.is_verified !== undefined) httpParams = httpParams.set('is_verified', params.is_verified.toString());
    if (params.is_superuser !== undefined) httpParams = httpParams.set('is_superuser', params.is_superuser.toString());

    return httpParams;
  }

  /**
   * Fetches a paginated list of user members.
   */
  getUser(params: UserParams): Observable<User[]> {
    const httpParams = this.buildHttpParams(params);
    
    this.logger.debug('Fetching user list', { params }, 'UserService');
    return this.http.get<User[]>(this.baseUrl, { params: httpParams });
  }

  /**
   * Fetches the total count of user members matching the filters.
   */
  getUserCount(params: UserParams): Observable<number> {
    const httpParams = this.buildHttpParams(params);

    this.logger.debug('Fetching user count', { params }, 'UserService');
    return this.http.get<{ total: number }>(`${this.baseUrl}count`, { params: httpParams }).pipe(
      map(response => response.total)
    );
  }

  /**
   * Orchestrates loading both data and total count in parallel.
   */
  loadUserPage(params: UserParams): Observable<{ data: User[], total: number }> {
    return forkJoin({
      data: this.getUser(params),
      total: this.getUserCount(params)
    }).pipe(
      map(result => {
        this.logger.info('User page loaded', { count: result.data.length, total: result.total }, 'UserService');
        return result;
      })
    );
  }
}
