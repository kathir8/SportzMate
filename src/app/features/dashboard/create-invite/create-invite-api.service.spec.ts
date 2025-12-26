import { TestBed } from '@angular/core/testing';

import { CreateInviteApiService } from './create-invite-api.service';

describe('CreateInviteApiService', () => {
  let service: CreateInviteApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateInviteApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
