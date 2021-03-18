import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartReviewComponent } from './chart-review.component';

describe('ChartReviewComponent', () => {
  let component: ChartReviewComponent;
  let fixture: ComponentFixture<ChartReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
