import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoPerformanceReportSingleComponent } from './geo-performance-report-single.component';

describe('GeoPerformanceReportSingleComponent', () => {
  let component: GeoPerformanceReportSingleComponent;
  let fixture: ComponentFixture<GeoPerformanceReportSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeoPerformanceReportSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeoPerformanceReportSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
