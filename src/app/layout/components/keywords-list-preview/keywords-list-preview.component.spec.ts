import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeywordsListPreviewComponent } from './keywords-list-preview.component';

describe('KeywordsListPreviewComponent', () => {
  let component: KeywordsListPreviewComponent;
  let fixture: ComponentFixture<KeywordsListPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeywordsListPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeywordsListPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
