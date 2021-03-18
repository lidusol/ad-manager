import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpBidsComponent } from './cmp-bids.component';

describe('CmpBidsComponent', () => {
  let component: CmpBidsComponent;
  let fixture: ComponentFixture<CmpBidsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpBidsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpBidsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
