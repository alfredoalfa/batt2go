import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultawalletPage } from './consultawallet.page';

describe('ConsultawalletPage', () => {
  let component: ConsultawalletPage;
  let fixture: ComponentFixture<ConsultawalletPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultawalletPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultawalletPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
