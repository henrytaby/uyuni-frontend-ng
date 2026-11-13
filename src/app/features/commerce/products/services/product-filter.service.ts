import { inject, Injectable } from '@angular/core';

import { LoggerService } from '@core/services/logger.service';

import { ProductParams } from '../models/product.model';

export interface ProductFilterState {
  selectedBatch: string | null;
  selectedMasterProduct: string | null;
  selectedStatus: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ProductFilterService {
  private readonly logger = inject(LoggerService);

  /**
   * Construye el payload ProductParams para ProductService basado en el estado de filtros
   */
  buildParams(
    filterState: ProductFilterState,
    search: string,
    offset: number,
    limit: number,
    sortField?: string,
    sortOrder?: number
  ): ProductParams {
    this.logger.debug(
      'Building product params from filter state',
      { filterState, search },
      'ProductFilterService'
    );

    return {
      offset,
      limit,
      search: search ? search.trim() : undefined,
      sort_by: sortField ? sortField.toString() : undefined,
      sort_order: sortField ? (sortOrder === 1 ? 'asc' : 'desc') : undefined,
      batch_id: filterState.selectedBatch || undefined,
      master_product_id: filterState.selectedMasterProduct || undefined,
      status: filterState.selectedStatus || undefined
    };
  }
}

