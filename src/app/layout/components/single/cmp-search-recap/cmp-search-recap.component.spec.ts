import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpSearchRecapComponent } from './cmp-search-recap.component';

describe('CmpSearchRecapComponent', () => {
  let component: CmpSearchRecapComponent;
  let fixture: ComponentFixture<CmpSearchRecapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpSearchRecapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpSearchRecapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
