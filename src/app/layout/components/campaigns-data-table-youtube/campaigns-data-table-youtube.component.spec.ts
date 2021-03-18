import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignsDataTableYoutubeComponent } from './campaigns-data-table-youtube.component';

describe('CampaignsDataTableYoutubeComponent', () => {
  let component: CampaignsDataTableYoutubeComponent;
  let fixture: ComponentFixture<CampaignsDataTableYoutubeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignsDataTableYoutubeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignsDataTableYoutubeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
