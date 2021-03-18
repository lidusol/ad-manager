import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpPlacementsEditComponent } from './cmp-placements-edit.component';

describe('CmpPlacementsEditComponent', () => {
  let component: CmpPlacementsEditComponent;
  let fixture: ComponentFixture<CmpPlacementsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpPlacementsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpPlacementsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
