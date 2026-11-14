import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationService, MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';

import { LoggerService } from '@core/services/logger.service';

import { Product } from '@features/commerce/products/models/product.model';
import { ProductService } from '@features/commerce/products/services/product.service';

import { Batch } from '../../models/batch.model';
import { BatchService } from '../../services/batch.service';
import { BatchDrawerComponent } from './batch-drawer.component';

describe('BatchDrawerComponent', () => {
  let component: BatchDrawerComponent;
  let fixture: ComponentFixture<BatchDrawerComponent>;
  let batchService: jest.Mocked<BatchService>;
  let messageService: MessageService;
  let confirmationService: ConfirmationService;

  const mockLogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  };

  const sampleBatch: Batch = {
    id: '01a1b8dc-ddb0-71f4-bbec-6966db6633ef',
    code: 'CAJA-01',
    name: 'Caja Amazon Electrónicos',
    investment_round_id: '01a1b8dc-ddb0-71f4-bbec-6966db663300',
    provider: 'Amazon Liquidations',
    batch_type: 'Electrónicos',
    costing_method: 'WEIGHTED_RETAIL',
    purchase_date: '2026-11-14',
    purchase_price: 1500,
    freight_cost: 300,
    total_cost: 1800,
    currency: 'BOB',
    initial_items_count: 50,
    merma_items_count: 5,
    sellable_items_count: 45,
    unit_cost: 40,
    status: 'active',
    financial_status: 'EN_RECUPERACION',
    observations: 'Precinto intacto'
  };

  beforeEach(async () => {
    const batchServiceMock = {
      getBatchById: jest.fn().mockReturnValue(of(sampleBatch)),
      createBatch: jest.fn().mockReturnValue(of(sampleBatch)),
      updateBatch: jest.fn().mockReturnValue(of(sampleBatch)),
      deleteBatch: jest.fn().mockReturnValue(of({ message: 'Deleted' })),
      recalculateBatch: jest.fn().mockReturnValue(of(sampleBatch)),
      allocateRelativeCosts: jest.fn().mockReturnValue(of(sampleBatch))
    };

    const productServiceMock = {
      getProducts: jest.fn().mockReturnValue(of([]))
    };

    await TestBed.configureTestingModule({
      imports: [BatchDrawerComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
        ConfirmationService,
        { provide: BatchService, useValue: batchServiceMock },
        { provide: ProductService, useValue: productServiceMock },
        { provide: LoggerService, useValue: mockLogger }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BatchDrawerComponent);
    component = fixture.componentInstance;
    batchService = TestBed.inject(BatchService) as jest.Mocked<BatchService>;
    messageService = TestBed.inject(MessageService);
    confirmationService = TestBed.inject(ConfirmationService);
  });

  it('should initialize with default values', () => {
    expect(component).toBeTruthy();
    expect(component.costingMethod()).toBe('WEIGHTED_RETAIL');
    expect(component.isPurchasePriceDisabled()).toBe(false);
    expect(component.financialStatus()).toBe('EN_RECUPERACION');
    expect(component.status()).toBe('active');
    expect(component.codeValidation().isValid).toBe(true);
    expect(component.isMaximized()).toBe(false);
  });

  it('should toggle maximize state', () => {
    expect(component.isMaximized()).toBe(false);
    component.toggleMaximize();
    expect(component.isMaximized()).toBe(true);
    component.toggleMaximize();
    expect(component.isMaximized()).toBe(false);
  });

  describe('Pestaña 0: Identificación y Compra', () => {
    it('should have 3 costing method options', () => {
      expect(component.costingMethodOptions).toHaveLength(3);
      expect(component.costingMethodOptions[0].value).toBe('WEIGHTED_RETAIL');
      expect(component.costingMethodOptions[1].value).toBe('SPECIFIC_ITEM');
      expect(component.costingMethodOptions[2].value).toBe('FLAT_AVERAGE');
    });

    it('should allow code to be optional', () => {
      component.code.set('');
      component.name.set('Caja Sin Código Previo');
      component.purchasePrice.set(100);
      component.freightCost.set(20);

      expect(component.codeValidation().isValid).toBe(true);
      expect(component.nameValidation().isValid).toBe(true);
      expect(component.isFormValid()).toBe(true);
    });

    it('should send code as null when empty during create', () => {
      const messageSpy = jest.spyOn(messageService, 'add');
      component.code.set('   ');
      component.name.set('Nueva Caja');
      component.purchasePrice.set(500);

      component.saveBatch();

      expect(batchService.createBatch).toHaveBeenCalledWith(
        expect.objectContaining({
          code: null,
          name: 'Nueva Caja',
          costing_method: 'WEIGHTED_RETAIL'
        })
      );
      expect(messageSpy).toHaveBeenCalledWith(
        expect.objectContaining({ severity: 'success' })
      );
    });

    it('should format purchaseDate properly using datepicker Date object', () => {
      component.code.set('CAJA-10');
      component.name.set('Caja Con Fecha');
      component.purchaseDate.set(new Date(2026, 7, 15)); // 15 de Agosto de 2026

      component.saveBatch();

      expect(batchService.createBatch).toHaveBeenCalledWith(
        expect.objectContaining({
          purchase_date: '2026-08-15'
        })
      );
    });
  });

  describe('Pestaña 1: Costos y Rendimiento', () => {
    it('should disable purchase_price when costing_method is SPECIFIC_ITEM', () => {
      component.onCostingMethodChange('SPECIFIC_ITEM');

      expect(component.costingMethod()).toBe('SPECIFIC_ITEM');
      expect(component.isPurchasePriceDisabled()).toBe(true);
      expect(component.purchasePrice()).toBe(0);
    });

    it('should enable purchase_price for WEIGHTED_RETAIL and FLAT_AVERAGE', () => {
      component.onCostingMethodChange('FLAT_AVERAGE');
      expect(component.isPurchasePriceDisabled()).toBe(false);

      component.onCostingMethodChange('WEIGHTED_RETAIL');
      expect(component.isPurchasePriceDisabled()).toBe(false);
    });

    it('should calculate total cost accurately (purchase + freight)', () => {
      component.purchasePrice.set(1250.5);
      component.freightCost.set(249.5);

      expect(component.calculatedTotalCost()).toBe(1500);
    });

    it('should calculate sellable items and unit cost', () => {
      component.purchasePrice.set(1000);
      component.freightCost.set(200);
      component.initialItemsCount.set(30);
      component.mermaItemsCount.set(6);

      expect(component.calculatedSellableItems()).toBe(24);
      expect(component.calculatedUnitCost()).toBe(50); // 1200 / 24
    });

    it('should support currency options and default to BOB', () => {
      expect(component.currencyOptions).toHaveLength(2);
      expect(component.currencyOptions[0].value).toBe('BOB');
      expect(component.currencyOptions[1].value).toBe('USD');
      expect(component.currency()).toBe('BOB');

      component.currency.set('USD');
      expect(component.currency()).toBe('USD');
    });

    it('should sum unpacked product costs when switching to SPECIFIC_ITEM', () => {
      component.batchProducts.set([
        { id: 'p1', name: 'Prod 1', cost_price: 35, initial_quantity: 2 } as unknown as Product,
        { id: 'p2', name: 'Prod 2', cost_price: 50, initial_quantity: 1 } as unknown as Product
      ]);

      component.onCostingMethodChange('SPECIFIC_ITEM');
      expect(component.purchasePrice()).toBe(120); // (35 * 2) + (50 * 1) = 120
    });
  });

  describe('Pestaña 2: Estado y Sincronización', () => {
    it('should map financial status severities correctly', () => {
      expect(component.getFinancialStatusSeverity('RECUPERADO')).toBe('success');
      expect(component.getFinancialStatusSeverity('CASI_TABLAS')).toBe('warn');
      expect(component.getFinancialStatusSeverity('EN_RECUPERACION')).toBe('info');
      expect(component.getFinancialStatusSeverity('UNKNOWN')).toBe('secondary');
    });

    it('should map financial status labels correctly', () => {
      expect(component.getFinancialStatusLabel('RECUPERADO')).toBe('RECUPERADO');
      expect(component.getFinancialStatusLabel('CASI_TABLAS')).toBe('CASI TABLAS');
      expect(component.getFinancialStatusLabel('EN_RECUPERACION')).toBe('EN RECUPERACIÓN');
    });
  });

  describe('Pestaña 3: Productos Desempacados y Prorrateo Ponderado', () => {
    it('should call allocateRelativeCosts when user confirms in confirmAllocateRelativeCosts', () => {
      const messageSpy = jest.spyOn(messageService, 'add');
      jest.spyOn(confirmationService, 'confirm').mockImplementation(config => {
        if (config.accept) {
          (config.accept as () => void)();
        }
        return confirmationService;
      });

      component.freshBatch.set(sampleBatch);
      component.batchProducts.set([
        { id: 'p1', name: 'Prod 1', cost_price: 35, initial_quantity: 2 } as unknown as Product
      ]);

      component.confirmAllocateRelativeCosts();

      expect(batchService.allocateRelativeCosts).toHaveBeenCalledWith(
        sampleBatch.id,
        'official_price',
        true
      );
      expect(messageSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: 'success',
          summary: 'Costos Prorrateados'
        })
      );
    });
  });

  describe('Guardar y Guardar y Salir', () => {
    it('should close drawer when saveBatch(true) is invoked', () => {
      component.visible.set(true);
      component.name.set('Caja para Salir');
      component.purchasePrice.set(200);

      component.saveBatch(true);

      expect(batchService.createBatch).toHaveBeenCalled();
      expect(component.visible()).toBe(false);
    });

    it('should keep drawer open when saveBatch(false) is invoked', () => {
      component.visible.set(true);
      component.name.set('Caja para Continuar');
      component.purchasePrice.set(300);

      component.saveBatch(false);

      expect(batchService.createBatch).toHaveBeenCalled();
      expect(component.visible()).toBe(true);
    });
  });

  describe('Cierre y Protección de Cambios sin Guardar', () => {
    it('should close immediately on requestClose if not dirty', () => {
      component.visible.set(true);
      component.name.set(''); // Empty initial state in create mode
      expect(component.isDirty()).toBe(false);

      component.requestClose();
      expect(component.visible()).toBe(false);
    });

    it('should prompt confirmation on requestClose if dirty', () => {
      component.visible.set(true);
      component.name.set('Nombre Modificado');
      expect(component.isDirty()).toBe(true);

      const confirmSpy = jest.spyOn(confirmationService, 'confirm');
      component.requestClose();

      expect(confirmSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          header: 'Cambios sin guardar'
        })
      );
    });
  });

  describe('Eliminar Caja', () => {
    it('should display err.error.detail in toast when deleteBatch fails', () => {
      const errorResponse = {
        error: {
          detail: 'No se puede eliminar la caja porque contiene 8 producto(s) asociado(s).'
        }
      };
      batchService.deleteBatch.mockReturnValue(throwError(() => errorResponse));

      const messageSpy = jest.spyOn(messageService, 'add');
      jest.spyOn(confirmationService, 'confirm').mockImplementation(config => {
        if (config.accept) {
          (config.accept as () => void)();
        }
        return confirmationService;
      });

      // Set freshBatch to simulate editing batch
      component.freshBatch.set(sampleBatch);
      component.confirmDelete();

      expect(batchService.deleteBatch).toHaveBeenCalledWith(sampleBatch.id);
      expect(messageSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: 'error',
          summary: 'Error al Eliminar',
          detail: 'No se puede eliminar la caja porque contiene 8 producto(s) asociado(s).'
        })
      );
    });
  });
});
