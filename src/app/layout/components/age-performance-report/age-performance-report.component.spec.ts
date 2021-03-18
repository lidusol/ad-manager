import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgePerformanceReportComponent } from './age-performance-report.component';

describe('AgePerformanceReportComponent', () => {
  let component: AgePerformanceReportComponent;
  let fixture: ComponentFixture<AgePerformanceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgePerformanceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgePerformanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
