import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpYoutubeRecapComponent } from './cmp-youtube-recap.component';

describe('CmpYoutubeRecapComponent', () => {
  let component: CmpYoutubeRecapComponent;
  let fixture: ComponentFixture<CmpYoutubeRecapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpYoutubeRecapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpYoutubeRecapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
