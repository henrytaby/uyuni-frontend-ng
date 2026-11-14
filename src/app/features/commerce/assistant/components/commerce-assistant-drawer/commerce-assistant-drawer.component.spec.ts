import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';

import { LoggerService } from '@core/services/logger.service';

import { ProductMasterService } from '@features/commerce/product-masters/services/product-master.service';

import {
  ChatAssistantResponse,
  ChatMessage,
  MatchedProduct
} from '../../models/assistant.model';
import { CommerceAssistantService } from '../../services/assistant.service';
import { CommerceAssistantDrawerComponent } from './commerce-assistant-drawer.component';

describe('CommerceAssistantDrawerComponent', () => {
  let component: CommerceAssistantDrawerComponent;
  let fixture: ComponentFixture<CommerceAssistantDrawerComponent>;
  let assistantService: jest.Mocked<CommerceAssistantService>;
  let messageService: MessageService;

  const mockLogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  };

  const sampleMatchedProduct: MatchedProduct = {
    item_number: 49,
    name: 'Estación de Carga 3 en 1',
    brand: 'Nanami',
    model: 'M31',
    available_stock: 3,
    sold_stock: 1,
    official_price: 220,
    published_price: 190,
    minimum_price: 180,
    currency: 'BOB',
    description: 'Cargador múltiple para celular y audífonos.'
  };

  const sampleResponse: ChatAssistantResponse = {
    reply: 'Tenemos **3 unidades** en stock de la estación Nanami.',
    provider_used: 'groq',
    model_used: 'openai/gpt-oss-120b',
    matched_products: [sampleMatchedProduct],
    fallback_occurred: false
  };

  beforeEach(async () => {
    const serviceMock = {
      sendMessage: jest.fn(),
      getProviders: jest.fn().mockReturnValue(
        of({
          default_provider: 'groq',
          configured_providers: ['groq', 'mistral'],
          all_providers: ['groq', 'mistral', 'gemini']
        })
      )
    };

    const productMasterServiceMock = {
      getProductMasterByNumber: jest.fn().mockReturnValue(
        of({
          id: '1',
          item_number: 49,
          name: 'Estación de Carga 3 en 1',
          official_price: 220,
          published_price: 190,
          minimum_price: 180,
          currency: 'BOB'
        })
      )
    };

    await TestBed.configureTestingModule({
      imports: [CommerceAssistantDrawerComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
        { provide: CommerceAssistantService, useValue: serviceMock },
        { provide: ProductMasterService, useValue: productMasterServiceMock },
        { provide: LoggerService, useValue: mockLogger }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CommerceAssistantDrawerComponent);
    component = fixture.componentInstance;
    assistantService = TestBed.inject(CommerceAssistantService) as unknown as jest.Mocked<CommerceAssistantService>;
    messageService = TestBed.inject(MessageService);
  });

  it('should create the assistant drawer component', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization and providers', () => {
    it('should load configured providers on init', () => {
      component.ngOnInit();
      expect(assistantService.getProviders).toHaveBeenCalled();
      expect(component.selectedProvider()).toBe('groq');
      expect(component.providerOptions().length).toBe(2);
    });
  });

  describe('sendMessage', () => {
    it('should not send message if text is empty', () => {
      component.userInput.set('   ');
      component.sendMessage();
      expect(assistantService.sendMessage).not.toHaveBeenCalled();
    });

    it('should send user message, update chat history, and receive assistant reply', () => {
      assistantService.sendMessage.mockReturnValue(of(sampleResponse));

      component.userInput.set('¿Tenemos cargadores?');
      component.sendMessage();

      expect(assistantService.sendMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          message: '¿Tenemos cargadores?',
          provider: 'groq',
          include_stock_data: true
        })
      );

      expect(component.messages().length).toBe(2);
      expect(component.messages()[0].role).toBe('user');
      expect(component.messages()[0].content).toBe('¿Tenemos cargadores?');
      expect(component.messages()[1].role).toBe('assistant');
      expect(component.messages()[1].content).toBe(sampleResponse.reply);
      expect(component.messages()[1].matchedProducts).toEqual([sampleMatchedProduct]);
      expect(component.userInput()).toBe('');
      expect(component.isLoading()).toBe(false);
    });

    it('should handle error from backend gracefully', () => {
      jest.spyOn(messageService, 'add');
      assistantService.sendMessage.mockReturnValue(
        throwError(() => ({ error: { detail: 'API Key de Groq inválida' } }))
      );

      component.userInput.set('¿Hay stock?');
      component.sendMessage();

      expect(component.isLoading()).toBe(false);
      expect(component.messages().length).toBe(2);
      expect(component.messages()[1].content).toContain('API Key de Groq inválida');
      expect(messageService.add).toHaveBeenCalledWith(
        expect.objectContaining({ severity: 'error', summary: 'Error del Asistente' })
      );
    });
  });

  describe('Actions & helpers', () => {
    it('should clear chat messages', () => {
      component.messages.set([
        { id: '1', role: 'user', content: 'test', timestamp: new Date() }
      ]);
      component.clearChat();
      expect(component.messages()).toEqual([]);
    });

    it('should toggle maximize', () => {
      expect(component.isMaximized()).toBe(false);
      component.toggleMaximize();
      expect(component.isMaximized()).toBe(true);
      component.toggleMaximize();
      expect(component.isMaximized()).toBe(false);
    });

    it('should close drawer', () => {
      component.visible.set(true);
      component.closeDrawer();
      expect(component.visible()).toBe(false);
    });

    it('should emit openProduct when handleOpenProduct is called', () => {
      const emitSpy = jest.spyOn(component.openProduct, 'emit');
      component.handleOpenProduct(49);
      expect(emitSpy).toHaveBeenCalledWith(49);
    });

    it('should copy product summary to clipboard', async () => {
      const writeTextMock = jest.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock
        }
      });

      component.copyProductSummary(sampleMatchedProduct);

      expect(writeTextMock).toHaveBeenCalledWith(expect.stringContaining('[#49] Estación de Carga 3 en 1'));
      await Promise.resolve();
      expect(component.copiedProductId()).toBe(49);
    });

    it('should copy message content to clipboard', async () => {
      const writeTextMock = jest.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock
        }
      });

      const msg: ChatMessage = {
        id: 'msg-1',
        role: 'assistant',
        content: 'Respuesta de prueba',
        timestamp: new Date()
      };

      component.copyMessageContent(msg);

      expect(writeTextMock).toHaveBeenCalledWith('Respuesta de prueba');
      await Promise.resolve();
      expect(component.copiedMessageId()).toBe('msg-1');
    });

    it('should copy full conversation to clipboard', async () => {
      const writeTextMock = jest.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock
        }
      });

      component.messages.set([
        { id: '1', role: 'user', content: '¿Stock?', timestamp: new Date() },
        { id: '2', role: 'assistant', content: 'Hay 5.', timestamp: new Date(), providerUsed: 'groq' }
      ]);

      component.copyFullConversation();

      expect(writeTextMock).toHaveBeenCalledWith(expect.stringContaining('¿Stock?'));
      expect(writeTextMock).toHaveBeenCalledWith(expect.stringContaining('Hay 5.'));
    });

    it('should format markdown securely and sanitize HTML entities', () => {
      const raw = '<script>alert("hack")</script> **Texto en Negrita** y *cursiva*\n• Viñeta 1';
      const formatted = component.formatMarkdown(raw);

      expect(formatted).not.toContain('<script>');
      expect(formatted).toContain('&lt;script&gt;');
      expect(formatted).toContain('<strong class="font-bold text-gray-900 dark:text-gray-100">Texto en Negrita</strong>');
      expect(formatted).toContain('<em class="italic">cursiva</em>');
      expect(formatted).toContain('<li class="text-gray-700 dark:text-gray-300 leading-relaxed">Viñeta 1</li>');
    });

    it('should format markdown tables into styled HTML tables', () => {
      const tableMd = `
| Catálogo | Descripción | Stock | Precio |
|---|---|---|---|
| #215 | Pastilla LED | 1 | 35.00 |
`;
      const formatted = component.formatMarkdown(tableMd);

      expect(formatted).toContain('<table');
      expect(formatted).toContain('<th class="px-3 py-2 font-bold text-gray-700 dark:text-gray-200 whitespace-nowrap">Catálogo</th>');
      expect(formatted).toContain('<th class="px-3 py-2 font-bold text-gray-700 dark:text-gray-200 whitespace-nowrap">Precio</th>');
      expect(formatted).toContain('#215');
      expect(formatted).toContain('Pastilla LED');
      expect(formatted).toContain('35.00');
    });

    it('should format headings and blockquotes', () => {
      const md = '## Productos Disponibles\n> Nota: Solo stock real.';
      const formatted = component.formatMarkdown(md);

      expect(formatted).toContain('<h3 class="text-xs sm:text-sm font-bold text-brand-700 dark:text-brand-300 mt-3 mb-1.5">Productos Disponibles</h3>');
      expect(formatted).toContain('border-l-3 border-brand-500');
      expect(formatted).toContain('Nota: Solo stock real.');
    });
  });
});
