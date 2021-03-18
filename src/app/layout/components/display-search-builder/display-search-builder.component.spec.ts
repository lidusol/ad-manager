import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaySearchBuilderComponent } from './display-search-builder.component';

describe('DisplaySearchBuilderComponent', () => {
  let component: DisplaySearchBuilderComponent;
  let fixture: ComponentFixture<DisplaySearchBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplaySearchBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplaySearchBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
