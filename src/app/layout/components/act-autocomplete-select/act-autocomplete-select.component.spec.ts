import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActAutocompleteSelectComponent } from './act-autocomplete-select.component';

describe('ActAutocompleteSelectComponent', () => {
  let component: ActAutocompleteSelectComponent;
  let fixture: ComponentFixture<ActAutocompleteSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActAutocompleteSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActAutocompleteSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
