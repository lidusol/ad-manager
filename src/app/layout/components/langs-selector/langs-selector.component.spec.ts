import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LangsSelectorComponent } from './langs-selector.component';

describe('LangsSelectorComponent', () => {
  let component: LangsSelectorComponent;
  let fixture: ComponentFixture<LangsSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LangsSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LangsSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
