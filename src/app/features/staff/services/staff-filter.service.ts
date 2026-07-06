import { inject, Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { CatalogItem } from '@core/models/catalog.model';
import { CatalogService } from '@core/services/catalog.service';
import { LoggerService } from '@core/services/logger.service';

import { StaffParams } from '../models/staff.model';

export interface StaffFilterState {
  gerencias: CatalogItem[];
  departamentos: CatalogItem[];
  selectedGerencia: string | null;
  selectedDepartamento: string | null;
  selectedActivo: boolean | null;
}

@Injectable({
  providedIn: 'root'
})
export class StaffFilterService {
  private readonly catalogService = inject(CatalogService);
  private readonly logger = inject(LoggerService);

  /**
   * Carga las gerencias disponibles desde el catálogo
   */
  loadGerencias(): Observable<CatalogItem[]> {
    this.logger.debug('Loading gerencias', {}, 'StaffFilterService');
    
    return this.catalogService.getBulkCatalogs({ gerencias: {} }).pipe(
      map((res) => res['gerencias'] || []),
      tap((gerencias) => {
        this.logger.debug('Gerencias loaded', { count: gerencias.length }, 'StaffFilterService');
      })
    );
  }

  /**
   * Carga los departamentos asociados a una gerencia específica
   * @param gerenciaId ID de la gerencia para filtrar departamentos
   */
  loadDepartamentos(gerenciaId: string | null): Observable<CatalogItem[]> {
    this.logger.debug('Loading departamentos', { gerenciaId }, 'StaffFilterService');
    
    if (!gerenciaId) {
      return of([]);
    }

    return this.catalogService.getBulkCatalogs({
      departamentos: {
        gerencia_id: gerenciaId
      }
    }).pipe(
      map((res) => res['departamentos'] || []),
      tap((departamentos) => {
        this.logger.debug('Departamentos loaded', { count: departamentos.length }, 'StaffFilterService');
      })
    );
  }

  /**
   * Resetea el estado de filtros de departamentos al cambiar de gerencia
   */
  resetDepartmentFilters(): StaffFilterState {
    return {
      gerencias: [],
      departamentos: [],
      selectedGerencia: null,
      selectedDepartamento: null,
      selectedActivo: null
    };
  }

  /**
   * Construye el payload para StaffService basado en el estado de filtros
   */
  buildStaffParams(
    filterState: StaffFilterState,
    search: string,
    offset: number,
    limit: number,
    sortField?: string,
    sortOrder?: number
  ): StaffParams {
    return {
      offset,
      limit,
      search: search || undefined,
      sort_by: sortField ? sortField.toString() : undefined,
      sort_order: sortField ? (sortOrder === 1 ? 'asc' : 'desc') : undefined,
      org_unit_id: filterState.selectedDepartamento || filterState.selectedGerencia || undefined,
      is_active: filterState.selectedActivo !== null ? filterState.selectedActivo! : undefined
    };
  }
}