import { TestBed } from '@angular/core/testing';

import { MaxSpeedService } from './max-speed.service';

describe('MaxSpeedService', () => {
  let service: MaxSpeedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaxSpeedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
