import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
  viewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { Select } from 'primeng/select';
import { Tag } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';
import {
  LucideBuilding,
  LucideCamera,
  LucideCircleAlert,
  LucideCircleCheck,
  LucideClock,
  LucideCopy,
  LucideGlobe,
  LucideLock,
  LucideMapPin,
  LucidePhone,
  LucideShield,
  LucideTrash,
  LucideUser
} from '@lucide/angular';

import { AuthService } from '@core/auth/auth.service';
import { LoggerService } from '@core/services/logger.service';

import { PageBreadcrumbComponent } from '@shared/components/common/page-breadcrumb/page-breadcrumb.component';

import { AvatarCropperDialogComponent } from '../../components/avatar-cropper-dialog/avatar-cropper-dialog.component';
import {
  UserChangePasswordPayload,
  UserProfileResponse,
  UserProfileUpdatePayload
} from '../../models/profile.model';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    PageBreadcrumbComponent,
    AvatarCropperDialogComponent,
    Button,
    InputText,
    Password,
    Select,
    Dialog,
    Tag,
    Tooltip,
    LucideUser,
    LucidePhone,
    LucideMapPin,
    LucideBuilding,
    LucideGlobe,
    LucideClock,
    LucideShield,
    LucideCircleAlert,
    LucideCircleCheck,
    LucideLock,
    LucideCopy,
    LucideCamera,
    LucideTrash
  ],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  private readonly profileService = inject(ProfileService);
  private readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);
  private readonly logger = inject(LoggerService);

  // Cropper Dialog Component ref
  readonly cropperDialog = viewChild<AvatarCropperDialogComponent>('cropperDialog');

  // State Signals
  readonly isLoading = signal<boolean>(false);
  readonly isSaving = signal<boolean>(false);
  readonly profile = signal<UserProfileResponse | null>(null);

  // Avatar Management Signals
  readonly showCropperModal = signal<boolean>(false);
  readonly isUploadingAvatar = signal<boolean>(false);
  readonly isDeletingAvatar = signal<boolean>(false);
  readonly selectedAvatarFile = signal<File | null>(null);
  readonly isAvatarMenuOpen = signal<boolean>(false);

  // Form Field Signals
  readonly firstName = signal<string>('');
  readonly lastName = signal<string>('');
  readonly phone = signal<string>('');
  readonly avatarUrl = signal<string>('');
  readonly country = signal<string>('BO');
  readonly city = signal<string>('');
  readonly address = signal<string>('');
  readonly timezone = signal<string>('America/La_Paz');

  // Change Password Modal Signals
  readonly showPasswordModal = signal<boolean>(false);
  readonly isChangingPassword = signal<boolean>(false);
  readonly currentPassword = signal<string>('');
  readonly newPassword = signal<string>('');
  readonly confirmPassword = signal<string>('');

  // Active Role from AuthService
  readonly activeRole = this.authService.activeRole;

  // Country Options (Comprehensive & Alphabetically Sorted)
  readonly countryOptions = [
    { label: 'Alemania (DE)', value: 'DE' },
    { label: 'Argentina (AR)', value: 'AR' },
    { label: 'Bolivia (BO)', value: 'BO' },
    { label: 'Brasil (BR)', value: 'BR' },
    { label: 'Canadá (CA)', value: 'CA' },
    { label: 'Chile (CL)', value: 'CL' },
    { label: 'Colombia (CO)', value: 'CO' },
    { label: 'Costa Rica (CR)', value: 'CR' },
    { label: 'Cuba (CU)', value: 'CU' },
    { label: 'Ecuador (EC)', value: 'EC' },
    { label: 'El Salvador (SV)', value: 'SV' },
    { label: 'España (ES)', value: 'ES' },
    { label: 'Estados Unidos (US)', value: 'US' },
    { label: 'Francia (FR)', value: 'FR' },
    { label: 'Guatemala (GT)', value: 'GT' },
    { label: 'Honduras (HN)', value: 'HN' },
    { label: 'Italia (IT)', value: 'IT' },
    { label: 'México (MX)', value: 'MX' },
    { label: 'Nicaragua (NI)', value: 'NI' },
    { label: 'Panamá (PA)', value: 'PA' },
    { label: 'Paraguay (PY)', value: 'PY' },
    { label: 'Perú (PE)', value: 'PE' },
    { label: 'Portugal (PT)', value: 'PT' },
    { label: 'Puerto Rico (PR)', value: 'PR' },
    { label: 'Reino Unido (GB)', value: 'GB' },
    { label: 'República Dominicana (DO)', value: 'DO' },
    { label: 'Uruguay (UY)', value: 'UY' },
    { label: 'Venezuela (VE)', value: 'VE' }
  ];

  // Timezone Options (IANA Standard)
  readonly timezoneOptions = [
    { label: 'America/La_Paz (BOT, UTC-4)', value: 'America/La_Paz' },
    { label: 'America/Asuncion (PYT, UTC-4/UTC-3)', value: 'America/Asuncion' },
    { label: 'America/Bogota (COT, UTC-5)', value: 'America/Bogota' },
    { label: 'America/Buenos_Aires (ART, UTC-3)', value: 'America/Buenos_Aires' },
    { label: 'America/Caracas (VET, UTC-4)', value: 'America/Caracas' },
    { label: 'America/Chicago (CST/CDT, UTC-6/UTC-5)', value: 'America/Chicago' },
    { label: 'America/Lima (PET, UTC-5)', value: 'America/Lima' },
    { label: 'America/Los_Angeles (PST/PDT, UTC-8/UTC-7)', value: 'America/Los_Angeles' },
    { label: 'America/Mexico_City (CST, UTC-6)', value: 'America/Mexico_City' },
    { label: 'America/Montevideo (UYT, UTC-3)', value: 'America/Montevideo' },
    { label: 'America/New_York (EST/EDT, UTC-5/UTC-4)', value: 'America/New_York' },
    { label: 'America/Santiago (CLT, UTC-4/UTC-3)', value: 'America/Santiago' },
    { label: 'America/Sao_Paulo (BRT, UTC-3)', value: 'America/Sao_Paulo' },
    { label: 'Europe/London (GMT/BST, UTC+0/UTC+1)', value: 'Europe/London' },
    { label: 'Europe/Madrid (CET/CEST, UTC+1/UTC+2)', value: 'Europe/Madrid' },
    { label: 'Europe/Paris (CET/CEST, UTC+1/UTC+2)', value: 'Europe/Paris' },
    { label: 'UTC (Universal Coordinated Time)', value: 'UTC' }
  ];

  // Initials computation
  readonly userInitials = computed<string>(() => {
    const fn = this.firstName().trim();
    const ln = this.lastName().trim();
    const p = this.profile();
    if (fn || ln) {
      const f = fn ? fn.charAt(0).toUpperCase() : '';
      const l = ln ? ln.charAt(0).toUpperCase() : '';
      return `${f}${l}`;
    }
    if (p?.username) {
      return p.username.substring(0, 2).toUpperCase();
    }
    return 'NA';
  });

  // Track if any profile form field has been modified (Dirty checking)
  readonly isDirty = computed<boolean>(() => {
    const p = this.profile();
    if (!p) return false;
    return (
      this.firstName().trim() !== (p.first_name || '').trim() ||
      this.lastName().trim() !== (p.last_name || '').trim() ||
      this.phone().trim() !== (p.phone || '').trim() ||
      (this.country() || 'BO') !== (p.country || 'BO') ||
      this.city().trim() !== (p.city || '').trim() ||
      this.address().trim() !== (p.address || '').trim() ||
      (this.timezone() || 'America/La_Paz') !== (p.timezone || 'America/La_Paz')
    );
  });

  // Password Validation
  readonly isPasswordValid = computed<boolean>(() => {
    const cp = this.currentPassword();
    const np = this.newPassword();
    const conf = this.confirmPassword();

    return (
      cp.length > 0 &&
      np.length >= 6 &&
      np === conf &&
      np !== cp
    );
  });

  readonly passwordError = computed<string | null>(() => {
    const cp = this.currentPassword();
    const np = this.newPassword();
    const conf = this.confirmPassword();

    if (np.length > 0 && np.length < 6) {
      return 'La nueva contraseña debe tener al menos 6 caracteres';
    }
    if (np.length >= 6 && cp.length > 0 && np === cp) {
      return 'La nueva contraseña no puede ser idéntica a la actual';
    }
    if (conf.length > 0 && np !== conf) {
      return 'Las contraseñas no coinciden';
    }
    return null;
  });

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading.set(true);
    this.profileService.getMyProfile().subscribe({
      next: p => {
        this.profile.set(p);
        this.populateForm(p);
        this.isLoading.set(false);
      },
      error: err => {
        this.logger.error('Error loading profile', err, 'ProfileComponent');
        this.isLoading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar la información de tu perfil'
        });
      }
    });
  }

  private populateForm(p: UserProfileResponse): void {
    this.firstName.set(p.first_name || '');
    this.lastName.set(p.last_name || '');
    this.phone.set(p.phone || '');
    this.avatarUrl.set(p.avatar_url || '');
    this.country.set(p.country || 'BO');
    this.city.set(p.city || '');
    this.address.set(p.address || '');
    this.timezone.set(p.timezone || 'America/La_Paz');
  }

  onDiscardChanges(): void {
    const p = this.profile();
    if (p) {
      this.populateForm(p);
      this.messageService.add({
        severity: 'info',
        summary: 'Cambios Descartados',
        detail: 'Se restauraron los datos originales del perfil'
      });
    }
  }

  // Avatar Management: File Selection, Cropping & Upload
  onAvatarFileSelected(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const file = inputEl.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formato no compatible',
        detail: 'Por favor selecciona una imagen JPG, PNG, WEBP o GIF'
      });
      inputEl.value = '';
      return;
    }

    // Validate size (max 5 MB)
    if (file.size > 5 * 1024 * 1024) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Archivo muy grande',
        detail: 'La imagen no debe superar los 5 MB'
      });
      inputEl.value = '';
      return;
    }

    this.selectedAvatarFile.set(file);
    this.showCropperModal.set(true);

    // Give dialog a microtask to attach canvas ref before initializing crop
    setTimeout(() => {
      this.cropperDialog()?.initCrop(file);
    }, 50);

    inputEl.value = '';
  }

  onCropApplied(blob: Blob): void {
    this.isUploadingAvatar.set(true);

    this.profileService.uploadAvatar(blob, 'avatar.webp').subscribe({
      next: uploadRes => {
        // Automatically save new avatar URL to profile
        this.profileService.updateMyProfile({ avatar_url: uploadRes.url }).subscribe({
          next: updated => {
            this.avatarUrl.set(updated.avatar_url || '');
            this.profile.update(prev => prev ? { ...prev, avatar_url: updated.avatar_url } : null);
            this.authService.refreshProfile();
            this.isUploadingAvatar.set(false);
            this.showCropperModal.set(false);

            this.messageService.add({
              severity: 'success',
              summary: 'Foto Actualizada',
              detail: 'Tu foto de perfil fue guardada y optimizada exitosamente'
            });
          },
          error: err => {
            this.isUploadingAvatar.set(false);
            this.logger.error('Error saving avatar URL to profile', err, 'ProfileComponent');
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Se subió la imagen pero no se pudo asociar a tu perfil'
            });
          }
        });
      },
      error: err => {
        this.isUploadingAvatar.set(false);
        this.logger.error('Error uploading avatar to media storage', err, 'ProfileComponent');
        const errorMsg = this.extractErrorMessage(err, 'No se pudo subir la foto de perfil');
        this.messageService.add({
          severity: 'error',
          summary: 'Error al Subir',
          detail: errorMsg
        });
      }
    });
  }

  toggleAvatarMenu(event: MouseEvent): void {
    event.stopPropagation();
    const hasAvatar = !!(this.avatarUrl() || this.profile()?.avatar_url);
    if (hasAvatar) {
      this.isAvatarMenuOpen.update(prev => !prev);
    }
  }

  closeAvatarMenu(): void {
    this.isAvatarMenuOpen.set(false);
  }

  onDeleteAvatar(): void {
    this.closeAvatarMenu();
    this.isDeletingAvatar.set(true);

    this.profileService.deleteAvatar().subscribe({
      next: () => {
        this.avatarUrl.set('');
        this.profile.update(prev => prev ? { ...prev, avatar_url: null } : null);
        this.authService.refreshProfile();
        this.isDeletingAvatar.set(false);

        this.messageService.add({
          severity: 'success',
          summary: 'Foto Eliminada',
          detail: 'Se eliminó tu foto de perfil y se restauraron tus iniciales'
        });
      },
      error: err => {
        this.isDeletingAvatar.set(false);
        this.logger.error('Error deleting avatar', err, 'ProfileComponent');
        const errorMsg = this.extractErrorMessage(err, 'No se pudo eliminar la foto de perfil');
        this.messageService.add({
          severity: 'error',
          summary: 'Error al Eliminar',
          detail: errorMsg
        });
      }
    });
  }

  copyUserId(): void {
    const id = this.profile()?.id;
    if (id) {
      navigator.clipboard.writeText(id).then(() => {
        this.messageService.add({
          severity: 'info',
          summary: 'ID Copiado',
          detail: 'El identificador de usuario se copió al portapapeles'
        });
      });
    }
  }

  getWhatsAppUrl(): string {
    const raw = this.phone().replace(/\D+/g, '');
    return raw ? `https://wa.me/${raw}` : '';
  }

  onSaveProfile(): void {
    if (!this.isDirty()) return;

    this.isSaving.set(true);

    const payload: UserProfileUpdatePayload = {
      first_name: this.firstName().trim() || null,
      last_name: this.lastName().trim() || null,
      phone: this.phone().trim() || null,
      country: this.country() || 'BO',
      city: this.city().trim() || null,
      address: this.address().trim() || null,
      timezone: this.timezone() || 'America/La_Paz'
    };

    this.profileService.updateMyProfile(payload).subscribe({
      next: updated => {
        this.profile.set(updated);
        this.populateForm(updated);
        this.isSaving.set(false);
        this.authService.refreshProfile();

        this.messageService.add({
          severity: 'success',
          summary: 'Perfil Actualizado',
          detail: 'Tus datos personales fueron guardados exitosamente'
        });
      },
      error: err => {
        this.isSaving.set(false);
        this.logger.error('Error updating profile', err, 'ProfileComponent');
        const errorMsg = this.extractErrorMessage(err, 'No se pudo actualizar tu perfil');
        this.messageService.add({
          severity: 'error',
          summary: 'Error al Guardar',
          detail: errorMsg
        });
      }
    });
  }

  openPasswordModal(): void {
    this.currentPassword.set('');
    this.newPassword.set('');
    this.confirmPassword.set('');
    this.showPasswordModal.set(true);
  }

  closePasswordModal(): void {
    this.showPasswordModal.set(false);
  }

  onSubmitChangePassword(): void {
    if (!this.isPasswordValid()) return;

    this.isChangingPassword.set(true);

    const payload: UserChangePasswordPayload = {
      current_password: this.currentPassword(),
      new_password: this.newPassword()
    };

    this.profileService.changeMyPassword(payload).subscribe({
      next: res => {
        this.isChangingPassword.set(false);
        this.showPasswordModal.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Contraseña Actualizada',
          detail: res.message || 'Tu contraseña fue modificada exitosamente'
        });
      },
      error: err => {
        this.isChangingPassword.set(false);
        this.logger.error('Error changing password', err, 'ProfileComponent');
        const errorMsg = this.extractErrorMessage(err, 'No se pudo actualizar la contraseña');
        this.messageService.add({
          severity: 'error',
          summary: 'Error al Cambiar Contraseña',
          detail: errorMsg
        });
      }
    });
  }

  private extractErrorMessage(err: unknown, fallback: string): string {
    const errorObj = err as { error?: { detail?: unknown; message?: unknown }; message?: unknown };
    const detail = errorObj?.error?.detail;

    if (typeof detail === 'string') {
      return detail;
    }

    if (Array.isArray(detail) && detail.length > 0) {
      const first = detail[0] as {
        loc?: (string | number)[];
        msg?: string;
        ctx?: { reason?: string };
      };
      return first.msg || fallback;
    }

    if (typeof errorObj?.error?.message === 'string') {
      return errorObj.error.message;
    }

    if (typeof errorObj?.message === 'string') {
      return errorObj.message;
    }

    return fallback;
  }
}
