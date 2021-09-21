import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FbCampaignsComponent } from './fb-campaigns.component';

describe('FbCampaignsComponent', () => {
  let component: FbCampaignsComponent;
  let fixture: ComponentFixture<FbCampaignsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FbCampaignsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FbCampaignsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
