import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodeSelectorComponent } from './periode-selector.component';

describe('PeriodeSelectorComponent', () => {
  let component: PeriodeSelectorComponent;
  let fixture: ComponentFixture<PeriodeSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeriodeSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
