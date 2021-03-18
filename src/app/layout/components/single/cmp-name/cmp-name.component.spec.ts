import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpNameComponent } from './cmp-name.component';

describe('CmpNameComponent', () => {
  let component: CmpNameComponent;
  let fixture: ComponentFixture<CmpNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
