import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  model,
  output,
  signal,
  viewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import {
  LucideMinus,
  LucidePlus,
  LucideRotateCw,
  LucideUpload
} from '@lucide/angular';

import { LoggerService } from '@core/services/logger.service';

@Component({
  selector: 'app-avatar-cropper-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    Dialog,
    Button,
    LucidePlus,
    LucideMinus,
    LucideRotateCw,
    LucideUpload
  ],
  templateUrl: './avatar-cropper-dialog.component.html'
})
export class AvatarCropperDialogComponent {
  private readonly logger = inject(LoggerService);

  // Two-way modal visibility
  readonly visible = model<boolean>(false);

  // Input file to crop
  readonly imageFile = input<File | null>(null);

  // Busy indicator during export/upload
  readonly isProcessing = input<boolean>(false);

  // Outputs
  readonly cropApplied = output<Blob>();
  readonly cancelled = output<void>();

  // Canvas element ref
  readonly canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('cropCanvas');

  // Interactive Transformations State
  // zoom is a multiplier (1.0 = 100% of fit scale, 0.3 = 30%, 4.0 = 400%)
  readonly zoom = signal<number>(1);
  readonly zoomPercentage = computed<string>(() => `${Math.round(this.zoom() * 100)}%`);
  readonly rotation = signal<number>(0); // 0, 90, 180, 270
  readonly isDragOver = signal<boolean>(false);

  private imageElement: HTMLImageElement | null = null;
  private isDragging = false;
  private startX = 0;
  private startY = 0;
  private panX = 0;
  private panY = 0;
  private baseScale = 1;

  // Viewport Settings (Optimized circle coverage: 310px diameter on 340px canvas)
  readonly CANVAS_SIZE = 340;
  readonly CIRCLE_RADIUS = 155; // 310px diameter (leaving only 15px margin, maximizing photo visibility)

  /**
   * Called when modal opens or a new file is loaded
   */
  initCrop(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        this.imageElement = img;
        this.resetTransformations();
        this.renderCanvas();
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  private resetTransformations(): void {
    if (!this.imageElement) return;

    // Base scale calculates the factor to cover the circular viewport (minDim) so there are no empty gaps inside
    const minDim = Math.min(this.imageElement.width, this.imageElement.height);
    this.baseScale = (this.CIRCLE_RADIUS * 2) / minDim;

    // Reset user controls
    this.zoom.set(1.0);
    this.rotation.set(0);
    this.panX = 0;
    this.panY = 0;
  }

  // Pointer / Mouse Events for Pan (Move image inside circle)
  onPointerDown(event: PointerEvent): void {
    this.isDragging = true;
    this.startX = event.clientX - this.panX;
    this.startY = event.clientY - this.panY;
    (event.target as HTMLElement)?.setPointerCapture?.(event.pointerId);
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.isDragging) return;
    this.panX = event.clientX - this.startX;
    this.panY = event.clientY - this.startY;
    this.renderCanvas();
  }

  onPointerUp(event: PointerEvent): void {
    this.isDragging = false;
    (event.target as HTMLElement)?.releasePointerCapture?.(event.pointerId);
  }

  // Mouse Wheel Zoom
  onWheel(event: WheelEvent): void {
    event.preventDefault();
    const delta = event.deltaY < 0 ? 0.1 : -0.1;
    this.onZoomChange(Math.round((this.zoom() + delta) * 100) / 100);
  }

  // Zoom Controls
  onZoomChange(newZoom: number): void {
    const clamped = Math.min(4.0, Math.max(0.3, newZoom));
    this.zoom.set(Math.round(clamped * 100) / 100);
    this.renderCanvas();
  }

  zoomIn(): void {
    this.onZoomChange(Math.round((this.zoom() + 0.15) * 100) / 100);
  }

  zoomOut(): void {
    this.onZoomChange(Math.round((this.zoom() - 0.15) * 100) / 100);
  }

  rotate90(): void {
    const nextRotation = (this.rotation() + 90) % 360;
    this.rotation.set(nextRotation);
    this.renderCanvas();
  }

  // Drag & Drop of a new file directly into the dialog
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

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);

    const file = event.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      this.initCrop(file);
    }
  }

  onNewFileSelected(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const file = inputEl.files?.[0];
    if (file) {
      this.initCrop(file);
      inputEl.value = '';
    }
  }

  // Canvas Rendering
  private renderCanvas(): void {
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas || !this.imageElement) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = this.CANVAS_SIZE;
    canvas.width = size;
    canvas.height = size;

    const centerX = size / 2;
    const centerY = size / 2;
    const r = this.CIRCLE_RADIUS;

    ctx.clearRect(0, 0, size, size);

    // 1. Draw Image with Base Scale + User Zoom + Pan + Rotation
    const currentScale = this.baseScale * this.zoom();

    ctx.save();
    ctx.translate(centerX + this.panX, centerY + this.panY);
    ctx.rotate((this.rotation() * Math.PI) / 180);
    ctx.scale(currentScale, currentScale);
    ctx.drawImage(
      this.imageElement,
      -this.imageElement.width / 2,
      -this.imageElement.height / 2
    );
    ctx.restore();

    // 2. Draw Translucent Dark Mask with Circular Viewport Cut-out
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.70)'; // slate-900 with 70% opacity
    ctx.beginPath();
    ctx.rect(0, 0, size, size);
    ctx.arc(centerX, centerY, r, 0, Math.PI * 2, true); // Cut out circular hole
    ctx.fill();

    // 3. Draw Circular Guide Ring
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
    ctx.stroke();

    // 4. Subtle Crosshair Grid inside the circle
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(centerX - 24, centerY);
    ctx.lineTo(centerX + 24, centerY);
    ctx.moveTo(centerX, centerY - 24);
    ctx.lineTo(centerX, centerY + 24);
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Export the exact cropped circular area to an optimized 400x400 px WebP Blob
   */
  applyCrop(): void {
    if (!this.imageElement) return;

    const exportSize = 400;
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = exportSize;
    exportCanvas.height = exportSize;

    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    // Mathematical ratio from canvas radius to export canvas radius
    const ratio = (exportSize / 2) / this.CIRCLE_RADIUS; // 200 / 130
    const finalScale = this.baseScale * this.zoom() * ratio;
    const center = exportSize / 2;

    ctx.save();
    ctx.translate(center + this.panX * ratio, center + this.panY * ratio);
    ctx.rotate((this.rotation() * Math.PI) / 180);
    ctx.scale(finalScale, finalScale);
    ctx.drawImage(
      this.imageElement,
      -this.imageElement.width / 2,
      -this.imageElement.height / 2
    );
    ctx.restore();

    // Export as WebP image
    exportCanvas.toBlob(
      (blob) => {
        if (blob) {
          this.cropApplied.emit(blob);
        } else {
          this.logger.error('Failed to create blob from export canvas', undefined, 'AvatarCropper');
        }
      },
      'image/webp',
      0.92
    );
  }

  cancel(): void {
    this.visible.set(false);
    this.cancelled.emit();
  }
}
