import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NativeAdsPreviewCollectionsComponent } from './native-ads-preview-collections.component';

describe('NativeAdsPreviewCollectionsComponent', () => {
  let component: NativeAdsPreviewCollectionsComponent;
  let fixture: ComponentFixture<NativeAdsPreviewCollectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NativeAdsPreviewCollectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NativeAdsPreviewCollectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
