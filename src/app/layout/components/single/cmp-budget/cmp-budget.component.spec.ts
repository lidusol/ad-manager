import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpBudgetComponent } from './cmp-budget.component';

describe('CmpBudgetComponent', () => {
  let component: CmpBudgetComponent;
  let fixture: ComponentFixture<CmpBudgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpBudgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
