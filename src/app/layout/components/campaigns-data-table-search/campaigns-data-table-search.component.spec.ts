import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignsDataTableSearchComponent } from './campaigns-data-table-search.component';

describe('CampaignsDataTableSearchComponent', () => {
  let component: CampaignsDataTableSearchComponent;
  let fixture: ComponentFixture<CampaignsDataTableSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignsDataTableSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignsDataTableSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
