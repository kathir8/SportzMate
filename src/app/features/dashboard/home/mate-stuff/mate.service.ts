import { Injectable, signal } from '@angular/core';
import { AcceptReject } from '../../requests/models/requests.model';

@Injectable({
  providedIn: 'root'
})
export class MateService {
  readonly currentMateStatusForEvent = signal<AcceptReject | null>(null);
}
