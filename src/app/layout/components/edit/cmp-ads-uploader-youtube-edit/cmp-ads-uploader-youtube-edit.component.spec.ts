import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpAdsUploaderYoutubeEditComponent } from './cmp-ads-uploader-youtube-edit.component';

describe('CmpAdsUploaderYoutubeEditComponent', () => {
  let component: CmpAdsUploaderYoutubeEditComponent;
  let fixture: ComponentFixture<CmpAdsUploaderYoutubeEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpAdsUploaderYoutubeEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpAdsUploaderYoutubeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
