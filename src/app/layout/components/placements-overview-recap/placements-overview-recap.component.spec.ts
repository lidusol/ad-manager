import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementsOverviewRecapComponent } from './placements-overview-recap.component';

describe('PlacementsOverviewRecapComponent', () => {
  let component: PlacementsOverviewRecapComponent;
  let fixture: ComponentFixture<PlacementsOverviewRecapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlacementsOverviewRecapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacementsOverviewRecapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
