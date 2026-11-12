import { inject, Injectable } from '@angular/core';

import { LoggerService } from '@core/services/logger.service';

import { ProductMasterParams } from '../models/product-master.model';

export interface ProductMasterFilterState {
  selectedCategory: string | null;
  selectedLiveBasket: string | null;
  selectedActivo: boolean | null;
}

@Injectable({
  providedIn: 'root'
})
export class ProductMasterFilterService {
  private readonly logger = inject(LoggerService);

  /**
   * Construye el payload para ProductMasterService basado en el estado de filtros
   */
  buildParams(
    filterState: ProductMasterFilterState,
    search: string,
    offset: number,
    limit: number,
    sortField?: string,
    sortOrder?: number
  ): ProductMasterParams {
    this.logger.debug(
      'Building product master params from filter state',
      { filterState, search },
      'ProductMasterFilterService'
    );

    return {
      offset,
      limit,
      search: search ? search.trim() : undefined,
      sort_by: sortField ? sortField.toString() : undefined,
      sort_order: sortField ? (sortOrder === 1 ? 'asc' : 'desc') : undefined,
      category_id: filterState.selectedCategory || undefined,
      live_basket_id: filterState.selectedLiveBasket || undefined,
      is_active: filterState.selectedActivo !== null ? filterState.selectedActivo : undefined
    };
  }
}

