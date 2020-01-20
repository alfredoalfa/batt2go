import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiopassPage } from './cambiopass.page';

describe('CambiopassPage', () => {
  let component: CambiopassPage;
  let fixture: ComponentFixture<CambiopassPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CambiopassPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CambiopassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
