import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpNameEditComponent } from './cmp-name-edit.component';

describe('CmpNameEditComponent', () => {
  let component: CmpNameEditComponent;
  let fixture: ComponentFixture<CmpNameEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpNameEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpNameEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
