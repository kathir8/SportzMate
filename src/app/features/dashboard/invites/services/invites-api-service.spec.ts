import { TestBed } from '@angular/core/testing';

import { InvitesApiService } from './invites-api-service';

describe('InvitesApiService', () => {
  let service: InvitesApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvitesApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
