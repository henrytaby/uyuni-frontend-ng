import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationService, MessageService } from 'primeng/api';
import { of } from 'rxjs';

import { LoggerService } from '@core/services/logger.service';

import { Batch } from '@features/commerce/batches/models/batch.model';
import { BatchService } from '@features/commerce/batches/services/batch.service';
import { ProductMaster } from '@features/commerce/product-masters/models/product-master.model';
import { ProductMasterService } from '@features/commerce/product-masters/services/product-master.service';

import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ProductDrawerComponent } from './product-drawer.component';

describe('ProductDrawerComponent', () => {
  let component: ProductDrawerComponent;
  let fixture: ComponentFixture<ProductDrawerComponent>;
  let productService: jest.Mocked<ProductService>;
  let productMasterService: jest.Mocked<ProductMasterService>;
  let batchService: jest.Mocked<BatchService>;
  let messageService: MessageService;
  let confirmationService: ConfirmationService;

  beforeAll(() => {
    global.ResizeObserver = class {
      observe = jest.fn();
      unobserve = jest.fn();
      disconnect = jest.fn();
    } as unknown as typeof ResizeObserver;
  });

  const mockLogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  };

  const sampleBatchAmazon: Batch = {
    id: 'batch-amazon',
    code: 'ATAUD-1',
    name: 'Ataud 1 Amazon',
    costing_method: 'WEIGHTED_RETAIL',
    purchase_price: 2000,
    freight_cost: 300,
    total_cost: 2300,
    currency: 'BOB',
    initial_items_count: 50,
    merma_items_count: 2,
    sellable_items_count: 48,
    unit_cost: 46,
    status: 'active',
    financial_status: 'EN_RECUPERACION'
  };

  const sampleBatchBazar: Batch = {
    id: 'batch-bazar',
    code: 'BAZAR-1',
    name: 'Bazar Central',
    costing_method: 'SPECIFIC_ITEM',
    purchase_price: 500,
    freight_cost: 50,
    total_cost: 550,
    currency: 'BOB',
    initial_items_count: 10,
    merma_items_count: 0,
    sellable_items_count: 10,
    unit_cost: 55,
    status: 'active',
    financial_status: 'EN_RECUPERACION'
  };

  const sampleMaster: ProductMaster = {
    id: 'master-001',
    item_number: 14,
    name: 'Audífonos Bluetooth Inalámbricos',
    code: 'AUD-014',
    official_price: 180,
    published_price: 150,
    minimum_price: 120,
    currency: 'BOB',
    cover_image_url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
    is_reviewed: true,
    is_fb_verified: false,
    has_video: false,
    is_published_marketplace: true,
    is_whatsapp_published: false,
    is_active: true,
    total_available_stock: 5,
    total_sold_stock: 4,
    total_merma_stock: 1
  };

  const sampleProduct: Product = {
    id: 'prod-001',
    name: 'Audífonos Bluetooth Inalámbricos',
    variant_name: 'Color Negro',
    item_number: 14,
    master_code: 'AUD-014',
    image_url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
    category_name: 'Audio & Sonido',
    batch_id: 'batch-amazon',
    batch_code: 'ATAUD-1',
    batch_name: 'Ataud 1',
    currency: 'BOB',
    official_price: 180,
    published_price: 150,
    minimum_price: 120,
    cost_price: 60,
    estimated_margin: 90,
    discount_margin: 30,
    initial_quantity: 10,
    sold_quantity: 4,
    merma_quantity: 1,
    available_quantity: 5,
    status: 'AVAILABLE',
    physical_condition: 'OPERATIONAL',
    defect_detail: null,
    is_reviewed: true,
    master_product_id: 'master-001',
    sheet_row_id: 14
  };

  beforeEach(async () => {
    const productServiceMock = {
      getProductById: jest.fn().mockReturnValue(of(sampleProduct)),
      createProduct: jest.fn().mockReturnValue(of(sampleProduct)),
      updateProduct: jest.fn().mockReturnValue(of(sampleProduct)),
      deleteProduct: jest.fn().mockReturnValue(of({ message: 'Deleted' })),
      getImages: jest.fn().mockReturnValue(of([])),
      uploadImagesWithProgress: jest.fn().mockReturnValue(of([])),
      reorderImages: jest.fn().mockReturnValue(of([])),
      togglePublic: jest.fn().mockReturnValue(of({})),
      deleteImage: jest.fn().mockReturnValue(of({ message: 'Deleted' }))
    };

    const productMasterServiceMock = {
      getProductMasterById: jest.fn().mockReturnValue(of(sampleMaster))
    };

    const batchServiceMock = {
      getBatchById: jest.fn().mockImplementation((id: string) => {
        if (id === 'batch-bazar') return of(sampleBatchBazar);
        return of(sampleBatchAmazon);
      })
    };

    await TestBed.configureTestingModule({
      imports: [ProductDrawerComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
        ConfirmationService,
        { provide: ProductService, useValue: productServiceMock },
        { provide: ProductMasterService, useValue: productMasterServiceMock },
        { provide: BatchService, useValue: batchServiceMock },
        { provide: LoggerService, useValue: mockLogger }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDrawerComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService) as unknown as jest.Mocked<ProductService>;
    productMasterService = TestBed.inject(ProductMasterService) as unknown as jest.Mocked<ProductMasterService>;
    batchService = TestBed.inject(BatchService) as unknown as jest.Mocked<BatchService>;
    messageService = TestBed.inject(MessageService);
    confirmationService = TestBed.inject(ConfirmationService);
  });

  it('should create the component with initial defaults', () => {
    expect(component).toBeTruthy();
    expect(component.visible()).toBe(false);
    expect(component.activeTab()).toBe('0');
    expect(component.isMaximized()).toBe(false);
    expect(component.isDirty()).toBe(false);
  });

  describe('Dynamic Rule 1: Costing Method & Cost Price Behavior', () => {
    it('should disable costPrice if batch has WEIGHTED_RETAIL costing method (Amazon)', () => {
      component.onBatchChange('batch-amazon');
      expect(batchService.getBatchById).toHaveBeenCalledWith('batch-amazon');
      expect(component.costingMethod()).toBe('WEIGHTED_RETAIL');
      expect(component.isCostPriceDisabled()).toBe(true);
      expect(component.costPriceValidation().isValid).toBe(true);
    });

    it('should enable and require costPrice if batch has SPECIFIC_ITEM costing method (Bazar)', () => {
      component.onBatchChange('batch-bazar');
      expect(batchService.getBatchById).toHaveBeenCalledWith('batch-bazar');
      expect(component.costingMethod()).toBe('SPECIFIC_ITEM');
      expect(component.isCostPriceDisabled()).toBe(false);

      component.costPrice.set(null);
      expect(component.costPriceValidation().isValid).toBe(false);

      component.costPrice.set(45.5);
      expect(component.costPriceValidation().isValid).toBe(true);
    });
  });

  describe('Dynamic Rule 2: Automatic 100% Status Calculation', () => {
    it('should calculate AVAILABLE when stock is remaining', () => {
      component.initialQuantity.set(10);
      component.soldQuantity.set(2);
      component.mermaQuantity.set(1);

      expect(component.calculatedAvailableQuantity()).toBe(7);
      expect(component.calculatedProductStatus()).toEqual({
        value: 'AVAILABLE',
        label: 'Disponible',
        severity: 'success'
      });
    });

    it('should calculate SOLD_OUT when available is 0 and sold > 0', () => {
      component.initialQuantity.set(5);
      component.soldQuantity.set(5);
      component.mermaQuantity.set(0);

      expect(component.calculatedAvailableQuantity()).toBe(0);
      expect(component.calculatedProductStatus()).toEqual({
        value: 'SOLD_OUT',
        label: 'Agotado',
        severity: 'secondary'
      });
    });

    it('should calculate SCRAPPED when all items are declared as merma', () => {
      component.initialQuantity.set(4);
      component.soldQuantity.set(0);
      component.mermaQuantity.set(4);

      expect(component.calculatedAvailableQuantity()).toBe(0);
      expect(component.calculatedProductStatus()).toEqual({
        value: 'SCRAPPED',
        label: 'Merma Total (Baja)',
        severity: 'danger'
      });
    });
  });

  describe('Dynamic Rule 3: Intelligent Prefilling from Master Product', () => {
    it('should prefill publishedPrice and minimumPrice when master product is selected in create mode', () => {
      fixture.componentRef.setInput('mode', 'create');
      component.onMasterProductChange('master-001');

      expect(productMasterService.getProductMasterById).toHaveBeenCalledWith('master-001');
      expect(component.publishedPrice()).toBe(150);
      expect(component.minimumPrice()).toBe(120);
      expect(component.selectedMasterProduct()).toEqual(sampleMaster);
    });
  });

  describe('Dynamic Rule 4: Real-time Margin Calculations', () => {
    it('should compute estimated margin and discount margin in real time', () => {
      component.publishedPrice.set(200);
      component.minimumPrice.set(160);
      component.costPrice.set(80);

      expect(component.estimatedMargin()).toBe(120); // 200 - 80
      expect(component.discountMargin()).toBe(40); // 200 - 160
    });

    it('should return 0 discountMargin when publishedPrice equals minimumPrice', () => {
      component.publishedPrice.set(150);
      component.minimumPrice.set(150);
      expect(component.discountMargin()).toBe(0);
    });
  });

  describe('Validations and Auto-Scrap Rule', () => {
    it('should invalidate if publishedPrice < minimumPrice', () => {
      component.publishedPrice.set(100);
      component.minimumPrice.set(120); // Piso mayor a venta
      expect(component.pricingValidation().isValid).toBe(false);
    });

    it('should invalidate if initialQuantity < soldQuantity in edit mode', () => {
      fixture.componentRef.setInput('mode', 'edit');
      component.soldQuantity.set(6);
      component.initialQuantity.set(4);
      expect(component.quantityValidation().isValid).toBe(false);
    });

    it('should auto-switch physicalCondition to DAMAGED_SCRAP when merma equals initial', () => {
      component.initialQuantity.set(5);
      component.physicalCondition.set('OPERATIONAL');

      component.onMermaQuantityChange(5);
      expect(component.physicalCondition()).toBe('DAMAGED_SCRAP');
    });
  });

  describe('Save and Delete operations', () => {
    it('should save product and send calculated status in payload', () => {
      const msgSpy = jest.spyOn(messageService, 'add');
      fixture.componentRef.setInput('mode', 'edit');
      fixture.componentRef.setInput('product', sampleProduct);
      fixture.componentRef.setInput('visible', true);
      fixture.detectChanges();

      component.publishedPrice.set(160);
      component.minimumPrice.set(130);
      component.saveProduct(true);

      expect(productService.updateProduct).toHaveBeenCalledWith(
        sampleProduct.id,
        expect.objectContaining({
          published_price: 160,
          minimum_price: 130,
          status: 'AVAILABLE'
        })
      );
      expect(msgSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: 'success',
          summary: 'Producto Actualizado'
        })
      );
      expect(component.visible()).toBe(false);
    });

    it('should delete product on confirmDelete', () => {
      jest.spyOn(confirmationService, 'confirm').mockImplementation(config => {
        if (config.accept) {
          (config.accept as () => void)();
        }
        return confirmationService;
      });

      fixture.componentRef.setInput('mode', 'edit');
      fixture.componentRef.setInput('product', sampleProduct);
      fixture.componentRef.setInput('visible', true);
      fixture.detectChanges();

      component.confirmDelete();
      expect(productService.deleteProduct).toHaveBeenCalledWith(sampleProduct.id);
      expect(component.visible()).toBe(false);
    });
  });

  describe('Backdrop click and Escape key dismissal', () => {
    it('should call requestClose on document:keydown.escape when visible', () => {
      const closeSpy = jest.spyOn(component, 'requestClose');
      fixture.componentRef.setInput('visible', true);
      fixture.detectChanges();

      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      component.onEscapeKey(escapeEvent);
      expect(closeSpy).toHaveBeenCalled();
    });

    it('should call requestClose on document:click when clicking p-drawer-mask', () => {
      const closeSpy = jest.spyOn(component, 'requestClose');
      fixture.componentRef.setInput('visible', true);
      fixture.detectChanges();

      const mockMask = document.createElement('div');
      mockMask.className = 'p-drawer-mask';
      const clickEvent = { target: mockMask } as unknown as MouseEvent;

      component.onDocumentClick(clickEvent);
      expect(closeSpy).toHaveBeenCalled();
    });
  });

  describe('parseMasterItem helper', () => {
    it('should parse label with # prefix correctly', () => {
      const res = component.parseMasterItem({
        value: 'prod-186',
        label: '#186 - Adaptador Multitoma de Pared 5 en 1'
      });
      expect(res.itemNumber).toBe('#186');
      expect(res.name).toBe('Adaptador Multitoma de Pared 5 en 1');
    });

    it('should parse label without # prefix and normalize with #', () => {
      const res = component.parseMasterItem({
        value: 'prod-14',
        label: '14 - Audífonos Inalámbricos Microlab'
      });
      expect(res.itemNumber).toBe('#14');
      expect(res.name).toBe('Audífonos Inalámbricos Microlab');
    });

    it('should handle label without number pattern', () => {
      const res = component.parseMasterItem({
        value: 'prod-raw',
        label: 'Producto Sin Número de Ítem'
      });
      expect(res.itemNumber).toBe('');
      expect(res.name).toBe('Producto Sin Número de Ítem');
    });

    it('should handle string id lookup from masterProducts input', () => {
      fixture.componentRef.setInput('masterProducts', [
        { value: 'm-186', label: '#186 - Adaptador Multitoma' }
      ]);
      fixture.detectChanges();

      const res = component.parseMasterItem('m-186');
      expect(res.itemNumber).toBe('#186');
      expect(res.name).toBe('Adaptador Multitoma');
    });

    it('should return empty values when input is null or empty', () => {
      expect(component.parseMasterItem(null)).toEqual({ itemNumber: '', name: '' });
      expect(component.parseMasterItem(undefined)).toEqual({ itemNumber: '', name: '' });
    });
  });
});
