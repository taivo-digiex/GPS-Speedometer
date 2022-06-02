import { TestBed } from '@angular/core/testing';

import { HereMapService } from './here-map.service';

describe('HereMapService', () => {
  let service: HereMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HereMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
