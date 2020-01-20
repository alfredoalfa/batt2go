import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendmailPage } from './sendmail.page';

describe('SendmailPage', () => {
  let component: SendmailPage;
  let fixture: ComponentFixture<SendmailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendmailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendmailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
