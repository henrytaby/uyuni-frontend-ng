import { TestBed } from '@angular/core/testing';

import { LoggerService } from '@core/services/logger.service';

import { SaleFilterService, SaleFilterState } from './sale-filter.service';

describe('SaleFilterService', () => {
  let service: SaleFilterService;

  const mockLogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SaleFilterService,
        { provide: LoggerService, useValue: mockLogger }
      ]
    });
    service = TestBed.inject(SaleFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should build params correctly with empty filter state and search', () => {
    const filterState: SaleFilterState = {
      selectedChannel: null,
      selectedPaymentStatus: null,
      selectedDeliveryStatus: null
    };

    const params = service.buildParams(filterState, '', 0, 15, 'sale_date', -1);

    expect(params).toEqual({
      offset: 0,
      limit: 15,
      search: undefined,
      sort_by: 'sale_date',
      sort_order: 'desc',
      channel: undefined,
      payment_status: undefined,
      delivery_status: undefined
    });
  });

  it('should build params with active filters and search term', () => {
    const filterState: SaleFilterState = {
      selectedChannel: 'TikTok Live',
      selectedPaymentStatus: 'COLLECTED',
      selectedDeliveryStatus: 'DELIVERED'
    };

    const params = service.buildParams(filterState, 'VTA-2026', 15, 15, 'total_collected', 1);

    expect(params).toEqual({
      offset: 15,
      limit: 15,
      search: 'VTA-2026',
      sort_by: 'total_collected',
      sort_order: 'asc',
      channel: 'TikTok Live',
      payment_status: 'COLLECTED',
      delivery_status: 'DELIVERED'
    });
  });
});
