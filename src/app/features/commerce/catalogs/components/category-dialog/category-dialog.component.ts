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
  CategoryCreatePayload,
  CategoryUpdatePayload,
  CommerceCategory
} from '../../models/commerce-catalog.model';
import { CommerceCatalogService } from '../../services/commerce-catalog.service';

@Component({
  selector: 'app-category-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Dialog,
    Button,
    InputText,
    Textarea
  ],
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryDialogComponent {
  private readonly catalogService = inject(CommerceCatalogService);
  private readonly logger = inject(LoggerService);
  private readonly messageService = inject(MessageService);

  readonly visible = model<boolean>(false);
  readonly category = input<CommerceCategory | null>(null);
  readonly mode = input<'create' | 'edit'>('create');

  readonly saved = output<CommerceCategory>();

  // State
  readonly isSubmitting = signal<boolean>(false);
  readonly code = signal<string>('');
  readonly name = signal<string>('');
  readonly icon = signal<string>('');
  readonly description = signal<string>('');
  readonly typicalProducts = signal<string>('');

  // Validations
  readonly isFormValid = computed<boolean>(() => {
    return this.code().trim().length > 0 && this.name().trim().length > 0;
  });

  constructor() {
    effect(() => {
      const isVis = this.visible();
      const current = this.category();

      if (isVis) {
        if (current) {
          this.code.set(current.code || '');
          this.name.set(current.name || '');
          this.icon.set(current.icon || '');
          this.description.set(current.description || '');
          this.typicalProducts.set(current.typical_products || '');
        } else {
          this.code.set('');
          this.name.set('');
          this.icon.set('');
          this.description.set('');
          this.typicalProducts.set('');
        }
      }
    });
  }

  saveCategory(): void {
    if (!this.isFormValid()) return;

    this.isSubmitting.set(true);

    if (this.mode() === 'create') {
      const payload: CategoryCreatePayload = {
        code: this.code().trim().toUpperCase(),
        name: this.name().trim(),
        icon: this.icon().trim() || null,
        description: this.description().trim() || null,
        typical_products: this.typicalProducts().trim() || null
      };

      this.catalogService.createCategory(payload).subscribe({
        next: created => {
          this.isSubmitting.set(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Categoría Creada',
            detail: `Categoría "${created.name}" creada exitosamente.`
          });
          this.saved.emit(created);
          this.visible.set(false);
        },
        error: err => {
          this.isSubmitting.set(false);
          this.logger.error('Error creating category', err, 'CategoryDialogComponent');
          this.messageService.add({
            severity: 'error',
            summary: 'Error al Crear',
            detail: err?.error?.detail || 'No se pudo crear la categoría.'
          });
        }
      });
    } else {
      const current = this.category();
      if (!current?.id) {
        this.isSubmitting.set(false);
        return;
      }

      const payload: CategoryUpdatePayload = {
        code: this.code().trim().toUpperCase(),
        name: this.name().trim(),
        icon: this.icon().trim() || null,
        description: this.description().trim() || null,
        typical_products: this.typicalProducts().trim() || null
      };

      this.catalogService.updateCategory(current.id, payload).subscribe({
        next: updated => {
          this.isSubmitting.set(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Categoría Actualizada',
            detail: `Categoría "${updated.name}" actualizada exitosamente.`
          });
          this.saved.emit(updated);
          this.visible.set(false);
        },
        error: err => {
          this.isSubmitting.set(false);
          this.logger.error('Error updating category', err, 'CategoryDialogComponent');
          this.messageService.add({
            severity: 'error',
            summary: 'Error al Actualizar',
            detail: err?.error?.detail || 'No se pudo actualizar la categoría.'
          });
        }
      });
    }
  }
}
