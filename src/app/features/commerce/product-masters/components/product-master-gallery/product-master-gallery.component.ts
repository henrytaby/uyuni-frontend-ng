import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDragPreview,
  CdkDropList,
  moveItemInArray
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ConfirmationService, MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { ProgressBar } from 'primeng/progressbar';
import { Tooltip } from 'primeng/tooltip';
import { forkJoin } from 'rxjs';
import {
  LucideCheck,
  LucideCloudUpload,
  LucideExternalLink,
  LucideEye,
  LucideGripVertical,
  LucideImage,
  LucideImages,
  LucideRefreshCw,
  LucideStar,
  LucideTrash2,
  LucideX
} from '@lucide/angular';

import { LoggerService } from '@core/services/logger.service';

import { CloudinaryUrlPipe } from '@shared/pipe/cloudinary-url.pipe';
import { createZipArchive, ZipFileEntry } from '@shared/utils/zip.utils';

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
    ProgressBar,
    Dialog,
    Tooltip,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    CdkDragPreview,
    CloudinaryUrlPipe,
    LucideImages,
    LucideRefreshCw,
    LucideCloudUpload,
    LucideImage,
    LucideX,
    LucideCheck,
    LucideStar,
    LucideGripVertical,
    LucideEye,
    LucideTrash2,
    LucideExternalLink
  ],
  templateUrl: './product-master-gallery.component.html',
  styleUrl: './product-master-gallery.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductMasterGalleryComponent {
  private readonly productMasterService = inject(ProductMasterService);
  private readonly confirmationService = inject(ConfirmationService);
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
  readonly isDragOver = signal<boolean>(false);
  readonly previewImage = signal<ProductImage | null>(null);
  readonly isDownloadingImage = signal<boolean>(false);
  readonly isReorderingImages = signal<boolean>(false);
  readonly selectedImageIds = signal<Set<string>>(new Set());
  readonly isBulkDeleting = signal<boolean>(false);
  readonly isDownloadingZip = signal<boolean>(false);
  readonly zipProgress = signal<string>('');

  readonly selectedCount = computed(() => this.selectedImageIds().size);
  readonly isAllSelected = computed(
    () => this.images().length > 0 && this.selectedImageIds().size === this.images().length
  );
  readonly hasSelectedCover = computed(() => {
    const selected = this.selectedImageIds();
    return this.images().some(img => img.is_cover && selected.has(img.id));
  });

  loadGallery(masterId: string): void {
    if (!masterId) return;
    this.isLoadingImages.set(true);
    this.productMasterService.getImages(masterId, 'CATALOG').subscribe({
      next: imgs => {
        this.images.set(imgs);
        this.selectedImageIds.set(new Set());
        this.isLoadingImages.set(false);
        const cover = imgs.find(i => i.is_cover);
        const newCoverUrl = cover ? cover.url : null;
        this.coverImageChanged.emit({ masterId, coverUrl: newCoverUrl });
      },
      error: err => {
        this.logger.error('Error fetching product images gallery', err, 'ProductMasterGalleryComponent');
        this.isLoadingImages.set(false);
      }
    });
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);

    const dt = event.dataTransfer;
    if (dt && dt.files && dt.files.length > 0) {
      this.uploadSelectedFiles(dt.files);
    }
  }

  onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadSelectedFiles(input.files);
      input.value = '';
    }
  }

  uploadSelectedFiles(fileList: FileList | File[]): void {
    const prodId = this.masterId();
    if (!prodId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Ficha No Guardada',
        detail: 'Debe guardar la ficha maestra antes de subir fotografías.'
      });
      return;
    }

    const filesArray: File[] = Array.from(fileList);
    const validFiles: File[] = [];
    const maxBytes = 10 * 1024 * 1024; // 10MB

    for (const file of filesArray) {
      if (!file.type.startsWith('image/')) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Formato No Válido',
          detail: `"${file.name}" no es una imagen compatible (JPG, PNG, WEBP, AVIF).`
        });
        continue;
      }
      if (file.size > maxBytes) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Archivo Demasiado Pesado',
          detail: `"${file.name}" supera el tamaño máximo permitido de 10 MB.`
        });
        continue;
      }
      validFiles.push(file);
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
          const newImages = event.body || [];
          this.messageService.add({
            severity: 'success',
            summary: 'Subida Exitosa',
            detail: `Se subieron ${newImages.length} fotografía(s) al catálogo exitosamente.`
          });
          this.loadGallery(prodId);
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

  onImageDrop(event: CdkDragDrop<ProductImage[]>): void {
    if (event.previousIndex === event.currentIndex) {
      return;
    }

    const prodId = this.masterId();
    if (!prodId) return;

    const currentImages = this.images();
    const previousImages = [...currentImages];
    const reordered = [...currentImages];
    moveItemInArray(reordered, event.previousIndex, event.currentIndex);

    const updatedImages = reordered.map((img, index) => ({
      ...img,
      sort_order: index + 1
    }));
    this.images.set(updatedImages);

    const payload: ProductImageReorderItem[] = updatedImages.map(img => ({
      id: img.id,
      sort_order: img.sort_order
    }));

    this.isReorderingImages.set(true);

    this.productMasterService.reorderImages(prodId, payload).subscribe({
      next: confirmedImages => {
        this.isReorderingImages.set(false);
        this.images.set(confirmedImages);
        this.messageService.add({
          severity: 'info',
          summary: 'Orden Actualizado',
          detail: 'Se guardó la nueva posición de las fotografías.',
          life: 2000
        });
      },
      error: err => {
        this.isReorderingImages.set(false);
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

  confirmDeleteImage(img: ProductImage): void {
    const prodId = this.masterId();
    if (!prodId) return;

    this.confirmationService.confirm({
      header: 'Eliminar Fotografía',
      message: `¿Desea eliminar permanentemente esta fotografía del catálogo? ${
        img.is_cover ? 'Esta imagen es la portada oficial actual; el sistema reasignará otra disponible.' : ''
      }`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonProps: {
        severity: 'danger'
      },
      rejectButtonProps: {
        severity: 'secondary',
        outlined: true
      },
      accept: () => {
        this.productMasterService.deleteImage(prodId, img.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Fotografía Eliminada',
              detail: 'La imagen fue removida del catálogo exitosamente.'
            });
            this.selectedImageIds.update(set => {
              const next = new Set(set);
              next.delete(img.id);
              return next;
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
    });
  }

  openPreview(img: ProductImage): void {
    this.previewImage.set(img);
  }

  closePreview(): void {
    this.previewImage.set(null);
  }

  onPreviewVisibleChange(isVisible: boolean): void {
    if (!isVisible) {
      this.closePreview();
    }
  }

  formatBytes(bytes: number | null | undefined): string {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  async downloadImage(image: ProductImage): Promise<void> {
    if (!image?.url) return;

    const productName = this.productName() || 'producto';
    const cleanTitle = (image.title || productName)
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9_-]+/g, '_')
      .replace(/^_+|_+$/g, '');
    const extension = (image.format || 'jpg').toLowerCase().replace(/^\./, '');
    const targetFilename = `${cleanTitle || 'fotografia'}.${extension}`;

    this.isDownloadingImage.set(true);

    try {
      const response = await fetch(image.url);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = targetFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
    } catch {
      let downloadUrl = image.url;
      if (downloadUrl.includes('res.cloudinary.com') && downloadUrl.includes('/upload/')) {
        downloadUrl = downloadUrl.replace('/upload/', `/upload/fl_attachment:${cleanTitle}/`);
      }
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = targetFilename;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      this.isDownloadingImage.set(false);
    }
  }

  toggleSelectImage(imgId: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.selectedImageIds.update(set => {
      const next = new Set(set);
      if (next.has(imgId)) {
        next.delete(imgId);
      } else {
        next.add(imgId);
      }
      return next;
    });
  }

  toggleSelectAll(): void {
    if (this.isAllSelected()) {
      this.selectedImageIds.set(new Set());
    } else {
      this.selectedImageIds.set(new Set(this.images().map(img => img.id)));
    }
  }

  clearSelection(): void {
    this.selectedImageIds.set(new Set());
  }

  confirmBulkDelete(): void {
    const prodId = this.masterId();
    const count = this.selectedCount();
    if (!prodId || count === 0) return;

    const selectedSet = this.selectedImageIds();
    const hasCover = this.hasSelectedCover();

    this.confirmationService.confirm({
      header: `Eliminar ${count} ${count === 1 ? 'Fotografía' : 'Fotografías'}`,
      message: `¿Desea eliminar permanentemente ${
        count === 1 ? 'la fotografía seleccionada' : `las ${count} fotografías seleccionadas`
      } del catálogo? Esta acción no se puede deshacer. ${
        hasCover
          ? '⚠️ Una de las imágenes seleccionadas es la Portada Oficial actual; el sistema reasignará otra disponible si queda alguna.'
          : ''
      }`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: `Eliminar ${count} ${count === 1 ? 'Foto' : 'Fotos'}`,
      rejectLabel: 'Cancelar',
      acceptButtonProps: {
        severity: 'danger'
      },
      rejectButtonProps: {
        severity: 'secondary',
        outlined: true
      },
      accept: () => {
        this.isBulkDeleting.set(true);
        const idsToDelete = Array.from(selectedSet);
        forkJoin(idsToDelete.map(id => this.productMasterService.deleteImage(prodId, id))).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Fotografías Eliminadas',
              detail: `Se ${count === 1 ? 'eliminó 1 fotografía' : `eliminaron ${count} fotografías`} del catálogo exitosamente.`
            });
            this.selectedImageIds.set(new Set());
            this.isBulkDeleting.set(false);
            this.loadGallery(prodId);
          },
          error: err => {
            this.logger.error('Error in bulk deleting product images', err, 'ProductMasterGalleryComponent');
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Ocurrió un problema al eliminar algunas fotografías.'
            });
            this.isBulkDeleting.set(false);
            this.loadGallery(prodId);
          }
        });
      }
    });
  }

  async downloadImagesZip(onlySelected = false): Promise<void> {
    const allImages = this.images();
    const selectedIds = this.selectedImageIds();
    const targetImages = onlySelected
      ? allImages.filter(img => selectedIds.has(img.id))
      : allImages;

    if (targetImages.length === 0) return;

    this.isDownloadingZip.set(true);
    this.zipProgress.set(`0/${targetImages.length}`);

    const productName = this.productName() || 'producto_maestro';
    const cleanProductName = productName
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9_-]+/g, '_')
      .replace(/^_+|_+$/g, '');

    try {
      const fileEntries: ZipFileEntry[] = [];
      let completedCount = 0;

      for (let i = 0; i < targetImages.length; i++) {
        const img = targetImages[i];
        this.zipProgress.set(`${completedCount + 1}/${targetImages.length}`);

        const response = await fetch(img.url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} al descargar imagen`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const extension = (img.format || 'jpg').toLowerCase().replace(/^\./, '');
        const prefix = String(i + 1).padStart(2, '0');
        const coverTag = img.is_cover ? '_PORTADA' : '';
        const filename = `${prefix}${coverTag}_${cleanProductName || 'foto'}_${img.id.slice(0, 6)}.${extension}`;

        fileEntries.push({
          name: filename,
          data: new Uint8Array(arrayBuffer)
        });
        completedCount++;
      }

      this.zipProgress.set('Comprimiendo ZIP...');
      const zipBlob = createZipArchive(fileEntries);
      const blobUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${cleanProductName || 'catalogo'}_fotos.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);

      this.messageService.add({
        severity: 'success',
        summary: 'Descarga Completa',
        detail: `Se descargaron y empaquetaron ${targetImages.length} fotos en el archivo ZIP correctamente.`
      });
    } catch (err) {
      this.logger.error('Error generating images zip', err, 'ProductMasterGalleryComponent');
      this.messageService.add({
        severity: 'error',
        summary: 'Error en Descarga',
        detail: 'No se pudieron descargar todas las imágenes para empaquetar el ZIP.'
      });
    } finally {
      this.isDownloadingZip.set(false);
      this.zipProgress.set('');
    }
  }
}
