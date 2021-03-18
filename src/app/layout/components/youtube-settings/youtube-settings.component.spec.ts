import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YoutubeSettingsComponent } from './youtube-settings.component';

describe('YoutubeSettingsComponent', () => {
  let component: YoutubeSettingsComponent;
  let fixture: ComponentFixture<YoutubeSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YoutubeSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YoutubeSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
