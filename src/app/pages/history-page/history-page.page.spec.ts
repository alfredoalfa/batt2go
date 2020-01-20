import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryPagePage } from './history-page.page';

describe('HistoryPagePage', () => {
  let component: HistoryPagePage;
  let fixture: ComponentFixture<HistoryPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryPagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
