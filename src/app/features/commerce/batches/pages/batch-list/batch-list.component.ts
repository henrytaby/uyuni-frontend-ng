import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

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
import {
  LucideBoxes,
  LucideSearch
} from '@lucide/angular';

import { CatalogItem } from '@core/models/catalog.model';
import { LoggerService } from '@core/services/logger.service';

import { BatchDrawerComponent } from '../../components/batch-drawer/batch-drawer.component';
import { Batch } from '../../models/batch.model';
import { BatchService } from '../../services/batch.service';
import { BatchFilterService, BatchFilterState } from '../../services/batch-filter.service';

@Component({
  selector: 'app-batch-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    Tag,
    Button,
    InputText,
    IconField,
    InputIcon,
    Tooltip,
    Select,
    LucideBoxes,
    LucideSearch,
    BatchDrawerComponent
  ],
  templateUrl: './batch-list.component.html',
  styleUrls: ['./batch-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BatchListComponent implements OnInit {
  private readonly batchService = inject(BatchService);
  private readonly filterService = inject(BatchFilterService);
  private readonly logger = inject(LoggerService);

  // State Signals
  readonly batchList = signal<Batch[]>([]);
  readonly totalRecords = signal<number>(0);
  readonly isLoading = signal<boolean>(false);
  readonly first = signal<number>(0);
  readonly rows = signal<number>(15);

  // Search Debouncing
  private readonly searchSubject = new Subject<string>();
  readonly searchValue = signal<string>('');

  // Catalogs
  readonly investmentRounds = signal<CatalogItem[]>([]);
  readonly statuses = signal<CatalogItem[]>([]);
  readonly financialStatuses = signal<CatalogItem[]>([]);

  // Filters
  readonly selectedStatus = signal<string | null>(null);
  readonly selectedFinancialStatus = signal<string | null>(null);

  // Drawer
  readonly drawerVisible = signal<boolean>(false);
  readonly selectedBatch = signal<Batch | null>(null);
  readonly drawerMode = signal<'create' | 'edit'>('create');

  // Mappings
  readonly statusesMap = computed(() => {
    return new Map(this.statuses().map(s => [String(s.value), s.label]));
  });

  readonly financialStatusesMap = computed(() => {
    return new Map(this.financialStatuses().map(f => [String(f.value), f.label]));
  });

  // Track current sort
  private currentSortField: string | undefined = undefined;
  private currentSortOrder: number | undefined = undefined;

  constructor() {
    this.searchSubject
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntilDestroyed()
      )
      .subscribe(term => {
        this.first.set(0);
        this.fetchData(term);
      });
  }

  ngOnInit(): void {
    this.loadCatalogs();
  }

  private loadCatalogs(): void {
    this.batchService.getBatchCatalogs().subscribe({
      next: catalogs => {
        this.investmentRounds.set(catalogs.investmentRounds);
        this.statuses.set(catalogs.statuses);
        this.financialStatuses.set(catalogs.financialStatuses);
      },
      error: err => {
        this.logger.error('Error loading batch catalogs', err, 'BatchListComponent');
      }
    });
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    this.first.set(event.first ?? 0);
    this.rows.set(event.rows ?? 15);
    const field = Array.isArray(event.sortField) ? event.sortField[0] : event.sortField;
    this.currentSortField = field ?? undefined;
    this.currentSortOrder = event.sortOrder ?? undefined;

    this.fetchData(this.searchValue());
  }

  onSearchChange(term: string): void {
    this.searchValue.set(term);
    this.searchSubject.next(term);
  }

  onFilterChange(): void {
    this.first.set(0);
    this.fetchData(this.searchValue());
  }

  clearFilters(): void {
    this.searchValue.set('');
    this.selectedStatus.set(null);
    this.selectedFinancialStatus.set(null);
    this.first.set(0);
    this.fetchData('');
  }

  fetchData(search = ''): void {
    this.isLoading.set(true);

    const filterState: BatchFilterState = {
      selectedStatus: this.selectedStatus(),
      selectedFinancialStatus: this.selectedFinancialStatus(),
      selectedRound: null
    };

    const params = this.filterService.buildParams(
      filterState,
      search,
      this.first(),
      this.rows(),
      this.currentSortField,
      this.currentSortOrder
    );

    this.batchService.loadBatchPage(params).subscribe({
      next: result => {
        this.batchList.set(result.data);
        this.totalRecords.set(result.total);
        this.isLoading.set(false);
      },
      error: err => {
        this.logger.error('Error fetching batches page', err, 'BatchListComponent');
        this.isLoading.set(false);
      }
    });
  }

  openCreate(): void {
    this.selectedBatch.set(null);
    this.drawerMode.set('create');
    this.drawerVisible.set(true);
  }

  openEdit(batch: Batch): void {
    this.selectedBatch.set(batch);
    this.drawerMode.set('edit');
    this.drawerVisible.set(true);
  }

  onBatchSaved(batch: Batch): void {
    this.logger.info('Batch saved successfully', { id: batch.id, code: batch.code }, 'BatchListComponent');
    this.fetchData(this.searchValue());
  }

  onBatchDeleted(id: string): void {
    this.logger.info('Batch deleted successfully', { id }, 'BatchListComponent');
    this.fetchData(this.searchValue());
  }

  onBatchRecalculated(batch: Batch): void {
    this.logger.info('Batch recalculated successfully', { id: batch.id, code: batch.code }, 'BatchListComponent');
    this.fetchData(this.searchValue());
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (status) {
      case 'active':
        return 'info';
      case 'liquidated':
        return 'success';
      case 'archived':
        return 'secondary';
      default:
        return 'secondary';
    }
  }

  getFinancialStatusSeverity(status: string): 'success' | 'warn' | 'info' | 'danger' | 'secondary' {
    switch (status) {
      case 'RECUPERADO':
        return 'success';
      case 'EN_RECUPERACION':
        return 'warn';
      default:
        return 'info';
    }
  }
}
