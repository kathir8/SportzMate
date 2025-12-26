import { TestBed } from '@angular/core/testing';

import { CreateInviteService } from './create-invite.service';

describe('CreateInviteService', () => {
  let service: CreateInviteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateInviteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
