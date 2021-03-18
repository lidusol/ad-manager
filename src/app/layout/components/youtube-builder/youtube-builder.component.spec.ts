import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YoutubeBuilderComponent } from './youtube-builder.component';

describe('YoutubeBuilderComponent', () => {
  let component: YoutubeBuilderComponent;
  let fixture: ComponentFixture<YoutubeBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YoutubeBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YoutubeBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
