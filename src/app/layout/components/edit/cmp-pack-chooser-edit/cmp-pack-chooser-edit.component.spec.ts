import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpPackChooserEditComponent } from './cmp-pack-chooser-edit.component';

describe('CmpPackChooserEditComponent', () => {
  let component: CmpPackChooserEditComponent;
  let fixture: ComponentFixture<CmpPackChooserEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpPackChooserEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpPackChooserEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
