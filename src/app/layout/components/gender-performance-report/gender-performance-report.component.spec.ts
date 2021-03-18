import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenderPerformanceReportComponent } from './gender-performance-report.component';

describe('GenderPerformanceReportComponent', () => {
  let component: GenderPerformanceReportComponent;
  let fixture: ComponentFixture<GenderPerformanceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenderPerformanceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenderPerformanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
