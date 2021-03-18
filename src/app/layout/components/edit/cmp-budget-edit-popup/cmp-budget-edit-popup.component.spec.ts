import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpBudgetEditPopupComponent } from './cmp-budget-edit-popup.component';

describe('CmpBudgetEditPopupComponent', () => {
  let component: CmpBudgetEditPopupComponent;
  let fixture: ComponentFixture<CmpBudgetEditPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpBudgetEditPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpBudgetEditPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
