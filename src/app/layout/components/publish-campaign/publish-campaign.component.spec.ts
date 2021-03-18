import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishCampaignComponent } from './publish-campaign.component';

describe('PublishCampaignComponent', () => {
  let component: PublishCampaignComponent;
  let fixture: ComponentFixture<PublishCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
