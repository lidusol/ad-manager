import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NativeAdsOverviewRecapComponent } from './native-ads-overview-recap.component';

describe('NativeAdsOverviewRecapComponent', () => {
  let component: NativeAdsOverviewRecapComponent;
  let fixture: ComponentFixture<NativeAdsOverviewRecapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NativeAdsOverviewRecapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NativeAdsOverviewRecapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
