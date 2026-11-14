import { CdkScrollable } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  HostListener,
  inject,
  input,
  model,
  output,
  signal
} from '@angular/core';

import { ConfirmationService, MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Drawer } from 'primeng/drawer';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { Tooltip } from 'primeng/tooltip';
import {
  LucideCheck,
  LucideCopy,
  LucideDollarSign,
  LucideImages,
  LucideMaximize2,
  LucideMinimize2,
  LucideShare2,
  LucideTag,
  LucideX
} from '@lucide/angular';

import { CatalogItem } from '@core/models/catalog.model';
import { LoggerService } from '@core/services/logger.service';

import { CloudinaryUrlPipe } from '@shared/pipe/cloudinary-url.pipe';

import { ProductMaster } from '../../models/product-master.model';
import { ProductMasterService } from '../../services/product-master.service';
import { ProductMasterFormStore } from '../../services/product-master-form.store';
import { ProductMasterGalleryComponent } from '../product-master-gallery/product-master-gallery.component';
import { ProductMasterTabCommercialComponent } from '../tabs/product-master-tab-commercial/product-master-tab-commercial.component';
import { ProductMasterTabMarketingComponent } from '../tabs/product-master-tab-marketing/product-master-tab-marketing.component';
import { ProductMasterTabPricingComponent } from '../tabs/product-master-tab-pricing/product-master-tab-pricing.component';

/**
 * Orquestador principal (Shell) de la Ficha Maestra.
 * Gestiona el ciclo de vida de la ventana modal (Drawer), la navegación entre pestañas
 * y las acciones globales de persistencia (Guardar / Eliminar).
 * Provee localmente el ProductMasterFormStore para sus subcomponentes de pestaña.
 */
@Component({
  selector: 'app-product-master-drawer',
  standalone: true,
  providers: [ProductMasterFormStore],
  imports: [
    CommonModule,
    Drawer,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Button,
    Tooltip,
    LucideTag,
    LucideDollarSign,
    LucideImages,
    LucideCopy,
    LucideCheck,
    LucideMaximize2,
    LucideMinimize2,
    LucideShare2,
    LucideX,
    CdkScrollable,
    CloudinaryUrlPipe,
    ProductMasterGalleryComponent,
    ProductMasterTabCommercialComponent,
    ProductMasterTabPricingComponent,
    ProductMasterTabMarketingComponent
  ],
  templateUrl: './product-master-drawer.component.html',
  styleUrls: ['./product-master-drawer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductMasterDrawerComponent {
  readonly store = inject(ProductMasterFormStore);
  private readonly productMasterService = inject(ProductMasterService);
  private readonly logger = inject(LoggerService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  // Two-way e Inputs
  readonly visible = model<boolean>(false);
  readonly product = input<ProductMaster | null>(null);
  readonly mode = input<'create' | 'edit'>('create');
  readonly categories = input<CatalogItem[]>([]);
  readonly liveBaskets = input<CatalogItem[]>([]);

  // Outputs
  readonly productSaved = output<ProductMaster>();
  readonly productDeleted = output<string>();
  readonly coverImageChanged = output<{ masterId: string; coverUrl: string | null }>();

  // Estado del Shell
  readonly isMaximized = signal<boolean>(false);
  readonly activeTab = signal<string>('0');
  readonly savingAction = signal<'save' | 'saveAndClose' | null>(null);

  private lastOpenedProductId: string | null = null;
  private lastVisibleState = false;

  constructor() {
    effect(() => {
      const isVisible = this.visible();
      const currentProd = this.product();
      const currentMode = this.mode();

      if (!isVisible) {
        this.lastVisibleState = false;
        this.lastOpenedProductId = null;
        this.isMaximized.set(false);
        this.store.resetSnapshot();
        return;
      }

      const prodId = currentProd?.id ?? null;
      const isNewOpen = !this.lastVisibleState || this.lastOpenedProductId !== prodId;
      this.lastVisibleState = true;
      this.lastOpenedProductId = prodId;

      if (isNewOpen) {
        this.activeTab.set('0');

        if (currentMode === 'edit' && prodId) {
          this.store.initForm(currentProd, 'edit');

          this.store.isLoadingDetails.set(true);
          this.productMasterService.getProductMasterById(prodId).subscribe({
            next: fresh => {
              this.store.applyFreshDetails(fresh);
              this.store.isLoadingDetails.set(false);
            },
            error: err => {
              this.logger.error('Error fetching authoritative product master detail', err, 'ProductMasterDrawerComponent');
              this.store.isLoadingDetails.set(false);
            }
          });
        } else {
          this.store.initForm(null, 'create');
        }
      }
    });
  }

  onTabChange(tab: string | number | undefined): void {
    if (tab !== undefined) {
      this.activeTab.set(String(tab));
    }
  }

  toggleMaximize(): void {
    this.isMaximized.update(v => !v);
  }

  onVisibleChange(newVisible: boolean): void {
    if (!newVisible) {
      this.requestClose();
    } else {
      this.visible.set(true);
    }
  }

  requestClose(): void {
    if (!this.store.isDirty()) {
      this.visible.set(false);
      return;
    }

    this.confirmationService.confirm({
      header: 'Cambios sin guardar',
      message:
        'Tienes modificaciones sin guardar en la ficha maestra. Si cierras ahora, se perderán los cambios realizados. ¿Deseas descartar los cambios y salir?',
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
        this.store.resetSnapshot();
        this.visible.set(false);
      }
    });
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
  onEscapeKey(event: Event): void {
    if (!this.visible()) return;

    if (document.querySelector('.p-dialog-mask, .p-confirm-dialog')) {
      return;
    }

    event.preventDefault();
    this.requestClose();
  }

  handleCoverImageChanged(event: { masterId: string; coverUrl: string | null }): void {
    this.store.onCoverImageChanged(event.coverUrl);
    this.coverImageChanged.emit(event);
  }

  saveProduct(closeAfterSave = false): void {
    if (!this.store.isFormValid()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario Incompleto',
        detail: 'Por favor, revise los campos obligatorios antes de continuar.'
      });
      return;
    }

    this.savingAction.set(closeAfterSave ? 'saveAndClose' : 'save');
    this.store.isSubmitting.set(true);

    if (this.store.mode() === 'create') {
      const payload = this.store.buildCreatePayload();

      this.productMasterService.createProductMaster(payload).subscribe({
        next: created => {
          this.store.isSubmitting.set(false);
          this.savingAction.set(null);
          this.messageService.add({
            severity: 'success',
            summary: 'Ficha Creada',
            detail: `Ficha maestra #${created.item_number} "${created.name}" creada exitosamente.`
          });
          this.productSaved.emit(created);

          if (closeAfterSave) {
            this.store.resetSnapshot();
            this.visible.set(false);
          } else {
            // Permanece abierto y pasa automáticamente a modo edición para continuar o subir fotos
            this.store.initForm(created, 'edit');
            this.store.markClean();
          }
        },
        error: err => {
          this.store.isSubmitting.set(false);
          this.savingAction.set(null);
          this.logger.error('Error creating product master', err, 'ProductMasterDrawerComponent');
          const detail = err?.error?.detail || 'No se pudo crear la ficha maestra.';
          this.messageService.add({
            severity: 'error',
            summary: 'Error al Crear',
            detail
          });
        }
      });
    } else {
      const id = this.store.currentProduct()?.id;
      if (!id) {
        this.store.isSubmitting.set(false);
        this.savingAction.set(null);
        return;
      }

      const payload = this.store.buildUpdatePayload();

      this.productMasterService.updateProductMaster(id, payload).subscribe({
        next: updated => {
          this.store.isSubmitting.set(false);
          this.savingAction.set(null);
          this.messageService.add({
            severity: 'success',
            summary: 'Ficha Actualizada',
            detail: `Los cambios en la ficha maestra #${updated.item_number} se guardaron exitosamente.`
          });
          this.productSaved.emit(updated);
          this.store.markClean();

          if (closeAfterSave) {
            this.visible.set(false);
          } else {
            // Actualiza el producto actual conservando la vista activa y mostrando "Todo guardado"
            if (this.store.freshProduct()) {
              this.store.freshProduct.set(updated);
            } else {
              this.store.rawProduct.set(updated);
            }
          }
        },
        error: err => {
          this.store.isSubmitting.set(false);
          this.savingAction.set(null);
          this.logger.error('Error updating product master', err, 'ProductMasterDrawerComponent');
          const detail = err?.error?.detail || 'Ocurrió un error al actualizar la ficha maestra.';
          this.messageService.add({
            severity: 'error',
            summary: 'Error al Guardar',
            detail
          });
        }
      });
    }
  }

  confirmDelete(): void {
    const prod = this.store.currentProduct();
    if (!prod) return;

    this.confirmationService.confirm({
      header: 'Eliminar Ficha Maestra',
      message: `¿Está seguro de eliminar permanentemente la Ficha Maestra #${prod.item_number} "${prod.name}"? Esta acción no se puede deshacer y desvinculará todas sus fotografías de catálogo.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar Ficha',
      rejectLabel: 'Cancelar',
      acceptButtonProps: {
        severity: 'danger'
      },
      rejectButtonProps: {
        severity: 'secondary',
        outlined: true
      },
      accept: () => {
        this.store.isSubmitting.set(true);
        this.productMasterService.deleteProductMaster(prod.id).subscribe({
          next: () => {
            this.store.isSubmitting.set(false);
            this.messageService.add({
              severity: 'success',
              summary: 'Ficha Eliminada',
              detail: `La ficha maestra #${prod.item_number} fue eliminada exitosamente.`
            });
            this.productDeleted.emit(prod.id);
            this.visible.set(false);
          },
          error: err => {
            this.store.isSubmitting.set(false);
            this.logger.error('Error deleting product master', err, 'ProductMasterDrawerComponent');
            const detail = err?.error?.detail || 'No se pudo eliminar la ficha maestra.';
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
