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
import { Paginator } from 'primeng/paginator';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  LucideBoxes,
  LucideCircleAlert,
  LucideCircleCheck,
  LucideLayoutGrid,
  LucideListFilter,
  LucideTable2,
  LucideTrendingUp,
  LucideX
} from '@lucide/angular';

import { CatalogItem } from '@core/models/catalog.model';
import { LoggerService } from '@core/services/logger.service';

import { CloudinaryUrlPipe } from '@shared/pipe/cloudinary-url.pipe';

import { ProductDrawerComponent } from '../../components/product-drawer/product-drawer.component';
import { ProductFilterDrawerComponent } from '../../components/product-filter-drawer/product-filter-drawer.component';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ProductFilterService, ProductFilterState } from '../../services/product-filter.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    Paginator,
    Tag,
    Button,
    InputText,
    IconField,
    InputIcon,
    Tooltip,
    LucideBoxes,
    LucideCircleAlert,
    LucideCircleCheck,
    LucideTrendingUp,
    LucideTable2,
    LucideLayoutGrid,
    LucideListFilter,
    LucideX,
    CloudinaryUrlPipe,
    ProductDrawerComponent,
    ProductFilterDrawerComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly filterService = inject(ProductFilterService);
  private readonly logger = inject(LoggerService);

  // View Mode: 'table' (ERP / Backoffice) vs 'cards' (Existencias / Tarjetas)
  readonly viewMode = signal<'table' | 'cards'>(
    (typeof localStorage !== 'undefined' &&
      (localStorage.getItem('uyuni_prod_view_mode') as 'table' | 'cards')) ||
      'table'
  );

  // State Signals
  readonly productList = signal<Product[]>([]);
  readonly totalRecords = signal<number>(0);
  readonly isLoading = signal<boolean>(false);
  readonly first = signal<number>(0);
  readonly rows = signal<number>(
    (typeof localStorage !== 'undefined' &&
      localStorage.getItem('uyuni_prod_view_mode') === 'cards')
      ? 12
      : 15
  );

  // Search Debouncing
  private readonly searchSubject = new Subject<string>();
  readonly searchValue = signal<string>('');

  // Catalogs
  readonly masterProducts = signal<CatalogItem[]>([]);
  readonly batches = signal<CatalogItem[]>([]);
  readonly statuses = signal<CatalogItem[]>([]);
  readonly physicalConditions = signal<CatalogItem[]>([]);

  // Filters State
  readonly selectedBatch = signal<string | null>(null);
  readonly selectedMasterProduct = signal<string | null>(null);
  readonly selectedStatus = signal<string | null>(null);
  readonly filterDrawerVisible = signal<boolean>(false);

  readonly activeFilterCount = computed<number>(() => {
    let count = 0;
    if (this.selectedBatch()) count++;
    if (this.selectedMasterProduct()) count++;
    if (this.selectedStatus()) count++;
    return count;
  });

  readonly currentFilterState = computed<ProductFilterState>(() => ({
    selectedBatch: this.selectedBatch(),
    selectedMasterProduct: this.selectedMasterProduct(),
    selectedStatus: this.selectedStatus()
  }));

  // Drawer
  readonly drawerVisible = signal<boolean>(false);
  readonly selectedProduct = signal<Product | null>(null);
  readonly drawerMode = signal<'create' | 'edit'>('create');

  // Mappings for fast label lookup
  readonly batchesMap = computed(() => {
    return new Map(this.batches().map(b => [String(b.value), b.label]));
  });

  readonly masterProductsMap = computed(() => {
    return new Map(this.masterProducts().map(m => [String(m.value), m.label]));
  });

  readonly statusesMap = computed(() => {
    return new Map(this.statuses().map(s => [String(s.value), s.label]));
  });

  readonly conditionsMap = computed(() => {
    return new Map(this.physicalConditions().map(c => [String(c.value), c.label]));
  });

  constructor() {
    this.searchSubject
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntilDestroyed()
      )
      .subscribe(value => {
        this.searchValue.set(value);
        this.first.set(0);
        this.loadData({ first: 0, rows: this.rows() });
      });
  }

  ngOnInit(): void {
    this.loadCatalogs();
    if (this.viewMode() === 'cards') {
      this.loadData({ first: this.first(), rows: this.rows() });
    }
  }

  setViewMode(mode: 'table' | 'cards'): void {
    const prevMode = this.viewMode();
    this.viewMode.set(mode);
    try {
      localStorage.setItem('uyuni_prod_view_mode', mode);
    } catch {
      // ignore storage error
    }

    if (prevMode !== mode) {
      const targetRows = mode === 'cards' ? 12 : 15;
      this.rows.set(targetRows);
      this.first.set(0);
      if (mode === 'cards') {
        this.loadData({ first: 0, rows: targetRows });
      }
    }
  }

  private loadCatalogs(): void {
    this.productService.getProductCatalogs().subscribe({
      next: catalogs => {
        this.masterProducts.set(catalogs.masterProducts);
        this.batches.set(catalogs.batches);
        this.statuses.set(catalogs.statuses);
        this.physicalConditions.set(catalogs.physicalConditions);
      },
      error: err => {
        this.logger.error('Error loading product catalogs', err, 'ProductListComponent');
      }
    });
  }

  openCreateProduct(): void {
    this.selectedProduct.set(null);
    this.drawerMode.set('create');
    this.drawerVisible.set(true);
  }

  openEditProduct(product: Product): void {
    this.selectedProduct.set(product);
    this.drawerMode.set('edit');
    this.drawerVisible.set(true);
  }

  onProductSaved(saved: Product): void {
    this.logger.info('Physical product saved, reloading table', { id: saved.id }, 'ProductListComponent');
    this.loadData({ first: this.first(), rows: this.rows() });
  }

  onProductDeleted(id: string): void {
    this.logger.info('Physical product deleted, reloading table', { id }, 'ProductListComponent');
    this.loadData({ first: this.first(), rows: this.rows() });
  }

  openFilterDrawer(): void {
    this.filterDrawerVisible.set(true);
  }

  onFilterApplied(state: ProductFilterState): void {
    this.selectedBatch.set(state.selectedBatch);
    this.selectedMasterProduct.set(state.selectedMasterProduct);
    this.selectedStatus.set(state.selectedStatus);
    this.resetAndReload();
  }

  onFilterCleared(): void {
    this.selectedBatch.set(null);
    this.selectedMasterProduct.set(null);
    this.selectedStatus.set(null);
    this.resetAndReload();
  }

  clearBatchFilter(): void {
    this.selectedBatch.set(null);
    this.resetAndReload();
  }

  clearMasterFilter(): void {
    this.selectedMasterProduct.set(null);
    this.resetAndReload();
  }

  clearStatusFilter(): void {
    this.selectedStatus.set(null);
    this.resetAndReload();
  }

  clearFilters(): void {
    this.onFilterCleared();
  }

  private resetAndReload(): void {
    this.first.set(0);
    this.loadData({ first: 0, rows: this.rows() });
  }

  loadData(event: TableLazyLoadEvent | { first: number; rows: number }): void {
    this.isLoading.set(true);

    const newFirst = event.first ?? 0;
    const newRows = event.rows ?? 15;

    this.first.set(newFirst);
    this.rows.set(newRows);

    const filterState: ProductFilterState = {
      selectedBatch: this.selectedBatch(),
      selectedMasterProduct: this.selectedMasterProduct(),
      selectedStatus: this.selectedStatus()
    };

    let sortField: string | undefined;
    let sortOrder: number | undefined;

    if ('sortField' in event) {
      sortField = event.sortField?.toString();
      sortOrder = event.sortOrder ?? undefined;
    }

    const params = this.filterService.buildParams(
      filterState,
      this.searchValue(),
      newFirst,
      newRows,
      sortField,
      sortOrder
    );

    this.productService.loadProductPage(params).subscribe({
      next: result => {
        this.productList.set(result.data);
        this.totalRecords.set(result.total);
        this.isLoading.set(false);
      },
      error: err => {
        this.logger.error('Error loading products data', err, 'ProductListComponent');
        this.isLoading.set(false);
      }
    });
  }

  onPaginatorChange(event: { first?: number; rows?: number }): void {
    const f = event.first ?? 0;
    const r = event.rows ?? this.rows();
    this.first.set(f);
    this.rows.set(r);
    this.loadData({ first: f, rows: r });
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  hasDistinctBatchName(prod: Product): boolean {
    if (!prod.batch_name) return false;
    const code = (prod.batch_code || '').trim().toLowerCase().replace(/[\s\-_]/g, '');
    const name = prod.batch_name.trim().toLowerCase().replace(/[\s\-_]/g, '');
    return code !== name && name.length > 0;
  }

  getBatchLabel(id?: string | null): string {
    if (!id) return '';
    return this.batchesMap().get(id) || id;
  }

  getMasterProductLabel(id?: string | null): string {
    if (!id) return '';
    return this.masterProductsMap().get(id) || id;
  }

  getStatusLabel(status?: string | null): string {
    if (!status) return '';
    switch (status) {
      case 'AVAILABLE':
        return 'Disponible';
      case 'SOLD_OUT':
        return 'Agotado';
      case 'SCRAPPED':
        return 'Merma / Baja';
      default:
        return this.statusesMap().get(status) || status;
    }
  }

  getConditionLabel(condition?: string | null): string {
    if (!condition) return '';
    switch (condition) {
      case 'OPERATIONAL':
        return 'Operativo';
      case 'INCOMPLETE':
        return 'Incompleto';
      case 'FOR_PARTS':
        return 'Para Repuestos';
      case 'DAMAGED_SCRAP':
        return 'Dañado / Merma';
      default:
        return this.conditionsMap().get(condition) || condition;
    }
  }

  getStatusSeverity(status?: string | null): 'success' | 'warn' | 'danger' | 'secondary' | 'info' {
    switch (status) {
      case 'AVAILABLE':
        return 'success';
      case 'SOLD_OUT':
        return 'secondary';
      case 'SCRAPPED':
        return 'danger';
      case 'RESERVED':
        return 'warn';
      default:
        return 'secondary';
    }
  }

  getConditionSeverity(condition?: string | null): 'success' | 'warn' | 'danger' | 'info' | 'secondary' {
    switch (condition) {
      case 'OPERATIONAL':
        return 'success';
      case 'INCOMPLETE':
        return 'warn';
      case 'FOR_PARTS':
        return 'info';
      case 'DAMAGED_SCRAP':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  getEstimatedMargin(prod: Product): number | null {
    if (prod.estimated_margin !== null && prod.estimated_margin !== undefined) {
      return prod.estimated_margin;
    }
    if (
      prod.published_price !== null &&
      prod.published_price !== undefined &&
      prod.cost_price !== null &&
      prod.cost_price !== undefined
    ) {
      return prod.published_price - prod.cost_price;
    }
    return null;
  }

  getDiscountMargin(prod: Product): number {
    if (prod.discount_margin !== null && prod.discount_margin !== undefined) {
      return prod.discount_margin;
    }
    if (
      prod.published_price !== null &&
      prod.published_price !== undefined &&
      prod.minimum_price !== null &&
      prod.minimum_price !== undefined
    ) {
      return Math.max(0, prod.published_price - prod.minimum_price);
    }
    return 0;
  }

  getInitials(name?: string | null): string {
    if (!name) return 'PR';
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
}
