import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpNativeAdsCreatorComponent } from './cmp-native-ads-creator.component';

describe('CmpNativeAdsCreatorComponent', () => {
  let component: CmpNativeAdsCreatorComponent;
  let fixture: ComponentFixture<CmpNativeAdsCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpNativeAdsCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpNativeAdsCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
