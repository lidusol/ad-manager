import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgePerformanceReportSingleComponent } from './age-performance-report-single.component';

describe('AgePerformanceReportSingleComponent', () => {
  let component: AgePerformanceReportSingleComponent;
  let fixture: ComponentFixture<AgePerformanceReportSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgePerformanceReportSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgePerformanceReportSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
