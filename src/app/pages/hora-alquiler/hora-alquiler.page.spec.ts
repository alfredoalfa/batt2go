import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoraAlquilerPage } from './hora-alquiler.page';

describe('HoraAlquilerPage', () => {
  let component: HoraAlquilerPage;
  let fixture: ComponentFixture<HoraAlquilerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoraAlquilerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoraAlquilerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
