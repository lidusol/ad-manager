import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpPackChooserComponent } from './cmp-pack-chooser.component';

describe('CmpPackChooserComponent', () => {
  let component: CmpPackChooserComponent;
  let fixture: ComponentFixture<CmpPackChooserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpPackChooserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpPackChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
