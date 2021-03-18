import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewCreatedYoutubeComponent } from './preview-created-youtube.component';

describe('PreviewCreatedYoutubeComponent', () => {
  let component: PreviewCreatedYoutubeComponent;
  let fixture: ComponentFixture<PreviewCreatedYoutubeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewCreatedYoutubeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewCreatedYoutubeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
