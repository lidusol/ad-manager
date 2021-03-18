import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdsErrorViewComponent } from './ads-error-view.component';

describe('AdsErrorViewComponent', () => {
  let component: AdsErrorViewComponent;
  let fixture: ComponentFixture<AdsErrorViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdsErrorViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdsErrorViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
