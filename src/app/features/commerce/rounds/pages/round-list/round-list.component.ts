import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { Tooltip } from 'primeng/tooltip';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  LucideCalendar,
  LucideCoins,
  LucideSearch,
  LucideShieldCheck,
  LucideTrendingUp
} from '@lucide/angular';

import { LoggerService } from '@core/services/logger.service';

import { RoundDrawerComponent } from '../../components/round-drawer/round-drawer.component';
import {
  CommerceRound,
  getRoundStatusInfo,
  RoundStatusInfo
} from '../../models/round.model';
import { RoundService } from '../../services/round.service';

@Component({
  selector: 'app-round-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    Button,
    InputText,
    IconField,
    InputIcon,
    Tooltip,
    LucideTrendingUp,
    LucideSearch,
    LucideCalendar,
    LucideCoins,
    LucideShieldCheck,
    RoundDrawerComponent
  ],
  templateUrl: './round-list.component.html',
  styleUrls: ['./round-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoundListComponent implements OnInit {
  private readonly roundService = inject(RoundService);
  private readonly logger = inject(LoggerService);
  private readonly messageService = inject(MessageService);

  // Search debounce
  private readonly search$ = new Subject<string>();
  readonly search = signal<string>('');

  // State
  readonly rounds = signal<CommerceRound[]>([]);
  readonly totalRounds = signal<number>(0);
  readonly isLoading = signal<boolean>(false);

  // Dialog State
  readonly dialogVisible = signal<boolean>(false);
  readonly selectedRound = signal<CommerceRound | null>(null);
  readonly dialogMode = signal<'create' | 'edit'>('create');

  // Computed Financial Metrics
  readonly totalCapitalInvested = computed(() => {
    return this.rounds().reduce((acc, r) => acc + (Number(r.capital_invested) || 0), 0);
  });

  readonly roundsInRecovery = computed(() => {
    return this.rounds().filter(r => ['ACTIVE', 'IN_RECOVERY', 'NEAR_BREAKEVEN'].includes((r.status || '').toUpperCase())).length;
  });

  readonly roundsRecovered = computed(() => {
    return this.rounds().filter(r => ['RECOVERED', 'LIQUIDATED'].includes((r.status || '').toUpperCase())).length;
  });

  constructor() {
    this.search$
      .pipe(debounceTime(350), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe(term => this.fetchRounds(term));
  }

  ngOnInit(): void {
    this.fetchRounds();
  }

  fetchRounds(term = this.search()): void {
    this.isLoading.set(true);
    this.roundService.loadRoundsPage({ offset: 0, limit: 100, search: term }).subscribe({
      next: res => {
        this.rounds.set(res.data);
        this.totalRounds.set(res.total);
        this.isLoading.set(false);
      },
      error: err => {
        this.logger.error('Error fetching rounds', err, 'RoundListComponent');
        this.isLoading.set(false);
      }
    });
  }

  onSearch(term: string): void {
    this.search.set(term);
    this.search$.next(term);
  }

  openCreateRound(): void {
    this.selectedRound.set(null);
    this.dialogMode.set('create');
    this.dialogVisible.set(true);
  }

  openEditRound(rnd: CommerceRound): void {
    this.selectedRound.set(rnd);
    this.dialogMode.set('edit');
    this.dialogVisible.set(true);
  }

  onRoundSaved(): void {
    this.fetchRounds();
  }

  onRoundDeleted(): void {
    this.fetchRounds();
  }

  recalculateRound(rnd: CommerceRound): void {
    this.roundService.recalculateRound(rnd.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Métricas Recalculadas',
          detail: `Punto de equilibrio recalculado para "${rnd.name}".`
        });
        this.fetchRounds();
      },
      error: err => {
        this.logger.error('Error recalculating round', err, 'RoundListComponent');
        this.messageService.add({
          severity: 'error',
          summary: 'Error al Recalcular',
          detail: err?.error?.detail || 'No se pudo forzar el recálculo financiero.'
        });
      }
    });
  }

  getStatusInfo(status: string): RoundStatusInfo {
    return getRoundStatusInfo(status);
  }
}
