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

import { ConfirmationService, MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Drawer } from 'primeng/drawer';
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { Textarea } from 'primeng/textarea';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Tooltip } from 'primeng/tooltip';
import {
  LucideAlertTriangle,
  LucideCopy,
  LucideDollarSign,
  LucideInfo,
  LucideShoppingCart,
  LucideTrash2,
  LucideTruck,
  LucideUser
} from '@lucide/angular';

import { CatalogItem } from '@core/models/catalog.model';
import { LoggerService } from '@core/services/logger.service';

import { Product } from '@features/commerce/products/models/product.model';

import {
  Sale,
  SaleCreatePayload,
  SaleItemCreatePayload,
  SaleUpdatePayload
} from '../../models/sale.model';
import { SaleService } from '../../services/sale.service';

export interface LocalSaleItemRow {
  product_id: string;
  product_name: string;
  variant_name?: string | null;
  quantity: number;
  unit_price: number;
  minimum_price: number;
  total_price: number;
}

@Component({
  selector: 'app-sale-drawer',
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
    Select,
    Textarea,
    ToggleSwitch,
    Tooltip,
    LucideShoppingCart,
    LucideUser,
    LucideDollarSign,
    LucideTruck,
    LucideInfo,
    LucideCopy,
    LucideTrash2,
    LucideAlertTriangle
  ],
  templateUrl: './sale-drawer.component.html',
  styleUrls: ['./sale-drawer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaleDrawerComponent {
  private readonly saleService = inject(SaleService);
  private readonly logger = inject(LoggerService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  // Two-way and inputs
  readonly visible = model<boolean>(false);
  readonly sale = input<Sale | null>(null);
  readonly mode = input<'create' | 'edit'>('create');
  readonly salesChannels = input<CatalogItem[]>([]);
  readonly paymentStatuses = input<CatalogItem[]>([]);
  readonly paymentMethods = input<CatalogItem[]>([]);
  readonly deliveryModalities = input<CatalogItem[]>([]);
  readonly deliveryPaidBy = input<CatalogItem[]>([]);
  readonly deliveryStatuses = input<CatalogItem[]>([]);
  readonly availableProducts = input<Product[]>([]);

  // Outputs
  readonly saleSaved = output<Sale>();
  readonly saleDeleted = output<string>();

  // State
  readonly activeTab = signal<string>('0');
  readonly isSubmitting = signal<boolean>(false);
  readonly isLoadingDetails = signal<boolean>(false);
  readonly freshSale = signal<Sale | null>(null);

  readonly currentDisplaySale = computed<Sale | null>(() => {
    return this.freshSale() || this.sale();
  });

  onTabChange(tab: string | number | undefined): void {
    if (tab !== undefined) {
      this.activeTab.set(String(tab));
    }
  }

  // Form Signals - Tab 0: Cliente y Canal
  readonly customerName = signal<string>('Cliente Casual');
  readonly customerPhone = signal<string>('');
  readonly channelId = signal<string | null>(null);
  readonly channelName = signal<string>('Marketplace');
  readonly saleDate = signal<string>('');

  // Form Signals - Tab 1: Ítems y Precios
  readonly saleItems = signal<LocalSaleItemRow[]>([]);
  readonly selectedProductIdToAdd = signal<string | null>(null);
  readonly itemQuantityToAdd = signal<number>(1);
  readonly itemPriceToAdd = signal<number>(0);
  readonly allowBelowMinimum = signal<boolean>(false);
  readonly customTotalCollected = signal<number | null>(null);

  // Form Signals - Tab 2: Pago y Entrega
  readonly paymentMethod = signal<string>('QR');
  readonly paymentStatus = signal<string>('COLLECTED');
  readonly deliveryModality = signal<string>('FREE_MEETING_POINT');
  readonly deliveryAddress = signal<string>('');
  readonly deliveryCost = signal<number>(0);
  readonly deliveryCostPaidBy = signal<string>('FREE');
  readonly deliveryStatus = signal<string>('DELIVERED');
  readonly currency = signal<string>('BOB');
  readonly observations = signal<string>('');

  // Computed Values
  readonly totalItemsPrice = computed<number>(() => {
    const items = this.saleItems();
    return items.reduce((sum, item) => sum + item.total_price, 0);
  });

  readonly effectiveTotalCollected = computed<number>(() => {
    if (this.customTotalCollected() !== null && this.customTotalCollected() !== undefined) {
      return this.customTotalCollected()!;
    }
    return this.totalItemsPrice();
  });

  readonly hasBelowMinimumItem = computed<boolean>(() => {
    return this.saleItems().some(
      item => item.minimum_price > 0 && item.unit_price < item.minimum_price
    );
  });

  // Validations
  readonly customerValidation = computed<{ isValid: boolean; error: string | null }>(() => {
    const val = this.customerName().trim();
    if (!val) {
      return { isValid: false, error: 'El nombre del cliente es obligatorio (Ej: Cliente Casual).' };
    }
    return { isValid: true, error: null };
  });

  readonly itemsValidation = computed<{ isValid: boolean; error: string | null }>(() => {
    if (this.mode() === 'create' && this.saleItems().length === 0) {
      return { isValid: false, error: 'Debe agregar al menos un producto a la venta.' };
    }
    if (this.hasBelowMinimumItem() && !this.allowBelowMinimum()) {
      return {
        isValid: false,
        error: 'Uno o más productos tienen precio menor al mínimo permitido. Active la casilla de autorización para continuar.'
      };
    }
    return { isValid: true, error: null };
  });

  readonly isFormValid = computed<boolean>(() => {
    return this.customerValidation().isValid && this.itemsValidation().isValid;
  });

  private lastOpenedSaleId: string | null = null;
  private lastVisibleState = false;

  constructor() {
    effect(() => {
      const isVisible = this.visible();
      const currentSale = this.sale();
      const currentMode = this.mode();

      if (!isVisible) {
        this.lastVisibleState = false;
        this.lastOpenedSaleId = null;
        return;
      }

      const sId = currentSale?.id ?? null;
      const isNewOpen = !this.lastVisibleState || this.lastOpenedSaleId !== sId;
      this.lastVisibleState = true;
      this.lastOpenedSaleId = sId;

      if (isNewOpen) {
        this.activeTab.set('0');

        if (currentMode === 'edit' && sId) {
          this.freshSale.set(null);
          this.initForm(currentSale);

          this.isLoadingDetails.set(true);
          this.saleService.getSaleById(sId).subscribe({
            next: fresh => {
              this.freshSale.set(fresh);
              this.initForm(fresh);
              this.isLoadingDetails.set(false);
            },
            error: err => {
              this.logger.error('Error fetching authoritative sale detail', err, 'SaleDrawerComponent');
              this.isLoadingDetails.set(false);
            }
          });
        } else {
          this.freshSale.set(null);
          this.initForm(null);
        }
      }
    });
  }

  private initForm(s: Sale | null): void {
    if (s) {
      this.customerName.set(s.customer_name || 'Cliente Casual');
      this.customerPhone.set(s.customer_phone || '');
      this.channelId.set(s.channel_id || null);
      this.channelName.set(s.channel || 'Marketplace');
      this.saleDate.set(s.sale_date ? String(s.sale_date).substring(0, 16) : '');
      this.paymentMethod.set(s.payment_method || 'QR');
      this.paymentStatus.set(s.payment_status || 'COLLECTED');
      this.deliveryModality.set(s.delivery_modality || 'FREE_MEETING_POINT');
      this.deliveryAddress.set(s.delivery_address || '');
      this.deliveryCost.set(s.delivery_cost ?? 0);
      this.deliveryCostPaidBy.set(s.delivery_cost_paid_by || 'FREE');
      this.deliveryStatus.set(s.delivery_status || 'DELIVERED');
      this.currency.set(s.currency || 'BOB');
      this.observations.set(s.observations || '');
      this.customTotalCollected.set(s.total_collected);
      this.allowBelowMinimum.set(false);

      if (s.items && s.items.length > 0) {
        this.saleItems.set(
          s.items.map(it => ({
            product_id: it.product_id,
            product_name: it.product_name,
            variant_name: null,
            quantity: it.quantity,
            unit_price: it.unit_price,
            minimum_price: 0,
            total_price: it.total_price
          }))
        );
      } else {
        this.saleItems.set([]);
      }
    } else {
      const now = new Date();
      const localIso = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);

      this.customerName.set('Cliente Casual');
      this.customerPhone.set('');
      this.channelId.set(null);
      this.channelName.set('Marketplace');
      this.saleDate.set(localIso);
      this.saleItems.set([]);
      this.selectedProductIdToAdd.set(null);
      this.itemQuantityToAdd.set(1);
      this.itemPriceToAdd.set(0);
      this.allowBelowMinimum.set(false);
      this.customTotalCollected.set(null);
      this.paymentMethod.set('QR');
      this.paymentStatus.set('COLLECTED');
      this.deliveryModality.set('FREE_MEETING_POINT');
      this.deliveryAddress.set('');
      this.deliveryCost.set(0);
      this.deliveryCostPaidBy.set('FREE');
      this.deliveryStatus.set('DELIVERED');
      this.currency.set('BOB');
      this.observations.set('');
    }
  }

  onProductSelectedForAdd(productId: string | null): void {
    this.selectedProductIdToAdd.set(productId);
    if (!productId) {
      this.itemPriceToAdd.set(0);
      return;
    }

    const prod = this.availableProducts().find(p => p.id === productId);
    if (prod) {
      const defaultPrice = prod.published_price || prod.official_price || 0;
      this.itemPriceToAdd.set(defaultPrice);
    }
  }

  addItemToSale(): void {
    const prodId = this.selectedProductIdToAdd();
    if (!prodId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Seleccione un Producto',
        detail: 'Elija un producto del inventario para agregarlo a la venta.'
      });
      return;
    }

    const prod = this.availableProducts().find(p => p.id === prodId);
    if (!prod) return;

    const qty = this.itemQuantityToAdd() || 1;
    const price = this.itemPriceToAdd() || 0;

    // Check stock
    if (prod.available_quantity < qty) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Stock Insuficiente',
        detail: `Solo hay ${prod.available_quantity} unidades disponibles de "${prod.name}".`
      });
      return;
    }

    const row: LocalSaleItemRow = {
      product_id: prod.id,
      product_name: prod.name,
      variant_name: prod.variant_name,
      quantity: qty,
      unit_price: price,
      minimum_price: prod.minimum_price || 0,
      total_price: Math.round(qty * price * 100) / 100
    };

    this.saleItems.update(current => [...current, row]);

    // Reset selector
    this.selectedProductIdToAdd.set(null);
    this.itemQuantityToAdd.set(1);
    this.itemPriceToAdd.set(0);
  }

  removeItemFromSale(index: number): void {
    this.saleItems.update(current => current.filter((_, i) => i !== index));
  }

  saveSale(): void {
    if (!this.isFormValid()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario Incompleto',
        detail: 'Revise los campos obligatorios y la lista de productos antes de guardar.'
      });
      return;
    }

    this.isSubmitting.set(true);

    if (this.mode() === 'create') {
      const itemsPayload: SaleItemCreatePayload[] = this.saleItems().map(it => ({
        product_id: it.product_id,
        quantity: it.quantity,
        unit_price: it.unit_price
      }));

      // Find channel name if channelId is chosen
      let resolvedChannel = this.channelName() || 'Marketplace';
      if (this.channelId()) {
        const found = this.salesChannels().find(c => c.value === this.channelId());
        if (found) resolvedChannel = found.label;
      }

      const payload: SaleCreatePayload = {
        customer_name: this.customerName().trim(),
        customer_phone: this.customerPhone().trim() || null,
        channel_id: this.channelId() || null,
        channel: resolvedChannel,
        sale_date: this.saleDate() ? new Date(this.saleDate()).toISOString() : null,
        payment_method: this.paymentMethod() || 'QR',
        payment_status: this.paymentStatus() || 'COLLECTED',
        delivery_modality: this.deliveryModality() || 'FREE_MEETING_POINT',
        delivery_address: this.deliveryAddress().trim() || null,
        delivery_cost: this.deliveryCost() || 0,
        delivery_cost_paid_by: this.deliveryCostPaidBy() || 'FREE',
        delivery_status: this.deliveryStatus() || 'DELIVERED',
        total_collected: this.effectiveTotalCollected(),
        currency: this.currency() || 'BOB',
        observations: this.observations().trim() || null,
        allow_below_minimum: this.allowBelowMinimum(),
        items: itemsPayload
      };

      this.saleService.createSale(payload).subscribe({
        next: created => {
          this.isSubmitting.set(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Venta Registrada',
            detail: `La venta "${created.sale_number}" fue creada exitosamente.`
          });
          this.saleSaved.emit(created);
          this.visible.set(false);
        },
        error: err => {
          this.isSubmitting.set(false);
          this.logger.error('Error creating sale', err, 'SaleDrawerComponent');
          const detail = err?.error?.detail || 'Ocurrió un error al registrar la venta.';
          this.messageService.add({
            severity: 'error',
            summary: 'Error al Registrar Venta',
            detail
          });
        }
      });
    } else {
      const current = this.currentDisplaySale();
      if (!current?.id) {
        this.isSubmitting.set(false);
        return;
      }

      let resolvedChannel = this.channelName() || 'Marketplace';
      if (this.channelId()) {
        const found = this.salesChannels().find(c => c.value === this.channelId());
        if (found) resolvedChannel = found.label;
      }

      const payload: SaleUpdatePayload = {
        customer_name: this.customerName().trim(),
        customer_phone: this.customerPhone().trim() || null,
        channel_id: this.channelId() || null,
        channel: resolvedChannel,
        payment_method: this.paymentMethod() || 'QR',
        payment_status: this.paymentStatus() || 'COLLECTED',
        delivery_modality: this.deliveryModality() || 'FREE_MEETING_POINT',
        delivery_address: this.deliveryAddress().trim() || null,
        delivery_cost: this.deliveryCost() || 0,
        delivery_cost_paid_by: this.deliveryCostPaidBy() || 'FREE',
        delivery_status: this.deliveryStatus() || 'DELIVERED',
        currency: this.currency() || 'BOB',
        observations: this.observations().trim() || null
      };

      this.saleService.updateSale(current.id, payload).subscribe({
        next: updated => {
          this.isSubmitting.set(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Venta Actualizada',
            detail: `La venta "${updated.sale_number}" fue modificada correctamente.`
          });
          this.saleSaved.emit(updated);
          this.visible.set(false);
        },
        error: err => {
          this.isSubmitting.set(false);
          this.logger.error('Error updating sale', err, 'SaleDrawerComponent');
          const detail = err?.error?.detail || 'Ocurrió un error al actualizar la venta.';
          this.messageService.add({
            severity: 'error',
            summary: 'Error al Actualizar Venta',
            detail
          });
        }
      });
    }
  }

  confirmDelete(): void {
    const current = this.currentDisplaySale();
    if (!current?.id) return;

    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar la venta "${current.sale_number}" de ${current.customer_name}? Esta acción no se puede deshacer.`,
      header: 'Confirmar Eliminación de Venta',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      rejectButtonStyleClass: 'p-button-text p-button-secondary p-button-sm',
      accept: () => {
        this.isSubmitting.set(true);
        this.saleService.deleteSale(current.id).subscribe({
          next: () => {
            this.isSubmitting.set(false);
            this.messageService.add({
              severity: 'success',
              summary: 'Venta Eliminada',
              detail: `La transacción "${current.sale_number}" fue eliminada del sistema.`
            });
            this.saleDeleted.emit(current.id);
            this.visible.set(false);
          },
          error: err => {
            this.isSubmitting.set(false);
            this.logger.error('Error deleting sale', err, 'SaleDrawerComponent');
            const detail = err?.error?.detail || 'No se pudo eliminar la venta.';
            this.messageService.add({
              severity: 'error',
              summary: 'Error al Eliminar',
              detail
            });
          }
        });
      }
    });
  }

  copyToClipboard(text: string, label: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.messageService.add({
        severity: 'info',
        summary: 'Copiado al Portapapeles',
        detail: `${label} copiado con éxito.`,
        life: 2000
      });
    });
  }
}
