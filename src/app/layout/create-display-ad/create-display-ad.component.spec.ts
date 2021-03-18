import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDisplayAdComponent } from './create-display-ad.component';

describe('CreateDisplayAdComponent', () => {
  let component: CreateDisplayAdComponent;
  let fixture: ComponentFixture<CreateDisplayAdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDisplayAdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDisplayAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
