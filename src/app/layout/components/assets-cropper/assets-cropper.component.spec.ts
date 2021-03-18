import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsCropperComponent } from './assets-cropper.component';

describe('AssetsCropperComponent', () => {
  let component: AssetsCropperComponent;
  let fixture: ComponentFixture<AssetsCropperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetsCropperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetsCropperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
