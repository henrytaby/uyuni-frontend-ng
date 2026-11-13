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
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';

import { LoggerService } from '@core/services/logger.service';

import {
  CommerceRound,
  RoundCreatePayload,
  RoundUpdatePayload
} from '../../models/commerce-catalog.model';
import { CommerceCatalogService } from '../../services/commerce-catalog.service';

@Component({
  selector: 'app-round-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Dialog,
    Button,
    InputText,
    InputNumber,
    Select,
    Textarea
  ],
  templateUrl: './round-dialog.component.html',
  styleUrls: ['./round-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoundDialogComponent {
  private readonly catalogService = inject(CommerceCatalogService);
  private readonly logger = inject(LoggerService);
  private readonly messageService = inject(MessageService);

  readonly visible = model<boolean>(false);
  readonly round = input<CommerceRound | null>(null);
  readonly mode = input<'create' | 'edit'>('create');

  readonly saved = output<CommerceRound>();

  // State
  readonly isSubmitting = signal<boolean>(false);
  readonly code = signal<string>('');
  readonly name = signal<string>('');
  readonly disbursementDate = signal<string>('');
  readonly capitalInvested = signal<number>(0);
  readonly currency = signal<string>('BOB');
  readonly status = signal<string>('active');
  readonly observations = signal<string>('');

  readonly statusOptions = [
    { label: 'Activa', value: 'active' },
    { label: 'Cerrada / Concluida', value: 'closed' }
  ];

  // Validations
  readonly isFormValid = computed<boolean>(() => {
    return this.code().trim().length > 0 && this.name().trim().length > 0;
  });

  constructor() {
    effect(() => {
      const isVis = this.visible();
      const current = this.round();

      if (isVis) {
        if (current) {
          this.code.set(current.code || '');
          this.name.set(current.name || '');
          this.disbursementDate.set(current.disbursement_date ? String(current.disbursement_date).substring(0, 10) : '');
          this.capitalInvested.set(current.capital_invested ?? 0);
          this.currency.set(current.currency || 'BOB');
          this.status.set(current.status || 'active');
          this.observations.set(current.observations || '');
        } else {
          this.code.set('');
          this.name.set('');
          this.disbursementDate.set('');
          this.capitalInvested.set(0);
          this.currency.set('BOB');
          this.status.set('active');
          this.observations.set('');
        }
      }
    });
  }

  saveRound(): void {
    if (!this.isFormValid()) return;

    this.isSubmitting.set(true);

    if (this.mode() === 'create') {
      const payload: RoundCreatePayload = {
        code: this.code().trim().toUpperCase(),
        name: this.name().trim(),
        disbursement_date: this.disbursementDate() || null,
        capital_invested: this.capitalInvested() || 0,
        currency: this.currency() || 'BOB',
        status: this.status() || 'active',
        observations: this.observations().trim() || null
      };

      this.catalogService.createRound(payload).subscribe({
        next: created => {
          this.isSubmitting.set(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Ronda Creada',
            detail: `Ronda "${created.name}" creada exitosamente.`
          });
          this.saved.emit(created);
          this.visible.set(false);
        },
        error: err => {
          this.isSubmitting.set(false);
          this.logger.error('Error creating round', err, 'RoundDialogComponent');
          this.messageService.add({
            severity: 'error',
            summary: 'Error al Crear',
            detail: err?.error?.detail || 'No se pudo crear la ronda de inversión.'
          });
        }
      });
    } else {
      const current = this.round();
      if (!current?.id) {
        this.isSubmitting.set(false);
        return;
      }

      const payload: RoundUpdatePayload = {
        code: this.code().trim().toUpperCase(),
        name: this.name().trim(),
        disbursement_date: this.disbursementDate() || null,
        capital_invested: this.capitalInvested() || 0,
        currency: this.currency() || 'BOB',
        status: this.status() || 'active',
        observations: this.observations().trim() || null
      };

      this.catalogService.updateRound(current.id, payload).subscribe({
        next: updated => {
          this.isSubmitting.set(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Ronda Actualizada',
            detail: `Ronda "${updated.name}" actualizada.`
          });
          this.saved.emit(updated);
          this.visible.set(false);
        },
        error: err => {
          this.isSubmitting.set(false);
          this.logger.error('Error updating round', err, 'RoundDialogComponent');
          this.messageService.add({
            severity: 'error',
            summary: 'Error al Actualizar',
            detail: err?.error?.detail || 'No se pudo actualizar la ronda.'
          });
        }
      });
    }
  }
}

