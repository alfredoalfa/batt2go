import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportPagePage } from './support-page.page';

describe('SupportPagePage', () => {
  let component: SupportPagePage;
  let fixture: ComponentFixture<SupportPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportPagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
