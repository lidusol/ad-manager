import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YoutubeReviewComponent } from './youtube-review.component';

describe('YoutubeReviewComponent', () => {
  let component: YoutubeReviewComponent;
  let fixture: ComponentFixture<YoutubeReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YoutubeReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YoutubeReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
