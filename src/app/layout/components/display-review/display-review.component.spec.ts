import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayReviewComponent } from './display-review.component';

describe('DisplayReviewComponent', () => {
  let component: DisplayReviewComponent;
  let fixture: ComponentFixture<DisplayReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
