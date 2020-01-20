import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoStripePage } from './pago-stripe.page';

describe('PagoStripePage', () => {
  let component: PagoStripePage;
  let fixture: ComponentFixture<PagoStripePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagoStripePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoStripePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
