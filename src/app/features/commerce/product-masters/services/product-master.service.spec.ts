import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { ConfigService } from '@core/config/config.service';
import { CatalogService } from '@core/services/catalog.service';
import { LoggerService } from '@core/services/logger.service';

import {
  ProductMaster,
  ProductMasterCreatePayload,
  ProductMasterUpdatePayload
} from '../models/product-master.model';
import { ProductMasterService } from './product-master.service';

describe('ProductMasterService', () => {
  let service: ProductMasterService;
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

  const sampleMaster: ProductMaster = {
    id: '01a1c785-02b3-7641-bb12-9988aa112233',
    item_number: 53,
    code: '53',
    name: 'Almohadilla Térmica Eléctrica',
    description: 'Almohadilla de calor terapéutico',
    category_id: 'cat-1',
    live_basket_id: 'basket-1',
    brand: 'Genérico',
    model: 'TK-HP2412',
    official_price: 180,
    minimum_price: 140,
    published_price: 160,
    currency: 'BOB',
    cover_image_url: 'https://cdn.example.com/cover.webp',
    marketplace_url: 'https://fb.com/marketplace/1',
    external_info_url: 'https://amazon.com/1',
    features: '• 6 niveles',
    marketing_details: 'Ideal para dolores lumbares',
    is_reviewed: true,
    is_fb_verified: true,
    has_video: true,
    is_published_marketplace: true,
    is_whatsapp_published: false,
    is_active: true,
    total_available_stock: 2,
    total_sold_stock: 0,
    total_merma_stock: 0
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductMasterService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ConfigService, useValue: mockConfigService },
        { provide: LoggerService, useValue: mockLogger },
        { provide: CatalogService, useValue: mockCatalogService }
      ]
    });

    service = TestBed.inject(ProductMasterService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch product masters with query params', () => {
    service
      .getProductMasters({ offset: 0, limit: 15, search: 'almohadilla', category_id: 'cat-1' })
      .subscribe(res => {
        expect(res).toEqual([sampleMaster]);
      });

    const req = httpMock.expectOne(
      'http://localhost:8000/api/commerce/product-masters/?offset=0&limit=15&search=almohadilla&category_id=cat-1'
    );
    expect(req.request.method).toBe('GET');
    req.flush([sampleMaster]);
  });

  it('should fetch product masters count', () => {
    service.getProductMastersCount({ search: 'reloj' }).subscribe(total => {
      expect(total).toBe(240);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/commerce/product-masters/count?search=reloj');
    expect(req.request.method).toBe('GET');
    req.flush({ total: 240, count: 240 });
  });

  it('should load product masters page (data and count in parallel)', () => {
    service.loadProductMasterPage({ offset: 0, limit: 10 }).subscribe(res => {
      expect(res.data).toEqual([sampleMaster]);
      expect(res.total).toBe(1);
    });

    const reqData = httpMock.expectOne('http://localhost:8000/api/commerce/product-masters/?offset=0&limit=10');
    expect(reqData.request.method).toBe('GET');
    reqData.flush([sampleMaster]);

    const reqCount = httpMock.expectOne('http://localhost:8000/api/commerce/product-masters/count');
    expect(reqCount.request.method).toBe('GET');
    reqCount.flush({ total: 1, count: 1 });
  });

  it('should get product master by ID', () => {
    service.getProductMasterById('01a1c785-02b3-7641-bb12-9988aa112233').subscribe(res => {
      expect(res).toEqual(sampleMaster);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/commerce/product-masters/01a1c785-02b3-7641-bb12-9988aa112233');
    expect(req.request.method).toBe('GET');
    req.flush(sampleMaster);
  });

  it('should get product master by item number', () => {
    service.getProductMasterByNumber(53).subscribe(res => {
      expect(res).toEqual(sampleMaster);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/commerce/product-masters/by-number/53');
    expect(req.request.method).toBe('GET');
    req.flush(sampleMaster);
  });

  it('should create product master', () => {
    const payload: ProductMasterCreatePayload = {
      item_number: 53,
      name: 'Almohadilla Térmica Eléctrica',
      official_price: 180,
      minimum_price: 140
    };

    service.createProductMaster(payload).subscribe(res => {
      expect(res).toEqual(sampleMaster);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/commerce/product-masters/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(sampleMaster);
  });

  it('should update product master', () => {
    const payload: ProductMasterUpdatePayload = {
      name: 'Almohadilla Actualizada'
    };

    service.updateProductMaster('01a1c785-02b3-7641-bb12-9988aa112233', payload).subscribe(res => {
      expect(res.name).toBe('Almohadilla Actualizada');
    });

    const req = httpMock.expectOne('http://localhost:8000/api/commerce/product-masters/01a1c785-02b3-7641-bb12-9988aa112233');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush({ ...sampleMaster, name: 'Almohadilla Actualizada' });
  });

  it('should delete product master', () => {
    service.deleteProductMaster('01a1c785-02b3-7641-bb12-9988aa112233').subscribe(res => {
      expect(res.message).toBe('Ficha maestra eliminada exitosamente');
    });

    const req = httpMock.expectOne('http://localhost:8000/api/commerce/product-masters/01a1c785-02b3-7641-bb12-9988aa112233');
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Ficha maestra eliminada exitosamente' });
  });

  it('should get commerce catalogs via bulk endpoint', () => {
    mockCatalogService.getBulkCatalogs.mockReturnValue(
      of({
        commerce_categories: [{ value: 'cat-1', label: 'Hogar' }],
        commerce_live_baskets: [{ value: 'basket-1', label: 'Canasta 1' }]
      })
    );

    service.getCommerceCatalogs().subscribe(catalogs => {
      expect(catalogs.categories.length).toBe(1);
      expect(catalogs.liveBaskets.length).toBe(1);
      expect(catalogs.categories[0].label).toBe('Hogar');
      expect(catalogs.liveBaskets[0].label).toBe('Canasta 1');
    });

    expect(mockCatalogService.getBulkCatalogs).toHaveBeenCalledWith({
      commerce_categories: {},
      commerce_live_baskets: {}
    });
  });
});

