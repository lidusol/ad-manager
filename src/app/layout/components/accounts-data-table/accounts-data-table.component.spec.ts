import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsDataTableComponent } from './accounts-data-table.component';

describe('AccountsDataTableComponent', () => {
  let component: AccountsDataTableComponent;
  let fixture: ComponentFixture<AccountsDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountsDataTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
