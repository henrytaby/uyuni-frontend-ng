import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { forkJoin, map, Observable } from 'rxjs';

import { ConfigService } from '@core/config/config.service';
import { LoggerService } from '@core/services/logger.service';

import {
  RoleCatalogItem,
  User,
  UserCreatePayload,
  UserLoginLog,
  UserParams,
  UserUpdatePayload
} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly configService = inject(ConfigService);
  private readonly logger = inject(LoggerService);

  private get baseUrl(): string {
    return `${this.configService.apiUrl}/core/users`;
  }

  private get catalogUrl(): string {
    return `${this.configService.apiUrl}/catalogs`;
  }

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
    return this.http.get<User[]>(`${this.baseUrl}/`, { params: httpParams });
  }

  /**
   * Fetches the total count of user members matching the filters.
   */
  getUserCount(params: UserParams): Observable<number> {
    const httpParams = this.buildHttpParams(params);
    this.logger.debug('Fetching user count', { params }, 'UserService');
    return this.http.get<{ total: number }>(`${this.baseUrl}/count`, { params: httpParams }).pipe(
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

  /**
   * Fetches a single user by ID with detailed roles.
   */
  getUserById(id: string): Observable<User> {
    this.logger.debug('Fetching user by ID', { id }, 'UserService');
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  /**
   * Creates a new user with optional role_slugs.
   */
  createUser(payload: UserCreatePayload): Observable<User> {
    this.logger.info('Creating user', { username: payload.username, email: payload.email }, 'UserService');
    return this.http.post<User>(`${this.baseUrl}/`, payload);
  }

  /**
   * Updates an existing user and syncs roles if role_slugs provided.
   */
  updateUser(id: string, payload: UserUpdatePayload): Observable<User> {
    this.logger.info('Updating user', { id, payload }, 'UserService');
    return this.http.patch<User>(`${this.baseUrl}/${id}`, payload);
  }

  /**
   * Deletes a user by ID.
   */
  deleteUser(id: string): Observable<{ ok: boolean }> {
    this.logger.info('Deleting user', { id }, 'UserService');
    return this.http.delete<{ ok: boolean }>(`${this.baseUrl}/${id}`);
  }

  /**
   * Fetches login history logs for a user.
   */
  getLoginHistory(
    userId: string,
    offset = 0,
    limit = 10,
    isSuccessful?: boolean
  ): Observable<UserLoginLog[]> {
    let params = new HttpParams()
      .set('offset', offset.toString())
      .set('limit', limit.toString());
    if (isSuccessful !== undefined) {
      params = params.set('is_successful', isSuccessful.toString());
    }
    this.logger.debug('Fetching user login history', { userId, offset, limit }, 'UserService');
    return this.http.get<UserLoginLog[]>(`${this.baseUrl}/${userId}/logins`, { params });
  }

  /**
   * Counts total login logs for a user.
   */
  countLoginHistory(userId: string, isSuccessful?: boolean): Observable<number> {
    let params = new HttpParams();
    if (isSuccessful !== undefined) {
      params = params.set('is_successful', isSuccessful.toString());
    }
    return this.http.get<{ total: number }>(`${this.baseUrl}/${userId}/logins/count`, { params }).pipe(
      map(res => res.total)
    );
  }

  /**
   * Fetches roles catalog for multi-select.
   */
  getRolesCatalog(): Observable<RoleCatalogItem[]> {
    this.logger.debug('Fetching roles catalog', null, 'UserService');
    return this.http.get<RoleCatalogItem[]>(`${this.catalogUrl}/roles`);
  }
}
