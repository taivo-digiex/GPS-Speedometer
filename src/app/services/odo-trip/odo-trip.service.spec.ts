import { TestBed } from '@angular/core/testing';

import { OdoTripService } from './odo-trip.service';

describe('OdoTripService', () => {
  let service: OdoTripService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OdoTripService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
