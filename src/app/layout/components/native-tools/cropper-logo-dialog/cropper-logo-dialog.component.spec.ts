import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CropperLogoDialogComponent } from './cropper-logo-dialog.component';

describe('CropperLogoDialogComponent', () => {
  let component: CropperLogoDialogComponent;
  let fixture: ComponentFixture<CropperLogoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CropperLogoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CropperLogoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
