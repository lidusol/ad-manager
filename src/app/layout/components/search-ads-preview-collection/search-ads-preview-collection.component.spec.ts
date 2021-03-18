import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAdsPreviewCollectionComponent } from './search-ads-preview-collection.component';

describe('SearchAdsPreviewCollectionComponent', () => {
  let component: SearchAdsPreviewCollectionComponent;
  let fixture: ComponentFixture<SearchAdsPreviewCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchAdsPreviewCollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAdsPreviewCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
