import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpChannelsComponent } from './cmp-channels.component';

describe('CmpChannelsComponent', () => {
  let component: CmpChannelsComponent;
  let fixture: ComponentFixture<CmpChannelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpChannelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpChannelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
