import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { ConfirmationService, MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { Tag } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  LucideSearch,
  LucideShare2,
  LucideSlidersHorizontal,
  LucideTag,
  LucideTrendingUp,
  LucideVideo
} from '@lucide/angular';

import { LoggerService } from '@core/services/logger.service';

import { CategoryDialogComponent } from '../../components/category-dialog/category-dialog.component';
import { ChannelDialogComponent } from '../../components/channel-dialog/channel-dialog.component';
import { LiveBasketDialogComponent } from '../../components/live-basket-dialog/live-basket-dialog.component';
import { RoundDialogComponent } from '../../components/round-dialog/round-dialog.component';
import {
  CommerceCategory,
  CommerceChannel,
  CommerceLiveBasket,
  CommerceRound
} from '../../models/commerce-catalog.model';
import { CommerceCatalogService } from '../../services/commerce-catalog.service';

@Component({
  selector: 'app-catalog-hub',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    TableModule,
    Tag,
    Button,
    InputText,
    IconField,
    InputIcon,
    Tooltip,
    LucideSlidersHorizontal,
    LucideTag,
    LucideShare2,
    LucideVideo,
    LucideTrendingUp,
    LucideSearch,
    CategoryDialogComponent,
    ChannelDialogComponent,
    LiveBasketDialogComponent,
    RoundDialogComponent
  ],
  templateUrl: './catalog-hub.component.html',
  styleUrls: ['./catalog-hub.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogHubComponent implements OnInit {
  private readonly catalogService = inject(CommerceCatalogService);
  private readonly logger = inject(LoggerService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  readonly activeTab = signal<string>('0');

  // Debounced search per tab
  private readonly categorySearch$ = new Subject<string>();
  readonly categorySearch = signal<string>('');

  private readonly channelSearch$ = new Subject<string>();
  readonly channelSearch = signal<string>('');

  private readonly basketSearch$ = new Subject<string>();
  readonly basketSearch = signal<string>('');

  private readonly roundSearch$ = new Subject<string>();
  readonly roundSearch = signal<string>('');

  // 1. Categories State
  readonly categories = signal<CommerceCategory[]>([]);
  readonly totalCategories = signal<number>(0);
  readonly isLoadingCategories = signal<boolean>(false);
  readonly categoryDialogVisible = signal<boolean>(false);
  readonly selectedCategory = signal<CommerceCategory | null>(null);
  readonly categoryMode = signal<'create' | 'edit'>('create');

  // 2. Channels State
  readonly channels = signal<CommerceChannel[]>([]);
  readonly totalChannels = signal<number>(0);
  readonly isLoadingChannels = signal<boolean>(false);
  readonly channelDialogVisible = signal<boolean>(false);
  readonly selectedChannel = signal<CommerceChannel | null>(null);
  readonly channelMode = signal<'create' | 'edit'>('create');

  // 3. Live Baskets State
  readonly liveBaskets = signal<CommerceLiveBasket[]>([]);
  readonly totalLiveBaskets = signal<number>(0);
  readonly isLoadingBaskets = signal<boolean>(false);
  readonly basketDialogVisible = signal<boolean>(false);
  readonly selectedBasket = signal<CommerceLiveBasket | null>(null);
  readonly basketMode = signal<'create' | 'edit'>('create');

  // 4. Rounds State
  readonly rounds = signal<CommerceRound[]>([]);
  readonly totalRounds = signal<number>(0);
  readonly isLoadingRounds = signal<boolean>(false);
  readonly roundDialogVisible = signal<boolean>(false);
  readonly selectedRound = signal<CommerceRound | null>(null);
  readonly roundMode = signal<'create' | 'edit'>('create');

  constructor() {
    this.categorySearch$
      .pipe(debounceTime(350), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe(term => this.fetchCategories(term));

    this.channelSearch$
      .pipe(debounceTime(350), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe(term => this.fetchChannels(term));

    this.basketSearch$
      .pipe(debounceTime(350), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe(term => this.fetchLiveBaskets(term));

    this.roundSearch$
      .pipe(debounceTime(350), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe(term => this.fetchRounds(term));
  }

  ngOnInit(): void {
    this.fetchCategories();
    this.fetchChannels();
    this.fetchLiveBaskets();
    this.fetchRounds();
  }

  onTabChange(tab: string | number | undefined): void {
    if (tab !== undefined) {
      this.activeTab.set(String(tab));
    }
  }

  // =========================================================================
  // 1. CATEGORÍAS
  // =========================================================================

  fetchCategories(search = this.categorySearch()): void {
    this.isLoadingCategories.set(true);
    this.catalogService.loadCategoriesPage({ offset: 0, limit: 100, search }).subscribe({
      next: res => {
        this.categories.set(res.data);
        this.totalCategories.set(res.total);
        this.isLoadingCategories.set(false);
      },
      error: err => {
        this.logger.error('Error fetching categories', err, 'CatalogHubComponent');
        this.isLoadingCategories.set(false);
      }
    });
  }

  onCategorySearch(term: string): void {
    this.categorySearch.set(term);
    this.categorySearch$.next(term);
  }

  openCreateCategory(): void {
    this.selectedCategory.set(null);
    this.categoryMode.set('create');
    this.categoryDialogVisible.set(true);
  }

  openEditCategory(cat: CommerceCategory): void {
    this.selectedCategory.set(cat);
    this.categoryMode.set('edit');
    this.categoryDialogVisible.set(true);
  }

  onCategorySaved(): void {
    this.fetchCategories();
  }

  confirmDeleteCategory(cat: CommerceCategory): void {
    this.confirmationService.confirm({
      message: `¿Eliminar la categoría "${cat.name}"? Los productos vinculados conservarán sus datos pero perderán esta clasificación.`,
      header: 'Confirmar Eliminación de Categoría',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      rejectButtonStyleClass: 'p-button-text p-button-secondary p-button-sm',
      accept: () => {
        this.catalogService.deleteCategory(cat.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Categoría Eliminada', detail: `Categoría "${cat.name}" eliminada.` });
            this.fetchCategories();
          },
          error: err => {
            this.logger.error('Error deleting category', err, 'CatalogHubComponent');
            this.messageService.add({ severity: 'error', summary: 'Error al Eliminar', detail: err?.error?.detail || 'No se pudo eliminar.' });
          }
        });
      }
    });
  }

  // =========================================================================
  // 2. CANALES DE VENTA
  // =========================================================================

  fetchChannels(search = this.channelSearch()): void {
    this.isLoadingChannels.set(true);
    this.catalogService.loadChannelsPage({ offset: 0, limit: 100, search }).subscribe({
      next: res => {
        this.channels.set(res.data);
        this.totalChannels.set(res.total);
        this.isLoadingChannels.set(false);
      },
      error: err => {
        this.logger.error('Error fetching channels', err, 'CatalogHubComponent');
        this.isLoadingChannels.set(false);
      }
    });
  }

  onChannelSearch(term: string): void {
    this.channelSearch.set(term);
    this.channelSearch$.next(term);
  }

  openCreateChannel(): void {
    this.selectedChannel.set(null);
    this.channelMode.set('create');
    this.channelDialogVisible.set(true);
  }

  openEditChannel(ch: CommerceChannel): void {
    this.selectedChannel.set(ch);
    this.channelMode.set('edit');
    this.channelDialogVisible.set(true);
  }

  onChannelSaved(): void {
    this.fetchChannels();
  }

  confirmDeleteChannel(ch: CommerceChannel): void {
    this.confirmationService.confirm({
      message: `¿Eliminar el canal de venta "${ch.name}"?`,
      header: 'Confirmar Eliminación de Canal',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      rejectButtonStyleClass: 'p-button-text p-button-secondary p-button-sm',
      accept: () => {
        this.catalogService.deleteChannel(ch.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Canal Eliminado', detail: `Canal "${ch.name}" eliminado.` });
            this.fetchChannels();
          },
          error: err => {
            this.logger.error('Error deleting channel', err, 'CatalogHubComponent');
            this.messageService.add({ severity: 'error', summary: 'Error al Eliminar', detail: err?.error?.detail || 'No se pudo eliminar.' });
          }
        });
      }
    });
  }

  // =========================================================================
  // 3. CANASTAS LIVE
  // =========================================================================

  fetchLiveBaskets(search = this.basketSearch()): void {
    this.isLoadingBaskets.set(true);
    this.catalogService.loadLiveBasketsPage({ offset: 0, limit: 100, search }).subscribe({
      next: res => {
        this.liveBaskets.set(res.data);
        this.totalLiveBaskets.set(res.total);
        this.isLoadingBaskets.set(false);
      },
      error: err => {
        this.logger.error('Error fetching live baskets', err, 'CatalogHubComponent');
        this.isLoadingBaskets.set(false);
      }
    });
  }

  onBasketSearch(term: string): void {
    this.basketSearch.set(term);
    this.basketSearch$.next(term);
  }

  openCreateBasket(): void {
    this.selectedBasket.set(null);
    this.basketMode.set('create');
    this.basketDialogVisible.set(true);
  }

  openEditBasket(lb: CommerceLiveBasket): void {
    this.selectedBasket.set(lb);
    this.basketMode.set('edit');
    this.basketDialogVisible.set(true);
  }

  onBasketSaved(): void {
    this.fetchLiveBaskets();
  }

  confirmDeleteBasket(lb: CommerceLiveBasket): void {
    this.confirmationService.confirm({
      message: `¿Eliminar la canasta de subastas "${lb.label}"?`,
      header: 'Confirmar Eliminación de Canasta Live',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      rejectButtonStyleClass: 'p-button-text p-button-secondary p-button-sm',
      accept: () => {
        this.catalogService.deleteLiveBasket(lb.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Canasta Eliminada', detail: `Canasta "${lb.label}" eliminada.` });
            this.fetchLiveBaskets();
          },
          error: err => {
            this.logger.error('Error deleting live basket', err, 'CatalogHubComponent');
            this.messageService.add({ severity: 'error', summary: 'Error al Eliminar', detail: err?.error?.detail || 'No se pudo eliminar.' });
          }
        });
      }
    });
  }

  // =========================================================================
  // 4. RONDAS DE INVERSIÓN
  // =========================================================================

  fetchRounds(search = this.roundSearch()): void {
    this.isLoadingRounds.set(true);
    this.catalogService.loadRoundsPage({ offset: 0, limit: 100, search }).subscribe({
      next: res => {
        this.rounds.set(res.data);
        this.totalRounds.set(res.total);
        this.isLoadingRounds.set(false);
      },
      error: err => {
        this.logger.error('Error fetching rounds', err, 'CatalogHubComponent');
        this.isLoadingRounds.set(false);
      }
    });
  }

  onRoundSearch(term: string): void {
    this.roundSearch.set(term);
    this.roundSearch$.next(term);
  }

  openCreateRound(): void {
    this.selectedRound.set(null);
    this.roundMode.set('create');
    this.roundDialogVisible.set(true);
  }

  openEditRound(rnd: CommerceRound): void {
    this.selectedRound.set(rnd);
    this.roundMode.set('edit');
    this.roundDialogVisible.set(true);
  }

  onRoundSaved(): void {
    this.fetchRounds();
  }

  confirmDeleteRound(rnd: CommerceRound): void {
    this.confirmationService.confirm({
      message: `¿Eliminar la ronda de inversión "${rnd.name}" (${rnd.code})?`,
      header: 'Confirmar Eliminación de Ronda',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      rejectButtonStyleClass: 'p-button-text p-button-secondary p-button-sm',
      accept: () => {
        this.catalogService.deleteRound(rnd.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Ronda Eliminada', detail: `Ronda "${rnd.name}" eliminada.` });
            this.fetchRounds();
          },
          error: err => {
            this.logger.error('Error deleting round', err, 'CatalogHubComponent');
            this.messageService.add({ severity: 'error', summary: 'Error al Eliminar', detail: err?.error?.detail || 'No se pudo eliminar.' });
          }
        });
      }
    });
  }
}
