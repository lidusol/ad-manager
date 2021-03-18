import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchReviewComponent } from './search-review.component';

describe('SearchReviewComponent', () => {
  let component: SearchReviewComponent;
  let fixture: ComponentFixture<SearchReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
