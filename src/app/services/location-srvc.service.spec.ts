import { TestBed } from '@angular/core/testing';

import { LocationSrvcService } from './location-srvc.service';

describe('LocationSrvcService', () => {
  let service: LocationSrvcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationSrvcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
