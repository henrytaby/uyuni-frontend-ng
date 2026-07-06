import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { Avatar } from 'primeng/avatar';
import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { LucideCalendar,LucideMail, LucidePhone } from '@lucide/angular';

import { CatalogItem } from '@core/models/catalog.model';
import { LoggerService } from '@core/services/logger.service';

import { Staff } from '../../models/staff.model';
import { StaffService } from '../../services/staff.service';
import { StaffFilterService, StaffFilterState } from '../../services/staff-filter.service';

@Component({
  selector: 'app-staff-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    Tag,
    Avatar,
    Button,
    InputText,
    IconField,
    InputIcon,
    Tooltip,
    Select,
    LucidePhone,LucideMail,LucideCalendar
  ],
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StaffListComponent implements OnInit {
  private readonly staffService = inject(StaffService);
  private readonly filterService = inject(StaffFilterService);
  private readonly logger = inject(LoggerService);

  // State Signals
  staffList = signal<Staff[]>([]);
  totalRecords = signal<number>(0);
  isLoading = signal<boolean>(false);
  first = signal<number>(0);
  rows = signal<number>(15);
  
  // Search subject for debouncing
  private readonly searchSubject = new Subject<string>();
  searchValue = signal<string>('');

  // Catalog and filter signals
  gerencias = signal<CatalogItem[]>([]);
  departamentos = signal<CatalogItem[]>([]);
  selectedGerencia = signal<string | null>(null);
  selectedDepartamento = signal<string | null>(null);
  selectedActivo = signal<boolean | null>(null);

  readonly activoOptions: { label: string; value: boolean }[] = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false }
  ];

  constructor() {
    // Setup search debounce with automatic cleanup
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntilDestroyed()
    ).subscribe(value => {
      this.searchValue.set(value);
      this.first.set(0); // Reset to first page on search
      this.loadData({ first: 0, rows: this.rows() });
    });
  }

  ngOnInit(): void {
    this.loadGerencias();
  }

  loadGerencias(): void {
    this.filterService.loadGerencias().subscribe({
      next: (gerencias) => {
        this.gerencias.set(gerencias);
      },
      error: (err: Error) => {
        this.logger.error('Error loading gerencias', err, 'StaffListComponent');
      }
    });
  }

  onGerenciaChange(gerenciaId: string | null): void {
    this.selectedGerencia.set(gerenciaId);
    
    if (gerenciaId) {
      this.filterService.loadDepartamentos(gerenciaId).subscribe({
        next: (departamentos) => {
          this.departamentos.set(departamentos);
          this.selectedDepartamento.set(null);
        },
        error: (err: Error) => {
          this.logger.error('Error loading departamentos', err, 'StaffListComponent');
        }
      });
    } else {
      this.departamentos.set([]);
      this.selectedDepartamento.set(null);
    }

    this.resetAndReload();
  }

  onDepartamentoChange(deptId: string | null): void {
    this.selectedDepartamento.set(deptId);
    this.resetAndReload();
  }

  onActivoChange(isActive: boolean | null): void {
    this.selectedActivo.set(isActive);
    this.resetAndReload();
  }

  clearFilters(): void {
    this.selectedGerencia.set(null);
    this.selectedDepartamento.set(null);
    this.selectedActivo.set(null);
    this.departamentos.set([]);
    this.resetAndReload();
  }

  /**
   * Reset pagination and reload data - eliminates DRY repetition
   */
  private resetAndReload(): void {
    this.first.set(0);
    this.loadData({ first: 0, rows: this.rows() });
  }

  /**
   * Main data loading method for PrimeNG Lazy Loading
   */
  loadData(event: TableLazyLoadEvent | { first: number, rows: number }): void {
    this.isLoading.set(true);
    
    // Update local state from event
    const newFirst = event.first ?? 0;
    const newRows = event.rows ?? 15;
    
    this.first.set(newFirst);
    this.rows.set(newRows);

    const filterState: StaffFilterState = {
      gerencias: this.gerencias(),
      departamentos: this.departamentos(),
      selectedGerencia: this.selectedGerencia(),
      selectedDepartamento: this.selectedDepartamento(),
      selectedActivo: this.selectedActivo()
    };

    let sortField: string | undefined;
    let sortOrder: number | undefined;

    if ('sortField' in event) {
      sortField = event.sortField?.toString();
      sortOrder = event.sortOrder ?? undefined;
    }

    const params = this.filterService.buildStaffParams(
      filterState,
      this.searchValue(),
      newFirst,
      newRows,
      sortField,
      sortOrder
    );

    this.staffService.loadStaffPage(params).subscribe({
      next: (result) => {
        this.staffList.set(result.data);
        this.totalRecords.set(result.total);
        this.isLoading.set(false);
      },
      error: (err: Error) => {
        this.logger.error('Error loading staff data', err, 'StaffListComponent');
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Handles search input changes
   */
  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  /**
   * Get initials for Avatar based on first_name and last_names
   */
  getInitials(staff: Staff): string {
    const firstInitial = staff.first_name?.charAt(0).toUpperCase() || '';
    let lastInitial = '';

    if (staff.last_name_1) {
      lastInitial = staff.last_name_1.charAt(0).toUpperCase();
    } else if (staff.last_name_2) {
      lastInitial = staff.last_name_2.charAt(0).toUpperCase();
    }

    // Fallback if individual fields are missing
    if (!firstInitial && !lastInitial && staff.full_name) {
      return staff.full_name
        .split(' ')
        .filter(part => part.length > 0)
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
    }

    return `${firstInitial}${lastInitial}`;
  }
}
