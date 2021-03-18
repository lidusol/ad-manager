import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpSearchAdsCreatorComponent } from './cmp-search-ads-creator.component';

describe('CmpSearchAdsCreatorComponent', () => {
  let component: CmpSearchAdsCreatorComponent;
  let fixture: ComponentFixture<CmpSearchAdsCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpSearchAdsCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpSearchAdsCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
