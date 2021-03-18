import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdsPreviewCollectionsComponent } from './ads-preview-collections.component';

describe('AdsPreviewCollectionsComponent', () => {
  let component: AdsPreviewCollectionsComponent;
  let fixture: ComponentFixture<AdsPreviewCollectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdsPreviewCollectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdsPreviewCollectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
