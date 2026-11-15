import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationService, MessageService } from 'primeng/api';

import { LoggerService } from '@core/services/logger.service';

import { MediaGalleryItem } from '@shared/models/media-gallery.model';

import { MediaGalleryComponent } from './media-gallery.component';

describe('MediaGalleryComponent', () => {
  let component: MediaGalleryComponent<MediaGalleryItem>;
  let fixture: ComponentFixture<MediaGalleryComponent<MediaGalleryItem>>;
  let messageService: jest.Mocked<MessageService>;
  let confirmationService: jest.Mocked<ConfirmationService>;

  const mockItems: MediaGalleryItem[] = [
    {
      id: 'img-1',
      url: 'https://res.cloudinary.com/demo/image/upload/sample1.webp',
      title: 'Foto 1',
      sort_order: 1,
      width: 800,
      height: 800,
      file_size_bytes: 102400,
      format: 'webp'
    },
    {
      id: 'img-2',
      url: 'https://res.cloudinary.com/demo/image/upload/sample2.webp',
      title: 'Foto 2',
      sort_order: 2,
      width: 1200,
      height: 1200,
      file_size_bytes: 204800,
      format: 'webp'
    }
  ];

  beforeEach(async () => {
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
      imports: [MediaGalleryComponent],
      providers: [
        { provide: MessageService, useValue: messageService },
        { provide: ConfirmationService, useValue: confirmationService },
        { provide: LoggerService, useValue: loggerService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MediaGalleryComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('mode', 'edit');
    fixture.componentRef.setInput('items', mockItems);
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
    expect(component.items().length).toBe(2);
  });

  it('debe alternar la selección individual de una fotografía', () => {
    expect(component.selectedCount()).toBe(0);

    component.toggleSelect('img-1');
    expect(component.selectedCount()).toBe(1);
    expect(component.selectedIds().has('img-1')).toBe(true);

    component.toggleSelect('img-1');
    expect(component.selectedCount()).toBe(0);
    expect(component.selectedIds().has('img-1')).toBe(false);
  });

  it('debe seleccionar y deseleccionar todas las fotos', () => {
    component.toggleSelectAll();
    expect(component.selectedCount()).toBe(2);
    expect(component.isAllSelected()).toBe(true);

    component.toggleSelectAll();
    expect(component.selectedCount()).toBe(0);
    expect(component.isAllSelected()).toBe(false);
  });

  it('debe formatear bytes correctamente', () => {
    expect(component.formatBytes(0)).toBe('0 B');
    expect(component.formatBytes(1024)).toBe('1 KB');
    expect(component.formatBytes(1048576)).toBe('1 MB');
  });

  it('debe abrir y cerrar la vista previa modal gestionando el estado de carga y error', () => {
    component.openPreview(mockItems[0]);
    expect(component.previewImage()).toEqual(mockItems[0]);
    expect(component.isModalImageLoading()).toBe(true);
    expect(component.hasModalImageError()).toBe(false);

    component.onModalImageLoaded();
    expect(component.isModalImageLoading()).toBe(false);
    expect(component.hasModalImageError()).toBe(false);

    component.onModalImageError();
    expect(component.isModalImageLoading()).toBe(false);
    expect(component.hasModalImageError()).toBe(true);

    component.closePreview();
    expect(component.previewImage()).toBeNull();
    expect(component.isModalImageLoading()).toBe(true);
  });

  it('debe activar estado de eliminación en las tarjetas al confirmar borrado masivo y limpiarse al actualizar items', () => {
    component.toggleSelectAll();
    expect(component.selectedCount()).toBe(2);

    confirmationService.confirm.mockImplementation(options => {
      if (options.accept) options.accept();
      return confirmationService;
    });

    const emitSpy = jest.spyOn(component.deleteMultiple, 'emit');
    component.confirmBulkDelete();

    expect(component.isBulkDeleting()).toBe(true);
    expect(component.deletingIds().has('img-1')).toBe(true);
    expect(component.deletingIds().has('img-2')).toBe(true);
    expect(emitSpy).toHaveBeenCalledWith(mockItems);

    // Al recibir la lista vacía tras el borrado en backend
    fixture.componentRef.setInput('items', []);
    fixture.detectChanges();

    expect(component.isBulkDeleting()).toBe(false);
    expect(component.deletingIds().size).toBe(0);
    expect(component.selectedCount()).toBe(0);
  });

  it('debe podar automáticamente IDs seleccionados cuando la lista de items cambia', () => {
    component.toggleSelectAll();
    expect(component.selectedCount()).toBe(2);

    // Se simula la eliminación en backend y la lista vuelve vacía
    fixture.componentRef.setInput('items', []);
    fixture.detectChanges();

    expect(component.selectedCount()).toBe(0);
    expect(component.selectedIds().size).toBe(0);
  });

  it('debe gestionar placeholders optimistas con vista previa durante la subida de fotos', () => {
    const file = new File(['dummy content'], 'test-image.jpg', { type: 'image/jpeg' });
    const originalCreateObjectURL = URL.createObjectURL;
    const originalRevokeObjectURL = URL.revokeObjectURL;

    const mockCreateObjectURL = jest.fn().mockReturnValue('blob:http://localhost/test-uuid');
    const mockRevokeObjectURL = jest.fn();

    URL.createObjectURL = mockCreateObjectURL;
    URL.revokeObjectURL = mockRevokeObjectURL;

    const emitSpy = jest.spyOn(component.filesDropped, 'emit');

    const fakeEvent = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      dataTransfer: {
        files: [file]
      }
    } as unknown as DragEvent;
    component.onDrop(fakeEvent);

    expect(emitSpy).toHaveBeenCalledWith([file]);
    expect(component.uploadingPlaceholders().length).toBe(1);
    expect(component.uploadingPlaceholders()[0].fileName).toBe('test-image.jpg');

    // Sin isUploading=true, activePlaceholders es vacío
    expect(component.activePlaceholders().length).toBe(0);

    // Cuando el contenedor activa isUploading=true
    fixture.componentRef.setInput('isUploading', true);
    fixture.detectChanges();

    expect(component.activePlaceholders().length).toBe(1);
    expect(component.uploadingCount()).toBe(1);

    // Cuando la subida finaliza o se cancela
    fixture.componentRef.setInput('isUploading', false);
    fixture.detectChanges();

    expect(component.activePlaceholders().length).toBe(0);
    expect(component.uploadingPlaceholders().length).toBe(0);
    expect(mockRevokeObjectURL).toHaveBeenCalled();

    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
  });
});
