import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignsMainLayoutComponent } from './campaigns-main-layout.component';

describe('CampaignsMainLayoutComponent', () => {
  let component: CampaignsMainLayoutComponent;
  let fixture: ComponentFixture<CampaignsMainLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignsMainLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignsMainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
