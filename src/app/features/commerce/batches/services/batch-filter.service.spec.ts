import { TestBed } from '@angular/core/testing';

import { LoggerService } from '@core/services/logger.service';

import { BatchFilterService, BatchFilterState } from './batch-filter.service';

describe('BatchFilterService', () => {
  let service: BatchFilterService;

  const mockLogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BatchFilterService,
        { provide: LoggerService, useValue: mockLogger }
      ]
    });
    service = TestBed.inject(BatchFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should build params correctly with empty filter state and search', () => {
    const filterState: BatchFilterState = {
      selectedStatus: null,
      selectedFinancialStatus: null,
      selectedRound: null
    };

    const params = service.buildParams(filterState, '', 0, 15, 'code', 1);

    expect(params).toEqual({
      offset: 0,
      limit: 15,
      search: undefined,
      sort_by: 'code',
      sort_order: 'asc'
    });
  });

  it('should build params with active search query and descending sort', () => {
    const filterState: BatchFilterState = {
      selectedStatus: null,
      selectedFinancialStatus: null,
      selectedRound: null
    };

    const params = service.buildParams(filterState, 'ATAUD-01', 15, 15, 'name', -1);

    expect(params).toEqual({
      offset: 15,
      limit: 15,
      search: 'ATAUD-01',
      sort_by: 'name',
      sort_order: 'desc'
    });
  });

  it('should fallback search to financial_status or status when explicit search is empty', () => {
    const filterState: BatchFilterState = {
      selectedStatus: null,
      selectedFinancialStatus: 'EN_RECUPERACION',
      selectedRound: null
    };

    const params = service.buildParams(filterState, '', 0, 10);

    expect(params.search).toBe('EN_RECUPERACION');
  });
});

