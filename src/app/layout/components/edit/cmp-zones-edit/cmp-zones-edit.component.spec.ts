import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpZonesEditComponent } from './cmp-zones-edit.component';

describe('CmpZonesEditComponent', () => {
  let component: CmpZonesEditComponent;
  let fixture: ComponentFixture<CmpZonesEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpZonesEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpZonesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
