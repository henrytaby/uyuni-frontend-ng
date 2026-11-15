import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationService, MessageService } from 'primeng/api';
import { of } from 'rxjs';

import { LoggerService } from '@core/services/logger.service';

import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ProductFilterService } from '../../services/product-filter.service';
import { ProductListComponent } from './product-list.component';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productService: jest.Mocked<ProductService>;

  beforeAll(() => {
    global.ResizeObserver = class {
      observe = jest.fn();
      unobserve = jest.fn();
      disconnect = jest.fn();
    } as unknown as typeof ResizeObserver;
  });

  const mockLogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  };

  const sampleProducts: Product[] = [
    {
      id: 'p-1',
      master_product_id: 'mp-1',
      batch_id: 'b-1',
      batch_name: 'Ataúd 1',
      sheet_row_id: 42,
      name: 'TP360 Smart Projector',
      variant_name: 'Estándar',
      cost_price: 402.39,
      official_price: 1200,
      minimum_price: 800,
      published_price: 1200,
      initial_quantity: 1,
      available_quantity: 0,
      sold_quantity: 1,
      merma_quantity: 0,
      status: 'AVAILABLE',
      physical_condition: 'OPERATIONAL',
      is_reviewed: true
    }
  ];

  beforeEach(async () => {
    const productServiceMock = {
      getProducts: jest.fn().mockReturnValue(of(sampleProducts)),
      getProductsCount: jest.fn().mockReturnValue(of(1)),
      loadProductPage: jest.fn().mockReturnValue(of({ data: sampleProducts, total: 1 })),
      getProductCatalogs: jest.fn().mockReturnValue(of({
        masterProducts: [{ value: 'mp-1', label: 'TP360 Smart Projector' }],
        batches: [{ value: 'b-1', label: 'Ataúd 1' }],
        statuses: [{ value: 'AVAILABLE', label: 'Disponible' }],
        physicalConditions: [{ value: 'OPERATIONAL', label: 'Operativo' }]
      }))
    };

    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
        ConfirmationService,
        ProductFilterService,
        { provide: ProductService, useValue: productServiceMock },
        { provide: LoggerService, useValue: mockLogger }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService) as jest.Mocked<ProductService>;
  });

  it('should initialize and load products and catalogs', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(productService.getProductCatalogs).toHaveBeenCalled();
  });

  it('should toggle viewMode between table and cards', () => {
    fixture.detectChanges();
    expect(component.viewMode()).toBe('table');

    component.setViewMode('cards');
    expect(component.viewMode()).toBe('cards');
    expect(component.rows()).toBe(12);

    component.setViewMode('table');
    expect(component.viewMode()).toBe('table');
    expect(component.rows()).toBe(15);
  });

  it('should compute activeFilterCount dynamically', () => {
    expect(component.activeFilterCount()).toBe(0);

    component.selectedBatch.set('b-1');
    expect(component.activeFilterCount()).toBe(1);

    component.selectedMasterProduct.set('mp-1');
    expect(component.activeFilterCount()).toBe(2);

    component.selectedStatus.set('AVAILABLE');
    expect(component.activeFilterCount()).toBe(3);

    component.clearFilters();
    expect(component.activeFilterCount()).toBe(0);
    expect(component.selectedBatch()).toBeNull();
  });

  it('should handle onFilterApplied correctly', () => {
    component.onFilterApplied({
      selectedBatch: 'b-1',
      selectedMasterProduct: 'mp-1',
      selectedStatus: 'AVAILABLE'
    });

    expect(component.selectedBatch()).toBe('b-1');
    expect(component.selectedMasterProduct()).toBe('mp-1');
    expect(component.selectedStatus()).toBe('AVAILABLE');
    expect(component.activeFilterCount()).toBe(3);
  });

  it('should format labels correctly from catalogs', () => {
    component.batches.set([{ value: 'b-1', label: 'Ataúd 1' }]);
    component.masterProducts.set([{ value: 'mp-1', label: 'Ficha 1' }]);
    component.statuses.set([{ value: 'AVAILABLE', label: 'Disponible' }]);
    component.physicalConditions.set([{ value: 'OPERATIONAL', label: 'Operativo' }]);

    expect(component.getBatchLabel('b-1')).toBe('Ataúd 1');
    expect(component.getMasterProductLabel('mp-1')).toBe('Ficha 1');
    expect(component.getStatusLabel('AVAILABLE')).toBe('Disponible');
    expect(component.getConditionLabel('OPERATIONAL')).toBe('Operativo');
  });

  it('should handle paginator changes in cards view', () => {
    const loadSpy = jest.spyOn(component, 'loadData');
    component.onPaginatorChange({ first: 12, rows: 12 });

    expect(component.first()).toBe(12);
    expect(component.rows()).toBe(12);
    expect(loadSpy).toHaveBeenCalledWith({ first: 12, rows: 12 });
  });

  it('should calculate estimated margin and discount margin correctly', () => {
    const testProd = {
      ...sampleProducts[0],
      published_price: 150,
      cost_price: 66.22,
      minimum_price: 120,
      estimated_margin: null,
      discount_margin: null
    };

    expect(component.getEstimatedMargin(testProd)).toBeCloseTo(83.78, 2);
    expect(component.getDiscountMargin(testProd)).toBe(30);

    const explicitProd = {
      ...testProd,
      estimated_margin: 85,
      discount_margin: 25
    };
    expect(component.getEstimatedMargin(explicitProd)).toBe(85);
    expect(component.getDiscountMargin(explicitProd)).toBe(25);
  });

  it('should return correct severity for conditions and statuses', () => {
    expect(component.getConditionSeverity('OPERATIONAL')).toBe('success');
    expect(component.getConditionSeverity('INCOMPLETE')).toBe('warn');
    expect(component.getConditionSeverity('FOR_PARTS')).toBe('info');
    expect(component.getConditionSeverity('DAMAGED_SCRAP')).toBe('danger');
    expect(component.getConditionSeverity('UNKNOWN')).toBe('secondary');

    expect(component.getStatusSeverity('AVAILABLE')).toBe('success');
    expect(component.getStatusSeverity('SOLD_OUT')).toBe('secondary');
    expect(component.getStatusSeverity('SCRAPPED')).toBe('danger');
  });

  it('should detect distinct batch name correctly and avoid duplicates', () => {
    const duplicateProd = {
      ...sampleProducts[0],
      batch_code: 'ATAUD-1',
      batch_name: 'Ataud 1'
    };
    expect(component.hasDistinctBatchName(duplicateProd)).toBe(false);

    const identicalProd = {
      ...sampleProducts[0],
      batch_code: 'DIGITAL',
      batch_name: 'Digital'
    };
    expect(component.hasDistinctBatchName(identicalProd)).toBe(false);

    const distinctProd = {
      ...sampleProducts[0],
      batch_code: 'ATAUD-1',
      batch_name: 'Liquidación Amazon Electrónicos'
    };
    expect(component.hasDistinctBatchName(distinctProd)).toBe(true);
  });
});
