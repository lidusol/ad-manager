import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpBidsEditComponent } from './cmp-bids-edit.component';

describe('CmpBidsEditComponent', () => {
  let component: CmpBidsEditComponent;
  let fixture: ComponentFixture<CmpBidsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpBidsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpBidsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
