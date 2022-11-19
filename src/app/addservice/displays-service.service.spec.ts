import { TestBed } from '@angular/core/testing';

import { DisplaysServiceService } from './displays-service.service';

describe('DisplaysServiceService', () => {
  let service: DisplaysServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisplaysServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
