import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectLinkedAccountComponent } from './select-linked-account.component';

describe('SelectLinkedAccountComponent', () => {
  let component: SelectLinkedAccountComponent;
  let fixture: ComponentFixture<SelectLinkedAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectLinkedAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectLinkedAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
