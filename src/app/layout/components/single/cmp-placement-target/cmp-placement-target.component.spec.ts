import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpPlacementTargetComponent } from './cmp-placement-target.component';

describe('CmpPlacementTargetComponent', () => {
  let component: CmpPlacementTargetComponent;
  let fixture: ComponentFixture<CmpPlacementTargetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpPlacementTargetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpPlacementTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
