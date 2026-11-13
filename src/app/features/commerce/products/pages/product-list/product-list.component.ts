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
import {
  LucideBoxes,
  LucideShieldCheck
} from '@lucide/angular';

import { CatalogItem } from '@core/models/catalog.model';
import { LoggerService } from '@core/services/logger.service';

import { ProductDrawerComponent } from '../../components/product-drawer/product-drawer.component';
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
    Tag,
    Avatar,
    Button,
    InputText,
    IconField,
    InputIcon,
    Tooltip,
    Select,
    LucideBoxes,
    LucideShieldCheck,
    ProductDrawerComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly filterService = inject(ProductFilterService);
  private readonly logger = inject(LoggerService);

  // State Signals
  readonly productList = signal<Product[]>([]);
  readonly totalRecords = signal<number>(0);
  readonly isLoading = signal<boolean>(false);
  readonly first = signal<number>(0);
  readonly rows = signal<number>(15);

  // Search Debouncing
  private readonly searchSubject = new Subject<string>();
  readonly searchValue = signal<string>('');

  // Catalogs
  readonly masterProducts = signal<CatalogItem[]>([]);
  readonly batches = signal<CatalogItem[]>([]);
  readonly statuses = signal<CatalogItem[]>([]);
  readonly physicalConditions = signal<CatalogItem[]>([]);

  // Filters
  readonly selectedBatch = signal<string | null>(null);
  readonly selectedMasterProduct = signal<string | null>(null);
  readonly selectedStatus = signal<string | null>(null);

  // Drawer
  readonly drawerVisible = signal<boolean>(false);
  readonly selectedProduct = signal<Product | null>(null);
  readonly drawerMode = signal<'create' | 'edit'>('create');

  // Mappings
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

  onBatchChange(batchId: string | null): void {
    this.selectedBatch.set(batchId);
    this.resetAndReload();
  }

  onMasterChange(masterId: string | null): void {
    this.selectedMasterProduct.set(masterId);
    this.resetAndReload();
  }

  onStatusChange(status: string | null): void {
    this.selectedStatus.set(status);
    this.resetAndReload();
  }

  clearFilters(): void {
    this.selectedBatch.set(null);
    this.selectedMasterProduct.set(null);
    this.selectedStatus.set(null);
    this.resetAndReload();
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

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  getStatusLabel(status: string): string {
    return this.statusesMap().get(status) || status;
  }

  getConditionLabel(condition: string): string {
    return this.conditionsMap().get(condition) || condition;
  }

  getStatusSeverity(status: string): 'success' | 'warn' | 'danger' | 'secondary' | 'info' {
    switch (status) {
      case 'AVAILABLE':
        return 'success';
      case 'RESERVED':
        return 'warn';
      case 'SOLD_OUT':
        return 'info';
      case 'SCRAPPED':
        return 'danger';
      default:
        return 'secondary';
    }
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
