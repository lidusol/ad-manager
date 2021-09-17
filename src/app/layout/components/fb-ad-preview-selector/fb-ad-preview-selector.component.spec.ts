import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FbAdPreviewSelectorComponent } from './fb-ad-preview-selector.component';

describe('FbAdPreviewSelectorComponent', () => {
  let component: FbAdPreviewSelectorComponent;
  let fixture: ComponentFixture<FbAdPreviewSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FbAdPreviewSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FbAdPreviewSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
