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
import { Button } from 'primeng/button';
import { forkJoin } from 'rxjs';
import { LucideCheck, LucideStar } from '@lucide/angular';

import { LoggerService } from '@core/services/logger.service';

import { MediaGalleryComponent } from '@shared/components/media-gallery/media-gallery.component';
import { MediaGalleryReorderEvent } from '@shared/models/media-gallery.model';

import {
  ProductImage,
  ProductImageReorderItem
} from '../../models/product-master.model';
import { ProductMasterService } from '../../services/product-master.service';

@Component({
  selector: 'app-product-master-gallery',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Button,
    MediaGalleryComponent,
    LucideCheck,
    LucideStar
  ],
  templateUrl: './product-master-gallery.component.html',
  styleUrl: './product-master-gallery.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductMasterGalleryComponent {
  private readonly productMasterService = inject(ProductMasterService);
  private readonly messageService = inject(MessageService);
  private readonly logger = inject(LoggerService);

  readonly masterId = input<string | null>(null);
  readonly productName = input<string>('');
  readonly mode = input<'create' | 'edit'>('create');
  readonly isMaximized = input<boolean>(false);
  readonly images = model<ProductImage[]>([]);

  readonly coverImageChanged = output<{ masterId: string; coverUrl: string | null }>();
  readonly requestCreateProduct = output<void>();

  readonly isLoadingImages = signal<boolean>(false);
  readonly isUploadingImages = signal<boolean>(false);
  readonly uploadProgress = signal<number>(0);

  loadGallery(masterId: string, silent = false): void {
    if (!masterId) return;
    if (!silent) this.isLoadingImages.set(true);
    this.productMasterService.getImages(masterId, 'CATALOG').subscribe({
      next: imgs => {
        const catalogImgs = imgs.filter(
          img => !img.product_id && (img.image_type || '').toUpperCase() !== 'REAL'
        );
        this.images.set(catalogImgs);
        this.isLoadingImages.set(false);
        const cover = catalogImgs.find(i => i.is_cover);
        const newCoverUrl = cover ? cover.url : null;
        this.coverImageChanged.emit({ masterId, coverUrl: newCoverUrl });
      },
      error: err => {
        this.logger.error('Error fetching product images gallery', err, 'ProductMasterGalleryComponent');
        this.isLoadingImages.set(false);
      }
    });
  }

  onRefresh(): void {
    const id = this.masterId();
    if (id) {
      this.loadGallery(id);
    }
  }

  uploadSelectedFiles(validFiles: File[]): void {
    const prodId = this.masterId();
    if (!prodId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Ficha No Guardada',
        detail: 'Debe guardar la ficha maestra antes de subir fotografías.'
      });
      return;
    }

    if (validFiles.length === 0) return;

    this.isUploadingImages.set(true);
    this.uploadProgress.set(0);

    const hasCover = this.images().some(i => i.is_cover);
    const shouldSetCover = !hasCover;

    this.productMasterService.uploadImagesWithProgress(prodId, validFiles, 'CATALOG', shouldSetCover).subscribe({
      next: (event: HttpEvent<ProductImage[]>) => {
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
          const newImages = (event.body || []).filter(
            img => !img.product_id && (img.image_type || '').toUpperCase() !== 'REAL'
          );
          this.messageService.add({
            severity: 'success',
            summary: 'Subida Exitosa',
            detail: `Se subieron ${newImages.length} fotografía(s) al catálogo exitosamente.`
          });
          if (newImages.length > 0) {
            this.images.update(current => {
              const existingIds = new Set(current.map(i => i.id));
              const uniqueNew = newImages.filter(i => !existingIds.has(i.id));
              return [...current, ...uniqueNew];
            });
            const cover = this.images().find(i => i.is_cover);
            if (cover) {
              this.coverImageChanged.emit({ masterId: prodId, coverUrl: cover.url });
            }
          }
          this.loadGallery(prodId, true);
        }
      },
      error: err => {
        this.isUploadingImages.set(false);
        this.uploadProgress.set(0);
        this.logger.error('Error uploading product images', err, 'ProductMasterGalleryComponent');
        const detail = err?.error?.detail || 'Ocurrió un error al subir las imágenes al servidor.';
        this.messageService.add({
          severity: 'error',
          summary: 'Error de Subida',
          detail
        });
      }
    });
  }

  setAsCover(img: ProductImage): void {
    const prodId = this.masterId();
    if (!prodId) return;

    if (img.is_cover) {
      this.messageService.add({
        severity: 'info',
        summary: 'Portada Actual',
        detail: 'Esta fotografía ya es la portada oficial de la ficha maestra.'
      });
      return;
    }

    this.productMasterService.setCoverImage(prodId, img.id).subscribe({
      next: updatedCover => {
        this.images.update(list =>
          list.map(item => ({
            ...item,
            is_cover: item.id === updatedCover.id
          }))
        );

        this.coverImageChanged.emit({ masterId: prodId, coverUrl: updatedCover.url });

        this.messageService.add({
          severity: 'success',
          summary: 'Portada Actualizada',
          detail: 'La fotografía se asignó como portada oficial exitosamente.'
        });
      },
      error: err => {
        this.logger.error('Error setting cover image', err, 'ProductMasterGalleryComponent');
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo asignar la imagen como portada.'
        });
      }
    });
  }

  onReordered(event: MediaGalleryReorderEvent<ProductImage>): void {
    const prodId = this.masterId();
    if (!prodId) return;

    const previousImages = [...this.images()];
    const payload: ProductImageReorderItem[] = event.items.map(img => ({
      id: img.id,
      sort_order: img.sort_order
    }));

    this.productMasterService.reorderImages(prodId, payload).subscribe({
      next: confirmedImages => {
        const catalogImgs = confirmedImages.filter(
          img => !img.product_id && (img.image_type || '').toUpperCase() !== 'REAL'
        );
        this.images.set(catalogImgs);
        this.messageService.add({
          severity: 'info',
          summary: 'Orden Actualizado',
          detail: 'Se guardó la nueva posición de las fotografías.',
          life: 2000
        });
      },
      error: err => {
        this.images.set(previousImages);
        this.logger.error('Error reordering images', err, 'ProductMasterGalleryComponent');
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo guardar el nuevo orden de las fotografías.'
        });
      }
    });
  }

  onDeleteSingle(item: ProductImage): void {
    const prodId = this.masterId();
    if (!prodId) return;

    this.productMasterService.deleteImage(prodId, item.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Fotografía Eliminada',
          detail: 'La imagen fue removida del catálogo exitosamente.'
        });
        this.loadGallery(prodId);
      },
      error: err => {
        this.logger.error('Error deleting product image', err, 'ProductMasterGalleryComponent');
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar la imagen.'
        });
      }
    });
  }

  onDeleteMultiple(items: ProductImage[]): void {
    const prodId = this.masterId();
    if (!prodId || items.length === 0) return;

    forkJoin(items.map(img => this.productMasterService.deleteImage(prodId, img.id))).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Fotografías Eliminadas',
          detail: `Se eliminaron ${items.length} fotografías del catálogo exitosamente.`
        });
        this.loadGallery(prodId);
      },
      error: err => {
        this.logger.error('Error in bulk deleting product images', err, 'ProductMasterGalleryComponent');
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
