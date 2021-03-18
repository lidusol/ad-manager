import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewSummaryAccountComponent } from './overview-summary-account.component';

describe('OverviewSummaryAccountComponent', () => {
  let component: OverviewSummaryAccountComponent;
  let fixture: ComponentFixture<OverviewSummaryAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverviewSummaryAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewSummaryAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
