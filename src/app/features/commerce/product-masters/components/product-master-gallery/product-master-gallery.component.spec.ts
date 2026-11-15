import { HttpResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationService, MessageService } from 'primeng/api';
import { of } from 'rxjs';

import { LoggerService } from '@core/services/logger.service';

import { ProductImage } from '../../models/product-master.model';
import { ProductMasterService } from '../../services/product-master.service';
import { ProductMasterGalleryComponent } from './product-master-gallery.component';

describe('ProductMasterGalleryComponent', () => {
  let component: ProductMasterGalleryComponent;
  let fixture: ComponentFixture<ProductMasterGalleryComponent>;
  let productMasterService: jest.Mocked<ProductMasterService>;
  let messageService: jest.Mocked<MessageService>;
  let confirmationService: jest.Mocked<ConfirmationService>;

  const mockCatalogImages: ProductImage[] = [
    {
      id: 'img-1',
      product_master_id: 'master-123',
      url: 'https://res.cloudinary.com/demo/image/upload/sample1.webp',
      public_id: 'sample1',
      image_type: 'CATALOG',
      title: 'Foto 1',
      original_filename: 'foto1.jpg',
      file_size_bytes: 100000,
      width: 1000,
      height: 1000,
      format: 'webp',
      is_cover: true,
      sort_order: 1,
      created_at: '2026-11-14T20:00:00Z'
    }
  ];

  const mockNewImage: ProductImage = {
    id: 'img-2',
    product_master_id: 'master-123',
    url: 'https://res.cloudinary.com/demo/image/upload/sample2.webp',
    public_id: 'sample2',
    image_type: 'CATALOG',
    title: 'Foto 2',
    original_filename: 'foto2.jpg',
    file_size_bytes: 150000,
    width: 1200,
    height: 1200,
    format: 'webp',
    is_cover: false,
    sort_order: 2,
    created_at: '2026-11-14T20:05:00Z'
  };

  beforeEach(async () => {
    productMasterService = {
      getImages: jest.fn().mockReturnValue(of(mockCatalogImages)),
      uploadImagesWithProgress: jest.fn(),
      setCoverImage: jest.fn().mockReturnValue(of({ ...mockNewImage, is_cover: true })),
      reorderImages: jest.fn().mockReturnValue(of([...mockCatalogImages, mockNewImage])),
      deleteImage: jest.fn().mockReturnValue(of({ message: 'Deleted' }))
    } as unknown as jest.Mocked<ProductMasterService>;

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
      imports: [ProductMasterGalleryComponent],
      providers: [
        { provide: ProductMasterService, useValue: productMasterService },
        { provide: MessageService, useValue: messageService },
        { provide: ConfirmationService, useValue: confirmationService },
        { provide: LoggerService, useValue: loggerService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductMasterGalleryComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('masterId', 'master-123');
    fixture.componentRef.setInput('mode', 'edit');
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar la galería de imágenes de catálogo al invocar loadGallery', () => {
    const coverSpy = jest.spyOn(component.coverImageChanged, 'emit');
    component.loadGallery('master-123');

    expect(productMasterService.getImages).toHaveBeenCalledWith('master-123', 'CATALOG');
    expect(component.images().length).toBe(1);
    expect(coverSpy).toHaveBeenCalledWith({
      masterId: 'master-123',
      coverUrl: mockCatalogImages[0].url
    });
  });

  it('NO debe borrar visualmente las fotos existentes al subir una nueva foto', () => {
    // Estado inicial: 1 foto existente en la galería
    component.images.set([...mockCatalogImages]);
    expect(component.images().length).toBe(1);

    // Mock del servicio que devuelve la nueva foto subida
    const uploadResponse = new HttpResponse<ProductImage[]>({
      body: [mockNewImage],
      status: 201
    });
    productMasterService.uploadImagesWithProgress.mockReturnValue(of(uploadResponse));

    // Mock de getImages que devuelve las 2 fotos consolidadas en backend
    productMasterService.getImages.mockReturnValue(of([...mockCatalogImages, mockNewImage]));

    const file = new File(['content'], 'foto2.jpg', { type: 'image/jpeg' });
    component.uploadSelectedFiles([file]);

    // La galería debe conservar la foto previa y añadir la nueva (2 fotos en total, no solo la nueva)
    expect(component.images().length).toBe(2);
    expect(component.images().some(img => img.id === 'img-1')).toBe(true);
    expect(component.images().some(img => img.id === 'img-2')).toBe(true);
    expect(productMasterService.getImages).toHaveBeenCalledWith('master-123', 'CATALOG');
  });

  it('debe asignar portada correctamente', () => {
    component.images.set([...mockCatalogImages, mockNewImage]);
    component.setAsCover(mockNewImage);

    expect(productMasterService.setCoverImage).toHaveBeenCalledWith('master-123', 'img-2');
    expect(component.images().find(i => i.id === 'img-2')?.is_cover).toBe(true);
    expect(component.images().find(i => i.id === 'img-1')?.is_cover).toBe(false);
  });
});
