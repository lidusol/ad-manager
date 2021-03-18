import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpDisplayRecapComponent } from './cmp-display-recap.component';

describe('CmpDisplayRecapComponent', () => {
  let component: CmpDisplayRecapComponent;
  let fixture: ComponentFixture<CmpDisplayRecapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpDisplayRecapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpDisplayRecapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
