import { inject, Injectable } from '@angular/core';

import { LoggerService } from '@core/services/logger.service';

import { BatchParams } from '../models/batch.model';

export interface BatchFilterState {
  selectedStatus: string | null;
  selectedFinancialStatus: string | null;
  selectedRound: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class BatchFilterService {
  private readonly logger = inject(LoggerService);

  /**
   * Construye el payload BatchParams para BatchService basado en el estado de filtros y búsqueda
   */
  buildParams(
    filterState: BatchFilterState,
    search: string,
    offset: number,
    limit: number,
    sortField?: string,
    sortOrder?: number
  ): BatchParams {
    this.logger.debug(
      'Building batch params from filter state',
      { filterState, search },
      'BatchFilterService'
    );

    // Si hay un filtro rápido de estado seleccionado y no hay búsqueda explícita, podemos aprovechar el search
    let effectiveSearch = search ? search.trim() : '';
    if (!effectiveSearch) {
      if (filterState.selectedFinancialStatus) {
        effectiveSearch = filterState.selectedFinancialStatus;
      } else if (filterState.selectedStatus) {
        effectiveSearch = filterState.selectedStatus;
      }
    }

    return {
      offset,
      limit,
      search: effectiveSearch || undefined,
      sort_by: sortField ? sortField.toString() : undefined,
      sort_order: sortField ? (sortOrder === 1 ? 'asc' : 'desc') : undefined
    };
  }
}

