import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenderPerformanceReportSingleComponent } from './gender-performance-report-single.component';

describe('GenderPerformanceReportSingleComponent', () => {
  let component: GenderPerformanceReportSingleComponent;
  let fixture: ComponentFixture<GenderPerformanceReportSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenderPerformanceReportSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenderPerformanceReportSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
