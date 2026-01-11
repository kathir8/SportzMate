import { TestBed } from '@angular/core/testing';

import { CancelEventApiService } from './cancel-event-api.service';

describe('CancelEventApiService', () => {
  let service: CancelEventApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CancelEventApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
