import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ConfigService } from '@core/config/config.service';
import { LoggerService } from '@core/services/logger.service';

import {
  AssistantProvidersResponse,
  ChatAssistantRequest,
  ChatAssistantResponse
} from '../models/assistant.model';
import { CommerceAssistantService } from './assistant.service';

describe('CommerceAssistantService', () => {
  let service: CommerceAssistantService;
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
        CommerceAssistantService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ConfigService, useValue: mockConfigService },
        { provide: LoggerService, useValue: mockLogger }
      ]
    });

    service = TestBed.inject(CommerceAssistantService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send chat message to assistant', () => {
    const requestPayload: ChatAssistantRequest = {
      message: '¿Hay stock de cargadores?',
      history: [{ role: 'user', content: 'Hola' }],
      provider: 'groq',
      include_stock_data: true
    };

    const mockResponse: ChatAssistantResponse = {
      reply: 'Tenemos 15 cargadores en stock.',
      provider_used: 'groq',
      model_used: 'openai/gpt-oss-120b',
      matched_products: [
        {
          item_number: 88,
          name: 'Cargador Baseus',
          available_stock: 15,
          sold_stock: 5,
          official_price: 55,
          minimum_price: 45,
          currency: 'BOB'
        }
      ],
      fallback_occurred: false
    };

    service.sendMessage(requestPayload).subscribe(res => {
      expect(res).toEqual(mockResponse);
      expect(res.matched_products.length).toBe(1);
      expect(res.matched_products[0].available_stock).toBe(15);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/commerce/assistant/chat');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(requestPayload);
    req.flush(mockResponse);
  });

  it('should fetch configured providers', () => {
    const mockProviders: AssistantProvidersResponse = {
      default_provider: 'groq',
      configured_providers: ['groq', 'mistral'],
      all_providers: ['groq', 'mistral', 'gemini']
    };

    service.getProviders().subscribe(res => {
      expect(res).toEqual(mockProviders);
      expect(res.default_provider).toBe('groq');
      expect(res.configured_providers).toContain('mistral');
    });

    const req = httpMock.expectOne('http://localhost:8000/api/commerce/assistant/providers');
    expect(req.request.method).toBe('GET');
    req.flush(mockProviders);
  });
});
