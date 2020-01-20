import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatecreditcardsPage } from './updatecreditcards.page';

describe('UpdatecreditcardsPage', () => {
  let component: UpdatecreditcardsPage;
  let fixture: ComponentFixture<UpdatecreditcardsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatecreditcardsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatecreditcardsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
