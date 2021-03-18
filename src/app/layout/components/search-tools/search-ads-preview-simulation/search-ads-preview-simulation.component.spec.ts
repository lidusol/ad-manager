import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAdsPreviewSimulationComponent } from './search-ads-preview-simulation.component';

describe('SearchAdsPreviewSimulationComponent', () => {
  let component: SearchAdsPreviewSimulationComponent;
  let fixture: ComponentFixture<SearchAdsPreviewSimulationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchAdsPreviewSimulationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAdsPreviewSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
