import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpAdsUploaderYoutubeComponent } from './cmp-ads-uploader-youtube.component';

describe('CmpAdsUploaderYoutubeComponent', () => {
  let component: CmpAdsUploaderYoutubeComponent;
  let fixture: ComponentFixture<CmpAdsUploaderYoutubeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpAdsUploaderYoutubeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpAdsUploaderYoutubeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
