import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpStatusComponent } from './cmp-status.component';

describe('CmpStatusComponent', () => {
  let component: CmpStatusComponent;
  let fixture: ComponentFixture<CmpStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
