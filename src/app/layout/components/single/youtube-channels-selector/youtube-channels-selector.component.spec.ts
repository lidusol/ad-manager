import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YoutubeChannelsSelectorComponent } from './youtube-channels-selector.component';

describe('YoutubeChannelsSelectorComponent', () => {
  let component: YoutubeChannelsSelectorComponent;
  let fixture: ComponentFixture<YoutubeChannelsSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YoutubeChannelsSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YoutubeChannelsSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
