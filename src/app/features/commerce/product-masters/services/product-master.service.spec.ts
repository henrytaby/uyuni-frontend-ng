import { HttpEventType, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { ConfigService } from '@core/config/config.service';
import { CatalogService } from '@core/services/catalog.service';
import { LoggerService } from '@core/services/logger.service';

import {
  ProductImage,
  ProductMaster,
  ProductMasterCreatePayload,
  ProductMasterExternalLink,
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

  describe('Multimedia Gallery & Cloudinary endpoints', () => {
    const sampleImage: ProductImage = {
      id: 'img-1',
      product_master_id: '01a1c785-02b3-7641-bb12-9988aa112233',
      url: 'https://res.cloudinary.com/novalabs-bo/image/upload/v1/uyuni/products/53/catalog/img1.webp',
      public_id: 'uyuni/products/53/catalog/img1',
      image_type: 'CATALOG',
      title: 'img1.webp',
      original_filename: 'img1.jpg',
      file_size_bytes: 120000,
      width: 1200,
      height: 1200,
      format: 'webp',
      is_cover: true,
      sort_order: 1
    };

    it('should upload images with progress tracking', done => {
      const file = new File(['dummy content'], 'photo.jpg', { type: 'image/jpeg' });

      service
        .uploadImagesWithProgress('01a1c785-02b3-7641-bb12-9988aa112233', [file], 'CATALOG', true)
        .subscribe(event => {
          if (event.type === HttpEventType.Response) {
            expect(event.body).toEqual([sampleImage]);
            done();
          }
        });

      const req = httpMock.expectOne('http://localhost:8000/api/commerce/product-masters/01a1c785-02b3-7641-bb12-9988aa112233/images');
      expect(req.request.method).toBe('POST');
      expect(req.request.reportProgress).toBe(true);
      req.flush([sampleImage]);
    });

    it('should get product images', () => {
      service.getImages('01a1c785-02b3-7641-bb12-9988aa112233', 'CATALOG').subscribe(images => {
        expect(images).toEqual([sampleImage]);
      });

      const req = httpMock.expectOne('http://localhost:8000/api/commerce/product-masters/01a1c785-02b3-7641-bb12-9988aa112233/images?image_type=CATALOG');
      expect(req.request.method).toBe('GET');
      req.flush([sampleImage]);
    });

    it('should set cover image', () => {
      service.setCoverImage('01a1c785-02b3-7641-bb12-9988aa112233', 'img-1').subscribe(res => {
        expect(res.is_cover).toBe(true);
      });

      const req = httpMock.expectOne('http://localhost:8000/api/commerce/product-masters/01a1c785-02b3-7641-bb12-9988aa112233/images/img-1/cover');
      expect(req.request.method).toBe('PATCH');
      req.flush({ ...sampleImage, is_cover: true });
    });

    it('should delete image', () => {
      service.deleteImage('01a1c785-02b3-7641-bb12-9988aa112233', 'img-1').subscribe(res => {
        expect(res.message).toBe('Fotografía eliminada exitosamente');
      });

      const req = httpMock.expectOne('http://localhost:8000/api/commerce/product-masters/01a1c785-02b3-7641-bb12-9988aa112233/images/img-1');
      expect(req.request.method).toBe('DELETE');
      req.flush({ message: 'Fotografía eliminada exitosamente' });
    });

    it('should reorder images', () => {
      const items = [{ id: 'img-1', sort_order: 1 }];
      service.reorderImages('01a1c785-02b3-7641-bb12-9988aa112233', items).subscribe(images => {
        expect(images.length).toBe(1);
      });

      const req = httpMock.expectOne('http://localhost:8000/api/commerce/product-masters/01a1c785-02b3-7641-bb12-9988aa112233/images/reorder');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(items);
      req.flush([sampleImage]);
    });
  });

  describe('External Links and Marketplace endpoints', () => {
    const sampleLink: ProductMasterExternalLink = {
      id: 'link-1',
      product_master_id: '01a1c785-02b3-7641-bb12-9988aa112233',
      url: 'https://www.facebook.com/marketplace/item/123456/',
      portal: 'FACEBOOK',
      link_type: 'MARKETPLACE',
      label: 'Marketplace - Liz',
      is_primary: true,
      is_public: true,
      sort_order: 1,
      created_at: '2026-11-14T00:00:00Z',
      updated_at: '2026-11-14T00:00:00Z'
    };

    it('should get external links with filters', () => {
      service
        .getExternalLinks('01a1c785-02b3-7641-bb12-9988aa112233', {
          link_type: 'MARKETPLACE',
          only_public: false
        })
        .subscribe(links => {
          expect(links).toEqual([sampleLink]);
        });

      const req = httpMock.expectOne(
        'http://localhost:8000/api/commerce/product-masters/01a1c785-02b3-7641-bb12-9988aa112233/links?link_type=MARKETPLACE&only_public=false'
      );
      expect(req.request.method).toBe('GET');
      req.flush([sampleLink]);
    });

    it('should add external link', () => {
      const payload = {
        url: 'https://www.amazon.es/dp/B08N5WRWNW',
        link_type: 'REFERENCE',
        label: 'Amazon Oficial',
        is_public: true
      };

      service.addExternalLink('01a1c785-02b3-7641-bb12-9988aa112233', payload).subscribe(link => {
        expect(link.portal).toBe('AMAZON');
      });

      const req = httpMock.expectOne('http://localhost:8000/api/commerce/product-masters/01a1c785-02b3-7641-bb12-9988aa112233/links');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      req.flush({ ...sampleLink, portal: 'AMAZON', link_type: 'REFERENCE' });
    });

    it('should update external link', () => {
      const payload = { label: 'Nuevo Label', is_public: false };

      service
        .updateExternalLink('01a1c785-02b3-7641-bb12-9988aa112233', 'link-1', payload)
        .subscribe(res => {
          expect(res.label).toBe('Nuevo Label');
        });

      const req = httpMock.expectOne(
        'http://localhost:8000/api/commerce/product-masters/01a1c785-02b3-7641-bb12-9988aa112233/links/link-1'
      );
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(payload);
      req.flush({ ...sampleLink, label: 'Nuevo Label', is_public: false });
    });

    it('should set primary external link', () => {
      service.setPrimaryExternalLink('01a1c785-02b3-7641-bb12-9988aa112233', 'link-1').subscribe(res => {
        expect(res.is_primary).toBe(true);
      });

      const req = httpMock.expectOne(
        'http://localhost:8000/api/commerce/product-masters/01a1c785-02b3-7641-bb12-9988aa112233/links/link-1/primary'
      );
      expect(req.request.method).toBe('PATCH');
      req.flush({ ...sampleLink, is_primary: true });
    });

    it('should reorder external links', () => {
      const items = [{ id: 'link-1', sort_order: 1 }];

      service.reorderExternalLinks('01a1c785-02b3-7641-bb12-9988aa112233', items).subscribe(res => {
        expect(res.length).toBe(1);
      });

      const req = httpMock.expectOne(
        'http://localhost:8000/api/commerce/product-masters/01a1c785-02b3-7641-bb12-9988aa112233/links/reorder'
      );
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(items);
      req.flush([sampleLink]);
    });

    it('should delete external link', () => {
      service.deleteExternalLink('01a1c785-02b3-7641-bb12-9988aa112233', 'link-1').subscribe(res => {
        expect(res.message).toBe('Enlace eliminado exitosamente');
      });

      const req = httpMock.expectOne(
        'http://localhost:8000/api/commerce/product-masters/01a1c785-02b3-7641-bb12-9988aa112233/links/link-1'
      );
      expect(req.request.method).toBe('DELETE');
      req.flush({ message: 'Enlace eliminado exitosamente' });
    });
  });
});


