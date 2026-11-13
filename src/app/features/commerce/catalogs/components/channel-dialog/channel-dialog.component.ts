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
import { ToggleSwitch } from 'primeng/toggleswitch';

import { LoggerService } from '@core/services/logger.service';

import {
  ChannelCreatePayload,
  ChannelUpdatePayload,
  CommerceChannel
} from '../../models/commerce-catalog.model';
import { CommerceCatalogService } from '../../services/commerce-catalog.service';

@Component({
  selector: 'app-channel-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Dialog,
    Button,
    InputText,
    Textarea,
    ToggleSwitch
  ],
  templateUrl: './channel-dialog.component.html',
  styleUrls: ['./channel-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChannelDialogComponent {
  private readonly catalogService = inject(CommerceCatalogService);
  private readonly logger = inject(LoggerService);
  private readonly messageService = inject(MessageService);

  readonly visible = model<boolean>(false);
  readonly channel = input<CommerceChannel | null>(null);
  readonly mode = input<'create' | 'edit'>('create');

  readonly saved = output<CommerceChannel>();

  // State
  readonly isSubmitting = signal<boolean>(false);
  readonly code = signal<string>('');
  readonly name = signal<string>('');
  readonly description = signal<string>('');
  readonly isActive = signal<boolean>(true);

  // Validations
  readonly isFormValid = computed<boolean>(() => {
    return this.code().trim().length > 0 && this.name().trim().length > 0;
  });

  constructor() {
    effect(() => {
      const isVis = this.visible();
      const current = this.channel();

      if (isVis) {
        if (current) {
          this.code.set(current.code || '');
          this.name.set(current.name || '');
          this.description.set(current.description || '');
          this.isActive.set(current.is_active ?? true);
        } else {
          this.code.set('');
          this.name.set('');
          this.description.set('');
          this.isActive.set(true);
        }
      }
    });
  }

  saveChannel(): void {
    if (!this.isFormValid()) return;

    this.isSubmitting.set(true);

    if (this.mode() === 'create') {
      const payload: ChannelCreatePayload = {
        code: this.code().trim().toUpperCase(),
        name: this.name().trim(),
        description: this.description().trim() || null,
        is_active: this.isActive()
      };

      this.catalogService.createChannel(payload).subscribe({
        next: created => {
          this.isSubmitting.set(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Canal Creado',
            detail: `Canal de venta "${created.name}" registrado.`
          });
          this.saved.emit(created);
          this.visible.set(false);
        },
        error: err => {
          this.isSubmitting.set(false);
          this.logger.error('Error creating sales channel', err, 'ChannelDialogComponent');
          this.messageService.add({
            severity: 'error',
            summary: 'Error al Crear',
            detail: err?.error?.detail || 'No se pudo crear el canal de venta.'
          });
        }
      });
    } else {
      const current = this.channel();
      if (!current?.id) {
        this.isSubmitting.set(false);
        return;
      }

      const payload: ChannelUpdatePayload = {
        code: this.code().trim().toUpperCase(),
        name: this.name().trim(),
        description: this.description().trim() || null,
        is_active: this.isActive()
      };

      this.catalogService.updateChannel(current.id, payload).subscribe({
        next: updated => {
          this.isSubmitting.set(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Canal Actualizado',
            detail: `Canal de venta "${updated.name}" actualizado.`
          });
          this.saved.emit(updated);
          this.visible.set(false);
        },
        error: err => {
          this.isSubmitting.set(false);
          this.logger.error('Error updating sales channel', err, 'ChannelDialogComponent');
          this.messageService.add({
            severity: 'error',
            summary: 'Error al Actualizar',
            detail: err?.error?.detail || 'No se pudo actualizar el canal.'
          });
        }
      });
    }
  }
}

