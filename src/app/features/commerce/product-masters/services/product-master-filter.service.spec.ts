import { TestBed } from '@angular/core/testing';

import { LoggerService } from '@core/services/logger.service';

import {
  ProductMasterFilterService,
  ProductMasterFilterState
} from './product-master-filter.service';

describe('ProductMasterFilterService', () => {
  let service: ProductMasterFilterService;

  const mockLogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductMasterFilterService,
        { provide: LoggerService, useValue: mockLogger }
      ]
    });

    service = TestBed.inject(ProductMasterFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should build params with full filter state', () => {
    const filterState: ProductMasterFilterState = {
      selectedCategory: 'cat-uuid-1',
      selectedLiveBasket: 'basket-uuid-2',
      selectedActivo: true
    };

    const params = service.buildParams(filterState, 'reloj', 0, 15, 'official_price', 1);

    expect(params).toEqual({
      offset: 0,
      limit: 15,
      search: 'reloj',
      sort_by: 'official_price',
      sort_order: 'asc',
      category_id: 'cat-uuid-1',
      live_basket_id: 'basket-uuid-2',
      is_active: true
    });
  });

  it('should build params with empty filter state and desc sort order', () => {
    const filterState: ProductMasterFilterState = {
      selectedCategory: null,
      selectedLiveBasket: null,
      selectedActivo: null
    };

    const params = service.buildParams(filterState, '', 30, 15, 'item_number', -1);

    expect(params).toEqual({
      offset: 30,
      limit: 15,
      search: undefined,
      sort_by: 'item_number',
      sort_order: 'desc',
      category_id: undefined,
      live_basket_id: undefined,
      is_active: undefined
    });
  });
});

