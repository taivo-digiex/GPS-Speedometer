import { TestBed } from '@angular/core/testing';

import { TopSpeedService } from './top-speed.service';

describe('TopSpeedService', () => {
  let service: TopSpeedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopSpeedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
