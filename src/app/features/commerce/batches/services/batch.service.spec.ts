import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { ConfigService } from '@core/config/config.service';
import { CatalogService } from '@core/services/catalog.service';
import { LoggerService } from '@core/services/logger.service';

import {
  Batch,
  BatchCreatePayload,
  BatchUpdatePayload
} from '../models/batch.model';
import { BatchService } from './batch.service';

describe('BatchService', () => {
  let service: BatchService;
  let httpMock: HttpTestingController;

  const mockConfigService = {
    apiUrl: 'http://localhost:8000/api'
  };

  const mockLogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  };

  const mockCatalogService = {
    getBulkCatalogs: jest.fn()
  };

  const sampleBatch: Batch = {
    id: '01a1b8dc-ddb0-71f4-bbec-6966db6633ef',
    code: 'ATAUD-02',
    name: 'Caja Ataúd 2 - Mixto',
    investment_round_id: '01a1a7b5-02b3-7641-bb12-9988aa112233',
    provider: 'Amazon Liquidation',
    batch_type: 'Liquidación Electrónicos',
    purchase_date: '2026-03-15',
    purchase_price: 3200.0,
    freight_cost: 600.0,
    total_cost: 3800.0,
    currency: 'BOB',
    initial_items_count: 50,
    merma_items_count: 5,
    sellable_items_count: 45,
    unit_cost: 84.44,
    status: 'active',
    financial_status: 'EN_RECUPERACION',
    observations: 'Revisión inicial completada'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BatchService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ConfigService, useValue: mockConfigService },
        { provide: LoggerService, useValue: mockLogger },
        { provide: CatalogService, useValue: mockCatalogService }
      ]
    });

    service = TestBed.inject(BatchService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch batches with query params', () => {
    service
      .getBatches({ offset: 0, limit: 15, search: 'ATAUD', sort_by: 'code', sort_order: 'asc' })
      .subscribe(res => {
        expect(res).toEqual([sampleBatch]);
      });

    const req = httpMock.expectOne(
      'http://localhost:8000/api/commerce/batches/?offset=0&limit=15&search=ATAUD&sort_by=code&sort_order=asc'
    );
    expect(req.request.method).toBe('GET');
    req.flush([sampleBatch]);
  });

  it('should fetch batches count without pagination parameters', () => {
    service.getBatchesCount({ search: 'ATAUD' }).subscribe(total => {
      expect(total).toBe(10);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/commerce/batches/count?search=ATAUD');
    expect(req.request.method).toBe('GET');
    req.flush({ total: 10 });
  });

  it('should load batch page (data and count in parallel)', () => {
    service.loadBatchPage({ offset: 0, limit: 10 }).subscribe(res => {
      expect(res.data).toEqual([sampleBatch]);
      expect(res.total).toBe(1);
    });

    const reqData = httpMock.expectOne('http://localhost:8000/api/commerce/batches/?offset=0&limit=10');
    expect(reqData.request.method).toBe('GET');
    reqData.flush([sampleBatch]);

    const reqCount = httpMock.expectOne('http://localhost:8000/api/commerce/batches/count');
    expect(reqCount.request.method).toBe('GET');
    reqCount.flush({ total: 1 });
  });

  it('should get batch by ID', () => {
    service.getBatchById('01a1b8dc-ddb0-71f4-bbec-6966db6633ef').subscribe(res => {
      expect(res).toEqual(sampleBatch);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/commerce/batches/01a1b8dc-ddb0-71f4-bbec-6966db6633ef');
    expect(req.request.method).toBe('GET');
    req.flush(sampleBatch);
  });

  it('should create batch', () => {
    const payload: BatchCreatePayload = {
      code: 'ATAUD-03',
      name: 'Caja Ataúd 3',
      purchase_price: 2500,
      freight_cost: 500
    };

    service.createBatch(payload).subscribe(res => {
      expect(res).toEqual(sampleBatch);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/commerce/batches/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(sampleBatch);
  });

  it('should update batch', () => {
    const payload: BatchUpdatePayload = {
      name: 'Nombre Actualizado'
    };

    service.updateBatch('01a1b8dc-ddb0-71f4-bbec-6966db6633ef', payload).subscribe(res => {
      expect(res.name).toBe('Nombre Actualizado');
    });

    const req = httpMock.expectOne('http://localhost:8000/api/commerce/batches/01a1b8dc-ddb0-71f4-bbec-6966db6633ef');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush({ ...sampleBatch, name: 'Nombre Actualizado' });
  });

  it('should delete batch', () => {
    service.deleteBatch('01a1b8dc-ddb0-71f4-bbec-6966db6633ef').subscribe(res => {
      expect(res.message).toBe('Batch deleted successfully');
    });

    const req = httpMock.expectOne('http://localhost:8000/api/commerce/batches/01a1b8dc-ddb0-71f4-bbec-6966db6633ef');
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Batch deleted successfully' });
  });

  it('should recalculate batch from products', () => {
    service.recalculateBatch('01a1b8dc-ddb0-71f4-bbec-6966db6633ef', true, false).subscribe(res => {
      expect(res).toEqual(sampleBatch);
    });

    const req = httpMock.expectOne(
      'http://localhost:8000/api/commerce/batches/01a1b8dc-ddb0-71f4-bbec-6966db6633ef/recalculate?revalue_sales=true&force_product_counts=false'
    );
    expect(req.request.method).toBe('POST');
    req.flush(sampleBatch);
  });

  it('should allocate relative costs', () => {
    service.allocateRelativeCosts('01a1b8dc-ddb0-71f4-bbec-6966db6633ef', 'official_price', true).subscribe(res => {
      expect(res).toEqual(sampleBatch);
    });

    const req = httpMock.expectOne(
      'http://localhost:8000/api/commerce/batches/01a1b8dc-ddb0-71f4-bbec-6966db6633ef/allocate-relative-costs?basis=official_price&revalue_sales=true'
    );
    expect(req.request.method).toBe('POST');
    req.flush(sampleBatch);
  });

  it('should get batch catalogs via bulk endpoint', () => {
    mockCatalogService.getBulkCatalogs.mockReturnValue(
      of({
        commerce_investment_rounds: [{ value: 'round-1', label: 'Ronda Inicial' }]
      })
    );

    service.getBatchCatalogs().subscribe(catalogs => {
      expect(catalogs.investmentRounds.length).toBe(1);
      expect(catalogs.statuses.length).toBe(3);
      expect(catalogs.financialStatuses.length).toBe(2);
    });

    expect(mockCatalogService.getBulkCatalogs).toHaveBeenCalledWith({
      commerce_investment_rounds: {}
    });
  });
});

