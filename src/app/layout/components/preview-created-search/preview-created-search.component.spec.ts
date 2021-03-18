import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewCreatedSearchComponent } from './preview-created-search.component';

describe('PreviewCreatedSearchComponent', () => {
  let component: PreviewCreatedSearchComponent;
  let fixture: ComponentFixture<PreviewCreatedSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewCreatedSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewCreatedSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
