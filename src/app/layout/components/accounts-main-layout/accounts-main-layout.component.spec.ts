import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsMainLayoutComponent } from './accounts-main-layout.component';

describe('AccountsMainLayoutComponent', () => {
  let component: AccountsMainLayoutComponent;
  let fixture: ComponentFixture<AccountsMainLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountsMainLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsMainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
