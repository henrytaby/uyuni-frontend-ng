import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';

import { LoggerService } from '@core/services/logger.service';

import {
  CommerceLiveBasket,
  LiveBasketCreatePayload,
  LiveBasketUpdatePayload
} from '../../models/commerce-catalog.model';
import { CommerceCatalogService } from '../../services/commerce-catalog.service';

@Component({
  selector: 'app-live-basket-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Dialog,
    Button,
    InputText,
    Textarea
  ],
  templateUrl: './live-basket-dialog.component.html',
  styleUrls: ['./live-basket-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LiveBasketDialogComponent {
  private readonly catalogService = inject(CommerceCatalogService);
  private readonly logger = inject(LoggerService);
  private readonly messageService = inject(MessageService);

  readonly visible = model<boolean>(false);
  readonly basket = input<CommerceLiveBasket | null>(null);
  readonly mode = input<'create' | 'edit'>('create');

  readonly saved = output<CommerceLiveBasket>();

  // State
  readonly isSubmitting = signal<boolean>(false);
  readonly code = signal<string>('');
  readonly name = signal<string>('');
  readonly label = signal<string>('');
  readonly description = signal<string>('');
  readonly priceRange = signal<string>('');
  readonly targetAudience = signal<string>('');

  // Validations
  readonly isFormValid = computed<boolean>(() => {
    return this.code().trim().length > 0 && this.name().trim().length > 0;
  });

  constructor() {
    effect(() => {
      const isVis = this.visible();
      const current = this.basket();

      if (isVis) {
        if (current) {
          this.code.set(current.code || '');
          this.name.set(current.name || '');
          this.label.set(current.label || '');
          this.description.set(current.description || '');
          this.priceRange.set(current.price_range || '');
          this.targetAudience.set(current.target_audience || '');
        } else {
          this.code.set('');
          this.name.set('');
          this.label.set('');
          this.description.set('');
          this.priceRange.set('');
          this.targetAudience.set('');
        }
      }
    });
  }

  saveBasket(): void {
    if (!this.isFormValid()) return;

    this.isSubmitting.set(true);

    const generatedLabel = this.label().trim() || `${this.code().trim()} - ${this.name().trim()}`;

    if (this.mode() === 'create') {
      const payload: LiveBasketCreatePayload = {
        code: this.code().trim().toUpperCase(),
        name: this.name().trim(),
        label: generatedLabel,
        description: this.description().trim() || null,
        price_range: this.priceRange().trim() || null,
        target_audience: this.targetAudience().trim() || null
      };

      this.catalogService.createLiveBasket(payload).subscribe({
        next: created => {
          this.isSubmitting.set(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Canasta Creada',
            detail: `Canasta "${created.label}" registrada exitosamente.`
          });
          this.saved.emit(created);
          this.visible.set(false);
        },
        error: err => {
          this.isSubmitting.set(false);
          this.logger.error('Error creating live basket', err, 'LiveBasketDialogComponent');
          this.messageService.add({
            severity: 'error',
            summary: 'Error al Crear',
            detail: err?.error?.detail || 'No se pudo crear la canasta live.'
          });
        }
      });
    } else {
      const current = this.basket();
      if (!current?.id) {
        this.isSubmitting.set(false);
        return;
      }

      const payload: LiveBasketUpdatePayload = {
        code: this.code().trim().toUpperCase(),
        name: this.name().trim(),
        label: generatedLabel,
        description: this.description().trim() || null,
        price_range: this.priceRange().trim() || null,
        target_audience: this.targetAudience().trim() || null
      };

      this.catalogService.updateLiveBasket(current.id, payload).subscribe({
        next: updated => {
          this.isSubmitting.set(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Canasta Actualizada',
            detail: `Canasta "${updated.label}" actualizada.`
          });
          this.saved.emit(updated);
          this.visible.set(false);
        },
        error: err => {
          this.isSubmitting.set(false);
          this.logger.error('Error updating live basket', err, 'LiveBasketDialogComponent');
          this.messageService.add({
            severity: 'error',
            summary: 'Error al Actualizar',
            detail: err?.error?.detail || 'No se pudo actualizar la canasta.'
          });
        }
      });
    }
  }
}

