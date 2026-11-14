import { CdkScrollable } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  HostListener,
  inject,
  input,
  model,
  output,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ConfirmationService, MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { Drawer } from 'primeng/drawer';
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { Textarea } from 'primeng/textarea';
import { Tooltip } from 'primeng/tooltip';
import {
  LucideCheck,
  LucideCoins,
  LucideCopy,
  LucideMaximize2,
  LucideMinimize2,
  LucideShieldCheck,
  LucideTrendingUp,
  LucideX
} from '@lucide/angular';

import { LoggerService } from '@core/services/logger.service';

import {
  CommerceRound,
  getRoundStatusInfo,
  RoundCreatePayload,
  RoundStatusInfo,
  RoundUpdatePayload
} from '../../models/round.model';
import { RoundService } from '../../services/round.service';

function parseDateString(val?: string | null): Date | null {
  if (!val) return null;
  const datePart = String(val).substring(0, 10);
  const parts = datePart.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      return new Date(year, month, day);
    }
  }
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
}

function formatDateToIsoString(d: Date | null): string | null {
  if (!d || isNaN(d.getTime())) return null;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

@Component({
  selector: 'app-round-drawer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Drawer,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Button,
    InputText,
    InputNumber,
    DatePicker,
    Textarea,
    Tooltip,
    CdkScrollable,
    LucideTrendingUp,
    LucideCoins,
    LucideShieldCheck,
    LucideCheck,
    LucideCopy,
    LucideMaximize2,
    LucideMinimize2,
    LucideX
  ],
  templateUrl: './round-drawer.component.html',
  styleUrls: ['./round-drawer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoundDrawerComponent {
  private readonly roundService = inject(RoundService);
  private readonly logger = inject(LoggerService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  readonly visible = model<boolean>(false);
  readonly round = input<CommerceRound | null>(null);
  readonly mode = input<'create' | 'edit'>('create');

  readonly saved = output<CommerceRound>();
  readonly deleted = output<string>();

  // Shell State
  readonly activeTab = signal<string>('0');
  readonly isMaximized = signal<boolean>(false);
  readonly isSubmitting = signal<boolean>(false);
  readonly isRecalculating = signal<boolean>(false);
  readonly savingAction = signal<'save' | 'saveAndClose' | null>(null);
  readonly isDirty = signal<boolean>(false);

  // Form Fields State
  readonly code = signal<string>('');
  readonly name = signal<string>('');
  readonly disbursementDate = signal<Date | null>(null);
  readonly capitalInvested = signal<number>(0);
  readonly currency = signal<string>('BOB');
  readonly status = signal<string>('ACTIVE');
  readonly observations = signal<string>('');
  readonly currentRound = signal<CommerceRound | null>(null);

  readonly statusInfo = computed<RoundStatusInfo>(() => {
    return getRoundStatusInfo(this.status());
  });

  // Snapshot for dirty tracking
  private initialCode = '';
  private initialName = '';
  private initialDisbursementDate = '';
  private initialObservations = '';

  readonly isFormValid = computed<boolean>(() => {
    return this.name().trim().length > 0;
  });

  constructor() {
    effect(() => {
      const isVis = this.visible();
      const current = this.round();

      if (!isVis) {
        this.activeTab.set('0');
        this.isMaximized.set(false);
        this.isDirty.set(false);
        this.savingAction.set(null);
        return;
      }

      if (current) {
        this.currentRound.set(current);
        const codeVal = current.code || '';
        const nameVal = current.name || '';
        const parsedDate = parseDateString(current.disbursement_date);
        const obsVal = current.observations || '';

        this.code.set(codeVal);
        this.name.set(nameVal);
        this.disbursementDate.set(parsedDate);
        this.capitalInvested.set(current.capital_invested ?? 0);
        this.currency.set(current.currency || 'BOB');
        this.status.set(current.status || 'ACTIVE');
        this.observations.set(obsVal);

        this.initialCode = codeVal;
        this.initialName = nameVal;
        this.initialDisbursementDate = formatDateToIsoString(parsedDate) || '';
        this.initialObservations = obsVal;
        this.isDirty.set(false);
      } else {
        this.currentRound.set(null);
        this.code.set('');
        this.name.set('');
        this.disbursementDate.set(null);
        this.capitalInvested.set(0);
        this.currency.set('BOB');
        this.status.set('ACTIVE');
        this.observations.set('');

        this.initialCode = '';
        this.initialName = '';
        this.initialDisbursementDate = '';
        this.initialObservations = '';
        this.isDirty.set(false);
      }
    });
  }

  onTabChange(tab: string | number | null | undefined): void {
    if (tab != null) {
      this.activeTab.set(String(tab));
    }
  }

  onVisibleChange(newVisible: boolean): void {
    if (!newVisible) {
      this.requestClose();
    } else {
      this.visible.set(true);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.visible()) return;

    if (document.querySelector('.p-dialog-mask, .p-confirm-dialog')) {
      return;
    }

    const target = event.target as HTMLElement | null;
    if (!target) return;

    if (target.classList?.contains('p-drawer-mask')) {
      this.requestClose();
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeHandler(event: Event): void {
    if (this.visible()) {
      if (document.querySelector('.p-dialog-mask, .p-confirm-dialog')) {
        return;
      }
      event.preventDefault();
      this.requestClose();
    }
  }

  onCodeChange(val: string): void {
    this.code.set(val);
    this.checkDirty();
  }

  onNameChange(val: string): void {
    this.name.set(val);
    this.checkDirty();
  }

  onDateChange(val: Date | null): void {
    this.disbursementDate.set(val);
    this.checkDirty();
  }

  onObservationsChange(val: string): void {
    this.observations.set(val);
    this.checkDirty();
  }

  private checkDirty(): void {
    const currentDateIso = formatDateToIsoString(this.disbursementDate()) || '';
    const dirty =
      this.code().trim() !== this.initialCode.trim() ||
      this.name().trim() !== this.initialName.trim() ||
      currentDateIso !== this.initialDisbursementDate ||
      this.observations().trim() !== this.initialObservations.trim();
    this.isDirty.set(dirty);
  }

  toggleMaximize(): void {
    this.isMaximized.update(v => !v);
  }

  requestClose(): void {
    if (this.isDirty()) {
      this.confirmationService.confirm({
        header: 'Cambios sin guardar',
        message: 'Tienes modificaciones sin guardar en la ronda de inversión. Si cierras ahora, se perderán los cambios realizados. ¿Deseas descartar los cambios y salir?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Descartar y Salir',
        rejectLabel: 'Continuar Editando',
        acceptButtonProps: {
          severity: 'danger'
        },
        rejectButtonProps: {
          severity: 'secondary',
          outlined: true
        },
        accept: () => {
          this.isDirty.set(false);
          this.visible.set(false);
        }
      });
    } else {
      this.visible.set(false);
    }
  }

  getStatusInfo(status: string): RoundStatusInfo {
    return getRoundStatusInfo(status);
  }

  saveRound(closeAfterSave = false): void {
    if (!this.isFormValid() || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.savingAction.set(closeAfterSave ? 'saveAndClose' : 'save');

    const codeTrimmed = this.code().trim().toUpperCase();
    const dateIso = formatDateToIsoString(this.disbursementDate());

    if (this.mode() === 'create') {
      const payload: RoundCreatePayload = {
        code: codeTrimmed ? codeTrimmed : null,
        name: this.name().trim(),
        disbursement_date: dateIso,
        currency: this.currency() || 'BOB',
        observations: this.observations().trim() || null
      };

      this.roundService.createRound(payload).subscribe({
        next: created => {
          this.isSubmitting.set(false);
          this.savingAction.set(null);
          this.messageService.add({
            severity: 'success',
            summary: 'Ronda Creada',
            detail: `Ronda "${created.name}" creada exitosamente.`
          });

          this.currentRound.set(created);
          this.code.set(created.code || '');
          this.initialCode = created.code || '';
          this.initialName = created.name || '';
          const parsed = parseDateString(created.disbursement_date);
          this.disbursementDate.set(parsed);
          this.initialDisbursementDate = formatDateToIsoString(parsed) || '';
          this.initialObservations = created.observations || '';
          this.isDirty.set(false);

          this.saved.emit(created);

          if (closeAfterSave) {
            this.visible.set(false);
          }
        },
        error: err => {
          this.isSubmitting.set(false);
          this.savingAction.set(null);
          this.logger.error('Error creating round', err, 'RoundDrawerComponent');
          this.messageService.add({
            severity: 'error',
            summary: 'Error al Crear',
            detail: err?.error?.detail || 'No se pudo crear la ronda de inversión.'
          });
        }
      });
    } else {
      const current = this.currentRound() || this.round();
      if (!current?.id) {
        this.isSubmitting.set(false);
        this.savingAction.set(null);
        return;
      }

      const payload: RoundUpdatePayload = {
        code: codeTrimmed ? codeTrimmed : null,
        name: this.name().trim(),
        disbursement_date: dateIso,
        currency: this.currency() || 'BOB',
        observations: this.observations().trim() || null
      };

      this.roundService.updateRound(current.id, payload).subscribe({
        next: updated => {
          this.isSubmitting.set(false);
          this.savingAction.set(null);
          this.messageService.add({
            severity: 'success',
            summary: 'Ronda Actualizada',
            detail: `Ronda "${updated.name}" actualizada.`
          });

          this.currentRound.set(updated);
          this.code.set(updated.code || '');
          this.initialCode = updated.code || '';
          this.initialName = updated.name || '';
          const parsed = parseDateString(updated.disbursement_date);
          this.disbursementDate.set(parsed);
          this.initialDisbursementDate = formatDateToIsoString(parsed) || '';
          this.initialObservations = updated.observations || '';
          this.isDirty.set(false);

          this.saved.emit(updated);

          if (closeAfterSave) {
            this.visible.set(false);
          }
        },
        error: err => {
          this.isSubmitting.set(false);
          this.savingAction.set(null);
          this.logger.error('Error updating round', err, 'RoundDrawerComponent');
          this.messageService.add({
            severity: 'error',
            summary: 'Error al Actualizar',
            detail: err?.error?.detail || 'No se pudo actualizar la ronda.'
          });
        }
      });
    }
  }

  confirmDelete(): void {
    const current = this.currentRound() || this.round();
    if (!current?.id) return;

    this.confirmationService.confirm({
      header: 'Eliminar Ronda de Inversión',
      message: `¿Está seguro de eliminar permanentemente la ronda "${current.name}" (${current.code})? Esta acción no se puede deshacer.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar Ronda',
      rejectLabel: 'Cancelar',
      acceptButtonProps: {
        severity: 'danger'
      },
      rejectButtonProps: {
        severity: 'secondary',
        outlined: true
      },
      accept: () => {
        this.isSubmitting.set(true);
        this.roundService.deleteRound(current.id).subscribe({
          next: () => {
            this.isSubmitting.set(false);
            this.messageService.add({
              severity: 'success',
              summary: 'Ronda Eliminada',
              detail: `La ronda "${current.name}" fue eliminada exitosamente.`
            });
            this.deleted.emit(current.id);
            this.visible.set(false);
          },
          error: err => {
            this.isSubmitting.set(false);
            this.logger.error('Error deleting round', err, 'RoundDrawerComponent');
            const detail = err?.error?.detail || 'No se pudo eliminar la ronda de inversión.';
            this.messageService.add({
              severity: 'error',
              summary: 'No se puede eliminar la Ronda',
              detail,
              life: 6000
            });
          }
        });
      }
    });
  }

  recalculate(): void {
    const current = this.currentRound() || this.round();
    if (!current?.id) return;

    this.isRecalculating.set(true);
    this.roundService.recalculateRound(current.id).subscribe({
      next: updated => {
        this.isRecalculating.set(false);
        this.currentRound.set(updated);
        this.capitalInvested.set(updated.capital_invested ?? 0);
        this.status.set(updated.status || 'ACTIVE');
        this.messageService.add({
          severity: 'success',
          summary: 'Métricas Recalculadas',
          detail: `Punto de equilibrio recalculado para "${updated.name}".`
        });
        this.saved.emit(updated);
      },
      error: err => {
        this.isRecalculating.set(false);
        this.logger.error('Error recalculating round', err, 'RoundDrawerComponent');
        this.messageService.add({
          severity: 'error',
          summary: 'Error al Recalcular',
          detail: err?.error?.detail || 'No se pudo recalcular el punto de equilibrio.'
        });
      }
    });
  }

  copyToClipboard(text: string, label: string): void {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      this.messageService.add({
        severity: 'info',
        summary: 'Copiado',
        detail: `${label} copiado al portapapeles.`
      });
    });
  }
}
