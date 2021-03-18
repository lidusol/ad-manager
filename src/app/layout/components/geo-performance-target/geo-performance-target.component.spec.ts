import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoPerformanceTargetComponent } from './geo-performance-target.component';

describe('GeoPerformanceTargetComponent', () => {
  let component: GeoPerformanceTargetComponent;
  let fixture: ComponentFixture<GeoPerformanceTargetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeoPerformanceTargetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeoPerformanceTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
