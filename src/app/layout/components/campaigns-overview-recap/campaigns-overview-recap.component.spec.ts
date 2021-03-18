import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignsOverviewRecapComponent } from './campaigns-overview-recap.component';

describe('CampaignsOverviewRecapComponent', () => {
  let component: CampaignsOverviewRecapComponent;
  let fixture: ComponentFixture<CampaignsOverviewRecapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignsOverviewRecapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignsOverviewRecapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
