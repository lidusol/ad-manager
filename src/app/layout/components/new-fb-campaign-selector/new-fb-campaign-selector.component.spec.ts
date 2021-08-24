import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFbCampaignSelectorComponent } from './new-fb-campaign-selector.component';

describe('NewFbCampaignSelectorComponent', () => {
  let component: NewFbCampaignSelectorComponent;
  let fixture: ComponentFixture<NewFbCampaignSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewFbCampaignSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewFbCampaignSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
