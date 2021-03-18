import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpSchedulesEditComponent } from './cmp-schedules-edit.component';

describe('CmpSchedulesEditComponent', () => {
  let component: CmpSchedulesEditComponent;
  let fixture: ComponentFixture<CmpSchedulesEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpSchedulesEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpSchedulesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
