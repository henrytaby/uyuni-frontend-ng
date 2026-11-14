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

import { MessageService } from 'primeng/api';
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
  LucideCircleCheck,
  LucideCopy,
  LucideExternalLink,
  LucideLayoutGrid,
  LucideListFilter,
  LucideMessageSquare,
  LucidePackage,
  LucideShare2,
  LucideTable2,
  LucideTv,
  LucideVideo,
  LucideX
} from '@lucide/angular';

import { CatalogItem } from '@core/models/catalog.model';
import { LoggerService } from '@core/services/logger.service';

import { CloudinaryUrlPipe } from '@shared/pipe/cloudinary-url.pipe';

import { ProductMasterDrawerComponent } from '../../components/product-master-drawer/product-master-drawer.component';
import { ProductMasterFilterDrawerComponent } from '../../components/product-master-filter-drawer/product-master-filter-drawer.component';
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
    Paginator,
    Tag,
    Button,
    InputText,
    IconField,
    InputIcon,
    Tooltip,
    LucideCircleCheck,
    LucideVideo,
    LucideShare2,
    LucideMessageSquare,
    LucideListFilter,
    LucideX,
    LucideTable2,
    LucideLayoutGrid,
    LucidePackage,
    LucideExternalLink,
    LucideCopy,
    LucideTv,
    CloudinaryUrlPipe,
    ProductMasterDrawerComponent,
    ProductMasterFilterDrawerComponent
  ],
  templateUrl: './product-master-list.component.html',
  styleUrls: ['./product-master-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductMasterListComponent implements OnInit {
  private readonly productMasterService = inject(ProductMasterService);
  private readonly filterService = inject(ProductMasterFilterService);
  private readonly messageService = inject(MessageService);
  private readonly logger = inject(LoggerService);

  // View Mode: 'table' (ERP / Backoffice) vs 'cards' (Comercial / Live)
  readonly viewMode = signal<'table' | 'cards'>(
    (typeof localStorage !== 'undefined' &&
      (localStorage.getItem('uyuni_pm_view_mode') as 'table' | 'cards')) ||
      'table'
  );

  // State Signals
  readonly productList = signal<ProductMaster[]>([]);
  readonly totalRecords = signal<number>(0);
  readonly isLoading = signal<boolean>(false);
  readonly first = signal<number>(0);
  readonly rows = signal<number>(
    (typeof localStorage !== 'undefined' &&
      localStorage.getItem('uyuni_pm_view_mode') === 'cards')
      ? 12
      : 15
  );

  // Search Debouncing
  private readonly searchSubject = new Subject<string>();
  readonly searchValue = signal<string>('');

  // Catalogs
  readonly categories = signal<CatalogItem[]>([]);
  readonly liveBaskets = signal<CatalogItem[]>([]);

  // Filters State
  readonly selectedCategory = signal<string | null>(null);
  readonly selectedLiveBasket = signal<string | null>(null);
  readonly selectedActivo = signal<boolean | null>(null);
  readonly filterDrawerVisible = signal<boolean>(false);

  readonly activeFilterCount = computed<number>(() => {
    let count = 0;
    if (this.selectedCategory()) count++;
    if (this.selectedLiveBasket()) count++;
    if (this.selectedActivo() !== null) count++;
    return count;
  });

  readonly currentFilterState = computed<ProductMasterFilterState>(() => ({
    selectedCategory: this.selectedCategory(),
    selectedLiveBasket: this.selectedLiveBasket(),
    selectedActivo: this.selectedActivo()
  }));

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
    if (this.viewMode() === 'cards') {
      this.loadData({ first: this.first(), rows: this.rows() });
    }
  }

  setViewMode(mode: 'table' | 'cards'): void {
    const prevMode = this.viewMode();
    this.viewMode.set(mode);
    try {
      localStorage.setItem('uyuni_pm_view_mode', mode);
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

  onCoverImageChanged(event: { masterId: string; coverUrl: string | null }): void {
    this.logger.info('Product master cover image updated reactively', event, 'ProductMasterListComponent');
    this.productList.update(list =>
      list.map(p => (p.id === event.masterId ? { ...p, cover_image_url: event.coverUrl } : p))
    );
  }

  openFilterDrawer(): void {
    this.filterDrawerVisible.set(true);
  }

  onFilterApplied(state: ProductMasterFilterState): void {
    this.selectedCategory.set(state.selectedCategory);
    this.selectedLiveBasket.set(state.selectedLiveBasket);
    this.selectedActivo.set(state.selectedActivo);
    this.resetAndReload();
  }

  onFilterCleared(): void {
    this.selectedCategory.set(null);
    this.selectedLiveBasket.set(null);
    this.selectedActivo.set(null);
    this.resetAndReload();
  }

  clearCategoryFilter(): void {
    this.selectedCategory.set(null);
    this.resetAndReload();
  }

  clearLiveBasketFilter(): void {
    this.selectedLiveBasket.set(null);
    this.resetAndReload();
  }

  clearActivoFilter(): void {
    this.selectedActivo.set(null);
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

  copyPitch(prod: ProductMaster): void {
    const pricePub = prod.published_price ? `Bs. ${prod.published_price.toFixed(2)}` : 'A consultar';
    const text = `*${prod.name}* (Ítem #${prod.item_number})\n` +
      `💰 *Precio de Oferta:* ${pricePub}\n` +
      (prod.description ? `📝 ${prod.description}\n` : '') +
      `📦 Stock disponible: ${prod.total_available_stock} unid.`;

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Copiado para WhatsApp',
          detail: `Ficha #${prod.item_number} lista para compartir.`
        });
      });
    }
  }

  openWhatsAppShare(prod: ProductMaster): void {
    const pricePub = prod.published_price ? `Bs. ${prod.published_price.toFixed(2)}` : 'A consultar';
    const text = encodeURIComponent(
      `Hola! Te comparto información de:\n*${prod.name}* (Ítem #${prod.item_number})\n` +
      `💰 Precio: ${pricePub}\n` +
      (prod.description ? `${prod.description}\n` : '')
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  }
}
