import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserInfoAlertComponent } from './browser-info-alert.component';

describe('BrowserInfoAlertComponent', () => {
  let component: BrowserInfoAlertComponent;
  let fixture: ComponentFixture<BrowserInfoAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowserInfoAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowserInfoAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
