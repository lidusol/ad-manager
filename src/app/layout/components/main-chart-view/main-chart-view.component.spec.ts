import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainChartViewComponent } from './main-chart-view.component';

describe('MainChartViewComponent', () => {
  let component: MainChartViewComponent;
  let fixture: ComponentFixture<MainChartViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainChartViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainChartViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
