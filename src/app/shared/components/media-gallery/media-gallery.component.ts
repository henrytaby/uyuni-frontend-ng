import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDragPreview,
  CdkDropList,
  moveItemInArray
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  OnDestroy,
  output,
  signal,
  TemplateRef,
  untracked
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ConfirmationService, MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { Tooltip } from 'primeng/tooltip';
import {
  LucideCheck,
  LucideCloudUpload,
  LucideDownload,
  LucideExternalLink,
  LucideEye,
  LucideGripVertical,
  LucideImage,
  LucideImageOff,
  LucideImages,
  LucideLoaderCircle,
  LucideRefreshCw,
  LucideTrash2,
  LucideX
} from '@lucide/angular';

import { LoggerService } from '@core/services/logger.service';

import {
  MediaGalleryItem,
  MediaGalleryReorderEvent,
  UploadingMediaPlaceholder
} from '@shared/models/media-gallery.model';
import { CloudinaryUrlPipe } from '@shared/pipe/cloudinary-url.pipe';
import { createZipArchive, ZipFileEntry } from '@shared/utils/zip.utils';

@Component({
  selector: 'app-media-gallery',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Button,
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
    LucideGripVertical,
    LucideEye,
    LucideTrash2,
    LucideExternalLink,
    LucideLoaderCircle,
    LucideImageOff,
    LucideDownload
  ],
  templateUrl: './media-gallery.component.html',
  styleUrl: './media-gallery.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaGalleryComponent<T extends MediaGalleryItem = MediaGalleryItem> implements OnDestroy {
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly logger = inject(LoggerService);

  // Datos y Configuración
  readonly items = model<T[]>([]);
  readonly title = input<string>('Galería Multimedia');
  readonly badgeText = input<string | null>(null);
  readonly subtitle = input<string>('Subidas en alta resolución y procesadas automáticamente en formato WebP optimizado.');
  readonly emptyTitle = input<string>('Sin fotografías aún');
  readonly emptySubtitle = input<string>('Arrastra tus fotos arriba para subirlas.');
  readonly entityName = input<string>('');
  readonly zipBaseName = input<string>('fotos');

  // Estados de Operación
  readonly mode = input<'create' | 'edit'>('create');
  readonly createModeTitle = input<string>('Gestión de Galería Habilitada tras Guardar');
  readonly createModeDescription = input<string>(
    'Para arrastrar y subir fotografías de alta calidad (WebP), primero debe registrar los datos iniciales.'
  );
  readonly createModeActionLabel = input<string>('Completar Datos');
  readonly isMaximized = input<boolean>(false);
  readonly isLoading = input<boolean>(false);
  readonly isUploading = input<boolean>(false);
  readonly uploadProgress = input<number>(0);
  readonly canReorder = input<boolean>(true);
  readonly canDelete = input<boolean>(true);
  readonly canDownloadZip = input<boolean>(true);

  // Template Slots para Personalización de Negocio
  readonly cardActionTemplate = input<TemplateRef<{ $implicit: T; index: number }> | null>(null);
  readonly cardBadgeTemplate = input<TemplateRef<{ $implicit: T; index: number }> | null>(null);
  readonly previewModalActionsTemplate = input<TemplateRef<{ $implicit: T }> | null>(null);

  // Eventos hacia el Consumidor
  readonly filesDropped = output<File[]>();
  readonly reordered = output<MediaGalleryReorderEvent<T>>();
  readonly deleteSingle = output<T>();
  readonly deleteMultiple = output<T[]>();
  readonly refresh = output<void>();
  readonly requestCreateAction = output<void>();

  // Estados Locales Reactivos
  readonly isDragOver = signal<boolean>(false);
  readonly selectedIds = signal<Set<string>>(new Set());
  readonly previewImage = signal<T | null>(null);
  readonly isModalImageLoading = signal<boolean>(true);
  readonly hasModalImageError = signal<boolean>(false);
  readonly isDownloadingImage = signal<boolean>(false);
  readonly isDownloadingZip = signal<boolean>(false);
  readonly zipProgress = signal<string>('');
  readonly isBulkDeleting = signal<boolean>(false);
  readonly deletingIds = signal<Set<string>>(new Set());
  readonly uploadingPlaceholders = signal<UploadingMediaPlaceholder[]>([]);

  // Computeds
  readonly selectedCount = computed(() => {
    const validIds = new Set(this.items().map(i => i.id));
    let count = 0;
    for (const id of this.selectedIds()) {
      if (validIds.has(id)) count++;
    }
    return count;
  });
  readonly isAllSelected = computed(
    () => this.items().length > 0 && this.selectedCount() === this.items().length
  );
  readonly activePlaceholders = computed(() => (this.isUploading() ? this.uploadingPlaceholders() : []));
  readonly uploadingCount = computed(() =>
    this.isUploading() ? Math.max(this.uploadingPlaceholders().length, 1) : 0
  );

  constructor() {
    // Sincronizar selección y estado de eliminación cuando la lista de items cambia (por recarga, borrado o actualización)
    effect(() => {
      const validIds = new Set(this.items().map(i => i.id));
      untracked(() => {
        this.isBulkDeleting.set(false);
        this.deletingIds.set(new Set());
        this.selectedIds.update(set => {
          if (set.size === 0) return set;
          const next = new Set<string>();
          for (const id of set) {
            if (validIds.has(id)) {
              next.add(id);
            }
          }
          return next.size === set.size ? set : next;
        });
      });
    });

    // Limpiar placeholders temporales cuando la subida termina o se cancela
    effect(() => {
      const uploading = this.isUploading();
      if (!uploading) {
        untracked(() => {
          this.clearUploadingPlaceholders();
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.clearUploadingPlaceholders();
  }

  private clearUploadingPlaceholders(): void {
    const current = this.uploadingPlaceholders();
    for (const item of current) {
      if (item.previewUrl && typeof URL !== 'undefined' && typeof URL.revokeObjectURL === 'function') {
        try {
          URL.revokeObjectURL(item.previewUrl);
        } catch {
          // ignore
        }
      }
    }
    if (current.length > 0) {
      this.uploadingPlaceholders.set([]);
    }
  }

  // ---------------------------------------------------------------------------
  // DRAG & DROP Y SUBIDA DE ARCHIVOS
  // ---------------------------------------------------------------------------

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
      this.validateAndEmitFiles(dt.files);
    }
  }

  onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.validateAndEmitFiles(input.files);
      input.value = '';
    }
  }

  private validateAndEmitFiles(fileList: FileList | File[]): void {
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

    if (validFiles.length > 0) {
      this.clearUploadingPlaceholders();

      const canCreateUrl = typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function';
      const placeholders: UploadingMediaPlaceholder[] = validFiles.map((file, idx) => ({
        id: `uploading-temp-${Date.now()}-${idx}`,
        file,
        previewUrl: canCreateUrl ? URL.createObjectURL(file) : '',
        fileName: file.name,
        fileSizeBytes: file.size
      }));
      this.uploadingPlaceholders.set(placeholders);

      this.filesDropped.emit(validFiles);
    }
  }

  // ---------------------------------------------------------------------------
  // REORDENAMIENTO CDK DRAG & DROP
  // ---------------------------------------------------------------------------

  onItemDrop(event: CdkDragDrop<T[]>): void {
    if (event.previousIndex === event.currentIndex || !this.canReorder()) {
      return;
    }

    const currentItems = this.items();
    const reorderedList = [...currentItems];
    moveItemInArray(reorderedList, event.previousIndex, event.currentIndex);

    const updatedItems = reorderedList.map((item, index) => ({
      ...item,
      sort_order: index + 1
    }));

    // Actualización optimista local
    this.items.set(updatedItems);

    this.reordered.emit({
      previousIndex: event.previousIndex,
      currentIndex: event.currentIndex,
      items: updatedItems
    });
  }

  // ---------------------------------------------------------------------------
  // SELECCIÓN MÚLTIPLE
  // ---------------------------------------------------------------------------

  toggleSelect(id: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.selectedIds.update(set => {
      const next = new Set(set);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  toggleSelectAll(): void {
    if (this.isAllSelected()) {
      this.selectedIds.set(new Set());
    } else {
      this.selectedIds.set(new Set(this.items().map(i => i.id)));
    }
  }

  clearSelection(): void {
    this.selectedIds.set(new Set());
  }

  // ---------------------------------------------------------------------------
  // ELIMINACIÓN (INDIVIDUAL Y MASIVA)
  // ---------------------------------------------------------------------------

  confirmDeleteSingle(item: T): void {
    if (!this.canDelete() || this.deletingIds().has(item.id)) return;

    this.confirmationService.confirm({
      header: 'Eliminar Fotografía',
      message: '¿Desea eliminar permanentemente esta fotografía? Esta acción destruirá el archivo en el almacenamiento.',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonProps: { severity: 'danger' },
      rejectButtonProps: { severity: 'secondary', outlined: true },
      accept: () => {
        this.deletingIds.update(set => new Set([...set, item.id]));
        this.deleteSingle.emit(item);
      }
    });
  }

  confirmBulkDelete(): void {
    if (!this.canDelete() || this.isBulkDeleting()) return;
    const count = this.selectedCount();
    if (count === 0) return;

    const selectedSet = this.selectedIds();
    const itemsToDelete = this.items().filter(item => selectedSet.has(item.id));

    this.confirmationService.confirm({
      header: `Eliminar ${count} ${count === 1 ? 'Fotografía' : 'Fotografías'}`,
      message: `¿Desea eliminar permanentemente ${
        count === 1 ? 'la fotografía seleccionada' : `las ${count} fotografías seleccionadas`
      }? Esta acción no se puede deshacer.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: `Eliminar ${count} ${count === 1 ? 'Foto' : 'Fotos'}`,
      rejectLabel: 'Cancelar',
      acceptButtonProps: { severity: 'danger' },
      rejectButtonProps: { severity: 'secondary', outlined: true },
      accept: () => {
        this.isBulkDeleting.set(true);
        this.deletingIds.set(new Set(itemsToDelete.map(i => i.id)));
        this.deleteMultiple.emit(itemsToDelete);
      }
    });
  }

  // ---------------------------------------------------------------------------
  // MODAL PREVIEW Y DESCARGAS
  // ---------------------------------------------------------------------------

  openPreview(item: T): void {
    this.isModalImageLoading.set(true);
    this.hasModalImageError.set(false);
    this.previewImage.set(item);
  }

  closePreview(): void {
    this.previewImage.set(null);
    this.isModalImageLoading.set(true);
    this.hasModalImageError.set(false);
  }

  onModalImageLoaded(): void {
    this.isModalImageLoading.set(false);
    this.hasModalImageError.set(false);
  }

  onModalImageError(): void {
    this.isModalImageLoading.set(false);
    this.hasModalImageError.set(true);
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

  async downloadSingleImage(item: T): Promise<void> {
    if (!item?.url) return;

    const name = this.entityName() || this.zipBaseName();
    const cleanTitle = (item.title || name)
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9_-]+/g, '_')
      .replace(/^_+|_+$/g, '');
    const extension = (item.format || 'jpg').toLowerCase().replace(/^\./, '');
    const targetFilename = `${cleanTitle || 'fotografia'}.${extension}`;

    this.isDownloadingImage.set(true);

    try {
      const response = await fetch(item.url);
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
      let downloadUrl = item.url;
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

  async downloadImagesZip(onlySelected = false): Promise<void> {
    const allImages = this.items();
    const selectedIds = this.selectedIds();
    const targetImages = onlySelected
      ? allImages.filter(img => selectedIds.has(img.id))
      : allImages;

    if (targetImages.length === 0) return;

    this.isDownloadingZip.set(true);
    this.zipProgress.set(`0/${targetImages.length}`);

    const baseName = this.entityName() || this.zipBaseName();
    const cleanBaseName = baseName
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

        // Etiqueta semántica de estado si está presente
        let stateTag = '';
        const itemRecord = img as unknown as Record<string, unknown>;
        if (itemRecord['is_cover']) {
          stateTag = '_PORTADA';
        } else if (itemRecord['is_public'] === true) {
          stateTag = '_PUBLICA';
        } else if (itemRecord['is_public'] === false) {
          stateTag = '_PRIVADA';
        }

        const filename = `${prefix}${stateTag}_${cleanBaseName || 'foto'}_${img.id.slice(0, 6)}.${extension}`;

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
      link.download = `${cleanBaseName || 'galeria'}_fotos.zip`;
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
      this.logger.error('Error generating images zip', err, 'MediaGalleryComponent');
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
