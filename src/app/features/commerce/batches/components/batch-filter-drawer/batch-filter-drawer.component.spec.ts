import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchFilterDrawerComponent } from './batch-filter-drawer.component';

describe('BatchFilterDrawerComponent', () => {
  let component: BatchFilterDrawerComponent;
  let fixture: ComponentFixture<BatchFilterDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchFilterDrawerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BatchFilterDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.activeDraftCount()).toBe(0);
  });

  it('should track active draft count', () => {
    component.draftStatus.set('active');
    component.draftFinancialStatus.set('EN_RECUPERACION');
    expect(component.activeDraftCount()).toBe(2);

    component.draftRound.set('round-1');
    expect(component.activeDraftCount()).toBe(3);

    component.resetDraft();
    expect(component.activeDraftCount()).toBe(0);
  });

  it('should emit filterApplied when applying filters', () => {
    const emitSpy = jest.spyOn(component.filterApplied, 'emit');

    component.draftStatus.set('active');
    component.draftFinancialStatus.set('RECUPERADO');
    component.applyFilters();

    expect(emitSpy).toHaveBeenCalledWith({
      selectedStatus: 'active',
      selectedFinancialStatus: 'RECUPERADO',
      selectedRound: null
    });
    expect(component.visible()).toBe(false);
  });

  it('should emit filterCleared when clearing filters', () => {
    const clearSpy = jest.spyOn(component.filterCleared, 'emit');

    component.draftStatus.set('active');
    component.clearFilters();

    expect(component.draftStatus()).toBeNull();
    expect(clearSpy).toHaveBeenCalled();
    expect(component.visible()).toBe(false);
  });
});
