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
  LucideSearch,
  LucideShoppingCart
} from '@lucide/angular';

import { CatalogItem } from '@core/models/catalog.model';
import { LoggerService } from '@core/services/logger.service';

import { Product } from '@features/commerce/products/models/product.model';
import { ProductService } from '@features/commerce/products/services/product.service';

import { SaleDrawerComponent } from '../../components/sale-drawer/sale-drawer.component';
import { Sale } from '../../models/sale.model';
import { SaleService } from '../../services/sale.service';
import { SaleFilterService, SaleFilterState } from '../../services/sale-filter.service';

@Component({
  selector: 'app-sale-list',
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
    LucideShoppingCart,
    LucideSearch,
    SaleDrawerComponent
  ],
  templateUrl: './sale-list.component.html',
  styleUrls: ['./sale-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaleListComponent implements OnInit {
  private readonly saleService = inject(SaleService);
  private readonly productService = inject(ProductService);
  private readonly filterService = inject(SaleFilterService);
  private readonly logger = inject(LoggerService);

  // State Signals
  readonly salesList = signal<Sale[]>([]);
  readonly totalRecords = signal<number>(0);
  readonly isLoading = signal<boolean>(false);
  readonly first = signal<number>(0);
  readonly rows = signal<number>(15);

  // Search Debouncing
  private readonly searchSubject = new Subject<string>();
  readonly searchValue = signal<string>('');

  // Catalogs
  readonly salesChannels = signal<CatalogItem[]>([]);
  readonly paymentStatuses = signal<CatalogItem[]>([]);
  readonly paymentMethods = signal<CatalogItem[]>([]);
  readonly deliveryModalities = signal<CatalogItem[]>([]);
  readonly deliveryPaidBy = signal<CatalogItem[]>([]);
  readonly deliveryStatuses = signal<CatalogItem[]>([]);
  readonly availableProducts = signal<Product[]>([]);

  // Filters
  readonly selectedChannel = signal<string | null>(null);
  readonly selectedPaymentStatus = signal<string | null>(null);
  readonly selectedDeliveryStatus = signal<string | null>(null);

  // Drawer
  readonly drawerVisible = signal<boolean>(false);
  readonly selectedSale = signal<Sale | null>(null);
  readonly drawerMode = signal<'create' | 'edit'>('create');

  // Mappings
  readonly paymentStatusesMap = computed(() => {
    return new Map(this.paymentStatuses().map(s => [String(s.value), s.label]));
  });

  readonly deliveryStatusesMap = computed(() => {
    return new Map(this.deliveryStatuses().map(d => [String(d.value), d.label]));
  });

  readonly paymentMethodsMap = computed(() => {
    return new Map(this.paymentMethods().map(p => [String(p.value), p.label]));
  });

  readonly deliveryModalitiesMap = computed(() => {
    return new Map(this.deliveryModalities().map(m => [String(m.value), m.label]));
  });

  // Track current sort
  private currentSortField: string | undefined = 'sale_date';
  private currentSortOrder: number | undefined = -1;

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
    this.loadAvailableProducts();
  }

  private loadCatalogs(): void {
    this.saleService.getSaleCatalogs().subscribe({
      next: catalogs => {
        this.salesChannels.set(catalogs.salesChannels);
        this.paymentStatuses.set(catalogs.paymentStatuses);
        this.paymentMethods.set(catalogs.paymentMethods);
        this.deliveryModalities.set(catalogs.deliveryModalities);
        this.deliveryPaidBy.set(catalogs.deliveryPaidBy);
        this.deliveryStatuses.set(catalogs.deliveryStatuses);
      },
      error: err => {
        this.logger.error('Error loading sale catalogs', err, 'SaleListComponent');
      }
    });
  }

  private loadAvailableProducts(): void {
    this.productService.getProducts({ limit: 200 }).subscribe({
      next: prods => {
        this.availableProducts.set(prods);
      },
      error: err => {
        this.logger.error('Error loading available products for sales', err, 'SaleListComponent');
      }
    });
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    this.first.set(event.first ?? 0);
    this.rows.set(event.rows ?? 15);
    const field = Array.isArray(event.sortField) ? event.sortField[0] : event.sortField;
    this.currentSortField = field ?? 'sale_date';
    this.currentSortOrder = event.sortOrder ?? -1;

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
    this.selectedChannel.set(null);
    this.selectedPaymentStatus.set(null);
    this.selectedDeliveryStatus.set(null);
    this.first.set(0);
    this.fetchData('');
  }

  fetchData(search = ''): void {
    this.isLoading.set(true);

    const filterState: SaleFilterState = {
      selectedChannel: this.selectedChannel(),
      selectedPaymentStatus: this.selectedPaymentStatus(),
      selectedDeliveryStatus: this.selectedDeliveryStatus()
    };

    const params = this.filterService.buildParams(
      filterState,
      search,
      this.first(),
      this.rows(),
      this.currentSortField,
      this.currentSortOrder
    );

    this.saleService.loadSalePage(params).subscribe({
      next: result => {
        this.salesList.set(result.data);
        this.totalRecords.set(result.total);
        this.isLoading.set(false);
      },
      error: err => {
        this.logger.error('Error fetching sales page', err, 'SaleListComponent');
        this.isLoading.set(false);
      }
    });
  }

  openCreate(): void {
    this.loadAvailableProducts();
    this.selectedSale.set(null);
    this.drawerMode.set('create');
    this.drawerVisible.set(true);
  }

  openEdit(sale: Sale): void {
    this.selectedSale.set(sale);
    this.drawerMode.set('edit');
    this.drawerVisible.set(true);
  }

  onSaleSaved(sale: Sale): void {
    this.logger.info('Sale saved successfully', { id: sale.id, sale_number: sale.sale_number }, 'SaleListComponent');
    this.fetchData(this.searchValue());
    this.loadAvailableProducts();
  }

  onSaleDeleted(id: string): void {
    this.logger.info('Sale deleted successfully', { id }, 'SaleListComponent');
    this.fetchData(this.searchValue());
    this.loadAvailableProducts();
  }

  getPaymentStatusSeverity(status: string): 'success' | 'warn' | 'info' | 'danger' | 'secondary' {
    switch (status) {
      case 'COLLECTED':
        return 'success';
      case 'PENDING':
        return 'warn';
      case 'COURTESY':
        return 'info';
      case 'REFUNDED':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  getDeliveryStatusSeverity(status: string): 'success' | 'warn' | 'info' | 'danger' | 'secondary' {
    switch (status) {
      case 'DELIVERED':
        return 'success';
      case 'PENDING':
        return 'warn';
      case 'SHIPPED':
        return 'info';
      default:
        return 'secondary';
    }
  }
}
