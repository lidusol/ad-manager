import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthActionSettingsComponent } from './auth-action-settings.component';

describe('AuthActionSettingsComponent', () => {
  let component: AuthActionSettingsComponent;
  let fixture: ComponentFixture<AuthActionSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthActionSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthActionSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
