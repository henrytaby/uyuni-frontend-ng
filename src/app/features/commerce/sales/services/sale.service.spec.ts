import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { ConfigService } from '@core/config/config.service';
import { CatalogService } from '@core/services/catalog.service';
import { LoggerService } from '@core/services/logger.service';

import {
  Sale,
  SaleCreatePayload,
  SaleUpdatePayload
} from '../models/sale.model';
import { SaleService } from './sale.service';

describe('SaleService', () => {
  let service: SaleService;
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

  const sampleSale: Sale = {
    id: '01a1c787-9988-7766-5544-33221100aabb',
    sale_number: 'VTA-20261110-D8E9F0',
    sale_date: '2026-11-10T20:30:00Z',
    customer_name: 'Gonzalo Morales',
    customer_phone: '79712345',
    channel: 'TikTok Live',
    payment_method: 'QR',
    payment_status: 'COLLECTED',
    delivery_modality: 'TERMINAL_BUS',
    delivery_address: 'Terminal de Buses CBB',
    delivery_cost: 20.0,
    delivery_cost_paid_by: 'CUSTOMER',
    delivery_status: 'PENDING',
    total_collected: 160.0,
    total_cost: 80.0,
    net_profit: 80.0,
    currency: 'BOB',
    observations: 'Enviar encomienda a La Paz',
    items: [
      {
        id: 'item-1',
        sale_id: '01a1c787-9988-7766-5544-33221100aabb',
        product_id: 'prod-1',
        product_name: 'Almohadilla Térmica Eléctrica',
        quantity: 1,
        unit_price: 160.0,
        unit_cost: 80.0,
        total_price: 160.0,
        net_margin: 80.0
      }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SaleService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ConfigService, useValue: mockConfigService },
        { provide: LoggerService, useValue: mockLogger },
        { provide: CatalogService, useValue: mockCatalogService }
      ]
    });

    service = TestBed.inject(SaleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch sales with query params', () => {
    service
      .getSales({ offset: 0, limit: 15, search: 'Gonzalo', channel: 'TikTok Live', payment_status: 'COLLECTED' })
      .subscribe(res => {
        expect(res).toEqual([sampleSale]);
      });

    const req = httpMock.expectOne(
      'http://localhost:8000/api/commerce/sales/?offset=0&limit=15&search=Gonzalo&channel=TikTok%20Live&payment_status=COLLECTED'
    );
    expect(req.request.method).toBe('GET');
    req.flush([sampleSale]);
  });

  it('should fetch sales count without pagination parameters', () => {
    service.getSalesCount({ search: 'Gonzalo', payment_status: 'COLLECTED' }).subscribe(total => {
      expect(total).toBe(5);
    });

    const req = httpMock.expectOne(
      'http://localhost:8000/api/commerce/sales/count?search=Gonzalo&payment_status=COLLECTED'
    );
    expect(req.request.method).toBe('GET');
    req.flush({ total: 5 });
  });

  it('should load sale page (data and count in parallel)', () => {
    service.loadSalePage({ offset: 0, limit: 10 }).subscribe(res => {
      expect(res.data).toEqual([sampleSale]);
      expect(res.total).toBe(1);
    });

    const reqData = httpMock.expectOne('http://localhost:8000/api/commerce/sales/?offset=0&limit=10');
    expect(reqData.request.method).toBe('GET');
    reqData.flush([sampleSale]);

    const reqCount = httpMock.expectOne('http://localhost:8000/api/commerce/sales/count');
    expect(reqCount.request.method).toBe('GET');
    reqCount.flush({ total: 1 });
  });

  it('should get sale by ID', () => {
    service.getSaleById('01a1c787-9988-7766-5544-33221100aabb').subscribe(res => {
      expect(res).toEqual(sampleSale);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/commerce/sales/01a1c787-9988-7766-5544-33221100aabb');
    expect(req.request.method).toBe('GET');
    req.flush(sampleSale);
  });

  it('should create sale', () => {
    const payload: SaleCreatePayload = {
      customer_name: 'Gonzalo Morales',
      channel: 'TikTok Live',
      payment_method: 'QR',
      payment_status: 'COLLECTED',
      delivery_modality: 'TERMINAL_BUS',
      items: [{ product_id: 'prod-1', quantity: 1, unit_price: 160.0 }]
    };

    service.createSale(payload).subscribe(res => {
      expect(res).toEqual(sampleSale);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/commerce/sales/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(sampleSale);
  });

  it('should update sale', () => {
    const payload: SaleUpdatePayload = {
      delivery_status: 'DELIVERED'
    };

    service.updateSale('01a1c787-9988-7766-5544-33221100aabb', payload).subscribe(res => {
      expect(res.delivery_status).toBe('DELIVERED');
    });

    const req = httpMock.expectOne('http://localhost:8000/api/commerce/sales/01a1c787-9988-7766-5544-33221100aabb');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush({ ...sampleSale, delivery_status: 'DELIVERED' });
  });

  it('should delete sale', () => {
    service.deleteSale('01a1c787-9988-7766-5544-33221100aabb').subscribe(res => {
      expect(res.message).toBe('Sale deleted successfully');
    });

    const req = httpMock.expectOne('http://localhost:8000/api/commerce/sales/01a1c787-9988-7766-5544-33221100aabb');
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Sale deleted successfully' });
  });

  it('should get sale catalogs via bulk endpoint', () => {
    mockCatalogService.getBulkCatalogs.mockReturnValue(
      of({
        commerce_sales_channels: [{ value: 'ch-1', label: 'TikTok Live' }],
        commerce_payment_statuses: [{ value: 'COLLECTED', label: 'Cobrado' }],
        commerce_payment_methods: [{ value: 'QR', label: 'Pago QR' }],
        commerce_delivery_modalities: [{ value: 'FREE_MEETING_POINT', label: 'Punto de Encuentro' }],
        commerce_delivery_paid_by: [{ value: 'FREE', label: 'Sin Costo' }],
        commerce_delivery_statuses: [{ value: 'DELIVERED', label: 'Entregado' }]
      })
    );

    service.getSaleCatalogs().subscribe(catalogs => {
      expect(catalogs.salesChannels.length).toBe(1);
      expect(catalogs.paymentStatuses.length).toBe(1);
      expect(catalogs.paymentMethods.length).toBe(1);
      expect(catalogs.deliveryModalities.length).toBe(1);
      expect(catalogs.deliveryPaidBy.length).toBe(1);
      expect(catalogs.deliveryStatuses.length).toBe(1);
    });

    expect(mockCatalogService.getBulkCatalogs).toHaveBeenCalledWith({
      commerce_sales_channels: {},
      commerce_payment_statuses: {},
      commerce_payment_methods: {},
      commerce_delivery_modalities: {},
      commerce_delivery_paid_by: {},
      commerce_delivery_statuses: {}
    });
  });
});
