import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpSchedulesComponent } from './cmp-schedules.component';

describe('CmpSchedulesComponent', () => {
  let component: CmpSchedulesComponent;
  let fixture: ComponentFixture<CmpSchedulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpSchedulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpSchedulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
