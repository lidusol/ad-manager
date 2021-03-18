import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpNativeUploaderToolComponent } from './cmp-native-uploader-tool.component';

describe('CmpNativeUploaderToolComponent', () => {
  let component: CmpNativeUploaderToolComponent;
  let fixture: ComponentFixture<CmpNativeUploaderToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpNativeUploaderToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpNativeUploaderToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
