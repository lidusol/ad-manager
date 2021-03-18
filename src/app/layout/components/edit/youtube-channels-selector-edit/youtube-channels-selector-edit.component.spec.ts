import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YoutubeChannelsSelectorEditComponent } from './youtube-channels-selector-edit.component';

describe('YoutubeChannelsSelectorEditComponent', () => {
  let component: YoutubeChannelsSelectorEditComponent;
  let fixture: ComponentFixture<YoutubeChannelsSelectorEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YoutubeChannelsSelectorEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YoutubeChannelsSelectorEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
