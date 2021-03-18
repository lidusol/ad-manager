import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayBuilderComponent } from './display-builder.component';

describe('DisplayBuilderComponent', () => {
  let component: DisplayBuilderComponent;
  let fixture: ComponentFixture<DisplayBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
