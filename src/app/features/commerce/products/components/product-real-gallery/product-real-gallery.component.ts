import { CommonModule } from '@angular/common';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
  output,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Tooltip } from 'primeng/tooltip';
import { forkJoin } from 'rxjs';
import { LucideCopy, LucideGlobe, LucideLock } from '@lucide/angular';

import { LoggerService } from '@core/services/logger.service';

import { MediaGalleryComponent } from '@shared/components/media-gallery/media-gallery.component';
import { MediaGalleryReorderEvent } from '@shared/models/media-gallery.model';

import { ImageReorderItem, ProductRealImage } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-real-gallery',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToggleSwitch,
    Tooltip,
    MediaGalleryComponent,
    LucideGlobe,
    LucideLock,
    LucideCopy
  ],
  templateUrl: './product-real-gallery.component.html',
  styleUrl: './product-real-gallery.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductRealGalleryComponent {
  private readonly productService = inject(ProductService);
  private readonly messageService = inject(MessageService);
  private readonly logger = inject(LoggerService);

  readonly productId = input<string | null>(null);
  readonly productName = input<string>('');
  readonly mode = input<'create' | 'edit'>('create');
  readonly isMaximized = input<boolean>(false);
  readonly images = model<ProductRealImage[]>([]);

  readonly requestNavigateToInfo = output<void>();
  readonly imagesCountChange = output<number>();

  readonly isLoadingImages = signal<boolean>(false);
  readonly isUploadingImages = signal<boolean>(false);
  readonly uploadProgress = signal<number>(0);

  loadGallery(prodId: string): void {
    if (!prodId) return;
    this.isLoadingImages.set(true);
    this.productService.getImages(prodId).subscribe({
      next: imgs => {
        this.images.set(imgs);
        this.imagesCountChange.emit(imgs.length);
        this.isLoadingImages.set(false);
      },
      error: err => {
        this.logger.error('Error fetching product real images', err, 'ProductRealGalleryComponent');
        this.isLoadingImages.set(false);
      }
    });
  }

  onRefresh(): void {
    const id = this.productId();
    if (id) {
      this.loadGallery(id);
    }
  }

  uploadSelectedFiles(validFiles: File[]): void {
    const prodId = this.productId();
    if (!prodId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Producto No Guardado',
        detail: 'Debe guardar el producto físico antes de subir fotografías reales.'
      });
      return;
    }

    if (validFiles.length === 0) return;

    this.isUploadingImages.set(true);
    this.uploadProgress.set(0);

    this.productService.uploadImagesWithProgress(prodId, validFiles, false).subscribe({
      next: (event: HttpEvent<ProductRealImage[]>) => {
        if (event.type === HttpEventType.UploadProgress) {
          const total = event.total || 0;
          if (total > 0) {
            const percent = Math.round((100 * event.loaded) / total);
            this.uploadProgress.set(percent);
          } else {
            this.uploadProgress.set(50);
          }
        } else if (event.type === HttpEventType.Response) {
          this.isUploadingImages.set(false);
          this.uploadProgress.set(100);
          const newImages = event.body || [];
          this.messageService.add({
            severity: 'success',
            summary: 'Subida Exitosa',
            detail: `Se subieron ${newImages.length} fotografía(s) reales exitosamente.`
          });
          if (newImages.length > 0) {
            this.images.set(newImages);
            this.imagesCountChange.emit(newImages.length);
          } else {
            this.loadGallery(prodId);
          }
        }
      },
      error: err => {
        this.isUploadingImages.set(false);
        this.uploadProgress.set(0);
        this.logger.error('Error uploading product real images', err, 'ProductRealGalleryComponent');
        const detail = err?.error?.detail || 'Ocurrió un error al subir las imágenes reales al servidor.';
        this.messageService.add({
          severity: 'error',
          summary: 'Error de Subida',
          detail
        });
      }
    });
  }

  onToggleVisibility(img: ProductRealImage, isPublic: boolean): void {
    const prodId = this.productId();
    if (!prodId) return;

    const previousValue = img.is_public;

    // Actualización optimista
    this.images.update(list =>
      list.map(item => (item.id === img.id ? { ...item, is_public: isPublic } : item))
    );

    this.productService.togglePublic(prodId, img.id, isPublic).subscribe({
      next: updated => {
        this.images.update(list =>
          list.map(item => (item.id === updated.id ? { ...item, is_public: updated.is_public } : item))
        );
        this.messageService.add({
          severity: 'success',
          summary: 'Visibilidad Actualizada',
          detail: updated.is_public
            ? 'La fotografía ahora es pública para el catálogo.'
            : 'La fotografía ahora es privada (solo uso interno de almacén).',
          life: 2500
        });
      },
      error: err => {
        // Revertir optimismo
        this.images.update(list =>
          list.map(item => (item.id === img.id ? { ...item, is_public: previousValue } : item))
        );
        this.logger.error('Error updating real image visibility', err, 'ProductRealGalleryComponent');
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cambiar la visibilidad de la imagen.'
        });
      }
    });
  }

  async copyImageUrl(url: string): Promise<void> {
    if (!url) return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }

      this.messageService.add({
        severity: 'info',
        summary: 'Enlace Copiado',
        detail: 'URL de la imagen copiada al portapapeles para compartir con el cliente.',
        life: 2500
      });
    } catch {
      this.messageService.add({
        severity: 'warn',
        summary: 'No se pudo copiar',
        detail: 'Copie manualmente el enlace desde el navegador.'
      });
    }
  }

  onReordered(event: MediaGalleryReorderEvent<ProductRealImage>): void {
    const prodId = this.productId();
    if (!prodId) return;

    const previousImages = [...this.images()];
    const payload: ImageReorderItem[] = event.items.map(img => ({
      id: img.id,
      sort_order: img.sort_order
    }));

    this.productService.reorderImages(prodId, payload).subscribe({
      next: confirmedImages => {
        this.images.set(confirmedImages);
        this.messageService.add({
          severity: 'info',
          summary: 'Orden Actualizado',
          detail: 'Se guardó la nueva posición de las fotografías.',
          life: 2000
        });
      },
      error: err => {
        this.images.set(previousImages);
        this.logger.error('Error reordering product real images', err, 'ProductRealGalleryComponent');
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo guardar el nuevo orden de las fotografías.'
        });
      }
    });
  }

  onDeleteSingle(item: ProductRealImage): void {
    const prodId = this.productId();
    if (!prodId) return;

    this.productService.deleteImage(prodId, item.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Fotografía Eliminada',
          detail: 'La imagen fue eliminada exitosamente.'
        });
        this.loadGallery(prodId);
      },
      error: err => {
        this.logger.error('Error deleting product real image', err, 'ProductRealGalleryComponent');
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar la imagen.'
        });
      }
    });
  }

  onDeleteMultiple(items: ProductRealImage[]): void {
    const prodId = this.productId();
    if (!prodId || items.length === 0) return;

    forkJoin(items.map(img => this.productService.deleteImage(prodId, img.id))).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Fotografías Eliminadas',
          detail: `Se eliminaron ${items.length} fotografías reales exitosamente.`
        });
        this.loadGallery(prodId);
      },
      error: err => {
        this.logger.error('Error in bulk deleting product real images', err, 'ProductRealGalleryComponent');
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ocurrió un problema al eliminar algunas fotografías.'
        });
        this.loadGallery(prodId);
      }
    });
  }
}
