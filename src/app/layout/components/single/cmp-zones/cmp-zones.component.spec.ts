import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpZonesComponent } from './cmp-zones.component';

describe('CmpZonesComponent', () => {
  let component: CmpZonesComponent;
  let fixture: ComponentFixture<CmpZonesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpZonesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpZonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
