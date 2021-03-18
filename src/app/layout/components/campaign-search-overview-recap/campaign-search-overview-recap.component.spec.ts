import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignSearchOverviewRecapComponent } from './campaign-search-overview-recap.component';

describe('CampaignSearchOverviewRecapComponent', () => {
  let component: CampaignSearchOverviewRecapComponent;
  let fixture: ComponentFixture<CampaignSearchOverviewRecapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignSearchOverviewRecapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignSearchOverviewRecapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
