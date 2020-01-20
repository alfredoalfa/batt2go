import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalFaqPage } from './technical-faq.page';

describe('TechnicalFaqPage', () => {
  let component: TechnicalFaqPage;
  let fixture: ComponentFixture<TechnicalFaqPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechnicalFaqPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnicalFaqPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
