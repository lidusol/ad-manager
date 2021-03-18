import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpLandingPageComponent } from './cmp-landing-page.component';

describe('CmpLandingPageComponent', () => {
  let component: CmpLandingPageComponent;
  let fixture: ComponentFixture<CmpLandingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpLandingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
