import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpLandingPageEditComponent } from './cmp-landing-page-edit.component';

describe('CmpLandingPageEditComponent', () => {
  let component: CmpLandingPageEditComponent;
  let fixture: ComponentFixture<CmpLandingPageEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpLandingPageEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpLandingPageEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
