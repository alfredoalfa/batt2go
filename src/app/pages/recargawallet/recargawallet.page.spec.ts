import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecargawalletPage } from './recargawallet.page';

describe('RecargawalletPage', () => {
  let component: RecargawalletPage;
  let fixture: ComponentFixture<RecargawalletPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecargawalletPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecargawalletPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
