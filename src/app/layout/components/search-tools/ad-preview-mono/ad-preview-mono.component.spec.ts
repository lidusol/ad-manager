import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdPreviewMonoComponent } from './ad-preview-mono.component';

describe('AdPreviewMonoComponent', () => {
  let component: AdPreviewMonoComponent;
  let fixture: ComponentFixture<AdPreviewMonoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdPreviewMonoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdPreviewMonoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
