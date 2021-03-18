import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdOverviewRecapComponent } from './ad-overview-recap.component';

describe('AdOverviewRecapComponent', () => {
  let component: AdOverviewRecapComponent;
  let fixture: ComponentFixture<AdOverviewRecapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdOverviewRecapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdOverviewRecapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
