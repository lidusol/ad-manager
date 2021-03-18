import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpDatesComponent } from './cmp-dates.component';

describe('CmpDatesComponent', () => {
  let component: CmpDatesComponent;
  let fixture: ComponentFixture<CmpDatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpDatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
