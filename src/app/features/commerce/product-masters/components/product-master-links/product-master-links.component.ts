import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ConfirmationService, MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Tooltip } from 'primeng/tooltip';
import {
  LucideCheck,
  LucideCopy,
  LucideExternalLink,
  LucideEye,
  LucideGlobe,
  LucideInfo,
  LucideLink,
  LucideLock,
  LucidePencil,
  LucideStar,
  LucideStore,
  LucideTrash2,
  LucideX
} from '@lucide/angular';

import { LoggerService } from '@core/services/logger.service';

import {
  ProductLinkPortal,
  ProductLinkType,
  ProductMasterExternalLink
} from '../../models/product-master.model';
import { ProductMasterService } from '../../services/product-master.service';

interface PortalBadgeInfo {
  name: string;
  badgeClass: string;
}

@Component({
  selector: 'app-product-master-links',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Button,
    InputText,
    Tooltip,
    LucideCheck,
    LucideCopy,
    LucideExternalLink,
    LucideEye,
    LucideGlobe,
    LucideInfo,
    LucideLink,
    LucideLock,
    LucidePencil,
    LucideStar,
    LucideStore,
    LucideTrash2,
    LucideX
  ],
  templateUrl: './product-master-links.component.html',
  styleUrl: './product-master-links.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductMasterLinksComponent {
  private readonly productMasterService = inject(ProductMasterService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly logger = inject(LoggerService);

  // Inputs
  readonly masterId = input<string | null>(null);
  readonly linkType = input<ProductLinkType>('REFERENCE');
  readonly title = input<string>('Fuentes de Referencia & Proveedores');
  readonly subtitle = input<string>('Especificaciones técnicas, catálogos del fabricante y proveedores mayoristas');
  readonly mode = input<'create' | 'edit'>('edit');

  // Two-way bindings
  readonly links = model<ProductMasterExternalLink[]>([]);
  readonly initialUrl = model<string>('');

  // Outputs
  readonly primaryChanged = output<{ masterId: string; linkId: string; url: string; linkType: string }>();
  readonly linkAdded = output<ProductMasterExternalLink>();
  readonly linkDeleted = output<string>();

  // State
  readonly newUrl = signal<string>('');
  readonly newLabel = signal<string>('');
  readonly newIsPublic = signal<boolean>(true);
  readonly isSubmitting = signal<boolean>(false);
  readonly copiedLinkId = signal<string | null>(null);

  // Edición en línea
  readonly editingLinkId = signal<string | null>(null);
  readonly editUrl = signal<string>('');
  readonly editLabel = signal<string>('');
  readonly editIsPublic = signal<boolean>(true);
  readonly isSubmittingEdit = signal<boolean>(false);

  readonly isReference = computed(() => this.linkType() === 'REFERENCE');
  readonly isMarketplace = computed(() => this.linkType() === 'MARKETPLACE');

  readonly sortedLinks = computed(() => {
    return [...this.links()].sort((a, b) => {
      if (a.is_primary && !b.is_primary) return -1;
      if (!a.is_primary && b.is_primary) return 1;
      return a.sort_order - b.sort_order;
    });
  });

  /**
   * Agrega un nuevo enlace (o publicación)
   */
  addLink(): void {
    const rawUrl = this.newUrl().trim();
    if (!rawUrl) return;

    const prodId = this.masterId();
    if (!prodId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Ficha No Guardada',
        detail: 'Debe guardar la ficha maestra antes de registrar múltiples enlaces.'
      });
      return;
    }

    this.isSubmitting.set(true);

    this.productMasterService
      .addExternalLink(prodId, {
        url: rawUrl,
        link_type: this.linkType(),
        label: this.newLabel().trim() || null,
        is_public: this.isReference() ? this.newIsPublic() : true
      })
      .subscribe({
        next: createdLink => {
          this.logger.info('External link added successfully', { id: createdLink.id }, 'ProductMasterLinksComponent');

          const current = this.links();
          // Si el nuevo enlace es primario o es el primero, ajustar flags locales
          if (createdLink.is_primary) {
            this.links.set([
              createdLink,
              ...current.map(l => ({ ...l, is_primary: false }))
            ]);
            this.primaryChanged.emit({
              masterId: prodId,
              linkId: createdLink.id,
              url: createdLink.url,
              linkType: this.linkType()
            });
          } else {
            this.links.set([...current, createdLink]);
          }

          this.linkAdded.emit(createdLink);

          this.messageService.add({
            severity: 'success',
            summary: this.isMarketplace() ? 'Publicación Registrada' : 'Enlace Registrado',
            detail: `${createdLink.label || 'Enlace'} agregado exitosamente.`
          });

          this.newUrl.set('');
          this.newLabel.set('');
          this.newIsPublic.set(true);
          this.isSubmitting.set(false);
        },
        error: err => {
          this.logger.error('Error adding external link', err, 'ProductMasterLinksComponent');
          this.messageService.add({
            severity: 'error',
            summary: 'Error al Registrar',
            detail: err?.error?.detail || 'No se pudo registrar el enlace.'
          });
          this.isSubmitting.set(false);
        }
      });
  }

  /**
   * Inicia la edición en línea de un enlace o publicación existente
   */
  startEdit(link: ProductMasterExternalLink): void {
    this.editingLinkId.set(link.id);
    this.editUrl.set(link.url);
    this.editLabel.set(link.label || '');
    this.editIsPublic.set(link.is_public);
  }

  /**
   * Cancela la edición en línea y descarta cambios no guardados
   */
  cancelEdit(): void {
    this.editingLinkId.set(null);
    this.editUrl.set('');
    this.editLabel.set('');
    this.editIsPublic.set(true);
  }

  /**
   * Guarda las modificaciones de URL, etiqueta o visibilidad de un enlace
   */
  saveEdit(link: ProductMasterExternalLink): void {
    const rawUrl = this.editUrl().trim();
    if (!rawUrl) {
      this.messageService.add({
        severity: 'warn',
        summary: 'URL requerida',
        detail: 'La dirección URL no puede estar vacía.'
      });
      return;
    }

    const trimmedLabel = this.editLabel().trim() || null;
    const isPub = this.isReference() ? this.editIsPublic() : true;
    const prodId = this.masterId();

    // Modo creación (sin guardar en base de datos aún): actualización en memoria
    if (!prodId) {
      const updatedList = this.links().map(item => {
        if (item.id === link.id) {
          return {
            ...item,
            url: rawUrl,
            label: trimmedLabel,
            is_public: isPub
          };
        }
        return item;
      });

      this.links.set(updatedList);
      if (link.is_primary) {
        this.primaryChanged.emit({
          masterId: '',
          linkId: link.id,
          url: rawUrl,
          linkType: this.linkType()
        });
      }

      this.cancelEdit();
      this.messageService.add({
        severity: 'success',
        summary: this.isMarketplace() ? 'Publicación Modificada' : 'Enlace Modificado',
        detail: 'Los datos fueron actualizados en la lista.'
      });
      return;
    }

    // Modo edición (registro persistido en BD)
    this.isSubmittingEdit.set(true);
    this.productMasterService
      .updateExternalLink(prodId, link.id, {
        url: rawUrl,
        label: trimmedLabel,
        is_public: isPub
      })
      .subscribe({
        next: updated => {
          this.logger.info('External link updated successfully', { id: updated.id }, 'ProductMasterLinksComponent');

          const updatedList = this.links().map(item => (item.id === updated.id ? updated : item));
          this.links.set(updatedList);

          if (updated.is_primary) {
            this.primaryChanged.emit({
              masterId: prodId,
              linkId: updated.id,
              url: updated.url,
              linkType: this.linkType()
            });
          }

          this.cancelEdit();
          this.isSubmittingEdit.set(false);

          this.messageService.add({
            severity: 'success',
            summary: this.isMarketplace() ? 'Publicación Actualizada' : 'Enlace Actualizado',
            detail: 'Los cambios fueron guardados exitosamente.'
          });
        },
        error: err => {
          this.logger.error('Error updating external link', err, 'ProductMasterLinksComponent');
          this.isSubmittingEdit.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Error al Modificar',
            detail: err?.error?.detail || 'No se pudieron guardar las modificaciones del enlace.'
          });
        }
      });
  }

  /**
   * Designa un enlace como principal de su categoría
   */
  setAsPrimary(link: ProductMasterExternalLink): void {
    const prodId = this.masterId();
    if (!prodId || link.is_primary) return;

    this.productMasterService.setPrimaryExternalLink(prodId, link.id).subscribe({
      next: updated => {
        this.logger.info('Primary external link set', { id: link.id }, 'ProductMasterLinksComponent');

        this.links.set(
          this.links().map(item => ({
            ...item,
            is_primary: item.id === updated.id
          }))
        );

        this.primaryChanged.emit({
          masterId: prodId,
          linkId: updated.id,
          url: updated.url,
          linkType: this.linkType()
        });

        this.messageService.add({
          severity: 'success',
          summary: this.isMarketplace() ? 'Publicación Principal' : 'Referencia Principal',
          detail: 'El enlace se estableció como principal exitosamente.'
        });
      },
      error: err => {
        this.logger.error('Error setting primary link', err, 'ProductMasterLinksComponent');
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el enlace principal.'
        });
      }
    });
  }

  /**
   * Cambia la visibilidad pública de un enlace de referencia
   */
  togglePublicVisibility(link: ProductMasterExternalLink): void {
    const prodId = this.masterId();
    if (!prodId) return;

    const newPublic = !link.is_public;

    this.productMasterService
      .updateExternalLink(prodId, link.id, { is_public: newPublic })
      .subscribe({
        next: updated => {
          this.logger.info('Link public visibility updated', { id: link.id, is_public: newPublic }, 'ProductMasterLinksComponent');

          this.links.set(
            this.links().map(item => (item.id === updated.id ? { ...item, is_public: updated.is_public } : item))
          );

          this.messageService.add({
            severity: 'info',
            summary: 'Visibilidad Actualizada',
            detail: newPublic
              ? 'El enlace ahora es visible en el catálogo público.'
              : 'El enlace quedó como privado (oculto en catálogo web).'
          });
        },
        error: err => {
          this.logger.error('Error toggling link visibility', err, 'ProductMasterLinksComponent');
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar la visibilidad del enlace.'
          });
        }
      });
  }

  /**
   * Confirma y elimina un enlace externo (previene borrados accidentales)
   */
  confirmDelete(link: ProductMasterExternalLink): void {
    const prodId = this.masterId();

    // Modo creación (sin ID persistido aún): confirma y remueve de la lista en memoria
    if (!prodId) {
      this.confirmationService.confirm({
        header: this.isMarketplace() ? 'Eliminar Publicación' : 'Eliminar Enlace de Referencia',
        message: `¿Estás seguro de que deseas eliminar este enlace (${link.label || link.url})?`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Eliminar',
        rejectLabel: 'Cancelar',
        acceptButtonProps: {
          severity: 'danger'
        },
        rejectButtonProps: {
          severity: 'secondary',
          outlined: true
        },
        accept: () => {
          const remaining = this.links().filter(item => item.id !== link.id);
          this.links.set(remaining);
          this.messageService.add({
            severity: 'info',
            summary: 'Enlace Removido',
            detail: 'El registro fue quitado de la lista.'
          });
        }
      });
      return;
    }

    // Modo edición (enlace persistido en BD): confirmación modal con protección de primario
    this.confirmationService.confirm({
      header: this.isMarketplace() ? 'Eliminar Publicación' : 'Eliminar Enlace de Referencia',
      message: `¿Estás seguro de que deseas eliminar "${link.label || link.url}"? Esta acción no se puede deshacer.${
        link.is_primary ? ' Si era el enlace principal, el sistema designará automáticamente el siguiente disponible.' : ''
      }`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonProps: {
        severity: 'danger'
      },
      rejectButtonProps: {
        severity: 'secondary',
        outlined: true
      },
      accept: () => {
        this.productMasterService.deleteExternalLink(prodId, link.id).subscribe({
          next: () => {
            this.logger.info('External link deleted', { id: link.id }, 'ProductMasterLinksComponent');

            const remaining = this.links().filter(item => item.id !== link.id);
            // Si el eliminado era primario y quedan elementos, el backend promueve el primero
            if (link.is_primary && remaining.length > 0) {
              remaining[0] = { ...remaining[0], is_primary: true };
              this.primaryChanged.emit({
                masterId: prodId,
                linkId: remaining[0].id,
                url: remaining[0].url,
                linkType: this.linkType()
              });
            } else if (remaining.length === 0) {
              this.primaryChanged.emit({
                masterId: prodId,
                linkId: '',
                url: '',
                linkType: this.linkType()
              });
            }

            this.links.set(remaining);
            this.linkDeleted.emit(link.id);

            this.messageService.add({
              severity: 'success',
              summary: 'Enlace Eliminado',
              detail: 'El registro fue removido exitosamente.'
            });
          },
          error: err => {
            this.logger.error('Error deleting external link', err, 'ProductMasterLinksComponent');
            this.messageService.add({
              severity: 'error',
              summary: 'Error al Eliminar',
              detail: 'No se pudo eliminar el enlace.'
            });
          }
        });
      }
    });
  }

  /**
   * Copia la URL al portapapeles con feedback temporal
   */
  copyUrl(url: string, id: string): void {
    if (!navigator?.clipboard) return;

    navigator.clipboard.writeText(url).then(() => {
      this.copiedLinkId.set(id);
      setTimeout(() => {
        if (this.copiedLinkId() === id) {
          this.copiedLinkId.set(null);
        }
      }, 2000);
    });
  }

  /**
   * Obtiene la configuración visual (badge y nombre) según el portal detectado
   */
  getPortalInfo(portal: ProductLinkPortal): PortalBadgeInfo {
    const p = (portal || '').toUpperCase();
    switch (p) {
      case 'FACEBOOK':
        return {
          name: 'Facebook',
          badgeClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
        };
      case 'AMAZON':
        return {
          name: 'Amazon',
          badgeClass: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
        };
      case 'EBAY':
        return {
          name: 'eBay',
          badgeClass: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20'
        };
      case 'ALIEXPRESS':
        return {
          name: 'AliExpress',
          badgeClass: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
        };
      case 'ALIBABA':
        return {
          name: 'Alibaba',
          badgeClass: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20'
        };
      case 'MERCADOLIBRE':
        return {
          name: 'MercadoLibre',
          badgeClass: 'bg-yellow-500/10 text-yellow-800 dark:text-yellow-400 border-yellow-500/20'
        };
      case 'YOUTUBE':
        return {
          name: 'YouTube',
          badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
        };
      case 'TIKTOK':
        return {
          name: 'TikTok',
          badgeClass: 'bg-zinc-500/10 text-zinc-700 dark:text-zinc-300 border-zinc-500/20'
        };
      case 'INSTAGRAM':
        return {
          name: 'Instagram',
          badgeClass: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20'
        };
      case 'WHATSAPP':
        return {
          name: 'WhatsApp',
          badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
        };
      case 'SHEIN':
        return {
          name: 'SHEIN',
          badgeClass: 'bg-zinc-800/10 text-zinc-800 dark:text-zinc-200 border-zinc-800/20'
        };
      case 'TEMU':
        return {
          name: 'Temu',
          badgeClass: 'bg-orange-600/10 text-orange-600 dark:text-orange-400 border-orange-600/20'
        };
      default:
        return {
          name: portal || 'Web',
          badgeClass: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20'
        };
    }
  }
}
