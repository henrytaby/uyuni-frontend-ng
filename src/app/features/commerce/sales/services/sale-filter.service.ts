import { inject, Injectable } from '@angular/core';

import { LoggerService } from '@core/services/logger.service';

import { SaleParams } from '../models/sale.model';

export interface SaleFilterState {
  selectedChannel: string | null;
  selectedPaymentStatus: string | null;
  selectedDeliveryStatus: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class SaleFilterService {
  private readonly logger = inject(LoggerService);

  /**
   * Construye el payload SaleParams para SaleService basado en el estado de filtros y ordenamiento
   */
  buildParams(
    filterState: SaleFilterState,
    search: string,
    offset: number,
    limit: number,
    sortField?: string,
    sortOrder?: number
  ): SaleParams {
    this.logger.debug(
      'Building sale params from filter state',
      { filterState, search },
      'SaleFilterService'
    );

    return {
      offset,
      limit,
      search: search ? search.trim() : undefined,
      sort_by: sortField ? sortField.toString() : undefined,
      sort_order: sortField ? (sortOrder === 1 ? 'asc' : 'desc') : undefined,
      channel: filterState.selectedChannel || undefined,
      payment_status: filterState.selectedPaymentStatus || undefined,
      delivery_status: filterState.selectedDeliveryStatus || undefined
    };
  }
}
