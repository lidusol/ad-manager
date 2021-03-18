import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewCreatedDisplayComponent } from './preview-created-display.component';

describe('PreviewCreatedDisplayComponent', () => {
  let component: PreviewCreatedDisplayComponent;
  let fixture: ComponentFixture<PreviewCreatedDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewCreatedDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewCreatedDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
