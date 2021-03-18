import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpDeviceTargetComponent } from './cmp-device-target.component';

describe('CmpDeviceTargetComponent', () => {
  let component: CmpDeviceTargetComponent;
  let fixture: ComponentFixture<CmpDeviceTargetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpDeviceTargetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpDeviceTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
