import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ConfigService } from '@core/config/config.service';
import { LoggerService } from '@core/services/logger.service';

import {
  CategoryCreatePayload,
  CategoryUpdatePayload,
  ChannelCreatePayload,
  CommerceCategory,
  CommerceChannel,
  CommerceLiveBasket,
  CommerceRound,
  LiveBasketCreatePayload,
  RoundCreatePayload
} from '../models/commerce-catalog.model';
import { CommerceCatalogService } from './commerce-catalog.service';

describe('CommerceCatalogService', () => {
  let service: CommerceCatalogService;
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CommerceCatalogService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ConfigService, useValue: mockConfigService },
        { provide: LoggerService, useValue: mockLogger }
      ]
    });

    service = TestBed.inject(CommerceCatalogService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // 1. Categories
  describe('Categories', () => {
    const sampleCategory: CommerceCategory = {
      id: 'cat-1',
      code: 'ELEC',
      name: 'Electrónica',
      icon: '🎧',
      description: 'Auriculares y audio',
      typical_products: 'Audífonos'
    };

    it('should fetch categories with params', () => {
      service.getCategories({ offset: 0, limit: 10, search: 'ELEC' }).subscribe(res => {
        expect(res).toEqual([sampleCategory]);
      });

      const req = httpMock.expectOne('http://localhost:8000/api/commerce/categories/?offset=0&limit=10&search=ELEC');
      expect(req.request.method).toBe('GET');
      req.flush([sampleCategory]);
    });

    it('should create a category', () => {
      const payload: CategoryCreatePayload = { code: 'ELEC', name: 'Electrónica' };
      service.createCategory(payload).subscribe(res => {
        expect(res).toEqual(sampleCategory);
      });

      const req = httpMock.expectOne('http://localhost:8000/api/commerce/categories/');
      expect(req.request.method).toBe('POST');
      req.flush(sampleCategory);
    });

    it('should update a category', () => {
      const payload: CategoryUpdatePayload = { name: 'Electrónica Avanzada' };
      service.updateCategory('cat-1', payload).subscribe(res => {
        expect(res.name).toBe('Electrónica Avanzada');
      });

      const req = httpMock.expectOne('http://localhost:8000/api/commerce/categories/cat-1');
      expect(req.request.method).toBe('PUT');
      req.flush({ ...sampleCategory, name: 'Electrónica Avanzada' });
    });

    it('should delete a category', () => {
      service.deleteCategory('cat-1').subscribe(res => {
        expect(res.message).toBe('Deleted');
      });

      const req = httpMock.expectOne('http://localhost:8000/api/commerce/categories/cat-1');
      expect(req.request.method).toBe('DELETE');
      req.flush({ message: 'Deleted' });
    });
  });

  // 2. Channels
  describe('Channels', () => {
    const sampleChannel: CommerceChannel = {
      id: 'ch-1',
      code: 'TIKTOK',
      name: 'TikTok Live',
      description: 'Remates en vivo',
      is_active: true
    };

    it('should fetch channels', () => {
      service.getChannels({ offset: 0, limit: 10 }).subscribe(res => {
        expect(res).toEqual([sampleChannel]);
      });

      const req = httpMock.expectOne('http://localhost:8000/api/commerce/channels/?offset=0&limit=10');
      expect(req.request.method).toBe('GET');
      req.flush([sampleChannel]);
    });

    it('should create a channel', () => {
      const payload: ChannelCreatePayload = { code: 'TIKTOK', name: 'TikTok Live', is_active: true };
      service.createChannel(payload).subscribe(res => {
        expect(res).toEqual(sampleChannel);
      });

      const req = httpMock.expectOne('http://localhost:8000/api/commerce/channels/');
      expect(req.request.method).toBe('POST');
      req.flush(sampleChannel);
    });

    it('should delete a channel', () => {
      service.deleteChannel('ch-1').subscribe(res => {
        expect(res.message).toBe('Deleted');
      });

      const req = httpMock.expectOne('http://localhost:8000/api/commerce/channels/ch-1');
      expect(req.request.method).toBe('DELETE');
      req.flush({ message: 'Deleted' });
    });
  });

  // 3. Live Baskets
  describe('Live Baskets', () => {
    const sampleBasket: CommerceLiveBasket = {
      id: 'lb-1',
      code: 'C1',
      name: 'Taller & Auto',
      label: 'Canasta 1 - Taller & Auto',
      description: 'Herramientas',
      price_range: 'Bs. 40 - 200',
      target_audience: 'Mecánicos'
    };

    it('should fetch live baskets', () => {
      service.getLiveBaskets({ offset: 0, limit: 10 }).subscribe(res => {
        expect(res).toEqual([sampleBasket]);
      });

      const req = httpMock.expectOne('http://localhost:8000/api/commerce/live-baskets/?offset=0&limit=10');
      expect(req.request.method).toBe('GET');
      req.flush([sampleBasket]);
    });

    it('should create a live basket', () => {
      const payload: LiveBasketCreatePayload = {
        code: 'C1',
        name: 'Taller & Auto',
        label: 'Canasta 1 - Taller & Auto'
      };
      service.createLiveBasket(payload).subscribe(res => {
        expect(res).toEqual(sampleBasket);
      });

      const req = httpMock.expectOne('http://localhost:8000/api/commerce/live-baskets/');
      expect(req.request.method).toBe('POST');
      req.flush(sampleBasket);
    });

    it('should delete a live basket', () => {
      service.deleteLiveBasket('lb-1').subscribe(res => {
        expect(res.message).toBe('Deleted');
      });

      const req = httpMock.expectOne('http://localhost:8000/api/commerce/live-baskets/lb-1');
      expect(req.request.method).toBe('DELETE');
      req.flush({ message: 'Deleted' });
    });
  });

  // 4. Rounds
  describe('Investment Rounds', () => {
    const sampleRound: CommerceRound = {
      id: 'rnd-1',
      code: 'RONDA-1',
      name: 'Ronda Semilla',
      disbursement_date: '2026-01-15',
      capital_invested: 50000.0,
      currency: 'BOB',
      status: 'active',
      observations: 'Primera inyección'
    };

    it('should fetch investment rounds', () => {
      service.getRounds({ offset: 0, limit: 10 }).subscribe(res => {
        expect(res).toEqual([sampleRound]);
      });

      const req = httpMock.expectOne('http://localhost:8000/api/commerce/rounds/?offset=0&limit=10');
      expect(req.request.method).toBe('GET');
      req.flush([sampleRound]);
    });

    it('should create a round', () => {
      const payload: RoundCreatePayload = {
        code: 'RONDA-1',
        name: 'Ronda Semilla',
        capital_invested: 50000.0
      };
      service.createRound(payload).subscribe(res => {
        expect(res).toEqual(sampleRound);
      });

      const req = httpMock.expectOne('http://localhost:8000/api/commerce/rounds/');
      expect(req.request.method).toBe('POST');
      req.flush(sampleRound);
    });

    it('should delete a round', () => {
      service.deleteRound('rnd-1').subscribe(res => {
        expect(res.message).toBe('Deleted');
      });

      const req = httpMock.expectOne('http://localhost:8000/api/commerce/rounds/rnd-1');
      expect(req.request.method).toBe('DELETE');
      req.flush({ message: 'Deleted' });
    });
  });
});

