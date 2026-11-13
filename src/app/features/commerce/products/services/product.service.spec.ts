import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { ConfigService } from '@core/config/config.service';
import { CatalogService } from '@core/services/catalog.service';
import { LoggerService } from '@core/services/logger.service';

import {
  Product,
  ProductCreatePayload,
  ProductUpdatePayload
} from '../models/product.model';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
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

  const sampleProduct: Product = {
    id: '01a1c786-1122-3344-5566-778899aabbcc',
    master_product_id: '01a1c785-02b3-7641-bb12-9988aa112233',
    batch_id: '01a1b8dc-ddb0-71f4-bbec-6966db6633ef',
    batch_name: 'Ataúd 2',
    name: 'Almohadilla Térmica Eléctrica',
    variant_name: 'Modelo TK-HP2412',
    sheet_row_id: 165,
    cost_price: 80.0,
    initial_quantity: 1,
    sold_quantity: 0,
    merma_quantity: 0,
    available_quantity: 1,
    status: 'AVAILABLE',
    physical_condition: 'OPERATIONAL',
    defect_detail: null,
    is_reviewed: true,
    official_price: 180.0,
    minimum_price: 140.0,
    published_price: 160.0
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ConfigService, useValue: mockConfigService },
        { provide: LoggerService, useValue: mockLogger },
        { provide: CatalogService, useValue: mockCatalogService }
      ]
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch products with query params', () => {
    service
      .getProducts({ offset: 0, limit: 15, search: 'almohadilla', status: 'AVAILABLE' })
      .subscribe(res => {
        expect(res).toEqual([sampleProduct]);
      });

    const req = httpMock.expectOne(
      'http://localhost:8000/api/commerce/products/?offset=0&limit=15&search=almohadilla&status=AVAILABLE'
    );
    expect(req.request.method).toBe('GET');
    req.flush([sampleProduct]);
  });

  it('should fetch products count without pagination parameters', () => {
    service.getProductsCount({ search: 'reloj', status: 'AVAILABLE' }).subscribe(total => {
      expect(total).toBe(15);
    });

    const req = httpMock.expectOne(
      'http://localhost:8000/api/commerce/products/count?search=reloj&status=AVAILABLE'
    );
    expect(req.request.method).toBe('GET');
    req.flush({ total: 15 });
  });

  it('should load product page (data and count in parallel)', () => {
    service.loadProductPage({ offset: 0, limit: 10 }).subscribe(res => {
      expect(res.data).toEqual([sampleProduct]);
      expect(res.total).toBe(1);
    });

    const reqData = httpMock.expectOne('http://localhost:8000/api/commerce/products/?offset=0&limit=10');
    expect(reqData.request.method).toBe('GET');
    reqData.flush([sampleProduct]);

    const reqCount = httpMock.expectOne('http://localhost:8000/api/commerce/products/count');
    expect(reqCount.request.method).toBe('GET');
    reqCount.flush({ total: 1 });
  });

  it('should get product by ID', () => {
    service.getProductById('01a1c786-1122-3344-5566-778899aabbcc').subscribe(res => {
      expect(res).toEqual(sampleProduct);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/commerce/products/01a1c786-1122-3344-5566-778899aabbcc');
    expect(req.request.method).toBe('GET');
    req.flush(sampleProduct);
  });

  it('should get product by SKU', () => {
    service.getProductBySku('53').subscribe(res => {
      expect(res).toEqual(sampleProduct);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/commerce/products/by-sku/53');
    expect(req.request.method).toBe('GET');
    req.flush(sampleProduct);
  });

  it('should create product', () => {
    const payload: ProductCreatePayload = {
      master_product_id: '01a1c785-02b3-7641-bb12-9988aa112233',
      initial_quantity: 2,
      cost_price: 80.0
    };

    service.createProduct(payload).subscribe(res => {
      expect(res).toEqual(sampleProduct);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/commerce/products/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(sampleProduct);
  });

  it('should update product', () => {
    const payload: ProductUpdatePayload = {
      variant_name: 'Nueva Variante'
    };

    service.updateProduct('01a1c786-1122-3344-5566-778899aabbcc', payload).subscribe(res => {
      expect(res.variant_name).toBe('Nueva Variante');
    });

    const req = httpMock.expectOne('http://localhost:8000/api/commerce/products/01a1c786-1122-3344-5566-778899aabbcc');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush({ ...sampleProduct, variant_name: 'Nueva Variante' });
  });

  it('should delete product', () => {
    service.deleteProduct('01a1c786-1122-3344-5566-778899aabbcc').subscribe(res => {
      expect(res.message).toBe('Product deleted successfully');
    });

    const req = httpMock.expectOne('http://localhost:8000/api/commerce/products/01a1c786-1122-3344-5566-778899aabbcc');
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Product deleted successfully' });
  });

  it('should get product catalogs via bulk endpoint', () => {
    mockCatalogService.getBulkCatalogs.mockReturnValue(
      of({
        commerce_product_masters: [{ value: 'm-1', label: '#53 - Almohadilla' }],
        commerce_batches: [{ value: 'b-1', label: 'Ataúd 2' }],
        commerce_product_statuses: [{ value: 'AVAILABLE', label: 'Disponible' }],
        commerce_physical_conditions: [{ value: 'OPERATIONAL', label: 'Operativo' }]
      })
    );

    service.getProductCatalogs().subscribe(catalogs => {
      expect(catalogs.masterProducts.length).toBe(1);
      expect(catalogs.batches.length).toBe(1);
      expect(catalogs.statuses.length).toBe(1);
      expect(catalogs.physicalConditions.length).toBe(1);
    });

    expect(mockCatalogService.getBulkCatalogs).toHaveBeenCalledWith({
      commerce_product_masters: {},
      commerce_batches: {},
      commerce_product_statuses: {},
      commerce_physical_conditions: {}
    });
  });
});

