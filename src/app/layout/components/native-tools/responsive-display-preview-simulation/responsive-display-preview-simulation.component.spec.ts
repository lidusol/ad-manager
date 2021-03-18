import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsiveDisplayPreviewSimulationComponent } from './responsive-display-preview-simulation.component';

describe('ResponsiveDisplayPreviewSimulationComponent', () => {
  let component: ResponsiveDisplayPreviewSimulationComponent;
  let fixture: ComponentFixture<ResponsiveDisplayPreviewSimulationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponsiveDisplayPreviewSimulationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsiveDisplayPreviewSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
