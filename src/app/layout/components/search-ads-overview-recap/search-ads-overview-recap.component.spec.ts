import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAdsOverviewRecapComponent } from './search-ads-overview-recap.component';

describe('SearchAdsOverviewRecapComponent', () => {
  let component: SearchAdsOverviewRecapComponent;
  let fixture: ComponentFixture<SearchAdsOverviewRecapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchAdsOverviewRecapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAdsOverviewRecapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
