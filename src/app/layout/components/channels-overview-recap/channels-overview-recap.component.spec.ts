import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelsOverviewRecapComponent } from './channels-overview-recap.component';

describe('ChannelsOverviewRecapComponent', () => {
  let component: ChannelsOverviewRecapComponent;
  let fixture: ComponentFixture<ChannelsOverviewRecapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelsOverviewRecapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelsOverviewRecapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
