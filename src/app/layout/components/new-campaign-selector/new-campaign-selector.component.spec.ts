import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCampaignSelectorComponent } from './new-campaign-selector.component';

describe('NewCampaignSelectorComponent', () => {
  let component: NewCampaignSelectorComponent;
  let fixture: ComponentFixture<NewCampaignSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCampaignSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCampaignSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
