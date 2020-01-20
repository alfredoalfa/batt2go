import { TestBed } from '@angular/core/testing';

import { DbapiService } from './dbapi.service';

describe('DbapiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DbapiService = TestBed.get(DbapiService);
    expect(service).toBeTruthy();
  });
});
