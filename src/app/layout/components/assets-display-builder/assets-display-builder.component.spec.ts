import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsDisplayBuilderComponent } from './assets-display-builder.component';

describe('AssetsDisplayBuilderComponent', () => {
  let component: AssetsDisplayBuilderComponent;
  let fixture: ComponentFixture<AssetsDisplayBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetsDisplayBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetsDisplayBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
