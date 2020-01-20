import { TestBed } from '@angular/core/testing';

import { EmailserviceService } from './emailservice.service';

describe('EmailserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EmailserviceService = TestBed.get(EmailserviceService);
    expect(service).toBeTruthy();
  });
});
