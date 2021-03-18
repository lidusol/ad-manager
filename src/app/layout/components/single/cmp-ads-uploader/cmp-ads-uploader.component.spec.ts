import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpAdsUploaderComponent } from './cmp-ads-uploader.component';

describe('CmpAdsUploaderComponent', () => {
  let component: CmpAdsUploaderComponent;
  let fixture: ComponentFixture<CmpAdsUploaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpAdsUploaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpAdsUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
