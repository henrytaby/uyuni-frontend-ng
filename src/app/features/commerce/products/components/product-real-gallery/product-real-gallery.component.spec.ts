import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationService, MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';

import { LoggerService } from '@core/services/logger.service';

import { ProductRealImage } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ProductRealGalleryComponent } from './product-real-gallery.component';

describe('ProductRealGalleryComponent', () => {
  let component: ProductRealGalleryComponent;
  let fixture: ComponentFixture<ProductRealGalleryComponent>;
  let productService: jest.Mocked<ProductService>;
  let messageService: jest.Mocked<MessageService>;
  let confirmationService: jest.Mocked<ConfirmationService>;

  const mockRealImages: ProductRealImage[] = [
    {
      id: 'real-img-1',
      product_id: 'prod-123',
      product_master_id: 'master-456',
      url: 'https://res.cloudinary.com/demo/image/upload/sample_real1.webp',
      public_id: 'real1',
      image_type: 'REAL',
      title: 'Foto Real 1',
      original_filename: 'foto1.jpg',
      file_size_bytes: 150000,
      width: 1000,
      height: 1000,
      format: 'webp',
      is_public: false,
      sort_order: 1,
      created_at: '2026-11-14T20:00:00Z'
    },
    {
      id: 'real-img-2',
      product_id: 'prod-123',
      product_master_id: 'master-456',
      url: 'https://res.cloudinary.com/demo/image/upload/sample_real2.webp',
      public_id: 'real2',
      image_type: 'REAL',
      title: 'Foto Real 2',
      original_filename: 'foto2.jpg',
      file_size_bytes: 250000,
      width: 1200,
      height: 1200,
      format: 'webp',
      is_public: true,
      sort_order: 2,
      created_at: '2026-11-14T20:05:00Z'
    }
  ];

  beforeEach(async () => {
    productService = {
      getImages: jest.fn().mockReturnValue(of(mockRealImages)),
      uploadImagesWithProgress: jest.fn(),
      reorderImages: jest.fn().mockReturnValue(of(mockRealImages)),
      togglePublic: jest.fn().mockReturnValue(of({ ...mockRealImages[0], is_public: true })),
      deleteImage: jest.fn().mockReturnValue(of({ message: 'Deleted' }))
    } as unknown as jest.Mocked<ProductService>;

    messageService = {
      add: jest.fn()
    } as unknown as jest.Mocked<MessageService>;

    confirmationService = {
      confirm: jest.fn()
    } as unknown as jest.Mocked<ConfirmationService>;

    const loggerService = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ProductRealGalleryComponent],
      providers: [
        { provide: ProductService, useValue: productService },
        { provide: MessageService, useValue: messageService },
        { provide: ConfirmationService, useValue: confirmationService },
        { provide: LoggerService, useValue: loggerService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductRealGalleryComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('productId', 'prod-123');
    fixture.componentRef.setInput('mode', 'edit');
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar la galería de imágenes reales al invocar loadGallery', () => {
    const emitSpy = jest.spyOn(component.imagesCountChange, 'emit');
    component.loadGallery('prod-123');

    expect(productService.getImages).toHaveBeenCalledWith('prod-123');
    expect(component.images().length).toBe(2);
    expect(emitSpy).toHaveBeenCalledWith(2);
  });

  it('debe alternar la visibilidad is_public con togglePublic', () => {
    component.images.set(mockRealImages);
    component.onToggleVisibility(mockRealImages[0], true);

    expect(productService.togglePublic).toHaveBeenCalledWith('prod-123', 'real-img-1', true);
    expect(messageService.add).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'success',
        summary: 'Visibilidad Actualizada'
      })
    );
  });

  it('debe revertir el cambio optimista si togglePublic falla', () => {
    productService.togglePublic.mockReturnValue(throwError(() => new Error('Error de red')));
    component.images.set(mockRealImages);

    component.onToggleVisibility(mockRealImages[0], true);

    expect(component.images()[0].is_public).toBe(false);
    expect(messageService.add).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'error',
        summary: 'Error'
      })
    );
  });

  it('debe reordenar imágenes reales correctamente', () => {
    component.images.set(mockRealImages);
    component.onReordered({
      previousIndex: 0,
      currentIndex: 1,
      items: [
        { ...mockRealImages[1], sort_order: 1 },
        { ...mockRealImages[0], sort_order: 2 }
      ]
    });

    expect(productService.reorderImages).toHaveBeenCalledWith('prod-123', [
      { id: 'real-img-2', sort_order: 1 },
      { id: 'real-img-1', sort_order: 2 }
    ]);
  });
});
