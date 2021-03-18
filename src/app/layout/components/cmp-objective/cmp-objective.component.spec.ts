import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpObjectiveComponent } from './cmp-objective.component';

describe('CmpObjectiveComponent', () => {
  let component: CmpObjectiveComponent;
  let fixture: ComponentFixture<CmpObjectiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpObjectiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpObjectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
