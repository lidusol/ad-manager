import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpAdsUploaderEditComponent } from './cmp-ads-uploader-edit.component';

describe('CmpAdsUploaderEditComponent', () => {
  let component: CmpAdsUploaderEditComponent;
  let fixture: ComponentFixture<CmpAdsUploaderEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpAdsUploaderEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpAdsUploaderEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
