import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpDatesEditComponent } from './cmp-dates-edit.component';

describe('CmpDatesEditComponent', () => {
  let component: CmpDatesEditComponent;
  let fixture: ComponentFixture<CmpDatesEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpDatesEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpDatesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
