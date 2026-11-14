import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { ProductMaster } from '../models/product-master.model';
import { ProductMasterService } from './product-master.service';
import { ProductMasterFormStore } from './product-master-form.store';

describe('ProductMasterFormStore', () => {
  let store: ProductMasterFormStore;
  let mockProductMasterService: Partial<ProductMasterService>;

  const mockProduct: ProductMaster = {
    id: 'pm-123',
    item_number: 45,
    code: 'SKU-001',
    name: 'Cámara WiFi 360',
    description: 'Cámara de seguridad para interiores',
    category_id: 'cat-1',
    live_basket_id: 'basket-1',
    brand: 'Anker',
    model: 'Eufy 2K',
    official_price: 320,
    published_price: 270,
    minimum_price: 250,
    currency: 'BOB',
    cover_image_url: 'https://res.cloudinary.com/test.jpg',
    marketplace_url: 'https://facebook.com/share/item1',
    external_info_url: 'https://amazon.com/dp/item1',
    features: '• 2K Resolution\n• Night vision',
    marketing_details: 'Ideal para transmisiones en vivo',
    is_reviewed: true,
    is_fb_verified: false,
    has_video: false,
    is_published_marketplace: true,
    is_whatsapp_published: true,
    is_active: true,
    total_available_stock: 5,
    total_sold_stock: 10,
    total_merma_stock: 1,
    images: [],
    reference_links: [],
    marketplace_links: []
  };

  beforeEach(() => {
    mockProductMasterService = {
      getProductMasterById: jest.fn().mockReturnValue(of(mockProduct)),
      createProductMaster: jest.fn(),
      updateProductMaster: jest.fn(),
      deleteProductMaster: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        ProductMasterFormStore,
        { provide: ProductMasterService, useValue: mockProductMasterService }
      ]
    });

    store = TestBed.inject(ProductMasterFormStore);
  });

  it('debe crearse correctamente con valores iniciales por defecto', () => {
    expect(store).toBeTruthy();
    expect(store.mode()).toBe('create');
    expect(store.name()).toBe('');
    expect(store.isDirty()).toBe(false);
  });

  it('debe inicializar el formulario con los datos de una Ficha Maestra existente', () => {
    store.initForm(mockProduct, 'edit');

    expect(store.mode()).toBe('edit');
    expect(store.itemNumber()).toBe(45);
    expect(store.name()).toBe('Cámara WiFi 360');
    expect(store.officialPrice()).toBe(320);
    expect(store.publishedPrice()).toBe(270);
    expect(store.minimumPrice()).toBe(250);
    expect(store.isDirty()).toBe(false);
  });

  it('debe detectar cambios no guardados cuando se modifica un campo', () => {
    store.initForm(mockProduct, 'edit');
    expect(store.isDirty()).toBe(false);

    store.name.set('Nombre comercial modificado');
    expect(store.isDirty()).toBe(true);

    store.name.set('Cámara WiFi 360');
    expect(store.isDirty()).toBe(false);
  });

  describe('Validaciones', () => {
    it('debe validar el nombre comercial (mínimo 3 caracteres)', () => {
      store.name.set('');
      expect(store.nameValidation().isValid).toBe(false);
      expect(store.nameValidation().error).toBe('El nombre comercial es obligatorio');

      store.name.set('AB');
      expect(store.nameValidation().isValid).toBe(false);
      expect(store.nameValidation().error).toBe('El nombre debe tener al menos 3 caracteres');

      store.name.set('Producto Válido');
      expect(store.nameValidation().isValid).toBe(true);
    });

    it('debe validar que los precios no sean negativos', () => {
      store.officialPrice.set(-10);
      expect(store.priceValidation().isValid).toBe(false);

      store.officialPrice.set(100);
      expect(store.priceValidation().isValid).toBe(true);
    });

    it('debe alertar con warning si el precio mínimo es mayor al precio publicado', () => {
      store.officialPrice.set(300);
      store.publishedPrice.set(200);
      store.minimumPrice.set(250); // Mínimo mayor a publicado

      const validation = store.priceValidation();
      expect(validation.isValid).toBe(true);
      expect(validation.warning).toBe('El precio mínimo protegido es mayor al precio publicado de venta');
    });
  });

  describe('Cálculos derivados', () => {
    it('debe calcular el stock total histórico como la suma de disponibles + vendidas + mermas', () => {
      store.initForm(mockProduct, 'edit');

      expect(store.totalAvailableStock()).toBe(5);
      expect(store.totalSoldStock()).toBe(10);
      expect(store.totalMermaStock()).toBe(1);
      expect(store.totalHistoricalStock()).toBe(16); // 5 + 10 + 1
    });

    it('debe calcular el margen de regateo basado estrictamente en el Precio Publicado', () => {
      store.publishedPrice.set(270);
      store.minimumPrice.set(250);

      const margin = store.negotiationMargin();
      expect(margin.hasMargin).toBe(true);
      expect(margin.amount).toBe(20); // 270 - 250
      expect(margin.percentage).toBeCloseTo((20 / 270) * 100);
    });

    it('debe indicar margen 0 cuando el precio publicado es igual al piso mínimo', () => {
      store.publishedPrice.set(250);
      store.minimumPrice.set(250);

      const margin = store.negotiationMargin();
      expect(margin.hasMargin).toBe(false);
      expect(margin.amount).toBe(0);
      expect(margin.percentage).toBe(0);
    });
  });

  describe('Generación de Payloads', () => {
    it('debe generar el payload de creación completo', () => {
      store.initForm(null, 'create');
      store.name.set('Nuevo Producto');
      store.officialPrice.set(150);
      store.publishedPrice.set(120);
      store.minimumPrice.set(100);

      const payload = store.buildCreatePayload();
      expect(payload.name).toBe('Nuevo Producto');
      expect(payload.official_price).toBe(150);
      expect(payload.published_price).toBe(120);
      expect(payload.minimum_price).toBe(100);
      expect(payload.is_active).toBe(true);
    });

    it('debe generar el payload de actualización completo', () => {
      store.initForm(mockProduct, 'edit');
      store.name.set('Cámara 360 Pro');

      const payload = store.buildUpdatePayload();
      expect(payload.name).toBe('Cámara 360 Pro');
      expect(payload.official_price).toBe(320);
    });
  });
});
