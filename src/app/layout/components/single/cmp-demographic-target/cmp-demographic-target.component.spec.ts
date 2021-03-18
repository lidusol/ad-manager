import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpDemographicTargetComponent } from './cmp-demographic-target.component';

describe('CmpDemographicTargetComponent', () => {
  let component: CmpDemographicTargetComponent;
  let fixture: ComponentFixture<CmpDemographicTargetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpDemographicTargetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpDemographicTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
