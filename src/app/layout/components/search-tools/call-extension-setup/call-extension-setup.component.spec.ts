import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallExtensionSetupComponent } from './call-extension-setup.component';

describe('CallExtensionSetupComponent', () => {
  let component: CallExtensionSetupComponent;
  let fixture: ComponentFixture<CallExtensionSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallExtensionSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallExtensionSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
