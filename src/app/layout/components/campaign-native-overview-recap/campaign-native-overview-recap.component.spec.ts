import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignNativeOverviewRecapComponent } from './campaign-native-overview-recap.component';

describe('CampaignNativeOverviewRecapComponent', () => {
  let component: CampaignNativeOverviewRecapComponent;
  let fixture: ComponentFixture<CampaignNativeOverviewRecapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignNativeOverviewRecapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignNativeOverviewRecapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
