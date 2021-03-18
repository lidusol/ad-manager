import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastAdafriComponent } from './toast.component';

describe('ToastAdafriComponent', () => {
  let component: ToastAdafriComponent;
  let fixture: ComponentFixture<ToastAdafriComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToastAdafriComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToastAdafriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
