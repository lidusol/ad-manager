import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CropperRectangleDialogComponent } from './cropper-rectangle-dialog.component';

describe('CropperRectangleDialogComponent', () => {
  let component: CropperRectangleDialogComponent;
  let fixture: ComponentFixture<CropperRectangleDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CropperRectangleDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CropperRectangleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
