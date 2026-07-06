import { inject, Injectable } from '@angular/core';

import { LoggerService } from '@core/services/logger.service';

import { UserParams } from '../models/user.model';

export interface UserFilterState {
  selectedActivo: boolean | null;
  selectedSuperuser: boolean | null;
  selectedVerified: boolean | null;
}

@Injectable({
  providedIn: 'root'
})
export class UserFilterService {
  private readonly logger = inject(LoggerService);

  /**
   * Construye el payload para UserService basado en el estado de filtros
   */
  buildUserParams(
    filterState: UserFilterState,
    search: string,
    offset: number,
    limit: number,
    sortField?: string,
    sortOrder?: number
  ): UserParams {
    this.logger.debug('Building user params from filter state', { filterState, search }, 'UserFilterService');
    
    return {
      offset,
      limit,
      search: search || undefined,
      sort_by: sortField ? sortField.toString() : undefined,
      sort_order: sortField ? (sortOrder === 1 ? 'asc' : 'desc') : undefined,
      is_active: filterState.selectedActivo !== null ? filterState.selectedActivo! : undefined,
      is_verified: filterState.selectedVerified !== null ? filterState.selectedVerified! : undefined,
      is_superuser: filterState.selectedSuperuser !== null ? filterState.selectedSuperuser! : undefined
    };
  }
}