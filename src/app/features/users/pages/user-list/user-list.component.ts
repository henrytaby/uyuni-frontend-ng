import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { Avatar } from 'primeng/avatar';
import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { LucideCircleAlert,LucideCircleCheck, LucideMail, LucideShield } from '@lucide/angular';

import { LoggerService } from '@core/services/logger.service';

import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { UserFilterService, UserFilterState } from '../../services/user-filter.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    Tag,
    Avatar,
    Button,
    InputText,
    IconField,
    InputIcon,
    Tooltip,
    Select,
    LucideMail,
    LucideShield,
    LucideCircleCheck,
    LucideCircleAlert
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent {
  private readonly userService = inject(UserService);
  private readonly filterService = inject(UserFilterService);
  private readonly logger = inject(LoggerService);

  // State Signals
  userList = signal<User[]>([]);
  totalRecords = signal<number>(0);
  isLoading = signal<boolean>(false);
  first = signal<number>(0);
  rows = signal<number>(15);
  
  // Search subject for debouncing
  private readonly searchSubject = new Subject<string>();
  searchValue = signal<string>('');

  // Filter signals
  selectedActivo = signal<boolean | null>(null);
  selectedSuperuser = signal<boolean | null>(null);
  selectedVerified = signal<boolean | null>(null);

  readonly activoOptions: { label: string; value: boolean }[] = [
    { label: 'Activos', value: true },
    { label: 'Inactivos', value: false }
  ];

  readonly superuserOptions: { label: string; value: boolean }[] = [
    { label: 'Superusuario', value: true },
    { label: 'Usuario Regular', value: false }
  ];

  readonly verifiedOptions: { label: string; value: boolean }[] = [
    { label: 'Verificados', value: true },
    { label: 'No Verificados', value: false }
  ];

  constructor() {
    // Setup search debounce with automatic cleanup
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntilDestroyed()
    ).subscribe(value => {
      this.searchValue.set(value);
      this.first.set(0); // Reset to first page on search
      this.loadData({ first: 0, rows: this.rows() });
    });
  }

  onActivoChange(isActive: boolean | null): void {
    this.selectedActivo.set(isActive);
    this.resetAndReload();
  }

  onSuperuserChange(isSuperuser: boolean | null): void {
    this.selectedSuperuser.set(isSuperuser);
    this.resetAndReload();
  }

  onVerifiedChange(isVerified: boolean | null): void {
    this.selectedVerified.set(isVerified);
    this.resetAndReload();
  }

  clearFilters(): void {
    this.selectedActivo.set(null);
    this.selectedSuperuser.set(null);
    this.selectedVerified.set(null);
    this.resetAndReload();
  }

  /**
   * Reset pagination and reload data
   */
  private resetAndReload(): void {
    this.first.set(0);
    this.loadData({ first: 0, rows: this.rows() });
  }

  /**
   * Main data loading method for PrimeNG Lazy Loading
   */
  loadData(event: TableLazyLoadEvent | { first: number, rows: number }): void {
    this.isLoading.set(true);
    
    // Update local state from event
    const newFirst = event.first ?? 0;
    const newRows = event.rows ?? 15;
    
    this.first.set(newFirst);
    this.rows.set(newRows);

    const filterState: UserFilterState = {
      selectedActivo: this.selectedActivo(),
      selectedSuperuser: this.selectedSuperuser(),
      selectedVerified: this.selectedVerified()
    };

    let sortField: string | undefined;
    let sortOrder: number | undefined;

    if ('sortField' in event) {
      sortField = event.sortField?.toString();
      sortOrder = event.sortOrder ?? undefined;
    }

    const params = this.filterService.buildUserParams(
      filterState,
      this.searchValue(),
      newFirst,
      newRows,
      sortField,
      sortOrder
    );

    this.userService.loadUserPage(params).subscribe({
      next: (result) => {
        this.userList.set(result.data);
        this.totalRecords.set(result.total);
        this.isLoading.set(false);
      },
      error: (err: Error) => {
        this.logger.error('Error loading user data', err, 'UserListComponent');
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Handles search input changes
   */
  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  /**
   * Get initials for Avatar based on first_name and last_name
   */
  getInitials(user: User): string {
    const firstInitial = user.first_name?.charAt(0).toUpperCase() || '';
    const lastInitial = user.last_name?.charAt(0).toUpperCase() || '';
    
    if (!firstInitial && !lastInitial && user.username) {
      return user.username.slice(0, 2).toUpperCase();
    }

    return `${firstInitial}${lastInitial}`;
  }
}
