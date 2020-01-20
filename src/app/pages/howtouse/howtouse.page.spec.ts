import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HowtousePage } from './howtouse.page';

describe('HowtousePage', () => {
  let component: HowtousePage;
  let fixture: ComponentFixture<HowtousePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HowtousePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HowtousePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
