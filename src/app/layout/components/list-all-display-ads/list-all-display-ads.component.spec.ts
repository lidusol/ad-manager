import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllDisplayAdsComponent } from './list-all-display-ads.component';

describe('ListAllDisplayAdsComponent', () => {
  let component: ListAllDisplayAdsComponent;
  let fixture: ComponentFixture<ListAllDisplayAdsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAllDisplayAdsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAllDisplayAdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
