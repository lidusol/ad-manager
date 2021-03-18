import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpDemographicTargetEditComponent } from './cmp-demographic-target-edit.component';

describe('CmpDemographicTargetEditComponent', () => {
  let component: CmpDemographicTargetEditComponent;
  let fixture: ComponentFixture<CmpDemographicTargetEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpDemographicTargetEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpDemographicTargetEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
