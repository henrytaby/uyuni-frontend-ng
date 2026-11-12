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
  LucideCircleCheck,
  LucideMessageSquare,
  LucideShare2,
  LucideSparkles,
  LucideVideo
} from '@lucide/angular';

import { CatalogItem } from '@core/models/catalog.model';
import { LoggerService } from '@core/services/logger.service';

import { ProductMasterDrawerComponent } from '../../components/product-master-drawer/product-master-drawer.component';
import { ProductMaster } from '../../models/product-master.model';
import { ProductMasterService } from '../../services/product-master.service';
import { ProductMasterFilterService, ProductMasterFilterState } from '../../services/product-master-filter.service';

@Component({
  selector: 'app-product-master-list',
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
    LucideSparkles,
    LucideCircleCheck,
    LucideVideo,
    LucideShare2,
    LucideMessageSquare,
    ProductMasterDrawerComponent
  ],
  templateUrl: './product-master-list.component.html',
  styleUrls: ['./product-master-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductMasterListComponent implements OnInit {
  private readonly productMasterService = inject(ProductMasterService);
  private readonly filterService = inject(ProductMasterFilterService);
  private readonly logger = inject(LoggerService);

  // State Signals
  readonly productList = signal<ProductMaster[]>([]);
  readonly totalRecords = signal<number>(0);
  readonly isLoading = signal<boolean>(false);
  readonly first = signal<number>(0);
  readonly rows = signal<number>(15);

  // Search Debouncing
  private readonly searchSubject = new Subject<string>();
  readonly searchValue = signal<string>('');

  // Catalogs
  readonly categories = signal<CatalogItem[]>([]);
  readonly liveBaskets = signal<CatalogItem[]>([]);

  // Filters
  readonly selectedCategory = signal<string | null>(null);
  readonly selectedLiveBasket = signal<string | null>(null);
  readonly selectedActivo = signal<boolean | null>(null);

  // Drawer
  readonly drawerVisible = signal<boolean>(false);
  readonly selectedProduct = signal<ProductMaster | null>(null);
  readonly drawerMode = signal<'create' | 'edit'>('create');

  readonly activoOptions: { label: string; value: boolean }[] = [
    { label: 'Activos', value: true },
    { label: 'Inactivos', value: false }
  ];

  // Mapas para lookup rápido de etiquetas en la tabla
  readonly categoriesMap = computed(() => {
    return new Map(this.categories().map(c => [String(c.value), c.label]));
  });

  readonly liveBasketsMap = computed(() => {
    return new Map(this.liveBaskets().map(b => [String(b.value), b.label]));
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
    this.productMasterService.getCommerceCatalogs().subscribe({
      next: catalogs => {
        this.categories.set(catalogs.categories);
        this.liveBaskets.set(catalogs.liveBaskets);
      },
      error: err => {
        this.logger.error('Error loading commerce catalogs', err, 'ProductMasterListComponent');
      }
    });
  }

  openCreateProduct(): void {
    this.selectedProduct.set(null);
    this.drawerMode.set('create');
    this.drawerVisible.set(true);
  }

  openEditProduct(product: ProductMaster): void {
    this.selectedProduct.set(product);
    this.drawerMode.set('edit');
    this.drawerVisible.set(true);
  }

  onProductSaved(saved: ProductMaster): void {
    this.logger.info('Product master saved, reloading table', { id: saved.id }, 'ProductMasterListComponent');
    this.loadData({ first: this.first(), rows: this.rows() });
  }

  onProductDeleted(id: string): void {
    this.logger.info('Product master deleted, reloading table', { id }, 'ProductMasterListComponent');
    this.loadData({ first: this.first(), rows: this.rows() });
  }

  onCategoryChange(categoryId: string | null): void {
    this.selectedCategory.set(categoryId);
    this.resetAndReload();
  }

  onLiveBasketChange(basketId: string | null): void {
    this.selectedLiveBasket.set(basketId);
    this.resetAndReload();
  }

  onActivoChange(isActive: boolean | null): void {
    this.selectedActivo.set(isActive);
    this.resetAndReload();
  }

  clearFilters(): void {
    this.selectedCategory.set(null);
    this.selectedLiveBasket.set(null);
    this.selectedActivo.set(null);
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

    const filterState: ProductMasterFilterState = {
      selectedCategory: this.selectedCategory(),
      selectedLiveBasket: this.selectedLiveBasket(),
      selectedActivo: this.selectedActivo()
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

    this.productMasterService.loadProductMasterPage(params).subscribe({
      next: result => {
        this.productList.set(result.data);
        this.totalRecords.set(result.total);
        this.isLoading.set(false);
      },
      error: err => {
        this.logger.error('Error loading product masters data', err, 'ProductMasterListComponent');
        this.isLoading.set(false);
      }
    });
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  getCategoryLabel(id?: string | null): string {
    if (!id) return 'General';
    return this.categoriesMap().get(id) || 'General';
  }

  getLiveBasketLabel(id?: string | null): string {
    if (!id) return '';
    return this.liveBasketsMap().get(id) || '';
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
