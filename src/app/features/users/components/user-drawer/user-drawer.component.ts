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
  signal,
  untracked
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ConfirmationService, MessageService } from 'primeng/api';
import { Avatar } from 'primeng/avatar';
import { Button } from 'primeng/button';
import { Drawer } from 'primeng/drawer';
import { InputText } from 'primeng/inputtext';
import { MultiSelect } from 'primeng/multiselect';
import { Password } from 'primeng/password';
import { Select } from 'primeng/select';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { Tag } from 'primeng/tag';
import { Textarea } from 'primeng/textarea';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Tooltip } from 'primeng/tooltip';
import { forkJoin } from 'rxjs';
import {
  LucideBuilding,
  LucideCircleAlert,
  LucideClock,
  LucideCopy,
  LucideGlobe,
  LucideHistory,
  LucideLaptop,
  LucideMapPin,
  LucidePhone,
  LucideShield,
  LucideSmartphone,
  LucideStickyNote,
  LucideUser,
  LucideUserPlus
} from '@lucide/angular';

import { LoggerService } from '@core/services/logger.service';

import {
  RoleCatalogItem,
  User,
  UserCreatePayload,
  UserLoginLog,
  UserUpdatePayload
} from '../../models/user.model';
import { UserService } from '../../services/user.service';

export interface RoleOption {
  slug: string;
  name: string;
  icon?: string;
  description?: string;
}

@Component({
  selector: 'app-user-drawer',
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
    Password,
    ToggleSwitch,
    MultiSelect,
    Select,
    Textarea,
    TableModule,
    Tag,
    Avatar,
    Tooltip,
    LucideCircleAlert,
    LucideUser,
    LucideUserPlus,
    LucideShield,
    LucideHistory,
    LucideCopy,
    LucideLaptop,
    LucideSmartphone,
    LucidePhone,
    LucideMapPin,
    LucideBuilding,
    LucideGlobe,
    LucideClock,
    LucideStickyNote
  ],
  templateUrl: './user-drawer.component.html',
  styleUrls: ['./user-drawer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDrawerComponent {
  private readonly userService = inject(UserService);
  private readonly logger = inject(LoggerService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  // Inputs / Two-way models
  readonly visible = model<boolean>(false);
  readonly user = input<User | null>(null);
  readonly mode = input<'create' | 'edit'>('create');

  // Outputs
  readonly userSaved = output<User>();
  readonly userDeleted = output<string>();

  // State
  readonly activeTab = signal<string>('0');
  readonly isSubmitting = signal<boolean>(false);
  readonly isLoadingDetails = signal<boolean>(false);
  readonly freshUser = signal<User | null>(null);

  readonly currentDisplayUser = computed<User | null>(() => {
    return this.freshUser() || this.user();
  });

  // Industry Standard Username Validation (RFC / Auth0 / GitHub guidelines)
  readonly USERNAME_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9._-]*[a-zA-Z0-9])?$/;

  readonly usernameValidation = computed<{ isValid: boolean; error: string | null }>(() => {
    const raw = this.username();
    if (!raw || raw.trim().length === 0) {
      return { isValid: false, error: 'El nombre de usuario es obligatorio' };
    }
    if (/\s/.test(raw)) {
      return { isValid: false, error: 'El nombre de usuario no puede contener espacios' };
    }
    const trimmed = raw.trim();
    if (trimmed.length < 3) {
      return { isValid: false, error: 'Debe contener al menos 3 caracteres' };
    }
    if (trimmed.length > 30) {
      return { isValid: false, error: 'No puede exceder los 30 caracteres' };
    }
    if (/^[._-]/.test(trimmed) || /[._-]$/.test(trimmed)) {
      return { isValid: false, error: 'No puede iniciar ni terminar con puntos, guiones o guiones bajos' };
    }
    if (/[._-]{2,}/.test(trimmed)) {
      return { isValid: false, error: 'No se permiten caracteres especiales (. _ -) consecutivos' };
    }
    if (!this.USERNAME_REGEX.test(trimmed)) {
      return { isValid: false, error: 'Solo se permiten letras, números, puntos (.), guiones (-) y guiones bajos (_)' };
    }
    return { isValid: true, error: null };
  });

  // Industry Standard Email Validation (RFC 5321 & RFC 5322 Simplified)
  readonly EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  readonly DOMAIN_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

  readonly emailValidation = computed<{ isValid: boolean; error: string | null }>(() => {
    const raw = this.email();
    if (!raw || raw.trim().length === 0) {
      return { isValid: false, error: 'El correo electrónico es obligatorio' };
    }
    if (/\s/.test(raw)) {
      return { isValid: false, error: 'El correo no puede contener espacios' };
    }
    const trimmed = raw.trim();
    if (!trimmed.includes('@')) {
      return { isValid: false, error: 'Debe incluir el símbolo @' };
    }
    const parts = trimmed.split('@');
    if (parts.length > 2) {
      return { isValid: false, error: 'No puede contener más de un símbolo @' };
    }
    const [local, domain] = parts;
    if (!local) {
      return { isValid: false, error: 'Debe incluir el usuario antes del @' };
    }
    if (!domain) {
      return { isValid: false, error: 'Debe incluir el dominio después del @ (ej. gmail.com)' };
    }
    if (/^[._-]/.test(local) || /[._-]$/.test(local)) {
      return { isValid: false, error: 'El usuario del correo no puede iniciar ni terminar con puntos o guiones' };
    }
    if (/\.{2,}/.test(local)) {
      return { isValid: false, error: 'El usuario del correo no puede contener puntos consecutivos' };
    }
    if (!/^[a-zA-Z0-9._%+-]+$/.test(local)) {
      return { isValid: false, error: 'El usuario del correo contiene caracteres no válidos' };
    }
    if (!domain.includes('.')) {
      return { isValid: false, error: 'El dominio debe incluir una extensión válida (ej. .com)' };
    }
    if (/^[.-]/.test(domain) || /[.-]$/.test(domain)) {
      return { isValid: false, error: 'El dominio no puede iniciar ni terminar con puntos o guiones' };
    }
    if (/\.{2,}/.test(domain)) {
      return { isValid: false, error: 'El dominio no puede contener puntos consecutivos' };
    }
    if (domain.includes('xn--')) {
      return { isValid: false, error: 'No se permiten dominios con codificación especial o Punycode' };
    }
    if (!/^[a-zA-Z0-9.-]+$/.test(domain)) {
      return { isValid: false, error: 'El dominio contiene caracteres no válidos (solo letras, números y guiones)' };
    }
    if (!this.DOMAIN_REGEX.test(domain)) {
      return { isValid: false, error: 'Formato de dominio no válido. Ejemplo: empresa.com' };
    }
    return { isValid: true, error: null };
  });

  // Password Validation
  readonly passwordValidation = computed<{ isValid: boolean; error: string | null }>(() => {
    const p = this.password();
    if (this.mode() === 'create') {
      if (!p || p.length === 0) {
        return { isValid: false, error: 'La contraseña es obligatoria' };
      }
      if (p.length < 6) {
        return { isValid: false, error: 'La contraseña debe tener al menos 6 caracteres' };
      }
    } else {
      if (p && p.length > 0 && p.length < 6) {
        return { isValid: false, error: 'La nueva contraseña debe tener al menos 6 caracteres' };
      }
    }
    return { isValid: true, error: null };
  });

  // Global Form Validity Signal for Submit Button
  readonly isFormValid = computed<boolean>(() => {
    return (
      this.usernameValidation().isValid &&
      this.emailValidation().isValid &&
      this.passwordValidation().isValid
    );
  });

  // Form Signals
  readonly username = signal<string>('');
  readonly email = signal<string>('');
  readonly firstName = signal<string>('');
  readonly lastName = signal<string>('');
  readonly password = signal<string>('');
  readonly phone = signal<string>('');
  readonly avatarUrl = signal<string>('');
  readonly country = signal<string>('BO');
  readonly city = signal<string>('');
  readonly address = signal<string>('');
  readonly notes = signal<string>('');
  readonly timezone = signal<string>('America/La_Paz');
  readonly isActive = signal<boolean>(true);
  readonly isVerified = signal<boolean>(false);
  readonly isSuperuser = signal<boolean>(false);
  readonly selectedRoleSlugs = signal<string[]>([]);

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

  // Roles Catalog
  readonly rolesCatalog = signal<RoleCatalogItem[]>([]);
  readonly isLoadingRoles = signal<boolean>(false);

  // Login History State
  readonly loginLogs = signal<UserLoginLog[]>([]);
  readonly loginTotal = signal<number>(0);
  readonly isLoadingLogins = signal<boolean>(false);
  readonly loginFirst = signal<number>(0);
  readonly loginRows = signal<number>(10);

  // Computed Roles Options for MultiSelect
  readonly roleOptions = computed<RoleOption[]>(() => {
    return this.rolesCatalog().map(item => {
      // Clean label: strip primeicons prefix if present (e.g. "pi pi-user Administrador" -> "Administrador")
      const cleanName = item.label.replace(/^pi\s+pi-[\w-]+\s*/i, '').trim();
      return {
        slug: String(item.value),
        name: cleanName || String(item.value),
        icon: item.extra?.icon || 'pi pi-shield',
        description: item.extra?.description || ''
      };
    });
  });

  // Selected Roles details for chips/cards display
  readonly selectedRolesDetails = computed<RoleOption[]>(() => {
    const selected = new Set(this.selectedRoleSlugs());
    return this.roleOptions().filter(r => selected.has(r.slug));
  });

  private lastOpenedUserId: string | null = null;
  private lastVisibleState = false;

  constructor() {
    // Reactively populate form when drawer opens or user changes
    effect(() => {
      const isVisible = this.visible();
      const currentUser = this.user();
      const currentMode = this.mode();

      if (!isVisible) {
        this.lastVisibleState = false;
        this.lastOpenedUserId = null;
        return;
      }

      const userId = currentUser?.id ?? null;
      const isNewOpen = !this.lastVisibleState || this.lastOpenedUserId !== userId;
      this.lastVisibleState = true;
      this.lastOpenedUserId = userId;

      if (isNewOpen) {
        this.loadRolesCatalog();

        if (currentMode === 'edit' && userId) {
          // Pre-populate with table snapshot immediately to avoid blank flash
          this.freshUser.set(null);
          this.initForm(currentUser, 'edit', true);
          const rows = untracked(() => this.loginRows());
          this.loadLoginHistory(userId, 0, rows);

          // Request authoritative fresh data from server
          this.isLoadingDetails.set(true);
          this.userService.getUserById(userId).subscribe({
            next: fresh => {
              this.freshUser.set(fresh);
              this.initForm(fresh, 'edit', false);
              this.isLoadingDetails.set(false);
            },
            error: err => {
              this.logger.error('Error fetching authoritative user detail', err, 'UserDrawerComponent');
              this.isLoadingDetails.set(false);
            }
          });
        } else {
          this.freshUser.set(null);
          this.initForm(null, 'create', true);
        }
      }
    });
  }

  onUsernameKeyDown(event: KeyboardEvent): void {
    if (event.key === ' ') {
      event.preventDefault();
    }
  }

  onUsernamePaste(event: ClipboardEvent): void {
    const text = event.clipboardData?.getData('text') || '';
    if (/\s/.test(text)) {
      event.preventDefault();
      const sanitized = text.replace(/\s+/g, '');
      const input = event.target as HTMLInputElement;
      const start = input.selectionStart ?? 0;
      const end = input.selectionEnd ?? 0;
      const val = this.username();
      const updated = val.slice(0, start) + sanitized + val.slice(end);
      this.username.set(updated);
    }
  }

  onEmailKeyDown(event: KeyboardEvent): void {
    if (event.key === ' ') {
      event.preventDefault();
    }
  }

  onEmailPaste(event: ClipboardEvent): void {
    const text = event.clipboardData?.getData('text') || '';
    if (/\s/.test(text)) {
      event.preventDefault();
      const sanitized = text.replace(/\s+/g, '');
      const input = event.target as HTMLInputElement;
      const start = input.selectionStart ?? 0;
      const end = input.selectionEnd ?? 0;
      const val = this.email();
      const updated = val.slice(0, start) + sanitized + val.slice(end);
      this.email.set(updated);
    }
  }

  getUserInitials(): string {
    const fn = this.firstName().trim();
    const ln = this.lastName().trim();
    const un = this.username().trim();
    if (fn || ln) {
      return `${fn?.[0] || ''}${ln?.[0] || ''}`.toUpperCase();
    }
    return (un?.[0] || 'U').toUpperCase();
  }

  getWhatsAppUrl(): string {
    const raw = this.phone().replace(/\D+/g, '');
    return raw ? `https://wa.me/${raw}` : '';
  }

  onTabChange(tab: string | number | undefined): void {
    this.activeTab.set(tab != null ? String(tab) : '0');
  }

  private initForm(user: User | null, mode: 'create' | 'edit', resetTab = true): void {
    if (resetTab) {
      this.activeTab.set('0');
      this.loginFirst.set(0);
    }
    if (mode === 'edit' && user) {
      this.username.set(user.username || '');
      this.email.set(user.email || '');
      this.firstName.set(user.first_name || '');
      this.lastName.set(user.last_name || '');
      this.phone.set(user.phone || '');
      this.avatarUrl.set(user.avatar_url || '');
      this.country.set(user.country || 'BO');
      this.city.set(user.city || '');
      this.address.set(user.address || '');
      this.notes.set(user.notes || '');
      this.timezone.set(user.timezone || 'America/La_Paz');
      this.password.set(''); // Blank on edit = don't update password
      this.isActive.set(user.is_active ?? true);
      this.isVerified.set(user.is_verified ?? false);
      this.isSuperuser.set(user.is_superuser ?? false);
      this.selectedRoleSlugs.set(user.role_slugs ? [...user.role_slugs] : []);
    } else {
      // Create defaults
      this.username.set('');
      this.email.set('');
      this.firstName.set('');
      this.lastName.set('');
      this.phone.set('');
      this.avatarUrl.set('');
      this.country.set('BO');
      this.city.set('');
      this.address.set('');
      this.notes.set('');
      this.timezone.set('America/La_Paz');
      this.password.set('');
      this.isActive.set(true);
      this.isVerified.set(false);
      this.isSuperuser.set(false);
      this.selectedRoleSlugs.set([]);
      this.loginLogs.set([]);
      this.loginTotal.set(0);
    }
  }

  private loadRolesCatalog(): void {
    if (this.rolesCatalog().length > 0) return;

    this.isLoadingRoles.set(true);
    this.userService.getRolesCatalog().subscribe({
      next: items => {
        this.rolesCatalog.set(items || []);
        this.isLoadingRoles.set(false);
      },
      error: err => {
        this.logger.error('Error fetching roles catalog', err, 'UserDrawerComponent');
        this.isLoadingRoles.set(false);
      }
    });
  }

  loadLoginHistory(userId: string, offset = 0, limit = 10): void {
    this.isLoadingLogins.set(true);
    forkJoin({
      logs: this.userService.getLoginHistory(userId, offset, limit),
      total: this.userService.countLoginHistory(userId)
    }).subscribe({
      next: ({ logs, total }) => {
        this.loginLogs.set(logs || []);
        this.loginTotal.set(total || 0);
        this.isLoadingLogins.set(false);
      },
      error: err => {
        this.logger.error('Error fetching login history', err, 'UserDrawerComponent');
        this.isLoadingLogins.set(false);
      }
    });
  }

  onLoginLazyLoad(event: TableLazyLoadEvent): void {
    const currentUserId = this.user()?.id;
    if (!currentUserId || this.mode() !== 'edit') return;

    const offset = event.first ?? 0;
    const limit = event.rows ?? 10;
    this.loginFirst.set(offset);
    this.loginRows.set(limit);
    this.loadLoginHistory(currentUserId, offset, limit);
  }

  removeRole(slug: string): void {
    this.selectedRoleSlugs.set(this.selectedRoleSlugs().filter(s => s !== slug));
  }

  getInitials(user: User | null): string {
    if (!user) return 'U';
    const f = user.first_name ? user.first_name.charAt(0) : '';
    const l = user.last_name ? user.last_name.charAt(0) : '';
    return (f + l).toUpperCase() || user.username?.charAt(0).toUpperCase() || 'U';
  }

  formatHostInfo(hostInfo: string | null | undefined): { os: string; browser: string; isMobile: boolean } {
    if (!hostInfo) return { os: 'Desconocido', browser: 'Desconocido', isMobile: false };

    let os = 'SO Desconocido';
    let isMobile = false;
    if (/android/i.test(hostInfo)) {
      os = 'Android';
      isMobile = true;
    } else if (/iphone|ipad|ipod/i.test(hostInfo)) {
      os = 'iOS';
      isMobile = true;
    } else if (/windows nt 10/i.test(hostInfo)) {
      os = 'Windows 10/11';
    } else if (/windows/i.test(hostInfo)) {
      os = 'Windows';
    } else if (/macintosh|mac os x/i.test(hostInfo)) {
      os = 'macOS';
    } else if (/linux/i.test(hostInfo)) {
      os = 'Linux';
    }

    let browser = 'Navegador';
    if (/edg/i.test(hostInfo)) {
      browser = 'Edge';
    } else if (/chrome|crios/i.test(hostInfo)) {
      browser = 'Chrome';
    } else if (/firefox|fxios/i.test(hostInfo)) {
      browser = 'Firefox';
    } else if (/safari/i.test(hostInfo) && !/chrome/i.test(hostInfo)) {
      browser = 'Safari';
    } else if (/opera|opr/i.test(hostInfo)) {
      browser = 'Opera';
    }

    return { os, browser, isMobile };
  }

  copyToClipboard(text: string): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.messageService.add({
          severity: 'info',
          summary: 'Copiado',
          detail: `IP ${text} copiada al portapapeles`,
          life: 2000
        });
      });
    }
  }

  onSubmit(): void {
    const username = this.username().trim();
    const email = this.email().trim();
    const password = this.password();

    // Validations
    if (!this.isFormValid()) {
      const userErr = this.usernameValidation().error;
      const emailErr = this.emailValidation().error;
      const passErr = this.passwordValidation().error;
      const firstError = userErr || emailErr || passErr || 'Verifique los campos con error';

      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario con errores',
        detail: firstError
      });
      this.activeTab.set('0');
      return;
    }

    this.isSubmitting.set(true);

    if (this.mode() === 'create') {
      const payload: UserCreatePayload = {
        username,
        email,
        password,
        first_name: this.firstName().trim() || null,
        last_name: this.lastName().trim() || null,
        phone: this.phone().trim() || null,
        avatar_url: this.avatarUrl().trim() || null,
        country: this.country() || 'BO',
        city: this.city().trim() || null,
        address: this.address().trim() || null,
        notes: this.notes().trim() || null,
        timezone: this.timezone() || 'America/La_Paz',
        is_active: this.isActive(),
        is_verified: this.isVerified(),
        is_superuser: this.isSuperuser(),
        role_slugs: this.selectedRoleSlugs()
      };

      this.userService.createUser(payload).subscribe({
        next: createdUser => {
          this.isSubmitting.set(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Usuario Creado',
            detail: `El usuario @${createdUser.username} fue registrado exitosamente`
          });
          this.userSaved.emit(createdUser);
          this.visible.set(false);
        },
        error: err => {
          this.isSubmitting.set(false);
          const errorMsg = this.extractErrorMessage(err, 'No se pudo crear el usuario');
          this.messageService.add({
            severity: 'error',
            summary: 'Error al Crear',
            detail: errorMsg
          });
          this.activeTab.set('0');
        }
      });
    } else {
      const currentUser = this.user();
      if (!currentUser?.id) return;

      const payload: UserUpdatePayload = {
        username,
        email,
        first_name: this.firstName().trim() || null,
        last_name: this.lastName().trim() || null,
        phone: this.phone().trim() || null,
        avatar_url: this.avatarUrl().trim() || null,
        country: this.country() || 'BO',
        city: this.city().trim() || null,
        address: this.address().trim() || null,
        notes: this.notes().trim() || null,
        timezone: this.timezone() || 'America/La_Paz',
        is_active: this.isActive(),
        is_verified: this.isVerified(),
        is_superuser: this.isSuperuser(),
        role_slugs: this.selectedRoleSlugs()
      };

      // Only include password if user typed a new one
      if (password && password.trim().length > 0) {
        payload.password = password;
      }

      this.userService.updateUser(currentUser.id, payload).subscribe({
        next: updatedUser => {
          this.isSubmitting.set(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Usuario Actualizado',
            detail: `Los datos de @${updatedUser.username} fueron actualizados`
          });
          this.userSaved.emit(updatedUser);
          this.visible.set(false);
        },
        error: err => {
          this.isSubmitting.set(false);
          const errorMsg = this.extractErrorMessage(err, 'No se pudo actualizar el usuario');
          this.messageService.add({
            severity: 'error',
            summary: 'Error al Actualizar',
            detail: errorMsg
          });
          this.activeTab.set('0');
        }
      });
    }
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

      const fieldMap: Record<string, string> = {
        email: 'Correo Electrónico',
        username: 'Usuario',
        password: 'Contraseña',
        first_name: 'Nombre',
        last_name: 'Apellido',
        phone: 'Teléfono',
        avatar_url: 'URL del Avatar',
        country: 'País',
        city: 'Ciudad',
        address: 'Dirección',
        notes: 'Notas Administrativas',
        timezone: 'Zona Horaria',
        role_slugs: 'Roles'
      };

      const fieldKey = first.loc && first.loc.length > 0 ? String(first.loc[first.loc.length - 1]) : null;
      const readableField = fieldKey && fieldMap[fieldKey] ? fieldMap[fieldKey] : (fieldKey || 'Campo');
      let message = first.msg || 'Dato no válido';

      if (message.includes('value is not a valid email address')) {
        message = 'La dirección de correo electrónico no es válida';
        if (first.ctx?.reason) {
          message += ` (${first.ctx.reason})`;
        }
      }

      return `${readableField}: ${message}`;
    }

    if (typeof errorObj?.error?.message === 'string') {
      return errorObj.error.message;
    }

    if (typeof errorObj?.message === 'string') {
      return errorObj.message;
    }

    return fallback;
  }

  onDeleteUser(): void {
    const currentUser = this.user();
    if (!currentUser?.id) return;

    this.confirmationService.confirm({
      message: `¿Está seguro de que desea eliminar permanentemente al usuario @${currentUser.username}? Esta acción no se puede deshacer.`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
      accept: () => {
        this.userService.deleteUser(currentUser.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Usuario Eliminado',
              detail: `El usuario @${currentUser.username} ha sido eliminado`
            });
            this.userDeleted.emit(currentUser.id);
            this.visible.set(false);
          },
          error: err => {
            this.logger.error('Error deleting user', err, 'UserDrawerComponent');
            const errorMsg = this.extractErrorMessage(err, 'No se pudo eliminar el usuario');
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: errorMsg
            });
          }
        });
      }
    });
  }

  closeDrawer(): void {
    this.visible.set(false);
  }
}
