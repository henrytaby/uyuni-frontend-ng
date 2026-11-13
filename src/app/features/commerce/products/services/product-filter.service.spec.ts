import { TestBed } from '@angular/core/testing';

import { LoggerService } from '@core/services/logger.service';

import {
  ProductFilterService,
  ProductFilterState
} from './product-filter.service';

describe('ProductFilterService', () => {
  let service: ProductFilterService;

  const mockLogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductFilterService,
        { provide: LoggerService, useValue: mockLogger }
      ]
    });

    service = TestBed.inject(ProductFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should build params with full filter state', () => {
    const filterState: ProductFilterState = {
      selectedBatch: 'batch-uuid-1',
      selectedMasterProduct: 'master-uuid-2',
      selectedStatus: 'AVAILABLE'
    };

    const params = service.buildParams(filterState, 'almohadilla', 0, 15, 'cost_price', 1);

    expect(params).toEqual({
      offset: 0,
      limit: 15,
      search: 'almohadilla',
      sort_by: 'cost_price',
      sort_order: 'asc',
      batch_id: 'batch-uuid-1',
      master_product_id: 'master-uuid-2',
      status: 'AVAILABLE'
    });
  });

  it('should build params with empty filter state and desc sort order', () => {
    const filterState: ProductFilterState = {
      selectedBatch: null,
      selectedMasterProduct: null,
      selectedStatus: null
    };

    const params = service.buildParams(filterState, '', 30, 15, 'initial_quantity', -1);

    expect(params).toEqual({
      offset: 30,
      limit: 15,
      search: undefined,
      sort_by: 'initial_quantity',
      sort_order: 'desc',
      batch_id: undefined,
      master_product_id: undefined,
      status: undefined
    });
  });
});

