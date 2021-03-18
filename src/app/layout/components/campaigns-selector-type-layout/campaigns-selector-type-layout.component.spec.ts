import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignsSelectorTypeLayoutComponent } from './campaigns-selector-type-layout.component';

describe('CampaignsSelectorTypeLayoutComponent', () => {
  let component: CampaignsSelectorTypeLayoutComponent;
  let fixture: ComponentFixture<CampaignsSelectorTypeLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignsSelectorTypeLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignsSelectorTypeLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
