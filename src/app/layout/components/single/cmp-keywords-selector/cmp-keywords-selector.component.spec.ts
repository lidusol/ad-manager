import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpKeywordsSelectorComponent } from './cmp-keywords-selector.component';

describe('CmpKeywordsSelectorComponent', () => {
  let component: CmpKeywordsSelectorComponent;
  let fixture: ComponentFixture<CmpKeywordsSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpKeywordsSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpKeywordsSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
