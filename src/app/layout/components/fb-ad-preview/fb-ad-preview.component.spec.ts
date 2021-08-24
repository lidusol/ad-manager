import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FbAdPreviewComponent } from './fb-ad-preview.component';

describe('FbAdPreviewComponent', () => {
  let component: FbAdPreviewComponent;
  let fixture: ComponentFixture<FbAdPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FbAdPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FbAdPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
