import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpBudgetEditComponent } from './cmp-budget-edit.component';

describe('CmpBudgetEditComponent', () => {
  let component: CmpBudgetEditComponent;
  let fixture: ComponentFixture<CmpBudgetEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpBudgetEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpBudgetEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
