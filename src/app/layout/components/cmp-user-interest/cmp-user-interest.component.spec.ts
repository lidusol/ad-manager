import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpUserInterestComponent } from './cmp-user-interest.component';

describe('CmpUserInterestComponent', () => {
  let component: CmpUserInterestComponent;
  let fixture: ComponentFixture<CmpUserInterestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpUserInterestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpUserInterestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
