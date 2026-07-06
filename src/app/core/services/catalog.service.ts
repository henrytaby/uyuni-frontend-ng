import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ConfigService } from '@core/config/config.service';
import { LoggerService } from '@core/services/logger.service';

import { CatalogBulkRequest, CatalogBulkResponse } from '../models/catalog.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private readonly http = inject(HttpClient);
  private readonly configService = inject(ConfigService);
  private readonly logger = inject(LoggerService);

  private readonly baseUrl = `${this.configService.apiUrl}/catalogs/bulk`;

  /**
   * Obtiene múltiples catálogos en una sola llamada batch.
   * @param request Payload con los catálogos solicitados
   */
  getBulkCatalogs(request: CatalogBulkRequest): Observable<CatalogBulkResponse> {
    this.logger.debug('Fetching bulk catalogs', { request }, 'CatalogService');
    return this.http.post<CatalogBulkResponse>(this.baseUrl, request);
  }
}
