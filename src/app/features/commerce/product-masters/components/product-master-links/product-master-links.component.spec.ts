import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationService, MessageService } from 'primeng/api';
import { of } from 'rxjs';

import { LoggerService } from '@core/services/logger.service';

import { ProductMasterExternalLink } from '../../models/product-master.model';
import { ProductMasterService } from '../../services/product-master.service';
import { ProductMasterLinksComponent } from './product-master-links.component';

describe('ProductMasterLinksComponent', () => {
  let component: ProductMasterLinksComponent;
  let componentRef: ComponentRef<ProductMasterLinksComponent>;
  let fixture: ComponentFixture<ProductMasterLinksComponent>;
  let productMasterService: jest.Mocked<ProductMasterService>;
  let confirmationService: ConfirmationService;
  let messageService: MessageService;

  const mockLogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  };

  const sampleLink: ProductMasterExternalLink = {
    id: 'link-1',
    product_master_id: 'master-1',
    url: 'https://www.facebook.com/marketplace/item/112233/',
    portal: 'FACEBOOK',
    link_type: 'MARKETPLACE',
    label: 'Marketplace Liz',
    is_primary: true,
    is_public: true,
    sort_order: 1,
    created_at: '2026-11-14T00:00:00Z',
    updated_at: '2026-11-14T00:00:00Z'
  };

  beforeEach(async () => {
    const serviceMock = {
      addExternalLink: jest.fn(),
      updateExternalLink: jest.fn(),
      setPrimaryExternalLink: jest.fn(),
      deleteExternalLink: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ProductMasterLinksComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ConfirmationService,
        MessageService,
        { provide: ProductMasterService, useValue: serviceMock },
        { provide: LoggerService, useValue: mockLogger }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductMasterLinksComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    productMasterService = TestBed.inject(ProductMasterService) as unknown as jest.Mocked<ProductMasterService>;
    confirmationService = TestBed.inject(ConfirmationService);
    messageService = TestBed.inject(MessageService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Portal badge configuration', () => {
    it('should return correct badge for FACEBOOK', () => {
      const info = component.getPortalInfo('FACEBOOK');
      expect(info.name).toBe('Facebook');
      expect(info.badgeClass).toContain('text-blue-600');
    });

    it('should return correct badge for AMAZON', () => {
      const info = component.getPortalInfo('AMAZON');
      expect(info.name).toBe('Amazon');
      expect(info.badgeClass).toContain('text-amber-700');
    });

    it('should return fallback badge for unknown portal', () => {
      const info = component.getPortalInfo('CUSTOM_SITE');
      expect(info.name).toBe('CUSTOM_SITE');
      expect(info.badgeClass).toContain('text-gray-600');
    });
  });

  describe('addLink', () => {
    it('should show warning if masterId is missing', () => {
      jest.spyOn(messageService, 'add');
      componentRef.setInput('masterId', null);
      component.newUrl.set('https://amazon.es/item');

      component.addLink();

      expect(messageService.add).toHaveBeenCalledWith(
        expect.objectContaining({ severity: 'warn', summary: 'Ficha No Guardada' })
      );
      expect(productMasterService.addExternalLink).not.toHaveBeenCalled();
    });

    it('should add a new link successfully and update state', () => {
      componentRef.setInput('masterId', 'master-1');
      componentRef.setInput('linkType', 'MARKETPLACE');
      component.newUrl.set('https://www.facebook.com/marketplace/item/112233/');
      component.newLabel.set('Marketplace Liz');

      productMasterService.addExternalLink.mockReturnValue(of(sampleLink));

      component.addLink();

      expect(productMasterService.addExternalLink).toHaveBeenCalledWith('master-1', {
        url: 'https://www.facebook.com/marketplace/item/112233/',
        link_type: 'MARKETPLACE',
        label: 'Marketplace Liz',
        is_public: true
      });
      expect(component.links()).toContainEqual(sampleLink);
      expect(component.newUrl()).toBe('');
      expect(component.newLabel()).toBe('');
    });
  });

  describe('setAsPrimary', () => {
    it('should set an existing link as primary', () => {
      componentRef.setInput('masterId', 'master-1');
      const nonPrimaryLink: ProductMasterExternalLink = {
        ...sampleLink,
        id: 'link-2',
        is_primary: false
      };
      component.links.set([sampleLink, nonPrimaryLink]);

      productMasterService.setPrimaryExternalLink.mockReturnValue(
        of({ ...nonPrimaryLink, is_primary: true })
      );

      component.setAsPrimary(nonPrimaryLink);

      expect(productMasterService.setPrimaryExternalLink).toHaveBeenCalledWith('master-1', 'link-2');
      const updated = component.links().find(l => l.id === 'link-2');
      expect(updated?.is_primary).toBe(true);
      const previous = component.links().find(l => l.id === 'link-1');
      expect(previous?.is_primary).toBe(false);
    });
  });

  describe('togglePublicVisibility', () => {
    it('should toggle is_public from true to false', () => {
      componentRef.setInput('masterId', 'master-1');
      component.links.set([sampleLink]);

      productMasterService.updateExternalLink.mockReturnValue(
        of({ ...sampleLink, is_public: false })
      );

      component.togglePublicVisibility(sampleLink);

      expect(productMasterService.updateExternalLink).toHaveBeenCalledWith('master-1', 'link-1', {
        is_public: false
      });
      expect(component.links()[0].is_public).toBe(false);
    });
  });

  describe('confirmDelete', () => {
    it('should delete a link when confirmed', () => {
      componentRef.setInput('masterId', 'master-1');
      component.links.set([sampleLink]);

      jest.spyOn(confirmationService, 'confirm').mockImplementation(opts => {
        if (opts.accept) {
          opts.accept();
        }
        return confirmationService;
      });

      productMasterService.deleteExternalLink.mockReturnValue(
        of({ message: 'Enlace eliminado exitosamente' })
      );

      component.confirmDelete(sampleLink);

      expect(productMasterService.deleteExternalLink).toHaveBeenCalledWith('master-1', 'link-1');
      expect(component.links()).toEqual([]);
    });
  });

  describe('copyUrl', () => {
    it('should write URL to clipboard and update copiedLinkId', async () => {
      const writeTextMock = jest.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock
        }
      });

      component.copyUrl('https://amazon.com', 'link-1');

      expect(writeTextMock).toHaveBeenCalledWith('https://amazon.com');
      await Promise.resolve();
      expect(component.copiedLinkId()).toBe('link-1');
    });
  });
});
