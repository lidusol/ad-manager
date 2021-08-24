import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FbAdPlacementsComponent } from './fb-ad-placements.component';

describe('FbAdPlacementsComponent', () => {
  let component: FbAdPlacementsComponent;
  let fixture: ComponentFixture<FbAdPlacementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FbAdPlacementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FbAdPlacementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
