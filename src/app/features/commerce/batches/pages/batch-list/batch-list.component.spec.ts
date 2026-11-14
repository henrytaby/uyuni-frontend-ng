import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationService, MessageService } from 'primeng/api';
import { of } from 'rxjs';

import { LoggerService } from '@core/services/logger.service';

import { Batch } from '../../models/batch.model';
import { BatchService } from '../../services/batch.service';
import { BatchFilterService } from '../../services/batch-filter.service';
import { BatchListComponent } from './batch-list.component';

describe('BatchListComponent', () => {
  let component: BatchListComponent;
  let fixture: ComponentFixture<BatchListComponent>;
  let batchService: jest.Mocked<BatchService>;

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

  const sampleBatches: Batch[] = [
    {
      id: 'b-1',
      code: 'ATAUD-1',
      name: 'Ataúd 1',
      purchase_price: 6400,
      freight_cost: 50,
      total_cost: 6450,
      currency: 'BOB',
      initial_items_count: 93,
      merma_items_count: 3,
      sellable_items_count: 90,
      unit_cost: 71.67,
      status: 'active',
      financial_status: 'EN_RECUPERACION'
    }
  ];

  beforeEach(async () => {
    const batchServiceMock = {
      getBatches: jest.fn().mockReturnValue(of(sampleBatches)),
      getBatchesCount: jest.fn().mockReturnValue(of(1)),
      loadBatchPage: jest.fn().mockReturnValue(of({ data: sampleBatches, total: 1 })),
      getBatchCatalogs: jest.fn().mockReturnValue(of({
        investmentRounds: [{ value: 'r-1', label: 'Ronda 1' }],
        statuses: [{ value: 'active', label: 'Activo' }],
        financialStatuses: [{ value: 'EN_RECUPERACION', label: 'En Recuperación' }]
      }))
    };

    await TestBed.configureTestingModule({
      imports: [BatchListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
        ConfirmationService,
        BatchFilterService,
        { provide: BatchService, useValue: batchServiceMock },
        { provide: LoggerService, useValue: mockLogger }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BatchListComponent);
    component = fixture.componentInstance;
    batchService = TestBed.inject(BatchService) as jest.Mocked<BatchService>;
  });

  it('should initialize and load batches and catalogs', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(batchService.getBatchCatalogs).toHaveBeenCalled();
    expect(component.batchList().length).toBe(1);
    expect(component.totalRecords()).toBe(1);
  });

  it('should compute activeFilterCount dynamically', () => {
    expect(component.activeFilterCount()).toBe(0);

    component.selectedStatus.set('active');
    expect(component.activeFilterCount()).toBe(1);

    component.selectedFinancialStatus.set('EN_RECUPERACION');
    expect(component.activeFilterCount()).toBe(2);

    component.selectedRound.set('r-1');
    expect(component.activeFilterCount()).toBe(3);

    component.clearFilters();
    expect(component.activeFilterCount()).toBe(0);
  });

  it('should open and apply filters from filter drawer', () => {
    component.openFilterDrawer();
    expect(component.filterDrawerVisible()).toBe(true);

    component.onFilterApplied({
      selectedStatus: 'active',
      selectedFinancialStatus: 'RECUPERADO',
      selectedRound: 'r-1'
    });

    expect(component.selectedStatus()).toBe('active');
    expect(component.selectedFinancialStatus()).toBe('RECUPERADO');
    expect(component.selectedRound()).toBe('r-1');
    expect(component.first()).toBe(0);
  });

  it('should clear individual filters properly', () => {
    component.selectedStatus.set('active');
    component.selectedFinancialStatus.set('EN_RECUPERACION');
    component.selectedRound.set('r-1');

    component.clearStatusFilter();
    expect(component.selectedStatus()).toBeNull();
    expect(component.selectedFinancialStatus()).toBe('EN_RECUPERACION');

    component.clearFinancialStatusFilter();
    expect(component.selectedFinancialStatus()).toBeNull();

    component.clearRoundFilter();
    expect(component.selectedRound()).toBeNull();
  });
});
