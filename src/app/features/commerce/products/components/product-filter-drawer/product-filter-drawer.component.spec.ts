import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFilterDrawerComponent } from './product-filter-drawer.component';

describe('ProductFilterDrawerComponent', () => {
  let component: ProductFilterDrawerComponent;
  let fixture: ComponentFixture<ProductFilterDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFilterDrawerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFilterDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.activeDraftCount()).toBe(0);
  });

  it('should track active draft count correctly', () => {
    component.draftBatch.set('batch-1');
    component.draftStatus.set('AVAILABLE');
    expect(component.activeDraftCount()).toBe(2);

    component.draftMasterProduct.set('master-1');
    expect(component.activeDraftCount()).toBe(3);

    component.resetDraft();
    expect(component.activeDraftCount()).toBe(0);
  });

  it('should emit filterApplied when applying filters and close drawer', () => {
    const emitSpy = jest.spyOn(component.filterApplied, 'emit');

    component.draftBatch.set('batch-1');
    component.draftStatus.set('AVAILABLE');
    component.applyFilters();

    expect(emitSpy).toHaveBeenCalledWith({
      selectedBatch: 'batch-1',
      selectedMasterProduct: null,
      selectedStatus: 'AVAILABLE'
    });
    expect(component.visible()).toBe(false);
  });

  it('should emit filterCleared when clearing all and close drawer', () => {
    const clearSpy = jest.spyOn(component.filterCleared, 'emit');

    component.draftBatch.set('batch-1');
    component.clearAll();

    expect(component.draftBatch()).toBeNull();
    expect(clearSpy).toHaveBeenCalled();
    expect(component.visible()).toBe(false);
  });
});
